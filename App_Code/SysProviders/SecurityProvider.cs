// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Globalization;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

public class SecurityProvider
{
    public SecurityProvider()
    {
    }

    public static string ValidateInput(string value)
    {
        if (value == null || value == "")
        {
            return value;
        }

        StringBuilder outputBuilder = new StringBuilder("");

        string rch = "";

        foreach (char ch in value.ToCharArray())
        {
            switch (ch)
            {
                case '#': rch = "&#x23;"; break;

                case ';': rch = "&#x3B;"; break;

                case '&': rch = "&amp;"; break;

                case '<': rch = "&lt;"; break;

                case '>': rch = "&gt;"; break;

                case '"': rch = "&quot;"; break;

                case '/': rch = "&#x2F;"; break;

                case '?': rch = "&#x3F;"; break;

                case '¿': rch = "&iquest;"; break;

                case '{': rch = "&#x7B;"; break;

                case '}': rch = "&#x7D;"; break;

                case '[': rch = "&#x5B;"; break;

                case ']': rch = "&#x5D;"; break;

                case '“': rch = "&ldquo;"; break;

                case '”': rch = "&rdquo;"; break;

                case '‘': rch = "&#x91;"; break;

                case '’': rch = "&#x92;"; break;

                case '`': rch = "&#x60;"; break;

                case '´': rch = "&acute;"; break;

                //case '%': rch = "&#x25;"; break;

                case '=': rch = "&#x3D;"; break;

                case '„': rch = "&bdquo;"; break;

                case '+': rch = "&#x2B;"; break;

                case '(': rch = "&#40;"; break;

                case ')': rch = "&#x29;"; break;

                case '$': rch = "&#x24;"; break;

                case '*': rch = "&#x2A;"; break;

                case '~': rch = "&tilde;"; break;

                case ',': rch = "&sbquo;"; break;

                case ':': rch = "&#x3A;"; break;

                case '|': rch = "&#124;"; break;

                case '!': rch = "&#33;"; break;

                case '¼': rch = "&frac14;"; break;

                case '½': rch = "&frac12;"; break;

                case '¾': rch = "&frac34;"; break;

                case '-': rch = "&ndash;"; break;

                case '–': rch = "&ndash;"; break;

                case '_': rch = "&#95;"; break;

                default: rch = ch.ToString(); break;
            }

            outputBuilder.Append(rch);
        }

        string output = outputBuilder.ToString();

        return output;
    }

    public static string ValidateInputB64(string value)
    {
        if (value == null || value == "")
        {
            return value;
        }

        if (value.Substring(0, 22) != "data:image/png;base64,")
        {
            return null;
        }

        value = value.Substring(22);

        if (!Regex.IsMatch(value, @"^[a-zA-Z0-9\+/]*={0,2}$"))
        {
            return null;
        }

        return "data:image/png;base64," + value;
    }

    public static string ValidateInputSHA1(string value)
    {
        if (value == null || value == "")
        {
            return null;
        }

        if (value.Length != 40)
        {
            return null;
        }

        if (!Regex.IsMatch(value, @"^[a-zA-Z0-9]*$"))
        {
            return null;
        }

        return value;
    }

    public static string ValidateInputGUID(string value)
    {
        if (value == null || value == "")
        {
            return null;
        }

        if (!Regex.IsMatch(value, @"(^([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})$)"))
        {
            return null;
        }

        return value;
    }

    public static string ValidateLogInput(string value)
    {
        if (value == null || value == "")
        {
            return value;
        }

        StringBuilder outputBuilder = new StringBuilder("");

        string rch = "";

        foreach (char ch in value.ToCharArray())
        {
            switch (ch)
            {
                case '#': rch = "&#x23;"; break;

                case ';': rch = "&#x3B;"; break;

                case '&': rch = "&amp;"; break;

                case '<': rch = "&lt;"; break;

                case '>': rch = "&gt;"; break;

                case '"': rch = "&quot;"; break;

                case '\'': rch = "&#x27;"; break;

                case '/': rch = "&#x2F;"; break;

                case '?': rch = "&#x3F;"; break;

                case '¿': rch = "&iquest;"; break;

                case '{': rch = "&#x7B;"; break;

                case '}': rch = "&#x7D;"; break;

                case '[': rch = "&#x5B;"; break;

                case ']': rch = "&#x5D;"; break;

                case '“': rch = "&ldquo;"; break;

                case '”': rch = "&rdquo;"; break;

                case '‘': rch = "&#x91;"; break;

                case '’': rch = "&#x92;"; break;

                case '`': rch = "&#x60;"; break;

                case '´': rch = "&acute;"; break;

                case '%': rch = "&#x25;"; break;

                case '=': rch = "&#x3D;"; break;

                case '„': rch = "&bdquo;"; break;

                case '+': rch = "&#x2B;"; break;

                case '(': rch = "&#40;"; break;

                case ')': rch = "&#x29;"; break;

                case '$': rch = "&#x24;"; break;

                case '*': rch = "&#x2A;"; break;

                case '~': rch = "&tilde;"; break;

                case ',': rch = "&sbquo;"; break;

                case '\\': rch = "&#x5C;"; break;

                case ':': rch = "&#x3A;"; break;

                case '|': rch = "&#124;"; break;

                case '!': rch = "&#33;"; break;

                case '¼': rch = "&frac14;"; break;

                case '½': rch = "&frac12;"; break;

                case '¾': rch = "&frac34;"; break;

                case '-': rch = "&ndash;"; break;

                case '–': rch = "&ndash;"; break;

                default: rch = ch.ToString(); break;
            }

            outputBuilder.Append(rch);
        }

        string output = outputBuilder.ToString();

        return output;
    }

