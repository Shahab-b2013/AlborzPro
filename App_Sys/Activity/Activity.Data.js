/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.1.0.0*/

function aData(id, objKey, parentObjKey, requestDate, _async = false) {
  var _activityID = id;

  var _objKey = objKey != null ? objKey : 0;

  var _parentObjKey = parentObjKey != null ? parentObjKey : 0;

  var _requestDate = requestDate;

  var _list = [];

  var _errorMsseage = null;

  this.getList = function () {
    return _list;
  };

  this.getObject = function () {
    if ($.isArray(_list)) {
      return _list[0];
    } else {
      return _list;
    }
  };

  setList = function (dlist) {
    _list = dlist;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  this.getListByFilter = function (fieldName, fieldValue) {
    return $.grep(_list, function (obj, i) {
      return obj[fieldName] == fieldValue;
    });
  };

  $.ajax({
    type: "POST",

    url:
      objKey != null && objKey != 0
        ? "../App_Sys/Services/ViewActivity.asmx/GetDataObject"
        : "../App_Sys/Services/ViewActivity.asmx/GetDataObjects",

    data:
      objKey != null && objKey != 0
        ? '{"id":"' +
          _activityID +
          '","objKey":"' +
          _objKey +
          '","responseToken":"' +
          genResponseToken() +
          '"}'
        : '{"id":"' +
          _activityID +
          '","parentObjKey":"' +
          _parentObjKey +
          '","responseToken":"' +
          genResponseToken() +
          '","requestDate":"' +
          _requestDate +
          '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: _async,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        alert(JSON.stringify(jqXHR));
      }
    },

    success: function (data) {
      data = data.d;

      var firstRow = data;

      if ($.isArray(data)) {
        firstRow = data[0];
      }

      if (firstRow != null && typeof firstRow == "object") {
        if (firstRow.hasOwnProperty("errorCode")) {
          _errorMsseage = firstRow.errorMessage;

          return;
        }

        setRequestToken(firstRow.requestToken);
      }

      setList(data);
    },
  });
}

function ahData(id, objKey) {
  var _activityID = id;

  var _objKey = objKey != null ? objKey : 0;

  var _list = [];

  var _errorMsseage = null;

  this.getList = function () {
    return _list;
  };

  this.getObject = function () {
    if ($.isArray(_list)) {
      return _list[0];
    } else {
      return _list;
    }
  };

  setList = function (dlist) {
    _list = dlist;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  this.getListByFilter = function (fieldName, fieldValue) {
    return $.grep(_list, function (obj, i) {
      return obj[fieldName] == fieldValue;
    });
  };

  $.ajax({
    type: "POST",

    url: "../App_Sys/Services/ViewActivity.asmx/GetHDataObject",

    data:
      '{"id":"' +
      _activityID +
      '","objKey":"' +
      _objKey +
      '","responseToken":"' +
      genResponseToken() +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        alert(JSON.stringify(jqXHR));
      }
    },

    success: function (data) {
      data = data.d;

      var firstRow = data;

      if ($.isArray(data)) {
        firstRow = data[0];
      }

      if (firstRow != null && typeof firstRow == "object") {
        if (firstRow.hasOwnProperty("errorCode")) {
          _errorMsseage = firstRow.errorMessage;

          return;
        }

        setRequestToken(firstRow.requestToken);
      }

      setList(data);
    },
  });
}

