// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0

function timeLineView(id, objKey) {
  var _actContextID = id;

  var _objKey = objKey;

  var _data;

  //Not Released
  this.renderContext = function (pageElementID) {
    var bodyID = "#box-body-" + pageElementID;

    cache = localStorage.getItem("timeline$" + _actContextID);

    if (!cache) {
      _timeLineOptions = new iData(
        "c0e1bdd1-04b6-4f84-a520-4832c51c0a24",
        _actContextID
      );

      _timeLineOptions = _timeLineOptions.getObject();

      localStorage.setItem(
        "timeline$" + _actContextID,
        JSON.stringify(_timeLineOptions)
      );
    } else {
      _timeLineOptions = jQuery.parseJSON(cache);
    }

    _data = new aData(_timeLineOptions.ActivityID, null, _objKey, "");

    if (_data.getError() != null) {
      raiseError(_data.getError(), bodyID);

      return;
    }

    _data = _data.getList();

    $(bodyID).html("");

    var datetimeField = _timeLineOptions.DatetimeFieldName;

    var ownerField = _timeLineOptions.OwnerFieldName;

    var ownerFaceField = "Sys_Users_FaceImage";

    var titleField = _timeLineOptions.TitleFieldName;

    var subtitleField = _timeLineOptions.SubtitleFieldName;

    var descField = _timeLineOptions.DescriptionFieldName;

    var statusField = _timeLineOptions.StatusFieldName;

    var statusColorField = _timeLineOptions.StatusColorFieldName;

    var timeFaceField = "Sys_Users_FaceImage";

    $(bodyID)
      .append(`<ul class="nav nav-tabs" id="ul-1"><li id="tool-item-1" data-index="0" class="active" onclick="">
        <a style="cursor:pointer" data-toggle="tab" class="tab-box-text">&nbsp;My Requests </a></li>
        <li id="tool-item-2" data-index="1" class="" onclick="">
        <a style="cursor:pointer" data-toggle="tab" class="tab-box-text">&nbsp;My Tasks </a></li>
        </ul>`);

    $(`#tool-item-1`).append(
      '<div class="direct-chat-messages" id="timeLine-"' +
        pageElementID +
        '" style="height:auto"></div>'
    );

    try {
      $.each(_data, function (index, timeLine) {
        $("#timeLine-" + pageElementID).append(
          '<div class="direct-chat-msg  timeLine">' +
            '<div class="direct-chat-info clearfix">' +
            '<span class="direct-chat-timestamp pull-' +
            (index % 2 == 0 ? "left" : "left") +
            '">' +
            timeLine[datetimeField] +
            "</span>" +
            '<span class="direct-chat-name  pull-' +
            (index % 2 == 0 ? "right" : "right") +
            '">' +
            timeLine[ownerField] +
            "</span>" +
            "</div>" +
            '<img class="direct-chat-img" src="App_Res/Images/Users/' +
            timeLine[ownerFaceField] +
            '">' +
            '<div class="direct-chat-text timeLineBox">' +
            '<h5 class="timeline-title">' +
            timeLine[titleField] +
            "</h5>" +
            //'<h6 class="timeline-subtitle">' + timeLine[subtitleField] + '</h6>' +
            '<div class="timeline-text">' +
            '<div class="timeline-inner-text">' +
            timeLine[descField] +
            "</div>" +
            "</div>" +
            '<h6 class="timeline-status" style="color:' +
            timeLine[statusColorField] +
            '">' +
            timeLine[statusField] +
            "</h6>" +
            "</div>" +
            "</div>"
        );
      });
    } catch (e) {
      raiseError(e, bodyID);

      return;
    }
  };

  this.renderModalContext = function (modalID) {
    var bodyID = "#boxBodyModal" + modalID;

    var boxID = "#pageBoxModal" + modalID;

    _modalID = modalID;

    //#region Load TimeLine Metadata & Load data

    cache = localStorage.getItem(window.btoa("timeline$" + _actContextID));

    if (!cache) {
      _timeLineOptions = new iData(
        "c0e1bdd1-04b6-4f84-a520-4832c51c0a24",
        _actContextID
      );

      _timeLineOptions = _timeLineOptions.getObject();

      localStorage.setItem(
        window.btoa("timeline$" + _actContextID),
        reverse(encodeURI(JSON.stringify(_timeLineOptions)))
      );
    } else {
      _timeLineOptions = jQuery.parseJSON(decodeURI(reverse(cache)));
    }

    _data = new aData(_timeLineOptions.ActivityID, null, _objKey, "");
    if (_data.getError() != null) {
      raiseError(_data.getError(), bodyID);

      return;
    }

    _data = _data.getList();

    //#endregion

    $(boxID + " .box-title").html(_timeLineOptions.Label);

    if (_objKey != null) {
      $(boxID + " .box-title").html(
        _timeLineOptions.Label +
          " [ " +
          ($$Lang == "Fa" ? "شناسه " : "ID ") +
          _objKey +
          " ]"
      );
    }

    if ($Data != null) {
      $(boxID + " .box-title").html(
        _timeLineOptions.Label + " [ " + $Data + " ]"
      );
    }

    $(bodyID).html("");

    //#region Render TimeLine

    var datetimeField = _timeLineOptions.DatetimeFieldName;

    var ownerField = _timeLineOptions.OwnerFieldName;

    var keyField = "ObjectID";

    var ownerFaceField = "FaceImage";

    var elapsedTimeField = "ElapsedTime";

    var durationTimeField = "DurationTime";

    var titleField = _timeLineOptions.TitleFieldName;

    var subtitleField = _timeLineOptions.SubtitleFieldName;

    var descField = _timeLineOptions.DescriptionFieldName;

    var statusField = _timeLineOptions.StatusFieldName;

    var statusColorField = _timeLineOptions.StatusColorFieldName;

    var attachmentField = _timeLineOptions.AttachmentFieldName;

    var points = "";

    let historyTab = `<ul class="nav nav-tabs" id="ul-1">`;

    historyTab += ` <li id="History-tab" data-index="0" class="tablinks active" onclick="tabOnActiion('History-tab','timeLine-${modalID}')">
        <a style="cursor:pointer" data-toggle="tab" class="tab-box-text">&nbsp;History </a></li>`;

    if ($(`#userLabel span`).text().trim() != "Analyzer") {
      historyTab += `<li id="Alert-tab" data-index="1" class="tablinks" onclick="tabOnActiion('Alert-tab','Alert-${_objKey}')">
         <a style="cursor:pointer" data-toggle="tab" class="tab-box-text">&nbsp;Alerts </a></li>`;

      // historyTab += `<li id="Comment-tab" data-index="2" class="tablinks" onclick="tabOnActiion('Comment-tab','Comment-${_objKey}')">
      //    <a style="cursor:pointer" data-toggle="tab" class="tab-box-text">&nbsp;Comments </a></li>`;
    }

    historyTab += `</ul>`;

    $(bodyID).append(historyTab);

    $(bodyID).append(
      `<div class="direct-chat-messages tabcontent" id="timeLine-${modalID}" style="height:auto"></div>`
    );

    if ($(`#userLabel span`).text().trim() != "Analyzer") {
      $(bodyID).append(
        `<div class="direct-chat-messages tabcontent" id="Alert-${_objKey}" style="height:auto;display:none;"></div>`
      );

      $(bodyID).append(
        `<div class="direct-chat-messages tabcontent" id="Comment-${_objKey}" style="height:auto;display:none;"></div>`
      );
    }

    //Sepad Compatibility
    if (
      $$UserProp.MasterRole.indexOf("امن پرداز") > -1 &&
      $$PackageName == "سامانه پشتیبانی پادویش"
    ) {
      $("#timeLine-" + modalID).append(
        '<button type="button" id="btnAdd" onclick="openModalContext(_modalID + 1, 1026351,\'FormView\', [' +
          _objKey +
          '], 0, null, 0);" class="btn btn-success" >اقدام جدید</button><br/><br/>'
      );
    }
    //BPMS Compatibility
    if ($PForm.Name != "" && $PForm.TaskId != "" && $HistoryIds[objKey] != 6) {
      $("#timeLine-" + modalID).append(
        `&nbsp;&nbsp;<button type="button" id="btnAdd" onclick="openTModalContext(_modalID + 1, ` +
          $PForm.FormId +
          ",'FormView', [" +
          _objKey +
          "], 0, null, 0," +
          $PForm.TaskId +
          `);" class="btn btn-edit" >Action <img alt="Action" src="App_Res/Images/Page/16/Edit.png"></button>`
      );

      $("#timeLine-" + modalID).append(
        `&nbsp;&nbsp;<button type="button" id="btnCmt" onclick="addComment(_modalID + 1, ` +
          $PForm.FormId +
          "," +
          _objKey +
          `);" class="btn btn-edit" >Comment <img alt="Comment" style="width: 18px;margin-left: 5px;" src="App_Res/Images/Page/16/Comment.png"></button><br/><br/>`
      );

      if ($(`#userLabel span`).text().trim() != "Analyzer") {
        $("#Alert-" + _objKey).append(
          `&nbsp;&nbsp;<button type="button" id="btnAdd" onclick="openTModalContext(_modalID + 1, ` +
            $PForm.FormId +
            ",'FormView', [" +
            _objKey +
            "], 0, null, 0," +
            $PForm.TaskId +
            `);" class="btn btn-edit" >Action <img alt="Action" src="App_Res/Images/Page/16/Edit.png"></button>`
        );

        $("#Comment-" + _objKey).append(
          `&nbsp;&nbsp;<button type="button" id="btnAdd" onclick="openTModalContext(_modalID + 1, ` +
            $PForm.FormId +
            ",'FormView', [" +
            _objKey +
            "], 0, null, 0," +
            $PForm.TaskId +
            `);" class="btn btn-edit" >Action <img alt="Action" src="App_Res/Images/Page/16/Edit.png"></button>`
        );

        $("#Alert-" + _objKey).append(
          `&nbsp;&nbsp;<button type="button" id="btnCmt" onclick="addComment(_modalID + 1, ` +
            $PForm.FormId +
            "," +
            _objKey +
            `);" class="btn btn-edit" >Comment <img alt="Comment" style="width: 18px;margin-left: 5px;" src="App_Res/Images/Page/16/Comment.png"></button><br/><br/>`
        );

        $("#Comment-" + _objKey).append(
          `&nbsp;&nbsp;<button type="button" id="btnCmt" onclick="addComment(_modalID + 1, ` +
            $PForm.FormId +
            "," +
            _objKey +
            `);" class="btn btn-edit" >Comment <img alt="Comment" style="width: 18px;margin-left: 5px;" src="App_Res/Images/Page/16/Comment.png"></button><br/><br/>`
        );
      }
    }

    try {
      $.each(_data, function (index, timeLine) {
        let isComment = false;
        if (timeLine[subtitleField] == "UserComment") {
          isComment = true;
          timeLine[subtitleField] = "";
        }
        if ($$PackageName == "سامانه پشتیبانی پادویش") {
          //Sepad Compatibility
          if ($$UserProp.MasterRole.indexOf("ارشد پشتیبانی") == -1) {
            if (
              timeLine["WritingPoints"] != null &&
              timeLine["WritingPoints"] != ""
            ) {
              points =
                '<h5 class="timeline-status pull-left">امتیاز نگارش : <b> ' +
                timeLine["WritingPoints"] +
                " از 5</b></h5>";
            } else points = "";
          } else {
            points =
              '<h5 class="timeline-status pull-left">امتیاز نگارش : <select id="timeline-writing-points" onchange="changeWritingPoints(this.value,' +
              timeLine[keyField] +
              ')">' +
              '<option value=""> N </option>' +
              '<option value="0"' +
              (timeLine["WritingPoints"] == "0" ? "selected" : "") +
              "> 0 </option>" +
              '<option value="1"' +
              (timeLine["WritingPoints"] == "1" ? "selected" : "") +
              "> 1 </option>" +
              '<option value="2"' +
              (timeLine["WritingPoints"] == "2" ? "selected" : "") +
              "> 2 </option>" +
              '<option value="3"' +
              (timeLine["WritingPoints"] == "3" ? "selected" : "") +
              "> 3 </option>" +
              '<option value="4"' +
              (timeLine["WritingPoints"] == "4" ? "selected" : "") +
              "> 4 </option>" +
              '<option value="5"' +
              (timeLine["WritingPoints"] == "5" ? "selected" : "") +
              "> 5 </option>" +
              "</select ></h5> ";
          }
        }
        $("#timeLine-" + modalID).append(
          "<br>" +
            `<div class="direct-chat-msg  timeLine" ` +
            '<div class="direct-chat-info clearfix">' +
            '<span class="direct-chat-timestamp pull-' +
            (index % 2 == 0 ? "left" : "left") +
            '">' +
            timeLine[datetimeField] +
            ($$Lang == "En"
              ? " (" +
                pluralizeElapsedTime(
                  timeLine[elapsedTimeField]
                    .replace("ماه", "Month")
                    .replace("روز", "Day")
                    .replace("ساعت", "Hour")
                    .replace("دقیقه", "Minute")
                    .replace("ثانیه", "Second")
                    .replace("همین حالا", "Just Now")
                    .replace("قبل", "Ago")
                ) +
                ")"
              : " (" + timeLine[elapsedTimeField] + ")") +
            "</span>" +
            '<span class="direct-chat-name  pull-' +
            (index % 2 == 0 ? "right" : "right") +
            '">' +
            timeLine[ownerField] +
            "</span>" +
            "</div>" +
            '<img class="direct-chat-img" src="App_Res/Images/Users/' +
            timeLine[ownerFaceField] +
            '">' +
            `<div class="direct-chat-text timeline-box" style="background:${timeLine[statusColorField]}">` +
            `<h5 class="timeline-title" style=""> <b>` +
            timeLine[titleField].replace("شده", "").replace("خورده", "") +
            "</b>" +
            (jQuery.parseJSON(
              timeLine["AllowUpdate"] &&
                $$UserProp.MasterRole.indexOf("امن پرداز") > -1
            )
              ? '<img src="App_Res/Images/Page/16/Edit2.png" style="cursor:pointer" onclick="openEditForm(' +
                timeLine[keyField] +
                ')">'
              : "") +
            "</h5>" +
            //'<h6 class="timeline-subtitle">' + timeLine[subtitleField] + (timeLine[durationTimeField] != '' ? ' ' + ($$Lang == 'Fa' ? 'به مدت' : 'for')+' ' + timeLine[durationTimeField] : '') + '</h6>' +
            `<div class="timeline-text" style="${
              isComment
                ? "text-align: right;direction: rtl;border-bottom: 0 !important;border-top: 1px solid #eddfb8;"
                : ""
            }">` +
            '<div class="timeline-inner-text">' +
            timeLine[descField] +
            "</div>" +
            (timeLine[attachmentField] != ""
              ? timeLine[attachmentField] + "<br/><br/>"
              : "") +
            (timeLine[attachmentField + "2"] != ""
              ? timeLine[attachmentField + "2"] + "<br/><br/>"
              : "") +
            (timeLine[attachmentField + "3"] != ""
              ? timeLine[attachmentField + "3"] + "<br/><br/>"
              : "") +
            (timeLine[attachmentField + "4"] != ""
              ? timeLine[attachmentField + "4"] + "<br/><br/>"
              : "") +
            "</div>" +
            `<h5 class="timeline-status" style="${
              isComment ? "display:none;" : ""
            }">` +
            ($$Lang == "Fa" ? "وضعیت" : "Status") +
            ":<b> " +
            timeLine[statusField] +
            "</b></h5>" +
            points +
            "</div>" +
            "</div><br/>"
        );
      });
    } catch (e) {
      raiseError(e, bodyID);

      return;
    }

    $(".btn-download-grid").on("click", function () {
      jQuery.redirect(
        "App_Sys/Utilities/File.Downloader.aspx",
        {
          id: _timeLineOptions.ActivityID,
          code: $(this).attr("data-file-attach-code"),
          requestToken: genResponseToken(),
        },
        "POST",
        "_blank"
      );
    });

    //#endregion

    //#region Render Footer

    $("#boxFooterModal" + modalID).html("");

    $("#boxFooterModal" + modalID).append(
      '<button type="button" id="btnCnsModal' +
        modalID +
        '" class="btn btn-default btn-form-cancel" >' +
        $$Local.formClose +
        "</button>"
    );

    $("#closeBtnModal" + modalID).unbind("click");

    $("#closeBtnModal" + modalID).click(function () {
      _modalID = _modalID - 1;

      $(bodyID).html("");

      $("#boxFooterModal" + modalID).html("");
    });

    $("#btnCnsModal" + modalID).unbind("click");

    $("#btnCnsModal" + modalID).click(function () {
      $("#closeBtnModal" + _modalID).trigger("click");
    });

    //#endregion
  };
}

