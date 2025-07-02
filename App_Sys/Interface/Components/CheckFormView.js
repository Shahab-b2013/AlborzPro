// JScript File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.1.0.0

function checkFormView(id) {

    var _actContextID = id;

    var _parObjKey = 0;

    var _parContextID = -1;

    var _formOptions;

    var _listOptions;

    var _gridOptions;

    var _listColumns;

    this.renderModalContext = function (modalID, parContextID, parObjKey) {

        var bodyID = '#boxBodyModal' + modalID;

        var boxID = '#pageBoxModal' + modalID;

        _parObjKey = parObjKey;

        _modalID = modalID;

        _parContextID = parContextID;

        //#region Load CheckForm Metadata

        cache = localStorage.getItem(window.btoa("checkform$" + _actContextID));

        if (!cache) {

            _checkform = new iComData('checkForm', _actContextID, null, null);

            _checkform = _checkform.getData();

            localStorage.setItem(window.btoa("checkform$" + _actContextID), reverse(encodeURI(JSON.stringify(_checkform))));
        } else {

            _checkform = jQuery.parseJSON(decodeURI(reverse(cache)));
        }

        _formOptions = _checkform.formOptions;

        _listOptions = _checkform.listOptions;

        _listColumns = _checkform.columns;

        _gridOptions = _checkform.gridOptions;

        //#endregion

        $(boxID + ' .box-title').html(_formOptions.Label);

        $(bodyID).html('');

        //#region Render CheckForm & Load data

        try {

            var jColumns = '[';

            jColumns += '{"orderable":false,"searchable":false,"className": "select-checkbox","defaultContent": "","width":"10px"},';

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

            $(bodyID).append('<table id="datatableModal' + modalID + '"  cellspacing="0"  width="100%" class="table-striped table-hover table-bordered"><tfoot><tr></tr></tfoot><tbody></tbody><table>');

            $(bodyID).append('<h5 class="message-form-success" id="smessage"></h5>');

            $(bodyID).append('<h5  class="message-form-error" id="emessage"></h5>');

        } catch (e) {

            raiseError(e, bodyID);

            return;
        }

        $$DataTable = $('#datatableModal' + modalID).DataTable({

            searching: true,

            paging: true,

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

        $('#boxFooterModal' + modalID).append('<button type="button" id="btnActModal' + modalID + '" class="btn btn-form-submit" onclick="">' + $$Local.formSubmit + '</button>&nbsp;');

        $('#boxFooterModal' + modalID).append('<button type="button" id="btnCnsModal' + modalID + '" class="btn btn-default btn-form-cancel" >' + $$Local.formCancel + '</button>');

        $('#btnActModal' + modalID).unbind("click");

        $('#btnActModal' + modalID).click(function () {

            try {

                var activiyParams = new Array();

                var activiyParam;

                var __objKeys = [];

                var selRows = $$DataTable.rows({
                    selected: true
                }).data();

                for (i = 0; i < selRows.length; i++) {

                    __objKeys[i] = selRows[i].ObjKey;
                }

                activiyParam = new Object();

                activiyParam.ParamName = 'ParentObjectID';

                activiyParam.ParamIndex = 0;

                activiyParam.ParamValue = _parObjKey;

                activiyParams[0] = activiyParam;

                $('.wrapper').block({
                    message: '<span class="message-form-block">..Processing<span>',
                    baseZ: 10000
                });

                var data = new FormData();

                data.append('activiyParams', JSON.stringify(activiyParams));

                data.append('objectIDs', JSON.stringify(__objKeys));

                data.append('id', _formOptions.ActivityID);

                var $aExecutor = new aExecutor(_modalID, data, boxID, jQuery.parseJSON(_formOptions.ActionOnSuccess), _parContextID);

                $aExecutor.submit();
            } catch (e) {

                raiseError(e, bodyID);

                return;
            }

        });

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