// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0 
using System;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.Web;

public partial class App_Sys_Utilities_Media_Player : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
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
        ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(AcceptAllCertifications);
        ServicePointManager.Expect100Continue = true;
        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        WebRequest mediaUrlRequest = WebRequest.Create(@"https://apigoleyas.safecastsoft.com/api/android/mediastreamer/getadaptablemediastream?&phoneNumber=09127229592&mediaServerID=" + SecurityProvider.ValidateInput(Request["mediaId"]) + "&mediaQuality=7&UserGUID=832cb7b3-8ee5-481b-8deb-787ca445b675");
        mediaUrlRequest.Method = "POST";
        WebResponse mediaUrlResponse = mediaUrlRequest.GetResponse();
        string mediaUrl;
        using (System.IO.Stream s = mediaUrlResponse.GetResponseStream())
        {
            using (System.IO.StreamReader sr = new System.IO.StreamReader(s))
            {
                mediaUrl = sr.ReadToEnd();
                File.WriteAllText(HttpContext.Current.Server.MapPath("~") + @"\mediaUrlResponse", mediaUrl);
                Response.Redirect(mediaUrl);

            }
        }
    }

    public bool AcceptAllCertifications(object sender, System.Security.Cryptography.X509Certificates.X509Certificate certification, System.Security.Cryptography.X509Certificates.X509Chain chain, System.Net.Security.SslPolicyErrors sslPolicyErrors)
    {
        return true;
    }
}

