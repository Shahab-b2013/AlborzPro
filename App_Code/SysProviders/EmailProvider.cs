// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.3.0.0 
using System;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Text;
    
public static class EmailProvider            
{       
    public static bool SendEmail(string emailID, string subject, int notificationRuleID, params string[] messageParts)
    {
        return SendEmail(emailID, notificationRuleID, subject,  null, null, null, messageParts);
    } 

    public static bool SendEmail(string emailID, string subject, string message, byte[] attFileStream, string attFileName)
    {
        return SendEmail(emailID, 0, subject, message, attFileStream, attFileName);
    }

    private static bool SendEmail(string emailID, int notificationRuleID, string subject, string message, byte[] attFileStream, string attFileName, params string[] messageParts)
    {
        string source = null;
        string username = null;
        string password = null;
        string provider = null;
        string port = null;
        string mailSender = null;
        string mailCC = null;

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
                                if (reader.GetValue(4).ToString() == "SmtpServer")
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

                                if (reader.GetValue(4).ToString() == "Port")
                                {
                                    port = reader.GetValue(5).ToString();
                                }

                                if (reader.GetValue(4).ToString() == "MailSender")
                                {
                                    mailSender = reader.GetValue(5).ToString();
                                }

                                if (reader.GetValue(4).ToString() == "MailCC")
                                {
                                    mailCC = reader.GetValue(5).ToString();
                                }

                                if (notificationRuleID != 0) //notificationRuleID by value 0 is free format
                                {
                                    message = reader.GetValue(2).ToString();

                                    message = string.Format(message, messageParts);
                                }

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

        if (provider == "Email.Default")
        {
            string msg = "Email sent successfully.";

            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient smtpServer = new SmtpClient(source, Convert.ToInt32(port));
                mail.From = new MailAddress(mailSender);
                mail.To.Add(new MailAddress(emailID));
                mail.CC.Add(mailCC);
                mail.Subject = subject;
                mail.SubjectEncoding = Encoding.UTF8;
                mail.BodyEncoding = Encoding.UTF8;
                mail.IsBodyHtml = true;
                mail.Priority = MailPriority.High;

                if (attFileName != null)
                {
                    Stream stream = new MemoryStream(attFileStream);
                    mail.Attachments.Add(new Attachment(stream, attFileName));
                }

                mail.Body = message;

                if (message.Contains("<table"))
                {
                    mail.Body = "*HTML CONTENT*";
                }

                smtpServer.Credentials = new NetworkCredential(username, password, "");

                smtpServer.Send(mail);

                SqlDataProvider.ExecuteNoneQuery(string.Format("insert into Sys_NotifyMediaLogs(ReceiverID, MessageBody, SentResult, SentDate) values ('{0}',N'{1}','{2}', GETDATE())", emailID, message, msg));

                return true;
            }
            catch (Exception e)
            {
                msg = e.Message.Replace("'","\"");
            }

            SqlDataProvider.ExecuteNoneQuery(string.Format("insert into Sys_NotifyMediaLogs(ReceiverID, MessageBody, SentResult, SentDate) values ('{0}',N'{1}',N'{2}', GETDATE())", emailID, message, msg));
        }

        return false;
    }
}                  