function pluralizeElapsedTime(text) {
  if (text.includes("Just Now")) return "Just Now";

  return text.replace(
    /(\d+)\s+(Second|Minute|Hour|Day|Month)\b/g,
    function (_, number, unit) {
      return number + " " + unit + (number === "1" ? "" : "s");
    }
  );
}

function addComment(modalID, activityID, instanceID) {
  if ($(`#comment_${modalID}`).length) {
    $(`#commentText_${modalID}`).val("");
    $(`#commentText_${modalID}`).css("border-color", "#ccc");
    $(`#commentError_${modalID}`).text("");
    $(`#comment_${modalID}`).show();
  } else {
    let modal = `
    <div class="modal" id="comment_${modalID}">
      <div class="modal-dialog" style="margin-top: 150px;width: 1000px !important;">
        <div class="modal-content">
          <div class="box box-solid">
            <div class="box-header with-border" style="background: var(--A1);">
              <h3 class="box-title" style="color: white;">
                ${$$Lang == "Fa" ? "افزودن کامنت" : "Add Comment"}
              </h3>
            </div>
            <form class="form-horizontal" id="commentForm_${modalID}">
              <div class="box-body">
              <div class="row form-group-box" style="border: 0;margin-bottom:0px !important">
                  <div class="col-md-5" id="form-group-body-text-input">
                    <label  class="control-label" style="margin-bottom: 10px;">
                      ${$$Lang == "Fa" ? "کاربران" : "Users"}
                    </label>
                    <div class="input-group">
                    <div class="input-group-addon"><i class="glyphicon glyphicon-check"></i></div>
                    <select id="selectUsers" class="select2 form-input form-control" multiple>`;

    let _data = new aData(6220008, null, null, "");
    _data = _data.getList();

    modal += `<option value="${
      $$Lang == "Fa" ? "همه کاربران" : "All Users"
    }" > ${$$Lang == "Fa" ? "همه کاربران" : "All Users"}</option>`;
    _data.forEach((val) => {
      modal += `<option value="${val.Name}">${val.Name}</option>`;
    });
    modal += `</select>
                    </div>
                  </div>
                </div>
                <div class="row form-group-box" style="border: 0;margin-bottom:0px !important">
                  <div class="col-md-5" id="form-group-body-text-input">
                    <label  class="control-label" style="margin-bottom: 10px;">
                      ${$$Lang == "Fa" ? "متن نظر" : "Comment Text"}
                    </label>
                    <div class="input-group">
                      <div class="input-group-addon">
                        <i class="glyphicon glyphicon-edit"></i>
                      </div>
                      <textarea
                        style="height: 196px;width: 824px;text-align: right;direction: rtl;"
                        class="form-control form-input"
                        id="commentText_${modalID}"
                        rows="7"
                        dir="ltr"
                      ></textarea>
                    </div>
                  </div>
                </div>
                  <span id="commentError_${modalID}" class="${
      $$Lang == "Fa" ? "pull-right " : "pull-left"
    } message-form-error"></span>
              </div>
              <div class="box-footer text-left">
                <button type="button" class="btn btn-form-submit" id="submitComment_${modalID}">
                  ${$$Lang == "Fa" ? "ثبت" : "Submit"}
                </button>
                <button type="button" class="btn btn-default btn-form-cancel" id="cancelCommit_${modalID}" data-dismiss="modal">
                  ${$$Lang == "Fa" ? "بستن" : "Close"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>`;

    $("body").append(modal);

    $(`#comment_${modalID}`).show();

    $(`#selectUsers`).select2();

    $(`[multiple]`).on("input", (e) => {
      let a = $(e.target).val();
      for (let i in a) {
        if (a[i] == "All Users") {
          $(e.target).val(["All Users"]);
        }
      }
    });
  }

  $(`#submitComment_${modalID}`)
    .off("click")
    .on("click", function () {
      //add users to comment

      let users = $(`#selectUsers`).val();
      let comment = $(`#commentText_${modalID}`).val().trim();

      if (users != undefined) comment += `</br> خطاب به  : (${users})`;

      let submitReady = true;
      if (comment == undefined || comment == "") submitReady = false;

      if (submitReady) {
        $.ajax({
          url: "../../App_Sys/Services/CustomActivity.asmx/CreateComment",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            currentIncidentID: instanceID,
            alertIDList: [],
            comment: comment,
            actionn: "",
          }),
          async: false,
          error: function (xhr, status, error) {
            console.error("Error saving comment:", error);
            alert("Failed to submit comment.");
          },
        });

        $(`#commentText_${modalID}`).val("");
        $(`#commentText_${modalID}`).css("border-color", "#ccc");
        $(`#commentError_${modalID}`).text("");
        $(`#comment_${modalID}`).remove();
        $("#closeBtnModal1").trigger("click");
        $(`#${instanceID}_timeline`).trigger("click");
      } else {
        $(`#commentText_${modalID}`).css("border-color", "red");
        $(`#commentError_${modalID}`).text(
          $$Lang == "Fa"
            ? "لطفا کامنت را وارد کنید."
            : "Please enter a comment."
        );
        return;
      }
    });

  $(`#cancelCommit_${modalID}`)
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      $(`#comment_${modalID}`).remove();
      $(`#commentText_${modalID}`).val("");
      $(`#commentText_${modalID}`).css("border-color", "#ccc");
      $(`#commentError_${modalID}`).text("");
    });

  $(`#comment_${modalID}`).on("hidden.bs.modal", function () {
    $(`#submitComment_${modalID}`).off("click");
    $(`#cancelCommit_${modalID}`).off("click");
    $(this).remove();
  });
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
    FileAttachCode: "",
  });

  data.append("activiyParams", JSON.stringify(activiyParams));

  data.append("objectIDs", JSON.stringify(__objKeys));

  data.append("id", 1020150);

  var $aExecutor = new saExecutor(data);

  $aExecutor.submit();

  if ($$Lang == "Fa") {
    alert("عملیات با موفقیت انجام شد.");
  } else {
    alert("Record was successfully updated.");
  }
}