function aDataVisualization(
  id,
  seriesOptions,
  categoryExp,
  seriesExps,
  advancedSearch,
  objKey
) {
  var _activityID = id;

  var _seriesOptions = seriesOptions;

  var _categoryExp = categoryExp;

  var _seriesExps = seriesExps;

  var _objKey = objKey;

  var _advancedSearch = advancedSearch;

  var _list = [];

  var _errorMsseage = null;

  this.getList = function () {
    return _list;
  };

  this.getObject = function () {
    if ($.isArray(_list)) {
      return _list[0];
    } else {
      return _list;
    }
  };

  setList = function (dlist) {
    _list = dlist;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  this.getListByFilter = function (fieldName, fieldValue) {
    return $.grep(_list, function (obj, i) {
      return obj[fieldName] == fieldValue;
    });
  };

  $.ajax({
    type: "POST",

    url: "../App_Sys/Services/ViewActivity.asmx/GetDataVisualization",

    data:
      '{"id":"' +
      _activityID +
      '","seriesOptions":' +
      JSON.stringify(_seriesOptions) +
      ',"categoryExp":"' +
      _categoryExp +
      '","seriesExps":' +
      JSON.stringify(_seriesExps) +
      ',"advancedSearch":' +
      JSON.stringify(_advancedSearch) +
      ',"objKey":"' +
      _objKey +
      '","responseToken":"' +
      genResponseToken() +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        alert(JSON.stringify(jqXHR));
      }
    },

    success: function (data) {
      data = data.d;

      if (data.indexOf("#error#") > -1) {
        _errorMsseage = data;

        return;
      }

      data = jQuery.parseJSON(data);

      setRequestToken(data.requestToken);

      setList(data.data);
    },
  });
}

function rDataRegion(
  id,
  dataRegionID,
  pageNumber,
  advancedSearch,
  objKey,
  order
) {
  var _reportID = id;

  var _dataRegionID = dataRegionID;

  var _pageNumber = pageNumber;

  var _advancedSearch = advancedSearch;

  var _objKey = objKey;

  var _order = order;

  var _list = [];

  var _errorMsseage = null;

  this.getList = function () {
    return _list;
  };

  this.getObject = function () {
    if ($.isArray(_list)) {
      return _list[0];
    } else {
      return _list;
    }
  };

  setList = function (dlist) {
    _list = dlist;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  this.getListByFilter = function (fieldName, fieldValue) {
    return $.grep(_list, function (obj, i) {
      return obj[fieldName] == fieldValue;
    });
  };

  $.ajax({
    type: "POST",

    url: "../App_Sys/Services/ReportActivity.asmx/GetDataRegion",

    data:
      '{"id":"' +
      _reportID +
      '","dataRegionID":"' +
      _dataRegionID +
      '","pageNumber":"' +
      _pageNumber +
      '","advancedSearch":' +
      JSON.stringify(_advancedSearch) +
      ',"objKey":"' +
      _objKey +
      '","order":' +
      JSON.stringify(_order) +
      ',"responseToken":"' +
      genResponseToken() +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        alert(JSON.stringify(jqXHR));
      }
    },

    success: function (data) {
      data = data.d;

      if (data.indexOf("#error#") > -1) {
        _errorMsseage = data;

        return;
      }

      data = jQuery.parseJSON(data);

      setRequestToken(data.requestToken);

      setList(data);
    },
  });
}

function rDataList(
  id,
  dataRegionID,
  start,
  length,
  advancedSearch,
  objKey,
  order
) {
  var _reportID = id;

  var _dataRegionID = dataRegionID;

  var _start = start;

  var _length = length;

  var _advancedSearch = advancedSearch;

  var _objKey = objKey;

  var _order = order;

  var _list = [];

  var _errorMsseage = null;

  this.getList = function () {
    return _list;
  };

  this.getObject = function () {
    if ($.isArray(_list)) {
      return _list[0];
    } else {
      return _list;
    }
  };

  setList = function (dlist) {
    _list = dlist;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  this.getListByFilter = function (fieldName, fieldValue) {
    return $.grep(_list, function (obj, i) {
      return obj[fieldName] == fieldValue;
    });
  };

  $.ajax({
    type: "POST",

    url: "../App_Sys/Services/ReportActivity.asmx/GetDataList",

    data:
      '{"id":"' +
      _reportID +
      '","dataRegionID":"' +
      _dataRegionID +
      '","length":"' +
      _length +
      '","start":"' +
      _start +
      '","advancedSearch":' +
      JSON.stringify(_advancedSearch) +
      ',"objKey":"' +
      _objKey +
      '","order":' +
      JSON.stringify(_order) +
      ',"responseToken":"' +
      genResponseToken() +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        alert(JSON.stringify(jqXHR));
      }
    },

    success: function (data) {
      data = data.d;

      if (data.indexOf("#error#") > -1) {
        _errorMsseage = data;

        return;
      }

      data = jQuery.parseJSON(data);

      setRequestToken(data.requestToken);

      setList(data);
    },
  });
}

