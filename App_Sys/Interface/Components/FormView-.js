// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
/* Release Ferdos.WebAppDesk 4.4.0.0*/

function formView(
  id,
  objKeys,
  processTaskID,
  processStateID,
  taskGroupID,
  taskIsLock
) {
  var _actContextID =
    parseInt(id) < 3000000 || parseInt(id) > 5000000 ? id : null;

  var _reportID =
    parseInt(id) >= 3000000 && parseInt(id) <= 5000000 ? id : null;

  var _objKeys = objKeys;

  var _parObjType = -1;

  var _processTaskID = processTaskID;

  var _processStateID = processStateID;

  var _parContextID = -1;

  var _parObjKey = 0;

  var _formOptions;

  var _formItems;

  var _formGroups;

  var _data;

  var _prcStateOptions;

  var _prcTranscations;

  var _prcStateActLinks;

  var _prcTaskStatuses;

  var _processData;

  var _fileExist = {};

  var _fileAttachCode = {};

  var _pageElementID;

  var _isDefault = "False";

  var _form = null;

  this.renderContext = function (pageElementID, parObjType, parObjKey) {
    var content = "";

    var bodyID = "#box-body-" + pageElementID;

    var boxID = "#page-box-" + pageElementID;

    _parObjType = parObjType;

    _parObjKey = parObjKey;

    _pageElementID = pageElementID;

    $$FormItems = [];

    $$FormGroups = [];

    $$AjaxSelects = [];

    //#region Load Form Metadata

    cache = localStorage.getItem(window.btoa("form$" + _actContextID));

    if (!cache || true) {
      _form = new iComData("form", _actContextID, null, null);

      _form = _form.getData();

      localStorage.setItem(
        window.btoa("form$" + _actContextID),
        reverse(encodeURI(JSON.stringify(_form)))
      );
    } else {
      _form = jQuery.parseJSON(decodeURI(reverse(cache)));
    }

    _formOptions = _form.options;

    if (_formOptions.DataActivityID != "" && _objKeys.length == 1) {
      _data = new aData(
        _formOptions.DataActivityID,
        _objKeys,
        null,
        "1/1/2020"
      );
      if (_data.getError() != null) {
        raiseError(_data.getError(), bodyID);

        return;
      }

      _data = _data.getObject();
    }

    _formItems = _form.items;

    //#endregion

    //Get leaveBalance
    if (_formOptions.DataActivityID === 6040000) {
      let leavebalance;
      $.ajax({
        type: "POST",
        url: "../../App_Sys/Services/CustomActivity.asmx/GetLeaveBalance",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data) {
          leavebalance = data.d;
          // Check if leavebalance is NaN
          if (isNaN(leavebalance)) {
            _formOptions.Label += " ( مانده مرخصی ثبت نشده است )";
            return;
          }
          const isNegative = leavebalance < 0;
          leavebalance = Math.abs(leavebalance);

          // Convert leave balance from minutes to hours and minutes
          const hours = Math.floor(leavebalance / 60);
          const minutes = (leavebalance % 60).toString().padStart(2, "0"); // Ensure two digits

          // Format the time as -HH:MM or HH:MM
          const formattedTime = `${hours}:${minutes}${isNegative ? "-" : ""}`;
          _formOptions.Label += ` ( مانده مرخصی  ${formattedTime})`;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("Error occurred: ", errorThrown);
          alert("Failed to fetch leave balance. Please try again later.");
        },
      });
    }

    $(boxID + " .box-title").html(_formOptions.Label);

    $("#boxBodyModal1").html("");

    $(bodyID).html("");

    //#region Render Form Items Layout & Grouping

    if (jQuery.parseJSON(_formOptions.ItemsGrouping)) {
      _formGroups = _form.groups;

      try {
        $.each(_formGroups, function (index, formGroup) {
          var summaryBackground = "background-color:#fff;";
          if (formGroup.Label === "خلاصه درخواست") {
            summaryBackground =
              "background-color:var(--A4); padding: 10px 45px 0px 45px !important;border-radius: 3px";
          }

          content =
            '<div  style="' +
            (formGroup.Visibility == "false" ? "display:none" : "") +
            " " +
            summaryBackground +
            '" id="form-group-' +
            formGroup.FormGroupBoxID +
            '"  class="row form-group-box">';

          $$FormGroups[formGroup.Name] = formGroup.FormGroupBoxID;

          if (formGroup.GroupDisplayMode == "GroupWithBox") {
            content +=
              '<div class="col-lg-2 col-md-2 group-info"><h4 class="group-title">' +
              formGroup.Label +
              "<br /><small>" +
              (formGroup.Description != "BPMS" ? formGroup.Description : "") +
              "</small></h4></div>";
          }

          var columnWidth = formGroup.ColumnWidth;

          if (formGroup.ColumnLayout == "OnceColumn") {
            if (columnWidth == "default") {
              columnWidth = "col-lg-9 col-md-10";
            }

            content +=
              '<div class="' +
              columnWidth +
              ' col-sm-12  col-xs-12" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-0"></div>';
          }

          if (formGroup.ColumnLayout == "TwoColumn") {
            columnWidth = "col-md-4";

            content +=
              '<div class="' +
              columnWidth +
              '" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-0"></div><div class="col-md-1"></div><div class="' +
              columnWidth +
              '" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-1"></div><div class="col-md-1"></div>';
          }

          if (formGroup.ColumnLayout == "ThreeColumn") {
            if (formGroup.GroupDisplayMode == "GroupWithBox") {
              columnWidth = "col-md-2";
            } else {
              columnWidth = "col-md-3";
            }

            content +=
              '<div class="' +
              columnWidth +
              '" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-0"></div><div class="col-md-1"></div><div class="' +
              columnWidth +
              '" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-1"></div><div class="col-md-1"></div><div class="' +
              columnWidth +
              '" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-2"></div><div class="col-md-1"></div>';
          }

          content += "</div>";

          $(bodyID).append(content);

          if (formGroup.GroupDisplayMode == "GroupWithTitle") {
            $("#form-group-body-" + formGroup.FormGroupBoxID + "-0").append(
              '<h4 class="group-title">' +
                formGroup.Label +
                "<br /><small>" +
                (formGroup.Description != "BPMS" ? formGroup.Description : "") +
                "</small></h4>"
            );
          }
        });
      } catch (e) {
        raiseError(e, bodyID);

        return;
      }
    } else {
      try {
        content = '<div class="row form-group-box">';

        var columnWidth = _formOptions.ColumnWidth;

        if (_formOptions.ColumnLayout == "OnceColumn") {
          if (columnWidth == "default") {
            columnWidth = "col-lg-7 col-md-10";
          }

          content +=
            '<div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-0"></div>';
        }

        if (_formOptions.ColumnLayout == "TwoColumn") {
          columnWidth = "col-md-4";

          content +=
            '<div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-0"></div><div class="col-md-1"></div><div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-1"></div><div class="col-md-1"></div>';
        }

        if (_formOptions.ColumnLayout == "ThreeColumn") {
          columnWidth = "col-md-3";

          content +=
            '<div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-0"></div><div class="col-md-1"></div><div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-1"></div><div class="col-md-1"></div><div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-2"></div><div class="col-md-1"></div>';
        }

        content += "</div>";

        $(bodyID).append(content);
      } catch (e) {
        raiseError(e, bodyID);

        return;
      }
    }

    //#endregion

    //#region Render Form Items

    var parentID = "";

    var itemsGrouping = jQuery.parseJSON(_formOptions.ItemsGrouping);

    try {
      $.each(_formItems, function (index, formItem) {
        if (itemsGrouping) {
          parentID =
            "#form-group-body-" +
            formItem.FormGroupBoxID +
            "-" +
            formItem.ColumnIndex;
        } else {
          parentID =
            "#form-group-mbody-" +
            _formOptions.FormID +
            "-" +
            formItem.ColumnIndex;
        }

        $$FormItems[formItem.ParamName] = formItem;

        if (formItem.Visibility == "1" || formItem.Visibility == "") {
          formItem.Visibility = "true";
        } else if (formItem.Visibility == "DefaultHidden") {
          formItem.Visibility = "false";
        }
        switch (formItem.InputType) {
          case "SelectList":
            renderSelectList(formItem, parentID, _formOptions.ActivityID);
            break;

          case "TextBox":
            renderTextBox(formItem, parentID, _formOptions.ActivityID);
            break;

          case "AutoTextBox":
            renderTextBox(formItem, parentID, _formOptions.ActivityID);
            break;

          case "FileBrowse":
            renderFileBrowse(formItem, parentID);
            break;

          case "CheckBox":
            renderCheckBox(formItem, parentID);
            break;

          case "RadioButtonList":
            renderRadioButtonList(formItem, parentID);
            break;

          case "TextArea":
            renderTextArea(formItem, parentID, _formOptions.ActivityID);
            break;

          case "DateBox":
            renderDateBox(formItem, parentID);
            break;

          case "DateTimeBox":
            renderDateBox(formItem, parentID);
            break;

          case "DateRangeBox":
            renderDateRangeBox(formItem, parentID);
            break;

          case "TreeSelectList":
            renderTreeSelectList(formItem, parentID);
            break;

          case "SecureBox":
            renderSecureBox(formItem, parentID);
            break;

          case "PasswordBox":
            renderPasswordBox(formItem, parentID);
            break;

          case "TextView":
            renderTextView(formItem, parentID);
            break;

          case "SignatureBox":
            renderSignatureBox(formItem, parentID);
            break;

          case "Table":
            renderTableBox(formItem, parentID, _formOptions.ActivityID);
            break;
          case "SelectiveTable":
            renderSelectiveTableBox(
              formItem,
              parentID,
              _formOptions.ActivityID
            );
            break;
          case "Sms":
            renderSms(formItem, parentID);
            break;
          case "Paraghraph":
            renderAgreement(formItem, parentID);
            break;
          case "TreeBox":
            renderTreeBox(formItem, parentID);
          default:
            break;
          case "FacilityBox":
            RenderFacilities(formItem, parentID);
            break;
          case "TimingBox":
            RenderTimeingbox(formItem, parentID);
            break;
        }
      });
    } catch (e) {
      raiseError(e, bodyID);

      return;
    }

    $.each(_formItems, function (index, formItem) {
      if (formItem.FormItemID == 505030044) {
        $("#form-item-505030044 tfoot").remove(); // Remove table footer
        $("#form-item-505030044 #Del_Row_1").remove(); // Remove row with ID 'Del_Row_1'
        $("#form-item-505030044 #Edit_Row_1").remove(); // Remove row with ID 'Del_Row_1'
      }

      if (formItem.InputType == "SelectList" && formItem.ActionOnChange != "") {
        var defSelected = getDefaultValue(formItem);

        var match = false;

        var actionOnChange = jQuery.parseJSON(formItem.ActionOnChange);

        $.each(actionOnChange, function (index, event) {
          if (
            event.value.indexOf("[" + normalizeString(defSelected) + "]") != -1
          ) {
            match = true;

            $.each(event.actions, function (index, action) {
              const targetItems = Array.isArray(action.target)
                ? action.target
                : [action.target];
              array.forEach((targetItems) => {
                if (action.targetType == "FormItem") {
                  if (action.actionType == "Hide") {
                    $("#form-group-" + $$FormItems[targetItems].FormItemID).css(
                      "display",
                      "none"
                    );
                  }

                  if (action.actionType == "Show") {
                    $("#form-group-" + $$FormItems[targetItems].FormItemID).css(
                      "display",
                      "block"
                    );
                  }

                  if (action.actionType == "Reload") {
                    $("#form-group-" + $$FormItems[targetItems].FormItemID).css(
                      "display",
                      "block"
                    );
                  }
                }

                if (action.targetType == "FormGroupBox") {
                  if (action.actionType == "Hide") {
                    $("#form-group-" + $$FormGroups[targetItems]).css(
                      "display",
                      "none"
                    );
                  }

                  if (action.actionType == "Show") {
                    $("#form-group-" + $$FormGroups[targetItems]).css(
                      "display",
                      "block"
                    );
                  }
                }
              });
            });
          }

          if (event.value == "[0]" && !match) {
            $.each(event.actions, function (index, action) {
              const targetItems = Array.isArray(action.target)
                ? action.target
                : [action.target];
              targetItems.forEach((itemName) => {
                if (action.targetType == "FormItem") {
                  if (action.actionType == "Hide") {
                    $("#form-group-" + $$FormItems[targetItems].FormItemID).css(
                      "display",
                      "none"
                    );
                  }

                  if (action.actionType == "Show") {
                    $("#form-group-" + $$FormItems[targetItems].FormItemID).css(
                      "display",
                      "block"
                    );
                  }
                }

                if (action.targetType == "FormGroupBox") {
                  if (action.actionType == "Hide") {
                    $("#form-group-" + $$FormGroups[targetItems]).css(
                      "display",
                      "none"
                    );
                  }

                  if (action.actionType == "Show") {
                    $("#form-group-" + $$FormGroups[targetItems]).css(
                      "display",
                      "block"
                    );
                  }
                }
              });
            });
          }
        });
      }
    });

    //#endregion

    $(bodyID).append('<h5 class="message-form-success" id="smessage"></h5>');

    $(bodyID).append('<h5  class="message-form-error" id="emessage"></h5>');

    $(".fileinput-remove-button").on("click", function () {
      var itemName = $(this)
        .parents()
        .filter(function () {
          return $(this).attr("data-item-name") != undefined;
        })
        .first();

      _fileExist[itemName.attr("data-item-name")] = "0";

      setTimeout("alignSideBarHeight();", 1 * 100);
    });

    $("div.input-group-addon").on("click", function () {
      if ($(this).find(">:first-child").hasClass("glyphicon-plus")) {
        $(this).find(">:first-child").removeClass("glyphicon-plus");

        $(this).find(">:first-child").addClass("glyphicon-minus");
      } else {
        if ($(this).find(">:first-child").hasClass("glyphicon-minus")) {
          $(this).find(">:first-child").removeClass("glyphicon-minus");

          $(this).find(">:first-child").addClass("glyphicon-plus");
        }
      }
    });

    $(".view-checkbox").iCheck({
      checkboxClass: "icheckbox_square-green",

      radioClass: "iradio_square-green",
    });

    //#region Render Form Footer

    $("#box-footer-" + pageElementID).html("");

    $("#box-footer-" + pageElementID).append(
      '<button type="button" id="sbtn-act-' +
        _actContextID +
        '" class="btn btn-form-submit">' +
        $$Local.formSubmit +
        "</button>&nbsp;&nbsp;"
    );

    // if (_formOptions.FormID > 6000000 && _formOptions.FormID < 6201000) {
    //   $("#box-footer-" + pageElementID).append(
    //     '<button type="button" id="sbtn-act-' +
    //       _actContextID +
    //       "_2" +
    //       '" class="btn btn-form-cancel" >' +
    //       $$Local.formSave +
    //       "</button>&nbsp;&nbsp;"
    //   );
    // }

    $("#box-footer-" + pageElementID).append(
      '<button type="button" id="cbtn-act-' +
        _actContextID +
        '" class="btn btn-default btn-form-cancel">' +
        $$Local.formReset +
        "</button>"
    );

    $("#sbtn-act-" + _actContextID).click(function () {
      Submit_Save_Context("Submit");
    });

    $("#sbtn-act-" + _actContextID + "_2").click(function () {
      Submit_Save_Context("Save");
    });

    function Submit_Save_Context(_SubmitKey) {
      try {
        var AlertFlag = false;

        var activiyParams = new Array();

        var activiyParam;

        var submitReady = true;

        //#region Validate & Append Form Data

        $.each(_formItems, function (index, formItem) {
          if (formItem.IsRequired == "") formItem.IsRequired = false;

          let _IsRequired = $.parseJSON(formItem.IsRequired);

          activiyParam = new Object();

          activiyParam.ParamIndex = index;

          activiyParam.ParamName = formItem.Name;

          activiyParam.FileIsExist = 2;

          activiyParam.FileAttachCode = "";

          var itemInputID = "#form-item-" + formItem.FormItemID;

          if (
            (_display == "none" || _visibility == "hidden") &&
            formItem.ParamName.includes("Val")
          ) {
            activiyParam.ParamValue = formItem.DefaultValue;
            _IsRequired = false;
          } else {
            if (formItem.InputType != "CheckBox") {
              var val = $(itemInputID).val();

              if (
                formItem.InputType == "Table" ||
                formItem.InputType == "SelectiveTable"
              ) {
                val = $(itemInputID + " tr").length
                  ? $(itemInputID + " tr").length
                  : null;
                //remove header
                val <= 2 ? (val = null) : (val = val - 2);
              }

              if (
                formItem.Name.indexOf("DoD") > -1 ||
                formItem.AttributeTypeName == "CommandText"
              ) {
                val = $(itemInputID).Editor("getText");
              }

              if (formItem.InputType == "SelectList") {
                try {
                  if ($$AjaxSelects[itemInputID].status == 0) {
                    val = $$AjaxSelects[itemInputID].defaultValue;
                  }
                } catch (e) {}
              }

              if (jQuery.isArray(val)) {
                activiyParam.ParamValue = JSON.stringify(val);
              } else {
                activiyParam.ParamValue = val;
              }

              if (formItem.InputType == "SecureBox") {
                activiyParam.ParamValue = encryptInput(activiyParam.ParamValue);
              }

              if (formItem.InputType == "SignatureBox") {
                activiyParam.ParamValue = $(itemInputID).jSignature("getData");

                if (isCanvasBlank($(".jSignature"))) {
                  val = null;
                } else {
                  val = "Filled";
                }
              }

              if (formItem.InputType == "PasswordBox") {
                activiyParam.ParamValue = passwordInput(
                  activiyParam.ParamValue
                );

                var _val = $(itemInputID + "-rep").val();

                if ($.trim(val) != $.trim(_val) && $.trim(val) != "") {
                  if (_SubmitKey == "Submit") {
                    $(itemInputID + "-rep")
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");
                    submitReady = false;
                  }
                } else {
                  $(itemInputID + "-rep")
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                }
              }

              if (formItem.InputType == "FileBrowse") {
                activiyParam.FileIsExist = _fileExist[formItem.Name];

                activiyParam.FileAttachCode = _fileAttachCode[formItem.Name];

                var fileCaption = $("#form-group-" + formItem.FormItemID).find(
                  ".file-caption-name"
                );

                if (fileCaption.attr("title") == "خطای اعتبار سنجی") {
                  submitReady = false;
                }
              }

              var _display = $(itemInputID)
                .parents('div[class^="form-group"]')
                .css("display");

              var _visibility = $(itemInputID)
                .parents('div[class^="form-group"]')
                .css("visibility");

              if (
                ($.trim(val) == "" || val == null) &&
                _IsRequired &&
                _display != "none" &&
                _visibility != "hidden"
              ) {
                if (formItem.InputType != "FileBrowse") {
                  if (_SubmitKey == "Submit") {
                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");

                    if (
                      formItem.InputType != "Paraghraph" &&
                      formItem.InputType != "Sms" &&
                      formItem.InputType != "FacilityBox" &&
                      formItem.InputType != "TimingBox"
                    )
                      submitReady = false;
                  }
                } else {
                  if (_fileExist[formItem.Name] == "0") {
                    if (_SubmitKey == "Submit") {
                      $(itemInputID)
                        .parents('div[class^="form-group"]')
                        .addClass("has-error");

                      if (
                        formItem.InputType != "Paraghraph" &&
                        formItem.InputType != "Sms" &&
                        formItem.InputType != "FacilityBox" &&
                        formItem.InputType != "TimingBox"
                      )
                        submitReady = false;
                    }
                  }
                }
              } else {
                if (
                  (_IsRequired && _display == "none") ||
                  _visibility == "hidden"
                ) {
                  $(itemInputID)
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");

                  activiyParam.ParamValue = "";
                }
              }

              if (
                formItem.InputType == "TextBox" ||
                formItem.InputType == "SecureBox" ||
                formItem.InputType == "PasswordBox" ||
                formItem.InputType == "AutoTextBox" ||
                formItem.InputType == "DateTimeBox"
              ) {
                if ($.trim(val) != "" && val != null) {
                  if (
                    val.length < parseInt(formItem.MinValueLenght) ||
                    val.length > parseInt(formItem.MaxValueLenght)
                  ) {
                    if (_SubmitKey == "Submit") {
                      $(itemInputID)
                        .parents('div[class^="form-group"]')
                        .addClass("has-error");
                      submitReady = false;
                    }
                  } else {
                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .removeClass("has-error");
                  }
                }
              }
              if (formItem.InputType == "SelectiveTable") {
                let tbl = $TableData.filter(
                  (x) => x.ID == `form-item-` + formItem.FormItemID
                );
                let tableId = `form-item-` + formItem.FormItemID;
                let tableRows = $("#" + tableId + " tr");
                let rowIds = [];
                for (let i = 1; i < tableRows.length - 1; i++) {
                  let rowChildren = $(tableRows[i]).children();

                  rowChildren.each(function () {
                    let instanceValue = $(this).attr("isinstance");
                    let childValue = $(this).text(); // or .val() for input elements

                    if (instanceValue) {
                      rowIds.push({
                        ID: childValue,
                      });
                    }
                  });
                }
                $TableData[0].Rows = rowIds;
                activiyParam.ParamValue = JSON.stringify($TableData[0]);
              }
              if (formItem.InputType == "Table") {
                let tbl = $TableData.filter(
                  (x) => x.ID == `form-item-` + formItem.FormItemID
                );
                activiyParam.ParamValue = "NULL";

                if (tbl.length)
                  activiyParam.ParamValue = JSON.stringify(tbl[0]);
                if (
                  _IsRequired &&
                  _display != "none" &&
                  _visibility != "hidden" &&
                  val == null
                ) {
                  if (_SubmitKey == "Submit") {
                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");
                    submitReady = false;
                  }
                } else {
                  $(itemInputID)
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                }
              }

              if (formItem.InputType == "Paraghraph") {
                $(itemInputID)
                  .parents('div[class^="form-group"]')
                  .removeClass("has-error");
                activiyParam.ParamValue = "NULL";
              }

              if (formItem.InputType == "Sms") {
                $(itemInputID)
                  .parents('div[class^="form-group"]')
                  .removeClass("has-error");
                activiyParam.ParamValue = "1";
              }

              if (formItem.InputType == "FacilityBox") {
                let radioButton = $(".tblradio");
                for (let i = 0; i < radioButton.length; i++) {
                  if ($(radioButton[i]).is(":checked")) {
                    activiyParam.ParamValue = $(radioButton[i])
                      .parent()
                      .next()
                      .next()
                      .text();
                  }
                }

                if ($("#radio-0").attr("disabled") == undefined) {
                  $(itemInputID)
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");

                  AlertFlag = false;
                } else {
                  swal("سقف استفاده مجاز در ماه 9 بار می باشد.", {
                    icon: "warning",
                    buttons: {
                      confirm: "ok",
                    },
                  });
                  if (_SubmitKey == "Submit") {
                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");

                    submitReady = false;
                    AlertFlag = true;
                  }
                }
              }

              if (formItem.InputType == "TimingBox") {
                let radioButton = $(".radioTime");
                let isCheck = false;

                let radioButtonInput = $(".tblradio");
                let timeBoxFlag = false;
                for (let i = 0; i < radioButtonInput.length; i++) {
                  if ($(radioButtonInput[i]).is(":checked")) {
                    timeBoxFlag = true;
                    let ValueOfFacility = $(radioButtonInput[i]).val();
                    if (ValueOfFacility == $("#radio-0").val()) {
                      for (let j = 0; j < radioButton.length; j++) {
                        if ($(radioButton[j]).is(":checked")) {
                          activiyParam.ParamValue = $(radioButton[j]).val();
                          isCheck = true;
                        }
                      }
                      if (!AlertFlag) {
                        if (isCheck) {
                          $(itemInputID)
                            .parents('div[class^="form-group"]')
                            .removeClass("has-error");
                        } else {
                          swal("لطفا زمان رزرو را انتخاب کنید .", {
                            icon: "warning",
                            buttons: {
                              confirm: "ok",
                            },
                          });
                          if (_SubmitKey == "Submit") {
                            $(itemInputID)
                              .parents('div[class^="form-group"]')
                              .addClass("has-error");

                            submitReady = false;
                          }
                        }
                      }
                    } else {
                      $(itemInputID)
                        .parents('div[class^="form-group"]')
                        .removeClass("has-error");
                      activiyParam.ParamValue = "NULL";
                    }
                  }
                }

                if (!timeBoxFlag && !AlertFlag) {
                  if (!timeBoxFlag) {
                    swal("لطفا نوع رفاهیات را انتخاب کنید .", {
                      icon: "warning",
                      buttons: {
                        confirm: "ok",
                      },
                    });
                    if (_SubmitKey == "Submit") {
                      $(itemInputID)
                        .parents('div[class^="form-group"]')
                        .addClass("has-error");

                      submitReady = false;
                    }
                  } else {
                    swal("سقف استفاده مجاز در ماه 9 بار می باشد.", {
                      icon: "warning",
                      buttons: {
                        confirm: "ok",
                      },
                    });
                    if (_SubmitKey == "Submit") {
                      $(itemInputID)
                        .parents('div[class^="form-group"]')
                        .addClass("has-error");

                      submitReady = false;
                    }
                  }
                }
              }

              if (
                formItem.BaseDataType == "BIGINT" ||
                formItem.BaseDataType == "INT" ||
                formItem.BaseDataType == "MONEY"
              ) {
                if ($.trim(val) != "" && val != null) {
                  if (
                    parseInt(val) < parseInt(formItem.MinValue) ||
                    parseInt(val) > parseInt(formItem.MaxValue)
                  ) {
                    if (_SubmitKey == "Submit") {
                      $(itemInputID)
                        .parents('div[class^="form-group"]')
                        .addClass("has-error");

                      submitReady = false;
                    }
                  } else {
                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .removeClass("has-error");
                  }
                } else {
                  //activiyParam.ParamValue = "0";
                }
              }
            } else {
              if (formItem.Label == "با توافقنامه موافقم.") {
                if (_IsRequired) {
                  if ($(itemInputID).is(":checked")) {
                    activiyParam.ParamValue = "1";

                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .removeClass("has-error");
                  } else {
                    swal("لطفاً توافقنامه را تایید کنید.", {
                      icon: "warning",
                    });

                    activiyParam.ParamValue = null;
                    submitReady = false;
                    return false;
                  }
                } else {
                  if ($(itemInputID).is(":checked")) {
                    activiyParam.ParamValue = "1";

                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .removeClass("has-error");
                  } else {
                    activiyParam.ParamValue = "0";
                  }
                }
              } else {
                if ($(itemInputID).is(":checked")) {
                  activiyParam.ParamValue = "1";

                  $(itemInputID)
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                } else {
                  activiyParam.ParamValue = "0";
                }
              }
            }

            if (formItem.InputType != "FileBrowse") {
              if (_SubmitKey == "Save") {
                if (activiyParam.ParamValue == "")
                  activiyParam.ParamValue = " ";

                _IsRequired = false;
              }
            }
          }
          activiyParams[index] = activiyParam;
        });

        //#endregion
        if (!submitReady) {
          if ($$Lang == "Fa") {
            $(bodyID + " #emessage").text(
              "*بعضی از موارد اجباری پر نشده یا مقادیر آن نامعتبر است"
            );
          } else {
            $(bodyID + " #emessage").text(
              "*Some items are not filled or has invalid values"
            );
          }

          $(bodyID + " #smessage").html("");

          alignSideBarHeight();

          return;
        } else {
          $(bodyID + " #emessage").text("");

          alignSideBarHeight();
        }

        var __objKeys = [];

        if (!_objKeys) {
          __objKeys[0] = 0;
        } else {
          __objKeys[0] = $.isArray(_objKeys) ? _objKeys[0] : _objKeys;
        }

        $(".wrapper").block({
          message: '<span class="message-form-block">..Processing<span>',
          baseZ: 10000,
        });

        var data = new FormData();

        //#region Append File Form Data

        $.each(_formItems, function (index, formItem) {
          if (formItem.InputType == "FileBrowse") {
            var files = $("#form-item-" + formItem.FormItemID).get(0).files;

            if (files) {
              if (files.length > 0) {
                data.append("file" + index, files[0]);
              }
            }
          }

          if (formItem.InputType != "FileBrowse") {
            if (_SubmitKey == "Save") {
              if (activiyParam.ParamValue == "") activiyParam.ParamValue = " ";

              _IsRequired = false;
            }
          }
        });

        data.append("submitKey", _SubmitKey);

        data.append("activiyParams", JSON.stringify(activiyParams));

        data.append("objectIDs", JSON.stringify(__objKeys));

        data.append("id", _formOptions.ActivityID);

        //#endregion

        var $aExecutor = new aExecutor(
          0,
          data,
          boxID,
          jQuery.parseJSON(_formOptions.ActionOnSuccess),
          null,
          _parObjType
        );

        $aExecutor.submit();
      } catch (e) {
        raiseError(e, bodyID);

        return;
      }
    }

    $("#cbtn-act-" + _actContextID).click(function () {
      var $formView = new formView(_actContextID, _objKeys);

      $formView.renderContext(_pageElementID);
    });

    //#endregion
  };

  this.renderModalContext = function (
    modalID,
    parContextID,
    parObjType,
    parObjKey
  ) {
    var content = "";

    var bodyID = "#boxBodyModal" + modalID;

    var boxID = "#pageBoxModal" + modalID;

    _parObjType =
      parObjType != null && parObjType != undefined && parObjType != -1
        ? parObjType.replace("ToDay ", "")
        : parObjType;

    _parObjKey = parObjKey;

    _parContextID = parContextID;

    _modalID = modalID;

    $$FormItems = [];

    $$FormGroups = [];

    //#region Load Form Metadata

    cache = localStorage.getItem(window.btoa("form$" + _actContextID));

    if (!cache || true) {
      _form = new iComData("form", _actContextID, null, null);

      _form = _form.getData();

      localStorage.setItem(
        window.btoa("form$" + _actContextID),
        reverse(encodeURI(JSON.stringify(_form)))
      );
    } else {
      _form = jQuery.parseJSON(decodeURI(reverse(cache)));
    }
    if (_actContextID != null) {
      _formOptions = _form.options;
    }

    if (_reportID != null) {
      _formOptions = new iData(
        "174f1c8e-4803-4dbe-bf3f-5e56f0f41bfc",
        _reportID
      );

      _formOptions = _formOptions.getObject();
    }

    if (_formOptions.DataActivityID != "" && _objKeys.length == 1) {
      _data = new aData(
        _formOptions.DataActivityID,
        _objKeys,
        null,
        "1/1/2020"
      );

      if (_data.getError() != null) {
        raiseError(_data.getError(), bodyID);

        return;
      }

      _data = _data.getObject();
      localStorage.setItem("ll", JSON.stringify(_data));
      $.each(_data, function (key, value) {
        if (key.indexOf("IsDefault") > -1) {
          _isDefault = value;
        }
      });
    }

    if (_actContextID != null) {
      _formItems = _form.items;
    }

    if (_reportID != null) {
      _formItems = new iData("83927d76-9cc9-4801-99a1-d0c9c46c0175", _reportID);

      _formItems = _formItems.getList();
    }

    //#endregion

    //#region Load Task Form Metadata

    if (_processStateID) {
      if (taskIsLock) {
        var continus = confirm(
          "این فرم توسط کاربری دیگری ممکن است در حال استفاده باشد آیا مایل به ادامه هستید؟"
        );

        if (!continus) {
          $("#actContextModal" + modalID).modal("hide");
        } else {
          lockTaskByUser(_processTaskID);
        }
      } else {
        lockTaskByUser(_processTaskID);
      }

      _prcStateOptions = new iData(
        "567f98fb-8940-4411-8dab-f54654e567c7",
        _processStateID
      );

      if (_prcStateOptions.getError() != null) {
        raiseError(_prcStateOptions.getError(), bodyID);

        return;
      }

      _prcStateOptions = _prcStateOptions.getObject();

      _prcTranscations = new iData(
        "997f98f5-5463-7854-adf3-ab9954e56578",
        _processStateID
      );

      if (_prcTranscations.getError() != null) {
        raiseError(_prcTranscations.getError(), bodyID);

        return;
      }

      _prcStateActLinks = new iData(
        "c364bd29-7de5-4ced-812e-9f432cee94e0",
        _processStateID
      );

      if (_prcStateActLinks.getError() != null) {
        raiseError(_prcStateActLinks.getError(), bodyID);

        return;
      }

      _prcStateActLinks = _prcStateActLinks.getList();

      _prcTaskStatuses = new iData("54dd401a-e809-4570-b624-adf9758218c1", 0);

      if (_prcTaskStatuses.getError() != null) {
        raiseError(_prcTaskStatuses.getError(), bodyID);

        return;
      }

      _prcTaskStatuses = _prcTaskStatuses.getList();
    }

    //#endregion

    $("#boxTitleModal" + modalID).html(_formOptions.Label);

    if (
      $Data != null &&
      $Data != "" &&
      _formOptions.Label.indexOf("جدید") == -1
    ) {
      if (!(typeof $Data === "object")) {
        $("#boxTitleModal" + modalID).html(
          _formOptions.Label + " [ " + $Data + " ]"
        );
      }
    }

    $(bodyID).html("");

    //#region Render Form Items Layout & Grouping

    if (jQuery.parseJSON(_formOptions.ItemsGrouping)) {
      _formGroups = _form.groups;

      try {
        $.each(_formGroups, function (index, formGroup) {
          var summaryBackground = "background-color:#fff;";
          if (formGroup.Label === "خلاصه درخواست") {
            summaryBackground =
              "background-color:var(--A4); padding: 10px 45px 0px 45px !important;border-radius: 3px";
          }

          content =
            '<div  style="' +
            (formGroup.Visibility == "false" ? "display:none" : "") +
            " " +
            summaryBackground +
            '" id="form-group-' +
            formGroup.FormGroupBoxID +
            '"  class="row form-group-box">';

          $$FormGroups[formGroup.Name] = formGroup.FormGroupBoxID;

          if (formGroup.GroupDisplayMode == "GroupWithBox") {
            content +=
              '<div class="col-md-2 group-info d-flex align-items-center"><i class="fa-duotone fa-pencil m-1" style="display:none"></i><h4 class="group-title">' +
              formGroup.Label +
              "<br /><small>" +
              (formGroup.Description != "BPMS" ? formGroup.Description : "") +
              "</small></h4></div>";
          }

          var columnWidth = formGroup.ColumnWidth;

          if (formGroup.ColumnLayout == "OnceColumn") {
            if (columnWidth == "default") {
              columnWidth = "col-md-12";
            }

            content +=
              '<div class="' +
              columnWidth +
              ' col-sm-12 m-1 col-xs-12" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-0"></div>';
          }

          if (formGroup.ColumnLayout == "TwoColumn") {
            columnWidth = "col-md-4";

            content +=
              '<div class="' +
              columnWidth +
              '" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-0"></div><div class="col-md-1"></div><div class="' +
              columnWidth +
              '" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-1"></div><div class="col-md-1"></div>';
          }

          if (formGroup.ColumnLayout == "ThreeColumn") {
            if (formGroup.GroupDisplayMode == "GroupWithBox") {
              columnWidth = "col-md-2";
            } else {
              columnWidth = "col-md-3";
            }

            content +=
              '<div class="' +
              columnWidth +
              '" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-0"></div><div class="col-md-1"></div><div class="' +
              columnWidth +
              '" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-1"></div><div class="col-md-1"></div><div class="' +
              columnWidth +
              '" id="form-group-body-' +
              formGroup.FormGroupBoxID +
              '-2"></div><div class="col-md-1"></div>';
          }

          content += "</div>";

          $(bodyID).append(content);

          if (formGroup.GroupDisplayMode == "GroupWithTitle") {
            $("#form-group-body-" + formGroup.FormGroupBoxID + "-0").append(
              '<h4 class="group-title">' +
                formGroup.Label +
                "<br /><small>" +
                (formGroup.Description != "BPMS" ? formGroup.Description : "") +
                "</small></h4>"
            );
          }
        });
      } catch (e) {
        raiseError(e, bodyID);

        return;
      }
    } else {
      try {
        content = '<div class="row form-group-box">';

        var columnWidth = _formOptions.ColumnWidth;

        if (_formOptions.ColumnLayout == "OnceColumn") {
          if (columnWidth == "default") {
            columnWidth = "col-md-8";
          }

          content +=
            '<div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-0"></div>';
        }

        if (_formOptions.ColumnLayout == "TwoColumn") {
          columnWidth = "col-md-4";

          content +=
            '<div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-0"></div><div class="col-md-1"></div><div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-1"></div><div class="col-md-1"></div>';
        }

        if (_formOptions.ColumnLayout == "ThreeColumn") {
          columnWidth = "col-md-3";

          content +=
            '<div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-0"></div><div class="col-md-1"></div><div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-1"></div><div class="col-md-1"></div><div class="' +
            columnWidth +
            '" id="form-group-mbody-' +
            _formOptions.FormID +
            '-2"></div><div class="col-md-1"></div>';
        }

        content += "</div>";

        $(bodyID).append(content);
      } catch (e) {
        raiseError(e, bodyID);

        return;
      }
    }
    //#endregion

    //#region Render Form Items

    var parentID = "";

    var itemsGrouping = jQuery.parseJSON(_formOptions.ItemsGrouping);

    try {
      $.each(_formItems, function (index, formItem) {
        if (itemsGrouping) {
          parentID =
            "#form-group-body-" +
            formItem.FormGroupBoxID +
            "-" +
            formItem.ColumnIndex;
        } else {
          parentID =
            "#form-group-mbody-" +
            _formOptions.FormID +
            "-" +
            formItem.ColumnIndex;
        }

        $$FormItems[formItem.ParamName] = formItem;
        switch (formItem.InputType) {
          case "SelectList":
            renderSelectList(formItem, parentID, _formOptions.ActivityID);
            break;

          case "TextBox":
            renderTextBox(formItem, parentID, _formOptions.ActivityID);
            break;

          case "NumericRangeBox":
            renderNumericRangeBox(formItem, parentID);
            break;

          case "AutoTextBox":
            renderTextBox(formItem, parentID, _formOptions.ActivityID);
            break;

          case "FileBrowse":
            renderFileBrowse(formItem, parentID);
            break;

          case "CheckBox":
            renderCheckBox(formItem, parentID);
            break;

          case "RadioButtonList":
            renderRadioButtonList(formItem, parentID);
            break;

          case "TextArea":
            renderTextArea(formItem, parentID, _formOptions.ActivityID);
            break;

          case "DateBox":
            renderDateBox(formItem, parentID);
            break;

          case "DateTimeBox":
            renderDateBox(formItem, parentID);
            break;

          case "DateRangeBox":
            renderDateRangeBox(formItem, parentID);
            break;

          case "TreeSelectList":
            renderTreeSelectList(formItem, parentID);
            break;

          case "SecureBox":
            renderSecureBox(formItem, parentID);
            break;

          case "PasswordBox":
            renderPasswordBox(formItem, parentID);
            break;

          case "TextView":
            renderTextView(formItem, parentID);
            break;

          case "Table":
            renderTableBox(formItem, parentID, _formOptions.ActivityID);
            break;
          case "SelectiveTable":
            renderSelectiveTableBox(
              formItem,
              parentID,
              _formOptions.ActivityID
            );
            break;
          case "Sms":
            renderSms(formItem, parentID);
            break;
          case "Paraghraph":
            renderAgreement(formItem, parentID);
            break;
          case "TreeBox":
            renderTreeBox(formItem, parentID);
          default:
            break;
          case "FacilityBox":
            RenderFacilities(formItem, parentID);
            break;
          case "TimingBox":
            RenderTimeingbox(formItem, parentID);
            break;
        }
      });
    } catch (e) {
      raiseError(e, bodyID);

      return;
    }

    //Default Event of SelectList
    $.each(_formItems, function (index, formItem) {
      if (
        formItem.FormItemID == 505030344 ||
        formItem.FormItemID == 505030044
      ) {
        $("#form-item-505030344 tfoot").remove(); // Remove table footer
        $("#form-item-505030044 tfoot").remove(); // Remove table footer
        $("#form-item-505030344 [id^='Del_Row_']").remove(); // Remove row with ID 'Del_Row_1'
        $("#form-item-505030044 [id^='Del_Row_']").remove(); // Remove row with ID 'Del_Row_1'
        $("#form-item-505030344 [id^='Edit_Row_']").remove(); // Remove row with ID 'Edit_Row_1'
        $("#form-item-505030044 [id^='Edit_Row_']").remove(); // Remove row with ID 'Edit_Row_1'
        $("#form-item-505030344 thead th:last").remove();
        $("#form-item-505030044 thead th:last").remove();

        $("#form-item-505030344 tbody tr").each(function () {
          $(this).find("td:last").remove();
        });
        $("#form-item-505030044 tbody tr").each(function () {
          $(this).find("td:last").remove();
        });
      }
      if (formItem.InputType == "SelectList" && formItem.ActionOnChange != "") {
        var defSelected = getDefaultValue(formItem);

        var match = false;

        var actionOnChange = jQuery.parseJSON(formItem.ActionOnChange);

        $.each(actionOnChange, function (index, event) {
          if (
            event.value.indexOf("[" + normalizeString(defSelected) + "]") != -1
          ) {
            match = true;

            $.each(event.actions, function (index, action) {
              const targetItems = Array.isArray(action.target)
                ? action.target
                : [action.target];

              targetItems.forEach((itemName) => {
                if (action.targetType == "FormItem") {
                  if (action.actionType == "Hide") {
                    $("#form-group-" + $$FormItems[itemName].FormItemID).css(
                      "display",
                      "none"
                    );
                  }

                  if (action.actionType == "Show") {
                    $("#form-group-" + $$FormItems[itemName].FormItemID).css(
                      "display",
                      "block"
                    );
                  }

                  if (action.actionType == "Reload") {
                    $("#form-group-" + $$FormItems[itemName].FormItemID).css(
                      "display",
                      "block"
                    );
                  }
                }

                if (action.targetType == "FormGroupBox") {
                  if (action.actionType == "Hide") {
                    $("#form-group-" + $$FormGroups[itemName]).css(
                      "display",
                      "none"
                    );
                  }

                  if (action.actionType == "Show") {
                    $("#form-group-" + $$FormGroups[itemName]).css(
                      "display",
                      "block"
                    );
                  }
                }
              });
            });
          }

          if (event.value == "[0]" && !match) {
            $.each(event.actions, function (index, action) {
              const targetItems = Array.isArray(action.target)
                ? action.target
                : [action.target];
              targetItems.forEach((itemName) => {
                if (action.targetType == "FormItem") {
                  if (action.actionType == "Hide") {
                    $("#form-group-" + $$FormItems[itemName].FormItemID).css(
                      "display",
                      "none"
                    );
                  }

                  if (action.actionType == "Show") {
                    $("#form-group-" + $$FormItems[itemName].FormItemID).css(
                      "display",
                      "block"
                    );
                  }
                }

                if (action.targetType == "FormGroupBox") {
                  if (action.actionType == "Hide") {
                    $("#form-group-" + $$FormGroups[itemName]).css(
                      "display",
                      "none"
                    );
                  }

                  if (action.actionType == "Show") {
                    $("#form-group-" + $$FormGroups[itemName]).css(
                      "display",
                      "block"
                    );
                  }
                }
              });
            });
          }
        });
      }
    });

    //#endregion

    //#region Render Task Form Default Items

    if (_processStateID) {
      try {
        renderTaskProceedingsArea(taskProceedingsGbID);

        renderProcessStatingArea(ProcessStatingGbID);
      } catch (e) {
        raiseError(e, bodyID);

        return;
      }
    }

    //#endregion

    $(bodyID).append('<h5 class="message-form-success" id="smessage"></h5>');

    $(bodyID).append('<h5  class="message-form-error" id="emessage"></h5>');

    if (_formOptions.ConfirmMessage != "") {
      $("#emessage").append(_formOptions.ConfirmMessage);
    }

    $(".fileinput-remove-button").on("click", function () {
      var itemName = $(this)
        .parents()
        .filter(function () {
          return $(this).attr("data-item-name") != undefined;
        })
        .first();

      _fileExist[itemName.attr("data-item-name")] = "0";

      setTimeout("alignSideBarHeight();", 1 * 100);
    });

    $("div.input-group-addon").on("click", function () {
      if ($(this).find(">:first-child").hasClass("glyphicon-plus")) {
        $(this).find(">:first-child").removeClass("glyphicon-plus");

        $(this).find(">:first-child").addClass("glyphicon-minus");
      } else {
        if ($(this).find(">:first-child").hasClass("glyphicon-minus")) {
          $(this).find(">:first-child").removeClass("glyphicon-minus");

          $(this).find(">:first-child").addClass("glyphicon-plus");
        }
      }
    });

    $(".view-checkbox").iCheck({
      checkboxClass: "icheckbox_square-green",

      radioClass: "iradio_square-green",
    });

    //#region Render Footer

    $("#boxFooterModal" + modalID).html("");

    $("#boxFooterModal" + modalID).append(
      '<button type="button" id="btnActModal' +
        modalID +
        '" class="btn btn-form-submit" >' +
        $$Local.formSubmit +
        "</button>&nbsp;"
    );

    if (_formOptions.FormID > 6000000 && _formOptions.FormID < 6201000) {
      $("#boxFooterModal" + modalID).append(
        '<button type="button" id="btnActModal' +
          modalID +
          "_2" +
          '" class="btn btn-form-cancel">' +
          $$Local.formSave +
          "</button>&nbsp;"
      );
    }

    if (_formOptions.Label != "تنظیمات محیط کاربری") {
      //This form is forced

      if (_reportID != null) {
        $("#boxFooterModal" + modalID).append(
          '<button type="button" id="btnRstModal' +
            modalID +
            '" style="background-color:gray" class="btn btn-form-submit" >حذف جستجو</button>&nbsp;'
        );
      }

      $("#boxFooterModal" + modalID).append(
        '<button type="button" id="btnCnsModal' +
          modalID +
          '" class="btn btn-default btn-form-cancel" >' +
          $$Local.formCancel +
          "</button>&nbsp;"
      );

      $("#closeBtnModal" + modalID).css("display", "block");
    } else {
      $("#closeBtnModal" + modalID).css("display", "none");
    }

    $("#btnActModal" + modalID).unbind("click");

    $("#btnActModal" + modalID + "_2").unbind("click");

    $("#btnActModal" + modalID).click(function () {
      Submit_Save_Modal("Submit");
    });

    $("#btnActModal" + modalID + "_2").click(function () {
      Submit_Save_Modal("Save");
    });

    function Submit_Save_Modal(_SubmitKey) {
      try {
        var activiyParams = new Array();

        var activiyParam;

        var submitReady = true;

        var data = new FormData();

        //#region Validate & Append Form Data
        $.each(_formItems, function (index, formItem) {
          if (formItem.IsRequired == "") formItem.IsRequired = false;

          let _IsRequired = $.parseJSON(formItem.IsRequired);

          if (typeof formItem.IsRequired == "boolean") {
            _IsRequired = formItem.IsRequired;
          } else if (typeof formItem.IsRequired == "string") {
            _IsRequired = $.parseJSON(formItem.IsRequired);
          }

          activiyParam = new Object();

          activiyParam.ParamIndex = index;

          activiyParam.ParamName = formItem.Name;

          activiyParam.FileIsExist = 2;

          activiyParam.FileAttachCode = "";

          var itemInputID = "#form-item-" + formItem.FormItemID;

          var _display = $(itemInputID)
            .parents('div[class^="form-group"]')
            .css("display");

          var _visibility = $(itemInputID)
            .parents('div[class^="form-group"]')
            .css("visibility");

          if (
            (_display == "none" || _visibility == "hidden") &&
            formItem.ParamName.includes("Val")
          ) {
            activiyParam.ParamValue = formItem.DefaultValue;
            _IsRequired = false;
          } else {
            if (formItem.InputType != "CheckBox") {
              var val = $(itemInputID).val();

              if (
                formItem.InputType == "Table" ||
                formItem.InputType == "SelectiveTable"
              ) {
                val = $(itemInputID + " tr").length
                  ? $(itemInputID + " tr").length
                  : null;

                //remove header
                val <= 2 ? (val = null) : (val = val - 2);
              }
              if (_SubmitKey == "Save") _IsRequired = false;

              if (
                formItem.Name.indexOf("DoD") > -1 ||
                formItem.AttributeTypeName == "CommandText"
              ) {
                val = $(itemInputID).Editor("getText");
              }

              if (formItem.InputType == "SelectList") {
                try {
                  if ($$AjaxSelects[itemInputID].status == 0) {
                    val = $$AjaxSelects[itemInputID].defaultValue;
                  }
                } catch (e) {}
              }

              if (jQuery.isArray(val)) {
                activiyParam.ParamValue = JSON.stringify(val);
              } else {
                if (
                  formItem.InputType == "NumericRangeBox" ||
                  formItem.InputType == "DateRangeBox"
                ) {
                  activiyParam.ParamValue =
                    $("#form-item-from-" + formItem.FormItemID).val() +
                    "$" +
                    $("#form-item-to-" + formItem.FormItemID).val();
                } else {
                  activiyParam.ParamValue = val;
                }
              }

              if (formItem.InputType == "SecureBox") {
                activiyParam.ParamValue = encryptInput(activiyParam.ParamValue);
              }

              if (formItem.InputType == "SignatureBox") {
                activiyParam.ParamValue = $(itemInputID).jSignature("getData");

                if (isCanvasBlank($(".jSignature"))) {
                  val = null;
                } else {
                  val = "Filled";
                }
              }

              if (formItem.InputType == "PasswordBox") {
                activiyParam.ParamValue = passwordInput(
                  activiyParam.ParamValue
                );

                var _val = $(itemInputID + "-rep").val();

                if ($.trim(val) != $.trim(_val) && $.trim(val) != "") {
                  if (_SubmitKey == "Submit") {
                    $(itemInputID + "-rep")
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");

                    submitReady = false;
                  }
                } else {
                  $(itemInputID + "-rep")
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                }
              }

              if (formItem.InputType == "FileBrowse") {
                activiyParam.FileIsExist = _fileExist[formItem.Name];

                activiyParam.FileAttachCode = _fileAttachCode[formItem.Name];

                var fileCaption = $("#form-group-" + formItem.FormItemID).find(
                  ".file-caption-name"
                );

                if (fileCaption.attr("title") == "خطای اعتبار سنجی") {
                  submitReady = false;
                }
              }

              if (formItem.InputType == "TreeBox") {
                const checkedInputs = $(`#treeBox input:checked`); // Select all checked inputs
                const checkedValues = []; // Initialize an array to store the checked values

                // Loop through each checked input and push its value to the array
                checkedInputs.each(function () {
                  checkedValues.push($(this).val());
                });

                // Convert the array to a comma-separated string and save it in activiyParam.ParamValue
                activiyParam.ParamValue = checkedValues.join(",");
              }

              if (
                ($.trim(val) == "" || val == null) &&
                $(itemInputID).prop("tagName") != "SPAN" &&
                _IsRequired &&
                _display != "none" &&
                _visibility != "hidden"
              ) {
                if (formItem.InputType != "FileBrowse") {
                  if (_SubmitKey == "Submit") {
                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");
                  }

                  if (
                    formItem.InputType != "Paraghraph" &&
                    formItem.InputType != "Sms" &&
                    formItem.InputType != "FacilityBox" &&
                    formItem.InputType != "TimingBox"
                  ) {
                    if (_SubmitKey == "Submit") {
                      submitReady = false;
                    }
                  }
                } else {
                  if (_fileExist[formItem.Name] == "0") {
                    if (_SubmitKey == "Submit") {
                      $(itemInputID)
                        .parents('div[class^="form-group"]')
                        .addClass("has-error");
                    }

                    if (
                      formItem.InputType != "Paraghraph" &&
                      formItem.InputType != "Sms" &&
                      formItem.InputType != "FacilityBox" &&
                      formItem.InputType != "TimingBox"
                    ) {
                      if (_SubmitKey == "Submit") {
                        submitReady = false;
                      }
                    }
                  }
                }
              } else {
                if (
                  (_IsRequired && _display == "none") ||
                  _visibility == "hidden"
                ) {
                  $(itemInputID)
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                  if (formItem.DataName != "Sys_Prc_Processes_ExecutiveVersion")
                    activiyParam.ParamValue = "";
                }
              }

              if (
                formItem.InputType == "TextBox" ||
                formItem.InputType == "SecureBox" ||
                formItem.InputType == "PasswordBox" ||
                formItem.InputType == "AutoTextBox" ||
                formItem.InputType == "DateTimeBox"
              ) {
                if ($.trim(val) != "" && val != null) {
                  if (
                    val.length < parseInt(formItem.MinValueLenght) ||
                    val.length > parseInt(formItem.MaxValueLenght)
                  ) {
                    if (_SubmitKey == "Submit") {
                      $(itemInputID)
                        .parents('div[class^="form-group"]')
                        .addClass("has-error");
                    }
                    {
                      if (_SubmitKey == "Submit") {
                        submitReady = false;
                      }
                    }
                  } else {
                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .removeClass("has-error");
                  }
                }
              }

              if (formItem.InputType == "SelectiveTable") {
                let tbl = $TableData.filter(
                  (x) => x.ID == `form-item-` + formItem.FormItemID
                );
                let tableId = `form-item-` + formItem.FormItemID;
                let tableRows = $("#" + tableId + " tr");
                let rowIds = [];
                for (let i = 1; i < tableRows.length - 1; i++) {
                  let rowChildren = $(tableRows[i]).children();

                  rowChildren.each(function () {
                    let instanceValue = $(this).attr("isinstance");
                    let childValue = $(this).text(); // or .val() for input elements

                    if (instanceValue) {
                      rowIds.push({
                        ID: childValue,
                      });
                    }
                  });
                }
                $TableData[0].Rows = rowIds;
                activiyParam.ParamValue = JSON.stringify($TableData[0]);
              }
              if (formItem.InputType == "Table") {
                let tbl = $TableData.filter(
                  (x) => x.ID == `form-item-` + formItem.FormItemID
                );

                activiyParam.ParamValue = "NULL";

                if (tbl.length)
                  activiyParam.ParamValue = JSON.stringify(tbl[0]);

                if (
                  _IsRequired &&
                  _display != "none" &&
                  _visibility != "hidden" &&
                  val == null
                ) {
                  if (_SubmitKey == "Submit") {
                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");
                    submitReady = false;
                  }
                } else {
                  $(itemInputID)
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                }
              }

              if (formItem.InputType == "Paraghraph") {
                if (_SubmitKey == "Submit") {
                  $(itemInputID)
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                }
                activiyParam.ParamValue = "NULL";
              }

              if (formItem.InputType == "Sms") {
                $(itemInputID)
                  .parents('div[class^="form-group"]')
                  .removeClass("has-error");
                activiyParam.ParamValue = "1";
              }

              if (formItem.InputType == "FacilityBox") {
                let radioButton = $(".tblradio");
                for (let i = 0; i < radioButton.length; i++) {
                  if ($(radioButton[i]).is(":checked")) {
                    activiyParam.ParamValue = $(radioButton[i])
                      .parent()
                      .next()
                      .next()
                      .text();
                  }
                }
                if ($("#radio-0").attr("disabled") == undefined) {
                  $(itemInputID)
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                  AlertFlag = false;
                } else if (
                  activiyParam.ParamValue &&
                  $("#radio-0").attr("disabled")
                ) {
                  $(itemInputID)
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                  AlertFlag = false;
                } else {
                  swal("سقف استفاده مجاز در ماه 9 بار می باشد.", {
                    icon: "warning",
                    buttons: {
                      confirm: "ok",
                    },
                  });
                  if (_SubmitKey == "Submit") {
                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");

                    submitReady = false;
                    AlertFlag = true;
                  }
                }
              }

              if (formItem.InputType == "TimingBox") {
                let radioButton = $(".radioTime");
                let isCheck = false;

                let radioButtonInput = $(".tblradio");
                let timeBoxFlag = false;
                for (let i = 0; i < radioButtonInput.length; i++) {
                  if ($(radioButtonInput[i]).is(":checked")) {
                    timeBoxFlag = true;
                    let ValueOfFacility = $(radioButtonInput[i]).val();
                    if (ValueOfFacility == $("#radio-0").val()) {
                      for (let j = 0; j < radioButton.length; j++) {
                        if ($(radioButton[j]).is(":checked")) {
                          activiyParam.ParamValue = $(radioButton[j]).val();
                          isCheck = true;
                        }
                      }
                      if (!AlertFlag) {
                        if (isCheck) {
                          $(itemInputID)
                            .parents('div[class^="form-group"]')
                            .removeClass("has-error");
                        } else {
                          swal("لطفا زمان رزرو را انتخاب کنید .", {
                            icon: "warning",
                            buttons: {
                              confirm: "ok",
                            },
                          });
                          if (_SubmitKey == "Submit") {
                            $(itemInputID)
                              .parents('div[class^="form-group"]')
                              .addClass("has-error");

                            submitReady = false;
                          }
                        }
                      }
                    } else {
                      $(itemInputID)
                        .parents('div[class^="form-group"]')
                        .removeClass("has-error");
                      activiyParam.ParamValue = "NULL";
                    }
                  }
                }
                if (!timeBoxFlag && !AlertFlag) {
                  if (!timeBoxFlag) {
                    swal("لطفا نوع رفاهیات را انتخاب کنید .", {
                      icon: "warning",
                      buttons: {
                        confirm: "ok",
                      },
                    });
                  } else {
                    swal("سقف استفاده مجاز در ماه 9 بار می باشد.", {
                      icon: "warning",
                      buttons: {
                        confirm: "ok",
                      },
                    });
                  }
                }
              }

              if (
                formItem.BaseDataType == "BIGINT" ||
                formItem.BaseDataType == "INT" ||
                formItem.BaseDataType == "MONEY"
              ) {
                if ($.trim(val) != "" && val != null) {
                  if (
                    parseInt(val) < parseInt(formItem.MinValue) ||
                    parseInt(val) > parseInt(formItem.MaxValue)
                  ) {
                    if (_SubmitKey == "Submit") {
                      $(itemInputID)
                        .parents('div[class^="form-group"]')
                        .addClass("has-error");

                      submitReady = false;
                    }
                  } else {
                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .removeClass("has-error");
                  }
                } else {
                  //activiyParam.ParamValue = 0;
                }
              }

              if (formItem.InputType == "TextView") {
                $(itemInputID)
                  .parents('div[class^="form-group"]')
                  .removeClass("has-error");
              }
            } else {
              if (formItem.Label == "با توافقنامه موافقم.") {
                if (_IsRequired) {
                  if ($(itemInputID).is(":checked")) {
                    activiyParam.ParamValue = "1";

                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .removeClass("has-error");
                  } else {
                    swal("لطفاً توافقنامه را تایید کنید.", {
                      icon: "warning",
                    });

                    activiyParam.ParamValue = null;
                    submitReady = false;
                    return false;
                  }
                } else {
                  if ($(itemInputID).is(":checked")) {
                    activiyParam.ParamValue = "1";

                    $(itemInputID)
                      .parents('div[class^="form-group"]')
                      .removeClass("has-error");
                  } else {
                    activiyParam.ParamValue = "0";
                  }
                }
              } else {
                if ($(itemInputID).is(":checked")) {
                  activiyParam.ParamValue = "1";

                  $(itemInputID)
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                } else {
                  activiyParam.ParamValue = "0";
                }
              }
            }

            if (formItem.InputType != "FileBrowse") {
              if (_SubmitKey == "Save") {
                if (activiyParam.ParamValue == "")
                  activiyParam.ParamValue = " ";

                _IsRequired = false;
              }
            }
          }
          activiyParams[index] = activiyParam;

          if (_reportID != null) {
            $AdvancedSearch[index] = activiyParam;
          }
          // }
        });

        // //ویرایش درخواست کارمند برای تبدیل غیبت به ماموریت/اضافه کار
        // if (_formItems[0].FormID == 5051103) {
        //   const selectValue = $(`#form-item-505110304 option:selected`).text();
        //   const DescriptionValue = $(`#form-item-505110309`).val();
        //   if (selectValue == "عدم تایید" && DescriptionValue != "") {
        //     swal({
        //       text: "در صورت عدم تایید امکان ویرایش مجدد درخواست وجود ندارد!",
        //       icon: "warning",
        //       buttons: {
        //         confirm: "تایید", // "Yes" button
        //         cancel: "لغو", // "No" button
        //       },
        //     }).then((value) => {
        //       if (value) {
        //         subimt(submitReady);
        //       }
        //     });
        //   } else {
        //     subimt(submitReady);
        //   }
        // } else {
        subimt(submitReady);
        // }

        function subimt(submitReady) {
          if (_processStateID) {
            data.append("taskID", _taskID);

            data.append("processID", _prcStateOptions.ProcessID);

            var finalAction = JSON.stringify($("#process-final-action").val());

            if ($.trim(finalAction) == "" || finalAction == null) {
              if (_SubmitKey == "Submit") {
                $("#process-final-action")
                  .parents('div[class^="form-group"]')
                  .addClass("has-error");

                submitReady = false;
              }
            } else {
              $("#process-final-action")
                .parents('div[class^="form-group"]')
                .removeClass("has-error");
            }

            if (Number(finalAction) > 100) {
              data.append("processTransaction", finalAction);

              data.append("taskStatus", 6);
            } else {
              data.append("processTransaction", 100);

              data.append("taskStatus", finalAction);
            }

            if (taskGroupID == null || !taskGroupID) {
              taskGroupID = 0;
            }

            data.append("taskGroup", taskGroupID);

            if (_prcs.TaskHasSpentTime == 0) {
              data.append("taskSpentDay", 0);

              data.append("taskSpentHour", 0);

              data.append("taskSpentMinute", 0);
            }

            if (_prcs.TaskHasSpentTime == 1 || _prcs.TaskHasSpentTime == 2) {
              data.append("taskSpentDay", $("#task-spent-day").val());

              data.append("taskSpentHour", $("#task-spent-hour").val());

              data.append("taskSpentMinute", $("#task-spent-minute").val());
            }

            if (_prcs.TaskHasSpentTime == 2) {
              if (
                $("#task-spent-day").val() == "0" ||
                $("#task-spent-hour").val() == "0" ||
                $("#task-spent-minute").val() == "0"
              ) {
                if (_SubmitKey == "Submit") {
                  $("#task-spent-day")
                    .parents('div[class^="form-group"]')
                    .addClass("has-error");

                  submitReady = false;
                }
              } else {
                $("#task-spent-day")
                  .parents('div[class^="form-group"]')
                  .removeClass("has-error");
              }
            }

            if (_prcs.TaskHasReport == 0) {
              data.append("taskReport", "");
            }

            if (_prcs.TaskHasReport == 1 || _prcs.TaskHasReport == 2) {
              data.append("taskReport", $("#task-report").val());
            }

            if (_prcs.TaskHasReport == 2) {
              val = $("#task-report").val();

              if ($.trim(val) == "" || val == null) {
                if (_SubmitKey == "Submit") {
                  $("#task-report")
                    .parents('div[class^="form-group"]')
                    .addClass("has-error");

                  submitReady = false;
                }
              } else {
                $("#task-report")
                  .parents('div[class^="form-group"]')
                  .removeClass("has-error");
              }
            }

            if (_prcs.TaskHasServics == 0) {
              data.append("taskServices", "");
            }

            if (_prcs.TaskHasReport == 1 || _prcs.TaskHasReport == 2) {
              data.append(
                "taskServices",
                JSON.stringify($("#task-services").val())
              );
            }

            if (_prcs.TaskHasReport == 2) {
              val = JSON.stringify($("#task-services").val());

              if ($.trim(val) == "" || val == null) {
                if (_SubmitKey == "Submit") {
                  $("#task-services")
                    .parents('div[class^="form-group"]')
                    .addClass("has-error");

                  submitReady = false;
                }
              } else {
                $("#task-services")
                  .parents('div[class^="form-group"]')
                  .removeClass("has-error");
              }
            }

            var transacation = _prcTranscations.getListByFilter(
              "StateTransactionID",
              finalAction
            )[0];

            var taskAssignmentType = transacation.TaskAssignmentType.split("-");

            var startSLAStatus = transacation.StartSLAStatus.split("-");

            var resolveSLAStatus = transacation.ResolveSLAStatus.split("-");

            if (taskAssignmentType[0] == "UserBased") {
              if (
                taskAssignmentType[1] == "Individual" ||
                (taskAssignmentType[1] == "Collective" &&
                  taskAssignmentType[2] != "User")
              ) {
                val = JSON.stringify($("#refer-group-1").val());

                data.append("referedGroup1", val);

                if ($.trim(val) == "" || val == null) {
                  if (_SubmitKey == "Submit") {
                    $("#refer-group-1")
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");

                    submitReady = false;
                  }
                } else {
                  $("#refer-group-1")
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                }
              }

              if (taskAssignmentType[1] == "Individual") {
                if (taskAssignmentType[2] == "User") {
                  val = JSON.stringify($("#refer-user-5").val());

                  data.append("referedUser5", val);

                  if ($.trim(val) == "" || val == null) {
                    if (_SubmitKey == "Submit") {
                      $("#refer-user-5")
                        .parents('div[class^="form-group"]')
                        .addClass("has-error");

                      submitReady = false;
                    }
                  } else {
                    $("#refer-user-5")
                      .parents('div[class^="form-group"]')
                      .removeClass("has-error");
                  }
                } else {
                  val = JSON.stringify($("#refer-user-1").val());

                  data.append("referedUser1", val);

                  if ($.trim(val) == "" || val == null) {
                    if (_SubmitKey == "Submit") {
                      $("#refer-user-1")
                        .parents('div[class^="form-group"]')
                        .addClass("has-error");

                      submitReady = false;
                    }
                  } else {
                    $("#refer-user-1")
                      .parents('div[class^="form-group"]')
                      .removeClass("has-error");
                  }
                }
              }

              if (
                taskAssignmentType[1] == "Sequence" ||
                taskAssignmentType[1] == "Paralell"
              ) {
                val = JSON.stringify($("#refer-group-1").val());

                data.append("referedGroup1", val);

                if ($.trim(val) == "" || val == null) {
                  if (_SubmitKey == "Submit") {
                    $("#refer-group-1")
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");

                    submitReady = false;
                  }
                } else {
                  $("#refer-group-1")
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                }

                val = JSON.stringify($("#refer-user-1").val());

                data.append("referedUser1", val);

                if ($.trim(val) == "" || val == null) {
                  if (_SubmitKey == "Submit") {
                    $("#refer-user-1")
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");

                    submitReady = false;
                  }
                } else {
                  $("#refer-user-1")
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                }

                val = JSON.stringify($("#refer-group-2").val());

                data.append("referedGroup2", val);

                if ($.trim(val) == "" || val == null) {
                  if (_SubmitKey == "Submit") {
                    $("#refer-group-2")
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");

                    submitReady = false;
                  }
                } else {
                  $("#refer-group-2")
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                }

                val = JSON.stringify($("#refer-user-2").val());

                data.append("referedUser2", val);

                if ($.trim(val) == "" || val == null) {
                  if (_SubmitKey == "Submit") {
                    $("#refer-user-2")
                      .parents('div[class^="form-group"]')
                      .addClass("has-error");

                    submitReady = false;
                  }
                } else {
                  $("#refer-user-2")
                    .parents('div[class^="form-group"]')
                    .removeClass("has-error");
                }

                data.append(
                  "referedGroup3",
                  JSON.stringify($("#refer-group-3").val())
                );

                data.append(
                  "referedUser3",
                  JSON.stringify($("#refer-user-3").val())
                );

                data.append(
                  "referedGroup4",
                  JSON.stringify($("#refer-group-4").val())
                );

                data.append(
                  "referedUser4",
                  JSON.stringify($("#refer-user-4").val())
                );
              }
            }

            if (
              startSLAStatus[0] == "UserBased" ||
              resolveSLAStatus[0] == "UserBased"
            ) {
              data.append(
                "processSla",
                JSON.stringify($("#process-slas").val())
              );
            } else {
              data.append("processSla", 0);
            }

            data.append(
              "startSlaDay",
              JSON.stringify($("#sla-start-day").val())
            );

            data.append(
              "startSlaHour",
              JSON.stringify($("#sla-start-hour").val())
            );

            data.append(
              "startSlaMinute",
              JSON.stringify($("#sla-start-minute").val())
            );

            data.append(
              "resolveSlaDay",
              JSON.stringify($("#sla-resolve-day").val())
            );

            data.append(
              "resolveSlaHour",
              JSON.stringify($("#sla-resolve-hour").val())
            );

            data.append(
              "resolveSlaMinute",
              JSON.stringify($("#sla-resolve-minute").val())
            );
          }

          //#endregion

          if (!submitReady) {
            if ($$Lang == "Fa") {
              $(bodyID + " #emessage").text(
                "*بعضی از موارد اجباری پر نشده یا مقادیر آن نامعتبر است"
              );
            } else {
              $(bodyID + " #emessage").text(
                "*Some items are not filled or has invalid values"
              );
            }

            $(bodyID + " #smessage").html("");

            return;
          } else {
            $(bodyID + " #emessage").text("");
          }

          if (_parObjKey) {
            if (
              _parObjKey != 0 &&
              (_parObjType == null || _parObjType === undefined)
            ) {
              activiyParam = new Object();

              activiyParam.ParamIndex = 0;

              activiyParam.ParamValue = _parObjKey;

              activiyParams[0] = activiyParam;
            }
          }

          var __objKeys = [];

          if (!jQuery.isArray(_objKeys)) {
            __objKeys[0] = _objKeys;
          } else {
            __objKeys = _objKeys;
          }

          if (_actContextID != null) {
            $(".wrapper").block({
              message: '<span class="message-form-block">..Processing<span>',
              baseZ: 10000,
            });
          }

          //#region Append File Form Data

          $.each(_formItems, function (index, formItem) {
            if (formItem.InputType == "FileBrowse") {
              var files = $("#form-item-" + formItem.FormItemID).get(0).files;

              if (files) {
                if (files.length > 0) {
                  data.append("file" + index, files[0]);
                }
              }
            }
          });

          if (_processTaskID) {
            activiyParam = new Object();

            activiyParam.ParamIndex = activiyParams.length;

            activiyParam.ParamValue = _processTaskID;

            activiyParam.ParamName = "TaskID";

            activiyParams.push(activiyParam);
          }

          data.append("submitKey", _SubmitKey);

          data.append("activiyParams", JSON.stringify(activiyParams));

          data.append("objectIDs", JSON.stringify(__objKeys));

          data.append("id", _formOptions.ActivityID);

          //#endregion

          if (_processStateID) {
            var $taExecutor = new tExecutor(
              _modalID,
              data,
              boxID,
              jQuery.parseJSON(_formOptions.ActionOnSuccess)
            );

            $taExecutor.submit();
          } else {
            if (
              _parObjType != null &&
              _parObjType !== undefined &&
              _formOptions.ActionOnSuccess.indexOf("redirectPage") == -1 &&
              _formOptions.ActionOnSuccess.indexOf("FormView") == -1 &&
              _formOptions.ActionOnSuccess.indexOf("1025951") == -1
            ) {
              //Sepad Compatibility

              _formOptions.ActionOnSuccess = '[["closeModalForm"]]';
            }

            if (_actContextID != null) {
              var $aExecutor = new aExecutor(
                _modalID,
                data,
                boxID,
                jQuery.parseJSON(_formOptions.ActionOnSuccess),
                _parContextID,
                _parObjType
              );

              $aExecutor.submit();
            }

            if (_reportID != null) {
              if (_modalID != 0) {
                $("#btnCnsModal" + _modalID).trigger("click");
              }

              $("#pageNumber").val(1);

              reloadReportData();

              $("#link-filter").css("font-weight", "bold");

              $("#link-filter").css("color", "#000000");
            }
          }
        }
        //#endregion
          if(submitReady){    
          if (_SubmitKey == "Save") {
            $("#closeBtnModal1").trigger("click");
            let historyButton = $("#" + _actContextID).next();
            $(historyButton).trigger("click");
          }else if ($('.message-form-error').text() == ''){
            $("#closeBtnModal1").trigger("click");
            $("#closeBtnModal2").trigger("click");
          }}
        
        //#region Append Task Form Data
      } catch (e) {
        raiseError(e, bodyID);

        return;
      }
    }

    $("#closeBtnModal" + modalID).unbind("click");

    $("#closeBtnModal" + modalID).click(function () {
      _modalID = _modalID - 1;
    });

    $("#btnCnsModal" + modalID).unbind("click");

    $("#btnCnsModal" + modalID).click(function () {
      $("#closeBtnModal" + _modalID).trigger("click");
    });

    $("#btnRstModal" + modalID).unbind("click");

    $("#btnRstModal" + modalID).click(function () {
      if (_modalID != 0) {
        $("#btnCnsModal" + _modalID).trigger("click");
      }

      resetReport();
    });

    //#endregion
  };

  var renderSelectList = function (itemObj, parentID, activityID) {
    let disableFormItem = FormItemDisabled(parentID);
    try {
      var itemContent =
        '<div style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        `" class="form-group" id="form-group-` +
        itemObj.FormItemID +
        '"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        ' </label><div class="input-group"><div class="input-group-addon"><i class="glyphicon glyphicon-check"></i></div><select ' +
        disableFormItem +
        (itemObj.Visibility == "Disabled" ? "disabled" : "") +
        ` class="form-control form-input" id="form-item-` +
        itemObj.FormItemID +
        '"></select>';

      if (itemObj.SubTextVisible) {
        itemContent +=
          '</div><small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }
      var itemInputID = "#form-item-" + itemObj.FormItemID;

      if (jQuery.parseJSON(itemObj.IsReadOnly)) {
        $(itemInputID).attr("readonly", "readonly");
      }

      if (jQuery.parseJSON(itemObj.HasAddon)) {
        var _formAddon = new iData(
          "f0a087e3-3c5c-4ea7-a9c7-e80f19ff7726",
          itemObj.FormItemID
        );

        _formAddon = _formAddon.getObject();

        if (_formAddon.Type == "SmartSearch" || EnumTypeID == "") {
          itemContent +=
            '<div class="input-group-addon"><span class="glyphicon glyphicon-search" onclick="renderModalGridWithContext(' +
            (parseInt(_modalID) + 1) +
            "," +
            _formAddon.LanchedContextID +
            ",0,null,'" +
            getDefaultValue(itemObj) +
            '\')" style="cursor:pointer"></span></div>';
        }

        if (_formAddon.Type == "RepeatItem") {
          itemContent +=
            '<div class="input-group-addon" onclick="' +
            _formAddon.ActionOnClick +
            ';setTimeout(\'alignSideBarHeight();\', 1 * 100);"><span class="glyphicon glyphicon-plus" style="cursor:pointer" title="' +
            _formAddon.Label +
            '"></span></div>';
        }

        if (_formAddon.Type == "CalculateItem") {
          itemContent +=
            '<div class="input-group-addon" onclick="' +
            _formAddon.ActionOnClick +
            ';"><span class="glyphicon glyphicon-retweet" style="cursor:pointer" title="' +
            _formAddon.Label +
            '"></span></div>';
        }

        if (_formAddon.Type == "SendSMS") {
          itemContent +=
            '<div class="input-group-addon" onclick="' +
            _formAddon.ActionOnClick +
            ';"><span class="glyphicon glyphicon-phone" style="cursor:pointer" title="' +
            _formAddon.Label +
            '"></span></div>';
        }
      } else {
        itemContent += "</div>";
      }

      $(parentID).append(itemContent);

      if (
        itemObj.Name == _parObjType ||
        itemObj.Name == "Parent_" + _parObjType
      ) {
        $("#form-item-" + itemObj.FormItemID).prop("disabled", true);
      }

      if (itemObj.Visibility == "Disabled") {
        $("#form-item-" + itemObj.FormItemID).prop("disabled", true);
      }

      // if (itemObj.Visibility.indexOf("if") != -1) {
      //   var inlineFunction = new Function(itemObj.Visibility);

      //   inlineFunction();
      // }

      var $selectList = new selectList(
        itemObj.ActionControlID,
        itemObj.EnumTypeID
      );

      var filterVal1 = "";

      if (itemObj.ParentName != "") {
        if (
          itemObj.ParentName == _parObjType ||
          itemObj.ParentName == "Parent_" + _parObjType
        ) {
          filterVal1 = _parObjKey;
        } else {
          if (itemObj.ParentName == "ObjectID") {
            filterVal1 = _objKeys;
          } else {
            filterVal1 = $(
              "#form-item-" + $$FormItems[itemObj.ParentName].FormItemID
            ).val();

            if (
              filterVal1 == null ||
              filterVal1 == "" ||
              filterVal1 == "0" ||
              filterVal1 === undefined
            ) {
              try {
                if (
                  $$AjaxSelects[
                    "#form-item-" + $$FormItems[itemObj.ParentName].FormItemID
                  ].status == 0
                ) {
                  filterVal1 =
                    $$AjaxSelects[
                      "#form-item-" + $$FormItems[itemObj.ParentName].FormItemID
                    ].defaultValue;
                }
              } catch (e) {}
            }
          }
        }
      }

      var filterVal2 = "";

      if (itemObj.ParentName2 != "") {
        filterVal2 = $(
          "#form-item-" + $$FormItems[itemObj.ParentName2].FormItemID
        ).val();

        if (
          filterVal2 == null ||
          filterVal2 == "" ||
          filterVal2 == "0" ||
          filterVal1 === undefined
        ) {
          try {
            if (
              $$AjaxSelects[
                "#form-item-" + $$FormItems[itemObj.ParentName2].FormItemID
              ].status == 0
            ) {
              filterVal2 =
                $$AjaxSelects[
                  "#form-item-" + $$FormItems[itemObj.ParentName2].FormItemID
                ].defaultValue;
            }
          } catch (e) {}
        }
      }

      filterVal1 = filterVal1 == "" || filterVal1 == null ? "0" : filterVal1;

      filterVal2 = filterVal2 == "" || filterVal2 == null ? "0" : filterVal2;

      value = getDefaultValue(itemObj);

      $selectList.renderContext(
        "#form-item-" + itemObj.FormItemID,
        itemObj.ReferEntityMultipleAllow,
        activityID,
        jQuery.parseJSON(itemObj.IsRequired),
        itemObj.ActionOnChange,
        value,
        filterVal1,
        filterVal2,
        itemObj.Description
      );

      //Auto Fill Form for BPMS
      $("#form-item-" + itemObj.FormItemID).on(
        "changed.bs.select",
        function (e, clickedIndex, newValue, oldValue) {
          var selected = $(e.currentTarget).val();

          if (itemObj.Name == "Val000") {
            _data = new aData(
              _formOptions.DataActivityID,
              selected,
              null,
              "1/1/2020"
            );

            if (_data.getError() != null) {
              raiseError(_data.getError(), bodyID);

              return;
            }

            _data = _data.getObject();

            $.each(_formItems, function (index, _formItem) {
              {
                if (_formItem.InputType != "SelectList") {
                  $("#form-item-" + _formItem.FormItemID).val(
                    getDefaultValue(_formItem)
                  );
                } else {
                  $("#form-item-" + _formItem.FormItemID).selectpicker(
                    "val",
                    getDefaultValue(_formItem)
                  );
                }
              }
            });
          }

          //ناهار صبحانه تمایل ندارم

          if (activityID == 6060003 || activityID == 6070003) {
            if (selected == "تمایل ندارم") {
              $("#form-group-" + (itemObj.FormItemID + 5)).css(
                "visibility",
                "hidden"
              );
            } else {
              $("#form-group-" + (itemObj.FormItemID + 5)).css(
                "visibility",
                "visible"
              );
            }
          }

          //توضیحات در مرخصی بدون حقوق اجباری باشد
          if (activityID == 6040007) {
            $("#form-item-604000734 option:selected").text() == "بدون حقوق"
              ? $("#form-item-604000719").attr("placeholder", "")
              : $("#form-item-604000719").attr("placeholder", "اختیاری");
          }
        }
      );

      if (activityID == 6060003 || activityID == 6070003) {
        if (
          $(`#form-group-` + activityID + "0")
            .parent()
            .attr("id") == "boxBodyModal1"
        ) {
          if (
            $("#form-item-" + (itemObj.FormItemID - 5)).val() == "تمایل ندارم"
          ) {
            $("#form-group-" + itemObj.FormItemID).css("visibility", "hidden");
          } else {
            $("#form-group-" + (itemObj.FormItemID - 5)).css(
              "visibility",
              "visible"
            );
          }
        }
      }
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderTextBox = function (itemObj, parentID, activityID) {
    let disableFormItem = FormItemDisabled(parentID);
    try {
      var placeholder = "";

      if (
        !jQuery.parseJSON(itemObj.IsRequired) &&
        _reportID == null &&
        $(parentID).prev().text() != "خلاصه درخواست"
      ) {
        placeholder = localize("اختیاری");
      }

      var toggle = "";

      if (itemObj.UnitToDisplay == "ریال") {
        itemObj.UnitToDisplay = $$Currency;
      }

      var itemContent =
        toggle +
        '<div style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none"
          : "") +
        '" class="form-group" id="form-group-' +
        itemObj.FormItemID +
        '"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        (itemObj.UnitToDisplay != ""
          ? " (" + itemObj.UnitToDisplay + ") "
          : "") +
        '</label><div class="input-group"><div class="input-group-addon"><i class="glyphicon glyphicon-edit"></i></div><input ' +
        disableFormItem +
        '  type="text" title="' +
        (_reportID == null ? itemObj.Name : "") +
        '" class="form-control form-input" id="form-item-' +
        itemObj.FormItemID +
        '" placeholder="' +
        placeholder +
        '">';

      if (jQuery.parseJSON(itemObj.HasAddon)) {
        var _formAddon = new iData(
          "f0a087e3-3c5c-4ea7-a9c7-e80f19ff7726",
          itemObj.FormItemID
        );

        _formAddon = _formAddon.getObject();

        if (_formAddon.Type == "SmartSearch") {
          itemContent +=
            '<div class="input-group-addon"><span class="glyphicon glyphicon-search" onclick="renderModalGridWithContext(' +
            (parseInt(_modalID) + 1) +
            "," +
            _formAddon.LanchedContextID +
            ",0,null,'" +
            getDefaultValue(itemObj) +
            '\')" style="cursor:pointer"></span></div>';
        }

        if (_formAddon.Type == "RepeatItem") {
          itemContent +=
            '<div class="input-group-addon" onclick="' +
            _formAddon.ActionOnClick +
            ';setTimeout(\'alignSideBarHeight();\', 1 * 100);"><span class="glyphicon glyphicon-plus" style="cursor:pointer" title="' +
            _formAddon.Label +
            '"></span></div>';
        }

        if (_formAddon.Type == "CalculateItem") {
          itemContent +=
            '<div class="input-group-addon" onclick="' +
            _formAddon.ActionOnClick +
            ';"><span class="glyphicon glyphicon-retweet" style="cursor:pointer" title="' +
            _formAddon.Label +
            '"></span></div>';
        }

        if (_formAddon.Type == "SendSMS") {
          itemContent +=
            '<div class="input-group-addon" onclick="' +
            _formAddon.ActionOnClick +
            ';"><span class="glyphicon glyphicon-phone" style="cursor:pointer" title="' +
            _formAddon.Label +
            '"></span></div>';
        }
      } else {
        itemContent += toggle + "</div>";
      }

      if (
        itemObj.SubTextVisible ||
        (itemObj.Description != "" && itemObj.Description != null)
      ) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      var itemInputID = "#form-item-" + itemObj.FormItemID;

      $(parentID).append(itemContent);

      if (
        $.parseJSON(_isDefault.toLowerCase()) &&
        (itemObj.Name == "ELabel" ||
          itemObj.Name == "Label" ||
          itemObj.Name == "ChangeLabel")
      ) {
        $(itemInputID).prop("disabled", true);
      }

      if (itemObj.AttributeTypeName == "LocalString" && $$Lang != "Fa") {
        itemObj.RegexFormat = "";
      }

      if (
        !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        if (
          itemObj.RegexFormat != "" &&
          itemObj.MaskAlias == "" &&
          itemObj.MaskFormat == ""
        ) {
          $(itemInputID).attr("data-inputmask-regex", itemObj.RegexFormat);

          $(itemInputID).inputmask("Regex");
        }

        if (itemObj.MaskAlias != "") {
          $(itemInputID).attr(
            "data-inputmask",
            '"alias": "' + itemObj.MaskAlias + '"'
          );

          $(itemInputID).inputmask();
        }

        if (itemObj.MaskFormat != "") {
          $(itemInputID).attr(
            "data-inputmask",
            '"mask": "' + itemObj.MaskFormat + '"'
          );

          $(itemInputID).inputmask();
        }
      }

      if (itemObj.Direction == "rtl" && $$Dir == "RTL") {
        $(itemInputID).attr("dir", "rtl");

        $(itemInputID).attr("data-inputmask", "'type':'reverse'");

        $(itemInputID).css("text-align", "right");
      } else {
        $(itemInputID).attr("dir", "ltr");

        $(itemInputID).css("text-align", "left");
      }

      if (itemObj.MaxValueLenght != "") {
        $(itemInputID).attr("maxlength", itemObj.MaxValueLenght);
      }

      if (jQuery.parseJSON(itemObj.IsReadOnly)) {
        $(itemInputID).attr("readonly", "readonly");
      }

      if (itemObj.Width != "") {
        $(itemInputID).css("width", itemObj.Width);
      }

      if (itemObj.InputType == "AutoTextBox") {
        var filterVal1 = "";

        if (itemObj.ParentName != "") {
          if (
            itemObj.ParentName == _parObjType ||
            itemObj.ParentName == "Parent_" + _parObjType
          ) {
            filterVal1 = _parObjKey;
          } else {
            filterVal1 = $(
              "#form-item-" + $$FormItems[itemObj.ParentName].FormItemID
            ).val();

            if (
              filterVal1 == null ||
              filterVal1 == "" ||
              filterVal1 == "0" ||
              filterVal1 === undefined
            ) {
              try {
                if (
                  $$AjaxSelects[
                    "#form-item-" + $$FormItems[itemObj.ParentName].FormItemID
                  ].status == 0
                ) {
                  filterVal1 =
                    $$AjaxSelects[
                      "#form-item-" + $$FormItems[itemObj.ParentName].FormItemID
                    ].defaultValue;
                }
              } catch (e) {}
            }
          }
        }

        filterVal1 = filterVal1 == "" || filterVal1 == null ? "0" : filterVal1;

        var $autoComplete = new autoComplete(
          itemObj.EntityAttributeID,
          itemObj.ActionControlID
        );

        $autoComplete.renderContext(
          "#form-item-" + itemObj.FormItemID,
          activityID,
          filterVal1,
          itemObj.ParentName
        );
      }

      $(itemInputID).val(getDefaultValue(itemObj));

      if (itemObj.ActionOnChange != "") {
        $(itemInputID).change(function () {
          var inlineFunction = new Function(
            $$FormItems[this.title].ActionOnChange
          );

          inlineFunction();
        });
      }

      if (itemObj.Visibility == "Disabled") {
        $(itemInputID).prop("disabled", true);
        $(itemInputID).addClass("form-input-dis");
        $(itemInputID).removeClass("form-input");
      }
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderNumericRangeBox = function (itemObj, parentID) {
    let disableFormItem = FormItemDisabled(parentID);

    try {
      var itemContent =
        '<div style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" class="form-group" id="form-group-' +
        itemObj.FormItemID +
        '"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        '</label><div class="input-group"><div class="input-group-addon"><i class="fa-duotone fa-pen-to-square"></i></div><input ' +
        disableFormItem +
        '  type="text" class="form-control form-input" style="width:50%;margin:0px 0px 0px 0%" id="form-item-from-' +
        itemObj.FormItemID +
        '" placeholder="از"><input ' +
        disableFormItem +
        '  type="text" class="form-control form-input" style="width:50%" id="form-item-to-' +
        itemObj.FormItemID +
        '" placeholder="تا" ></div>';

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      var itemInputID = "#form-item-from-" + itemObj.FormItemID;

      var itemInputID2 = "#form-item-to-" + itemObj.FormItemID;

      $(parentID).append(itemContent);

      if (jQuery.parseJSON(itemObj.IsReadOnly)) {
        $(itemInputID).attr("readonly", "readonly");
      }

      if (itemObj.RegexFormat != "") {
        $(itemInputID).attr("data-inputmask-regex", itemObj.RegexFormat);

        $(itemInputID).inputmask("Regex");

        $(itemInputID2).attr("data-inputmask-regex", itemObj.RegexFormat);

        $(itemInputID2).inputmask("Regex");
      }

      $(itemInputID).attr("dir", "ltr");

      $(itemInputID).css("text-align", "left");

      $(itemInputID2).attr("dir", "ltr");

      $(itemInputID2).css("text-align", "left");

      if (itemObj.MaxValueLenght != "") {
        $(itemInputID).attr("maxlength", itemObj.MaxValueLenght);

        $(itemInputID2).attr("maxlength", itemObj.MaxValueLenght);
      }
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderFileBrowse = function (itemObj, parentID) {
    let disableFormItem = FormItemDisabled(parentID);
    try {
      itemObj.DefaultValue = getDefaultValue(itemObj);

      var index = itemObj.DefaultValue.indexOf("data-file-attach-code");

      if (index > -1) {
        _fileExist[itemObj.Name] = "1";

        var index2 = itemObj.DefaultValue.indexOf("' title");

        _fileAttachCode[itemObj.Name] = itemObj.DefaultValue.substring(
          23 + index,
          index2
        );

        itemObj.DefaultValue =
          '<img src="App_Res/' +
          itemObj.LocationPath.replace("../../App_Res/", "") +
          _fileAttachCode[itemObj.Name] +
          '"/>';
      }

      if (itemObj.DefaultValue == "") {
        _fileExist[itemObj.Name] = "0";

        _fileAttachCode[itemObj.Name] = "";

        itemObj.DefaultValue = null;
      }

      var placeholder = "";

      if (
        !jQuery.parseJSON(itemObj.IsRequired) &&
        $(parentID).prev().text() != "خلاصه درخواست"
      ) {
        placeholder =
          "<span class='form-input-placeholder'>" +
          localize("اختیاری") +
          "</span>";
      }

      var itemContent =
        '<div style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" class="form-group" id="form-group-' +
        itemObj.FormItemID +
        '" data-item-name="' +
        itemObj.Name +
        '"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        "</label><div><input " +
        disableFormItem +
        '  type="file"  class="form-control form-input file"  data-show-upload="false" id="form-item-' +
        itemObj.FormItemID +
        '"></div>';

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      if (itemObj.AttributeTypeName == "Image") {
        var maxSize = itemObj.MaxValue.split("*");

        var minSize = itemObj.MinValue.split("*");

        $("#form-item-" + itemObj.FormItemID).fileinput({
          maxImageWidth: maxSize[0],
          maxImageHeight: maxSize[1],
          minImageWidth: minSize[0],
          minImageHeight: minSize[1],
          allowedFileExtensions: jQuery.parseJSON(itemObj.RegexFormat),
          allowedFileTypes: ["image"],
          showPreview: true,
          maxFileSize: itemObj.MaxValueLenght,
          initialPreview: [itemObj.DefaultValue],
        });
      } else {
        $("#form-item-" + itemObj.FormItemID).fileinput({
          allowedFileExtensions: jQuery.parseJSON(itemObj.RegexFormat),
          maxFileSize: itemObj.MaxValueLenght,
        });

        $("#form-group-" + itemObj.FormItemID + " .file-caption-name").html(
          '<div class="file-caption-name" title="1 file selected"><i class="glyphicon glyphicon-file kv-caption-icon"></i>file selected</div>'
        );
      }

      if (itemObj.DefaultValue == null) {
        $("#form-group-" + itemObj.FormItemID + " .file-caption-name").html(
          placeholder
        );
      }

      if (itemObj.Width != "") {
        $("#form-item-" + itemObj.FormItemID).css("width", itemObj.Width);
      }

      $("#form-item-" + itemObj.FormItemID).on(
        "fileimageloaded",
        function (event, previewId) {
          setTimeout("alignSideBarHeight();", 1 * 100);
        }
      );

      $("#form-item-" + itemObj.FormItemID).on(
        "fileloaded",
        function (event, previewId) {
          setTimeout("alignSideBarHeight();", 1 * 100);
        }
      );

      $("#form-item-" + itemObj.FormItemID).on(
        "fileerror",
        function (event, previewId) {
          setTimeout("alignSideBarHeight();", 1 * 100);
        }
      );
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderTableFileBrowse = function (itemObj, FileBrowseID, fileName) {
    for (let i = 0; i < FileBrowseID.length; i++) {
      let tempFileBrowseID = FileBrowseID[i];

      itemObj.DefaultValue =
        '<img style="max-width:180px;max-height:300px"' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        'src="../App_Res/Upload/Entity/Attachment/' +
        fileName[tempFileBrowseID] +
        '"/>';

      // Check for image type and apply image-related settings
      if (itemObj.AttributeTypeName == "Image") {
        var maxSize = itemObj.MaxValue.split("*");
        var minSize = itemObj.MinValue.split("*");

        $("#item" + tempFileBrowseID).fileinput({
          maxImageWidth: maxSize[0],
          maxImageHeight: maxSize[1],
          minImageWidth: minSize[0],
          minImageHeight: minSize[1],
          allowedFileTypes: ["image"],
          showPreview: true,
          maxFileSize: itemObj.MaxValueLenght,
          initialPreview: [itemObj.DefaultValue],
        });
      } else {
        // Apply file settings for non-image types
        $("#item" + tempFileBrowseID).fileinput({
          showPreview: true,
          maxFileSize: itemObj.MaxValueLenght,
          // initialPreview: itemObj.DefaultValue,
        });
        if (fileName) {
          // Update caption
          $("#item" + tempFileBrowseID)
            .parent()
            .parent()
            .prev()
            .html(
              '<div class="file-caption-name" title="1 file selected"><i class="glyphicon glyphicon-file kv-caption-icon"></i>file selected</div>'
            );
        }
        // Update caption
        // $("#form-group-" + tempFileBrowseID + " .file-caption-name").html(
        //   '<div class="file-caption-name" title="1 file selected"><i class="glyphicon glyphicon-file kv-caption-icon"></i>file selected</div>'
        // );
      }

      // Apply max width if specified in the item object
      if (itemObj.Width != "") {
        $("#item" + tempFileBrowseID).css("width", itemObj.Width);
      }

      // Apply max-width property to restrict the width of the file input and preview
      $("#item" + tempFileBrowseID).css("max-width", "100%"); // Set max width to 100% of the container's width
      $("#item" + tempFileBrowseID)
        .closest(".file-input")
        .css("max-width", "220px"); // Set a fixed max width for the container (adjust as needed)

      // Event handlers for adjusting the sidebar height
      $("#item" + tempFileBrowseID).on(
        "fileimageloaded",
        function (event, previewId) {
          setTimeout("alignSideBarHeight();", 1 * 100);
        }
      );

      $("#item" + tempFileBrowseID).on(
        "fileloaded",
        function (event, previewId) {
          setTimeout("alignSideBarHeight();", 1 * 100);
        }
      );

      $("#item" + tempFileBrowseID).on(
        "fileerror",
        function (event, previewId) {
          setTimeout("alignSideBarHeight();", 1 * 100);
        }
      );

      // Apply font style to all input groups
      $(`.input-group`).css("font-family", "IRANSansWeb");
    }
  };

  var renderCheckBox = function (itemObj, parentID) {
    let disableFormItem = FormItemDisabled(parentID);
    try {
      var itemContent =
        '<div class="form-group" style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" id="form-group-' +
        itemObj.FormItemID +
        '"><div class="checkbox"><label for="form-item-' +
        itemObj.FormItemID +
        '" class="input-checkbox-label"> <input ' +
        disableFormItem +
        '  type="checkbox" title="' +
        itemObj.Name +
        '" id="form-item-' +
        itemObj.FormItemID +
        '"/>&nbsp;' +
        itemObj.Label +
        "</label></div>";

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      if (getDefaultValue(itemObj) == "True") {
        $("#form-item-" + itemObj.FormItemID).attr("checked", "checked");
      }

      if (itemObj.Visibility == "Disabled") {
        $("#form-item-" + itemObj.FormItemID).attr("disabled", "disabled");
      }
      var itemInputID = "#form-item-" + itemObj.FormItemID;

      if (jQuery.parseJSON(itemObj.IsReadOnly)) {
        $(itemInputID).attr("readonly", "readonly");
      }

      $("#form-item-" + itemObj.FormItemID)
        .iCheck({
          checkboxClass: "icheckbox_square-green",

          radioClass: "iradio_square-green",
        })
        .on("ifChanged", function (e) {
          var isChecked = e.currentTarget.checked;

          if ($$FormItems[e.currentTarget.title] === undefined) {
            return;
          }

          if ($$FormItems[e.currentTarget.title].ActionOnChange == "") {
            return;
          }

          $.each(
            jQuery.parseJSON($$FormItems[e.currentTarget.title].ActionOnChange),
            function (index, event) {
              if (event.value.indexOf("[" + isChecked + "]") != -1) {
                $.each(event.actions, function (index, action) {
                  const targetItems = Array.isArray(action.target)
                    ? action.target
                    : [action.target];
                  targetItems.forEach((itemName) => {
                    if (action.targetType == "FormItem") {
                      if (action.actionType == "Hide") {
                        $(
                          "#form-group-" + $$FormItems[itemName].FormItemID
                        ).css("display", "none");
                      }

                      if (action.actionType == "Show") {
                        $(
                          "#form-group-" + $$FormItems[itemName].FormItemID
                        ).css("display", "block");
                      }

                      if (action.actionType == "ChangeValue") {
                        var inlineFunction = new Function(
                          action.actionCallback
                        );

                        inlineFunction();
                      }
                    }
                  });

                  targetItems.forEach((itemName) => {
                    if (action.targetType == "FormGroupBox") {
                      if (action.actionType == "Hide") {
                        $("#form-group-" + $$FormGroups[itemName]).css(
                          "display",
                          "none"
                        );
                      }

                      if (action.actionType == "Show") {
                        $("#form-group-" + $$FormGroups[itemName]).css(
                          "display",
                          "block"
                        );
                      }

                      if (action.actionType == "Reload") {
                        $("#form-group-" + $$FormGroups[itemName]).css(
                          "display",
                          "block"
                        );
                      }
                    }
                  });
                });
              }
            }
          );
        });

      if (itemObj.ActionOnChange != "") {
        setTimeout(
          "triggerDefaultEvent('" +
            itemObj.Name +
            "','" +
            getDefaultValue(itemObj).toLowerCase() +
            "')",
          500
        );
      }
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderSms = function (itemObj, parentID) {
    try {
      itemObj.IsRequired = false;
      itemObj.IsReadOnly = false;

      var itemContent =
        '<div class="form-group" style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" id="form-group-' +
        itemObj.FormItemID +
        '"><div class="checkbox" style="padding:0 20px;"><label for="form-item-' +
        itemObj.FormItemID +
        '" class="input-checkbox-label"> <input type="checkbox" title="' +
        itemObj.Name +
        '" id="form-item-' +
        itemObj.FormItemID +
        '"/>&nbsp;' +
        itemObj.Label +
        "</label></div>";

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      if (getDefaultValue(itemObj) == "True") {
        $("#form-item-" + itemObj.FormItemID).attr("checked", "checked");
      }

      $("#form-item-" + itemObj.FormItemID).attr("disabled", "disabled");
      $("#form-item-" + itemObj.FormItemID).attr("checked", true);
      var itemInputID = "#form-item-" + itemObj.FormItemID;

      if (itemObj.ActionOnChange != "") {
        setTimeout(
          "triggerDefaultEvent('" +
            itemObj.Name +
            "','" +
            getDefaultValue(itemObj).toLowerCase() +
            "')",
          500
        );
      }
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderAgreement = function (itemObj, parentID) {
    try {
      itemObj.IsRequired = false;
      var itemContent =
        '<div class="form-group"  style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" id="form-group-' +
        itemObj.FormItemID +
        '"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        '</label><div><textarea title="' +
        itemObj.Name +
        '" disabled agreement style=" max-height: 500px;min-height: 280px;word-wrap: break-word;max-height:none;max-width:none;resize:none;border:1px solid var(--Smoke);width:100%;" id="from-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.DefaultValue +
        "</textarea>" +
        "</div> ";

      if (
        itemObj.SubTextVisible ||
        (itemObj.Description != "" && itemObj.Description != null)
      ) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      var itemInputID = "#form-item-" + itemObj.FormItemID;

      if (itemObj.Width != "") {
        $(itemInputID).css("width", itemObj.Width);
      }

      if (itemObj.Direction == "rtl" && $$Dir == "RTL") {
        $(itemInputID).attr("dir", "rtl");

        $(itemInputID).css("text-align", "right");
      } else {
        $(itemInputID).attr("dir", "ltr");

        $(itemInputID).css("text-align", "left");
      }

      $("#form-item-" + itemObj.FormItemID).val(
        getDefaultValue(itemObj).replace(/<br\/>/g, "\n")
      );

      if (
        itemObj.Name.indexOf("DoD") > -1 ||
        itemObj.AttributeTypeName == "CommandText"
      ) {
        $("#form-item-" + itemObj.FormItemID).Editor();

        $("#form-item-" + itemObj.FormItemID).Editor(
          "setText",
          getDefaultValue(itemObj)
        );
      }
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  function renderTreeBox(itemObj, parentID) {
    $.ajax({
      type: "POST",
      url: "../../App_Sys/Services/CustomActivity.asmx/GetDepartments",
      data: "",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      // Consider using async: true for better performance
      success: function (data) {
        // Parse the stringified JSON
        if (typeof data.d === "string") {
          try {
            data.d = JSON.parse(data.d);
          } catch (e) {
            console.error("Failed to parse JSON:", e);
            alert("Invalid JSON format received!");
            return;
          }
        }
        // Ensure the parsed data is an array or extract it from an object
        let departmentData = [];
        if (Array.isArray(data.d)) {
          departmentData = data.d;
        } else if (data.d && Array.isArray(data.d.Departments)) {
          departmentData = data.d.Departments;
        } else {
          console.error("Unexpected data format", data);
          alert("Unexpected data format!");
          return;
        }

        // Create the tree container and append it to the parent element
        const parentElement = $(parentID);
        const displayStyle =
          itemObj.Visibility === "false" ? "display:none" : "";
        const treeHTML = `
          <div class="form-group" id="form-group-${itemObj.FormItemID}">
          <label for="form-item-${itemObj.FormItemID}">${itemObj.Label}</label>
            <div id="treeBox">
              <ul class="tree" style="list-style-type: none; ${displayStyle}"></ul>
            </div>
          </div>`;
        parentElement.append(treeHTML); // Add the .tree structure to the DOM

        // Get the tree container after it's added to the DOM
        const treeContainer = $(`${parentID} .tree`);

        // Convert flat data to hierarchical tree structure
        const treeData = buildTree(departmentData);

        // Populate the tree in the container
        populateTree(treeContainer[0], treeData, "department"); // Pass DOM element instead of jQuery object

        // Get the default values and check the inputs
        const defaultValue = getDefaultValue(itemObj);
        checkDefaultValues(defaultValue);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX error:", textStatus, errorThrown);
        alert("An error occurred while fetching data.");
      },
    });
  }

  // Function to build hierarchical tree from flat data
  function buildTree(data) {
    const tree = [];
    const lookup = {};

    // Initialize the tree with departments
    data.forEach((item) => {
      lookup[item.ID] = { ...item, children: [] }; // Ensure children is an array
    });

    // Build tree based on ParentId
    data.forEach((item) => {
      if (item.ParentId) {
        lookup[item.ParentId]?.children.push(lookup[item.ID]); // Add to parent's children
      } else {
        tree.push(lookup[item.ID]); // No ParentId, push to root tree
      }
    });

    return tree;
  }

  // Updated populateTree function with checkboxes and toggle functionality
  function populateTree(container, items, subject, hasParent = false) {
    items.forEach((item) => {
      const li = document.createElement("li");
      let iconClass;
      const hasChildren = item.children && item.children.length > 0; // Check if children exist
      const building = item["data-type"] === "building"; // Check if the item is a building

      // Determine the icon class based on the item's properties
      if (hasChildren && !building) {
        iconClass =
          subject === "department"
            ? "fa fa-users darkBlue"
            : "fa fa-solid fa-apartment darkgreen"; // Site icon for locations with children
      } else if (hasParent && !hasChildren) {
        iconClass =
          subject === "department"
            ? "fa fa-user darkcyan"
            : "fa fa-solid fa-apartment darkgreen"; // Department leaf node
      } else if (!hasParent && !hasChildren) {
        iconClass =
          subject === "department"
            ? "fa-regular fa-sitemap"
            : "fa fa-solid fa-apartment darkgreen"; // Top-level location with no children
      }

      // Create the checkbox, icon, and label
      li.innerHTML = `
          <input type="checkbox" value="${item.ID}" name="${
        item.Label
      }" data-type="${item["data-type"] || ""}" class="tree-checkbox"/>
          ${
            hasChildren
              ? `<span class="toggle-icon">
              <i style="margin:5px;" class="fa fa-caret-left"></i></span>`
              : ""
          }
          <i class="${iconClass} tree-item-icon"></i>
          <label class="tree-item-label">${item.Label}</label>`;

      // Add the list item to the container
      container.appendChild(li);

      // If the item has children, recursively populate the child list
      if (hasChildren) {
        const ul = document.createElement("ul");
        ul.style.display = "none"; // Collapse by default
        populateTree(ul, item.children, subject, true); // Pass true for hasParent
        li.appendChild(ul);
      }

      // Get the checkbox and add the change event listener
      const checkbox = li.querySelector(".tree-checkbox");
      if (hasChildren) {
        checkbox.addEventListener("change", function () {
          toggleChildCheckboxes(checkbox, li);
        });
      }

      // Add event listener for the toggle icon
      const toggleIcon = li.querySelector(".toggle-icon");
      if (toggleIcon) {
        toggleIcon.addEventListener("click", function (event) {
          toggleGroup(this, event);
        });
      }
    });
  }

  // Function to toggle child checkboxes based on the parent checkbox state
  function toggleChildCheckboxes(parentCheckbox, listItem) {
    const childCheckboxes = listItem.querySelectorAll("ul .tree-checkbox");
    childCheckboxes.forEach((checkbox) => {
      checkbox.checked = parentCheckbox.checked; // Set the same state as the parent
    });
  }

  // Function to toggle the visibility of child groups
  function toggleGroup(toggleIcon, event) {
    event.stopPropagation(); // Prevent closing the dropdown
    const sublist = toggleIcon.parentElement.querySelector("ul");
    if (sublist.style.display === "none" || sublist.style.display === "") {
      sublist.style.display = "block";
      toggleIcon.innerHTML =
        '<i style="margin:5px;" class="fa fa-caret-down"></i>';
    } else {
      sublist.style.display = "none";
      toggleIcon.innerHTML =
        '<i style="margin:5px;" class="fa fa-caret-left"></i>';
    }
  }

  // Function to check inputs based on default values and open parents
  function checkDefaultValues(defaultValue) {
    if (!defaultValue) return;
    // Convert default value string to an array
    const defaultValuesArray = defaultValue.split("‚");
    // Check the inputs with the corresponding values and open their parents
    defaultValuesArray.forEach((value) => {
      const checkbox = document.querySelector(
        `.tree-checkbox[value="${value}"]`
      );
      if (checkbox) {
        checkbox.checked = true;
        openParentContainers(checkbox); // Open parent containers
      }
    });
  }

  // Function to open parent containers of a checked input
  function openParentContainers(checkbox) {
    let parentListItem = checkbox.closest("li");

    // Traverse upwards and open all parent containers
    while (parentListItem) {
      const parentUl = parentListItem.parentElement;
      const parentLi = parentUl.closest("li");
      const toggleIcon = parentLi
        ? parentLi.querySelector(".toggle-icon")
        : null;

      if (parentUl && parentUl.tagName === "UL") {
        parentUl.style.display = "block"; // Open the parent UL
        if (toggleIcon) {
          toggleIcon.innerHTML =
            '<i style="margin:5px;" class="fa fa-caret-down"></i>'; // Update the toggle icon
        }
      }

      // Move up to the next parent list item
      parentListItem = parentLi;
    }
  }

  var renderRadioButtonList = function (itemObj, parentID) {
    let disableFormItem = FormItemDisabled(parentID);
    try {
      var itemContent =
        '<div style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" class="form-group" id="form-group-' +
        itemObj.FormItemID +
        '"><label>' +
        itemObj.Label +
        "</label><div>";

      var $radioButtonList = new radioButtonList(itemObj.EnumTypeID);

      itemContent += $radioButtonList.renderContext(
        itemObj.FormItemID,
        itemObj.DefaultValue
      );

      itemContent +=
        "</div><input " +
        disableFormItem +
        ' type="text" id="form-item-' +
        itemObj.FormItemID +
        '" value="' +
        itemObj.DefaultValue +
        '">';

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted">' + itemObj.Description + "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      $(
        "input[type=radio][name=optionsRadios-" + itemObj.FormItemID + "]"
      ).change(function () {
        if ($(this).is(":checked")) {
          $("#form-item-" + itemObj.FormItemID).val(this.value);
        }
      });

      $(
        "input[type=radio][name=optionsRadios-" + itemObj.FormItemID + "]"
      ).iCheck({
        checkboxClass: "icheckbox_square-green",

        radioClass: "iradio_square-green",

        increaseArea: "20%", // optional
      });
    } catch (e) {
      itemContent += "</div></div>";

      $(parentID).append(itemContent);

      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderDateBox = function (itemObj, parentID) {
    let disableFormItem = FormItemDisabled(parentID);
    let click = disableFormItem == "disabled" ? "" : "click";

    try {
      var placeholder = "";

      if (
        !jQuery.parseJSON(itemObj.IsRequired) &&
        $(parentID).prev().text() != "خلاصه درخواست"
      ) {
        placeholder = localize("اختیاری");
      }

      var itemContent;

      if (itemObj.IsReadOnly) {
        itemContent =
          '<div style="' +
          (itemObj.Visibility == "false" ||
          itemObj.Visibility == "DefaultHidden"
            ? "display:none !important"
            : "") +
          '" class="form-group" id="form-group-' +
          itemObj.FormItemID +
          '"><label for="form-item-' +
          itemObj.FormItemID +
          '">' +
          itemObj.Label +
          `</label><div class="input-group"><div style="cursor: pointer;" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div><input ` +
          disableFormItem +
          ' type="text" class="form-control form-input" id="form-item-' +
          itemObj.FormItemID +
          '" placeholder="' +
          placeholder +
          '" readonly="readonly" dir="ltr"></div>';
      } else {
        itemContent =
          '<div style="' +
          (itemObj.Visibility == "false" ||
          itemObj.Visibility == "DefaultHidden"
            ? "display:none !important"
            : "") +
          '" class="form-group" id="form-group-' +
          itemObj.FormItemID +
          '"><label for="form-item-' +
          itemObj.FormItemID +
          '">' +
          itemObj.Label +
          '</label><div class="input-group"><div id="picker-' +
          itemObj.FormItemID +
          '" data-mdpersiandatetimepickershowing="false" title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker="" style="cursor: pointer;" class="input-group-addon" data-mddatetimepicker="true" data-targetselector="#form-item-' +
          itemObj.FormItemID +
          '"  data-trigger="' +
          click +
          '"  data-placement="top" data-englishnumber="true" ><span class="glyphicon glyphicon-calendar"></span></div><input ' +
          disableFormItem +
          ' type="text" class="form-control form-input" id="form-item-' +
          itemObj.FormItemID +
          '" placeholder="' +
          placeholder +
          '" data-mdpersiandatetimepickershowing="false" title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker="" data-mddatetimepicker="true" data-targetselector="#form-item-' +
          itemObj.FormItemID +
          `" data-trigger="${click}" data-placement="top" data-englishnumber="true" dir="ltr"></div>`;
      }

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      var pickerID = "#picker-" + itemObj.FormItemID;

      var itemInputID = "#form-item-" + itemObj.FormItemID;

      if (itemObj.Width != "") {
        $(itemInputID).css("width", itemObj.Width);
      }

      if (jQuery.parseJSON(itemObj.IsReadOnly)) {
        $(itemInputID).attr("readonly", "readonly");
      }

      $(itemInputID).css("text-align", "left");

      if (itemObj.InputType == "DateTimeBox") {
        $(pickerID).attr("data-enabletimepicker", "true");

        $(itemInputID).attr("data-enabletimepicker", "true");

        $(itemInputID).attr("data-inputmask", '"mask": "x/m/d h:s"');

        $(itemInputID).inputmask();
      } else {
        $(itemInputID).attr("data-inputmask", '"alias": "shamsi"');

        $(itemInputID).inputmask();
      }

      if (itemObj.Visibility == "Disabled") {
        $(itemInputID).attr("disabled", "disabled");
        $(itemInputID).val(getLocalDatetime());

        $(itemInputID).addClass("form-input-dis");

        $(itemInputID).removeClass("form-input");
      }

      if (itemObj.Label.indexOf("زمان تایید") != -1) {
        $(itemInputID).attr("disabled", "disabled");
        $(itemInputID).val(getLocalDatetime());

        $(itemInputID).addClass("form-input-dis");

        $(itemInputID).removeClass("form-input");
      } else {
        EnableMdDateTimePickers();

        $(itemInputID).val(getDefaultValue(itemObj));
      }
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var RenderFacilities = function (itemObj, parentID) {
    var value = getDefaultValue(itemObj);
    let _formID = itemObj.FormID;
    let _formItemId = itemObj.FormItemID;
    let _json;
    let _DefaultValue = itemObj.DefaultValue;
    $.ajax({
      type: "POST",

      url: "../../App_Sys/Services/CustomActivity.asmx/GetMyAmentityTimes",

      data:
        '{"formid":"' +
        _formID +
        '","formitemid":"' +
        _formItemId +
        // '","responseToken":"' +
        // genResponseToken() +
        '"}',

      contentType: "application/json; charset=utf-8",

      dataType: "json",

      async: false,

      error: function (jqXHR, textStatus, errorThrown) {
        alert(JSON.stringify(jqXHR));
      },
      success: function (data) {
        data = data.d;

        _json = jQuery.parseJSON(data);
        // _json = data;

        setRequestToken(_json.requestToken);
      },
    });
    let Columns = [
      "نوع رفاهیات",
      "تعداد استفاده شده ",
      "تعداد مجاز ماهانه ",
      "توضیحات",
    ];

    let itemContent = `<div class="form-group" id="form-group-${_formItemId}">
    <div style="position : relative;">
    <label class="form-item-lbl">${itemObj.Label}</label>
    <table id="form-item-${_formItemId}" class="table table-bordered table-hover" style="margin-bottom: 5px;text-align: center;
    border: 1px solid #ddd !important;border-radius: 5px !important;border-radius: 3px !important;border-collapse: separate;overflow: hidden;background-color: white;" >
    <thead>
    <tr>
    <th scope="col"  style="width:10px; ;font-size: 12px;margin-bottom: 5px;text-align:center;border-bottom: 1px solid #ddd !important"></th>
    <th scope="col"  style="width:41px; ;font-size: 12px;margin-bottom: 5px;text-align:center;border-bottom: 1px solid #ddd !important">Row</th>`;

    //Thead

    for (let i in Columns) {
      itemContent += `<th  scope="col" style="margin-bottom: 5px;text-align:center;font-size: 12px; ;border-bottom: 1px solid #ddd !important" id=${i}> ${Columns[i]}</th>`;
    }

    itemContent += `</tr>
             </thead>`;
    itemContent += `<div id="filter-options"></div>`;
    //Tbody
    itemContent += `<tbody id="tbody_${_formItemId}" >`;

    let Total = 0;
    let _Rows = _json;
    let _disabled = FormItemDisabled(parentID);
    let Types = [];
    $.ajax({
      type: "POST",

      url: "../../App_Sys/Services/CustomActivity.asmx/GetUserBuilding",

      data: "",

      contentType: "application/json; charset=utf-8",

      dataType: "json",

      async: false,

      error: function (jqXHR, textStatus, errorThrown) {
        alert(JSON.stringify(jqXHR));
      },
      success: function (data) {
        data = data.d;

        let _BuildingID = jQuery.parseJSON(data);

        if (_BuildingID.length) {
          if (_BuildingID[0].BuildingID == 3) {
            Types = ["فوتبال دستی", "هوا خوری"];
          } else {
            Types = ["فوتبال دستی"];
          }
        }
        setRequestToken(_json.requestToken);
      },
    });

    for (let i = 0; i < Types.length; i++) {
      if (_Rows.length) {
        let isValue = false;
        for (let j = 0; j < _Rows.length; j++) {
          if (_Rows[j].Type == Types[i]) {
            let childs = _Rows[j];
            if (value != null) {
              if (value == Types[i]) {
                itemContent += `<tr><td class="text-center" style="width:10px; vertical-align: middle !important;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid"><input ${_disabled} type="radio" class="tblradio" name="rowSelection" id="radio-${i}" value="radio-${i}" checked></td>`;
              } else {
                itemContent += `<tr><td class="text-center" style="width:10px; vertical-align: middle !important;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid"><input ${_disabled} type="radio" class="tblradio" name="rowSelection" id="radio-${i}" value="radio-${i}" ></td>`;
              }
            } else {
              itemContent += `<tr><td class="text-center" style="width:10px; vertical-align: middle !important;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid"><input ${_disabled} type="radio" class="tblradio" name="rowSelection" id="radio-${i}" value="radio-${i}" ></td>`;
            }
            itemContent += `<td class="text-center" style="vertical-align: middle !important;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">${
              i + 1
            }</td>`;
            itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">${childs.Type}</td>`;
            itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">${childs.Used}</td>`;
            itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">-</td>`;
            if (childs.Type == Types[0]) {
              itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">مدت زمان استفاده از فوتبال دستی بین ساعات 14 تا 17 و حداکثر 20 دقیقه می باشد</td></tr>`;
            } else if (childs.Type == Types[1]) {
              itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">مدت زمان استفاده از هوا خوری بین ساعات 12 تا 13:30 و حداکثر 20 دقیقه می باشد</td></tr>`;
            }
            itemContent += `</tr>`;
            Total = Total + +childs.Used;
            isValue = true;
          }
        }
        if (!isValue) {
          if (value == Types[i]) {
            itemContent += `<tr><td class="text-center" style="width:10px; vertical-align: middle !important;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid"><input type="radio" ${_disabled} class="tblradio" name="rowSelection" id="radio-${i}" value="radio-${i}" checked></td>`;
          } else {
            itemContent += `<tr><td class="text-center" style="width:10px; vertical-align: middle !important;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid"><input type="radio" ${_disabled} class="tblradio" name="rowSelection" id="radio-${i}" value="radio-${i}" ></td>`;
          }
          itemContent += `<td class="text-center" style="vertical-align: middle !important;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">${
            i + 1
          }</td>`;
          itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">${Types[i]}</td>`;
          itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">0</td>`;
          itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">-</td>`;
          if (i == 0) {
            itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">مدت زمان استفاده از فوتبال دستی بین ساعات 14 تا 17 و حداکثر 20 دقیقه می باشد</td></tr>`;
          } else if (i == 1) {
            itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">مدت زمان استفاده از هوا خوری بین ساعات 12 تا 13:30 و حداکثر 20 دقیقه می باشد</td></tr>`;
          }
        }
      } else {
        if (value == Types[i]) {
          itemContent += `<tr><td class="text-center" style="width:10px; vertical-align: middle !important;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid"><input type="radio" ${_disabled} class="tblradio" name="rowSelection" id="radio-${i}" value="radio-${i}" checked></td>`;
        } else {
          itemContent += `<tr><td class="text-center" style="width:10px; vertical-align: middle !important;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid"><input type="radio" ${_disabled} class="tblradio" name="rowSelection" id="radio-${i}" value="radio-${i}" ></td>`;
        }
        itemContent += `<td class="text-center" style="vertical-align: middle !important;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">${
          i + 1
        }</td>`;
        itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">${Types[i]}</td>`;
        itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">0</td>`;
        itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">-</td>`;
        if (i == 0) {
          itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">مدت زمان استفاده از فوتبال دستی بین ساعات 14 تا 17 و حداکثر 20 دقیقه می باشد</td></tr>`;
        } else if (i == 1) {
          itemContent += `<td class="text-center" style="vertical-align: middle !important;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">مدت زمان استفاده از هوا خوری بین ساعات 12 تا 13:30 و حداکثر 20 دقیقه می باشد</td></tr>`;
        }
      }
    }
    itemContent += `</tbody >`;

    //Footer

    itemContent += `<tfoot >
    <tr style="background-color: whitesmoke;border: 0px;">
    <td colspan="3"style="padding-right: 8%;border: 0px;">مجموع</td>
    <td style="border: 0px;">${Total}</td>
    <td style="border: 0px;">9</td>
    <td style="border: 0px;"></td>
    </tr>
    </tfoot>
    </table></div>`;

    itemContent += `</div>`;

    $(parentID).append(itemContent);

    $(`table tr th,tr td`).css("overflow-wrap", "anywhere");
    $(`table tr th,tr td`).css("text-align", "center");

    if (Total >= 9) {
      $(".tblradio").attr("checked", false);
      $(".tblradio").attr("disabled", true);
    }

    $(`.tblradio`).on("click", (e) => {
      var labelsArray = [];
      var ItemssArray = [];
      let defaultval = _DefaultValue.split(",");

      $(".form-item-lbl").each(function () {
        labelsArray.push($(this).text().trim());
        ItemssArray.push($(this));
      });

      //Show Hidden Table and TimingBox
      if (e.target.id == "radio-0") {
        for (let i = 0; i < labelsArray.length; i++) {
          for (let j = 0; j < defaultval.length; j++) {
            if (labelsArray[i] == defaultval[j].trim()) {
              $(ItemssArray[i]).parent().parent().show();
            }
          }
        }
      } else {
        for (let i = 0; i < labelsArray.length; i++) {
          for (let j = 0; j < defaultval.length; j++) {
            if (labelsArray[i] == defaultval[j].trim()) {
              $(`.radioTime`).attr("checked", false);
              let tblid = $(ItemssArray[i])
                .parent()
                .parent()
                .attr("id")
                .replaceAll("group", "item");

              $(`#` + tblid)
                .find("tbody tr")
                .remove();

              let index = $TableData.findIndex((x) => x.ID == tblid);

              if (index > -1) $TableData.splice(index, 1);

              $(ItemssArray[i]).parent().parent().hide();
            }
          }
        }
      }
    });
  };

  var RenderTimeingbox = function (itemObj, parentID) {
    let disableFormItem = FormItemDisabled(parentID);
    if (itemObj.Visibility == "DefaultHidden") itemObj.Visibility = "false";
    var value = getDefaultValue(itemObj);
    let _formID = itemObj.FormID;
    let _formItemId = itemObj.FormItemID;
    let _json;
    $.ajax({
      type: "POST",
      url: "../../App_Sys/Services/CustomActivity.asmx/GetReservedAmentityTimes",
      data: "",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async: false,
      error: function (jqXHR, textStatus, errorThrown) {
        alert(JSON.stringify(jqXHR));
      },
      success: function (data) {
        data = data.d;
        _json = JSON.parse(data);

        setRequestToken(_json.requestToken);
      },
    });

    let itemContent = `<div class="form-group" id="form-group-${_formItemId}"><div style="position : relative;">
    <label class="form-item-lbl">${itemObj.Label}</label>
    <div style="border: 1px solid #ccc ; padding: 20px ; display: grid ; border-radius: 10px ; grid-template-columns: repeat(3, 1fr) ; gap: 10px ; background-color: white;">`;
    let Times = [
      { StartTime: 840, Label: "2 تا 2:20" },
      { StartTime: 860, Label: "2:20 تا 2:40" },
      { StartTime: 880, Label: "2:40 تا 3" },
      { StartTime: 900, Label: "3 تا 3:20" },
      { StartTime: 920, Label: "3:20 تا 3:40" },
      { StartTime: 940, Label: "3:40 تا 4" },
      { StartTime: 960, Label: "4 تا 4:20" },
      { StartTime: 980, Label: "4:20 تا 4:40" },
      { StartTime: 1000, Label: "4:40 تا 5" },
    ];
    for (let i = 0; i < Times.length; i++) {
      if (value != null) {
        if (value == Times[i].Label) {
          itemContent += `
            <div id="Times${Times[i].StartTime}" style="margin-bottom: 2% ; cursor : default;display: flex; align-items: self-start;">
              <input type="radio" ${disableFormItem}  name="Time" class = "radioTime" style = "cursor : pointer ; margin-left:5px" id="radio-Times-${i}" value="${Times[i].Label}" label = "${Times[i].StartTime}" checked>
              <lable for="radio-Times-${i}" class = "radioTimeLable" id="radio-Times-Label${i}">${Times[i].Label}</lable>
            </div>`;
        } else {
          itemContent += `
            <div id="Times${Times[i].StartTime}" style="margin-bottom: 2% ; cursor : default;display: flex; align-items: self-start;">
              <input type="radio" name="Time" ${disableFormItem}  class = "radioTime" style = "cursor : pointer ; margin-left:5px" id="radio-Times-${i}" value="${Times[i].Label}" label = "${Times[i].StartTime}">
              <lable for="radio-Times-${i}" class = "radioTimeLable" id="radio-Times-Label${i}">${Times[i].Label}</lable>
            </div>`;
        }
      } else {
        itemContent += `
          <div id="Times${Times[i].StartTime}" style="margin-bottom: 2% ; cursor : default ;display: flex; align-items: self-start;">
            <input type="radio" name="Time" ${disableFormItem} class = "radioTime" style = "cursor : pointer ; margin-left:5px" id="radio-Times-${i}" value="${Times[i].Label}" label = "${Times[i].StartTime}">
            <lable for="radio-Times-${i}" class = "radioTimeLable" id="radio-Times-Label${i}">${Times[i].Label}</lable>
          </div>`;
      }
    }

    itemContent += `</div></div></div>`;

    $(parentID).append(itemContent);

    if (itemObj.Visibility == "false") {
      $(`#form-group-${_formItemId}`).hide();
    }

    //facilites show
    if ($(`#radio-0`).is(":checked")) {
      $(`#form-group-${_formItemId}`).show();
    }

    let radioTime = [];
    $(".radioTime").each(function () {
      radioTime.push($(this).attr("label"));
    });

    //Disable times before now
    function getCurrentTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      return totalMinutes;
    }

    for (let j = 0; j < radioTime.length; j++) {
      if (radioTime[j] < getCurrentTime()) {
        $('input.radioTime[label="' + radioTime[j] + '"]')
          .prop("disabled", true)
          .css("cursor", "default");

        $("#radio-Times-Label" + j).css({
          opacity: "0.5",
          "pointer-events": "none",
        });
      }
    }

    for (let i = 0; i < _json.length; i++) {
      let _startTime = _json[i].StartTime;
      for (let j = 0; j < radioTime.length; j++) {
        if (radioTime[j] == _startTime) {
          $('input.radioTime[label="' + radioTime[j] + '"]')
            .prop("disabled", true)
            .css("cursor", "default");

          $("#radio-Times-Label" + j).css({
            opacity: "0.5",
            "pointer-events": "none",
          });
        }
      }
    }
  };

  var renderDateRangeBox = function (itemObj, parentID) {
    try {
      var placeholder = "";

      let disableFormItem = FormItemDisabled(parentID);

      let click = disableFormItem == "disabled" ? "" : "click";

      if (
        !jQuery.parseJSON(itemObj.IsRequired) &&
        $(parentID).prev().text() != "خلاصه درخواست"
      ) {
        placeholder = localize("اختیاری");
      }

      var itemContent =
        '<div style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" class="form-group" id="form-group-' +
        itemObj.FormItemID +
        '"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        "</label>";

      itemContent +=
        '<div class="input-group"><div id="picker-' +
        itemObj.FormItemID +
        '" data-mdpersiandatetimepickershowing="false" title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker="" style="cursor: pointer;" class="input-group-addon" data-mddatetimepicker="true" data-targetselector="#form-item-from-' +
        itemObj.FormItemID +
        '" data-trigger="' +
        click +
        '"  data-placement="top" data-englishnumber="true"  ><span class="glyphicon glyphicon-calendar"></span></div><input type="text" class="form-control form-input" id="form-item-from-' +
        itemObj.FormItemID +
        '" placeholder="از" dir="ltr" data-mdpersiandatetimepickershowing="false" title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker="" data-mddatetimepicker="true" data-targetselector="#form-item-from-' +
        itemObj.FormItemID +
        `" data-trigger="${click}"  data-placement="top"  data-englishnumber="true">`;

      itemContent +=
        '<div id="picker-' +
        itemObj.FormItemID +
        '" data-mdpersiandatetimepickershowing="false" title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker="" style="cursor: pointer;" class="input-group-addon" data-mddatetimepicker="true" data-targetselector="#form-item-to-' +
        itemObj.FormItemID +
        '" data-trigger="' +
        click +
        '"  data-placement="top" data-englishnumber="true" ><span class="glyphicon glyphicon-calendar"></span></div><input type="text" class="form-control form-input" id="form-item-to-' +
        itemObj.FormItemID +
        '" placeholder="تا" dir="ltr"  data-mdpersiandatetimepickershowing="false" title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker="" data-mddatetimepicker="true" data-targetselector="#form-item-to-' +
        itemObj.FormItemID +
        `" data-trigger="${click}"  data-placement="top" data-englishnumber="true"></div>`;

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      var itemInputID = "#form-item-from-" + itemObj.FormItemID;

      var itemInputID2 = "#form-item-to-" + itemObj.FormItemID;

      if (jQuery.parseJSON(itemObj.IsReadOnly)) {
        $(itemInputID).attr("readonly", "readonly");
      }

      $(itemInputID).css("text-align", "left");

      $(itemInputID).attr("data-inputmask", '"alias": "shamsi"');

      $(itemInputID).inputmask();

      $(itemInputID2).css("text-align", "left");

      $(itemInputID2).attr("data-inputmask", '"alias": "shamsi"');

      $(itemInputID2).inputmask();

      EnableMdDateTimePickers();
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  //Not implemented
  var renderTreeSelectList = function (itemObj, parentID) {
    let disableFormItem = FormItemDisabled(parentID);
    try {
      var itemContent =
        '<div style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" class="form-group" id="form-group-' +
        itemObj.FormItemID +
        '"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        '</label><div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-share"></span></div><select ' +
        disableFormItem +
        ' class="form-control form-input" id="form-item-' +
        itemObj.FormItemID +
        '"> </select></div>';

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }
      var itemInputID = "#form-item-" + itemObj.FormItemID;

      itemContent += "</div>";
      if (jQuery.parseJSON(itemObj.IsReadOnly)) {
        $(itemInputID).attr("readonly", "readonly");
      }
      $(parentID).append(itemContent);
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderSecureBox = function (itemObj, parentID) {
    try {
      var placeholder = "";

      if (
        !jQuery.parseJSON(itemObj.IsRequired) &&
        $(parentID).prev().text() != "خلاصه درخواست"
      ) {
        placeholder = localize("اختیاری");
      }

      var itemContent =
        '<div style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" class="form-group" id="form-group-' +
        itemObj.FormItemID +
        '"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        '</label><div class="input-group"><div class="input-group-addon"><i class="fa-solid fa fa-key"></i></div><input type="password" class="form-control form-input" id="form-item-' +
        itemObj.FormItemID +
        '" placeholder="' +
        placeholder +
        '"></div>';

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      var itemInputID = "#form-item-" + itemObj.FormItemID;

      if (itemObj.Width != "") {
        $(itemInputID).css("width", itemObj.Width);
      }

      $(itemInputID).attr("dir", "ltr");

      $(itemInputID).css("text-align", "left");

      $(itemInputID).val("xxxxxxxxxxxxxxxxxxxxxxxxxx");
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderPasswordBox = function (itemObj, parentID) {
    let disableFormItem = FormItemDisabled(parentID);
    try {
      var placeholder = "";

      if (
        !jQuery.parseJSON(itemObj.IsRequired) &&
        $(parentID).prev().text() != "خلاصه درخواست"
      ) {
        placeholder = localize("اختیاری");
      }

      var itemContent =
        '<div style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" class="form-group" id="form-group-' +
        itemObj.FormItemID +
        '"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        '</label><div class="input-group"><div class="input-group-addon"><i class="fa-solid fa fa-key"></i></span></div><input ' +
        disableFormItem +
        ' type="password" class="form-control form-input" id="form-item-' +
        itemObj.FormItemID +
        '" placeholder="' +
        placeholder +
        '"></div></div>';

      itemContent +=
        '<div class="form-group"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        localize($$Lang=="Fa"?"تکرار":"Repeat ") +
        itemObj.Label +
        '</label><div class="input-group"><div class="input-group-addon"><i class="fa-solid fa fa-key"></i></span></div><input ' +
        disableFormItem +
        ' type="password" class="form-control form-input" id="form-item-' +
        itemObj.FormItemID +
        '-rep" placeholder="' +
        placeholder +
        '"></div>';

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      var itemInputID = "#form-item-" + itemObj.FormItemID;

      if (itemObj.Width != "") {
        $(itemInputID).css("width", itemObj.Width);

        $(itemInputID + "-rep").css("width", itemObj.Width);
      }

      $(itemInputID).attr("dir", "ltr");

      $(itemInputID).css("text-align", "left");

      $(itemInputID).val("");

      $(itemInputID + "-rep").attr("dir", "ltr");

      $(itemInputID + "-rep").css("text-align", "left");

      $(itemInputID + "-rep").val("");
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderTextView = function (itemObj, parentID) {
    let disableFormItem = FormItemDisabled(parentID);
    try {
      var value = getDefaultValue(itemObj);

      if (itemObj.Visibility == "VisibleIfValue") {
        if (value == null || value == "") {
          return;
        }
      }

      if (itemObj.AttributeTypeName == "Boolean") {
        if (value == "True") {
          value =
            "<input " +
            disableFormItem +
            '  class="view-checkbox" type="checkbox" checked disabled/>';
        } else {
          value = '<input class="view-checkbox" type="checkbox" disabled/>';
        }
      }

      var itemContent =
        '<div style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" class="form-group" id="form-group-' +
        itemObj.FormItemID +
        '">' +
        (itemObj.AttributeTypeName == "Boolean" ? value : "") +
        '&nbsp;<label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        "&nbsp;" +
        (itemObj.AttributeTypeName == "Boolean" ? "" : ":") +
        '&nbsp;</label><span class="form-text-view" id="form-item-' +
        itemObj.FormItemID +
        '"></span>';

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      if (itemObj.Width != "") {
        $("#form-item-" + itemObj.FormItemID).css("width", itemObj.Width);
      }

      $("#form-item-" + itemObj.FormItemID).attr("dir", "ltr");
      if (_objKeys.length > 1) {
        $("#form-item-" + itemObj.FormItemID).html(
          _objKeys.length + localize("مورد ")
        );
      }

      if (itemObj.AttributeTypeName != "Boolean") {
        if (_objKeys.length == 1) {
          $("#form-item-" + itemObj.FormItemID).html(value);
        }
      }
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderTaskProceedingsArea = function (parentID) {
    let disableFormItem = FormItemDisabled(parentID);
    if (!_prcStateOptions.StateHasTask) {
      return;
    }

    if (_prcStateOptions.TaskHasServics > 0) {
      $(parentID).append(
        '<div class="form-group">' +
          '<label>خدمات انجام شده</label><div class="input-group">' +
          '<div class="input-group-addon"><span class="glyphicon glyphicon-check"></span></div>' +
          "<select " +
          disableFormItem +
          ' class="form-control form-input" id="task-services"></select></div>' +
          "</div>"
      );
    }

    if (_prcStateOptions.TaskHasReport > 0) {
      $(parentID).append(
        '<div class="form-group">' +
          '<label>توضیحات</label><div class="input-group">' +
          '<div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>' +
          "<textarea " +
          disableFormItem +
          '  class="form-control form-input" id="task-report" rows="5"></textarea></div>' +
          "</div>"
      );
    }

    if (_prcStateOptions.TaskHasSpentTime > 0) {
      $(parentID).append(
        '<div class="form-group"><label>زمان صرف شده</label>' +
          '<div class="row">' +
          '<div class="col-md-2" class="form-time-label">' +
          "<select " +
          disableFormItem +
          ' class="form-control form-input" id="task-spent-day"></select></div>' +
          '<div class="col-md-1" class="form-time-box">&nbsp;&nbsp; روز </div>' +
          '<div class="col-md-2" class="form-time-label">' +
          "<select " +
          disableFormItem +
          '  class="form-control form-input" id="task-spent-hour"></select></div>' +
          '<div class="col-md-2" class="form-time-box">&nbsp;&nbsp; ساعت </div>' +
          '<div class="col-md-2" class="form-time-label">' +
          "<select " +
          disableFormItem +
          ' class="form-control form-input" id="task-spent-minute"></select></div>' +
          '<div class="col-md-1"  class="form-time-box">&nbsp;&nbsp; دقیقه </div>' +
          "</div></div>"
      );

      for (i = 0; i < 8; i++) {
        $("#task-spent-day").append(
          $("<option></option>").attr("value", i).text(i)
        );

        $("#task-spent-hour").append(
          $("<option></option>").attr("value", i).text(i)
        );
      }

      for (i = 0; i < 12; i++) {
        $("#task-spent-minute").append(
          $("<option></option>")
            .attr("value", i * 5)
            .text(i * 5)
        );
      }
    }

    $(parentID).append(
      '<div class="form-group"><label>سایر فرم ها</label><div class="row" id="row-links"></div></div>'
    );

    $.each(_prcStateActLinks, function (index, actLink) {
      $("#row-links").append(
        '<div class="col-md-3"><a class="form-link" data-context-id=' +
          actLink.ActivityContextID +
          ' id="act-link-' +
          actLink.ActivityContextID +
          '"><span class="fa ' +
          actLink.Icon +
          '"></span>&nbsp;' +
          actLink.Label +
          "</a></div>"
      );

      $("#act-link-" + actLink.ActivityContextID).click(function () {});
    });
  };

  var renderProcessStatingArea = function (parentID) {
    let disableFormItem = FormItemDisabled(parentID);
    if (_prcStateOptions.IsStartState && _prcTranscations.getLength() == 1) {
      return;
    }

    $(parentID).append(
      '<div class="form-group"><label>وضعیت جدید</label><div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-check"></span></div><select ' +
        disableFormItem +
        '  id="process-final-actions" class="form-control form-input"></select></div></div>'
    );

    var content = '<div class="form-group">';

    content +=
      '<div class="row" id="refer-area-1"><div class="col-md-1" class="form-taskrefer-setp">&nbsp;گام 1&nbsp;<span class="fa fa-caret-left"></span></div>' +
      '<div class="col-md-1" id="taskrefer-label-group-1" class="form-taskrefer-label">تیم&nbsp;&nbsp;</div>' +
      '<div class="col-md-4" id="taskrefer-box-group-1" class="form-taskrefer-box">' +
      "<select " +
      disableFormItem +
      ' class="form-control form-input" id="refer-group-1"></select></div>' +
      '<div class="col-md-2" id="taskrefer-label-user-1" class="form-taskrefer-label">&nbsp;&nbsp;کارشناس&nbsp;&nbsp;</div>' +
      '<div class="col-md-4" id="taskrefer-box-user-1" class="form-taskrefer-box">' +
      "<select " +
      disableFormItem +
      ' class="form-control form-input" id="refer-user-1"></select></div>' +
      "<br /> " +
      "</div>";

    content +=
      '<div class="row" id="refer-area-2"><div class="col-md-2" class="form-taskrefer-setp">&nbsp;گام 2&nbsp;<span class="fa fa-caret-left"></span></div>' +
      '<div class="col-md-2" id="taskrefer-label-group-2" class="form-taskrefer-label">تیم&nbsp;&nbsp;</div>' +
      '<div class="col-md-4" id="taskrefer-box-group-2" class="form-taskrefer-box">' +
      "<select  " +
      disableFormItem +
      ' class="form-control form-input" id="refer-group-2"></select></div>' +
      '<div class="col-md-2" id="taskrefer-label-user-2" class="form-taskrefer-label">&nbsp;&nbsp;کارشناس&nbsp;&nbsp;</div>' +
      '<div class="col-md-4" id="taskrefer-box-user-2" class="form-taskrefer-box">' +
      "<select " +
      disableFormItem +
      ' class="form-control form-input" id="refer-user-2"></select></div>' +
      "<br /> " +
      "</div>";

    content +=
      '<div class="row" id="refer-area-3"><div class="col-md-3" class="form-taskrefer-setp">&nbsp;گام 3&nbsp;<span class="fa fa-caret-left"></span></div>' +
      '<div class="col-md-2" id="taskrefer-label-group-3" class="form-taskrefer-label">تیم&nbsp;&nbsp;</div>' +
      '<div class="col-md-4" id="taskrefer-box-group-3" class="form-taskrefer-box">' +
      "<select " +
      disableFormItem +
      ' class="form-control form-input" id="refer-group-3"></select></div>' +
      '<div class="col-md-2" id="taskrefer-label-user-3" class="form-taskrefer-label">&nbsp;&nbsp;کارشناس&nbsp;&nbsp;</div>' +
      '<div class="col-md-4" id="taskrefer-box-user-3" class="form-taskrefer-box">' +
      "<select " +
      disableFormItem +
      ' class="form-control form-input" id="refer-user-3"></select></div>' +
      "<br /> " +
      "</div>";

    content +=
      '<div class="row" id="refer-area-4"><div class="col-md-4" class="form-taskrefer-setp">&nbsp;گام 4&nbsp;<span class="fa fa-caret-left"></span></div>' +
      '<div class="col-md-2" id="taskrefer-label-group-4" class="form-taskrefer-label">تیم&nbsp;&nbsp;</div>' +
      '<div class="col-md-4" id="taskrefer-box-group-4" class="form-taskrefer-box">' +
      "<select " +
      disableFormItem +
      '  class="form-control form-input" id="refer-group-4"></select></div>' +
      '<div class="col-md-2" id="taskrefer-label-user-4" class="form-taskrefer-label">&nbsp;&nbsp;کارشناس&nbsp;&nbsp;</div>' +
      '<div class="col-md-4" id="taskrefer-box-user-4" class="form-taskrefer-box">' +
      "<select " +
      disableFormItem +
      '  class="form-control form-input" id="refer-user-4"></select></div>' +
      "<br /> " +
      "</div>";

    content +=
      '<div class="row" id="refer-area-5"><div class="col-md-5" class="form-taskrefer-setp">&nbsp;ارجاع گیرنده&nbsp;<span class="fa fa-caret-left"></span></div>' +
      '<div class="col-md-2" id="taskrefer-label-user-5" class="form-taskrefer-label">&nbsp;&nbsp;کاربر&nbsp;&nbsp;</div>' +
      '<div class="col-md-5" id="taskrefer-box-user-5" class="form-taskrefer-box">' +
      "<select " +
      disableFormItem +
      ' class="form-control form-input" id="refer-user-5"></select></div>' +
      "<br /> " +
      "</div>";

    content += "</div>";

    $(parentID).append(content);

    $(parentID).append(
      '<div class="form-group" id="sla-type-area"><label>تعیین SLA</label><div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-check"></span></div><select id="process-slas" class="form-control form-input"></select></div></div>'
    );

    content = '<div class="form-group">';

    content +=
      '<div class="row" id="sla-area-1"><div class="col-md-2" class="form-sla-setp">&nbsp;مهلت مراجعه&nbsp;<span class="fa fa-caret-left"></span></div>' +
      '<div class="col-md-2" class="form-time-label">' +
      "<select " +
      disableFormItem +
      ' class="form-control form-input" id="sla-start-day"></select></div>' +
      '<div class="col-md-1" class="form-time-box">&nbsp;&nbsp; روز </div>' +
      '<div class="col-md-2" class="form-time-label">' +
      '<select class="form-control form-input" id="sla-start-hour"></select></div>' +
      '<div class="col-md-2" class="form-time-box">&nbsp;&nbsp; ساعت </div>' +
      '<div class="col-md-2" class="form-time-label">' +
      "<select " +
      disableFormItem +
      ' class="form-control form-input" id="sla-start-minute"></select></div>' +
      '<div class="col-md-1"  class="form-time-box">&nbsp;&nbsp; دقیقه </div>' +
      "</div><br />";

    content +=
      '<div class="row" id="sla-area-2"><div class="col-md-2" class="form-sla-setp">&nbsp;مهلت انجام&nbsp;<span class="fa fa-caret-left"></span></div>' +
      '<div class="col-md-2" class="form-time-label">' +
      "<select " +
      disableFormItem +
      ' class="form-control form-input" id="sla-resolve-day"></select></div>' +
      '<div class="col-md-1" class="form-time-box">&nbsp;&nbsp; روز </div>' +
      '<div class="col-md-2" class="form-time-label">' +
      "<select " +
      disableFormItem +
      ' class="form-control form-input" id="sla-resolve-hour"></select></div>' +
      '<div class="col-md-2" class="form-time-box">&nbsp;&nbsp; ساعت </div>' +
      '<div class="col-md-2" class="form-time-label">' +
      "<select " +
      disableFormItem +
      ' class="form-control form-input" id="sla-resolve-minute"></select></div>' +
      '<div class="col-md-1"  class="form-time-box">&nbsp;&nbsp; دقیقه </div>' +
      "</div>";

    content += "</div>";

    $(parentID).append(content);

    for (i = 0; i < 8; i++) {
      $("#sla-start-day").append(
        $("<option></option>").attr("value", i).text(i)
      );

      $("#sla-start-hour").append(
        $("<option></option>").attr("value", i).text(i)
      );

      $("#sla-resolve-day").append(
        $("<option></option>").attr("value", i).text(i)
      );

      $("#sla-resolve-hour").append(
        $("<option></option>").attr("value", i).text(i)
      );
    }

    for (i = 0; i < 12; i++) {
      $("#sla-start-minute").append(
        $("<option></option>")
          .attr("value", i * 5)
          .text(i * 5)
      );

      $("#sla-resolve-minute").append(
        $("<option></option>")
          .attr("value", i * 5)
          .text(i * 5)
      );
    }

    if (!_prcStateOptions.IsStartState) {
      $.each(_prcTaskStatuses, function (index, taskStatus) {
        $("#process-final-actions").append(
          $("<option></option>")
            .attr("value", taskStatus.TaskStatusID)
            .text(taskStatus.Label)
        );
      });
    }

    $.each(_prcTranscations.getList(), function (index, transacation) {
      $("#process-final-actions").append(
        $("<option></option>")
          .attr("value", transacation.StateTransactionID)
          .text(transacation.Label)
      );
    });

    $("#process-final-actions").change(function () {
      if (this.value < 100) {
        return; //action is a internal task status
      }

      var transacation = _prcTranscations.getListByFilter(
        "StateTransactionID",
        this.value
      )[0];

      var taskAssignmentType = transacation.TaskAssignmentType.split("-");

      var startSLAStatus = transacation.StartSLAStatus.split("-");

      var resolveSLAStatus = transacation.ResolveSLAStatus.split("-");

      if (taskAssignmentType[0] == "UserBased") {
        if (
          taskAssignmentType[1] == "Individual" ||
          taskAssignmentType[1] == "Collective"
        ) {
          if (
            taskAssignmentType[2] == "ToGroupedUser" ||
            taskAssignmentType[2] == "ToSelfgroupUser" ||
            taskAssignmentType[2] == "ToGroup"
          ) {
            $("#refer-area-1").show();

            $("#refer-area-2").hide();

            $("#refer-area-3").hide();

            $("#refer-area-4").hide();

            $("#refer-area-5").hide();
          }

          if (taskAssignmentType[2] == "User") {
            $("#refer-area-1").hide();

            $("#refer-area-2").hide();

            $("#refer-area-3").hide();

            $("#refer-area-4").hide();

            $("#refer-area-5").show();

            var $selectList = new selectList(4, null);

            $selectList.renderContext(
              "#refer-user-5",
              false,
              _formOptions.ActivityID,
              true,
              ""
            );
          }
        }

        if (taskAssignmentType[1] == "Collective") {
          if (taskAssignmentType[2] == "ToGroup") {
            $("#taskrefer-label-group-1").show();

            $("#taskrefer-box-group-1").show();

            $("#taskrefer-label-user-1").hide();

            $("#taskrefer-box-user-1").hide();

            if ($("#refer-group-1").children("option").length == 0) {
              var $selectList = new selectList(1, null);

              $selectList.renderContext(
                "#refer-group-1",
                false,
                _formOptions.ActivityID,
                true,
                "",
                "ToGroupedUser"
              );
            }
          }
        }

        if (taskAssignmentType[1] == "Individual") {
          if (
            taskAssignmentType[2] == "ToGroupedUser" ||
            taskAssignmentType[2] == "ToSelfgroupUser"
          ) {
            $("#taskrefer-label-group-1").show();

            $("#taskrefer-box-group-1").show();

            $("#taskrefer-label-user-1").show();

            $("#taskrefer-box-user-1").show();
          }

          if (taskAssignmentType[2] == "ToGroupedUser") {
            var $selectList = new selectList(1, null);

            $selectList.renderContext(
              "#refer-group-1",
              false,
              _formOptions.ActivityID,
              true,
              "",
              "ToGroupedUser"
            );
          }

          if (taskAssignmentType[2] == "ToSelfgroupUser") {
            var $selectList = new selectList(1, null);

            $selectList.renderContext(
              "#refer-group-1",
              false,
              _formOptions.ActivityID,
              true,
              "",
              "ToSelfgroupUser"
            );
          }
        }

        if (
          taskAssignmentType[1] == "Sequence" ||
          taskAssignmentType[1] == "Paralell"
        ) {
          if (
            taskAssignmentType[2] == "ToGroupedUser" ||
            taskAssignmentType[2] == "ToSelfgroupUser"
          ) {
            $("#refer-area-1").show();

            $("#refer-area-2").show();

            $("#refer-area-3").show();

            $("#refer-area-4").show();

            $("#refer-area-5").hide();
          }

          if (taskAssignmentType[2] == "ToGroupedUser") {
            var $selectList = new selectList(1, null);

            $selectList.renderContext(
              "#refer-group-1",
              false,
              _formOptions.ActivityID,
              true,
              "",
              "ToGroupedUser"
            );

            $selectList.renderContext(
              "#refer-group-2",
              false,
              _formOptions.ActivityID,
              true,
              "",
              "ToGroupedUser"
            );

            $selectList.renderContext(
              "#refer-group-3",
              false,
              _formOptions.ActivityID,
              true,
              "",
              "ToGroupedUser"
            );

            $selectList.renderContext(
              "#refer-group-4",
              false,
              _formOptions.ActivityID,
              true,
              "",
              "ToGroupedUser"
            );
          }

          if (taskAssignmentType[2] == "ToSelfgroupUser") {
            var $selectList = new selectList(1, null);

            $selectList.renderContext(
              "#refer-group-1",
              false,
              _formOptions.ActivityID,
              true,
              "",
              "ToSelfgroupUser"
            );

            $selectList.renderContext(
              "#refer-group-2",
              false,
              _formOptions.ActivityID,
              true,
              "",
              "ToSelfgroupUser"
            );

            $selectList.renderContext(
              "#refer-group-3",
              false,
              _formOptions.ActivityID,
              true,
              "",
              "ToSelfgroupUser"
            );

            $selectList.renderContext(
              "#refer-group-4",
              false,
              _formOptions.ActivityID,
              true,
              "",
              "ToSelfgroupUser"
            );
          }
        }
      }

      if (
        startSLAStatus[0] == "UserBased" ||
        resolveSLAStatus[0] == "UserBased"
      ) {
        $("#sla-type-area").show();

        var $selectList = new selectList(3, null);

        $selectList.renderContext(
          "#process-slas",
          false,
          _formOptions.ActivityID,
          true,
          "1"
        ); //Open >> without SLA
      } else {
        $("#sla-type-area").hide();
      }
    });

    $("#process-slas").change(function () {
      var slaExpression = $("#process-slas :selected").text();

      if (slaExpression.indexOf("مراجعه") == -1) {
        $("#sla-area-1").show();
      } else {
        $("#sla-area-1").hide();
      }

      if (slaExpression.indexOf("انجام") == -1) {
        $("#sla-area-2").show();
      } else {
        $("#sla-area-2").hide();
      }

      if (slaExpression.indexOf("بدون") > -1) {
        $("#sla-area-1").hide();

        $("#sla-area-2").hide();
      }
    });

    $("#refer-group-1").change(function () {
      var $selectList = new selectList(2, null);

      $selectList.renderContext(
        "#refer-user-1",
        false,
        _formOptions.ActivityID,
        true,
        "",
        $("#refer-group-1").val()
      );
    });

    $("#refer-group-2").change(function () {
      var $selectList = new selectList(2, null);

      $selectList.renderContext(
        "#refer-user-2",
        false,
        _formOptions.ActivityID,
        true,
        "",
        $("#refer-group-2").val()
      );
    });

    $("#refer-group-3").change(function () {
      var $selectList = new selectList(2, null);

      $selectList.renderContext(
        "#refer-user-3",
        false,
        _formOptions.ActivityID,
        true,
        "",
        $("#refer-group-3").val()
      );
    });

    $("#refer-group-4").change(function () {
      var $selectList = new selectList(2, null);

      $selectList.renderContext(
        "#refer-user-4",
        false,
        _formOptions.ActivityID,
        true,
        "",
        $("#refer-group-4").val()
      );
    });
  };

  var renderTextArea = function (itemObj, parentID, activityID) {
    var textAreaStyle = "";

    let isPrcItem = false;
    if (itemObj.ParamName != undefined && itemObj.ParamName.includes("Val"))
      isPrcItem = true;

    if ($("#boxBodyModal1 " + parentID).hasClass("col-md-4")) {
      textAreaStyle = "width:230%;";
    } else if ($(parentID).hasClass("col-md-4")) {
      textAreaStyle = "width:245%;";
    }

    let disableFormItem = FormItemDisabled(parentID);
    try {
      var placeholder = "";

      if (
        !jQuery.parseJSON(itemObj.IsRequired) &&
        _reportID == null &&
        $(parentID).prev().text() != "خلاصه درخواست"
      ) {
        placeholder = localize("اختیاری");
      }

      var itemContent =
        '<div class="form-group"  style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none"
          : "") +
        '" id="form-group-' +
        itemObj.FormItemID +
        '"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        `</label><div class="input-group"><div class="input-group-addon"><i class="glyphicon glyphicon-edit"></i></div><textarea style="${
          isPrcItem ? "height: 60px;" : ""
        }` +
        textAreaStyle +
        '" ' +
        disableFormItem +
        ' class="form-control form-input" id="form-item-' +
        itemObj.FormItemID +
        '" placeholder="' +
        placeholder +
        '" rows="7"></textarea></div>';

      if (
        itemObj.SubTextVisible ||
        (itemObj.Description != "" && itemObj.Description != null)
      ) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      var itemInputID = "#form-item-" + itemObj.FormItemID;

      if (itemObj.Width != "") {
        $(itemInputID).css("width", itemObj.Width);
      }
      if (jQuery.parseJSON(itemObj.IsReadOnly)) {
        $(itemInputID).attr("readonly", "readonly");
      }

      if (itemObj.Direction == "rtl" && $$Dir == "RTL") {
        $(itemInputID).attr("dir", "rtl");

        $(itemInputID).css("text-align", "right");
      } else {
        $(itemInputID).attr("dir", "ltr");

        $(itemInputID).css("text-align", "left");
      }

      $("#form-item-" + itemObj.FormItemID).val(
        getDefaultValue(itemObj).replace(/<br\/>/g, "\n")
      );

      if (
        itemObj.Name.indexOf("DoD") > -1 ||
        itemObj.AttributeTypeName == "CommandText"
      ) {
        $("#form-item-" + itemObj.FormItemID).Editor();

        $("#form-item-" + itemObj.FormItemID).Editor(
          "setText",
          getDefaultValue(itemObj)
        );
      }

      if (activityID == 6040007) {
        if (
          $(`#form-group-` + activityID + "0")
            .parent()
            .attr("id") == "boxBodyModal1"
        ) {
          $("#form-item-604000734 option:selected").text() == "بدون حقوق"
            ? $("#form-item-604000719").attr("placeholder", "")
            : $("#form-item-604000719").attr("placeholder", "اختیاری");
        }
      }
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var renderSignatureBox = function (itemObj, parentID) {
    try {
      var placeholder = "";

      if (
        !jQuery.parseJSON(itemObj.IsRequired) &&
        $(parentID).prev().text() != "خلاصه درخواست"
      ) {
        placeholder = localize("اختیاری");
      }

      var itemContent =
        '<div class="form-group"  style="' +
        (itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
          ? "display:none !important"
          : "") +
        '" id="form-group-' +
        itemObj.FormItemID +
        '"><label for="form-item-' +
        itemObj.FormItemID +
        '">' +
        itemObj.Label +
        '</label><div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></div><div class="form-control form-input" id="form-item-' +
        itemObj.FormItemID +
        '" style="height:300px;text-align:center;cursor: url(App_Res/Images/Page/16/Edit.png), auto;">' +
        placeholder +
        '</div><div class="input-group-addon" onclick=""><span class="glyphicon glyphicon-erase" style="cursor:pointer" title="از نو" onclick="$(\'#form-item-' +
        itemObj.FormItemID +
        "').html('');$('#form-item-" +
        itemObj.FormItemID +
        "').jSignature()\"></span></div></div>";

      if (itemObj.SubTextVisible) {
        itemContent +=
          '<small class="text-muted item-description">' +
          itemObj.Description +
          "</small>";
      }

      itemContent += "</div>";

      $(parentID).append(itemContent);

      if (itemObj.Width != "") {
        $("#form-item-" + itemObj.FormItemID).css("width", itemObj.Width);
      }

      var value = getDefaultValue(itemObj);

      if (value == "" || value == null) {
        $("#form-item-" + itemObj.FormItemID).jSignature();
      } else {
        $("#form-item-" + itemObj.FormItemID).html(getDefaultValue(itemObj));
      }
    } catch (e) {
      raiseError(e, "#form-group-" + itemObj.FormItemID);

      return;
    }
  };

  var $TableData = [];
  var renderTableBox = function (itemObj, parentID, activityID) {
    let tableStyle = "";
    if ($("#boxBodyModal1 " + parentID).hasClass("col-md-4")) {
      tableStyle = "width: 236%;";
    } else if ($(parentID).hasClass("col-md-4")) {
      tableStyle = "width: 236%;";
    }

    var parentId = parentID;
    var extractedId = parentId.split("-")[3];
    var summaryDsiableTitle = $(
      "#form-group-" + extractedId + " .group-info .group-title"
    ).text();
    var disableFormItem = false;
    if (summaryDsiableTitle === "خلاصه درخواست") {
      itemObj.IsReadOnly = true;
    }

    if (itemObj.Visibility == "DefaultHidden") itemObj.Visibility = "false";
    let Readonly = itemObj.IsReadOnly;
    let _formID = itemObj.FormID;
    let _formItemId = itemObj.FormItemID;
    let _json;
    //Get Columns

    $.ajax({
      type: "POST",

      url: "../../App_Sys/Services/Admin/Form.asmx/GetFormItemDetails",

      data:
        '{"formid":"' +
        _formID +
        '","formitemid":"' +
        _formItemId +
        // '","responseToken":"' +
        // genResponseToken() +
        '"}',

      contentType: "application/json; charset=utf-8",

      dataType: "json",

      async: false,

      error: function (jqXHR, textStatus, errorThrown) {
        alert(JSON.stringify(jqXHR));
      },
      success: function (data) {
        data = data.d;

        _json = jQuery.parseJSON(data);

        setRequestToken(_json.requestToken);
      },
    });

    let Columns = _json;

    // function importCsv(event) {
    //   const input = event.target;

    //   if (input.files.length > 0) {
    //     const file = input.files[0]; // Get the first selected file
    //     const fileName = file.name;
    //     const fileExtension = fileName.split(".").pop().toLowerCase();

    //     // Check if the file extension is not csv
    //     if (fileExtension !== "csv") {
    //       alert("Warning: Please upload a CSV file.");
    //       return; // Exit the function if it's not a CSV
    //     }

    //     const reader = new FileReader();

    //     // Define what happens when the file is read
    //     reader.onload = function (e) {
    //       const contents = e.target.result; // Get file contents as a string

    //       // Parse CSV content, skipping the header row
    //       const parsedData = parseCsv(contents);

    //       // Remove any empty arrays from the parsed data
    //       const filteredData = parsedData.filter((row) =>
    //         row.some((cell) => cell.trim() !== "")
    //       );

    //       // Add filtered data to the table, but first check the column count
    //       const table = document.querySelector(`#tbody_${_formItemId}`);
    //       const sampleRow = table.querySelector("tr");

    //       if (sampleRow) {
    //         const tableColumnCount =
    //           sampleRow.querySelectorAll("td").length - 2; // Adjust for row index and control columns
    //         const csvColumnCount = filteredData[0].length;

    //         // Show an alert if the column count doesn't match
    //         if (csvColumnCount !== tableColumnCount) {
    //           alert(
    //             `Error: CSV column count (${csvColumnCount}) does not match table column count (${tableColumnCount}).`
    //           );
    //           return; // Exit the function if columns don't match
    //         }
    //       }

    //       // If columns match, populate the table
    //       populateTable(filteredData);
    //     };

    //     // Define what happens in case of an error
    //     reader.onerror = function (e) {
    //       console.error("File reading error:", e);
    //     };

    //     // Read the file as text
    //     reader.readAsText(file);
    //   }
    // }

    // Utility function to parse CSV content, excluding the header row
    // function parseCsv(content) {
    //   const rows = content.split("\n");
    //   return rows.slice(1).map((row) => row.split(",")); // Skip the first row (headers)
    // }

    // Function to populate the table
    // function populateTable(data) {
    //   const table = document.querySelector(`#tbody_${_formItemId}`);
    //   const lastRow = table.querySelectorAll("tr");
    //   const lastRowNumber = lastRow.length;

    //   data.forEach((row, index) => {
    //     index = index + lastRowNumber;

    //     // Create a new row for each data entry
    //     const tr = document.createElement("tr");

    //     // Add the row index cell
    //     const rowIndex = document.createElement("td");
    //     rowIndex.textContent = index + 1; // Assuming you want 1-based index
    //     tr.appendChild(rowIndex);

    //     // Add data cells
    //     row.forEach((cell) => {
    //       const td = document.createElement("td");
    //       td.textContent = cell;
    //       tr.appendChild(td);
    //     });

    //     // Add control buttons
    //     const controlTd = document.createElement("td");
    //     controlTd.className = "text-center";
    //     controlTd.style.cssText =
    //       "vertical-align: middle !important; direction: ltr; display: flex;border-top: 0px;border-bottom: 1px solid;";
    //     controlTd.innerHTML = `
    //       <span id="Del_Row_${_formItemId}_${
    //       index + 1
    //     }" class="btn remove glyphicon glyphicon-trash" onclick="Table_Del_Row(event)" style="font-size: 16px; line-height: inherit;"></span>
    //       <span id="Edit_Row_${_formItemId}_${
    //       index + 1
    //     }" class="btn glyphicon glyphicon-edit" onclick="Table_Edit_Row(event)" style="font-size: 17px; line-height: normal;"></span>
    //     `;
    //     tr.appendChild(controlTd);

    //     // Append the row to the table body
    //     table.appendChild(tr);
    //   });
    // }

    let itemContent = `<div class="form-group" style="${tableStyle};${
      itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
        ? "display:none"
        : ""
    }" 
        id="form-group-${_formItemId}">
        <div style="position : relative;"> 
        <label class="form-item-lbl">${itemObj.Label}</label>
        <table id="form-item-${_formItemId}" class="table table-bordered table-hover" style="margin-bottom: 5px;text-align: center;border: 1px solid #ddd !important;
        border-radius: 5px !important;background-color: white;border-radius: 3px !important;border-collapse: separate;overflow: hidden;" >
        <thead>
        <tr>
        <th scope="col"  style="width:80px;font-size: 12px;margin-bottom: 5px;text-align:center;border-bottom: 1px solid #ddd !important">${
          $$Lang == "Fa" ? "ردیف" : "Row"
        }</th>
        <th scope="col"  style="display:none">RowID</th>`;
    //Thead
    let ShowInListIndex = "";
    for (let i in Columns) {
      if (Columns[i].ShowInList == "True") {
        itemContent += `<th ${disableFormItem}  onclick="nofliter(event)" class="filterable" scope="col" style="margin-bottom: 5px;text-align:center;font-size: 12px;border-bottom: 1px solid #ddd !important;width: ${
          Columns[i].ColWidth
        };height: ${Columns[i].ColHeight}; cursor: pointer;" id=${
          Columns[i].SubTableID
        }><i onclick="addSortFunctionality('form-item-${_formItemId}',event)" class="fa-light fa-sort" style="margin:0 5px;display:none !important;"></i> ${Columns[
          i
        ].Label.replaceAll(
          "GetDate",
          "Log Date"
        )}<i id="filter-icon" onclick="initialize('form-item-${_formItemId}')" class="fa-regular fa-filter-list" style="margin:0 5px;"></i></th>`;
      } else {
        ShowInListIndex += i + ",";
      }
    }
    if (!itemObj.IsReadOnly)
      itemContent += `<th scope="col" style="min-width: 100px;font-size: 12px;border-bottom: 1px solid #ddd !important;"> </th>`;

    itemContent += `</tr>
    </thead>`;
    itemContent += `<div id="filter-options"></div>`;
    //Tbody

    let _DefaultObj = {
      ID: "form-item-" + _formItemId,
      Rows: [],
    };

    let _CurrentObj = "";

    _CurrentObj = getDefaultValue(itemObj);

    if (_CurrentObj.length) {
      _DefaultObj.Rows = _CurrentObj == "NULL" ? [] : _CurrentObj;
    } else if (typeof _CurrentObj != "string") {
      if (
        _CurrentObj != "NULL" &&
        _CurrentObj != "" &&
        _CurrentObj != "undefined"
      ) {
        //is object bpms
        if (_CurrentObj.Rows.length) _DefaultObj.Rows = _CurrentObj.Rows;
      }
    }

    let index = $TableData.findIndex((x) => x.ID === _DefaultObj.ID);

    if (index > -1) $TableData.splice(index, 1);

    $TableData.push(_DefaultObj);

    let _Rows = [];

    _Rows = _DefaultObj.Rows != "NULL" ? _DefaultObj.Rows : [];

    if (_Rows.length) {
      itemContent += `<tbody id="tbody_${_formItemId}">`;
      for (let i = 0; i < _Rows.length; i++) {
        let values = Object.values(_Rows[i]);

        itemContent += `<tr><td class="text-center" style="vertical-align: middle !important;direction: ltr;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">${
          i + 1
        }</td>`;

        itemContent += `<td class="text-center" style="display:none">${values[0]}</td>`;
        for (let j = 1; j < values.length; j++) {
          if (Columns[j - 1].ShowInList == "True") {
            if ([values[j]] == "checked") {
              itemContent += `<td class="text-center" style="vertical-align: middle !important;direction: ltr;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">
             <div class="icheckbox_square-green checked" style="position: relative;"><input type="checkbox" class="grid-checkbox " style="opacity: 0;">
                </div>
            </td>`;
            } else if ([values[j]] == "unchecked") {
              itemContent += `<td class="text-center" style="vertical-align: middle !important;direction: ltr;text-align:center;font-size: 12px;border: 0px; border-bottom: 1px solid">
             <div class="icheckbox_square-green" style="position: relative;"><input type="checkbox" class="grid-checkbox " style="opacity: 0;">
                </div>
            </td>`;
            } else if (Columns[j - 1].InputType == "ForeignKey") {
              let entityLabel;
              $.ajax({
                type: "POST",
                url: "../../App_Sys/Services/EditActivity.asmx/GetEntityValues",
                data: JSON.stringify({
                  EntityId: parseInt(Columns[j - 1].EntityTypeID),
                  Id: parseInt(values[j]),
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (response) {
                  entityLabel = response.d;
                },
                error: function (error) {
                  console.error("Error fetching entity details:", error);
                },
              });
              itemContent += `<td class="text-center" style="vertical-align: middle !important;direction: ltr;text-align:center;font-size: 12px;border: 0px; border-bottom: 1px solid">${[
                entityLabel,
              ]}</td>`;
            } else {
              itemContent += `<td class="text-center" style="vertical-align: middle !important;direction: ltr;text-align:center;font-size: 12px;border: 0px; border-bottom: 1px solid">${[
                values[j],
              ]}</td>`;
            }
          }
        }

        if (!itemObj.IsReadOnly) {
          itemContent += `<td class="text-center" style="vertical-align: middle !important;direction: ltr;border-bottom:1px solid;border-top: 0px;font-size: 14px;border: 0px; border-bottom: 1px solid"> 
         <span id="Del_Row_${
           values[0].split("_")[1]
         }" class="btn remove glyphicon glyphicon-trash" onclick="Table_Del_Row(event)" style="font-size: 16px;line-height: inherit;"></span> 
         <span id="Edit_Row_${
           values[0].split("_")[1]
         }" class="btn glyphicon glyphicon-edit" onclick="Table_Edit_Row(event)"  style="font-size: 17px;line-height: normal;" ></span> 
          </td></tr>`;
        }
      }

      itemContent += `</tbody >`;
    } else {
      itemContent += `<tbody id="tbody_${_formItemId}"></tbody>`;
    }

    //Footer

    //whith csv span

    // itemContent += `<tfoot>
    // <tr><td id="AddRow_${_formItemId}" style="${
    //   itemObj.IsReadOnly === true ? "" : "cursor: pointer;"
    // } ;"><img style="pointer-events: none; ${
    //   itemObj.IsReadOnly === true ? "opacity: 0;" : ""
    // }" src="App_Base/Js/MxGraph/src/images/plus.png"/></td><td colspan="${
    //   Columns.length + 1
    // }" style="background-color: whitesmoke;" >
    //     <span style="width: 100%;display: inline-flex;align-items: center;position: relative;${
    //       itemObj.IsReadOnly === true ? "opacity: 0;" : ""
    //     }">
    //      <span style="position: absolute;left: -8px;top: -21px;">
    //        <label for="file-upload-${_formItemId}" style="
    //          padding-right: 40px;
    //          width: 100px;
    //           ;
    //          height: 36px;
    //          display: inline-flex;
    //          align-items: center;
    //          cursor: pointer;
    //          font-size: 12px;
    //          ">
    //          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAExUlEQVR4nO2aW4gcRRSGyxsIKt6iRiXigyiiJuBMn9MJixNFBOODKMx01WTDynrLkw8+6IPg6otGBFGIknW26/SsirJeooiPRkxAVEy8LIJgHlyUSKKI1yiuzsrpi9sz3TPbbnpm2u45ULDdU12Xr/5Tp/r0CjGykY1sZCMbWSJThEuDKlLDYalxt0W4WRQRgAqKxpYk2CGWxHHFBEBBgQeLDUBjS9qgMgVA9MmqZKyt6bKhNDylCP5YhgBHlWOCyDuAsNUJbm/fHPGQpcvrRFEAVKdLp0fdAQ6Mz64/RRQBgJwxyrFhkuCt6lz1BJF3AIrw8W4boxse8wygSsZaSfBzr+hQJ7xN5BWAJHh1pfAoCf+sO3CtyCMAZeOYJHyTzwA9IWj8frxhXpLLPYCtZsMGRfCS0vBXDyV8Xt1ZOVXkEUBgvMpSA3UDIQkaIs8AArOaeLkknIs9LjvGFSLvAAKra7hZavy1Y1xPiKIAYJNkbO8Y1yeiUAAaeF7HuH7sW2dq0K/AqywjAP0ylYHV/d8oQBJ8yYeTtoRGe/lNEc4rjQuKYHE5lMFRqeEHqeH39vqw6N5f4d1g6ACkhg84TgfP1F8YO1MSPNlWT+Nj4ff5arN0kSLc6/826/al4e6Odp/n+1LDZHYBaFzgBIZbd7q0hicWPCs1vOhNBN91J90wz5IEN6mmsbEyVTlRanzPX+kjU1PieIvw4nDbFsE2rx3cnVkAkoztXI8HGzqu2orwoZAruAcVSbgr9Ox8+HgrbUS/zhc+2BaHuwmqnKwIfsksAEuX1/HqKY3f9tgb9nGO3011eUnPZf//V+74sNuf+7uriv0uWAdvzPAmCIs8sa3Plc5P4Co7eTW5zdpM+UpJ+GEHgI88ALjFv/cIX0uCpzMPYHx247lJBqk0HLQ0WtyuJ21/E/Qlz9kg3ijZdeqOcY0PZCEB3NaQAOASb1zeQOFgIgjee/yc+4xtVtpVAJP+pF+7a7p0kpcTSNTerqEBkIT3+IPeEmx6UsMrHNrCSlGEb4cmepif2TpTvqyjvZf5fhBSFeEDK/cPX03ObDpteAA0HtrWNM7muhO04Yz2MIh7fOm/wde8otLGcatpXMrXnNzsaOsnXvnlvuH9laRft83rvbagymXgAJQ38I/DSQk/3jdCdfbWtHl1uF2p4TqO/51tBclODoGS8O8k0q/aY+d4bcER/nvgAJS/Gn4Mn+92FOZEJn/h6RUy+bic5Pgbln44UxTsL4MHQAMsGluWAze4k3fMWkRFabqCGvZk41f/GXds06U1vKHGuMZ37EK5BCC7SD8Gwut9ASAyYnHS74srqAwC6Cb9vriCyiCAXtJP3RVUxgAkkX6qrqAyBCCp9FN1BZUhAP9F+qm5gsoIgNVIPxVXUBkAsFrpp+IKKgMAjkX6x+wKKgMAepnS8E3MJL9OrwPKNgBJ8FlkpTV8WhgASsM7EQVo3JNeB5SO76VZwhtZ3H+VcUou1wDqfhrMB9CIcYFncw1Aabw3BGBHjAIezTUAqYGC8dU13h/5neA+URSThHdGFWLeIYpidY23RhTgGLeIophFuDmiANusiKKYdHB9JEpo8ypRFKs65oURF5jZdIEoik14X5nbAASf4bvZP0yfwV4PoNkFAAAAAElFTkSuQmCC"
    //          style="width: 23px;">
    //        </label>
    //        <input id="file-upload-${_formItemId}" type="file" accept=".csv" style="display: none;">
    //      </span>
    //    </span>

    // </td></tr>
    // </tfoot>
    // </table></div>`;

    //without csv span
    itemContent += `<tfoot>
    <tr>`;

    if (!itemObj.IsReadOnly) {
      itemContent += `<td id="AddRow_${_formItemId}" style="cursor: pointer;overflow-wrap: anywhere;text-align: center;border: 0px;"><img style="pointer-events: none;" src="App_Base/Js/MxGraph/src/images/plus.png"/></td>`;
      itemContent += `<td colspan="${
        Columns.length + 1
      }" style="background-color: #ffffff;overflow-wrap: anywhere;text-align: center;border: 0px;" >
    </td>`;
    }

    itemContent += `</tr>
    </tfoot>
    </table></div>`;

    itemContent += `</div>`;

    $(parentID).append(itemContent);

    // Add row
    if (!Readonly)
      $("#AddRow_" + _formItemId).on("click", (e) => {
        if (itemObj.Label == "اعضای همراه") {
          let tblid = e.target.id.replaceAll("AddRow_", "form-item-");

          if ($(`#` + tblid + " tr").length < 5) {
            Add_Edit_Row(_formItemId, null, "Add");
          } else {
            swal("سقف اعضای همراه 3 نفر می باشد.", {
              icon: "warning",
              buttons: {
                confirm: "ok",
              },
            });
          }
        } else {
          Add_Edit_Row(_formItemId, null, "Add");
        }
      });

    // Bind the file input change event
    $(document).on("change", `#file-upload-${_formItemId}`, function (event) {
      // importCsv(event);
      $(this).val("");
    });

    this.Table_Del_Row = function (e) {
      let _tbody = $(e.target).parents().eq(2).attr("id");

      $(e.target).parent().parent().remove();

      //row sorted
      let rows = $(`#` + _tbody + " tr");
      for (let i = 0; i < rows.length; i++) {
        $(rows[i])
          .children()
          .eq(0)
          .text(i + 1);
      }

      let _obj = {
        ID: "form-item-" + _tbody.split("_")[1],
        Rows: [],
      };

      let tbl = $TableData.filter((x) => x.ID == _obj.ID);

      const RowID = e.target.id.replaceAll("Del_Row_", "RowID_");

      if (tbl.length > 0) _obj = tbl[0];

      let index = _obj.Rows.findIndex((x) => Object.values(x)[0] === RowID);

      if (index > -1) _obj.Rows.splice(index, 1);

      index = $TableData.findIndex((x) => x.ID === _obj.ID);

      if (index > -1) $TableData.splice(index, 1);

      $TableData.push(_obj);
    };

    this.Table_Edit_Row = function (e) {
      const RowID = e.target.id.split("_")[2];
      const _formItemId = $(e.target).parents().eq(2).attr("id").split("_")[1];
      Add_Edit_Row(_formItemId, RowID, "Edit");
    };

    function Add_Edit_Row(_formItemId, RowID, mode) {
      //Form Modal
      let FileBrowseID = [];
      let div =
        '<div id="Modal" class="modal" >' +
        '<div id="modalform" class="modal-content" style="width: 785px !important;height: auto;inset: 40px 0px 0px;margin: auto;">' +
        "</div></div>";
      $("#content").append(div);

      $("#Modal").css("display", "block");
      $("#modalform").css("width", "800px");

      let item = "";

      //Title
      item += `<div id="Title"  style="font-weight: 600px;font-size:14px;font-family: 'IRANSansWeb';font-weight: 600;background-color: var(--A1);color: white; padding: 8px;"><span class="fa fa-plus" style="padding: 5px 0px;"></span> ${
        mode == "Add"
          ? $$Lang == "Fa"
            ? "افزودن سطر جدید"
            : "Add New Row"
          : $$Lang == "Fa"
          ? "ویرایش سطر"
          : "Edit Row"
      }</div>`;
      // item += `<hr style="margin-bottom:10px;border-Top:2px solid #ccc;margin:5px">`;

      // Main
      item += `<div id="modalContent" style="overflow: auto;padding:0px 20px 10px 20px;max-height:730px;width: 800px;">`;

      // Create Element
      const _formID = itemObj.FormID;

      $.ajax({
        type: "POST",
        url: "../../App_Sys/Services/Admin/Form.asmx/GetFormItemDetails",
        data: '{"formid":"' + _formID + '","formitemid":"' + _formItemId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        error: function (jqXHR, textStatus, errorThrown) {
          alert(JSON.stringify(jqXHR));
        },
        success: function (data) {
          data = data.d;
          Columns = jQuery.parseJSON(data);
          setRequestToken(Columns.requestToken);
        },
      });

      // Create a container for the labels and inputs
      item += `<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; box-sizing: border-box;">`;

      let value = [];

      for (let i = 0; i < Columns.length; i++) {
        // Create a wrapper for each label and input pair
        item += `<div style="flex: 0 1 calc(100% - 20px); box-sizing: border-box;" class="StaticHidden">`; // Ensure width is strictly 33.33%
        item += `<label class="lblPopup lbl" style="${
          Columns[i].Label == "GetDate" ? "display: none;" : "display: block;"
        } width: auto; margin-top: 15px; font-family: 'IRANSansWeb'; padding: 0; margin-bottom: 0px;">
       ${Columns[i].Label}
        </label>`;

        // Load for Edit
        let tbl = $TableData.filter((x) => x.ID == "form-item-" + _formItemId);
        if (tbl.length && RowID != null) {
          for (let j = 0; j < tbl[0].Rows.length; j++) {
            if (Object.values(tbl[0].Rows[j])[0] == "RowID_" + RowID) {
              value.push(Object.values(tbl[0].Rows[j])[i + 1]);
            }
          }
        }
        item += `<div class="input-group" data-enabletimepicke="true" style="${
          Columns[i].Label == "GetDate" ? "display: none;" : "display: block;"
        } width: 100%; max-width: 223px;">${Elements(
          itemObj,
          Columns[i].InputType,
          i,
          value.length ? value[i] : (value = ""),
          Columns[i].EnumTypeID,
          Columns[i].EntityTypeID,
          Columns[i].Label == "GetDate" ? true : false
        )}</div>`;

        item += `</div>`; // Close the wrapper div

        if (Columns[i].InputType == "File") {
          itemObj.AttributeTypeName = "File";
          FileBrowseID.push(i);
        }

        if (Columns[i].InputType == "Image") {
          itemObj.AttributeTypeName = "Image";
          FileBrowseID.push(i);
        }
      }

      // Fill the remaining space to maintain alignment for items that aren't multiples of 3
      const remainingItems = Columns.length % 3;
      if (remainingItems !== 0) {
        const emptySlots = 3 - remainingItems;
        for (let i = 0; i < emptySlots; i++) {
          item += `<div style="flex: 0 1 calc(33.33% - 20px); box-sizing: border-box;"></div>`; // Empty div to fill the space
        }
      }

      item += `</div>`; // Close the flex container

      //Btn
      item += `<div style="border-top: 1px solid #ccc;padding-top: 5px;margin-top:45px;margin-bottom:10px">
            <button id="btnPopupAdd-Edit" class="btn btn-primary btn_submint_exit btn-form-submit" style="font:14px IRANSansWeb;width:90px;height:35px;margin-top: 5px;" >${
              $$Lang == "Fa" ? "ذخیره" : "Save"
            }</button>
            <button id="btnPopupClose" class="btn btn-light btn_submint_exit"  style="margin:0px 5px;font:14px IRANSansWeb;height:35px;margin-top: 5px;">${
              $$Lang == "Fa" ? "لغو" : "Cancel"
            }</button>
            </div></div>`;
      $(`#modalform`).append(item);

      renderTableFileBrowse(itemObj, FileBrowseID, value);
      
    if (_formItemId == 620029045) {
        $("#modalform").css("width", "570px");

        $(".StaticHidden").each(function () {
          $(this).css("padding-left", "90px");
        });

        $("#item1").css("width", "300px");
        $(".file-input").attr("style", "width: 340px;");

        $("#item2").on("input", () => {
          const originalValue = $("#item2").val();
          // Remove everything up to and including the last slash (either '\' or '/')
          const newValue = originalValue.replace(/^.*[\\\/]/, "");
          $("#item1").val(newValue);
        });
      }
      //Static function to hide and show item
      let itemsLabel = $(".StaticHidden label").get();
      itemsLabel.forEach((item) => {
        // Check if the label is empty
        if ($(item).text().trim() === "") {
          // Hide the input if the label is empty
          let inputElement = $(item).next(); // This gets the next sibling (the input container)
          inputElement.css("visibility", "hidden"); // Or use "display: none" to remove from layout
        }
      });

      $('[type="text"]').inputmask();

      EnableMdDateTimePickers();

      //Insert Data for Edit

      $(`#btnPopupAdd-Edit`).on("click", async () => {
        if (mode == "Add") {
          Add_Row_Table();
        } else if (mode == "Edit") {
          Edit_Row_Table();
        }
      });
      function Add_Row_Table() {
        //add or load table
        let _obj = {
          ID: "form-item-" + _formItemId,
          Rows: [],
        };
        let tbl = $TableData.filter((x) => x.ID == _obj.ID);

        if (tbl.length) _obj = tbl[0];

        let IsRequired = true;

        let _row = `<tr><td style="vertical-align: middle !important;direction: ltr;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">${
          $(`#tbody_` + _formItemId + " tr").length + 1
        }</td>`;

        let lastRowID = 1;

        let lastTr = $(`#tbody_` + _formItemId + " tr:last-child")
          .children()
          .eq(1)
          .text();

        if (lastTr != "") lastRowID = +lastTr.split("_")[1] + 1;

        let _columnVal = [];

        _row += `<td class="text-center" style="display:none">RowID_${lastRowID}</td>`;

        _columnVal.push(["RowID", `RowID_${lastRowID}`]);

        for (let i = 0; i < Columns.length; i++) {
          let _type = $(`#item` + i).attr("type");
          let _lbl = $(`#item` + i)
            .parent()
            .parent()
            .prev()
            .text()
            .trim();

          if (_type == "checkbox") {
            _lbl = $(`#item` + i)
              .parent()
              .prev()
              .text()
              .trim();

            let _checked = $(`#item` + i).prop("checked")
              ? "checked"
              : "unchecked";
            _columnVal.push([_lbl, _checked]);

            if (Columns[i].ShowInList == "True")
              _row += `<td class="text-center" style="vertical-align: middle !important; overflow-wrap: anywhere; text-align: center;direction: ltr;font-size: 12px;border: 0px;border-bottom: 1px solid">
            <div class="icheckbox_square-green ${_checked}" style="position: relative;"><input type="checkbox" class="grid-checkbox " style="opacity: 0;">
            </div>
            </td>`;
          } else {
            if (_type == "Enum") {
              let _Label = $("#item" + i + " option:selected").text();
              if (_Label.length) _Label = _Label.replaceAll("undefined", "");

              _columnVal.push([_lbl, _Label]);

              if (Columns[i].ShowInList == "True")
                _row +=
                  `<td class="text-center" style="vertical-align: middle !important; overflow-wrap: anywhere; text-align: center;direction: ltr;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">` +
                  _Label +
                  `</td>`;

              if (
                $(`#item` + i + " option:selected").text() == "" &&
                Columns[i].Nullable == "False"
              ) {
                IsRequired = false;
                $(`#item` + i).css("border-color", "red");
                break;
              } else {
                $(`#item` + i).css("border-color", "#d2d6de");
              }
            } else if (_type == "System") {
              let _Label = $("#item" + i + " option:selected").text();
              let _value = $("#item" + i + " option:selected").val();
              if (_Label.length) _Label = _Label.replaceAll("undefined", "");

              _columnVal.push([_lbl, _value]);

              if (Columns[i].ShowInList == "True")
                _row +=
                  `<td class="text-center" style="vertical-align: middle !important; overflow-wrap: anywhere; text-align: center;direction: ltr;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">` +
                  _Label +
                  `</td>`;

              if (
                $(`#item` + i + " option:selected").text() == "" &&
                Columns[i].Nullable == "False"
              ) {
                IsRequired = false;
                $(`#item` + i).css("border-color", "red");
                break;
              } else {
                $(`#item` + i).css("border-color", "#d2d6de");
              }
            } else if (_type == "file") {
              _lbl = $(`#item` + i)
                .parents()
                .eq(5)
                .prev()
                .text()
                .trim();

              let _fileName = "";

              var _data = new FormData();

              var files = "";

              files = $("#item" + i).get(0).files;
              if (files) {
                if (files.length > 0) {
                  _data.append("file" + i, files[0]);

                  _fileName = files[0];

                  $.ajax({
                    type: "POST",

                    url: "App_Sys/Services/EditActivity.asmx/SaveFile",

                    data: _data,

                    contentType: false,

                    dataType: "xml",

                    async: false,

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

                      _fileName =
                        data.getElementsByTagName("string")[0].childNodes[0]
                          .nodeValue;

                      if (Columns[i].ShowInList == "True")
                        _row +=
                          `<td class="text-center" style="vertical-align: middle !important; overflow-wrap: anywhere; text-align: center;direction: ltr;text-align:center;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">` +
                          _fileName +
                          `</td>`;

                      var requestToken;

                      setRequestToken(requestToken);
                    },
                  });
                } else {
                  if (Columns[i].ShowInList == "True")
                    _row += `<td class="text-center" style="vertical-align: middle !important; overflow-wrap: anywhere; text-align: center;direction: ltr;text-align:center;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid"></td>`;
                }
              }
              _columnVal.push([_lbl, _fileName]);
            } else {
              _columnVal.push([_lbl, $(`#item` + i).val()]);

              if (Columns[i].ShowInList == "True")
                _row +=
                  `<td class="text-center" style="vertical-align: middle !important; overflow-wrap: anywhere; text-align: center;direction: ltr;text-align:center;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">` +
                  $(`#item` + i).val() +
                  `</td>`;
              if (
                $(`#item` + i).val() == "" &&
                Columns[i].Nullable == "False"
              ) {
                IsRequired = false;
                $(`#item` + i).css("border-color", "red");
                break;
              } else {
                $(`#item` + i).css("border-color", "#d2d6de");
              }
            }
          }
        }

        if (IsRequired) {
          //btn delete and edite in row
          if (!Readonly) {
            _row += `<td class="text-center" style="vertical-align: middle !important; overflow-wrap: anywhere; text-align: center;border: 0px;border-bottom: 1px solid">
        <span id="Del_Row_${lastRowID}" class="btn remove glyphicon glyphicon-trash" onclick="Table_Del_Row(event)"  style="font-size: 16px;line-height: inherit;" ></span>
        <span id="Edit_Row_${lastRowID}" class="btn glyphicon glyphicon-edit" onclick="Table_Edit_Row(event)" style="font-size: 17px;line-height: normal;"></span>
          </td>`;
          }
          _row += `</tr>`;

          $(`#tbody_` + _formItemId).append(_row);

          _obj.Rows.push({ ...Object.fromEntries(_columnVal) });

          let index = $TableData.findIndex((x) => x.ID === _obj.ID); // This could be -1 in some cases

          if (index > -1) $TableData.splice(index, 1); // Only splice if index is valid

          $TableData.push(_obj);

          $(`#Modal`).remove();
        }
      }

      function Edit_Row_Table() {
        let _obj = {
          ID: "form-item-" + _formItemId,
          Rows: [],
        };

        let tbl = $TableData.filter((x) => x.ID == _obj.ID);

        if (tbl.length) _obj.Rows = tbl[0].Rows;

        //GET ROW UI
        let TR = $(`#form-item-${_formItemId} tr`);

        let _rowCilds = 0;

        if (TR.length > 2) {
          for (let i = 1; i < TR.length; i++) {
            let Row_id = $(TR[i]).children().eq(1).text().split("_")[1];

            if (RowID == Row_id) _rowCilds = TR[i];
          }
        }

        _rowCilds = $(_rowCilds).children();
        //GET VALUE

        let IsRequired = true;

        let _columnVal = [];

        let _elements = [];
        if (_obj.Rows.length) {
          _elements = Object.keys(_obj.Rows[0]);
        }

        if (_elements.length) {
          _columnVal.push(["RowID", "RowID_" + RowID]);
          for (let i = 1; i < _elements.length; i++) {
            let _type = $(`#item` + (i - 1)).attr("type");

            let _lbl = $(`#item` + (i - 1))
              .parent()
              .parent()
              .prev()
              .text()
              .trim();

            if (_type == "checkbox") {
              _lbl = $(`#item` + (i - 1))
                .parent()
                .prev()
                .text()
                .trim();

              let _checked = $(`#item` + (i - 1)).prop("checked")
                ? "checked"
                : "unchecked";

              _columnVal.push([_lbl, _checked]);
            } else {
              if (_type == "file") {
                let _fileName = $(`#item` + (i - 1)).attr("value");

                if (
                  $(`#item` + (i - 1))
                    .parents()
                    .eq(3)
                    .attr("class") == "file-input file-input-new"
                ) {
                  //_fileName = "";
                }

                _lbl = $(`#item` + (i - 1))
                  .parents()
                  .eq(5)
                  .prev()
                  .text()
                  .trim();

                var _data = new FormData();

                var files = "";

                files = $("#item" + (i - 1)).get(0).files;

                if (files) {
                  if (files.length > 0) {
                    _data.append("file" + (i - 1), files[0]);
                    _fileName = files[0];

                    $.ajax({
                      type: "POST",

                      url: "App_Sys/Services/EditActivity.asmx/SaveFile",

                      data: _data,

                      contentType: false,

                      dataType: "xml",

                      async: false,

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

                        _fileName =
                          data.getElementsByTagName("string")[0].childNodes[0]
                            .nodeValue;

                        var requestToken;

                        setRequestToken(requestToken);
                      },
                    });
                  }
                }

                _columnVal.push([_lbl, _fileName]);
              } else if (_type == "Enum") {
                let _Label = $("#item" + (i - 1) + " option:selected").text();

                _columnVal.push([_lbl, _Label]);
              } else if (_type == "System") {
                let _val = $("#item" + (i - 1) + " option:selected").val();

                _columnVal.push([_lbl, _val]);
              } else {
                if (
                  $(`#item` + (i - 1)).val() == "" &&
                  Columns[i - 1].Nullable == "False"
                ) {
                  IsRequired = false;
                  $(`#item` + (i - 1)).css("border-color", "red");
                  break;
                } else {
                  _columnVal.push([_lbl, $(`#item` + (i - 1)).val()]);

                  if (Columns[i - 1].ShowInList == "True") {
                    $(`#item` + (i - 1)).css("border-color", "#d2d6de");
                  }
                }
              }
            }
          }
          //insert to table ui
          let k = 2;
          //todo
          for (let j = 1; j < _columnVal.length; j++) {
            if (Columns[j - 1].ShowInList == "True") {
              if (_rowCilds.length > k) {
                if (_columnVal[j][1] == "checked") {
                  const _checked = "checked";
                  $(_rowCilds[k])
                    .html(`<div class="icheckbox_square-green ${_checked}" style="position: relative;"><input type="checkbox" class="grid-checkbox " style="opacity: 0;">
                          </div>`);
                } else if (_columnVal[j][1] == "unchecked") {
                  $(_rowCilds[k])
                    .html(`<div class="icheckbox_square-green" style="position: relative;"><input type="checkbox" class="grid-checkbox " style="opacity: 0;">
                          </div>`);
                } else if (Columns[j - 1].InputType == "ForeignKey") {
                  let entityLabel;
                  $.ajax({
                    type: "POST",
                    url: "../../App_Sys/Services/EditActivity.asmx/GetEntityValues",
                    data: JSON.stringify({
                      EntityId: parseInt(Columns[j - 1].EntityTypeID),
                      Id: parseInt(_columnVal[j][1]),
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function (response) {
                      entityLabel = response.d;
                    },
                    error: function (error) {
                      console.error("Error fetching entity details:", error);
                    },
                  });
                  $(_rowCilds[k]).text(entityLabel);
                } else {
                  $(_rowCilds[k]).text(_columnVal[j][1]);
                }
                k++;
              }
            }
          }
        }

        let index = _obj.Rows.findIndex(
          (x) => Object.values(x)[0] === "RowID_" + RowID
        );

        if (index > -1) _obj.Rows.splice(index, 1);

        _obj.Rows.push({ ...Object.fromEntries(_columnVal) });

        index = $TableData.findIndex((x) => x.ID === _obj.ID);

        if (index > -1) $TableData.splice(index, 1);

        $TableData.push(_obj);

        if (IsRequired) {
          $(`#Modal`).remove();
        }
      }

      $(`#btnPopupClose`).on("click", () => {
        $(`.popover`).remove();
        $(`#Modal`).remove();
      });

      $("#modalContent select").select2();
    }

    function Elements(
      itemObj,
      type,
      count,
      value,
      EnumTypeID,
      EntityTypeID,
      IsLogItem
    ) {
      const _object = {
        LatinString: "text",
        String: "text",
        Text: "textarea",
        Integer: "number",
        BigInteger: "number",
        Time: "time",
        Date: "date",
        DateTime: "datetime-local",
        Boolean: "checkbox",
        Money: "number",
        File: "file",
        System: "select",
        Computed: "textarea",
        Enum: "select",
      };
      if (EnumTypeID != "" && EnumTypeID != 0) type = "Enum";
      if (type == "ForeignKey" && EntityTypeID != 0) type = "System";
      let click = itemObj.Visibility == "Disabled" ? "" : "click";
      switch (type) {
        case "System":
          var dataToSend = {
            id: EntityTypeID,
            activityID: 0,
            q: {},
            filters: [],
            responseToken: genResponseToken(),
          };
          $.ajax({
            url: "../App_Sys/Services/Action.asmx/GetListData",
            contentType: "application/json; charset=utf-8",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(dataToSend),
            async: true,
            error: function (jqXHR, textStatus, errorThrown) {
              console.error("Operation error:", textStatus, errorThrown);
              alert("Operation error \n\r " + errorThrown);
            },
            success: function (data) {
              var options = data.d;
              var selectElement = $(`#item${count}`);

              selectElement.empty();
              options.forEach(function (option) {
                if (option.requestToken) return;

                var optionElement = $("<option>", {
                  value: option.value,
                  text: option.label,
                  selected: option.value === value,
                });

                selectElement.append(optionElement);
              });
            },
          });

          return `<div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-check"></span></div><select type="System" class="form-control form-input" id="item${count}"> </select></div>`;
        case "Enum":
          let _EnumTypes;
          $.ajax({
            type: "POST",

            url: "../../App_Sys/Services/Admin/Process.asmx/GetEnums",

            data:
              '{"enumTypeId":"' +
              EnumTypeID +
              // '","responseToken":"' +
              // genResponseToken() +
              '"}',

            contentType: "application/json; charset=utf-8",

            dataType: "json",

            async: false,

            error: function (jqXHR, textStatus, errorThrown) {
              alert(JSON.stringify(jqXHR));
            },
            success: function (data) {
              data = data.d;
              _EnumTypes = jQuery.parseJSON(data);

              setRequestToken(Columns.requestToken);
            },
          });

          let _Options;

          for (let j in _EnumTypes) {
            // Normalizing the value for comparison
            let normalizedValue = value.replace(/–/g, "-");

            // دورکاری یا مرخصی دانشجویی
            if (itemObj.FormItemID == 604000735) {
              // حذف پنجشنبه و جمعه
              if (_EnumTypes[j].ID != 11045 && _EnumTypes[j].ID != 11046) {
                _Options += `<option value="${_EnumTypes[j].ID}" ${
                  _EnumTypes[j].Label.replace(/–/g, "-") == normalizedValue
                    ? "selected"
                    : ""
                }>${_EnumTypes[j].Label}</option>`;
              }
            } else {
              _Options += `<option value="${_EnumTypes[j].ID}" ${
                _EnumTypes[j].Label.replace(/–/g, "-") == normalizedValue
                  ? "selected"
                  : ""
              }>${_EnumTypes[j].Label}</option>`;
            }
          }
          return `<div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-check"></span></div><select type="Enum" style="font-family: 'IRANSansWeb' !important;width: 300px !important" class="form-control form-input" id="item${count}">${_Options} </select></div>`;
        case "Text":
          return `<div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div><textarea style="resize : vertical;min-height: 50px;" type="text"  class="form-control form-input" id="item${count}">${value}</textarea></div>`;
        case "LocalString":
          return `<div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
          <input class="form-control form-input" onclick="" id="item${count}" value="${value}" ></div>`;
        case "Computed":
          return `<div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div><textarea type="text"  class="form-control form-input" id="item${count}">${value}</textarea></div>`;
        case "Time":
          return `<div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-time"></span></div><input type="text" data-inputmask="&quot;alias&quot;: &quot;zz:mm&quot;" dir="ltr" maxlength="5" class="form-control form-input" id="item${count}" value="${
            value ? value : "00:00"
          }"></input></div>`;
        case "Boolean":
          let _checked = value == "checked" ? value : "unchecked";

          return `<input id="item${count}" type="checkbox" ${_checked} style="cursor:pointer;width:16px;height:17px;">                `;
        case "DateTime":
        case "Date":
          // Get current date and time in Shamsi
          const now = new Date();
          const shamsiDate = toJalaali(
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate()
          );

          const formattedMonth = String(shamsiDate.jm).padStart(2, "0");
          const formattedDay = String(shamsiDate.jd).padStart(2, "0");
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");

          let _currentDate = `${shamsiDate.jy}/${formattedMonth}/${formattedDay} ${hours}:${minutes}`;

          return `<div class="input-group"><div id="picker-${count}" data-mdpersiandatetimepickershowing="false"  data-enabletimepicker=${
            type == "Date" ? "false" : "true"
          } title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker="" style="cursor: pointer;" class="input-group-addon" data-mddatetimepicker="true" data-targetselector="#item${count}"
           data-trigger="${click}"  data-placement="auto" data-englishnumber="true" ><span class="glyphicon glyphicon-calendar"></span></div><input type="text" class="form-control form-input" id="item${count}" placeholder="" data-mdpersiandatetimepickershowing="false" data-enabletimepicker=${
            type == "Date" ? "false" : "true"
          }  title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker="" data-mddatetimepicker="true" data-targetselector="#item${count}" data-trigger="${click}"  data-placement="auto" dir="ltr" data-englishnumber="true" value="${
            IsLogItem ? _currentDate : value
          }" ></div>`;
        case "File":
          if (value != "" || value != undefined)
            value = value.replaceAll(/\\/g, "/");

          return `<div><input type="file" class="form-control form-input file"  data-show-upload="false"id="item${count}" value="${value}"></div> `;

        case "Integer":
          let _oninput = "this.value = this.value.replace(/[^0-9]/g, '');";
          if (itemObj.FormItemID == 505030344)
            _oninput = "this.value = this.value.replace(/[^0-9:]/g, '');";

          return `<div class="input-group">
                <div class="input-group-addon">
                    <span class="glyphicon glyphicon-edit"></span>
                </div>
                <input dir="ltr" type="text" title="${
                  _reportID == null ? itemObj.Name : ""
                }" class="form-control form-input" id="item${count}" value="${value}" 
                oninput="${_oninput}">
            </div>`;

        default:
          return `<div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div>
          <input type="${type in _object ? _object[type] : "text"}" title="${
            _reportID == null ? itemObj.Name : ""
          }" class="form-control form-input" id="item${count}" value="${value}"></div>`;
      }
    }
    //Facility show
    if ($(`#radio-0`).is(":checked")) {
      $(`#form-group-${_formItemId}`).show();
    }
  };

  var renderSelectiveTableBox = function (itemObj, parentID, activityID) {
    var parentId = parentID;
    var extractedId = parentId.split("-")[3];
    var summaryDsiableTitle = $(
      "#form-group-" + extractedId + " .group-info .group-title"
    ).text();
    var disableFormItem = false;
    if (summaryDsiableTitle === "خلاصه درخواست") {
      itemObj.IsReadOnly = true;
    }

    if (itemObj.Visibility == "DefaultHidden") itemObj.Visibility = "false";
    let Readonly = itemObj.IsReadOnly;
    let _formID = itemObj.FormID;
    let _formItemId = itemObj.FormItemID;
    let _json;
    //Get Columns

    $.ajax({
      type: "POST",

      url: "../../App_Sys/Services/Admin/Form.asmx/GetFormItemDetails",

      data:
        '{"formid":"' +
        _formID +
        '","formitemid":"' +
        _formItemId +
        // '","responseToken":"' +
        // genResponseToken() +
        '"}',

      contentType: "application/json; charset=utf-8",

      dataType: "json",

      async: false,

      error: function (jqXHR, textStatus, errorThrown) {
        alert(JSON.stringify(jqXHR));
      },
      success: function (data) {
        data = data.d;

        _json = jQuery.parseJSON(data);

        setRequestToken(_json.requestToken);
      },
    });

    let Columns = _json;

    // function importCsv(event) {
    //   const input = event.target;

    //   if (input.files.length > 0) {
    //     const file = input.files[0]; // Get the first selected file
    //     const fileName = file.name;
    //     const fileExtension = fileName.split(".").pop().toLowerCase();

    //     // Check if the file extension is not csv
    //     if (fileExtension !== "csv") {
    //       alert("Warning: Please upload a CSV file.");
    //       return; // Exit the function if it's not a CSV
    //     }

    //     const reader = new FileReader();

    //     // Define what happens when the file is read
    //     reader.onload = function (e) {
    //       const contents = e.target.result; // Get file contents as a string

    //       // Parse CSV content, skipping the header row
    //       const parsedData = parseCsv(contents);

    //       // Remove any empty arrays from the parsed data
    //       const filteredData = parsedData.filter((row) =>
    //         row.some((cell) => cell.trim() !== "")
    //       );

    //       // Add filtered data to the table, but first check the column count
    //       const table = document.querySelector(`#tbody_${_formItemId}`);
    //       const sampleRow = table.querySelector("tr");

    //       if (sampleRow) {
    //         const tableColumnCount =
    //           sampleRow.querySelectorAll("td").length - 2; // Adjust for row index and control columns
    //         const csvColumnCount = filteredData[0].length;

    //         // Show an alert if the column count doesn't match
    //         if (csvColumnCount !== tableColumnCount) {
    //           alert(
    //             `Error: CSV column count (${csvColumnCount}) does not match table column count (${tableColumnCount}).`
    //           );
    //           return; // Exit the function if columns don't match
    //         }
    //       }

    //       // If columns match, populate the table
    //       populateTable(filteredData);
    //     };

    //     // Define what happens in case of an error
    //     reader.onerror = function (e) {
    //       console.error("File reading error:", e);
    //     };

    //     // Read the file as text
    //     reader.readAsText(file);
    //   }
    // }

    // Utility function to parse CSV content, excluding the header row
    // function parseCsv(content) {
    //   const rows = content.split("\n");
    //   return rows.slice(1).map((row) => row.split(",")); // Skip the first row (headers)
    // }

    // Function to populate the table
    // function populateTable(data) {
    //   const table = document.querySelector(`#tbody_${_formItemId}`);
    //   const lastRow = table.querySelectorAll("tr");
    //   const lastRowNumber = lastRow.length;

    //   data.forEach((row, index) => {
    //     index = index + lastRowNumber;

    //     // Create a new row for each data entry
    //     const tr = document.createElement("tr");

    //     // Add the row index cell
    //     const rowIndex = document.createElement("td");
    //     rowIndex.textContent = index + 1; // Assuming you want 1-based index
    //     tr.appendChild(rowIndex);

    //     // Add data cells
    //     row.forEach((cell) => {
    //       const td = document.createElement("td");
    //       td.textContent = cell;
    //       tr.appendChild(td);
    //     });

    //     // Add control buttons
    //     const controlTd = document.createElement("td");
    //     controlTd.className = "text-center";
    //     controlTd.style.cssText =
    //       "vertical-align: middle !important; direction: ltr; display: flex;border-top: 0px;border-bottom: 1px solid;";
    //     controlTd.innerHTML = `
    //       <span id="Del_Row_${_formItemId}_${
    //       index + 1
    //     }" class="btn remove glyphicon glyphicon-trash" onclick="Table_Del_Row(event)" style="font-size: 16px; line-height: inherit;"></span>
    //       <span id="Edit_Row_${_formItemId}_${
    //       index + 1
    //     }" class="btn glyphicon glyphicon-edit" onclick="Table_Edit_Row(event)" style="font-size: 17px; line-height: normal;"></span>
    //     `;
    //     tr.appendChild(controlTd);

    //     // Append the row to the table body
    //     table.appendChild(tr);
    //   });
    // }

    let itemContent = `<div class="form-group" style="${
      itemObj.Visibility == "false" || itemObj.Visibility == "DefaultHidden"
        ? "display:none"
        : ""
    }" 
        id="form-group-${_formItemId}">
        <div style="position : relative;"> 
        <label class="form-item-lbl">${itemObj.Label}</label>
        <table id="form-item-${_formItemId}" class="table table-bordered table-hover" style="margin-bottom: 5px;text-align: center;border: 1px solid #ddd !important;
        border-radius: 5px !important;background-color: white;border-radius: 3px !important;border-collapse: separate;overflow: hidden;" >
        <thead>
        <tr>
        <th scope="col"  style="width:80px;font-size: 12px;margin-bottom: 5px;text-align:center;border-bottom: 1px solid #ddd !important">Row</th>
        <th scope="col"  style="display:none">RowID</th>`;
    //Thead

    let ShowInListIndex = "";
    for (let i in Columns) {
      if (Columns[i].ShowInList == "True") {
        itemContent += `<th ${disableFormItem}  onclick="nofliter(event)" class="filterable" scope="col" style="margin-bottom: 5px;text-align:center;font-size: 12px;border-bottom: 1px solid #ddd !important;width: ${
          Columns[i].ColWidth
        };height: ${Columns[i].ColHeight}; cursor: pointer;" id=${
          Columns[i].SubTableID
        }><i onclick="addSortFunctionality('form-item-${_formItemId}',event)" class="fa-light fa-sort" style="margin:0 5px;display:none !important;"></i> ${Columns[
          i
        ].Label.replaceAll(
          "GetDate",
          "Log Date"
        )}<i id="filter-icon" onclick="initialize('form-item-${_formItemId}')" class="fa-regular fa-filter-list" style="margin:0 5px;"></i></th>`;
      } else {
        ShowInListIndex += i + ",";
      }
    }
    if (!itemObj.IsReadOnly)
      itemContent += `<th scope="col" style="min-width: 100px;font-size: 12px;border-bottom: 1px solid #ddd !important;"> </th>`;

    itemContent += `</tr>
    </thead>`;
    itemContent += `<div id="filter-options"></div>`;
    //Tbody

    let _DefaultObj = {
      ID: "form-item-" + _formItemId,
      Rows: [],
    };

    let _CurrentObj = "";

    _CurrentObj = getDefaultValue(itemObj);

    if (_CurrentObj.length) {
      _DefaultObj.Rows = _CurrentObj == "NULL" ? [] : _CurrentObj;
    } else if (typeof _CurrentObj != "string") {
      if (
        _CurrentObj != "NULL" &&
        _CurrentObj != "" &&
        _CurrentObj != "undefined"
      ) {
        //is object bpms
        if (_CurrentObj.Rows.length) _DefaultObj.Rows = _CurrentObj.Rows;
      }
    }

    let index = $TableData.findIndex((x) => x.ID === _DefaultObj.ID);

    if (index > -1) $TableData.splice(index, 1);

    $TableData.push(_DefaultObj);

    let _Rows = [];

    _Rows = _DefaultObj.Rows != "NULL" ? _DefaultObj.Rows : [];

    if (_Rows.length) {
      itemContent += `<tbody id="tbody_${_formItemId}">`;
      for (let i = 0; i < _Rows.length; i++) {
        let values = Object.values(_Rows[i]);

        itemContent += `<tr><td class="text-center" style="vertical-align: middle !important;direction: ltr;font-size: 12px;margin-bottom: 5px;text-align:center;font-size: 12px;border: 0px;border-bottom: 1px solid">${
          i + 1
        }</td>`;

        itemContent += `<td isInstance='true' class="text-center" style="display:none">${values[0]}</td>`;
        $.ajax({
          type: "POST",
          url: "../../App_Sys/Services/EditActivity.asmx/GetEntityDetailsForModal",
          data: JSON.stringify({
            formItemID: itemObj.FormItemID,
            pexID: parseInt(values[0]),
          }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          async: false,
          success: function (response) {
            let parsedData = JSON.parse(response.d);
            let splitValues = parsedData[0].FullData.split("-");
            itemContent;
            for (let i = 1; i < splitValues.length; i++) {
              itemContent += `<td class="text-center" style="vertical-align: middle !important; direction: ltr; text-align: center; font-size: 12px; border: 0px; border-bottom: 1px solid">
                          ${splitValues[i]}</td>`;
            }
          },
          error: function (error) {
            console.error("Error fetching entity details:", error);
          },
        });
        if (!itemObj.IsReadOnly) {
          itemContent += `<td class="text-center" style="vertical-align: middle !important;border-bottom:1px solid;border-top: 0px;font-size: 14px;border: 0px; border-bottom: 1px solid"> 
         <span id="Del_Row_${
           values[0].split("_")[1]
         }" class="btn remove glyphicon glyphicon-trash" onclick="Table_Del_Row(event)" style="font-size: 16px;line-height: inherit;"></span> 
          </td></tr>`;
        }
      }

      itemContent += `</tbody >`;
    } else {
      itemContent += `<tbody id="tbody_${_formItemId}"></tbody>`;
    }

    //Footer

    //whith csv span

    // itemContent += `<tfoot>
    // <tr><td id="AddRow_${_formItemId}" style="${
    //   itemObj.IsReadOnly === true ? "" : "cursor: pointer;"
    // } ;"><img style="pointer-events: none; ${
    //   itemObj.IsReadOnly === true ? "opacity: 0;" : ""
    // }" src="App_Base/Js/MxGraph/src/images/plus.png"/></td><td colspan="${
    //   Columns.length + 1
    // }" style="background-color: whitesmoke;" >
    //     <span style="width: 100%;display: inline-flex;align-items: center;position: relative;${
    //       itemObj.IsReadOnly === true ? "opacity: 0;" : ""
    //     }">
    //      <span style="position: absolute;left: -8px;top: -21px;">
    //        <label for="file-upload-${_formItemId}" style="
    //          padding-right: 40px;
    //          width: 100px;
    //           ;
    //          height: 36px;
    //          display: inline-flex;
    //          align-items: center;
    //          cursor: pointer;
    //          font-size: 12px;
    //          ">
    //          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAExUlEQVR4nO2aW4gcRRSGyxsIKt6iRiXigyiiJuBMn9MJixNFBOODKMx01WTDynrLkw8+6IPg6otGBFGIknW26/SsirJeooiPRkxAVEy8LIJgHlyUSKKI1yiuzsrpi9sz3TPbbnpm2u45ULDdU12Xr/5Tp/r0CjGykY1sZCMbWSJThEuDKlLDYalxt0W4WRQRgAqKxpYk2CGWxHHFBEBBgQeLDUBjS9qgMgVA9MmqZKyt6bKhNDylCP5YhgBHlWOCyDuAsNUJbm/fHPGQpcvrRFEAVKdLp0fdAQ6Mz64/RRQBgJwxyrFhkuCt6lz1BJF3AIrw8W4boxse8wygSsZaSfBzr+hQJ7xN5BWAJHh1pfAoCf+sO3CtyCMAZeOYJHyTzwA9IWj8frxhXpLLPYCtZsMGRfCS0vBXDyV8Xt1ZOVXkEUBgvMpSA3UDIQkaIs8AArOaeLkknIs9LjvGFSLvAAKra7hZavy1Y1xPiKIAYJNkbO8Y1yeiUAAaeF7HuH7sW2dq0K/AqywjAP0ylYHV/d8oQBJ8yYeTtoRGe/lNEc4rjQuKYHE5lMFRqeEHqeH39vqw6N5f4d1g6ACkhg84TgfP1F8YO1MSPNlWT+Nj4ff5arN0kSLc6/826/al4e6Odp/n+1LDZHYBaFzgBIZbd7q0hicWPCs1vOhNBN91J90wz5IEN6mmsbEyVTlRanzPX+kjU1PieIvw4nDbFsE2rx3cnVkAkoztXI8HGzqu2orwoZAruAcVSbgr9Ox8+HgrbUS/zhc+2BaHuwmqnKwIfsksAEuX1/HqKY3f9tgb9nGO3011eUnPZf//V+74sNuf+7uriv0uWAdvzPAmCIs8sa3Plc5P4Co7eTW5zdpM+UpJ+GEHgI88ALjFv/cIX0uCpzMPYHx247lJBqk0HLQ0WtyuJ21/E/Qlz9kg3ijZdeqOcY0PZCEB3NaQAOASb1zeQOFgIgjee/yc+4xtVtpVAJP+pF+7a7p0kpcTSNTerqEBkIT3+IPeEmx6UsMrHNrCSlGEb4cmepif2TpTvqyjvZf5fhBSFeEDK/cPX03ObDpteAA0HtrWNM7muhO04Yz2MIh7fOm/wde8otLGcatpXMrXnNzsaOsnXvnlvuH9laRft83rvbagymXgAJQ38I/DSQk/3jdCdfbWtHl1uF2p4TqO/51tBclODoGS8O8k0q/aY+d4bcER/nvgAJS/Gn4Mn+92FOZEJn/h6RUy+bic5Pgbln44UxTsL4MHQAMsGluWAze4k3fMWkRFabqCGvZk41f/GXds06U1vKHGuMZ37EK5BCC7SD8Gwut9ASAyYnHS74srqAwC6Cb9vriCyiCAXtJP3RVUxgAkkX6qrqAyBCCp9FN1BZUhAP9F+qm5gsoIgNVIPxVXUBkAsFrpp+IKKgMAjkX6x+wKKgMAepnS8E3MJL9OrwPKNgBJ8FlkpTV8WhgASsM7EQVo3JNeB5SO76VZwhtZ3H+VcUou1wDqfhrMB9CIcYFncw1Aabw3BGBHjAIezTUAqYGC8dU13h/5neA+URSThHdGFWLeIYpidY23RhTgGLeIophFuDmiANusiKKYdHB9JEpo8ypRFKs65oURF5jZdIEoik14X5nbAASf4bvZP0yfwV4PoNkFAAAAAElFTkSuQmCC"
    //          style="width: 23px;">
    //        </label>
    //        <input id="file-upload-${_formItemId}" type="file" accept=".csv" style="display: none;">
    //      </span>
    //    </span>

    // </td></tr>
    // </tfoot>
    // </table></div>`;

    //without csv span
    itemContent += `<tfoot>
    <tr>`;

    if (!itemObj.IsReadOnly) {
      itemContent += `<td id="AddElementRow_${_formItemId}" 
      style="cursor: pointer;overflow-wrap: anywhere;text-align: center;border: 0px;"><img style="pointer-events: none;" src="App_Base/Js/MxGraph/src/images/paste.png"/></td>`;
      itemContent += `<td colspan="${
        Columns.length + 1
      }" style="background-color: whitesmoke;overflow-wrap: anywhere;text-align: center;border: 0px;" >
    </td>`;
    }

    itemContent += `</tr>
    </tfoot>
    </table></div>`;

    itemContent += `</div>`;

    $(parentID).append(itemContent);

    // Add row
    if (!Readonly)
      $("#AddElementRow_" + _formItemId).on("click", (e) =>
        Add_Edit_Entity_Row(e.target, "Add")
      );

    // Bind the file input change event
    $(document).on("change", `#file-upload-${_formItemId}`, function (event) {
      // importCsv(event);
      $(this).val("");
    });

    this.Table_Del_Row = function (e) {
      let _tbody = $(e.target).parents().eq(2).attr("id");

      $(e.target).parent().parent().remove();

      //row sorted
      let rows = $(`#` + _tbody + " tr");
      for (let i = 0; i < rows.length; i++) {
        $(rows[i])
          .children()
          .eq(0)
          .text(i + 1);
      }

      let _obj = {
        ID: "form-item-" + _tbody.split("_")[1],
        Rows: [],
      };

      let tbl = $TableData.filter((x) => x.ID == _obj.ID);

      const RowID = e.target.id.replaceAll("Del_Row_", "RowID_");

      if (tbl.length > 0) _obj = tbl[0];

      let index = _obj.Rows.findIndex((x) => Object.values(x)[0] === RowID);

      if (index > -1) _obj.Rows.splice(index, 1);

      index = $TableData.findIndex((x) => x.ID === _obj.ID);

      if (index > -1) $TableData.splice(index, 1);

      $TableData.push(_obj);
    };

    this.Table_Edit_Row = function (e) {
      const RowID = e.target.id.split("_")[2];
      const _formItemId = $(e.target).parents().eq(2).attr("id").split("_")[1];
      Add_Edit_Entity_Row(_formItemId, RowID, "Edit");
    };

    function Add_Edit_Entity_Row(RowID, mode) {
      //Form Modal
      let FileBrowseID = [];
      let div =
        '<div id="Modal" class="modal" >' +
        '<div id="modalform" class="modal-content" style="width: 785px !important;height: auto;inset: 40px 0px 0px;margin: auto;">' +
        "</div></div>";
      $("#content").append(div);

      $("#Modal").css("display", "block");
      $("#modalform").css("width", "800px");

      let item = "";

      //Title
      item += `<div id="Title"  style="font-weight: 600px;font-size:14px;font-family: 'IRANSansWeb';font-weight: 600;background-color:#00A300
           ;color: white; padding: 8px;"><span class="fa fa-plus" style="padding: 5px 0px;"></span> ${
             mode == "Add"
               ? $$Lang == "Fa"
                 ? "افزودن سطر جدید"
                 : "Add New Row"
               : $$Lang == "Fa"
               ? "ویرایش سطر"
               : "Edit Row"
           }</div>`;
      // item += `<hr style="margin-bottom:10px;border-Top:2px solid #ccc;margin:5px">`;

      // Main
      item += `<div id="modalContent" style="overflow: auto;padding:0px 20px 10px 20px;max-height:730px;width: 800px;">`;

      // Create Element
      const _formID = itemObj.FormID;

      const _formItemId =
        mode == "Add"
          ? $(RowID).attr("id").replaceAll("AddRow_", "")
          : $(RowID).parent().attr("id").replaceAll("tbody_", "");

      // Create a container for the labels and inputs
      item += `<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; box-sizing: border-box;">`;

      let value = "";
      let tableFile = "";

      //for (let i = 0; i < Columns.length; i++) {
      // Create a wrapper for each label and input pair
      item += `<div style="flex: 0 1 calc(100% - 20px); box-sizing: border-box;" class="StaticHidden">`; // Ensure width is strictly 33.33%
      item += `<label class="lblPopup lbl" style="display: block; width: auto; margin-top: 15px; font-family: 'IRANSansWeb'; padding: 0; margin-bottom: 10px !important;">
              Tables Data
               </label>`;

      item += `<div class="input-group" data-enabletimepicke="true" style="width: 100%; max-width: 223px;">${EntityElements(
        itemObj,
        "Enum",
        0,
        value,
        1,
        1
      )}</div>`;
      item += `</div>`; // Close the wrapper div

      item += `</div>`; // Close the flex container

      //Btn
      item += `<div style="border-top: 1px solid #ccc;padding-top: 5px;margin-top:45px;margin-bottom:10px">
            <button id="btnPopupAddEntity-Edit" class="btn btn-primary btn_submint_exit btn-form-submit" style="font:14px IRANSansWeb;width:90px;height:35px;margin-top: 5px;" >${
              $$Lang == "Fa" ? "ذخیره" : "Save"
            }</button>
            <button id="btnPopupClose" class="btn btn-light btn_submint_exit"  style="margin:0px 5px;font:14px IRANSansWeb;height:35px;margin-top: 5px;">${
              $$Lang == "Fa" ? "لغو" : "Cancel"
            }</button>
            </div></div>`;
      $(`#modalform`).append(item);

      $('[type="text"]').inputmask();
      EnableMdDateTimePickers();
      //Insert Data for Edit
      $(`#btnPopupAddEntity-Edit`).on("click", async () => {
        if (mode == "Add") {
          var formItemIdSelector = _formItemId.split("_");

          var idNumber = formItemIdSelector[1];
          let _row = `<tr><td style="vertical-align: middle !important;">${
            $(`#tbody_` + idNumber + " tr").length + 1
          }</td>`;

          let IsRequired = true;
          let value = $("#item0 option:selected").text();
          let instanceId = $("#item0 option:selected").val();

          var resultValue = value.split("-");
          _row += `<td isInstance='true' style='display:none'>${instanceId}</td>`;

          for (let i = 0; i < Columns.length; i++) {
            if (Columns[i].InputType != "System") {
              _row +=
                `<td class="text-center" style="vertical-align: middle !important; overflow-wrap: anywhere; direction:
                            ltr;text-align:center;font-size: 12px;">` +
                resultValue[i + 1] +
                `</td>`;
            }
          }
          if (IsRequired) {
            //btn delete and edite in row
            if (!Readonly) {
              let LocalID = $(`#tbody_` + idNumber + " tr").length + 1;
              _row += `<td class="text-center" style="vertical-align: middle !important; overflow-wrap: anywhere; text-align: center;direction: ltr;display: flex;text-align:center;">
                              <span id="Del_Row${_formItemId}_${LocalID}" class="btn remove glyphicon glyphicon-trash" onclick="Table_Del_Row(event)"  style="font-size: 16px;line-height: inherit;" ></span>
                              
                                </td></tr>`;
            }
            var filterFormItemId = _formItemId.split("_");
            var formItemNumberId = parseInt(filterFormItemId[1]);

            $(`#tbody_` + formItemNumberId).append(_row);
            $(`#Modal`).remove();
          }
        } else if (mode == "Edit") {
          let _rowCilds = $(RowID).children();

          let IsRequired = true;

          for (let i = 0; i < _rowCilds.length - 1; i++) {
            let _type = $(`#item` + i).attr("type");

            if (_type == "checkbox") {
              let _checked = $(`#item` + i).prop("checked") ? "checked" : "";
              $(_rowCilds[i + 1])
                .html(`<div class="icheckbox_square-green ${_checked}" style="position: relative;"><input type="checkbox" class="grid-checkbox " style="opacity: 0;">
                </div>`);
            } else {
              if (_type == "file") {
                //todo edit

                let _fileName = "";

                var _data = new FormData();

                var files = "";

                files = $("#item" + i).get(0).files;

                if (files) {
                  if (files.length > 0) {
                    _data.append("file" + i, files[0]);
                    _fileName = files[0];

                    $.ajax({
                      type: "POST",

                      url: "App_Sys/Services/EditActivity.asmx/SaveFile",

                      data: _data,

                      contentType: false,

                      dataType: "xml",

                      async: false,

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

                        _fileName =
                          data.getElementsByTagName("string")[0].childNodes[0]
                            .nodeValue;

                        $(_rowCilds[i + 1]).html(
                          `<td class="text-center" style="vertical-align: middle !important; overflow-wrap: anywhere; text-align: center;direction: ltr;;font-size: 12px;">` +
                            _fileName +
                            `</td>`
                        );

                        var requestToken;

                        setRequestToken(requestToken);
                      },
                    });
                  } else {
                    $(_rowCilds[i + 1]).html(
                      `<td class="text-center" style="vertical-align: middle !important; overflow-wrap: anywhere; text-align: center;direction: ltr;font-size: 12px;">` +
                        _fileName +
                        `</td>`
                    );
                  }
                }
              } else if (_type == "Enum") {
                let _EnumTypes;
                let _Label = "";
                $.ajax({
                  type: "POST",

                  url: "../../App_Sys/Services/Admin/Process.asmx/GetEnumTypesbyEnumID",

                  data:
                    '{"id":"' +
                    $(`#item` + i).val() +
                    // '","responseToken":"' +
                    // genResponseToken() +
                    '"}',

                  contentType: "application/json; charset=utf-8",

                  dataType: "json",

                  async: false,

                  error: function (jqXHR, textStatus, errorThrown) {
                    alert(JSON.stringify(jqXHR));
                  },
                  success: function (data) {
                    data = data.d;
                    _EnumTypes = jQuery.parseJSON(data);
                    if (_EnumTypes.length > 0) _Label = _EnumTypes[0].Label;
                    setRequestToken(_EnumTypes.requestToken);
                  },
                });
                $(_rowCilds[i + 1]).html(_Label);
                // } else if (Columns[i].InputType == "System") {
              } else {
                if (
                  $(`#item` + i).val() == "" &&
                  Columns[i].Nullable == "False"
                ) {
                  IsRequired = false;
                  $(`#item` + i).css("border-color", "red");
                  break;
                } else {
                  $(`#item` + i).css("border-color", "#d2d6de");
                  $(_rowCilds[i + 1]).html($(`#item` + i).val());
                }
              }
            }
          }

          if (IsRequired) {
            $(`#Modal`).remove();
          }
        }
      });

      $(`#btnPopupClose`).on("click", () => {
        $(`.popover`).remove();
        $(`#Modal`).remove();
      });

      $("#modalContent select").select2();
    }

    function EntityElements(
      itemObj,
      type,
      count,
      value = "",
      EnumTypeID,
      EntityTypeID
    ) {
      let _Options = "";
      $.ajax({
        type: "POST",
        url: "../../App_Sys/Services/EditActivity.asmx/GetEntityDetails",
        data: JSON.stringify({ formItemID: itemObj.FormItemID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
          let parsedData = JSON.parse(response.d);
          _Options = parsedData
            .map(
              (dataItem) =>
                `<option value="${dataItem.ProecssInstanceId}">${dataItem.FullData}</option>`
            )
            .join("");

          $(`#item${count}`).html(_Options);
        },
        error: function (error) {
          console.error("Error fetching entity details:", error);
        },
      });

      return `<div class="input-group">
        <div class="input-group-addon"><span class="glyphicon glyphicon-check"></span></div>
        <select type="Enum" style="font-family: 'IRANSansWeb' !important;width: 300px !important" class="form-control form-input" id="item${count}">
            ${_Options}
        </select>
    </div>`;
    }

    //Facility show
    if ($(`#radio-0`).is(":checked")) {
      $(`#form-group-${_formItemId}`).show();
    }
  };

  var getDefaultValue = function (itemObj) {
    let defaultValue;

    if (_data) {
      if (itemObj.DataName.indexOf("Setting") == -1) {
        defaultValue = _data[itemObj.DataName];
      } else {
        defaultValue = _data[itemObj.Name];
      }
    }

    if (defaultValue == "" || defaultValue === undefined) {
      if (
        itemObj.Name == _parObjType ||
        itemObj.Name == "Parent_" + _parObjType
      ) {
        defaultValue = JSON.stringify(_parObjKey);

        //Sepad Compatibility
        if (_parObjType == "CallID") {
          defaultValue = JSON.stringify(_objKeys[0]);
        }

        defaultValue = jQuery.parseJSON(defaultValue);
      } else {
        defaultValue = itemObj.DefaultValue;
      }
    }
    if (itemObj.AttributeTypeName == "TreeBox") {
      return defaultValue;
    }
    if (itemObj.AttributeTypeName == "ShortTime") {
      //DateTime and Time have same AttributeTypeName
      //Use Input type to choose correct type
      if (itemObj.DefaultValue == "CurrentDateTime") {
        defaultValue = getTime();
      }
    }

    if (itemObj.AttributeTypeName == "DateTime") {
      if (itemObj.DefaultValue == "CurrentDateTime")
        defaultValue = `${getDate()} ${getTime()}`;
    }
    if (itemObj.AttributeTypeName == "Date") {
      if (itemObj.DefaultValue == "CurrentDateTime") {
        defaultValue = getDate();
      }
    }
    //Returns Current Time in hh:mm format
    function getTime() {
      let now = new Date();
      let hours = now.getHours().toString().padStart(2, "0"); // Ensure hours are always two digits
      let minutes = now.getMinutes().toString().padStart(2, "0"); // Ensure minutes are always two digits
      return `${hours}:${minutes}`;
    }
    //Returns Current Date in yy/mm/dd format
    function getDate() {
      let today = new Date().toLocaleDateString("fa-IR");
      return convertFarsiToEnglish(today);
    }
    //Convert farsi numbers to english
    function convertFarsiToEnglish(farsiNum) {
      // Define a mapping from Farsi digits to English digits
      const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
      const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

      // Create a regular expression to match Farsi digits
      const farsiDigitRegex = /[۰-۹]/g;

      // Replace each Farsi digit with the corresponding English digit
      let englishNum = farsiNum.replace(farsiDigitRegex, (match) => {
        return englishDigits[farsiDigits.indexOf(match)];
      });

      // Split the date into year, month, and day parts
      let parts = englishNum.split("/");

      // Ensure two digits for month and day
      let formattedDate =
        parts[0] +
        "/" +
        ("0" + parts[1]).slice(-2) +
        "/" +
        ("0" + parts[2]).slice(-2);

      return formattedDate;
    }

    if (!isNaN(defaultValue)) {
      defaultValue = defaultValue.toString();
    }

    defaultValue = $.trim(defaultValue);

    if (itemObj.AttributeTypeName == "Mobile") {
      if (defaultValue != "") defaultValue = "0" + defaultValue;
    }

    $$PageParams[itemObj.Name] = defaultValue;

    if (itemObj.AttributeTypeName == "LongTime" && defaultValue == "") {
      defaultValue = "000:00";
    }

    if (defaultValue == "") defaultValue = itemObj.DefaultValue;

    return htmlDecode(defaultValue);
  };

  function htmlDecode(value) {
    let _value = $("<textarea/>").html(value).text();
    try {
      //is Object
      if (_value.includes("[") && _value.includes("]")) {
        _value = _value.replaceAll("‚", ",");

        return JSON.parse(_value);
      } else {
        return _value;
      }
    } catch {
      return _value;
    }
  }
}

function nofliter(event) {
  event.preventDefault();
}

const icon = document.getElementById("filter-icon");

function initialize(tableId) {
  const table = document.getElementById(tableId);
  const filterOptionsDiv = document.getElementById("filter-options");
  if (!table || !filterOptionsDiv) {
    console.error("Table or filter options div not found");
    return;
  }
  const filters = {};

  function getUniqueValues(columnIndex) {
    const rows = table.querySelectorAll("tbody tr");
    const values = new Set();
    rows.forEach((row) => {
      if (row.cells[columnIndex]) {
        values.add(row.cells[columnIndex].innerText.trim());
      }
    });
    return Array.from(values);
  }

  function createFilterOptions(values, columnIndex) {
    filterOptionsDiv.innerHTML = "";
    values.forEach((value) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = value;
      checkbox.id = `filter-${columnIndex}-${value}`;

      // Ensure that the checkbox is checked by default
      checkbox.checked = filters[columnIndex]
        ? filters[columnIndex].includes(value)
        : true;

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.innerText = value;
      filterOptionsDiv.appendChild(checkbox);
      filterOptionsDiv.appendChild(label);
      filterOptionsDiv.appendChild(document.createElement("br"));
    });
    const divbutton = document.createElement("div");
    divbutton.id = "divbutton";
    const submitButton = document.createElement("button");
    submitButton.innerText = $$Lang == "Fa" ? "تایید" : "Submit";
    submitButton.addEventListener("click", () => {
      applyFilters();
      saveFilterState();
      filterOptionsDiv.style.display = "none"; // Hide filter options after applying
    });
    const cancelButton = document.createElement("button");
    cancelButton.innerText = $$Lang == "Fa" ? "لغو" : "Cancel";
    cancelButton.addEventListener("click", () => {
      filterOptionsDiv.style.display = "none"; // Hide filter options
    });
    divbutton.appendChild(submitButton);
    divbutton.appendChild(cancelButton);

    filterOptionsDiv.appendChild(divbutton);

    // Position the filterOptionsDiv below the clicked column
    const headerCell = table.querySelector(
      `thead th:nth-child(${parseInt(columnIndex) + 1})`
    );
    const rect = headerCell.getBoundingClientRect();

    // Adjust the left position here by adding an offset
    const offset = 555.953125; // Adjust this value to your preference
    const see = rect.left - offset;
    filterOptionsDiv.style.left = `${rect.left - offset}px`;

    filterOptionsDiv.style.display = "block";
    filterOptionsDiv.setAttribute("data-column-index", columnIndex);
  }

  function applyFilters() {
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      let show = true;
      for (const [columnIndex, values] of Object.entries(filters)) {
        if (row.cells[columnIndex]) {
          const cellValue = row.cells[columnIndex].innerText.trim();
          if (!values.includes(cellValue)) {
            show = false;
            break;
          }
        }
      }
      row.style.display = show ? "" : "none";
    });
  }

  function saveFilterState() {
    localStorage.setItem("filters", JSON.stringify(filters));
  }

  function loadFilterState() {
    const savedFilters = JSON.parse(localStorage.getItem("filters"));
    if (savedFilters) {
      Object.assign(filters, savedFilters);
    }
  }

  loadFilterState();
  applyFilters();
  table.querySelectorAll("thead th").forEach((th, index) => {
    th.addEventListener("click", () => {
      const columnIndex = index;
      const uniqueValues = getUniqueValues(columnIndex);
      createFilterOptions(uniqueValues, columnIndex);
      filterOptionsDiv.removeEventListener("change", onFilterOptionsChange);
      filterOptionsDiv.addEventListener("change", onFilterOptionsChange);
    });
  });

  function onFilterOptionsChange() {
    const columnIndex = filterOptionsDiv.getAttribute("data-column-index");
    const checkedValues = Array.from(
      filterOptionsDiv.querySelectorAll("input:checked")
    ).map((checkbox) => checkbox.value.trim());
    filters[columnIndex] = checkedValues;
  }
}

function addSortFunctionality(tableId, event) {
  event.preventDefault();
  const table = document.getElementById(tableId);
  if (!table) {
    console.error("Table not found.");
    return;
  }
  const tbody = table.querySelector("tbody");
  const headers = table.querySelectorAll("thead th");
  headers.forEach((header, index) => {
    header.addEventListener("click", () => {
      sortTable(tableId, index, event);
    });
  });
  function sortTable(tableId, columnIndex, event) {
    event.preventDefault();
    const table = document.getElementById(tableId);
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const headers = table.querySelectorAll("thead th");
    if (rows.length === 0) return;
    const isNumeric = !isNaN(rows[0].cells[columnIndex].innerText.trim());
    const sortOrder = headers[columnIndex].classList.contains("asc")
      ? "desc"
      : "asc";
    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].innerText.trim();
      const cellB = rowB.cells[columnIndex].innerText.trim();
      if (isNumeric) {
        return sortOrder === "asc"
          ? Number(cellA) - Number(cellB)
          : Number(cellB) - Number(cellA);
      } else {
        return sortOrder === "asc"
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    rows.forEach((row) => tbody.appendChild(row));

    headers.forEach((header) => header.classList.remove("asc", "desc"));
    headers[columnIndex].classList.add(sortOrder);
  }
}

function triggerDefaultEvent(target, defValue) {
  var _isChecked = defValue;

  $.each(
    jQuery.parseJSON($$FormItems[target].ActionOnChange),
    function (index, event) {
      if (event.value.indexOf("[" + _isChecked + "]") != -1) {
        $.each(event.actions, function (index, action) {
          const targetItems = Array.isArray(action.target)
            ? action.target
            : [action.target];
          targetItems.forEach((itemName) => {
            if (action.targetType == "FormItem") {
              if (action.actionType == "Hide") {
                $("#form-group-" + $$FormItems[itemName].FormItemID).css(
                  "display",
                  "none"
                );
              }

              if (action.actionType == "Show") {
                $("#form-group-" + $$FormItems[itemName].FormItemID).css(
                  "display",
                  "block"
                );
              }

              if (action.actionType == "Disable") {
                $("#form-group-" + $$FormItems[itemName].FormItemID).prop(
                  "disabled",
                  true
                );
                $("#form-group-" + $$FormItems[itemName].FormItemID)
                  .find("*")
                  .prop("disabled", true);
              }

              if (action.actionType == "Enable") {
                $("#form-group-" + $$FormItems[itemName].FormItemID).prop(
                  "disabled",
                  false
                );
                $("#form-group-" + $$FormItems[itemName].FormItemID)
                  .find("*")
                  .prop("disabled", false);
              }
            }
          });
          targetItems.forEach((itemName) => {
            if (action.targetType == "FormGroupBox") {
              if (action.actionType == "Hide") {
                $("#form-group-" + $$FormGroups[itemName]).css(
                  "display",
                  "none"
                );
              }

              if (action.actionType == "Show") {
                $("#form-group-" + $$FormGroups[itemName]).css(
                  "display",
                  "block"
                );
              }
            }
          });
        });
      }
    }
  );
}

function $fi(target) {
  return $("#form-item-" + $$FormItems[target].FormItemID);
}

function $fig(target) {
  return $("#form-group-" + $$FormItems[target].FormItemID);
}

function $gfi(target) {
  if ($$FormItems[target].InputType != "CheckBox") {
    return $("#form-item-" + $$FormItems[target].FormItemID).val();
  } else {
    return $gcfi(target);
  }
}

function $sfi(target, val) {
  $("#form-item-" + $$FormItems[target].FormItemID).val(val);
}

function $sfiCss(target, name, val) {
  $("#form-group-" + $$FormItems[target].FormItemID).css(name, val);
}

function $gcfi(target) {
  if ($("#form-item-" + $$FormItems[target].FormItemID).is(":checked")) {
    return 1;
  } else {
    return 0;
  }
}

function $activityParams(targets) {
  var activiyParams = new Array();

  $.each(targets, function (index, target) {
    activiyParams.push({
      ParamIndex: 0,
      ParamName: target,
      ParamValue: $gfi(target),
      FileIsExist: 2,
      FileAttachCode: "",
    });
  });

  return activiyParams;
}

function localize(value) {
  if ($$Lang != "Fa") {
    //En, Ar, ...

    switch (value) {
      case "اختیاری":
        return "Optional";
    }
  }

  return value;
}

function isCanvasBlank(canvas) {
  canvas = canvas.get(0);

  try {
    const context = canvas.getContext("2d");

    const pixelBuffer = new Uint32Array(
      context.getImageData(
        0,
        0,
        canvas.width - 200,
        canvas.height - 100
      ).data.buffer
    );
    return !pixelBuffer.some((color) => color !== 0);
  } catch {
    return false;
  }
}

function $fiToggle(target, s, e) {
  if ($fig(target + "_" + s).css("display") == "none") {
    $fig(target + "_" + s).css("display", "block");
  } else {
    for (i = s; i <= e; i++) {
      if ($fig(target + "_" + i).css("display") == "block") {
        $fig(target + "_" + i).css("display", "none");

        $fi(target + "_" + i).selectpicker("val", null);

        $fig(target + "_" + i)
          .find(".input-group-addon")
          .find(">:first-child")
          .removeClass("glyphicon-minus");

        $fig(target + "_" + i)
          .find(".input-group-addon")
          .find(">:first-child")
          .addClass("glyphicon-plus");
      }
    }
  }
}

function callExtSrv(serviceID, param1, param2, param3, param4, param5) {
  var data = new FormData();

  data.append("serviceID", serviceID);

  data.append("param1", param1);
  data.append("param2", param2);
  data.append("param3", param3);
  data.append("param4", param4);
  data.append("param5", param5);

  if (serviceID == 101) {
    var regex = new RegExp("^(\\+98|0)?9\\d{9}$");
    var result = regex.test(param1);

    if (!result) {
      alert("شماره موبایل نامعتبر است");
      return;
    }
  }

  var $esExecutor = new esExecutor(data);

  $esExecutor.submit();
}

function getLocalDatetime() {
  const d = new Date();

  return (
    fixNumbers(new Intl.DateTimeFormat("fa-IR").format(d)) +
    " " +
    fixNumbers2(d.getHours()) +
    ":" +
    fixNumbers2(d.getMinutes())
  );
}

var persianNumbers = [
  /۰/g,
  /۱/g,
  /۲/g,
  /۳/g,
  /۴/g,
  /۵/g,
  /۶/g,
  /۷/g,
  /۸/g,
  /۹/g,
];

var arabicNumbers = [
  /٠/g,
  /١/g,
  /٢/g,
  /٣/g,
  /٤/g,
  /٥/g,
  /٦/g,
  /٧/g,
  /٨/g,
  /٩/g,
];

function fixNumbers(str) {
  if (typeof str === "string") {
    for (var i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
  }

  str = str.replace("/1", "/01");
  str = str.replace("/010", "/10");
  str = str.replace("/011", "/11");
  str = str.replace("/012", "/12");
  str = str.replace("/013", "/13");
  str = str.replace("/014", "/14");
  str = str.replace("/015", "/15");
  str = str.replace("/016", "/16");
  str = str.replace("/017", "/17");
  str = str.replace("/018", "/18");
  str = str.replace("/019", "/19");
  str = str.replace("/2", "/02");
  str = str.replace("/020", "/20");
  str = str.replace("/021", "/21");
  str = str.replace("/022", "/22");
  str = str.replace("/023", "/23");
  str = str.replace("/024", "/24");
  str = str.replace("/025", "/25");
  str = str.replace("/026", "/26");
  str = str.replace("/027", "/27");
  str = str.replace("/028", "/28");
  str = str.replace("/029", "/29");
  str = str.replace("/3", "/03");
  str = str.replace("/030", "/30");
  str = str.replace("/031", "/31");
  str = str.replace("/4", "/04");
  str = str.replace("/5", "/05");
  str = str.replace("/6", "/06");
  str = str.replace("/7", "/07");
  str = str.replace("/8", "/08");
  str = str.replace("/9", "/09");

  return str;
}

function fixNumbers2(str) {
  if (str == "0") return "00";
  if (str == "1") return "01";
  if (str == "2") return "02";
  if (str == "3") return "03";
  if (str == "4") return "04";
  if (str == "5") return "05";
  if (str == "6") return "06";
  if (str == "7") return "07";
  if (str == "8") return "08";
  if (str == "9") return "09";
  return str;
}

function FormItemDisabled(parentID) {
  var parentId = parentID;
  var extractedId = parentId.split("-")[3];
  var summaryDsiableTitle = $(
    "#form-group-" + extractedId + " .group-info .group-title"
  ).text();
  var disableFormItem = "";
  if (summaryDsiableTitle === "خلاصه درخواست") {
    disableFormItem = "disabled";
  }

  return disableFormItem;
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    if ($(`#btnPopupClose`)) {
      $(`#btnPopupClose`).click();
    } else if ($(`#actContextModal1`).css("display") == "block") {
      $(`#closeBtnModal1`).click();
    }

    if ($(`.popupEnterNewTrack`).css("display") == "block") {
      $(`#closeManualTrack`).click();
    } else if ($(`.overlayUserTracksPopup`).css("display") == "block") {
      $(`.closeUserTracksPopup`).click();
    } else if ($(`.overlayOverTimeForm`).css("display") == "block") {
      $(`#closeOverTime`).click();
    } else if ($(`.overlayTable`).css("display") == "block") {
      $(`.closePopupCalendar`).click();
    }
  }
});
