// JScript File(Amnpardaz Software Co. Copyright 2022 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.0.0.0

var $AdvancedSearch = new Array();

var $DataRegions = [];

var $DataVisualizations = [];

var $TableID;

function reportView(id, objKey) {

    var _content = "";

    var _reportID = id;

    var _reportOptions;

    var _searchFormItems;

    var _objKey = objKey;

    var _searchFormIsRendered = false;

    var _lastPage;

    var _order = [];

    var i_order = [];

    var _pageSize = 25;

    this.renderContext = function (pageElementID) {

        var bodyID = '#reportViewer-' + _reportID;

        _reportOptions = new iData('a94de00c-c59f-4f0a-92dd-7bb7c41b5214', _reportID);

        if (_reportOptions.getError() != null) {

            raiseError(_reportOptions.getError(), bodyID);

            return;
        }

        _reportOptions = _reportOptions.getObject();

        _reportLayout = new iData('2166d5a6-8c29-4e6c-94cb-370808344457', _reportID);
       
        if (_reportLayout.getError() != null) {

            raiseError(_reportLayout.getError(), bodyID);

            return;
        }
       
        _reportSettings = new iData('3ba664ea-b69b-4e64-870f-57f747837808', 0);

        if (_reportSettings.getError() != null) {

            raiseError(_reportSettings.getError(), bodyID);

            return;
        }

        _reportSettings = _reportSettings.getObject();

        var reportHeaderID = _reportLayout.getListByFilter('Type', 'ReportHeader')[0].ElementID;

        var reportBodyID = _reportLayout.getListByFilter('Type', 'ReportBody')[0].ElementID;

        var reportFooterID = _reportLayout.getListByFilter('Type', 'ReportFooter')[0].ElementID;

        renderReportToolbar();
       
        if (reportHeaderID != null) { 

            $('#reportViewer-' + _reportID).append('<div class="row"><div id="reportHeader-' + _reportID + '" class="col-md-12 report-header"></div></div>');

            renderReportHeader(reportHeaderID);
        }
      
        if (reportBodyID != null) {

            $('#reportViewer-' + _reportID).append('<div class="row"><div id="reportBody-' + _reportID + '" class="col-md-12 report-body"></div></div>');

            var activiyParam = new Object();

            activiyParam.ParamIndex = 0;

            activiyParam.ParamName = 'Default';

            activiyParam.ParamValue = '';

            $AdvancedSearch.push(activiyParam);

            var orderParam = new Object();

            orderParam.ColumnIndex = 1;

            orderParam.OrderDir = 'Asc';

            _order.push(orderParam);
            
            renderReportBody(reportBodyID);
        }

        if (reportFooterID != null) {

            $('#reportViewer-' + _reportID).append('<div class="row"><div id="reportFooter-' + _reportID + '" class="col-md-12 report-footer"></div></div>');

            renderReportFooter(reportFooterID);
        }
    }

    renderReportToolbar = function () {

        $('#reportToolbar-' + _reportID).append('<ul class="nav navbar-nav" id="reportTool-' + _reportID + '"><ul>')

        var toolID = '#reportTool-' + _reportID;

        $(toolID).append('<li class="dropdown"><a style="cursor:pointer" class="dropdown-toggle navbar-center" data-toggle="dropdown" role="button"><span class="fa fa-wrench" ></span>&nbsp; Report Features<span class="caret"></span></a>' +
                         '<ul class="dropdown-menu" role="menu"><li><a style="cursor:pointer" onclick="printReport()" ><span class="fa fa-print"></span>Print Report</a></li></ul>' +
                         '</li>');

        $(toolID).append('<li class="dropdown"><a style="cursor:pointer" class="dropdown-toggle navbar-center" data-toggle="dropdown" role="button"><span class="fa fa-download" ></span>&nbsp; Download Export<span class="caret"></span></a>' +
                 '<ul class="dropdown-menu" role="menu"><li><a style="cursor:pointer" onclick="exportReportToExcel()"><span class="fa fa-excel"  style="color: green;" ></span>Download Excel</a></li></ul>' +
                 '</li>');

        if (_reportOptions.DefaultPageSize != null) {

            $(toolID).append('<li class="dropdown" id="li-change-page-size"><a style="cursor:pointer" class="dropdown-toggle navbar-center" data-toggle="dropdown" role="button"><span class="fa fa-list-o" ></span>&nbsp; Show Results<span class="caret"></span></a>' +
             '<ul class="dropdown-menu" role="menu">' +
             '<li><a style="cursor:pointer" onclick="changeReportPageSize(25)">25</a></li>' +
             '<li><a style="cursor:pointer" onclick="changeReportPageSize(50)" >50</a></li>' +
             '<li><a style="cursor:pointer" onclick="changeReportPageSize(100)" >100</a></li>' +
             '<li><a style="cursor:pointer" onclick="changeReportPageSize(-1)">All</a></li>' +
             '</ul>' +
             '</li>');
        }

        $(toolID).append('<li class="dropdown" onclick="showModalSearchForm()"><a style="cursor:pointer" id="link-filter" class="dropdown-toggle navbar-center" data-toggle="dropdown" role="button"><span class="fa fa-filter" ></span>&nbsp; Search in Results<span class="caret"></span></a>' +
         '</li>');

        $(toolID).append('<li class="report-paging-btn" title="آخرین صفحه" onclick="changeReportPage($(\'#reportTotalPage\').html())"><a class="navbar-center" style="cursor:pointer"><span class="glyphicon glyphicon-forward" ></span></a></li>' +
        '<li class="report-paging-btn" title="صفحه بعد" onclick="if(parseInt($(\'#pageNumber\').val())<parseInt($(\'#reportTotalPage\').html()))changeReportPage(parseInt($(\'#pageNumber\').val())+1)"><a class="navbar-center" style="cursor:pointer"><span class="glyphicon glyphicon-triangle-right" ></span></a></li>' +
        '<li class="report-paging-lbl">صفحه &nbsp;<input type="text" id="pageNumber" disabled class="report-paging-txt" value="1" /> از <span id="reportTotalPage"></span></li>' +
        '<li class="report-paging-btn" title="صفحه قبل" onclick="if(parseInt($(\'#pageNumber\').val())>1)changeReportPage(parseInt($(\'#pageNumber\').val())-1)"><a class="navbar-center" style="cursor:pointer"><span class="glyphicon glyphicon-triangle-left" ></span></a></li>' +
        '<li class="report-paging-btn" title="صفحه اول" onclick="changeReportPage(1)"><a class="navbar-center" style="cursor:pointer"><span class="glyphicon glyphicon-backward" ></span></a></li>');
    }

    renderReportHeader = function (elementID) {

        var subLayout = _reportLayout.getListByFilter('ParentElementID', elementID);

        if (_reportSettings.HeaderRenderMode == 'Classic' || subLayout.length == 0) {

            $('#reportHeader-' + _reportID).html('<br /><span class="report-header-besmi">بسمه تعالی</span><br /><span class="report-header-title">' + _reportSettings.HeaderTitle + '</span><br /><span class="report-header-subtitle">' + _reportSettings.HeaderSubTitle + '</span><br /><span class="report-title">' + _reportOptions.Label + '</span>');
        }
    }

    renderReportFooter = function (elementID) {

        var subLayout = _reportLayout.getListByFilter('ParentElementID', elementID);

        if (_reportSettings.FooterRenderMode == 'Classic' || subLayout.length == 0) {

            $('#reportFooter-' + _reportID).html('<span class="report-footer-title">' + _reportSettings.FooterTitle + '</span>');
        }
    }

    renderReportBody = function (elementID) {

        var subLayout = _reportLayout.getListByFilter('ParentElementID', elementID);

        $.each(subLayout, function (index, row) {

            $('#reportBody-' + _reportID).append('<div class="row" id="report-row-' + row.ElementID + '"></div>');
           
            renderRowSection(row.ElementID);
        });
    }

    renderRowSection = function (rowID) {

        var cells = _reportLayout.getListByFilter('ParentElementID', rowID);

        $.each(cells, function (index, cell) {

            $('#report-row-' + rowID).append('<div class="' + cell.Style + ' report-area" id="report-cell-' + cell.ElementID + '"></div>');

            renderCellSection(cell.ElementID);
        });
    }

    renderCellSection = function (cellID) {

        var elements = _reportLayout.getListByFilter('ParentElementID', cellID);

        var style = '';

        $.each(elements, function (index, element) {

            if (element.Type == 'Row') {

                $('#report-cell-' + cellID).append('<div class="row" id="report-row-' + element.ElementID + '"></div>');

                renderRowSection(element.ElementID);
            }

            if (element.Type == 'ReportPart') {

                if (element.Style != '') {

                    style = element.Style + ';';
                }

                if (element.StyleHeight != '') {

                    style += 'height:' + element.StyleHeight + ';';
                }

                if (element.StyleBorder != '') {

                    style += 'border:' + element.StyleBorder + ';';
                }

                if (element.StyleAlign != '') {

                    style += 'text-align:' + element.StyleAlign + ';';
                }

                if (element.StyleBackground != '') {

                    style += 'background:' + element.StyleBackground + ';';
                }

                $('#report-cell-' + cellID).append('<div class="report-part" style="' + style + '" id="reportPart-' + element.ElementID + '"></div>');

                renderReportPart(element.ElementID);
            }
        });
    }

    renderReportPart = function (reportPartID) {

        _reportItems = new iData('69979c54-2418-4c16-bfdf-cef8d8e552c8', reportPartID);

        if (_reportSettings.BodyRenderMode == 'Classic') {

            var reportItem = _reportItems.getObject();

            var style = '';

            if (reportItem.Style != '') {

                style = reportItem.Style + ';';
            }

            if (reportItem.StyleHeight != '') {

                style += 'height:' + reportItem.StyleHeight + ';';
            }

            if (reportItem.StyleWidth != '') {

                style += 'width:' + reportItem.StyleWidth + ';';
            }

            if (reportItem.Type == "DataRegion") {

                $('#reportPart-' + reportPartID).html('<div class="data-region" style="' + style + '" id="dataRegion-' + reportItem.DataRegionID + '"></div>');

                renderDataRegion(reportItem.DataRegionID);

                $DataRegions.push(reportItem.DataRegionID);
            }

            if (reportItem.Type == "DataVisualization") {

                $('#reportPart-' + reportPartID).html('<div class="data-visualization" style="' + style + '" id="dataVisualization-' + reportItem.DataVisualizationID + '"></div>');

                renderDataVisualization(reportItem.DataVisualizationID);

                $DataVisualizations.push(reportItem.DataVisualizationID);
            }
        }
    }

    renderDataRegion = function (dataRegionID) {

        _dataRegionOptions = new iData('8dc14aff-57d4-46bc-98bf-ed57e3d4000e', dataRegionID);

        _dataRegionOptions = _dataRegionOptions.getObject();
      
        if (_dataRegionOptions.Type == "Table") {

            renderDataTable(dataRegionID);

            $('#li-change-page-size').css('display', 'none');
        }

        if (_dataRegionOptions.Type == "Matrix") {

            renderDataMatrix(dataRegionID);

            $('#li-change-page-size').css('display', 'none');
        }

        if (_dataRegionOptions.Type == "List") {

            renderDataList(dataRegionID);
        }
    }

    renderDataVisualization = function (dataVisualizationID) {

        var chartOptions = new iData('50a5481e-d1b9-4d5b-a05b-83da9efece8d', dataVisualizationID);

        if (chartOptions.getError() != null) {

            raiseError(chartOptions.getError(), bodyID);

            return;
        }

        chartOptions = chartOptions.getObject();

        var series = new iData('50a5481e-eeb9-675b-985b-acda9efece8d', dataVisualizationID);

        if (series.getError() != null) {

            raiseError(series.getError(), bodyID);

            return;
        }

        series = series.getList();

        //#region Load Chart Data

        var seriesOptions = new Object();

        seriesOptions.Type = chartOptions.SeriesType;

        seriesOptions.GroupingExpression = chartOptions.GroupingExpression;

        seriesOptions.TimePrioiedType = chartOptions.TimePrioiedType;

        seriesOptions.TimePrioiedStart = chartOptions.TimePrioiedStart;

        seriesOptions.TimePrioiedDuration = chartOptions.TimePrioiedDuration;

        var seriesExps = [];

        $.each(series, function (index, series) {

            seriesExps.push(series.DataExpression);

            if (series.PlotType == null)
                series.PlotType = chartOptions.ChartType;
        });

        var data = new rDataVisualization(_reportID, dataVisualizationID, seriesOptions, chartOptions.CategoryExpression, seriesExps, $AdvancedSearch, _objKey);

        if (data.getError() != null) {

            raiseError(data.getError(), bodyID);

            return;
        }

        data = data.getList();

        //#endregion

        //#region Render Chart

        $("#dataVisualization-" + dataVisualizationID).html('<div style="" id="chart-' + chartOptions.ChartID + '"></div>');

        _GeneralOptions.type = chartOptions.ChartType;

        if (seriesOptions.Type == "Simple") {

            _LegendOptions.enabled = false;
        }
        else {
            _LegendOptions.enabled = true;
        }

        var chart = Highcharts.chart('chart-' + chartOptions.ChartID, {

            chart: _GeneralOptions,

            colors: _ColorsOptions,

            credits: _CreditsOptions,

            exporting: _ExportingOptions,

            legend: _LegendOptions,

            title: _TitleOptions,

            tooltip: _TooltipOptions,

            xAxis: _XAxisOptions,

            yAxis: _YAxisOptions,

            lang: _LangOptions,

            plotOptions: {

                series: _SeriesPlotOptions,

                areaspline: _AreaPlotOptions,

                bar: _BarPlotOptions,

                column: _ColumnPlotOptions,

                line: _LinePlotOptions,

                pie: _PiePlotOptions
            }
        });

        chart.xAxis[0].setCategories(data.categories);

        chart.xAxis[0].setTitle({ text: chartOptions.CategoryLabel });

        chart.yAxis[0].setTitle({ text: chartOptions.ValueLabel });

        chart.setTitle({ text: chartOptions.Title });

        chart.setTitle(null, { text: chartOptions.SubTitle });

        $(chart).ready(function () {

            if (seriesOptions.Type == "Simple" || seriesOptions.Type == "Composite") {

                $.each(series, function (index, series) {

                    chart.addSeries({
                        data: data.series[index].data, color: series.StyleColor, name: series.Label, type: series.PlotType, innerSize: '50%'
                    })

                });
            }

            if (seriesOptions.Type == "ColumnGroup" || seriesOptions.Type == "TimePrioied") {

                $.each(data.series, function (index, series) {

                    chart.addSeries({
                        data: series.data, color: '', name: series.name, type: chartOptions.ChartType, innerSize: '50%'
                    })

                });
            }
        });

        //#endregion
    }

    renderDataMatrix = function (dataRegionID) {

        var dataMatrix = new rDataRegion(_reportID, dataRegionID, $('#pageNumber').val(), $AdvancedSearch, _objKey, _order);

        dataMatrix = dataMatrix.getList();

        $(".report-record-info").remove();

        if (dataMatrix.filterdRecord != dataMatrix.totalRecord) {

            $('#reportTool-' + _reportID).append('<li class="report-record-info">' + (dataMatrix.fromRecords != null ? 'Show ' + dataMatrix.fromRecords + ' to ' + dataMatrix.toRecords + ' from ' : 'Total ') + dataMatrix.filterdRecords + ' Records (Filtered from  ' + dataMatrix.totalRecords + ' Records) &nbsp;</li>');
        }
        else {
            $('#reportTool-' + _reportID).append('<li class="report-record-info">' + (dataMatrix.fromRecords != null ? 'Show ' + dataMatrix.fromRecords + ' to ' + dataMatrix.toRecords + ' from ' : 'Total ') + dataMatrix.filterdRecords + ' Records &nbsp;</li>');
        }

        $('#reportTotalPage').html(dataMatrix.totalPages);

        $('#dataRegion-' + dataRegionID).html('<table class="table-bordered table-hover table-condensed report-table" id="dataMatrix-' + dataRegionID + '"></table>');

        var matrixID = '#dataMatrix-' + dataMatrix.TableID;

        var _matrixID = 'dataMatrix-' + dataMatrix.TableID;

        _content = '<thead>';

        for (i = 0; i < dataMatrix.colGroupLevel; i++) {

            _content += '<tr id="th-' + _matrixID + '-' + i + '"></tr>';
        }

        _content += '<\thead>';

        $(matrixID).append(_content);

        var trID = '#th-' + _matrixID + '-0';

        $(trID).append('<th colspan="' + dataMatrix.rowGroupLevel + '"></th>');

        dataMatrix = dataMatrix.data;

        $.each(dataMatrix.header.colGroups, function (c_index, colGroup) {

            $(trID).append('<th style="' + colGroup.styleContent + '" colspan="' + (parseInt(colGroup.inner) + 1) + '" class="' + colGroup.styleClass + '">' + colGroup.groupValue + '</th>');

            if (colGroup.hasOwnProperty("colGroups")) {

                $.each(colGroup.colGroups, function (cc_index, innerColGroup) {

                    renderGroupColumns(_matrixID, innerColGroup, cc_index, c_index);
                });
            }
        });

        if (dataMatrix.header.hasOwnProperty("summery")) {

            $(trID).append('<th style="' + dataMatrix.header.summery.styleContent + '" class="' + dataMatrix.header.summery.styleClass + '">' + dataMatrix.header.summery.value + '</th>');
        }

        $.each(dataMatrix.rowGroups, function (r_index, rowGroup) {

            trID = 'tr-' + _matrixID + '-summery' + rowGroup.level + '-' + r_index;

            $(matrixID).append('<tr id="' + trID + '"></tr>');

            $('#' + trID).append('<td style="' + rowGroup.styleContent + '" rowspan="' + (parseInt(rowGroup.inner) + 1) + '" class="' + rowGroup.styleClass + '">' + rowGroup.groupValue + '</td>');

            if (rowGroup.hasOwnProperty("summeries")) {

                $.each(rowGroup.summeries, function (s_index, summery) {

                    $('#' + trID).append('<td style="' + summery.styleContent + '" class="' + summery.styleClass + '">' + summery.value + '</td>');
                });
            }
        });

        if (dataMatrix.hasOwnProperty("summeries")) {

            trID = '#tr-' + _matrixID + '-summery';

            $(matrixID).append('<tr id="tr-' + _matrixID + '-summery"></tr>');

            $.each(dataMatrix.summeries, function (index, summery) {

                $(trID).append('<td style="' + summery.styleContent + '" class="' + summery.styleClass + '">' + summery.value + '</td>');
            });
        }
    }

    renderDataTable = function (dataRegionID) {

        var dataTable = new rDataRegion(_reportID, dataRegionID, $('#pageNumber').val(), $AdvancedSearch, _objKey, _order);

        dataTable = dataTable.getList();

        $(".report-record-info").remove();

        if (dataTable.filterdRecord != dataTable.totalRecord) {

            $('#reportTool-' + _reportID).append('<li class="report-record-info">' + (dataTable.fromRecords != null ? 'Show ' + dataTable.fromRecords + ' to ' + dataTable.toRecords + ' from ' : 'Total ') + dataTable.filterdRecords + ' Records (Filtered from  ' + dataTable.totalRecords + ' Records) &nbsp;</li>');
        }
        else {
            $('#reportTool-' + _reportID).append('<li class="report-record-info">' + (dataTable.fromRecords != null ? 'Show ' + dataTable.fromRecords + ' to ' + dataTable.toRecords + ' from ' : 'Total ') + dataTable.filterdRecords + ' Records &nbsp;</li>');
        }

        $('#reportTotalPage').html(dataTable.totalPages);

        $('#dataRegion-' + dataRegionID).html('<table class="table-bordered table-hover table-condensed report-table" id="dataTable-' + dataTable.TableID + '"></table>');

        var tableID = '#dataTable-' + dataTable.TableID;

        var _tableID = 'dataTable-' + dataTable.TableID;

        $TableID = tableID;

        dataTable = dataTable.data;

        _content = '';

        _content = '<thead><tr>';

        var firstLoad = false;

        if (i_order.length == 0) {

            firstLoad = true;
        }

        $.each(dataTable.header, function (h_index, headerCell) {

            _content += '<th  id="th-' + (h_index) + '" onclick="sortReport(' + (h_index) + ')" style="cursor:pointer;' + headerCell.styleContent + '" class="' + headerCell.styleClass + '">' + headerCell.value + '</th>'

            var colOrder = { ColumnName: headerCell.alias, OrderDir: 'ASC' };

            if (firstLoad && headerCell.alias != "rownumber") {

                i_order.push(colOrder);
            }
        });

        _content += '<\tr><\thead>';

        $(tableID).append(_content);

        $.each(dataTable.rowGroups, function (r_index, rowGroup) {

            $(tableID).append('<tr><td  rowspan="' + (parseInt(rowGroup.inner) + 1) + '" style="' + rowGroup.styleContent + '"  class="' + rowGroup.styleClass + '">' + rowGroup.groupValue + '</td></tr>');

            $.each(rowGroup.rowGroups, function (rr_index, innerRowGroup) {

                renderGroupRows(_tableID, innerRowGroup, rr_index, r_index);
            });

            if (rowGroup.hasOwnProperty("details")) {

                _content = "";

                $.each(rowGroup.details, function (dd_index, detail) {

                    _content += "<tr>";

                    $.each(detail, function (ii_index, detailItem) {

                        _content += '<td style="' + detailItem.styleContent + '" class="' + detailItem.styleClass + '">' + detailItem.value + '</td>';

                    });

                    _content += "</tr>";
                });

                $(tableID).append(_content);
            }

            if (rowGroup.hasOwnProperty("summeries")) {

                trID = 'tr-' + _tableID + '-summery' + rowGroup.level + '-' + r_index;

                $(tableID).append('<tr id="' + trID + '"></tr>');

                $.each(rowGroup.summeries, function (ss_index, summery) {

                    $('#' + trID).append('<td style="background-color:  #f7f7f7;' + summery.styleContent + '" class="' + summery.styleClass + '">' + summery.value + '</td>');
                });
            }
        });

        if (dataTable.hasOwnProperty("details")) {

            _content = "";

            $.each(dataTable.details, function (d_index, detail) {

                _content += "<tr>";

                $.each(detail, function (i_index, detailItem) {

                    _content += '<td style="' + detailItem.styleContent + '" class="' + detailItem.styleClass + '">' + detailItem.value + '</td>';

                });

                _content += "</tr>";
            });

            $(tableID).append(_content);
        }

        if (dataTable.hasOwnProperty("summeries")) {

            trID = 'tr-' + _tableID + '-summery';

            $(tableID).append('<tr id="' + trID + '"></tr>');

            $.each(dataTable.summeries, function (s_index, summery) {

                $('#' + trID).append('<td style="background-color:  #f0f3f3;' + summery.styleContent + '" class="' + summery.styleClass + '">' + summery.value + '</td>');
            });
        }
    }

    renderDataList = function (dataRegionID) {
        
        if (_pageSize != -1) {

            var dataList = new rDataList(_reportID, dataRegionID, ($('#pageNumber').val() - 1) * _pageSize, _pageSize, $AdvancedSearch, _objKey, _order);
        }
        else {
            var dataList = new rDataList(_reportID, dataRegionID, 0, -1, $AdvancedSearch, _objKey, _order);
        }
       
        dataList = dataList.getList();

        $(".report-record-info").remove();

        if (dataList.filterdRecord != dataList.totalRecord) {

            $('#reportTool-' + _reportID).append('<li class="report-record-info">' + (dataList.fromRecords != null ? 'Show ' + dataList.fromRecords + ' to ' + dataList.toRecords + ' from ' : 'Total ') + dataList.filterdRecords + ' Records (Filtered from  ' + dataList.totalRecords + ' Records) &nbsp;</li>');
        }
        else {

            $('#reportTool-' + _reportID).append('<li class="report-record-info">' + (dataList.fromRecords != null ? 'Show ' + dataList.fromRecords + ' to ' + dataList.toRecords + ' from ' : 'Total ') + dataList.filterdRecords + ' Records &nbsp;</li>');
        }

        $('#reportTotalPage').html(dataList.totalPages);

        $('#dataRegion-' + dataRegionID).html('<table class="table-bordered table-hover table-condensed report-table" id="dataList-' + dataList.TableID + '"></table>');

        var tableID = '#dataList-' + dataList.TableID;

        var _tableID = 'dataList-' + dataList.TableID;

        $TableID = tableID;

        dataList = dataList.data;

        _content = '';

        _content = '<thead><tr>';

        var firstLoad = false;

        if (i_order.length == 0) {

            firstLoad = true;
        }

        $.each(dataList.header, function (h_index, headerCell) {

            _content += '<th id="th-' + (h_index - 1) + '" onclick="sortReport(' + (h_index - 1) + ')" style="cursor:pointer;' + headerCell.styleContent + '" class="' + headerCell.styleClass + '">' + headerCell.value + '</th>'

            var colOrder = { ColumnName: headerCell.alias, OrderDir: 'ASC' };

            if (firstLoad && headerCell.alias != "rownumber") {

                i_order.push(colOrder);
            }
        });

        _content += '<\tr><\thead>';

        $(tableID).append(_content);

        if (dataList.hasOwnProperty("details")) {

            _content = "";

            $.each(dataList.details, function (d_index, detail) {

                _content += "<tr>";

                $.each(detail, function (i_index, detailItem) {

                    _content += '<td style="' + (d_index % 2 == 1 ? 'background-color:#f7f7f7;' : '') + detailItem.styleContent + '" class="' + detailItem.styleClass + '">' + detailItem.value + '</td>';

                });

                _content += "</tr>";
            });

            $(tableID).append(_content);
        }

        if (dataList.hasOwnProperty("summeries")) {

            trID = 'tr-' + _tableID + '-summery';

            $(tableID).append('<tr id="' + trID + '"></tr>');

            $.each(dataList.summeries, function (s_index, summery) {

                $('#' + trID).append('<td style="background-color:  #f0f3f3;' + summery.styleContent + '" class="' + summery.styleClass + '">' + (summery.value == '0' ? '' : summery.value) + '</td>');
            });
        }

        if ($("#page-content").outerWidth() < $(tableID).outerWidth() + 100) {

            $('#dataRegion-' + dataRegionID).css('width', $(tableID).outerWidth() + 300);
        }
    }

    renderGroupColumns = function (matrixID, colGroup, index, parentIndex) {

        var trID = 'th-' + matrixID + '-' + colGroup.level;

        $(trID).append('<td style="' + colGroup.styleContent + '" colspan="' + colGroup.inner + '" class="' + colGroup.styleClass + '">' + colGroup.value + '</td>');

        $.each(colGroup.colGroups, function (index, colGroup) {

            renderGroupColumns(colGroup);
        });

        if (colGroup.summery) {

            $('th-' + matrixID + '-' + (colGroup.level + 1)).append('<td style="' + colGroup.summery.styleContent + '"class="' + colGroup.summery.styleClass + '">' + colGroup.summery.value + '</td>');
        }
    }

    renderGroupRows = function (regionID, rowGroup, index, parentIndex) {

        $('#' + regionID).append('<tr><td style="' + rowGroup.styleContent + '" rowspan="' + (parseInt(rowGroup.inner) + 1) + '" class="' + rowGroup.styleClass + '">' + rowGroup.groupValue + '</td></tr>');

        if (rowGroup.hasOwnProperty("rowGroups")) {

            $.each(rowGroup.rowGroups, function (r_index, innerRowGroup) {

                renderGroupRows(regionID, innerRowGroup, r_index, parentIndex + '-' + index);
            });
        }

        var detailConut = 0;

        if (rowGroup.hasOwnProperty("details")) {

            _content = "";

            $.each(rowGroup.details, function (d_index, detail) {

                _content += "<tr>";

                $.each(detail, function (i_index, detailItem) {

                    _content += '<td style="' + detailItem.styleContent + '" class="' + detailItem.styleClass + '">' + detailItem.value + '</td>';

                });

                _content += "</tr>";

                detailConut++;
            });

            $('#' + regionID).append(_content);
        }

        if (rowGroup.hasOwnProperty("summeries")) {

            trID = 'tr-' + regionID + '-summery' + rowGroup.level + '-' + parentIndex + '-' + index;

            $('#' + regionID).append('<tr id="' + trID + '"></tr>');

            $.each(rowGroup.summeries, function (s_index, summery) {

                $('#' + trID).append('<td style="background-color:#f7f7f7;' + summery.styleContent + '" class="' + summery.styleClass + '">' + summery.value + '</td>');
            });
        }
    }

    //Search Form
    showModalSearchForm = function () {

        _modalID = 1;

        $('#actContextModal' + _modalID).modal({ backdrop: false });

        $('#actContextModal' + _modalID).modal('show');

        if (!_searchFormIsRendered) {

            $('#boxBodyModal' + _modalID).html('<img src="../App_Res/Images/Ajax/AjaxLoader.gif" class="ajaxloader" />');

            renderModalSearchForm();
        }
    }

    renderModalSearchForm = function () {

        renderModalForm(_modalID, _reportID, -1, [], null, 0);

        _searchFormIsRendered = true;
    }

    //Utilities
    showReportMenu = function () {

        $('.main-sidebar').show();
    }

    printReport = function () {

        if ($('#reportTotalPage').html() == '0') {

            alert("اطلاعاتی برای چاپ وجود ندارد");

            return;
        }

        if ($('#reportTotalPage').html() != '1') {

            alert("قبل از چاپ همه نتایج نمایش داده می شود");
        }

        blockScreen();

        if ($TableID.indexOf('List') > -1) {

            if (_pageSize != -1) {

                _pageSize = -1;

                $('#pageNumber').val(1);

                reloadReportData();
            }
        }

        $('#reportViewer-' + _reportID).print();

        setTimeout('$(".wrapper").unblock();', 1 * 100);
    }

    resetReport = function () {

        $AdvancedSearch = [];

        blockScreen();

        $('#pageNumber').val(1);

        _pageSize = 25;

        reloadReportData();

        setTimeout('$(".wrapper").unblock();', 1 * 100);

        _searchFormIsRendered = false;

        $('#link-filter').css('font-weight', 'normal');

        $('#link-filter').css('color', '');
    }

    changeReportPageSize = function (pageSize) {

        blockScreen();

        _pageSize = pageSize;

        $('#pageNumber').val(1);

        reloadReportData();

        setTimeout('$(".wrapper").unblock();', 1 * 100);
    }

    changeReportPage = function (pageNumber) {

        if ($('#reportTotalPage').html() == '0') {

            return;
        }

        if ($('#reportTotalPage').html() == '1') {

            return;
        }

        blockScreen();

        $('#pageNumber').val(pageNumber);

        reloadReportData();

        setTimeout('$(".wrapper").unblock();', 1 * 100);
    }

    sortReport = function (index) {

        blockScreen();

        i_order[index].OrderDir = (i_order[index].OrderDir == "ASC" ? "DESC" : "ASC");

        var orderParam = new Object();

        orderParam.ColumnIndex = index + 1;

        orderParam.ColumnName = i_order[index].ColumnName;

        orderParam.OrderDir = i_order[index].OrderDir;

        _order.pop();

        _order.push(orderParam);

        $('#pageNumber').val(1);

        reloadReportData();

        $('#th-' + index).attr("style", "cursor:pointer;background-color:#a8e3d7!important");

        setTimeout('$(".wrapper").unblock();', 1 * 100);
    }

    exportReportToExcel = function () {

        if ($('#reportTotalPage').html() == '0') {

            alert("اطلاعاتی برای دانلود وجود ندارد");

            return;
        }

        if ($('#reportTotalPage').html() != '1') {

            alert("قبل از دانلود همه نتایج نمایش داده می شود");
        }

        blockScreen();

        if ($TableID.indexOf('List') > -1) {

            if (_pageSize != -1) {

                _pageSize = -1;

                changeReportPageSize(-1);
            }
        }

        $($TableID).table2excel({
            filename: "ExportedReport.xls"
        });

        setTimeout('$(".wrapper").unblock();', 1 * 100);
    }
}

reloadReportData = function () {

    $.each($DataRegions, function (index, dataRegionID) {
        
        renderDataRegion(dataRegionID);
    });

    $.each($DataVisualizations, function (index, dataVisualizationID) {

        renderDataVisualization(dataVisualizationID);
    });

    setTimeout('alignSideBarHeight();', 1 * 100);
}

blockScreen = function (){

    $('.wrapper').block({
        message: '<span class="message-form-block">...Processing<span>',
        baseZ: 10000
    });
}