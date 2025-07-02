// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.4.0.0
using System;

public partial class Register : System.Web.UI.Page
{
    protected int PageID = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        #region Validate DbConn

        bool validateDbConn = SecurityProvider.ValidateDatabaseConnection();

        if (!validateDbConn)
        {
            Response.Redirect("../Error.aspx?Id=xyu5PlZCsD");
        }

        #endregion

        #region Validate Session

        int validateSession = SessionProvider.ValidateSession("NewSession");

        if (validateSession == 2 || validateSession == 3)
        {
            Response.Redirect("../Error.aspx?Id=UBW1Q9flSC");
        }

        SessionProvider.SetValue("SessionLanguage", ApplicationProvider.AppLanguage);

        #endregion

        #region Validate License

        bool validateLicense = LicenseProvider.ValidateLicense();

        if (!validateLicense)
        {
            Response.Redirect("../Error.aspx?Id=ZTgR8muGTM");
        }

        #endregion

        #region initiate Config

        bool initiateConfig = ApplicationProvider.LoadPackageInfo();

        if (!initiateConfig)
        {
            Response.Redirect("../Error.aspx?Id=7nUQJOvnS8");
        }

        initiateConfig = SysMembership.LoadSettings();

        if (!initiateConfig)
        {
            Response.Redirect("../Error.aspx?Id=7nUQJOvnS8");
        }

        #endregion

        #region Validate Token

        bool validateToken = SessionProvider.ValidateToken(Request.Form["requestToken"]);

        if (!validateToken)
        {
            Response.Redirect("../Error.aspx?Id=7RTbsrCM8A");
        }

        #endregion

        #region Validate Access

        try
        {
            PageID = 200000;// Convert.ToInt32(Request["id"]);
        }
        catch
        {
            Response.Redirect("../Error.aspx?Id=vy834W0CHH");
        }

        #endregion
    }
}