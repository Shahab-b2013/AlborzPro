<%--// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)---
 // Release Ferdos.WebAppDesk 4.1.0.0--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DocumentDesigner.aspx.cs" Inherits="DocumentDesigner" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title id="page-title"><%=ApplicationProvider.PageTitle %> | مستند ساز</title>
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

    <%if (SessionProvider.UserDirection == "RTL")
        {%>

    <link href="../App_Res/Themes/Common/DocumentDesigner-Rtl.css" rel="stylesheet" />
    <%}
        else
        { %>
    <link href="../App_Res/Themes/Common/FormDesigner.css" rel="stylesheet" />

    <% }%>

    <link href="../App_Base/Css/Admin/Process/App.css" rel="stylesheet" />
    <link href="../App_Base/Css/Admin/Process/App-Rtl.css" rel="stylesheet" />

    <link rel="shortcut icon" href="../<%=ApplicationProvider.FaviconIcon %>.ico" />

    <!-- Scripts -->

    <script type="text/javascript">
        window.onbeforeunload = () => {
            localStorage.setItem('ActiveDD', false);
            saveDesign(false);
        }

        var _Lang = '<%=SessionProvider.UserLanguage%>'
        var _SourceLang;
        switch (_Lang) {
            case "Fa":
                _SourceLang = "doceditor_fa";
                break;
            case "En":
                _SourceLang = "doceditor";
                break;

            default:
                alert("please set language");
                break;
        }

        var _json;
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", `../App_Base/Js/resources/${_SourceLang}.json`, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4)
                _json = JSON.parse(rawFile.responseText);
        };
        rawFile.send();

        function ResourceFunct() {
            $(`[changelang]`).map((index, elem) => {
                const htm = resurce($(elem).attr("changelang"));
                $(elem).html(htm);
            });
            function resurce(item) {
                return docResources.get(item);
            }
        }
        var docResources = {
            get: (item) => {
                return _json == null || _json == undefined ? item : _json[item];
            },
        };

        var _pageKey = '<%=Request["id"]%>';
        var $ProcessID = +Math.round(_pageKey / 10000 - 500);

    </script>

    <script src="../App_Base/Js/Canvas/Html2Canvas.Min.js"></script>
    <script type="text/javascript" src="../App_Base/Js/SweetAlert/SweetAlert.Min.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Deflate/Convert.js"></script>
    <script type="text/javascript" src="../App_Base/Js/MxGraph/src/Icon/Icon.js"></script>
    <!-- jQuery -->
    <script type="text/javascript" src="../App_Base/Js/Jquery/Jquery.js"></script>
    <!-- Bootstrap -->
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Bootstrap.js"></script>
    <!-- Sys App -->
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Executor.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Membership.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Md5.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Sha1.js"></script>
    <!-- Sys DocDesigner-->
    <script type="text/javascript" src="../App_Sys/Admin/Document/DocumentView.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Document/Actions.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Document/Sidebar.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Document/Properties.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Document/File.js"></script>
    <script type="text/javascript" src="../App_Sys/Admin/Document/Designer.js"></script>
</head>

