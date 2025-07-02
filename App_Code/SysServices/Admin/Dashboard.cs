// Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.2.0.0
// Release Ferdos.BPMS
using System;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.IO;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class Dashboard : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public string EditDesign()
    {
        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        string responseToken = HttpContext.Current.Request.Form["responseToken"];

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is Dashboard EditDesign");

            return LogProvider.PrepareLogResultStr(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateLicense();

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Dashboard EditDesign WebService Request is invalid.", 0);

            return LogProvider.PrepareLogResultStr(logID, "Dashboard EditDesign WebService Request is invalid.", 10101);
        }

        #endregion

        IDashboard design = null;
        int id = 0;

        #region JsonFile Parsing

        try
        {
            id = Convert.ToInt32(HttpContext.Current.Request.Form["id"]);
            JavaScriptSerializer js = new JavaScriptSerializer();
            design = js.Deserialize<IDashboard>(HttpContext.Current.Request.Form["design"]);
            StreamWriter sw = File.CreateText(Server.MapPath("/App_Data") + "/Dashboards/" + design.DashboardID + ".fdm");
            sw.Write(HttpContext.Current.Request.Form["design"]);
            sw.Close();
        }
        catch (Exception exp)
        {
            LogProvider.LogExceptionInFile(0, exp.Message + " [ " + exp.StackTrace + " ]");

            return "An error occurred during file parsing\n\r" + exp.Message;
        }

        #endregion

        #region Get DashboardInfo From Database

        string dName = null;
        string dLabel = null;
        int dModuleID = 15100;//base
        int dAccessID = 151001;//base
        int dPageID = design.DashboardID;

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

            string query = "select * from Sys_Dsb_Dashboards where _IsDeleted = 0 AND DashboardID = " + (design.DashboardID - 1000000);

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        dName = reader["ELabel"].ToString();

                        dLabel = reader["Label"].ToString();

                        dModuleID = dModuleID + (design.DashboardID - 1000100);

                        dAccessID = dModuleID * 10 + 1;
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

        try
        {
            #region Edit Page

            int activityID = (dModuleID * 100) + 50;

            ClearTables(dModuleID, dAccessID, design.DashboardID);

            CreatePage(design.DashboardID, design.PageTemplateID, "Dashboard#" + dName, "در یک نگاه#" + dLabel, "Dashboard", design.HeaderVisible, "custom", "");

            CreatePageContext(design.DashboardID, "@TabContext", 10000000, "GadgetView", "custom");

            CreateModule(dModuleID, 120, dName + "Dashboard", "داشبورد " + dLabel, "custom", null);

            CreateAccess(dAccessID, dModuleID, "ViewActivity", "View " + dName + "Dashboard", "مشاهده داشبورد " + dLabel, "custom", null);

            CreatePageAccess(design.DashboardID, dAccessID, "custom");


            int navID = 1000;
            for (int i = 0; i < 5; i++) CreatePageNavigations(design.DashboardID, navID++, "custom");

            #endregion

            #region Edit Page Layout

            for (int i = 0; i < design.RowBoxs.Length; i++)
            {
                design.RowBoxs[i].InternalID = design.DashboardID.ToString() + design.RowBoxs[i].RowIndex.ToString();
                RowBox row = design.RowBoxs[i];
                CreatePageElement(row.InternalID, design.DashboardID, "0", null, "Row", null, false, false, null, false, "custom");

                string style = "";
                switch (design.RowBoxs[i].ColumnLayout)
                {
                    case "OnceColumn":
                        style = "col-md-12";
                        break;
                    case "TwoColumn":
                        style = "col-md-6"; ;
                        break;
                    case "ThreeColumn":
                        style = "col-md-4"; ;
                        break;
                }

                foreach (Chart chart in design.Charts)
                {
                    if (chart.RowID == row.RowID)
                    {
                        chart.InternalID = row.InternalID + chart.ColumnIndex.ToString();

                        CreatePageElement(chart.InternalID, design.DashboardID, row.InternalID, null, "Cell", style, false, false, null, false, "custom");

                        CreateActivity(activityID.ToString(), dModuleID, chart.Name, chart.Text, "custom", null, design.EntityID, chart.CommandText, "SelectQuery", "عملیات با موفقیت انجام شد.", "عملیات با خطا مواجهه شد.", null, null, 100, "DataList");

                        CreateActivityContext(activityID, chart.Name, chart.Text, "ChartView", null, "custom", null);

                        CreatePageElement(chart.InternalID + "0", design.DashboardID, chart.InternalID, activityID.ToString(), "ActivityBox", "solid", false, false, null, false, "custom");

                        CreateAccessActivities(dAccessID, activityID, "custom");

                        CreateChartViews(activityID, activityID, chart.Type, chart.Text, "", chart.CategoryLabel, chart.ValueLabel, chart.CategoryName, chart.CategoryExpression, chart.SeriesType, "", "", 0, 0, "");

                        int k = 0;
                        foreach (var series in chart.Series)
                        {
                            CreateChartSeries(activityID * 10 + k, activityID, series.Name, series.Text, series.DataExpression, k, series.PlotType, series.StyleColor, 1, "custom", "", "", null, null);
                            k++;
                        }
                        activityID++;
                    }

                }
            }

            #endregion

            #region Edit Page Accesses

            for (int i = 0; i < design.AccessRoles.Length; i++)
            {
                CreateUserRoleAccesses(design.AccessRoles[i].ID, dAccessID, "All", "NULL");
            }

            for (int i = 0; i < design.AccessGroups.Length; i++)
            {
                CreateUserGroupAccessess(design.AccessGroups[i].ID, dAccessID, "All", "NULL");
            }

            #endregion

            CreateGadgetItem((design.DashboardID - 1000000), 10000000, null, design.DashboardID.ToString(), dName, dLabel, null, "", "renderPage(''#page-cell-1000605'', " + design.DashboardID.ToString() + ", 0);$(''.nav-tabs a[href=\"@IDENTITY()\"]'').tab(''show'');", string.Empty, "custom", "");

        }
        catch (Exception exp)
        {
            LogProvider.LogExceptionInFile(0, exp.Message + " [ " + exp.StackTrace + " ]");

            return "An error occurred during save\n\r" + exp.Message;
        }

        return SessionProvider.GenRequestToken();
    }

    [WebMethod(EnableSession = true)]
    public string GetDesign(int id, int objKey, string responseToken)
    {
        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is Dashboard GetDesign");

            return LogProvider.PrepareLogResultStr(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateLicense();

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Dashboard GetDesign WebService Request is invalid.", 0);

            return LogProvider.PrepareLogResultStr(logID, "Dashboard GetDesign WebService Request is invalid.", 10101);
        }

        #endregion

        #region Get DashboardInfo From Database

        string dName = null;
        string dLabel = null;
        int dModuleID = 15100;//base
        int dAccessID = 151001;//base
        int dPageID = 1000100;//base

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

            string query = "select * from Sys_Dsb_Dashboards where _IsDeleted = 0 AND DashboardID = " + objKey;

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        dName = reader["ELabel"].ToString();

                        dLabel = reader["Label"].ToString();

                        dModuleID = dModuleID + (objKey - 100);

                        dPageID = dPageID + (objKey - 100);

                        dAccessID = dModuleID * 10 + 1;
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

        if (File.Exists(Server.MapPath("/App_Data") + "/Dashboards/" + dPageID + ".fdm"))
        {
            using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Dashboards/" + dPageID + ".fdm"))
            {
                designJson = reader.ReadToEnd();
                designJson = designJson.Remove(designJson.Length - 1, 1);
                designJson = designJson + ",\"Label\":\"@@Label\",";
                designJson = designJson + "\"Name\":\"@@Name\",";
                designJson = designJson + "\"RefRoles\":[@@RefRoles],";
                designJson = designJson + "\"RefGroups\":[@@RefGroups] }";

                designJson = designJson.Replace("@@Name", dName.ToString());
                designJson = designJson.Replace("@@Label", dLabel.ToString());
                designJson = designJson.Replace("@@RefRoles", GetJsonRoles());
                designJson = designJson.Replace("@@RefGroups", GetJsonGroups());
            }
        }
        else
        {
            if (File.Exists(Server.MapPath("/App_Data") + "/Dashboards/Default.fdm"))
            {
                using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Dashboards/Default.fdm"))
                {
                    designJson = reader.ReadToEnd();
                }

                designJson = designJson.Replace("@@DashboardID", dPageID.ToString());
                designJson = designJson.Replace("@@ModuleID", dModuleID.ToString());
                designJson = designJson.Replace("@@EntityID", "10103");
                designJson = designJson.Replace("@@AccessID", dAccessID.ToString());
                designJson = designJson.Replace("@@Name", dName.ToString());
                designJson = designJson.Replace("@@Label", dLabel.ToString());
                designJson = designJson.Replace("@@RowID", dPageID.ToString() + "00");
                designJson = designJson.Replace("@@RefRoles", GetJsonRoles());
                designJson = designJson.Replace("@@RefGroups", GetJsonGroups());
            }
            else
            {
                return LogProvider.PrepareLogResultStr(0, "Default.fdm was not found", 0);
            }
        }

        designJson = designJson.Replace("@@requestToken", SessionProvider.GenRequestToken());

        return designJson;
    }

    #region Remove Old Dashboard Design in Database

    private static void ClearTables(int ModuleID, int AccessID, int PageID)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("DELETE FROM Sys_Gui_ChartSeries WHERE ChartID in (SELECT ActivityID FROM Sys_Activities WHERE ModuleID = {0});" +
            "DELETE FROM Sys_Gui_ChartViews WHERE ActivityContextID IN (SELECT ActivityID FROM Sys_Activities WHERE ModuleID = {0});" +
            "DELETE FROM Sys_UserRole_Accesses WHERE AccessID = {1};" +
            "DELETE FROM Sys_UserGroup_Accesses WHERE AccessID = {1};" +
            "DELETE FROM Sys_Gui_MenuItem_Accesses WHERE AccessID = {1};" +
            "DELETE FROM Sys_Gui_PageLayouts WHERE PageID = {2};" +
            "DELETE FROM Sys_Dev_Activities WHERE ActivityID IN (SELECT ActivityID FROM Sys_Activities WHERE ModuleID = {0});" +
            "DELETE FROM Sys_Gui_Page_Accesses WHERE PageID = {2};" +
            "DELETE FROM Sys_Access_Activities WHERE AccessID = {1};" +
            "DELETE FROM Sys_Gui_ActivityContexts WHERE ActivityID IN (SELECT ActivityID FROM Sys_Activities WHERE ModuleID = {0});" +
            "DELETE FROM Sys_Gui_Page_Contexts WHERE PageID = {2};" +
            "DELETE FROM Sys_Gui_Page_Navigations WHERE PageID = {2};" +
            "DELETE FROM Sys_Activities WHERE ModuleID = {0};" +
            "DELETE FROM Sys_Gui_GadgetItems WHERE LanchedPageID = {2};" +
            "DELETE FROM Sys_Gui_Pages WHERE PageID = {2};" +
            "DELETE FROM Sys_Accesses WHERE ModuleID={0};" +
            "DELETE FROM Sys_Modules WHERE ModuleID={0};"
                       , ModuleID, AccessID, PageID));

    }

    #endregion

    #region Create New Dashboard Design in Database

    private static void CreatePage(int pageID, string PageTemplateID, string name, string label, string type, bool headerVisible, string version, string desc)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_Pages(PageID, PageTemplateID, Type, Name, Label, HeaderVisible, Enabled, Version, Description) VALUES({0}, {1}, N'{2}', N'{3}', N'{4}', N'{5}',1, N'{6}', N'{7}')", pageID, (PageTemplateID != null ? PageTemplateID.ToString() : "NULL"), type, name, label, headerVisible, version, desc));
    }

    private static void CreatePageElement(string elementID, int pageID, string parentElementID, string activityContextID, string type, string style, bool headerVisible, bool footerVisible, string defaultVisibility, bool hasRenderCondition, string version)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_PageLayouts(ElementID, PageID, ParentElementID, ActivityContextID, Type, Style, HeaderVisible, FooterVisible, DefaultVisibility, HasRenderCondition, Enabled, Version) VALUES({0}, {1}, {2}, {3}, '{4}', {5}, '{6}', '{7}', '{8}','{9}', 1, '{10}')", elementID, pageID, parentElementID == "0" ? "NULL" : parentElementID.ToString(), (activityContextID != null ? activityContextID : "NULL"), type, (style != null ? "'" + style + "'" : "NULL"), headerVisible, footerVisible, defaultVisibility, hasRenderCondition, version));

    }

    private static int CreateActivity(string activityID, int moduleID, string name, string label, string version, string desc,
                                     int entityID, string commandText, string commandType, string successedMessage, string failedMessage, string alertMessage, string complexityTags,
                                     int maxRowAffected, string dataTypeAffected)
    {

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Activities(ActivityID, ModuleID, Name, Label, Enabled, Version, Description) VALUES({0}, {1}, N'{2}', N'{3}', 1, N'{4}', N'{5}')", activityID, moduleID, name.Replace(" ", "_"), label, version, desc));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Dev_Activities(ActivityID, EntityID, CommandText, CommandType, SuccessedMessage, FailedMessage, AlertMessage, ComplexityTags, MaxRowAffected, DataTypeAffected, IsAsynchronous) VALUES({0}, {1}, N'{2}', N'{3}', N'{4}', N'{5}', N'{6}', N'{7}', N'{8}', N'{9}', N'{10}')", activityID, (entityID == 0 ? "NULL" : entityID.ToString()), commandText, commandType, successedMessage, failedMessage, alertMessage, complexityTags, maxRowAffected, dataTypeAffected, 0));

        return Convert.ToInt32(activityID);
    }

    private static void CreateActivityContext(int id, string name, string label, string contextType, string icon, string version, string desc)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_ActivityContexts(ActivityContextID, ActivityID, ContextType, Name, Label, Icon, Enabled, Version, Description) VALUES({0}, N'{1}', N'{2}', N'{3}', N'{4}', N'{5}',1, N'{6}', N'{7}')", id, (id.ToString().Length > 7 ? "NULL" : id.ToString()), contextType, name, label, icon, version, desc));
    }

    private static void CreatePageContext(int pageID, string contextTemplateName, int contextID, string contextTemplateType, string version)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_Page_Contexts(PageID,ContextTemplateName,ContextID,ContextTemplateType,Version) VALUES({0}, N'{1}', {2}, N'{3}', N'{4}')", pageID, contextTemplateName, contextID, contextTemplateType, version));
    }

    private static void CreatePageAccess(int pageID, int AccessID, string version)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_Page_Accesses(pageID,AccessID,version) VALUES({0},{1},N'{2}')", pageID, AccessID, version));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_Page_Accesses(pageID,AccessID,version) VALUES({0},{1},N'{2}')", pageID, AccessID, version));
        
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_MenuItem_Accesses(MenuItemID,AccessID,version) VALUES({0},{1},N'{2}')", 100300, AccessID, version));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_MenuItem_Accesses(MenuItemID,AccessID,version) VALUES({0},{1},N'{2}')", 100400, AccessID, version));
    }

    private static void CreateAccessActivities(int AccessID, int ActivityID, string version)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Access_Activities(AccessID,ActivityID,version) VALUES({0},{1},N'{2}')", AccessID, ActivityID, version));
    }

    private static void CreatePageNavigations(int pageID, int NavigationID, string version)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_Page_Navigations(pageID,NavigationID,version) VALUES({0},{1},N'{2}')", pageID, NavigationID, version));
    }

    private static void CreateChartViews(int ChartID, int ActivityContextID, string ChartType, string Title, string SubTitle, string CategoryLabel, string ValueLabel, string CategoryName, string CategoryExpression, string SeriesType, string GroupingExpression, string TimePrioiedType, int TimePrioiedStart, int TimePrioiedDuration, string TimePrioiedSeriesFormat)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_ChartViews(ChartID,ActivityContextID,ChartType,Title,SubTitle,CategoryLabel,ValueLabel,CategoryName,CategoryExpression,SeriesType,GroupingExpression,TimePrioiedType,TimePrioiedStart,TimePrioiedDuration,TimePrioiedSeriesFormat) VALUES({0},{1},N'{2}',N'{3}',N'{4}',N'{5}',N'{6}',N'{7}',N'{8}',N'{9}',N'{10}',N'{11}',{12},{13},N'{14}')", ChartID, ActivityContextID, ChartType, Title, SubTitle, CategoryLabel, ValueLabel, CategoryName, FormatExpr(CategoryExpression), SeriesType, GroupingExpression, TimePrioiedType, TimePrioiedStart, TimePrioiedDuration, TimePrioiedSeriesFormat));
    }

    private static void CreateChartSeries(int ChartSeriesID, int ChartID, string Name, string Label, string DataExpression, int SeriesIndex, string PlotType, string StyleColor, int Enabled, string Version, string Description, string ActionOnClick, string LanchedContextID, string LanchedPageID)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_ChartSeries(ChartSeriesID,ChartID,Name,Label,DataExpression,SeriesIndex,PlotType,StyleColor,Enabled,Version,Description,ActionOnClick,LanchedContextID,LanchedPageID) VALUES({0},{1},N'{2}',N'{3}',N'{4}',N'{5}',N'{6}',N'{7}',{8},N'{9}',N'{10}',N'{11}',{12},{13})", ChartSeriesID, ChartID, Name, Label, FormatExpr(DataExpression), SeriesIndex, PlotType, StyleColor, Enabled, Version, Description, ActionOnClick, (LanchedPageID == null ? "NULL" : LanchedContextID), (LanchedPageID == null ? "NULL" : LanchedPageID)));
    }

    private static void CreateUserRoleAccesses(int UserRoleID, int AccessID, string AccessRuleCriteria, string ActivityParamName)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_UserRole_Accesses(UserRoleID,AccessID,AccessRuleCriteria,ActivityParamName) VALUES({0},{1},N'{2}',N'{3}')", UserRoleID, AccessID, AccessRuleCriteria, ActivityParamName));
    }

    private static void CreateUserGroupAccessess(int UserGroupID, int AccessID, string AccessRuleCriteria, string ActivityParamName)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_UserGroup_Accesses(UserGroupID,AccessID,AccessRuleCriteria,ActivityParamName) VALUES({0},{1},N'{2}',N'{3}')", UserGroupID, AccessID, AccessRuleCriteria, ActivityParamName));
    }

    private static void CreateGadgetItem(int itemIndex, int gadgetId, string lanchedContextId, string lanchedPageId, string name, string label, string dataFieldValue, string icon, string actionOnClick, string styleClass, string version, string desc)
    {
        string gadgetItemId = gadgetId.ToString();

        if (itemIndex.ToString().Length == 1)
        {
            gadgetItemId = gadgetItemId + "0" + itemIndex;
        }
        else // 2
        {
            gadgetItemId = (Convert.ToInt64(gadgetItemId) * 100 + itemIndex).ToString();
        }

        actionOnClick = actionOnClick.Replace("@IDENTITY()", gadgetItemId);

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_GadgetItems(GadgetItemID, GadgetID, LanchedContextID, LanchedPageID, Name, Label, DataFieldValue, RowIndex, ItemIndex, StyleClass, Icon, ActionOnClick, Enabled, Version, Description) " +
                                                                                  "VALUES({0}, {1}, {2}, {3}, N'{4}', N'{5}', N'{6}', {7}, {8}, N'{9}', N'{10}', N'{11}', 1, N'{12}', N'{13}')",
                                                                                        gadgetItemId, gadgetId, (lanchedContextId == null ? "NULL" : lanchedContextId), (lanchedPageId == null ? "NULL" : lanchedPageId), name, label, dataFieldValue, 0, itemIndex, styleClass, icon, actionOnClick, version, desc));
    }

    public static void CreateModule(int moduleId, int softwareId, string name, string label, string version, string desc)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Modules(ModuleID, SoftwareID, Name, Label, Enabled, Version, Description) VALUES({0}, {1}, N'{2}', N'{3}', 1, N'{4}', N'{5}')", moduleId, softwareId, name, label, version, desc));
    }

    public static void CreateAccess(int accessId, int moduleId, string type, string name, string label, string version, string desc)
    {
        SqlDataProvider.ExecuteNoneQuery("INSERT INTO Sys_UserRole_Accesses(UserRoleID, AccessID, AccessRuleCriteria) VALUES (1, " + accessId + ", 'All')");

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Accesses(AccessID, ModuleID, AccessType, Name, Label, AdminOnly, AdminAllow, Enabled, Version, Description) VALUES({0}, {1}, N'{2}', N'{3}', N'{4}', 0, 1, 1, N'{5}', N'{6}')", accessId, moduleId, type, name, label, version, desc));
    }

    private static string FormatExpr(string value)
    {
        value = value.Replace("COUNT", "Count");
        value = value.Replace("AVG", "Avg");
        value = value.Replace("SUM", "Sum");
        value = value.Replace("MIN", "Min");
        value = value.Replace("MAX", "Max");
        return value;
    }

    #endregion

    #region Prepare Json  Data for Dashboard Design

    public static string GetJsonRoles()
    {
        return "{\"ID\": \"1\",\"Label\": \"Label1\"},{\"ID\": \"2\",\"Label\": \"Label2\"},{\"ID\": \"3\",\"Label\": \"Label3\"},{\"ID\": \"4\",\"Label\": \"Label4\"},{\"ID\": \"5\",\"Label\": \"Label5\"},{\"ID\": \"6\",\"Label\": \"Label6\"},{\"ID\": \"7\",\"Label\": \"Label7\"},{\"ID\": \"8\",\"Label\": \"Label8\"}";
    }

    public static string GetJsonGroups()
    {
        return "{\"ID\": \"1\",\"Label\": \"Label1\"},{\"ID\": \"2\",\"Label\": \"Label2\"},{\"ID\": \"3\",\"Label\": \"Label3\"},{\"ID\": \"4\",\"Label\": \"Label4\"},{\"ID\": \"5\",\"Label\": \"Label5\"},{\"ID\": \"6\",\"Label\": \"Label6\"},{\"ID\": \"7\",\"Label\": \"Label7\"},{\"ID\": \"8\",\"Label\": \"Label8\"}";
    }

    #endregion
}

