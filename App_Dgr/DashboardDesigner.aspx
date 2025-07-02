<%--// Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)---
// Release Ferdos.WebAppDesk 4.2.0.0--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DashboardDesigner.aspx.cs" Inherits="App_Dgr_DashboardDesigner" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title id="page-title"><%=ApplicationProvider.PageTitle %> | داشبورد ساز</title>
    <meta content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no" name="viewport" />
    
    <link rel="stylesheet" href="../App_Base/Css/Jquery/DataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/MxGraph/Select2.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Responsive.DataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Select.DataTables.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/AutoComplete.css" />
    <link rel="stylesheet" href="../App_Base/Css/Jquery/Autocomplete.Themes.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Select.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/File.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Select.Ajax.css" />
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/PersianCalendar.css" />
    <!-- Font Awesome -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Font-Awesome.css" />
    <!-- Ionicons -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Ionicons.css" />
    <!-- ICheck -->
    <link rel="stylesheet" href="../App_Base/Css/ICheck/Green.css" />
    <!-- Jstree -->
    <link rel="stylesheet" href="../App_Base/Css/Jstree/Jstree.css" />
    <!-- Theme style -->
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Master.css" />
    <!-- FormView -->
    <link href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/FormView2.css" rel="stylesheet" />
    <link rel="shortcut icon" href="../<%=ApplicationProvider.FaviconIcon %>.ico" />
    <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link href="../App_Base/Css/Admin/Document/Bootstrap-Rtl.css" rel="stylesheet" />
    <%}
        else
        { %>
    <link href="../App_Base/Css/Admin/Document/Bootstrap.css" rel="stylesheet" />
    <% }%>
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/CustomView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/TabView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/GridView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/TreeView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/ReportView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/DetailView.css" />
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/TimeLineView.css" />
    <!-- DashboardDesigner -->
    <script src="../App_Sys/Admin/Form/FormView.js"></script>
    <link rel="stylesheet" href="../App_Base/Css/Jquery/QueryBuilder.css" />
    <link rel="stylesheet" href="../App_Base/Css/Admin/Dashboard/Highcharts.css" />
    <link rel="shortcut icon" href="../<%=ApplicationProvider.FaviconIcon%>.ico" />
    <!-- ReportDesigner -->
    <!-- Theme style -->
    <link rel="stylesheet" href="../App_Base/Css/Bootstrap/Bootstrap.Theme.css" />
    <link href="../App_Base/Css/Admin/Process/App.css" rel="stylesheet" />
    <link href="../App_Base/Css/Admin/Process/App-Rtl.css" rel="stylesheet" />
    <!-- Theme style -->
    <%if (SessionProvider.UserDirection == "RTL")
        {%>
    <link href="../App_Sys/Admin/Dashboard/ReportDesigner/Css/ReportDesigner-Rtl.css" rel="stylesheet" />
    <link href="../App_Res/Themes/Common/DashboardDesigner-Rtl.css" rel="stylesheet" />
    <%} else
        { %>
    <link href="../App_Sys/Admin/Dashboard/ReportDesigner/Css/ReportDesigner.css" rel="stylesheet" />
    <link href="../App_Res/Themes/Common/DashboardDesigner.css" rel="stylesheet" />
    <% }%>
    <link rel="shortcut icon" href="../<%=ApplicationProvider.FaviconIcon %>.ico" />
    <style>
        .section {
            border: 1px solid #e6e9ed !important;
        }
    </style>

    <script>
        window.onbeforeunload = () => saveDesign(false);
        var _Lang = '<%=SessionProvider.UserLanguage%>'
        var _SourceLang;
        //language
        switch (_Lang) {
            case 'Fa':
                _SourceLang = 'dashboard_fa'
                break;
            case 'En':
                _SourceLang = 'dashboard'
                break;

            default:
                alert('please set language')
                break;
        }

        var _json;
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", `../App_Base/Js/resources/${_SourceLang}.json`, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4)
                _json = JSON.parse(rawFile.responseText);

        }
        rawFile.send();

        var dashResources = {
            get: (item) => _json[item] ??= item

        }

        function ResourceFunct() {


            $(`[changelang]`).map((index, elem) => {
                const htm = resurce($(elem).attr("changelang"));
                const title = resurce($(elem).attr("titleLang"));
                $(elem).html(htm);
                $(elem).attr("title", title);
            });
            function resurce(item) {
                return dashResources.get(item);
            }
        }
        </script>

</head>