    public static string ValidateInput(int activityID, string name, string value, string regexFormat, bool nullIsEmpty, bool isRequired, int minValueLenght, int maxValueLenght, object minValue, object maxValue, string baseDataType, object referEntityID, object referEntityMultipleAllow)
    {
        PersianCalendar persianCalendar = new PersianCalendar();

        if ((value == null || value == "") && name == "DepartmentID")
        {
            value = "-1";
        }

        if (value == " " || value == "[]" && isRequired){
            if (nullIsEmpty)
            {
                return null;
            }
            else
            {
                return "";
            }
        }

        if ((value == null || value == "" || value == "[]") && isRequired)
        {
            int logID = LogProvider.LogException(10022, "Input is required.", "ParamName is " + name + " ,ParamValue is empty", activityID);

            throw new AppException(logID, "Input is required.", 10022);
        }

        if ((value == null || value == "" || value == "[]") && !isRequired)
        {
            if (nullIsEmpty)
            {
                return null;
            }
            else
            {
                return "";
            }
        }

        if (regexFormat == "encrypted")
        {
            try
            {
                value = ASCIIBytesToString(RASDecrypt(HexStringToBytes(value)));

                value = ASCIIBytesToString(Convert.FromBase64String(value));
            }
            catch (Exception exp)
            {
                int logID = LogProvider.LogException(10024, exp.Message, "ParamName is " + name + " and ParamValue is " + "$value", activityID);

                throw new AppException(logID, "Input value is invalid.", 10024);
            }
        }

        if (referEntityID == null || referEntityID == DBNull.Value)
        {
            if (Convert.ToBoolean(referEntityMultipleAllow))
            {
                value = value.Replace("\"", "").Replace(",", ", ").Replace("[", "").Replace("]", "");
            }
        }

        if (referEntityID != null && referEntityID != DBNull.Value)
        {
            try
            {
                if (Convert.ToBoolean(referEntityMultipleAllow))
                {
                    string[] values = value.Substring(1, value.Length - 2).Replace("\"", "").Split(',');

                    value = string.Empty;

                    foreach (string _val in values)
                    {
                        value += Convert.ToInt32(_val).ToString() + ",";
                    }

                    return value.Substring(0, value.Length - 1);
                }
                else
                {
                    try
                    {
                        return Convert.ToInt32(value).ToString();
                    }
                    catch
                    {
                        return Convert.ToInt32(value.Substring(1, value.Length - 2).Replace("\"", "")).ToString();
                    }
                }
            }
            catch (Exception exp)
            {
                int logID = LogProvider.LogException(10024, exp.Message, "ParamName is " + name + " and ParamValue is " + "$value" + value, activityID);

                throw new AppException(logID, "Input value is invalid.", 10024);
            }
        }

        if (value.Length < minValueLenght || value.Length > maxValueLenght)
        {
            int logID = LogProvider.LogException(10023, "Input length is invalid.", "ParamName is " + name + " and ParamValue is " + "$value", activityID);

            throw new AppException(logID, "Input length is invalid.", 10023);
        }

        switch (baseDataType)
        {
            case "NVARCHAR(500)":
            case "NVARCHAR(MAX)": return value.Contains("data:image/png;base64") ? ValidateInputB64(value) : ValidateInput(value);

            case "BIGINT":
            case "INT":
            case "MONEY":
                {
                    value = value.Replace(",", "");

                    if (value.Contains(":")) //ShortTime or LongTime
                    {
                        value = Convert.ToString((Convert.ToInt32(value.Split(':')[0]) * 60) + Convert.ToInt32(value.Split(':')[1]));
                    }

                    try
                    {
                        if (Convert.ToInt64(value) < Convert.ToInt64(minValue) || Convert.ToInt64(value) > Convert.ToInt64(maxValue))
                        {
                            int logID = LogProvider.LogException(10024, "Input value is invalid.", "ParamName is " + name + " and ParamValue is " + "$value", activityID);

                            throw new AppException(logID, "Input value is invalid.", 10024);
                        }
                    }
                    catch (Exception exp)
                    {
                        int logID = LogProvider.LogException(10024, exp.Message, "ParamName is " + name + " and ParamValue is " + value + "$" + minValue + "$" + maxValue, activityID);

                        throw new AppException(logID, "Input value is invalid.", 10024);
                    }

                    return value;
                }
                ;


            case "BIT":
                {
                    if (value != "0" && value != "1")
                    {
                        int logID = LogProvider.LogException(10024, "Input value is invalid.", "ParamName is " + name + " and ParamValue is " + "$value", activityID);

                        throw new AppException(logID, "Input value is invalid.", 10024);
                    }

                    return value == "0" ? "False" : "True";
                }
                ;

            case "DATE":
                {
                    string[] dateItems = value.Split('/');

                    var date = DateTime.Today;

                    try
                    {
                        date = persianCalendar.ToDateTime(Convert.ToInt32(dateItems[0]), Convert.ToInt32(dateItems[1]), Convert.ToInt32(dateItems[2]), 0, 0, 0, 0);
                    }
                    catch (Exception exp)
                    {
                        int logID = LogProvider.LogException(10024, exp.Message, "ParamName is " + name + " and ParamValue is " + "$value", activityID);

                        throw new AppException(logID, "Input value is invalid.", 10024);
                    }

                    return date.ToString();
                }
                ;

            case "DATETIME":
                {
                    string[] datetimeItems = value.Split(' ');

                    string[] dateItems = datetimeItems[0].Split('/');

                    string[] timeItems = datetimeItems[1].Split(':');

                    var datetime = DateTime.Now;

                    try
                    {
                        datetime = persianCalendar.ToDateTime(Convert.ToInt32(dateItems[0]), Convert.ToInt32(dateItems[1]), Convert.ToInt32(dateItems[2]), Convert.ToInt32(timeItems[0]), Convert.ToInt32(timeItems[1]), 0, 0);
                    }
                    catch (Exception exp)
                    {
                        int logID = LogProvider.LogException(10024, exp.Message, "ParamName is " + name + " and ParamValue is " + "$value", activityID);

                        throw new AppException(logID, "Input value is invalid.", 10024);
                    }

                    return datetime.ToString();
                }
                ;

            default: break;

        }

        return value;
    }

