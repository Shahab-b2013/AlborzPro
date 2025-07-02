<%--/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.6.0.0*/
/* Release Ferdos.BPMS*/--%>
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="~/App_Dgr/QueryDesigner.aspx.cs" Inherits="QueryDesigner" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title id="page-title"><%=ApplicationProvider.PageTitle %> | پرس و جو ساز</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />

    <!-- Font Awesome -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Font-Awesome.css"/>
    <!-- App -->
    <link rel="stylesheet" href="../App_Base/Css/Admin/Process/App.css"/>
    <link rel="stylesheet" href="../App_Base/Css/Admin/Process/App-Rtl.css"/>
    <!-- QueryDesigner -->
    <%if (SessionProvider.UserDirection == "RTL")
    {%>
    <link rel="stylesheet" href="../App_Res/Themes/Common/QueryDesigner-Rtl.css"/>
    <%}
    else
    { %>
    <link rel="stylesheet" href="../App_Res/Themes/Common/QueryDesigner.css"/>
    <% }%>
    <!-- Theme style -->
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Designer.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/FormView2.css"/>
    <link rel="shortcut icon" href="../<%=ApplicationProvider.FaviconIcon %>.ico" />

    <!-- Scripts -->

    <script type="text/javascript">
        var _Lang = '<%=SessionProvider.UserLanguage%>'

        mxBasePath = "../App_Base/Js/MxGraph/src";
    </script>

    <script type="text/javascript"  src="../App_Base/Js/MxClient/MxClient.js"></script>
    <script type="text/javascript"  src="../App_Base/Js/SweetAlert/SweetAlert.Min.js"></script>
    <!-- jQuery -->
    <script type="text/javascript" src="../App_Base/Js/Jquery/Jquery.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Redirect.js"></script>
    <!-- Sys App -->
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Executor.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Membership.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Md5.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Sha1.js"></script>
     <!-- Sys QueryDesigner-->
    <script type="text/javascript"  src="../App_Sys/Admin/Query/Designer.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Query/Main.js"></script>   
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
                <div class="myTest">
                    <ul class="nav navbar-nav" id="headerMenuBar" style="display: flex; flex-direction: inherit;">
                        <li id="Save" class="dropdown" onclick="saveDesign(true)">
                           <a style="cursor: pointer;"> &nbsp;&nbsp; &nbsp;&nbsp;<i class="fa fa-save"></i><span changelang="saveInfo"></span></a>
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
    <aside id="sidebarContainer" class="main-sidebar">
        <section class="sidebar">
            <a class="geTitle" id="DataProcess">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADx0lEQVR4nO2ZXYgcRRDH5yIawY+wUzW7F6NGMCp+EJWABBRFDB74JERBhUAgaPQ0iogcd7dVDUqIj0KIoj6Igi8R5AjxJNyTnAriR8hTFBRPwYAJUTHmQafakprpmdu9vZwbuP0Ap2Bgd/pj+9dV9a9uNooqq6yy/68JwaeeUVfjKeZcrfmEYL5rkNX60V6A+JY5KxBfeSSqQstXORJVqqWV/HJVR1a2qrLzkB1RKhs289XpF4crR3zlEaw84qvQGrIcEYbvPOErqYu3aTO+UV1yqe7ZtFZdMpoS3CeMTgiODW2yC8HRlODebtemhPcMFYgw/i0UP6MuWtO2UJeMLu2bUjLW9eL7CSKMfxSLUwdXaBSNFP1SSsaWgX6uBI2iERszMBAl3JI9Lr5J3XrMIeqbheCUJ5zTqXiDvROGiXwsvCWc7Mk+E76W92/UPcOsjbGx0TBYCVHmCp72jPuE8afw/dnUxfcHIThpQiAMJ1pya/AwtvstEIdsl9sFAH9TF2/N++HPbV4mnPOERwpAfREu62totYFE0Ygn+CiE0KwlvBCMC8HHwrDDZLfs+3B0QergQWH8TBinTZaF8Zsw/xsr7livQbIFTtYbQvBLCJPxjvYXGpfYs8zaDgSv/aguvnzgIOF33gn93isBXO0WYfgkqNU/5gl18R1Fe9Fm+bQiRK9BTF6F8XlP8KYQnLE+2sTrMogm3CAEZzvkl+CsOrw+B8FHSwFgfN2k2USh7yAdi2RcWGyDPOkJPlQXX2n1wjPOhFw6nHts48XC+HtXnu8HiBA8qZTcqRO1dWXYUO4NgyhDbSreEDzwZ1v+uOS21CUPDRwkCy2Gp7WJt5cgjL92gEzXrgrJfbp8R7glFM6ZwYMseuaUuuiirI3w3RBGswaQQZQynQuCSXNrIR0YiB1P1OHdwrC7KHYpJduLMBLGhc48ghPqaldnXmvCY4WHrK6kDh/QKVzfd5Bl5ZfwSAk6UVvnCV4VwuP22Dmr9ZAoBF8Fr7290tx9A9FmcqsQ/pXtbhMf+c9FBROGp0JInikk+ZxmfwH3EkSfiC60C1UR+3YMseQVhq8tdNqOKPmRZFfuCXjZxnqC90N4fVHk10AsHE9+CDs7L4SfdwpAfbNOJ9cuLZDC+GWx0SbJ2qzdPDCQDMY1rilgwqJOeoa9QvBtHm7JzqJO2EXM8qmQ5xLifK69vTRTIiH43jMc1MnRxN4J4+Mhmfd6gpfCwvdn/SfrDc/4gXnpfO75fbGl9wl1yV2d8ou72vssFsyhNaszS0Faq/+57F/6YJNvUwx/aQAAAABJRU5ErkJggg==" style="height: 24px; width: 24px; opacity: inherit;">
                <span style="margin: 0px 10px;" changelang="datatable">جداول داده ای</span>
                <i class="fa fa-angle-left pull-right rotate fa-rotate-90"></i>
            </a>
        </section>
    </aside>
    <div class="content-wrapper" style="background-color: #f7f7f7;">
        <section class="content-header" style="display: block;">
            <h1 id="page-header" class="page-header" style="pointer-events: none;"><span class="fa fa-angle-double-left"></span><b style="font-size: 14px; font-weight: normal; margin: 0px 5px;"></b></h1>
        </section>
    </div>
    <div class="main-content" style="overflow: auto;">
        <section id="content"></section>
    </div>
    <div id="graphContainer"></div>
    <footer class="" id="geFooter">
    <div class="pull-right col-md-10">
        <span><a href="https://amnpardaz.com/" id="copyRightLabel" target="_blank" changelang="copyright"><%=ApplicationProvider.CopyRightStatement %></a></span>
    </div>
    <div class="pull-left col-md-2" style="display: flex; align-items: center; justify-content: flex-end;">
        <span id="versionLabel"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span>
    </div>
    </footer>
</body>

    <!-- Scripts -->

    <script>
        var _SourceLang;
        switch (_Lang) {
            case "Fa":
                _SourceLang = "queryeditor_fa";
                break;
            case "En":
                _SourceLang = "queryeditor";
                break;

            default:
                alert("please set language");      
                break;
        }

        var _json;
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", `../App_Base/Js/resources/${_SourceLang}.json`, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                _json = JSON.parse(rawFile.responseText);
                ResourceFunct();
                ChangeLang()
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
                return queryResources.get(item);
            }
        }

        var queryResources = {
            get: (item) => {
                return _json == null || _json == undefined ? item : _json[item];
            },
        };

        var _pageKey = <%=Request.QueryString["objKey"]%>;
        var _query = new qdData(0, _pageKey);
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
</html>
