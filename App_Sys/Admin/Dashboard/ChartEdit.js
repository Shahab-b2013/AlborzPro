/* Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.0.0*/

"use strict";
let chartSvg;
var $QueryValue = "";
var $CurrentChart_ID = "";
var SERIES = [];
var $categorylabelFDM = [];
var $aggregationsObjFDM = {};

function chartEdit(key, objThis) {
  let id;
  if (key == "btn") {
    id = $("#" + $(objThis).parent().parent().attr("id") + " img").attr("id");
    $CurrentChart_ID = id;
  } else if (key == "popup") {
    id = objThis;
    $CurrentChart_ID = objThis;
  }

  let chart = {};
  for (const i in CHARTS) {
    if (CHARTS[i].ID == id) chart = { ...CHARTS[i] };
  }
  if (Object.keys(chart).length) {
    TEMPORARYCHART = chart;
  } else {
    TEMPORARYCHART = {
      ID: id,
      Query: "",
    };
  }

  TEMPORARYCHART2 = { ...TEMPORARYCHART };

  // remove z-index
  $(`.form-group-body`).css("z-index", "0");

  // Get img
  SERIES = [];

  let imgid = id;
  CHARTTYPE = $("#" + imgid).attr("type");

  //create modal form
  HideModal();
  ModalConstractor("70%", "content");

  //header
  $(`#chartModal`).append(
    `<div style="display:flex;align-items: center;"><span class="glyphicon glyphicon-stats"></span><label style="margin: 0px 5px;
    font-size: 17px;">${dashResources.get(
      "chart"
    )}</label></div><hr style="width: 100%;height: 1px;margin-top: 10px;margin-bottom: 0px;border-top: 2px solid #ccc;">`
  );
  $(`#chartModal`).append(
    `<div class="head_activi"><label class="radioLbl">${dashResources.get(
      "chartDesign"
    )}</label></div>`
  );

  //content
  $(`#chartModal`).append('<div id="contentM" class="col-md-12"></div>');
  $("#contentM").append(
    '<div id="div1" class="row col-lg-4 col-md-4 col-sm-12" style=""></div>' +
      '<div id="div2" class="col-lg-8 col-md-8 col-sm-12" style=""><div id="containers"></div></figure></div>'
  );

  //footer
  $(`#chartModal`).append('<div id="chartModalSub"></div>');

  //load chart and items
  let ArrLbl;
  if (CHARTTYPE != "progress_circle") {
    ArrLbl = [
      dashResources.get("chartTitle"),
      dashResources.get("dataTable"),
      dashResources.get("rowTitle"),
      dashResources.get("colTitle"),
      dashResources.get("grouping"),
      dashResources.get("seriesType"),
      dashResources.get("dataSeries"),
    ];
  } else {
    ArrLbl = [
      dashResources.get("chartTitle"),
      dashResources.get("dataTable"),
      dashResources.get("rowTitle"),
      dashResources.get("colTitle"),
      dashResources.get("basedata"),
      dashResources.get("seriesType"),
      dashResources.get("dataSeries"),
    ];
  }

  //chart analyse
  $aggregationsObjFDM = {};
  let findChart = CHARTS.find((Element) => Element.ID == imgid);
  if (findChart) {
    for (let i = 0; i < findChart.CategoryQuery.length; i++)
      $categorylabelFDM.push(Object.values(findChart.CategoryQuery[i])[0]);
    $aggregationsObjFDM = findChart.Aggregations;
  }

  let ArrItems = [];
  if (findChart) {
    if (findChart.Series.length)
      findChart.Series.map((value) => SERIES.push(value));
    ArrItems = [
      findChart.Text,
      findChart.CommandText,
      findChart.CategoryLabel,
      findChart.ValueLabel,
      findChart.CategoryExpression,
      findChart.SeriesType,
      findChart.Series,
    ];
  } else {
    ArrItems = ["", "", "", "", "", "", "", ""];
  }
  //create items and value
  let count = CHARTTYPE == "table" ? 2 : ArrLbl.length;
  for (let i = 0; i < count; i++) {
    if (
      CHARTTYPE == "pie" ||
      CHARTTYPE == "polar" ||
      CHARTTYPE == "progress_circle"
    ) {
      if (i != 2 && i != 3) {
        divItems(i);
        label(i, ArrLbl[i]);
      }
    } else {
      divItems(i);
      label(i, ArrLbl[i]);
    }

    if (i == 1) {
      textBox(i, ArrItems[i] != "" ? "Filled" : "Empty");
      $QueryValue = ArrItems[i];
      $("#item-1").css("padding", "0px 15px");
      $("#item-1").css("direction", "ltr");
      $("#item-1").attr("disabled", true);
      $("#div1Items-" + i).append(
        `<i id="CommandTextBtn-${i}" onclick="CommandText(${i})" class="CommandTextBtn glyphicon glyphicon-option-vertical" style="color:#000;cursor:pointer;margin:0"></i>`
      );
    } else if (i == 4) {
      $("#div1Items-" + i).append(
        '<select class="col-md-8 selectBox" id="item-' + i + '"></select>'
      );
      $CategoryQuery = findChart != undefined ? findChart.CategoryQuery : [];
      selectCategory("item-4");

      if (ArrItems[i].replaceAll(".", "-"))
        $("#item-" + i).val(ArrItems[i].replaceAll(".", "-"));

      // option set by query builer
    } else if (i == 5) {
      selectList(i, ArrItems[i]);
    } else if (i == 6) {
      //serie Data Name
      let seriesName = "";
      if (SERIES.length > 0) {
        seriesName = SERIES[0].Text;
        for (let i = 1; i < SERIES.length; i++)
          seriesName += " , " + SERIES[i].Text;
      }
      textBox(i, seriesName);
      $("#item-6").css("padding", "0px 15px");
      $("#item-6").attr("disabled", true);
      $("#item-6").val(seriesName);
      $("#div1Items-" + i).append(
        `<i id="CommandTextBtn-${i}" onclick="SeriesFn(id)" class="CommandTextBtn glyphicon glyphicon-option-vertical" style="color:#000;cursor:pointer;margin:0"></i>`
      );
    } else {
      if (
        CHARTTYPE == "pie" ||
        CHARTTYPE == "polar" ||
        CHARTTYPE == "progress_circle"
      ) {
        if (i != 2 && i != 3) {
          textBox(i, ArrItems[i]);
        }
      } else {
        textBox(i, ArrItems[i]);
      }
    }
  }
  //row
  function divItems(i) {
    let div1Items =
      '<div id="div1Items-' +
      i +
      '" class="col-md-12 divItems_ChartEdit" style=""></div>';
    $("#div1").append(div1Items);
  }

  //label
  function label(i, value) {
    let lbl = document.createElement("label");
    lbl.innerText = value;
    lbl.className = "lbl col-md-4";
    $("#div1Items-" + i).append(lbl);
  }

  //text Box
  function textBox(i, value) {
    let textBox = document.createElement("input");
    textBox.type = "text";
    textBox.className = "col-md-8 TextboxEditChart";
    textBox.setAttribute("id", "item-" + i);

    textBox.value = value;
    $("#div1Items-" + i).append(textBox);
  }

  //select box
  function selectList(i, selected) {
    let Select_List = '<select class="col-md-8 selectBox" id="item-' + i + '">';
    if (
      CHARTTYPE == "pie" ||
      CHARTTYPE == "polar" ||
      CHARTTYPE == "progress_circle"
    ) {
      Select_List += '<option value="Simple">Simple</option>';
    } else {
      Select_List +=
        '<option value="Simple">Simple</option>' +
        '<option value="ColumnGroup">ColumnGroup</option>' +
        '<option value="Stack">Stack</option>' +
        "</select>";
    }
    $("#div1Items-" + i).append(Select_List);

    selected ? $("#item-" + i).val(selected) : $("#item-" + i).val("Simple");
  }

  if (CHARTTYPE == "table") {
    document.getElementById("item-0").addEventListener("input", (e) => {
      $("#table_head").html($("#item-0").val());
    });
  } else if (CHARTTYPE == "progress_circle") {
    document.getElementById("item-0").addEventListener("change", (e) => {
      // $("#progress_pie_title").text($("#item-0").val());
      showChart(CHARTTYPE);
    });
  } else {
    document.getElementById("item-0").addEventListener("change", (e) => {
      // _TitleOptions.title.text = $("#item-0").val();
      showChart(CHARTTYPE);
    });
  }

  if (
    CHARTTYPE != "pie" &&
    CHARTTYPE != "table" &&
    CHARTTYPE != "polar" &&
    CHARTTYPE != "progress_circle"
  ) {
    document.getElementById("item-3").addEventListener("change", () => {
      _YAxisOptions.title.text = $("#item-3").val();
      showChart(CHARTTYPE);
    });

    document.getElementById("item-2").addEventListener("change", () => {
      _XAxisOptions.title.text = $("#item-2").val();
      showChart(CHARTTYPE);
    });

    document.getElementById("item-5").addEventListener("input", (e) => {
      if ($("#" + e.target.id).val() == "Stack") {
        _ColumnPlotOptions.dataLabels.formatter = function () {
          return this.point.percentage.toFixed(0) + "%";
        };

        _ColumnPlotOptions.dataLabels.format = "%" + "{y}";

        _ColumnPlotOptions.stacking = "percent";
      } else {
        _ColumnPlotOptions.dataLabels.format = "{y}";

        _ColumnPlotOptions.stacking = "";
      }
      showChart(CHARTTYPE);
    });
    //for load
    _YAxisOptions.title.text = $("#item-3").val();
    _XAxisOptions.title.text = $("#item-2").val();
    _TitleOptions.title.text = $("#item-0").val();
  }

  CHARTTYPE == "table" ? showTable() : showChart(CHARTTYPE);
  //============================btn=====================
  // create btn

  //btnsubmit

  let Submit = btnSubmit("#chartModalSub", dashResources.get("save"));
  let img_svgID;

  // دکمه ذخیره در مودال اول که های چارت داره
  Submit.onclick = () => {
    let _RowID, _ColumnIndex, _Base64, myPromise;
    let bool = true;

    if ($("#item-0").val() == "") {
      $("#item-0").css("border", "1px solid #e30505");
      bool = false;
    } else {
      $("#item-0").css("border", "1px solid #ccc");
    }
    if ($("#item-1").val() == dashResources.get("Empty")) {
      $("#item-1").css("border", "1px solid #e30505");
      bool = false;
    } else {
      $("#item-1").css("border", "1px solid #ccc");
    }

    if ($("#item-6").val() == "") {
      $("#item-6").css("border", "1px solid #e30505");
      bool = false;
    } else {
      $("#item-6").css("border", "1px solid #ccc");
    }
    if (bool) {
      if (CHARTTYPE != "table") {
        _RowID = +$("#" + imgid)
          .parent()
          .parent()[0]
          .id.replaceAll("form-group-", "");
        let par = $("#" + imgid).parent()[0].id;

        _ColumnIndex = $("#" + par).attr("ColumnIndex");

        let svg_xml;
        if (CHARTTYPE == "progress_circle") {
          svg_xml = chartSvg.getSVG();
          const index = svg_xml.indexOf("</div>") + 6;
          svg_xml = svg_xml.slice(index);
          // get items
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(svg_xml, "text/xml");
          img_svgID = xmlDoc
            .getElementsByTagName("clipPath")[0]
            .getAttribute("id");

          // Adding font family style attribute to change image text fonts
          let svgElement = xmlDoc.getElementsByTagName("svg")[0];
          svgElement.setAttribute(
            "style",
            "font-family: 'IRANSansWeb'; font-size: 12px;"
          );

          // Serialize XML back into a string for render
          let serializer = new XMLSerializer();
          svg_xml = serializer.serializeToString(svgElement);

          // get base64
          myPromise = new Promise(function (myResolve, myReject) {
            _Base64 = Base64.encode(svg_xml, false);
            if (_Base64 != "") {
              myResolve(_Base64);
            } else {
              myReject("error");
            }
          });
        } else {
          svg_xml = chartSvg.getSVG();
          const index = svg_xml.indexOf("</div>") + 6;
          svg_xml = svg_xml.slice(index);

          // get items
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(svg_xml, "text/xml");
          img_svgID = xmlDoc
            .getElementsByTagName("clipPath")[0]
            .getAttribute("id");

          // Adding font family style attribute to change image text fonts
          let svgElement = xmlDoc.getElementsByTagName("svg")[0];
          svgElement.setAttribute(
            "style",
            "font-family: 'IRANSansWeb'; font-size: 12px;"
          );

          // Serialize XML back into a string for render
          let serializer = new XMLSerializer();
          svg_xml = serializer.serializeToString(svgElement);

          // get base64
          myPromise = new Promise(function (myResolve, myReject) {
            _Base64 = Base64.encode(svg_xml, false);
            if (_Base64 != "") {
              myResolve(_Base64);
            } else {
              myReject("error");
            }
          });
        }
      } else if (CHARTTYPE == "table") {
        _RowID = +$("#" + imgid)
          .parent()
          .parent()[0]
          .id.replaceAll("form-group-", "");

        img_svgID = imgid.replaceAll("chart-defaultId-", "table-");

        let par = $("#" + imgid).parent()[0].id;

        _ColumnIndex = $("#" + par).attr("ColumnIndex");

        let svg_xml = $("#div2")[0];

        myPromise = new Promise(function (myResolve, myReject) {
          html2canvas(svg_xml, {
            scale: 3,
          })
            .then(function (canvas) {
              const dataUrl = canvas.toDataURL();
              let _Base64 = dataUrl.split(",")[1];
              if (_Base64 != "") {
                myResolve(_Base64);
              } else {
                myReject("error");
              }
            })
            .catch(function (error) {
              myReject(error);
            });
        });
      }

      TEMPORARYCHART = { ...TEMPORARYCHART2 };

      //remove oldItem by id
      if (findChart) {
        CHARTS.splice(
          CHARTS.findIndex((Element) => Element.ID == imgid),
          1
        );
      }
      $aggregationsObj = {};
      myPromise.then(
        function (value) {
          _Base64 = value;
          $CurrentChart_ID = img_svgID;
          TEMPORARYCHART.ID = img_svgID;

          // Extract values from all options in item-4
          const options = $("#item-4 option");
          let aggregationsObj = {};
          options.each(function () {
            const optionValue = $(this).attr("columnName");
            const aggregationValue = $(this).attr("operation") || ""; // Assign a default value if the attribute is not present
            aggregationsObj[optionValue] = aggregationValue; // Correct key assignment
          });

          CHARTS.push({
            RowID: +_RowID,
            ColumnIndex: +_ColumnIndex,
            ID: img_svgID,
            Name: $("#item-0").val(),
            CommandText: $QueryValue,
            Text: $("#item-0").val(),
            Type: CHARTTYPE,
            CategoryLabel: $("#item-2").val(),
            ValueLabel: $("#item-3").val(),
            CategoryName: $("#item-4 option:selected").text(), // Or any specific option's text if needed
            CategoryExpression: $("#item-4 option:selected")
              .val()
              .replaceAll("-", "."), // Or any specific option's value if needed
            CategoryQuery: $CategoryQuery,
            Aggregations: aggregationsObj, // Use the constructed object of operators and expressions
            SeriesType: $("#item-5 option:selected").val(),
            Series: SERIES,
            ImgBs64: _Base64,
            Query: TEMPORARYCHART.Query,
            GroupingLevel: _Grouping_level,
            ReportSchema: _ReportSchema,
          });

          _YAxisOptions.title.text = "";
          _XAxisOptions.title.text = "";
          _TitleOptions.title.text = "";

          // Update chart to form
          CHARTTYPE != "table"
            ? $("#" + imgid).attr("src", "data:image/svg+xml;base64," + _Base64)
            : $("#" + imgid).attr("src", "data:image/png;base64," + _Base64);
          $("#" + imgid).attr("id", img_svgID);
          $("#rowbtn-img-" + imgid).attr("id", "rowbtn-img-" + img_svgID);
          HideModal();
        },
        function (error) {
          alert(error);
        }
      );
    }
  };

  //btn exit
  let Exit = btnExit("#chartModalSub");
  Exit.onclick = () => {
    HideModal();
  };

  //close rowbtn
  $("#rowbtn-img-" + img_svgID).css("display", "none");
}

