// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.2.1.0

function headerMenuBar(topMenuBarObj) {

    var _navigationID = topMenuBarObj.NavigationID;

    var _menuItems;

    this.renderContext = function (topMenuID) {

        _menuItems = filterList($$Page.menuItems, 'NavigationID', _navigationID);

        _shortcutItems = $$Page.shortcutItems;

        _reportItems = $$Page.reportItems;

        $('#' + topMenuID).html('');

        try {

          var added = true;

            $.each(_menuItems, function (index, menuItem) {

                if (added)
                    $('#' + topMenuID).append('<li  id=' + menuItem.Name + ' class="dropdown"><a  style="cursor:pointer" onclick="' + menuItem.Action + '" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-style-m ' + menuItem.Icon + '"></i>&nbsp;<span>' + menuItem.Label + '</span></a></li>');//<ul id=' + menuItem.Name + ' class="dropdown-menu"></ul>

            });

            $.each(_shortcutItems, function (index, menuItem) {

                added = true;

                if (menuItem.Name == 'MyView' && $$UserProp.MasterRole.indexOf('پرسنل سازمان') > -1)
                    added = false;

                if (menuItem.Name == 'MyView2' && $$UserProp.MasterRole.indexOf('پرسنل سازمان') == -1)
                    added = false;

                if (added)
                    $('#Menu').append('<li><a  style="cursor:pointer" onclick="' + menuItem.Action + '"><img src="App_Res/Images/Menu/16/Form.png"/>&nbsp;' + menuItem.Label + '</a></li>');
            });

            $.each(_reportItems, function (index, menuItem) {

                $('#ReportMenu').append('<li><a  style="cursor:pointer" onclick="' + menuItem.Action + '"><img src="App_Res/Images/Menu/16/Report.png"/>&nbsp;' + menuItem.Label + '</a></li>');
            });

            if ($$Lang == 'Fa') {
                $('#HelpLink').append('<li><a href="https://amnpardaz.com/" target="_blank"><img src="App_Res/Images/Menu/16/Company.png"/>&nbsp;وب سایت شرکت</a></li>')

                $('#HelpLink').append('<li><a href="https://www.amnpardaz.com/types.php/fa/186/%D9%BE%D8%B4%D8%AA%DB%8C%D8%A8%D8%A7%D9%86%DB%8C" target="_blank"><img src="App_Res/Images/Menu/16/HomePage.png"/>&nbsp;صفحه پشتیبانی</a></li>')
            }

        } catch (e) {

            raiseError(e, topMenuID);

            return;
        }
    }
}