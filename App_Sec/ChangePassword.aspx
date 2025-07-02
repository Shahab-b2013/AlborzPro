<%--// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.3.0.0--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ChangePassword.aspx.cs" Inherits="ChangePassword" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title><%=ApplicationProvider.PageTitle %> | تغییر رمز عبور</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        name="viewport" />
    <!-- Bootstrap -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Bootstrap.css" />
    <!-- Bootstrap RTL -->
    <%if (ApplicationProvider.AppDirection == "RTL")
        {%>
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Bootstrap-Rtl.css" />
    <% }%>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Font-Awesome.css" />
    <!-- Ionicons -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Ionicons.css" />
    <!-- App -->
    <link rel="stylesheet" href="../App_Base/Css/App.css" />
    <%if (ApplicationProvider.AppDirection == "RTL")
        {%>
    <link rel="stylesheet" href="../App_Base/Css/App-Rtl.css" />
    <% }%>
    <!-- Theme style -->
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Master.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/LoginView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/FormView.css" />
</head>
<body class="hold-transition login-page" style="<%=ApplicationProvider.LoginBgColor %><%=ApplicationProvider.LoginBgImage %>">
    <form id="frmloginup">
        <div class="login-box">
            <div class="login-box-body">
                <h4  style="font-family:'AP Yekan'">رمز عبور جدید خود را تنظیم نمایید</h4>
                <p id="login-msg" class="login-box-msg" dir="ltr"></p>
                <div class="form-group has-feedback">
                    <b class="login-box-label">رمز جدید</b>
                    <input type="password" class="form-control" placeholder="Password" dir="ltr" id="password" />
                </div>
                 <div class="form-group has-feedback">
                    <b class="login-box-label">تکرار رمز جدید</b>
                    <input type="password" class="form-control" placeholder="Password" dir="ltr" id="rpassword" />
                </div>
                <div class="row">
                    <div class="col-xs-4">
                        <button type="button" class="btn btn-block btn-flat btn-login" onclick="changePassword();">تغییر رمز عبور</button>
                    </div>
                    <div class="col-xs-4">
                        <button type="button" class="btn btn-block btn-flat btn-back" onclick="history.back()">بازگشت</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12"><br />
                        <ul class="list-group" style="font-family:'AP Yekan'">
                            <li class="list-group-item"><b>سیاست های رمز عبور</b></li>
                            <li class="list-group-item">*حداقل طول 10 کاراکتر</li>
                            <li class="list-group-item">*حداقل دو کاراکتر عددی</li>
                            <li class="list-group-item">*حداقل دو کاراکتر الفبا</li>
                            <li class="list-group-item">*حداقل دو کاراکتر خاص مانند !@#...</li>
                        </ul>
                    </div>
                </div>
                <br />
            </div>

        </div>
    </form>
    <!-- REQUIRED JS SCRIPTS -->
    <!-- jQuery -->
    <script type="text/javascript" src="../App_Base/Js/Jquery/Jquery.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Redirect.js"></script>
    <!-- Encryption -->
    <script type="text/javascript" src="../App_Base/Js/Encryption/Barrett.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Encryption/BigInt.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Encryption/RSA.js"></script>
    <!-- Sys App -->
    <script type="text/javascript" src="../App_Sys/Membership/Membership.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Md5.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Sha1.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Gui.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Executor.js"></script>
    <script type="text/javascript">

        var $$Local = {};
        $$Local.Login_NotFilledMessage = '<%=LocalizationProvider.Login2_NotFilledMessage%>'
        $$Local.Session_IsExpiredMessage = '<%=LocalizationProvider.Session_IsExpiredMessage%>'

    </script>
    <script type="text/javascript">

        setRequestToken('<%=SessionProvider.GenRequestToken()%>');

        $(document).on('keypress', function (e) {

            if (e.which == 13) {

                loignUser2();
            }
        });

    </script>

</body>
</html>