function rDataVisualization(
  id,
  dataVisualizationID,
  seriesOptions,
  categoryExp,
  seriesExps,
  advancedSearch,
  objKey
) {
  var _reportID = id;

  var _dataVisualizationID = dataVisualizationID;

  var _seriesOptions = seriesOptions;

  var _categoryExp = categoryExp;

  var _seriesExps = seriesExps;

  var _objKey = objKey;

  var _advancedSearch = advancedSearch;

  var _list = [];

  var _errorMsseage = null;

  this.getList = function () {
    return _list;
  };

  this.getObject = function () {
    if ($.isArray(_list)) {
      return _list[0];
    } else {
      return _list;
    }
  };

  setList = function (dlist) {
    _list = dlist;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  this.getListByFilter = function (fieldName, fieldValue) {
    return $.grep(_list, function (obj, i) {
      return obj[fieldName] == fieldValue;
    });
  };

  $.ajax({
    type: "POST",

    url: "../App_Sys/Services/ReportActivity.asmx/GetDataVisualization",

    data:
      '{"id":"' +
      _reportID +
      '","dataVisualizationID":"' +
      _dataVisualizationID +
      '","seriesOptions":' +
      JSON.stringify(_seriesOptions) +
      ',"categoryExp":"' +
      _categoryExp +
      '","seriesExps":' +
      JSON.stringify(_seriesExps) +
      ',"advancedSearch":' +
      JSON.stringify(_advancedSearch) +
      ',"objKey":"' +
      _objKey +
      '","responseToken":"' +
      genResponseToken() +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        alert(JSON.stringify(jqXHR));
      }
    },

    success: function (data) {
      data = data.d;

      if (data.indexOf("#error#") > -1) {
        _errorMsseage = data;

        return;
      }

      data = jQuery.parseJSON(data);

      setRequestToken(data.requestToken);

      setList(data.data);
    },
  });
}

function rdData(id, objKey) {
  var _activityID = id;

  var _objKey = objKey != null ? objKey : 0;

  var _errorMsseage = null;

  var _json = null;

  this.getObject = function () {
    return _json;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  $.ajax({
    type: "POST",

    url: "../../App_Sys/Services/Admin/Report.asmx/GetDesign",

    data:
      '{"id":"' +
      _activityID +
      '","objKey":"' +
      _objKey +
      '","responseToken":"' +
      genResponseToken() +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        _errorMsseage = JSON.stringify(jqXHR);
      }
    },

    success: function (data) {
      data = data.d;

      if (data.indexOf("#error#") > -1) {
        _errorMsseage = data.replace("#error#", "");

        return;
      }

      _json = jQuery.parseJSON(data);

      setRequestToken(_json.requestToken);
    },
  });
}

function pdData(id, objKey) {
  var _activityID = id;

  var _objKey = objKey != null ? objKey : 0;

  var _errorMsseage = null;

  var _json = null;

  this.getObject = function () {
    return _json;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  $.ajax({
    type: "POST",

    url: "../../App_Sys/Services/Admin/Process.asmx/GetDesign",

    data:
      '{"id":"' +
      _activityID +
      '","objKey":"' +
      _objKey +
      '","responseToken":"' +
      genResponseToken() +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        _errorMsseage = JSON.stringify(jqXHR);
      }

      alert(_errorMsseage);
    },

    success: function (data) {
      data = data.d;

      if (data.indexOf("#error#") > -1) {
        _errorMsseage = data.replace("#error#", "");

        alert(_errorMsseage);

        return;
      }

      _json = jQuery.parseJSON(data);

      setRequestToken(_json.requestToken);
    },
  });
}

function fdData(id, objKey) {
  var _activityID = id;

  var _objKey = objKey != null ? objKey : 0;

  var _errorMsseage = null;

  var _json = null;

  this.getObject = function () {
    return _json;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  $.ajax({
    type: "POST",

    url: "../../App_Sys/Services/Admin/Form.asmx/GetDesign",

    data:
      '{"id":"' +
      _activityID +
      '","objKey":"' +
      _objKey +
      '","responseToken":"' +
      genResponseToken() +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        _errorMsseage = JSON.stringify(jqXHR);
      }

      alert(_errorMsseage);
    },

    success: function (data) {
      data = data.d;

      if (data.indexOf("#error#") > -1) {
        _errorMsseage = data.replace("#error#", "");

        return;
      }

      _json = jQuery.parseJSON(data);

      setRequestToken(_json.requestToken);
    },
  });
}

