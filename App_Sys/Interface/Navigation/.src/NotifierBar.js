// JScript File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.0.0.0

function notifierBar(notifierBarObj) {

    var _navigationID = notifierBarObj.NavigationID;

    var _menuItems;

    this.renderContext = function (notifierID) {

        _menuItems = filterList($$Page.menuItems, 'NavigationID', _navigationID);

        try {

            $.each(_menuItems, function (index, menuItem) {

                $('#' + notifierID).prepend('<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" onclick="' + menuItem.Action + '"> <i class="fa fa-style-m ' + menuItem.Icon + '"></i> <span class="label ' + menuItem.BadgeStyle + '">' + menuItem.Label + '</span></a> </li>');

            });
        } catch (e) {

            raiseError(e, notifierID);

            return;
        }
    }
}