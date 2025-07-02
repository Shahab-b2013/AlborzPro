// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0

function timeLineView(id, objKey) {

    var _actContextID = id;

    var _objKey = objKey;

    var _data;

    //Not Released
    this.renderContext = function (pageElementID) {

        var bodyID = '#box-body-' + pageElementID;

        cache = localStorage.getItem("timeline$" + _actContextID);

        if (!cache) {

            _timeLineOptions = new iData('c0e1bdd1-04b6-4f84-a520-4832c51c0a24', _actContextID);

            _timeLineOptions = _timeLineOptions.getObject();

            localStorage.setItem("timeline$" + _actContextID, JSON.stringify(_timeLineOptions));
        }
        else {

            _timeLineOptions = jQuery.parseJSON(cache);
        }

        _data = new aData(_timeLineOptions.ActivityID, null, _objKey, '');

        if (_data.getError() != null) {

            raiseError(_data.getError(), bodyID);

            return;
        }

        _data = _data.getList();

        $(bodyID).html('');

        var datetimeField = _timeLineOptions.DatetimeFieldName;

        var ownerField = _timeLineOptions.OwnerFieldName;

        var ownerFaceField = 'Sys_Users_FaceImage';

        var titleField = _timeLineOptions.TitleFieldName;

        var subtitleField = _timeLineOptions.SubtitleFieldName;

        var descField = _timeLineOptions.DescriptionFieldName;

        var statusField = _timeLineOptions.StatusFieldName;

        var statusColorField = _timeLineOptions.StatusColorFieldName;

        var timeFaceField = 'Sys_Users_FaceImage';

        $(bodyID).append('<div class="direct-chat-messages" id="timeLine-"' + pageElementID + '" style="height:auto"></div>');

        try {

            $.each(_data, function (index, timeLine) {

                $("#timeLine-" + pageElementID).append('<div class="direct-chat-msg ' + (index % 2 == 0 ? '' : 'right') + ' timeLine">' +
                    '<div class="direct-chat-info clearfix">' +
                    '<span class="direct-chat-timestamp pull-' + (index % 2 == 0 ? 'left' : 'right') + '">' + timeLine[datetimeField] + '</span>' +
                    '<span class="direct-chat-name  pull-' + (index % 2 == 0 ? 'right' : 'left') + '">' + timeLine[ownerField] + '</span>' +
                    '</div>' +
                    '<img class="direct-chat-img" src="App_Res/Images/Users/' + timeLine[ownerFaceField] + '">' +
                    '<div class="direct-chat-text timeLineBox">' +
                    '<h5 class="timeline-title">' + timeLine[titleField] + '</h5>' +
                    //'<h6 class="timeline-subtitle">' + timeLine[subtitleField] + '</h6>' +
                    '<div class="timeline-text">' +
                    '<div class="timeline-inner-text">' +
                    timeLine[descField] +
                    '</div>' +
                    '</div>' +
                    '<h6 class="timeline-status" style="color:' + timeLine[statusColorField] + '">' + timeLine[statusField] + '</h6>' +
                    '</div>' +
                    '</div>');

            });
        }
        catch (e) {

            raiseError(e, bodyID);

            return;
        }
    }

    this.renderModalContext = function (modalID) {

        var bodyID = '#boxBodyModal' + modalID;

        var boxID = '#pageBoxModal' + modalID;

        _modalID = modalID;

        //#region Load TimeLine Metadata & Load data

        cache = localStorage.getItem(window.btoa("timeline$" + _actContextID));

        if (!cache) {

            _timeLineOptions = new iData('c0e1bdd1-04b6-4f84-a520-4832c51c0a24', _actContextID);

            _timeLineOptions = _timeLineOptions.getObject();

            localStorage.setItem(window.btoa("timeline$" + _actContextID), reverse(encodeURI(JSON.stringify(_timeLineOptions))));
        }
        else {

            _timeLineOptions = jQuery.parseJSON(decodeURI(reverse(cache)));
        }

        _data = new aData(_timeLineOptions.ActivityID, null, _objKey, '');
        if (_data.getError() != null) {

            raiseError(_data.getError(), bodyID);

            return;
        }

        _data = _data.getList();

        //#endregion

        $(boxID + ' .box-title').html(_timeLineOptions.Label);

        if (_objKey != null) {

            $(boxID + ' .box-title').html(_timeLineOptions.Label + " [ " + ($$Lang == "Fa" ? "شناسه " : "ID ") + _objKey + " ]");
        }

        if ($Data != null) {

            $(boxID + ' .box-title').html(_timeLineOptions.Label + " [ " + $Data + " ]");
        }

        $(bodyID).html('');

        //#region Render TimeLine

        var datetimeField = _timeLineOptions.DatetimeFieldName;

        var ownerField = _timeLineOptions.OwnerFieldName;

        var keyField = 'ObjectID';

        var ownerFaceField = 'FaceImage';

        var elapsedTimeField = 'ElapsedTime';

        var durationTimeField = 'DurationTime';

        var titleField = _timeLineOptions.TitleFieldName;

        var subtitleField = _timeLineOptions.SubtitleFieldName;

        var descField = _timeLineOptions.DescriptionFieldName;

        var statusField = _timeLineOptions.StatusFieldName;

        var statusColorField = _timeLineOptions.StatusColorFieldName;

        var attachmentField = _timeLineOptions.AttachmentFieldName;

        var points = '';

        $(bodyID).append('<div class="direct-chat-messages" id="timeLine-' + modalID + '" style="height:auto"></div>');

        //Sepad Compatibility
        if ($$UserProp.MasterRole.indexOf('امن پرداز') > -1 && $$PackageName == 'سامانه پشتیبانی پادویش') {

            $("#timeLine-" + modalID).append('<button type="button" id="btnAdd" onclick="openModalContext(_modalID + 1, 1026351,\'FormView\', [' + _objKey + '], 0, null, 0);" class="btn btn-success" >اقدام جدید</button><br/><br/>');
        }

        //BPMS Compatibility
        if ($PForm.Name != "" && $PForm.TaskId != "") {

            //$("#timeLine-" + modalID).append('&nbsp;&nbsp;<button type="button" id="btnAdd" onclick="openTModalContext(_modalID + 1, ' + $PForm.FormId + ',\'FormView\', [' + _objKey + '], 0, null, 0,' + $PForm.TaskId + ');" class="btn btn-success" >' + $PForm.Label + '</button><br/><br/>');
        }


        try {

            $.each(_data, function (index, timeLine) {

                if ($$PackageName == 'سامانه پشتیبانی پادویش') {

                    //Sepad Compatibility
                    if ($$UserProp.MasterRole.indexOf('ارشد پشتیبانی') == -1) {

                        if (timeLine["WritingPoints"] != null && timeLine["WritingPoints"] != '') {

                            points = '<h5 class="timeline-status pull-left">امتیاز نگارش : <b> ' + timeLine["WritingPoints"] + ' از 5</b></h5>';
                        }
                        else
                            points = '';
                    }
                    else {

                        points = '<h5 class="timeline-status pull-left">امتیاز نگارش : <select id="timeline-writing-points" onchange="changeWritingPoints(this.value,' + timeLine[keyField] + ')">' +
                            '<option value=""> N </option>' +
                            '<option value="0"' + (timeLine["WritingPoints"] == '0' ? 'selected' : '') + '> 0 </option>' +
                            '<option value="1"' + (timeLine["WritingPoints"] == '1' ? 'selected' : '') + '> 1 </option>' +
                            '<option value="2"' + (timeLine["WritingPoints"] == '2' ? 'selected' : '') + '> 2 </option>' +
                            '<option value="3"' + (timeLine["WritingPoints"] == '3' ? 'selected' : '') + '> 3 </option>' +
                            '<option value="4"' + (timeLine["WritingPoints"] == '4' ? 'selected' : '') + '> 4 </option>' +
                            '<option value="5"' + (timeLine["WritingPoints"] == '5' ? 'selected' : '') + '> 5 </option>' +
                            '</select ></h5> ';
                    }
                }
                $("#timeLine-" + modalID).append('<div class="direct-chat-msg ' + (index % 2 == 0 ? '' : 'right') + ' timeLine">' +
                    '<div class="direct-chat-info clearfix">' +
                    '<span class="direct-chat-timestamp pull-' + (index % 2 == 0 ? 'left' : 'right') + '">' + timeLine[datetimeField] + '</span>' +
                    '<span class="direct-chat-name  pull-' + (index % 2 == 0 ? 'right' : 'left') + '">' + timeLine[ownerField] + '</span>' +
                    '</div>' +
                    '<img class="direct-chat-img" src="App_Res/Images/Users/' + timeLine[ownerFaceField] + '">' +
                    '<div class="direct-chat-text timeline-box">' +
                    '<h5 class="timeline-title"> <b>' + timeLine[titleField].replace('شده', '').replace('خورده', '') + ($$Lang == 'En' ? " (" + timeLine[elapsedTimeField].replace("ماه", "Month").replace("روز", "Day").replace("ساعت", " Hour").replace("دقیقه", "Minute").replace("قبل", "Ago") + ") </b>" : " (" + timeLine[elapsedTimeField] + ") </b>") + (jQuery.parseJSON(timeLine['AllowUpdate'] && $$UserProp.MasterRole.indexOf('امن پرداز') > -1) ? '<img src="App_Res/Images/Page/16/Edit2.png" style="cursor:pointer" onclick="openEditForm(' + timeLine[keyField] + ')">' : '') + '</h5>' +
                    //'<h6 class="timeline-subtitle">' + timeLine[subtitleField] + (timeLine[durationTimeField] != '' ? ' ' + ($$Lang == 'Fa' ? 'به مدت' : 'for')+' ' + timeLine[durationTimeField] : '') + '</h6>' +
                    '<div class="timeline-text">' +
                    '<div class="timeline-inner-text">' +
                    timeLine[descField] +
                    '</div>' +
                    (timeLine[attachmentField] != '' ? timeLine[attachmentField] + '<br/><br/>' : '') +
                    (timeLine[attachmentField + '2'] != '' ? timeLine[attachmentField + '2'] + '<br/><br/>' : '') +
                    (timeLine[attachmentField + '3'] != '' ? timeLine[attachmentField + '3'] + '<br/><br/>' : '') +
                    (timeLine[attachmentField + '4'] != '' ? timeLine[attachmentField + '4'] + '<br/><br/>' : '') +
                    '</div>' +
                    '<h5 class="timeline-status" style="color:' + timeLine[statusColorField] + '">' + ($$Lang == 'Fa' ? 'وضعیت' : 'Status') + ':<b> ' + timeLine[statusField] + '</b></h5>' +
                    points +
                    '</div>' +
                    '</div><br/>');

            });
        }
        catch (e) {

            raiseError(e, bodyID);

            return;
        }

        $('.btn-download-grid').on('click', function () {

            jQuery.redirect('App_Sys/Utilities/File.Downloader.aspx', { 'id': _timeLineOptions.ActivityID, 'code': $(this).attr('data-file-attach-code'), 'requestToken': genResponseToken() }, 'POST', '_blank');
        });

        //#endregion

        //#region Render Footer

        $('#boxFooterModal' + modalID).html('');

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

//Sepad Compatibility
function changeWritingPoints(point, objectID) {

    var data = new FormData();

    var __objKeys = [objectID];

    var activiyParams = new Array();

    activiyParams.push({
        ParamIndex: 0,
        ParamName: "WritingPoints",
        ParamValue: point,
        FileIsExist: 2,
        FileAttachCode: ""
    });

    data.append('activiyParams', JSON.stringify(activiyParams));

    data.append('objectIDs', JSON.stringify(__objKeys));

    data.append('id', 1020150);

    var $aExecutor = new saExecutor(data);

    $aExecutor.submit();

    if ($$Lang == 'Fa') {
        alert('عملیات با موفقیت انجام شد.');
    }
    else {
        alert('Record was successfully updated.');
    }
}

//Sepad Compatibility
function openEditForm(objectID) {

    openModalContext(2, 1020103, 'FormView', [objectID], 0, null, null)
}