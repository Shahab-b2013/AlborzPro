<%--// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.2.0--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" /> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title><%=ApplicationProvider.PageTitle %> | <%=LocalizationProvider.Login %></title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        name="viewport" />
    <!-- Bootstrap -->
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/Bootstrap.css" />
    <!-- Bootstrap RTL -->
    <%if (ApplicationProvider.AppDirection == "RTL")
        {%>
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/Bootstrap-Rtl.css" />
    <% }%>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/Font-Awesome.css" />
    <!-- Ionicons -->
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/Ionicons.css" />
    <!-- App -->
    <link rel="stylesheet" href="App_Base/Css/App.css" />
    <%if (ApplicationProvider.AppDirection == "RTL")
        {%>
    <link rel="stylesheet" href="App_Base/Css/App-Rtl.css" />
    <% }%>
    <!-- Theme style -->
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Master.css" />
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/LoginView.css" />
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/FormView.css" />
    <link rel="shortcut icon" href="<%=ApplicationProvider.FaviconIcon %>.ico" />
</head>
<body class="hold-transition login-page" style="<%=ApplicationProvider.LoginBgColor %><%=ApplicationProvider.LoginBgImage %>">
    <form id="frmloginup">
        <div class="login-box">
            <div class="login-logo">
                <br />
                <a href="#" class="login-box-title"><%=ApplicationProvider.LoginPageTitle %></a>
            </div>
            <%if (ApplicationProvider.LoginLogoImage != "")
                { %>
            <img src="App_Res/Images/Login/<%=ApplicationProvider.LoginLogoImage %>" />
            <%} %>

            <div class="login-box-body">
                <p id="login-msg" class="login-box-msg"></p>

                <div class="form-group has-feedback">
                    <b class="login-box-label"><%=LocalizationProvider.UserName %></b>
                    <input class="form-control" autofocus="autofocus" placeholder="UserName" dir="ltr" id="username" onfocus="$('#login-msg').removeClass('bg-red');$('#login-msg').html('')" />
                </div>
                <div class="form-group has-feedback">
                    <b class="login-box-label"><%=LocalizationProvider.Password %></b>
                    <input type="password" class="form-control" placeholder="Password" dir="ltr" id="password" onfocus="$('#login-msg').removeClass('bg-red');$('#login-msg').html('')" />
                </div>
                <div class="row">
                    <div class="col-xs-1 login-box-link">
                        <%if (SysMembership.AllowSavePassword)
                            {%>
                        <input type="checkbox" />&nbsp;<%=LocalizationProvider.PasswordSaving %>
                        <% }%>
                    </div>
                    <div class="col-xs-4">
                        <button type="button" class="btn btn-block btn-flat btn-login" onclick="loignUser();"><%=LocalizationProvider.Login %></button>
                    </div>
                </div>
                <div class="social-auth-links text-center">
                    <%if (SysMembership.AllowDomainAuthentication)
                        {%>
                    <p class="login-box-label">- یا -</p>
                    <a href="#" class="btn btn-block btn-flat btn-login-long">
                        <i class="fa fa-windows"></i><%=LocalizationProvider.LoginByWindowsAccount %>
                    </a>
                    <% }%>
                </div>
                <%if (SysMembership.AllowResetForgottenPassword)
                    {%><br />
                <a href="#" class="login-box-link"><%=LocalizationProvider.ForgetPassword %></a>
                <% }%>
                <%if (SysMembership.AllowSelfRegisterUser)
                    {%><br />
                <a href="#" class="text-center login-box-link"><%=LocalizationProvider.CreateNewUser %></a>
                <% }%>
                <br />
                 <%if (ApplicationProvider.AppDirection == "RTL")
                 {%>
                 <a href="https://www.google.com/chrome" target="_blank" style="font-family:IRANSansWeb;font-size:12px">جهت استفاده از نرم افزار، از آخرین نسخه مرورگر کروم استفاده کنید</a>
                 <% } else {%>
                 <a href="https://www.google.com/chrome" target="_blank" style="display:none;font-family:IRANSansWeb;font-size:13px">Use the latest version of Chrome browser.</a>
                 <% }%>
        </div>
     </div>
    </form>
    <!-- jQuery -->
    <script type="text/javascript" src="App_Base/Js/Jquery/Jquery.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/Redirect.js"></script>
    <!-- Sys App -->
    <script type="text/javascript" src="App_Sys/Membership/Membership.js"></script>
    <script type="text/javascript" src="App_Sys/Membership/Md5.js"></script>
    <script type="text/javascript" src="App_Sys/Membership/Sha1.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Gui.Data.js"></script>
    <script type="text/javascript">

        var $$Local = {};
        $$Local.Login_NotFilledMessage = '<%=LocalizationProvider.Login_NotFilledMessage%>'
        $$Local.Session_IsExpiredMessage = '<%=LocalizationProvider.Session_IsExpiredMessage%>'

    </script>
    <script type="text/javascript">

        setRequestToken('<%=SessionProvider.GenRequestToken()%>');

        <%if (Request.HttpMethod == "POST")
        {%>
              jQuery.redirect('Default.aspx', {}, 'GET', '');
        <%}%>

        $(document).on('keypress', function (e) {

            if (e.which == 13) {

                loignUser();
            }
        });

    </script>

</body>
</html>
