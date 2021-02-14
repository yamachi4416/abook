using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace AbookApi.Tests.Helpers
{
    public static class SqlRawHelper
    {

        public static async Task<int> ImportDataTableAsync(
            DbConnection con, DataTable table
        )
        {
            var colNames = Enumerable.Range(0, table.Columns.Count)
                .Select(i => table.Columns[i].ColumnName)
                .ToImmutableArray();

            var rows = Enumerable.Range(0, table.Rows.Count)
                .Select(i => colNames
                    .Select(colName => (Name: $"@{colName}_{i}", Value: table.Rows[i][colName]))
                    .ToImmutableArray())
                .ToImmutableArray();

            var columns = string.Join(",", colNames);

            var values = string.Join(",", rows
                .Select(r => string.Join(",", r.Select(c => c.Name)))
                .Select(r => $"({r})"));

            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = $"insert into {table.TableName}({columns}) values {values}";

                cmd.Parameters.AddRange(rows
                    .SelectMany(xs => xs)
                    .Select(p =>
                    {
                        var param = cmd.CreateParameter();
                        param.ParameterName = p.Name;
                        param.Value = p.Value;
                        return param;
                    }).ToArray());

                return await cmd.ExecuteNonQueryAsync();
            }
        }

        public static async Task<int> ExecuteSqlAsync(
            DbConnection con, string rawSql, IDictionary<string, object> param
        )
        {
            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = rawSql;
                cmd.Parameters.AddRange(ToParameter(cmd, param).ToArray());
                return await cmd.ExecuteNonQueryAsync();
            }
        }

        public static async Task<int> ExecuteSqlAsync(
            DbConnection con, string rawSql, object param = null
        )
        {
            return await ExecuteSqlAsync(con, rawSql, ToDictionary(param));
        }

        public static async Task<IEnumerable<T>> ExecuteReaderAsync<T>(
            DbConnection con, string rawSql, Func<DbDataReader, T> converter,
            IDictionary<string, object> param)
        {
            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = rawSql;
                cmd.Parameters.AddRange(ToParameter(cmd, param).ToArray());
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (reader.HasRows)
                    {
                        var result = new List<T>();
                        await foreach (var row in ReadRows<T>(reader, converter))
                        {
                            result.Add(row);
                        }
                        return result;
                    }
                }
            }

            return Enumerable.Empty<T>();
        }

        public static async Task<IEnumerable<T>> ExecuteReaderAsync<T>(
            DbConnection con, string rawSql, Func<DbDataReader, T> converter,
            object param = null)
        {
            return await ExecuteReaderAsync(con, rawSql, converter, ToDictionary(param));
        }

        private static IDictionary<string, object> ToDictionary(object param)
        {
            var dict = new Dictionary<string, object>();

            if (param == null)
            {
                return dict;
            }

            foreach (var p in param.GetType().GetRuntimeFields().Where(p => p.IsPublic))
            {
                dict.Add(p.Name, p.GetValue(param));
            }

            foreach (var p in param.GetType().GetRuntimeProperties().Where(p => p.CanRead))
            {
                dict.Add(p.Name, p.GetValue(param));
            }

            return dict;
        }

        private static IEnumerable<DbParameter> ToParameter(
            DbCommand cmd,
            IDictionary<string, object> param)
        {
            if (param == null)
            {
                yield break;
            }

            foreach (var (key, val) in param)
            {
                var cmdParam = cmd.CreateParameter();
                cmdParam.ParameterName = key;
                cmdParam.Value = val != null ? val : DBNull.Value;
                yield return cmdParam;
            }
        }

        private static async IAsyncEnumerable<T> ReadRows<T>(
            DbDataReader reader, Func<DbDataReader, T> converter)
        {
            while (await reader.ReadAsync())
            {
                yield return converter(reader);
            }
        }
    }
}
