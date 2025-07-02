// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.1.0.0
using System;
using System.Collections.Generic;
using System.Web;
using System.Data.SqlClient;
using System.IO;

public class LogProvider
{
    public LogProvider()
    {
    } 

    public static int LogException(int typeCode, string message)
    {
        return Convert.ToInt32(_LogException(typeCode, message, null, null, null));
    }

    public static int LogException(int typeCode, string message, int activityID)
    {
        return Convert.ToInt32(_LogException(typeCode, message, null, null, activityID));
    }

    public static int LogException(int typeCode, string message, string detail, int activityID)
    {
        return Convert.ToInt32(_LogException(typeCode, message, detail, null, activityID));
    }

    public static int LogException(int typeCode, string message, string detail, int[] objectIDs, int activityID)
    {
        string _objectIDs = " ";

        foreach (int objectID in objectIDs)
        {
            _objectIDs = _objectIDs + objectID + ",";
        }

        _objectIDs = _objectIDs.Substring(0, _objectIDs.Length - 1);

        return Convert.ToInt32(_LogException(typeCode, message, detail, _objectIDs, activityID));
    }

    public static int LogException(int typeCode, string message, int[] objectIDs, int activityID)
    {
        string _objectIDs = "";

        foreach (int objectID in objectIDs)
        {
            _objectIDs = _objectIDs + objectID + ",";
        }

        _objectIDs = _objectIDs.Substring(0, _objectIDs.Length - 1);

        return Convert.ToInt32(_LogException(typeCode, message, null, _objectIDs, activityID));
    }

    public static int LogException(int typeCode, string message, string detail, int objectID, int activityID)
    {
        return Convert.ToInt32(_LogException(typeCode, message, detail, objectID.ToString(), activityID));
    }

    public static void LogExceptionInFile(int typeCode, string message)
    {
        string path = Path.Combine(HttpContext.Current.Server.MapPath("~/App_Res"), @"Logs\" + DateTime.Today.Year + "_" + DateTime.Today.Month + "_" + DateTime.Today.Day + "_" + DateTime.Now.Hour + "_" + DateTime.Now.Minute + "_" + DateTime.Now.Second + ".error");

        using (StreamWriter sw = File.CreateText(path))
        {
            sw.WriteLine("Error Datetime:" + DateTime.Now.ToString());
            sw.WriteLine("Error Type:" + typeCode);
            sw.WriteLine("Error Message:" + message);
        }
    }

    public static int LogException(int typeCode, string message, string detail)
    {
        return Convert.ToInt32(_LogException(typeCode, message, detail, null, null));
    }

    public static void LogExceptionInFile(int typeCode, string message, string detail)
    {
        string path = Path.Combine(HttpContext.Current.Server.MapPath("~/App_Res"), @"Logs\" + DateTime.Today.Year + "_" + DateTime.Today.Month + "_" + DateTime.Today.Day + "_" + DateTime.Now.Hour + "_" + DateTime.Now.Minute + "_" + DateTime.Now.Second + ".error");

        using (StreamWriter sw = File.CreateText(path))
        {
            sw.WriteLine("Error Datetime:" + DateTime.Now.ToString());
            sw.WriteLine("Error Type:" + typeCode);
            sw.WriteLine("Error Message:" + message);
            sw.WriteLine("Error Detail:" + detail);
        }
    }

    public static List<Dictionary<string, object>> PrepareLogResult(int errorLogID, string errorMessage, int errorCode)
    {
        var logResult = new Dictionary<string, object>();

        logResult.Add("errorLogID", errorLogID);

        logResult.Add("errorMessage", SecurityProvider.GetUserModeErrorMessage(errorCode, errorMessage) + "<br/> " + LocalizationProvider.ErrorIdMessage + " : " + errorLogID);

        logResult.Add("errorCode", errorCode);

        List<Dictionary<string, object>> temp = new List<Dictionary<string, object>>();

        temp.Add(logResult);

        return temp;
    }

    public static string PrepareLogResultStr(int errorLogID, string errorMessage, int errorCode)
    {
        return SecurityProvider.GetUserModeErrorMessage(errorCode, errorMessage) + "#error# <br/> " + LocalizationProvider.ErrorIdMessage + " : " + errorLogID;
    }

    public static List<Dictionary<string, object>> PrepareLogResult(string errorMessage, int errorCode)
    {
        var logResult = new Dictionary<string, object>();

        logResult.Add("errorLogID", 0);

        logResult.Add("errorMessage", SecurityProvider.GetUserModeErrorMessage(errorCode, errorMessage));

        logResult.Add("errorCode", errorCode);

        List<Dictionary<string, object>> temp = new List<Dictionary<string, object>>();

        temp.Add(logResult);

        return temp;
    }

    public static string PrepareLogResultStr(string errorMessage, int errorCode)
    {
        return SecurityProvider.GetUserModeErrorMessage(errorCode, errorMessage);
    }

    public static void LogTraceData(string id, string data)
    {
        System.Random random = new Random();

        string path = Path.Combine(HttpContext.Current.Server.MapPath("~/App_Res"), @"Logs\" + id + "_" + DateTime.Today.Year + "_" + DateTime.Today.Month + "_" + DateTime.Today.Day + "_" + DateTime.Now.Hour + "_" + DateTime.Now.Minute + "_" + DateTime.Now.Second + "_" + DateTime.Now.Millisecond + ".trace");

        using (StreamWriter sw = File.CreateText(path))
        {
            sw.WriteLine("Trace Datetime:" + DateTime.Now.ToString());
            sw.WriteLine("Trace Type:" + data);
        }
    }

    private static object _LogException(int typeCode, string message, string detail, string objectIDs, int? activityID)
    {
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

            string query = "insert into Sys_ErrorLogs(ErrorID, Message, Detail, ObjectIDs, ActivityID, UserID, CreateDate) values('@ErrorID', N'@Message', N'@Detail', '@ObjectIDs', @ActivityID, @UserID, getdate());select scope_identity()";

            query = query.Replace("@ErrorID", typeCode.ToString());

            query = query.Replace("@Message", SecurityProvider.ValidateLogInput(message.Replace("'", "''")));

            if (detail != null && detail != "")
            {
                query = query.Replace("@Detail", SecurityProvider.ValidateLogInput(detail.Replace("'", "''")));
            }
            else
            {
                query = query.Replace("@Detail", "");
            }

            query = query.Replace("@ObjectIDs", objectIDs);

            if (activityID == null)
            {
                query = query.Replace("@ActivityID", "NULL");
            }
            else
            {
                query = query.Replace("@ActivityID", activityID.Value.ToString());
            }

            if (SessionProvider.UserID.ToString() == "0")
            {
                query = query.Replace("@UserID", "NULL");
            }
            else
            {
                query = query.Replace("@UserID", SessionProvider.UserID.ToString());
            }

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    return command.ExecuteScalar();
                }
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10060, exp.Message, query);

                throw new Exception(exp.Message);
            }
        }
    }
}

public class AppException : Exception
{
    public int ErrorLogID;

    public string ErrorMessage;

    public int ErrorCode;

    public AppException(int errorLogID, string errorMessage, int errorCode)
    {
        this.ErrorLogID = errorLogID;

        this.ErrorMessage = errorMessage;

        this.ErrorCode = errorCode;
    }

    public AppException(string errorMessage, int errorCode)
    {
        this.ErrorLogID = 0;

        this.ErrorMessage = errorMessage;

        this.ErrorCode = errorCode;
    }
}