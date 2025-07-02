//JScript File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.4.1.0

function iData(target, id) {

    var _id = id;

    var _target = target;

    var _list;

    var _errorMsseage = null;

    this.getList = function () {

        return _list;
    }

    this.getObject = function () {

        return _list[0];
    }

    this.getLength = function () {

        return _list.length;
    }

    setList = function () {

        if (_target == 'da63b835-a956-46ad-ba63-495851db6d21') {

            cache = localStorage.getItem("POEq39CwZiNbGsh9WCzy");

            if (cache) {

                _list = filterList(jQuery.parseJSON(decodeURI(reverse(cache))), 'SelectListID', _id);
            } else {
                _list = [];
            }
        }

        if (_target == 'f0a087e3-3c5c-4ea7-a9c7-e80f19ff7726') {

            cache = localStorage.getItem("8GvfVuQ6I7fpSeYspLnW");

            if (cache) {

                _list = filterList(jQuery.parseJSON(decodeURI(reverse(cache))), 'FormItemID', _id);
            } else {
                _list = [];
            }
        }
    }

    this.getError = function () {

        return _errorMsseage;
    }

    this.getListByFilter = function (fieldName, fieldValue) {

        return $.grep(_list, function (obj, i) {

            return (obj[fieldName] == fieldValue);
        });
    }

    if ((_target != 'da63b835-a956-46ad-ba63-495851db6d21' && _target != 'f0a087e3-3c5c-4ea7-a9c7-e80f19ff7726') || localStorage.getItem("POEq39CwZiNbGsh9WCzy") == null) {

        $.ajax({

            type: 'POST',

            url: '../App_Sys/Services/Interface.asmx/GetData',

            data: '{"id":"' + _id + '","target":"' + _target + '","responseToken":"' + genResponseToken() + '"}',

            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            async: false,

            error: function (jqXHR, textStatus, errorThrown) {

                _errorMsseage = errorThrown;

                if (_errorMsseage == '' || _errorMsseage == null || _errorMsseage === undefined) {

                    _errorMsseage = JSON.stringify(jqXHR);
                }
            },

            success: function (data) {

                data = data.d;

                if (data[0].errorCode !== undefined && data[0].errorCode != null) {

                    _errorMsseage = data[0].errorMessage;

                    return;
                }

                setRequestToken(data[data.length - 1].requestToken);

                data.pop();

                _list = data;
            }
        });
    } else {
        setList()
    }
}

function iObjectData(target, id) {

    var _id = id;

    var _target = target;

    var _list;

    var _errorMsseage = null;

    this.getList = function () {

        return _list;
    }

    this.getObject = function () {

        return _list[0];
    }

    this.getLength = function () {

        return _list.length;
    }

    setList = function (dlist) {

        _list = dlist;
    }

    this.getError = function () {

        return _errorMsseage;
    }

    this.getListByFilter = function (fieldName, fieldValue) {

        return $.grep(_list, function (obj, i) {

            return (obj[fieldName] == fieldValue);
        });
    }

    $.ajax({

        type: 'POST',

        url: '../App_Sys/Services/Interface.asmx/GetObjectData',

        data: '{"id":"' + _id + '","target":"' + _target + '","responseToken":"' + genResponseToken() + '"}',

        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        async: false,

        error: function (jqXHR, textStatus, errorThrown) {

            _errorMsseage = errorThrown;

            if (_errorMsseage == '' || _errorMsseage == null || _errorMsseage === undefined) {

                _errorMsseage = JSON.stringify(jqXHR);
            }
        },

        success: function (data) {

            data = data.d;

            if (data[0].errorCode !== undefined && data[0].errorCode != null) {

                _errorMsseage = data[0].errorMessage;

                return;
            }

            setRequestToken(data[data.length - 1].requestToken);

            data.pop();

            setList(data);
        }
    });
}

function iComData(target, id, param, param2) {

    var _id = id;

    var _target = target;

    var _param = param;

    var _param2 = param2;

    var _errorMsseage = null;

    var _data = null;

    this.getError = function () {

        return _errorMsseage;
    }

    this.getData = function () {

        return _data;
    }

    $.ajax({

        type: 'POST',

        url: '../App_Sys/Services/Interface.asmx/GetCompData',

        data: '{"id":"' + _id + '","target":"' + _target + '","param":"' + _param + '","param2":"' + _param2 + '","responseToken":"' + genResponseToken() + '"}',
        
        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        async: false,

        error: function (jqXHR, textStatus, errorThrown) {

            _errorMsseage = errorThrown;

            if (_errorMsseage == '' || _errorMsseage == null || _errorMsseage === undefined) {

                _errorMsseage = JSON.stringify(jqXHR);
            }
        },

        success: function (data) {

            data = data.d;

            if (data.errorCode !== undefined && data.errorCode != null) {

                _errorMsseage = data.errorMessage;

                return;
            }

            setRequestToken(data.requestToken);

            _data = data;
        }
    });
}

function iLoadCommonData() {

    $.ajax({

        type: 'POST',

        url: '../App_Sys/Services/Interface.asmx/GetCommonData',

        data: '{"responseToken":"' + genResponseToken() + '"}',

        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        async: (typeof InstallTrigger === 'undefined'), //false for firefox, true for other

        error: function (jqXHR, textStatus, errorThrown) {

            _errorMsseage = errorThrown;

            if (_errorMsseage == '' || _errorMsseage == null || _errorMsseage === undefined) {

                _errorMsseage = JSON.stringify(jqXHR);
            }

            alert("Error in load common data : " + _errorMsseage);
        },

        success: function (data) {

            data = data.d;

            if (data.errorCode !== undefined && data.errorCode != null) {

                _errorMsseage = data.errorMessage;

                alert("Error in load common data : " + _errorMsseage);

                return;
            }

            localStorage.setItem("POEq39CwZiNbGsh9WCzy", reverse(encodeURI(JSON.stringify(data.formSelects))));

            localStorage.setItem("8GvfVuQ6I7fpSeYspLnW", reverse(encodeURI(JSON.stringify(data.formAddons))));

            localStorage.setItem("hrtGntAtsb6Gqph5d0X5", reverse(encodeURI(JSON.stringify(data.formEnums))));
        }
    });
}

function filterList(list, fieldName, fieldValue) {

    return $.grep(list, function (obj, i) {

        return (obj[fieldName] == fieldValue);
    });
}

function reverse(s) {
    return s.split("").reverse().join("");
}