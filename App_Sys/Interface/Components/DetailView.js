// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
/* Release Ferdos.WebAppDesk 4.1.0.0*/

function detailView(id, objKey) {

    var _actContextID = id;

    var _objKey = objKey;

    var _detailItems;

    var _data;

    var _clipBoard = "";

    this.renderContext = function (pageElementID) {

        var bodyID = '#box-body-' + pageElementID;

        var boxID = '#page-box-' + pageElementID;

        //#region Load Detail Metadata

        cache = localStorage.getItem(window.btoa("detail$" + _actContextID));

        if (!cache || true) {

            _detail = new iComData('detail', _actContextID, _objKey, null);

            _detail = _detail.getData();

            localStorage.setItem(window.btoa("detail$" + _actContextID), reverse(encodeURI(JSON.stringify(_detail))));
        } else {

            _detail = jQuery.parseJSON(decodeURI(reverse(cache)));
        }

        _detailOptions = _detail.options;

        _detailItems = _detail.items;

        _data = new aData(_detailOptions.ActivityID, _objKey, null);

        if (_data.getError() != null) {

            raiseError(_data.getError(), bodyID);

            return;
        }

        _data = _data.getObject();

        //#endregion 

        $(boxID + ' .box-title').html(_detailOptions.Label);

        $(bodyID).html('');

        //#region Render Detail Items

        //$(bodyID).append("<h4>The detail is copied to your clipboard</h4>");

        $(bodyID).append('<dl class="dl-horizontal d-contents" id="dl-' + pageElementID + '"></dl>');

        try {

            $.each(_detailItems, function (index, detailItem) {

                $('#dl-' + pageElementID).append('<dt><span>' + detailItem.Label + '</span></dt>');

                var value = _data[detailItem.DataFieldName];

                _clipBoard = _clipBoard + detailItem.Label + ':' + value + "\n";

                if (detailItem.DetailType == 'Value') {

                    $('#dl-' + pageElementID).append('<dd>' + value + '</dd>');
                }

                if (detailItem.DetailType == 'Bool') {

                    if (value != null && value != '') {
                        if (jQuery.parseJSON(value.toLowerCase())) {

                            $('#dl-' + pageElementID).append('<dd><input class="detail-checkbox" type="checkbox" checked disabled/></dd>');
                        } else {

                            $('#dl-' + pageElementID).append('<dd><input class="detail-checkbox" type="checkbox" disabled/></dd>');
                        }
                    }
                }

                if (detailItem.DetailType == 'Text') {

                    if (detailItem.Name.indexOf('DoD') == -1)
                        $('#dl-' + pageElementID).append('<dd>' + value + '</dd>');
                    else {
                        $('#dl-' + pageElementID).append('<dd style="border-bottom:1px solid #d3d3d3;">' + decodeHtml(value) + '<br/></dd><br/>');
                        //$(bodyID).append('<div class= "modal fade" id = "Modal-' + detailItem.DetailItemID + '" role = "dialog" > ' +
                        //    '<div class="modal-dialog">' +
                        //    '<div class="modal-content">' +
                        //    '<div class="modal-header">' +
                        //    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                        //    '<h4 class="modal-title">' + detailItem.Label + '</h4>' +
                        //    '</div>' +
                        //    '<div class="modal-body">' +
                        //    decodeHtml(value) +
                        //    '</div>' +
                        //    '<div class="modal-footer">' +
                        //    '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                        //    '</div>' +
                        //    '</div>' +
                        //    '</div>')
                        //$('#dl-' + pageElementID).append('<dd><a href="#" onclick="$(\'#Modal-' + detailItem.DetailItemID + '\').modal({show:true});">مشاهده جزییات</a></dd>');
                    }
                }

                if (detailItem.DetailType == 'File') {

                    if (toString(value).indexOf("btn-download-grid") > -1)
                        $('#dl-' + pageElementID).append('<dd>' + value + '</dd>');
                    else
                        if (value != '')
                            $('#dl-' + pageElementID).append('<dd><span class="btn-download-grid fa fa-download" data-file-attach-code=' + value + ' title="download">&nbsp;&nbsp;<a class="btn-download-grid-link"></a></span></dd>');
                        else
                            $('#dl-' + pageElementID).append('<dd></dd>');
                }
            });


            //BPMS Compatibility
            if ($PForm.Name != "" && $PForm.TaskId != "") {

                //$('#dl-' + pageElementID).append('<br/>&nbsp;&nbsp;<button type="button" id="btnAdd" onclick="openTModalContext(_modalID + 1, ' + $PForm.FormId + ',\'FormView\', [' + _objKey + '], 0, null, 0,' + $PForm.TaskId+');" class="btn btn-success" >' + $PForm.Label + '</button>');
            }


            $('.detail-checkbox').iCheck({

                checkboxClass: 'icheckbox_square-green',

                radioClass: 'iradio_square-green',

                increaseArea: '20%' // optional
            });
        } catch (e) {

            raiseError(e, bodyID);

            return;
        }

        $('.btn-download-grid').on('click', function () {

            jQuery.redirect('App_Sys/Utilities/File.Downloader.aspx', {
                'id': _detailOptions.ActivityID,
                'code': $(this).attr('data-file-attach-code'),
                'requestToken': genResponseToken()
            }, 'POST', '_blank');

        });

        //navigator.clipboard.writeText(_clipBoard);

        //#endregion

    }

    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
}