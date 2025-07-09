using DocumentFormat.OpenXml.InkML;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;


[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class CustomActivity : System.Web.Services.WebService
{

    [WebMethod(EnableSession = true)]
    public string AddMoveToIncident(int currentIncidentID, string alertIDs, string comment, string actionn)
    {

        int targetIncidentID = 0;
        try
        {

            string[] alertIDStrings = alertIDs.Split(',');

            List<int> alertIDList = new List<int>();

            foreach (string idStr in alertIDStrings)
            {
                int parsedId;
                if (int.TryParse(idStr.Trim(), out parsedId))
                {
                    alertIDList.Add(parsedId);
                }
            }

            if (alertIDList.Count == 0)
                return "No valid IDs.";

            targetIncidentID = CreateComment(currentIncidentID, alertIDList, comment, actionn);

            using (SqlConnection conn = SqlDataProvider.DbConnection)
            {
                conn.Open();

                // Build parameter placeholders
                List<string> parameterNames = new List<string>();


                for (int i = 0; i < alertIDList.Count; i++)
                {
                    parameterNames.Add("@id" + i);
                }

                string updateQuery = string.Format(
                    "UPDATE Alt_AlertMatchs SET IncidentID = @IncidentID WHERE AlertMatchID IN ({0})",
                    string.Join(",", parameterNames)
                );

                using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@IncidentID", currentIncidentID);
                    for (int i = 0; i < alertIDList.Count; i++)
                    {
                        cmd.Parameters.AddWithValue(parameterNames[i], alertIDList[i]);
                    }

                    cmd.ExecuteNonQuery();
                }

            }


            return targetIncidentID.ToString();
        }
        catch (Exception ex)
        {
            return "Error: " + ex.Message;
        }
        finally
        {

            StateUpdate(currentIncidentID, targetIncidentID);
        }
    }



    [WebMethod(EnableSession = true)]
    public int CreateComment(int currentIncidentID, List<int> alertIDList, string comment, string actionn)
    {
        int userID = SessionProvider.UserID;

        if (alertIDList == null || alertIDList.Count == 0)
        {
            SqlDataProvider.ExecuteScalarQuery("INSERT INTO [dbo].[Alt_Comments]([Comment],[UserId],[CommentDate],[Changes],[IncidentID]) VALUES (N'" + comment + "',N'" + userID + "',GETDATE(),N'" + actionn + "',N'" + currentIncidentID + "'); SELECT SCOPE_IDENTITY();");
            return 0;
        }
        else
        {
            List<int> targetIncidentIDs = new List<int>();

            using (SqlConnection conn = SqlDataProvider.DbConnection)
            {
                conn.Open();

                // Build parameter placeholders
                List<string> parameterNames = new List<string>();

                for (int i = 0; i < alertIDList.Count; i++)
                {
                    parameterNames.Add("@id" + i);
                }
                string inClause = string.Join(",", parameterNames);

                string selectQuery = "SELECT IncidentID FROM Alt_AlertMatchs WHERE AlertMatchID IN (" + inClause + ")";


                using (SqlCommand cmd = new SqlCommand(selectQuery, conn))
                {
                    for (int i = 0; i < alertIDList.Count; i++)
                    {
                        cmd.Parameters.AddWithValue(parameterNames[i], alertIDList[i]);
                    }

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {

                        while (reader.Read())
                        {
                            if (!reader.IsDBNull(0))
                            {
                                targetIncidentIDs.Add(Convert.ToInt32(reader.GetValue(0)));
                            }
                        }

                    }
                }


            }

            List<string> addChangesList = new List<string>();
            List<string> moveChangesList = new List<string>();

            for (int i = 0; i < alertIDList.Count; i++)
            {
                addChangesList.Add("Add Alert " + alertIDList[i] + " From Incident " + targetIncidentIDs[i]);
                moveChangesList.Add("Move Alert " + alertIDList[i] + " To Incident " + currentIncidentID);
            }

            string addChanges = string.Join("\n", addChangesList);
            string moveChanges = string.Join("\n", moveChangesList);

            SqlDataProvider.ExecuteScalarQuery("INSERT INTO [dbo].[Alt_Comments]([Comment],[UserId],[CommentDate],[Changes],[IncidentID]) VALUES (N'" + comment + "',N'" + userID + "',GETDATE(),N'" + addChanges + "',N'" + currentIncidentID + "'); SELECT SCOPE_IDENTITY();");

            if (targetIncidentIDs.Count > 0)
            {
                SqlDataProvider.ExecuteScalarQuery("INSERT INTO [dbo].[Alt_Comments]([Comment],[UserId],[CommentDate],[Changes],[IncidentID]) VALUES (N'" + comment + "',N'" + userID + "',GETDATE(),N'" + moveChanges + "',N'" + targetIncidentIDs[0] + "'); SELECT SCOPE_IDENTITY();");
            }

            return targetIncidentIDs.Count > 0 ? targetIncidentIDs[0] : 0;
        }
    }

    [WebMethod(EnableSession = true)]
    public void StateUpdate(int currentID, int targetID)
    {
        try
        {
            using (SqlConnection conn = SqlDataProvider.DbConnection)
            {
                conn.Open();

                // Process both IDs in a single connection
                UpdateStateForId(conn, currentID);

                UpdateStateForId(conn, targetID);
            }
        }
        catch (Exception ex)
        {
            throw new Exception("Error in StateUpdate: " + ex.Message, ex);
        }
    }

    private void UpdateStateForId(SqlConnection conn, int incidentId)
    {
        string countQuery = "SELECT COUNT(*) FROM Alt_AlertMatchs WHERE IncidentID = @IncidentID";

        using (SqlCommand countCmd = new SqlCommand(countQuery, conn))
        {
            countCmd.Parameters.Add("@IncidentID", SqlDbType.Int).Value = incidentId;
            int count = (int)countCmd.ExecuteScalar();
            int newState = (count == 0) ? 23 : 1;

            string updateQuery = "UPDATE Sys_Pex_Process_120 SET StateID = @StateID WHERE InstanceID = @IncidentID";
            using (SqlCommand updateCmd = new SqlCommand(updateQuery, conn))
            {
                updateCmd.Parameters.Add("@StateID", SqlDbType.Int).Value = newState;
                updateCmd.Parameters.Add("@IncidentID", SqlDbType.Int).Value = incidentId;
                updateCmd.ExecuteNonQuery();
            }
        }
    }



    [WebMethod(EnableSession = true)]
    public string UpdateIncidentColor(int incidentId, string color)
    {
        if (incidentId != 0 && color != "")
        {
            string tmpQuery = "UPDATE [dbo].[Alt_Incidents] SET [Color] = '" + color + "' WHERE [IncidentID] =" + incidentId;
            SqlDataProvider.ExecuteNoneQuery(tmpQuery);
            return "Submit ok";
        }
        else
        {
            return "";
        }

    }

    [WebMethod(EnableSession = true)]
    public string GetProcessSteps(int ProcessID)
    {
        Dictionary<string, object> data = new Dictionary<string, object>();

        List<Dictionary<string, object>> StepsLabel = SqlDataProvider.ExecuteRowsQuery(@"select Label from Sys_Prc_FlowElements where Type = 'UserTask' and ProcessID = " + ProcessID);

        JavaScriptSerializer js = new JavaScriptSerializer();
        return js.Serialize(StepsLabel);
    }




    [WebMethod(EnableSession = true)]
    public string CreateNewAlert(string alertObj)
    {
        int userID = SessionProvider.UserID;
        try
        {
            var serializer = new JavaScriptSerializer();
            AlertData alert = serializer.Deserialize<AlertData>(alertObj);

            // Generate random/dummy values for required fields
            Random rand = new Random();

            if (alert.PadvishServerID == null) alert.PadvishServerID = rand.Next(1, 100);
            if (alert.AlertQueryID == null) alert.AlertQueryID = rand.Next(1, 100);
            if (string.IsNullOrEmpty(alert.MatchHash)) alert.MatchHash = Guid.NewGuid().ToString("N");
            if (string.IsNullOrEmpty(alert.ClientName)) alert.ClientName = "Client_" + Guid.NewGuid().ToString("N").Substring(0, 5);
            if (string.IsNullOrEmpty(alert.Application)) alert.Application = "App_" + Guid.NewGuid().ToString("N").Substring(0, 5);
            if (string.IsNullOrEmpty(alert.Target)) alert.Target = "Target_" + Guid.NewGuid().ToString("N").Substring(0, 5);
            if (string.IsNullOrEmpty(alert.TargetType)) alert.TargetType = "Test Target";
            if (string.IsNullOrEmpty(alert.Direction)) alert.Direction = "Test Direction";
            if (string.IsNullOrEmpty(alert.ClientIP)) alert.ClientIP = "192.168.1." + rand.Next(1, 255);
            if (string.IsNullOrEmpty(alert.Protocol)) alert.Protocol = "TCP";
            if (string.IsNullOrEmpty(alert.RemoteIP)) alert.RemoteIP = "10.0.0." + rand.Next(1, 255);
            if (string.IsNullOrEmpty(alert.MalwareName)) alert.MalwareName = "TestMalware";
            if (string.IsNullOrEmpty(alert.Action)) alert.Action = "Test Action";
            if (string.IsNullOrEmpty(alert.Path)) alert.Path = @"C:\Test\Path.exe";
            if (string.IsNullOrEmpty(alert.ApplicationPath)) alert.ApplicationPath = @"C:\Program Files\TestApp\App.exe";
            if (string.IsNullOrEmpty(alert.ScanType)) alert.ScanType = "RealTime";
            if (string.IsNullOrEmpty(alert.EventDate)) alert.EventDate = DateTime.Now.ToString("yyyy/MM/dd");
            if (string.IsNullOrEmpty(alert.DetectionType)) alert.DetectionType = "Test Type";
            if (string.IsNullOrEmpty(alert.PMSIP)) alert.PMSIP = "172.16.0." + rand.Next(1, 255);
            if (string.IsNullOrEmpty(alert.Description)) alert.Description = "Auto-generated alert for testing.";
            if (string.IsNullOrEmpty(alert.SeverityLevel)) alert.SeverityLevel = "YellowAlert";
            if (string.IsNullOrEmpty(alert.SupportGroup)) alert.SupportGroup = "";


            int newAlertId = 0;
            using (SqlConnection conn = SqlDataProvider.DbConnection)
            {
                string sql = @"
                INSERT INTO Alt_AlertMatchs
                (
                    [PadvishServerID], [AlertQueryID], [MatchHash], [ClientName], [Application], [Target], [TargetType], [Direction],
                    [ClientIP], [Protocol], [RemoteIP], [MalwareName], [Action], [Path], [ApplicationPath], [ScanType], [EventDate],
                    [DetectionType] , [PMSIP], [ESID] , [Description] , [SeverityLevel], [SupportGroup] , [IncidentID] , [StarterID] , [_IsDeleted]
                )
                VALUES
                (
                    @PadvishServerID, @AlertQueryID, @MatchHash, @ClientName, @Application, @Target, @TargetType, @Direction,
                    @ClientIP, @Protocol, @RemoteIP, @MalwareName, @Action, @Path, @ApplicationPath, @ScanType, dbo.ConvertJalaliToGregorian(@EventDate),
                    @DetectionType, @PMSIP,  @ESID , @Description, @SeverityLevel, @SupportGroup , @IncidentID , @StarterID , 0  
                );SELECT SCOPE_IDENTITY();";

                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@PadvishServerID", (object)alert.PadvishServerID ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@AlertQueryID", (object)alert.AlertQueryID ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@IncidentID", (object)alert.IncidentID ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ESID", (object)alert.ESID ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@StarterID", userID);


                    cmd.Parameters.AddWithValue("@MatchHash", (object)alert.MatchHash ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ClientName", (object)alert.ClientName ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Application", (object)alert.Application ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Target", (object)alert.Target ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@TargetType", (object)alert.TargetType ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Direction", (object)alert.Direction ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ClientIP", (object)alert.ClientIP ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Protocol", (object)alert.Protocol ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@RemoteIP", (object)alert.RemoteIP ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@MalwareName", (object)alert.MalwareName ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Action", (object)alert.Action ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Path", (object)alert.Path ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ApplicationPath", (object)alert.ApplicationPath ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ScanType", (object)alert.ScanType ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@EventDate", (object)alert.EventDate ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@DetectionType", (object)alert.DetectionType ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@PMSIP", (object)alert.PMSIP ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Description", (object)alert.Description ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@SeverityLevel", (object)alert.SeverityLevel ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@SupportGroup", (object)alert.SupportGroup ?? DBNull.Value);

                    conn.Open();
                    newAlertId = Convert.ToInt32(cmd.ExecuteScalar());
                    UpdateStateForId(conn, (int)alert.IncidentID);

                }
            }

            SqlDataProvider.ExecuteScalarQuery("INSERT INTO [dbo].[Alt_Comments]([Comment],[UserId],[CommentDate],[Changes],[IncidentID]) VALUES (N'',N'" + userID + "',GETDATE(),N'Created New Alert (ID: " + newAlertId + ") For Incident " + (int)alert.IncidentID + "',N'" + (int)alert.IncidentID + "');");

            return "Alert inserted successfully!";
        }
        catch (Exception ex)
        {
            return "Error: " + ex.Message;
        }
    }

    //[WebMethod(EnableSession = true)]
    //public string GetFilteredAlerts(string startDate, string endDate, string instanceId, string color)
    //{
    //    Dictionary<string, object> data = new Dictionary<string, object>();

    //    List<Dictionary<string, object>> Alerts = SqlDataProvider.ExecuteRowsQuery(@"SELECT   SeverityLevel AS Color,  AlertMatchID AS AlertID, ClientName AS ClientName,    
    //                            ClientIP AS ClientIP, PMSIP AS PMSIP,MalwareName AS Malware,                      
    //                            MDR_ReceivedDate AS ClientDate,  RecordDate AS AlertDate, IncidentID AS IncidentID  
    //                            FROM dbo.Alt_AlertMatchs  WHERE (IncidentID <> " + instanceId + @" OR IncidentID IS NULL)      
    //                            AND  TRY_CONVERT(DATETIME, CreatedDate) >  dbo.JalaliToGregorian('" + startDate + @"')           
    //                            AND TRY_CONVERT(DATETIME, CreatedDate) <  dbo.JalaliToGregorian('" + endDate + @"')         
    //                            AND SeverityLevel LIKE '%" + color + @"%'
    //                            ORDER BY TRY_CONVERT(DATETIME, CreatedDate) DESC");

    //    JavaScriptSerializer js = new JavaScriptSerializer();
    //    return js.Serialize(Alerts);
    //}


    [WebMethod(EnableSession = true)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string GetFilteredAlerts(string ids, string startDate, string endDate, string instanceId, string color)
    {
        JavaScriptSerializer serializer = new JavaScriptSerializer();

        // تنظیم طول مجاز برای داده‌های حجیم
        serializer.MaxJsonLength = Int32.MaxValue;

        // تبدیل ids به آرایه
        string[] idArray = new string[0];
        if (!string.IsNullOrEmpty(ids))
        {
            idArray = ids.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < idArray.Length; i++)
                idArray[i] = idArray[i].Trim();
        }

        int objId = 0;
        int.TryParse(instanceId, out objId);

        List<string> conditions = new List<string>();
        conditions.Add("(IncidentID <> " + objId + " OR IncidentID IS NULL)");

        // فیلتر سرور
        if (idArray.Contains("ThisServer"))
        {
            conditions.Add("PadvishServerID = (SELECT PadvishServerID FROM Alt_Incidents WHERE IncidentID = " + objId + ")");
        }

        // فیلتر مشتری
        if (idArray.Contains("ThisCustomer"))
        {
            conditions.Add(@"PadvishServerID IN (SELECT PadvishServerID FROM Net_PadvishServers WHERE Label = (SELECT Label FROM Net_PadvishServers WHERE PadvishServerID = (SELECT PadvishServerID 
                FROM Alt_Incidents 
                WHERE IncidentID = " + objId + @")))");
        }


        // فیلتر زمان: اولویت با ThisWeek
        bool hasThisWeek = idArray.Contains("ThisWeek");
        bool hasDateFilter = idArray.Contains("alertDateFilter");

        if (hasThisWeek)
        {
            conditions.Add("TRY_CONVERT(DATETIME, CreatedDate) >= DATEADD(DAY, -500, GETDATE())");
        }
        else if (hasDateFilter && !string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate))
        {
            conditions.Add(string.Format(
                "TRY_CONVERT(DATETIME, CreatedDate) >= dbo.JalaliToGregorian('{0}') AND " +
                "TRY_CONVERT(DATETIME, CreatedDate) <= dbo.JalaliToGregorian('{1}')",
                startDate, endDate));
        }

        // فیلتر رنگ
        if (!string.IsNullOrEmpty(color))
        {
            conditions.Add("SeverityLevel LIKE '%" + color + "%'");
        }

        // ساخت شرط نهایی
        string whereClause = string.Join(" AND ", conditions.ToArray());

        string finalQuery = @"
        SELECT SeverityLevel AS Color, AlertMatchID AS AlertID, ClientName, ClientIP, PMSIP, MalwareName AS Malware, 
               MDR_ReceivedDate AS ClientDate, RecordDate AS AlertDate, IncidentID
        FROM dbo.Alt_AlertMatchs
        WHERE " + whereClause + @"
        ORDER BY TRY_CONVERT(DATETIME, CreatedDate) DESC";

        // اجرای کوئری
        List<Dictionary<string, object>> alerts = SqlDataProvider.ExecuteRowsQuery(finalQuery);

        return serializer.Serialize(alerts);
    }


    public class AlertData
    {
        public int? PadvishServerID { get; set; }
        public int? AlertQueryID { get; set; }
        public int? IncidentID { get; set; }
        public string MatchHash { get; set; }
        public string ClientName { get; set; }
        public string Application { get; set; }
        public string Target { get; set; }
        public string TargetType { get; set; }
        public string Direction { get; set; }
        public string ClientIP { get; set; }
        public string Protocol { get; set; }
        public string RemoteIP { get; set; }
        public string MalwareName { get; set; }
        public string Action { get; set; }
        public string Path { get; set; }
        public string ApplicationPath { get; set; }
        public string ScanType { get; set; }
        public string EventDate { get; set; }
        public string DetectionType { get; set; }
        public string PMSIP { get; set; }
        public string Description { get; set; }
        public string SeverityLevel { get; set; }
        public string SupportGroup { get; set; }
        public string ESID { get; set; }
    }

}
