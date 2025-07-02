/* Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.0.0*/

function SeriesFn() {
  if ($CategoryQuery.length) {
    let div =
      '<div id="myModalSeries" class="modal" style="padding-top: 150px;">' +
      '<div id="seriesModal" class="modal-content">' +
      `<div id="contentSeries"  style="display:flex"><span class="fa fa-line-chart" style="font-size:18px;"></span><label style="margin: 0px 5px;
    font-size: 17px;">${dashResources.get(
      "dataSeries"
    )}</label></div><hr style="width: 100%;height: 1px;margin-top: 10px;margin-bottom: 5px;border-top: 2px solid #ccc;
    ">` +
      "</div>" +
      "</div>";
    $("#myModal").append(div);

    $("#myModalSeries").css("display", "block");
    $("#seriesModal").css("width", "60%");
    //todo

    let divGrid =
      '<div class="" style="height:300px !important;border-bottom:1px solid #ccc;margin-bottom:10px;display:contents;">' +
      '<div id="btnAddTolistDiv" style="position:relative;"><button id = "btnAddTolist" class="btn btn-success" ' +
      'style = "margin-bottom:15px;padding:5px;width:85px;height:34px;display: flex;justify-content: center;align-items: center;' +
      'background-color: #00a65a !important;border-color: #008d4c !important;color:#ffffff!important;background-image:linear-gradient(to bottom, #00a65a 0%, #00a65a 100%)  !important" onclick="Form_Add_Series(id)">' +
      `<i class="glyphicon glyphicon-plus-sign" style="margin:5px;"></i>${dashResources.get(
        "add"
      )}</button></div>` +
      '<table table  class="table table-bordered" > ' +
      "<thead>" +
      "<tr>" +
      `<th scope="col">${dashResources.get("row")}</th>` +
      `<th scope="col">${dashResources.get("title")}</th>` +
      `<th scope="col">${dashResources.get("dataField")}</th>`;
    if (CHARTTYPE != "pie")
      divGrid += `<th scope="col">${dashResources.get("color")}</th>`;
    divGrid +=
      `<th scope="col">${dashResources.get("type")}</th>` +
      `<th scope="col">${dashResources.get("operations")}</th>` +
      "</tr>" +
      '</thead><tbody id="series_tbody" ></tbody></table></div>';
    $("#seriesModal").append(divGrid);

    //onload list
    if (SERIES.length > 0) {
      let serrieID = 0;
      $.each(SERIES, function (index, item) {
        item.ID == undefined ? serrieID++ : (serrieID = item.ID);
        let a = item.DataExpression.split("_");
        let translatedExpr = item.TranslatedExpression;
        let item_Exprestion = a[0];
        for (let x = 1; x < a.length; x++)
          x == a.length - 1
            ? (item_Exprestion += "." + a[x])
            : (item_Exprestion += "_" + a[x]);

        let DashboardReportRef;
        let item_DataExpression = "";
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
            DashboardReportRef = JSON.parse(
              data.getElementsByTagName("string")[0].childNodes[0].nodeValue
            );
          },
        });
        for (let k = 0; k < DashboardReportRef.RefColumns.length; k++) {
          if (DashboardReportRef.RefColumns[k].Exprssion == item_Exprestion) {
            item_DataExpression = DashboardReportRef.RefColumns[k].Label;
            break;
          }
        }

        if (item_DataExpression == "") item_DataExpression = item_Exprestion;
        let tbody =
          "<tr>" +
          '<td scope="row">' +
          serrieID +
          "</td>" +
          '<td scope="row">' +
          item.Text +
          "</td>" +
          '<td scope="row">' +
          translatedExpr +
          "</td>";
        if (CHARTTYPE != "pie")
          tbody +=
            '<td scope="row"><span style="color:' +
            item.StyleColor +
            '" class="fa fa-square"></span></td>';
        tbody +=
          '<td scope="row">' +
          item.PlotType +
          "</td>" +
          '<td scope="row" style="display: flex;justify-content: center;">' +
          '<span id="Series_Delete_' +
          item.ID +
          `" class="btn btn-danger span" style="margin: 0px 5px;color:#ffffff !important;background-color: #dd4b39 !important;border-color: #d73925 !important;background-image: linear-gradient(to bottom, transparent 0%, transparent 100%) !important;" onclick="Series_Deleted(id)"><i class="glyphicon glyphicon-remove" ></i>${dashResources.get(
            "delete"
          )}</span>` +
          '<span id="Series_Edit_' +
          item.ID +
          `" class="btn btn-info span" onclick="Series_Edited(id)"><i class="glyphicon glyphicon-edit" style="margin: 0px 5px;" ></i>${dashResources.get(
            "edit"
          )}</span>` +
          "</td>" +
          "</tr>";

        $("#series_tbody").append(tbody);
      });
      //only 1 serie
      if (
        CHARTTYPE == "pie" ||
        CHARTTYPE == "polar" ||
        CHARTTYPE == "progress_circle"
      ) {
        if ($("table tr").length - 1 == 1)
          $("#btnAddTolist").attr("disabled", "disabled");
      }
    }

    //btnsubmit
    $(`#seriesModal`).append('<div id="seriesModalDIv"></div>');
    let Submit = btnSubmit("#seriesModalDIv", dashResources.get("ok"));
    Submit.onclick = () => {
      //Save

      function getExprestion(_Category) {
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
            DashboardReportRef = JSON.parse(
              data.getElementsByTagName("string")[0].childNodes[0].nodeValue
            );
          },
        });

        const keywordPrefixMap = {
          مجموع: "SUM_",
          میانگین: "AVG_",
          کوچکترین: "MIN_",
          بزرگترین: "MAX_",
          تعداد: "COUNT_",
        };

        let prefixToAdd = "";

        // Check for keywords in _Category and set the prefix
        for (let keyword in keywordPrefixMap) {
          if (_Category.includes(keyword)) {
            prefixToAdd = keywordPrefixMap[keyword]; // Get the corresponding prefix
            break; // No need to check further if one is found
          }
        }

        // Loop through RefColumns to find a match
        for (let k = 0; k < DashboardReportRef.RefColumns.length; k++) {
          if (
            DashboardReportRef.RefColumns[k].Label.split("فرآیند-")[1] ==
            _Category.trim().split("فرآیند-")[1]
          ) {
            let split = DashboardReportRef.RefColumns[k].Exprssion.split(".");
            return `${prefixToAdd}${split[0]}_${split[1].replaceAll(".", "_")}`;
          }
        }

        // If no match found, remove any existing keywords from _Category
        if (prefixToAdd) {
          // Create a regex pattern from the keywords
          const keywordsPattern = new RegExp(
            Object.keys(keywordPrefixMap).join("|"),
            "g"
          );
          // Remove keywords from _Category
          const cleanedCategory = _Category.replace(keywordsPattern, "").trim();
          return `${prefixToAdd}${cleanedCategory}`;
        }

        return _Category; // Return _Category if no prefix was added
      }


      $("table tr").each(function (index, item) {
        if (index == 0) {
          SERIES = [];
        } else {
          let _StyleColor;
          let _PlotType;
          let _ID = +$(this).find("td").eq(0).html();
          let _Text = $(this).find("td").eq(1).html();
          let _Name = objkeysCategory($(this).find("td").eq(2).html());
          let _DataExpression = getExprestion($(this).find("td").eq(2).html());
          let _TranslatedExpression = $(this).find("td").eq(2).html();
          if (CHARTTYPE != "pie") {
            _StyleColor = rgb2hex(
              $(this).find("td").eq(3).find("span:first").css("color")
            );
            _PlotType = $(this).find("td").eq(4).html();
          } else {
            _PlotType = $(this).find("td").eq(3).html();
          }

          SERIES.push({
            ID: _ID,
            Text: _Text,
            Name: _Name,
            DataExpression: _DataExpression,
            TranslatedExpression: _TranslatedExpression,
            StyleColor: _StyleColor,
            PlotType: _PlotType,
          });
        }
      });
      if (SERIES.length > 0) {
        //serie name1,name2,...
        let name = "";
        name = SERIES[0].Text;
        if (SERIES.length > 1)
          for (let i = 1; i < SERIES.length; i++)
            name += " , " + SERIES[i].Text;
        $("#item-6").val(name);

        //set color charts
        _LinePlotOptions.color = SERIES[0].StyleColor;
        _AreaPlotOptions.color = SERIES[0].StyleColor;
        _BarPlotOptions.color = SERIES[0].StyleColor;
        _ColumnPlotOptions.color = SERIES[0].StyleColor;
      } else {
        $("#item-6").val("");
      }
      //close modal
      $("#myModalSeries").remove();

      showChart(CHARTTYPE);
    };

    //btn exit
    let Exit = btnExit("#seriesModalDIv");
    Exit.onclick = () => {
      $("#myModalSeries").remove();
    };
  } else {
    swal(`${dashResources.get("EmptyDataTable")}`, {
      icon: "warning",
      buttons: {
        confirm: `${dashResources.get("ok")}`,
      },
    });
  }
}