<body class="sidebar-mini sidebar-open">
    <input type="hidden" value="<%=ApplicationProvider.PageTitle %>" id="PageTitle" />
    <div class="wrapper">
        <header class="main-header" id="header">
            <a class="logo" id="logo" style="height: 51px !important">
                <span class="logo-mini" id="logo_mini"><%=ApplicationProvider.HeaderShortTitle %></span>
                <span id="logo_lg" class="logo-lg"><%=ApplicationProvider.PageTitle %> | مستند ساز</span>
            </a>
            <nav class="navbar navbar-static-top" role="navigation" id="headerBar" style="padding: 0px;">
                <div>
                    <ul class="nav navbar-nav" id="headerMenuBar">
                        <li id="" class="dropdown" onclick="saveDesign(true)" style="display: inline;">
                            <a style="cursor: pointer; direction: rtl; padding: 15px;"><i class="fa fa-save" style="position: relative; display: inline; font-size: 16px !important; margin-left: 0px;"></i><span changelang="saveInfo"></span></a>
                        </li>
                        <li class="dropdown" onclick="CallConsoleApp()" style="display: none;">
                            <a style="cursor: pointer; direction: rtl; padding: 15px"><i class="glyphicon glyphicon-open" style="position: relative; display: inline; font-size: 16px !important; margin-left: 0px;"></i><span changelang="export"></span></a>
                        </li>
                        <li class="dropdown" id="out" onclick="Exit()" style="display: block;" btnexit="true">
                            <a btnexit="true">
                                <img src="data:image/png;base64,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" style="position: relative; font-size: 16px !important; margin: -7px 0px; clip-path: circle();" btnexit="true"></img><span changelang="out" btnexit="true" style="font-weight: normal;"></span></a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    </div>
    <div>
        <aside class="main-sidebar" id="sideBar">
            <section class="sidebar">
                <a class="geTitle" id="DataProcess">
                    <img src="data:image/png;base64,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" style="height: 24px; width: 24px; opacity: inherit;">
                    <span style="margin: 0px 5px;" changelang="processdata"></span>
                    <i class="fa fa-angle-left pull-right rotate fa-rotate-90"></i>
                </a>

                <a class="geTitle" id="SettingField">
                    <img  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAFbklEQVRoge1aTWxUVRT+zrnTnxB+bJkBNEBMbIiUP+3CWBUjMWwUEuNvtJEFrFkYFSix5cG0VEmURPasgERb2CAmLtQQI6DRQEQEpUQCxWBnpvzUtJ123jkuZizT6bz37sy8ERZ8q8k7553vfO++e9+55w5wH/cWqBpB3R3Rj6B4DwAXmDIAtpldyY/D5iwkCgeKtzxiRwC0VYMy9BFRp3G2CN/0iZ1mTs4kB5kweasxIs3wf0B1wNymsEkjto7qNCwWMa/wROQA9VxPePm5YpYS1DeW6/JKABc8udoXxCSSaWORw9Q9dNUmP6sRUWfBwyJ8HMAnUpP5NdMZfdHLl0ibg+IR6zIv20Tn3OelJnMGhL1i+IQ6MavRC5wj6sSaRPRbAAvzL4Owl4ce2E77+tOTF7fNaXBra44S8LQvqeIbSuMl2pMcvsODWtFoNxTvFuR1lYXXUNfgpbKFeIjIxxlmaQMwW13eqoQXANT6xczDKAiHWcweqDsujEMAWjx8A8V4ClGncaEIn/QR8R8mANQEpu0NBZAGUB/gd5VdbaXu1LViRs854opZi2ARQGUigOzDDBIBAItc5rVeRk8hhms+A/B7GYlVC5eMQZ+X0VMIOX+NsKIN2VfnbiPDqm3kJP7xcvBdfime/BmKrvDzKhFKOyme+sHPJfA7wia5W0Enw8uqNCj0BF9I9AT5BQohBxnD2IC784qNGjEbqBdukKNdreW6MVS+OpWDOlDGZkWzLFHA20tMYBCgD5jpcR4xM3nEzGSlFih1ZG3WYCF+x8bRokSZP0/EvQbLApOAXhrDpvzyY0q8LdFZWqf7lehVm3gAbvNw/QLaOzAawFtA5DTOBtDsurycGEtV8QwBT9gwEtBLu5JvEPzLXwVIO+Z+bitGgeME/Kig84blHEbofOGDmhTi7oj1QLUNwCKb4EUwyGNo8hqJacllN2D9AGJl8l0B0SGzM9EO5M8R1fdRvggA9KmtCAAgZ+g2gH3l82FxLmcAUyd7RbtFVvri/7inMMS0HxXDqO9+oSjS2h8WfXhCRrT0RsYMCa35EZ6QGfRIyfe4pvR7PJAvpKL2jLhYV/I90PWVcCIv57xVC9sBnEZ2t1Y6SDfrlugsW3fd2jAHhM1lcWVzPA2gfZJ+GoGDCNC4xBWzgoBVCn02qJkwGUy1j+Kp1+0+iLE+JX3ZKi7wtZKeVOGzRuUsIqmLhQ2+8EsU1T4yuin3nZgeb2vDHK2N7LcVAWCYh+vnl1yiFIN0RI8qlTQHEgD2MeMYQH9kL+kScbEu9zpFrSOR7jc7U5sC3WxiaUdjqxCfsCYPD8oqKyg+dC7I0W75NbiFCle1MpGGshVvoBDd3FQnwgdRQp84RNQL45A6wU2/QCHScLMHwGOhpFUeWkSj3UFOvnNkorNxLYO/CvL7H6DKtC7iJL70cvBpmT4UFRn/BcCDVUmtdAxyhlfS7sG/ixk9Xy2R8bdx74gAgHli5E0vo6cQZvcwgAELgvFyssqDAhiz8Btg4x7xMvq0TG9cYaY18BGjoFPMtIxZWknpCEoTNQrCAVazioWXBzQBB5hpDTk3rnjmG8TmcUaSgSLOJrk7v+bJHvTUHiNoq29M4LgZw/opBz2vwcijsXaQdmJqDy0nIuG7CbPoNCb6mSOrAb2cu/QnKz9n4sld0wq3D2/dIOipwJik303rgvTCNfFEFzOewp1TACsRVkKyYq5fZtbVCtrII2YFxQe/9/JVUGA5oeLtQ07yJ+baFgVtZFeftBEBVOOc3aIuY9Fm6kqdD5M3/HN2g3Pw34+kEUldDJs2dCG5fUjRc74cfgv7Xw9Atf6LQnQAgBSxZAAcrArnfdxj+Be4twz4xEMZtgAAAABJRU5ErkJggg==" />
                    <span style="margin: 0px 5px;" changelang="settings"></span>
                    <i class="fa fa-angle-left pull-right rotate"></i>
                </a>
                
                <a class="geTitle" id="ProcessUsers">
                    <img  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABMUlEQVR4nO2WWUoDQRCGCyEewKqcyoSIqEfIKazqBwkGr+FyiyzoIQIuh3B56ypaOiMKonZm6VFhfqjH4f+6+q/qAejU6T/KM45UcKmCL+tiWnjGYSvmxjQ1ofB14ST7ye1b86K8o0E2ABVcpgBMaJ4PgPE5BaBCT78LwPSYEYAWyStgmmUD8IzDZAiZdiGnTHDywxieQBvyjgYx7TET61wwzbKf/E8oONjWYzoyoUtlWhVrOHaBVsZ0odI/DGPoZTH3bmdfBe/TY4h33uFeY8bBwZYxnW2wAT+P4zR+WxvAqph/1Gnttlt187e9gKNK5mEMvXifdQGU8SGGtzSAFmmvZf7eBdc/KA1gjFdNAZjQefkOCN42BRD3RJan1zYFqPKPoIw3zQHgdWmATp2gJb0CoJuwMdBnqxIAAAAASUVORK5CYII=" />
                    <span style="margin: 0px 5px;" changelang="ProcessUsers"></span>
                    <i class="fa fa-angle-left pull-right rotate"></i>
                </a>
            </section>
        </aside>
    </div>
    <div class="content-wrapper" style="background-color: #f7f7f7;">
        <section class="content-header" style="display: block; padding-top: 0; height: 44px !important;">
            <h1 id="page-header" class="page-header" style="pointer-events: none;"><span class="fa fa-angle-double-left"></span><b style="font-size: 14px; font-weight: normal; margin: 0px 5px;"></b></h1>
        </section>
    </div>
    <div class="main-content" style="overflow: auto;">
        <section id="content"></section>
    </div>
    <footer class="" id="geFooter">
        <div class="pull-right col-md-10">
            <span><a href="https://amnpardaz.com/" id="copyright" target="_blank" changelang="copyright"></a></span>
        </div>
        <div class="pull-left col-md-2" style="display: flex; align-items: center; justify-content: flex-end;">
            <span id="versionLabel" changelang="version"></span>
        </div>
    </footer>

    <!-- Scripts -->

    <script>
     
        //for not drag an other elements(Z.B) tooblar text
        $("body").on("dragstart", (e) => {
            if ($(e.target).prop("draggable") == true) {
                $ALLOW_DROP_TRUE = true;
            } else {
                $ALLOW_DROP_TRUE = false;
            }
        });

        var _document = new udData(0, _pageKey);
        
        var designJson = _document.getObject();

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
        ResourceFunct();
        ChangeLang();
        var _Version = '<%=ApplicationProvider.PackageVersion%>'
        $(`#versionLabel`).text(_Version)


        localStorage.setItem("ActiveDD", true);
    </script>

</body>
</html>
