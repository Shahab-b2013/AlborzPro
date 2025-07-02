<%--/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.1.0*/
/* Release Ferdos.BPMS*/--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ProcessDesigner.aspx.cs" Inherits="ProcessDesigner" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title id="page-title"><%=ApplicationProvider.PageTitle %> | فرآیند ساز</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />

    <!-- ProcessDesigner -->
    <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link rel="stylesheet" href="../App_Res/Themes/Common/ProcessDesigner-Rtl.css" />
    <%}
    else
    { %>
    <link rel="stylesheet" href="../App_Res/Themes/Common/ProcessDesigner.css" />
    <% }%>
    <!-- Bootstrap  -->
    <link rel="stylesheet" href="../App_Base/Css/Admin/Process/Bootstrap.css" />
    <link  rel="stylesheet" href="../App_Base/Css/Calendar/JalaliDatePicker.css"/>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Font-Awesome.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Font-AwesomeAll.Min.css" />
    <!-- Ionicons -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Ionicons.css" />
    <!-- App -->
    <link rel="stylesheet" href="../App_Base/Css/Admin/Process/App.css" />
    <link rel="stylesheet" href="../App_Base/Css/Admin/Process/App-Rtl.css" />
    <!-- Theme style -->
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Designer.css" />
    <link rel="stylesheet" href="../App_Base/Css/MxGraph/Select2.css" />
    <link rel="shortcut icon" href="../<%=ApplicationProvider.FaviconIcon %>.ico" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Select.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/PersianCalendar.css" />

    <!-- Scripts -->

    <script type="text/javascript">

        var _pageKey = '<%=Request["objKey"]%>'

        window.onbeforeunload = () => {

            saveDesign(false);

            localStorage.setItem('ActivePD', false);

        }

        var _Lang = '<%=SessionProvider.UserLanguage%>';

        var $$Lang = _Lang;

        var urlParams = (function (url) {
            var result = new Object();
            var idx = url.lastIndexOf('?');

            if (idx > 0) {
                var params = url.substring(idx + 1).split('&');

                for (var i = 0; i < params.length; i++) {
                    idx = params[i].indexOf('=');

                    if (idx > 0) {
                        result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
                    }
                }
            }

            return result;
        })(window.location.href);

        mxLoadResources = false;

    </script>

    <script type="text/javascript" src="../App_Base/Js/Deflate/pdf.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Deflate/pdf.worker.js"></script>
    <script type="text/javascript" src="../App_Base/Js/SweetAlert/SweetAlert.Min.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/Init.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/src/Icon/Icon.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Deflate/Pako.Min.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Deflate/base64.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Deflate/Convert.js"></script>
    <script type="text/javascript" src="../App_Base/Js/JsColor/JsColor.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Sanitizer/Sanitizer.Min.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxClient/MxClient.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/EditorUi.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/Editor.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/Sidebar.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/Graph.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/Format.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/Shapes.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/Actions.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/Menus.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/Toolbar.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/Dialogs.js"></script>
    <!-- jQuery -->
    <script type="text/javascript" src="../App_Base/Js/Jquery/Jquery.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Redirect.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Select2.Min.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/InputMask.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Jquery.InputMask.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/DependencyLib.Jquery.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Date.Extensions.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Numeric.Extensions.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Extensions.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Regex.Extensions.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Calendar/JalaliDatePicker.js"></script>
    <!-- Bootstrap -->
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Bootstrap.js"></script>
    <!-- Sys App -->
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Executor.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Membership.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Md5.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Sha1.js"></script>
    <!-- Sys ProcessDesigner-->
    <script src="../App_Base/Js/MxGraph/TaskComponent/Activity-Assign.js"></script>
    <script src="../App_Base/Js/MxGraph/TaskComponent/Activity-Setting.js"></script>
    <script src="../App_Base/Js/MxGraph/TaskComponent/Activity-SLA.js"></script>
    <script src="../App_Base/Js/MxGraph/TaskComponent/Activity-Schedule.js"></script>
    <script src="../App_Base/Js/MxGraph/TaskComponent/EventSetting.js"></script>
    <script src="../App_Base/Js/MxGraph/TaskComponent/TimerEvent.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Process/Table.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Process/Process.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Process/Designer.js"></script>
