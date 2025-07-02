// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.4.0.0
using System;
using System.Data.SqlClient;
using System.IO;
using System.Net.Mail;
using System.Text;
 
public class MissionEmailSender 
{
    public MissionEmailSender() { }      
          
    public static void SendReport(int MissionID, string cc, string bcc)
    {
        #region Fetch Mission Data

        string employerEmailID = null;
        string startDate = "";
        string employerEmailStatus = null;
        string responder = "";
        byte[] content = null;

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

            using (var command = new SqlCommand("SELECT        " +
                            " Msn_Missions.EmployerEmailStatus," +
                            " Msn_Missions.EmployerEmailID," +
                            " Sys_Users.Label," +
                            " dbo.ShDate(Msn_Missions.StartDate) AS StartDate," +
                            " Sys_AttachFiles.BinaryContent" +
                            " FROM Msn_Missions INNER JOIN Sys_AttachFiles ON Msn_Missions.ReportAttachment = Sys_AttachFiles.AttachCode" +
                            " INNER JOIN Sys_Users ON Msn_Missions.ResponderUID = Sys_Users.UserID" +
                            " WHERE(Msn_Missions._IsDeleted = 0) AND (Msn_Missions.EmployerEmailID IS NOT NULL AND Msn_Missions.EmployerEmailID<>'') AND (Msn_Missions.MissionID =" + MissionID + ")", connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {

                            employerEmailID = Convert.ToString(reader["EmployerEmailID"]).Replace("&ndash;", "-").Replace("&#95;", "_");
                            startDate = Convert.ToString(reader["StartDate"]);
                            employerEmailStatus = Convert.ToString(reader["EmployerEmailStatus"]);
                            responder = Convert.ToString(reader["Label"]);
                            content = (byte[])reader["BinaryContent"];
                        }
                        else
                            return;
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.StackTrace, command.CommandText, MissionID);
                }
            }
        }

        #endregion  

        string subject = "پشتیبانی پادویش - گزارش ماموریت " + startDate + " - " + "شماره " + MissionID;

        string attFileName = "Report " + MissionID + ".pdf";

        StringBuilder emailBody = new StringBuilder();
        emailBody.AppendLine("<table dir='rtl' style='font-family:Tahoma;width:100%;'>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;text-align:center;' colspan='2'>به نام خدا</td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;font-size:13px;' colspan='2'><br/><br/></td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;font-size:13px;' colspan='2'>با سلام</td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;font-size:13px;' colspan='2'><br/></td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;font-size:14px;' colspan='2'>گزارش ماموریت حضوری کارشناس پشتیبانی پادویش به پیوست خدمتتان ارسال می گردد.</td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;font-size:13px;' colspan='2'><br/></td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;color:#8A2BE2;width:150px;font-size:14px;' colspan='1'>شماره ماموریت : </td><td style='font-family:Tahoma;font-size:14px;'>" + MissionID + "</td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;color:#8A2BE2;width:150px;font-size:14px;' colspan='1'>تاریخ ماموریت : </td><td style='font-family:Tahoma;font-size:14px;'>" + startDate + "</td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;color:#8A2BE2;width:150px;font-size:14px;' colspan='1'>کارشناس ماموریت : </td><td style='font-family:Tahoma;font-size:14px;' > " + responder + "</td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;font-size:13px;' colspan='2'><br/></td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;font-weight:bold;color:#8A2BE2;text-align:right;' colspan='2'><hr style='color:#8A2BE2'/></td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;font-size:15px;font-weight:bold;color:#8A2BE2' colspan='2'>شرکت نرم افزاری امن پرداز</td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;font-weight:bold;color:#8A2BE2;font-size:13px;' colspan='2'>مرکز پشتیبانی محصولات پادویش</td></tr>");
        emailBody.AppendLine("<tr><td style='font-family:Tahoma;font-weight:bold;color:#8A2BE2;font-size:12px;' colspan='2'>تلفن: ۴۳۹۱۲۰۰۰-۰۲۱  فکس: ۴۳۹۱۲۸۰۰-۰۲۱</td></tr>");
        emailBody.AppendLine(" </table> ");

        string msg = "Email sent successfully.";

        bool sendStatus = EmailProvider.SendEmail(employerEmailID, subject, emailBody.ToString(), content, attFileName);

        if (!sendStatus)
        {
            msg = "Failure sending mail.";
        }

        SqlDataProvider.ExecuteNoneQuery("UPDATE Msn_Missions SET ReportSentDate=GETDATE(), EmployerEmailStatus=N'" + msg + "' WHERE MissionID=" + MissionID);

    }
}
      