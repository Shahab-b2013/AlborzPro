// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.3.0.0
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Globalization;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

[WebService(Namespace = "http://tempuri.org/")]

[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class Membership : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public Dictionary<string, object> LoginSession2(string usercode, string password)
    {
        return LoginSession(SessionProvider.GetValue("IUsername"), password, usercode);
    }

    [WebMethod(EnableSession = true)]
    public Dictionary<string, object> LoginSession(string username, string password, string usercode)
    {
        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "Session in Login page is expired.");

            return LogProvider.PrepareLogResult(logID, "Session is invalid.", 10010)[0];
        }

        LicenseProvider.ValidateLicense();

        username = SecurityProvider.ValidateInput(username);

        password = SecurityProvider.ValidateInput(password);

        usercode = SecurityProvider.ValidateInputEngDig(usercode);

        string requestToken = SessionProvider.LastRequestToken;

        #endregion

        string query = "select IPAddress from Sys_UserSessions where UserName = '@UserName' and SessionStatus = 1 and datediff(ss, LastConnectTime, getdate()) < 120";

        bool? PasswordIsReseted = null;

        bool LoginEnabled = true;

        Dictionary<string, object> result = new Dictionary<string, object>();

        DateTime? LastChangePasswordDate = null;

        TimeSpan ts;

        string AuthenticationMethod = null;

        string MobileNo = null;

        string EmailID = null;

        #region Check Concurrent Login for User

        #endregion

        using (var connection = SqlDataProvider.DbConnection)
        {
            #region Get User Info and Bind to Session

            query = "select *, dbo.FirstDayOfMonth() as FirstDayOfMonth, dbo.FirstDayOfWeek() as FirstDayOfWeek, dbo.FirstDayOfYear() as FirstDayOfYear from Sys_Users where (dbo.HashKey( Password, '" + requestToken + "' ) = @Password) and (UserName = @UserName) and (_IsDeleted = 0)";

            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new Exception(exp.Message);
            }

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@UserName", username);

                    command.Parameters.AddWithValue("@Password", password);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            #region Extend Security Login Mechanisms

                            if (reader["LastChangePasswordDate"] != DBNull.Value)
                            {
                                LastChangePasswordDate = Convert.ToDateTime(reader["LastChangePasswordDate"]);
                            }

                            if (reader["PasswordIsReseted"] != DBNull.Value)
                            {
                                PasswordIsReseted = Convert.ToBoolean(reader["PasswordIsReseted"]);
                            }

                            if (reader["AuthenticationMethod"] != DBNull.Value)
                            {
                                AuthenticationMethod = Convert.ToString(reader["AuthenticationMethod"]);

                                if (AuthenticationMethod == "DeviceVerificationCode")
                                {
                                    object dUserName = SqlDataProvider.ExecuteScalarQuery(string.Format("select UserName from Sys_UserDevices where (DeviceCode = '{0}') and (IsValid = 1) and (ExpireDate > Getdate())", usercode));

                                    if (Convert.ToString(dUserName) == username)
                                    {
                                        AuthenticationMethod = "PasswordOnly";
                                    }
                                }

                                if (AuthenticationMethod == "UserVerificationCode" || AuthenticationMethod == "DeviceVerificationCode")
                                {
                                    //Call by verification page redirected from login page
                                    if (SessionProvider.GetValue("UserVerifyCode") != "0")
                                    {
                                        if (usercode != "" && usercode != null)
                                        {
                                            if (usercode == SessionProvider.GetValue("UserVerifyCode"))
                                            {

                                                if (AuthenticationMethod == "DeviceVerificationCode")
                                                {
                                                    SqlDataProvider.ExecuteScalarQuery(string.Format("insert into Sys_UserDevices(DeviceCode, UserName, DeviceAgent, UserHostAddress, UserHostName, CreateDate, ExpireDate, IsValid) values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}',1)", usercode, username, HttpContext.Current.Request.UserAgent, HttpContext.Current.Request.UserHostAddress, HttpContext.Current.Request.UserHostName, DateTime.Now, DateTime.Today.AddDays(30)));
                                                }

                                                AuthenticationMethod = "PasswordOnly";
                                            }
                                            else
                                            {
                                                result.Add("code", "0");

                                                result.Add("message", LocalizationProvider.Login2_IsWrongMessage);

                                                return result;
                                            }
                                        }
                                    }
                                }

                                MobileNo = Convert.ToString(reader["MobileNo"]);

                                EmailID = Convert.ToString(reader["EmailID"]);

                                SessionProvider.SetValue("IUsername", username);

                                SessionProvider.SetValue("IEmailID", EmailID);

                                SessionProvider.SetValue("IMobileNo", MobileNo);
                            }
                            else
                            {
                                LoginEnabled = false;
                            }

                            #endregion

                            if (LoginEnabled && AuthenticationMethod == "PasswordOnly")
                            {

                                SessionProvider.SetValue("FirstName", reader["FirstName"]);

                                SessionProvider.SetValue("LastName", reader["LastName"]);

                                SessionProvider.SetValue("UserName", reader["UserName"]);

                                SessionProvider.SetValue("BusinessImpact", reader["BusinessImpact"]);

                                SessionProvider.SetValue("EmployeeID", reader["EmployeeID"]);

                                SessionProvider.SetValue("JobTitle", reader["JobTitle"]);

                                SessionProvider.SetValue("UserID", reader["UserID"]);

                                SessionProvider.SetValue("UserImage", reader["FaceImage"]);

                                SessionProvider.SetValue("LoginSettingDone", false);

                                SessionProvider.SetValue("FirstDayOfWeek", reader["FirstDayOfWeek"]);

                                SessionProvider.SetValue("FirstDayOfMonth", reader["FirstDayOfMonth"]);

                                SessionProvider.SetValue("FirstDayOfYear", reader["FirstDayOfYear"]);

                                SessionProvider.SetValue("MasterRole", SqlDataProvider.ExecuteScalarQuery("declare @Result nvarchar(max);" +
                                                                               "set @Result = '';" +
                                                                               "select @Result = @Result + '<span style=\"display:inline-block;padding:3px 0px 3px 0px;\">' + rtrim(ltrim(Label)) + '</span><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' " +
                                                                               "from Sys_UserRoles inner join Sys_User_Roles on Sys_UserRoles.UserRoleID = Sys_User_Roles.UserRoleID where UserID = " + SessionProvider.UserID + " order by Sys_UserRoles.UserRoleID;" +
                                                                               "select @Result"));

                                SessionProvider.SetValue("DefaultPageID", SqlDataProvider.ExecuteScalarQuery("select top(1) DefaultPageID from Sys_UserRoles inner join Sys_User_Roles on Sys_UserRoles.UserRoleID = Sys_User_Roles.UserRoleID where IsDefault = 1 and UserID = " + SessionProvider.UserID + " order by Sys_UserRoles.UserRoleID"));

                                SessionProvider.SetValue("DefDsbPageID", SqlDataProvider.ExecuteScalarQuery("select top(1) Sys_Gui_GadgetItems.LanchedPageID from Sys_Gui_GadgetItems left outer join Sys_Gui_ActivityContexts on Sys_Gui_GadgetItems.LanchedContextID = Sys_Gui_ActivityContexts.ActivityContextID where (Sys_Gui_GadgetItems.Enabled = 1)  and dbo.HasAccess2( Sys_Gui_GadgetItems.LanchedPageID, Sys_Gui_GadgetItems.LanchedContextID, NULL, " + SessionProvider.UserID + " ) = 1 and GadgetID = 10000000 order by ItemIndex"));

                                LoginEnabled = Convert.ToBoolean(reader["LoginEnabled"]);

                                #region Extend User Session Options

                                try
                                {
                                    SessionProvider.SetValue("APL", reader["AccessPublishLevel"]);

                                    SessionProvider.SetValue("UserStatus", reader["UserStatus"]);
                                }
                                catch
                                {
                                }

                                #endregion

                                #region Extend for Multi Language System

                                try
                                {
                                    if (reader["InteractionLanguage"] != DBNull.Value && reader["InteractionLanguage"] != null)
                                    {
                                        if (reader["InteractionLanguage"].ToString() != "")
                                        {
                                            SessionProvider.SetValue("SessionLanguage", reader["InteractionLanguage"]);
                                        }
                                        else
                                        {
                                            SessionProvider.SetValue("SessionLanguage", "En");
                                        }
                                    }
                                    else
                                    {
                                        SessionProvider.SetValue("SessionLanguage", "En");
                                    }
                                }
                                catch
                                {
                                    SessionProvider.SetValue("SessionLanguage", ApplicationProvider.AppLanguage);
                                }

                                #endregion

                                #region Extend for Business Enterprise System

                                try
                                {
                                    if (reader["AgentID"] != DBNull.Value && reader["AgentID"] != null)
                                    {
                                        SessionProvider.SetValue("AgentID", reader["AgentID"]);
                                    }
                                    else
                                    {
                                        SessionProvider.SetValue("AgentID", "0");
                                    }

                                    if (reader["CustomerID"] != DBNull.Value && reader["CustomerID"] != null)
                                    {
                                        SessionProvider.SetValue("CustomerID", reader["CustomerID"]);
                                    }
                                    else
                                    {
                                        SessionProvider.SetValue("CustomerID", "0");
                                    }

                                    if (reader["SupportGroupID"] != DBNull.Value && reader["SupportGroupID"] != null)
                                    {
                                        SessionProvider.SetValue("GroupID", reader["SupportGroupID"]);

                                        //Sepad Compatibility
                                        if (Convert.ToInt32(reader["SupportGroupID"]) != 10001 && Convert.ToInt32(reader["SupportGroupID"]) != 10002)
                                        {
                                            ;
                                        }
                                        else
                                        {
                                            //SessionProvider.SetValue("OnLoginSettingEnabled", false);
                                        }
                                    }
                                    else
                                    {
                                        SessionProvider.SetValue("GroupID", "0");

                                        //SessionProvider.SetValue("OnLoginSettingEnabled", false);
                                    }
                                }
                                catch { }

                                try
                                {
                                    SessionProvider.SetValue("RegionIDs", reader["RegionID"]);
                                }
                                catch
                                {
                                    SessionProvider.SetValue("RegionIDs", "0");
                                }

                                try
                                {
                                    SessionProvider.SetValue("SubRegionIDs", reader["SubRegionID"]);
                                }
                                catch
                                {
                                    SessionProvider.SetValue("SubRegionIDs", "0");
                                }

                                try
                                {
                                    SessionProvider.SetValue("SiteIDs", reader["SiteID"]);
                                }
                                catch
                                {
                                    SessionProvider.SetValue("SiteIDs", "0");
                                }

                                try
                                {
                                    SessionProvider.SetValue("BuildingIDs", SqlDataProvider.ExecuteScalarQuery("select top(1) BuildingID from Org_Positions where UserID=" + SessionProvider.UserID));
                                }
                                catch
                                {
                                    SessionProvider.SetValue("BuildingIDs", "0");
                                }

                                try
                                {
                                    SessionProvider.SetValue("DepartmentIDs", SqlDataProvider.ExecuteScalarQuery("select top(1) DepartmentID from Org_Positions where UserID=" + SessionProvider.UserID));
                                }
                                catch
                                {
                                    SessionProvider.SetValue("DepartmentIDs", "0");
                                }

                                try
                                {
                                    SessionProvider.SetValue("UserGendar", SqlDataProvider.ExecuteScalarQuery("select top(1) Gender from Hrs_Employees where EmployeeID=" + SessionProvider.UserID));
                                }
                                catch
                                {
                                    SessionProvider.SetValue("UserGendar", "0");
                                }

                                try
                                {
                                    SessionProvider.SetValue("CustomerID", reader["CustomerID"]);
                                }
                                catch
                                {
                                    SessionProvider.SetValue("CustomerID", "0");
                                }

                                try
                                {
                                    SessionProvider.SetValue("Token", reader["Token"]);
                                }
                                catch
                                {
                                    SessionProvider.SetValue("Token", "0");
                                }

                                #endregion
                            }
                        }
                        else
                        {
                            result.Add("code", "0");

                            result.Add("message", LocalizationProvider.Login_IsWrongMessage);

                            return result;
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                LogProvider.LogException(10060, exp.Message, query);

                throw new Exception(exp.Message);
            }
        }

        #endregion

        if (!LoginEnabled)
        {
            result.Add("code", "0");

            result.Add("message", LocalizationProvider.Login_IsDisabledMessage);

            return result;
        }

        if (AuthenticationMethod == "UserVerificationCode")
        {
            result.Add("code", "3");

            result.Add("message", "[no_message]");

            string verifyCode = SecurityProvider.GenVerifyCode(null);

            SessionProvider.SetValue("UserVerifyCode", verifyCode);

            //Default SMS Provider bind to NotificationRuleID 1
            bool sendResult = SmsProvider.SendSms(MobileNo, 1, verifyCode);

            if (!sendResult)
            {
                result["code"] = "31";

                result["message"] = "sms sending failed";
            }

            return result;
        }

        if (AuthenticationMethod == "DeviceVerificationCode")
        {
            result.Add("code", "4");

            result.Add("message", "[no_message]");

            string verifyCode = SecurityProvider.GenVerifyCode("Complex");

            SessionProvider.SetValue("UserVerifyCode", verifyCode);

            //Default Email Provider bind to NotificationRuleID 2
            bool sendResult = EmailProvider.SendEmail(EmailID, "User Login Verification on your new device", 2, username, verifyCode);

            if (!sendResult)
            {
                result["code"] = "41";

                result["message"] = "email sending failed";
            }

            return result;
        }

        if (AuthenticationMethod == "PSW_OTP")
        {
            result.Add("code", "4");

            result.Add("message", "[no_message]");

            return result;
        }

        if (PasswordIsReseted.HasValue)
        {
            if (PasswordIsReseted.Value && SysMembership.ChangePasswordOnNextLogin)
            {
                result.Add("code", "2");

                SessionProvider.LoginSession(username);

                if (SessionProvider.AllowChangeSettingOnLogin)
                    LoadPersonnelSettings(SessionProvider.UserID);

                SessionProvider.SetValue("ForceChangePassword", 1);

                result.Add("message", LocalizationProvider.Login_ForceChangePasswordMessage);

                return result;
            }
        }

        if (LastChangePasswordDate.HasValue)
        {
            ts = DateTime.Today - LastChangePasswordDate.Value;

            if (ts.Days > SysMembership.ChangePasswordPriod)
            {
                result.Add("code", "2");

                SessionProvider.LoginSession(username);

                if (SessionProvider.AllowChangeSettingOnLogin)
                    LoadPersonnelSettings(SessionProvider.UserID);

                SessionProvider.SetValue("ForceChangePassword", 1);

                result.Add("message", LocalizationProvider.Login_ForceChangePasswordMessage);

                return result;
            }
        }

        #region Successfull Loign

        result.Add("code", "1");

        SessionProvider.LoginSession(username);

        if (SessionProvider.AllowChangeSettingOnLogin)
            LoadPersonnelSettings(SessionProvider.UserID);

        result.Add("message", LocalizationProvider.Login_SuccessfullMessage);

        result.Add("defaultPage", SessionProvider.DefaultPageID);

        SessionProvider.SetValue("LastRequestToken", SessionProvider.GenRequestToken());

        result.Add("requestToken", SessionProvider.LastRequestToken);

        SessionProvider.SetValue("UserVerifyCode", "0");

        #endregion

        return result;
    }

    public static bool LoginSession(Guid userGuid)
    {
        #region Validation

        LicenseProvider.ValidateLicense();

        #endregion

        string query = "";

        using (var connection = SqlDataProvider.DbConnection)
        {
            #region Get User Info and Bind to Session

            query = "select dbo.Sys_Users.*, dbo.FirstDayOfMonth() as FirstDayOfMonth, dbo.FirstDayOfWeek() as FirstDayOfWeek, dbo.FirstDayOfYear() as FirstDayOfYear from dbo.Sys_Users inner join dbo.Sys_Users_Guids on dbo.Sys_Users.UserID = dbo.Sys_Users_Guids.UserID where (UserGuid = @UserGuid) and (LoginEnabled = 1) and (_IsDeleted = 0)";
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new Exception(exp.Message);
            }

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@UserGuid", userGuid.ToString());

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            SessionProvider.SetValue("FirstName", reader["FirstName"]);

                            SessionProvider.SetValue("LastName", reader["LastName"]);

                            SessionProvider.SetValue("UserName", reader["UserName"]);

                            SessionProvider.SetValue("BusinessImpact", reader["BusinessImpact"]);

                            SessionProvider.SetValue("EmployeeID", reader["EmployeeID"]);

                            SessionProvider.SetValue("JobTitle", reader["JobTitle"]);

                            SessionProvider.SetValue("UserID", reader["UserID"]);

                            SessionProvider.SetValue("UserImage", reader["FaceImage"]);

                            SessionProvider.SetValue("LoginSettingDone", false);

                            SessionProvider.SetValue("FirstDayOfWeek", reader["FirstDayOfWeek"]);

                            SessionProvider.SetValue("FirstDayOfMonth", reader["FirstDayOfMonth"]);

                            SessionProvider.SetValue("FirstDayOfYear", reader["FirstDayOfYear"]);

                            try
                            {
                                SessionProvider.SetValue("APL", reader["AccessPublishLevel"]);

                                SessionProvider.SetValue("UserStatus", reader["UserStatus"]);
                            }
                            catch
                            {
                            }

                            try
                            {
                                if (reader["InteractionLanguage"] != DBNull.Value && reader["InteractionLanguage"] != null)
                                {
                                    if (reader["InteractionLanguage"].ToString() != "")
                                    {
                                        SessionProvider.SetValue("SessionLanguage", reader["InteractionLanguage"]);
                                    }
                                    else
                                    {
                                        SessionProvider.SetValue("SessionLanguage", "En");
                                    }
                                }
                                else
                                {
                                    SessionProvider.SetValue("SessionLanguage", "En");
                                }
                            }
                            catch
                            {
                                SessionProvider.SetValue("SessionLanguage", ApplicationProvider.AppLanguage);
                            }

                            SessionProvider.SetValue("MasterRole", SqlDataProvider.ExecuteScalarQuery("declare @Result nvarchar(max);" +
                                                                                                       "set @Result = '';" +
                                                                                                       "select @Result = @Result + '<span style=\"display:inline-block;padding:3px 0px 3px 0px;\">' + rtrim(ltrim(Label)) + '</span><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' " +
                                                                                                       "from Sys_UserRoles inner join Sys_User_Roles on Sys_UserRoles.UserRoleID = Sys_User_Roles.UserRoleID where UserID = " + SessionProvider.UserID + " order by Sys_UserRoles.UserRoleID;" +
                                                                                                       "select @Result"));

                            SessionProvider.SetValue("DefaultPageID", SqlDataProvider.ExecuteScalarQuery("select top(1) DefaultPageID from Sys_UserRoles inner join Sys_User_Roles on Sys_UserRoles.UserRoleID = Sys_User_Roles.UserRoleID where IsDefault = 1 and UserID = " + SessionProvider.UserID + " order by Sys_UserRoles.UserRoleID"));

                            SessionProvider.SetValue("DefDsbPageID", SqlDataProvider.ExecuteScalarQuery("select top(1) Sys_Gui_GadgetItems.LanchedPageID from Sys_Gui_GadgetItems left outer join Sys_Gui_ActivityContexts on Sys_Gui_GadgetItems.LanchedContextID = Sys_Gui_ActivityContexts.ActivityContextID where (Sys_Gui_GadgetItems.Enabled = 1)  and dbo.HasAccess2( Sys_Gui_GadgetItems.LanchedPageID, Sys_Gui_GadgetItems.LanchedContextID, NULL,  " + SessionProvider.UserID + " ) = 1 and GadgetID = 10000000 order by ItemIndex"));

                            //Extend for Business Enterprise System
                            try
                            {
                                if (reader["AgentID"] != DBNull.Value && reader["AgentID"] != null)
                                {
                                    SessionProvider.SetValue("AgentID", reader["AgentID"]);
                                }
                                else
                                {
                                    SessionProvider.SetValue("AgentID", "0");
                                }

                                if (reader["CustomerID"] != DBNull.Value && reader["CustomerID"] != null)
                                {
                                    SessionProvider.SetValue("CustomerID", reader["CustomerID"]);
                                }
                                else
                                {
                                    SessionProvider.SetValue("CustomerID", "0");
                                }

                                if (reader["SupportGroupID"] != DBNull.Value && reader["SupportGroupID"] != null)
                                {
                                    SessionProvider.SetValue("GroupID", reader["SupportGroupID"]);

                                    //Sepad Compatibility
                                    if (Convert.ToInt32(reader["SupportGroupID"]) != 10001 && Convert.ToInt32(reader["SupportGroupID"]) != 10002)
                                    {
                                        ;
                                    }
                                    else
                                    {
                                        //SessionProvider.SetValue("OnLoginSettingEnabled", false);
                                    }
                                }
                                else
                                {
                                    SessionProvider.SetValue("GroupID", "0");

                                    //SessionProvider.SetValue("OnLoginSettingEnabled", false);
                                }
                            }
                            catch { }

                            try
                            {
                                SessionProvider.SetValue("RegionIDs", reader["RegionID"]);
                            }
                            catch
                            {
                                SessionProvider.SetValue("RegionIDs", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("SubRegionIDs", reader["SubRegionID"]);
                            }
                            catch
                            {
                                SessionProvider.SetValue("SubRegionIDs", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("SiteIDs", reader["SiteID"]);
                            }
                            catch
                            {
                                SessionProvider.SetValue("SiteIDs", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("BuildingIDs", SqlDataProvider.ExecuteScalarQuery("select top(1) BuildingID from Org_Positions where UserID=" + SessionProvider.UserID));
                            }
                            catch
                            {
                                SessionProvider.SetValue("BuildingIDs", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("DepartmentIDs", SqlDataProvider.ExecuteScalarQuery("select top(1) DepartmentID from Org_Positions where UserID=" + SessionProvider.UserID));
                            }
                            catch
                            {
                                SessionProvider.SetValue("DepartmentIDs", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("UserGendar", SqlDataProvider.ExecuteScalarQuery("select top(1) Gender from Hrs_Employees where EmployeeID=" + SessionProvider.UserID));
                            }
                            catch
                            {
                                SessionProvider.SetValue("UserGendar", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("CustomerID", reader["CustomerID"]);
                            }
                            catch
                            {
                                SessionProvider.SetValue("CustomerID", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("Token", reader["Token"]);
                            }
                            catch
                            {
                                SessionProvider.SetValue("Token", "0");
                            }
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                LogProvider.LogException(10060, exp.Message, query);

                throw new Exception(exp.Message);
            }
        }

        #endregion

        SessionProvider.LoginSession(SessionProvider.UserName);

        if (SessionProvider.AllowChangeSettingOnLogin)
            LoadPersonnelSettings(SessionProvider.UserID);

        return true;
    }

    public static bool LoginSsoSession(string SsoToken)
    {
        #region Validation

        LicenseProvider.ValidateLicense();

        #endregion

        string query = "";

        using (var connection = SqlDataProvider.DbConnection)
        {
            #region Get User Info and Bind to Session

            query = "select dbo.Sys_Sso_Users.*, dbo.FirstDayOfMonth() as FirstDayOfMonth, dbo.FirstDayOfWeek() as FirstDayOfWeek, dbo.FirstDayOfYear() as FirstDayOfYear from dbo.Sys_Sso_Users where (SsoToken = @SsoToken) and (LoginEnabled = 1)";

            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new Exception(exp.Message);
            }

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@SsoToken", SsoToken.ToString());

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            SessionProvider.SetValue("FirstName", reader["FirstName"]);

                            SessionProvider.SetValue("LastName", reader["LastName"]);

                            SessionProvider.SetValue("UserName", reader["UserName"]);

                            SessionProvider.SetValue("BusinessImpact", reader["BusinessImpact"]);

                            SessionProvider.SetValue("EmployeeID", reader["EmployeeID"]);

                            SessionProvider.SetValue("JobTitle", reader["JobTitle"]);

                            SessionProvider.SetValue("UserID", reader["UserID"]);

                            SessionProvider.SetValue("UserImage", reader["FaceImage"]);

                            SessionProvider.SetValue("LoginSettingDone", false);

                            SessionProvider.SetValue("FirstDayOfWeek", reader["FirstDayOfWeek"]);

                            SessionProvider.SetValue("FirstDayOfMonth", reader["FirstDayOfMonth"]);

                            SessionProvider.SetValue("FirstDayOfYear", reader["FirstDayOfYear"]);

                            try
                            {
                                SessionProvider.SetValue("APL", reader["AccessPublishLevel"]);

                                SessionProvider.SetValue("UserStatus", reader["UserStatus"]);
                            }
                            catch
                            {
                            }

                            try
                            {
                                if (reader["InteractionLanguage"] != DBNull.Value && reader["InteractionLanguage"] != null)
                                {
                                    if (reader["InteractionLanguage"].ToString() != "")
                                    {
                                        SessionProvider.SetValue("SessionLanguage", reader["InteractionLanguage"]);
                                    }
                                    else
                                    {
                                        SessionProvider.SetValue("SessionLanguage", "En");
                                    }
                                }
                                else
                                {
                                    SessionProvider.SetValue("SessionLanguage", "En");
                                }
                            }
                            catch
                            {
                                SessionProvider.SetValue("SessionLanguage", ApplicationProvider.AppLanguage);
                            }

                            SessionProvider.SetValue("MasterRole", SqlDataProvider.ExecuteScalarQuery("declare @Result nvarchar(max);" +
                                                                                                       "set @Result = '';" +
                                                                                                       "select @Result = @Result + '<span style=\"display:inline-block;padding:3px 0px 3px 0px;\">' + rtrim(ltrim(Label)) + '</span><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' " +
                                                                                                       "from Sys_UserRoles inner join Sys_User_Roles on Sys_UserRoles.UserRoleID = Sys_User_Roles.UserRoleID where UserID = " + SessionProvider.UserID + " order by Sys_UserRoles.UserRoleID;" +
                                                                                                       "select @Result"));

                            SessionProvider.SetValue("DefaultPageID", SqlDataProvider.ExecuteScalarQuery("select top(1) DefaultPageID from Sys_UserRoles inner join Sys_User_Roles on Sys_UserRoles.UserRoleID = Sys_User_Roles.UserRoleID where IsDefault = 1 and UserID = " + SessionProvider.UserID + " order by Sys_UserRoles.UserRoleID"));

                            SessionProvider.SetValue("DefDsbPageID", SqlDataProvider.ExecuteScalarQuery("select top(1) Sys_Gui_GadgetItems.LanchedPageID from Sys_Gui_GadgetItems left outer join Sys_Gui_ActivityContexts on Sys_Gui_GadgetItems.LanchedContextID = Sys_Gui_ActivityContexts.ActivityContextID where (Sys_Gui_GadgetItems.Enabled = 1)  and dbo.HasAccess2( Sys_Gui_GadgetItems.LanchedPageID, Sys_Gui_GadgetItems.LanchedContextID, NULL,  " + SessionProvider.UserID + " ) = 1 and GadgetID = 10000000 order by ItemIndex"));

                            //Extend for Business Enterprise System
                            try
                            {
                                if (reader["AgentID"] != DBNull.Value && reader["AgentID"] != null)
                                {
                                    SessionProvider.SetValue("AgentID", reader["AgentID"]);
                                }
                                else
                                {
                                    SessionProvider.SetValue("AgentID", "0");
                                }

                                if (reader["CustomerID"] != DBNull.Value && reader["CustomerID"] != null)
                                {
                                    SessionProvider.SetValue("CustomerID", reader["CustomerID"]);
                                }
                                else
                                {
                                    SessionProvider.SetValue("CustomerID", "0");
                                }

                                if (reader["SupportGroupID"] != DBNull.Value && reader["SupportGroupID"] != null)
                                {
                                    SessionProvider.SetValue("GroupID", reader["SupportGroupID"]);

                                    //Sepad Compatibility
                                    if (Convert.ToInt32(reader["SupportGroupID"]) != 10001 && Convert.ToInt32(reader["SupportGroupID"]) != 10002)
                                    {
                                        ;
                                    }
                                    else
                                    {
                                        //SessionProvider.SetValue("OnLoginSettingEnabled", false);
                                    }
                                }
                                else
                                {
                                    SessionProvider.SetValue("GroupID", "0");

                                    //SessionProvider.SetValue("OnLoginSettingEnabled", false);
                                }
                            }
                            catch { }

                            try
                            {
                                SessionProvider.SetValue("RegionIDs", reader["RegionID"]);
                            }
                            catch
                            {
                                SessionProvider.SetValue("RegionIDs", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("SubRegionIDs", reader["SubRegionID"]);
                            }
                            catch
                            {
                                SessionProvider.SetValue("SubRegionIDs", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("SiteIDs", reader["SiteID"]);
                            }
                            catch
                            {
                                SessionProvider.SetValue("SiteIDs", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("BuildingIDs", SqlDataProvider.ExecuteScalarQuery("select top(1) BuildingID from Org_Positions where UserID=" + SessionProvider.UserID));
                            }
                            catch
                            {
                                SessionProvider.SetValue("BuildingIDs", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("DepartmentIDs", SqlDataProvider.ExecuteScalarQuery("select top(1) DepartmentID from Org_Positions where UserID=" + SessionProvider.UserID));
                            }
                            catch
                            {
                                SessionProvider.SetValue("DepartmentIDs", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("UserGendar", SqlDataProvider.ExecuteScalarQuery("select top(1) Gender from Hrs_Employees where EmployeeID=" + SessionProvider.UserID));
                            }
                            catch
                            {
                                SessionProvider.SetValue("UserGendar", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("CustomerID", reader["CustomerID"]);
                            }
                            catch
                            {
                                SessionProvider.SetValue("CustomerID", "0");
                            }

                            try
                            {
                                SessionProvider.SetValue("Token", reader["Token"]);
                            }
                            catch
                            {
                                SessionProvider.SetValue("Token", "0");
                            }
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                LogProvider.LogException(10060, exp.Message, query);

                throw new Exception(exp.Message);
            }
        }

        #endregion

        SessionProvider.LoginSession(SessionProvider.UserName);

        if (SessionProvider.AllowChangeSettingOnLogin)
            LoadPersonnelSettings(SessionProvider.UserID);

        return true;
    }

    [WebMethod(EnableSession = true)]
    public bool KeepAliveSession()
    {
        if (SessionProvider.UserID != 0)
        {
            bool alive = SessionProvider.KeepAliveSession();

            return alive;
        }
        else
        {
            SessionProvider.AbandonSession();

            HttpContext.Current.Response.StatusCode = 403;

            return false;
        }
    }

    [WebMethod(EnableSession = true)]
    public void LogoutSession()
    {
        SessionProvider.LogoutSession();
    }

    public static void LoadPersonnelSettings(int userID)
    {
        List<object> settings = SqlDataProvider.ExecuteRowQuery("select FromDate,ToDate from Sys_Prs_DashboardFilters where UserID = " + userID);

        SessionProvider.SetValue("DF$FromDate", settings[0]);

        SessionProvider.SetValue("DF$ToDate", settings[1]);
    }

    [WebMethod(EnableSession = true)]
    public Dictionary<string, object> ChangePassword(string password)
    {
        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3 || HttpContext.Current.Session["UserName"] == null)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "Session in Login page is expired.");

            return LogProvider.PrepareLogResult(logID, "Session is invalid.", 10010)[0];
        }

        LicenseProvider.ValidateLicense();

        #endregion

        password = SecurityProvider.ValidateInput(password);

        password = SecurityProvider.ASCIIBytesToString(SecurityProvider.RASDecrypt(SecurityProvider.HexStringToBytes(password)));

        password = SecurityProvider.ASCIIBytesToString(Convert.FromBase64String(password));

        object duplicatedPass = SqlDataProvider.ExecuteScalarQuery(string.Format("select count(*) from Sys_User_Passwords where UserID ={0} and Password='{1}'", SessionProvider.UserID, password));

        Dictionary<string, object> result = new Dictionary<string, object>();

        if (Convert.ToInt32(duplicatedPass) > 0)
        {
            result.Add("code", "2");

            result.Add("message", "رمز عبور نمی تواند مشابه رمزهای گذشته باشد");

            return result;
        }

        SqlDataProvider.ExecuteNoneQuery(string.Format("update Sys_Users set Password='{0}', LastChangePasswordDate = GETDATE(), PasswordIsReseted = 0 where UserID ={1};" +
            "insert into Sys_User_Passwords(UserID,Password,ChangePasswordDate) values({1},'{0}',GETDATE())", password, SessionProvider.UserID));

        string requestToken = SessionProvider.LastRequestToken;

        result.Add("code", "1");

        result.Add("message", LocalizationProvider.Login_SuccessfullMessage);

        result.Add("defaultPage", SessionProvider.DefaultPageID);

        SessionProvider.SetValue("LastRequestToken", SessionProvider.GenRequestToken());

        result.Add("requestToken", SessionProvider.LastRequestToken);

        SessionProvider.SetValue("ForceChangePassword", 0);

        return result;
    }
}


