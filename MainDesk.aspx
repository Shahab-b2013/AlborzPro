<%--// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)---
// Release Ferdos.WebAppDesk 4.3.0.0--%>
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MainDesk.aspx.cs" Inherits="MainDesk" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title id="page-title"><%=ApplicationProvider.PageTitle %></title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        name="viewport" />
    <!-- Jquery -->

    <link href="App_Res/Themes/Common/IncidentViewer.css" rel="stylesheet" />
    <%--<link href="App_Res/Themes/Common/IncidentViewer_Self.css" rel="stylesheet" />--%>
    <link href="App_Res/Themes/Common/IncidentViewer_Server.css" rel="stylesheet" />


 <link rel="stylesheet" href="App_Base/Css/Jquery/DataTables.css" />
     <%if (SessionProvider.UserDirection == "RTL")
         {

       %>
    <link rel="stylesheet" href="App_Base/Css/Jquery/DataTables-Rtl.css" />
   <%}%>
       
  


    
    <link rel="stylesheet" href="App_Base/Css/Jquery/Responsive.dataTables.css" />
    <link rel="stylesheet" href="App_Base/Css/Jquery/Select.DataTables.css" />
    <link rel="stylesheet" href="App_Base/Css/Jquery/AutoComplete.css" />
    <link rel="stylesheet" href="App_Base/Css/Jquery/Autocomplete.Themes.css" />
    <link rel="stylesheet" href="App_Base/Css/Jquery/ContextMenu.css" />
    <link rel="stylesheet" href="App_Base/Css/Jquery/Editor.css" />
    <%if (SessionProvider.UserDirection == "RTL")
    {
  %>
<link rel="stylesheet" href="App_Base/Css/Jquery/Editor-Rtl.css" />
<%}%>
  
    <!-- Bootstrap -->
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/Bootstrap.css" />
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/DataTables.css" />
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/Select.css" />
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/File.css" />
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/Select.Ajax.css" />
    <link href="App_Base/Css/Bootstrap/PersianCalendar.css" rel="stylesheet" />
    <link href="App_Base/Css/Bootstrap/PersianCalendar.Dgr.css" rel="stylesheet" />
    <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/Bootstrap-Rtl.css" />
    <% }%>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/Font-Awesome.css" />
    <%--<link rel="stylesheet" href="App_Base/Css/Bootstrap/Font-AwesomeAll.Min.css" />--%>
    <!-- Ionicons -->
    <link rel="stylesheet" href="App_Base/Css/Bootstrap/Ionicons.css" />
    <!-- ICheck -->
    <link rel="stylesheet" href="App_Base/Css/ICheck/Green.css" />
    <!-- Jstree -->
    <link rel="stylesheet" href="App_Base/Css/Jstree/Jstree.css" />
     <!-- Leaflet -->
    <link rel="stylesheet" href="App_Base/Css/Leaflet/Leaflet.css" />
    <!-- App -->
    <link rel="stylesheet" href="App_Res/Themes/Common/Master.css" />
     <link rel="stylesheet" href="App_Base/Css/App.css" />
    <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link rel="stylesheet" href="App_Base/Css/App-Rtl.css" />
     <% }%>
      

    
      <link rel="stylesheet" href="App_Res/Themes/Common/FormView.css" />
      <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link rel="stylesheet" href="App_Res/Themes/Common/FormView-Rtl.css" />
    <% }%>
       


 
    
     <link rel="stylesheet" href="App_Res/Themes/Common/GridView.css" />
     <link rel="stylesheet" href="App_Res/Themes/Common/GadgetView.css" />
      <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link rel="stylesheet" href="App_Res/Themes/Common/GridView-Rtl.css" />
    <link rel="stylesheet" href="App_Res/Themes/Common/GadgetView-Rtl.css" />
   <%}%>
       
  
    <!-- Theme style -->
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Master.css" />
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/FormView.css" />
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/CustomView.css" />
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/TabView.css" />
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/GridView.css" />
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/TreeView.css" />
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/ReportView.css" />
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/DetailView.css" />
    <link rel="stylesheet" href="App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/IncidentTimeLineView.css" />
    <link rel="shortcut icon" href="<%=ApplicationProvider.FaviconIcon %>.ico" />

      <link rel="stylesheet" href="App_Base/Css/Jquery/Select2.css" />
