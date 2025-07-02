// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
/* Release Ferdos.WebAppDesk 4.2.0.0*/

var currentYearGadget; // year number of my performance 
var currentMonthGadget; // month of my performance
var allData; // all data from dev activity
var performanceDaily; // list of daily performance
var titleClicked; // title clicked from my performance gadgets
var titleLabel; // title label of my performance gadgets
var gadgetItemValue; // data field value of my performance gadgets
var dayFormatData = ['Val000', 'Val002', 'Val011', 'Val012', 'Val013', 'Val022'];
var timeFormatData = ['Val001', 'Val003', 'Val004', 'Val005', 'Val006', 'Val007', 'Val008',
    'Val009', 'Val010', 'Val014', 'Val015', 'Val016', 'Val018', 'Val020', 'Val021'];
var dayFormat = 'روز';
var forbiddenDataFieldValues = ['Val005', 'Val006', 'Val017', 'Val019', 'Val020', 'Val011', 'Val012', 'Val013']//['Val004', 'Val006', 'Val008', 'Val010', 'Val021'];
//'Val005','Val007','Val009', 'Val006', 'Val008', 'Val010', 'Val017', 'Val019', 'Val020','Val011','Val012','Val013'

function gadgetView(id, objKey) {

    var _actContextID = id;

    var _objKey = objKey;

    var _gadgetItems;

    var _data;

    this.renderContext = function (pageElementID) {

        var bodyID = '#box-body-' + pageElementID;

        var boxID = '#page-box-' + pageElementID;

        //#region Load Gadget Metadata

        cache = localStorage.getItem(window.btoa("gadget$" + _actContextID));

        if (!cache || parseInt(pageElementID) == 1000604 || true) { //Dashboar TabView should not be cached

            _gadget = new iComData('gadget', _actContextID, _objKey, null);

            _gadget = _gadget.getData();

            localStorage.setItem(window.btoa("gadget$" + _actContextID), reverse(encodeURI(JSON.stringify(_gadget))));
        } else {

            _gadget = jQuery.parseJSON(decodeURI(reverse(cache)));
        }

        _gadgetOptions = _gadget.options;

        _gadgetItems = _gadget.items;

        if (_gadgetOptions.DataFieldName != '') {

            _data = new aData(_gadgetOptions.ActivityID, null, _objKey, '');

            if (_data.getError() != null) {

                raiseError(_data.getError(), bodyID);

                return;
            }

            _data = _data.getList();
        }
        if (_gadgetOptions.ActivityID === 1215052) {

            allData = _data;
            _data = _data.at(-1);
            currentYearGadget = parseInt(_data.Year);
            currentMonthGadget = parseInt(_data.Month);
            var data2 = [];
            $.each(_gadgetItems, function (index, gadgetItem) {
                // Create a new object with Label and Value properties
                data2.push({
                    Label: gadgetItem.Label,
                    Total: _data[gadgetItem.DataFieldValue]
                });
            });
            _data = data2;
        }
        //#endregion

        $(boxID + ' .box-title').html(_gadgetOptions.Label);

        //#region Render Gadget Layout

        $(boxID).css('margin-bottom', '0px');

        $(bodyID).html('');

        if (_gadgetOptions.ViewMode == 'InfoView') {

            $(bodyID).append('<div class="row" id="div-' + pageElementID + '"></div>');
        } else
            if (_gadgetOptions.ViewMode == 'TabView') {

                $(bodyID).append('<ul class="nav nav-tabs" id="ul-' + pageElementID + '"></ul>');
            } else {

                if (_gadgetOptions.ColumnLayout == 'Default') {

                    $(bodyID).append('<ul class="nav  nav-pills nav-stacked" id="ul-' + pageElementID + '-0"></ul>');
                }

                if (_gadgetOptions.ColumnLayout == 'TwoColumn') {

                    $(bodyID).append('<div class="row"><ul class="nav  nav-pills nav-stacked col-md-6" id="ul-' + pageElementID + '-0"></ul>' +
                        '<ul class="nav  nav-pills nav-stacked col-md-6" id="ul-' + pageElementID + '-1"></ul></div>');
                }

                if (_gadgetOptions.ColumnLayout == 'ThreeColumn') {

                    $(bodyID).append('<div class="row"><ul class="nav  nav-pills nav-stacked col-md-4" id="ul-' + pageElementID + '-0"></ul>' +
                        '<ul class="nav  nav-pills nav-stacked col-md-4" id="ul-' + pageElementID + '-1"></ul>' +
                        '<ul class="nav  nav-pills nav-stacked col-md-4" id="ul-' + pageElementID + '-2"></ul></div>');
                }

                if (_gadgetOptions.ColumnLayout == 'FourColumn') {

                    $(bodyID).append('<div class="row"><ul class="nav  nav-pills nav-stacked col-md-3" id="ul-' + pageElementID + '-0"></ul>' +
                        '<ul class="nav  nav-pills nav-stacked col-md-3" id="ul-' + pageElementID + '-1"></ul>' +
                        '<ul class="nav  nav-pills nav-stacked col-md-3" id="ul-' + pageElementID + '-2"></ul>' +
                        '<ul class="nav  nav-pills nav-stacked col-md-3" id="ul-' + pageElementID + '-3"></ul></div>');
                }
            }
        function loadGadgetsPerformanceList() {
            $.each(_gadgetItems, function (index, gadgetItem) {
                var matchingData = _data.find(function (item) {
                    return item.Label === gadgetItem.Label;
                });
                var associatedData;
                if (gadgetItem.DataFieldValue === "CountIssueIncompleteData") {
                    var dailyPerformance = new aData(1215053, null, 0, "");
                    var listDataDailyPerformance = dailyPerformance.getList();
                    var month = convertMonthNameToNumber($('#month-name').text());
                    var year = parseInt($('#year-number').text());
                    listDataDailyPerformance = listDataDailyPerformance.filter((item) => {
                        return item.Month === month.toString() && item.Year === year.toString() && item.IssueTypes === "IncompleteData";
                    });
                    associatedData = listDataDailyPerformance.length + " روز";
                }
                else {
                    associatedData = (matchingData.Total < 0) ? 0 : matchingData.Total;
                }
                var ulSelector = '#ul-' + pageElementID + '-' + gadgetItem.RowIndex;
                var $ul = $(ulSelector);
                var displayStyle = 'flex';
                if ($('.togglePerformance').hasClass('fa-toggle-off') && forbiddenDataFieldValues.includes(gadgetItem.DataFieldValue)) {
                    displayStyle = 'none';
                } else if ($('.togglePerformance').hasClass('fa-toggle-on') && forbiddenDataFieldValues.includes(gadgetItem.DataFieldValue)) {
                    displayStyle = 'flex';
                }
                if (gadgetItem.DataFieldValue === "CountIssues") {
                    $ul.append('<div style="border-color:#ff8100" class="card-body card backgroundCard load-more-item" id="tool-item-' + gadgetItem.GadgetItemID
                        + '" data-index="' + index + '"><a style="color:#000;cursor: pointer;" style="cursor:pointer" class="cardDetail cardNumber col-md-12 ' +
                        gadgetItem.StyleClass + '"><div class="d-flex label-icon-card"><span id="associatedDataCountIssues" class="font-large borderNone ' + gadgetItem.DataFieldValue +
                        '" style="direction:rtl;font-family:var(--yekanFont);" >' + associatedData + ' مورد</span></div>' +
                        '<div class="d-flex align-items-center"><p style="margin-bottom:0;text-align:right" class="font-16 mr-2 textLink ">'
                        + gadgetItem.Label + '</p><i class="fa fa-solid fa-exclamation-circle issueGadgetIcon"></i></div></a></div>');
                }
                else {
                    $ul.append('<div style="display:' + displayStyle + '" class="card-body card backgroundCard load-more-item" id="tool-item-' + gadgetItem.GadgetItemID
                        + '" data-index="' + index + '"><a style="cursor:pointer" class="cardDetail cardNumber col-md-12 ' +
                        gadgetItem.StyleClass + '"><div class="d-flex label-icon-card"><span class="font-large borderNone ' + gadgetItem.DataFieldValue +
                        '" style="direction:rtl;font-family:var(--yekanFont);" id="data-' + index + '">' + associatedData
                        + ' </span></div><div class="d-flex align-items-center"><p style="margin-bottom:0" class="font-16 mr-2 textLink ">'
                        + gadgetItem.Label + '</p></div></a></div>');
                }

                if (dayFormatData.includes(gadgetItem.DataFieldValue)) {
                    associatedData = associatedData + ' ' + dayFormat;
                    $('#data-' + index).text(associatedData);
                }
                else if (timeFormatData.includes(gadgetItem.DataFieldValue)) {
                    associatedData = minutesToTime(parseInt(associatedData));
                    $('#data-' + index).text(associatedData);
                }
                $('#tool-item-' + gadgetItem.GadgetItemID).on('click', function () {
                    titleClicked = gadgetItem.DataFieldValue;
                    titleLabel = gadgetItem.Label;
                    gadgetItemValue = associatedData;
                });
                if (gadgetItem.ActionOnClick.indexOf("(") > -1) {
                    $('#tool-item-' + gadgetItem.GadgetItemID).attr("onclick", gadgetItem.ActionOnClick);
                }
            });
        }

        if (_gadgetOptions.ActivityID === 1215052) {
            function updateData() {
                _data = allData.find(function (item) {
                    return item.Year == currentYearGadget && item.Month == currentMonthGadget;
                });

                if (_data) {
                    $('.card-body').remove();
                    $('#emptyMessageListPerformance p').remove();
                    currentYearGadget = parseInt(_data.Year);
                    currentMonthGadget = parseInt(_data.Month);
                    var data2 = [];
                    $.each(_gadgetItems, function (index, gadgetItem) {
                        data2.push({
                            Label: gadgetItem.Label,
                            Total: _data[gadgetItem.DataFieldValue]
                        });
                    });
                    _data = data2;
                    loadGadgetsPerformanceList();
                    updateMonthName();
                    updateYearNumber();
                } else {
                    updateMonthName();
                    updateYearNumber();
                    $('.card-body').remove();
                    if ($('#emptyMessageListPerformance p').length === 0) {
                        $('#emptyMessageListPerformance').append('<p style="text-align:center;">هیچ اطلاعاتی جهت نمایش موجود نیست !</p>');
                    }
                }
            }

            $('.nav-stacked').append('<div class="listPerformance"><div class="headerTable"><span class="navigateSpan leftNavigate"><i class=" fa fa-solid fa-caret-right"></i></span>'
                + '<div><span class="m-1" id="month-name"></span><span id="year-number"></span></div>'
                + '<div class="d-flex align-items-center"><span class="fa fa-toggle-off m-1 togglePerformance"></span><span class="navigateSpan rightNavigate"><i class="fa fa-solid fa-caret-left"></i></span></div></div>'
                + '</div></div><div id="emptyMessageListPerformance"></div>');

            updateMonthName();
            updateYearNumber();
            $('.leftNavigate').on('click', function () {
                currentMonthGadget -= 1;

                if (currentMonthGadget < 1) {
                    currentMonthGadget = 12;
                    currentYearGadget -= 1;
                }
                updateData();

            });

            $('.rightNavigate').on('click', function () {
                currentMonthGadget += 1;
                if (currentMonthGadget > 12) {
                    currentMonthGadget = 1;
                    currentYearGadget += 1;
                }
                updateData();
            });

            $('.togglePerformance').on('click', function () {
                $(this).toggleClass('fa-toggle-off fa-toggle-on');
                $.each(_gadgetItems, function (index, gadgetItem) {
                    var $toolItem = $('#tool-item-' + gadgetItem.GadgetItemID);
                    if (forbiddenDataFieldValues.includes(gadgetItem.DataFieldValue)) {
                        if ($('.togglePerformance').hasClass('fa-toggle-off')) {
                            $toolItem.css('display', 'none');
                        } else {
                            $toolItem.css('display', 'flex');
                        }
                    }
                });
            });

        }
        //#endregion

        //#region Calculate "Other" Value

        var sumTotal = 0;

        if (_gadgetOptions.DataFieldName != '') {

            $.each(_data, function (index, dataItem) {

                sumTotal = sumTotal + parseInt(dataItem[_gadgetOptions.IndicatorFieldName]);
            });
        }

        //#endregion

        //#region Render Gadget Items
        var pageKartablMan = $('#page-row-100100000').length === 1 ? true : false;
        var pageMizKarMan = $('#page-row-100100100').length === 1 ? true : false;
        var pageSavabeghKartabl = $('#page-row-100100300').length === 1 ? true : false;
        var conditionUseFoldIcon = false;
        if (pageKartablMan || pageSavabeghKartabl) {
            conditionUseFoldIcon = true;
        }
        if (pageMizKarMan || pageKartablMan || pageSavabeghKartabl) {
            var GroupItem = [];
            var gadgetItemMap = {};
            var iconGadgetSmall;
            var iconActivity;
            var iconCLose;
            var iconActivityFill;
            var iconGadgetSmallFill;
            var iconCloseFill;

            if (pageElementID === 100100103) {
                iconGadgetSmall = 'plus';
                iconActivity = 'plus';
                iconCLose = 'minus'

            }
            else if (conditionUseFoldIcon) {
                iconActivity = 'folder-o';
                iconCLose = 'folder-open-o'
                iconActivityFill = 'folder';
                iconGadgetSmallFill = 'folder';
                iconGadgetSmall = 'folder-o';
                iconCloseFill = 'folder-open'
            }
            else {
                iconGadgetSmall = 'th-list'
                iconActivity = 'th-list'
                iconCLose = 'minus'
            }
            var backgroundColorEmptyIcons = conditionUseFoldIcon ? "gadgetKartablBackgroundIcon" : "";
            var colorIcons = conditionUseFoldIcon ? "gadgetKartablColorIcon" : "";
            var backgroundColorIcons = conditionUseFoldIcon ? "gadgetKartablFillBackgroundIcon" : "";

            $.each(_gadgetItems, function (index, gadgetItem) {
                var associatedData = getAssociatedData(gadgetItem.DataFieldValue);

                if (associatedData.length > 0) {

                    associatedData = associatedData[0][_gadgetOptions.IndicatorFieldName];

                    sumTotal = sumTotal - parseInt(associatedData);
                } else {

                    if (gadgetItem.DataFieldValue == "Others") {

                        associatedData = sumTotal;
                    } else {
                        if (pageElementID === 100100103) {
                            associatedData = '';
                        }
                        else {
                            associatedData = '0';
                        }
                    }
                }
                
                if (gadgetItem.GroupLabel != '') {
                    if (!GroupItem.includes(gadgetItem.GroupLabel)) {
                        GroupItem.push(gadgetItem.GroupLabel);
                        $('#ul-' + pageElementID + "-" + gadgetItem.RowIndex).append(
                            '<li data-group="' + gadgetItem.GroupLabel + '">' +
                            '<a style="cursor:pointer;display:flex; align-items:center;justify-content:space-between;padding-right:0 !important;" class="gadget-box-text">' +
                            '<div style="display:flex;align-items:center"><span class="spanIconMizKar ">'
                            + '<i class="fa  fa-' + iconActivity + ' fa-solid m-1"></i>' + '</span>&nbsp;' +
                            gadgetItem.GroupLabel +
                            '</div><span class="pull-' + ($$Dir == 'RTL' ? 'left' : 'right') + ' gadget-box-number">' +
                            '<small></small></span></a><div class="gadget-detail" style="display:none;"></div></li>'
                        );

                        gadgetItemMap[gadgetItem.GroupLabel] = {
                            labels: [],
                            actions: [],
                            data: []
                        };
                    }
                    gadgetItemMap[gadgetItem.GroupLabel].labels.push(gadgetItem.Label);
                    gadgetItemMap[gadgetItem.GroupLabel].actions.push(gadgetItem.ActionOnClick);
                    gadgetItemMap[gadgetItem.GroupLabel].data.push(associatedData);
                }
            });

            $.each(gadgetItemMap, function (groupLabel, itemData) {
                var totalSum = 0;
                $.each(itemData.data, function (index, associatedData) {
                    var value = parseInt(associatedData);
                    if (!isNaN(value)) {
                        totalSum += value;
                    }
                });

                if (totalSum >= 0 && (pageElementID === 100100104) || pageKartablMan || pageSavabeghKartabl) {

                    var $listItem = $('#ul-' + pageElementID + "-0").find('li[data-group="' + groupLabel + '"]');
                    $listItem.find('small').text(totalSum);
                    var $iconSpan = $listItem.find('.spanIconMizKar');
                    var $iconInside = $listItem.find('.spanIconMizKar .fa-' + iconActivity);
                    if (conditionUseFoldIcon) {
                        if (totalSum === 0) {
                            $iconSpan.addClass(backgroundColorEmptyIcons);
                        } else {
                            $iconSpan.addClass(backgroundColorIcons);
                            $iconInside.removeClass("fa-" + iconActivity);
                            $iconInside.addClass("fa-" + iconActivityFill);
                        }
                    }
                }
            });
            $('#ul-' + pageElementID + '-0').on('click', 'li', function (event) {
                var groupLabel = $(this).data('group');
                var $listItemNumber = $('#ul-' + pageElementID + "-0").find('li[data-group="' + groupLabel + '"] .gadget-box-number small');
                var gadgetNumber = parseInt($listItemNumber.text())
                if (conditionUseFoldIcon) {
                    iconActivity = gadgetNumber > 0 ? iconActivityFill : iconActivity;
                }
                var $detailDiv = $(this).find('.gadget-detail');
                var $icon = $(this).find('.spanIconMizKar i');

                if ($detailDiv.is(':visible')) {
                    if (conditionUseFoldIcon && gadgetNumber > 0) {
                        $icon.removeClass('fa-' + iconCloseFill).addClass('fa-' + iconActivity);
                    }
                    else {
                        $icon.removeClass('fa-' + iconCLose).addClass('fa-' + iconActivity);
                    }
                    $detailDiv.slideUp(function () {
                        $detailDiv.html('');
                    });
                }
                else {
                    var itemData = gadgetItemMap[groupLabel];
                    var labels = itemData.labels;
                    var actions = itemData.actions;
                    var data = itemData.data;
                    var content = '<ul>';
                    $.each(labels, function (index, label) {
                        var onClickAction = actions[index];
                        var associatedData = data[index];
                        var iconTinyGadget;
                        if ((conditionUseFoldIcon)) {
                            iconTinyGadget = associatedData === '0' ? iconGadgetSmall : iconGadgetSmallFill;
                        }
                        else {
                            iconTinyGadget = iconGadgetSmall;
                        }
                        var roundedBorder = associatedData != "0" && associatedData != "" ? "counterBorderGadger" : "";
                        content += '<li class="itemMizkarData" onclick="' + onClickAction + '"><div class="d-flex align-items-center"><span class=" ' + colorIcons + '">' +
                            '<i class="fa fa-solid fa-' + iconTinyGadget + ' m-1"></i>'
                            + '</span>' + label + '</div><span class=" ' + roundedBorder + '">' +
                            associatedData + '</span>' + '</li>';

                    });
                    content += '</ul>';
                    $detailDiv.html(content);
                    if (conditionUseFoldIcon && gadgetNumber > 0) {
                        $icon.removeClass('fa-' + iconActivity).addClass('fa-' + iconCloseFill);
                    }
                    else {
                        $icon.removeClass('fa-' + iconActivity).addClass('fa-' + iconCLose);

                    }
                    $detailDiv.slideDown();
                }
            });
        }

        else if (pageElementID === 100100202) {

            if (!_data) {
                $('#emptyMessageListPerformance').append('<p style="text-align:center;">هیچ اطلاعاتی جهت نمایش موجود نیست !</p>');
            }
            else {
                loadGadgetsPerformanceList();
            }
        }
        else {

            try {

                $.each(_gadgetItems, function (index, gadgetItem) {

                    if (_gadgetOptions.ViewMode == 'TabView') {

                        $('#ul-' + pageElementID).append('<li id="tool-item-' + gadgetItem.GadgetItemID + '" data-index="' + index + '" class="' + (index == 0 ? 'active' : '') + '"><a style="cursor:pointer" data-toggle="tab" class="tab-box-text">&nbsp;' + gadgetItem.Label + '</a></li>');
                    } else {

                        if (gadgetItem.DataFieldValue != '') {

                            var associatedData = getAssociatedData(gadgetItem.DataFieldValue);

                            if (associatedData.length > 0) {

                                associatedData = associatedData[0][_gadgetOptions.IndicatorFieldName];

                                sumTotal = sumTotal - parseInt(associatedData);
                            } else {

                                if (gadgetItem.DataFieldValue == "Others") {

                                    associatedData = sumTotal;
                                } else {

                                    associatedData = '0';
                                }
                            }
                            if (_gadgetOptions.ViewMode == 'InfoView') {

                                $('#div-' + pageElementID).append("<div class='col-md-2 col-sm-4 col-xs-12 info-box-div'><div class='info-box'><span class='info-box-icon'><img src='App_Res/Images/Page/32/" + gadgetItem.Icon + "' /></span> <div class='info-box-content'><span class='info-box-text'>" + gadgetItem.Label + "</span><span class='info-box-number'>" + associatedData + "</span><small class='text-muted info-box-text-muted'>" + gadgetItem.Description + "</small></div></div></div>");
                            } else { //PillView
                                $('#ul-' + pageElementID + '-' + gadgetItem.RowIndex).append('<li id="tool-item-' + gadgetItem.GadgetItemID + '" data-index="' + index + '"><a style="cursor:pointer" class="gadget-box-text ' + gadgetItem.StyleClass + '"><img src="App_Res/Images/Page/32/' + gadgetItem.Icon + '"/>&nbsp;' + gadgetItem.Label + '<span class="pull-' + ($$Dir == 'RTL' ? 'left' : 'right') + ' gadget-box-number" >' + associatedData + ' <small></small></span></a></li>');
                            }
                        } else {
                            $('#ul-' + pageElementID + '-' + gadgetItem.RowIndex).append('<li id="tool-item-' + gadgetItem.GadgetItemID + '" data-index="' + index + '"><a style="cursor:pointer" class="gadget-box-text ' + gadgetItem.StyleClass + '"><img src="App_Res/Images/Page/32/' + gadgetItem.Icon + '"/>&nbsp;' + gadgetItem.Label + '<span class="pull-' + ($$Dir == 'RTL' ? 'left' : 'right') + ' gadget-box-number" > <small></small></span></a></li>');
                        }
                    }

                    if (gadgetItem.ActionOnClick.indexOf("(") > -1) {

                        $('#tool-item-' + gadgetItem.GadgetItemID).attr("onclick", gadgetItem.ActionOnClick);
                    }

                    var action = gadgetItem.ActionOnClick;

                    if (action.indexOf("redirectPage") > -1 && action.indexOf("Report") == -1) {

                        action = action.replace(/}/g, '');

                        action = action.replace(/{ TargetContext : /g, '');

                        $('#tool-item-' + gadgetItem.GadgetItemID).contextMenu([[{

                            text: "Open New Tab",

                            action: function () {

                                var inlineFunction = new Function(action.replace('redirectPage', 'openPopupPage'));

                                inlineFunction();
                            }
                        }]]);
                    }
                });

                $('#ul-' + pageElementID + '-0').on('click', 'li', function () {

                    var index = $(this).attr('data-index');

                    if (_gadgetItems[index].ActionOnClick != '' && _gadgetItems[index].ActionOnClick.indexOf("(") == -1) {

                        lanchItemAction(_gadgetItems[index], _objKey);
                    }
                });

            } catch (e) {

                raiseError(e, bodyID);

                return;
            }
        }
        //#endregion
    }

    getAssociatedData = function (dataFieldValue) {

        return $.grep(_data, function (obj, i) {

            return (obj[_gadgetOptions.DataFieldName] == dataFieldValue);
        });
    }

    lanchItemAction = function (gadgetItem, objKey) {

        if (gadgetItem.ActionOnClick == "openModalContext") {
            openModalContext(1, gadgetItem.LanchedContextID, gadgetItem.ContextType, [objKey], objKey, null);

            return;
        }

        if (gadgetItem.ActionOnClick == "navigatePage") {
            redirectPage(gadgetItem.LanchedPageID, objKey);

            return;
        }

        if (gadgetItem.ActionOnClick == "renderActivityContext") {

            if ($('#box-body-' + _gadgetOptions.TargetElementID).length) {

                renderActivityContext(_gadgetOptions.TargetElementID, gadgetItem.LanchedContextID, gadgetItem.ContextType, objKey);
            } else {

                redirectPage(gadgetItem.LanchedPageID, 0, {
                    TargetContext: gadgetItem.LanchedContextID
                }, {
                    TargetContext: gadgetItem.ContextType
                });
            }

            return;
        }

        var inlineFunction = new Function(gadgetItem.ActionOnClick);

        inlineFunction();
    }
}