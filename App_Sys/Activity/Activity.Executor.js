/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.1.0.0*/

function aExecutor(
    modalID,
    formData,
    formID,
    actionOnSuccess,
    _parContextID,
    _parObjType
) {

    var _formData = formData;

    var _actionOnSuccess = actionOnSuccess;

    var _formID = formID;

    this.submit = function () {
        _formData.append("responseToken", genResponseToken());

        $.ajax({
            type: "POST",

            url: "App_Sys/Services/EditActivity.asmx/EditData",

            data: _formData,

            contentType: false,

            async:false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {
                $(".wrapper").unblock();

                _errorMsseage = jqXHR.errorThrown;

                if (
                    _errorMsseage == "" ||
                    _errorMsseage == null ||
                    _errorMsseage === undefined
                ) {
                    alert(JSON.stringify(jqXHR));
                } else {
                    $(_formID + " #smessage").html("");

                    $(_formID + " #emessage").html(jqXHR.errorThrown);
                }
            },

            success: function (data) {
                $(".wrapper").unblock();

                var data =
                    data.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                var objKey;

                var requestToken;

                if (data.indexOf("#error#") == -1) {
                    var items = data.split("#");

                    $(_formID + " #smessage").html(items[0]);

                    $(_formID + " #emessage").html("");

                    objKey = items[1];

                    if (objKey == "" || objKey == null) {
                        objKey = 0;
                    }

                    requestToken = items[2];
                } else {
                    data = data.replace("#error#", "");

                    var items = data.split("Error code");

                    if (
                        items[0].indexOf("can't") != -1 ||
                        items[0].indexOf("already") != -1 ||
                        items[0].indexOf("نمی باشند") != -1 ||
                        items[0].indexOf("نمی باشد") != -1 ||
                        items[0].indexOf("امکان پذیر می باشد") != -1 ||
                        items[0].indexOf("رزرو") != -1||
                        items[0].indexOf("سقف") != -1||
                        items[0].indexOf("باشد") != -1||
                        items[0].indexOf("شده است") != -1
                    ) {
                        //Error Code : Activity_Rule_Error .The ErrorLogID should not be shown

                        $(_formID + " #emessage").html(items[0]);
                    } else {
                        $(_formID + " #emessage").html(data);
                    }

                    $(_formID + " #smessage").html("");

                    return;
                }

                setRequestToken(requestToken);

                for (i = 0; i < _actionOnSuccess.length; i++) {
                    var actionObj = _actionOnSuccess[i];

                    var actionType = actionObj[0];

                    if (actionType == "refresh") {
                        location.reload(true);
                    }

                    if (actionType == "renderDashboard") {
                        $("#ul-" + pageElementID).append(
                            '<li id="tool-item-' +
                            gadgetItem.GadgetItemID +
                            '" data-index="' +
                            index +
                            '" class="' +
                            (index == 0 ? "active" : "") +
                            '"><a style="cursor:pointer" data-toggle="tab" class="tab-box-text">&nbsp;' +
                            "Test" +
                            "</a></li>"
                        );

                        renderPage("#page-cell-1000605", 1000050, 0);
                        $('.nav-tabs a[href="1000000050"]').tab("show");
                    }

                    if (actionType == "closeModalForm") {
                        if (modalID != 0) {
                            _modalID = _modalID - 1;

                            $("#actContextModal" + modalID).modal("hide");

                            if (_parContextID == null || _parContextID === undefined) {
                                $(".btn-refresh").first().trigger("click");
                            } else {
                                $$ParentContexts[_parContextID].ajax.reload(null, false);
                            }

                            //Sepad Compatibility
                            if (_formData.get("id") == 1026351 && _modalID == 1) {
                                $("#actContextModal" + _modalID).modal("hide");

                                _modalID = _modalID - 1;
                            }
                        }
                    }

                    if (actionType == "redirectPage") {
                        if (modalID != 0) {
                            _modalID = _modalID - 1;

                            $("#actContextModal" + modalID).modal("hide");
                        }

                        var pageID = actionObj[1];

                        redirectPage(pageID, objKey);
                    }

                    if (actionType == "renderActivityContext") {
                        var elementID = actionObj[1];

                        var actContextID = actionObj[2];

                        var contextType = actionObj[3];

                        renderActivityContext2(
                            elementID,
                            actContextID,
                            contextType,
                            objKey,
                            _parObjType
                        );

                        if (modalID != 0) {
                            _modalID = _modalID - 1;

                            $("#actContextModal" + modalID).modal("hide");
                        }
                    }

                    if (actionType == "reloadReportData") {
                        if (modalID != 0) {
                            _modalID = _modalID - 1;

                            $("#actContextModal" + modalID).modal("hide");
                        }

                        $("#pageNumber").val(1);

                        reloadReportData();
                    }

                    if (actionType == "openModalContext") {
                        var elementID = actionObj[1];

                        var actContextID = actionObj[2];

                        var contextType = actionObj[3];

                        if (modalID != 0) {
                            _modalID = _modalID - 1;

                            $("#actContextModal" + modalID).modal("hide");
                        }

                        openModalContext(
                            _modalID,
                            actContextID,
                            contextType,
                            [],
                            objKey,
                            _parObjType
                        );
                    }
                }
            },
        });
    };
}

