// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.5.0.0
using System;
using System.Web;

public class SessionProvider
{
    public SessionProvider()
    {
    }

    public static string UserImage
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["UserImage"]);
        }
    }

    public static string Name
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["Name"]);
        }
    }

    public static string UserName
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["UserName"]);
        }
    }

    public static string FirstName
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["FirstName"]);
        }
    }

    public static string LastName
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["LastName"]);
        }
    }

    public static string MasterRole
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["MasterRole"]);
        }
    }

    public static string JobTitle
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["JobTitle"]);
        }
    }

    public static string UserGuid
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["UserGuid"]);
        }
    }

    public static object UserStatus
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["UserStatus"]);
        }
    }

    public static bool AllowProfileMenu
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["ProfileMenuEnabled"]);
        }
    }

    public static bool AllowChangeProfile
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["ChangeProfileEnabled"]);
        }
    }

    public static bool AllowChangeStatus
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["ChangeStatusEnabled"]);
        }
    }

    public static bool AllowChangePassword
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["ChangePasswordEnabled"]);
        }
    }

    public static bool UserImageEnabled
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["UserImageEnabled"]);
        }
    }

    public static bool AllowPersonalizeMenu
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["PersonalizeMenuEnabled"]);
        }
    }

    public static int UserID
    {
        get
        {
            return Convert.ToInt32(HttpContext.Current.Session["UserID"]);
        }
    }

    public static bool IsRedirected
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Session["IsRedirected"]);
        }
    }

    public static string SiteIDs
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["SiteIDs"]);
        }
    }

    public static string RegionIDs
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["RegionIDs"]);
        }
    }

    public static string SessionID
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session.SessionID);
        }
    }

    public static string LastRequestToken
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["LastRequestToken"]);
        }
    }

    public static string IPAddress
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["IPAddress"]);
        }
    }

    public static int DefaultPageID
    {
        get
        {
            if (HttpContext.Current.Session["DefaultPageID"] != null
                && HttpContext.Current.Session["DefaultPageID"] != DBNull.Value
                && Convert.ToString(HttpContext.Current.Session["DefaultPageID"]) != "")
            {
                return Convert.ToInt32(HttpContext.Current.Session["DefaultPageID"]);
            }

            return Convert.ToInt32(HttpContext.Current.Application["DefaultPageID"]);
        }
    }

    public static int DefDsbPageID
    {
        get
        {
            if (HttpContext.Current.Session["DefDsbPageID"] != null
                && HttpContext.Current.Session["DefDsbPageID"] != DBNull.Value
                && Convert.ToString(HttpContext.Current.Session["DefDsbPageID"]) != "")
            {
                return Convert.ToInt32(HttpContext.Current.Session["DefDsbPageID"]);
            }

            return 1000000;
        }
    }

    public static bool AllowChangeSettingOnLogin
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["OnLoginSettingEnabled"]);
        }
    }

    public static bool LoginSettingDone
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Session["LoginSettingDone"]);
        }
    }

    public static string SessionStatus
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["SessionStatus"]);
        }
    }

    public static string UserLanguage
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["SessionLanguage"]);
        }
    }

    public static string UserDirection
    {
        get
        {
            if (UserLanguage == "Ar" || UserLanguage == "Fa")
                return "RTL";
            else
                return "LRT";
        }
    }

    public static string FirstDayOfMonth
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["FirstDayOfMonth"]);
        }
    }

    public static string FirstDayOfWeek
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["FirstDayOfMonth"]);
        }
    }

    public static string FirstDayOfYear
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["FirstDayOfMonth"]);
        }
    }

    public static object SubRegionIDs
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["SubRegionIDs"]);
        }
    }

    public static object BuildingIDs
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["BuildingIDs"]);
        }
    }

    public static object DepartmentIDs
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["DepartmentIDs"]);
        }
    }

    public static object UserGendar
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Session["UserGendar"]);
        }
    }

    public static string GenRequestToken()
    {
        string query = "update Sys_Usersessions set LastRequestToken =  abs(checksum(SessionID, IPAddress , getdate())), LastRequestTime = getdate(), LastConnectTime = getdate(), IdleDuration = 0 where SessionID = '@SessionID';select LastRequestToken from Sys_Usersessions where SessionID = '@SessionID'";

        query = query.Replace("@SessionID", SecurityProvider.ValidateInput(SessionID));

        SetValue("LastRequestToken", SqlDataProvider.ExecuteScalarQuery(query));

        return Convert.ToString(LastRequestToken);
    }

    public static int ValidateSession(string mode)
    {
        if (mode == "NewSession")
        {
            if (IPAddress == string.Empty)
            {
                InitiateSession(HttpContext.Current.Request.UserHostAddress);

                return 1;
            }
            else
            {
                if (IPAddress == HttpContext.Current.Request.UserHostAddress.Trim())
                {
                    if (SessionStatus == "Login")
                    {
                        return 1;//0 orginally 
                    }
                    else
                    {
                        return 1;
                    }
                }
                else //session hijacking was detected
                {
                    return 1;
                }
            }
        }

        if (mode == "CurrentSession")
        {
            if (IPAddress == string.Empty)
            {
                return 3; //invalid approach was detected
            }
            else
            {
                if (IPAddress == HttpContext.Current.Request.UserHostAddress.Trim())
                {
                    return 1;
                }
                else //session hijacking was detected
                {
                    return 1;
                }
            }
        }

        return -1;
    }

    public static bool ValidateToken(string token)
    {
        string query = "select TokenKey from Sys_Usersessions where dbo.HashKey(TokenKey, LastRequestToken) = '@LastResponseToken' and SessionID = '@SessionID'";

        query = query.Replace("@SessionID", SecurityProvider.ValidateInput(SessionID));

        query = query.Replace("@LastResponseToken", SecurityProvider.ValidateInputSHA1(token));

        object result = SqlDataProvider.ExecuteScalarQuery(query);

        return (result == DBNull.Value || result == null ? false : true);
    }

    public static void LoginSession(string username)
    {
        string query = "update Sys_Usersessions set UserName = '@UserName', TokenKey = (select Password from dbo.Sys_Users where UserName = '@UserName'), LoginTime = getdate(), SessionStatus = 1 where SessionID ='@SessionID'";

        query = query.Replace("@SessionID", SecurityProvider.ValidateInput(SessionID));

        query = query.Replace("@UserName", SecurityProvider.ValidateInput(username));

        SqlDataProvider.ExecuteScalarQuery(query);

        SetValue("SessionStatus", "Login");
    }

    public static void LoginSSOSession(string username)
    {
        string query = "update Sys_Usersessions set UserName = '@UserName', TokenKey = (select Password from dbo.Sys_Sso_Users where UserName = '@UserName'), LoginTime = getdate(), SessionStatus = 1 where SessionID ='@SessionID'";

        query = query.Replace("@SessionID", SecurityProvider.ValidateInput(SessionID));

        query = query.Replace("@UserName", SecurityProvider.ValidateInput(username));

        SqlDataProvider.ExecuteScalarQuery(query);

        SetValue("SessionStatus", "Login");
    }

    public static void LogoutSession()
    {
        string query = "update Sys_Usersessions set CloseTime = getdate(), SessionStatus = 2 where SessionID ='@SessionID' and SessionStatus = 1";

        query = query.Replace("@SessionID", SecurityProvider.ValidateInput(SessionID));

        SqlDataProvider.ExecuteNoneQuery(query);

        HttpContext.Current.Session.Clear();

        HttpContext.Current.Session.RemoveAll();

        HttpContext.Current.Session.Abandon();

        HttpContext.Current.Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));
    }

    public static bool KeepAliveSession()
    {
        string query = "update Sys_Usersessions set LastConnectTime = getdate(), IdleDuration = datediff(ss, LastRequestTime, LastConnectTime) where SessionID ='@SessionID';select IdleDuration from Sys_Usersessions where SessionID ='@SessionID'";

        query = query.Replace("@SessionID", SecurityProvider.ValidateInput(SessionID));

        int IdleDuration = Convert.ToInt32(SqlDataProvider.ExecuteScalarQuery(query));

        if (IdleDuration < SysMembership.UserSessionTimout * 60)
        {
            return true;
        }
        else
        {
            TimeoutSession();

            return false;
        }
    }

    public static void CloseSession()
    {
        string query = "update Sys_Usersessions set CloseTime = getdate(), SessionStatus = 4 where SessionID ='@SessionID' and SessionStatus in (0, 1)";

        query = query.Replace("@SessionID", SecurityProvider.ValidateInput(SessionID));

        SqlDataProvider.ExecuteNoneQuery(query);

        HttpContext.Current.Session.Clear();

        HttpContext.Current.Session.RemoveAll();

        HttpContext.Current.Session.Abandon();

        HttpContext.Current.Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));
    }

    public static void AbandonSession()
    {
        string query = "update Sys_Usersessions set SessionID = 'abd_' + SessionID, CloseTime = getdate(), SessionStatus = 5 where SessionID ='@SessionID' and  SessionStatus in (0, 1)";

        query = query.Replace("@SessionID", SecurityProvider.ValidateInput(SessionID));

        SqlDataProvider.ExecuteNoneQuery(query);

        HttpContext.Current.Session.Clear();

        HttpContext.Current.Session.RemoveAll();

        HttpContext.Current.Session.Abandon();

        HttpContext.Current.Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));
    }

    public static void SetValue(string name, object value)
    {
        HttpContext.Current.Session.Add(name, value);
    }

    public static string GetFormatedValue(string name)
    {
        if (HttpContext.Current.Session[name] != null)
        {
            return "[ <b style='font-size:17px'>" + Convert.ToString(HttpContext.Current.Session[name]) + "</b> ]";
        }

        return "";
    }

    public static string GetValue(string name)
    {
        if (HttpContext.Current.Session[name] != null)
        {
            return Convert.ToString(HttpContext.Current.Session[name]);
        }

        return "0";
    }

    public static string GetSemiValue(string name)
    {
        if (HttpContext.Current.Session[name] != null)
        {
            string value = Convert.ToString(HttpContext.Current.Session[name]);

            if (value.Contains("@")) //EmailID
            {
                return value.Substring(0, 3) + "----@---.--";
            }
        }

        return "0";
    }

    public static void AbandonAllOpenSession()
    {
        SqlDataProvider.ExecuteNoneQuery("update Sys_Usersessions set SessionID = 'abd_' + SessionID, SessionStatus = 6, CloseTime = getdate() where SessionStatus in (0, 1)");
    }

    private static void TimeoutSession()
    {
        string query = "update Sys_Usersessions set CloseTime = getdate(), SessionStatus = 3 where SessionID ='@SessionID' and SessionStatus in (0, 1)";

        query = query.Replace("@SessionID", SecurityProvider.ValidateInput(SessionID));

        SqlDataProvider.ExecuteNoneQuery(query);

        HttpContext.Current.Session.Clear();

        HttpContext.Current.Session.RemoveAll();

        HttpContext.Current.Session.Abandon();

        HttpContext.Current.Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));
    }

    private static void InitiateSession(string ipAddress)
    {
        string query = "update Sys_Usersessions set SessionID = 'abd_' + SessionID, CloseTime = getdate(), SessionStatus = 5 where SessionID ='@SessionID' and  SessionStatus in (0, 1);" +
                       "insert into Sys_Usersessions(SessionID, IPAddress, CreateTime, SessionStatus, LastConnectTime) values ('@SessionID', '@IPAddress', getdate(), 0, getdate())";

        query = query.Replace("@SessionID", SecurityProvider.ValidateInput(SessionID));

        query = query.Replace("@IPAddress", SecurityProvider.ValidateInput(ipAddress));

        SqlDataProvider.ExecuteNoneQuery(query);

        SetValue("IPAddress", ipAddress);
    }
}

