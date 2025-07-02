// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.4.0.0
using ImageProcessor;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Web;

public class MissionPdfGenerator
{
    public MissionPdfGenerator()
    {
    }

    static Font FaFont;

    static Font EnFont;        
     
    static Font FaBFont;

    static Font FaFont2;

    static Font EnBFont;

    public static void GenerateReport(int MissionID, bool saveInDb)
    {
        #region Fetch Mission Data

        string customer = null;
        string Department = null;
        string missionAddress = null;
        string employer = null;
        string employerEmailID = null;
        string employerContactNo = null;
        string employerPosition = null;
        string startDate = null;

        string agent = null;

        string causeOfReferral = null;
        string missionLabel = null;
        string responderLabel = null;
        string otherStaffs = null;
        string missionDescription = null;
        string responderUID = null;

        string summeryResult = null;
        bool noOtherError = false;
        string continueStatus = null;

        string consoleLog1 = null;
        string consoleLog2 = null;
        string consoleLog3 = null;
        string consoleLog4 = null;

        string startTime = null;
        string endTime = null;
        string serviceQuality = null;
        string employerComment = null;

        string employerSignature = null;
        string employerApproveType = null;
        string status = null;

        List<MissionProduct> products = new List<MissionProduct>();

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
                          " Msn_Missions.MissionID, " +
                          " dbo.NString2(Msn_Missions.EmployerLabel) AS EmployerLabel," +
                          " dbo.NString2(Msn_Missions.EmployerEmailID) AS EmployerEmailID," +
                          " dbo.NString2(Msn_Missions.EmployerContactNo) AS EmployerContactNo," +
                          " dbo.NString2(Msn_Missions.EmployerPosition) AS EmployerPosition," +
                          " dbo.NString2(Msn_Missions.SummeryResult) AS SummeryResult," +
                          " Msn_Missions.NoOtherError, " +
                          " Msn_Missions.CauseOfReferral," +
                          " dbo.ShDate2(Msn_Missions.StartDate) AS StartDate," +
                          " Msn_Missions.ContinueStatus," +
                          " dbo.NString2(Msn_Missions.Label) AS Label," +
                          " dbo.NString2(Msn_Missions.Description) AS Description," +
                          " Msn_Missions._LastModifyDate," +
                          " Crm_Customers.Label AS CustomerLabel," +
                          " Crm_Departments.Label AS DepartmentLabel," +
                          " Sys_Users.Label AS ResponderLabel," +
                          " dbo.NString2(Msn_Missions.MissionAddress) AS MissionAddress," +
                          " Msn_Missions.ConsoleLog1," +
                          " Msn_Missions.ConsoleLog2," +
                          " Msn_Missions.ConsoleLog3," +
                          " Msn_Missions.ConsoleLog4," +
                          " Crm_Agents.Label AS AgentLabel," +
                          " dbo.NString2(Msn_Missions.StartTime) AS StartTime," +
                          " dbo.NString2(Msn_Missions.EndTime) AS EndTime," +
                          " Msn_Missions.ServiceQuality," +
                          " dbo.NString2(Msn_Missions.EmployerComment) AS EmployerComment," +
                          " Msn_Missions.employerSignature," +
                          " Msn_Missions.ResponderUID," +
                          " Msn_Missions.Status," +
                          " Msn_Missions.EmployerApproveType" +
                          " FROM            Msn_Missions LEFT OUTER JOIN" +
                          " Crm_Customers ON Crm_Customers.CustomerID = Msn_Missions.CustomerID LEFT OUTER JOIN" +
                          " Crm_Departments ON Crm_Departments.DepartmentID = Msn_Missions.DepartmentID LEFT OUTER JOIN" +
                          " Sys_Users ON Sys_Users.UserID = Msn_Missions.ResponderUID LEFT OUTER JOIN" +
                          " Crm_Agents ON Crm_Agents.AgentID = Msn_Missions.AgentID" +
                          " WHERE(Msn_Missions._IsDeleted = 0) AND (Msn_Missions.MissionID =" + MissionID + ")", connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        customer = Convert.ToString(reader["CustomerLabel"]);
                        Department = Convert.ToString(reader["DepartmentLabel"]);
                        missionAddress = Convert.ToString(reader["MissionAddress"]);
                        employer = Convert.ToString(reader["EmployerLabel"]);
                        employerEmailID = Convert.ToString(reader["EmployerEmailID"]);
                        employerContactNo = Convert.ToString(reader["EmployerContactNo"]);
                        employerPosition = Convert.ToString(reader["EmployerPosition"]);
                        startDate = Convert.ToString(reader["StartDate"]);

                        agent = Convert.ToString(reader["AgentLabel"]);

                        causeOfReferral = Convert.ToString(reader["CauseOfReferral"]);
                        missionLabel = Convert.ToString(reader["Label"]);
                        responderLabel = Convert.ToString(reader["ResponderLabel"]);
                        missionDescription = Convert.ToString(reader["Description"]);
                        responderUID = Convert.ToString(reader["ResponderUID"]);

                        summeryResult = Convert.ToString(reader["SummeryResult"]);
                        noOtherError = Convert.ToBoolean(reader["NoOtherError"]); ;
                        continueStatus = Convert.ToString(reader["ContinueStatus"]);

                        consoleLog1 = Convert.ToString(reader["ConsoleLog1"]);
                        consoleLog2 = Convert.ToString(reader["ConsoleLog2"]);
                        consoleLog3 = Convert.ToString(reader["ConsoleLog3"]);
                        consoleLog4 = Convert.ToString(reader["ConsoleLog4"]);

                        startTime = Convert.ToString(reader["StartTime"]);
                        startTime = (startTime.Length == 4 ? startTime.Substring(0, 2) + ":" + startTime.Substring(2, 2) : startTime);
                        endTime = Convert.ToString(reader["EndTime"]);
                        endTime = (endTime.Length == 4 ? endTime.Substring(0, 2) + ":" + endTime.Substring(2, 2) : endTime);
                        serviceQuality = Convert.ToString(reader["ServiceQuality"]);
                        employerComment = Convert.ToString(reader["EmployerComment"]);

                        employerSignature = Convert.ToString(reader["EmployerSignature"]).Remove(0, 22);
                        employerApproveType = Convert.ToString(reader["EmployerApproveType"]);
                        status = Convert.ToString(reader["Status"]);
                    }

