// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.1.0.0
using System;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.Text;

public static class SmsProvider
{
    public static bool SendSms(string mobileNo, int notificationRuleID, params string[] messageParts)
    {
        string source = null;
        string username = null;
        string password = null;
        string message = null;
        string provider = null;

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);
            }

            using (var command = new SqlCommand("select Sys_NotificationRules.NotificationRuleID, Sys_NotificationRules.RetryInterval, Sys_NotificationRules.DataTemplate, Sys_NotificationRules.RetryAttemps, Sys_NotifyMediaSettings.Name, Sys_NotifyMediaSettings.CurrentValue, Sys_NotifyMediaTypes.ProviderName from Sys_NotificationRules inner join Sys_NotifyMediaTypes on Sys_NotificationRules.MediaTypeID = Sys_NotifyMediaTypes.MediaTypeID inner join Sys_NotifyMediaSettings on Sys_NotifyMediaTypes.ProviderName = Sys_NotifyMediaSettings.ProviderName where Sys_NotificationRules.NotificationRuleID=" + notificationRuleID, connection))
            {
                {
                    try
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                if (reader.GetValue(4).ToString() == "SourceNumber")
                                {
                                    source = reader.GetValue(5).ToString();
                                }

                                if (reader.GetValue(4).ToString() == "UserName")
                                {
                                    username = reader.GetValue(5).ToString();
                                }

                                if (reader.GetValue(4).ToString() == "Password")
                                {
                                    password = reader.GetValue(5).ToString();
                                }

                                message = reader.GetValue(2).ToString();

                                provider = reader.GetValue(6).ToString();
                            }

                        }
                    }
                    catch (Exception exp)
                    {
                        int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, notificationRuleID);

                        return false;
                    }
                }
            }
        }

        message = string.Format(message, messageParts);

        int smsId = 0;

        if (provider == "SMS.Asanak") {

            string result = SendSmsByAsanak(mobileNo, message, username, password, source);

            if (result.Length > 8)
            {
                return int.TryParse(result.Substring(1,7), out smsId);
            }
        }

        return false;
    }

    private static string SendSmsByAsanak(string mobileNo, string message, string username, string password, string source)
    {
        Uri address = new Uri("http://panel.asanak.ir/webservice/v1rest/sendsms");

        HttpWebRequest request = WebRequest.Create(address) as HttpWebRequest;

        request.Method = "POST";
        request.ContentType = "application/x-www-form-urlencoded";

        StringBuilder data = new StringBuilder();
        data.Append("username=" + username);
        data.Append("&password=" + password);
        data.Append("&source=" + source);
        data.Append("&destination=" + mobileNo);
        data.Append("&message=" + message);
 
        byte[] byteData = UTF8Encoding.UTF8.GetBytes(data.ToString());
        request.ContentLength = byteData.Length;

        using (Stream postStream = request.GetRequestStream())
        {
            postStream.Write(byteData, 0, byteData.Length);
        }

        string result = null;
        using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
        {
            StreamReader reader = new StreamReader(response.GetResponseStream());
            result = reader.ReadToEnd();
        }

        SqlDataProvider.ExecuteNoneQuery(string.Format("insert into Sys_NotifyMediaLogs(ReceiverID, MessageBody, SentResult, SentDate) values ('{0}',N'{1}','{2}', GETDATE())", mobileNo, message, result));

        return result;
    }
}