function Form_Add_Series(Mode, id) {
  let div =
    '<div id="Add_Series" class="modal" style="padding-top: 190px;">' +
    '<div id="Add_seriesModal" style="padding: 10px 25px;" class="modal-content">' +
    `<div id="Add_contentSeries" style="display:flex;align-items: center;"><span id="span_Add_contentSeries" class="fa fa-plus" style="font-size:18px;"></span><label id="lbl_Add_contentSeries" style="margin: 0px 5px;` +
    `font-size: 17px;">${dashResources.get(
      "newSeries"
    )}</label></div><hr style="width: 100%;height: 1px;margin-top: 10px;margin-bottom: 5px;border-top: 2px solid #ccc;">` +
    "</div>" +
    "</div>";
  $("#myModalSeries").append(div);

  $("#Add_Series").css("display", "block");
  $("#Add_seriesModal").css("width", "31%");
  let form =
    '<div class="" style="border-bottom:1px solid #ccc">' +
    `<div class="DisSeriesItem"><label class="lblSeries">${dashResources.get(
      "title"
    )} </label><input type="text" id="text1" class="TextboxSeries"></div>` +
    `<div class="DisSeriesItem"><label class="lblSeries">${dashResources.get(
      "dataField"
    )} </label><select class="selectBox" id="select3Selectbox" ></select></div>`;

  if (CHARTTYPE == "pie") {
    form +=
      `<div class="DisSeriesItem"><label class="lblSeries">${dashResources.get(
        "title"
      )} </label><select id="PlotType" class="selectBox" >` +
      `<option value="pie">${dashResources.get(
        "pie"
      )} </option></select></div>`;
  } else if (CHARTTYPE == "progress_circle") {
    form +=
      `<div class="DisSeriesItem"><label class="lblSeries">${dashResources.get(
        "color"
      )} </label><input type="color" id="inputColor"></div>` +
      `<div class="DisSeriesItem"><label class="lblSeries">${dashResources.get(
        "type"
      )} </label><select id="PlotType" class="selectBox" >` +
      `<option value="progress_circle">${dashResources.get(
        "progress_circle"
      )} </option></select></div>`;
  } else if (CHARTTYPE == "polar") {
    form +=
      `<div class="DisSeriesItem"><label class="lblSeries">${dashResources.get(
        "color"
      )} </label><input type="color" id="inputColor"></div>` +
      `<div class="DisSeriesItem"><label class="lblSeries">${dashResources.get(
        "type"
      )} </label><select id="PlotType" class="selectBox" >` +
      `<option value="area">${dashResources.get(
        "polar"
      )} </option></select></div>`;
    //CHARTTYPE = "area";
  } else if (CHARTTYPE == "bar") {
    form +=
      `<div class="DisSeriesItem"><label class="lblSeries">${dashResources.get(
        "color"
      )} </label><input type="color" id="inputColor"></div>` +
      `<div class="DisSeriesItem"><label class="lblSeries">${dashResources.get(
        "type"
      )} </label><select id="PlotType" class="selectBox" >` +
      `<option value="bar">${dashResources.get(
        "bar"
      )} </option></select></div>`;
  } else {
    form +=
      `<div class="DisSeriesItem"><label class="lblSeries">${dashResources.get(
        "color"
      )} </label><input type="color" id="inputColor"></div>` +
      `<div class="DisSeriesItem"><label class="lblSeries">${dashResources.get(
        "type"
      )} </label><select id="PlotType" class="selectBox" >` +
      `<option  value="column">${dashResources.get("column")} </option>` +
      `<option  value="line">${dashResources.get("line")} </option>` +
      `<option  value="areaspline">${dashResources.get(
        "areaspline"
      )} </option></select></div></div>`;
  }

  $("#Add_seriesModal").append(form);

  selectCategory("select3Selectbox");

  $("#PlotType").val(CHARTTYPE == "polar" ? "area" : CHARTTYPE);

  //btnsubmit
  $(`#Add_seriesModal`).append('<div id="insertSeries" ></div>');
  let Submit = btnSubmit("#insertSeries", dashResources.get("insert"));
  if (Mode == "edit") {
    Submit.innerHTML = dashResources.get("edit");
    $("#lbl_Add_contentSeries").html(dashResources.get("seriesEdit"));
    $("#span_Add_contentSeries").attr("class", "fa fa-edit");
  } else {
    Submit.innerHTML = dashResources.get("insert");
    $("#lbl_Add_contentSeries").html(dashResources.get("newSeries"));
    $("#span_Add_contentSeries").attr("class", "fa fa-plus");
  }

  Submit.onclick = () => {
    if ($("#text1").val() == "") {
      $("#text1").css("border", "1px solid #f00");
    } else {
      $("#text1").css("border", "1px solid #000");

      if (Mode == "edit") {
        //put table
        let tr = $("#" + id)
          .parent()
          .parent();
        let rowID = tr.children().eq(0).html();

        localStorage.removeItem("putID");
        localStorage.removeItem("_id");
        localStorage.setItem("putID", rowID);
        localStorage.setItem("_id", id);

        tr.children().eq(1).html($("#text1").val());
        tr.children().eq(2).html($("#select3Selectbox option:selected").text());
        if (CHARTTYPE != "pie") {
          tr.children()
            .eq(3)
            .html(
              '<span style="color:' +
                $("#inputColor").val() +
                '" class="fa fa-square"></span>'
            );
          tr.children().eq(4).html($("#PlotType option:selected").val());
        } else {
          tr.children().eq(3).html($("#PlotType option:selected").val());
        }

        //close
        $("#Add_Series").remove();
      } else {
        // if (CHARTTYPE == "progress_circle" || CHARTTYPE == "pie") {
        //   if ($("table tr").length == 0)
        //     $(`#btnAddTolist`).attr("disabled", true);

        // }

        let _ID =
          $("table tr").length == 1
            ? 1
            : +$("table tr:last").children().eq(0).html() + 1;

        //Add to tbody in table

        let tbody =
          "<tr>" +
          '<td scope="row">' +
          _ID +
          "</td>" +
          '<td scope="row">' +
          $("#text1").val() +
          "</td>" +
          '<td scope="row">' +
          $("#select3Selectbox option:selected").text() +
          "</td>";
        if (CHARTTYPE != "pie")
          tbody +=
            '<td scope="row"><span style="color:' +
            $("#inputColor").val() +
            '" class="fa fa-square"></span></td>';

        tbody +=
          '<td scope="row">' +
          $("#PlotType option:selected").val() +
          "</td>" +
          '<td scope="row" style="display: flex;justify-content: center;">' +
          '<span id="Series_Delete_' +
          _ID +
          `" class="btn btn-danger span" style="margin: 0px 5px;color:#ffffff !important;background-color: #dd4b39 !important;border-color: #d73925 !important;background-image: linear-gradient(to bottom, transparent 0%, transparent 100%) !important;" onclick="Series_Deleted(id)"><i class="glyphicon glyphicon-remove" ></i>${dashResources.get(
            "delete"
          )}</span>` +
          '<span id="Series_Edit_' +
          _ID +
          `" class="btn btn-info span" onclick="Series_Edited(id)"><i class="glyphicon glyphicon-edit" style="margin: 0px 5px;" ></i>${dashResources.get(
            "edit"
          )}</span>` +
          "</td>" +
          "</tr>";

        $("#series_tbody").append(tbody);

        //close
        $("#Add_Series").remove();
        if (
          CHARTTYPE == "pie" ||
          CHARTTYPE == "polar" ||
          CHARTTYPE == "progress_circle"
        ) {
          if ($("table tr").length - 1 == 1)
            $("#btnAddTolist").attr("disabled", "disabled");
        }
      }
    }
  };
  //btn exit
  let Exit = btnExit("#insertSeries");
  Exit.onclick = () => {
    $("#Add_Series").remove();
  };
}

