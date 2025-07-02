// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.1.0.0
using System;
using System.Web;
using System.Data.SqlClient;
using System.IO;
using System.Security.Cryptography;
using System.Text;

public class FileProvider
{  
    public static void DeleteFile(string attachCode, string locationPath)
    {
        try
        {
            var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(locationPath), attachCode);

            File.Delete(fileSavePath);

        }
        catch (Exception exp)
        {
            int logID = LogProvider.LogException(10201, exp.Message, "FileName is " + attachCode + " and FilePath is " + locationPath);

            throw new AppException(logID, "Program can't delete file from disk.", 10201);
        }
    }

    public static void DeleteFile(string attachCode)
    {
        var fileSavePath = "";

        if (attachCode == null || attachCode == "")
        {
            return;
        }

        try
        {
            string[] fileSavePaths = Directory.GetFiles(HttpContext.Current.Server.MapPath("~/App_Res"), attachCode, SearchOption.AllDirectories);

            if (fileSavePaths != null)
            {
                if (fileSavePaths.Length > 0)
                {
                    File.Delete(fileSavePaths[0]);
                }
            }

            SqlDataProvider.ExecuteNoneQuery(string.Format("delete from Sys_AttachFiles where AttachCode='{0}'", attachCode));
        }
        catch (Exception exp)
        {
            int logID = LogProvider.LogException(10201, exp.Message, "FileName is " + attachCode + " and FilePath is " + fileSavePath);

            throw new AppException(logID, "Program can't delete file.", 10201);
        }
    }

    public static string ValidateAndSaveFile(int activityID, string name, string value, HttpPostedFile httpPostedFile, string regexFormat, bool nullIsEmpty, bool isRequired, int minValueLenght, int maxValueLenght, object minValue, object maxValue, string locationPath, string attributeTypeName, int fileIsExist, string fileAttachCode)
    {
        if (locationPath == "")
        {
            locationPath = null;
        }

        if ((value == null || value == "" || value == "[]") && isRequired)
        {
            if (fileIsExist == 0)
            {
                int logID = LogProvider.LogException(10022, "Input is required.", "ParamName is " + name + " ,ParamValue is empty", activityID);

                throw new AppException(logID, "Input is required.", 10022);
            }
            else
            {
                return fileAttachCode;
            }
        }

        if ((value == null || value == "" || value == "[]") && !isRequired)
        {
            if (fileIsExist == 1)
            {
                return fileAttachCode;
            }
            else
            {
                if (nullIsEmpty)
                {
                    return null;
                }
                else
                {
                    return "";
                }
            }
        }

        string query = "insert into Sys_AttachFiles(AttachCode, ContentType, OrginalName, FileType, FileExtension, BinaryContent, LocationPath) values (@AttachCode,@ContentType,@OrginalName,@FileType,@FileExtension,@BinaryContent,@LocationPath)";

        int fileLength = httpPostedFile.ContentLength;

        if (fileLength / 1024 > maxValueLenght)
        {
            int logID = LogProvider.LogException(10023, "Input length is invalid.", "ParamName is " + name + " and ParamLength is " + fileLength + " byte", activityID);

            throw new AppException(logID, "Input length is invalid.", 10023);
        }

        var fileExtension = GetFileExtension(httpPostedFile.FileName, regexFormat);

        var orginalName = GetOrginalName(httpPostedFile.FileName);

        var fileType = GetFileType(fileExtension);

        var attachCode = GenerateRandomString();

        var contentType = httpPostedFile.ContentType;

        if (attributeTypeName == "Image")
        {
            ValidateImage();

            attachCode = attachCode + "." + fileExtension;
        }

        try
        {
            if (locationPath != null)
            {
                var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(locationPath), attachCode);

                httpPostedFile.SaveAs(fileSavePath);
            }
        }
        catch (Exception exp)
        {
            int logID = LogProvider.LogException(10200, exp.Message, "ParamName is " + name + " and ParamValue is " + "$value", activityID);

            throw new AppException(logID, "Program can't save file on disk.", 10200);
        }

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

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    byte[] binaryContent = new byte[fileLength];

                    byte[] binaryFake = new byte[0];

                    httpPostedFile.InputStream.Read(binaryContent, 0, fileLength);

                    command.Parameters.AddWithValue("@AttachCode", attachCode);

                    command.Parameters.AddWithValue("@ContentType", contentType);

                    command.Parameters.AddWithValue("@OrginalName", orginalName);

                    command.Parameters.AddWithValue("@FileType", fileType);

                    command.Parameters.AddWithValue("@FileExtension", fileExtension);

                    command.Parameters.AddWithValue("@LocationPath", locationPath);

                    if (locationPath == null)
                    {
                        command.Parameters.AddWithValue("@BinaryContent", binaryContent);
                    }
                    else
                    {
                        command.CommandText = command.CommandText.Replace("@BinaryContent", "NULL");
                    }

                    command.ExecuteNonQuery();
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText);

                    if (locationPath != null)
                    {
                        DeleteFile(attachCode, locationPath);
                    }

                    throw new AppException(logID, exp.Message, 10060);
                }
            }
        }

        return attachCode;
    }

    public static string SaveFile(HttpPostedFile httpPostedFile, string locationPath)
    {
        if (locationPath == "")
        {
            locationPath = null;
        }

        string query = "insert into Sys_AttachFiles(AttachCode, ContentType, OrginalName, FileType, FileExtension, BinaryContent, LocationPath) values (@AttachCode,@ContentType,@OrginalName,@FileType,@FileExtension,@BinaryContent,@LocationPath)";

        int fileLength = httpPostedFile.ContentLength;

        var fileExtension = GetFileExtension(httpPostedFile.FileName);

        var orginalName = GetOrginalName(httpPostedFile.FileName);

        var fileType = GetFileType(fileExtension);

        var attachCode = GenerateRandomString();

        var contentType = httpPostedFile.ContentType;

        if (fileExtension == "png" || fileExtension == "jpg")
        {
            attachCode = attachCode + "." + fileExtension;
        }

        try
        {
            if (locationPath != null)
            {
                var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(locationPath), attachCode);

                httpPostedFile.SaveAs(fileSavePath);
            }
        }
        catch (Exception exp)
        {
            int logID = LogProvider.LogException(10200, exp.Message, "Program can't save file on disk.", 0);

            throw new AppException(logID, "Program can't save file on disk.", 10200);
        }

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

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    byte[] binaryContent = new byte[fileLength];

                    byte[] binaryFake = new byte[0];

                    httpPostedFile.InputStream.Read(binaryContent, 0, fileLength);

                    command.Parameters.AddWithValue("@AttachCode", attachCode);

                    command.Parameters.AddWithValue("@ContentType", contentType);

                    command.Parameters.AddWithValue("@OrginalName", orginalName);

                    command.Parameters.AddWithValue("@FileType", fileType);

                    command.Parameters.AddWithValue("@FileExtension", fileExtension);

                    command.Parameters.AddWithValue("@LocationPath", locationPath);

                    if (locationPath == null)
                    {
                        command.Parameters.AddWithValue("@BinaryContent", binaryContent);
                    }
                    else
                    {
                        command.CommandText = command.CommandText.Replace("@BinaryContent", "NULL");
                    }

                    command.ExecuteNonQuery();
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText);

                    if (locationPath != null)
                    {
                        DeleteFile(attachCode, locationPath);
                    }

                    throw new AppException(logID, exp.Message, 10060);
                }
            }
        }

        return attachCode;
    }


    public static string GenerateRandomString()
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

    private static string GetFileType(string fileExtension)
    {
        return fileExtension;
    }

    private static string GetFileExtension(string fileName, string validExtension)
    {
        string[] fileParts = fileName.Split('.');

        string extension = fileParts[fileParts.Length - 1];

        return extension;
    }

    private static string GetFileExtension(string fileName)
    {
        string[] fileParts = fileName.Split('.');

        string extension = fileParts[fileParts.Length - 1];

        return Convert.ToString(extension).Trim();
    }

    private static string GetOrginalName(string fileName)
    {
        string[] fileParts = fileName.Split('.');

        string extension = fileParts[fileParts.Length - 1];

        string name = string.Empty;

        for (int i = 0; i < fileParts.Length - 1; i++)
        {
            name += SecurityProvider.ValidateInput(fileParts[i]) + "_";
        }

        return name.Substring(0, name.Length - 1) + "." + extension;
    }

    private static void ValidateImage()
    {
    }
}