<%--// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.4.1.0--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Error.aspx.cs" Inherits="Error" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Error...</title>
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
    <link rel="stylesheet" href="App_Res/Themes/Default/ErrorView.css" />
    <link rel="shortcut icon" href="<%=ApplicationProvider.FaviconIcon %>.ico" />
</head>
<body class="hold-transition login-page">
    <div class="login-box">
        <div class="error-page" style="direction:ltr">
            <h2 class="headline text-red"><i class="fa fa-warning text-red"></i></h2>
            <div class="error-content">
                <br />
                <h3 class="error-box-title">Error executing program</h3>
                <h4 class="error-box-desc"><%=ErrorMessage %>
                    <br />
                    <%if (Request["Id"] == "UBW1Q9flSC" || Request["Id"] == "aMd19fl4C" || true)
                      { %><br />
                    <a href="Default.aspx">Try to login again.</a>
                    <%} %>
                </h4>
            </div>
        </div>
    </div>
</body>
</html>
