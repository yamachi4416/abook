using System.Data;
using System.Linq;
using System.Text;
using Microsoft.VisualBasic.FileIO;

namespace AbookApi.Tests.Helpers
{
    public static class CsvImportHelper
    {
        public static DataSet Load(string name, string[] tableNames, Encoding encoding = null)
        {
            var dataSet = new DataSet(name);

            dataSet.Tables.AddRange(tableNames
                .Select(tableName => Load(tableName, encoding))
                .ToArray());

            return dataSet;
        }

        public static DataTable Load(string name, Encoding encoding = null)
        {
            var csvPath = PathHelper.GetResourcePath(name, ".csv");

            using (var parser = new TextFieldParser(csvPath, encoding))
            {
                parser.SetDelimiters(",");
                parser.HasFieldsEnclosedInQuotes = true;

                var table = new DataTable(name.Split(".").Last());

                table.Columns.AddRange(parser.ReadFields()
                    .Select(m => new DataColumn(m, typeof(string))).ToArray());

                while (!parser.EndOfData)
                {
                    table.Rows.Add(parser.ReadFields());
                }

                return table;
            }
        }
    }
}
