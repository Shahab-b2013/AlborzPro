// JScript File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.4.0.0

function autoComplete(activityParamID, actionControlID) {

    var _activityParamID = activityParamID;

    var _actionControlID = actionControlID;

    var _textBoxID;

    var _activityID;

    this.renderContext = function (textBoxID, activityID, filterValue, parentName) {

        _textBoxID = textBoxID;

        _activityID = activityID;

        var options = {

            url: '../App_Sys/Services/Action.asmx/GetAutoCompleteData',

            getValue: "value",

            list: {

                match: {

                    enabled: false
                },

                maxNumberOfElements: 10
            },

            ajaxSettings: {

                url: '../App_Sys/Services/Action.asmx/GetAutoCompleteData',

                contentType: 'application/json; charset=utf-8',

                type: 'POST',

                dataType: 'json',

                data: '{"id":"' + _activityParamID + '","activityID":"' + _activityID + '","q": "","p": "","actionControlID":"' + _actionControlID + '","responseToken":"' + genResponseToken() + '"}',

                error: function (jqXHR, textStatus, errorThrown) {

                    alert('Operation error \n\r ' + errorThrown);
                }
            },

            preparePostData: function (data) {

                if (parentName != '' && filterValue == 0) {

                    filterValue = $('#form-item-' + $$FormItems[parentName].FormItemID).val();

                    filterValue = (filterValue == '' || filterValue == null ? '0' : filterValue);
                }

                return '{"id":"' + _activityParamID + '","activityID":"' + _activityID + '","q": "' + $(_textBoxID).val() + '","p": "' + filterValue + '","actionControlID":"' + _actionControlID + '","responseToken":"' + genResponseToken() + '"}';
            },

            requestDelay: 500
        };

        $(_textBoxID).easyAutocomplete(options);
    }
}