</head>
<body class="sidebar-mini sidebar-open">
    <input type="hidden" value="<%=ApplicationProvider.PageTitle %>" id="PageTitle" />
    <div class="wrapper">
        <header class="main-header" id="header">
           <a style="cursor:pointer" class="logo" id="logo">
                <span class="logo-mini" id="logo_mini">      
                <%if (ApplicationProvider.AppThemeName == "Blue_Violet") {%><img src="../<%=ApplicationProvider.FaviconIcon %>.ico" /><%} else {%><%=ApplicationProvider.HeaderShortTitle %><% }%></span>
                <span id="logo_lg" class="logo-lg"><%if (ApplicationProvider.AppThemeName == "Blue_Violet") {%><img src="../<%=ApplicationProvider.FaviconIcon %>.ico" /><%}%><%if (ApplicationProvider.AppThemeName == "Blue_Like") {%><img alt="" src="../<%=ApplicationProvider.FaviconIcon %>.png" style="clip-path: circle(); vertical-align: middle;" /><% }%><%=ApplicationProvider.HeaderTitle %></span>
            </a>
            <nav class="navbar navbar-static-top" role="navigation" id="headerBar">
                <div>
                    <ul class="nav navbar-nav" id="headerMenuBar">
                        <li id="Save" class="dropdown" onclick="saveDesign(true)">
                            <a style="cursor: pointer; direction: rtl;"><i class="fa fa-save" style="position: relative; display: inline; font-size: 16px !important; margin: 0px 5px;"></i><span changelang="saveInfo"></span></a>
                        </li>
                        <li id="New" class="dropdown" style="display: none;">
                            <a style="cursor: pointer; direction: rtl;"><i class="glyphicon glyphicon-new-window" style="position: relative; display: inline; font-size: 16px !important; margin: 0px 5px;"></i><span changelang="new"></span></a>
                        </li>
                        <li id="Refresh" class="dropdown" style="display: none;">
                            <a style="cursor: pointer; direction: rtl;"><i class="glyphicon glyphicon-refresh" style="position: relative; display: inline; font-size: 16px !important; margin: 0px 5px;"></i><span changelang="refresh"></span></a>
                        </li>
                        <li class="dropdown" onclick="Import()" style="display: none;">
                            <a style="cursor: pointer; direction: rtl;"><i class="glyphicon glyphicon-save" style="position: relative; display: inline; font-size: 16px !important; margin: 0px 5px;"></i><span changelang="import"></span></a>
                        </li>
                        <li class="dropdown" onclick="ExportFile()" style="display: none;">
                            <a style="cursor: pointer; direction: rtl;"><i class="glyphicon glyphicon-open" style="position: relative; display: inline; font-size: 16px !important; margin: 0px 5px;"></i><span changelang="sendInfo"></span></a>
                        </li>
                        <li id="Print" class="dropdown" onclick="printDiagram()">
                            <a style="cursor: pointer; direction: rtl;"><i class="glyphicon glyphicon-print" style="position: relative; display: inline; font-size: 16px !important; margin: 0px 5px;"></i><span changelang="print"></span></a>
                        </li>
                        <li class="dropdown" id="out" onclick="Exit()" style="display: block;" btnexit="true">
                            <a style="cursor: pointer; direction: rtl;" btnexit="true"><img src="data:image/png;base64,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" style="position: relative; font-size: 16px !important; margin: -7px 5px;clip-path: circle();" btnexit="true"></img><span changelang="out" btnexit="true" style="font-weight:normal"></span></a>
                        </li>
                        <li class="dropdown" id="format" onclick="setting()" style="display: block;">
                            <a style="cursor: pointer; direction: rtl;">
                                <i class="fa fa-gears" style="position: relative; display: inline; font-size: 16px !important; margin: 0px 5px;"></i>
                                <span changelang="setting" btnexit="true"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    </div>
    <div class="content-wrapper" id="content">
        <section class="content-header" style="display: block;">
            <h1 id="page-header" class="page-header">
                <span class="fa fa-angle-double-left"></span><b
                    style="font-size: 14px"></b>
            </h1>
        </section>
    </div>

    <!-- Scripts -->

    <script type="text/javascript">

        var _Version = "<%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %>";

        (function () {

            // Set lang text address
            mxResources.loadDefaultBundle = false;
            var _SourceLang;
            switch (_Lang) {
                case 'Fa':
                    _SourceLang = 'grapheditor_fa'
                    break;
                case 'En':
                    _SourceLang = 'grapheditor'
                    break;

                default:
                    alert('please set language')
                    break;
            }
            var bundle = mxResources.getDefaultBundle(`/../App_Base/Js/resources/${_SourceLang}`, '')
                || mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

            // Fixes possible asynchronous requests
            mxUtils.getAll(
                [bundle, STYLE_PATH + '../App_Base/Js/MxGraph/stencils/default.xml'],
                function (xhr) {
                    // Adds bundle text to resources
                    mxResources.parse(xhr[0].getText());

                    // Configures the default graph theme
                    var themes = new Object();
                    themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();

                    // Main
                    new EditorUi(new Editor(urlParams['chrome'] == '0', themes));
                    // New ui
                    ResourceFunct();

                    ChangeLang()
                },
                function () {
                    document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
                },
            );
        })();

        var _pageKey = '<%=Request["objKey"]%>'

        var _process = new pdData(0, _pageKey);

        var designJson = _process.getObject();

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
