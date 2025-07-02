// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.2.2.0
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
public class Form : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public string EditDesign()
    {
        IForm design = null;
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
            acccessCriteria = SecurityProvider.ValidateProcessAccess(id);
        }
        catch
        {
            return "Access is denied.";
        }

        #endregion

        #region Design Json File Parsing

        try
        {
            id = Convert.ToInt32(HttpContext.Current.Request.Form["id"]);
            JavaScriptSerializer js = new JavaScriptSerializer();
            design = js.Deserialize<IForm>(HttpContext.Current.Request.Form["design"]);
            StreamWriter sw = File.CreateText(Server.MapPath("/App_Data") + "/Forms/" + id + ".fdm");
            sw.Write(HttpContext.Current.Request.Form["design"]);
            sw.Close();
        }
        catch (Exception exp)
        {
            return "An error occurred during file parsing\n\r" + exp.Message;
        }

        #endregion

        ClearOldDesign(id);

        #region Edit Form

        CreateFormView(design.FormID, design.ActivityID, (design.FormID / 1000) * 1000, false, "", "", design.ItemsGrouping, design.Label);

        foreach (FormGroupBox groupBox in design.FormGroupBoxs)
        {
            CreateFormGroupBox(groupBox.FormGroupBoxID, groupBox.FormID, groupBox.Name, groupBox.Label, groupBox.GroupIndex, groupBox.ColumnLayout, groupBox.ColumnWidth, groupBox.Visibility, groupBox.Enabled, groupBox.Version, groupBox.Description);
        }

        foreach (FormItem formItem in design.FormItems)
        {
            if (formItem.Repeat == false)
            {
                CreateFormItem(formItem.ParamIndex, formItem.FormItemID, formItem.FormID, formItem.ActionControlID, formItem.FormGroupBoxID, formItem.Name, formItem.Label, formItem.InputType,
                    formItem.ColumnIndex, formItem.DisplayMode, formItem.SubTextVisible, formItem.IsReadOnly, formItem.version, formItem.ForeignKey, formItem.Description, formItem.DefaultValue, formItem.Visibility, formItem.Events, formItem.IsRequired);

                if (formItem.InputType == "Table" || formItem.InputType == "SelectiveTable")
                {
                    foreach (FormVariables variable in design.Variables)
                    {
                        if (variable.TableID == formItem.ForeignKey)

                        {
                            foreach (FormColumns columns in variable.Columns)
                            {
                                CreateFormItemDetails(design.ProcessID, design.FormID, formItem.FormItemID, columns.Rowkey, columns.SubTableID, columns.Name, columns.Label, columns.Style.ColWidth, columns.Style.ColHeight, columns.DataType, columns.EnumTypeID, columns.EntityTypeID, columns.Nullable, columns.ShowInList);
                            }

                        }

                    }
                }

            }
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
            acccessCriteria = SecurityProvider.ValidateProcessAccess(id);
        }
        catch
        {
            return "Access is denied.";
        }

        #endregion

        int dFormId = objKey;

        #region Get FormInfo From Database

        string dName = "formname";
        string dLabel = "formlabel";

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

            string query = "select * from Sys_Prc_FormViews where FormID = " + objKey;

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();
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

        if (File.Exists(Server.MapPath("/App_Data") + "/Forms/" + dFormId + ".fdm"))
        {
            #region Form Design Already Exsited

            using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Forms/" + dFormId + ".fdm"))
            {
                designJson = reader.ReadToEnd();
            }

            #endregion
        }
        else
        {
            if (File.Exists(Server.MapPath("/App_Data") + "/Forms/Default.fdm"))
            {
                #region Form Design not Already Exsited, Create Default Design

                using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Forms/Default.fdm"))
                {
                    designJson = reader.ReadToEnd();
                }
                designJson = designJson.Replace("@@ProcessID", id.ToString());
                designJson = designJson.Replace("@@FormID", dFormId.ToString());
                designJson = designJson.Replace("@@Name", dName.ToString());
                designJson = designJson.Replace("@@Label", dLabel.ToString());

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

    #region Remove Old Form Design in Database

    private static void ClearOldDesign(int FormId)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format(
            "DELETE FROM Sys_Prc_FormItems WHERE FormID = {0};" +
            "DELETE FROM Sys_Prc_FormGroupBoxs WHERE FormID = {0};" +
            "DELETE FROM Sys_Prc_FormViews WHERE FormID = {0};" +
            "DELETE FROM Sys_Prc_VariablesDetails WHERE FormID = {0}"
            , FormId));

    }

    #endregion

    #region Create New Form Design in Database

    public static void CreateFormView(int formId, int activityContextId, int dataContextId, bool multiObjHandled, string confirmMessage, string actionOnSuccess, bool itemsGrouping, string label)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_FormViews(FormID, ActivityContextID, DataContextID, MultiObjHandled, ConfirmMessage, ColumnLayout, ColumnWidth, ActionOnSuccess, ActionOnError," +
        "ResetAfterSuccess, ReactAfterSuccess, ItemsGrouping ,Name ,Label) VALUES({0},{1},{2},0,N'{4}','OnceColumn', 'default', N'{5}','[[]]', 0, 0, {6},N'{7}',N'{8}')", formId, activityContextId, dataContextId, multiObjHandled ? 1 : 0, confirmMessage, "[[\"closeModalForm\"],[\"renderActivityContext\",1000104," + (formId + 500) + ",\"GridView\"]]", itemsGrouping ? 1 : 0, label, label));
    }

    public static void CreateFormGroupBox(int formGroupBoxId, int formId, string name, string label, int groupIndex, string columnLayout, string columnWidth, bool visibility, bool enabled, string version, string desc)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_FormGroupBoxs(FormGroupBoxID, FormID, Name, Label, GroupIndex, GroupDisplayMode, ColumnLayout, ColumnWidth, DefaultVisible, TaskProceedingsArea, ProcessStatingArea,visibility," +
        "Enabled, Version, Description) VALUES({0}, {1}, N'{2}', N'{3}', {4}, 'GroupWithBox', N'{5}', 'default', 1, 0, 0, N'{6}',1, N'{7}', N'{8}')", formGroupBoxId, formId, (name == null ? label.Replace(" ", "_") : name), label, groupIndex, columnLayout, visibility.ToString(), "custom", "BPMS"));
    }

    public static void CreateFormItem(int rowIndex, int formItemId, int formId, int actionControlId, int formGroupBoxId, string name, string label, string inputType, int columnIndex, string displayMode, bool subTextVisible, bool readOnly, string version, int rowkey, string desc, string defaultvalue, bool visibility, string events, bool isrequired)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_FormItems(FormItemID, FormID, ActivityParamID, ActionControlID, FormGroupBoxID, Name, Label, IsReadOnly, InputType, RowIndex, ColumnIndex, DisplayMode, SubTextVisible, HasAddon, Enabled, Version,Rowkey, Description,DefaultValue,visibility,ActionOnChange,IsRequired) VALUES({0}, {1}, {2}, {3}, {4}, N'{5}', N'{6}', N'{7}', N'{8}', {9}, {10}, N'{11}', N'{12}' ,0 , 1, N'{13}',{14},N'{15}',N'{16}',{17} ,N'{18}',{19})",
                                                                                       formItemId, formId, formItemId, actionControlId == 0 ? "NULL" : actionControlId.ToString(), formGroupBoxId, name, label, readOnly, (inputType == "Image" ? "FileBrowse" : (inputType == "TimeBox" ? "TextBox" : inputType)), rowIndex, columnIndex, displayMode, subTextVisible == true ? 1 : 0, "custom", rowkey, "BPMS", defaultvalue, visibility ? 1 : 0, events, isrequired ? 1 : 0));
    }

    public static void CreateFormItemDetails(int processIid, int formid, int formitemid, int rowkey, int subtableid, string name, string label, string colwidth, string colheight, string inputType, int enumTypeID, int entityTypeID, bool nullable, bool showinlist)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_VariablesDetails( ProcessID,FormId,FormItemID, RowKey, SubTableID, Name, Label, ColWidth, ColHeight, InputType,EnumTypeID,EntityTypeID,Nullable,IsHeader) VALUES({0}, {1}, {2},{3},{4},N'{5}', N'{6}', N'{7}', N'{8}',N'{9}',{10},{11},{12},{13})",
                                                                                        processIid, formid, formitemid, rowkey, subtableid, name, label, colwidth, colheight, inputType, enumTypeID, entityTypeID, nullable ? 1 : 0, showinlist ? 0 : 1));
    }

    #endregion

    #region Get Details Activities

    [WebMethod(EnableSession = true)]
    public string GetVariableDetails(int formid, int formitemid)
    {
        return GetDataList("SELECT * FROM Sys_Prc_VariablesDetails WHERE FormID=" + formid + " AND FormItemID=" + formitemid);
    }

    [WebMethod(EnableSession = true)]
    public string GetFormItemDetails(int formid, int formitemid)
    {
        return GetDataList("SELECT * FROM Sys_Gui_FormItemDetails WHERE FormID=" + formid + " AND FormItemID=" + formitemid + "order by SubTableID ");
    }

    public static string GetDataList(string query)
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
                            items.Add(new ListItems(reader["SubTableID"].ToString(), reader["Name"].ToString(), reader["Label"].ToString(), reader["ColWidth"].ToString(), reader["ColHeight"].ToString(), reader["InputType"].ToString(), reader["EnumTypeID"].ToString(), reader["EntityTypeID"].ToString(), reader["Nullable"].ToString(), reader["ShowInList"].ToString()));
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

    #endregion
}

public class ListItems
{
    public string SubTableID;

    public string Name;

    public string Label;

    public string ColWidth;

    public string ColHeight;

    public string InputType;

    public string EnumTypeID;

    public string EntityTypeID;

    public string Nullable;

    public string ShowInList;

    public ListItems(string subtableid, string name, string label, string colwidth, string colheight, string inputtype, string enumTypeID, string entityTypeID, string nullable, string showInList)
    {
        this.SubTableID = subtableid;
        this.Name = name;
        this.Label = label;
        this.ColWidth = colwidth;
        this.ColHeight = colheight;
        this.InputType = inputtype;
        this.EnumTypeID = enumTypeID;
        this.EntityTypeID = entityTypeID;
        this.Nullable = nullable;
        this.ShowInList = showInList;
    }
}


