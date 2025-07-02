// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.0.0.0 
using System;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        #region Validate DbConn

        bool validateDbConn = SecurityProvider.ValidateDatabaseConnection();

        if (!validateDbConn)
        {
            Response.Redirect("Error.aspx?Id=xyu5PlZCsD");
        }

        #endregion

        #region Validate License

        bool validateLicense = LicenseProvider.ValidateLicense();

        if (!validateLicense)
        {
            Response.Redirect("Error.aspx?Id=ZTgR8muGTM");
        }

        #endregion

        #region initiate Config

        bool initiateConfig = ApplicationProvider.LoadPackageInfo();

        if (!initiateConfig)
        {
            Response.Redirect("Error.aspx?Id=7nUQJOvnS8");
        }

        initiateConfig = SysMembership.LoadSettings();

        if (!initiateConfig)
        {
            Response.Redirect("Error.aspx?Id=7nUQJOvnS8");
        }

        #endregion

        #region Validate Session

        int validateSession = SessionProvider.ValidateSession("NewSession");

        if (validateSession == 0)
        {
            Response.Redirect("Error.aspx?Id=GtbkBR9DsC");
        }

        if (validateSession == 2)
        {
            Response.Redirect("Error.aspx?Id=UBW1Q9flSC");
        }

        #endregion
    }
}