using System.Collections.Generic;
using System.Data;
using System.Linq;
using AbookApi.Tests.Helpers;

namespace AbookApi.Tests.Resources
{
    public static class TestCaseExcel
    {
        private static readonly DataSet _data;

        private static readonly DataSet _database;

        public static DataSet Data => _data.Copy();

        public static IEnumerable<DataTable> Database =>
            Enumerable.Range(0, _database.Tables.Count).Select(i => _database.Tables[i].Copy());

        static TestCaseExcel()
        {
            _data = ExcelHelper.Load("TestCase.xlsx");
            _database = new DataSet("database");
            _database.Tables.AddRange(
                new[] { "abook", "m_user", "abook_member", "account", "journal" }
                    .Select(name => _data.Tables[name].Copy())
                    .ToArray()
            );
        }
    }
}
