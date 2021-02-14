using System.Collections.Immutable;
using System.Data;
using System.IO;
using System.Linq;
using ClosedXML.Excel;

namespace AbookApi.Tests.Helpers
{
    public static class ExcelHelper
    {
        public static DataSet Load(string name, string ext = null, bool emptyToNull = true)
        {
            if (string.IsNullOrEmpty(ext))
            {
                ext = Path.GetExtension(name);
                name = name.Remove(name.Length - ext.Length);
            }

            var dataset = new DataSet(name);

            using (var book = new XLWorkbook(PathHelper.GetResourcePath(name, ext)))
            {
                var catalog = book.Table("catalog").AsNativeDataTable();

                foreach (var table in catalog.AsEnumerable()
                    .Select(m => book.Table(m.Field<string>("Name"))?.AsNativeDataTable())
                    .Where(m => m != null))
                {
                    if (emptyToNull)
                    {
                        ConvertEmptyToNull(table);
                    }

                    dataset.Tables.Add(table);
                }
            }

            return dataset;
        }

        private static void ConvertEmptyToNull(DataTable table)
        {
            var strTypeColNames = Enumerable.Range(0, table.Columns.Count)
                .Select(m => table.Columns[m])
                .Where(m => m.DataType == typeof(string))
                .Select(m => m.ColumnName)
                .ToImmutableArray();

            foreach (var row in table.AsEnumerable())
            {
                foreach (var colName in strTypeColNames)
                {
                    if (string.IsNullOrEmpty(row.Field<string>(colName)))
                    {
                        row.SetField<string>(colName, null);
                    }
                }
            }
        }
    }
}
