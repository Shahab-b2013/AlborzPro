// Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.2.0.0
// Release Ferdos.BPMS
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Web.Services;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class DashboardReport : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public string GetDesign()
    {
        string designJson = null;
        designJson = "{";
        designJson += "\"RefRoles\":[" + GetJsonRoles() + "],";
        designJson += "\"RefGroups\":[" + GetJsonGroups() + "],";
        designJson += "\"RefColumns\":[" + GetJsonColumns() + "],";
        designJson += "\"RefDatasets\":[" + GetJsonDatasets() + "]";
        designJson += "}";
        //JavaScriptSerializer js = new JavaScriptSerializer();
        //designJson = js.Serialize(designJson);
        return designJson;
    }

    private static string GetJsonRoles()
    {
        string jsonRoles = null;

        using (var connection = SqlDataProvider.DbConnection)
        {
            connection.Open();
            string query = "SELECT UserRoleID AS Id, Label FROM Sys_UserRoles";

            using (var command = new SqlCommand(query, connection))
            {
                using (var reader = command.ExecuteReader())
                {
                    DataTable dataTable = new DataTable();
                    dataTable.Load(reader);
                    jsonRoles = DataTableToJson(dataTable);
                }
            }
        }

        return jsonRoles;
    }

    private static string GetJsonGroups()
    {
        string jsonGroups = null;

        using (var connection = SqlDataProvider.DbConnection)
        {
            connection.Open();
            string query = "SELECT UserGroupID AS Id, Label FROM Sys_UserGroups";

            using (var command = new SqlCommand(query, connection))
            {
                using (var reader = command.ExecuteReader())
                {
                    DataTable dataTable = new DataTable();
                    dataTable.Load(reader);
                    jsonGroups = DataTableToJson(dataTable);
                }
            }
        }

        return jsonGroups;
    }

    private static string DataTableToJson(DataTable table)
    {
        var jsonString = "";

        for (int i = 0; i < table.Rows.Count; i++)
        {
            jsonString += "{";
            for (int j = 0; j < table.Columns.Count; j++)
            {
                jsonString += "\"" + table.Columns[j].ColumnName + "\":";
                jsonString += "\"" + table.Rows[i][j].ToString() + "\"";
                if (j < table.Columns.Count - 1)
                {
                    jsonString += ",";
                }
            }
            jsonString += "}";
            if (i < table.Rows.Count - 1)
            {
                jsonString += ",";
            }
        }

        return jsonString;
    }

    private static string GetJsonColumns()
    {
        string RefdataJson = null;
        RefdataJson = GetColumns("SELECT[Sys_Rpt_DatasetDesigns].[ElementID],[Sys_Rpt_DatasetDesigns].[Type],[Sys_Rpt_DatasetDesigns].[TextExpression],[Sys_Rpt_DatasetDesigns].[ColumnPosition],[Sys_Rpt_DatasetDesigns].[Enabled],[Sys_Rpt_DatasetDesigns].[Version],[Sys_Rpt_DatasetDesigns].[Description],[Sys_Rpt_DatasetDesigns].[DatasetID],[Sys_Rpt_Datasets].[QueryType],[Sys_Rpt_Datasets].[ELabel] AS DatasetName,[Sys_Rpt_DatasetDesigns].[Label],[Sys_Rpt_DatasetDesigns].[Name]  FROM[dbo].[Sys_Rpt_DatasetDesigns] INNER JOIN[dbo].[Sys_Rpt_Datasets] ON[Sys_Rpt_DatasetDesigns].DatasetID = [Sys_Rpt_Datasets].DatasetID");
        RefdataJson = RefdataJson.Remove(RefdataJson.Length - 1, 1);
        RefdataJson = RefdataJson.Remove(0, 1);
        return RefdataJson;
    }

    private static string GetJsonDatasets()
    {
        var designJson = GetDataset("SELECT [DatasetID],[ELabel],[Label],[QueryText],[QueryType],[Enabled],[Description] FROM [dbo].[Sys_Rpt_Datasets]");
        designJson = designJson.Remove(designJson.Length - 1, 1);
        designJson = designJson.Remove(0, 1);
        return designJson;
    }

    private static string GetDataset(string query)
    {
        List<Dataset> refDs = new List<Dataset>();
        JavaScriptSerializer js = new JavaScriptSerializer();
        var strQuery = "";
        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);
                LogProvider.PrepareLogResultStr(exp.Message, 10050);
                return js.Serialize(refDs);
            }
            using (var command = new SqlCommand(query, connection))
            {
                try
                {

                    using (var reader = command.ExecuteReader())
                    {

                        while (reader.Read())
                        {
                            strQuery = reader["QueryText"].ToString();
                            strQuery = strQuery.Substring(strQuery.IndexOf("FROM"));
                            refDs.Add(
                                new Dataset(Convert.ToInt32(reader["DatasetID"]),
                                reader["ELabel"].ToString(),
                                reader["Label"].ToString(),
                                strQuery
                            ));
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query, 0);
                    LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                    return js.Serialize(refDs);
                }
            }
        }

        return js.Serialize(refDs);

    }

    private static string GetColumns(string query)
    {
        List<Column> refCol = new List<Column>();
        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResultStr(exp.Message, 10050);
            }
            using (var command = new SqlCommand(query, connection))
            {
                try
                {

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            refCol.Add(
                                 new Column(Convert.ToInt32(reader["ElementID"]),
                                 reader["Name"].ToString(),
                                 reader["Label"].ToString(),
                                 reader["Type"].ToString(),
                                 reader["TextExpression"].ToString(),
                                 Convert.ToInt32(reader["DatasetID"]),
                                 reader["DatasetName"].ToString(),
                                 new List<Item>()
                             ));
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query, 0);

                    return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                }
            }
        }

        JavaScriptSerializer js = new JavaScriptSerializer();

        return js.Serialize(refCol);
    }

    public class Item
    {
        public int Id;
        public string Name;
        public string Label;
        public Item(int id, string name, string label)
        {
            this.Id = id;
            this.Name = name;
            this.Label = label;
        }
    }

    public class Column
    {
        public int ID;
        public string Name;
        public string Label;
        public string Type;
        public string Exprssion;
        public int DatasetID;
        public string Dataset;
        public List<Item> Items;

        public Column(int id, string name, string label, string type, string exprssion, int datasetId, string dataset, List<Item> items)
        {
            this.ID = id;
            this.Name = name;
            this.Label = label;
            this.Type = type;
            this.Exprssion = exprssion;
            this.DatasetID = datasetId;
            this.Dataset = dataset;
            this.Items = items;
        }
    }

    public class Dataset
    {
        public int ID;
        public string Name;
        public string Label;
        public string QueryText;
        public Dataset(int id, string name, string label, string queryText)
        {
            this.ID = id;
            this.Name = name;
            this.Label = label;
            this.QueryText = queryText;
        }
    }
}