function Series_Deleted(id) {
  swal({
    text: dashResources.get("suredelete"),
    icon: `warning`,
    buttons: {
      confirm: `${dashResources.get("ok")}`,
      cancel: `${dashResources.get("cancel")}`,
    },
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      let tr = $("#" + id)
        .parent()
        .parent();

      // remove from list
      tr.remove();

      //set session rowID for remove array
      let rowID = tr.children().eq(0).html();
      localStorage.removeItem("deleteID");
      localStorage.setItem("deleteID", rowID);
      if ($("table tr").length - 1 < 1)
        $("#btnAddTolist").removeAttr("disabled");

      //sort row num
      let rows = $("table tr");
      for (let i = 1; i < rows.length; i++) $(rows[i]).children().eq(0).html(i);
    }
  });
}

function Series_Edited(id) {
  let tr = $("#" + id)
    .parent()
    .parent();
  Form_Add_Series("edit", id);
  //set Form_Add_Series Items
  $("#text1").val(tr.children().eq(1).html());
  selectCategory("select3Selectbox");

  function setSelectBoxByText(text) {
    $("#select3Selectbox")
      .find("option")
      .filter(function () {
        return $(this).text() === text;
      })
      .prop("selected", true);
  }
  $("#select3Selectbox").text(setSelectBoxByText(tr.children().eq(2).html()));

  if (CHARTTYPE != "pie") {
    $("#inputColor").val(
      rgb2hex(tr.children().eq(3).find("span:first").css("color"))
    );
    $("#PlotType").val(tr.children().eq(4).html());
  } else {
    $("#PlotType").val(tr.children().eq(3).html());
  }
}

function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function objkeysCategory(value) {
  let Name = $CategoryQuery.filter((x) => x == value);
  let item = "";

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
      DashboardReportRef = JSON.parse(
        data.getElementsByTagName("string")[0].childNodes[0].nodeValue
      );
    },
  });

  if (Name.length) {
    for (let k = 0; k < DashboardReportRef.RefColumns.length; k++) {
      if (DashboardReportRef.RefColumns[k].Name.split("-")[1] == Name[0]) {
        item = DashboardReportRef.RefColumns[k].Label;
        return item;
      }
    }
  }
}
