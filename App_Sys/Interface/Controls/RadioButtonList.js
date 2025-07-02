// JScript File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.4.0.0

function radioButtonList(enumTypeID) {

    var _enumTypeID = enumTypeID;

    var _enumList;

    this.renderContext = function (itemID, defaultValue) {

        $.ajax({

            url: '../App_Sys/Services/Action.asmx/GetEnumData',

            contentType: 'application/json; charset=utf-8',

            type: 'POST',

            dataType: 'json',

            data: '{"id":"' + _enumTypeID + '","responseToken":"' + genResponseKey() + '"}',

            async: false,

            error: function (jqXHR, textStatus, errorThrown) {

                alert('Operation error \n\r ' + errorThrown);
            },

            success: function (data) {

                data = data.d;

                if (data[0].errorCode) {

                    alert('Operation error \n\r ' + data[0].errorMessage.replace('<br/>', '\n\r'));
                }

                setRequestToken(data[data.length - 1].requestToken);

                data.pop();

                _enumList = data;
            }
        });

        var content = "";

        $.each(_enumList, function (index, enumItem) {

            var defaultState = "";

            if (enumItem.value == defaultValue) {

                defaultState = "checked";
            }

            content += '<label class="radio-inline" style="padding-right: 0px;"><input type="radio" value="' + enumItem.value + '" name="optionsRadios-' + itemID + '" ' + defaultState + '>&nbsp;' + enumItem.label + '</label>';

        });

        return content;
    }
}