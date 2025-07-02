// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.4.0.0
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Web;

public class LocalizationProvider
{
    public LocalizationProvider()
    {
    }

    public static string AppLanguage
    {
        get
        {
            return Convert.ToString(HttpContext.Current.Application["Language"]);
        }
    }

    public static string Login
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "ورود";

            if (ApplicationProvider.AppLanguage == "Ar")
                return "تسجيل دخول";

            return "Login";
        }
    }

    public static string UserName
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "شناسه کاربری";

            if (ApplicationProvider.AppLanguage == "Ar")
                return "اسم المستخدم";

            return "User name";
        }
    }

    public static string UserCode
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "کد شناسایی";

            if (ApplicationProvider.AppLanguage == "Ar")
                return "رمز التعريف";

            return "Verification code";
        }
    }

    public static string Password
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "رمز عبور";

            if (ApplicationProvider.AppLanguage == "Ar")
                return "كلمة المرور";

            return "Password";
        }
    }

    public static string ChangePassword
    {
        get
        {
            if (SessionProvider.UserLanguage == "Fa")
                return "رمز عبور";

            if (SessionProvider.UserLanguage == "Ar")
                return "كلمة المرور";

            return "Password";
        }
    }

    public static string PasswordSaving
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "ذخیره سازی رمز عبور";

            if (ApplicationProvider.AppLanguage == "Ar")
                return "تخزين كلمة المرور";

            return "Remember me";
        }
    }

    public static string LoginByWindowsAccount
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "ورود از طریق Windows Account";

            if (ApplicationProvider.AppLanguage == "Ar")
                return "تسجيل الدخول باستخدام حساب ويندوز";

            return "Sign in use Windows Account";
        }
    }

    public static string ForgetPassword
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "رمز عبورم را فراموش کردم";

            if (ApplicationProvider.AppLanguage == "Ar")
                return "لقد نسيت كلمة المرور";

            return "Forget Password";
        }
    }

    public static string CreateNewUser
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "ثبت کاربر جدید";

            if (ApplicationProvider.AppLanguage == "Ar")
                return "تسجيل مستخدم جديد";

            return "Create New User";
        }
    }

    public static string MyProfile
    {
        get
        {
            if (SessionProvider.UserLanguage == "Fa")
                return "پروفایل";

            if (SessionProvider.UserLanguage == "Ar")
                return "ملفي الشخصي";

            return "Profile";
        }
    }

    public static string MyStatus
    {
        get
        {
            if (SessionProvider.UserLanguage == "Fa")
                return "وضعیت من";

            if (SessionProvider.UserLanguage == "Ar")
                return "حالتي";

            return "Status";
        }
    }

    public static string Logout
    {
        get
        {
            if (SessionProvider.UserLanguage == "Fa")
                return "خروج";

            if (SessionProvider.UserLanguage == "Ar")
                return "الخروج";

            return "Logout";
        }
    }

    public static string Version
    {
        get
        {
            if (SessionProvider.UserLanguage == "Fa")
                return "نسخه";

            if (SessionProvider.UserLanguage == "Ar")
                return "إصدار";

            return "Version";
        }
    }

    public static string ErrorIdMessage
    {
        get
        {
            return "Error code";
        }
    }

    public static string Login_IsWrongMessage
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "رمز یا شناسه عبور صحیح نمی باشد.";

            if (ApplicationProvider.AppLanguage == "Ar")
                return ".اسم المستخدم أو كلمة المرور غير صحيحة";

            return "User name or password is incorrect.";
        }
    }

    public static string Login2_IsWrongMessage
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "کد شناسایی صحیح نمی باشد.";

            if (ApplicationProvider.AppLanguage == "Ar")
                return ".رمز التعريف غير صحيحة";

            return "User verification code is incorrect.";
        }
    }

    public static string Login_IsDisabledMessage
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "شناسه کاربری شما غیر فعال شده است لطفا به مدیر نرم افزار مراجعه فرمایید.";


            if (ApplicationProvider.AppLanguage == "Ar")
                return ".تم تعطيل الحساب. يرجى الاطلاع على مسؤول النظام الخاص بك";

            return "Account has been disabled. Please contact your System Administrator.";
        }
    }

    public static string Login_SuccessfullMessage
    {
        get
        {
            if (SessionProvider.UserLanguage == "Fa")

                return "شما با موفقیت وارد نرم افزار شدید.";

            if (SessionProvider.UserLanguage == "Ar")
                return "تم تسجيل دخولك في البرنامج بنجاح.";

            return "You are logged in software successfully";
        }
    }

    public static string Login_NotFilledMessage
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "شناسه یا رمز عبور پر نشده است.";

            if (ApplicationProvider.AppLanguage == "Ar")
                return ".اسم المستخدم أو كلمة المرور غير ممتلئة";

            return "User name or password is not filled.";
        }
    }

    public static string Login2_NotFilledMessage
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "کد شناسایی پر نشده است.";

            if (ApplicationProvider.AppLanguage == "Ar")
                return ".رمز التعريف غير ممتلئة";

            return "User verification code is not filled.";
        }
    }

    public static string Login_SendVerifyCodeMessage
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "کد شناسایی به ایمیل شما ارسال شد.";

            if (ApplicationProvider.AppLanguage == "Ar")
                return "إرسال رمز التحقق من المستخدم إلى البريد الإلكتروني الخاص بك.";

            return "User verification code sent to your email address.";
        }
    }

    public static string Login_SendVerifyCodeMessage2
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "کد شناسایی به شماره همراه شما ارسال شد.";

            if (ApplicationProvider.AppLanguage == "Ar")
                return ".اتم إرسال رمز التعريف إلى رقم هاتفك المحمول";

            return "User verification code sent to your mobile number.";
        }
    }

    public static string Session_IsExpiredMessage
    {
        get
        {
            if (ApplicationProvider.AppLanguage == "Fa")
                return "نشست شما منقضی شده است. لطفا صفحه را مجددا بارگذاری نمایید.";

            if (ApplicationProvider.AppLanguage == "Ar")
                return ".يرجى إعادة تحميل الصفحة.انتهت صلاحية جلسة العمل الخاصة بك";

            return "Your session has expired. Please reload the page.";
        }
    }

    public static object Login_ForceChangePasswordMessage
    {

        get
        {
            if (SessionProvider.UserLanguage == "Fa")
                return "شما بایستی رمز عبورتان را قبل از ورود تغییر دهید.";

            if (SessionProvider.UserLanguage == "Ar")
                return "يجب عليك تغيير رمز المرور الخاص بك قبل الدخول.";

            return "You must change your password before login.";
        }
    }

    public static string Form_Submit
    {
        get
        {
            if (SessionProvider.UserLanguage == "Fa")
                return "تایید";

            if (SessionProvider.UserLanguage == "Ar")
                return "إرسال";

            return "Submit";
        }
    }

    public static string Form_Save
    {
        get
        {
            if (SessionProvider.UserLanguage == "Fa")
                return "ذخیره";

            if (SessionProvider.UserLanguage == "Ar")
                return "ذخیره";

            return "Save";
        }
    }

    public static string Form_Cancel
    {
        get
        {
            if (SessionProvider.UserLanguage == "Fa")
                return "خروج";

            if (SessionProvider.UserLanguage == "Ar")
                return "إلغاء";

            return "Cancel";
        }
    }

      public static string Form_Close
    {
        get
        {
            if (SessionProvider.UserLanguage == "Fa")
                return "بستن";

            if (SessionProvider.UserLanguage == "Ar")
                return "إلغاء";

            return "Close";
        }
    }


    public static string Form_Reset
    {
        get
        {
            if (SessionProvider.UserLanguage == "Fa")
                return "از نو";

            if (SessionProvider.UserLanguage == "Ar")
                return "إعادة";

            return "Reset";
        }
    }

    public static Dictionary<string, LangEntry> CurrentDictionary
    {
        get
        {
            return (Dictionary<string, LangEntry>)HttpContext.Current.Application["LangEntries"];
        }
    }

    public static DateTime GetDate(object value , bool isStartDate)
    {
        if (SessionProvider.UserLanguage == "Fa" ||  isStartDate)
        {
            PersianCalendar persianCalendar = new PersianCalendar();

            value = GetNumber(value.ToString());

            string[] dateItems = value.ToString().Split('/');

            var date = DateTime.Today;

            try
            {
                date = persianCalendar.ToDateTime(Convert.ToInt32(dateItems[0]), Convert.ToInt32(dateItems[1]), Convert.ToInt32(dateItems[2]), 0, 0, 0, 0);
            }
            catch (Exception exp)
            {
                int logID = LogProvider.LogException(10024, exp.Message, "Value is " + "$value");

                throw new AppException(logID, "Input value is invalid.", 10024);
            }

            return date;
        }
        else

            return Convert.ToDateTime(value);
    }

    public static DateTime GetDateTime(object value , bool isStartDate)
    {
        if (SessionProvider.UserLanguage == "Fa" || isStartDate)
        {
            PersianCalendar persianCalendar = new PersianCalendar();

            string[] datetimeItems = value.ToString().Split(' ');

            string[] dateItems = datetimeItems[0].Split('/');

            string[] timeItems = { "0", "0" };

            try
            {
                timeItems = datetimeItems[1].Split(':');
            }
            catch
            {
                ;
            }

            var datetime = DateTime.Now;

            try
            {
                datetime = persianCalendar.ToDateTime(Convert.ToInt32(dateItems[0]), Convert.ToInt32(dateItems[1]), Convert.ToInt32(dateItems[2]), Convert.ToInt32(timeItems[0]), Convert.ToInt32(timeItems[1]), 0, 0);
            }
            catch (Exception exp)
            {
                int logID = LogProvider.LogException(10024, exp.Message, "Value is " + "$value");

                throw new AppException(logID, "Input value is invalid.", 10024);
            }

            return datetime;
        }
        else

            return Convert.ToDateTime(value);
    }

    public static string GetLocalDate(object value)
    {
        if (SessionProvider.UserLanguage == "Fa")
        {
            PersianCalendar persianCalendar = new PersianCalendar();

            DateTime date = Convert.ToDateTime(value);

            string day = persianCalendar.GetDayOfMonth(date).ToString();

            if (day.Length == 1)
                day = "0" + day;

            string mon = persianCalendar.GetMonth(date).ToString();

            if (mon.Length == 1)
                mon = "0" + mon;

            return persianCalendar.GetYear(date) + "/" + mon + "/" + day;
        }
        else //En, Ar, ...
            return Convert.ToDateTime(value).ToString("MM/dd/yyyy");
    }

    public static string GetLocalDateTime(object value)
    {
        if (SessionProvider.UserLanguage == "Fa")
        {
            PersianCalendar persianCalendar = new PersianCalendar();

            DateTime date = Convert.ToDateTime(value);

            string day = persianCalendar.GetDayOfMonth(date).ToString();

            if (day.Length == 1)
                day = "0" + day;

            string mon = persianCalendar.GetMonth(date).ToString();

            if (mon.Length == 1)
                mon = "0" + mon;

            string hour = date.Hour.ToString();

            if (hour.Length == 1)
                hour = "0" + hour;

            string minute = date.Minute.ToString();

            if (minute.Length == 1)
                minute = "0" + minute;

            string second = date.Second.ToString();

            if (second.Length == 1)
                second = "0" + second;

            return persianCalendar.GetYear(date) + "/" + mon + "/" + day + " " + hour + ":" + minute + ":" + second;
        }
        else //En, Ar, ...
            return Convert.ToDateTime(value).ToString("MM/dd/yyyy HH:mm:ss");
    }

    public static string GetLocalDateTime2(object value)
    {
        if (SessionProvider.UserLanguage == "Fa")
        {
            PersianCalendar persianCalendar = new PersianCalendar();

            DateTime date = Convert.ToDateTime(value);

            string day = persianCalendar.GetDayOfMonth(date).ToString();

            if (day.Length == 1)
                day = "0" + day;

            string mon = persianCalendar.GetMonth(date).ToString();

            if (mon.Length == 1)
                mon = "0" + mon;

            string hour = date.Hour.ToString();

            if (hour.Length == 1)
                hour = "0" + hour;

            string minute = date.Minute.ToString();

            if (minute.Length == 1)
                minute = "0" + minute;

            string second = date.Second.ToString();

            if (second.Length == 1)
                second = "0" + second;

            return hour + ":" + minute + ":" + second + " " + persianCalendar.GetYear(date) + "/" + mon + "/" + day;
        }
        else //En, Ar, ...
            return Convert.ToDateTime(value).ToString("MM/dd/yyyy HH:mm:ss");
    }

    public static string GetLocalMoney(object value)
    {
        return string.Format("{0:0,0}", Convert.ToDecimal(value));
    }

    public static string GetNumber(string value)
    {
        value = value.Replace("۱", "1");
        value = value.Replace("۲", "2");
        value = value.Replace("۳", "3");
        value = value.Replace("۴", "4");
        value = value.Replace("۵", "5");
        value = value.Replace("۶", "6");
        value = value.Replace("۷", "7");
        value = value.Replace("۸", "8");
        value = value.Replace("۹", "9");
        value = value.Replace("۰", "0");

        return value;
    }
}

public class LangEntry
{
    public string Name;

    public string Key;

    public string LangCode;

    public string EntryID;

    public Dictionary<string, string> Items;

    public LangEntry(string entryId, string name, string key, string langCode)
    {
        Name = name;

        Key = key;

        LangCode = langCode;

        EntryID = entryId;
    }
}

public class LangEntryItem
{
    public string Name;

    public string Value;

    public string EntryID;

    public Dictionary<string, string> Items;

    public LangEntryItem(string name, string val, string entryId)
    {
        Name = name;

        Value = val;

        EntryID = entryId;
    }
}