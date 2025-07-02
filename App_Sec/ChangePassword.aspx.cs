// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.3.0.0 
using System;
using System.Web;

public partial class ChangePassword : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        #region Validate License

        bool validateLicense = LicenseProvider.ValidateLicense();

        if (!validateLicense)
        {
            Response.Redirect("../Error.aspx?Id=ZTgR8muGTM");
        }

        #endregion

        #region Validate Session

        int validateSession = SessionProvider.ValidateSession("CurrentSession");

        if (validateSession == 2 || validateSession == 3)
        {
            Response.Redirect("../Error.aspx?Id=UBW1Q9flSC");
        }

        if (HttpContext.Current.Session["UserName"] == null)
        {
            Response.Redirect("../Error.aspx?Id=UBW1Q9flSC");
        }

        #endregion


        #region Validate Token

        bool validateToken = SessionProvider.ValidateToken(Request.Form["requestToken"]);

        if (!validateToken || Request.Form["requestToken"] == null)
        {
            Response.Redirect("../Error.aspx?Id=7RTbsrCM8A");
        }

        #endregion
    }
}