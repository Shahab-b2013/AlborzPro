function Alerts(tmpAlertList, parentID, _objKey) {
  $(`.alertListDiv`).remove();
  let data = tmpAlertList;
  let strMalware = "";
  let indexClientName = 0;

  if (tmpAlertList[0].hasOwnProperty("AlertID"))
    indexClientName = tmpAlertList.length;

  let strClientName = "";

  tmpAlertList.forEach((item, index) => {
    if (index === tmpAlertList.length - 1) {
      if (item.ClientName) {
        if (item.Malware != "-")
          strMalware += `<li class=""  style="margin-left: 8px;">${item.Malware}</li>`;

        strClientName += item.ClientName;
      }
    } else {
      if (item.ClientName) {
        if (item.Malware != "-")
          strMalware += `<li class="" style="margin-left: 8px;">${item.Malware},</li>`;

        strClientName += item.ClientName;
      }
    }
  });

  let tmpColorArray = [];
  tmpAlertList.forEach((element) => {
    if (element.Color != undefined) {
      if (element.Color != "")
        tmpColorArray.push(element.Color.replaceAll("Alert", ""));
    }
  });
  let tmpColor = "";

  const tmpHighestColor = getHighestSeverityColor(tmpColorArray);

  if (tmpHighestColor != undefined) {
    tmpColor = tmpHighestColor;
    data.Color = tmpHighestColor;
  } else {
    tmpColor = data.Color;
  }

  let strAlertTh = "";
  let strAlertTd = "";
  tmpColor === "Yellow"
    ? "text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;"
    : "";

  updateIncidentColor(_objKey, tmpColor);

  for (const key in tmpAlertList[0]) {
    if (key != "ObjKey" && key != "requestDate" && key != "requestToken") {
      if (key == "Color") {
        strAlertTh += `<th style="width: 150px;"><input id="Allalert" type="checkbox" style="display: flex;text-align: left;margin-left: 20px;cursor:pointer" ></th>`;
      } else {
        strAlertTh += `<th>${key}</th>`;
      }
    }
  }

  //Alert List
  tmpAlertList.map((item, index) => {
    let indexId = item["AlertID"];
    for (const key in item) {
      if (key !== "ObjKey" && key !== "requestDate" && key !== "requestToken") {
        if (key == "Color") {
          let tmpPenColor =
            item[key].replaceAll("Alert", "") == "Yellow" ? "Black" : "White";

          let AlertColor = "";
          if (item[key].replaceAll("Alert", "") == "Yellow") {
            AlertColor = "AttentionFlag19";
          } else if (item[key].replaceAll("Alert", "") == "Orange") {
            AlertColor = "AttentionFlag20";
          } else if (item[key].replaceAll("Alert", "") == "Red") {
            AlertColor = "AttentionFlag21";
          } else if (item[key].replaceAll("Alert", "") == "Black") {
            AlertColor = "AttentionFlag22";
          }

          strAlertTd += `<tr  class="trHover">
                <td style="color:${tmpPenColor}"> 
                <div class="alertItemDiv">
                <input type="checkbox" id="generalCheckbox_${indexId}" class="generalCheckbox"/>
                <i id="generalDetailBtn_${indexId}" class="expand-collapse-btn glyphicon glyphicon-plus details-control btn-grid" style="cursor: pointer;margin: 0px 20px !important" onclick="toggleDiv(id)"></i>
                <img src="App_Res/Images/Page/24/${AlertColor}.png"></div>
                </div>
                </td>`;
        } else {
          let tmpStr = item[key];
          if (typeof tmpStr === "string" && tmpStr.includes("/Date("))
            strAlertTd += `<td class="ellipsis">${hasDateInStr(tmpStr)}</td>`;
          else strAlertTd += `<td class="ellipsis">${tmpStr}</td>`;
        }
      }
    }
    strAlertTd += "</tr>";
    strAlertTd += `<tr class="hidden"><td colspan="8" id="generalDetails_${indexId}" class="AlertDetails"></td></tr>`;
  });

  let strAlertTbl = `<table id="alertTable" class="table-bordered gridList incidentTable"><tr>${strAlertTh}</tr>${strAlertTd}</table>`;

  let _alert = `
        <div class="alertListDiv">
            <div class="col-lg-12 col-md-12 col-sm-12" style="padding:0px !important">
                <ul class="list-group" style="margin:15px 0px 0px 0px">
                    ${strMalware}
                    <li class="" style="margin-left: 8px;margin-bottom: 8px;margin-top: 8px;"> on ${indexClientName} Clients: ${strClientName} </li>
                </ul> 
            </div>
            <div class="" id="tabItems">
                <ul class="list-group tableUl">    
                    <li>  <button type="button" id="newAlertBtn" class="btn btn-sm btnClass  ${$HistoryIds[_objKey] != 6 ? "" : "hidden"
    }" style="margin-left: 5px;" >New</button> 
                        <button type="button" id="AddToBtn" class="btn btn-sm btnClass  ${$HistoryIds[_objKey] != 6 ? "" : "hidden"
    }">Add</button> 
                        <button type="button" id="MoveToBtn" class="btn btn-sm btnClass ${$HistoryIds[_objKey] != 6 ? "" : "hidden"
    }">Move To</button> 
                        <button type="button" id="expandAllBtn" class="btn btn-sm btnClass">Expand All</button  > 
                        <input type="text" id="alertsInput" onkeyup="SearchFNC('alertsInput' , alertTable)" placeholder="Search ..." title="Search from Table" style="width: 150px;font-size: 13px;margin: 0 5px;float: right;height: 29px;" class="form-control input-sm custom-input"> 
                    </li>      

                    ${strAlertTbl}
                    </ul>  
                    </div> 
                  
        </div>`;

  $(`#` + parentID).append(_alert);

  $("#Allalert").on("change", function () {
    $(".generalCheckbox").prop("checked", this.checked);
  });


  //New Action
  newAlertAction(parentID, _objKey)
  //Add Action
  addAction(parentID, _objKey);
  //Move Action
  moveToAction(parentID, _objKey);

  $("#expandAllBtn").click(function () {
    const isExpanding = $(this).text().trim() === "Expand All";

    $(this).text(isExpanding ? "Collapse All" : "Expand All");

    $(".expand-collapse-btn").each(function () {
      $(this).trigger("click");
    });
  });
}


