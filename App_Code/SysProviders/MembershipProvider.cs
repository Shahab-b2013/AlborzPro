// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.0.0.0
using System;
using System.Data.SqlClient;
using System.Web;

public class SysMembership
{
    public SysMembership()
    {
    }

    public static bool LoadSettings()
    {
        if (HttpContext.Current.Application["MembershipInitiate"] != null)
        {
            return true;
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

                return false;
            }

            string query = "select * from Sys_Membership";

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        HttpContext.Current.Application.Add("MembershipInitiate", true);

                        HttpContext.Current.Application.Add("ProfileMenuEnabled", reader["ProfileMenuEnabled"]);

                        HttpContext.Current.Application.Add("ChangeProfileEnabled", reader["ChangeProfileEnabled"]);

                        HttpContext.Current.Application.Add("ChangeStatusEnabled", reader["ChangeStatusEnabled"]);

                        HttpContext.Current.Application.Add("ChangePasswordEnabled", reader["ChangePasswordEnabled"]);

                        HttpContext.Current.Application.Add("UserImageEnabled", reader["UserImageEnabled"]);

                        HttpContext.Current.Application.Add("UserAvaImageEnabled", reader["UserAvaImageEnabled"]);

                        HttpContext.Current.Application.Add("PersonalizeMenuEnabled", reader["PersonalizeMenuEnabled"]);

                        HttpContext.Current.Application.Add("AllowSavePassword", reader["AllowSavePassword"]);

                        HttpContext.Current.Application.Add("AllowDomainAuthentication", reader["AllowDomainAuthentication"]);

                        HttpContext.Current.Application.Add("AllowResetForgottenPassword", reader["AllowResetForgottenPassword"]);

                        HttpContext.Current.Application.Add("AllowSelfRegisterUser", reader["AllowSelfRegisterUser"]);

                        HttpContext.Current.Application.Add("DisplayAgreementMessage", reader["DisplayAgreementMessage"]);

                        HttpContext.Current.Application.Add("AgreementMessage", reader["AgreementMessage"]);

                        HttpContext.Current.Application.Add("LockUserOnFailedLogin", reader["LockUserOnFailedLogin"]);

                        HttpContext.Current.Application.Add("PasswordPolicy", reader["PasswordPolicy"]);

                        HttpContext.Current.Application.Add("ChangePasswordOnNextLogin", reader["ChangePasswordOnNextLogin"]);

                        HttpContext.Current.Application.Add("ChangePasswordPriod", reader["ChangePasswordPriod"]);

                        HttpContext.Current.Application.Add("UserSessionTimout", reader["UserSessionTimout"]);

                        HttpContext.Current.Application.Add("UserLoginTimout", reader["UserLoginTimout"]);

                        HttpContext.Current.Application.Add("DefaultPageID", reader["DefaultPageID"]);

                        HttpContext.Current.Application.Add("OnLoginSettingEnabled", reader["OnLoginSettingEnabled"]);
                    }
                }
            }

            catch (Exception exp)
            {
                LogProvider.LogException(10060, exp.Message, query);

                return false;
            }
        }

        return true;
    }

    public static bool AllowSavePassword
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["AllowSavePassword"]);
        }
    }

    public static bool AllowDomainAuthentication
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["AllowDomainAuthentication"]);
        }
    }

    public static bool AllowResetForgottenPassword
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["AllowResetForgottenPassword"]);
        }
    }

    public static bool AllowSelfRegisterUser
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["AllowSelfRegisterUser"]);
        }
    }

    public static bool DisplayAgreementMessage
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["DisplayAgreementMessage"]);
        }
    }

    public static string AgreementMessage
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["AgreementMessage"]);
        }
    }

    public static int LockUserOnFailedLogin
    {
        get
        {
            return Convert.ToInt32(HttpContext.Current.Application["LockUserOnFailedLogin"]);
        }
    }

    public static string PasswordPolicy
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["PasswordPolicy"]);
        }
    }

    public static bool ChangePasswordOnNextLogin
    {
        get
        {
            return Convert.ToBoolean(HttpContext.Current.Application["ChangePasswordOnNextLogin"]);
        }
    }

    public static int ChangePasswordPriod
    {
        get
        {
            return Convert.ToInt32(HttpContext.Current.Application["ChangePasswordPriod"]);
        }
    }

    public static int UserSessionTimout
    {
        get
        {
            return Convert.ToInt32(HttpContext.Current.Application["UserSessionTimout"]);
        }
    }

    public static int UserLoginTimout
    {
        get
        {
            return Convert.ToInt32(HttpContext.Current.Application["UserLoginTimout"]);
        }
    }

    public static int DefaultPageID
    {
        get
        {
            return Convert.ToInt32(HttpContext.Current.Application["DefaultPageID"]);
        }
    }
}