function showChart(chartType) {
  switch (chartType) {
    case "column":
      chartItems(series(), chartType);
      break;
    case "pie":
      chartItems(series(), chartType);
      break;
    case "progress_circle":
      chartItems(series(), chartType);
      break;
    case "bar":
      chartItems(series(), chartType);
      break;
    case "line":
      chartItems(series(), chartType);
      break;
    case "areaspline":
      chartItems(series(), chartType);
      break;
    case "polar":
      chartItems(series(), chartType);
      break;
  }

  //create chart function
  function chartItems(_series, chartType) {
    _GeneralOptions.type = chartType;

    if ($("#item-5").val() == "Stack") {
      _ColumnPlotOptions.dataLabels.formatter = function () {
        return this.point.percentage.toFixed(0) + "%";
      };
      _ColumnPlotOptions.dataLabels.format = "%" + "{y}";
      _ColumnPlotOptions.stacking = "percent";
    }

    _LegendOptions.labelFormatter();

    //for spiderWeb
    if (_GeneralOptions.type == "polar") {
      _GeneralOptions.polar = true;
    } else {
      _GeneralOptions.polar = false;
    }

    if (_GeneralOptions.type == "pie") {
      _GeneralOptions.options3d.enabled = true;
      _LegendOptions.enabled = true;
    } else {
      _GeneralOptions.options3d.enabled = false;
      _LegendOptions.enabled = false;
    }

    _TitleOptions.title = {
      align: "center",
      text: $("#item-0").val(),
    };

    if (CHARTTYPE === "progress_circle") {
      _ExportingOptions.allowHTML = false;
      chartSvg = Highcharts.chart("containers", {
        title: {
          text: _title,
          align: "center",
        },
        subtitle: _SubtitleOptions,

        credits: _CreditsOptions,

        legend: _LegendOptions,

        exporting: _ExportingOptions,

        tooltip: _TooltipOptions,

        xAxis: _XAxisOptions,

        yAxis: _YAxisOptions,

        plotOptions: {
          pie: _ProgressPlotOptions,
        },
        colors: _circleColor,
        series: _series,
      });
    } else {
      chartSvg = Highcharts.chart("containers", {
        chart: _GeneralOptions,

        colors: _ColorsOptions,

        credits: _CreditsOptions,

        exporting: _ExportingOptions,

        legend: _LegendOptions,

        title: _TitleOptions.title,

        tooltip: _TooltipOptions,

        xAxis: _XAxisOptions,

        yAxis: _YAxisOptions,

        plotOptions: {
          series: _SeriesPlotOptions,
          areaspline: _AreaPlotOptions,
          bar: _BarPlotOptions,
          column: _ColumnPlotOptions,
          line: _LinePlotOptions,
          pie: _PiePlotOptions,
        },
        series: _series,
      });
    }
  }

  function series() {
    let _series = [];
    if (CHARTTYPE == "progress_circle") {
      let title = $("#item-0").val() != "" ? $("#item-0").val() : "عنوان";
      if (SERIES.length > 0) {
        for (let i = 0; i < SERIES.length; i++) {
          (_title = title),
            _series.push({
              data: [
                // Array containing data points for the chart
                {
                  name: "",
                  y: 8, // Value associated with the first data point
                },
                {
                  name: "", // Name of the second data point
                  y: 5, // Value associated with the second data point
                },
              ],
              type: CHARTTYPE == "progress_circle" ? "pie" : SERIES[i].PlotType,
            });
          _circleColor = [SERIES[i].StyleColor, "#f1f1f1"];
        }
      } else {
        (_title = title),
          _series.push({
            type: "pie",
            name: "Value",
            data: [
              // Array containing data points for the chart
              {
                name: "",
                y: 8, // Value associated with the first data point
              },
              {
                name: "", // Name of the second data point
                y: 5, // Value associated with the second data point
              },
            ],
          });
        _circleColor = ["#1344d8", "#f1f1f1"];
      }
    } else {
      if (SERIES.length > 0) {
        for (let i = 0; i < SERIES.length; i++) {
          _series.push({
            name: SERIES[i].Text,
            data: [
              {
                name: "Value 1",
                y: 5,
              },
              {
                name: "Value 2",
                y: 8,
              },
              {
                name: "Value 3",
                y: 9,
              },
              {
                name: "Value 4",
                y: 7,
              },
              {
                name: "Value 5",
                y: 2,
              },
              {
                name: "Value 6",
                y: 1,
              },
            ],
            color: SERIES[i].StyleColor,
            type: CHARTTYPE == "polar" ? "area" : SERIES[i].PlotType,
          });
        }
      } else {
        _series.push({
          name: "Default",
          data: [
            {
              name: "Value 1",
              y: 5,
            },
            {
              name: "Value 2",
              y: 8,
            },
            {
              name: "Value 3",
              y: 9,
            },
            {
              name: "Value 4",
              y: 7,
            },
            {
              name: "Value 5",
              y: 2,
            },
            {
              name: "Value 6",
              y: 1,
            },
          ],
          color: "#1344d8",
          type: CHARTTYPE == "polar" ? "area" : CHARTTYPE,
        });
      }
    }
    return _series;
  }
}

