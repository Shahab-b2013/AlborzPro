// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
/* Release Ferdos.WebAppDesk 4.4.0.0*/

function openPopupPage(
  pageID,
  objKey,
  defContextID,
  defContextType,
  searchKey,
  searchVal,
  searchLbl
) {
  if (pageID == "$$DefDsbPageID") {
    pageID = $$DefDsbPageID;
  }

  if (
    pageID != 101000 &&
    pageID != 102000 &&
    pageID != 103001 &&
    pageID != 103000 &&
    pageID != 104000 &&
    pageID != 106000
  ) {
    jQuery.redirect(
      "MainDesk.aspx",
      {
        id: pageID,
        objKey: objKey,
        targetContextId: defContextID,
        targetContextType: defContextType,
        searchKey: searchKey,
        searchVal: searchVal,
        searchLbl: searchLbl,
        authKey: "n/a",
      },
      "GET",
      "_blank"
    );
  } else {
    if (pageID == 101000) {
      jQuery.redirect(
        "App_Rpt/ReportDesk.aspx",
        {
          id: 101000,
          objKey: objKey,
        },
        "GET",
        "_blank"
      );
    }
    if (pageID == 102000) {
      if (objKey > 0) {
        jQuery.redirect(
          "App_Dgr/DashboardDesigner.aspx",
          {
            id: 102000,
            objKey: objKey,
          },
          "GET",
          "_blank"
        );
      } else {
        alert(
          "Default dashboard are not customizable.\n\rYou can create and customize a new dashboard.\n\rYou can only disable or enable default dashboards."
        );
      }
    }
    if (pageID == 103000) {
      jQuery.redirect(
        "App_Dgr/ReportDesigner.aspx",
        {
          id: 103000,
          objKey: objKey,
        },
        "GET",
        "_blank"
      );
    }
    if (pageID == 103001) {
      jQuery.redirect(
        "App_Dgr/QueryDesigner.aspx",
        {
          id: 103001,
          objKey: objKey,
        },
        "GET",
        "_blank"
      );
    }
    if (pageID == 104000) {
      jQuery.redirect(
        "App_Dgr/ProcessDesigner.aspx",
        {
          id: 104000,
          objKey: objKey,
        },
        "GET",
        "_blank"
      );
    }
    if (pageID == 106000) {
      jQuery.redirect(
        "App_Dgr/EntityDesigner.aspx",
        {
          id: 106000,
          objKey: objKey,
        },
        "GET",
        "_blank"
      );
    }
  }
}

function redirectPage(pageID, objKey, defContextType, defContextID) {
  if (
    $(window).width() <= $.AdminLTE.options.screenSizes.sm - 1 &&
    $("body").hasClass("sidebar-open")
  ) {
    $("body").removeClass("sidebar-open");
  }

  if (pageID == "$$DefDsbPageID") {
    pageID = $$DefDsbPageID;
  }

  if (pageID) {
    var $page = new page(pageID, objKey);

    if (!defContextType) {
      defContextType = {};
    }

    if (!defContextID) {
      defContextID = {};
    }

    $page.renderPage(false, null, defContextType, defContextID);

    setTimeout("alignSideBarHeight();", 1 * 100);
  }
}

function renderPage(elementID, pageID, objKey) {


  if (pageID == "$$DefDsbPageID") {
    pageID = $$DefDsbPageID;
  }

  if (pageID) {
    var $page = new page(pageID, objKey);

    $page.renderPage(false, elementID, {}, {});

    setTimeout("alignSideBarHeight();", 1 * 100);
  }
}

function renderActivityContext(
  elementID,
  actContextID,
  contextType,
  objKey,
  objType
) {
  if (contextType == "FormView")
    renderForm(elementID, actContextID, objKey, objType);

  if (contextType == "ChartView" || contextType == "ChartListView")
    renderChart(elementID, actContextID, objKey);

  if (contextType == "CheckListView")
    renderCheckList(elementID, actContextID, objKey, objType);

  if (contextType == "CustomView")
    renderCustom(elementID, actContextID, objKey);

  if (contextType == "DetailListView")
    renderDetailList(elementID, actContextID, objKey);

  if (contextType == "DetailView")
    renderDetail(elementID, actContextID, objKey);

  if (contextType == "GadgetView")
    renderGadget(elementID, actContextID, objKey);

  if (contextType == "GridView")
    renderGrid(elementID, actContextID, objKey, objType);

  if (contextType == "TreeView") renderTree(elementID, actContextID, objKey);

  if (contextType == "GeoMapView")
    renderGeoMap(elementID, actContextID, objKey);

  if (contextType == "AlertMapView")
    renderGeoAlertMap(elementID, actContextID, objKey);

  setTimeout("alignSideBarHeight();", 1 * 100);

  $Data = null;
}