function saExecutor(formData, _parContextID) {

    var _formData = formData;

    this.submit = function () {
        formData.append("responseToken", genResponseToken());

        $.ajax({
            type: "POST",

            url: "App_Sys/Services/EditActivity.asmx/EditData",

            data: _formData,

            contentType: false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.stringify(jqXHR));
            },

            success: function (data) {
                var data =
                    data.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                var objKey;

                var requestToken;

                if (data.indexOf("#error#") == -1) {
                    var items = data.split("#");

                    objKey = items[1];

                    requestToken = items[2];
                } else {
                    alert(data.replace("#error#", "").replace("<br/>", "\n\r"));

                    return;
                }

                setRequestToken(requestToken);

                if (_parContextID == null || _parContextID === undefined) {
                    $(".btn-refresh").first().trigger("click");
                } else {
                    //Samen Compatibility
                    if (_formData.get("id") != 1025153) {
                        $$ParentContexts[_parContextID].ajax.reload(null, false);
                    } else {
                    }
                }
            },
        });
    };
}

function iaExecutor(formData) {

    var _formData = formData;

    var result = null;

    this.getResult = function () {
        return result;
    };

    this.submit = function () {
        formData.append("responseToken", genResponseToken());

        $.ajax({
            type: "POST",

            url: "App_Sys/Services/EditActivity.asmx/EditData",

            data: _formData,

            contentType: false,

            dataType: "xml",

            processData: false,

            async: false,

            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.stringify(jqXHR));
            },

            success: function (data) {
                var data =
                    data.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                var requestToken;

                if (data.indexOf("#error#") == -1) {
                    var items = data.split("#");

                    result = items[1];

                    requestToken = items[2];
                } else {
                    alert(data.replace("#error#", "").replace("<br/>", "\n\r"));

                    return;
                }

                setRequestToken(requestToken);
            },
        });
    };
}

function rdExecutor(formData, _alert) {

    var _formData = formData;

    _formData.append("responseToken", genResponseToken());

    this.submit = function () {
        $.ajax({
            type: "POST",

            url: "../../App_Sys/Services/Admin/Report.asmx/EditDesign",

            data: _formData,

            contentType: false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.stringify(jqXHR));
            },

            success: function (data) {
                var data =
                    data.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                var requestToken;

                if (data.indexOf("error") == -1 && data.indexOf("invalid") == -1 && data.indexOf("denied") == -1) {

                    requestToken = data;

                    if (_alert) {
                        swal(`${reportResources.get("saveComplete")}`, {
                            icon: "success",
                            button: `${reportResources.get("ok")}`,
                        });

                    }
                } else {
                    if (data.indexOf("error") != -1)
                        alert(data);
                    else
                        if (window.location.port == 80 || window.location.port == 443)
                            jQuery.redirect('../Default.aspx', {}, 'POST', '');
                        else
                            jQuery.redirect(window.location.protocol + '//' + window.location.hostname + '/MainDesk.aspx', {}, 'POST', '');
                    return;
                }

                setRequestToken(requestToken);
            },
        });
    };
}

function pdExecutor(formData, _alert) {

    var _formData = formData;

    _formData.append("responseToken", genResponseToken());

    this.submit = function () {
        $.ajax({
            type: "POST",

            url: "../../App_Sys/Services/Admin/Process.asmx/EditDesign",

            data: _formData,

            contentType: false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.stringify(jqXHR));
            },

            success: function (data) {

                var data = data.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                var requestToken;

                if (data.indexOf("error") == -1 && data.indexOf("invalid") == -1 && data.indexOf("denied") == -1) {

                    requestToken = data;

                    if (_alert)
                    {
                        //Alert for this userTask have not form
                        if (_ListTaskNotForm != "") {
                            alert(
                                `طراحی مورد نظر به دلیل نداشتن فرم در فعالیت های  "${_ListTaskNotForm.slice(
                                    0,
                                    -1
                                )}"  قابل اجرا نمی باشد و فقط ذخیره می شود.`
                            );
                        }
                        swal(
                            `${mxResources.get("registrationsuccessfully")}`,
                            `${mxResources.get("saveComplete")}`,
                            {
                                icon: "success",
                                button: `${mxResources.get("ok")}`,
                            }
                        );
                    }
                } else {

                    if (data.indexOf("error") != -1)
                        alert(data);
                    else
                        if (window.location.port == 80 || window.location.port == 443)
                            jQuery.redirect('../Default.aspx', {}, 'POST', '');
                        else
                            jQuery.redirect(window.location.protocol + '//' + window.location.hostname + '/MainDesk.aspx', {}, 'POST', '');

                    return;
                }

                setRequestToken(requestToken);
            },
        });
    };
}

