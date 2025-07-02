// Code File(Amnpardaz Software Co. Copyright 2021 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.5.0.0
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
  
public class ApplicationProvider          
{       
    public ApplicationProvider()  
    {      
    }          
                       
    public static bool LoadPackageInfo()
    {     
        if (HttpContext.Current.Application["AppInitiate"] != null)
        {
            return true; 
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

                return false;
            }

            string query = "select * from Sys_Packages";

            string lang = "";

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        lang = reader["Language"].ToString();

                        HttpContext.Current.Application.Add("AppInitiate", true);

                        HttpContext.Current.Application.Add("Name", reader["Name"]);

                        HttpContext.Current.Application.Add("Label", (lang != "Fa" ? reader["ELabel"] : reader["Label"]));

                        HttpContext.Current.Application.Add("LoginPageTitle", (lang != "Fa" ? reader["ELoginTitle"] : reader["LoginTitle"]));

                        HttpContext.Current.Application.Add("LoginLogoImage", reader["LoginLogoImage"]);

                        HttpContext.Current.Application.Add("LoginBgColor", reader["LoginBgColor"]);

                        HttpContext.Current.Application.Add("LoginBgImage", reader["LoginBgImage"]);

                        HttpContext.Current.Application.Add("PageTitle", (lang != "Fa" ? reader["EPageTitle"] : reader["PageTitle"]));

                        HttpContext.Current.Application.Add("PageLogoImage", reader["PageLogoImage"]);

                        HttpContext.Current.Application.Add("HeaderTitle", (lang != "Fa" ? reader["EHeaderTitle"] : reader["HeaderTitle"]));

                        HttpContext.Current.Application.Add("HeaderShortTitle", (lang != "Fa" ? reader["EHeaderShortTitle"] : reader["HeaderShortTitle"]));

                        HttpContext.Current.Application.Add("FaviconIcon", reader["EHeaderShortTitle"]);
                          
                        HttpContext.Current.Application.Add("ThemeName", reader["ThemeName"]);

                        HttpContext.Current.Application.Add("ThemeName", reader["ThemeName"]);

                        HttpContext.Current.Application.Add("ThemeID", reader["ThemeID"]);

                        HttpContext.Current.Application.Add("Language", reader["Language"]);

                        HttpContext.Current.Application.Add("TopMenuVisibility", reader["TopMenuVisibility"]); 

                        HttpContext.Current.Application.Add("Version", reader["Version"]);

                        HttpContext.Current.Application.Add("Description", (lang != "Fa" ? reader["EDescription"] : reader["Description"]));

                    }

                    if (lang != "Fa")
                    {
                        command.CommandText = "select LangEntryID, Sys_Loc_LangEntries.Name AS EntryName, Sys_Loc_LangEntries.EntryKey, Sys_Loc_Languages.Code AS LangCode from Sys_Loc_LangEntries inner join Sys_Loc_Languages on Sys_Loc_Languages.LanguageID = Sys_Loc_LangEntries.LanguageID where (Sys_Loc_LangEntries.Enabled = 1) and (Sys_Loc_Languages.Enabled = 1)";

                        Dictionary<string, LangEntry> Entries = new Dictionary<string, LangEntry>();

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Entries.Add(reader["EntryKey"].ToString(), new LangEntry(reader["LangEntryID"].ToString(), reader["EntryName"].ToString(), reader["EntryKey"].ToString(), reader["LangCode"].ToString()));
                            }
                        }

                        command.CommandText = "select Name,Value,LangEntryID from Sys_Loc_EntryItems where (Sys_Loc_EntryItems.Enabled = 1)";

                        List<LangEntryItem> EntryItems = new List<LangEntryItem>();

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                EntryItems.Add(new LangEntryItem(reader["Name"].ToString(), reader["Value"].ToString(), reader["LangEntryID"].ToString()));
                            }
                        }

                        foreach (string key in Entries.Keys)
                        {
                            List<LangEntryItem> temp = (from a in EntryItems where a.EntryID == Entries[key].EntryID select a).ToList<LangEntryItem>();

                            Entries[key].Items = new Dictionary<string, string>();

                            foreach (LangEntryItem tepmItem in temp)
                            {
                                Entries[key].Items.Add(tepmItem.Name, tepmItem.Value);
                            }

                        }

                        HttpContext.Current.Application.Add("LangEntries", Entries);
                    }
                }
            }

            catch (Exception exp)
            {
                LogProvider.LogException(10060, exp.Message, query);

                return false;
            }
        }

        return true;
    }  
     
    public static string PackageName
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["Label"]);
        }
    }            
         
    public static string LoginBgColor
    {
        get
        {
            string color = Convert.ToString(HttpContext.Current.Application["LoginBgColor"]);

            return (string.IsNullOrEmpty(color) ? "" : "background-color:" + color + ";");
        }
    }
      
    public static string LoginBgImage
    {
        get
        {
            string image = Convert.ToString(HttpContext.Current.Application["LoginBgImage"]);

            return (string.IsNullOrEmpty(image) ? "" : string.Format("background-image:url('../App_Res/Images/Login/{0}');background-repeat: no-repeat;background-position:center;", image));
        }
    }

    public static string LoginLogoImage
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["LoginLogoImage"]);
        }
    }

    public static string LoginPageTitle
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["LoginPageTitle"]);
        }
    }

    public static string PageTitle
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["PageTitle"]);
        }
    }

    public static string PageLogoImage
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["PageLogoImage"]);
        }
    }

    public static string HeaderTitle
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["HeaderTitle"]);
        }
    }

    public static string HeaderShortTitle
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["HeaderShortTitle"]);
        }
    }

    public static string AppThemeName
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["ThemeName"]);
        }
    }

    public static string AppThemeID
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["ThemeID"]);
        }
    }

    public static string PackageVersion
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["Version"]);
        }
    }

    public static string PackageDescription
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["Description"]);
        }
    }

    public static string CopyRightStatement
    {
        get
        {
            if (SessionProvider.UserLanguage != "Fa")
            {
                return "Amnpardaz Software Corporation 2025 - All Rights Reserved";
            }
            else
            {
                return "© كليه حقوق برای شرکت نرم افزاری امن پرداز محفوظ است.";
            }
        }
    }

    public static string AppLanguage
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["Language"]);
        }
    }

    public static string AppDirection
    {
        get
        {
            if (AppLanguage == "Ar" || AppLanguage == "Fa")
                return "RTL";
            else
                return "LRT";
        }
    }
      
    public static string AppCurrency
    {
        get
        {
            if ( AppLanguage == "Fa")
                return "ریال";
            else
                return "$";
        }
    }

    public static string TopMenuVisibility 
    {
        get
        {
            string visibility = Convert.ToString(HttpContext.Current.Application["TopMenuVisibility"]);

            if (visibility == "DefaultHidden")
            {
                return "none";
            }

            return "block";
        }
    }

    public static string FaviconIcon
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["FaviconIcon"]);
        }
    }

    public static bool BPMSHome
    {
        get
        { 
            return Convert.ToBoolean(ConfigurationManager.AppSettings["BPMSHome"]);
        }
    }
}