function showTable() {
  let title = $("#item-0").val();
  let divGrid =
    '<div class="" style="height:300px !important;text-align: center;border-bottom:1px solid #ccc;margin-bottom:10px;display:contents;"><span style="padding: 5px 0;background-color: #ebebeb;display:block;font: 19px var(--mainFont);" id="table_head">' +
    (title == "" ? "عنوان" : title) +
    "</span>" +
    '<table  class="table  table-bordered">' +
    "<thead>" +
    "<tr>" +
    '<th scope="col">ردیف</th>' +
    '<th scope="col">ستون 1</th>' +
    '<th scope="col">ستون 2</th>' +
    '<th scope="col">ستون 3</th>' +
    "</tr>" +
    '</thead><tbody id="series_tbody" >';
  for (let i = 1; i < 4; i++) {
    divGrid +=
      "<tr>" +
      "<td>" +
      i +
      "</td>" +
      "<td>ستون 1" +
      "</td>" +
      "<td>ستون 2" +
      "</td>" +
      "<td>ستون 3 " +
      "</td>" +
      "</tr>";
  }

  divGrid += "</tbody></table ></div>";
  $("#containers").append(divGrid);

  $("#div2").attr("class", "col-md-8");
  $("#div1").attr("class", "col-md-4");
  $("#item-0").css("width", "");
  $("#containers").css("margin-top", "5px");
}

