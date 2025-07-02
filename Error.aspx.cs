// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.4.1.0
using System;

public partial class Error : System.Web.UI.Page
{
    public string ErrorMessage = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        #region Switch Error

        switch (Request["Id"])
        {
            //case "GtbkBR9DsC": ErrorMessage = "یک نسخه از برنامه توسط این مرورگر بر روی سیستم در حال استفاده است و امکان برقراری نشست مجدد وجود ندارد."; break;
            case "GtbkBR9DsC": ErrorMessage = "Duplicate session id error in your browser."; break;

            //case "xyu5PlZCsD": ErrorMessage = "خطا در ارتباط با پایگاه داده. لطفا با مدیر نرم افزار تماس بگیرید."; break;
            case "xyu5PlZCsD": ErrorMessage = "Database connection error ."; break;

            //case "ZTgR8muGTM": ErrorMessage = "لایسنس محصول نامعتبر است. لطفا با مدیر نرم افزار تماس بگیرید."; break;
            case "ZTgR8muGTM": ErrorMessage = "Invalid license error."; break;

            //case "7nUQJOvnS8": ErrorMessage = "بارگذاری اولیه محصول با خطا مواجه شد. لطفا با مدیر نرم افزار تماس بگیرید."; break;
            case "7nUQJOvnS8": ErrorMessage = "Failed to initiate application context."; break;

            //case "UBW1Q9flSC": ErrorMessage = "نشست شما نامعتبر است."; break;
            case "UBW1Q9flSC": ErrorMessage = "Your session is invalid or expired."; break;

            //case "vy834W0CHH": ErrorMessage = "داده های ورودی نامعتبر است."; break;
            case "vy834W0CHH": ErrorMessage = "One of the request inputs is not valid."; break;

            //case "7RTbsrCM8A": ErrorMessage = "درخواست شما نامعتبر است."; break;
            case "7RTbsrCM8A": ErrorMessage = "Your request is invalid."; break;

            //case "uV5lKiONh5": ErrorMessage = "دسترسی شما نامعتبر است."; break;
            case "uV5lKiONh5": ErrorMessage = "Access Denied, You don't have permission to perform this action."; break;

            //case "aMd19fl4C": ErrorMessage = "در اجرای عملیات یک خطای پیش بینی نشده رخ داد."; break;
            case "aMd19fl4C": ErrorMessage = "Unhandled exception has occurred."; break;

            //case "AFL1M9fYSX": ErrorMessage = "لایسنس نرم افزار منقضی شده است.لطفا نسبت به تمدید آن اقدام نمایید."; break;
            case "AFL1M9fYSX": ErrorMessage = "Unhandled exception has occurred. Please contact the system administrator."; break;
        }

        #endregion

        #region Error Logging

        if (Request["Id"] == "GtbkBR9DsC")
        {
            LogProvider.LogException(10011, "Duplicated SessionID (on single browser) is invalid.");

            Response.Redirect("Default.aspx");
        }

        if (Request["Id"] == "ftbkaR9msC")
        {
            LogProvider.LogException(10011, "Token is invalid.");

            Response.Redirect("Default.aspx");
        }

        if (Request["Id"] == "UBW1Q9flSC")
        {
            LogProvider.LogException(10010, "Session is invalid. (Redirect to error page)");

            Response.Redirect("Default.aspx");
        }

        if (Request["Id"] == "7RTbsrCM8A")
        {
            LogProvider.LogException(10100, "Request is invalid.");
        }

        if (Request["Id"] == "vy834W0CHH")
        {
            LogProvider.LogException(10040, "Request Inputs is invalid.");
        }

        if (Request["Id"] == "uV5lKiONh5")
        {
            LogProvider.LogException(10041, "Request Inputs is invalid.");
        }

        if (SessionProvider.SessionStatus != "Login" && Request["Id"] != "xyu5PlZCsD")
        {
            SessionProvider.AbandonSession();
        }

        if (Request["Id"] == "aMd19fl4C" || Request["Id"] == "AFL1M9fYSX")
        {
            SessionProvider.AbandonSession();
        }

        #endregion
    }
}




