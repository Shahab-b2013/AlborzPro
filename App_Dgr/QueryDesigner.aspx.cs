// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.0.0
using System;

public partial class QueryDesigner : System.Web.UI.Page
{
    protected int PageID = 0;

    protected int ObjKey = 0;

    protected bool pageIsMain = false;

    protected void Page_Load(object sender, EventArgs e)
    {
        #region Validate Session

        int validateSession = SessionProvider.ValidateSession("CurrentSession");

        if (validateSession == 2 || validateSession == 3)
        {
            Response.Redirect("../Error.aspx?Id=UBW1Q9flSC");
        }

        #endregion

        #region Validate License

        bool validateLicense = LicenseProvider.ValidateLicense();

        if (!validateLicense)
        {
            Response.Redirect("../Error.aspx?Id=ZTgR8muGTM");
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
            PageID = Convert.ToInt32(Request["id"]);

            ObjKey = Convert.ToInt32(Request["objKey"]);
        }
        catch
        {
            Response.Redirect("../Error.aspx?Id=vy834W0CHH");
        }

        try
        {
            string acccessCriteria = SecurityProvider.ValidateQueryAccess(ObjKey);
        }
        catch
        {
            Response.Redirect("../Error.aspx?Id=uV5lKiONh5");
        }

        #endregion
    }
}