</head>
<body class="hold-transition sidebar-mini  <%if (SessionProvider.IsRedirected) {%>sidebar-open<%} else {%>sidebar-collapse<%}%>">
    <input type="hidden" value="<%=ApplicationProvider.PageTitle %>" id="PageTitle" />
    <div class="wrapper">
        <header class="main-header" id="header">
            
            <nav class="navbar navbar-static-top" role="navigation" id="headerBar">
                <a style="cursor:pointer" class="logo" id="logo">
                <span class="logo-mini" id="logo_mini">      
                <%if (ApplicationProvider.AppThemeName == "Blue_Violet") {%><img src="<%=ApplicationProvider.FaviconIcon %>.ico" /><%} else {%><%=ApplicationProvider.HeaderShortTitle %><% }%></span>
                <span id="logo_lg" class="logo-lg"><%if (ApplicationProvider.AppThemeName == "Blue_Violet") {%><img src="<%=ApplicationProvider.FaviconIcon %>.ico" /><%}%><%if (ApplicationProvider.AppThemeName == "Blue_Like") {%><img alt="" src="<%=ApplicationProvider.FaviconIcon %>.png" style="clip-path: circle();" /><% }%><%=ApplicationProvider.HeaderTitle %></span>
            </a>

                <%if (!SessionProvider.IsRedirected) {%>
                <a style="cursor:pointer" class="sidebar-toggle" data-toggle="offcanvas" role="button" id="toggleSideBar">
                    <span class="sr-only">Toggle navigation</span>
                </a>
                 <%}%>
                <div <%if (SessionProvider.IsRedirected) {%>style="display:none"<%}%>>
                    <ul class="nav navbar-nav" id="headerMenuBar">
                    </ul>
                    <%if (SessionProvider.AllowChangeSettingOnLogin && SessionProvider.UserLanguage == "Fa")
                        {%>
                    <ul class="nav navbar-nav" id="headerMenuBar">
                        <li class="dropdown"><a style="cursor:pointer" onclick="openModalContext(1,1005160,'FormView',[<%=SessionProvider.UserID %>],0,null,null)" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-style-m fa-gear"></i>&nbsp;<span>تنظیمات سامانه&nbsp;<%=SessionProvider.GetFormatedValue("LoginSettingLabel")%></span></a></li>
                    </ul>
                    <%}%>
                </div>
                <div class="navbar-custom-menu">
                     <%if (SessionProvider.AllowProfileMenu && !SessionProvider.IsRedirected) {%>
                      <ul class="nav navbar-nav" id="notifierBar">
                     
                        <li class="dropdown user user-menu">
                            <a style="cursor:pointer" class="dropdown-toggle" data-toggle="dropdown" id="userLabel">
                                <%if (SessionProvider.UserImageEnabled)
                                    {%>
                                <%if (!string.IsNullOrEmpty(SessionProvider.UserImage))
                                    {%>
                                <img src="App_Res/Images/Users/<%=SessionProvider.UserImage %>" class="user-image" alt="User Image">
                                <%} %>
                                <%} %>
                                <span class="hidden-xs"><%=SessionProvider.FirstName %>&nbsp;<%=SessionProvider.LastName %></span>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="user-header" id="userHeader">
                                    <%if (SessionProvider.UserImageEnabled)
                                        {%>
                                    <%if (!string.IsNullOrEmpty(SessionProvider.UserImage))
                                        {%>
                                    <img src="App_Res/Images/Users/<%=SessionProvider.UserImage %>" class="img-circle" alt="User Image">
                                    <%} %>
                                    <%} %>
                                    <p>
                                        <%=SessionProvider.FirstName %>&nbsp;<%=SessionProvider.LastName %> - <%=SessionProvider.MasterRole %>
                                    </p>
                                </li>
                                <li class="user-footer" id="userMenu">
                                    <div class="btn-group">
                                        <%if (SessionProvider.AllowChangeProfile)
                                            {%>

                                        <a style="cursor:pointer" class="btn btn-flat btn-profile btn-default"><span class="fa fa-edit"></span>&nbsp; <%=LocalizationProvider.MyProfile %></a>

                                        <%}%>
                                        <%if (SessionProvider.AllowChangePassword)
                                            {%>

                                        <a style="cursor:pointer;color: white" class="btn btn-flat btn-profile btn-info" onclick="jQuery.redirect('App_Sec/ChangePassword.aspx', {'requestToken': genResponseToken()}, 'POST', '');"><span class="fa fa-edit"></span>&nbsp; <%=LocalizationProvider.ChangePassword %></a>

                                        <%} %>
                                        <%if (SessionProvider.AllowChangeStatus && SessionProvider.AllowChangeSettingOnLogin && SessionProvider.UserLanguage == "Fa")
                                            {%>

                                        <a style="cursor:pointer;color: white" class="btn btn-flat btn-profile btn-success" onclick="openModalContext(1,1005159,'FormView',[<%=SessionProvider.UserID %>],0,null,null)"><span class="fa fa-edit"></span>&nbsp; <%=LocalizationProvider.MyStatus %></a>

                                        <%} %>

                                        <a style="cursor:pointer;color: white" class="btn btn-flat btn-profile btn-danger"  onclick="logoutUser()"><span class="fa fa-lock"></span>&nbsp;<%=LocalizationProvider.Logout %></a>
                                    </div>
                                </li>
                                
                            </ul>
                        </li>
                        
                        <%if (SessionProvider.AllowPersonalizeMenu && SessionProvider.UserLanguage == "Fa")
                            {%>
                        <%} %>
                    </ul>
                    <%} else%>
                    <% {%>
                    <ul style="list-style-type: none; margin: 0; padding: 0px; overflow: hidden;height :50px">
                        <li class="lie" style="float: left;"><a href="#" onclick="window.close();"><img alt="" src="App_Res/Images/Menu/32/Exit.png" class="form_img" style="clip-path: circle();" />&nbsp;خروج</a></li>
                        <%if (ApplicationProvider.BPMSHome)
                            {%>
                        <li class="lie" style="float: left;"><a href="#" onclick="location.reload();"><img alt="" src="App_Res/Images/Menu/32/Home.png" class="form_img" style="clip-path: circle();" />&nbsp;صفحه شروع</a></li>
                        <%}%>
                    </ul>
                    <%} %>
                </div>
            </nav>
            <nav class="navbar navbar-default" role="navigation" id="tobBar" style="display:<%=ApplicationProvider.TopMenuVisibility%>">
                <ul class="nav navbar-nav" id="topMenuBar">
                </ul>
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
                        <img src="App_Res/Images/Users/<%=SessionProvider.UserImage %>" class="img-circle" alt="User Image">
                        <%} %>
                    </div>
                    <%} %>
                    <div class="info" id="userInfo">
                        <p><%=SessionProvider.FirstName %>&nbsp;<%=SessionProvider.LastName %></p>
                        <a style="cursor:pointer;"><i class="fa fa-circle"></i><%=SessionProvider.MasterRole %></a>
                        <%if (SessionProvider.AllowChangeStatus && SessionProvider.AllowChangeSettingOnLogin && SessionProvider.UserLanguage == "Fa")
                            {%>
                        <p><i class="fa fa-circle"></i>&nbsp;وضعیت <i class="fa fa-angle-double-left"></i>&nbsp;<span style="color: <%if(SessionProvider.UserStatus.ToString().Contains("آماده")){Response.Write("lightgreen"); }else{Response.Write("orangered"); }%>; font-size: 14px"><%=SessionProvider.UserStatus %></span></p>
                        <%} %>
                    </div>
                </div>
                <ul class="sidebar-menu" id="sideTreeMenu">
                </ul>
            </section>
        </aside>
       <%} %>
        <div class="content-wrapper" id="content"  <%if (SessionProvider.IsRedirected){%>style="margin-right:0px!important" <%} %>>
            <section class="content-header">
                <h1 id="page-header" class="page-header">
                    <small id="page-desc"></small>
                </h1>
            </section>
            <section class="contentx" id="page-content" style="height:700px">
                <img alt="Loading..." src="App_Res/Images/Ajax/AjaxLoader.gif" class="ajaxloader" />
            </section>
            <div class="modal modal-primary" id="actContextModal1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="box box-solid" style="width: 1200px;" id="pageBoxModal1">
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
        <footer class="main-footer" id="#footer"<%if (SessionProvider.IsRedirected){%>style="margin-right:0px!important" <%} %>>
            <div class="row">
                <%if (SessionProvider.UserDirection == "RTL")
                    {%>
                <div class="pull-right col-md-11"><span><a href="https://amnpardaz.com" id="copyRightLabel" target="_blank"><%=ApplicationProvider.CopyRightStatement %></a></span></div>
                <div class="pull-left col-md-1">&nbsp;<span id="versionLabel"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span></div>
                 <%} else {%>
                <div class="pull-left col-md-10"><span><a href="https://amnpardaz.com" id="copyRightLabel" target="_blank"><%=ApplicationProvider.CopyRightStatement %></a></span></div>
                <div class="pull-right col-md-2">&nbsp;<span id="versionLabel" class="pull-right"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span></div>
                <%} %>
            </div>
        </footer>
        <aside class="control-sidebar control-sidebar-light">
            <!--Only Farsi supported-->
            <div class="control-sidebar-bg" id="settingBar">
            </div>
        </aside>
    </div>

    <script type="text/javascript" src="App_Sys/Interface/Page.js"></script>

    <script type="text/javascript">

        $$UserProp.JobTitle = '<%=SessionProvider.JobTitle%>'
        $$UserProp.MasterRole = '<%=SessionProvider.MasterRole%>'
        $$UserProp.InteractionLanguage = '<%=SessionProvider.UserLanguage%>'

        <%if (SessionProvider.GetValue("DF$FromDate") != "0")
        {%>
            $$DF.FromDate = '<%=LocalizationProvider.GetLocalDate(SessionProvider.GetValue("DF$FromDate"))%>'
            $$DF.ToDate = '<%=LocalizationProvider.GetLocalDate(SessionProvider.GetValue("DF$ToDate"))%>'
        <% }
        else
        {%>
            $$DF.FromDate = 'None';
            $$DF.ToDate = 'None';
          <%}%>

        $$Local.Login_NotFilledMessage = '<%=LocalizationProvider.Login_NotFilledMessage%>'
        $$Local.Session_IsExpiredMessage = '<%=LocalizationProvider.Session_IsExpiredMessage%>'
        $$Local.formSubmit = '<%=LocalizationProvider.Form_Submit%>'
        $$Local.formSave = '<%=LocalizationProvider.Form_Save%>'
        $$Local.formCancel = '<%=LocalizationProvider.Form_Cancel%>'
        $$Local.formClose= '<%=LocalizationProvider.Form_Close%>'
        $$Local.formReset = '<%=LocalizationProvider.Form_Reset%>'
        $$Lang = '<%=SessionProvider.UserLanguage%>'
        $$Dir = '<%=SessionProvider.UserDirection%>'
        $$Currency = '<%=ApplicationProvider.AppCurrency%>'
        var $$PackageName ='<%=ApplicationProvider.PackageName%>'
        $$DefDsbPageID = '<%=SessionProvider.DefDsbPageID%>'
        
    </script>

    <!-- jQuery -->
    
    <script type="text/javascript" src="App_Base/Js/Jquery/Jquery.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/BlockUI.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/Redirect.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/Knob.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/Excel.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/jSignature.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/AutoComplete.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/ContextMenu.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/Editor.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/DataTable/DataTables.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/DataTable/Responsive.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/DataTable/Select.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/InputMask/InputMask.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/InputMask/Jquery.InputMask.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/InputMask/DependencyLib.Jquery.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/InputMask/Date.Extensions.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/InputMask/Numeric.Extensions.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/InputMask/Extensions.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/InputMask/Regex.Extensions.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jquery/Select2.Min.js"></script>
    <!-- Bootstrap -->
    <script type="text/javascript" src="App_Base/Js/Bootstrap/Bootstrap.js"></script>
    <script type="text/javascript" src="App_Base/Js/Bootstrap/DataTable/DataTables.js"></script>
    <script type="text/javascript" src="App_Base/Js/Bootstrap/Select/Select.js"></script>
    <script type="text/javascript" src="App_Base/Js/Bootstrap/Select/Select.Ajax.js"></script>
    <script type="text/javascript" src="App_Base/Js/Bootstrap/DatePicker/Jalaali.js"></script>
    <script type="text/javascript" src="App_Base/Js/Bootstrap/DatePicker/PersianDateTimePicker.js"></script>
    <script type="text/javascript" src="App_Base/Js/Bootstrap/File/File.js"></script>
    <script type="text/javascript" src="App_Base/Js/SweetAlert/SweetAlert.Min.js"></script>
    <!-- Encryption -->
    <script type="text/javascript" src="App_Base/Js/Encryption/Barrett.js"></script>
    <script type="text/javascript" src="App_Base/Js/Encryption/BigInt.js"></script>
    <script type="text/javascript" src="App_Base/Js/Encryption/RSA.js"></script>
    <!-- App -->
    <script type="text/javascript" src="App_Base/Js/App.js"></script>
    <script type="text/javascript" src="App_Base/Js/ICheck.js"></script>
    <script type="text/javascript" src="App_Base/Js/Jstree.js"></script>
    <script type="text/javascript" src="App_Base/Js/Xlsx.js"></script>
    <!-- Json -->
    <script type="text/javascript" src="App_Base/Js/Json.js"></script>
    <!-- Leaflet -->
    <script type="text/javascript" src="App_Base/Js/Leaflet/Leaflet.js"></script>
     <!-- Geohash -->
    <script type="text/javascript" src="App_Base/Js/Leaflet/Geohash.js"></script>
    <!-- HighChart -->
    <script type="text/javascript" src="App_Base/Js/Highcharts/Highcharts.js"></script>
    <script type="text/javascript" src="App_Base/Js/Highcharts/Highcharts-3d.js"></script>
    <script type="text/javascript" src="App_Base/Js/Highcharts/Highcharts-more.js"></script>
    <script type="text/javascript" src="App_Base/Js/Highcharts/Exporting.js"></script>
    <script type="text/javascript" src="App_Base/Js/Highcharts/FullScreen.js"></script>
    <!-- Sys App -->
    <script type="text/javascript" src="App_Sys/Interface/Gui.Data.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Gui.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/GridView.js"></script>
    <script src="App_Sys/Interface/Components/Alerts/Alert.js"></script>
    <script src="App_Sys/Interface/Components/Alerts/AddAlert.js"></script>
    <script src="App_Sys/Interface/Components/Alerts/MovetoAlert.js"></script>
    <script src="App_Sys/Interface/Components/Alerts/FilterComponent.js"></script>
    <script src="App_Sys/Interface/Components/Comment.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/IncidentTimeLineView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/FormView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/GadgetView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/ChartView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/DetailListView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/TreeView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/DetailView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/CheckListView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/CheckFormView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/ReportView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/CustomReportView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/GeoMapView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/AlertMapView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Components/TableView.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Navigation/SideTreeMenu.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Navigation/TopMenuBar.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Navigation/NotifierBar.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Navigation/HeaderMenuBar.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Controls/SelectList.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Controls/AutoComplete.js"></script>
    <script type="text/javascript" src="App_Sys/Interface/Controls/RadioButtonList.js"></script>
    <script type="text/javascript" src="App_Sys/Activity/Activity.Data.js"></script>
    <script type="text/javascript" src="App_Sys/Activity/Activity.Executor.js"></script>
    <script type="text/javascript" src="App_Sys/Activity/Activity.Custom.js"></script>
    <script type="text/javascript" src="App_Sys/Membership/Membership.js"></script>
    <script type="text/javascript" src="App_Sys/Membership/Md5.js"></script>
    <script type="text/javascript" src="App_Sys/Membership/Sha1.js"></script>

    <script type="text/javascript">
     
        <%if (IsRedirected)
        {%>
            setSaltKey('<%=UserGuid.ToString()%>');
        <%}%>

        //checkToken();

        $(window).load(function () {

            iLoadCommonData();

        var $page = new page(<%=PageID%>,<%=ObjKey%>);

        <% if (string.IsNullOrEmpty(DefaultContextType))
        { %>
            $page.renderPage(true, null, {}, {}, '<%=SearchKey%>', '<%=SearchVal%>', '<%=SearchLbl%>');

            <% if (PageID>=1000000)
           { %>              
            renderPage('#page-cell-1000605', <%=PageID%>, 0);           
           <%}%>
        <%}
        else
        {%>
            $page.renderPage(true, null, { TargetContext: <%=DefaultContextID%> }, { TargetContext: '<%=DefaultContextType%>' }, '<%=SearchKey%>', '<%=SearchVal%>', '<%=SearchLbl%>');
        <%}%>

         setTimeout('alignSideBarHeight();', 1 * 1000);
        });

        setRequestToken('<%=SessionProvider.GenRequestToken()%>');

        keepAliveSession();

        //Product Compatibility
        <%if (SessionProvider.AllowChangeSettingOnLogin && !SessionProvider.LoginSettingDone && !SessionProvider.IsRedirected && SessionProvider.UserLanguage == "Fa")
        {%>
             //openModalContext(1, 1005160, 'FormView', [<%=SessionProvider.UserID %>], 0, null, null);
        <%}%>

        $(document).ready(function () {

            window.history.pushState(null, "", window.location.href);
            window.onpopstate = function () {
                window.history.pushState(null, "", window.location.href);
            };
        });

        $(window).resize(function () {

            setTimeout('alignSideBarHeight();', 1 * 100);

        });

        $(document).keydown(function (e) {
     
            if (e.keyCode == 27) {
               
                $('#btnCnsModal' + _modalID).trigger("click");

                _modalID = 0;
            }
        });

        $(document).mousedown(function(e){
            if (e.which === 2) {   
               return false;
            }
        });

        if ('<%=ApplicationProvider.TopMenuVisibility%>' == 'block') {
            _showTopMenu = true;
        }

    </script>
</body>
</html>

