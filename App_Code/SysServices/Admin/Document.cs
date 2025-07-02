// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0
using DocumentFormat.OpenXml.Spreadsheet;
using iTextSharp.text;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class Document : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public string GetUserTasksInfo(string processId)
    {
        string query = "SELECT ActivityID, sa.Label FROM Sys_Activities sa JOIN Sys_Prc_FlowElements sf on sa.Label = sf.Label WHERE Type = 'UserTask' AND ProcessID = @ProcessID";

        // Create a list to hold our results as dictionaries
        List<Dictionary<string, string>> results = new List<Dictionary<string, string>>();

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
                command.Parameters.AddWithValue("@ProcessID", processId);
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            // Create a dictionary for each row
                            var rowData = new Dictionary<string, string>();
                            rowData.Add("ActivityID", reader["ActivityID"].ToString());
                            rowData.Add("Label", reader["Label"].ToString());
                            results.Add(rowData);
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
        return js.Serialize(results);
    }


    [WebMethod(EnableSession = true)]
    public string EditDesign()
    {

        IDocument design = null;
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
            JavaScriptSerializer js = new JavaScriptSerializer();
            design = js.Deserialize<IDocument>(HttpContext.Current.Request.Form["design"]);
            StreamWriter sw = File.CreateText(Server.MapPath("/App_Data") + "/Documents/" + id + ".fdm");
            sw.Write(HttpContext.Current.Request.Form["design"]);
            sw.Close();
        }
        catch (Exception exp)
        {
            return "An error occurred during file parsing\n\r" + exp.Message;
        }

        #endregion

        ClearOldDesign(id);

        foreach (DocumentsPageItem docItems in design.Documents)
        {
            foreach (DocumentItems item in docItems.Value)
            {
                CreateDocumentItem(item.ID, design.DocumentID, item.Label, item.Label, item.InputType, true, "costum", "", item.RowKey);
            }
        }

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

        int dDocumentId = objKey;

        string designJson = null;

        if (File.Exists(Server.MapPath("/App_Data") + "/Documents/" + dDocumentId + ".fdm"))
        {
            #region Document Design Already Exsited

            using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Documents/" + dDocumentId + ".fdm"))
            {
                designJson = reader.ReadToEnd();
            }

            #endregion
        }
        else
        {
            if (File.Exists(Server.MapPath("/App_Data") + "/Documents/Default.fdm"))
            {
                #region Document Design not Already Exsited, Create Default Design

                using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Documents/Default.fdm"))
                {
                    designJson = reader.ReadToEnd();
                }

                designJson = designJson.Replace("@@DocumentID", dDocumentId.ToString());

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
    public string GetDocImg(int id)
    {
        string directoryPath = Server.MapPath("/App_Data") + "/Documents/Images/";
        string fileName = id + ".fdmt";
        string filePath = Path.Combine(directoryPath, fileName);
        if (File.Exists(filePath))
        {
            var fileContents = File.ReadAllText(filePath);

            fileContents = fileContents.Replace("ID:", "\"ID\":").Replace("Value :", "\"Value\":\"").Replace("}", "\"}");

            return fileContents;
        }
        else
        {
            return null;
        }
    }

    private static void ClearOldDesign(int documentId)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format(
            "DELETE FROM Sys_Prc_DocumentItems WHERE DocumentID = {0};" 
            , documentId));

    }

    private static void CreateDocumentItem(int id, int documentID, string name, string label, string inputType, bool enabled, string version, string description, int rowkey)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_DocumentItems(ID, DocumentID, Name, Label, InputType, Enabled, Version, Description, Rowkey) VALUES({0},{1},N'{2}',N'{3}',N'{4}',{5},N'{6}',N'{7}',{8})",
            id, documentID, name, label,inputType, enabled ? 1 : 0, version, description, rowkey));
    }
}

