// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.2.1.0

function topMenuBar(softMenuBarObj) {

    var _navigationID = softMenuBarObj.NavigationID;

    var _menuItems;

    this.renderContext = function (softMenuID) {
        softMenuID = 'headerMenuBar';
        _menuItems = filterList($$Page.menuItems, 'NavigationID', _navigationID);

        $('#' + softMenuID).html('');

        try {

	   var added=true;

            $.each(_menuItems, function (index, menuItem) {

                //menuItem.Action = menuItem.Action.replace(/"/g, '&quot;');

                 added = true;

                if (menuItem.Name == 'MyView' && $$UserProp.MasterRole.indexOf('پرسنل سازمان') > -1)
                    added = false;

                if (menuItem.Name == 'MyView2' && $$UserProp.MasterRole.indexOf('پرسنل سازمان') == -1)
                    added = false;

		if (added)
                	$('#' + softMenuID).append('<li><a style="cursor:pointer;" id="' + softMenuID + '-' + index + '" onclick="' + menuItem.Action +
                  	  '"><span class="circleMenu"><i class="fa fa-solid fa-' + menuItem.Icon + '"></i></span> <span>' + menuItem.Label + '</span></a> </li>');

                var action = menuItem.Action.replace(/}/g, '');

                action = action.replace(/{ TargetContext : /g, '');

                $('#' + softMenuID + '-' + index).contextMenu([[{

                    text: "Open New Tab",

                    action: function () {

                        var inlineFunction = new Function(action.replace('redirectPage', 'openPopupPage'));

                        inlineFunction();
                    }
                }]]);

            });
        }
        catch (e) {

            raiseError(e, softMenuID);

            return;
        }
    }
}