function qdData(id, objKey) {
  var _activityID = id;

  var _objKey = objKey != null ? objKey : 0;

  var _errorMsseage = null;

  var _json = null;

  this.getObject = function () {
    return _json;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  $.ajax({
    type: "POST",

    url: "../../App_Sys/Services/Admin/Query.asmx/GetDesign",

    data:
      '{"id":"' +
      _activityID +
      '","objKey":"' +
      _objKey +
      '","responseToken":"' +
      genResponseToken() +
      "" +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        _errorMsseage = JSON.stringify(jqXHR);
      }

      alert(_errorMsseage);
    },

    success: function (data) {
      data = data.d;
      if (data.indexOf("#error#") > -1) {
        _errorMsseage = data.replace("#error#", "");

        return;
      }

      _json = jQuery.parseJSON(data);

      setRequestToken(_json.requestToken);
    },
  });
}

function edData(id, objKey) {
  var _activityID = id;

  var _objKey = objKey != null ? objKey : 0;

  var _errorMsseage = null;

  var _json = null;

  this.getObject = function () {
    return _json;
  };

  this.getError = function () {
    return _errorMsseage;
  };
  $.ajax({
    type: "POST",

    url: "../../App_Sys/Services/Admin/Entity.asmx/GetDesign",

    data:
      '{"id":"' +
      _activityID +
      '","objKey":"' +
      _objKey +
      '","responseToken":"' +
      "genResponseToken()" +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        _errorMsseage = JSON.stringify(jqXHR);
      }
    },

    success: function (data) {
      data = data.d;
      if (data.indexOf("#error#") > -1) {
        _errorMsseage = data.replace("#error#", "");

        return;
      }
      _json = jQuery.parseJSON(data);
      //setRequestToken(_json.requestToken);
    },
  });
}

function ddData(id, objKey) {
  var _activityID = id;

  var _objKey = objKey != null ? objKey : 0;

  var _errorMsseage = null;

  var _json = null;

  this.getObject = function () {
    return _json;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  $.ajax({
    type: "POST",

    url: "../../App_Sys/Services/Admin/Dashboard.asmx/GetDesign",

    data:
      '{"id":"' +
      _activityID +
      '","objKey":"' +
      _objKey +
      '","responseToken":"' +
      genResponseToken() +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        _errorMsseage = JSON.stringify(jqXHR);
        console.log(_errorMsseage);
      }
    },

    success: function (data) {
      data = data.d;
      if (data.indexOf("#error#") > -1) {
        _errorMsseage = data.replace("#error#", "");

        return;
      }
      _json = jQuery.parseJSON(data);

      setRequestToken(_json.requestToken);
    },
  });
}

function udData(id, objKey) {
  var _activityID = id;

  var _objKey = objKey != null ? objKey : 0;

  var _errorMsseage = null;

  var _json = null;

  this.getObject = function () {
    return _json;
  };

  this.getError = function () {
    return _errorMsseage;
  };

  $.ajax({
    type: "POST",

    url: "../../App_Sys/Services/Admin/Document.asmx/GetDesign",

    data:
      '{"id":"' +
      _activityID +
      '","objKey":"' +
      _objKey +
      '","responseToken":"' +
      genResponseToken() +
      '"}',

    contentType: "application/json; charset=utf-8",

    dataType: "json",

    async: false,

    error: function (jqXHR, textStatus, errorThrown) {
      _errorMsseage = jqXHR.errorThrown;

      if (
        _errorMsseage == "" ||
        _errorMsseage == null ||
        _errorMsseage === undefined
      ) {
        _errorMsseage = JSON.stringify(jqXHR);
      }

      alert(_errorMsseage);
    },

    success: function (data) {
      data = data.d;

      if (data.indexOf("#error#") > -1) {
        _errorMsseage = data.replace("#error#", "");

        return;
      }

      _json = jQuery.parseJSON(data);

      setRequestToken(_json.requestToken);
    },
  });
}