    public static string ValidateInputEng(string value)
    {
        if (value == null || value == "")
        {
            return null;
        }

        if (!Regex.IsMatch(value, @"^[a-zA-Z]+$"))
        {
            return null;
        }

        return value;
    }

    public static string ValidateInputEngDig(string value)
    {
        if (value == null || value == "")
        {
            return null;
        }

        if (!Regex.IsMatch(value, @"^[a-zA-Z0-9]+$"))
        {
            return null;
        }

        return value;
    }

    public static bool ValidateDatabaseConnection()
    {
        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return false;
            }
        }

        return true;
    }

    public static void ValidateUserAccess(int activityID, ActivityParam[] activityParams, int[] objectIDs)
    {
        string sql = "";

        string accessRuleCriteria = "";

        object resultScalar = null;

        Dictionary<int, bool> objectValidateAccess = new Dictionary<int, bool>();

        List<string> accessRuleCriterias = new List<string>();

        foreach (int objectID in objectIDs)
        {
            objectValidateAccess.Add(objectID, false);
        }

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new AppException(exp.Message, 10050);
            }

            sql = "select  Sys_User_Roles.UserRoleID, Sys_UserRole_Accesses.AccessID, Sys_UserRole_Accesses.AccessRuleCriteria from Sys_User_Roles inner join Sys_UserRole_Accesses ON Sys_User_Roles.UserRoleID = Sys_UserRole_Accesses.UserRoleID inner join Sys_Access_Activities on Sys_UserRole_Accesses.AccessID = Sys_Access_Activities.AccessID where Sys_Access_Activities.ActivityID = " + activityID + " and  Sys_User_Roles.UserID = " + SessionProvider.UserID;

            using (var command = new SqlCommand(sql, connection))
            {
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return;
                            }
                            else
                            {
                                return;
                                //accessRuleCriterias.Add("select 1 from " + accessRuleCriteria);
                            }
                        }
                    }

                    command.CommandText = "select  Sys_User_Groups.UserGroupID, Sys_UserGroup_Accesses.AccessID, Sys_UserGroup_Accesses.AccessRuleCriteria from Sys_User_Groups inner join Sys_UserGroup_Accesses ON Sys_User_Groups.UserGroupID = Sys_UserGroup_Accesses.UserGroupID inner join Sys_Access_Activities on Sys_UserGroup_Accesses.AccessID = Sys_Access_Activities.AccessID where Sys_Access_Activities.ActivityID = " + activityID + " and  Sys_User_Groups.UserID = " + SessionProvider.UserID;

                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return;
                            }
                            else
                            {
                                return;
                                //accessRuleCriterias.Add("select 1 from " + accessRuleCriteria);
                            }
                        }
                    }

                    if (accessRuleCriterias.Count == 0)
                    {
                        LogProvider.LogException(10020, "Access is denied.", activityID);

                        throw new Exception("Access is denied.");
                    }

                    foreach (string _accessRuleCriteria in accessRuleCriterias)
                    {
                        accessRuleCriteria = _accessRuleCriteria;

                        foreach (ActivityParam param in activityParams)
                        {
                            accessRuleCriteria = accessRuleCriteria.Replace("@" + param.ParamName, param.ParamValue);
                        }

                        accessRuleCriteria = accessRuleCriteria.Replace("@UserID", SessionProvider.UserID.ToString());

                        accessRuleCriteria = accessRuleCriteria.Replace("@SiteIDs", SessionProvider.SiteIDs.ToString());

                        accessRuleCriteria = accessRuleCriteria.Replace("@SubRegionIDs", SessionProvider.SubRegionIDs.ToString());

                        accessRuleCriteria = accessRuleCriteria.Replace("@RegionIDs", SessionProvider.RegionIDs.ToString());

                        if (_accessRuleCriteria.Contains("@ObjectID"))
                        {
                            foreach (int objectID in objectIDs)
                            {
                                command.CommandText = accessRuleCriteria.Replace("@ObjectID", objectID.ToString());

                                resultScalar = command.ExecuteScalar();

                                if (resultScalar != null)
                                {
                                    objectValidateAccess[objectID] = true;

                                    if (objectIDs.Length == 1)
                                    {
                                        return;
                                    }
                                }
                            }
                        }
                        else
                        {
                            command.CommandText = accessRuleCriteria;

                            resultScalar = command.ExecuteScalar();

                            if (resultScalar != null)
                            {
                                return;
                            }
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, activityID);

                    throw new AppException(logID, exp.Message, 10060);
                }
            }
        }

        foreach (int objectID in objectIDs)
        {
            if (!objectValidateAccess[objectID])
            {
                int logID = LogProvider.LogException(10021, "Access is denied.", "ObjectID : " + objectID, objectID, activityID);

                throw new AppException(logID, "Access is denied.", 10021);
            }
        }
    }

    public static string ValidateUserAccess(int activityID)
    {
        return ValidateUserAccess(activityID, null);
    }

    public static string ValidateUserAccess(int activityID, string activityParamName)
    {
        if ((activityID >= 3000000 && activityID <= 5000000) || activityID == 0)
        {
            return "";
        }

        string sql = "";

        string accessRuleCriteria = "";

        string accessCriteria = "";

        List<string> accessRuleCriterias = new List<string>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new AppException(exp.Message, 10050);
            }

            sql = "select Sys_User_Roles.UserRoleID, Sys_UserRole_Accesses.AccessID, Sys_UserRole_Accesses.AccessRuleCriteria from Sys_User_Roles inner join Sys_UserRole_Accesses ON Sys_User_Roles.UserRoleID = Sys_UserRole_Accesses.UserRoleID inner join Sys_Access_Activities on Sys_UserRole_Accesses.AccessID = Sys_Access_Activities.AccessID where Sys_Access_Activities.ActivityID = " + activityID + " and  Sys_User_Roles.UserID = " + SessionProvider.UserID;

            if (activityParamName != null)
            {
                sql = sql + " and ActivityParamName = " + activityParamName;
            }

            using (var command = new SqlCommand(sql, connection))
            {
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    command.CommandText = "select Sys_User_Groups.UserGroupID, Sys_UserGroup_Accesses.AccessID, Sys_UserGroup_Accesses.AccessRuleCriteria from Sys_User_Groups inner join Sys_UserGroup_Accesses ON Sys_User_Groups.UserGroupID = Sys_UserGroup_Accesses.UserGroupID inner join Sys_Access_Activities on Sys_UserGroup_Accesses.AccessID = Sys_Access_Activities.AccessID where Sys_Access_Activities.ActivityID = " + activityID + " and  Sys_User_Groups.UserID = " + SessionProvider.UserID;

                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    if (accessRuleCriterias.Count == 0 && activityParamName == null)
                    {
                        int logID = LogProvider.LogException(10020, "Access is denied.", activityID);

                        throw new Exception("Access is denied.");
                    }

                    if (accessRuleCriterias.Count == 0 && activityParamName != null)
                    {
                        return "";
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, activityID);

                    throw new AppException(logID, exp.Message, 10060);
                }
            }
        }

        foreach (string _accessRuleCriteria in accessRuleCriterias)
        {
            string temp = _accessRuleCriteria.Replace("@SiteIDs", SessionProvider.SiteIDs.ToString());

            temp = temp.Replace("@SubRegionIDs", SessionProvider.SubRegionIDs.ToString());

            temp = temp.Replace("@RegionIDs", SessionProvider.RegionIDs.ToString());

            temp = temp.Replace("@UserID", SessionProvider.UserID.ToString());

            accessCriteria += " (" + temp + ") or";
        }

        return accessCriteria.Substring(0, accessCriteria.Length - 2);
    }

    public static bool ValidateUserPageAccess(int pageID)
    {
        string query = "select count(*) from Sys_Gui_Page_Accesses inner join Sys_UserGroup_Accesses on Sys_Gui_Page_Accesses.AccessID = Sys_UserGroup_Accesses.AccessID inner join Sys_User_Groups on Sys_UserGroup_Accesses.UserGroupID = Sys_User_Groups.UserGroupID where Sys_Gui_Page_Accesses.PageID = " + pageID + " and  Sys_User_Groups.UserID = " + SessionProvider.UserID;

        try
        {
            int validAccess = Convert.ToInt16(SqlDataProvider.ExecuteScalarQuery(query));

            if (validAccess > 0)
            {
                return true;
            }
            else
            {
                query = "select count(*) from Sys_Gui_Page_Accesses inner join Sys_UserRole_Accesses on Sys_Gui_Page_Accesses.AccessID = Sys_UserRole_Accesses.AccessID inner join Sys_User_Roles on Sys_UserRole_Accesses.UserRoleID = Sys_User_Roles.UserRoleID where Sys_Gui_Page_Accesses.PageID = " + pageID + " and  Sys_User_Roles.UserID = " + SessionProvider.UserID;

                validAccess = Convert.ToInt16(SqlDataProvider.ExecuteScalarQuery(query));

                if (validAccess > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        catch (Exception exp)
        {
            int logID = LogProvider.LogException(10060, exp.Message, query);

            throw new AppException(logID, exp.Message, 10060);
        }
    }

    public static string ValidateUserReportAccess(int reportID)
    {
        string sql = "";

        string accessRuleCriteria = "";

        string accessCriteria = "";

        List<string> accessRuleCriterias = new List<string>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new AppException(exp.Message, 10050);
            }

            sql = "select Sys_User_Roles.UserRoleID, Sys_UserRole_Accesses.AccessID, Sys_UserRole_Accesses.AccessRuleCriteria from Sys_User_Roles inner join Sys_UserRole_Accesses ON Sys_User_Roles.UserRoleID = Sys_UserRole_Accesses.UserRoleID inner join Sys_Access_Activities on Sys_UserRole_Accesses.AccessID = Sys_Access_Activities.AccessID where Sys_Access_Activities.ActivityID = " + reportID + " and  Sys_User_Roles.UserID = " + SessionProvider.UserID;

            using (var command = new SqlCommand(sql, connection))
            {
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    command.CommandText = "select Sys_User_Groups.UserGroupID, Sys_UserGroup_Accesses.AccessID, Sys_UserGroup_Accesses.AccessRuleCriteria from Sys_User_Groups inner join Sys_UserGroup_Accesses ON Sys_User_Groups.UserGroupID = Sys_UserGroup_Accesses.UserGroupID inner join Sys_Access_Activities on Sys_UserGroup_Accesses.AccessID = Sys_Access_Activities.AccessID where Sys_Access_Activities.ActivityID = " + reportID + " and  Sys_User_Groups.UserID = " + SessionProvider.UserID;

                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    if (accessRuleCriterias.Count == 0)
                    {
                        int logID = LogProvider.LogException(10020, "Access is denied.", reportID);

                        throw new Exception("Access is denied.");
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, reportID);

                    throw new AppException(logID, exp.Message, 10060);
                }
            }
        }

        foreach (string _accessRuleCriteria in accessRuleCriterias)
        {
            string temp = _accessRuleCriteria.Replace("@SiteIDs", SessionProvider.SiteIDs.ToString());

            temp = temp.Replace("@SubRegionIDs", SessionProvider.SubRegionIDs.ToString());

            temp = temp.Replace("@RegionIDs", SessionProvider.RegionIDs.ToString());

            temp = temp.Replace("@UserID", SessionProvider.UserID.ToString());

            accessCriteria += " (" + temp + ") or";
        }

        return accessCriteria.Substring(0, accessCriteria.Length - 2);
    }

    public static string GetUserModeErrorMessage(int code, string message)
    {
        if (SessionProvider.UserID == 1 || code == 10070)
        {
            return message;
        }

        return "Internal Server Error.";
    }

    public static string GenVerifyCode(string options)
    {
        Random random = new Random();

        if (options == "Complex")
        {
            return GenerateComplexString();
        }

        return random.Next(100000, 999999).ToString();
    }

    public static string ASCIIBytesToString(byte[] input)
    {
        ASCIIEncoding enc = new ASCIIEncoding();

        return enc.GetString(input);
    }

    public static byte[] RASDecrypt(byte[] input)
    {
        byte[] result;

        CspParameters cspParams = new CspParameters();

        cspParams.Flags = CspProviderFlags.UseMachineKeyStore;

        RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(cspParams);

        string data = "<RSAKeyValue><Modulus>uUspMQUyxTwvPioG0bQMH5H8oXd6dquo69Tt40QH4PETys7KyCa4RMRnJMTH3B6K9h1/QaF0ROtYz4Aht6W9HXc6cvOAmYfg9B+8Huq9j95KslN6IrAKAuSHS+TpOS4L0FRKoNERQ+cZdiYo02rQhO54pxSIx90nnBwRAhIBbKc=</Modulus><Exponent>AQAB</Exponent><P>5CDWDKFNjvrP4pOe01LxhshRxce5/dAuB5jVUDvn+65FUrSWP03zv8GNhRZVQGtcgI1yNqPwaxVr2lHFK604fQ==</P><Q>z+6V5/NN6Z2rlRVUmIIAWbyCYH4cCyJyLsYtxQmfo449qqgHxEVdFzIT45vL4hL0R53+GU5If38YaOt4h89m8w==</Q><DP>IV8YUOKryNWx4XA81KcWg+P76lXMRG/Wu+/EjKcmyW913qJiNEJ//LYgsK5SrEjIUFngslOLEO8iRt6dXEVLtQ==</DP><DQ>jSiQVg4Dh6RFVolLi9k9ea4S6ITUbu6si3p4mfoliPhIfvFhjGn2f4e8ntkmeUyaz3+/f9h4OS3EGX45riEr5w==</DQ><InverseQ>cpdGp6o7gI78Gb5mzwftPCgJ+VDkUBnmJiVi+XmeNNgrewVZ7KRm7XkqIwU671rhT1fvYCUEbjRo+Jz87MT4LA==</InverseQ><D>IukFyD4V/DIkJn6tjTnyZMpRAizsDkq2R0R1U3HAWEGjfHzsmLwu0In+ct9+VjsM7GTPUpK0QL3knCekcqDP2diyFR3XYaUIfu8PuYyuEAI9kugKZ/y9O7LbVSiFy1DAPu6HZlDID5D1x7iwkdNtZXTn7E8qnKEYVJBeCavTMoU=</D></RSAKeyValue>";

        rsa.FromXmlString(data);

        result = rsa.Decrypt(input, false);

        return result;
    }

    public static byte[] HexStringToBytes(string hex)
    {
        if (hex.Length == 0)
        {
            return new byte[] { 0 };
        }

        if (hex.Length % 2 == 1)
        {
            hex = "0" + hex;
        }

        byte[] result = new byte[hex.Length / 2];

        for (int i = 0; i < hex.Length / 2; i++)
        {
            result[i] = byte.Parse(hex.Substring(2 * i, 2), NumberStyles.AllowHexSpecifier);
        }

        return result;
    }

    private static string SecureReplace(string sentence, string match, string value)
    {
        var regex = new Regex(match, RegexOptions.IgnoreCase);

        var newSentence = regex.Replace(sentence, value);

        return newSentence;
    }

    private static string GenerateComplexString()
    {
        char[] chars = new char[62];

        chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();

        byte[] data = new byte[1];

        using (RNGCryptoServiceProvider crypto = new RNGCryptoServiceProvider())
        {
            crypto.GetNonZeroBytes(data);

            data = new byte[40];

            crypto.GetNonZeroBytes(data);
        }

        StringBuilder result = new StringBuilder(40);

        foreach (byte b in data)
        {
            result.Append(chars[b % (chars.Length)]);
        }

        return result.ToString();
    }

    public static string ValidateProcessAccess(int processID)
    {
        string sql = "";

        string accessRuleCriteria = "";

        string accessCriteria = "";

        List<string> accessRuleCriterias = new List<string>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new AppException(exp.Message, 10050);
            }

            sql = "select Sys_User_Roles.UserRoleID, Sys_UserRole_Accesses.AccessID, Sys_UserRole_Accesses.AccessRuleCriteria from Sys_User_Roles inner join Sys_UserRole_Accesses ON Sys_User_Roles.UserRoleID = Sys_UserRole_Accesses.UserRoleID where Sys_UserRole_Accesses.AccessID = 121000 and  Sys_User_Roles.UserID = " + SessionProvider.UserID;

            using (var command = new SqlCommand(sql, connection))
            {
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    command.CommandText = "select Sys_User_Groups.UserGroupID, Sys_UserGroup_Accesses.AccessID, Sys_UserGroup_Accesses.AccessRuleCriteria from Sys_User_Groups inner join Sys_UserGroup_Accesses ON Sys_User_Groups.UserGroupID = Sys_UserGroup_Accesses.UserGroupID  where Sys_UserGroup_Accesses.AccessID = 121000 and  Sys_User_Groups.UserID = " + SessionProvider.UserID;

                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    if (accessRuleCriterias.Count == 0)
                    {
                        int logID = LogProvider.LogException(10020, "Access is denied.", processID);

                        throw new Exception("Access is denied.");
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, processID);

                    throw new AppException(logID, exp.Message, 10060);
                }
            }
        }

        foreach (string _accessRuleCriteria in accessRuleCriterias)
        {
            string temp = _accessRuleCriteria.Replace("@SiteIDs", SessionProvider.SiteIDs.ToString());

            temp = temp.Replace("@SubRegionIDs", SessionProvider.SubRegionIDs.ToString());

            temp = temp.Replace("@RegionIDs", SessionProvider.RegionIDs.ToString());

            temp = temp.Replace("@UserID", SessionProvider.UserID.ToString());

            accessCriteria += " (" + temp + ") or";
        }

        return accessCriteria.Substring(0, accessCriteria.Length - 2);
    }

    public static string ValidateQueryAccess(int queryID)
    {
        string sql = "";

        string accessRuleCriteria = "";

        string accessCriteria = "";

        List<string> accessRuleCriterias = new List<string>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new AppException(exp.Message, 10050);
            }

            sql = "select Sys_User_Roles.UserRoleID, Sys_UserRole_Accesses.AccessID, Sys_UserRole_Accesses.AccessRuleCriteria from Sys_User_Roles inner join Sys_UserRole_Accesses ON Sys_User_Roles.UserRoleID = Sys_UserRole_Accesses.UserRoleID where Sys_UserRole_Accesses.AccessID = 123010 and  Sys_User_Roles.UserID = " + SessionProvider.UserID;

            using (var command = new SqlCommand(sql, connection))
            {
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    command.CommandText = "select Sys_User_Groups.UserGroupID, Sys_UserGroup_Accesses.AccessID, Sys_UserGroup_Accesses.AccessRuleCriteria from Sys_User_Groups inner join Sys_UserGroup_Accesses ON Sys_User_Groups.UserGroupID = Sys_UserGroup_Accesses.UserGroupID  where Sys_UserGroup_Accesses.AccessID = 123010 and  Sys_User_Groups.UserID = " + SessionProvider.UserID;

                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    if (accessRuleCriterias.Count == 0)
                    {
                        int logID = LogProvider.LogException(10020, "Access is denied.", queryID);

                        throw new Exception("Access is denied.");
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, queryID);

                    throw new AppException(logID, exp.Message, 10060);
                }
            }
        }

        foreach (string _accessRuleCriteria in accessRuleCriterias)
        {
            string temp = _accessRuleCriteria.Replace("@SiteIDs", SessionProvider.SiteIDs.ToString());

            temp = temp.Replace("@SubRegionIDs", SessionProvider.SubRegionIDs.ToString());

            temp = temp.Replace("@RegionIDs", SessionProvider.RegionIDs.ToString());

            temp = temp.Replace("@UserID", SessionProvider.UserID.ToString());

            accessCriteria += " (" + temp + ") or";
        }

        return accessCriteria.Substring(0, accessCriteria.Length - 2);
    }

    public static string ValidateReportAccess(int reportID)
    {
        string sql = "";

        string accessRuleCriteria = "";

        string accessCriteria = "";

        List<string> accessRuleCriterias = new List<string>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new AppException(exp.Message, 10050);
            }

            sql = "select Sys_User_Roles.UserRoleID, Sys_UserRole_Accesses.AccessID, Sys_UserRole_Accesses.AccessRuleCriteria from Sys_User_Roles inner join Sys_UserRole_Accesses ON Sys_User_Roles.UserRoleID = Sys_UserRole_Accesses.UserRoleID where Sys_UserRole_Accesses.AccessID = 123000 and  Sys_User_Roles.UserID = " + SessionProvider.UserID;

            using (var command = new SqlCommand(sql, connection))
            {
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    command.CommandText = "select Sys_User_Groups.UserGroupID, Sys_UserGroup_Accesses.AccessID, Sys_UserGroup_Accesses.AccessRuleCriteria from Sys_User_Groups inner join Sys_UserGroup_Accesses ON Sys_User_Groups.UserGroupID = Sys_UserGroup_Accesses.UserGroupID  where Sys_UserGroup_Accesses.AccessID = 123000 and  Sys_User_Groups.UserID = " + SessionProvider.UserID;

                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    if (accessRuleCriterias.Count == 0)
                    {
                        int logID = LogProvider.LogException(10020, "Access is denied.", reportID);

                        throw new Exception("Access is denied.");
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, reportID);

                    throw new AppException(logID, exp.Message, 10060);
                }
            }
        }

        foreach (string _accessRuleCriteria in accessRuleCriterias)
        {
            string temp = _accessRuleCriteria.Replace("@SiteIDs", SessionProvider.SiteIDs.ToString());

            temp = temp.Replace("@SubRegionIDs", SessionProvider.SubRegionIDs.ToString());

            temp = temp.Replace("@RegionIDs", SessionProvider.RegionIDs.ToString());

            temp = temp.Replace("@UserID", SessionProvider.UserID.ToString());

            accessCriteria += " (" + temp + ") or";
        }

        return accessCriteria.Substring(0, accessCriteria.Length - 2);
    }

    public static string ValidateEntityAccess(int modelID)
    {
        string sql = "";

        string accessRuleCriteria = "";

        string accessCriteria = "";

        List<string> accessRuleCriterias = new List<string>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new AppException(exp.Message, 10050);
            }

            sql = "select Sys_User_Roles.UserRoleID, Sys_UserRole_Accesses.AccessID, Sys_UserRole_Accesses.AccessRuleCriteria from Sys_User_Roles inner join Sys_UserRole_Accesses ON Sys_User_Roles.UserRoleID = Sys_UserRole_Accesses.UserRoleID where Sys_UserRole_Accesses.AccessID = 124000 and  Sys_User_Roles.UserID = " + SessionProvider.UserID;

            using (var command = new SqlCommand(sql, connection))
            {
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    command.CommandText = "select Sys_User_Groups.UserGroupID, Sys_UserGroup_Accesses.AccessID, Sys_UserGroup_Accesses.AccessRuleCriteria from Sys_User_Groups inner join Sys_UserGroup_Accesses ON Sys_User_Groups.UserGroupID = Sys_UserGroup_Accesses.UserGroupID  where Sys_UserGroup_Accesses.AccessID = 124000 and  Sys_User_Groups.UserID = " + SessionProvider.UserID;

                    using (var actReader = command.ExecuteReader())
                    {
                        if (actReader.Read())
                        {
                            accessRuleCriteria = actReader["AccessRuleCriteria"].ToString();

                            if (accessRuleCriteria == "All")
                            {
                                return "";
                            }
                            else
                            {
                                accessRuleCriterias.Add(accessRuleCriteria);
                            }
                        }
                    }

                    if (accessRuleCriterias.Count == 0)
                    {
                        int logID = LogProvider.LogException(10020, "Access is denied.", modelID);

                        throw new Exception("Access is denied.");
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, modelID);

                    throw new AppException(logID, exp.Message, 10060);
                }
            }
        }

        foreach (string _accessRuleCriteria in accessRuleCriterias)
        {
            string temp = _accessRuleCriteria.Replace("@SiteIDs", SessionProvider.SiteIDs.ToString());

            temp = temp.Replace("@SubRegionIDs", SessionProvider.SubRegionIDs.ToString());

            temp = temp.Replace("@RegionIDs", SessionProvider.RegionIDs.ToString());

            temp = temp.Replace("@UserID", SessionProvider.UserID.ToString());

            accessCriteria += " (" + temp + ") or";
        }

        return accessCriteria.Substring(0, accessCriteria.Length - 2);
    }
}