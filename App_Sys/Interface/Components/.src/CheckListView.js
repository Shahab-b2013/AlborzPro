// JScript File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.1.0.0

function checkListView(id) {

    var _actContextID = id;

    var _parObjKey = 0;

    var _parObjType = null;

    var _contextIndex = -1;

    var _listOptions;

    var _listColumns;

    var _listButtons;

    var _gridOptions;

    this.renderContext = function (pageElementID, parObjKey, parObjType) {

        var bodyID = '#box-body-' + pageElementID;

        var boxID = '#page-box-' + pageElementID;

        var footerID = '#box-footer-' + pageElementID;

        _parObjKey = parObjKey;

        _parObjType = parObjType;

        //#region Load CheckList Metadata

        cache = localStorage.getItem(window.btoa("checklist$" + _actContextID));

        if (!cache) {

            _checklist = new iComData('checkList', _actContextID, null, null);

            _checklist = _checklist.getData();

            localStorage.setItem(window.btoa("checklist$" + _actContextID), reverse(encodeURI(JSON.stringify(_checklist))));
        } else {

            _checklist = jQuery.parseJSON(decodeURI(reverse(cache)));
        }

        _listOptions = _checklist.listOptions;

        _listColumns = _checklist.columns;

        _listButtons = _checklist.buttons;

        _gridOptions = _checklist.gridOptions;

        //#endregion

        $(boxID + ' .box-title').html(_listOptions.Label);

        $(bodyID).html('');

        $(footerID).html('');

        //#region Render CheckList & Load data

        var jColumns = '[';

        jColumns += '{"orderable":false,"searchable":false,"className": "select-checkbox","defaultContent": "","width":"10px"},';

        try {

            $.each(_listColumns, function (index, listColumn) {

                jColumns += '{"data": "' + listColumn.DataFieldName + '", "name": "' + listColumn.Name + '", "title": "' + listColumn.Label + '", "orderable": false, "searchable": false, "defaultContent": "' + listColumn.DefaultContent + '"';

                if (listColumn.Width != 'auto') {

                    jColumns += ', "width": "' + listColumn.Width + '"';
                }

                if (listColumn.StyleClass != 'default') {

                    jColumns += ', "class": "' + listColumn.StyleClass + '"';
                }

                jColumns += '},';

            });

            jColumns = jColumns.substring(0, jColumns.length - 1);

            jColumns += ']';

            $(bodyID).append('<table id="datatable-' + pageElementID + '"  cellspacing="0"  width="100%" class="table-striped table-hover table-bordered"> <tfoot><tr></tr></tfoot><tbody></tbody><table>');

            _contextIndex = $$ParentContexts.length;
        } catch (e) {

            raiseError(e, bodyID);

            return;
        }

        $$ParentContexts[_contextIndex] = $('#datatable-' + pageElementID).DataTable({

            paging: false,

            searching: false,

            lengthChange: false,

            info: true,

            language: {

                info: _gridOptions.lbl_info,

                infoEmpty: _gridOptions.lbl_infoEmpty,

                infoFiltered: _gridOptions.lbl_infoFiltered,

                infoPostFix: _gridOptions.lbl_infoPostFix,

                loadingRecords: _gridOptions.lbl_loadingRecords,

                sZeroRecords: _gridOptions.lbl_zeroRecords,

                processing: _gridOptions.lbl_processing,

                search: _gridOptions.lbl_search,

                searchPlaceholder: _gridOptions.lbl_searchPlaceholder,

                lengthMenu: _gridOptions.lbl_lengthMenu,

                paginate: {

                    first: _gridOptions.lbl_pageFirst,

                    last: _gridOptions.lbl_pageLast,

                    next: _gridOptions.lbl_pageNext,

                    previous: _gridOptions.lbl_pagePrevious
                },
            },

            lengthMenu: jQuery.parseJSON(_gridOptions.lengthMenu),

            stateSave: jQuery.parseJSON(_gridOptions.stateSave),

            serverSide: jQuery.parseJSON(_gridOptions.serverSide),

            pageLength: _gridOptions.pageLength,

            ordering: false,

            order: [1, 'asc'],

            orderMulti: false,

            pagingType: _gridOptions.pagingType,

            search: {

                regex: jQuery.parseJSON(_gridOptions.searchRegex),

                search: _gridOptions.search,

                smart: jQuery.parseJSON(_gridOptions.searchSmart)
            },

            searchDelay: _gridOptions.searchDelay,

            stateDuration: _gridOptions.stateDuration,

            dom: '<"top"fl><"toolbar">Brt<"bottom"ip><"clear">',

            deferRender: _gridOptions.deferRender,

            processing: true,

            responsive: {

                details: false
            },

            columns: jQuery.parseJSON(jColumns),

            ajax: {

                type: 'POST',

                url: 'App_Sys/Services/ViewActivity.asmx/GetDataList',

                contentType: 'application/json; charset=utf-8',

                dataType: 'json',

                data: function (d) {

                    d.id = _listOptions.ActivityID;

                    d.objKey = _parObjKey[0];

                    d.advancedSearch = [];

                    d.responseToken = genResponseToken();
                }
            },

            select: {

                style: 'multi',

                selector: 'tr',

                info: false
            },

            columnDefs: [

                {
                    className: 'dt-center',
                    targets: '_all'
                }
            ]
        });

        $('#datatable-' + pageElementID).on('draw.dt', function () {

            setTimeout('alignSideBarHeight();', 1 * 100);
        });

        //#endregion

        //#region Render Footer

        for (i = 0; i < _listButtons.length; i++) {

            $('#box-footer-' + pageElementID).append('<button type="button" id="btn-act-' + pageElementID + '-' + i + '" data-index=' + i + ' class="btn btn-form ' + _listButtons[i].StyleClass + '"><i class="fa ' + _listButtons[i].Icon + '"></i>&nbsp;' + _listButtons[i].Label + '</button>&nbsp;&nbsp;');

            $('#btn-act-' + pageElementID + '-' + i).click(function () {

                var index = $(this).attr('data-index');

                var listButton = _listButtons[index];

                var __objKeys = [];

                var selRows = $$ParentContexts[_contextIndex].rows({
                    selected: true
                }).data();

                for (i = 0; i < selRows.length; i++) {

                    __objKeys[i] = selRows[i].ObjKey;
                }

                if (!__objKeys[0] && (listButton.Name.indexOf('Remove') != -1)) {

                    if ($$Lang == 'Fa') {

                        alert("هیچ رکوردی انتخاب نشده است");
                    } else {
                        alert("No any record has been selected");
                    }

                    return;
                }

                if (listButton.ActionOnClick == 'openModalContext') {

                    var v_parObjKey = _parObjKey[0];

                    if (listButton.Name.indexOf('Remove') != -1) {

                        v_parObjKey = 0;
                    }

                    openModalContext(1, listButton.LanchedContextID, listButton.ContextType, __objKeys, v_parObjKey, _parObjType, _contextIndex);
                }

                if (listButton.ActionOnClick == 'silentActivity') {

                    executeSilentActivity(listButton.LanchedContextID, __objKeys, _parObjKey[0]);
                }

            });
        }

        //#endregion
    }

    this.renderModalContext = function (modalID, parObjKey) {

        var bodyID = '#boxBodyModal' + modalID;

        var boxID = '#pageBoxModal' + modalID;

        _parObjKey = parObjKey;

        _modalID = modalID;

        //#region Load CheckList Metadata

        cache = localStorage.getItem(window.btoa("checklist$" + _actContextID));

        if (!cache) {

            _checklist = new iComData('checkList', _actContextID, null, null);

            _checklist = _checklist.getData();

            localStorage.setItem(window.btoa("checklist$" + _actContextID), reverse(encodeURI(JSON.stringify(_checklist))));
        } else {

            _checklist = jQuery.parseJSON(decodeURI(reverse(cache)));
        }

        _listOptions = _checklist.listOptions;

        _listColumns = _checklist.columns;

        _listButtons = _checklist.buttons;

        _gridOptions = _checklist.gridOptions;

        //#endregion

        $(boxID + ' .box-title').html(_listOptions.Label);

        $(bodyID).html('');

        //#region Render CheckList & Load data

        var jColumns = '[';

        jColumns += '{"orderable":false,"searchable":false,"className": "select-checkbox","defaultContent": "","width":"10px"},';

        try {

            $.each(_listColumns, function (index, listColumn) {

                jColumns += '{"data": "' + listColumn.DataFieldName + '", "name": "' + listColumn.Name + '", "title": "' + listColumn.Label + '", "orderable": false, "searchable": true, "defaultContent": "' + listColumn.DefaultContent + '"';

                if (listColumn.Width != 'auto') {

                    jColumns += ', "width": "' + listColumn.Width + '"';
                }

                if (listColumn.StyleClass != 'default') {

                    jColumns += ', "class": "' + listColumn.StyleClass + '"';
                }

                jColumns += '},';

            });

            jColumns = jColumns.substring(0, jColumns.length - 1);

            jColumns += ']';

            $(bodyID).append('<table id="datatableModal' + modalID + '"  cellspacing="0"  width="100%" class="table-striped table-hover table-bordered"> <tfoot><tr></tr></tfoot><tbody></tbody><table>');

            _contextIndex = $$ParentContexts.length;
        } catch (e) {

            raiseError(e, bodyID);

            return;
        }

        $$ParentContexts[_contextIndex] = $('#datatableModal' + modalID).DataTable({

            paging: true,

            searching: true,

            lengthChange: false,

            info: true,

            language: {

                info: _gridOptions.lbl_info,

                infoEmpty: _gridOptions.lbl_infoEmpty,

                infoFiltered: _gridOptions.lbl_infoFiltered,

                infoPostFix: _gridOptions.lbl_infoPostFix,

                loadingRecords: _gridOptions.lbl_loadingRecords,

                sZeroRecords: _gridOptions.lbl_zeroRecords,

                processing: _gridOptions.lbl_processing,

                search: _gridOptions.lbl_search,

                searchPlaceholder: _gridOptions.lbl_searchPlaceholder,

                lengthMenu: _gridOptions.lbl_lengthMenu,

                paginate: {

                    first: _gridOptions.lbl_pageFirst,

                    last: _gridOptions.lbl_pageLast,

                    next: _gridOptions.lbl_pageNext,

                    previous: _gridOptions.lbl_pagePrevious
                },
            },

            lengthMenu: jQuery.parseJSON(_gridOptions.lengthMenu),

            stateSave: jQuery.parseJSON(_gridOptions.stateSave),

            serverSide: jQuery.parseJSON(_gridOptions.serverSide),

            pageLength: _gridOptions.pageLength,

            ordering: false,

            order: [1, 'asc'],

            orderMulti: false,

            pagingType: _gridOptions.pagingType,

            search: {

                regex: jQuery.parseJSON(_gridOptions.searchRegex),

                search: _gridOptions.search,

                smart: jQuery.parseJSON(_gridOptions.searchSmart)
            },

            searchDelay: _gridOptions.searchDelay,

            stateDuration: _gridOptions.stateDuration,

            dom: '<"top"fl><"toolbar">Brt<"bottom"ip><"clear">',

            deferRender: _gridOptions.deferRender,

            processing: true,

            responsive: {

                details: false
            },

            columns: jQuery.parseJSON(jColumns),

            ajax: {

                type: 'POST',

                url: 'App_Sys/Services/ViewActivity.asmx/GetDataList',

                contentType: 'application/json; charset=utf-8',

                dataType: 'json',

                data: function (d) {

                    d.id = _listOptions.ActivityID;

                    d.objKey = _parObjKey;

                    d.advancedSearch = [];

                    d.responseToken = genResponseToken();
                }
            },

            select: {

                style: 'multi',

                selector: 'tr',

                info: false
            },

            columnDefs: [

                {
                    className: 'dt-' + ($$Dir == 'RTL' ? 'right' : 'center'),
                    targets: '_all'
                }
            ]
        });

        //#endregion

        //#region Render Footer

        $('#boxFooterModal' + modalID).html('');

        for (i = 0; i < _listButtons.length; i++) {

            $('#boxFooterModal' + modalID).append('<button type="button" id="btnActModal' + modalID + '-' + i + '" data-index=' + i + ' class="btn btn-form ' + _listButtons[i].StyleClass + '"><i class="fa ' + _listButtons[i].Icon + '"></i>&nbsp;' + _listButtons[i].Label + '</button>&nbsp;&nbsp;');

            $('#btnActModal' + modalID + '-' + i).click(function () {

                var index = $(this).attr('data-index');

                var listButton = _listButtons[index];

                var __objKeys = [];

                var selRows = $$ParentContexts[_contextIndex].rows({
                    selected: true
                }).data();

                for (i = 0; i < selRows.length; i++) {

                    __objKeys[i] = selRows[i].ObjKey;
                }

                if (!__objKeys[0] && (listButton.Name.indexOf('Remove') != -1)) {

                    if ($$Lang == 'Fa') {

                        alert("هیچ رکوردی انتخاب نشده است");
                    } else {
                        alert("No any record has been selected");
                    }

                    return;
                }

                if (listButton.ActionOnClick == 'openModalContext') {

                    openModalContext(_modalID + 1, listButton.LanchedContextID, listButton.ContextType, __objKeys, _parObjKey, null, _contextIndex);
                }

                if (listButton.ActionOnClick == 'silentActivity') {

                    executeSilentActivity(listButton.LanchedContextID, __objKeys, _parObjKey, _contextIndex);
                }
            });
        }

        $('#boxFooterModal' + modalID).append('<button type="button" id="btnCnsModal' + modalID + '" class="btn btn-default btn-form-cancel" >' + $$Local.formCancel + '</button>');

        $('#closeBtnModal' + modalID).unbind("click");

        $('#closeBtnModal' + modalID).click(function () {

            _modalID = _modalID - 1;

            $(bodyID).html('');

            $('#boxFooterModal' + modalID).html('');
        });

        $('#btnCnsModal' + modalID).unbind("click");

        $('#btnCnsModal' + modalID).click(function () {

            $('#closeBtnModal' + _modalID).trigger("click");
        });
        //#endregion
    }
}