function AlertDetails(_alertID) {
  const _data = new aData(6220001, null, +_alertID.split("_")[1], "");
  let tmp = _data.getList();

  const item = tmp[0];

  let html = `<ul class="list-group" style="margin-bottom:0px !important">`;

  const excludedKeys = new Set(["ObjKey", "requestDate", "requestToken"]);

  for (const [field, value] of Object.entries(item)) {
    if (excludedKeys.has(field)) continue;

    const isDate = isDateTime(value);
    const displayValue = isDate
      ? `${getTimeDifference(value)} (${hasDateInStr(value)})`
      : value;

    html += `
      <li class="smokeColor">
        <div class="titleValue">${field} :</div>${displayValue}
      </li>`;
  }

  html += `</ul>`;

  $(`#` + _alertID.replaceAll("Btn", "s")).append(html);
}

function AlertTbl(MessageMergeTo) {
  let rowsPerPage = parseInt($("#rowsPerPageSelect").val()) || 10;
  let currentPage = 1;
  let searchQuery = "";

  function getFilteredData() {
    return MessageMergeTo.filter((item) => {
      return Object.values(item).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  function renderTablePage(page, filteredData) {
    $("#alertTBL").empty();
    let start = (page - 1) * rowsPerPage;
    let end = start + rowsPerPage;
    let pagedData = filteredData.slice(start, end);

    let strMessageTh = `<th scope="row">
      <input id="selectAll" type="checkbox" style="display: flex;text-align: left;margin: 4px 0px 0px 25px;cursor:pointer"/>
    </th>`;

    let thList =
      pagedData.length > 0
        ? pagedData
        : [
          {
            AlertID: 0,
            ClientName: "",
            ClientIP: "",
            Malware: "",
            ClientDate: "",
            AlertDate: "",
          },
        ];

    for (const key in thList[0]) {
      if (!["ObjKey", "requestDate", "requestToken", "Color"].includes(key)) {
        strMessageTh += `<th>${key}</th>`;
      }
    }

    let strAlertTd = "";
    pagedData.forEach((item) => {
      let indexId = item["AlertID"];
      strAlertTd += `<tr class="trHover">`;

      for (const key in item) {
        if (!["ObjKey", "requestDate", "requestToken"].includes(key)) {
          if (key === "Color") {
            let raw = item[key].replaceAll("Alert", "");
            let AlertColor =
              {
                Yellow: "AttentionFlag19",
                Orange: "AttentionFlag20",
                Red: "AttentionFlag21",
                Black: "AttentionFlag22",
              }[raw] || "";

            let tmpPenColor = raw === "Yellow" ? "Black" : "White";

            strAlertTd += `<td style="color:${tmpPenColor}">
              <div class="alertItemDiv">
                <input type="checkbox" id="mergeCheckbox_${indexId}" class="mergeCheckbox" style="margin-left:0px;margin-right:5px;" />
                <i id="DetailBtn_${indexId}" class="expand-collapse-btn glyphicon glyphicon-plus details-control btn-grid"
                  style="cursor:pointer;margin:0px 20px;" onclick="toggleDiv('DetailBtn_${indexId}')"></i>
                <img src="App_Res/Images/Page/24/${AlertColor}.png">
              </div>
            </td>`;
          } else {
            let tmpStr = item[key];
            strAlertTd += `<td class="ellipsis">${typeof tmpStr === "string" && tmpStr.includes("/Date(")
                ? hasDateInStr(tmpStr)
                : tmpStr
              }</td>`;
          }
        }
      }

      strAlertTd += `</tr><tr class="hidden"><td colspan="10" id="Details_${indexId}" class="AlertDetails"></td></tr>`;
    });

    let tableHTML = `<table id="MessageTable" class="table-bordered gridList incidentTable">
      <tr>${strMessageTh}</tr>${strAlertTd}</table>`;

    $("#alertTBL").append(tableHTML);
    $("#selectAll").on("change", function () {
      $(".mergeCheckbox").prop("checked", this.checked);
    });

    renderPagination(filteredData);
  }

  function renderPagination(filteredData) {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (totalPages <= 1) {
      $("#pagination").remove();
      return;
    }

    let paginationHtml = "";

    // Prev button
    paginationHtml += `<button class="page-btn" data-page="${currentPage - 1
      }" ${currentPage === 1 ? "disabled" : ""}>Prev</button>`;

    const maxButtons = 7;
    let startPage, endPage;

    if (totalPages <= maxButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const middleButtons = maxButtons - 2;
      startPage = currentPage - Math.floor(middleButtons / 2);
      endPage = currentPage + Math.floor(middleButtons / 2);

      if (startPage < 2) {
        startPage = 2;
        endPage = startPage + middleButtons - 1;
      }
      if (endPage > totalPages - 1) {
        endPage = totalPages - 1;
        startPage = endPage - middleButtons + 1;
      }
    }

    // Show first page if not in loop
    if (startPage > 1) {
      paginationHtml += `<button class="page-btn ${currentPage === 1 ? "active" : ""
        }" data-page="1">1</button>`;
    }

    if (startPage > 2) {
      paginationHtml += `<span style="padding: 5px 10px;">...</span>`;
    }

    // Pages in middle
    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `<button class="page-btn ${i === currentPage ? "active" : ""
        }" data-page="${i}">${i}</button>`;
    }

    // Ellipsis before last page
    if (endPage < totalPages - 1) {
      paginationHtml += `<span style="padding: 5px 10px;">...</span>`;
    }

    // Show last page if not in loop
    if (endPage < totalPages) {
      paginationHtml += `<button class="page-btn ${currentPage === totalPages ? "active" : ""
        }" data-page="${totalPages}">${totalPages}</button>`;
    }

    // Next button
    paginationHtml += `<button class="page-btn" data-page="${currentPage + 1
      }" ${currentPage === totalPages ? "disabled" : ""}>Next</button>`;

    $("#pagination").remove();
    $("#alertTBL").append(
      `<div id="pagination" class="pagination">${paginationHtml}</div>`
    );

    $(".page-btn").click(function () {
      const targetPage = parseInt($(this).data("page"));
      if (targetPage >= 1 && targetPage <= totalPages) {
        currentPage = targetPage;
        renderTablePage(currentPage, getFilteredData());
        renderPagination(getFilteredData());
      }
    });
  }

  $("#searchBtn")
    .off("keyup")
    .on("keyup", function () {
      searchQuery = $(this).val();
      currentPage = 1;
      renderTablePage(currentPage, getFilteredData());
    });

  $("#rowsPerPageSelect")
    .off("change")
    .on("change", function () {
      rowsPerPage = parseInt($(this).val());
      currentPage = 1;
      renderTablePage(currentPage, getFilteredData());
    });

  renderTablePage(currentPage, getFilteredData());
  $("#alertModal").css("display", "block");
}

function loadAlert(parentID, _objKey) {
  const loadAlertPromise = new Promise((resolve, reject) => {
    let _data = new aData(6220000, null, _objKey, "", true);

    let timer = setInterval(() => {
      let value = _data.getList();
      if (value && value.length > 0) {
        clearInterval(timer);
        resolve(value);
      }
    }, 1);
  });

  loadAlertPromise.then((val) => {
    $loading.hide();
    Alerts(val, parentID, _objKey);
    $(`#btn-refresh`).click();
    $("#closeBtnModal1").trigger("click");
    $(`#${_objKey}_timeline`).trigger("click");
    $(`#Alert-tab`).trigger("click");
    tabOnActiion("Alert-tab", "Alert-" + _objKey);
  });
}