function renderActivityContext2(
  elementID,
  actContextID,
  contextType,
  objKey,
  objType
) {
  if (contextType == "GridView")
    renderGrid2(elementID, actContextID, objKey, objType);
}

function renderReportContext(elementID, rptContextID, objKey) {
  var $reportView = new reportView(rptContextID, objKey);

  $reportView.renderContext(elementID);
}

function openModalContext(
  modalID,
  actContextID,
  contextType,
  objKeys,
  parObjKey,
  parObjType,
  parContextID
) {
  $("#boxBodyModal" + modalID).html(
    '<img src="../App_Res/Images/Ajax/AjaxLoader.gif" class="ajaxloader" />'
  );

  $("#actContextModal" + modalID).modal({
    backdrop: false,
  });

  $("#actContextModal" + modalID).modal("show");

  if (contextType == "FormView")
    renderModalForm(
      modalID,
      actContextID,
      parContextID,
      objKeys,
      parObjType,
      parObjKey
    );

  if (contextType == "CheckFormView")
    renderModalCheckForm(modalID, actContextID, parContextID, parObjKey);

  if (contextType == "CheckListView")
    renderModalCheckList(modalID, actContextID, parObjKey);

  if (contextType == "TimeLineView")
    renderModalTimeLine(modalID, actContextID, parObjKey);

  if (contextType == "GridView")
    renderModalGrid(modalID, actContextID, parObjKey, parObjType, null);
}

function openTModalContext(
  modalID,
  actContextID,
  contextType,
  objKeys,
  parObjKey,
  parObjType,
  parContextID,
  taskID
) {
  $("#boxBodyModal" + modalID).html(
    '<img src="../App_Res/Images/Ajax/AjaxLoader.gif" class="ajaxloader" />'
  );

  $("#actContextModal" + modalID).modal({
    backdrop: false,
  });

  $("#actContextModal" + modalID).modal("show");

  if (contextType == "FormView")
    renderTModalForm(
      modalID,
      actContextID,
      parContextID,
      objKeys,
      parObjType,
      parObjKey,
      taskID
    );
}

function executeSilentActivity(
  activityID,
  objectIDs,
  parObjKey,
  _parContextID
) {
  var data = new FormData();

  var __objKeys = objectIDs;

  var activiyParams = new Array();

  activiyParams.push({
    ParamIndex: 0,
    ParamName: "ParentObjectID",
    ParamValue: parObjKey,
    FileIsExist: 2,
    FileAttachCode: "",
  });

  data.append("activiyParams", JSON.stringify(activiyParams));

  data.append("objectIDs", JSON.stringify(__objKeys));

  data.append("id", activityID);

  var $aExecutor = new saExecutor(data, _parContextID);

  $aExecutor.submit();
}

function executeSilentActivity2(
  activityID,
  objectIDs,
  activiyParams,
  _parContextID
) {
  var data = new FormData();

  var __objKeys = objectIDs;

  data.append("activiyParams", JSON.stringify(activiyParams));

  data.append("objectIDs", JSON.stringify(__objKeys));

  data.append("id", activityID);

  var $aExecutor = new saExecutor(data, _parContextID);

  $aExecutor.submit();
}

//#region Render Form Functions.........

function renderForm(elementID, actContextID, objKey, parObjType) {
  var $formView = new formView(actContextID, objKey);

  $formView.renderContext(elementID, parObjType, objKey);
}

function renderModalForm(
  modalID,
  actContextID,
  parContextID,
  objKeys,
  parObjType,
  parObjKey
) {
  var $formView = new formView(actContextID, objKeys);

  $formView.renderModalContext(modalID, parContextID, parObjType, parObjKey);
}

function renderTModalForm(
  modalID,
  actContextID,
  parContextID,
  objKeys,
  parObjType,
  parObjKey,
  taskID
) {
  var $formView = new formView(actContextID, objKeys, taskID);

  $formView.renderModalContext(modalID, parContextID, parObjType, parObjKey);
}

//#endregion

//#region Render Chart Functions........

function renderChart(elementID, actContextID, objKey) {
  var $chartView = new chartView(actContextID, objKey);

  $chartView.renderContext(elementID);
}

//#endregion

//#region Render CheckForm Functions....

function renderModalCheckForm(modalID, actContextID, parContextID, parObjKey) {
  var $checkFormView = new checkFormView(actContextID);

  $checkFormView.renderModalContext(modalID, parContextID, parObjKey);
}

//#endregion

//#region Render CheckList Functions....