function fdExecutor(formData, _alert) {

    var _formData = formData;

    _formData.append("responseToken", genResponseToken());

    this.submit = function () {
        $.ajax({
            type: "POST",

            url: "../../App_Sys/Services/Admin/Form.asmx/EditDesign",

            data: _formData,

            contentType: false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.stringify(jqXHR));
            },

            success: function (data) {

                var data = data.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                var requestToken;

                if (data.indexOf("error") == -1 && data.indexOf("invalid") == -1 && data.indexOf("denied") == -1) {

                    requestToken = data;

                    if (_alert) {
                        swal(
                            `${formResources.get("registrationsuccessfully")}`,
                            `${formResources.get("saveComplete")}`,
                            {
                                icon: "success",
                                button: `${formResources.get("ok")}`,
                            }
                        );
                    }
                } else {
                    if (data.indexOf("error") != -1)
                        alert(data);
                    else
                        if (window.location.port == 80 || window.location.port == 443)
                            jQuery.redirect('../Default.aspx', {}, 'POST', '');
                        else
                            jQuery.redirect(window.location.protocol + '//' + window.location.hostname + '/MainDesk.aspx', {}, 'POST', '');
                    return;
                }

                setRequestToken(requestToken);
            },
        });
    };
}

function qdExecutor(formData, _alert) {

    var _formData = formData;

    _formData.append("responseToken", genResponseToken());

    this.submit = function () {
        $.ajax({
            type: "POST",

            url: "../../App_Sys/Services/Admin/Query.asmx/EditDesign",

            data: _formData,

            contentType: false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.stringify(jqXHR));
            },

            success: function (data) {
                var data =
                    data.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                var requestToken;

                if (data.indexOf("error") == -1 && data.indexOf("invalid") == -1 && data.indexOf("denied") == -1) {

                    requestToken = data;

                    if (_alert) {
                        swal(
                            `${queryResources.get("registrationsuccessfully")}`,
                            `${queryResources.get("saveComplete")}`,
                            {
                                icon: "success",
                                button: `${queryResources.get("ok")}`,
                            }
                        );
                    }
                } else {
                    if (data.indexOf("error") != -1)
                        alert(data);
                    else
                        if (window.location.port == 80 || window.location.port == 443)
                            jQuery.redirect('../Default.aspx', {}, 'POST', '');
                        else
                            jQuery.redirect(window.location.protocol + '//' + window.location.hostname + '/MainDesk.aspx', {}, 'POST', '');
                    return;
                }

                setRequestToken(requestToken);
            },
        });
    };
}

function edExecutor(formData, _alert) {

    var _formData = formData;

    this.submit = function () {
        $.ajax({
            type: "POST",

            url: "../../App_Sys/Services/Admin/Entity.asmx/EditDesign",

            data: _formData,

            contentType: false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {

                alert(JSON.stringify(jqXHR));
            },

            success: function (data) {

                var data =
                    data.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                var requestToken;

                if (data.indexOf("error") == -1) {
                    requestToken = data;

                    if (_alert)
                        swal(
                            `${EntityResources.get("registrationsuccessfully")}`,
                            `${EntityResources.get("saveComplete")}`,
                            {
                                icon: "success",
                                button: `${EntityResources.get("ok")}`,
                            }
                        );
                } else {
                    alert(data);

                    return;
                }

                // setRequestToken(requestToken);
            },
        });
    };
}

function ddExecutor(formData, _alert) {

    var _formData = formData;

    this.submit = function () {
        $.ajax({
            type: "POST",

            url: "../../App_Sys/Services/Admin/Dashboard.asmx/EditDesign",

            data: _formData,

            contentType: false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.stringify(jqXHR));
            },

            success: function (data) {
                var data =
                    data.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                var requestToken;

                if (data.indexOf("error") == -1) {
                    requestToken = data;
                    if (_alert)
                        swal(
                            `${dashResources.get("registrationsuccessfully")}`,
                            `${dashResources.get("saveComplete")}`,
                            {
                                icon: "success",
                                button: `${dashResources.get("ok")}`,
                            }
                        );
                } else {
                    alert(data);

                    return;
                }

                setRequestToken(requestToken);
            },
        });
    };
}