// Category From Query
function selectCategory(id) {
  // Clear the existing options in the select element with the given id
  $("#" + id).empty();
  // Check if $QueryValue is not empty
  if ($QueryValue !== "") {
    let Select_List = "";
    let DashboardReportRef;

    $.ajax({
      type: "POST",
      url: "../../App_Sys/Services/Admin/DashboardReport.asmx/GetDesign",
      data: "",
      contentType: false,
      async: false,
      dataType: "xml",
      processData: false,
      error: function (jqXHR, textStatus, errorThrown) {
        alert(JSON.stringify(jqXHR));
      },
      success: function (data) {
        // Parse the XML response to get the dashboard report reference data
        DashboardReportRef = JSON.parse(
          data.getElementsByTagName("string")[0].childNodes[0].nodeValue
        );
      },
    });
    // Determine which operator array to use (prefer $aggregationsObjFDM if it is not empty)
    let aggregationsObj = Object.keys($aggregationsObjFDM).length
      ? $aggregationsObjFDM
      : Object.keys($aggregationsObj).length
      ? $aggregationsObj
      : {};

    for (let j = 0; j < $CategoryQuery.length; j++) {
      let added = false;
      const currentCategory = $CategoryQuery[j];

      // Check if currentCategory is defined
      if (currentCategory !== undefined) {
        // Get the operator value for the current category query
        let aggregationValue =
          aggregationsObj[currentCategory] !== undefined
            ? aggregationsObj[currentCategory]
            : "";

        for (let k = 0; k < DashboardReportRef.RefColumns.length; k++) {
          // Change ProcessCategory name to prevent duplicate
          let columnsNames = DashboardReportRef.RefColumns[k].Exprssion;
          let column = columnNameChanger(columnsNames);

          if (column === currentCategory) {
            let split = columnsNames.split(".");
            Select_List += `<option value="${split[0]}_${split[1]}" columnName="${column}" operation="${aggregationValue}">${aggregationValue} ${DashboardReportRef.RefColumns[k].Label}</option>`;
            added = true;
            break; // Exit the inner loop since we found a match
          }
        }

        if (!added) {
          Select_List += `<option test value="${currentCategory}" columnName="${currentCategory}" operation="${aggregationValue}">${aggregationValue} ${currentCategory}</option>`;
        }
      }
    }

    // Append the generated options to the select element
    $("#" + id).append(Select_List);
  }
}

