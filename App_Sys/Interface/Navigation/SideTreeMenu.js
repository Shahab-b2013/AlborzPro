// JScript File(Amnpardaz Software Co. Copyright 2022 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.0.0.0

function sideTreeMenu(sideTreeMenuObj) {

    var _navigationID = sideTreeMenuObj.NavigationID;

    var _menuItems;

    this.renderContext = function (sideMenuID) {

        _menuItems = filterList($$Page.menuItems, 'NavigationID', _navigationID);

        var firstItems = filterList(_menuItems, 'ParentMenuItemID', '');

        $('#' + sideMenuID).html('');

        try {

            $.each(firstItems, function (index, menuItem) {

                //menuItem.Action = menuItem.Action.replace(/"/g, '&quot;');

                $('#' + sideMenuID).append('<li id="menuItem-' + sideMenuID + '-' + menuItem.MenuItemID + '"><a  style="cursor:pointer" id="a-'
                    + sideMenuID + '-' + menuItem.MenuItemID + '" onclick="' + menuItem.Action + '"><img style="padding:0 5px" src="App_Res/Images/Menu/24/'
                    + menuItem.Icon + '"/><span>&nbsp;&nbsp;&nbsp;' + menuItem.Label + '</span></a></li>');

                if (menuItem.Action.indexOf("redirectPage") > -1) {

                    $('#a-' + sideMenuID + '-' + menuItem.MenuItemID).contextMenu([[{

                        text: "Open link in new tab",

                        action: function () {

                            var inlineFunction = new Function(menuItem.Action.replace('redirectPage', 'openPopupPage'));

                            inlineFunction();
                        }
                    }]]);
                }

                renderSubMenu(sideMenuID, menuItem.MenuItemID);
            });
        } catch (e) {

            raiseError(e, sideMenuID);

            return;
        }
    }

    renderSubMenu = function (sideMenuID, treeMenuItemID) {

        var childItems = filterList(_menuItems, 'ParentMenuItemID', treeMenuItemID);

        $('#menuItem-' + sideMenuID + '-' + treeMenuItemID).append('<ul id="menuBody-' + sideMenuID + '-' + treeMenuItemID + '" class="treeview-menu"></ul>');

        if (childItems.length > 0) {

            $('#a-' + sideMenuID + '-' + treeMenuItemID).append(`<i class="fa ${$$Lang=="Fa"?"fa-angle-left":"fa-angle-right"} pull-right"></i>`);
        }

        $.each(childItems, function (index, childItem) {

            //childItem.Action = childItem.Action.replace(/"/g, '&quot;')

            $('#menuBody-' + sideMenuID + '-' + treeMenuItemID).append('<li class="treeview" id="menuItem-' + sideMenuID + '-' + childItem.MenuItemID
                + '"><a  style="cursor:pointer" id="a-' + sideMenuID + '-' + childItem.MenuItemID + '" onclick="' + childItem.Action + '"><i class="fa '
                + childItem.Icon + '"></i><span>' + childItem.Label + '</span></a></li>');

            if (childItem.Action.indexOf("redirectPage") > -1) {

                childItem.Action = childItem.Action.replace(/}/g, '');

                childItem.Action = childItem.Action.replace(/{ TargetContext : /g, '');

                $('#a-' + sideMenuID + '-' + childItem.MenuItemID).contextMenu([[{

                    text: "Open New Tab",

                    action: function () {

                        var inlineFunction = new Function(childItem.Action.replace('redirectPage', 'openPopupPage'));

                        inlineFunction();
                    }
                }]]);
            }

            renderSubMenu(sideMenuID, childItem.MenuItemID);



        });
    }

    // updateUserInfo();
}