<body class="hold-transition sidebar-mini sidebar-open" dragabble="false" ondragstart="return false">
    <input type="hidden" value="<%=ApplicationProvider.PageTitle %>" id="PageTitle" />
    <div class="wrapper">
        <header class="main-header" id="header">
            <a href="#" class="logo" id="logo">
               <span class="logo-mini" id="logo_mini">      
                <%if (ApplicationProvider.AppThemeName == "Blue_Violet") {%><img src="../<%=ApplicationProvider.FaviconIcon %>.ico" /><%} else {%><%=ApplicationProvider.HeaderShortTitle %><% }%></span>
                <span id="logo_lg" class="logo-lg"><%if (ApplicationProvider.AppThemeName == "Blue_Violet") {%><img src="../<%=ApplicationProvider.FaviconIcon %>.ico" /><%}%><%if (ApplicationProvider.AppThemeName == "Blue_Like") {%><img alt="" src="../<%=ApplicationProvider.FaviconIcon %>.png" style="clip-path: circle(); vertical-align: middle;" /><% }%><%=ApplicationProvider.HeaderTitle %></span>
            </a>
            <nav class="navbar navbar-static-top" role="navigation" id="headerBar" style="padding: 0px;">
                <div>
                    <ul class="nav navbar-nav" id="headerMenuBar"
                        style="display: flex; flex-direction: inherit;">
                        <li id="Menu" class="dropdown" onclick="saveDesign(true)" style="display: inline;">
                            <a style="text-shadow: none; cursor: pointer; direction: rtl; padding: 14px !IMPORTANT"><i
                                class="fa fa-save"
                                style="position: relative; display: inline; font-size: 16px !important; margin-left: 0px;"></i><span
                                    changelang="saveInfo"></span></a>
                        </li>
                        <li class="dropdown" onclick="Import()" style="display: inline; display: none;">
                            <a style="cursor: pointer;"><i class="glyphicon glyphicon-save"
                                style="position: relative; display: inline; font-size: 16px !important; margin-left: 0px;"></i><span
                                    changelang="import"></span></a>
                        </li>
                        <li class="dropdown" onclick="ExportFile()" style="display: inline; display: none;"><a
                            style="cursor: pointer;">
                            <i class="glyphicon glyphicon-open"
                                style="position: relative; display: inline; font-size: 16px !important; margin-left: 0px;"></i>
                            <span changelang="export"></span></a>
                        </li>
                        <li class="dropdown" id="out" onclick="Exit()" style="display: block;" btnexit="true">
                            <a btnexit="true" style="padding: 15px !important">
                                <img
                                    src="data:image/png;base64,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"
                                    style="position: relative; font-size: 16px !important; margin: -7px 0px; width: 35px;"
                                    btnexit="true"></img><span style="font-weight: normal;" changelang="out"
                                        btnexit="true"></span></a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <aside class="main-sidebar" id="sideBar">
        <section class="sidebar">
        <div id="ddCharts">
        </div>
                <a class="geTitle" id="DataProcess">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACgklEQVR4nO2Yz2oUQRDGOyGiiJds1agRxYvevPgQilExbyDm4k08JAdjtqqvvoE+gzmpeNGLzxCCB1Ei+acQUDwpTvW21KZnHZdkdbMzszPYHwzsoaenfvV1VXevMVFRh1ZKeEMYt4RwMyWcNU2VEG46Rq+PMG6YpkoYdhoPklq4JYydDCK1yTXTNPmlk6eE4XMXgmDRNFHemAlH8HLPCXjjrZk0TZQwLITl9MUvT58zTZS305eE4LuCpARzpony9vwxYVgNXepxfTYwi9eHedcRPglL6q23M8dNjTawLW/N1L+8lxLMheL+4dt4ufxIBwVjW1ezvv8bBt5LO7kzCMhbOCMEu2H8QrVR5wMxZkIIHgij7PV9/KY7shCs94AIPggn8/6uOfInhJl0hK/DuFc613ggbHLCMTwNS6njCB9lfV+DlnbrtjC8yy23j8J439+7cFTHCMFiAN1VZ7J5867u9xQL0caLwrgWXPiaWry57zgF4mReXck5tC4En7IE6HEk/05lIBq0Bh8CWVOov4JbM6X1onXTV0c7/WNLB+nWA6MVQtedlGBFl9dQcygQ4fagU60rCyQ4sK2FHD4uWuCHLU7dY7RVywGn2lJAvG2d7ctgR1utKVGuKBDtPJo1R/gsa6tVXnDcqCD+Ic4I47K2yVzgPx3jcwWo6oLjhgXpnY0YNxzBixB0bhNrLXmbnC478JFB8mejXvYJVlJqXRnmQlN0cbpRQPS3XjGH/WgtQFLC2W4bHPF/o7GDFKUI0lRHih5XuCIIV+TIuDLtIsgBio5wRUvL1XztuwjC9cq0i45wvTLtoiNcr0y76AjXK9MuOsL1yrSLjnC9Mu3+J0d+AQZB17+FO1o5AAAAAElFTkSuQmCC"
                        style="height: 24px;width: 24px;   opacity: inherit;" />
                    <span style="margin: 0px 5px;" changelang="charts"></span>
                    <i class="fa fa-angle-left pull-right rotate fa-rotate-90"></i>
                </a>
                <a class="geTitle" id="SettingField">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7d15nBXVnT7+51TV3XoFRERl0ySaGLdEREDANItGtAVMbBcIiVl0xpjJZLJO8p2EmclkNZPJNr8YjUYUxR6hWRSjgh0FhbgkrtncBWUTge7bd686vz/wGsCm+y5VdU5VPe/Xa14Z6O5bH0i4z3NPnaoSIFetWbMmEW8Z+lEhMVtCHieAYfu+Ioa+9S0tEEhDwhFAWkIWAWQB8QaArRLYIYCdkNgC6bxYsvCXc848c4eiPw4REWlISil+fuutZxtSLoAQUwCMBGBDiJeklA+YhvHrf7z00j8O9BrCn1Gj4f4NGy+UEj8DcJS7ryz2APJvEPiTlPIxIfHorsNan+h4//sL7h6HiIh0JqUUP7/ttgsNKb8J4OQBvxe41QCuvmr+/N39fZ0FwCVrH3z4m0KIf/fxkAUAT0CKh2HIezPJ2APt48dnfDw+ERH5pJrgP8hfLNs+58qFC189+AssAC5Yt37T5YC8QfEYeQAbpMS9EMaKmVPP+JvieYiIqE5SSvG/t912PqRcBOCDNb0G8Kq07Q99buHCl/b/fRaAOj344IOHF43Yc5BoVT3L/iTEE4ZwOqWQnTPOPPMF1fMQEVHl3Aj+A16vnxLAAlCntQ9u/LoQ+C/VcwziEUhcb9i529ra2tKqhyEiov65HfwHecWx7bZyCWABqNO6Bzc+AoHTVc9RoR4J3AIprp05beJTqochIqJ9PA7+/f1VAJOumj9/NwtAHRZJaUzdsKkPQFL1LDXolkJ8d+aUifepHoSIKKoWLVpkHHbccfMMKb8F4CQ/jimApVfNn38pC0Aduru7k46VzKqeox4S4gkDzo/f2LplSUdHh616HiKiKFAR/AeQcgILQB2klOL+DZvSABpUz1I/+awEvjZz6uQ7VU9CRBRmv1iy5EIAi6Ai+N8igV+xANRp3YObHoaQk1TP4RYB/E4I48ttU854TPUsRERhcu3NNx9ZNIxbBDBd9SwAnjdUTxB0Ak6X6hncJIEPOdJ5ZN36jUvu3bDB5TsaEhFF08+XLj2uZBi/1yT8AWAsC0CdhJ2/DsAbqudwmQBwmQnzT/ev33TVIin5vxMiohr9fOnS44RtdwMYrXqW/Zg8BeCCdesfvggQtyOkl1VKYBOkuJKXDhIRVWe/8NdtRXV7KANLhXUbNn0JUv5Q9RweKkqJRW9u2/x9Xi1ARDQ4jcMfAFawALho7fpNXxSQ16iew0sS2ARY82dOPf1F1bMQEenql0uWvMcWohtSHq16lv4IoIMFwGXr1m/8KoDvqZ7DW2KPFPIfZk6ZdLvqSYiIdKN7+AN45fBY7DgWAA9EYSUAACTkr4ak4lePHz++qHoWIiIdBCD8IYT45FWXXXYjd3d7YObUiT+SEF9SPYfXBMQVe7OFdWs3bTpC9SxERKoFIvyBF3YceeTNAMAC4JGolABATBVF+djahx4KygORiIhcF4TwBwAJfHtRW1sJYAHwVHRKAEYJx/jd/Rs2zVY9CBGR34IS/gJ4YedRR91S/jULgMciVAIapJQr71//8CdVD0JE5JeghD8ASOA/yp/+ARYAX0SoBFgS4vq1D278iupBiIi8FqTwB/D8zqOOunX/32AB8MnMqRN/BOBrqufwgRAC31+3fuO3VQ9CROSVgIU/hBD/vv+nf4AFwFczpk76fkRWAgDgG+vWb1ykeggiIrcFLfwBPLfjyCOXHvybLAA+i9DpAAD41rr1G7+heggiIrcEMPwhpFx08Kd/gAVAiQidDgCAb6/bsCkqhYeIQiyI4Q/gb8Pj8X7v2soCoEikTgdI+YO1GzZ+XPUYRES1Cmj4QwLfOtQD3FgAFIrQ6QAhJK67/8GHZ6gehIioWkENf0j55zeee67zUF/mswA0EJVnBwDocRw5ZdZZk59WPQgRUSUCG/4AIOUln12w4JAPbeMKgAYitCegxTTEynseemiE6kGIiAYT5PCXwJ92Pv/8/w30PSwAmojKngAJHGM5xtLOzk5T9SxERIcS5PAHAANYtGjRImeQ7yFdRGhPQNuwkaO+pXoIIqL+BD38ATy747nnlg32TdwDoKGI7AlwIHD+jCmT7lY9CBFR2c+XLj1O2HY3gKNUz1KHj3x2/vzlg30TC4Cm1q3f+FUA31M9h6ckdpWk+YFzzpqwWfUoREQhCf+1n50/f1Yl38hTAJqKxJ4AgcMsw75RSskiSkRKhSH8JfAqYrGPVfr9LAAai8iegBn3P7TpStVDEFF0/XLJkvcIx7kfAQ5/ANstKc/9bEfHtkp/gJ+8AiACewL6DFOe2jZ58vOqByGiaAnBhj8A2G5KOf0fFiz4UzU/xBWAAIjAfQIapS2u46kAIvJTlMMfYAEIjLDvCZDAh7o3bKz43BURUT2iHv4ATwEETshPB2x3crHjZ80av1f1IEQUXgz/fbgCEDAh3xh4hJksflP1EEQUXgz/v+MKQECFeCWg5Djyg3xgEBG5jeF/IK4ABFSIVwIswxD/pXoIIgoXhv87cQUg4MK6EmAIMaltysRNqucgouBj+PePKwABF9aVAMdx/l31DEQUfAz/Q+MKQEiEcSXAAdpmTZ30O9VzEFEwMfwHxhWAkAjjzYIMgFcEEFFNGP6D4wpAyIRtJUAazoSZZ575qOo5iCg4GP6V4QpAyIRuJcAxr1Y9AhEFB8O/clwBCKn712/8kQT+RfUcLijEZGzctGnjt6oehIj0xvCvDlcAQqolFfsagKdUz+GCeFEUr1I9BBHpjeFfPRaAkBo/fnxRSPEfqudwyWe6u7st1UMQkZ4Y/rVhAQixlgZrFYBe1XO44Agnlpyleggi0g/Dv3YsACE2fvz4IoDHVM/hColPqB6BiPTC8K8PC0D4bVc9gEsuWL9+/VDVQxCRHhj+9WMBCD2RVD2BS5JFxC5SPQQRqcfwdwcLQOjJ96qewC0Scq7qGYhILYa/e3gfgBC754HfH2MZzgsIz3/P+YSwD58yZUoYNjYSUZUY/u7iCkCIWYbzcYQn/AEgUXCss1UPQUT+Y/i7jwUgpDqffTYO4ErVc7jNEbhA9QxE5C+GvzdYAEJq+O69HwUwUvUcbhOQH5ZShmlVg4gGwPD3DgtASDlSfE71DB4ZsfbBTaHZ2EhEh8bw9xYLQAite3DjBwUwUfUcXhGmnKZ6BiLyFsPfeywAISSF+LzqGbwkpHGW6hmIyDsMf3+wAITMgw8+eLiA7FA9h7e4AkAUVgx//7AAhEwBsc8ACMvd/w7l6Hs3bDhK9RBE5C6Gv79YAEKku7vbMgT+QfUcfjCkcbLqGYjIPQx//7EAhIhtpuZKYLTqOfwgIE5RPQMRuYPhrwYLQIgIIa9WPYOPuAJAFAIMf3Wsel9g2bJlR9qp1HF2wXzx0rnnbHZjKKrefQ88fBKAKO2OZwEgCjiGv1o1FYClq1ZNLJTsn+aKhVO35XIx5HIAgGtvv72UiieeTlqJf+poP3eDq5PSgISBKH36B4BjpZRCCCFVD0JE1WP4q1f1LVVvXrFyeW+mb56Uh37fFUKgOdWw+mPz5vK+7T5Yv3790AKszQAaVc/ip5LhHHHOmWfuUD0HEVWH4a+HqvYALF7e9UhPX3rA8AcAKSV6Mn3tNy1b/oyUkvsMPJaHdTkiFv4AYAJjVc9ARNVh+Ouj4nBesnL1z3qzmdOrefF0Lvv+m7pWPM0S4J1FUhoC8rOq51BBOGKc6hmIqHIMf71UFMxdXV1DejPpq2o5QF82cwJLgHembNg4GxDHqp5DBQljjOoZiKgyDH/9VBTKGcP4tu04NQd4XzZzwuLlXU+xBHjBiNrmv7cZQg5TPQMRDY7hr6eKArlYsj9c74HSuez7Fy/vepIlwD33b9hwvIA8W/UcqjgSQ1TPQEQDY/jrq6Iwth1nhBsHS+eyJ7IEuEfC/CxquJIjLARYAIh0xvDXW0VB7Egn5tYB07nsiTd1rXyWJaA+GzZsaIbEx1XPoZIUslX1DETUP4a//ioKYSml6eZB+7J97+XGwPrkpLEQQIvqOVQSMtp/fiJdMfyDodIC4HpQ77s6gCsBtZBSCgER2c1/fyf4vx0izTD8g6PSAuDJeea3VgJ4s6Aq3f/w72cBeK/qOZSTLABEOmH4B0tlBcDDjWZ92cz7Fnet+ANLQBXsaN745x0E/zdDpAuGf/BU9AYqAE8fuJLOZk7hSkBl1j300FgInKd6Dk1E9goIIp0w/IOpsgLgwxPX+rKZ993ESwQHZ4urAbi6KTOoJOConoEo6hj+wVVpAfDljbYvlz3xZl4dcEirH3usAUJ8UvUcuhBS9qiegSjKGP7BVlHQGhC214OU9WYzJyzuWvE4S8A7NWZLCwDw9rdlAiwARIow/IOvspAVouTxHAdIZzOn3rxi5WN+HjMIZESf+ndoolf1BERRxPAPh8pWAAyR8XqQg/Vm+j6wuGvFH/w+rq7uf/DhswCcrHoOrUixV/UIRFHD8A+PygqAMPZ4PUh/9pWAlY+rOLZupDD46f8gEs5u1TMQRQnDP1wqXAEw3vB6kEPpzaQ/GPWVgHs3bDgKkHNVz6EbAfGq6hmIooLhHz6VbgLc5vUgA4n66QBTmosAuPZAprAQkJtVz0AUBaEIfym3MfwPVOllgK94Pchg3ioBj6qew2/dGzZNBMBL//pjOFtUj0AUdmEJf1gWw/8gla0AmOL3Xg9Sid5M3/jFy7seUT2HX+7b8NgYWzrLwRv/9KsvmeQKAJGHwhT+n73kkj+rHkU3lT4LYB2EHndd7c1mTr9peVeoLxGUUhpLVqy67uXXXnwxm88fqXoeHUnIre3jx/t+dQpRVDD8w6/iVL/29s5iqVS0vBymGs0NjY8snDf3DNVzuGlRd7d1XG/volw+/7lsodACAIZhYPSII5GKJ1SPpxcp750xbfI5qscgCiOGfzRUfLc9yzC0uutab6ZvQlhWAm5avfroW1euuvnoHTv6dvf2fqMc/gDgOA42b9+KTD6nckT9CPG06hGIwojhHx2VFwDT1O58azqbOW3xipWbVM9RqyWrV8++adnypzPp9Obd6d4FhVIp3t/3OdLBlp3bkC3k/R5RY+JZ1RMQhQ3DP1oqLgCmaW30cpBa9falzwjS1QFSSuPWlau/cuOy5dv29PTclc5lT3QcZ9BTMVwJOJAAnlI9A1GYMPyjp+I9AEvX3Hv2rt077/FymHrovidg2bJlR+at+H/35bMXForFfj/pV8IQBkaNGImGRNLN8YIml+/dPWT27NlcEiFyAcM/miouAFJK49qlt5dsx9bjcoB+NDc0PrZw3tzTVc+xvyV33tlWKpW+k81mz7Ar+KRfCZYAuX7G1MnTVE9BFAYM/+iq+BSAEMKJW7FdXg5TL53uE3DrqjuvuuGOZZv37N17f7qvb6Jb4Q+8tSdgx7bIng4QQqxXPQNRGDD8o62qy/osy3oKBUz3ahg37LtPwIqHP37h3Ml+H3vx8ntGCCP3k1w+P293715Pr9srbwyM5iWC4iHVExAFHcOfKl4BAIBYLLbEq0HclM72Tbpp+QrfNi0uWXnXtMVdK37fl39zW09f+pJCqehLIkd0Y6BjZy0WAKI6MPwJqGIPAAB0dnbGd9l2rpJd6zpoTjU8uvDCeRO8ev1bV915Va6Q/9dcPjdKenWQCkRsT8CfZkyd9H7VQxAFFcOfyqoO8hvuWLY5m8+N8mIYL7h9dcAta9a0iGLph5lcdmGhVNImcSNTAgRumTFl0sdUj0EURAx/2l9VpwAAIG5a67wYxCu9mb4Ji7tW1r1pbOmqVRNvWrFiY+/evXv2pHuv0Cn8gejcLEhAvKh6BqIgYvjTwaouAE7MvMaLQbzUm0lPqbUE3Lpq1eduuGPZljd7ezem+/om6nz6w3EcbN6xNdQlwJFyr+oZiIKG4U/9qSnMbrhj2a5sPjfM7WG81pxq+FOzwJnz5s3bM9D3dXV1Dcka1o/68tlLC8Viyq/53BLmBwhJyKtnTp38C9VzEAUFw58OpeoVAABIxmJr3B7ED73ZzAlvFArbb165+n+7urqGHPz121avnrG4a8VD23O5XbvTPZ8MYvgDIV8JkKJV9QhEQcHwp4HUtAKw/K61x23bs/2vKne+10sIgUQs3iuE6IGEVbJLw4p2KaZ6LjeFcyVA/mTG1Mn/rHoKIt0x/GkwNa0AXHjezL8lE8mdbg/jJyklcoV8czafOzpbyB0RtvAHwroSIE5VPQGR7hj+VImaCgAAJKzYDW4OQt4I4c2CPvjYY4+FrqwRuYXhT5WquQAUWpsXWaZluzkMeSNkzw5o7skUtL4dNZEqDH+qRs0F4PK2tlwqkdzg5jDknTCVAGmIS1TPQKQbhj9Vq+YCAABxM/5lbS+Kp3cITQmQuHTdww8H902OyGUMf6pFXQXgkgvOfbQh2fCqW8OQ90JSAhIoia+pHoJIBwx/qlVdBQAAklbsS24MQv4JRQkQuGrdAw/7/shnIp0w/Kkerqzg33jHsu2ZfG6EG69F/gnBA4T+nI+JibMnTuxRPQiR3xj+VK+6VwAAIJWIf8ON1yF/hWAl4H3xIjq7u7st1YMQ+YnhT25wpQBc0t5+fSqe3O3Ga5G/gv4UQQF5jmMlbujs7DRVz0LkB4Y/ucWVAgAAyUTysxC8JiCIgn+zIPGx4SNHL+FKAIUdw5/c5Gpi/+aOZa/05XNj3HxN8k/Q9wQIiduFnVvQ1tZWUj0LkdsY/uQ211YAAKAh0TCfawDBFfQ9AVLgYmkmb+FKAIUNw5+84GoB6Gg/d0NjquFxN1+T/BX0PQFS4GLuCaAwYfiTV1wtAADQJJ12yzT5jIAA454AIj0w/MlLrheAj3zkI1tbUs3fdvt1yV88HUCkFsOfvObZKfsb71j2eiafO9Kr1yd/cGMgkf8Y/uQH11cAylLxhjmmYUivXp/8wT0BRP5i+JNfPN20v2TFiuv29PV92stjkD+4EkDkPYY/+cnzq/ZuvGPZy5l8bqzXxyHvsQQQeYfhT37z7BRAWdJqmmqZFt9wQ4AbA4m8wfAnFTwvAJfOPWdzS2PTP3t9HPIH9wQQuYvhT6r4duO+W1auWr033Xu+X8cjb/F0AFH9GP6kkq937v3NsuV/68tl3+PnMck7LAFEtWP4k2qenwLYX6shJiRi8T4/j0ne4Z4Aotow/EkHvhaAefPm7WlKJmZahuH4eVzyDvcEEFWH4U+6UPLwviUr77ywN5O+w3ZsPjwwJHg6gGhwDH/Sia8rAGXz55y/vKmx4V+EYP6HBU8HEA2M4U+6UVIAAGDBBRf8z5BU83dVHZ/cxxJA1D+GP+lIWQEAgMvmtX+9taHpJnAlIDS4J4DoQAx/0pUWybtk5eqf7U33XM0nB4UH9wQQMfxJb0pXAMrmz2n/XGtTy0+0aCPkCp4OoKhj+JPutCgAADB/Tvs/tzY2/1iTRQlyAU8HUFQx/CkItEvbW1eu+WJPpueHvEQwPHg6gKKE4U9BoWXI3r56Tfuevt7lJbvE5deQYAmgKGD4U5BoWQAA4NaVd5+cyacfzhcLjapnIXewBFCYMfwpaLTZA3Cwy+ac+1RDKjmuIdnwgupZyB3cE0BhxfCnINJ2BWB/S1auunZvX/oKKXmhYBhwJYDChOFPQRWIAgAAt61efXFvX+bmol2KqZ6F6scSQGHA8Kcg0/YUwMEubW+/vTk55F2NydRzqmeh+vF0AAUdw5+CLjArAPtbsnL1/0tn+xaVbJtvvgHHlQAKIoY/hUEgCwAALF2z5l25bG5tXy47TvUsVB/DMDB6xJFIxROqR6mRvHnX1i2Xd3R02KonIe8x/CksAlsAym5bddcX0rm+7xSKxWB+hCQAXAmgYGD4U5gEvgAAwI3d3Ulrb8+t6WxmruM4ofgzRRFLAOmM4U9hE6qwvHXl3SeX7Nxt6Vz2BF4yGEw8HUA6YvhTGIWqAJQtXbVqYq5k35DJZt7HGhA8XAkgnTD8KaxCWQDKOleu/HBfyfn/svnsOK4IBAtXAkgHDH8Ks1AXgLJbV959cskp/DSTy07jUwaDgysBpBLDn8IuUmG4ePk9Iwwj/9NcPjcnX+JVA0HAlQBSgeFPURCpArC/pavumpN3il/LZnMTbMcOzB0Ro4grAeQnhj9FRWQLQFlnd3dTqbf3a4WifXGukDvWdhyWAQ1xJYD8wPCnKIl8AdhfZ2dn3E41fqZYKn4iVyycVCwWA5E2AkAsFs/GTOs1wzBeMgzsNiAKtuO0SiFGlEqld+eLhWFBv0cCSwB5ieFPURPoQPBa55o1JxQLzuUlpzirUCodVygWUqpnAgDDMGQiFt9tmeZTMdO4q6Gh4eY5M2duH+hnFnV3W8enM1fli4UrMwG+TwJLAHmB4U9RxAJQhc7f/nZYKZ9vtyWmO7Y8teSUxpTsUrNXDyUSACzLKlqmucsyrRdNw3zUFEZ3trnhnsvb2nK1vu4d99zz3kwme1M6m5kQxCLAEkBuYvhTVLEAuOCWNWtaTNs+XTo4DcDxtnSOkFIOlY7T6kjZJIEGKeU7SoIQImsIIysE+oQQfQbETpjiJQPmXwwYfzByvU92dHQUvJp76co7L+rNZ24qFItarGxUgyWA3MDwpyhjAYi4rq6uIXtt58m+fG6M6lmqxasDqB4Mf4o67niPuHnz5u15+bBh72pMNfxJ9SzVcqSDLTu3IVvIqx6lJlLgYsdK3NDZ2enJKSQ6NIY/EVcA6C1SSuOmrhVP9GUzJ6mepVpcCaBqMPyJ9mEBoLexBKjDEuAPhj/R37EA0AFYAtRhCfAWw5/oQCwA9A4sAeqwBHiD4U/0TiwA1C+WAHVYAtzF8CfqHwsAHRJLgDosAe5g+BMdGgsADYglQB2WgPow/IkGxgJAg2IJUIcloDYMf6LBsQBQRVgC1GEJqA7Dn6gyLABUMZYAdVgCKsPwJ6ocCwBVhSVAHZaAgTH8iarDAkBVYwlQhyWgfwx/ouqxAFBNWALUYQk4EMOfqDYsAFQzlgB1WAL2YfgT1Y4FgOrCEqBO1EsAw5+oPiwAVDeWAHWiWgIY/kT1YwEgV7AEqBO1EsDwJ3IHCwC5hiVAnaiUAIY/kXtYAMhVLAHqhL0EMPyJ3MUCQK5jCVAnrCWA4U/kPhYA8gRLgDphKwEMfyJvsACQZ1gC1AlLCWD4E3mHBYA8xRKgTtBLAMOfyFssAOQ5lgB1gloCGP5E3mMBIF+wBKgTtBLA8CfyBwsA+YYlQJ2glACGP5F/WADIVywB6uheAhj+RP5iASDfsQSoo2sJYPgT+Y8FgJRgCVBHtxLA8CdSgwWAlGEJUEeXEsDwJ1KHBYCUYglQR3UJYPgTqcUCQMqxBKijqgQw/InUYwEgLbAEqON3CWD4E+mBBYC0wRKgjl8lgOFPpA8WANIKS4A6XpcAhj+RXlgASDssAep4VQIY/kT6YQEgLbEEqON2CWD4E+mJBYC0xRKgjlslgOFPpC8WANIaS4A69ZYAhj+R3lgASHtSSmPx8pV/TOf6TlY9S7WiWgIY/kT6YwGgQGAJUKfaEsDwJwoGFgAKDJYAdSotAQx/ouBgAaBAYQlQZ7ASwPAnChYWAAoclgB1DlUCGP5EwcMCQIHEEqDOwSWA4U8UTCwAFFgsAeqUS8BfX3/9GIY/UTCxAFCgsQSok8/l17y08/VTGP5EwcQCQIHHEuC/YqmIV3ZsRankyxOEvcHwp4hjAaBQCFIJEHAw1NmOFmcHYqKAnGhB8vBTYDYepXq0ijD8icKBBYBCQ/cSYMk8TihtwHvsR9Ege97x9d7Esdg+/ELsbhqvYLrKMPyJwoMFgEJF1xIwzNmKswpL0CTfHPR7dzedgReP+kc4Qq/TAgx/onBhAaDQ0a0EDHW24ez8rxBHruKfSaeOw99G/StsI+XhZJVj+BOFj6F6ACK3CSGchRfO+UBTsvEp1bNYKOKs4pKqwh8AmrJ/w3FbvgPTyXo0WeUY/kThxAJAoaRLCTi+9DCanV01/WxT9jnlJYDhTxReLAAUWjqUgONLj9T18ypLAMOfKNxYACjUVJaAZvkGGuXuul9HRQlg+BOFHwsAhZ6qEtDqvOHaa/lZAhj+RNHAAkCRoKIEuPHpf39+lACGP1F0sABQZPhdAppcLgCAtyWA4U8ULSwAFCl+loBGuceT1/WiBDD8iaKHBYAix68S0OwMfte/WrlZAhj+RNHEAkCR5EcJaII3KwBvv74LJYDhTxRdLAAUWV6WAAsFxGXG7Zd9h3pKAMOfKNpYACjSvCoBLRU89McttZQAhj8RsQBQ5HlRAhod968AGEg1JYDhT0QACwARAPdLQKOPKwBllZQAhj8RlbEAEL3FzRLQ5PMKwNvHHaAEMPyJaH8sAET7casENEFNAQD6LwEMfyI6GAsA0UHcKAF+7wE42P4lgOFPRP1hASDqR70loNnjewBUoin7HI7b/B1s3flKsMNfiNdMIaYx/IncxQJAdAi1loC4zCImc16NVZWm3HOYlf8NEqKgepTaSLkNhjHrH+bPf071KERhwwJANIBaSoDK8//9ack/jw/btwSuBFiGiXEjR/3xhCOOYPgTeYAFgGgQ1ZYAVVcADCRoJcAyTIwZeRSSicS50kze0t3dbameiShsWACIKlBNCWj04DHAbghKCSiHf9yKAQCkwMUsAUTuYwEgqlClJaDZo8cAu0H3EnBw+JexBBC5jwWAqAqVlAAVdwGshq4l4FDhX8YSQOQuFgCiKg1WAoY62/weqWq6lYDBwr+MJYDIPSwARDU4VAkY5mxFo8anAPanSwmoNPzLWAKI3MECQFSj/krA+0obVI5UNdUloNrwL2MJIKofCwBRHfYvASPtF3Cs/YTqkaqmqgTUGv5lLAFE9RGqByAKg97fnPD+gu08GZNZU/UstepJvBu/NRcgL+OeH6ve8D+QvHnX1i2Xd3R02C68GFFksAAQ1ann12PnQeLXAIaqUQlhRgAAIABJREFUnqVePYl3415jPrJIeHYMd8N/HyFxu7BzC9ra2gL80AMif7EAENVg56+Pb04id7YEroLEdNXzuKWYNpHLpnDf6M+hTzS7/vpehH8ZSwBRdVgAiAYhrz0tlhY7j3NMnGbAOE1KeRqA8YCHH5MVKKZN5HabgASQTOC+MVe7WgK8DP8ylgCiyrEAEO1HLoKVPmrM8WEP+4MdEP5lLpYAP8K/jCWAqDIsABRZhwj70wAkVc/mp37Dv8yFEuBn+JexBBANjgWAIqHfsJf4IARSqmdTacDwL6ujBKgI/zKWAKKBsQBQKKWvO+YIW9hnA2KSgDwNECcjYp/sB1NR+JfVUAJUhn8ZSwDRobEAUKj0XHvUcBix70HgYwC8v6A9oKoK/7IqSoAO4V/GEkDUPxYACo3eG8ac4Dj4rYAYrXoWndUU/mUVlACdwr+MJYDonVgAKBR6rh33XpiyG8BI1bPorK7wLxugBOgY/mUsAUQHYgGgwGP4V8aV8C/rpwToHP5lLAFEf8cCQIHG8K+Mq+Fftl8JCEL4l7EEEO3DAkCBxfCvjCfhX5ZM4P5jPo/hI48PRPiXsQQQ8XHAFFAM/8p4Gv4AkMtj+ss/QaOT9ugA3uCjhIm4AkABxPCvjOfhv79UAi9M+AGK8WA9EJErARRlLAAUKAz/yvga/mUsAUSBwgJAgcHwr4yS8C9jCSAKDBYACgSGf2WUhn8ZSwBRILAAkPYY/pXRIvzLWAKItMcCQFpj+FdGq/AvYwkg0hoLAGmL4V8ZLcO/jCWASFssAKQlhn9ltA7/MpYAIi2xAJB2GP6VCUT4l7EEEGmHBYC0wvCvTKDCv4wlgEgrLACkDYZ/ZQIZ/mUsAUTaYAEgLTD8KxPo8C9jCSDSAgsAKcfwr0wowr+MJYBIORYAUorhX5lC2kB+txWO8C9jCSBSigWAlGH4VyaU4V/GEkCkDAsAKcHwr0yow7+MJYBICRYA8h3DvzKRCP8ylgAi37EAkK96rx99ooRxP4DDVc+is2KvidyekGz4q1QqiefPuAalWIvqSarCEkBBZagegKKD4V+ZSIY/AGRzeNcf/k31FFWTAhdLM3lLd3e3pXoWomqwAJAvGP6ViWz4v0X07MYRr96ueoyqsQRQELEAkOcY/pWJeviXDX1lreoRasISQEHDAkCe6r1+9IlSGOvA8B8Qw38/+TzE7r+qnqImLAEUJCwA5Jm3w19ihOpZdMbwP4gEzNfXI5PPqZ6kJiwBFBQsAOQJhn9lGP79S5Z6sWXHNpYAIg+xAJDreq4d914J476whb+dF8jvFcjuMpDdZaDQK+AUa7+StpA2GP6HUDQTcKTDEkDkId4HgFwVppv8OAWBvu0GMjsN5PcYcEr9/3OxEhLJoRLJESU0Hi4hzMETPVI3+anBY2M7sCV5AgDAEAZGjRiJhkRS8VS14X0CSFcsAOSasCz7l7ICe18ykX7dgnSq+1nDkmgZY6NlnA3D6j/duew/MGEJrDz2G3DE3z84swQQuY+nAMgVYQh/KQX2vGjh9YcT6N1SffgDgFPa9xqvbUgg/br5jq8z/Ae3q+WYA8IfAE8HEHmAKwBUtzCEv50X2PFkDPk97nbixpE2hr+/BGFKhn8lYgbuHvdF5I3Gfr/MlQAi97AAUF3CEP6lrMC2x+MoZbz555BodTDsOAeFtMHwH4AwBB4dfdHb5/4PhSWAyB0sAFSzMIR/sU9g++NxlHLe/lOwUkDLGAeC/+L6FzPw2NEfxZbEwOFfxhJAVD++HVFNGP7VS7RINB3FJYADWAZ2tr4Ljxz2ERRFdWHOEkBUHxYAqhrDv3ZNR0okWqNVAoQJOFYMRSuBvNWEvthQ9MYPx87EWOyIv6uu12YJIKodCwBVJQzX+asKf2BfGA491oF45wUCwSUAmAZsK458vBGZWCt6Y4djT+xI7EyOQ8YY4unhWQKIasMCQBXjJ393pIZLNAwP2CqAJVCKNyAXa0QmNgTp2OHYHTsCb8ZGo88aqno6lgCiGrAAUEUY/u4RhsTQd+/7T93lmofimcNmVbw5TyWWAKLqsADQoBj+7ms+ykG8RfUUAzAEnjnqw3i+8QzVk1TFMAyMHnEkUvGE6lFqJG/etXXL5R0dHbbqSSj8eCdAGhDD3xuFtD6zHEyYUsaazfO2HTb9KdWzVMtxHGzevjWwdwwExMeGjxy9hHcMJD+wANAhMfy9U/TopkNuiKWc/xzxxT+vWXjhnA80JRuDVwJ422Ciiuj7LkRKMfy9N+w9+l0NYMblGyP/3/OHl38tpTQWL1/5x3Su72SVc9WCewKIBsYVAHoHhr8/7KLqCd7JiDnX7f9rIYTDlQA1uBJAXmMBoAMw/P0jtdvmJSHiiZ8d/LssAeqwBJCXWADobT3XjnuvhHEfwz+ajBiyh3/hz1v7+xpLgDosAeQVFgACwDv8qaDb+X+YcvNAX2YJUIclgLzAAkAMf0UMS69ZTRN/GOx7WALUYQkgt7EARBzDXw1hAoal150AbcO4t5LvYwlQhyWA3MQCEGEMf3ViKb3CXwggaRW7Kv9+lgBVWALILSwAEcXwVyvWpFcBgCWzQ7/w8p5qfoQlQB2WAHIDC0AEMfwVE0CiWfUQBzJMvFLLz7EEqMMSQPViAYgYhr96ySFSuysAhIXHa/5ZlgBlWAKoHiwAEcLwV08YEqlhqqd4J9PAPfX8PEuAOiwBVCsWgIhg+OshNQwwYnqd/xcCEGmsrP91WAJUYQmgWrAARADDXw+xFJA8TK/wBwBhycxhi57vceW1WAKUYQmgarEAhBzDXw9mDGg6WkJo+EcQlnzZ1ddjCVCGJYCqwQIQYgx/PQgLaB4ttbvxT5lp1L4B8FBYAtRhCaBKsQCEFMNfD4Yp0TragRnXM/wBADH5Wy9eliVAHZYAqgQLQAgx/PVgmBItYyTMhOpJBiAAmUit8uzlWQKUYQmgwbAAhAzDXw+BCH8ARkz2jfjss2kvj8ESoA5LAA2EBSBEGP56CEr4A4Aw3d0AeMjjsAQowxJAh8ICEBIMfz0EKfwBwDCcx/w6FkuAOiwB1B8WgBBg+OshaOEPALCMu/08HEuAOiwBdDAWgIBj+OshkOEvgFLvkNW+H5YlQBmWANpfcN9xieGviUCGPwAzJtMj/+15Zc8llFIai5ev/GM613eyqhlqZQgDo0aMREMiqXqUmgiJ24WdW9DW1lZSPQupwxWAgGL46yGo4Q8AwpIvKT0+VwKU4UoAASwAgcTw10OQwx8AYMoNqkdgCVCHJYBYAAKm9/rRJ8KSD4Dhr1Tgw18AlmH8XPUYAEuASiwB0cYCECC9148+UQpjHSRGqJ6lVgx/PZgp+efDvvT8n1TPUcYSoA5LQHSxAAQEw18PYQh/w5IlYaBd9RwHYwlQhyUgmlgAAoDhr4cwhL8wpZNIOXOP+MrzL6iepT8sAeqwBEQPC4Dmeq4d914J4z6Gv1phCX+z0blo2JdfvEv1LANhCVCHJSBaWAA0xt3+eghT+B/xpReXq56lEm+XgFTDM6pnqVYYSoBjJW7o7Ow0Vc9C3gruu3LIMfz1wPBXizcLUkjKe518vGPWrPF7VY9C3gjuO3OIMfz1wPDXg5TSWNy14sl0NnOi6lmqFfgSAPxZAJdPnzrp914doLu7u8k2U2MMOKMlxGhhiNHSkcOkEC0CslkAzRIY2s+PliTEHkPKPRBij4TcIyF2QuI108DLpmO9Mm3a+K1ezR0GwX13DimGvx4Y/nphCVDKFpC/FCXje21tE7fU+iIPP/xwKiPliZDiZOEYJ0LIkwCcBHi6vykH4EUh8bQ0xBOAfBKGfGrG5MmveXjMwAjuO3QIMfz1wPDXE0uAcgUJsVQIubQ1GVs7fvz44kDffN99j7WaCXuKFPYUQEwFcDqAuD+jDup1AA8KiPXCsB/80OTJzwohpOqh/Bbcd+mQYfjrgeGvN5YAbaQF8ISUeEIYYoeEsxswkpCyFcC7AZwK4DgEZ6P5G0LiHhhYlbPEb2dPnNijeiA/BPedOkQY/npg+AcDSwB5LC8hfgfhdCWk3Tl16tTdqgfySnDfrUOC4a8Hhn+wSCmNm7pWPNGXzZykepZqsQQESh7AfYBc3JqKrxjstEfQBPcdOwQY/npg+AfTvpWAlU+ms31cCSA/bBMCN5Rg/+LsKVNeVz2MG4L7rh1wDH89MPyDjSsBpEARECsMgf9umzJxk+ph6hHcd+4AY/jrgeEfDlwJIFUE8DtIuWj6tMkPqJ6lFsF99w4ohr8eGP7hwpUAUuwhIeU3glYEgvsOHkAMfz0w/MOJKwGkmhTyLgPWV6dPmfCs6lkqEdx38YBh+OuB4R9uXAkgDZQk8L8yF/um7s9RCO47eYAw/PXA8I8GlgDSgsQuKcR/bphyxs8WCeGoHqc/wX03DwiGvx4Y/tHC0wGkkQdKjnH5OWed8ZLqQQ4WlNs0BhLDXw8M/+gRQjgL5805pTHV8LTqWarlSAdbdmxDJp9TPQq54yzLcJ5Zt37jVxdJqVXmBvddXXMMfz0w/KONKwGkmftKjvmpc86asFn1IAALgCcY/npg+BPAPQGkGYldMPCxGVMm3a16lOC+u2uK4a8Hhj/tjyWANCMB/GDX1s3f6OjosFUNEdx3eA0x/PXA8Kf+8HQA6UYAay1ZvGzatGk7FR2f3MDw1wPDnwbClQDSjQBesh2cN+usSX/2+9ha7UgMKoa/Hhj+NBghhPPxeXNP5dUBpAsJHGMYeGjthk1tfh+bBaBODH89MPypUiwBpKGhQsp771+/6Qo/D8oCUAeGvx4Y/lStcgloSjU+o3qWarEEhJYlIX+5bsOmL/l1QBaAGjH89cDwp1rxZkGkIQEpf7hu/cZv+XMwqhrDXw8Mf3IDNwaSpr4/Y+qkr3l5AK4AVInhrweGP7mFpwNIU19dt37jt708QHATQAGGvx4Y/uQFrgSQjiTEl2ZOnfgjL147uCngM4a/Hhj+5CWWANKQBMSnZkydeKPbLxzcJPARw18PDH/yA0sAaagIgTluPz8guGngE4a/Hhj+5CfeNpg01GcYzpS2M898wq0X5CbAATD89cDwJ7/xEkHSUKPjGCsefPDBw916QRaAQ2D464HhT6rwjoGkobElEVve+eyzcTdejAWgHwx/PTD8STWWANKNBKYMe7Pnh268VnDTwSMMfz0w/Ekn3BNAuhECF0+fMqmzrtdwa5gwYPjrgeFPOuLVAaQXsQeGfeqMM898pdZX4CmAtzD89cDwJ13xdADpRQ6BI27u7Ow0a30FFgAw/HXB8CfdsQSQXsTU4UeN+krNP+3mKEHE8NcDw5+ChHsCSCNFx5GnzTprctWlNNIrAAx/PTD8KWh4nwDSSMwwxPWLpKw6zyNbABj+emD4U1DxdABpZMLU9ZuurPaHgpscdWD464HhT2HAqwNIEz0w5QkzJk9+rdIfiNwKAMNfDwx/CovySkBTqvEZ1bNUiysBodICW/ygmh8IboLUgOGvB4Y/hRFXAkgD0hDGhLYpZzxWyTdHZgWA4a8Hhj+FFfcEkAaEI51rKv3mSBQAhr8eGP4UdiwBpIGz7t+waXYl3xj6AsDw1wPDn6JivxLwJ9WzVMuRDrbs3IZsIa96FKqDhPxeJZcFhroAMPz1wPCnqHmrBJzUmEi+qnqWajmOg83bt3IlIMgkTpqyfuMFg31baAsAw18PDH+KKiGEE0/ET4vHYlnVs1SLKwHBJ4T418G+J5QFgOGvB4Y/Rd1l7e1vNKWaFgoRvH/HXAkIvAn3P/jwjIG+IXQFgOGvB4Y/0T6Xts++oynV8IjqOWrBlYBgkwa+PtDXQ1UAGP56YPgTHagp3vQxI4CrAABXAgJNiundDz106qG+HJoCwPDXA8Of6J0uPG/m3xqTqcBdFVDGlYDgko749KG+FooCwPDXA8Of6NAMy7xO9Qz14EpAMEkhFtxzz5ON/X0t8AWA4a8Hhj/RwOK53P8ahiFVz1EPrgQEkESr2dh3SX9fCnQBYPjrgeFPNLiOjo5CwortVj1HvbgSEDxCis/09/uBLQAMfz0w/IkqZ1nWi6pncEPIVwIkgGcALAdwK4B1AHqUTlS/Cfc88PtjDv5NS8Uk9WL464HhT1QdAexQPYNbyisBIXqK4DYhxK+ksG+YceaZr+z/he7ubsuxEu2A+BaAUxTNVw9hGU4HgO/v/5uBWwFg+OuB4U9UA8MM/CmA/YViJUCKjULI+buGtYydPmXitw4OfwBoa2srzZg6ucso5cYL4L9VjOmCjoN/I1AJxPDXA8OfqDa3dK1atjfTe6HqOdxmCCNoKwE5IXE7hPjZ9KkTH6/2h9et3/hVAN/zYC5PGaZ8T9vkyc+//WuVw1SD4a8Hhj9R7Rwhh6qewQtBWQkQwGYh5Ndjsjhm+rRJn6gl/AFgxtRJ3wfwNZfH85xtG3P2/3UgCgDDXw8Mf6L6OLY9VvUMXtH86oDHBeTHW1Kxd02fMvm706ZN21nvC86YOun7EuJLbgzno1n7/0L7NGL464HhT1S/62/vzOZLxcCsk9dCo9MBOUD+n5TGNTOnTXzKq4OsXb/piwLyGq9e32W5lCmHTZ48OQtovgLA8NcDw5+ofivXrj2iEPLwB3Q4HSBflBBfMkq5I2dMnbzQy/AHgJlTJ/4IwTkdkMw4xpTyL7QtAAx/PTD8idyRzuU+EejbAFZBwekAKSHukZDt66dMes/MqRN/1NbWtsevgwdsT8DbpwG0vA8Aw18PDH8i99jF0nmqZ/CTIx1s2bHN69MBvRLyNkNYP50xZcKzXh2kEjOmTvr+2vWbSrqfDhBSnln+/7VbAWD464HhT+Sukl06SfUMfiuXAA9WAp4D8LU4SmNnTp185XTF4V82c+rEHwVgY+AHO599Ng5otgmQ4a8Hhj+Ruzq7u5ve2Lq1V8qonAQ4kGEYGD3iSKTidb2pOJC4Uxri5zPOPGOtEELbv0zd7xMgIMZPnzrxcW1WABj+emD4E7nP6ek7N6rhD9S5J0BgrwR+WnKMd8+YNmnOzCkT79M5/AH9LxGUUk4ANDkFwPDXA8OfyBu2IdtUz6BaDacDnoLEFZlk7KiZUyd9/pyzznjJy/ncpvXVAQKnAxpsAmT464HhT+SdUqH4AdUz6KCCjYEOgDUS+MmMKRPX6f5JfzDabgyU4r2A4hUAhr8eGP5E3rId51jVM+jiECsBtoC41iiJsTOmTmqfOXWS1uf4q6HlSoCQxwMKNwEy/PXA8Cfy3rVLby+W7JLyFVed7Lcx8HVIOW/GtMmPqJ7JS7ptDDRKscOVrAAw/PXA8Cfy3urVqxsY/u/kOA5ef2O77YjYpLCHP6DfzYIco3Cc7wWA4a8Hhj+RPzKmyfP/h5BKpn4za8r4V1XP4RedSoAw8G5fCwDDXw8MfyL/2CXnFNUz6CgVj/csuKD9CtVz+E2XEiAhjvStADD89cDwJ/KXlPYJqmfQUSKe/KkQwlE9hwpa3CdA4AhfCgDDXw8MfyL/OY48RvUMuolZVvG5lqZ/Vz2HSsqvDpA+FACGvx4Y/kRqOI4zTPUMuknFE3ctamsrqZ5DNaUrAUKO9LQA9F4/+kRY8gEw/JUKS/jHG+RHGf4UQE2qB9CJYRjSEql/Uj2HLpStBEgx3LMC0Hvd2PdJGPdBYoRXx/Aaw18P5U/+w7/8QpfqWYiqJaVsVD2DThriqacvnXvOZtVz6ETRSkDSkwKQvu6Yk6UAP/krFpbw5yd/CjIHMqV6Bp1YcfNfVc+gIwWPEna/AOy+cdw4Rzj3ADjc7df2C8NfD/zkT2HgSBngf4XuSsWTb8xvb1+jeg5d+Xw6wN0C8Oa1x7aatlwNfvJXKkzhz0/+FHSGEMF9M3FZKp74qeoZdOfb6QCBhGsFQF57WswyS6sAnOjWa/qN4a8HLvtTqEgZiofa1CtmxQp/bWn8ruo5gsCXlQCJmGsFIG3tugYQ09x6Pb8x/PXAZX8KHWGwAABoSCZW8tK/ynm/EiAKrhSA3uvHXCSlDOxlHQx/PXDZn8KICwCAYZjSNowvqJ4jaLzdGChzdReAPdeNPUZCXO/GOCow/PXAZX8KK4Fo3u52fw2JxJMfb29/TfUcQeTh6YB8XQVASghTyF8CaHFpIF8x/PXAZX8KM2GIrOoZVEskG7+qeoYg8+h0QH0FIP3rcVdIiLPdmsZPDH89cNmfwk4IkVY9g0oNieSOS2affa/qOYLO7ZUACdlTcwFI3zhupIT8gVvD+Inhrwcu+1MUCEPsVT2DSolE8seqZwgLNx8lLIA/11wAHFv+FwK49M/w1wOX/SkqBKJbAOJWLH/p+bMD+UFRVy6WgLtrKgDpX407FcAnXBjAVwx/PXDZn6LEkGKH6hlUSSYSXUJwE6TbXCgBW3YNa11WUwGwhfwhAM8fJewmhr8euOxPUSNM4y+qZ1DBNEwpneTnVc8RVnWUACmkuLrj/e+v/j4Ae28Yd4YQmFnDQZVh+OuBy/4URTFp/0H1DCqkksnHF154TmRXP/wwY+qk70OILwOo+GYTQshvTJ82cSVQw6d44ch/q/ZnVGL464HL/hRZicQjqkdQIWbG/X68bSTNmDLxGkBeDOCNgb9T7AHEwulTJr99O+aqUjF946iTHNt8stqfU4Xhr4fysj8/+VNU/fK222zbcQJ12rQeDcnU1ss/cuFRqueIkvvue6zVSJU+AwcXQsiTATQCyEjgKUPIVU7M/NXMM87Ytf/PWNUcwLbNfxQMf9+EJfzNRuei4V96keFPkRUzrbTtFAJ31VStElbyR6pniJpZs8bvBXDNW/9XkYob6Y5fHN4kgPm1DOY3hr8euOxPtI9lmq+qnsEvMSuWv/SCc3ntfwBUXACSiYZLEIDr/hn+euBuf6K/i1nWE6pn8Esqkbidl/4FQ8UFQAKXeDmIGxj+euBuf6IDCdPqVj2DH0zDkKZpfFH1HFSZivYA9Fx71HAAZ3k8S10Y/nrgsj/RO0lpr1I9gx9S8cTvL2tvH2Q3OumishUAKzYHVW4Y9BPDXw9c9ifq32Xt7W8krFhO9RxeEgASMesLquegylVWACRmezxHzRj+euCyP9HArFjsOdUzeCmZSG655IILNqmegyo3aAGQi2AAmObDLFUr5QS2/YHhrxqX/YkGZ1nmOtUzeCmVSH5P9QxUnUELwN4xY08FMNyHWaoibYEdf4zBzgY4/C2gZSzDnygKDBm7UfUMXonHYtlL28/7heo5qDqDFgBhyyl+DFKtN/9qotAb3BtrGRbQMsaBGVc9Se14zp+ocpfNOfepmBUrqJ7DC42J1G2qZ6DqDV4ABD7gxyDVyO8x0PuatnsSB2WYEi2jgx/+POdPVJ1kPP6s6hncZhqGk3JKvPQvgAbfAwBxqh+DVOPNv1pVPPtIL1z2J4ouwzQWq57BbalEauO8efP2qJ6DqjdgAZDXnhYTwAl+DVOJ3G6B/N5gLv1z2Z8o2uK53P+ahhGqu+TFzNi/q56BajNgku413hgFQKu4Sgd06Z/L/kTU0dFRSMYTL6uewy0xK1a4bM5596meg2ozYAEwIcb6NUglpAQyO0zVY1SNy/5EVBYzrf9TPYNbLNN8U/UMVLuBTwEIaFUAir0GnJLqKaoTlmV/hj+RO2Tc+o5pmAHdxfQOAXtHpv0NcjLdOcKfMSpT6AnWNf9hWfbnOX8i9yyYPbsnFU8+rXoON0jH0f4JsXRoA68AQDT7NUgligG66U+Ylv15zp/IXfFk8hrVM7ghXyq23LJmDUtAQA1YAAzNCoAsBaMAhOWTP5f9ibxx6XkfvjkMDweSUkIU7f9SPQfVZpAVANno1yCVkAG4eCYsn/y57E/krWQydafqGdyQyWWu4CpAMA12Qb1WG1WEpdU47xCmDX9c9ifyVnNj6uowbAYslEpxJ5ffqHoOqt7AKwBS2n4NUgmdP1Vz2Z+IqjFn5sztDcnko6rncENvNnPC4q6V61XPQdUZeA+AEFpd4hFr0LMsh2XZn+FP5K9kzLpKiGDsbRpMbyY9ZXHXit+rnoMqN8h9AGTar0EqkRhiA5r9W+EnfyKqVcf55z+eSqReVj2HW3ozfRNuWr5ig+o5qDKD7AEQO/0ZozJmHIg367MTkJ/8iaheqVTjlZp9rqlLOtt3JlcCgmGwqwDe8GuQSjWN1GNbQpg2/DH8idS5ZPbZ9zYkUy+onsNNvZm+CYuXdz2ieg4a2MArALax3ac5KtY0yoah+HlAYVn256V+RHpoiKc+od35zTr1ZjOnswTobZCrAOzn/RqkUvs+eavbmximZX9e6kekh472czc0phr+onoOt/VmM6fftGw5LxHU1IAFoHXo5pcB5P0ZpXKtx9iwkv4fl8v+ROQVI25dZBiGnpc61SGdy07kSoCeBiwAogM2AO3OTQlTYvhJefh59QyX/YnISwvPP/+ZppDcHfBgvdnM6Yu7VoTingdhMtidACGAJ/wYpFrJoRJD31P05Vhc9iciP5SGtHaE4RkB/enN9I1nCdDLoAXAEXKTH4PUomWcjeajvb0qgMv+ROSXy9vaco2p5L+pnsMrLAF6GbQAwNa3ABR6TMSbBRpHOJ7snzUTQOtYhj8R+efSCy64pjEZnpsDHeytEsD7BGhg0ALQIkc8AUCrOwIC+8I/v8cEACSHAc1jJIyYe/tnEkMkWsc5MGKuvaTveM6fKJhikB+yTFOPm554YN8dA7seUz1H1A2+B+DKx4uAuN+PYSq1f/iXxRokhhwrkRouIQZf1zgkKyXROlaiaaT0dZOh23jOnyi45n/kI6+0pJq/rXoOL6WzmdNYAtSqKCoFsMbrQSrVX/iXCQE0DJcY+i4HjSNkxZcKCkMi0SrRMsZB61gJKxXsK3G47E8UfJfOOW9RYzL1nOo5vJTOZk5bvLzrcdVzRFVFn3EzN7xrdMkpvVLp93tloPA/FMcGSlkBOw+nAcd4AAAI+klEQVTIEiAlIAEY5r5nC5jJfbv7A/xh/wDlZX9+8icKvttW3DO6N7fnhaJdCvDJyME1NzQ+tnDe3NNVzxE1Fedez6/HPgSJyV4OM5Bawj9q+MmfKHxuW73mo7t79/yflMFemRxMc6rhDwsvnHea6jmipOKz5QLiZi8HGQjDf3AMf6JwurR99h0tqSZl779+6c1mPri4a8UfVM8RJRUXgGLJuA0SWS+H6Q/Df3AMf6JwWzDvgoVh3w8AAL2Zvg+wBPin4gIw7MoX90JgmZfDHIzhPzhe6kcUDfF4bHIiFu9TPYfXWAL8U9UFc46BH3s1yMEY/oPjpX5E0XFZe/sbQ1pbxsdMy597oCtULgFSyjou6qbBVPWXO+STr/wBwO+8GeXvGP6D47I/UfR89Jxz/tLc1DrPDOFTAw/Wm+n7wM1dK55mCfBO1X+xUuAHXgxSxvAfHJf9iaLr0vM/fFdrU8s/h+XS5YH0ZjMnsAR4p+q/1NZPvXI3PFoFYPgPjsv+RHRp+3k/bWlq+iFLANWjpr9QaYivYd/9dFzD8B8cl/2JqGzBnDlfaW1s/nFUSsBNXSueYQlwV01/ma2ffPn3AFa6NQTDf3Bc9ieig82fe8G/tDY2Xh/oB5dUqC+beR9LgLtq/oss2ebn4cJTAhn+g+OyPxEdyvy5cz/Tmmq8SfUcfujLZt63ePnKP7IEuKPmv8RhV774KiD/s56DM/wHx2V/IhrMgnlzPjG0oeW7IgIrAelc38lcCXBHXX+BzfbhPxYSNd2wgeE/OC77E1GlLpvX/vWWpqYvGBG4RHDf6YCVz7IE1Kfuurj3+lHvFjD/CKCp0p9h+A+On/yJqBa3rrrr0p6+nltsxwl9ODYlU88svHDeKUIIR/UsQeTKelHv9eOulJC/rOR7C3tN5Pcy/AfC8CeienTeeedpPZnMA/lisVH1LF5rTDX+5eWhrSctamsrqZ4laFw7YdT767G3SolLB/oehv/gysv+3PBHRPW4Zc2allI2/3hfLvNu1bN4jSWgNq4VAHnjuGSv7TwAiAn9fZ3hPzh+8icit926ctXNe/rSC6QM99aAplTqry8NHXoiS0DlXN0ymrnu6FElYT0C4Mj9f5/hPzh+8icir9x255pP9qZ7f1m0SzHVs3iJJaA6rl8zkr5x1EmObf4OwDCA4V8JfvInIq/dtHr10TJfWN+Xzx2jehYvsQRUzvVdok2Xb3kaDtoB9EECIV91qpthSTvWbM9l+BORlz7e3v7aJz76kWOHNDX/KsxPE0xns8cf8+buJ1TPEQSe3TUifcOYmY4jVgBoLPaayO3mKsDBjBhKsYb8h4d/8dV1qmchoujovPPO0/ryhVWZXPYo1bN4paWxadXH5s6Zo3oOnXl626ieX42dDAN3ARhS6jOQe9PiisBbzLgsxJudGcM+/+IG1bMQUTTd2rX6O735vq+UbDt0n9CEEBjePHRqR/u5fI89BE9vFNFyxSsPG8L4EIBtVqOD5OEliNDfmmJwVlL2mCnnJIY/Eal02bz2rw+PxUY3pxoeDdtNhKWUyBZz/6N6Dp358t955rqjR9nCWiGB06QNZHfGYBfC9j+3wQkBxFvt56xk6YwhV726W/U8RERlnavvntJXyN2cyWXGqZ7FLZZlla68+OJQX/lQD99SWHaOSqV7zV/vu1mQQGGvEamrA4QpkRxqLxn65kufEIvA3alEpKXb7vrtx/oyvT/JFwpDVc/ihlFHHDFyzsyZ21XPoSPfP4bv/fWYhUKKXwBoKmUN5HebcEohXg0QQKzBKSYai59qvfrVm1WPQ0RUidtWr74smy98P5vPjVI9Sz0ObxjygY555/GqgH4oSd6ea8e9V5jyFgmcBrnv4UCFHjN0GwQNSyI5xH400WR8pOGTL2xWPQ8RUbWWrrzzolwxf01fPjdG9Sy1aE4NP2LhhefsUD2HjpR99JaLYPWOGvvPABYBaHRKArk3Ldi5EKwGGBLxJicXa5H/NOSKl65TPQ4RUb2Wrrr79IKd/0E2n5salKsGYpZVvOLii+Oq59CV8rR989pjx1iG/T8QmAcApaxAYa8VzE2CBhBvsmW8sbTYSMS/3PzJ53eqHomIyE2dnZ3xUiy1KGfnP5UrFEbo/IyB5obGRxbOm3uG6jl0pU3K7rtngPwuIKYBgJ03UNhroJTT/7pBYUrEmxzEmpx7DdP+YvOnNz+jeiYiIq8tXbPmXcVC8ZuFYvH8XCE/TPU8+zOEwNCmoRMuueDcR1XPoittCkDZ3l+NO0eY8iuQmA4ATsFAIS1QypiQjurpDmTGJWJNtoyl5GrHcP5jyGdefVz1TEREKnSuWXNCIV/8StGxp+cLhVG2YyvNl9bG5tsXzL3gEpUz6E67AlCW/tW4Ux1D/guAiwAkpQTsnIFixkApYwCKVp2EJRFrcGA1yh4rLn8DR/6y+TOv/FnNNERE+uns7Iw78dT8vLTnl0rFUwql0mGO4/iWN02pxoc+fuHcKX4dL6i0LQBlu28cN8R0nIsgxUIAZwIQ0tl3iqCUN+BkBeyid38MYUqYCQkrIWEm7ZIRw1pALG1uKXWKji1Zzw5MRBQit668a5YNZ55jlybZtj266NitpVLJcvMYlmnZTcnUT+fPveBf3HzdsNK+AOwvc9Ooo0slYzakmA1gFoBGAJCOgJ0XcIqAUzL2/WdRQFZROIXYF/ZGDDBiDgwLMOIOzLjcCYEH4Ig1UpRWtn56y5se/fGIiCKlq6trSM5KzHTs0ngp5LGOI0dK6YywbTnEkU6jBAzpODEIwHEcE/sySxqGYQOAEKIkIEqWaW2PWdZdMmZ+c8Hs2T1q/1TBEagCsD957WmxvdaOU4Q0JgrgDEhxCoR8D4Dk29/k7CsHjvP3XzuOgBAABGAYct/TEARgmAAgcwCeAfCEkHhCwFjf+OmXnhZC1QkHIiIibwS2APRHLoKxZ+y4MTHpvNu2MRIChwFiuCFlkzSMhr9/o+wRkL0OjF5AbheQr1jSfiXV+tpW0QFb4R+BiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIou3/ByYknLYCUNPLAAAAAElFTkSuQmCC"
                        style="height: 24px;width: 24px;   opacity: inherit;" / />
                    <span style="margin: 0px 5px;" changelang="settings"></span>
                    <i class="fa fa-angle-left pull-right rotate fa-rotate-90"></i>
                </a>
            </section>
        </aside>
        </div>
    <div class="content-wrapper" style="background-color: #f7f7f7">
        <section class="content-header" style="display: block; padding-top: 5px !important;">
            <h1 id="page-header" class="page-header" style="pointer-events: none; border-bottom: 0px;">
                <span class="fa fa-angle-double-left"></span><b
                    style="font-size: 14px; font-weight: normal; margin: 0px 5px;" changelang="designdash"></b>
            </h1>
        </section>
    </div>
    <div class="main-content" style="overflow: auto;">
        <section id="content"></section>
    </div>
    <footer class="main-footer" id="#footer">
        <div class="row">
            <%if (SessionProvider.UserDirection == "RTL")
                {%>
            <div class="pull-right"><span><a href="https://amnpardaz.com" id="copyRightLabel" target="_blank"><%=ApplicationProvider.CopyRightStatement %></a></span></div>
            <div class="pull-left" style="position: absolute; left: 15px;">&nbsp;<span id="versionLabel"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span></div>
            <%}
                else
                {%>
            <div class="pull-left col-md-11"><span><a href="https://amnpardaz.com" id="copyRightLabel" target="_blank"><%=ApplicationProvider.CopyRightStatement %></a></span></div>
            <div class="pull-right col-md-1">&nbsp;<span id="versionLabel"><%=LocalizationProvider.Version %> <%=ApplicationProvider.PackageVersion %></span></div>
            <%} %>
        </div>
    </footer>

    <!-- Theme style -->
    <link rel="stylesheet" href="../App_Res/Themes/<%=ApplicationProvider.AppThemeName %>/Designer.css" />
    <script type="text/javascript" src="../App_Sys/Interface/Page.js"></script>

    <script type="text/javascript">
        var $$Lang = _Lang;
        var $$Dir = _Lang;
        var $$Currency = 'ریال';

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
        var $$PackageName = '<%=ApplicationProvider.PackageName%>'

