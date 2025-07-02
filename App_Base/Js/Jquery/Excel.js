/* Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 2.4.0.0*/

; (function ($, window, document, undefined) {
    var pluginName = "table2excel",

    defaults = {
        exclude: ".noExl",
        name: "Table2Excel",
        filename: "table2excel",
        fileext: ".xls",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true,
        sheetName:"Report"

    };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        //
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var e = this;

            var utf8Heading = "<meta http-equiv=\"content-type\" content=\"application/vnd.ms-excel; charset=UTF-8\">";
            e.template = {
                head: "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\">" + utf8Heading + "<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>",
                sheet: {
                    head: "<x:ExcelWorksheet><x:Name>",
                    tail: "</x:Name><x:WorksheetOptions><x:DisplayGridlines/><x:DisplayRightToLeft /><x:Selected/><x:FreezePanes /><x:FrozenNoSplit /><x:SplitHorizontal>1</x:SplitHorizontal><x:TopRowBottomPane>1</x:TopRowBottomPane></x:WorksheetOptions><x:SheetViews><x:SheetView RightToLeft=1></x:SheetView></x:SheetViews></x:ExcelWorksheet>"
                },
                mid: "</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>",
                table: {
                    head: "<table style='font-family:\"IRANSansWeb\",\"B Yekan\",IRANSansWeb'>",
                    tail: "</table>"
                },
                foot: "</body></html>"
            };

            e.tableRows = [];

            var cellGrouped = false;

            // get contents of table except for exclude
            $(e.element).each(function (i, o) {
                var tempRows = "";
                $(o).find("tr").not(e.settings.exclude).each(function (i, p) {

                    tempRows += "<tr>";

                    cellGrouped = false;

                    $(p).find("th").not(e.settings.exclude).each(function (i, q) { // p did not exist, I corrected

                        var rc = {
                            rows: $(this).attr("rowspan"),
                            cols: $(this).attr("colspan"),
                            flag: $(q).find(e.settings.exclude)
                        };

                        if (rc.flag.length > 0) {
                            tempRows += "<td style='background-color:#e4fef8;border-bottom:1px solid gray;vertical-align:middle;text-align:center'> </td>"; // exclude it!!
                        } else {
                            if (rc.rows & rc.cols) {
                                tempRows += "<td style='background-color:#e4fef8;border-bottom:1px solid gray;vertical-align:middle;text-align:center'>" + $(q).html() + "</td>";
                            } else {
                                tempRows += "<td style='background-color:#e4fef8;border-bottom:1px solid gray;vertical-align:middle;text-align:center'";
                                if (rc.rows > 0) {
                                    tempRows += " rowspan=\'" + rc.rows + "\' ";
                                }
                                if (rc.cols > 0) {
                                    tempRows += " colspan=\'" + rc.cols + "\' ";
                                }
                                tempRows += "/>" + $(q).html() + "</td>";
                            }
                        }
                    });

                    $(p).find("td").not(e.settings.exclude).each(function (i, q) { // p did not exist, I corrected

                        var rc = {
                            rows: $(this).attr("rowspan"),
                            cols: $(this).attr("colspan"),
                            flag: $(q).find(e.settings.exclude)
                        };

                        if (rc.flag.length > 0) {
                            tempRows += "<td> </td>"; // exclude it!!
                        } else {
                            if (rc.rows & rc.cols) {
                                if (!cellGrouped || $(q).html() != '') {
                                    tempRows += "<td style='vertical-align:middle;text-align:center'>" + $(q).html().replace(/<br\s*\/?>/gi, ' ') + "</td>";
                                }
                            } else {
                                tempRows += "<td style='vertical-align:middle;text-align:center' ";
                                if (rc.rows > 0) {
                                    tempRows += " rowspan=\'" + rc.rows + "\' ";
                                    cellGrouped = true;
                                }
                                if (rc.cols > 0) {
                                    tempRows += " colspan=\'" + rc.cols + "\' ";
                                }

                                tempRows += "/>" + $(q).html().replace(/<br\s*\/?>/gi, ' ') + "</td>";

                                if (cellGrouped) {
                                    tempRows += "<td style='height:0px'> </td>"
                                }
                            }
                        }
                    });

                    tempRows += "</tr>";
                    console.log(tempRows);

                });
                // exclude img tags
                if (e.settings.exclude_img) {
                    tempRows = exclude_img(tempRows);
                }

                // exclude link tags
                if (e.settings.exclude_links) {
                    tempRows = exclude_links(tempRows);
                }

                // exclude input tags
                if (e.settings.exclude_inputs) {
                    tempRows = exclude_inputs(tempRows);
                }
                e.tableRows.push(tempRows);
            });

            e.tableToExcel(e.tableRows, e.settings.name, e.settings.sheetName);
        },

        tableToExcel: function (table, name, sheetName) {
            var e = this, fullTemplate = "", i, link, a;

            e.format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                });
            };

            sheetName = typeof sheetName === "undefined" ? "Sheet" : sheetName;

            e.ctx = {
                worksheet: name || "Worksheet",
                table: table,
                sheetName: sheetName
            };

            fullTemplate = e.template.head;

            if ($.isArray(table)) {
                for (i in table) {
                    //fullTemplate += e.template.sheet.head + "{worksheet" + i + "}" + e.template.sheet.tail;
                    fullTemplate += e.template.sheet.head + sheetName + e.template.sheet.tail;// + i;
                }
            }

            fullTemplate += e.template.mid;

            if ($.isArray(table)) {
                for (i in table) {
                    fullTemplate += e.template.table.head + "{table" + i + "}" + e.template.table.tail;
                }
            }

            fullTemplate += e.template.foot;

            for (i in table) {
                e.ctx["table" + i] = table[i];
            }
            delete e.ctx.table;

            var isIE = /*@cc_on!@*/false || !!document.documentMode; // this works with IE10 and IE11 both :)            
            //if (typeof msie !== "undefined" && msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // this works ONLY with IE 11!!!
            if (isIE) {
                if (typeof Blob !== "undefined") {
                    //use blobs if we can
                    fullTemplate = e.format(fullTemplate, e.ctx); // with this, works with IE
                    fullTemplate = [fullTemplate];
                    //convert to array
                    var blob1 = new Blob(fullTemplate, { type: "text/html" });
                    window.navigator.msSaveBlob(blob1, getFileName(e.settings));
                } else {
                    //otherwise use the iframe and save
                    //requires a blank iframe on page called txtArea1
                    txtArea1.document.open("text/html", "replace");
                    txtArea1.document.write(e.format(fullTemplate, e.ctx));
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, getFileName(e.settings));
                }

            } else {
                var blob = new Blob([e.format(fullTemplate, e.ctx)], { type: "application/vnd.ms-excel" });
                window.URL = window.URL || window.webkitURL;
                link = window.URL.createObjectURL(blob);
                a = document.createElement("a");
                a.download = getFileName(e.settings);
                a.href = link;

                document.body.appendChild(a);

                a.click();

                document.body.removeChild(a);
            }

            return true;
        }
    };

    function getFileName(settings) {
        return (settings.filename ? settings.filename : "table2excel");
    }

    // Removes all img tags
    function exclude_img(string) {
        var _patt = /(\s+alt\s*=\s*"([^"]*)"|\s+alt\s*=\s*'([^']*)')/i;
        return string.replace(/<img[^>]*>/gi, function myFunction(x) {
            var res = _patt.exec(x);
            if (res !== null && res.length >= 2) {
                return res[2];
            } else {
                return "";
            }
        });
    }

    // Removes all link tags
    function exclude_links(string) {
        return string.replace(/<a[^>]*>|<\/a>/gi, "");
    }

    // Removes input params
    function exclude_inputs(string) {
        var _patt = /(\s+value\s*=\s*"([^"]*)"|\s+value\s*=\s*'([^']*)')/i;
        return string.replace(/<input[^>]*>|<\/input>/gi, function myFunction(x) {
            var res = _patt.exec(x);
            if (res !== null && res.length >= 2) {
                return res[2];
            } else {
                return "";
            }
        });
    }

    $.fn[pluginName] = function (options) {
        var e = this;
        e.each(function () {
            if (!$.data(e, "plugin_" + pluginName)) {
                $.data(e, "plugin_" + pluginName, new Plugin(this, options));
            }
        });

        // chain jQuery functions
        return e;
    };

})(jQuery, window, document);
