<%--// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)---
// Release Ferdos.WebAppDesk 3.6.0.0--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ReportDesk.aspx.cs" Inherits="ReportDesk" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title id="page-title"><%=ApplicationProvider.PageTitle %></title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        name="viewport" />
    <!-- Jquery -->
    <link rel="stylesheet" href="../App_Base/Css/Jquery/DataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Responsive.dataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Select.DataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/AutoComplete.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Autocomplete.Themes.css" />
    <!-- Bootstrap -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Bootstrap.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/DataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Select.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/File.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Select.Ajax.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/PersianCalendar.css" />
    <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Bootstrap-Rtl.css" />
    <% }%>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Font-Awesome.css" />
    <!-- Ionicons -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Ionicons.css" />
    <!-- ICheck -->
    <link rel="stylesheet" href="../App_Base/Css/ICheck/Green.css" />
    <!-- Jstree -->
    <link rel="stylesheet" href="../App_Base/Css/Jstree/Jstree.css" />
    <!-- App -->
    <link rel="stylesheet" href="../App_Base/Css/App.css" />
    <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link rel="stylesheet" href="../App_Base/Css/App-Rtl.css" />
    <% }%>
    <!-- Theme style -->
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Master.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/FormView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/CustomView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/TabView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/GridView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/TreeView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/ReportView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/DetailView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/TimeLineView.css" />
    <link rel="shortcut icon" href="../<%=ApplicationProvider.FaviconIcon %>.ico" />

    <style>
        .section {
            border: 1px solid #e6e9ed !important;
        }
    </style>
