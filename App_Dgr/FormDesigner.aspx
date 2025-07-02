<%--// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)---
 // Release Ferdos.WebAppDesk 4.1.0.0--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeFile="FormDesigner.aspx.cs" Inherits="FormDesigner" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title id="page-title"><%=ApplicationProvider.PageTitle %> | فرم ساز</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />

    <!-- Bootstrap -->
    <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link href="../App_Base/Css/Admin/Document/Bootstrap-Rtl.css" rel="stylesheet" />
    <%}
        else
        { %>
    <link href="../App_Base/Css/Admin/Document/Bootstrap.css" rel="stylesheet" />
    <% }%>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Font-Awesome.css" />
    <!-- Ionicons -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Ionicons.css" />
    <!-- Theme style -->
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Designer.css" />
    <link rel="shortcut icon" href="../<%=ApplicationProvider.FaviconIcon %>.ico" />
    <!-- FormView -->
    <link href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/FormView2.css" rel="stylesheet" />
    <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link href="../App_Res/Themes/Common/FormDesigner-Rtl.css" rel="stylesheet" />
    <%}
        else
        { %>
    <link href="../App_Res/Themes/Common/FormDesigner.css" rel="stylesheet" />

    <% }%>
    <link href="../App_Base/Css/Admin/Process/App.css" rel="stylesheet" />
    <link href="../App_Base/Css/Admin/Process/App-Rtl.css" rel="stylesheet" />
    <link href="../App_Base/Css/MxGraph/Select2.css"  rel="stylesheet" />
    <link href="../App_Base/Css/Jquery/Jquery-UI.Min.css" rel="stylesheet" />

    <!-- Scripts -->

    <script type="text/javascript">

        window.onbeforeunload = () => {

            saveDesign(false, true);

            localStorage.setItem('ActiveFD', false);

        }

        var _Lang = '<%=SessionProvider.UserLanguage%>'

        var _SourceLang;
        switch (_Lang) {
            case "Fa":
                _SourceLang = "formeditor_fa";
                break;
            case "En":
                _SourceLang = "formeditor";
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
                return formResources.get(item);
            }
        }

        var formResources = {
            get: (item) => {
                return _json == null || _json == undefined ? item : _json[item];
            },
        };

    </script>
     <script> 
         var _pageKey = '<%=Request["id"]%>';
         var $ProcessID = +Math.round(_pageKey / 10000 - 500);
    </script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/src/Icon/Icon.js"></script>
    <script type="text/javascript" src="../App_Base/Js/SweetAlert/SweetAlert.Min.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Deflate/Convert.js"></script>
    <!-- jQuery -->
    <script type="text/javascript" src="../App_Base/Js/Jquery/Jquery.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Jquery-UI.Min.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Redirect.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Select2.Min.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/InputMask.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Jquery.InputMask.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/DependencyLib.Jquery.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Date.Extensions.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Numeric.Extensions.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Extensions.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/InputMask/Regex.Extensions.js"></script>
   
    <!-- Bootstrap -->
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Bootstrap.js"></script>
    <!-- Sys App -->
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Executor.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Membership.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Md5.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Sha1.js"></script>
    <!-- Sys FormDesigner-->
    <script type="text/javascript" src="../App_Sys/Admin/Form/FormView.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Form/Sidebar.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Form/Actions.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Form/Properties.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Form/File.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Form/Designer.js"></script>
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
            <nav class="navbar navbar-static-top" role="navigation" id="headerBar" style="padding: 0px;">
                <div>
                    <ul class="nav navbar-nav" id="headerMenuBar">
                        <li id="" class="dropdown" onclick="saveDesign(true,true)" style="display: inline;">
                            <a style="cursor: pointer; direction: rtl;"><i class="fa fa-save" style="position: relative; display: inline; font-size: 16px !important; margin-left: 0px;"></i><span changelang="saveInfo"></span></a>
                        </li>
                        <li id="" class="dropdown" onclick="Import()" style="display: none;">
                            <a style="cursor: pointer; direction: rtl;"><i class="glyphicon glyphicon-save" style="position: relative; display: inline; font-size: 16px !important; margin-left: 0px; color: #ffffff"></i><span changelang="import"></span></a>
                        </li>
                        <li id="" class="dropdown" onclick="ExportFile()" style="display: none;">
                            <a style="cursor: pointer; direction: rtl;"><i class="glyphicon glyphicon-open" style="position: relative; display: inline; font-size: 16px !important; margin-left: 0px; color: #ffffff"></i><span changelang="sendInfo"></span></a>
                        </li>
                        <li class="dropdown" id="out" onclick="Exit()" style="display: block;" btnexit="true">
                            <a btnexit="true"><img src="data:image/png;base64,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" style="position: relative; font-size: 16px !important; margin: -7px 0px;clip-path: circle();" btnexit="true"></img><span changelang="out" btnexit="true" style="font-weight:normal"></span></a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    </div>
    <aside class="main-sidebar" id="sideBar">
        <section class="sidebar">
            <a class="geTitle" id="DataProcess">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGMUlEQVR4nOVaaYgcVRDumBgVjbvbVb2bxUg8IuKdoJgIxj+KCB7/4hUT0B8hgqs5dXen6/XiAeLxI6J4RCVgjJooEoUcXqhI1iMQNWZRgjFBBeORiInn1PNJve7p6TkyPTOZ7VnwwWNnpt+rV19Vvbp6HaeBYRY4R5rAvZB9d75WcI9W8AITDrPCL5lwDyvcx4R5O8PPe6Jnw7JWE9zNCuYJDaHlZDlM0H0uEw5qhW+wgoNaoWnFtLQIN7NyB4zffc7oML8cJjHBQib8pFWMpwPDj+VMOfvwAQTOBCZcwAp+yApAFUA/s4K7TOBMbA6Ej6cx4fZ2AagARLjdBN60BjWBlzDhL+1mXlfRjvBWH4icdyor/LXdTNfQzH6T6zk5FYgmWNNuZlMn4epUIIK47Yymm9i+/w8QrfD5djNax3wuFYgJuk8Z85c96DkpFYgFQzhbXN3YAwE/mcC7uD4QA909sRsm+GzMgFDwqfCU5LHmYAW7TOCeWUxRJMeCvW3Uwl6bcwXOBMuT33UWE3yTCiRCf5AVLI0326RRci78MMO7MCxnFpLGSKjLmOB3eV4XkIQ6P2cfrzWBc0RseqFE7tQEG5ngQAslf0Ar2MAKlhcsQoacLTwIL8n1Tto4xCFfCfMmcKck14qUTAAXsIK5mmBIXDcr3MIKR0T9tphS+E8090W/jcga6+YJhmSv0ChoP6Y96J4gZ8rZ1XhqCkhC3ZoJ3mNC31DXReWHH84IheLOYoU5VvCunKVr8JJKsJGqjwn+ZIVbtYJnrP0qvEHco5QAZmCyZ/o7usQ0jOOMs5/lt8CbJmvYx+vlHmqCp4WG0GrEDJ20oQleb5eHqnsSrq+zJq9fOllPVvCHCbrOrste8wFc08rGQgtBHMwTXF0XCLHnUDPedAmOYwjELuN75yV5rDk0wTqzeMoxIRhnIiu8o52pPUt8IRiKeeqbdpQmXJUOJMz3txofZ8Ra6p8ETLgoy9zLBmOFi+Xssp7aR/K8LiARGNaEj5pc59QS0/NxhsQRTfhmIV1okeSF1luskJJClGFyXSdqBSukY1lY76SNygMwL3V8PnAvr4i+gTPRkDtT2p7S/pR1NrIT7qga2RXuDqM+DtvegLRMfXe+0CjvW5k5zvh84F4m9bnsL+erYSBl6v5RK1jJPtxUnq60YgjNKN15qtAUZMK8CaYe3TCxRsyFCb+Vfq1W8LCk2uK2Jc2Qdo2N5P0dXTGT0Xf7LHBnWRdPsFD22p6v0IrSIE1wr2hPhyY+EoJ0JsQ06ml4S1bbPg+FmpV3c8h4R6cmeFG8qHzPB3hVYt2CdPUSns+Ef7cVxBxnfMxPLnQ20v8trocVFXwn9hTNS+F1WaYpJSCW9hwr2a8mfKIQO0JLwdWJPe/EAGxcgUdkj+ytohl3JhN+nxGYJxMMb04A3MHK64vqlzLHg7uZoL/0VQesTd6RZwuuUMrM6K3SqOZdQt/4cLq1BsLbm6WTJ7yyCCQk/IHx3TNi7QTeZAmCTLBz9MDgVhuXHGecVrCpcRqwstRrFdUqF/5BAREDkgKJcLYmvD9qDuRbAOAL8U5SGRZik1ZwXxNanVcVSGLBX1IBynuJZBMi0tRxeYJLWcGtUTxYXx7VS2gR7o/aO9u0wtckBaq4m9JsKGsOslSihItEqGYQeyUHK3dGrOD9mkDKpPedVvhY2Fkpair9zW/6azObvyl4SQJgxbmEi6qsX1K5DrbZNIlwsLGa3UZf2CAmKEFKih77qjnXOTWs1zs6LZg5znj7fRB7bT1vW7IwV1o/9QjQVBGa0Kq1J9OanRX+WxeQQextGEjWNXvxbnjT2YcbNeEDArDMtJZUmhYsq6BHuEruq/TJMq/ZbRJZVrpKXVLlsi+xpmkvOywNnVCJdkeqX9IMa3ZW+Jv0leOgqLy+hmkQLDukJ8m0Zid8Nc61mgi8TLDTBO7xhwSTRc0uRZQJejEyq8ebFwasqQlk9Gt2WFu4JyVACN+WNmz0l4vSl74wbJIsXSt4ObH+larpfCqoRmt2gq+j7siWqGgakh6wCKfAQJRrrWByb0s6AckuEpLfmOQjLI9xVeb/KtXMYGl4FyX/ULv5aXrkA++K2LR8vCVtw39xs5qBY3BIMAAAAABJRU5ErkJggg==" style="height: 24px; width: 24px; opacity: inherit;">
                <span style="margin: 0px 5px;" changelang="processdata"></span>
                <i class="fa fa-angle-left pull-right rotate "></i>
            </a>
            <a class="geTitle" id="NewField">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABI0lEQVRoge3XMU7DMBjF8b8/WAEJkSN0ppfo0OtUjBWqmLpwDjgBvQIn6dIs7Qw1A1RqLGyZUGMivd9WJX2fnhJZ+UBEpCaXuujnzcg7lt75CXCRkbcDVmbM3KJdl8rKKuDnzWhv/hW4zhgW2pgxPgw+ZVbIYv/yjmXPgQDN3vNYIiuUKOAnPQd+BTAtkRWKFiDvPU25KpTVkSowCOe5N549tMkTC+D9/sb/ddbgn4AK1KYCtQ2+QOoY3QGXhx+5x9qRbaGsjtQTWP1wSOilUFZHtIAZM2DTc+DGjLsSWaFoAbdo12aMcTzz+Qrk2AJP9sbt8efvKbPkv9FKGaGVMpYV0kqZoJUyh1bK2lSgNhWobfAFtFImaKX8LiuklVJE5Fc+ANitv3UTbH0zAAAAAElFTkSuQmCC" style="height: 24px; width: 24px; opacity: inherit;">
                <span style="margin: 0px 5px;" changelang="newitems"></span>
                <i class="fa fa-angle-left pull-right rotate fa-rotate-90"></i>
            </a>
            <a class="geTitle" id="SettingField">
                <img src="data:image/png;base64,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" style="height: 24px; width: 24px; opacity: inherit;" />
                <span style="margin: 0px 5px;" changelang="settings"></span>
                <i class="fa fa-angle-left pull-right rotate"></i>
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
    <footer class="" id="geFooter">
        <div class="pull-right col-md-10">
            <span><a href="https://amnpardaz.com/" id="copyRightLabel" target="_blank" changelang="copyright"></a></span>
        </div>
        <div class="pull-left col-md-2" style="display: flex; align-items: center; justify-content: flex-end;">
            <span id="versionLabel"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span>
        </div>
    </footer>

    <!-- Scripts -->

    <script>

        ResourceFunct();

        //for not drag an other elements(Z.B) tooblar text
        $("body").on("dragstart", (e) => {
            if ($(e.target).prop("draggable") == true) {
                $ALLOW_DROP_TRUE = true;
            } else {
                $ALLOW_DROP_TRUE = false;
            }
        });

        var _form = new fdData($ProcessID, _pageKey);

        var designJson = _form.getObject();

        renderDesigner(designJson);

        let i = document.createElement("i");
        _Lang == "Fa" ? (i.className = `fa fa-angle-left pull-right rotate`) : (i.className = `fa fa-angle-right pull-left rotate`);

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

        localStorage.setItem("ActiveFD", true);

    </script>
</body>
</html>
