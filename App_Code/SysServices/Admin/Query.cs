// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.2.0
// Release Ferdos.BPMS
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class Query : System.Web.Services.WebService
{
    public int obj_Key;

    [WebMethod(EnableSession = true)]
    public string EditDesign()
    {
        QueryModel design = null;
        string acccessCriteria = null;
        int id = Convert.ToInt32(HttpContext.Current.Request.Form["id"]);
        string responseToken = HttpContext.Current.Request.Form["responseToken"];
        int idNumber = 0;
        int elmntID = 0;
        int itemIndex = 0;

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is" + id);

            return "Session is invalid.";
        }

        LicenseProvider.ValidateActivityLicense(id);

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Activity WebService Request is invalid.", id);

            return "Activity WebService Request is invalid.";
        }

        try
        {
            acccessCriteria = SecurityProvider.ValidateQueryAccess(id);
        }
        catch
        {
            return "Access is denied.";
        }

        #endregion

        #region Design Json File Parsing

        try
        {
            idNumber++;
            elmntID = Convert.ToInt32(Convert.ToString(id + "00") + idNumber);
            JavaScriptSerializer js = new JavaScriptSerializer();
            design = js.Deserialize<IQuery>(HttpContext.Current.Request.Form["design"]).QueryModel;
            StreamWriter sw = File.CreateText(Server.MapPath("/App_Data") + "/Querys/" + id + ".fdm");
            sw.Write(HttpContext.Current.Request.Form["design"]);
            sw.Close();
        }
        catch (Exception exp)
        {
            return "An error occurred during file parsing\n\r" + exp.Message;
        }

        #endregion

        ClearOldDesign(id);

        #region Edit Query

        if (itemIndex != 0) itemIndex = 0;
        UpdateDatasets(id, design.Query,design.SelectJoin,design.SelectTable);
        foreach (var item in design.SelectColumn)
        {
            item.EnumTypeID = (item.EnumTypeID == "") ? "NULL" : item.EnumTypeID;
            item.RefEntityId = (item.RefEntityId == "") ? "NULL" : item.RefEntityId;
            CreateDatasetDesigns(elmntID, id, item.Table + "-" + item.Column, item.TableLabel + "-" + item.ColumnLabel, item.Type, item.TableOrginalName + "." + item.Column, itemIndex, item.EnumTypeID, item.RefEntityId, item.EntityAttributeID, true, "custom", "RMS");
            elmntID++;
            itemIndex++;
        }

        #endregion

        return SessionProvider.GenRequestToken();
    }

    [WebMethod(EnableSession = true)]
    public string GetDesign(int id, int objKey, string responseToken)
    {
        string acccessCriteria = null;

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is" + id);

            return "Session is invalid.";
        }

        LicenseProvider.ValidateActivityLicense(id);

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Activity WebService Request is invalid.", id);

            return "Activity WebService Request is invalid.";
        }

        try
        {
            acccessCriteria = SecurityProvider.ValidateQueryAccess(id);
        }
        catch
        {
            return "Access is denied.";
        }

        #endregion

        int dQueryId = objKey;
        obj_Key = Convert.ToInt32(HttpContext.Current.Request.Form["objKey"]);

        #region Get QueryInfo From Database

        string dName = null;
        string dLabel = null;

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
            string query = "select * from Sys_Rpt_Datasets where DatasetID = " + objKey;

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        dName = reader["ELabel"].ToString();

                        dLabel = reader["Label"].ToString();
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query, id);

                    return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                }
            }
        }

        #endregion

        string designJson = null;

        if (File.Exists(Server.MapPath("/App_Data") + "/Querys/" + dQueryId + ".fdm"))
        {
            #region Query Design Already Exsited

            using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Querys/" + dQueryId + ".fdm"))
            {
                designJson = reader.ReadToEnd();
                designJson = designJson.Replace("@@Name", dName.ToString());
                designJson = designJson.Replace("@@Label", dLabel.ToString());
                designJson = designJson.Remove(designJson.Length - 1, 1) + ",";
            }

            #endregion
        }
        else
        {
            if (File.Exists(Server.MapPath("/App_Data") + "/Querys/Default.fdm"))
            {
                #region Query Design not Already Exsited, Create Default Design

                using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Querys/Default.fdm"))
                {
                    designJson = reader.ReadToEnd();
                    designJson = designJson.Remove(designJson.Length - 1, 1) + ",";
                }
                designJson = designJson.Replace("@@ID", dQueryId.ToString());
                designJson = designJson.Replace("@@Name", dName.ToString());
                designJson = designJson.Replace("@@Label", dLabel.ToString());

                #endregion
            }
            else
            {
                return LogProvider.PrepareLogResultStr(0, "Default.fdm was not found", 0);
            }
        }

        string RefdataJson = GetTables();
        designJson += "\"RefTables\":" + RefdataJson + "}";

        designJson = designJson.Replace("@@requestToken", SessionProvider.GenRequestToken());

        JavaScriptSerializer js = new JavaScriptSerializer();
        designJson = js.Serialize(designJson);

        return designJson;
    }

    #region Remove Old Query Design in Database

    private static void ClearOldDesign(int ID)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format(
            "DELETE FROM Sys_Rpt_DatasetDesigns WHERE DatasetID = {0};"
            , ID));
    }

    #endregion

    #region Create New Query Design in Database

    public static void UpdateDatasets(int datasetID, string queryText, SelectJoin[] selectJoins,string[] tables)
    {
        List<string> SourceTables = new List<string>();
        List<string> DestTables = new List<string>();

        string tupleKey = "X";

        foreach (SelectJoin join in selectJoins)
        {
            SourceTables.Add(join.SourceTable);
            SourceTables.Remove(join.DestTable);
        }

        if (SourceTables.Count >= 1)
        {
            tupleKey = Convert.ToString(SqlDataProvider.ExecuteScalarQuery(string.Format("SELECT TableName+'.'+Name+'ID,' FROM Sys_Entities WHERE Name='{0}'", SourceTables[0])));
        }

        if (SourceTables.Count == 0 && queryText != null && queryText != "") //Single table query or not any join
        {
            string[] spliter = { "SELECT", "FROM" };

            queryText = queryText.Replace("\t", " ");

            while (queryText.IndexOf("  ") > 0)
            {
                queryText = queryText.Replace("  ", " ");
            }

            queryText = queryText.Trim().Replace(Environment.NewLine, "");

            string[] queryPair = queryText.Split(spliter, 2, StringSplitOptions.RemoveEmptyEntries);

            string[] queryFields = queryPair[0].Split(',');

            string table = queryFields[0].Split('.')[0].Trim(); ;

            tupleKey = Convert.ToString(SqlDataProvider.ExecuteScalarQuery(string.Format("SELECT TableName+'.'+Name+'ID,' FROM Sys_Entities WHERE TableName='{0}'", table)));
        }


        if (queryText.Contains("Sys_Pex_Process_"))
        {
            foreach (string table in tables)
            {
                if (table.Contains("Sys_Pex_Process_"))
                {
                    tupleKey = table + ".InstanceID,";
                }
            }
        }

        if (queryText.Contains(tupleKey))
        {
            queryText = queryText.Replace(tupleKey, "");
        }

        queryText = queryText.Replace("SELECT", "SELECT " + tupleKey);

        SqlDataProvider.ExecuteNoneQuery(string.Format("UPDATE Sys_Rpt_Datasets SET QueryText=N'{1}',QueryType='SelectQuery' WHERE DatasetID={0}; ", datasetID, queryText));
    }

    public static void CreateDatasetDesigns(int elementID, int datasetID, string name, string label, string type, string textExpression, int columnPosition, string enumTypeID, string refEntityID, string entityAttributeId, bool enabled, string version, string description)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Rpt_DatasetDesigns(ElementID,DatasetID, Name, Label, Type, TextExpression, ColumnPosition, EnumTypeID, RefEntityID, EntityAttributeID, Enabled, Version, Description)" +
            " VALUES({0},{1},N'{2}',N'{3}',N'{4}',N'{5}','{6}',{7},{8},{9},{10},N'{11}',NULL)", elementID, datasetID, name, label, type, textExpression, columnPosition, enumTypeID, refEntityID, entityAttributeId, enabled ? 1 : 0, version, description));
    }

    #endregion

    #region Prepare Json  Data for Query Design

    private static string GetTables()
    {
        if (ApplicationProvider.PackageName == "افزونه های میز کار امن پرداز")
            return GetDataList("SELECT EntityID,Name,Label,TableName FROM Sys_Entities WHERE ((EntityID IN (10101,10103)) OR (EntityID > 20000) OR EntityID IN (12100,12103,12104)) AND (EntityID<100000)");

        return GetDataList("SELECT EntityID,Name,Label,TableName FROM Sys_Entities WHERE (EntityID>=10100 AND EntityID<12000) OR (EntityID > 20000) OR EntityID IN (12100,12103,12104)");
    }

    private static List<ListColumn> GetColumns(int tableId)
    {
        List<ListColumn> cols = new List<ListColumn>();
        //0 AS RefEntityID
        string query = string.Format("SELECT Sys_EntityAttributes.EntityAttributeID, Sys_EntityAttributes.EntityID, Sys_EntityAttributes.Name, Sys_EntityAttributes.Label, Sys_AttributeTypes.Name As Type , Sys_EntityAttributes.EnumTypeID , isnull(Sys_EntityAttributes.RefEntityID,(select top(1) e.EntityID from Sys_EntityAttributes as e where e.Name=Sys_EntityAttributes.Name and e.EntityAttributeID/100=e.EntityID and Sys_AttributeTypes.Name='ForeignKey')) AS RefEntityID FROM Sys_EntityAttributes INNER JOIN Sys_AttributeTypes ON Sys_EntityAttributes.AttributeTypeID = Sys_AttributeTypes.AttributeTypeID WHERE Sys_EntityAttributes.EntityID = {0} AND NOT Sys_EntityAttributes.AttributeTypeID IN (12,22)", tableId);
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
                return cols;
            }
            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {

                        while (reader.Read())
                        {
                            cols.Add(
                                new ListColumn(Convert.ToInt32(reader["EntityAttributeID"]),
                                Convert.ToInt32(reader["EntityID"]),
                                reader["Name"].ToString(),
                                reader["Label"].ToString(),
                                reader["Type"].ToString(),
                                reader["EnumTypeID"].ToString(),
                                reader["RefEntityID"].ToString()
                            ));
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query, 0);
                    LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                    return cols;
                }
            }
        }
        return cols;
    }

    private static string GetDataList(string query)
    {
        int tmpId = 0;
        List<ListTable> items = new List<ListTable>();
        List<ListColumn> cols = new List<ListColumn>();
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
                            tmpId = Convert.ToInt32(reader["EntityID"]);
                            items.Add(
                                new ListTable(Convert.ToInt32(reader["EntityID"]),
                                reader["Name"].ToString(),
                                reader["Label"].ToString(),
                                reader["TableName"].ToString(),
                                GetColumns(tmpId)
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
        return js.Serialize(items);
    }

    private class ListTable
    {
        public int ID;

        public string Name;
        public string Label;
        public string TableName;
        public List<ListColumn> Columns;

        public ListTable(int id, string name, string label, string tableName, List<ListColumn> columns)
        {
            this.ID = id;
            this.Name = name;
            this.Label = label;
            this.TableName = tableName;
            this.Columns = columns;
        }
    }

    private class ListColumn
    {
        public int ID;
        public int EntityID;
        public string Name;
        public string Label;
        public string Type;
        public string EnumTypeID;
        public string RefEntityID;

        public ListColumn(int id, int entityID, string name, string label, string type, string enumTypeId, string refEntityId)
        {
            this.ID = id;
            this.EntityID = entityID;
            this.Name = name;
            this.Label = (type == "ForeignKey" && !label.Contains("شناسه") ? "شناسه"  +" " + label : label);
            this.Type = type;
            this.EnumTypeID = enumTypeId;
            this.RefEntityID = refEntityId;
        }
    }

    #endregion
}
