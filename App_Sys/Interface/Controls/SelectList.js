// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
/* Release Ferdos.WebAppDesk 4.1.0.0*/

function selectList(actionControlID, enumTypeID) {
  var _actionControlID = actionControlID;

  var _enumTypeID = enumTypeID;

  var _selectOptions;

  var _selectID;

  var _activityID;

  var _actionOnChange = "";

  var _filterIndex;

  this.renderContext = function (
    selectID,
    multipleAllow,
    activityID,
    isRequired,
    actionOnChange,
    defaultValue,
    filterValue1,
    filterValue2,
    desc,
    filterIndex
  ) {
    _selectID = selectID;

    _activityID = activityID;

    _filterIndex = filterIndex;

    if (actionOnChange != "") {
      _actionOnChange = jQuery.parseJSON(actionOnChange);
    }

    $(selectID).empty();

    var displayMode = "DropDown";

    if (_actionControlID != "") {
      _selectOptions = new iData(
        "da63b835-a956-46ad-ba63-495851db6d21",
        _actionControlID
      );

      if (_selectOptions.getError() != null) {
        throw _selectOptions.getError();
      }

      _selectOptions = _selectOptions.getObject();

      if (
        jQuery.parseJSON(multipleAllow) ||
        (_activityID >= 3000000 && _activityID < 5000000)
      ) {
        $(selectID).attr("multiple", "multiple");

        $(selectID).attr("data-max-options", _selectOptions.MaxSelectedOptions);

        $(selectID).attr(
          "data-selected-text-format",
          _selectOptions.SelectedTextFormat
        );
      } else {
        $(selectID).attr("data-max-options", "1");

        $(selectID).attr("data-selected-text-format", "values");
      }
      $(selectID).attr("data-size", _selectOptions.MaxDisplayOptions);

      $(selectID).attr("data-actions-box", _selectOptions.ActionBoxEnabled);

      $(selectID).attr("data-show-icon", _selectOptions.IconEnable);

      if (_selectOptions.SearchStyle != "") {
        $(selectID).attr("data-live-search-style", _selectOptions.SearchStyle);
      }

      if (_selectOptions.Width != "") {
        $(selectID).attr("data-width", _selectOptions.Width);
      }

      if (_selectOptions.StyleClass != "") {
        $(selectID).attr("data-style", _selectOptions.StyleClass);
      }

      if (_selectOptions.IconClassName != "") {
        $(selectID).attr("data-icon-base", _selectOptions.IconClassName);
      }

      displayMode = _selectOptions.DisplayMode;
    }

    $(selectID).attr("data-live-search", "true");

    if (displayMode != "DropDown") {
      $$AjaxSelects[selectID] = {
        status: 0,
        defaultValue: defaultValue,
      };

      var options = {
        ajax: {
          url: "../App_Sys/Services/Action.asmx/GetListData",

          contentType: "application/json; charset=utf-8",

          type: "POST",

          dataType: "json",

          data:
            '{"id":"' +
            _actionControlID +
            '","activityID":"' +
            _activityID +
            '","q": "{{{q}}}","filters":[{"Name":"FilterValue1","Value":"' +
            filterValue1 +
            '"},{"Name":"FilterValue2","Value":"' +
            filterValue2 +
            '"},{"Name":"DefaultValue","Value":"0"}],"responseToken":"' +
            genResponseToken() +
            '"}',

          error: function (jqXHR, textStatus, errorThrown) {},
        },

        locale: {
          currentlySelected: localize("موارد انتخاب شده"),

          emptyTitle:
            " " +
            (defaultValue != "" && defaultValue != "0"
              ? getDefaultText(defaultValue, _actionControlID)
              : !isRequired
              ? localize(
                  _activityID >= 3000000 && _activityID < 5000000
                    ? ""
                    : "اختیاری"
                )
              : localize("هیچ موردی انتخاب نشده است")),

          errorText: localize("خطا در واکشی اطلاعات"),

          searchPlaceholder: localize("جستجو..."),

          statusInitialized:
            desc != "" ? desc : localize("بخشی از متن را وارد کنید"),

          statusNoResults: localize("نتیجه ای یافت نشد"),

          statusSearching: localize("در حال جستجو..."),
        },

        cache: false,

        log: 3,

        preserveSelected: jQuery.parseJSON(_selectOptions.PreserveSelected),

        preserveSelectedPosition: _selectOptions.PreserveSelectedPosition,

        clearOnEmpty: jQuery.parseJSON(_selectOptions.ClearOnEmpty),

        emptyRequest: jQuery.parseJSON(_selectOptions.EmptyRequestEnabled),

        preprocessData: function (data) {
          data = data.d;

          if (data[0].errorCode) {
            alert(
              "Operation error2 \n\r " +
                data[0].errorMessage.replace("<br/>", "\n\r")
            );
          }

          var i,
            l = data.length,
            array = [];

          setRequestToken(data[l - 1].requestToken);

          data.pop();

          if (l) {
            for (i = 0; i < l - 1; i++) {
              array.push(
                $.extend(true, data[i], {
                  text: data[i].text,

                  value: data[i].value,

                  data: {
                    subtext: data[i].subtext,

                    divider: jQuery.parseJSON(data[i].breakline),

                    icon: data[i].icon,

                    content: data[i].content,

                    group: data[i].group,
                  },
                })
              );
            }
          }

          if (!isRequired) {
            array.push({
              text: "",

              value: "",

              data: {
                subtext: "",

                divider: false,

                icon: "",

                content: "",

                group: "",
              },
            });
          }

          return array;
        },
      };

      $(selectID).selectpicker().ajaxSelectPicker(options);

      $(selectID).trigger("change");
    } else {
      if (_actionControlID != "") {
        $.ajax({
          url:
            _actionControlID != ""
              ? "../App_Sys/Services/Action.asmx/GetListData"
              : "../App_Sys/Services/Action.asmx/GetEnumData",

          contentType: "application/json; charset=utf-8",

          type: "POST",

          dataType: "json",

          data:
            '{"id":"' +
            (_actionControlID != "" ? _actionControlID : _enumTypeID) +
            '","activityID":"' +
            _activityID +
            '","q": "","filters":[{"Name":"FilterValue1","Value":"' +
            filterValue1 +
            '"},{"Name":"FilterValue2","Value":"' +
            filterValue2 +
            '"}],"responseToken":"' +
            genResponseToken() +
            '"}',

          async: false,

          error: function (jqXHR, textStatus, errorThrown) {
            alert("Operation error3 \n\r " + errorThrown);
          },

          success: function (data) {
            data = data.d;

            if (data[0].errorCode) {
              alert(
                "Operation error4 \n\r " +
                  data[0].errorMessage.replace("<br/>", "\n\r")
              );
            }

            var i,
              l = data.length;

            setRequestToken(data[l - 1].requestToken);

            data.pop();

            if (l) {
              for (i = 0; i < l - 1; i++) {
                if (data[i].value != null && data[i].value !== "") {
                  $(_selectID).append(
                    $("<option></option>")
                      .attr("value", data[i].value)
                      .text(data[i].label)
                  );
                }
              }
            }

            if (isRequired && defaultValue == "") {
              if (data[0]) {
                defaultValue = data[0].value;
              }
            }
          },
        });
      } else {
        //Local Enum Data

        if (jQuery.parseJSON(multipleAllow)) {
          $(selectID).attr("multiple", "multiple");

          $(selectID).attr("data-selected-text-format", "count > 1");
        }

        cache = localStorage.getItem("hrtGntAtsb6Gqph5d0X5");

        if (cache) {
          var data = filterList(
            jQuery.parseJSON(decodeURI(reverse(cache))),
            "EnumTypeID",
            _enumTypeID
          );
        } else {
          data = [];
        }

        var i,
          l = data.length;

        if (l) {
          for (i = 0; i < l; i++) {
            if (data[i].value != null && data[i].value !== "") {
              data[i].value = normalString(data[i].value);
              data[i].label = normalString(data[i].label);

              //Sepad Compatibility
              if ($$UserProp.MasterRole.indexOf("نماینده") > -1) {
                if (data[i].label.indexOf("فقط امن پرداز") > -1) {
                  continue;
                }
              }

              $(_selectID).append(
                $("<option></option>")
                  .attr("value", data[i].value)
                  .text(normalizeString(data[i].label))
              );
            }
          }
        }

        if (isRequired && defaultValue == "") {
          if (data[0]) {
            defaultValue = data[0].value;
          }
        }
      }

      if (!isRequired) {
        $(selectID).attr(
          "title",
          localize(
            _activityID >= 3000000 && _activityID < 5000000 ? "" : "اختیاری"
          )
        );

        if (_activityID >= 3000000 && _activityID < 5000000) {
        } else {
          $(selectID).prepend(
            $("<option></option>").attr("value", "").text("")
          );
        }
      }

      if (actionOnChange.indexOf("GridView") != -1) {
        $(selectID).prepend(
          $("<option></option>").attr("value", "0").text(desc)
        );
      }

      if (_selectOptions) {
        $(selectID).attr("data-live-search", _selectOptions.SearchEnable);
      }

      if (_activityID >= 3000000 && _activityID < 5000000) {
        //Context is Search Form

        $(selectID).attr("data-live-search", true);

        $(selectID).attr("multiple", "multiple");

        $(selectID).attr("data-max-options", "25");

        $(selectID).attr("data-selected-text-format", "count > 1");
      }

      $(selectID).selectpicker("destroy");

      $(selectID).selectpicker();

      if (_activityID >= 3000000 && _activityID < 5000000) {
        $(selectID).selectpicker("val", "XXXXX");
      } else {
        if (actionOnChange.indexOf("GridView") == -1) {
          $(selectID).selectpicker("val", defaultValue);
        } else {
          $(selectID).selectpicker("val", 0);
        }
      }
    }

    $(selectID).on(
      "changed.bs.select",
      function (e, clickedIndex, newValue, oldValue) {
        var selected = $(e.currentTarget).val();

        if (selected != null) {
          if (
            selected.indexOf("تمایلی ندارم") > -1 &&
            selected != "تمایلی ندارم"
          ) {
            $(selectID).selectpicker(
              "val",
              String(selected).replace("تمایلی ندارم,", "")
            );
          }
        }

        var otherEvent = "";

        try {
          $$AjaxSelects[_selectID].status = 1;
        } catch (e) {}

        var match = false;

        if (actionOnChange == "") {
          return;
        }

        $.each(_actionOnChange, function (index, event) {
          selected = normalizeString(selected);
          if (event.value.indexOf("[" + selected + "]") != -1) {
            match = true;
            $.each(event.actions, function (index, action) {
              const targetItems = Array.isArray(action.target)
                ? action.target
                : [action.target];
              if (action.targetType == "FormItem") {
                let isPrcItem = false;
                let isSpaceCol = false;
                let hasChild = false;
                targetItems.forEach((itemName) => {
                  if (
                    $("#form-group-" + $$FormItems[itemName].FormItemID)
                      .parent()
                      .children().length > 1
                  )
                    hasChild = true;
                  if (action.targetName && itemName.includes("Val"))
                    isPrcItem = true;

                  isSpaceCol = $(
                    "#form-group-" + $$FormItems[itemName].FormItemID
                  )
                    .parent()
                    .prev()
                    .hasClass("col-md-1");

                  if (action.actionType == "Hide") {
                    if (isSpaceCol) {
                      $("#form-group-" + $$FormItems[itemName].FormItemID)
                        .parent()
                        .prev()
                        .css("display", "none");
                    }

                    if (isPrcItem) {
                      if (!hasChild) {
                        $("#form-group-" + $$FormItems[itemName].FormItemID)
                          .parent()
                          .css("display", "none");
                      }
                      $("#form-group-" + $$FormItems[itemName].FormItemID).css(
                        "display",
                        "none"
                      );
                    } else
                      $("#form-group-" + $$FormItems[itemName].FormItemID).css(
                        "display",
                        "none"
                      );
                  }

                  if (action.actionType == "Show") {
                    if (isSpaceCol) {
                      $("#form-group-" + $$FormItems[itemName].FormItemID)
                        .parent()
                        .prev()
                        .css("display", "block");
                    }
                    if (isPrcItem) {
                      if (!hasChild) {
                        $("#form-group-" + $$FormItems[itemName].FormItemID)
                          .parent()
                          .css("display", "block");
                      }
                      $("#form-group-" + $$FormItems[itemName].FormItemID).css(
                        "display",
                        "block"
                      );
                    } else
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

                  if (action.actionType == "Reload") {
                    $("#form-group-" + $$FormItems[itemName].FormItemID).css(
                      "display",
                      "block"
                    );
                  }
                });
              }
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

          if (event.value.indexOf("[*]") != -1) {
            otherEvent = event;
          }

          $.each(event.actions, function (index, action) {
            if (action.targetType == "FormItem") {
              if (action.actionType == "Reload") {
                const targetItems = Array.isArray(action.target)
                  ? action.target
                  : [action.target];

                targetItems.forEach((itemName) => {
                  var itemObj = $$FormItems[itemName];

                  var $selectList = new selectList(
                    itemObj.ActionControlID,
                    itemObj.EnumTypeID
                  );

                  var filterVal1 = "";

                  if (itemObj.ParentName != "") {
                    filterVal1 = $(
                      "#form-item-" + $$FormItems[itemObj.ParentName].FormItemID
                    ).val();
                  }

                  var filterVal2 = "";

                  if (itemObj.ParentName2 != "") {
                    filterVal2 = $(
                      "#form-item-" +
                        $$FormItems[itemObj.ParentName2].FormItemID
                    ).val();
                  }

                  filterVal1 =
                    filterVal1 == "" || filterVal1 == null ? "0" : filterVal1;

                  filterVal2 =
                    filterVal2 == "" || filterVal2 == null ? "0" : filterVal2;

                  $selectList.renderContext(
                    "#form-item-" + itemObj.FormItemID,
                    itemObj.ReferEntityMultipleAllow,
                    activityID,
                    jQuery.parseJSON(itemObj.IsRequired),
                    itemObj.ActionOnChange,
                    itemObj.DefaultValue,
                    filterVal1,
                    filterVal2
                  ); //getDefaultValue(itemObj)
                });
              }
            }
          });
        });

        if (otherEvent != "" && !match) {
          $.each(otherEvent.actions, function (index, action) {
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

              if (action.targetType == "GridView") {
                if (action.actionType == "Reload") {
                  $AdvancedSearch[_filterIndex].ParamValue =
                    "[" + selected + "]";

                  $$ParentContexts[itemName].ajax.reload(null, false);
                }
              }
            });
          });
        }

        setTimeout("alignSideBarHeight();", 1 * 100);
      }
    );
  };

  function getDefaultText(defaultValue, actionControlID) {
    var defaultText = localize("انتخاب قبلی");

    defaultValue = jQuery.parseJSON(defaultValue);

    $.ajax({
      url: "../App_Sys/Services/Action.asmx/GetListData",

      contentType: "application/json; charset=utf-8",

      type: "POST",

      dataType: "json",

      data:
        '{"id":"' +
        _actionControlID +
        '","activityID":"' +
        _activityID +
        '","q": "xxxxx","filters":[{"Name":"DefaultValue","Value":"' +
        defaultValue +
        '"}],"responseToken":"' +
        genResponseToken() +
        '"}',

      async: false,

      error: function (jqXHR, textStatus, errorThrown) {
        alert("Operation error5 \n\r " + errorThrown);
      },

      success: function (data) {
        data = data.d;

        if (data[0].errorCode) {
          alert(
            "Operation error6 \n\r " +
              data[0].errorMessage.replace("<br/>", "\n\r")
          );
        }

        var i,
          l = data.length;

        setRequestToken(data[l - 1].requestToken);

        data.pop();

        if (l) {
          defaultText = data[0].label;
        }
      },
    });

    return htmlDecode(defaultText.trim());
  }

  function htmlDecode(value) {
    return $("<textarea/>").html(value).text();
  }
}

function localize(value) {
  if ($$Lang != "Fa") {
    //En, Ar, ...

    switch (value) {
      case "انتخاب قبلی":
        return "previous selection";
      case "اختیاری":
        return "Optional";
      case "موارد انتخاب شده":
        return "selected items";
      case "هیچ موردی انتخاب نشده است":
        return "";
      case "خطا در واکشی اطلاعات":
        return "error fetching information";
      case "جستجو...":
        return "search...";
      case "بخشی از متن را وارد کنید":
        return "enter search keyword";
      case "نتیجه ای یافت نشد":
        return "no results found in search";
      case "در حال جستجو...":
        return "searching ...";
    }
  }

  return value;
}

function normalString(value) {
  return reverse(
    value
      .replace(/%/g, "ا")
      .replace(/!/g, " ")
      .replace(/#/g, "P")
      .replace(/&/g, "S")
  );
}

function normalizeString(str, options = {}) {
  const {
    replaceChar = "–",
    removeSpaces = false,
    stripAccents = true,
  } = options;

  let normalized = str
    .replace(/Sndash;/gi, "–")
    .replace(/Smdash;/gi, "-")
    .replace(/Samp;/gi, "&");

  // const textarea = document.createElement("textarea");
  // textarea.innerHTML = normalized;
  // normalized = textarea.value;

  // if (stripAccents) {
  //   normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // }

  // normalized = normalized.replace(/[^a-zA-Z0-9\s-]/g, replaceChar);

  // normalized = normalized.replace(
  //   new RegExp(`[${replaceChar}]+`, "g"),
  //   replaceChar
  // );

  // if (removeSpaces) {
  //   normalized = normalized.replace(/\s+/g, "");
  // } else {
  //   normalized = normalized.replace(/\s+/g, " ");
  // }

  // Trim and optionally lowercase
  normalized = normalized.trim();
  return normalized;
}
