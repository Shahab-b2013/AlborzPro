<%--// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)---
// Release Ferdos.WebAppDesk 2.4.0.0.Custom--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Register.aspx.cs" Inherits="Register" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title id="page-title">فرم ثبت نام</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        name="viewport" />
    <!-- Jquery -->
    <link rel="stylesheet" href="../App_Base/Css/Jquery/DataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Responsive.dataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Select.DataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/AutoComplete.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Autocomplete.Themes.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/ContextMenu.css" />
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
     <!-- Leaflet -->
    <link rel="stylesheet" href="../App_Base/Css/Leaflet/Leaflet.css" />
    <!-- App -->
    <link rel="stylesheet" href="../App_Base/Css/App.css" />
    <%if (ApplicationProvider.AppDirection == "RTL")
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
    <link rel="shortcut icon" href="../favicon.ico" />
</head>
<body class="hold-transition sidebar-mini sidebar-collapse">
    <input type="hidden" value="<%=ApplicationProvider.PageTitle %>" id="PageTitle" />
    <div class="wrapper">
        <header class="main-header" id="header" >
            <nav class="navbar navbar-static-top" style="margin-right: 0px !important;height:80px;background-image:url(../App_Res/Images/Page/Pad-Header.png)" role="navigation" id="headerBar">
            <a class="navbar-brand"><img src="../App_Res/Images/Page/Pad-Logo.png"></a>
            </nav>
        </header>
        <div class="content-wrapper" id="content" style="margin-right: 0px !important;">
            <section class="content-header">
                <h1 id="page-header" class="page-header">
                    <small id="page-desc"></small>
                </h1>
            </section>
            <section class="contentx" id="page-content" style="height:700px">
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
    </div>

    <script type="text/javascript" src="../App_Sys/Interface/Page.js"></script>

    <script type="text/javascript">

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
    <script type="text/javascript" src="../App_Base/Js/Jquery/jSignature.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/AutoComplete.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/ContextMenu.js"></script>
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
    <!-- Leaflet -->
    <script type="text/javascript" src="../App_Base/Js/Leaflet/Leaflet.js"></script>
     <!-- Geohash -->
    <script type="text/javascript" src="../App_Base/Js/Leaflet/Geohash.js"></script>
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
    <script type="text/javascript" src="../App_Sys/Interface/Components/GeoMapView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Navigation/SideTreeMenu.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Navigation/TopMenuBar.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Navigation/NotifierBar.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Navigation/HeaderMenuBar.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Controls/SelectList.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Controls/AutoComplete.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Controls/RadioButtonList.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Executor.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Custom.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Membership.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Md5.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Sha1.js"></script>

    <script type="text/javascript">

        setSaltKey('<%=Session.SessionID%>');

        $(window).load(function () {

            var $page = new page(<%=PageID%>,0);

            $page.renderPage(true, null, {} , {}, '', '', '');

            setTimeout('alignSideBarHeight();', 1 * 1000);
        });

       setRequestToken('<%=SessionProvider.GenRequestToken()%>');

    </script>
</body>
</html>
