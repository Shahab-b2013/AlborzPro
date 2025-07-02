<%--// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)---
 // Release Ferdos.WebAppDesk 4.1.0.0--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeFile="EntityDesigner.aspx.cs" Inherits="EntityDesigner" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title id="page-title"><%=ApplicationProvider.PageTitle %> | مدل ساز</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />

    <!-- Font Awesome -->
    <link href="../App_Base/Css/Bootstrap/Font-Awesome.css" rel="stylesheet" />
    <!-- Theme style -->
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Master.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Designer.css" />
    <link rel="shortcut icon" href="../<%=ApplicationProvider.FaviconIcon %>.ico" />
    <!-- FormView -->
    <link href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/FormView2.css" rel="stylesheet" />
    <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link href="../App_Res/Themes/Common/EntityDesigner-Rtl.css" rel="stylesheet" />
    <%}
        else
        { %>
    <link href="../App_Res/Themes/Common/EntityDesigner.css" rel="stylesheet" />
    <% }%>
    <link href="../App_Base/Css/Admin/Process/App.css" rel="stylesheet" />
    <link href="../App_Base/Css/Admin/Process/App-Rtl.css" rel="stylesheet" />

    <!-- Scripts -->

    <script src="../App_Base/Js/Deflate/Convert.js"></script>

    <script type="text/javascript">

        window.onbeforeunload = () => saveDesign(false);

        var _Lang = '<%=SessionProvider.UserLanguage%>'
        var _SourceLang;
        switch (_Lang) {
            case "Fa":
                _SourceLang = "entityeditor_fa";
                break;
            case "En":
                _SourceLang = "entityeditor";
                break;

            default:
                alert("please set language");
                break;
        }

        var _json;
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", `../App_Base/Js/resources/${_SourceLang}.json`, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                _json = JSON.parse(rawFile.responseText);


            }
        };
        rawFile.send();

        function ResourceFunct() {
            $(`[changelang]`).map((index, elem) => {
                const htm = resurce($(elem).attr("changelang"));
                const title = resurce($(elem).attr("titleLang"));
                $(elem).html(htm);
                $(elem).attr("title", title);
            });
            function resurce(item) {
                return EntityResources.get(item);
            }
        }

        var EntityResources = {
            get: (item) => {
                return _json == null || _json == undefined || item == undefined ? item : _json[item];
            },
        };

        mxBasePath = "/App_Base/Js/MxGraph/src//";

    </script>

    <script type="text/javascript" src="../App_Base/Js/SweetAlert/SweetAlert.Min.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxClient/MxClient.js"></script>
    <!-- jQuery -->
    <script type="text/javascript" src="../App_Base/Js/Jquery/Jquery.js"></script>
    <!-- Sys App -->
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Executor.js"></script>
    <!-- Sys FormDesigner-->
    <script type="text/javascript" src="../App_Sys/Admin/Entity/Actions.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Entity/Designer.js"></script>

</head>
<body class="sidebar-mini sidebar-open">
    <input type="hidden" value="<%=ApplicationProvider.PageTitle %>" id="PageTitle" />
    <div class="wrapper">
        <header class="main-header" id="header" style="overflow: hidden;">
        <a style="cursor:pointer" class="logo" id="logo">
                <span class="logo-mini" id="logo_mini">      
                <%if (ApplicationProvider.AppThemeName == "Blue_Violet") {%><img src="../<%=ApplicationProvider.FaviconIcon %>.ico" /><%} else {%><%=ApplicationProvider.HeaderShortTitle %><% }%></span>
                <span id="logo_lg" class="logo-lg"><%if (ApplicationProvider.AppThemeName == "Blue_Violet") {%><img src="../<%=ApplicationProvider.FaviconIcon %>.ico" /><%}%><%if (ApplicationProvider.AppThemeName == "Blue_Like") {%><img alt="" src="../<%=ApplicationProvider.FaviconIcon %>.png" style="clip-path: circle(); vertical-align: middle;" /><% }%><%=ApplicationProvider.HeaderTitle %></span>
            </a>
            <nav class="" role="navigation" id="headerBar" style="top: 0px; height: 50px; overflow: hidden;">
                <div>
                    <ul class="nav navbar-nav" id="headerMenuBar" style="display: flex; flex-direction: inherit;">
                        <li id="Save" class="dropdown" onclick="saveDesign(true)">
                            <a style="cursor: pointer;"><i class="fa fa-save"></i><span changelang="saveInfo"></span></a>
                        </li>
                        <li class="dropdown" onclick="Export()" style="display: none;">
                            <a style="cursor: pointer;"><i class="fa fa-download"></i><span changelang="sendInfo"></span></a>
                        </li>
                        <li class="dropdown" id="out" onclick="Exit()" style="display: block;" btnexit="true">
                            <a style="cursor: pointer; direction: rtl;" btnexit="true">
                                <img src="data:image/png;base64,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" style="position: relative; font-size: 16px !important; margin: -12px 0px; clip-path: circle();" btnexit="true"></img><span style="margin: 0px 3px; font-weight: normal" changelang="out" btnexit="true">خروج</span></a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    </div>
    <div class="content-wrapper" style="background-color: #f7f7f7;">
        <section class="content-header" style="display: block;">
            <h1 id="page-header" class="page-header" style="pointer-events: none;">
                <span class="fa fa-angle-double-left"></span>
                <b style="font-size: 14px; font-weight: normal; margin: 0px 5px;"></b></h1>
        </section>
    </div>
    <div id="sidebarContainer"></div>
    <div id="graphContainer"></div>
    <div id="outlineContainer" style="position: absolute; overflow: hidden; top: 36px; right: 0px; width: 200px; height: 140px; background: transparent; border-style: solid; border-color: black;">
    </div>
    <div id="statusContainer" style="text-align: right; position: absolute; overflow: hidden; bottom: 0px; left: 0px; max-height: 24px; height: 36px; right: 0px; color: white; padding: 6px; background-image: url('../App_Base/Js/MxGraph/src/images/toolbar_bg.gif');">
        <div style="font-size: 10pt; float: left;">
        </div>
    </div>
    <footer class="main-footer" id="#footer">
        <div class="" style="display: flex;">
            <%if (SessionProvider.UserDirection == "RTL")
                {%>
            <div class="" style="margin-right: 10px;"><span><a style="text-decoration: none" href="https://amnpardaz.com" id="copyRightLabel" target="_blank"><%=ApplicationProvider.CopyRightStatement %></a></span></div>
            <div class="" style="position: absolute; left: 15px;">&nbsp;<span id="versionLabel"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span></div>
            <%}
                else
                {%>
            <div class="" style="margin-left: 10px;"><span><a style="text-decoration: none" href="https://amnpardaz.com" id="copyRightLabel" target="_blank"><%=ApplicationProvider.CopyRightStatement %></a></span></div>
            <div class="" style="position: absolute; right: 15px;">&nbsp;<span id="versionLabel"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span></div>
            <%} %>
        </div>
    </footer>

     <!-- Scripts -->

    <script>

        ResourceFunct();
        ChangeLang()
        var _pageKey = '<%=Request["objKey"]%>'
        var _Entity = new edData(0, _pageKey);
        var designJson = _Entity.getObject();
        renderDesigner(designJson);

    </script>
    </body>
</html>
