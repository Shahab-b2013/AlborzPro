// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.2.0.0
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
public class Entity : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public string EditDesign()
    {
        EntityModel design = null;
        string acccessCriteria = null;
        int id = Convert.ToInt32(HttpContext.Current.Request.Form["id"]);
        string responseToken = HttpContext.Current.Request.Form["responseToken"];

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
            acccessCriteria = SecurityProvider.ValidateEntityAccess(id);
        }
        catch
        {
            return "Access is denied.";
        }

        #endregion

        #region Json & Xml File Parsing

        try
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            design = js.Deserialize<IEntity>(HttpContext.Current.Request.Form["design"]).EntityModel;
            StreamWriter sw = File.CreateText(Server.MapPath("/App_Data") + "/Entities/" + id + ".fdm");
            sw.Write(HttpContext.Current.Request.Form["design"]);
            sw.Close();


            StreamWriter xml = File.CreateText(Server.MapPath("/App_Data") + "/Entities/" + id + ".fdmx");
            xml.Write(HttpContext.Current.Request.Form["xml"]);
            xml.Close();

        }
        catch (Exception exp)
        {
            return "An error occurred during file parsing\n\r" + exp.Message;
        }

        #endregion

        ClearOldDesign(id);

        #region Edit 


        CreateSoftware(id, "Core", true, "1.1.0.def", "RMS");


        foreach (EntityItems entities in design.Entities.Entity)
        {
            int EntityID = Convert.ToInt32(entities.Id + 50000);

            CreateEntities(EntityID, id, entities.Name, entities.Label, entities.DataName, true, "custom", "BPMS", entities.IsPredefined, entities.IdentityAuto, entities.Isbasic);

            foreach (EntityAttribute entityAttribute in entities.Attributes.EntityAttribute)
            {
                CreateEntityAttributes(Convert.ToInt32(entityAttribute.Id + 5000000), EntityID, entityAttribute.Name, entityAttribute.Label, entityAttribute.Nullable, 0, 0, null, null, entityAttribute.AttributeTypeID,
                    entityAttribute.EnumTypeID, null, null, true, "custom", null, entityAttribute.DefaultValue, entityAttribute.Formula);
            }

            CreateEntityActions(EntityID * 10 , 12400, "SELECT_" + entities.Name, entities.Name, true, "custom", "");

            CreateEntityDevActions(EntityID * 10, EntityID, "SELECT " + entities.DataName + "." + entities.Name + "ID , " + entities.DataName + ".Label FROM " + entities.DataName, "SelectQuery", 100);

            CreateEntityActionContexts(EntityID * 10 , EntityID * 10 , "SELECT_" + entities.Name, entities.Name, entities.DataName + "_" + entities.Name + "ID", true, "custom", "");

            CreateEntityActionControls(EntityID * 10 , EntityID * 10 , "SELECT_" + entities.Name, entities.Name, "SelectList", true, "custom", "");

            CreateEntitySelectLists(EntityID * 10 , EntityID * 10 , true, false, true, "after", "DropDown", entities.DataName + "_Label", false, false, false, true, 10, 10, false, "count > 2");

        }

        //SyncRefentityID

        foreach (EntityItems entities in design.Entities.Entity)
        {
            int EntityID = Convert.ToInt32(entities.Id + 50000);

            SyncRefEntityID(EntityID);

        }


        foreach (EntityRelation entityRelation in design.EntityRelations.EntityRelation)
        {
            int destinationEntityID = 0;

            if (CheckEntityId(entityRelation.DestinationEntityID)) destinationEntityID = entityRelation.DestinationEntityID;
            else destinationEntityID = entityRelation.DestinationEntityID + 50000;

            CreateEntityRelations(Convert.ToInt32(entityRelation.Id + 50000), id, entityRelation.Name, entityRelation.Label, entityRelation.Type, Convert.ToInt32(entityRelation.SourceEntityID + 50000), entityRelation.SourceMultiplicity, destinationEntityID , entityRelation.DestinationMultiplicity, entityRelation.AssociationEntity.Id != 0 ? entityRelation.AssociationEntity.Id + 50000 : 0, true, "custom", "");
        }

        ExecDeplomentEntity(id);
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
            acccessCriteria = SecurityProvider.ValidateEntityAccess(id);
        }
        catch
        {
            return "Access is denied.";
        }

        #endregion

        int dModelID = objKey;

        #region Get FormInfo From Database

        string dName = null;
        string dLabel = null;
        string dTablePrefix = null;

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

            string query = "select * from Sys_Dbs_DataModels where DataModelID = " + dModelID;

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        dName = reader["ELabel"].ToString();

                        dLabel = reader["Label"].ToString();

                        dTablePrefix = reader["TablePrefix"].ToString();
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

        if (File.Exists(Server.MapPath("/App_Data") + "/Entities/" + dModelID + ".fdm"))
        {
            #region Form Design Already Exsited

            using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Entities/" + dModelID + ".fdm"))
            {
                designJson = reader.ReadToEnd();
                designJson = designJson.Remove(designJson.Length - 2, 2);
                designJson = designJson + ",\"Label\":\"@@Label\",";
                designJson = designJson + "\"Name\":\"@@Name\",";
                designJson = designJson + "\"TablePrefix\":\"@@TablePrefix\"}}";

                designJson = designJson.Replace("@@Name", dName.ToString());
                designJson = designJson.Replace("@@Label", dLabel.ToString());
                designJson = designJson.Replace("@@TablePrefix", dTablePrefix.ToString());
            }

            #endregion
        }
        else
        {
            if (File.Exists(Server.MapPath("/App_Data") + "/Entities/Default.fdm"))
            {
                #region Form Design not Already Exsited, Create Default Design

                using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Entities/Default.fdm"))
                {
                    designJson = reader.ReadToEnd();
                }
                designJson = designJson.Replace("@@Id", dModelID.ToString());
                designJson = designJson.Replace("@@Name", dName.ToString());
                designJson = designJson.Replace("@@Label", dLabel.ToString());
                designJson = designJson.Replace("@@TablePrefix", dTablePrefix.ToString());

                #endregion
            }
            else
            {
                return LogProvider.PrepareLogResultStr(0, "Default.fdm was not found", 0);
            }
        }

        designJson = designJson.Replace("@@requestToken", SessionProvider.GenRequestToken());

        JavaScriptSerializer js = new JavaScriptSerializer();
        designJson = js.Serialize(designJson);

        return designJson;
    }

    [WebMethod(EnableSession = true)]
    public string GetBaseXml()
    {
        string Basexml = null;

        if (File.Exists(Server.MapPath("/App_Data") + "/Entities/baseXml.fdmx"))
        {
            #region Form Design Already Exsited

            using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Entities/Basexml.fdmx"))
            {
                Basexml = reader.ReadToEnd();


            }

            #endregion
        }

        return Basexml;

    }

    [WebMethod(EnableSession = true)]
    public string GetAttributeTypes()
    {
        return GetDataList("SELECT AttributeTypeID as ID,Label,Name FROM Sys_AttributeTypes;");
    }

    [WebMethod(EnableSession = true)]
    public string GetEnumTypes()
    {
        return GetDataList("SELECT EnumTypeID AS ID,Label,Name FROM Sys_EnumTypes");
    }

    [WebMethod(EnableSession = true)]
    public string GetEntities()
    {
        return GetDataList("SELECT EntityID AS ID,Label,Name FROM Sys_Entities WHERE Enabled=1");
    }

    private static string GetDataList(string query)
    {
        List<ListItems> items = new List<ListItems>();

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
                            items.Add(new ListItems(reader["ID"].ToString(), reader["Label"].ToString(), reader["Name"].ToString()));
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

    public class ListItems
    {
        public string ID;

        public string Label;

        public string Name;
        public ListItems(string id, string label, string name)
        {
            this.ID = id;

            this.Label = label;

            this.Name = name;
        }
    }


    public bool CheckEntityId(int entityId)
    {
        string query = @"SELECT 1 FROM Sys_Entities WHERE EntityID = " + entityId;

        int id = SqlDataProvider.ExecuteScalarQuery2(query);

        if (id == 1)
        {
            return true;
        }
        else
        {
            return false;
        }

    }

    private static void ClearOldDesign(int SoftwareID)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format(
            "DELETE FROM Sys_EntityRelations WHERE SoftwareID = {0}; " +
            "DELETE FROM Sys_EntityAttributes WHERE EntityID IN (SELECT EntityID FROM Sys_Entities WHERE SoftwareID = {0}); " +
            "DELETE FROM Sys_Gui_Ctl_SelectLists WHERE SelectListID IN (SELECT EntityID * 10 FROM Sys_Entities WHERE SoftwareID = {0}); " +
            "DELETE FROM Sys_Gui_ActionControls WHERE ActionControlID IN (SELECT EntityID * 10 FROM Sys_Entities WHERE SoftwareID = {0}); " +
            "DELETE FROM Sys_Gui_ActionContexts WHERE ActionContextID IN (SELECT EntityID * 10 FROM Sys_Entities WHERE SoftwareID = {0}); " +
            "DELETE FROM Sys_Dev_Actions WHERE EntityID IN (SELECT EntityID FROM Sys_Entities WHERE SoftwareID = {0}); " +
            "DELETE FROM Sys_Actions WHERE ActionID IN (SELECT EntityID * 10 FROM Sys_Entities WHERE SoftwareID = {0}); " +
            "DELETE FROM Sys_Entities WHERE SoftwareID = {0};" +
             "DELETE FROM Sys_Softwares WHERE SoftwareID = {0};"
            , SoftwareID));
    }

    //Sync RefentityID
    private static void SyncRefEntityID(int entityID)
    {
        string sql = string.Format(@"
            BEGIN TRY
                DECLARE @CurrentEntityID INT;
                DECLARE @CurrentAttributeTypeID INT;
                DECLARE @CurrentLabel NVARCHAR(255);
                DECLARE @RefEntityID INT;
            
                -- تعریف CURSOR روی تمام رکوردهایی که میخوایم آپدیت کنیم
                DECLARE cur CURSOR FOR
                SELECT EntityID, AttributeTypeID, Label
                FROM Sys_EntityAttributes
                WHERE EntityID = {0} AND AttributeTypeID = 0;
            
                OPEN cur;
                FETCH NEXT FROM cur INTO @CurrentEntityID, @CurrentAttributeTypeID, @CurrentLabel;
            
                WHILE @@FETCH_STATUS = 0
                BEGIN
                    -- پیدا کردن RefEntityID مربوط به این Label
                    SELECT TOP 1 @RefEntityID = EntityID
                    FROM Sys_Entities
                    WHERE Label = @CurrentLabel;
            
                    -- اگر RefEntityID پیدا شد، آپدیت کن
                    IF @RefEntityID IS NOT NULL
                    BEGIN
                        UPDATE Sys_EntityAttributes
                        SET RefEntityID = @RefEntityID
                        WHERE EntityID = @CurrentEntityID AND AttributeTypeID = @CurrentAttributeTypeID AND Label = @CurrentLabel;
                    END
                    ELSE
                    BEGIN
                        DECLARE @ErrorMessage NVARCHAR(4000);
                        SET @ErrorMessage = 'No matching RefEntityID found for Label = ' + @CurrentLabel;
                        PRINT @ErrorMessage;
                    END
            
                    FETCH NEXT FROM cur INTO @CurrentEntityID, @CurrentAttributeTypeID, @CurrentLabel;
                END
            
                CLOSE cur;
                DEALLOCATE cur;
            END TRY
            BEGIN CATCH
                IF CURSOR_STATUS('global', 'cur') >= 0
                BEGIN
                    CLOSE cur;
                    DEALLOCATE cur;
                END
            
                DECLARE @CatchErrorMessage NVARCHAR(4000);
                SET @CatchErrorMessage = 'Error Number: ' + CAST(ERROR_NUMBER() AS NVARCHAR(10)) + ' - ' + ERROR_MESSAGE();
                PRINT @CatchErrorMessage;
            END CATCH
            ", entityID);

        SqlDataProvider.ExecuteScalarQuery(sql).ToString();
    }




    private static void CreateSoftware(int softwareID, string type, bool enabled, string version, string description)
    {
        // Retrieve the label from the database first
        string label = SqlDataProvider.ExecuteScalarQuery(string.Format("SELECT Label FROM Sys_Dbs_DataModels WHERE DataModelID = {0}", softwareID)).ToString();
        string Elabel = SqlDataProvider.ExecuteScalarQuery(string.Format("SELECT ELabel FROM Sys_Dbs_DataModels WHERE DataModelID = {0}", softwareID)).ToString();

        // Use the retrieved label in the INSERT query
        SqlDataProvider.ExecuteNoneQuery(string.Format(
            "INSERT INTO Sys_Softwares (SoftwareID, Type, Name, Label, Enabled, Version, Description) " +
            "VALUES ({0}, N'{1}', N'{2}', N'{3}', {4}, N'{5}', N'{6}')",
            softwareID, type, Elabel, label, enabled ? 1 : 0, version, description));
    }


    private static void CreateEntities(int entityID, int softwareID, string name, string label, string tableName, bool enabled, string version, string description, bool isPredefined, bool identityAuto, bool isbasic)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Entities(EntityID, SoftwareID, Name, Label, TableName, Enabled, Version, Description, IsPredefined,IdentityAuto,Isbasic)" +
            " VALUES({0}, {1}, N'{2}', N'{3}', N'{4}', {5}, N'{6}', N'{7}', {8}, {9},{10})", entityID, softwareID, name, label, tableName, enabled ? 1 : 0, version, description, isPredefined ? 1 : 0, identityAuto ? 1 : 0, isbasic ? 1 : 0));

    }

    private static void CreateEntityActions(int actionid, int moduleid, string name, string label, bool enabled, string version, string description)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO [dbo].[Sys_Actions]  ([ActionID] ,[ModuleID] ,[Name]  ,[Label]  ,[Enabled] ,[Version] ,[Description])" +
     "VALUES({0},{1},N'{2}',N'{3}',{4},N'{5}',N'{6}')", actionid, moduleid, name, label, enabled ? 1 : 0, version, description));

    }
    private static void CreateEntityDevActions(int actionid, int entityid, string commandtext, string commandtype, int maxresults)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO [dbo].[Sys_Dev_Actions]([ActionID],[EntityID],[CommandText],[CommandType],[MaxResults])" +
        "VALUES({0},{1},N'{2}',N'{3}',{4})", actionid, entityid, commandtext, commandtype, maxresults));

    }

    private static void CreateEntityActionContexts(int actionContextID, int actionID, string name, string label, string valueFieldName, bool enabled, string version, string description)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO [dbo].[Sys_Gui_ActionContexts]  ([ActionContextID] ,[ActionID] ,[Name],[Label],[ValueFieldName],[Enabled] ,[Version] ,[Description])" +
     "VALUES({0},{1},N'{2}',N'{3}',N'{4}',N'{5}',N'{6}',N'{7}')", actionContextID, actionID, name, label, valueFieldName, enabled ? 1 : 0, version, description));

    }

    private static void CreateEntityActionControls(int actionControlID, int actionContextID, string name, string label, string controlType, bool enabled, string version, string description)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO [dbo].[Sys_Gui_ActionControls] ([ActionControlID],[ActionContextID],[Name],[Label],[ControlType],[Enabled],[Version],[Description])" +
        "VALUES({0},{1},N'{2}',N'{3}',N'{4}',{5},N'{6}',N'{7}')", actionControlID, actionContextID, name, label, controlType, enabled ? 1 : 0, version, description));

    }

    private static void CreateEntitySelectLists(int selectListID, int actionControlID, bool clearOnEmpty, bool emptyRequestEnabled, bool preserveSelected, string preserveSelectedPosition, string displayMode, string displayFiledName, bool dividerEnable, bool iconEnable, bool groupingEnable, bool searchEnable, int maxSelectedOptions, int maxDisplayOptions, bool actionBoxEnabled, string selectedTextFormat)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format(
        "INSERT INTO [dbo].[Sys_Gui_Ctl_SelectLists] " +
        "([SelectListID],[ActionControlID],[ClearOnEmpty],[EmptyRequestEnabled],[PreserveSelected],[PreserveSelectedPosition]," +
        "[DisplayMode],[DisplayFiledName],[DividerEnable],[IconEnable],[GroupingEnable],[SearchEnable],[MaxSelectedOptions],[MaxDisplayOptions]," +
        "[SearchStyle],[ActionBoxEnabled],[SelectedTextFormat],[Width],[GroupingFiledName],[SubtextFiledName],[CustomContent],[IconFiledName]," +
        "[StyleClass],[IconClassName]) " +
        "VALUES ({0}, {1}, {2}, {3}, {4}, N'{5}', N'{6}', N'{7}', {8}, {9}, {10}, {11}, {12}, {13}, {14}, {15}, N'{16}', {17}, {18}, {19}, {20}, {21}, {22}, {23})",
        selectListID, actionControlID, clearOnEmpty ? 1 : 0, emptyRequestEnabled ? 1 : 0, preserveSelected ? 1 : 0, preserveSelectedPosition, displayMode, displayFiledName, dividerEnable ? 1 : 0, iconEnable ? 1 : 0, groupingEnable ? 1 : 0, searchEnable ? 1 : 0, maxSelectedOptions, maxDisplayOptions, "NULL", actionBoxEnabled ? 1 : 0, selectedTextFormat, "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL"));


    }


    private static void CreateEntityAttributes(int entityAttributeID, int entityID, string name, string label, bool nullable, int minValueLenght, int maxValueLenght, string minValue, string maxValue,
     int attributeTypeID, int enumTypeID, string locationPath, string searchStyle, bool enabled, string version, string description, string defaultValue, string formula)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO [dbo].[Sys_EntityAttributes]([EntityAttributeID],[EntityID],[Name],[Label],[Nullable],[MinValueLenght],[MaxValueLenght]" +
            "  ,[MinValue],[MaxValue],[AttributeTypeID] ,[EnumTypeID] ,[LocationPath],[SearchStyle],[Enabled],[Version],[Description],[DefaultValue],[Formula],[RefEntityID]) " +
            "VALUES({0}, {1}, N'{2}', N'{3}', {4}, {5}, {6}, N'{7}', N'{8}', {9}, {10}, N'{11}', N'{12}',{13},N'{14}',N'{15}',N'{16}',N'{17}',{18})", entityAttributeID, entityID,
            name, label, nullable ? 1 : 0, "NULL", "NULL", minValue, maxValue, attributeTypeID, enumTypeID == 0 ? "NULL" : enumTypeID.ToString(), locationPath, searchStyle, enabled ? 1 : 0, version, description, defaultValue, formula, 0));

    }

    private static void CreateEntityRelations(int entityRelationID, int softwareID, string name, string label, string type, int sourceEntityID, string sourceMultiplicity, int destinationEntityID, string destinationMultiplicity, int associationEntityID, bool enabled, string version, string description)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO [dbo].[Sys_EntityRelations]([EntityRelationID],[SoftwareID],[Name],[Label],[Type],[SourceEntityID],[SourceMultiplicity]" +
            "  ,[DestinationEntityID],[DestinationMultiplicity],[AssociationEntityID],[Enabled],[Version],[Description]) " +
            " VALUES({0}, {1}, N'{2}', N'{3}', N'{4}', {5}, N'{6}', {7}, N'{8}', {9}, {10}, N'{11}', N'{12}')", entityRelationID, softwareID, name, label, type, sourceEntityID, sourceMultiplicity, destinationEntityID, destinationMultiplicity,
            associationEntityID == 0 ? "NULL" : associationEntityID.ToString(), enabled ? 1 : 0, version, description));

    }


    private static void ExecDeplomentEntity(int SoftwareID)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("EXEC DeploymentEntity " + SoftwareID));

    }


}