// function updateUserInfo() {
//     $('#userInfo a').empty();
//     $.ajax({
//         type: "POST",
//         url: "App_Sys/Services/CustomActivity.asmx/GetUserPosition",
//         contentType: "application/json; charset=utf-8",
//         dataType: "json",
//         success: function (p) {
//             $('#userHeader span').text(p.d);
//             var positionLess = p.d.length > 35 ? p.d.substring(0, 35) + "..." : p.d;
//             var displayTooltipPosition = p.d.length > 20 ? "" : 'style="display: none; ';
//             var position = '<div class="positionUserInfo m-1"><i class="fa fa-circle"></i><span class="labelUserInfo m-1">سمت سازمانی :</span><span class="valueUserInfo">' + positionLess
//                 + '</span><span ' + displayTooltipPosition + ' class="tooltipPositionUserInfo">&nbsp;&nbsp;&nbsp;' + p.d + '&nbsp;&nbsp;&nbsp;</span></div>';
//             $('#userInfo a').append(position);
//             $.ajax({
//                 type: "POST",
//                 url: "App_Sys/Services/CustomActivity.asmx/GetUserDeparment",
//                 contentType: "application/json; charset=utf-8",
//                 dataType: "json",
//                 success: function (d) {
//                     var dispalyDepartment = d.d == "مدیرعامل" ? 'style="display:none"' : "";
//                     var departmentHTML = '<div ' + dispalyDepartment + ' class="deparmentUserInfo"><i class="fa fa-circle"></i><span class="labelUserInfo m-1">واحد سازمانی :</span>';
//                     var departmentParts = d.d.split("-");
//                     departmentParts.forEach(function (part, index) {
//                         var departmentLess = part.length > 40 ? part.substring(0, 40) + "..." : part;
//                         var marginRow = index === 0 ? 10 : index === 1 ? 20 : 30;
//                         departmentHTML += '<span style="margin:10px 20px 10px;margin-right:' + marginRow + 'px" class="valueUserInfo"><i class="fa fa-chevron-left"></i>'
//                             + departmentLess.trim() + '</span>';
//                     });
//                     departmentHTML += '<span class="tooltipDepartmentUserInfo">&nbsp;&nbsp;&nbsp;' + d.d + '&nbsp;&nbsp;&nbsp;</span></div>';

//                     $('#userInfo a').append(departmentHTML);
//                     $.ajax({
//                         type: "POST",
//                         url: "App_Sys/Services/CustomActivity.asmx/GetUserWorkingProfile",
//                         contentType: "application/json; charset=utf-8",
//                         dataType: "json",
//                         success: function (w) {
//                             var workingProfileHTML =
//                                 '<div class="workingProfileUserInfo m-1"><i class="fa fa-circle"></i><span class="labelUserInfo m-1">پروفایل کاری :</span>';
//                             workingProfileHTML += '<span class="valueUserInfo"> ' + w.d + '</span>';
//                             $('#userInfo a').append(workingProfileHTML);
//                             $.ajax({
//                                 type: "POST",
//                                 url: "App_Sys/Services/CustomActivity.asmx/GetUserLeaveBalance",
//                                 contentType: "application/json; charset=utf-8",
//                                 dataType: "json",
//                                 success: function (l) {
//                                     var leaveBlalanceParts = l.d.split(",");
//                                     var leaveBlalanceHTML = '';
//                                     leaveBlalanceParts.forEach(function (part, index) {
//                                         var numberValue = part.includes('-') ? minutesToTime(part.replace('-', '')) + "-" : minutesToTime(part);
//                                         var title = index === 0 ? 'مانده مرخصی' : 'مانده مرخصی تا پایان سال';
//                                         leaveBlalanceHTML += '<div style="display:none" class="workingProfileUserInfo m-1"><i class="fa fa-circle"></i><span class="labelUserInfo m-1">'
//                                             + title + ' :</span>' +
//                                             '<span class="valueUserInfo"> ' + numberValue + '</span>';
//                                     });
//                                     $('#userInfo a').append(leaveBlalanceHTML);
//                                 },
//                                 error: function (xhr, status, error) {
//                                     console.error(error);
//                                     alert("An error occurred while getting deparment.");
//                                 },
//                             });
//                         },
//                         error: function (xhr, status, error) {
//                             console.error(error);
//                             alert("An error occurred while getting deparment.");
//                         },
//                     });
//                 },
//                 error: function (xhr, status, error) {
//                     console.error(error);
//                     alert("An error occurred while getting deparment.");
//                 },
//             });
//         },
//         error: function (xhr, status, error) {
//             console.error(error);
//             alert("An error occurred while getting positions.");
//         },
//     });
// }
