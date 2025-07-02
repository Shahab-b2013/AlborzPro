// JScript File(Amnpardaz Software Co. Copyright 2021 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.5.2.0

function detailListView(id, objKey) {

    var _actContextID = id;

    var _objKey = objKey;

    var _listOptions;

    var _listColumns;

    var _gridOptions;

    this.renderContext = function (pageElementID, chartID) {

        var bodyID = '#box-body-' + pageElementID;

        if (pageElementID == 0)
            bodyID = '#chart-' + chartID;

        var boxID = '#page-box-' + pageElementID;

        var footerID = '#box-footer-' + pageElementID;

        //#region Load DetailList Metadata

        cache = localStorage.getItem(window.btoa("detaillist$" + _actContextID));

        if (!cache) {

            _detaillist = new iComData('detailList', _actContextID, null, null);

            _detaillist = _detaillist.getData();

            localStorage.setItem(window.btoa("detaillist$" + _actContextID), reverse(encodeURI(JSON.stringify(_detaillist))));
        } else {

            _detaillist = jQuery.parseJSON(decodeURI(reverse(cache)));
        }

        _listOptions = _detaillist.listOptions;

        _listColumns = _detaillist.columns;

        _gridOptions = _detaillist.gridOptions;

        //#endregion

        try {
            $(boxID + ' .box-title').html(_listOptions.Label);

            if (pageElementID != 0)
                $(bodyID).html('');

            $(footerID).html('');
        }
        catch{ }

        //#region Render Detail List & Load Listdata

        var jColumns = '[';

        var txtColumns = '[ ';

        var i = 0;

        try {

            $.each(_listColumns, function (index, listColumn) {

                jColumns += '{"data": "' + listColumn.DataFieldName + '", "name": "' + listColumn.Name + '", "title": "' + listColumn.Label + '", "orderable": false, "searchable": false, "defaultContent": "' + listColumn.DefaultContent + '"';

                if (listColumn.Width != '') {

                    jColumns += ', "width": "' + listColumn.Width + '"';
                }

                if (listColumn.StyleClass != 'default') {

                    jColumns += ', "class": "' + listColumn.StyleClass + '"';
                }

                if (listColumn.Width == '500px') txtColumns += (i).toString() + ',';

                i++;

                jColumns += '},';

            });

            jColumns = jColumns.substring(0, jColumns.length - 1);

            jColumns += ']';

            txtColumns = txtColumns.substring(0, txtColumns.length - 1);

            txtColumns += ']';

            $(bodyID).append('<table id="datatable-' + (pageElementID == 0 ? chartID : pageElementID) + '"  cellspacing="0"  width="100%" class="table-striped table-hover' + (pageElementID == 0 ? '' : ' table-bordered') + '"> <tfoot><tr></tr></tfoot><tbody></tbody><table>');
        } catch (e) {

            raiseError(e, bodyID);

            return;
        }

        $('#datatable-' + (pageElementID == 0 ? chartID : pageElementID)).DataTable({

            paging: true,

            searching: true,

            lengthChange: true,

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

            dom: (pageElementID == 0 ? '' : '<"top"fl><"toolbar">Brt<"bottom"ip><"clear">'),

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

                    d.objKey = _objKey[0];

                    d.advancedSearch = [];

                    d.responseToken = genResponseToken();
                }
            },

            select: false,

            columnDefs: [

                {
                    className: 'dt-center' + (pageElementID == 0 ? ' dt-compact' : ''),
                    targets: '_all'
                },
                {
                    "render": function (data, type, row) {
                      
                        if (data == null)
                            return '';
                       
                        if (pageElementID == 0) {

                            if (data.length < 35)
                                return data;

                            return truncate(data, 35, true);
                        }

                        if (data.length < 200)
                            return data;

                        return data.substring(0, 200) +
                            '<a href="javascript:return false" onclick="alert(\'' + data.replace(/&#x27;/g, "`").replace(/<br\s*\/?>/gi, " ").replace(/(\r\n\t|\n|\r\t)/gm, " ") + '\')"><b> [' + ($$Lang == 'Fa' ? '...ادامه' : 'continue...') + '] </b></a>';
                    },

                    "targets": (pageElementID == 0 ? '_all' : jQuery.parseJSON(txtColumns))
                }
            ]
        });

        $('#datatable-' + pageElementID).on('draw.dt', function () {

            setTimeout('alignSideBarHeight();', 1 * 100);
        });

        //#endregion
    }
}

function truncate(str, n, useWordBoundary) {
    if (str.length <= n) { return str; }
    const subString = str.substr(0, n - 1); // the original check
    return (useWordBoundary
        ? subString.substr(0, subString.lastIndexOf(" "))
        : subString) + "&hellip;";
};