function renderCheckList(elementID, actContextID, parObjKey, parObjType) {
  var $checkListView = new checkListView(actContextID);

  $checkListView.renderContext(elementID, parObjKey, parObjType);
}

function renderModalCheckList(modalID, actContextID, parObjKey) {
  var $checkListView = new checkListView(actContextID);

  $checkListView.renderModalContext(modalID, parObjKey);
}

//#endregion

//#region Render Custom Functions.......

function renderCustom(elementID, actContextID, objKey) {
  var $customView = new customView(actContextID, objKey);

  $customView.renderContext(elementID);
}

//#endregion

//#region Render DetailList Functions...

function renderDetailList(elementID, actContextID, parObjKey) {
  var $detailListView = new detailListView(actContextID, parObjKey);

  $detailListView.renderContext(elementID);
}

//#endregion

//#region Render Detail Functions.......

function renderDetail(elementID, actContextID, objKey) {
  var $detailView = new detailView(actContextID, objKey);

  $detailView.renderContext(elementID);
}

//#endregion

//#region Render Gadget Functions.......

function renderGadget(elementID, actContextID, objKey) {
  var $gadgetView = new gadgetView(actContextID, objKey);

  $gadgetView.renderContext(elementID);
}

//#endregion

//#region Render Grid Functions.........

function renderGrid(elementID, actContextID, objKey, objType) {
  var $gridView = new gridView(actContextID, objKey, objType);

  $AdvancedSearch = [];

  $gridView.renderContext(elementID);
}

function renderGrid2(elementID, actContextID, objKey, objType) {
  var $gridView = new gridView(actContextID, objKey, objType);

  $gridView.renderContext(elementID);
}

function renderModalGrid(
  modalID,
  actContextID,
  objKey,
  objType,
  defaultSearch
) {
  var $gridView = new gridView(actContextID, objKey, objType);

  $gridView.renderModalContext(modalID, defaultSearch);
}

function renderModalGridWithContext(
  modalID,
  actContextID,
  objKey,
  objType,
  defaultSearch
) {
  $("#boxBodyModal" + modalID).html(
    '<img src="../App_Res/Images/Ajax/AjaxLoader.gif" class="ajaxloader" />'
  );

  $("#actContextModal" + modalID).modal({
    backdrop: false,
  });

  $("#actContextModal" + modalID).modal("show");

  var $gridView = new gridView(actContextID, objKey, objType);

  $gridView.renderModalContext(modalID, defaultSearch);
}

//#endregion

//#region Render Tree Functions.........

function renderTree(elementID, actContextID, objKey) {
  var $treeView = new treeView(actContextID, objKey);

  $treeView.renderContext(elementID);
}

//#endregion

//#region Render TimeLine Functions.......

function renderModalTimeLine(modalID, actContextID, parObjKey) {
  var $timeLineView = new timeLineView(actContextID, parObjKey);

  $timeLineView.renderModalContext(modalID);
}

//#endregion

//#region Render Map Functions............

function renderGeoMap(elementID, actContextID, objKey) {
  var $gMapView = new gMapView(actContextID, objKey);

  $gMapView.renderContext(elementID);
}

function renderGeoAlertMap(elementID, actContextID, objKey) {
  var $gMapView = new gAlertMapView(actContextID, objKey);

  $gMapView.renderContext(elementID);
}

//#endregion

function openModalTable(
  modalID,
  actContextID,
  contextType,
  objKeys,
  parObjKey,
  parObjType,
  parContextID
) {
  $("#boxBodyModal" + modalID).html(
    '<img src="../App_Res/Images/Ajax/AjaxLoader.gif" class="ajaxloader" />'
  );

  $("#actContextModal" + modalID).modal({
    backdrop: false,
  });

  $("#actContextModal" + modalID).modal("show");

  var $tableView = new tableView(actContextID, parObjKey, parObjType);

  $tableView.renderModalContext(modalID, "");
}

function openModalCalendar(
  modalID,
  actContextID,
  contextType,
  objKeys,
  parObjKey,
  parObjType,
  parContextID
) {
  $("#boxBodyModal" + modalID).html(
    '<img src="../App_Res/Images/Ajax/AjaxLoader.gif" class="ajaxloader" />'
  );

  $("#actContextModal" + modalID).modal({
    backdrop: false,
  });

  $("#actContextModal" + modalID).modal("show");

  var $calendarView = new calendarView(actContextID, parObjKey, parObjType);

  $calendarView.renderModalContext(modalID, "");
}

function openModalCalendar2(year, month, employeeId, employeeLabel) {
  var _monthNames = [
    "",
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  _openModalCalendar(
    _monthNames[$.trim(month)],
    $.trim(year),
    "CountIssues",
    employeeId,
    employeeLabel
  );
}