//Sepad Compatibility
function openEditForm(objectID) {
  openModalContext(2, 1020103, "FormView", [objectID], 0, null, null);
}

function tabOnActiion(id, tabname) {
  $(`.FooterMessage`).remove();

  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabname).style.display = "block";

  let tab = document.getElementById(id);
  tab.className += " active";

  const _objKey = +tabname.split("-")[1];

  if (tabname.split("-")[0] == "Alert") {
    let _data = new aData(6220000, null, _objKey, "");
    _data = _data.getList();

    // Alert
    Alerts(_data, tabname, _objKey);
  }

  if (tabname.split("-")[0] == "Comment") {
    let _data = new aData(6220003, null, _objKey, "");
    _data = _data.getList();

    // Comment
    Comment(_data, tabname, _objKey);
  }
}

function isDateTime(str) {
  str = str + "";
  if (str.includes("/Date(")) str = hasDateInStr(str);

  // Define a regular expression to match a common datetime format (YYYY-MM-DD HH:MM:SS AM|PM)
  const dateTimeRegex = str.match(
    /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)/
  );
  // Check if the string matches the datetime regex
  return dateTimeRegex !== null;
}

function hasDateInStr(str) {
  // Check if the string contains /Date(...)
  if (str.includes("/Date(")) {
    // Extract the date part
    const dateMatch = str.match(/\/Date\((\d+)\)/);
    if (dateMatch) {
      // Convert the extracted number (Unix timestamp) to a Date object
      const timestamp = parseInt(dateMatch[1], 10);
      const date = new Date(timestamp);

      // Format the date as desired (YYYY-MM-DD HH:MM:SS AM|PM)
      str = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")} ${
        date.getHours() >= 12 ? "PM" : "AM"
      }`;
    }
  }
  return str;
}

function updateIncidentColor(_objKey, color) {
  if (color) {
    $.ajax({
      type: "POST",
      url: "../../App_Sys/Services/CustomActivity.asmx/UpdateIncidentColor",
      data: JSON.stringify({
        incidentId: _objKey,
        color: color,
      }),
      async: false,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {},
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  }
}

function hasDateInStr(str) {
  // Check if the string contains /Date(...)
  if (str.includes("/Date(")) {
    // Extract the date part
    const dateMatch = str.match(/\/Date\((\d+)\)/);
    if (dateMatch) {
      // Convert the extracted number (Unix timestamp) to a Date object
      const timestamp = parseInt(dateMatch[1], 10);
      const date = new Date(timestamp);

      // Format the date as desired (YYYY-MM-DD HH:MM:SS AM|PM)
      str = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")} ${
        date.getHours() >= 12 ? "PM" : "AM"
      }`;
    }
  }
  return str;
}

function getHighestSeverityColor(colors) {
  if (colors.length > 0) {
    const colorMap = {
      Black: 4,
      Red: 3,
      Orange: 2,
      Yellow: 1,
    };
    let highestSeverity = 0;
    let highestSeverityColor = "";
    colors.map((color, index) => {
      if (colorMap[color] > highestSeverity) {
        highestSeverity = colorMap[color];
        highestSeverityColor = color;
      }
    });
    return highestSeverityColor;
  }
}

function SearchFNC(Id, TBL) {
  var input = document.getElementById(Id);
  var filter = input.value.toUpperCase();
  var table = TBL;
  var tr = table.getElementsByTagName("tr");

  setTimeout(() => {
    for (let i = 1; i < tr.length; i++) {
      if (tr[i].classList.length === 0) {
        td = tr[i].getElementsByTagName("td")[0].id;
        toggleDiv(td);
      } else {
        if (tr[i].classList != "hidden") {
          tr[i].style.display = "none";
        }
        let td = tr[i].getElementsByTagName("td");
        for (let j = 0; j < td.length; j++) {
          if (td[j]) {
            let txtValue = td[j].textContent || td[j].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
              break;
            }
          }
        }
      }
    }
  }, 0);
}
