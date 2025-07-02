// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0 
using System;
using System.Data.SqlClient;
using System.IO;

public partial class App_Sys_Utilities_File_Downloader : System.Web.UI.Page
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

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new Exception(exp.Message);
            }

            try
            {
                using (var command = new SqlCommand("select AttachFileID, Name, Label, AttachCode, ContentType, dbo.NString2(OrginalName) as OrginalName, FileType, FileExtension, BinaryContent, LocationPath, Version, Description from dbo.Sys_AttachFiles where AttachCode=@AttachCode", connection))
                {
                    command.Parameters.AddWithValue("@AttachCode", SecurityProvider.ValidateInput(Request["code"]));

                    using (var row = command.ExecuteReader())
                    {
                        if (row.Read())
                        {
                            string name = (string)row["OrginalName"];

                            string contentType = (string)row["ContentType"];
                            string fileType = (string)row["FileType"];

                            Response.Clear();
                            Response.AddHeader("Content-Type", contentType);
                            Response.AddHeader("Content-Disposition", "inline; filename=" + name);
                            Response.Buffer = true;

                            string LocationPath = Convert.ToString(row["LocationPath"]);


                            if (fileType == "mp3" || fileType == "mp4")
                            {
                                string attachCode = row["AttachCode"].ToString();

                                if (!attachCode.Contains("mp3") && !attachCode.Contains("mp4"))
                                {
                                    attachCode = attachCode + "." + fileType;
                                }

                                if (LocationPath != "../../App_Res/Upload/Attachment/")
                                {
                                    File.Copy(LocationPath + @"\" + attachCode, Server.MapPath("../../App_Res/Upload/Attachment/") + attachCode);
                                    LocationPath = "../../App_Res/Upload/Attachment/";
                                }

                                Response.Redirect(LocationPath + attachCode);
                            }

                            if (LocationPath != null && row["LocationPath"] != DBNull.Value)
                            {
                                FileStream fileStream = new FileStream(Server.MapPath(LocationPath) + row["AttachCode"].ToString(), FileMode.Open, FileAccess.Read);

                                int length = (int)fileStream.Length;
                                byte[] buffer = new byte[length];
                                fileStream.Read(buffer, 0, length);

                                Response.BinaryWrite(buffer);
                            }
                            else
                            {
                                byte[] data = (byte[])row["BinaryContent"];

                                Response.BinaryWrite(data);
                            }

                            Response.End();
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                if (exp.Message != "Thread was being aborted.")
                {
                    Response.Write(exp.Message);
                }
            }

            finally
            {
                ;
            }
        }
    }
}