function udExecutor(formData, _alert) {

    var _formData = formData;

    _formData.append("responseToken", genResponseToken());

    this.submit = function () {
        $.ajax({
            type: "POST",

            url: "../../App_Sys/Services/Admin/Document.asmx/EditDesign",

            data: _formData,

            contentType: false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.stringify(jqXHR));
            },

            success: function (data) {

                var data = data.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                var requestToken;

                if (data.indexOf("error") == -1 && data.indexOf("invalid") == -1 && data.indexOf("denied") == -1) {

                    requestToken = data;

                    if (_alert) {
                        swal(
                            `${docResources.get("registrationsuccessfully")}`,
                            `${docResources.get("saveComplete")}`,
                            {
                                icon: "success",
                                button: `${docResources.get("ok")}`,
                            }
                        );
                    }
                } else {
                    if (data.indexOf("error") != -1)
                        alert(data);
                    else
                        if (window.location.port == 80 || window.location.port == 443)
                            jQuery.redirect('../Default.aspx', {}, 'POST', '');
                        else
                            jQuery.redirect(window.location.protocol + '//' + window.location.hostname + '/MainDesk.aspx', {}, 'POST', '');
                    return;
                }

                setRequestToken(requestToken);
            },
        });
    };
}

function encryptInput(value) {

  setMaxDigits(131);

  var key = new RSAKeyPair(
    "010001",
    "",
    "B94B29310532C53C2F3E2A06D1B40C1F91FCA1777A76ABA8EBD4EDE34407E0F113CACECAC826B844C46724C4C7DC1E8AF61D7F41A17444EB58CF8021B7A5BD1D773A72F3809987E0F41FBC1EEABD8FDE4AB2537A22B00A02E4874BE4E9392E0BD0544AA0D11143E719762628D36AD084EE78A71488C7DD279C1C110212016CA7"
  );
  return encryptedString(key, base64Encode(value));
}

function passwordInput(value) {

  return encryptInput(hashp(value));
}

function base64Encode(str) {

  var base64EncodeChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  var base64DecodeChars = new Array(
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    62,
    -1,
    -1,
    -1,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    -1,
    -1,
    -1,
    -1,
    -1
  );

  var out, i, len;

  var c1, c2, c3;

  len = str.length;

  i = 0;

  out = "";

  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;

    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);

      out += base64EncodeChars.charAt((c1 & 0x3) << 4);

      out += "==";

      break;
    }

    c2 = str.charCodeAt(i++);

    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);

      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));

      out += base64EncodeChars.charAt((c2 & 0xf) << 2);

      out += "=";

      break;
    }

    c3 = str.charCodeAt(i++);

    out += base64EncodeChars.charAt(c1 >> 2);

    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));

    out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));

    out += base64EncodeChars.charAt(c3 & 0x3f);
  }

  return out;
}

function esExecutor(formData) {

    var _formData = formData;

    var result = null;

    this.getResult = function () {
        return result;
    };

    this.submit = function () {
        formData.append("responseToken", genResponseToken());

        $.ajax({
            type: "POST",

            url: "App_Sys/Services/CustomActivity.asmx/ExternalService",

            data: _formData,

            contentType: false,

            dataType: "xml",

            processData: false,

            async: false,

            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.stringify(jqXHR));
            },

            success: function (data) {
                var data =
                    data.getElementsByTagName("string")[0].childNodes[0].nodeValue;
              
                var requestToken;

                if (data.indexOf("#error#") == -1) {
                    var items = data.split("#");

                    result = items[1];

                    //Custom Actions

                    requestToken = items[2];

                } else {
                    alert(data.replace("#error#", "").replace("<br/>", "\n\r"));

                    return;
                }

                setRequestToken(requestToken);
            },
        });
    };
}

function saveFile(fileData) {

    var _fileData = fileData;

    var _fileKey;

    this.submit = function () {
        _fileData.append("responseToken", genResponseToken());

        $.ajax({
            type: "POST",

            url: "App_Sys/Services/CustomActivity.asmx/SaveFile",

            data: _fileData,

            contentType: false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {

                $(".wrapper").unblock();

                _errorMsseage = jqXHR.errorThrown;

                if (
                    _errorMsseage == "" ||
                    _errorMsseage == null ||
                    _errorMsseage === undefined
                ) {
                    alert(JSON.stringify(jqXHR));
                } else {
                    alert(_errorMsseage);
                }
            },

            success: function (data) {

                $(".wrapper").unblock();

                var data =
                    data.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                var requestToken;

                if (data.indexOf("#error#") == -1) {

                    _fileKey = data;

                    //var items = data.split("#");

                    //_fileKey = items[1];

                    //requestToken = items[2];
                } else {
                    data = data.replace("#error#", "");

                    alert(data);
                }

                setRequestToken(requestToken);
            },
        });
    };

    return _fileKey;
}