</script>

    <!-- jQuery -->
    <script type="text/javascript" src="../App_Base/Js/Jquery/Jquery.js"></script>
    <script src="../App_Base/Js/Jquery/Select2.Min.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/BlockUI.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Redirect.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Knob.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Excel.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/Print.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Jquery/AutoComplete.js"></script>
    <script type="text/javascript" src="../App_Base/Js/SweetAlert/SweetAlert.Min.js"></script>
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
    <%--Highcharts--%>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/Highcharts.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/Highcharts-3d.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/Highcharts-more.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/Exporting.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/ExportData.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/Accessibility.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Highcharts/SeriesLabel.js"></script>
    <!-- Bootstrap -->
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Bootstrap.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/DataTable/DataTables.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Select/Select.js"></script>
    <script type="text/javascript" src="../App_Base/Js/Bootstrap/Select/Select.Ajax.js"></script>
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
    <!-- Sys App -->
    <script type="text/javascript" src="../App_Sys/Interface/Gui.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Gui.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/GridView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/TimeLineView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/FormView.js"></script>
    <script type="text/javascript" src="../App_Sys/Interface/Components/GadgetView.js"></script>
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
    <script type="text/javascript" src="../App_Sys/Membership/Membership.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Md5.js"></script>
    <script type="text/javascript" src="../App_Sys/Membership/Sha1.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Data.js"></script>
    <script type="text/javascript" src="../App_Sys/Activity/Activity.Executor.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ReportDesigner/Js/Bootstrap.js"></script>
    <script type="text/javascript"  src="../App_Base/Js/Canvas/Html2Canvas.Min.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ReportDesigner/Js/Moment.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ReportDesigner/Js/JqueryExtendext.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ReportDesigner/Js/Select.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ReportDesigner/Js/PersianDateTimePicker.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ReportDesigner/Js/Jalaali.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ReportDesigner/Js/Designer.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ReportDesigner/Js/Master.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ReportDesigner/Js/Actions.js"></script>
    <!-- Sys DashboardDesigner-->
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/DashboardView.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/Sidebar.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/Actions.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/Accesses.js"></script>
    <script type="text/javascript"  src="../App_Base/Js/Deflate/Base64.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/Designer.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ChartView.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ChartEdit.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ChartSeries.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/Icons.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ReportDesigner/Js/QueryBuilder.Standalone.js"></script>
    <script type="text/javascript"  src="../App_Sys/Admin/Dashboard/ChartQuery.js"></script>

    <script type="text/javascript">

        setRequestToken('<%=SessionProvider.GenRequestToken()%>');

        //for not drag an other elements(Z.B) tooblar text
        $('body').on('dragstart', (e) => {
            if ($(e.target).prop('draggable') == true) {
                $ALLOW_DROP_TRUE = true
            } else {
                $ALLOW_DROP_TRUE = false
            }
        });


        var _pageKey = '<%=Request["objKey"]%>'
        var id = '<%=Request["id"]%>'

        var _dashboard = new ddData(id, _pageKey);
        var designJson = _dashboard.getObject();
        renderDesigner(designJson);


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
                return false; // Or e.preventDefault()
            }
        });


        ResourceFunct();
        ChangeLang();
        </script>

</body>
</html>
