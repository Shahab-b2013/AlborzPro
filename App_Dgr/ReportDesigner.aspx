<%--/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.6.0.0*/
/* Release Ferdos.BPMS*/--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ReportDesigner.aspx.cs" Inherits="ReportDesigner" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title id="page-title"><%=ApplicationProvider.PageTitle %> | گزارش ساز</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />
    <script type="text/javascript" src="../App_Base/Js/SweetAlert/SweetAlert.Min.js"></script>

    <!-- Jquery -->
    <link rel="stylesheet" href="../App_Base/Css/Jquery/DataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Responsive.dataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Select.DataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/AutoComplete.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Autocomplete.Themes.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/QueryBuilder.css" />
    <!-- Bootstrap -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Bootstrap.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Bootstrap.Theme.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/DataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Select.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/File.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Select.Ajax.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/PersianCalendar.Dgr.css" />
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
    <!-- ReportDesigner -->
    <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link rel="stylesheet" href="../App_Res/Themes/Common/ReportDesigner-Rtl.css" />
    <%}
        else
        { %>
    <link rel="stylesheet" href="../App_Res/Themes/Common/ReportDesigner.css" />
    <% }%>
    <!-- Theme style -->
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Master.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/FormView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/ReportView.css" />
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
                <div>
                    <ul class="nav navbar-nav" id="headerMenuBar">
                        <li id="Menu" class="dropdown" onclick="saveDesign(true);"><a style="cursor: pointer" onclick="" class="dropdown-toggle" data-toggle="dropdown">
                            <i class="fa fa-style-m fa-save" style="position: relative; display: inline"></i>&nbsp;<span changelang="storage"></span></a></li>
                        <li class="dropdown" id="out" onclick="Exit()" style="display: block;" btnexit="true">
                            <a style="cursor: pointer; direction: rtl;" btnexit="true">
                                <img src="data:image/png;base64,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" style="position: relative; font-size: 16px !important; margin: -12px 0px; clip-path: circle();" btnexit="true"></img><span style="margin: 0px 3px; font-weight: normal" changelang="out" btnexit="true"><span changelang="exit"></span></a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
         <%if (!SessionProvider.IsRedirected){%>
        <aside class="main-sidebar" id="sideBar" style="width: 51px !important;">
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
        <div class="content-wrapper" id="content" style="min-height: 847px;<%if (SessionProvider.IsRedirected){%>margin-right:0px!important<%} %>">
            <section class="content-header" style="display: block;">
                <h1 id="page-header" class="page-header" changelang="reportDesign">&nbsp;&nbsp;&nbsp;</h1>
            </section>
            <section class="contentx" id="page-content">
                <div class="row row-centered">
                    <div class="col-md-12 col-centered">
                        <div class="section">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="collapse navbar-collapse report-toolbar">
                                        <ul class="nav navbar-nav">
                                            <li id="Lirpt-wiz-1" class="active" onclick="clickNavbar(this.id)"><a href="#" changelang="generalSpecifications"></a></li>
                                            <li id="Lirpt-wiz-2" onclick="clickNavbar(this.id)"><a href="#" changelang="columns"></a></li>
                                            <li id="Lirpt-wiz-3" onclick="clickNavbar(this.id)"><a href="#" changelang="filters"></a></li>
                                            <li id="Lirpt-wiz-4" onclick="clickNavbar(this.id)"><a href="#" changelang="access"></a></li>
                                            <li id="Lirpt-wiz-5" onclick="clickNavbar(this.id)"><a href="#" changelang="timing"></a></li>
                                            <li id="Lirpt-wiz-6" onclick="clickNavbar(this.id)"><a href="#" changelang="preview">&nbsp;&nbsp;</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="row" id="rpt-wiz-1">
                                <div class="col-md-12">
                                    <div class="row" style="height: 20px">
                                    </div>
                                    <div class="row">
                                        <div class="row form-group-box">
                                            <div class="col-lg-2 col-md-2 group-info">
                                                <h4 class="group-title" changelang="basicInformation">
                                                    <br>
                                                    <small></small></h4>
                                            </div>
                                            <div class="col-lg-7 col-md-10 col-sm-12  col-xs-12">
                                                <div class="form-group">
                                                    <label changelang="title"></label>
                                                    <div class="input-group">
                                                        <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
                                                        <input id="tltleTxt" type="text" title="Label" disabled="disabled" class="form-control form-input">
                                                    </div>
                                                </div>
                                                <div class="form-group" style="display:none">
                                                    <label changelang="">سرعنوان (Header)</label>
                                                    <div class="input-group">
                                                        <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>

                                                        <input id="headerTxt" type="text" title="Label" class="form-control form-input">
                                                    </div>
                                                </div>
                                                <div class="form-group" style="display:none">
                                                    <label>زیر عنوان (Footer)</label>
                                                    <div class="input-group">
                                                        <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>

                                                        <input id="footerTxt" type="text" title="Label" class="form-control form-input">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label changelang="description"></label>
                                                    <div class="input-group">
                                                        <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
                                                        <textarea id="descriptionTxt" title="FirstName" rows="5" class="form-control form-input"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row form-group-box">
                                            <div class="col-lg-2 col-md-2 group-info">
                                                <h4 class="group-title" changelang="reportData">
                                                    <br>
                                                    <small></small></h4>
                                            </div>
                                            <div class="col-lg-7 col-md-10 col-sm-12  col-xs-12">
                                                <div class="form-group">
                                                    <label changelang="datashema"></label>
                                                    <div class="input-group">
                                                        <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>

                                                        <select title="Label" id="selectReportSchema" class="form-control form-input"></select>
                                                    </div>
                                                </div>
                                                <div class="form-group" style="display: none">
                                                    <label changelang="dataGrouping"></label>
                                                    <div class="input-group">
                                                        <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
                                                        <select title="Label" id="selectDataCategory" class="form-control form-input"></select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" style="height: 50px">
                                        &nbsp;&nbsp;
                                        <button id="btn_rpt-wiz-1" type="button" onclick="nextTab(this.id)" class="btn btn-form-submit" changelang="Next"></button>
                                    </div>
                                </div>
                            </div>
                            <div class="row" id="rpt-wiz-2">
                                <div class="col-md-12">
                                    <div class="row" style="height: 20px">
                                        <!--Header-->
                                    </div>
                                    <div class="row" id="select-builder">
                                        <!-- QueryBuilderBody -->
                                    </div>
                                    <div class="row" style="height: 50px">
                                        &nbsp;&nbsp;
                                        <button id="btn_rpt-wiz-2" type="button" onclick="nextTab(this.id)" class="btn btn-form-submit" changelang="Next"></button>
                                    </div>
                                </div>
                            </div>
                            <div class="row" id="rpt-wiz-3">
                                <div class="col-md-12">
                                    <div class="row" style="height: 20px">
                                        <!--Header-->
                                    </div>
                                    <div class="row" id="filter-builder"></div>
                                    <!-- QueryBuilderBody -->
                                </div>
                                <div class="row" style="height: 50px">
                                    &nbsp;&nbsp;
                                    <button id="btn_rpt-wiz-3" type="button" onclick="saveDesign(true)"
                                        class="btn btn-form-submit" changelang="save">
                                    </button>
                                </div>
                            </div>
                            <div class="row" id="rpt-wiz-4">
                                <div class="col-md-12">
                                    <div class="row" style="height: 20px">
                                    </div>
                                    <div class="row">
                                        <ul class="nav nav-tabs" style="padding-right: 5px">
                                            <li class="active" id="userRoles"><a data-toggle="tab" href="#rolesTabContent" changelang="UserRoles"></a></li>
                                            <li id="userGroups"><a data-toggle="tab" href="#groupsTabContent" changelang="UserGroups"></a></li>
                                        </ul>
                                        <div class="tab-content">
                                            <div id="rolesTabContent" class="tab-pane fade in active">
                                            </div>
                                            <div id="groupsTabContent" class="tab-pane">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" style="height: 50px">
                                        &nbsp;&nbsp;
                                        <button id="btn_rpt-wiz-4" type="button" onclick="nextTab(this.id)" class="btn btn-form-submit" changelang="Next"></button>
                                    </div>
                                </div>
                            </div>
                            <div class="row" id="rpt-wiz-5">
                                <!-- ---------------------------------------------------------START__PAGE 5 -->
                                <div class="col-md-12">
                                    <div class="row" style="height: 20px">
                                    </div>
                                    <div class="row">
                                        <div class="row form-group-box">
                                            <div class="col-lg-2 col-md-2 group-info">
                                                <h4 class="group-title">
                                                    <br>
                                                    <small></small></h4>
                                            </div>
                                            <div class="col-lg-7 col-md-10 col-sm-12  col-xs-12">
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input id="schedulingChk" type="checkbox" name="schedulingChk" class="schedulerChk">
                                                        <label for="schedulingChk" class="schedulerLabelChk" changelang="enableSendSchedule"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row form-group-box">
                                            <div class="col-lg-2 col-md-2 group-info">
                                                <h4 class="group-title" changelang="scheduling">
                                                    <br>
                                                    <small></small></h4>
                                            </div>
                                            <div class="col-lg-7 col-md-10 col-sm-12  col-xs-12">
                                                <div class="form-group">
                                                    <label changelang="period"></label>
                                                    <div class="input-group">
                                                        <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
                                                        <select title="Label" id="selectSchedulingPeriod" class="form-control form-input"></select>
                                                    </div>
                                                </div>
                                                <br />
                                                <div id="mainPeriodDiv">
                                                    <div id="monthlyDiv">
                                                        <!-- *-*-*-*-*-*-*-*-*-* monthlyDiv_Start-->
                                                        <div class="form-group">
                                                            <label changelang="day"></label>
                                                            <div class="input-group">
                                                                <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
                                                                <input id="eachDayTxt-monthly" type="number" title="Label" class="form-control form-input">
                                                            </div>
                                                        </div>
                                                        <br />
                                                        <div class="form-group">
                                                            <label changelang="every"></label>
                                                            <div class="input-group">
                                                                <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
                                                                <input id="eachMonthTxt-monthly" type="number" title="Label" class="form-control form-input" />
                                                                <div class="input-group-addon" changelang="month_span"></div>
                                                            </div>
                                                        </div>
                                                        <!-- *-*-*-*-*-*-*-*-*-* monthlyDiv_End-->
                                                    </div>
                                                    <div id="weeklyDiv">
                                                        <!-- *-*-*-*-*-*-*-*-*-* weeklyDiv_Start-->
                                                        <div class="form-group">
                                                            <label changelang="every"></label>
                                                            <div class="input-group">
                                                                <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
                                                                <input id="eachTxt-weekly" type="number" title="Label" class="form-control form-input">
                                                                <div class="input-group-addon" changelang="week_span"></div>
                                                            </div>
                                                        </div>
                                                        <br />
                                                        <div class="form-group">
                                                            <div class="input-group">
                                                                <input id="saturdayChk" type="checkbox" name="saturdayChk" class="schedulerChk">
                                                                <label for="saturdayChk" class="schedulerLabelChk" changelang="saturday"></label>
                                                                <input id="sundayChk" type="checkbox" name="sundayChk" class="schedulerChk">
                                                                <label for="sundayChk" class="schedulerLabelChk" changelang="sunday"></label>
                                                                <input id="mondayChk" type="checkbox" name="mondayChk" class="schedulerChk">
                                                                <label for="mondayChk" class="schedulerLabelChk" changelang="monday"></label>
                                                                <input id="tuesdayChk" type="checkbox" name="tuesdayChk" class="schedulerChk">
                                                                <label for="tuesdayChk" class="schedulerLabelChk" changelang="tuesday"></label>
                                                                <input id="wednesdayChk" type="checkbox" name="wednesdayChk" class="schedulerChk">
                                                                <label for="wednesdayChk" class="schedulerLabelChk" changelang="wednesday"></label>
                                                                <input id="thursdayChk" type="checkbox" name="thursdayChk" class="schedulerChk">
                                                                <label for="thursdayChk" class="schedulerLabelChk" changelang="thursday"></label>
                                                                <input id="fridayChk" type="checkbox" name="fridayChk" class="schedulerChk">
                                                                <label for="fridayChk" class="schedulerLabelChk" changelang="friday"></label>
                                                            </div>
                                                        </div>
                                                        <!-- *-*-*-*-*-*-*-*-*-* weeklyDiv_End-->
                                                    </div>
                                                    <div id="dailyDiv">
                                                        <!-- *-*-*-*-*-*-*-*-*-* dailyDiv_Start-->
                                                        <div class="form-group">
                                                            <label changelang="every"></label>
                                                            <div class="input-group">
                                                                <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
                                                                <input id="eachDayTxt-daily" type="number" title="Label" class="form-control form-input">
                                                                <div class="input-group-addon" changelang="day_span"></div>
                                                            </div>
                                                        </div>
                                                        <!-- *-*-*-*-*-*-*-*-*-* dailyDiv_End-->
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row form-group-box">
                                            <div class="col-lg-2 col-md-2 group-info">
                                                <h4 class="group-title" changelang="send"></h4>
                                            </div>
                                            <div class="col-lg-7 col-md-10 col-sm-12  col-xs-12">
                                                <div class="form-group">
                                                    <label changelang="sendTime"></label>
                                                    <div class="input-group">
                                                        <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
                                                        <input id="postTimeTxt" type="time" title="Label" class="form-control form-input">
                                                    </div>
                                                </div>
                                                <br />
                                                <div class="form-group">
                                                    <label changelang="outputType"></label>
                                                    <div class="input-group">
                                                        <div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
                                                        <select title="Label" id="selectExportType" class="form-control form-input"></select>
                                                    </div>
                                                </div>
                                                <br />
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input id="sendAllChk" type="checkbox" name="sendAllChk" class="schedulerChk">
                                                        <label for="sendAllChk" class="schedulerLabelChk" changelang="sendToAllUsersWithAccess"></label>
                                                    </div>
                                                </div>
                                                <br />
                                                <div class="form-group">
                                                    <div class="input-group col-md-12">
                                                        <div class="col-md-4">
                                                            <input id="saveReportChk" type="checkbox" name="saveReportChk" class="schedulerChk">
                                                            <label for="saveReportChk" class="schedulerLabelChk" changelang="savingReportPath"></label>
                                                        </div>
                                                        <div class="col-md-8 inputTxtDiv">
                                                            <input type="text" id="reportPath" class="form-control form-input" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <br />
                                                <div class="form-group">
                                                    <div class="input-group col-md-12">
                                                        <div class="col-md-4">
                                                            <input id="sendEmailsChk" type="checkbox" name="sendEmailsChk" class="schedulerChk">
                                                            <label for="sendEmailsChk" class="schedulerLabelChk" changelang="sendToSpecificEmails"></label>
                                                        </div>
                                                        <div class="col-md-8 inputTxtDiv">
                                                            <input type="email" id="sendEmails" class="form-control form-input" placeholder="name1@example.com;name2@example.com; ..." />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" style="height: 50px">
                                        &nbsp;&nbsp;
                                        <button id="btn_rpt-wiz-5" type="button" onclick="nextTab(this.id)"
                                            class="btn btn-form-submit" changelang="Next">
                                        </button>
                                    </div>
                                </div>
                                <!-- ---------------------------------------------------------END_PAGE 5 -->
                            </div>
                            <div class="row" id="rpt-wiz-6">
                                <div class="col-md-12">
                                    <div class="row" style="height: 20px">
                                    </div>
                                    <div class="row" style="height: 660px;">
                                    </div>
                                    <div class="row" style="height: 50px">
                                        &nbsp;&nbsp;
                                        <button id="btn_rpt-wiz-6" type="button" onclick="nextTab(this.id)" class="btn btn-form-submit" changelang="Next"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <footer class="main-footer" id="#footer">
            <div class="row">
                <%if (SessionProvider.UserDirection == "RTL")
                    {%>
                <div class="pull-right2 col-md-11"><span><a href="https://amnpardaz.com" id="copyRightLabel" target="_blank"><%=ApplicationProvider.CopyRightStatement %></a></span></div>
                <div class="pull-left2 col-md-1">&nbsp;<span id="versionLabel"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span></div>
                <%}
                    else
                    {%>
                <div class="pull-left2 col-md-11"><span><a href="https://amnpardaz.com" id="copyRightLabel" target="_blank"><%=ApplicationProvider.CopyRightStatement %></a></span></div>
                <div class="pull-right2 col-md-1">&nbsp;<span id="versionLabel"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span></div>
                <%} %>
            </div>
        </footer>
    </div>

    <script type="text/javascript" src="../App_Base/Js/Jquery/Jquery.js"></script>
    <link href="../App_Base/Css/MxGraph/Select2.css" rel="stylesheet" />
    <script src="../App_Base/Js/Jquery/Select2.Min.js"></script>
    <script>
        var _Lang = '<%=SessionProvider.UserLanguage%>';
        var _SourceLang = _Lang === "Fa" ? "reporteditor_fa" : "reporteditor";
        let flag = false;
        var _json;
        function loadJSON() {
            return new Promise((resolve, reject) => {
                var rawFile = new XMLHttpRequest();
                rawFile.overrideMimeType("application/json");
                rawFile.open("GET", `../App_Base/Js/resources/${_SourceLang}.json?random=${Date.now()}`, false);
                rawFile.onreadystatechange = function () {
                    if (rawFile.readyState === 4 && rawFile.status === 200) {
                        try {
                            const json = JSON.parse(rawFile.responseText);
                            resolve(json);
                        } catch (error) {
                            reject(error);
                        }
                    }
                };
                rawFile.send();
            });
        }

        loadJSON()
            .then((json) => {
                _json = json;
                ResourceFunct();
            })
            .catch((error) => {
                console.error("Failed to load JSON", error);
            });

        function ResourceFunct() {
            $(`[changelang]`).map((index, elem) => {
                const htm = resurce($(elem).attr("changelang"));
                const title = resurce($(elem).attr("titleLang"));
                $(elem).html(htm);
                $(elem).attr("title", title);
            });
            function resurce(item) {
                return reportResources.get(item);
            }
        }

        var reportResources = {
            get: (item) => {
                //return _json == null || _json == undefined ? errorLoading(flag) : _json[item];
                return _json == null || _json == undefined ? item : _json[item];
            },
        };

        function refreshPage() {
            window.location.reload(true);
        }

        function clearCache() {
            refreshPage();
            if (window.applicationCache) {
                window.applicationCache.update();
                window.applicationCache.addEventListener('updateready', function () {
                    window.applicationCache.swapCache();
                    refreshPage();
                });
            }
        }

        function errorLoading(tmpBool) {
            if (!tmpBool) {
                flag = true;
                clearCache()
            }
        }
    </script>
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
    <!-- QueryBuilder -->
    <script type="text/javascript" src="../App_Base/Js/Jquery/QueryBuilder/Moment.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/QueryBuilder/QueryBuilder.Standalone.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/QueryBuilder/JqueryExtendext.js"></script>
    <!-- Bootstrap -->
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Bootstrap.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/DataTable/DataTables.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Select/Select.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Select/Select.Ajax.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/DatePicker/Jalaali.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/DatePicker/PersianDateTimePicker.Dgr.js"></script>
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
    <script type="text/javascript" src="../App_Base/Js/Highcharts/ExportData.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/Accessibility.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/SeriesLabel.js"></script>
    <!-- Sys App -->
    <script type="text/javascript" src="../App_Sys/Interface/Gui.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Gui.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Controls/SelectList.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Controls/AutoComplete.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Controls/RadioButtonList.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Executor.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Membership.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Md5.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Sha1.js"></script>
    <!-- Sys ReportDesigner-->
    <script type="text/javascript" src="../App_Sys/Admin/Report/Master.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Report/Actions.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Report/Designer.js"></script>

    <!-- Scripts -->

    <script type="text/javascript">

        $(window).resize(function () {

            setTimeout('alignSideBarHeight();', 1 * 100);

        });

        var _pageKey =  <%=Request.QueryString["objKey"]%>;
        var _query = new rdData(0, _pageKey);

        var designJson = _query.getObject();
     
        renderDesigner(designJson);

        setRequestToken('<%=SessionProvider.GenRequestToken()%>');

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
