/* Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.0.0*/

function DashboardView(json) {
  if (json.ItemsGrouping) {
    $("#content").empty();
    $.each(json.RowBoxs, function (index, chartGroup) {
      content =
        '<div style="' +
        '" id="form-group-' +
        chartGroup.RowID +
        '" class="row form-group-box " RowIndex="' +
        chartGroup.RowIndex +
        '" ondragleave="onMouseOut(event)">';
      var ColumnWidth = chartGroup.ColumnWidth;
      if (chartGroup.ColumnLayout == "OnceColumn") {
        if (ColumnWidth == "default") {
          ColumnWidth = "col-md-12";
        }
        content +=
          '<div class="' +
          ColumnWidth +
          ' col-md-12 col-xs-12 form-group-body" onmouseover="copyCheck(event)" onmouseout="onMouseOut(event)" ondrop="drop(event)" ondragover="allowDrop(event)" ColumnIndex="0" id="form-group-body-' +
          chartGroup.RowID +
          '-0" ></div>';
      }

      if (chartGroup.ColumnLayout == "TwoColumn") {
        ColumnWidth = "col-md-6";

        content +=
          '<div class="' +
          ColumnWidth +
          " form-group-body" +
          '"' +
          ' onmouseover="copyCheck(event)" onmouseout="onMouseOut(event)" ondrop="drop(event)" ondragover="allowDrop(event)"' +
          ' ColumnIndex="0" id="form-group-body-' +
          chartGroup.RowID +
          '-0"></div><div class="' +
          ColumnWidth +
          " form-group-body" +
          '"' +
          ' onmouseover="copyCheck(event)" onmouseout="onMouseOut(event)" ondrop="drop(event)" ColumnIndex="1" ondragover="allowDrop(event)"' +
          ' id="form-group-body-' +
          chartGroup.RowID +
          '-1" ></div>';
      }

      if (chartGroup.ColumnLayout == "ThreeColumn") {
        if (chartGroup.RowDisplayMode == "GroupWithBox") {
          ColumnWidth = "col-md-4";
        } else {
          ColumnWidth = "col-md-4";
        }

        content +=
          '<div class="' +
          ColumnWidth +
          " form-group-body" +
          '" onmouseover="copyCheck(event)" onmouseout="onMouseOut(event)" ondrop="drop(event)" ondragover="allowDrop(event)" ColumnIndex="0" id="form-group-body-' +
          chartGroup.RowID +
          '-0" ></div><div class="' +
          ColumnWidth +
          " form-group-body" +
          '" onmouseover="copyCheck(event)" onmouseout="onMouseOut(event)" ondrop="drop(event)" ondragover="allowDrop(event)" ColumnIndex="1" id="form-group-body-' +
          chartGroup.RowID +
          '-1" > </div><div class="' +
          ColumnWidth +
          " form-group-body" +
          '" onmouseover="copyCheck(event)" onmouseout="onMouseOut(event)" ondrop="drop(event)" ondragover="allowDrop(event)" ColumnIndex="2" id="form-group-body-' +
          chartGroup.RowID +
          '-2" ></div>';
      }

      //btn json default
      content += Group_Btn(chartGroup.RowID);

      content += "</div>";

      $(`#content`).append(content);
    });

    var parentID = "";
    $.each(CHARTS, function (index, chartItem) {
      if (json.ItemsGrouping) {
        parentID =
          "form-group-body-" + chartItem.RowID + "-" + chartItem.ColumnIndex;
      } else {
        parentID =
          "form-group-mbody-" +
          chartItem.DashboardID +
          "-" +
          chartItem.ColumnIndex;
      }
      createImgChart(null, parentID, chartItem, chartItem.Type);
    });
  }
}