</head>
<body class="hold-transition sidebar-mini  <%if (SessionProvider.IsRedirected) {%>sidebar-open<%} else {%>sidebar-collapse<%}%>">
    <input type="hidden" value="<%=ApplicationProvider.PageTitle %>" id="PageTitle" />
    <div class="wrapper">
        <header class="main-header" id="header">
            <a style="cursor:pointer" class="logo" id="logo">
                <span class="logo-mini" id="logo_mini">      
                <%if (ApplicationProvider.AppThemeName == "Blue_Violet") {%><img src="../<%=ApplicationProvider.FaviconIcon %>.ico" /><%} else {%><%=ApplicationProvider.HeaderShortTitle %><% }%></span>
                <span id="logo_lg" class="logo-lg"><%if (ApplicationProvider.AppThemeName == "Blue_Violet") {%><img src="../<%=ApplicationProvider.FaviconIcon %>.ico" /><%}%><%if (ApplicationProvider.AppThemeName == "Blue_Like") {%><img alt="" src="../<%=ApplicationProvider.FaviconIcon %>.png" style="clip-path: circle();" /><% }%><%=ApplicationProvider.HeaderTitle %></span>
            </a>
            <nav class="navbar navbar-static-top" role="navigation" id="headerBar">
                <%if (!SessionProvider.IsRedirected) {%>
                <a style="cursor:pointer" class="sidebar-toggle" data-toggle="offcanvas" role="button" id="toggleSideBar">
                    <span class="sr-only">Toggle navigation</span>
                </a>
                 <%}%>
                <div>
                    <ul class="nav navbar-nav" id="headerMenuBar">
                        <li class="dropdown" id="out" onclick="window.open('', '_self').close();" style="display: block;">
                            <a style="cursor: pointer; direction: rtl; color: lightgray !important">
                                <img src="data:image/png;base64,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" style="position: relative; font-size: 16px !important; margin: -12px 0px; clip-path: circle();" btnexit="true"></img><span style="margin: 0px 3px; font-weight: normal" changelang="out" btnexit="true">خروج</span></a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <%if (!SessionProvider.IsRedirected){%>
        <aside class="main-sidebar" id="sideBar">
            <section class="sidebar">
                <div class="user-panel">
                    <%if (SessionProvider.UserImageEnabled)
                        {%>
                    <div class="pull-left image">
                        <%if (!string.IsNullOrEmpty(SessionProvider.UserImage))
                            {%>
                        <img src="../App_Res/Images/Users/<%=SessionProvider.UserImage %>" class="img-circle" alt="User Image">
                        <%} %>
                    </div>
                    <%} %>
                    <div class="info" id="userInfo">
                        <p><%=SessionProvider.FirstName %>&nbsp;<%=SessionProvider.LastName %></p>
                        <a href="#"><i class="fa fa-circle"></i><%=SessionProvider.MasterRole %></a>
                    </div>
                </div>
            </section>
        </aside>
         <%} %>
        <div class="content-wrapper" id="content"  <%if (SessionProvider.IsRedirected){%>style="margin-right:0px!important" <%} %>>
            <section class="content-header">
                <h1 id="page-header" class="page-header">
                    <small id="page-desc"></small>
                </h1>
            </section>
            <section class="contentx" id="page-content" style="height: 700px">
                <img alt="Loading..." src="../App_Res/Images/Ajax/AjaxLoader.gif" class="ajaxloader" />
            </section>
            <div class="modal modal-primary" id="actContextModal1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="box box-solid" id="pageBoxModal1">
                            <div class="box-header with-border">
                                <h3 class="box-title" id="boxTitleModal1"></h3>
                                <div class="box-tools pull-right">
                                    <button type="button" class="close" id="closeBtnModal1" data-dismiss="modal" aria-label="Close"><i class="fa fa-times"></i></button>
                                </div>
                            </div>
                            <form class="form-horizontal">
                                <div class="box-body" id="boxBodyModal1">
                                </div>
                            </form>
                            <div class="box-footer" id="boxFooterModal1">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal modal-primary" id="actContextModal2">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="box box-solid" id="pageBoxModal2">
                            <div class="box-header with-border">
                                <h3 class="box-title" id="boxTitleModal2"></h3>
                                <div class="box-tools pull-right">
                                    <button type="button" class="close" id="closeBtnModal2" data-dismiss="modal" aria-label="Close"><i class="fa fa-times"></i></button>
                                </div>
                            </div>
                            <form class="form-horizontal">
                                <div class="box-body" id="boxBodyModal2">
                                </div>
                            </form>
                            <div class="box-footer" id="boxFooterModal2">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal modal-primary" id="actContextModal3">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="box box-solid" id="pageBoxModal3">
                            <div class="box-header with-border">
                                <h3 class="box-title" id="boxTitleModal3"></h3>
                                <div class="box-tools pull-right">
                                    <button type="button" class="close" id="closeBtnModal3" data-dismiss="modal" aria-label="Close"><i class="fa fa-times"></i></button>
                                </div>
                            </div>
                            <form class="form-horizontal">
                                <div class="box-body" id="boxBodyModal3">
                                </div>
                            </form>
                            <div class="box-footer" id="boxFooterModal3">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="main-footer" id="#footer">
            <div class="row">
                <%if (SessionProvider.UserDirection == "RTL")
                    {%>
                <div class="pull-right col-md-11"><span><a href="https://amnpardaz.com" id="copyRightLabel" target="_blank"><%=ApplicationProvider.CopyRightStatement %></a></span></div>
                <div class="pull-left col-md-1">&nbsp;<span id="versionLabel"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span></div>
                <%}
                else
                {%>
                <div class="pull-left col-md-11"><span><a href="https://amnpardaz.com" id="copyRightLabel" target="_blank"><%=ApplicationProvider.CopyRightStatement %></a></span></div>
                <div class="pull-right col-md-1">&nbsp;<span id="versionLabel"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span></div>
                <%} %>
            </div>
        </footer>
    </div>

    <script type="text/javascript" src="../App_Sys/Interface/Page.js"></script>

    <script type="text/javascript">

        $$UserProp.JobTitle = '<%=SessionProvider.JobTitle%>'
        $$UserProp.MasterRole = '<%=SessionProvider.MasterRole%>'
        $$UserProp.InteractionLanguage = '<%=SessionProvider.UserLanguage%>'
        $$Local.Login_NotFilledMessage = '<%=LocalizationProvider.Login_NotFilledMessage%>'
        $$Local.Session_IsExpiredMessage = '<%=LocalizationProvider.Session_IsExpiredMessage%>'
        $$Local.formSubmit = '<%=LocalizationProvider.Form_Submit%>'
        $$Local.formCancel = '<%=LocalizationProvider.Form_Cancel%>'
        $$Local.formReset = '<%=LocalizationProvider.Form_Reset%>'
        $$Lang = '<%=SessionProvider.UserLanguage%>'
        $$Dir = '<%=SessionProvider.UserDirection%>'
        $$Currency = '<%=ApplicationProvider.AppCurrency%>'
        var $$PackageName ='<%=ApplicationProvider.PackageName%>'

    </script>

    <!-- jQuery -->
    <script type="text/javascript" src="../App_Base/Js/Jquery/Jquery.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/BlockUI.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Redirect.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Knob.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Excel.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Print.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/AutoComplete.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/DataTable/DataTables.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/DataTable/Responsive.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/DataTable/Select.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/InputMask.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Jquery.InputMask.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/DependencyLib.Jquery.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Date.Extensions.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Numeric.Extensions.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Extensions.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Regex.Extensions.js"></script>
    <!-- Bootstrap -->
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Bootstrap.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/DataTable/DataTables.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Select/Select.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Select/Select.Ajax.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/DatePicker/Jalaali.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/DatePicker/PersianDateTimePicker.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/File/File.js"></script>
    <!-- Encryption -->
    <script type="text/javascript" src="../App_Base/Js/Encryption/Barrett.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Encryption/BigInt.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Encryption/RSA.js"></script>
    <!-- App -->
    <script type="text/javascript" src="../App_Base/Js/App.js"></script>
    <script type="text/javascript" src="../App_Base/Js/ICheck.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jstree.js"></script>
    <!-- Json -->
    <script type="text/javascript" src="../App_Base/Js/Json.js"></script>
    <!-- HighChart -->
    <script type="text/javascript" src="../App_Base/Js/Highcharts/Highcharts.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/Highcharts-3d.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/Highcharts-more.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/Exporting.js"></script>
    <!-- Sys App -->
    <script type="text/javascript" src="../App_Sys/Interface/Gui.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Gui.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/GridView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/TimeLineView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/FormView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/GadgetView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/ChartView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/DetailListView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/TreeView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/DetailView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/CheckListView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/CheckFormView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/ReportView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Navigation/SideTreeMenu.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Navigation/TopMenuBar.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Navigation/NotifierBar.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Navigation/HeaderMenuBar.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Controls/SelectList.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Controls/AutoComplete.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Controls/RadioButtonList.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Executor.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Membership.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Md5.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Sha1.js"></script>

    <script type="text/javascript">

        $(window).load(function () {

            var $page = new page(<%=PageID%>, <%=ObjKey%>);

            $page.renderPage(false, null, {}, {}, '', '', '');

            setTimeout('alignSideBarHeight();', 1 * 1000);
        });

        setRequestToken('<%=SessionProvider.GenRequestToken()%>');

        $(window).resize(function () {

            setTimeout('alignSideBarHeight();', 1 * 100);

        });

        keepAliveSession();

        $(document).ready(function () {

            window.history.pushState(null, "", window.location.href);
            window.onpopstate = function () {
                window.history.pushState(null, "", window.location.href);
            };
        });

        $(document).keydown(function (e) {

            if (e.keyCode == 27) {

                $('#btnCnsModal' + _modalID).trigger("click");

                _modalID = 0;
            }
        });

        $(document).mousedown(function (e) {
            if (e.which === 2) {
                return false;
            }
        });
    </script>
</body>
</html>
