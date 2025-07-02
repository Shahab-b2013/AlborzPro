// JScript File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.0.0.0

function customView(id, objKey) {

    var _actContextID = id;

    var _objKey = objKey;

    var _data;

    this.renderContext = function (pageElementID) {

        var bodyID = '#box-body-' + pageElementID;

        var boxID = '#page-box-' + pageElementID;

        //#region Load Custom Metadata

        _customOption = new iData('e6742394-afe2-45a4-8c42-c9f00ca5def2', _actContextID);

        if (_customOption.getError() != null) {

            raiseError(_customOption.getError(), bodyID);

            return;
        }

        _customOption = _customOption.getObject();

        //#endregion

        $(boxID + ' .box-title').html(_customOption.Label);

        $(bodyID).html('');

        //#region Load Custom Data

        if (_customOption.IsRepeatable) {

            _data = new aData(_customOption.ActivityID, null, _objKey);
        } else {

            _data = new aData(_customOption.ActivityID, _objKey, null);
        }

        if (_data.getError() != null) {

            raiseError(_data.getError(), bodyID);

            return;
        }

        _data = _data.getList();

        //#endregion

        //#region Render Custom

        $(bodyID).html('');

        var customTemplate;

        var dataFieldNames = jQuery.parsJSON(_customOption.DataFieldNames);

        try {

            $.each(_data, function (index, dataItem) {

                customTemplate = _customOption.CustomTemplate;

                $.each(dataFieldNames, function (index, dataFieldName) {

                    customTemplate = customTemplate.replace('{' + dataFieldName + '}', dataItem[dataFieldName]);

                });

                $(bodyID).append(customTemplate);
            });
        } catch (e) {

            raiseError(e, bodyID);

            return;
        }

        //#endregion 
    }
}