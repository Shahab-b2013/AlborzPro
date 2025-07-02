// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
/* Release Ferdos.WebAppDesk 4.2.0.0*/

function tableView(id, objKey, objType) {
    var _actContextID = id;

    var _contextIndex = -1;

    var _objKey = $.isArray(objKey) ? objKey[0] : objKey;

    var _objType = objType;

    var _gridOptions;

    var _gridColumns;

    var _gridButtons;

    var _gridFilters;

    var _rowdata;

    var _taskID = 0;

    var offSet = 0;

    this._renderContext = function (
        renderMode,
        modalID,
        pageElementID,
        defaultSearch
    ) {
        var bodyID = "#box-body-" + pageElementID;

        var boxID = "#page-box-" + pageElementID;

        var footerID = "#box-footer-" + pageElementID;

        if (renderMode == "Modal") {
            bodyID = "#boxBodyModal" + modalID;

            boxID = "#pageBoxModal" + modalID;

            footerID = "#boxFooterModal" + modalID;

            _modalID = modalID;
        }

        //#region Load Grid Metadata

        cache = localStorage.getItem(window.btoa("grid$" + _actContextID));

        if (!cache || true) {
            _grid = new iComData("grid", _actContextID, null, null);

            _grid = _grid.getData();

            localStorage.setItem(
                window.btoa("grid$" + _actContextID),
                reverse(encodeURI(JSON.stringify(_grid)))
            );
        } else {
            _grid = jQuery.parseJSON(decodeURI(reverse(cache)));
        }

        _gridOptions = _grid.options;

        _gridColumns = _grid.columns;

        _gridButtons = _grid.buttons;

        //#endregion
        let list = [
        ];

        _data = new aData(_actContextID, null, _objKey, '1/1/2000');

        if (_data.getError() != null) {

            raiseError(_data.getError(), bodyID);

            return;
        }

        list = _data.getList();


        let TBL = '<table class="table">';

        let TH = "<tr>";

        for (let i = 0; i < _gridColumns.length; i++)
            TH += `<th scope="col" style="width:${_gridColumns[i].Width};text-align: center;">${_gridColumns[i].Label}</th>`;

        TH += "</tr>";

        TBL += TH;

        let TBODY = "<tbody>";

        let subject = "";


        if (list[0].hasOwnProperty("ObjKey")) {
            for (let i = 0; i < list.length; i++) {
                TBODY += `<tr><td style="text-align: center;">${i + 1}</td>`;


                for (let j = 1; j < _gridColumns.length; j++) {

                    TBODY += `<td style="text-align: center; font-weight: 600">${list[i][_gridColumns[j].DataFieldName]}</td>`;
                }
            }

        }

        TBODY += `</tr>`;

        TBODY += "</tbody>";

        TBL += TBODY;

        TBL += `</table>`;

        $(bodyID).html(TBL);

        $(bodyID).css("overflow", "scroll");
        $(bodyID).css("overflow-x", "hidden");

        $(footerID).html(``);

        if (renderMode == "Modal") {
            $("#boxTitleModal" + modalID).html(_gridOptions.label);
        }

        //#region Render Footer

        if (renderMode == "Modal") {
            $("#boxFooterModal" + modalID).append(
                '<button type="button" id="btnCnsModal' +
                modalID +
                '" class="btn btn-default btn-form-cancel" >' +
                $$Local.formCancel +
                "</button>"
            );

            $("#closeBtnModal" + modalID).unbind("click");

            $("#closeBtnModal" + modalID).click(function () {
                _modalID = _modalID - 1;

                $(bodyID).html("");

                $(footerID).html("");
            });

            $("#btnCnsModal" + modalID).unbind("click");

            $("#btnCnsModal" + modalID).click(function () {
                $("#closeBtnModal" + _modalID).trigger("click");
            });
        }

        //#endregion
    };

    this.renderModalContext = function (modalID, defaultSearch) {
        this._renderContext("Modal", modalID, 0, parseSearchValue(defaultSearch));
    };
}