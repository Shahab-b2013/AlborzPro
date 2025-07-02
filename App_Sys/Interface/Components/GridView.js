// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
/* Release Ferdos.WebAppDesk 4.2.1.0*/

function gridView(id, objKey, objType) {
  var _actContextID = id;

  var _contextIndex = -1;

  var _objKey = $.isArray(objKey) ? objKey[0] : objKey;

  var _objType = objType;

  var _gridOptions;

  var _gridColumns;

  var _gridButtons;

  var _gridFilters;

  var _rowdata;

  var _taskID = 0;

  var offSet = 0;

  var filterDate;

  var starterFilter;

  var stateFilter;

  var _processFilterColumns = [];

  var showHistory = false;

  var groupingFlag = false;

  var sortingFlag = false;

  var lastFilterGridId = null;

  this._renderContext = function (
    renderMode,
    modalID,
    pageElementID,
    defaultSearch
  ) {
    var bodyID = "#box-body-" + pageElementID;

    var boxID = "#page-box-" + pageElementID;

    var footerID = "#box-footer-" + pageElementID;

    if (renderMode == "Modal") {
      bodyID = "#boxBodyModal" + modalID;

      boxID = "#pageBoxModal" + modalID;

      footerID = "#boxFooterModal" + modalID;

      _modalID = modalID;
    }

    //#region Load Grid Metadata

    cache = localStorage.getItem(window.btoa("grid$" + _actContextID));

    if (!cache || true) {
      _grid = new iComData("grid", _actContextID, null, null);

      _grid = _grid.getData();

      localStorage.setItem(
        window.btoa("grid$" + _actContextID),
        reverse(encodeURI(JSON.stringify(_grid)))
      );
    } else {
      _grid = jQuery.parseJSON(decodeURI(reverse(cache)));
    }

    _gridOptions = _grid.options;

    _gridColumns = _grid.columns;

    _gridButtons = _grid.buttons;

    _gridFilters = _grid.filters;

    //#endregion

    $(bodyID).html("");

    $(footerID).html("");

    if (renderMode == "Normal") {
      $(boxID + " .box-title").html(_gridOptions.label);

      if ($SearchKey !== undefined && $SearchKey != null && $SearchKey != "") {
        $(boxID + " .box-title").html(
          _gridOptions.label + " [ " + $SearchLbl + " > " + $SearchVal + " ]"
        );
      }
    }

    if (renderMode == "Modal") {
      $("#boxTitleModal" + modalID).html(_gridOptions.label);
    }

    _gridHeader = {};

    if (_gridOptions.headerIsDynamic != null) {
      _gridHeader = new ahData(_gridOptions.activityId, _objKey); //{Option1:'',Option2:''}

      if (_gridHeader.getError() != null) {
        raiseError(_gridHeader.getError(), bodyID);

        return;
      }

      _gridHeader = _gridHeader.getObject();
    }

    //#region Render Grid & Load data

    var jColumns = "[";

    var npriColumns = "[ ";

    var cnrColumns = "[ ";

    var tableBtnCount = _gridButtons.length;

    for (i = 0; i < _gridButtons.length; i++) {
      if (_gridButtons[i].OnlyToolbarVisiable == "1") {
        tableBtnCount--;
      }
    }

    if (_gridOptions.select == "1" && _modalID == 0) {
      jColumns +=
        '{"orderable":false,"searchable":false,"className": "select-checkbox","defaultContent": "","width":"10px","responsivePriority":"100000"},';

      offSet++;

      npriColumns += (offSet - 1).toString() + ",";

      cnrColumns += (offSet - 1).toString() + ",";
    }

    if (_gridOptions.drillDown == "1") {
      jColumns +=
        '{"orderable":false,"searchable":false,"className": "details-control","defaultContent": "","width":"10px"},';

      offSet++;

      npriColumns += (offSet - 1).toString() + ",";

      cnrColumns += (offSet - 1).toString() + ",";
    }

    if (_gridOptions.attentionFlag == "1") {
      jColumns +=
        '{"orderable":false,"searchable":false,"className": "","defaultContent": "","width":"25px"},';

      offSet++;

      npriColumns += (offSet - 1).toString() + ",";

      cnrColumns += (offSet - 1).toString() + ",";
    }

    var linkColumns = "[ ";

    var imgColumns = "[ ";

    var checkColumns = "[ ";

    var fileColumns = "[ ";

    var txtColumns = "[ ";

    var priColumns = "[ ";

    var rgtColumns = "[ ";

    for (i = 0; i < _gridColumns.length; i++) {
      _gridColumns[i].visible = true;

      if (_gridOptions.headerIsDynamic != null) {
        if (_gridHeader.hasOwnProperty(_gridColumns[i].Name)) {
          _gridColumns[i].Label = _gridHeader[_gridColumns[i].Name];

          if (_gridHeader[_gridColumns[i].Name] == null) {
            _gridColumns[i].visible = false;
          }
        }
      }

      jColumns +=
        '{"visible": ' +
        _gridColumns[i].visible +
        ',"data": "' +
        _gridColumns[i].DataFieldName +
        '", "name": "' +
        _gridColumns[i].Name +
        '", "title": "' +
        _gridColumns[i].Label +
        '", "orderable": ' +
        _gridColumns[i].IsOrderable +
        ', "searchable": ' +
        _gridColumns[i].IsSearchable +
        ', "defaultContent": "' +
        _gridColumns[i].DefaultValue +
        '"';

      if (_gridColumns[i].Width != "") {
        if (_gridColumns[i].Width == "200px" && renderMode == "Modal") {
          _gridColumns[i].Width = "100px";
        }

        jColumns += ', "width": "' + _gridColumns[i].Width + '"';
      }

      if (_gridColumns[i].StyleClass != "default") {
        jColumns += ', "class": "' + _gridColumns[i].StyleClass + '"';
      }

      if (_gridColumns[i].ElementType == "Link")
        linkColumns += (i + offSet).toString() + ",";

      if (_gridColumns[i].ElementType == "Checkbox")
        checkColumns += (i + offSet).toString() + ",";

      if (_gridColumns[i].ElementType == "File")
        fileColumns += (i + offSet).toString() + ",";

      if (_gridColumns[i].ElementType == "Img")
        imgColumns += (i + offSet).toString() + ",";

      if (
        _gridColumns[i].Width == "500px" ||
        _gridColumns[i].ActionOnCellClick != ""
      )
        txtColumns += (i + offSet).toString() + ",";

      if (_gridColumns[i].DataFieldName.indexOf("Label") > -1) {
        priColumns += (i + offSet).toString() + ",";
      } else {
        npriColumns += (i + offSet).toString() + ",";
      }

      cnrColumns += (i + offSet).toString() + ",";

      jColumns += "},";
    }

    jColumns = jColumns.substring(0, jColumns.length - 1);

    jColumns += "]";

    linkColumns = linkColumns.substring(0, linkColumns.length - 1);

    linkColumns += "]";

    imgColumns = imgColumns.substring(0, imgColumns.length - 1);

    imgColumns += "]";

    checkColumns = checkColumns.substring(0, checkColumns.length - 1);

    checkColumns += "]";

    fileColumns = fileColumns.substring(0, fileColumns.length - 1);

    fileColumns += "]";

    txtColumns = txtColumns.substring(0, txtColumns.length - 1);

    txtColumns += "]";

    priColumns = priColumns.substring(0, priColumns.length - 1);

    priColumns += "]";

    npriColumns = npriColumns.substring(0, npriColumns.length - 1);

    npriColumns += "]";

    rgtColumns = rgtColumns.substring(0, rgtColumns.length - 1);

    rgtColumns += "]";

    cnrColumns = cnrColumns.substring(0, cnrColumns.length - 1);

    cnrColumns += "]";

    $(bodyID).append(
      '<div class="tableGrids"><table id="datatable-' +
      pageElementID +
      '"  cellspacing="0"  width="100%" class="table-striped table-hover table-bordered"> <tbody></tbody></table></div>'
    );

    _contextIndex = $$ParentContexts.length;

    $$ParentContexts[_contextIndex] = $(
      "#datatable-" + pageElementID
    ).DataTable({
      searching: jQuery.parseJSON(_gridOptions.searching),

      paging: jQuery.parseJSON(_gridOptions.paging),

      lengthChange:
        renderMode == "Normal"
          ? jQuery.parseJSON(_gridOptions.lengthChange)
          : false,

      info: jQuery.parseJSON(_gridOptions.info),

      autoWidth: false,

      language: {
        info: _gridOptions.lbl_info,

        infoEmpty: _gridOptions.lbl_infoEmpty,

        infoFiltered: _gridOptions.lbl_infoFiltered,

        infoPostFix: _gridOptions.lbl_infoPostFix,

        loadingRecords: _gridOptions.lbl_loadingRecords,

        sZeroRecords: _gridOptions.lbl_zeroRecords,

        processing: _gridOptions.lbl_processing,

        search: "", //_gridOptions.lbl_search,

        searchPlaceholder: _gridOptions.lbl_searchPlaceholder,

        lengthMenu: _gridOptions.lbl_lengthMenu,

        paginate: {
          first: _gridOptions.lbl_pageFirst,

          last: _gridOptions.lbl_pageLast,

          next: _gridOptions.lbl_pageNext,

          previous: _gridOptions.lbl_pagePrevious,
        },
      },

      lengthMenu: jQuery.parseJSON(_gridOptions.lengthMenu),

      stateSave: jQuery.parseJSON(_gridOptions.stateSave),

      serverSide: jQuery.parseJSON(_gridOptions.serverSide),

      pageLength:
        _gridOptions.headerIsDynamic != null ? 100 : _gridOptions.pageLength,
      ordering: jQuery.parseJSON(_gridOptions.ordering),

      order: [parseInt(_gridOptions.orderIndex), _gridOptions.orderMode],

      orderMulti: jQuery.parseJSON(_gridOptions.orderMulti),

      pagingType: _gridOptions.pagingType,

      search: {
        regex: jQuery.parseJSON(_gridOptions.searchRegex),

        search: defaultSearch != null ? defaultSearch : _gridOptions.search,

        smart: jQuery.parseJSON(_gridOptions.searchSmart),
      },

      searchDelay: _gridOptions.searchDelay,

      stateDuration: _gridOptions.stateDuration,

      dom: '<"top"fl><"toolbar">Brt<"bottom"ip><"clear">',

      deferRender: _gridOptions.deferRender,

      processing: true,

      responsive: {
        details: false,
      },

      columns: jQuery.parseJSON(jColumns),

      columnDefs: [
        {
          render: function (data, type, row) {
            return (
              '<a style="cursor:pointer" class="link-grid"><img src="App_Res/Images/Page/16/' +
              $$StatusIcons[data] +
              '.png">&nbsp;' +
              data +
              "</a>"
            );
          },

          targets: jQuery.parseJSON(linkColumns),
        },
        {
          render: function (data, type, row, meta) {
            var _pageElementID = 0;

            if (data != "") {
              if (jQuery.parseJSON(data.toLowerCase())) {
                if (_gridColumns[meta.col - offSet].ActionOnCellClick == "") {
                  return '<input type="checkbox" checked class="grid-checkbox" disabled/>';
                } else {
                  return (
                    '<input type="radio" checked class="grid-checkbox" data-key="' +
                    row.ObjKey +
                    '" data-index="' +
                    (meta.col - offSet) +
                    '"/>'
                  );
                }
              } else {
                if (_gridColumns[meta.col - offSet].ActionOnCellClick == "") {
                  return '<input type="checkbox" class="grid-checkbox" disabled />';
                } else {
                  return (
                    '<input type="radio" class="grid-checkbox" data-key="' +
                    row.ObjKey +
                    '" data-index="' +
                    (meta.col - offSet) +
                    '"/ />'
                  );
                }
              }
            } else {
              return "";
            }
          },

          targets: jQuery.parseJSON(checkColumns),
        },
        {
          render: function (data, type, row, meta) {
            var _pageElementID = 0;

            if (data != "") {
              return (
                '<dd><span class="btn-download-grid fa fa-download" data-file-attach-code=' +
                data +
                ' title="download">&nbsp;&nbsp;<a class="btn-download-grid-link"></a></span></dd>'
              );
            } else {
              return "";
            }
          },

          targets: jQuery.parseJSON(fileColumns),
        },
        {
          render: function (data, type, row) {
            return '<img src="App_Res/Images/Page/16/' + $.trim(data) + '">';
          },

          targets: jQuery.parseJSON(imgColumns),
        },
        {
          render: function (data, type, row, meta) {
            if (_gridColumns[meta.col - offSet].ActionOnCellClick != "") {
              //Samen Compatibility
              return (
                '<input type="text" dir="ltr" title="محدود مجاز بین ' +
                row.Asm_Questions_MinValue +
                " تا " +
                row.Asm_Questions_MaxValue +
                'می باشد " class="form-control" id="txt-' +
                row.ObjKey +
                '" style="width:80px" value="' +
                data +
                '" onblur="checkRange(' +
                row.Asm_Questions_MinValue +
                "," +
                row.Asm_Questions_MaxValue +
                ", this.value," +
                row.ObjKey +
                ");lanchCellChangeAction(" +
                (meta.col - offSet) +
                "," +
                row.ObjKey +
                ', this.value)"/>'
              );
            }

            if (data == null) return "";

            if (data.length < 200) return data;

            return (
              data.substring(0, 200) +
              '<a href="javascript:return false" onclick="alert(\'' +
              data
                .replace(/&#x27;/g, "`")
                .replace(/<br\s*\/?>/gi, " ")
                .replace(/(\r\n\t|\n|\r\t)/gm, " ") +
              "')\"><b> [" +
              ($$Lang == "Fa" ? "...ادامه" : "continue...") +
              "] </b></a>"
            );
          },

          targets: jQuery.parseJSON(txtColumns),
        },
        {
          render: function (data, type, row) {
            //var btnGroup = '<div class="btn-group" style="min-width:' + ((tableBtnCount * 30) + 150).toString() + 'px">';
            var btnGroup = '<div class="btn-group">';

            var isRender = true;

            for (i = 0; i < _gridButtons.length; i++) {
              if (_gridButtons[i].OnlyToolbarVisiable == "0") {
                isRender = true;

                if (
                  _gridButtons[i].Name.indexOf("Update ") > -1 &&
                  _gridButtons[i].Name.indexOf("Detail") == -1
                ) {
                  if (row.hasOwnProperty("AllowUpdate")) {
                    if (!jQuery.parseJSON(row.AllowUpdate)) {
                      isRender = false;
                    }
                  }

                  if (row.hasOwnProperty("Hrs_Parameters_Unit")) {
                    if (
                      row.Hrs_Parameters_Unit == "ثابت" ||
                      row.Hrs_Parameters_Unit == "محاسبه از تقویم کاری"
                    ) {
                      isRender = false;
                    }
                  }
                }

                if (_gridButtons[i].Name.indexOf("Delete ") > -1) {
                  if (row.hasOwnProperty("AllowDelete")) {
                    if (!jQuery.parseJSON(row.AllowDelete)) {
                      isRender = false;
                    }
                  }
                }

                if (_gridButtons[i].Name.indexOf("Approve ") > -1) {
                  if (row.hasOwnProperty("AllowApprove")) {
                    if (!jQuery.parseJSON(row.AllowApprove)) {
                      isRender = false;
                    }
                  }
                }

                if (isRender) {
                  let isHidden = false;
                  if (
                    (_gridButtons[i].ContextType == "FormView" && showHistory,
                      row.TaskStatusID == 6)
                  )
                    isHidden = true;

                  btnGroup +=
                    `<button type="button"  class="${isHidden && _gridButtons[i].ContextType == "FormView"
                      ? "hidden"
                      : ""
                    } btn btn-default btn-sm btn-grid btn-grid-` +
                    i +
                    '" ' +
                    `${_gridButtons[i].ContextType == "TimeLineView"
                      ? `id = "${row.ObjKey}_timeline"`
                      : ``
                    }` +
                    'data-id="' +
                    i +
                    '" title="' +
                    _gridButtons[i].Label +
                    '"><img alt="' +
                    _gridButtons[i].Label +
                    '" src="App_Res/Images/Page/16/' +
                    _gridButtons[i].Icon +
                    '"></button>';
                }
              }
            }

            return btnGroup + "</div>";
          },

          targets: _gridColumns.length + offSet,

          orderable: false,

          responsivePriority: 1,

          width: (tableBtnCount * 30 + 10).toString() + "px",
        },
        {
          render: function (data, type, row) {
            if (_gridOptions.drillDown == "1") {
              return '<i class="glyphicon glyphicon-plus details-control btn-grid" style="cursor: pointer"></i>';
            }

            return data;
          },

          targets: offSet - (_gridOptions.attentionFlag == "1" ? 2 : 1),

          responsivePriority: _gridOptions.drillDown == "1" ? 1 : 10000,
        },
        {
          render: function (data, type, row) {
            if (row.hasOwnProperty("AttentionFlag")) {
              return (
                '<img src="App_Res/Images/Page/24/' +
                row["AttentionFlag"] +
                '.png">'
              );
            }

            return data;
          },

          targets: offSet - 1,

          responsivePriority:
            _gridOptions.attentionFlag == "1" ? 100000 : 10000,
        },
        { targets: _gridOptions.columnsVisible, visible: true },

        { targets: jQuery.parseJSON(cnrColumns), className: "dt-center" },

        {
          targets: jQuery.parseJSON(rgtColumns),
          className: "dt-body-" + ($$Dir == "RTL" ? "right" : "center"),
        },

        { targets: jQuery.parseJSON(priColumns), responsivePriority: 2 },
      ],

      ajax: {
        type: "POST",

        url: "App_Sys/Services/ViewActivity.asmx/GetDataList",

        contentType: "application/json; charset=utf-8",

        dataType: "json",

        data: function (d) {
          d.id = _gridOptions.activityId;

          d.objKey = _objKey;

          d.advancedSearch = [];
          if ($SearchKey !== undefined) {
            d.advancedSearch.push({
              ParamName: $SearchKey.replace(/,/g, "_"),
              ParamValue: $SearchVal,
              FileIsExist: 2,
              FileAttachCode: "",
            });
          }
          if (showHistory) {
            d.advancedSearch.push({
              ParamName: "ShowHistory",
              ParamValue: true,
              FileIsExist: 0,
              FileAttachCode: "",
            });
          }
          if (
            [
              "5051404",
              "5051405",
              "5051406",
              "5051407",
              "7051404",
              "7051405",
            ].includes(_gridOptions.activityId)
          ) {
            if (filterDate) {
              d.advancedSearch.push({
                ParamName: "Hrs_UserTracks_Date",
                ParamValue: filterDate,
                FileIsExist: 0,
                FileAttachCode: "",
              });
            }
          } else {
            if (filterDate) {
              d.advancedSearch.push({
                ParamName: "StartDate",
                ParamValue: filterDate,
                FileIsExist: 0,
                FileAttachCode: "",
              });
            }
          }
          if (
            [
              "5051404",
              "5051405",
              "5051406",
              "5051407",
              "7051404",
              "7051405",
            ].includes(_gridOptions.activityId)
          ) {
            if (starterFilter) {
              d.advancedSearch.push({
                ParamName: "Hrs_Employees_Label",
                ParamValue: starterFilter,
                FileIsExist: 0,
                FileAttachCode: "",
              });
            }
          } else {
            if (starterFilter) {
              d.advancedSearch.push({
                ParamName: "Starter",
                ParamValue: starterFilter,
                FileIsExist: 0,
                FileAttachCode: "",
              });
            }
          }
          if (stateFilter) {
            d.advancedSearch.push({
              ParamName: "CurrentState",
              ParamValue: stateFilter,
              FileIsExist: 0,
              FileAttachCode: "",
            });
          }

          if (_processFilterColumns.length > 0) {
            _processFilterColumns.forEach((searchField) => {
              if (
                searchField.Value !== undefined &&
                searchField.Value !== null &&
                searchField.Value !== ""
              ) {
                d.advancedSearch.push({
                  ParamName: searchField.FieldName,
                  ParamValue: searchField.Value,
                  FileIsExist: 0,
                  FileAttachCode: "SystemGeneratedFilterField",
                });
              }
            });
          }

          if ($AdvancedSearch.length > 0) {
            d.advancedSearch = $AdvancedSearch;
          }

          d.responseToken = genResponseToken();
        },
        dataSrc: function (json) {
          const data = json.d?.data || json.data || [];

          _rows = {};

          data.forEach((row) => {
            if (
              row.InstanceID !== undefined &&
              row.TaskStatusID !== undefined
            ) {
              _rows[row.InstanceID] = row.TaskStatusID;
            }
          });
          $HistoryIds = _rows;
          return data;
        },
      },

      drawCallback: function () {
        var api = this.api();
        var rows = api.rows({ page: "current" }).nodes();
        var last = null;
        var groupMap = {};
        var addedGroups = {};

        $("tr.group").remove();

        var columnIndex = null;
        api
          .columns()
          .header()
          .each(function (header, index) {
            // if (
            //   $(header).text().trim() === "درخواست کننده" ||
            //   $(header).text().trim() === "Starter"
            // ) {
            //   columnIndex = index;
            // }

            if (id > 6000000) {
              columnIndex = index;
            }
          });
        if (columnIndex !== null) {
          if ($("#btn-Expand-Collapse").length === 0) {
            $("#default-toolbar-" + pageElementID).append(
              '<button type="button" class="btn btn-default btn-sm btn-tool-grid btn-Filter" id="btn-Filter" title="Filter"><img style="width: 16px;height: 16px;" src="App_Res/Images/Page/16/Filter.png"></button>'
            );
            $("#default-toolbar-" + pageElementID).append(
              '<button type="button" class="btn btn-default btn-sm btn-tool-grid btn-ClearFilter" id="btn-ClearFilter" title="ClearFilter"><img style="width: 16px;height: 16px;" src="App_Res/Images/Page/16/ClearFilter.png"></button>'
            );
            $("#default-toolbar-" + pageElementID).append(
              '<button type="button" style="padding: 4px 11px;" class="hidden btn btn-default btn-sm btn-tool-grid btn-Grouping" id="btn-Grouping" title="Enable User Grouping"><img style="width: 20px;" src="App_Res/Images/Page/16/Groupping.png"></button>'
            );
            $("#default-toolbar-" + pageElementID).append(
              '<button type="button" style="padding: 3px 9px;display:none" class="btn btn-default btn-sm btn-tool-grid" id="btn-Expand-Collapse" title="Expand-Collapse"><img style="width: 22px;" src="App_Res/Images/Page/16/ExpandAll.png"></button>'
            );

            $("#default-toolbar-" + pageElementID).append(
              '<button type="button" style="padding: 4px 11px;" class="hidden btn btn-default btn-sm btn-tool-grid btn-Export-Excel" id="btn-Export-Excel" title="Export Data to Excel"><img style="width: 16px;" src="App_Res/Images/Page/16/ExportExcel3.png"></button>'
            );
            $("#default-toolbar-" + pageElementID).append(
              '<button type="button" style="padding: 2px 8px;" class="btn btn-default btn-sm btn-tool-grid btn-Show-History" id="btn-Show-History" title="Show History"><img style="width: 22px;" src="App_Res/Images/Page/16/Cartablehistory.png"></button>'
            );

            $("#btn-Show-History").on("click", function () {
              showHistory = !showHistory;
              $(this).attr(
                "title",
                showHistory ? "Hide History" : "Show History"
              );
              $$ParentContexts[_contextIndex].ajax.reload();
            });

            $("#btn-Grouping").on("click", function () {
              if (groupingFlag == true) {
                groupingFlag = false;
                sortingFlag = false;
                $(this).attr("title", "Enable User Grouping");
                $("#btn-Expand-Collapse").css("display", "none");
                api.draw();
              } else {
                $(this).attr("title", "Disable User Grouping");
                groupingFlag = true;
                sortingFlag = true;
                api.draw();
                $("#btn-Expand-Collapse").css("display", "block");
              }
            });
            $("#btn-Filter").on("click", () => {
              filterGrid(id);
            });

            $("#btn-Expand-Collapse").on("click", function () {
              var imgElement = $(this).find("img");
              var currentSrc = imgElement.attr("src");

              var icon = $("#btn-Expand-Collapse").find("img");

              if (currentSrc.includes("ExpandAll.png")) {
                imgElement.attr(
                  "src",
                  "App_Res/Images/Page/16/CollapseAll.png"
                );
                $(this).attr("title", "Collapse All");

                $("tr.group", api.table().body()).each(function () {
                  var currentGroup = $(this).nextUntil("tr.group");
                  currentGroup.show();
                  $(this).find("i").removeClass("fa-plus").addClass("fa-minus");
                });
              } else {
                imgElement.attr("src", "App_Res/Images/Page/16/ExpandAll.png");
                $(this).attr("title", "Expand All");

                $("tr.group", api.table().body()).each(function () {
                  var currentGroup = $(this).nextUntil("tr.group");
                  currentGroup.hide();
                  $(this).find("i").removeClass("fa-minus").addClass("fa-plus");
                });
              }
            });

            $("#btn-Export-Excel").on("click", function () {
              $(
                `#content`
              ).append(`<div id="Export_Loding" class="modal modal-primary in" style="background: rgba(0, 0, 0, 0.18);display:block">
               <div class="spinner-container">
                 <div class="lds-ellipsis">
                   <div></div><div></div><div></div><div></div>
                 </div>
               </div>
              </div>`);
              $.ajax({
                type: "POST",
                url: "App_Sys/Services/ViewActivity.asmx/GetDataList",
                data: JSON.stringify({
                  id: parseInt(_gridOptions.activityId),
                  draw: 1,
                  start: 0,
                  length: 10000,
                  columns: jQuery.parseJSON(jColumns),
                  order: [],
                  search: { value: "" },
                  advancedSearch: showHistory
                    ? [
                      {
                        ParamName: "ShowHistory",
                        ParamValue: true,
                        FileIsExist: 0,
                        FileAttachCode: "",
                      },
                    ]
                    : [],
                  objKey: _objKey,
                  responseToken: genResponseToken(),
                }),
                // async:false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (r) {
                  var columns = jQuery.parseJSON(jColumns);
                  var parsedData = JSON.parse(r.d);
                  var data = parsedData.data;
                  var headers = ["ردیف"];
                  columns.forEach(function (col) {
                    headers.push(col.title);
                  });
                  var rows = data.map(function (row) {
                    var rowData = [row.RowNum];
                    columns.forEach(function (col) {
                      var cellValue = row[col.data];
                      if (typeof cellValue === "string") {
                        var parser = new DOMParser();
                        var decodedValue = parser.parseFromString(
                          cellValue,
                          "text/html"
                        ).documentElement.textContent;
                        rowData.push(decodedValue);
                      } else {
                        rowData.push(cellValue);
                      }
                    });
                    return rowData;
                  });

                  var wb = new ExcelJS.Workbook();
                  var ws = wb.addWorksheet("Data", {
                    views: [{ rightToLeft: true }],
                  });

                  var headerRow = ws.addRow(headers);

                  headerRow.eachCell(function (cell, colIndex) {
                    cell.fill = {
                      type: "pattern",
                      pattern: "solid",
                      fgColor: { argb: "ae43ff" },
                    };

                    cell.font = { bold: true };

                    cell.alignment = {
                      horizontal: "center",
                      vertical: "middle",
                    };
                  });

                  rows.forEach(function (row) {
                    ws.addRow(row);
                  });

                  ws.eachRow({ includeEmpty: true }, function (row, rowIndex) {
                    row.eachCell(
                      { includeEmpty: true },
                      function (cell, colIndex) {
                        cell.alignment = {
                          horizontal: "center",
                          vertical: "middle",
                        };
                        cell.font = { name: "Calibri", size: 12 };
                      }
                    );
                  });

                  columns.forEach(function (col, index) {
                    ws.getColumn(index + 2).width = 20;
                  });

                  wb.xlsx.writeBuffer().then(function (buffer) {
                    var blob = new Blob([buffer], {
                      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    var link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "GridExport.xlsx";
                    link.click();
                  });
                  $(`#Export_Loding`).remove();
                },
                error: function (xhr, status, error) {
                  console.error(error);
                  alert("An error occurred while getting data grid.");
                  $(`#Export_Loding`).remove();
                },
              });
            });
          }

          var groupCounts = {};
          if (groupingFlag == true) {
            if (sortingFlag) {
              $(this)
                .find("th")
                .filter(function () {
                  return $(this).text().trim() === "درخواست کننده";
                })
                .click();
              sortingFlag = false;
            }
            api
              .column(columnIndex, { page: "current" })
              .data()
              .each(function (group) {
                groupCounts[group] = (groupCounts[group] || 0) + 1;
              });

            api
              .column(columnIndex, { page: "current" })
              .data()
              .each(function (group, i) {
                if (last !== group) {
                  var childCount = groupCounts[group];

                  if (!addedGroups[group]) {
                    addedGroups[group] = true;

                    var groupRow =
                      '<tr class="group" style="cursor: pointer;background-color:#f9f9f9;" data-id="' +
                      group +
                      '">';
                    for (var j = 0; j < api.columns().count(); j++) {
                      if (j === 0) {
                        groupRow +=
                          '<td style="text-align: center; width: 30px;border-bottom: 1px solid;height: 30px;color: #8b8b8b;">' +
                          '<i class="fa fa-plus"></i>' +
                          "</td>";
                      } else if (j === columnIndex) {
                        groupRow +=
                          '<td style="font-weight: bold; text-align: center;border-bottom: 1px solid;height: 30px;color: #8b8b8b;">' +
                          "<span>" +
                          group +
                          "</span>" +
                          "<span> (" +
                          childCount +
                          ") </span>" +
                          "</td>";
                      } else {
                        groupRow +=
                          '<td style="border-bottom: 1px solid;"></td>';
                      }
                    }
                    groupRow += "</tr>";

                    $(rows).eq(i).before(groupRow);
                    last = group;
                  }
                }

                var rowId = api.row(i).index() + 1000;
                $(rows).eq(i).attr("data-row-id", rowId);

                if (!groupMap[group]) {
                  groupMap[group] = [];
                }
                groupMap[group].push(rowId);
              });

            $.each(groupMap, function (group, rowIds) {
              var groupRows = rowIds.map(function (rowId) {
                return $('tr[data-row-id="' + rowId + '"]');
              });

              groupRows.sort(function (a, b) {
                var idA = parseInt($(a).attr("data-row-id"));
                var idB = parseInt($(b).attr("data-row-id"));
                return idA - idB;
              });

              $.each(groupRows, function (index, row) {
                $(row).insertAfter($('tr[data-id="' + group + '"]'));
              });
            });

            $("tr.group", api.table().body()).on("click", function () {
              var currentGroup = $(this).nextUntil("tr.group");
              currentGroup.toggle();

              var icon = $(this).find("i");
              if (currentGroup.is(":visible")) {
                icon.removeClass("fa-plus").addClass("fa-minus");
              } else {
                icon.removeClass("fa-minus").addClass("fa-plus");
              }
            });

            $("tr.group", api.table().body()).each(function (index) {
              var currentGroup = $(this).nextUntil("tr.group");
              if (index === 0) {
                currentGroup.show();
                $(this).find("i").removeClass("fa-plus").addClass("fa-minus");
              } else {
                currentGroup.hide();
              }
            });
          }
        }
      },
      select: {
        style: "multi",

        selector: "td:first-child",

        info: false,
      },

      createdRow: function (row, data, index) {
        if (_objKey) {
          if (
            data.ObjKey == _objKey &&
            _objKey != 0 &&
            renderMode == "Normal"
          ) {
            $("td", row).css("font-weight", "bold");
          }
        }
      },
    });

    //#endregion

    //#region Render Grid Events

    $("#datatable-" + pageElementID).on(
      "click",
      "i.details-control",
      function () {
        var tr = $(this).closest("tr");

        var row = $$ParentContexts[_contextIndex].row(tr);

        if (row.child.isShown()) {
          // This row is already open - close it
          row.child.hide();

          tr.removeClass("shown");

          $(this).addClass("glyphicon-plus");

          $(this).removeClass("glyphicon-minus");

          setTimeout("alignSideBarHeight();", 1 * 100);
        } else {
          // Open this row
          var objKey = row.data().ObjKey;

          var _rowdata2 = row.data();

          if (_rowdata2) {
            if (_rowdata2.hasOwnProperty("PexTaskID")) {
              $PForm.TaskId = _rowdata2.PexTaskID;
            }
          }

          row
            .child(
              '<div id="box-body-dd' + objKey + '" style="width:100%"></div>'
            )
            .show(1000);

          renderActivityContext(
            "dd" + objKey,
            _gridOptions.drillDownId,
            "DetailView",
            objKey
          );

          tr.addClass("shown");

          $(this).removeClass("glyphicon-plus");

          $(this).addClass("glyphicon-minus");

          setTimeout("alignSideBarHeight();", 1 * 100);
        }
      }
    );

    $("#datatable-" + pageElementID).on("draw.dt", function () {
      $(".grid-checkbox")
        .iCheck({
          checkboxClass: "icheckbox_square-green",

          radioClass: "iradio_square-green",

          increaseArea: "20%", // optional
        })
        .on("ifChecked", function (event) {
          lanchCellAction(
            _gridColumns[$(this).attr("data-index")],
            $(this).attr("data-key")
          );
        });

      $(".btn-download-grid").on("click", function () {
        jQuery.redirect(
          "App_Sys/Utilities/File.Downloader.aspx",
          {
            id: _gridOptions.activityId,
            code: $(this).attr("data-file-attach-code"),
            requestToken: genResponseToken(),
          },
          "POST",
          "_blank"
        );
      });
    });

    $("#datatable-" + pageElementID).on("click", "td", function (event) {
      if ($(event.target).attr("groupingRow") != "true") {
        var index =
          $$ParentContexts[_contextIndex].cell(this).index().column - offSet;

        if (_gridColumns[index] !== undefined) {
          if (_gridColumns[index].ActionOnCellClick != "") {
            var tr = $(this).closest("tr");

            var row = $$ParentContexts[_contextIndex].row(tr);

            //lanchCellAction(_gridColumns[index], row.data().ObjKey);
          }
        }
      }
    });

    $("#datatable-" + pageElementID).on("dblclick", "tr", function () {
      var data = $$ParentContexts[_contextIndex].row(this).data();

      $Data = data;

      $.each($Data, function (key, value) {
        if (value != null && value != "") {
          $Data[key] = value.replace(/<mark>/g, "");

          $Data[key] = $Data[key].replace(/<\/mark>/g, "");
        }
      });

      var theInstructions = _gridOptions.ActionOnRowDbClick;

      var inlineFunction = new Function(theInstructions);

      inlineFunction();

      //if (_modalID > 0) {

      //    $('#actContextModal' + _modalID).modal('hide');

      //    _modalID = _modalID - 1;

      //    $(bodyID).html('');

      //    $(footerID).html('');
      //}
    });

    //#endregion

    //#region Render Grid Toolbar & Buttons

    $(bodyID + " div.top").append(
      '&nbsp;<div class="btn-group" id="custom-toolbar-' + pageElementID + '">'
    );

    //if (_actContextID == 1025051 || _actContextID == 1025151 || _actContextID == 1025251) {

    //    $('#custom-toolbar-' + pageElementID).append('<button type="button" id="btn-excel"  class="btn btn-default btn-sm btn-tool-grid" title="Export to Excel"><img src="App_Res/Images/Page/16/Export.png"></button>');

    //    $('#btn-excel').on('click', function () {

    //        $('#page-content').append('<table id="excelTable"></table>')

    //        $('#excelTable').append($('#datatable-0').find('thead').html());

    //        $('#excelTable').append($('#datatable-0').find('tbody').html());

    //        $('#excelTable').table2excel({
    //            filename: "ExportedReport.xls"
    //        });

    //        $('#excelTable').html('');
    //    });
    //}

    for (i = 0; i < _gridButtons.length; i++) {
      _gridButtons[i]["_contextIndex"] = _contextIndex;

      if (_gridButtons[i].Name.startsWith("Activity_")) {
        $PForm.Name = _gridButtons[i].Name;
        $PForm.Label = _gridButtons[i].Label;
        $PForm.FormId = _gridButtons[i].LanchedContextID;
      }
      if (_gridButtons[i].InToolbarVisiable == "1") {
        $("#custom-toolbar-" + pageElementID).append(
          '<button type="button" class="btn btn-default btn-sm btn-tool-grid btn-tool-' +
          i +
          '" data-id="' +
          i +
          '" title="' +
          _gridButtons[i].Label +
          '"><img alt="' +
          _gridButtons[i].Label +
          '" src="App_Res/Images/Page/16/' +
          _gridButtons[i].Icon +
          '">&nbsp;<b>' +
          (_gridButtons[i].Name.includes("_All_")
            ? _gridButtons[i].Label
            : "") +
          "</b></button>"
        );

        $(bodyID + " div.top").on("click", "button.btn-tool-" + i, function () {
          lanchAction(_gridButtons[$(this).attr("data-id")]);
        });
      }

      $("#datatable-" + pageElementID).on(
        "click",
        "button.btn-grid-" + i,
        function () {
          var tr = $(this).closest("tr");

          var row =
            $$ParentContexts[
              _gridButtons[$(this).attr("data-id")]._contextIndex
            ].row(tr);

          lanchAction(
            _gridButtons[$(this).attr("data-id")],
            row.data().ObjKey,
            row.data()
          );
        }
      );
    }

    $(bodyID + " div.top").append("</div>");

    if (defaultSearch != null) {
      $(bodyID + " div.top").append(
        '&nbsp;&nbsp;<div class="btn-group" id="search-toolbar-' +
        pageElementID +
        '">'
      );

      var arr = defaultSearch.split("@");

      $.each(arr, function (index, value) {
        value = value.trim();

        if (
          value != "" &&
          value != "ای" &&
          value != "اي" &&
          value != "های" &&
          value != "هاي" &&
          value != "شرکت" &&
          value != "سازمان" &&
          value != "اداره" &&
          value != "و"
        ) {
          $("#search-toolbar-" + pageElementID).append(
            '&nbsp;&nbsp;<label class="input-checkbox-label"><input type="checkbox" class="checkbox-smart-search"  title="' +
            value +
            '" checked="checked"/>&nbsp;' +
            value +
            "</label>&nbsp;&nbsp;&nbsp;&nbsp;"
          );
        }
      });

      $(bodyID + " div.top").append("</div>");

      $("#search-toolbar-" + pageElementID).append(
        '<button type="button" class="btn btn-default btn-sm btn-tool-grid" id="btn-smart-search" onclick="smartSearch()" title="Smart Search"><img src="App_Res/Images/Page/16/Search.png"></button>'
      );

      $("#btn-smart-search").on("click", function () { });
    }

    if (renderMode == "Normal" && _objType == null) {
      $(bodyID + " div.top").append(
        '&nbsp;&nbsp;<div class="btn-group" id="default-toolbar-' +
        pageElementID +
        '">'
      );

      if (_gridOptions.select == "1" && _modalID == 0) {
        $("#default-toolbar-" + pageElementID).append(
          '<button type="button"  class="btn btn-default btn-sm btn-tool-grid" id="btn-select" title="Select All"><img src="App_Res/Images/Page/16/Checked.png"></button>'
        );

        $("#btn-select").on("click", function () {
          $$ParentContexts[_contextIndex].rows().select();
        });

        $("#default-toolbar-" + pageElementID).append(
          '<button type="button"  class="btn btn-default btn-sm btn-tool-grid" id="btn-deselect" title="Unselect All"><img src="App_Res/Images/Page/16/Unchecked.png"></button>'
        );

        $("#btn-deselect").on("click", function () {
          $$ParentContexts[_contextIndex].rows().deselect();
        });
      }

      if (jQuery.parseJSON(_gridOptions.refresh)) {
        $("#default-toolbar-" + pageElementID).append(
          '<button type="button"  class="btn btn-default btn-sm btn-tool-grid btn-refresh" id="btn-refresh" title="Refresh"><img src="App_Res/Images/Page/16/Refresh.png"></button>'
        );

        $("#btn-refresh").on("click", function () {
          $$ParentContexts[_contextIndex].ajax.reload(null, false);
        });
      }

      //Working time grid
      // if (pageElementID == 1000104 && id == 5051402) {
      //   let allowExport = false;
      //   $.ajax({
      //     type: "POST",
      //     url: "App_Sys/Services/CustomActivity.asmx/UserIsMaster",
      //     contentType: "application/json; charset=utf-8",
      //     dataType: "json",
      //     async: false,
      //     success: function (r) {
      //       allowExport = r.d;
      //     },
      //     error: function (xhr, status, error) {
      //       console.error(error);
      //       alert(
      //         "An error occurred while checking allowed user to open forms or not."
      //       );
      //     },
      //   });
      //   if (allowExport)
      //     $("#default-toolbar-" + pageElementID).append(
      //       '<button type="button"  class="btn btn-default btn-sm btn-tool-grid btn-Export" id="btn-Export" title="Export"><img style="width: 16px;height: 16px;" src="App_Res/Images/Page/16/ExportExcel3.png"></button>'
      //     );
      // }
      $("#btn-Export").on("click", customReportView);

      $(bodyID + " div.top").append("</div>");

      $(bodyID + " div.top").append(
        '&nbsp;&nbsp;<div class="btn-group" id="export-toolbar-' +
        pageElementID +
        '">'
      );

      if (jQuery.parseJSON(_gridOptions.export_excel)) {
        $("#export-toolbar-" + pageElementID).append(
          '<button type="button"  class="btn btn-default btn-sm btn-tool-grid" title="Export to Excel"><img src="App_Res/Images/Page/16/Export.png"></button>'
        );
      }

      if (jQuery.parseJSON(_gridOptions.export_pdf)) {
        $("#export-toolbar-" + pageElementID).append(
          '<button type="button" class="btn btn-default btn-sm btn-tool-grid" title="Export to Pdf"><img src="App_Res/Images/Page/16/Pdf.png"></button>'
        );
      }

      if (jQuery.parseJSON(_gridOptions.export_print)) {
        $("#export-toolbar-" + pageElementID).append(
          '<button type="button" class="btn btn-default btn-sm btn-tool-grid" title="Print"><img src="App_Res/Images/Page/16/Print.png"></button>'
        );
      }

      $(bodyID + " div.toolbar").append("</div>");
    }

    $(bodyID + " div.top").append(
      '&nbsp;<div class="btn-group" id="filter-toolbar-' + pageElementID + '">'
    );

    if (!_gridFilters[0].hasOwnProperty("errorLogID")) {
      if (renderMode == "Normal") {
        $.each(_gridFilters, function (i, gridFilter) {
          $("#filter-toolbar-" + pageElementID).append(
            '<select class="form-control form-input" id="btn-filter-' +
            i +
            '"> </select>'
          );

          $AdvancedSearch.push({
            ParamName: _gridFilters[i].FilterFieldName,
            ParamValue: "[0]",
            FileIsExist: 2,
            FileAttachCode: "",
          });

          var $selectList = new selectList(
            _gridFilters[i].ListContextID,
            _gridFilters[i].EnumTypeID
          );

          $selectList.renderContext(
            "#btn-filter-" + i,
            false,
            _actContextID,
            true,
            '[{"value":"[*]","actions":[{"targetType":"GridView","actionType":"Reload","target":"' +
            _contextIndex +
            '"}]}]',
            _gridFilters[i].DefaultValue,
            0,
            0,
            _gridFilters[i].Label,
            i
          );
        });
      }
    }

    $("#filter-toolbar-" + pageElementID)
      .find(".bootstrap-select")
      .css("width", "140px");

    $("#datatable-" + pageElementID).on("draw.dt", function () {
      setTimeout("alignSideBarHeight();", 1 * 1000);
    });

    //#endregion

    //#region Render Footer

    if (renderMode == "Modal") {
      $("#boxFooterModal" + modalID).append(
        '<button type="button" id="btnCnsModal' +
        modalID +
        '" class="btn btn-default btn-form-cancel" >' +
        $$Local.formCancel +
        "</button>"
      );

      $("#closeBtnModal" + modalID).unbind("click");

      $("#closeBtnModal" + modalID).click(function () {
        _modalID = _modalID - 1;

        $(bodyID).html("");

        $(footerID).html("");
      });

      $("#btnCnsModal" + modalID).unbind("click");

      $("#btnCnsModal" + modalID).click(function () {
        $("#closeBtnModal" + _modalID).trigger("click");
      });
    }

    //#endregion
  };

  function filterGrid(id) {
    // Check if the ID is different from the previous one
    if (lastFilterGridId !== id) {
      lastFilterGridId = id; // Update the last ID

      $("#start-date").val("");
      $("#end-date").val("");
      $("#requesterDropdown").val("All").trigger("change");
      $("#requestStatusDropdown").val("All").trigger("change");
    }

    if (!$("#filterModal").length) {
      let modal = `
      <div class="modal modal-primary in" id="filterModal" style="display: none; padding-right: 17px;">
        <div class="modal-dialog" style=" margin-top: 150px;">
          <div class="modal-content">
            <div class="box box-solid" id="pageBoxFilterModal">
              <div style="background: var(--A1);" class="box-header with-border">
                <h3 style="color: white;" class="box-title">${$$Lang == "Fa" ? "فیلتر داده ها" : "Data Filter"
        }</h3>
              </div>
              <form class="form-horizontal" id="filterForm">
                <div class="box-body" id="boxBodyFilterModal">
                  <div class="row form-group-box" style="border: 0;margin-bottom:0px !important">
                    <div class="col-md-5" id="form-group-body-text-input">
                      <div class="form-group" id="form-group-text-input">
                        <label for="reportTitle">${$$Lang == "Fa" ? "تاریخ شروع" : "Start Date"
        }</label>
                        <div class="input-group">
                          <div class="input-group-addon">
                            <i class="glyphicon glyphicon-calendar"></i>
                          </div>
                          <input 
                            type="text" 
                            id="start-date" 
                            class="form-control form-input" 
                            placeholder="" 
                            data-mdpersiandatetimepickershowing="true" 
                            data-mdpersiandatetimepicker="" 
                            data-mddatetimepicker="true" 
                            data-targetselector="#start-date" 
                            data-trigger="click" 
                            data-placement="top" 
                            data-englishnumber="true" 
                            dir="ltr" 
                            data-inputmask="'alias': 'shamsi'" 
                            style="text-align: left;" 
                            data-enabletimepicker="false" 
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-1"></div>
                    <div class="col-md-5" id="form-group-body-emp-id">
                      <div class="form-group" id="form-group-emp-id">
                        <label for="employee-id">${$$Lang == "Fa" ? "تاریخ پایان" : "End Date"
        }</label>
                        <div class="input-group">
                          <div class="input-group-addon">
                            <i class="glyphicon glyphicon-calendar"></i>
                          </div>
                          <input 
                            type="text" 
                            id="end-date" 
                            class="form-control form-input" 
                            placeholder="" 
                            data-mdpersiandatetimepickershowing="true" 
                            data-mdpersiandatetimepicker="" 
                            data-mddatetimepicker="true" 
                            data-targetselector="#end-date" 
                            data-trigger="click" 
                            data-placement="top" 
                            data-englishnumber="true" 
                            dir="ltr" 
                            data-inputmask="'alias': 'shamsi'" 
                            style="text-align: left;" 
                            data-enabletimepicker="false" 
                          />
                        </div>
                      </div>
                      </div>
                      <div class="col-md-5" id="form-group-body-text-input">
                      <div class="form-group" id="form-group-emp-id">
                      <label for="employee-id">${$$Lang == "Fa" ? "درخواست کننده" : "Starter"
        }</label>
                      <div class="input-group">
                      <div class="input-group-addon">
                      <i class="glyphicon glyphicon-user"></i>
                      </div>
                      <select id="requesterDropdown" class="select2"></select>
                      </div>
                        </div>
                        </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-5" id="form-group-body-text-input">
                        <div class="form-group" id="form-group-emp-id">
                        <label for="employee-id">${$$Lang == "Fa" ? "وضعیت درخواست" : "Request Status"
        }</label>
                        <div class="input-group">
                        <div class="input-group-addon">
                        <i class="glyphicon glyphicon-check"></i>
                        </div>
                        <select id="requestStatusDropdown" class="select2"></select>
                        </div>
                        </div>
                        </div>
                        `;
      $.ajax({
        type: "POST",
        url: "../../App_Sys/Services/EditActivity.asmx/GetFlowStates",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
          let data = JSON.parse(response.d);
          let _Status = $("#requestStatusDropdown");
          _Status.empty();
          _Status.append(
            `<option selected value='All'>${$$Lang == "Fa" ? "همه وضعیت ها" : "All Status"
            }</option>`
          );

          data.forEach((item) => {
            _Status.append(
              `<option value="${item.Label}">${item.Label}</option>`
            );
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("AJAX error:", textStatus, errorThrown);
          console.log(jqXHR);
        },
      });

      $.ajax({
        type: "POST",
        url: "../../App_Sys/Services/EditActivity.asmx/GetUsers",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
          let data = JSON.parse(response.d);
          let dropdown = $("#requesterDropdown");
          dropdown.empty();
          dropdown.append(
            `<option selected value='All'>${$$Lang == "Fa" ? "همه کاربران" : "All Users"
            }</option>`
          );

          data.forEach((item) => {
            dropdown.append(
              `<option value="${item.Label}">${item.Label}</option>`
            );
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("AJAX error:", textStatus, errorThrown);
          console.log(jqXHR);
        },
      });
      if (
        [
          6200618, 6200622, 6200640, 6200715, 6200754, 6200759, 6200766,
          6200790, 6200800,
        ].includes(+_gridOptions.activityId)
      ) {
        let columnsDatafieldNames = [];
        $.ajax({
          type: "POST",
          url: "../../App_Sys/Services/EditActivity.asmx/GetColumnDataField",
          data: JSON.stringify({ gridId: _gridOptions.activityId }), // stringify the data for JSON content type
          contentType: "application/json; charset=utf-8",
          async: false,
          dataType: "json",
          success: function (response) {
            let data = JSON.parse(response.d); // assuming response.d is a JSON string
            columnsDatafieldNames = data;
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, errorThrown);
            console.log(jqXHR);
          },
        });

        _gridColumns.forEach((column) => {
          let dataFieldName = "";
          columnsDatafieldNames.forEach((fieldName) => {
            if (fieldName.Name == column.Name) {
              dataFieldName = fieldName.Label;
            }
          });
          if (column.Name == "CurrentStep") {
            modal += `
          <div class="col-md-5" id="form-group-body-text-input">
            <div class="form-group" id="form-group-text-input">
	          	<label for="${column.Name}-filter">${column.Label}</label>
	          	  <div class="input-group">
                  <div class="input-group-addon">
                     <i class="glyphicon glyphicon-check"></i>
                  </div>
                  <select id="${column.Name}-filter"  data-field-name="${dataFieldName}" class="select2">
                  <option value="" Selected>All Steps</option>
                  `;

            $.ajax({
              url: "../../App_Sys/Services/CustomActivity.asmx/GetProcessSteps",
              type: "POST",
              contentType: "application/json",
              async: false,
              data: JSON.stringify({
                ProcessID: 120,
              }),
              success: function (response) {
                let data = JSON.parse(response.d);
                data.forEach((item) => {
                  modal += `<option value="${item.Label}">${item.Label}</option>`;
                });
              },
              error: function (xhr, status, error) {
                console.error("Error Fetching Steps:", error);
              },
            });

            modal += ` </select>
                    </div>
                </div>
              </div>  <div class="col-md-1"></div>`;
          } else if (column.Name == "Seen") {
            modal += `
          <div class="col-md-5" id="form-group-body-text-input">
            <div class="form-group" id="form-group-text-input">
	          	<label for="${column.Name}-filter">${column.Label}</label>
	          	  <div class="input-group">
                  <div class="input-group-addon">
                     <i class="glyphicon glyphicon-check"></i>
                  </div>
                  <select id="${column.Name}-filter"  data-field-name="${dataFieldName}" class="select2">
                  <option value="" Selected>All States</option>
                  <option value="Seen">Seen</option>
                  <option value="Seen And Color">Seen And Color</option>
                  </select>
                </div>
            </div>
          </div>  <div class="col-md-1"></div>`;
          } else if (
            column.Name !== "RecordDate" &&
            column.Name !== "CurrentState" &&
            column.Name !== "StartDate"
          ) {
            modal += `
          <div class="col-md-5" id="form-group-body-text-input">
            <div class="form-group" id="form-group-text-input">
	          	<label for="${column.Name}-filter">${column.Label}</label>
	          	  <div class="input-group">
                  <div class="input-group-addon">
                     <i class="glyphicon glyphicon-check"></i>
                  </div>
                  <input type="text" id="${column.Name}-filter" data-field-name="${dataFieldName}" class="form-control form-input" placeholder="" style="text-align: left;"/>
                </div>
            </div>
          </div>  <div class="col-md-1"></div>`;
          }
        });
      }

      modal += `
      </div>
      </div>
                <div class="box-footer" id="boxFooterFilterModal">
                  <button type="button" id="Filter_submitBtn" class="btn btn-form-submit">${$$Lang == "Fa" ? "تایید" : "Submit"
        }</button>
                  <button type="button" id="cancelBtnFilter" style="width: 70px;" class="btn btn-default btn-form-cancel">${$$Lang == "Fa" ? "بستن" : "Close"
        }</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>`;

      $("body").append(modal);
      $(".select2").select2();

      EnableMdDateTimePickers();
      $("[data-inputmask]").inputmask();
    }

    //$("#start-date").val("");
    //$("#end-date").val("");
    //$("#requesterDropdown").val("").trigger("change");
    //$("#requestStatusDropdown").val("").trigger("change");

    $("#filterModal").show();

    $("#cancelBtnFilter").on("click", function () {
      $("#filterModal").hide();
    });

    $("#Filter_submitBtn").on("click", function () {
      if (
        [
          "5051404",
          "5051405",
          "5051406",
          "5051407",
          "7051404",
          "7051405",
        ].includes(_gridOptions.activityId)
      ) {
        filterDate = `${$("#start-date").val() == "" ? "1378/10/11" : $("#start-date").val()
          }$${$("#end-date").val() == "" ? "1478/10/12" : $("#end-date").val()}`;
        starterFilter = $("#requesterDropdown").val();
        stateFilter = undefined;
      } else {
        filterDate = `${$("#start-date").val() == "" ? "1378/10/11" : $("#start-date").val()
          } 00:00$${$("#end-date").val() == "" ? "1478/10/12" : $("#end-date").val()
          } 23:59`;
        starterFilter =
          $("#requesterDropdown").val() === "All"
            ? ""
            : $("#requesterDropdown").val();
        stateFilter =
          $("#requestStatusDropdown").val() === "All"
            ? ""
            : $("#requestStatusDropdown").val();
      }

      _processFilterColumns = [];
      let columnObj = {};
      _gridColumns.forEach((column) => {
        if (
          column.Name !== "RecordDate" &&
          column.Name !== "CurrentState" &&
          column.Name !== "StartDate"
        ) {
          columnObj = {
            Name: column.Name,
            Value: $(`#${column.Name}-filter`).val(),
            FieldName: $(`#${column.Name}-filter`).attr("data-field-name"),
          };
          _processFilterColumns.push(columnObj);
        }
      });

      $$ParentContexts[_contextIndex].ajax.reload(null, false);
      $("#filterModal").hide();
    });

    $("#btn-ClearFilter").on("click", function () {
      $("#start-date").val("");
      $("#end-date").val("");
      _gridColumns.forEach((column) => {
        if (column.Name == "Seen" || column.Name == "CurrentStep") {
          $(`#${column.Name}-filter`).val("").trigger("change");
        } else if (
          column.Name !== "RecordDate" &&
          column.Name !== "CurrentState" &&
          column.Name !== "StartDate"
        ) {
          $(`#${column.Name}-filter`).val("");
        }
      });
      if (
        [
          "5051404",
          "5051405",
          "5051406",
          "5051407",
          "7051404",
          "7051405",
        ].includes(_gridOptions.activityId)
      ) {
        filterDate = `1378/10/11$1478/10/12`;
      } else {
        filterDate = `1378/10/11 00:00$1478/10/12 23:59`;
        stateFilter = undefined;
      }
      starterFilter = "";
      stateFilter = "";
      _processFilterColumns = [];
      $("#requesterDropdown").val("All").trigger("change");
      $("#requestStatusDropdown").val("All").trigger("change");
      $$ParentContexts[_contextIndex].ajax.reload(null, false);
      $("#filterModal").hide();
    });
  }

  this.renderContext = function (pageElementID) {
    this._renderContext("Normal", 0, pageElementID);

    if (_objType == "" || _objType == null || _objType === undefined) {
      var arr = _gridOptions.Name.substring(
        0,
        _gridOptions.Name.length - 1
      ).split("_");

      _objType = arr[arr.length - 1] + "ID";
    }
  };

  this.renderModalContext = function (modalID, defaultSearch) {
    this._renderContext("Modal", modalID, 0, parseSearchValue(defaultSearch));
  };

  lanchAction = function (gridButton, objKey, rowdata) {
    _rowdata = rowdata;

    var objKeys = [];

    if (objKey) {
      objKeys[0] = objKey;
    } else {
      if (gridButton.MultiRowHandled) {
        var selRows = $$ParentContexts[gridButton._contextIndex]
          .rows({ selected: true })
          .data();

        for (i = 0; i < selRows.length; i++) {
          objKeys[i] = selRows[i].ObjKey;
        }
      } else {
        try {
          if (data.ObjKey !== undefined) {
            objKeys[0] = data.ObjKey;
          }
        } catch (e) { }
      }
    }

    if (!objKeys[0] && !gridButton.OnlyToolbarVisiable) {
      if ($$Lang == "Fa") {
        alert("هیچ رکوردی انتخاب نشده است");
      } else {
        alert("No any record has been selected");
      }

      return;
    }

    $PForm.TaskId = "";
    var _taskID = 0;

    if (_rowdata) {
      if (_rowdata.hasOwnProperty("Crm_Customers_Label")) {
        $Data = _rowdata.Crm_Customers_Label;
      }

      if (_rowdata.hasOwnProperty("Prj_Epics_Label")) {
        $Data = _rowdata.Prj_Epics_Label;
      }

      if (_rowdata.hasOwnProperty("PexTaskID")) {
        _taskID = _rowdata.PexTaskID;
        $PForm.TaskId = _taskID;
      }
    }

    if (gridButton.ContextType == "FormView") {
      if (gridButton.ActionOnClick == "openModalContext") {
        if (_taskID == 0) {
          openModalContext(
            _modalID + 1,
            gridButton.LanchedContextID,
            gridButton.ContextType,
            objKeys,
            _objType != null ? _objKey : 0,
            _objType,
            gridButton._contextIndex
          );
        } else {
          openTModalContext(
            _modalID + 1,
            gridButton.LanchedContextID,
            gridButton.ContextType,
            objKeys,
            _objType != null ? _objKey : 0,
            _objType,
            gridButton._contextIndex,
            _taskID
          );
        }
      } else {
        if (gridButton.ActionOnClick == "openMediaPage") {
          jQuery.redirect(
            "App_Sys/Utilities/Media.Player.aspx",
            {
              id: _gridOptions.activityId,
              mediaId: objKeys[0],
              requestToken: genResponseToken(),
            },
            "POST",
            "_blank"
          );
        } else {
          var inlineFunction = new Function(gridButton.ActionOnClick);

          inlineFunction();
        }
      }
    } else {
      //CheckListView, GridView

      if (gridButton.ActionOnClick == "openModalContext")
        openModalContext(
          _modalID + 1,
          gridButton.LanchedContextID,
          gridButton.ContextType,
          [],
          objKeys[0],
          _objType
        );

      if (gridButton.ActionOnClick == "openModalTable")
        openModalTable(
          _modalID + 1,
          gridButton.LanchedContextID,
          gridButton.ContextType,
          [],
          objKey,
          _objType
        );

      if (gridButton.ActionOnClick == "openModalCalendar")
        openModalCalendar(
          _modalID + 1,
          gridButton.LanchedContextID,
          gridButton.ContextType,
          [],
          objKey,
          _objType
        );

      if (gridButton.ActionOnClick == "openModalCalendar2") {
        var year = _rowdata.Hrs_MonthlyWorkingTimes_Year;
        var month = _rowdata.Hrs_MonthlyWorkingTimes_Month;
        var employeeId = _rowdata.Hrs_MonthlyWorkingTimes_EmployeeID;
        var employeeLabel = _rowdata.Hrs_Employees_Label;

        openModalCalendar2(year, month, employeeId, employeeLabel);
      }

      if (gridButton.ActionOnClick == "openModalMonthlyWorkingTimes") {
        var year = _rowdata.Hrs_MonthlyWorkingTimes_Year;
        var month = _rowdata.Hrs_MonthlyWorkingTimes_Month;
        var employeeId = _rowdata.Hrs_MonthlyWorkingTimes_EmployeeID;
        var employeeLabel = _rowdata.Hrs_Employees_Label;
        openModalMonthlyWorkingTimes(year, month, employeeId, employeeLabel);
      }

      if (gridButton.ActionOnClick == "silentActivity") {
        if (gridButton.AlertMessage == "") {
          executeSilentActivity(
            gridButton.LanchedContextID,
            objKeys,
            0,
            _contextIndex
          );
        } else {
          var r = confirm(gridButton.AlertMessage);

          if (r == true) {
            if (gridButton.Name.includes("_All_")) {
              var selRows = $$ParentContexts[_contextIndex].rows().data();

              for (i = 0; i < selRows.length; i++) {
                objKeys[i] = selRows[i].ObjKey;
              }
            }

            executeSilentActivity(
              gridButton.LanchedContextID,
              objKeys,
              0,
              _contextIndex
            );

            $("#closeBtnModal" + _modalID).trigger("click");
          } else {
            return;
          }
        }
      }
    }

    if (gridButton.ActionOnClick == "navigatePage")
      redirectPage(gridButton.LanchedPageID, objKeys[0]);

    if (gridButton.ActionOnClick == "openPopupPage") {
      if (_rowdata.hasOwnProperty("Sys_Prc_Processes_Status")) {
        //if (_rowdata.Sys_Prc_Processes_Status == "PilotRun" || _rowdata.Sys_Prc_Processes_Status == "FinalRun") {
        //if (gridButton.LanchedContextID == 1210003) {
        //alert("برای ورود به محیط طراحی مرحله فرآیند را در حالت Design قرار دهید ");
        // return;
        //}
        //}
      }

      if (_rowdata.hasOwnProperty("Sys_Dbs_DataModels_Status")) {
        if (
          _rowdata.Sys_Prc_Processes_Status == "PilotRun" ||
          _rowdata.Sys_Prc_Processes_Status == "FinalRun"
        ) {
          if (gridButton.LanchedContextID == 1240003) {
            alert(
              "برای ورود به محیط طراحی مرحله مدل را در حالت Design قرار دهید "
            );
            return;
          }
        }
      }

      if (_rowdata.hasOwnProperty("ObjKey2")) {
        objKeys[0] = _rowdata.ObjKey2;
      }

      if (
        gridButton.LanchedPageID == 100009 ||
        gridButton.LanchedPageID == 100008 ||
        gridButton.LanchedPageID == 1000000
      ) {
        openPopupPage(
          gridButton.LanchedPageID,
          0,
          null,
          null,
          "Net,PadvishServers,Label",
          $Data,
          "Label"
        );
      } else {
        openPopupPage(gridButton.LanchedPageID, objKeys[0]);
      }
    }
  };

  lanchCellAction = function (gridColumn, objKey) {
    if (gridColumn.ActionOnCellClick == "openModalContext")
      openModalContext(
        _modalID + 1,
        gridColumn.LanchedContextID,
        gridColumn.ContextType,
        [objKey],
        0,
        _objType
      );

    if (gridColumn.ActionOnCellClick == "silentActivity")
      executeSilentActivity(
        gridColumn.LanchedContextID,
        [objKey],
        0,
        _contextIndex
      );
  };

  lanchCellChangeAction = function (col, objKey, changeval) {
    if (changeval == "") return;

    var activiyParams = new Array();

    var gridColumn = _gridColumns[col];

    activiyParams.push({
      ParamIndex: 0,
      ParamName: "Value",
      ParamValue: changeval,
      FileIsExist: 2,
      FileAttachCode: "",
    });

    if (gridColumn.ActionOnCellClick == "silentActivity")
      executeSilentActivity2(
        gridColumn.LanchedContextID,
        [objKey],
        activiyParams,
        _contextIndex
      );
  };

  smartSearch = function () {
    var smartSearch = "";

    $(".checkbox-smart-search").each(function (i, obj) {
      if (obj.checked) {
        smartSearch = smartSearch + "@" + obj.title;
      }
    });

    $$ParentContexts[_contextIndex].search(smartSearch).draw();
  };

  parseSearchValue = function (srcValue) {
    if (srcValue == null) return null;

    var arr = srcValue.split(" ");

    var smartSearch = "";

    $.each(arr, function (index, value) {
      value = value.trim();

      if (
        value != "" &&
        value != "ای" &&
        value != "اي" &&
        value != "های" &&
        value != "هاي" &&
        value != "شرکت" &&
        value != "سازمان" &&
        value != "اداره" &&
        value != "و"
      ) {
        smartSearch = smartSearch + "@" + value;
      }
    });

    return smartSearch;
  };

  checkRange = function (min, max, val, id) {
    if (val == "NA" || val == "") return true;

    if (isNaN(val)) {
      alert("محدود مجاز بین " + min + " تا " + max + "می باشد ");
      $("#txt-" + id).val("");
      return false;
    }

    if (parseInt(val) > parseInt(max) || parseInt(val) < parseInt(min)) {
      alert("محدود مجاز بین " + min + " تا " + max + " می باشد ");
      $("#txt-" + id).val("");
      return false;
    }

    return true;
  };
}