// start progress_circle chart
function progressCircle(
  title,
  base_text,
  base_value,
  progress_text,
  progress_value,
  _color
) {
  $("#containers").html(`
        <div class="col-md-12 d-flex justify-content-center align-items-cente">
          <div>
            <p id="progress_pie_title" class="mt-3 d-flex  justify-content-center  align-items-cente"></p>
            <div id="circles-2"></div>
            <ul role="list" style="list-style: none;" class="mt-3">
              <li><span id="fw-bold" class="highcharts-background"></span></li>
              <li><span id="fw-bold-2" class="fw-bold mt-3 mb-0"></span></li>
            </ul>            
          </div>
        </div>
      `);

  //for load
  WebFont.load({
    google: { families: ["Lato:300,400,700,900"] },
    custom: {
      families: [
        "Flaticon",
        "Font Awesome 5 Solid",
        "Font Awesome 5 Regular",
        "Font Awesome 5 Brands",
        "simple-line-icons",
      ],
    },
    active: function () {
      sessionStorage.fonts = true;
    },
  });

  //create chart
  $("#progress_pie_title").text(title == "" ? "عنوان" : title);
  Circles.create({
    id: "circles-2",
    radius: 100,
    value: progress_value,
    maxValue: 100,
    width: 15,
    text: base_value,
    colors: ["#f1f1f1", _color],
    duration: 1100,
    wrpClass: "circles-wrp",
    textClass: "circles-text",
    styleWrapper: true,
    styleText: true,
  });
  $("#fw-bold").text(progress_text + ": " + base_value);
  $("#fw-bold-2").text(base_text + ": " + progress_value + " %");
}
