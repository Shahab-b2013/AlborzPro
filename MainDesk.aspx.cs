// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.5.0.0
using System;

public partial class MainDesk : System.Web.UI.Page
{
    protected int PageID = 0;

    protected int ObjKey = 0;

    protected int DefaultContextID = 0;

    protected string DefaultContextType = null;

    protected bool IsRedirected = false;

    protected Guid UserGuid;

    protected string SearchKey = null;

    protected string SearchVal = null;

    protected string SearchLbl = null;

    protected void Page_Load(object sender, EventArgs e)
    {

        if (SessionProvider.GetValue("ForceChangePassword") == "1")
            Response.Redirect("App_Sec/ChangePassword.aspx");

        #region Process Redirection

        IsRedirected = Guid.TryParse(Request["authKey"], out UserGuid);

        if (IsRedirected)
        {
            #region Validate DbConn

            bool validateDbConn = SecurityProvider.ValidateDatabaseConnection();

            if (!validateDbConn)
            {
                Response.Redirect("Error.aspx?Id=xyu5PlZCsD");
            }

            #endregion

            #region Validate License

            bool _validateLicense = LicenseProvider.ValidateLicense();

            if (!_validateLicense)
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

            int _validateSession = 0;

            _validateSession = SessionProvider.ValidateSession("NewSession");

            if (_validateSession == 0)
            {
                Response.Redirect("Error.aspx?Id=GtbkBR9DsC");
            }

            if (_validateSession == 2)
            {
                Response.Redirect("Error.aspx?Id=UBW1Q9flSC");
            }

            //bool loginValid = Membership.LoginSession(UserGuid);
            bool loginValid = Membership.LoginSsoSession(Session.SessionID);

            if (!loginValid)
            {
                Response.Redirect("Error.aspx?Id=jBv1Q9flAC");
            }

            SessionProvider.SetValue("UserGuid", UserGuid.ToString());

            SessionProvider.SetValue("IsRedirected", IsRedirected);

            SessionProvider.SetValue("RedirectObjectID", Request["objKey"]);

            //SessionProvider.SetValue("DefaultPageID", Convert.ToInt32(Request["id"]));

            #endregion
        }

        #endregion

        #region Validate Session

        int validateSession = SessionProvider.ValidateSession("CurrentSession");

        if (validateSession == 2 || validateSession == 3)
        {
            Response.Redirect("Error.aspx?Id=UBW1Q9flSC");
        }

        #endregion

        #region Validate License

        bool validateLicense = LicenseProvider.ValidateLicense();

        if (!validateLicense)
        {
            Response.Redirect("Error.aspx?Id=ZTgR8muGTM");
        }

        #endregion

        #region Validate Token

        bool validateToken = SessionProvider.ValidateToken(Request.Form["requestToken"]);

        if (!validateToken)
        {
            Response.Redirect("Error.aspx?Id=7RTbsrCM8A");
        }

        #endregion

        #region Validate Access

        try
        {
            PageID = Convert.ToInt32(Request["id"]);

            if (PageID == 0)
            {
                PageID = SessionProvider.DefaultPageID;
            }

            ObjKey = Convert.ToInt32(Request["objKey"]);

            DefaultContextType = SecurityProvider.ValidateInput(Request["targetContextType"]);

            if (!string.IsNullOrEmpty(DefaultContextType))
            {
                DefaultContextID = Convert.ToInt32(Request["targetContextId"]);
            }

            if (Request["searchKey"] != null && Request["searchKey"] != "")
            {

                if (Request["searchKey"] != SecurityProvider.ValidateInput(Request["searchKey"]).Replace("&sbquo;", ","))
                {
                    Response.Redirect("Error.aspx?Id=uV5lKiONh5");
                }

                if (Request["searchVal"] != SecurityProvider.ValidateInput(Request["searchVal"]))
                {
                    Response.Redirect("Error.aspx?Id=uV5lKiONh5");
                }

                if (Request["searchLbl"] != SecurityProvider.ValidateInput(Request["searchLbl"]))
                {
                    Response.Redirect("Error.aspx?Id=uV5lKiONh5");
                }

                SearchKey = SecurityProvider.ValidateInput(Request["searchKey"]).Replace("&sbquo;", ",");

                SearchVal = SecurityProvider.ValidateInput(Request["searchVal"]);

                SearchLbl = SecurityProvider.ValidateInput(Request["searchLbl"]);
            }
        }
        catch
        {
            Response.Redirect("Error.aspx?Id=vy834W0CHH");
        }

        if (PageID != 101000)
        {
            bool accessValidate = SecurityProvider.ValidateUserPageAccess(PageID);

            if (!accessValidate)
            {
                Response.Redirect("Error.aspx?Id=uV5lKiONh5");
            }
        }

        #endregion
    }
}