                    command.CommandText = "SELECT Label, LicenseCount, InstalledCount, UpgradedCount, dbo.ShDate(LastUpdateDate) AS LastUpdateDate, SerialNumber, dbo.ShDate(ExpireDate) AS ExpireDate, ProductVersion FROM Msn_MissionProducts WHERE (_IsDeleted = 0) AND (MissionID = " + MissionID + ")";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            products.Add(new MissionProduct(reader["Label"].ToString() + " نسخه " + reader["ProductVersion"].ToString(),
                                reader["LicenseCount"].ToString() + " / " + reader["InstalledCount"].ToString() + " / " + reader["UpgradedCount"].ToString(),
                                 reader["LastUpdateDate"].ToString(), reader["ExpireDate"].ToString(), reader["SerialNumber"].ToString()
                                ));
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.StackTrace, command.CommandText, MissionID);
                }
            }
        }

        #endregion

        #region Initiate PDF

        FileStream fs = new FileStream(HttpContext.Current.Server.MapPath("Resources") + "\\Mission_" + MissionID + ".pdf", FileMode.Create);
        iTextSharp.text.Document document = new iTextSharp.text.Document(PageSize.A4, -5, -5, 30, 30);
        PdfWriter writer = PdfWriter.GetInstance(document, fs);
        writer.PageEvent = new PageEvents(HttpContext.Current.Server.MapPath("Resources"), MissionID, startDate);
        document.AddAuthor("Amnpardaz Software Co.");
        document.AddCreator("Amnpardaz Software Co.");
        document.AddKeywords("Mission Report");
        document.AddSubject("Mission Report");
        document.AddTitle("Mission Report");
        document.Open();

        var fontPath = Environment.GetEnvironmentVariable("SystemRoot") + "\\Fonts\\BNazanin.ttf";
        var baseFont = BaseFont.CreateFont(fontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        FaFont = new Font(baseFont, 14, Font.NORMAL, BaseColor.BLACK);
        FaBFont = new Font(baseFont, 12, Font.BOLD, BaseColor.BLACK);
        FaFont2 = new Font(baseFont, 15, Font.NORMAL, BaseColor.BLACK);

        var fontPath2 = Environment.GetEnvironmentVariable("SystemRoot") + "\\Fonts\\Tahoma.ttf";
        var baseFont2 = BaseFont.CreateFont(fontPath2, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        EnFont = new Font(baseFont2, 12, Font.NORMAL, BaseColor.BLACK);
        EnBFont = new Font(baseFont2, 12, Font.BOLD, BaseColor.BLACK);

        #endregion

        #region Render Customer Info

        PdfPTable table = new PdfPTable(numColumns: 2);
        table.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        float[] widths = new float[] { 80, 20 };
        table.SetWidths(widths);

        table.AddCell(RenderCell("نام مشتری : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell(customer, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        table.AddCell(RenderCell("زیر مجموعه : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell(Department, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        table.AddCell(RenderCell("آدرس مراجعه : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell(missionAddress, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        table.AddCell(RenderCell("نام نماینده : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell(agent, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        table.AddCell(RenderCell("رابط مشتری : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell(employer, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        table.AddCell(RenderCell("تلفن رابط : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell(employerContactNo, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        table.AddCell(RenderCell("ایمیل رابط : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell(employerEmailID, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, EnFont));

        table.AddCell(RenderCell("", 1f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.BOTTOM_BORDER, FaBFont));
        table.AddCell(RenderCell("", 1f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.BOTTOM_BORDER, FaFont));

        #endregion

        #region Render Mission Info

        table.AddCell(RenderCell("عنوان ماموریت : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell5(missionLabel, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        table.AddCell(RenderCell("علت مراجعه : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell(causeOfReferral, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        table.AddCell(RenderCell("مسئول انجام : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell(responderLabel, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        table.AddCell(RenderCell("اعضای گروه : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell(otherStaffs, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        table.AddCell(RenderCell("درخواست ها / مشکلات : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.RIGHT_BORDER, FaBFont));
        table.AddCell(RenderCell5(missionDescription, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        table.AddCell(RenderCell("", 1f, Element.ALIGN_MIDDLE, Element.ALIGN_RIGHT, Rectangle.BOTTOM_BORDER, FaBFont));
        table.AddCell(RenderCell("", 1f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.BOTTOM_BORDER, FaFont));

        document.Add(table);

        #endregion

        PdfPCell pdfCell;

        PdfPTable innerTable;

        PdfPCell pdfCell2;

        if (products.Count > 0)
        {
            #region Render Mission Products

            table = new PdfPTable(numColumns: 1);
            table.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
            widths = new float[] { 120 };
            table.SetWidths(widths);
            table.SplitLate = false;

            pdfCell = new PdfPCell(new Phrase("", FaFont2));
            pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
            pdfCell.MinimumHeight = 10f;
            pdfCell.VerticalAlignment = Element.ALIGN_MIDDLE;
            pdfCell.Border = Rectangle.NO_BORDER;
            pdfCell.Padding = 0f;
            table.AddCell(pdfCell);

            pdfCell = new PdfPCell(new Phrase("محصولات نصب شده", FaFont2));
            pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
            pdfCell.MinimumHeight = 30f;
            pdfCell.VerticalAlignment = Element.ALIGN_MIDDLE;
            pdfCell.Border = Rectangle.NO_BORDER;
            pdfCell.Padding = 0f;
            table.AddCell(pdfCell);

            innerTable = new PdfPTable(numColumns: 5);
            innerTable.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
            innerTable.SpacingBefore = 0f;
            innerTable.SpacingAfter = 0f;
            widths = new float[] { 80, 120, 100, 200, 110 };
            innerTable.SetWidths(widths);
            innerTable.WidthPercentage = 100f;

            innerTable.AddCell(RenderCell("محصول / نسخه", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.RIGHT_BORDER, FaBFont));
            innerTable.AddCell(RenderCell("تعداد لایسنس / نصب شده / آپگرید شده", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.RIGHT_BORDER, FaBFont));
            innerTable.AddCell(RenderCell("تاریخ به روز رسانی", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.RIGHT_BORDER, FaBFont));
            innerTable.AddCell(RenderCell("تاریخ انقضای لایسنس", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.RIGHT_BORDER, FaBFont));
            innerTable.AddCell(RenderCell("شماره سریال", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.RIGHT_BORDER, FaBFont));

            foreach (MissionProduct product in products)
            {
                innerTable.AddCell(RenderCell(product.Version, 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont));
                innerTable.AddCell(RenderCell(product.License, 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont));
                innerTable.AddCell(RenderCell(product.Update, 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont));
                innerTable.AddCell(RenderCell(product.Expire, 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont));
                innerTable.AddCell(RenderCell(product.Serial, 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, EnFont));

            }

            pdfCell2 = new PdfPCell();
            pdfCell2.AddElement(innerTable);
            pdfCell2.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
            pdfCell2.VerticalAlignment = Element.ALIGN_MIDDLE;
            pdfCell2.Padding = 0f;
            table.AddCell(pdfCell2);

            document.Add(table);

            #endregion
        }

        #region Render Mission Cases

        #endregion

        #region Render Mission Final Report

        table = new PdfPTable(numColumns: 1);
        table.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        widths = new float[] { 120 };
        table.SetWidths(widths);
        table.SplitLate = false;

        pdfCell = new PdfPCell(new Phrase("", FaFont2));
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.MinimumHeight = 10f;
        pdfCell.VerticalAlignment = Element.ALIGN_MIDDLE;
        pdfCell.Border = Rectangle.NO_BORDER;
        pdfCell.Padding = 0f;
        table.AddCell(pdfCell);

        pdfCell = new PdfPCell(new Phrase("گزارش نهایی", FaFont2));
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.MinimumHeight = 30f;
        pdfCell.VerticalAlignment = Element.ALIGN_MIDDLE;
        pdfCell.Border = Rectangle.NO_BORDER;
        pdfCell.Padding = 0f;
        table.AddCell(pdfCell);

        innerTable = new PdfPTable(numColumns: 1);
        innerTable.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        innerTable.SpacingBefore = 0f;
        innerTable.SpacingAfter = 0f;
        widths = new float[] { 120 };
        innerTable.SetWidths(widths);
        innerTable.WidthPercentage = 100f;

        innerTable.AddCell(RenderCell("خلاصه گزارش : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.RIGHT_BORDER, FaBFont));
        innerTable.AddCell(RenderCell4(summeryResult, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        innerTable.AddCell(RenderCell("وضعیت ماموریت : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.RIGHT_BORDER, FaBFont));
        innerTable.AddCell(RenderCell(continueStatus, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        innerTable.AddCell(RenderCell("سایر مشکلات : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.RIGHT_BORDER, FaBFont));
        innerTable.AddCell(RenderCell((noOtherError ? "غیر از موارد مندرج در این گزارش مشکلی دیگری مشاهده نشد." : ""), 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        pdfCell2 = new PdfPCell();
        pdfCell2.AddElement(innerTable);
        pdfCell2.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell2.VerticalAlignment = Element.ALIGN_MIDDLE;
        pdfCell2.Padding = 0f;
        table.AddCell(pdfCell2);

        document.Add(table);

        #endregion

        #region Render Mission Log Report

        table = new PdfPTable(numColumns: 1);
        table.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        widths = new float[] { 120 };
        table.SetWidths(widths);
        table.SplitLate = false;

        pdfCell = new PdfPCell(new Phrase("", FaFont2));
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.MinimumHeight = 10f;
        pdfCell.VerticalAlignment = Element.ALIGN_MIDDLE;
        pdfCell.Border = Rectangle.NO_BORDER;
        pdfCell.Padding = 0f;
        table.AddCell(pdfCell);

        pdfCell = new PdfPCell(new Phrase("بررسی لاگ های کنسول", FaFont2));
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.MinimumHeight = 30f;
        pdfCell.VerticalAlignment = Element.ALIGN_MIDDLE;
        pdfCell.Border = Rectangle.NO_BORDER;
        pdfCell.Padding = 0f;
        table.AddCell(pdfCell);

        innerTable = new PdfPTable(numColumns: 4);
        innerTable.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        innerTable.SpacingBefore = 0f;
        innerTable.SpacingAfter = 0f;
        widths = new float[] { 20, 40, 20, 40 };
        innerTable.SetWidths(widths);
        innerTable.WidthPercentage = 100f;

        innerTable.AddCell(RenderCell("عنوان", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.RIGHT_BORDER, FaBFont));
        innerTable.AddCell(RenderCell("تعداد", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.RIGHT_BORDER, FaBFont));
        innerTable.AddCell(RenderCell("عنوان", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.RIGHT_BORDER, FaBFont));
        innerTable.AddCell(RenderCell("تعداد", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.RIGHT_BORDER, FaBFont));

        innerTable.AddCell(RenderCell("کل بدافزارهای شناسایی شده", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont));
        innerTable.AddCell(RenderCell(consoleLog1, 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont2));
        innerTable.AddCell(RenderCell("تعداد حملات شبکه", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont));
        innerTable.AddCell(RenderCell(consoleLog3, 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont2));

        innerTable.AddCell(RenderCell("کل بدافزارهای پاک سازی شده", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont));
        innerTable.AddCell(RenderCell(consoleLog2, 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont2));

        innerTable.AddCell(RenderCell("تعداد سیستم های حمله کننده", 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont));
        innerTable.AddCell(RenderCell(consoleLog4, 25f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, 9, FaFont2));

        pdfCell2 = new PdfPCell();
        pdfCell2.AddElement(innerTable);
        pdfCell2.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell2.VerticalAlignment = Element.ALIGN_MIDDLE;
        pdfCell2.Padding = 0f;
        table.AddCell(pdfCell2);

        document.Add(table);

        #endregion

        #region Render Mission Final Approve

        table = new PdfPTable(numColumns: 1);
        table.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        widths = new float[] { 120 };
        table.SetWidths(widths);
        table.SplitLate = false;

        pdfCell = new PdfPCell(new Phrase("", FaFont2));
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.MinimumHeight = 10f;
        pdfCell.VerticalAlignment = Element.ALIGN_MIDDLE;
        pdfCell.Border = Rectangle.NO_BORDER;
        pdfCell.Padding = 0f;
        table.AddCell(pdfCell);

        pdfCell = new PdfPCell(new Phrase("گواهی تایید انجام کار", FaFont2));
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.MinimumHeight = 30f;
        pdfCell.VerticalAlignment = Element.ALIGN_MIDDLE;
        pdfCell.Border = Rectangle.NO_BORDER;
        pdfCell.Padding = 0f;
        table.AddCell(pdfCell);

        innerTable = new PdfPTable(numColumns: 1);
        innerTable.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        innerTable.SpacingBefore = 0f;
        innerTable.SpacingAfter = 0f;
        widths = new float[] { 120 };
        innerTable.SetWidths(widths);
        innerTable.WidthPercentage = 100f;

        innerTable.AddCell(RenderCell("گواهی می شود خدمات فوق از ساعت " + startTime + " الی " + endTime + " توسط آقای " + responderLabel + " انجام و مورد تایید اینجانب " + employer + " با سمت " + employerPosition + " می باشد.", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.RIGHT_BORDER, FaFont2));

        innerTable.AddCell(RenderCell("کیفیت خدمت ارائه شده به خود را چگونه ارزیابی می کنید : ", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.RIGHT_BORDER, FaBFont));
        innerTable.AddCell(RenderCell(serviceQuality, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        innerTable.AddCell(RenderCell("نظر کارفرما / مشتری :", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.RIGHT_BORDER, FaBFont));
        innerTable.AddCell(RenderCell4(employerComment, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_LEFT, Rectangle.LEFT_BORDER, FaFont));

        pdfCell2 = new PdfPCell();
        pdfCell2.AddElement(innerTable);
        pdfCell2.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell2.VerticalAlignment = Element.ALIGN_MIDDLE;
        pdfCell2.Padding = 0f;
        table.AddCell(pdfCell2);

        document.Add(table);

        #endregion

        #region Render Mission Signatures

        table = new PdfPTable(numColumns: 3);
        table.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        widths = new float[] { 40, 40, 40 };
        table.SetWidths(widths);
        table.SplitLate = false;

        table.AddCell(RenderCell("امضای مسئول انجام کار", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaFont2));
        if (employerApproveType == "امضای دیجیتال")
        {
            table.AddCell(RenderCell("امضای مشتری / کارفرما", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaFont2));
        }
        else
        {
            table.AddCell(RenderCell("", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaFont2));

        }
        if (status == "بسته شده")
        {
            table.AddCell(RenderCell("امضای مدیر پشتیبانی", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaFont2));
        }
        else
        {
            table.AddCell(RenderCell("", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaFont2));
        }

        //Row2
        table.AddCell(RenderCell3(HttpContext.Current.Server.MapPath("Resources") + "\\Signatures\\User_" + responderUID + ".png", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaFont2));
        if (employerApproveType == "امضای دیجیتال")
        {
            table.AddCell(RenderCell2(employerSignature, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaFont2));
        }
        else
        {
            table.AddCell(RenderCell("", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaFont2));
        }
        if (status == "بسته شده")
        {
            table.AddCell(RenderCell3(HttpContext.Current.Server.MapPath("Resources") + "\\Signatures\\SupportManager.png", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaFont2));
        }
        else
        {
            table.AddCell(RenderCell("", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaFont2));
        }

        //Row3
        table.AddCell(RenderCell(responderLabel, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaBFont));
        if (employerApproveType == "امضای دیجیتال")
        {
            table.AddCell(RenderCell(employer, 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaBFont));
        }
        else
        {
            table.AddCell(RenderCell("", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaBFont));
        }
        if (status == "بسته شده")
        {
            table.AddCell(RenderCell("مسعود فراهانی", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaBFont));
        }
        else
        {
            table.AddCell(RenderCell("", 30f, Element.ALIGN_MIDDLE, Element.ALIGN_CENTER, Rectangle.NO_BORDER, FaBFont));
        }

        document.Add(table);

        #endregion

        document.Close();
        writer.Close();
        fs.Close();

        #region Save Mission PDF File in Db

        string query = "INSERT INTO Sys_AttachFiles(AttachCode, ContentType, OrginalName, FileType, FileExtension, BinaryContent, LocationPath) VALUES (N'@AttachCode',N'@ContentType',N'@OrginalName',N'@FileType',N'@FileExtension',@BinaryContent,N'@LocationPath');UPDATE Msn_Missions SET ReportAttachment=N'@AttachCode' WHERE (MissionID=@MissionID)";

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

            var attachCode = GenerateRandomString();

            query = query.Replace("@AttachCode", attachCode);
            query = query.Replace("@ContentType", "application/pdf");
            query = query.Replace("@OrginalName", "گزارش ماموریت_" + MissionID);
            query = query.Replace("@FileType", "pdf");
            query = query.Replace("@FileExtension", "pdf");
            query = query.Replace("N'@LocationPath'", "NULL");
            query = query.Replace("@MissionID", MissionID.ToString());

            FileStream fStream = File.OpenRead(HttpContext.Current.Server.MapPath("Resources") + "\\" + "Mission_" + MissionID + ".pdf");
            byte[] contents = new byte[fStream.Length];
            fStream.Read(contents, 0, (int)fStream.Length);
            fStream.Close();

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    command.Parameters.AddWithValue("@BinaryContent", contents);
                    command.ExecuteNonQuery();
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query);
                }
            }
        }

        #endregion
    }

    private static PdfPCell RenderCell(string text, float minimumHeight, int verticalAlignment, int horizontalAlignment, int border, Font font)
    {
        PdfPCell pdfCell = new PdfPCell(new Phrase(text, font));
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.MinimumHeight = minimumHeight;
        pdfCell.VerticalAlignment = verticalAlignment;
        pdfCell.HorizontalAlignment = horizontalAlignment;
        pdfCell.Border = border;
        return pdfCell;
    }

    private static PdfPCell RenderCell2(string base64String, float minimumHeight, int verticalAlignment, int horizontalAlignment, int border, Font font)
    {
        Image img = Image.GetInstance(Base64ToImage(base64String), BaseColor.WHITE);
        PdfPCell pdfCell = new PdfPCell(img);
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.MinimumHeight = minimumHeight;
        pdfCell.VerticalAlignment = verticalAlignment;
        pdfCell.HorizontalAlignment = horizontalAlignment;
        pdfCell.Border = border;
        pdfCell.PaddingTop = 10;
        return pdfCell;
    }

    private static PdfPCell RenderCell3(string imgPath, float minimumHeight, int verticalAlignment, int horizontalAlignment, int border, Font font)
    {
        Image img = Image.GetInstance(imgPath);
        PdfPCell pdfCell = new PdfPCell(img);
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.MinimumHeight = minimumHeight;
        pdfCell.VerticalAlignment = verticalAlignment;
        pdfCell.HorizontalAlignment = horizontalAlignment;
        pdfCell.Border = border;
        pdfCell.PaddingTop = 10;
        return pdfCell;
    }

    private static PdfPCell RenderCell4(string text, float minimumHeight, int verticalAlignment, int horizontalAlignment, int border, Font font)
    {
        PdfPCell pdfCell = new PdfPCell(new Phrase(text, font));
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.MinimumHeight = minimumHeight;
        pdfCell.VerticalAlignment = verticalAlignment;
        pdfCell.HorizontalAlignment = Element.ALIGN_JUSTIFIED;
        pdfCell.Border = border;
        pdfCell.PaddingBottom = 10f;
        FontSelector fontSelector = new FontSelector();
        if (FaFont.Familyname != "unknown")
        {
            fontSelector.AddFont(FaFont);
        }
        if (EnFont.Familyname != "unknown")
        {
            fontSelector.AddFont(EnFont);
        }
        pdfCell.Phrase = fontSelector.Process(text);
        pdfCell.SetLeading(0f, 2f);
        return pdfCell;
    }

    private static PdfPCell RenderCell5(string text, float minimumHeight, int verticalAlignment, int horizontalAlignment, int border, Font font)
    {
        PdfPCell pdfCell = new PdfPCell(new Phrase(text, font));
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.MinimumHeight = minimumHeight;
        pdfCell.VerticalAlignment = verticalAlignment;
        pdfCell.HorizontalAlignment = horizontalAlignment;
        pdfCell.Border = border;
        FontSelector fontSelector = new FontSelector();
        if (FaFont.Familyname != "unknown")
        {
            fontSelector.AddFont(FaFont);
        }
        if (EnFont.Familyname != "unknown")
        {
            fontSelector.AddFont(EnFont);
        }
        pdfCell.Phrase = fontSelector.Process(text);
        return pdfCell;
    }

    private static System.Drawing.Image Base64ToImage(string base64String)
    {
        byte[] photoBytes = Convert.FromBase64String(base64String);

        System.Drawing.Size size = new System.Drawing.Size(200, 100);

        using (MemoryStream inStream = new MemoryStream(photoBytes))
        {
            using (MemoryStream outStream = new MemoryStream())
            {
                using (ImageFactory imageFactory = new ImageFactory())
                {
                    // Load, resize, set the format and quality and save an image.
                    imageFactory.Load(inStream)
                                .Resize(size)
                                .Format(new ImageProcessor.Imaging.Formats.PngFormat())
                                .BackgroundColor(System.Drawing.Color.White)
                                .Save(outStream);
                }

                return System.Drawing.Image.FromStream(outStream);
            }
        }
    }

    private static string GenerateRandomString()
    {
        char[] chars = new char[62];

        chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();

        byte[] data = new byte[1];

        using (RNGCryptoServiceProvider crypto = new RNGCryptoServiceProvider())
        {
            crypto.GetNonZeroBytes(data);

            data = new byte[24];

            crypto.GetNonZeroBytes(data);
        }

        StringBuilder result = new StringBuilder(24);

        foreach (byte b in data)
        {
            result.Append(chars[b % (chars.Length)]);
        }

        return result.ToString();
    }
}

public class PageEvents : PdfPageEventHelper
{
    Font FaFont;

    Font FaFont2;

    string CurPath;

    int Id;

    string Date;

    public PageEvents(string curPath, int id, string date)
    {
        var fontPath = Environment.GetEnvironmentVariable("SystemRoot") + "\\fonts\\BNazanin.ttf";
        var baseFont = BaseFont.CreateFont(fontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        FaFont = new Font(baseFont, 13, Font.NORMAL, BaseColor.BLACK);
        FaFont2 = new Font(baseFont, 13, Font.BOLD, BaseColor.BLACK);

        CurPath = curPath;
        Id = id;
        Date = date;
    }

    public override void OnStartPage(PdfWriter writer, iTextSharp.text.Document document)
    {
        base.OnStartPage(writer, document);

        PdfPTable table = new PdfPTable(numColumns: 3);
        table.RunDirection = PdfWriter.RUN_DIRECTION_RTL;

        if (writer.PageNumber > 1)
        {
            table.SpacingAfter = 20f;
        }

        float[] widths = new float[] { 25, 40, 25 };
        table.SetWidths(widths);

        Image img = Image.GetInstance(CurPath + "\\" + "Logo_Fa.jpg");
        img.ScaleAbsolute(190f, 40f);
        PdfPCell pdfCell = new PdfPCell(img,true);
        pdfCell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell.HorizontalAlignment = Element.ALIGN_CENTER;
        pdfCell.VerticalAlignment = Element.ALIGN_MIDDLE;
        pdfCell.MinimumHeight = 35f;

        PdfPCell pdfCell2 = new PdfPCell(new Phrase("گزارش ماموریت", FaFont2));
        pdfCell2.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell2.HorizontalAlignment = Element.ALIGN_CENTER;
        pdfCell2.MinimumHeight = 35f;

        PdfPCell pdfCell3 = new PdfPCell(new Phrase("شماره : " + Id + Environment.NewLine + "تاریخ : " + Date, FaFont));
        pdfCell3.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
        pdfCell3.HorizontalAlignment = Element.ALIGN_CENTER;
        pdfCell3.MinimumHeight = 35f;

        table.AddCell(pdfCell);
        table.AddCell(pdfCell2);
        table.AddCell(pdfCell3);
        document.Add(table);
    }

    public string Reverse(string text)
    {
        char[] cArray = text.ToCharArray();
        string reverse = String.Empty;
        for (int i = cArray.Length - 1; i > -1; i--)
        {
            reverse += cArray[i];
        }
        return reverse;
    }
}

public class MissionProduct
{
    public string Version;

    public string License;

    public string Update;

    public string Expire;

    public string Serial;

    public MissionProduct(string version, string license, string update, string expire, string serial)
    {
        this.Version = version;
        this.License = license;
        this.Update = update;
        this.Expire = expire;
        this.Serial = serial;
    }
}