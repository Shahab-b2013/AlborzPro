// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
/* Release Ferdos.WebAppDesk 4.2.1.0*/

var $$ParentContexts = [];

var $$FormItems = [];

var $$FormGroups = [];

var $$AjaxSelects = [];

var $$PageParams = {};

var $$DataTable;

var $$UserProp = {};

var $$DF = {};

var $$Local = {};

var $$Page = {};

var $$Intervals = [];

var $$Charts = [];

var $Data;

var $SearchKey;

var $SearchVal;

var $SearchLbl;

var $$DefDsbPageID = 1000000;

var $PageLabel;

var $PForm = { Name: "", Label: "", FormId: "", TaskId: "" };

var $HistoryIds = {};

var $$ErrorDiv =
  '<div class="error-page" style="direction:ltr">' +
  '<div class="error-content">' +
  '<h3  style="font-family: \'IRANSansWeb\'"><i class="fa fa-warning text-red" style="position:relative;display:inline"></i>Operation error.</h3>' +
  "<p  style=\"font-family: 'IRANSansWeb'\">#message" +
  "</p></div>";

var _modalID = 0;

var _showTopMenu = false;

function page(id, key) {
  var _pageId = id;

  var _pageKey = key;

  var _pageOptions;

  var _pageData;

  var _pageLayout;

  var _pageActivities;

  var _sectionElementId;

  var _defContextType;

  var _defContextId;

  var _objType = null;

  var _pageLabel = "";

  var _page = null;

  this.renderPage = function (
    withMasterPage,
    sectionElementID,
    defContextID,
    defContextType,
    searchKey,
    searchVal,
    searchLbl
  ) {
    //#region Load Page Metadata

    cachedPage = localStorage.getItem(window.btoa("page$" + _pageId));

    if (true || !cachedPage || sectionElementID != null) {
      _page = new iComData("page", _pageId, sectionElementID, withMasterPage);

      _page = _page.getData();

      $$Page = _page;

      if (sectionElementID == null) {
        if (parseInt(_pageId) < 200000) {
          //anonymous pages is not cached such as register

          localStorage.setItem(
            window.btoa("page$" + _pageId),
            reverse(encodeURI(JSON.stringify($$Page)))
          );
        }
      }
    } else {
      _page = jQuery.parseJSON(decodeURI(reverse(cachedPage)));

      $$Page = _page;
    }

    _sectionElementId = sectionElementID;

    _defContextType = defContextType;

    _defContextId = defContextID;

    _pageOptions = _page.options;

    //#endregion

    //#region Render Page Menu's

    if (
      withMasterPage &&
      _pageOptions.Type != "EntityProfile" &&
      _pageOptions.Name != "ApproveMissionReport"
    ) {
      try {
        if ($$UserProp.MasterRole.indexOf("پرسنل سازمان") === -1)
          $("#tasksIcon").parent().removeClass("hidden");

        // $.ajax({
        //   type: "POST",
        //   url: "../../App_Sys/Services/CustomActivity.asmx/GetIssueCount",
        //   data: '', // Wrap the object in another JSON object
        //   contentType: "application/json; charset=utf-8",
        //   dataType: "",
        //   success: function (data) {
        //       if(data.d == 0)
        //           $("#issueCount").addClass("hidden")
        //       else
        //       $("#issueCount").removeClass("hidden")
        //       $("#issueCount").text(data.d)

        //   },
        //   error: function (jqXHR, textStatus, errorThrown) {
        //   alert(errorThrown)
        //   },
        // });

        // $.ajax({
        //   type: "POST",
        //   url: "../../App_Sys/Services/CustomActivity.asmx/GetTaskCount",
        //   data: '', // Wrap the object in another JSON object
        //   contentType: "application/json; charset=utf-8",
        //   dataType: "",
        //   success: function (data) {
        //       if(data.d == 0)
        //           $("#taskCount").addClass("hidden")
        //       else
        //       $("#taskCount").removeClass("hidden")
        //       $("#taskCount").text(data.d)
        //   },
        //   error: function (jqXHR, textStatus, errorThrown) {
        //   alert(errorThrown)
        //   },
        // });

        $("#issueIcon").on("click", () => {
          $("#tool-item-1001000001").removeClass("active");
          $("#tool-item-1001000002").removeClass("active");
          $("#tool-item-1001000003").addClass("active");
        });
        $("#tasksIcon").on("click", () => {
          $("#tool-item-1001000001").removeClass("active");
          $("#tool-item-1001000003").removeClass("active");
          $("#tool-item-1001000002").addClass("active");
        });

        $(document).ready(function () {
          // Initialize tooltips
          $('[data-toggle="tooltip"]').tooltip();

          // Apply custom width to tooltips
          $('[data-custom-tooltip="true"]').tooltip({
            template:
              '<div class="tooltip custom-tooltip" role="tooltip"><div class="tooltip-inner"></div></div>',
          });
        });

        _pageNavigations = _page.navigations;

        var headerMenuBarObj = filterList(
          _pageNavigations,
          "Type",
          "HeaderMenuBar"
        )[0];

        var $headerMenuBar = new headerMenuBar(headerMenuBarObj);

        $headerMenuBar.renderContext("headerMenuBar");

        var sideTreeMenuObj = filterList(
          _pageNavigations,
          "Type",
          "SideTreeMenu"
        )[0];

        var $sideTreeMenu = new sideTreeMenu(sideTreeMenuObj);

        $sideTreeMenu.renderContext("sideTreeMenu");

        var notifierBarObj = filterList(
          _pageNavigations,
          "Type",
          "NotifierMenuBar"
        )[0];

        var $notifierBar = new notifierBar(notifierBarObj);

        $notifierBar.renderContext("notifierBar");

        var topMenuBarObj = filterList(
          _pageNavigations,
          "Type",
          "TopMenuBar"
        )[0];

        var $topMenuBar = new topMenuBar(topMenuBarObj);

        $topMenuBar.renderContext("topMenuBar");
      } catch (e) {
        jQuery.redirect("../Error.aspx", {}, "GET", "");
      }
    }

    //#endregion

    if (_pageId == "0") {
      return;
    }

    //#region Reset Page Content & Variables & Set Page Metadata

    if (_sectionElementId == null) {
      //render page in main section

      $("#page-content").html("");
    } else {
      $(_sectionElementId).html("");
    }

    //#region reset variables

    $$ParentContexts = [];

    $$DataTable = null;

    $$PageParams = {};

    $Data = null;

    $SearchKey = searchKey;

    $SearchVal = searchVal;

    $SearchLbl = searchLbl;

    $$Charts = [];

    //#endregion

    //#region reset intervals

    for (var i = 0; i < $$Intervals.length; i++) {
      clearTimeout($$Intervals[i]);
    }
    $$Intervals = [];

    //#endregion

    try {
      //#region load special pages

      //Entity Profile
      if (_pageOptions.Type == "EntityProfile") {
        _objType = _pageOptions.Name.replace("Report", "ID");

        if (_objType.indexOf("#") > 0) _objType = _objType.split("#")[0];

        _objType = _objType.replace("Profile", "ID");

        _objType = _objType.replace("Edit", "");

        _pageData = new iObjectData(_objType, _pageKey);

        if (_pageData.getError() != null) {
          raiseError(_pageData.getError());

          return;
        }

        _pageData = _pageData.getObject();

        if (_pageData.Label == "") {
          _pageData.Label = $PageLabel;
        } else {
          $PageLabel = _pageData.Label;
        }

        _pageLabel =
          ' <span class="fa fa-angle-double-right"></span> <b style="font-size:14px">' +
          _pageData.Label +
          "</b>";
      }

      //#endregion

      //#region set page header

      if (parseInt(_pageId) < 200000) {
        $("#page-title").text(
          $("#PageTitle").val() +
            " | " +
            _pageOptions.Label.replace(/#/g, " > ")
        );
      }

      if (jQuery.parseJSON(_pageOptions.HeaderVisible)) {
        $(".content-header").css("display", "block");

        if ($$Lang == "Fa") {
          $("#page-header").html(
            '<span class="fa fa-angle-double-left"></span>&nbsp;&nbsp;' +
              _pageOptions.Label.replace(
                /#/g,
                "&nbsp;&nbsp;<span class='fa fa-angle-double-left'></span>&nbsp;&nbsp;"
              ) +
              "&nbsp;" +
              _pageLabel
          );
        } else {
          $("#page-header").html(
            '<span class="fa fa-angle-double-right"></span>&nbsp;&nbsp;' +
              _pageOptions.Label.replace(
                /#/g,
                "&nbsp;&nbsp;<span class='fa fa-angle-double-right'></span>&nbsp;&nbsp;"
              ) +
              "&nbsp;" +
              _pageLabel
          );
        }
      } else {
        $(".content-header").css("display", "none");
      }

      //#endregion
    } catch (e) {
      raiseError(e);

      return;
    }

    //#region set page settings

    if (
      _pageOptions.PageTemplateID != "" &&
      _sectionElementId == null &&
      _pageId != 101000
    ) {
      _pageActivities = _page.activitySettings;

      _pageContexts = _page.contextSettings;
    }

    //#endregion

    _pageLayout = _page.layouts;

    //#endregion

    //#region Render Page Layout

    try {
      var rows = filterList(_pageLayout, "ParentElementID", "");

      $.each(rows, function (index, row) {
        if (_sectionElementId == null) {
          //render page in main section

          $("#page-content").append(
            '<div class="row row-centered" id="page-row-' +
              row.ElementID +
              '"></div>'
          );
        } else {
          $(_sectionElementId).append(
            '<div class="row row-centered" id="page-row-' +
              row.ElementID +
              '"></div>'
          );
        }

        renderRowSection(row.ElementID);
      });
    } catch (e) {
      raiseError(e);

      return;
    }

    //#endregion

    $("#page-content").css("height", "");

    $(".knob").knob();
  };

  renderCellSection = function (cellID) {
    var elements = filterList(_pageLayout, "ParentElementID", cellID);

    var css = "";

    var content = "";

    var render = true;

    var _RedirectPageID = sessionStorage.getItem("_RedirectPageID");

    $.each(elements, function (index, element) {
      render = true;

      //#region Render Row

      if (jQuery.parseJSON(element.HasRenderCondition)) {
        render = false;

        var renderConditions = new iData(
          "54fac42a-f4b2-4c55-bdb4-1654b592fd49",
          element.ElementID
        );

        var ruleCondition = renderConditions.getObject();

        if (
          ruleCondition.ParamValues.indexOf(
            "[" + $$PageParams[ruleCondition.ParamName] + "]"
          ) != -1
        ) {
          render = true;
        }
      }

      if (element.Type == "Row" && render) {
        $("#page-cell-" + cellID).append(
          '<div class="row row-centered" id="page-row-' +
            element.ElementID +
            '"></div>'
        );

        renderRowSection(element.ElementID);
      }

      //#endregion

      //#region Render Section

      if (element.Type == "Section") {
        if (element.ElementID == 1000603) {
          element.StyleBorder =
            element.StyleBorder + "border: 1px solid #e6e9ed !important;";
        }

        $("#page-cell-" + cellID).append(
          '<div class="section" id="page-cell-' +
            element.ElementID +
            '" style="' +
            element.StyleBorder +
            element.StylePadding +
            element.StyleMargin +
            element.StyleBackground +
            '"></div>'
        );

        renderCellSection(element.ElementID);
      }

      //#endregion

      //#region Render ActivityBox

      if (element.Type == "ActivityBox") {
        css = element.Style;

        if (_pageId >= 1000000) {
          element.StyleBorder =
            element.StyleBorder +
            "box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.1)!important;";
        }

        content =
          '<div class="box box-' +
          css +
          "" +
          (element.DefaultVisibility == "none" ? " collapsed-box" : "") +
          '" style="' +
          element.StyleBorder +
          element.StyleHeight +
          element.StyleDirection +
          '" id="page-box-' +
          element.ElementID +
          '" >';

        var backButton = "";
        if (jQuery.parseJSON(element.HeaderVisible)) {
          var onClickBackAction = "";

          //Cartable

          if (element.PageID != "")
            sessionStorage.setItem("_RedirectPageID", element.PageID);

          let TabID = sessionStorage.getItem("tabID");

          onClickBackAction = `redirectPage(${_RedirectPageID}, 0);renderPage('#page-cell-1000605', ${_RedirectPageID}, 0);$('.nav-tabs a[href=&quot;${TabID}&quot;]').tab('show');$('.nav-tabs li').removeClass('active');$('#tool-item-' + ${TabID}).attr('class','active');`;

          if (element.ElementID == 1000104) {
            backButton =
              '<span class="m-1" style="color:var(--A1);cursor:pointer;font-size: 20px" onclick="' +
              onClickBackAction +
              '"><i class="fa fa-reply fa-solid"></i></span>';
          }

          content +=
            '<div class="box-header with-border" id="box-header-' +
            element.ElementID +
            '" style="' +
            element.StyleAlign +
            '">' +
            '<div class="d-flex align-items-center gadgetTitle"><i class="fa fa-solid fa-bars"></i><h3 class="box-title">' +
            element.Label +
            "</h3></div>" +
            '<div class="box-tools pull-right">' +
            backButton +
            '<button class="btn btn-box-tool" data-widget="collapse" onclick="setTimeout(\'alignSideBarHeight();\', 1 * 500);"><i class="fa fa-' +
            (element.DefaultVisibility == "none" ? "caret-down" : "caret-up") +
            '"></i></button>' +
            "</div>" +
            "</div>";
        }

        content +=
          '<div class="box-body" id="box-body-' +
          element.ElementID +
          '" style="' +
          element.StyleAlign +
          ";display:" +
          element.DefaultVisibility +
          ';">' +
          '<img src="../App_Res/Images/Ajax/AjaxLoader.gif" class="ajaxloader" />' +
          "</div>";

        if (jQuery.parseJSON(element.FooterVisible)) {
          content +=
            '<div class="box-footer" id="box-footer-' +
            element.ElementID +
            '" style="display:' +
            element.DefaultVisibility +
            ';"></div>';
        }

        content += "</div>";

        $("#page-cell-" + cellID).append(content);
        if (_pageId === 1001002) {
          $(".box-header").hide();
        } else {
          $(".box-header").show();
        }
        if (_pageOptions.PageTemplateID != "" && _sectionElementId == null) {
          if (element.ContextTemplateName != "") {
            if (
              _defContextId.hasOwnProperty(
                element.ContextTemplateName.replace("@", "")
              )
            ) {
              renderActivityContext(
                element.ElementID,
                _defContextId[element.ContextTemplateName.replace("@", "")],
                _defContextType[element.ContextTemplateName.replace("@", "")],
                [_pageKey],
                _objType
              );
            } else {
              renderActivityContext(
                element.ElementID,
                _pageActivities[element.ContextTemplateName],
                _pageContexts[element.ContextTemplateName],
                [_pageKey],
                _objType
              );
            }
          }
        } else {
          renderActivityContext(
            element.ElementID,
            element.ActivityContextID,
            element.ContextType,
            [_pageKey],
            _objType
          );
        }
      }

      //#endregion

      //#region Render ReportBox

      if (element.Type == "ReportBox") {
        var reportID;

        if (element.ContextTemplateName == "") {
          reportID = element.ReportID;

          $("#page-cell-" + cellID).append(
            '<div class="row"><div class="col-md-12"><div class="collapse navbar-collapse report-toolbar"  id="reportToolbar-' +
              element.ReportID +
              '"></div></div></div><div class="row"><div class="col-md-12"><div id="reportViewer-' +
              element.ReportID +
              '"></div></div></div>'
          );
        } else {
          var reportID = _pageKey;

          if (_defContextId !== undefined && $.isArray(_defContextId)) {
            reportID =
              _defContextId[element.ContextTemplateName.replace("@", "")];
          }

          $("#page-cell-" + cellID).append(
            '<div class="row"><div class="col-md-12"><div class="collapse navbar-collapse report-toolbar"  id="reportToolbar-' +
              reportID +
              '"></div></div></div><div class="row"><div class="col-md-12"><div id="reportViewer-' +
              reportID +
              '"></div></div></div>'
          );
        }

        renderReportContext(element.ElementID, reportID, _pageKey);
      }

      //#endregion

      //#region Render CustomBox

      if (element.Type == "CustomBox") {
        css = element.Style;

        content =
          '<div class="box box-' +
          css +
          '" style="' +
          element.StyleBackground +
          element.StyleBorder +
          element.StyleHeight +
          element.StyleDirection +
          '" id="page-box-' +
          element.ElementID +
          '" >';

        content +=
          '<div class="box-body" id="box-body-' +
          element.ElementID +
          '" style="' +
          element.StyleAlign +
          '">' +
          element.CustomContent +
          "</div>";
        content += "</div>";

        $("#page-cell-" + cellID).append(content);
      }

      //#endregion
    });
  };

  renderRowSection = function (rowID) {
    var cells = filterList(_pageLayout, "ParentElementID", rowID);

    $.each(cells, function (index, cell) {
      $("#page-row-" + rowID).append(
        '<div class="' +
          cell.Style +
          ' col-centered" id="page-cell-' +
          cell.ElementID +
          '"></div>'
      );

      renderCellSection(cell.ElementID);
    });
  };
}

function alignSideBarHeight() {
  $("#sideBar").css("min-height", $(".wrapper").outerHeight());
}

function raiseError(e, contextID) {
  if (!contextID) {
    $("#page-content").html($$ErrorDiv.replace("#message", e));
  } else {
    if (contextID.indexOf("#") >= 0) {
      $(contextID).html($$ErrorDiv.replace("#message", e));
    } else {
      $("#" + contextID).html($$ErrorDiv.replace("#message", e));
    }
  }

  alert(e.stack);
}

window.document.oncontextmenu = function () {
  return true;
};
