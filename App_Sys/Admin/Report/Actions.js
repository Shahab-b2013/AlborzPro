/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.6.1.0*/
/* Release Ferdos.BPMS*/

//بولین اولین دراپ دان لیست عملگر
let boolFirstOperator = true;
//آرایه موقتی جهت نگهداری نوع و شناسه آن
let IDType = [];
//بولین عبارت
let expressionOrGroup = true;
//نگهداری شناسه دراپ دان لیست فیلتر
let tmpFilter;
//آرایه موقتی جهت نگهداری آپشن های دراپ دان لیست عملگر
let opratorArr = [];
//مقدار کنونی دراپ دان لیست عملگر
let tmpCommanOprator;
//بولین اولین بار لود شدن صفحه سوم(یعنی صفحه شرط)
let boolFirstCountThirdPage = true;
//نگهداری آرایه فیلتر جیسون دیتا
let jsonDataFilterArray = [];
// غیر فعال کردن دراپ دان لیست (فیلتر)صفحه ستون ها
//*************************BlockFilter_start************* */
function BlockFilter(filterItem) {
  if (OBJECT_ARRAY.length > 1) {
    for (let index = 0; index < OBJECT_ARRAY.length - 1; index++) {
      if (filterItem != OBJECT_ARRAY[index].filterTarget)
        document
          .getElementById(OBJECT_ARRAY[index].filterTarget)
          .setAttribute("disabled", "disabled");
    }
  }
}
//*************************BlockFilter_end************* */

// پر کردن دراپ دان لیست عملگر
//--------------------------------------------------FillOpratorSelect_Start
function FillOpratorSelect() {
  let sqlOperators;
  if (boolFirstOperator)
    sqlOperators = ["ExpressionGroupBy", "Sum", "Avg", "Min", "Max", "Count"];

  let txtLabel = "";
  $.each(sqlOperators, function (index, data) {
    switch (data) {
      case "ExpressionGroupBy":
        txtLabel = `${reportResources.get("expressionGroupBy")}`;
        break;
      case "Sum":
        txtLabel = `${reportResources.get("sum")}`;
        break;
      case "Avg":
        txtLabel = `${reportResources.get("avg")}`;
        break;
      case "Min":
        txtLabel = `${reportResources.get("min")}`;
        break;
      case "Max":
        txtLabel = `${reportResources.get("max")}`;
        break;
      case "Count":
        txtLabel = `${reportResources.get("count")}`;
        break;

      default:
        txtLabel = `${reportResources.get("expressionGroupBy")}`;
        break;
    }
    opratorArr.push({
      id: index,
      value: data,
      text: txtLabel,
    });
  });
}
//--------------------------------------------------FillOpratorSelect_End
//پر کردن آپشن های دراپ دان لیست عملگر
//*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-**-*-*setOperator-*-*-*-*-*-*-*-*-*-**-*-*setOperator-*-*-*-*-*-*-*-setOperator*-*-**-*-*-*-*-*-setOperator*-*-*-*-*-*setOperator-**-*-*-*-setOperator
function setOperator(getByIdSelectItem) {
  let OperatorOptions = "";
  let TmpLength = OBJECT_ARRAY.length;

  if (TmpLength >= 0) {
    if (opratorArr.length <= 1) {
      opratorArr.cleanValues;
      FillOpratorSelect();
    }

    for (let i = 0; i < opratorArr.length; i++)
      OperatorOptions += `<option value='${opratorArr[i].value}'>${opratorArr[i].text}</option>`;
    getByIdSelectItem.innerHTML = OperatorOptions;
  }
}
//*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-**-*-*setOperator-*-*-*-*-*-*-*-*-*-**-*-*setOperator-*-*-*-*-*-*-*-setOperator*-*-**-*-*-*-*-*-setOperator*-*-*-*-*-*setOperator-**-*-*-*-setOperator
//*-*-*-*-*-*-*-********************************************------------setOrder------Start
//جابجایی دو سطر با زدن دکمه بالا یا پایین
//-------swapElements_Start
function swapElements(obj1, obj2) {
  let tempRowContent = document.createElement("div");
  obj1.parentNode.insertBefore(tempRowContent, obj1);
  obj2.parentNode.insertBefore(obj1, obj2);
  tempRowContent.parentNode.insertBefore(obj2, tempRowContent);
  tempRowContent.parentNode.removeChild(tempRowContent);
  btnAddInLastRow();
}
//-------swapElements_End
//دکمه بالا
//************ upRule_start
function upRule(itemId) {
  let TmpLastFilterId = emptyValueHas();
  let TmpElementId = "rowContent_" + itemId;
  for (let index = 0; index < OBJECT_ARRAY.length; index++)
    document
      .getElementById(OBJECT_ARRAY[index].filterTarget)
      .setAttribute("disabled", "disabled");

  let valueElement = $("#selectFilter_" + itemId).val();
  if (OBJECT_ARRAY.length >= 1 && valueElement != "-1") {
    for (var i = 0; i < OBJECT_ARRAY.length; i++) {
      if (OBJECT_ARRAY[i].rowTarget == TmpElementId && i - 1 >= 0) {
        let IdRowContentPrevious = OBJECT_ARRAY[i - 1].rowTarget;
        let tmpRowObjNow = document.getElementById(TmpElementId);
        let tmpRowObjPrevious = document.getElementById(IdRowContentPrevious);
        BlockFilter(OBJECT_ARRAY[i].filterTarget);
        BlockFilter(OBJECT_ARRAY[i - 1].filterTarget);
        refreshFilterSwapping(
          OBJECT_ARRAY[i - 1].filterTarget,
          TmpLastFilterId,
          OBJECT_ARRAY[i].filterTarget
        );
        swapElements(tmpRowObjNow, tmpRowObjPrevious);
        let tmp = OBJECT_ARRAY[i];
        OBJECT_ARRAY[i] = OBJECT_ARRAY[i - 1];
        OBJECT_ARRAY[i - 1] = tmp;
        tmp.remove;
      }
    }
    if (!BOOL_EMPTY_VALUE_HAS) {
      document
        .getElementById(OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget)
        .removeAttribute("disabled");
    } else {
      disabledDropDownList();
    }
  }
}
//************ upRule_end
//دکمه پایین
//-------------------------------------downRule_START
function downRule(itemId) {
  let TmpLastFilterId = emptyValueHas();
  let TmpElementId = "rowContent_" + itemId;
  for (let index = 0; index < OBJECT_ARRAY.length; index++)
    document
      .getElementById(OBJECT_ARRAY[index].filterTarget)
      .setAttribute("disabled", "disabled");

  let valueElement = $("#selectFilter_" + itemId).val();
  if (OBJECT_ARRAY.length >= 1 && valueElement != "-1") {
    for (var i = OBJECT_ARRAY.length - 1; i >= 0; i--) {
      BlockFilter(OBJECT_ARRAY[i].filterTarget);
      if (
        OBJECT_ARRAY[i].rowTarget == TmpElementId &&
        i + 1 < OBJECT_ARRAY.length
      ) {
        let tmpRowObjNow = document.getElementById(TmpElementId);
        let IdRowObjNext = OBJECT_ARRAY[i + 1].rowTarget;
        let tmpRowObjNext = document.getElementById(IdRowObjNext);
        refreshFilterSwapping(
          OBJECT_ARRAY[i + 1].filterTarget,
          TmpLastFilterId,
          OBJECT_ARRAY[i].filterTarget
        );
        swapElements(tmpRowObjNow, tmpRowObjNext);
        let tmp = OBJECT_ARRAY[i];
        OBJECT_ARRAY[i] = OBJECT_ARRAY[i + 1];
        OBJECT_ARRAY[i + 1] = tmp;
        tmp.remove;
      }
    }

    if (!BOOL_EMPTY_VALUE_HAS) {
      document
        .getElementById(OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget)
        .removeAttribute("disabled");
    } else {
      disabledDropDownList();
    }
  }
}
//-------------------------------------downRule_END
//*-*-*-*-*-*-*-********************************************------------setOrder------End
//LastFilterId
//بررسی مقدار آخر و برگرداندن شناسه ی آخرین فیلتر (نام فیلد)
function emptyValueHas() {
  if (OBJECT_ARRAY.length >= 1) {
    let tmplastValueObjectArray = $(
      "#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget
    ).val();
    if (tmplastValueObjectArray === "-1") {
      //آخری که مقدار -1 داره
      BOOL_EMPTY_VALUE_HAS = true;
      return OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget;
    } else if (tmplastValueObjectArray !== "-1") {
      let selectValue = $(".rowContent .form-control.selectCombo:last").val();
      let selectId = $(".rowContent .form-control.selectCombo:last").attr("id");
      // بررسی مقدار انتخاب شده
      if (selectValue == "-1") {
        BOOL_EMPTY_VALUE_HAS = true;
      } else {
        BOOL_EMPTY_VALUE_HAS = false;
      }
      return selectId;
    } else {
      let selectId = $(".rowContent .form-control.selectCombo:last").attr("id");
      return selectId;
    }
  }
}

// اضافه کردن به ابتدای آرایه فیلتر
function unshiftFilterArr(TargetValue) {
  for (let index = 0; index < REF_FILTER_DATA.length; index++) {
    //بیا مقدار قبلی رو جستجو کن و به اول آرایه فیلتر اضافش کن
    if (REF_FILTER_DATA[index].Name == TargetValue) {
      if (addFilterArr(TargetValue)) {
        filterArr.unshift({
          id: REF_FILTER_DATA[index].Name,
          idCol: REF_FILTER_DATA[index].ID,
          name: REF_FILTER_DATA[index].Name,
          label: REF_FILTER_DATA[index].Label,
          type: REF_FILTER_DATA[index].Type,
          sortType: "",
          groupBy: "",
          TmpViewName: VIEW_TITLE,
        });
      }
      break;
    }
  }
}

function addFilterArr(TargetValue) {
  let tmpRes = true;
  filterArr.map(function (elem) {
    if (elem.name == TargetValue) {
      tmpRes = false;
      return false;
    }
  });
  return tmpRes ? true : false;
}

// اضافه کردن به انتهای آرایه فیلتر
function shiftFilterArr(TargetValue) {
  for (let index = 0; index < REF_FILTER_DATA.length; index++) {
    //بیا مقدار قبلی رو جستجو کن و به اول آرایه فیلتر اضافش کن
    if (REF_FILTER_DATA[index].Name == TargetValue) {
      if (addFilterArr(TargetValue)) {
        filterArr.push({
          id: REF_FILTER_DATA[index].Name,
          idCol: REF_FILTER_DATA[index].ID,
          name: REF_FILTER_DATA[index].Name,
          label: REF_FILTER_DATA[index].Label,
          type: REF_FILTER_DATA[index].Type,
          sortType: "",
          groupBy: "",
          TmpViewName: VIEW_TITLE,
        });
      }
      break;
    }
  }
}

//  تمامی مقادیر در آرایه ی اصلی را از آرایه ی فیلتر ها حذف کند
function duplicateRemovalFilterArr() {
  //اگر مقدار قبلی وجود داشت، بیا بگرد ، حذفش کن
  for (let i = 0; i < filterArr.length; i++) {
    OBJECT_ARRAY.map(function (elem, index) {
      let dropDownValue = $(`#${elem.filterTarget}`).val();
      if (filterArr[i].id == dropDownValue) {
        filterArr.splice(i, 1);
      }
    });
  }
}

//تمامی دراپ دان لیست ها را غیر فعال می کند
function disabledDropDownList() {
  OBJECT_ARRAY.map(function (elem, index) {
    $(`#${elem.filterTarget}`).prop("disabled", true);
  });
}

// // شرایط تازه سازی بعد از سواپ
// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++refreshFilterItems_Start
function refreshFilterSwapping(filterTarget, filterLast, filterCurrent) {
  if (OBJECT_ARRAY.length >= 1) {
    let tmpTargetValue = $(`#${filterTarget}`).val();
    let tmpLastValue = $(`#${filterLast}`).val();
    let tmpCurrentValue = $(`#${filterCurrent}`).val();
    if (tmpTargetValue != "" || tmpTargetValue != null) {
      duplicateRemovalFilterArr();
      if (tmpLastValue !== "-1") {
        if (filterCurrent === filterLast) {
          unshiftFilterArr(tmpTargetValue);
          fillAfterChangeFilterArray(tmpLastValue, filterTarget);
        } else if (filterTarget === filterLast) {
          unshiftFilterArr(tmpCurrentValue);
          fillAfterChangeFilterArray(tmpLastValue, filterCurrent);
        }
        // else {
        //   unshiftFilterArr(tmpLastValue);
        //   fillAfterChangeFilterArray(tmpLastValue, filterLast);
        // }
      } else if (tmpLastValue === "-1") {
        fillAfterChangeFilterArray(tmpLastValue, filterLast);
      }
      disabledDropDownList();
    }
  }
}

//وقتی که سطر آخر منفی یک باشد و ما مقدار یکی مونده به آخر رو تغییر می دیدم
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++refreshFilterItems_Start
function refreshFilterItems(filterTarget) {
  if (OBJECT_ARRAY.length >= 1) {
    //اضافه کردن مقدار قبلی(که در آرایه ی اصلی مقدارش است) به آرایه فیلتر ها
    let TmpAddValue = OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterVal;
    if (TmpAddValue != "" || TmpAddValue != null) {
      let tmpLastOfEndValue = TmpAddValue;
      for (let i = 0; i < filterArr.length; i++) {
        //اگر مقدار قبلی وجود داشت، بیا بگرد ، حذفش کن
        if (filterArr[i].id == tmpLastOfEndValue) {
          filterArr.splice(i, 1);
        }
      }
      for (let index = 0; index < REF_FILTER_DATA.length; index++) {
        //بیا مقدار قبلی رو جستجو کن و به اول آرایه فیلتر اضافش کن
        if (REF_FILTER_DATA[index].Name == tmpLastOfEndValue) {
          if (addFilterArr(REF_FILTER_DATA[index].Name)) {
            filterArr.unshift({
              id: REF_FILTER_DATA[index].Name,
              idCol: REF_FILTER_DATA[index].ID,
              name: REF_FILTER_DATA[index].Name,
              label: REF_FILTER_DATA[index].Label,
              type: REF_FILTER_DATA[index].Type,
              sortType: "",
              groupBy: "",
              TmpViewName: VIEW_TITLE,
            });
          }
          break;
        }
      }
      //حذف مقدار کنونی از آرایه فیلتر ها
      if (OBJECT_ARRAY.length > 0) {
        boolFirstOperator = false;
        deleteFilterItem(OBJECT_ARRAY.length - 1);
        OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterVal = $(
          "#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget
        ).val();
      }
      //نمایش
      fillAfterChangeFilterArray(TmpAddValue, filterTarget);
    }
  }
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++refreshFilterItems_End
// (filterArr)اضافه کردن فیلتر حذف شده به آرایه ی فیلتر ها
//*-*-*-*-*-*-*-********************************************------------AddFilterItemAfterDeleteRow------Start
function addFilterItem(ColumnVal) {
  //ورودی مقداریه که از سطر حذف شده و باید به آرایه فیلتر ها اضافه بشه
  let lastSelectValue = $(".rowContent .form-control.selectCombo:last").val();
  let lastSelectId = $(".rowContent .form-control.selectCombo:last").attr("id");
  let CheackItemNow = true;
  let CheackItemPrev = true;
  let boolSearchEmptyRow = false;
  //مقدار فیلتر قبلی
  let TmpValueFilterPrev;
  //آخرین فیلتر المان
  let TmpLastFilterTarget;
  //آخرین المان موجود که دارای مقدار منفی یک هست
  let tmplast;
  if (OBJECT_ARRAY.length > 0) {
    let TmpLastFilterTargetPrev;
    let tmpIdNumber = TMP_EMPTY_ROW.split("_")[1];
    let tmplastValue;
    if (tmpIdNumber != "" || tmpIdNumber != null) {
      tmplast = "selectFilter_" + tmpIdNumber;
      let tmpEmptyElement = document.getElementById(tmplast);
      if (
        tmpEmptyElement != undefined &&
        (tmpEmptyElement.value === -1 || tmpEmptyElement.value === "-1")
      ) {
        BOOL_EMPTY_VALUE_HAS = true;
      }
    }
    if (ColumnVal === -1 || ColumnVal === "-1") {
      tmplastValue = $("#" + tmplast).val();
      if (tmplastValue == ColumnVal || ColumnVal === lastSelectValue) {
        //حذفی آخریه که همون -1 هستش
        // مقدار قبلی رو بگیر و آن شیفت کن توی آرایه فیلتر
        //آرایه فیلتر رو توی هدف بریز
        //هدف رو فعال کن
        TmpValueFilterPrev = $(
          "#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget
        ).val();
        if (TmpValueFilterPrev === -1 || TmpValueFilterPrev === "-1") {
          OBJECT_ARRAY.splice(OBJECT_ARRAY.length - 1, 1);
          if (OBJECT_ARRAY.length > 0) {
            TmpValueFilterPrev = $(
              "#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget
            ).val();
          }
        }

        for (let i = 0; i < filterArr.length; i++) {
          if (
            TmpValueFilterPrev != -1 &&
            filterArr[i].id == TmpValueFilterPrev
          ) {
            CheackItemPrev = false;
          }
        }
        if (CheackItemPrev && TmpValueFilterPrev != "-1") {
          if (ColumnVal != "-1") TmpLastFilterTarget = emptyValueHas();
          if (TmpLastFilterTarget === undefined) {
            if (
              $(
                "#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget
              ).val() != "-1"
            )
              TmpLastFilterTarget =
                OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget;
          }
          duplicateRemovalFilterArr();
          unshiftFilterArr(TmpValueFilterPrev);
          fillAfterChangeFilterArray(TmpValueFilterPrev, TmpLastFilterTarget);
          if (!BOOL_EMPTY_VALUE_HAS) {
            document
              .getElementById(
                OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget
              )
              .removeAttribute("disabled");
          } else if (OBJECT_ARRAY.length > 0) {
            disabledDropDownList();
          }
          return;
        }
      }
      if (OBJECT_ARRAY.length > 0) {
        TmpValueFilterPrev = $(
          "#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget
        ).val();
        TmpLastFilterTarget =
          OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget;
      }
      CheackItemNow = false;
    }
    if (OBJECT_ARRAY.length >= 2) {
      //اگر آی دی سطر خالی در آرایه آبجکت وجود نداشت ، آخرین فیلتر المان قرارش بده
      //بعدا باید خالیش کنم

      if (TMP_EMPTY_ROW != "") {
        for (let i in OBJECT_ARRAY) {
          if (OBJECT_ARRAY[i].rowTarget == TMP_EMPTY_ROW) {
            let tmplastValue = $("#" + OBJECT_ARRAY[i].filterTarget).val();
            if (tmplastValue == -1) {
              //آخری که مقدار -1 داره ، بذار هدف
              TmpLastFilterTarget = OBJECT_ARRAY[i].filterTarget;
              BOOL_EMPTY_VALUE_HAS = true;
            }
            boolSearchEmptyRow = true;
            break;
          }
        }
        if (!boolSearchEmptyRow && CheackItemNow) {
          //در آرایه آبجکت ذخیره نشده
          TmpValueFilterPrev = "-1";
        }
      }
      if (boolSearchEmptyRow) {
        //بیا بگو اگه آخری منفی یک بود ،مقدار یکی مونده به آخری رو نگه دار واسه اضافه کردن به  آپشن های فیلتر
        if (
          $("#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget).val() ==
          -1
        ) {
          if (
            $("#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 2].filterTarget).val() !=
            -1
          ) {
            TmpLastFilterTargetPrev =
              OBJECT_ARRAY[OBJECT_ARRAY.length - 2].filterTarget;
            let TmpselectFilterPrev = document.getElementById(
              TmpLastFilterTargetPrev
            );
            TmpValueFilterPrev =
              TmpselectFilterPrev.options[TmpselectFilterPrev.selectedIndex]
                .value;
          }
        } else {
          //اگر منفی یک نبود ، مقدار آخری رو نگه دار
          TmpValueFilterPrev = $(
            "#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget
          ).val();
        }
      }
    } else if (OBJECT_ARRAY.length == 1) {
      if (
        $("#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget).val() != -1
      ) {
        TmpValueFilterPrev = $(
          "#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget
        ).val();
      }
    }
    if (TmpValueFilterPrev != "") {
      if (CheackItemPrev && TmpValueFilterPrev != "-1") {
        filterArr = removeRepeatFilter(filterArr);
        if (
          lastSelectId == OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget &&
          OBJECT_ARRAY.length >= 2
        ) {
          if (ColumnVal === TmpValueFilterPrev) {
            //آخری حذف شود
            unshiftFilterArr(
              $("#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 2].filterTarget).val()
            );
          }
        } else {
          shiftFilterArr(lastSelectValue);
        }
      }
      if (
        CheackItemNow &&
        ColumnVal != "-1" &&
        ColumnVal != TmpValueFilterPrev
      ) {
        //بیا مقدار حذفی رو جستجو کن و به ته آرایه فیلتر اضافش کن
        shiftFilterArr(ColumnVal);
      }
      if (ColumnVal != TmpValueFilterPrev) {
        if (TmpValueFilterPrev == "-1" && !boolSearchEmptyRow) {
          let tmpIdNumber = TMP_EMPTY_ROW.split("_")[1];
          if (tmpIdNumber != "" || tmpIdNumber != null)
            TmpLastFilterTarget = "selectFilter_" + tmpIdNumber;
        } else {
          if (ColumnVal != -1) {
            TmpLastFilterTarget =
              OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget;
          }
        }
      } else if (ColumnVal == TmpValueFilterPrev && OBJECT_ARRAY.length >= 2) {
        TmpLastFilterTarget =
          OBJECT_ARRAY[OBJECT_ARRAY.length - 2].filterTarget;
      } else if (ColumnVal == TmpValueFilterPrev && OBJECT_ARRAY.length == 1) {
        fillAfterChangeFilterArray("", tmplast);
        return;
      }
      if (OBJECT_ARRAY.length > 1) {
        let tmpLastOfEndValue = $("#" + TmpLastFilterTarget).val();
        if (CheackItemNow == false && CheackItemPrev == false) {
          for (let i = 0; i < filterArr.length; i++) {
            //اگر مقدار آخری وجود داشت، بیا بگرد ، حذفش کن
            if (filterArr[i].id == tmpLastOfEndValue) {
              filterArr.splice(i, 1);
            }
          }
          //بیا مقدار آخری رو جستجو کن و به اول آرایه فیلتر اضافش کن
          // unshiftFilterArr(tmpLastOfEndValue);
        }
        fillAfterChangeFilterArray(tmpLastOfEndValue, TmpLastFilterTarget);
        if (!BOOL_EMPTY_VALUE_HAS) {
          document
            .getElementById(OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget)
            .removeAttribute("disabled");
        } else if (OBJECT_ARRAY.length > 0) {
          disabledDropDownList();
        }
      }
    }
  }
}

//پر کردن دراپ دان لیست فیلتر بعد از انجام تغییرات
//*-*-*-*-*-*-*-*-*-*-*-**--*-*-*-**--*-**-*--*-**--*-**-*-*--**-*-*--*-*-**-*--*
function fillAfterChangeFilterArray(tmpLastOfEndValue, TmpLastFilterTarget) {
  //اگر ورودی اول مقدار خالی داشته باشه ، مقدار منفی یک هم در دراپ دان لیست قرار می گیرد
  //ورودی دوم شناسه دراپ دان لیستی است که می خواهیم تغییرات اعمال شود
  let tmpLastOptions = "";
  if (tmpLastOfEndValue == "-1" || tmpLastOfEndValue == "") {
    tmpLastOptions = "<option value = '-1'>------------------</option >";
    for (let index = 0; index <= filterArr.length - 1; index++)
      tmpLastOptions += `<option value='${filterArr[index].id}'>${filterArr[index].label}</option>`;
  } else {
    for (let index = 0; index <= filterArr.length - 1; index++)
      tmpLastOptions += `<option value='${filterArr[index].id}'>${filterArr[index].label}</option>`;
  }
  if (TmpLastFilterTarget != "" || TmpLastFilterTarget != null) {
    let tmpElement = document.getElementById(TmpLastFilterTarget);
    if (tmpElement != undefined) {
      tmpElement.innerHTML = tmpLastOptions;
      if (!BOOL_EMPTY_VALUE_HAS) tmpElement.removeAttribute("disabled");
    } else {
      tmpElement = document.getElementById(
        OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget
      );
      if (tmpElement != undefined) {
        tmpElement.innerHTML = tmpLastOptions;
        if (!BOOL_EMPTY_VALUE_HAS) tmpElement.removeAttribute("disabled");
      }
    }
  }
}
//// ////*-*-*-*-*-*-*-********************************************------------AddFilterItemAfterDeleteRow------End
//// //// حذف ردیف با زدن دکمه حذف
//// ////*-*StartDeleteRule-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*-*--**deleteRow
function deleteRule(itemId) {
  let boolEmptyValue = true;
  let TmpElementId = "rowContent_" + itemId;
  fillObjectArrayParameters();
  OBJECT_ARRAY = removeRepeatValue(OBJECT_ARRAY);
  filterArr = removeRepeatFilter(filterArr);
  TMP_EMPTY_ROW = $(".rowContent")[$(".rowContent").length - 1].id;
  for (var i = 0; i < OBJECT_ARRAY.length; i++) {
    if (OBJECT_ARRAY[i].rowTarget == TmpElementId) {
      BOOL_EMPTY_VALUE_HAS = false;
      boolEmptyValue = false;
      let TmpselectFilter = document.getElementById(
        OBJECT_ARRAY[i].filterTarget
      );
      let TmpValueFilter =
        TmpselectFilter.options[TmpselectFilter.selectedIndex].value;
      addFilterItem(TmpValueFilter);
      OBJECT_ARRAY.splice(i, 1);
      break;
    }
  }
  if (boolEmptyValue) {
    //سطری دارم که همچین سطری در آرایه آبجکت وجود نداره
    //سطر آخر رو بیا دراپ دان لیست فیلترش رو فعال کن
    addFilterItem(-1);
  }
  if (OBJECT_ARRAY.length == 0) {
    BOOL_FIRST_COUNT = true;
    boolFirstOperator = true;
    if ($(`#Reportcontent .rowContent`).length == 1)
      RULE_ID = $(`#Reportcontent .rowContent .selectCombo`).attr("id");
  }
  var divElements = document.querySelectorAll(
    "div[id^='" + TmpElementId + "']"
  );
  if (divElements.length > 0) {
    divElements[0].remove();
  }
  Tmp_ID_ROW--;
  if (OBJECT_ARRAY.length >= 1 && !BOOL_EMPTY_VALUE_HAS) {
    document
      .getElementById(OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget)
      .removeAttribute("disabled");
  } else if (OBJECT_ARRAY.length == 0) {
    createAddRule(itemId);
  }
  btnAddInLastRow();
}
//// ////*-*EndDeleteRule-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*-*--**deleteRow
// حذف فیلتر آیتم از آرایه
//-----------------------------------deleteFilterItem_START
function deleteFilterItem(tmpPrivious) {
  //ورودی اندیس آرایه اصلی است
  if (OBJECT_ARRAY.length > 0) {
    if (boolFirstOperator) {
      tmpFilter = OBJECT_ARRAY[0].filterTarget;
      boolFirstOperator = false;
    } else {
      tmpFilter = OBJECT_ARRAY[tmpPrivious].filterTarget;
    }
    let TmpselectFilter = document.getElementById(tmpFilter);
    let TmpValueFilter;
    if (TmpselectFilter)
      TmpValueFilter =
        TmpselectFilter.options[TmpselectFilter.selectedIndex].value;

    for (let index = 0; index < filterArr.length; index++) {
      if (filterArr[index].id == TmpValueFilter) {
        filterArr.splice(index, 1);
      }
    }
  }
}
//-----------------------------------deleteFilterItem_END
// پر کردن آرایه اصلی(OBJECT_ARRAY)
//*****************************************************************fillArray_Start
function fillArray() {
  let boolAdd = true;
  let filterControl = "selectFilter_" + RULE_ID;
  if (OBJECT_ARRAY.length > 0 && RULE_ID > 0) {
    for (let i in OBJECT_ARRAY) {
      if (OBJECT_ARRAY[i].filterTarget == filterControl) {
        // //filterVal
        let tmpFilterTarget = document.getElementById(filterControl);
        let tmpValueFilterTarget =
          tmpFilterTarget.options[tmpFilterTarget.selectedIndex].value;
        if (tmpValueFilterTarget != "" || tmpValueFilterTarget != "-1") {
          OBJECT_ARRAY[i].filterVal = tmpValueFilterTarget;
          //  //SortVal
          let tmpSortTarget = document.getElementById(
            OBJECT_ARRAY[OBJECT_ARRAY.length - 1].sortTarget
          );
          let tmpValueSortTarget =
            tmpSortTarget.options[tmpSortTarget.selectedIndex].value;
          if (tmpValueSortTarget != "")
            OBJECT_ARRAY[i].SortVal = tmpValueSortTarget;

          // //CommandVal
          let tmpCommandTarget = document.getElementById(
            OBJECT_ARRAY[OBJECT_ARRAY.length - 1].commandTarget
          );
          let tmpValueCommandTarget =
            tmpCommandTarget.options[tmpCommandTarget.selectedIndex].value;
          if (tmpValueCommandTarget != "")
            OBJECT_ARRAY[i].CommandVal = tmpValueCommandTarget;

          //  //TmpViewName
          if (VIEW_TITLE != "") OBJECT_ARRAY[i].TmpViewName = VIEW_TITLE;
          boolAdd = false;
        }
      }
    }
  }
  if (boolAdd) {
    if (BOOL_FIRST_COUNT) {
      OBJECT_ARRAY = [];
      RULE_ID =
        $(`.rowContent`).length == 0
          ? (RULE_ID = 0)
          : $(`.rowContent`).children().eq(1).attr("id").split("_")[1];
      OBJECT_ARRAY.push({
        tmpId: RULE_ID,
        TmpIndex: 0,
        filterTarget: "selectFilter_" + RULE_ID,
        sortTarget: "selectItem0_" + RULE_ID,
        commandTarget: "selectItem2_" + RULE_ID,
        rowTarget: "rowContent_" + RULE_ID,
        filterVal: "",
        SortVal: "",
        CommandVal: "",
        TmpViewName: "",
      });
    } else {
      try {
        //AddToArrayNewOrder-------------------------------------------------------Start
        let tmpIdOrder = RULE_ID;
        OBJECT_ARRAY.push({
          tmpId: tmpIdOrder,
          TmpIndex: OBJECT_ARRAY.length,
          filterTarget: "selectFilter_" + RULE_ID,
          sortTarget: "selectItem0_" + RULE_ID,
          commandTarget: "selectItem2_" + RULE_ID,
          rowTarget: "rowContent_" + RULE_ID,
          filterVal: "",
          SortVal: "",
          CommandVal: "",
          TmpViewName: "",
        });
        //AddToArrayNewOrder-------------------------------------------------------End
      } catch (e) {}
    }
    BOOL_FIRST_COUNT = false;
  }
}
//*****************************************************************fillArray_END
// پر کردن آرایه اصلی بوسیله شناسه دراپ دان لیست فیلتر
//************************------------------------fillArrayById_Start
function fillArrayById(filterDrpDonListId) {
  let filterControl = filterDrpDonListId;
  if (OBJECT_ARRAY.length > 0) {
    for (let i in OBJECT_ARRAY) {
      if (OBJECT_ARRAY[i].filterTarget == filterControl) {
        // //filterVal
        let tmpValueFilterTarget = $("#" + filterDrpDonListId).val();
        if (tmpValueFilterTarget != "" || tmpValueFilterTarget != "-1") {
          OBJECT_ARRAY[i].filterVal = tmpValueFilterTarget;
          //  //SortVal
          let tmpSortTarget = OBJECT_ARRAY[OBJECT_ARRAY.length - 1].sortTarget;
          let tmpValueSortTarget = $("#" + tmpSortTarget).val();
          if (tmpValueSortTarget != "")
            OBJECT_ARRAY[i].SortVal = tmpValueSortTarget;
          // //CommandVal
          let tmpCommandTarget =
            OBJECT_ARRAY[OBJECT_ARRAY.length - 1].commandTarget;
          let tmpValueCommandTarget = $("#" + tmpCommandTarget).val();
          if (tmpValueCommandTarget != "")
            OBJECT_ARRAY[i].CommandVal = tmpValueCommandTarget;
          //  //TmpViewName
          if (VIEW_TITLE != "") OBJECT_ARRAY[i].TmpViewName = VIEW_TITLE;
        }
      }
    }
  }
}
//************************------------------------fillArrayById_END
//فراخوانی توابع پر کردن دراپ دان لیست عملگر و مرتب سازی
// fillSqlSelect**************************************Start
function fillSqlSelect(index, getByIdSelectItem) {
  switch (index) {
    case 0:
      //SortDropDownList
      if (getByIdSelectItem !== null) {
        getByIdSelectItem.innerHTML = `<option value='unsorted'>-----------------</option><option value='ASC'>${reportResources.get(
          "ascending"
        )}</option><option value='DESC'>${reportResources.get(
          "descending"
        )}</option>`;
      }
      break;
    case 2:
      //SqlCommandDropDownList
      fillArray();
      if (getByIdSelectItem !== null) setOperator(getByIdSelectItem);
      break;
    default:
      break;
  }
}
// fillSqlSelect**************************************End
// ChangeFilterItem**************************************Start
//مخفی کردن دراپ دان لیست مرتب سازی و عملگر
//------------------------------hiddenSqlSelects_Start
function hiddenSqlSelects(parameter) {
  let selectItem0 = "selectItem0_" + RULE_ID;
  let selectItem2 = "selectItem2_" + RULE_ID;
  let filterItem = "selectFilter_" + RULE_ID;
  let getByIdSelectItem0 = document.getElementById(selectItem0);
  let getByIdSelectItem2 = document.getElementById(selectItem2);
  if (parameter) {
    getByIdSelectItem0.style.visibility = "hidden";
    getByIdSelectItem2.style.visibility = "hidden";
    refreshFilterItems(filterItem);
  } else {
    fillSqlSelect(0, getByIdSelectItem0);
    fillSqlSelect(2, getByIdSelectItem2);
    getByIdSelectItem0.style.visibility = "visible";
    getByIdSelectItem2.style.visibility = "visible";
    BlockFilter(filterItem);
  }
}
//------------------------------hiddenSqlSelects_End
//فراخوانی توابع صفحه ستون ها
// نمایش یا عدم نمایش دراپ دان لیست های مرتب سازی و عملگر
//------------------------------visibleSqlSelects_Start
function visibleSqlSelects() {
  let TmpValueFilterNow = $("#selectFilter_" + RULE_ID).val();
  if (TmpValueFilterNow === "-1") {
    hiddenSqlSelects(true);
  } else {
    hiddenSqlSelects(false);
  }
}
//------------------------------visibleSqlSelects_End
// ChangeFilterItem**************************************End
//--------------------------------------------------------------------------------Start-outputJsonData------------------****************
//  StrJsonResult و OUTPUT_JsonTxt ایجاد رشته متنی
//******************outputJsonData_Start
function outputJsonData() {
  let StrJsonResult = "";
  OUTPUT_JsonTxt = "";
  if (OUTPUTColumns.length > 0) {
    StrJsonResult = '{"Columns":[';
    for (let i = 0; i < OUTPUTColumns.length; i++) {
      IDType.cleanValues;
      let ColumnVal = OUTPUTColumns[i].Name;
      for (let index = 0; index < REF_FILTER_DATA.length; index++) {
        if (REF_FILTER_DATA[index].Name == ColumnVal) {
          IDType.push({
            idCol: REF_FILTER_DATA[index].ID,
            // type: REF_FILTER_DATA[index].Type.toLowerCase(),
            type: REF_FILTER_DATA[index].Type.replace(/^\w/, (c) =>
              c.toUpperCase()
            ),
          });
          break;
        }
      }
      if (IDType.length > 0) {
        OUTPUTColumns[i].ID = IDType[i].idCol;
        OUTPUTColumns[i].Type = IDType[i].type;
        IDType.cleanValues;
      }
      if (expressionOrGroup) {
        OUTPUTColumns[i].GroupBy = "Expression";
      }
      if (
        !expressionOrGroup &&
        OUTPUTColumns[i].GroupBy == "ExpressionGroupBy"
      ) {
        OUTPUTColumns[i].GroupBy = "GroupBy";
      }
    }
    for (let index = 0; index < OUTPUTColumns.length; index++) {
      StrJsonResult +=
        '{ \n "ID":' +
        OUTPUTColumns[index].ID +
        ',"Name":"' +
        OUTPUTColumns[index].Name +
        '","Label":"' +
        OUTPUTColumns[index].Label +
        '","Type":"' +
        OUTPUTColumns[index].Type +
        '","TextExpression":"' +
        OUTPUTColumns[index].TextExpression +
        '","SortType":"' +
        OUTPUTColumns[index].SortType +
        '","GroupBy":"' +
        OUTPUTColumns[index].GroupBy +
        ',"EnumTypeID":"' +
        OUTPUTColumns[index].EnumTypeID +
        ',"RefEntityID":"' +
        OUTPUTColumns[index].RefEntityID +
        ',"EntityAttributeID":"' +
        OUTPUTColumns[index].EntityAttributeID +
        '" \n }';
      if (index + 1 < OUTPUTColumns.length) {
        StrJsonResult += ", ";
      }
    }
    StrJsonResult += '],"SelectClause":';
  } else {
    StrJsonResult = "";
  }
  OUTPUTColumns.cleanValues;
  return StrJsonResult;
}
//******************outputJsonData_End
//--------------------------------------------------------------------------------End-outputJsonData------------------****************
// نام را گرفته و نهایتا آرایه از اطلاعات را بر می گرداند
function setColumnID(TmpFilter) {
  let resultArray = [];
  let TxtExpression = "";
  let strEnumTypeID = "";
  let strRefEntityID = "";
  let strEntityAttributeID = "";
  REF_FILTER_DATA.map(function (elem) {
    if (elem.Name == TmpFilter) {
      TxtExpression = elem.Exprssion;
      strEnumTypeID = elem.EnumTypeID;
      strRefEntityID = elem.RefEntityID;
      strEntityAttributeID = elem.EntityAttributeID;
    }
  });
  resultArray.push({
    TxtExpression: TxtExpression,
    EnumTypeID: strEnumTypeID,
    RefEntityID: strRefEntityID,
    EntityAttributeID: strEntityAttributeID,
  });
  return resultArray;
}

// نام را گرفته و نهایتا نام اصلی جدول را به همراه ستون بر می گرداند
function setExpression(TmpFilter) {
  let TxtExpression = "";
  REF_FILTER_DATA.map(function (elem) {
    if (elem.Name == TmpFilter) {
      TxtExpression = elem.Exprssion;
    }
  });
  return TxtExpression;
}

//SqlResulrString
// و ایجاد آرایه ی خروجی
//*-**-*-*-**-*-*-*-**-*-*--*-*-*-*--*-*-*-*-*-*-*-*-*-*-*-***************SQLCommands---Start
function getSql() {
  let SqlResultStr = "";
  let sortypeVal = [];
  let sortypeStr = "";
  let groupByStr = "";
  let IsExpression = true;
  let coulumnStr = "";
  let fieldViewStr = "";
  let IsGroupByCount = 0;
  let Alias = "";
  let Col_ = "";
  //--------------------------updateData_START
  let firstSort = true;
  let firstGroup = true;
  let Tmp_Filter;
  let TmpFilterLabel = "";
  let TmpoptionSort = null;
  let colIdArray = [];
  OUTPUTColumns = [];
  OUTPUT = output_basic;
  IDType = [];
  for (let i = 0; i < OBJECT_ARRAY.length; i++) {
    let strSelectSortype = OBJECT_ARRAY[i].sortTarget;
    let strcommanOprator = OBJECT_ARRAY[i].commandTarget;
    let strfilter = OBJECT_ARRAY[i].filterTarget;
    let TmpSelectFilter = document.getElementById(strfilter);
    if (TmpSelectFilter != null) {
      Tmp_Filter = TmpSelectFilter.options[TmpSelectFilter.selectedIndex].value;
      TmpFilterLabel =
        TmpSelectFilter.options[TmpSelectFilter.selectedIndex].text;
      colIdArray = setColumnID(Tmp_Filter);
    }
    let Tmpselect = document.getElementById(strSelectSortype);
    if (Tmpselect) TmpoptionSort = Tmpselect.options[Tmpselect.selectedIndex];
    let TmpselectOprator = document.getElementById(strcommanOprator);
    if (
      TmpselectOprator.options[TmpselectOprator.selectedIndex] &&
      typeof TmpselectOprator.options[TmpselectOprator.selectedIndex].value !==
        "undefined"
    ) {
      tmpCommanOprator =
        TmpselectOprator.options[TmpselectOprator.selectedIndex].value;
    } else {
      return null;
    }
    //*****************************************SetpreliminaryDataInOutPutArray */
    OUTPUTColumns.push({
      ID: "",
      Name: Tmp_Filter,
      Label: TmpFilterLabel,
      Type: "",
      TextExpression: colIdArray.TxtExpression,
      SortType: TmpoptionSort ? TmpoptionSort.value : null,
      SortOrder: "1",
      GroupBy: tmpCommanOprator,
      EnumTypeID: colIdArray.EnumTypeID,
      RefEntityID: colIdArray.RefEntityID,
      EntityAttributeID: colIdArray.EntityAttributeID,
    });
    //*****************************************SetpreliminaryDataInOutPutArray */
    sortypeVal.push({
      TmptargetFilter: strfilter,
      TmptargetSort: strSelectSortype,
      TmptargetOprator: strcommanOprator,
      operatorOpt: TmpoptionSort ? TmpoptionSort.text : null,
      operatorVal: TmpoptionSort ? TmpoptionSort.value : null,
      coulumnName: Tmp_Filter,
      commandName: tmpCommanOprator,
      TmpViewName: VIEW_TITLE,
      TextExpression: setExpression(Tmp_Filter),
    });
  }
  for (let i = 0; i < sortypeVal.length; i++) {
    let TmpCommand = sortypeVal[i].commandName;
    if (TmpCommand != "ExpressionGroupBy") {
      IsGroupByCount++;
      IsExpression = false;
    }
  }
  expressionOrGroup = IsExpression;
  for (let i = 0; i < sortypeVal.length; i++) {
    let TmpCommand = sortypeVal[i].commandName;
    function columnOperator(opt, col) {
      Alias = "";
      if (opt !== "ExpressionGroupBy") {
        Col_ = col.replace(".", "_");
      }
      switch (opt) {
        case "Sum":
          Alias = "SUM_" + Col_;
          sortypeVal[i].TextExpression = Alias;
          return "SUM(" + col + ") AS " + Alias;
          break;
        case "Avg":
          Alias = "AVG_" + Col_;
          sortypeVal[i].TextExpression = Alias;
          return "AVG(" + col + ") AS " + Alias;
          break;
        case "Min":
          Alias = "MIN_" + Col_;
          sortypeVal[i].TextExpression = Alias;
          return "MIN(" + col + ") AS " + Alias;
          break;
        case "Max":
          Alias = "MAX_" + Col_;
          sortypeVal[i].TextExpression = Alias;
          return "MAX(" + col + ") AS " + Alias;
          break;
        case "Count":
          Alias = "Count_" + Col_;
          sortypeVal[i].TextExpression = Alias;
          return "Count(" + col + ") AS " + Alias;
          break;

        default:
          return col ? col.toString() : null;
          break;
      }
    }
    if (i > 0) {
      coulumnStr +=
        ", " + columnOperator(TmpCommand, sortypeVal[i].TextExpression);
    } else {
      coulumnStr = columnOperator(TmpCommand, sortypeVal[i].TextExpression);
    }
    if (
        (sortypeVal[i].operatorVal != "unsorted" && sortypeVal[i].operatorVal != "filteronly" && IsGroupByCount > 0) ||
        (sortypeVal[i].operatorVal != "unsorted" && sortypeVal[i].operatorVal != "filteronly" && IsExpression)
    ) {
      if (!firstSort) {
        sortypeStr += ", ";
      }
      if (firstSort) {
        sortypeStr = " ORDER BY";
        firstSort = false;
      }
      if (Alias != "") {
        sortypeStr +=
          " " + Alias + " " + sortypeVal[i].operatorVal.toString() + " ";
        sortypeVal[i].operatorVal ? sortypeVal[i].operatorVal.toString() : null;
        Alias = "";
      } else {
        if (sortypeVal[i].TextExpression != undefined)
          sortypeStr +=
            " " +
            sortypeVal[i].TextExpression.toString() +
            " " +
            sortypeVal[i].operatorVal.toString() +
            " ";
      }
    }

    // شرط میگه اگر دراپ دان لیست مقدار، آیتم مقدار انتخاب شده بود ، اجرا بشو وگرنه گروپ بای نباید بنویسه
    if (
      IsGroupByCount > 0 &&
      sortypeVal[i].commandName === "ExpressionGroupBy"
    ) {
      if (!firstGroup) {
        groupByStr += ", ";
      } else if (firstGroup) {
        groupByStr = " GROUP BY";
        firstGroup = false;
      }
      if (sortypeVal[i].TextExpression != undefined) {
        groupByStr += " " + sortypeVal[i].TextExpression.toString() + " ";
      }
    }
  }
  if (OBJECT_ARRAY.length > 0) {
    boolFirstOperator = false;
    deleteFilterItem(OBJECT_ARRAY.length - 1);
  }
  OUTPUTColumns = removeRepeatColumn(OUTPUTColumns);
  OUTPUT_JsonTxt = outputJsonData();
  if (coulumnStr == "" || RELATION_QUERY == "") {
    // alert(" لطفا اطلاعات را تکمیل نمایید ");
    SqlResultStr = "";
    return;
  }
  coulumnStr = coulumnStr.replace(/-/g, ".");
  if (IsExpression && IsGroupByCount == 0) {
    SqlResultStr = `SELECT ${coulumnStr} ${RELATION_QUERY} ${sortypeStr}`;
  } else if (!IsExpression && IsGroupByCount > 0) {
    SqlResultStr =
      "SELECT " +
      coulumnStr +
      " " +
      RELATION_QUERY +
      " " +
      groupByStr +
      " " +
      sortypeStr;
  }
  return SqlResultStr;
}
//*-**-*-*-**-*-*-*-**-*-*--*-*-*-*--*-*-*-*-*-*-*-*-*-*-*-***************SQLCommands---End
// اعتبار سنجی و پر کردن آرایه خروجی
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**Popup---Start
function popupSql(strSql) {
  //ورودی رشته کوئری خروجی صفحه ستون ها است
  let textSql;
  let textJson;
  if (strSql == null || strSql == "" || strSql == undefined) {
    textSql = "";
  } else {
    textSql = strSql;
    OUTPUTColumns = removeRepeatColumn(OUTPUTColumns);
    if (OUTPUT.length == 0) {
      OUTPUT.push({
        ReportID: JsonData.ReportID,
        ModuleID: JsonData.ModuleID,
        DatasetID: DATASET_ID,
        DatasetName: VIEW_TITLE,
        SelectClause: strSql,
        Columns: OUTPUTColumns,
        WhereClause: "",
        Filter: [],
        CompleteQuery: "",
        AccessRoles: [],
        AccessGroups: [],
        //Label: TMP_LABEL,
        //Header: TMP_HEADER,
        Footer: TMP_FOOTER,
        Description: TMP_DESCRIPTION,
        GroupingLevel: GROUPING_LEVEL,
        requestToken: JsonData.requestToken,
        Schedule: [],
      });
    } else if (OUTPUT.length == 1) {
      OUTPUT[0].ReportID = JsonData.ReportID;
      OUTPUT[0].ModuleID = JsonData.ModuleID;
      OUTPUT[0].DatasetID = DATASET_ID;
      OUTPUT[0].DatasetName = VIEW_TITLE;
      OUTPUT[0].SelectClause = strSql;
      OUTPUT[0].Columns = OUTPUTColumns;
      OUTPUT[0].WhereClause = "";
      OUTPUT[0].Filter = [];
      OUTPUT[0].CompleteQuery = "";
      OUTPUT[0].AccessRoles = [];
      OUTPUT[0].AccessGroups = [];
      OUTPUT[0].Label = TMP_LABEL;
      OUTPUT[0].Header = TMP_HEADER;
      OUTPUT[0].Footer = TMP_FOOTER;
      OUTPUT[0].Description = TMP_DESCRIPTION;
      OUTPUT[0].GroupingLevel = GROUPING_LEVEL;
      OUTPUT[0].requestToken = JsonData.requestToken;
      OUTPUT[0].Schedule = [];
    }
    JsonData.Columns = OUTPUTColumns;
    OUTPUTColumns = [];
  }
  if (OUTPUT_JsonTxt == null || OUTPUT_JsonTxt == "") {
    textJson = "";
    return false;
  } else {
    textJson = "";
    textJson = OUTPUT_JsonTxt;
    return true;
  }
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**Popup---End
//  گرفتن خروجی از صفحه ستون ها
//-------------------------------------------------------------------------------------nextStepFunction---Start
function nextStepFunction() {
  let strSql = getSql();
  if (strSql == undefined || strSql == null) return false;
  popupSql(strSql);
  JsonData.SelectClause = strSql;
  return true;
}
//-------------------------------------------------------------------------------------nextStepFunction---End
// <!-- Demo---------------------------------------------- ************************************ -->
// گرفتن خروجی صفحه ستون ها و اعتبار سنجی اس کیو ال خروجی صفحه ستون ها
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**getFilterPage---Start
function getFilterPage() {
  MyWhereResult = "";
  let boolResult = nextStepFunction();
  if (!boolResult) {
    BOOL_EXPORT = false;
    return false;
  }

  var result = $("#builder-basic").queryBuilder("getRules");
  if (!$.isEmptyObject(result)) {
    if (OUTPUT.length == 0) OUTPUT = output_basic;

    JsonData.Filter = result;
    OUTPUT[0].Filter = result;
  }
  var SqlResult = $("#builder-basic").queryBuilder("getSQL", "question_mark");
  if (SqlResult === false) {
    JsonData.Filter = [];
    JsonData.Filter.push(rules_basic);
    JsonData.WhereClause = "";
    return true;
  }
  MyWhereResult = SqlResult != null ? SqlResult.sql : "";
  if (SqlResult != null) {
    MyWhereResult = MyWhereResult.replace(/[\w-]+/g, (elem) => {
      if (!elem.includes("-")) {
        return elem;
      } else {
        let tmpExpretionResult = setExpression(elem);
        return tmpExpretionResult;
      }
    });
    JsonData.WhereClause = "";
    for (let i in SqlResult.params) {
      if (SqlResult.params[i] === "") {
        BOOL_EXPORT = false;
        return false;
      }
      MyWhereResult = MyWhereResult.replace("?", SqlResult.params[i]);
    }
    if (MyWhereResult != "") {
      JsonData.WhereClause += MyWhereResult;
    } else {
      JsonData.WhereClause = "";
    }
    OUTPUT[0].WhereClause = JsonData.WhereClause;
    return true;
  } else {
    JsonData.WhereClause = "";
    return false;
  }
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**getFilterPage---End
// <!-- NewAction---------------------------------------------- ************************************ -->
//ریست کردن صفحه ستون ها
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**resetColumnsPage---Start
function resetColumnsPage() {
  for (let index = 0; OBJECT_ARRAY.length >= 1; index++) {
    let itemId = OBJECT_ARRAY[0].rowTarget.split("_")[1];
    if (itemId != undefined) {
      let TmpElementId = "rowContent_" + itemId;
      for (var i = 0; i < OBJECT_ARRAY.length; i++) {
        if (OBJECT_ARRAY[i].rowTarget == TmpElementId) {
          OBJECT_ARRAY.splice(i, 1);
        }
      }
      if (OBJECT_ARRAY.length <= 0) {
        BOOL_FIRST_COUNT = true;
        RULE_ID = 0;
        Tmp_ID_ROW = 0;
      }
      var divElements = document.querySelectorAll(
        "div[id^='" + TmpElementId + "']"
      );
      if (divElements.length > 0) {
        divElements[0].remove();
      }
    }
  }
  try {
    let tmpRowContentId = document.querySelector(".rowContent").id;
    if (tmpRowContentId != null) {
      var divRowContentElements = document.querySelectorAll(
        "div[id^='" + tmpRowContentId + "']"
      );
      if (divRowContentElements.length > 0) {
        divRowContentElements[0].remove();
      }
    }
  } catch (error) {}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**resetColumnsPage---End
//ریست کردن صفحه فیلتر ها
//*-*-*-------------------**resetFiltersPage---Start
function resetFiltersPage() {
  $("#builder-basic").queryBuilder("reset");
}
//*-*-*-------------------**resetFiltersPage---End
function resetAccessPage() {
  JsonData.AccessRoles = [];
  JsonData.AccessGroups = [];
  BOOL_FORTH_PAGE_ROLE = true;
  BOOL_FORTH_PAGE_GROUP = true;
  ROLES_CHECKED_ARRAY = [];
  GROUPS_CHECKED_ARRAY = [];
  let groupsCheckboxes = document.getElementsByClassName("groupsChk");
  if (groupsCheckboxes.length > 0) {
    for (let i = 0; i < groupsCheckboxes.length; i++) {
      groupsCheckboxes[i].checked = false;
    }
  }
  let rolesCheckboxes = document.getElementsByClassName("rolesChk");
  if (rolesCheckboxes.length > 0) {
    for (let i = 0; i < rolesCheckboxes.length; i++) {
      rolesCheckboxes[i].checked = false;
    }
  }
}

// دکمه ادامه
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**nextTab---Start
//ورودی شناسه دکمه ی ادامه است
function nextTab(divId) {
  let itemDivId = divId.split("_")[1];
  let idNumber = divId.split("-")[2];
  let nextIdNumber = 0;
  let nextitemDivId = "";
  let NowLiId = "";
  let nextLiId = "";
  let boolPageResult = false;
  if (itemDivId == "rpt-wiz-1") {
    //General specifications Page Exist Into rpt-wiz-1
    boolPageResult = generalSpecifications();
    if (boolPageResult && !SAVE_ITEMS) {
      if (
        !CREATE_MODE &&
        JsonData.Filter.length == 0 &&
        boolFirstCountThirdPage
      ) {
        CREATE_MODE = true;
      }
      if (CREATE_MODE) {
        showColumnPage();
        if (OBJECT_ARRAY.length >= 1 && BOOL_FIRST_COUNT) {
          resetColumnsPage();
          fillArray();
          let tmpExistRow = document.getElementById(OBJECT_ARRAY[0].rowTarget);
          if (OBJECT_ARRAY.length == 1 && tmpExistRow == undefined) {
            newRow(JsonData);
            document.getElementById("selectFilter_" + RULE_ID).onchange =
              visibleSqlSelects;
          }
          document.getElementById(
            OBJECT_ARRAY[OBJECT_ARRAY.length - 1].commandTarget
          ).style.visibility = "hidden";
          document.getElementById(
            OBJECT_ARRAY[OBJECT_ARRAY.length - 1].sortTarget
          ).style.visibility = "hidden";
          fillFilterArrColumnsPage();
          fillFilterSelectOption();
        } else if (OBJECT_ARRAY.length == 0) {
          document.getElementById("selectItem0_" + RULE_ID).style.visibility =
            "hidden";
          document.getElementById("selectItem2_" + RULE_ID).style.visibility =
            "hidden";
          fillFilterArrColumnsPage();
          fillFilterSelectOption();
        }
      } else {
        showColumnPage();
        fillFilterEditMode();
        fillFilterSelectOption();
      }
    } else {
      //Movement
      boolPageResult = true;
    }
  } else if (itemDivId == "rpt-wiz-2") {
    //myself Page Exist Into rpt-wiz-2
    let tmpArray = removeRepeatValue(OBJECT_ARRAY);
    OBJECT_ARRAY = [];
    OBJECT_ARRAY = tmpArray;
    boolPageResult = nextStepFunction();
    if (boolPageResult) {
      REPORT_CHANGE_SCHEMA_ARRAY = showColumnPage();
      document.getElementById("container").style.display = "none";
      document.getElementById("divContainer").style.display = "block";
      if (boolFirstCountThirdPage) {
        if (!CREATE_MODE) {
          //EditMode
          jsonDataFilterArray = JsonData.Filter;
        }
        showFiltersPage();
      }
      if (typeof jsonDataFilterArray === "object") {
        const filterbase = '[{"condition":"AND","rules":[],"valid":true}]';
        const jsonDataFilterArr = [];
        jsonDataFilterArr.push(jsonDataFilterArray);
        const jsonDataFilter = JSON.stringify(jsonDataFilterArr);
        if (filterbase === jsonDataFilter || jsonDataFilter === "[]") {
          jsonDataFilterArray = [];
          jsonDataFilterArray = jsonDataFilterArr;
        }
      }
      $("#builder-basic").queryBuilder({
        filters: [],
        plugins: [],
        rules: [],
        plugins: ["bt-tooltip-errors"],
        filters: FILTER_filterArr,
        rules: jsonDataFilterArray,
      });
      $(".selectpicker").selectpicker();
    } else {
      //Movement
      boolPageResult = true;
    }
  } else if (itemDivId == "rpt-wiz-3") {
    // QueryBuilder Page Exist Into rpt-wiz-3
    boolPageResult = getFilterPage();

    if (CREATE_MODE) CREATE_MODE = false;

    SAVE_ITEMS = true;
    if (boolPageResult) {
      showUserRules();
      showUserGroups();
    } else {
      //Movement
      boolPageResult = true;
    }
  } else if (itemDivId == "rpt-wiz-4") {
    //  This Page Is Empty => rpt-wiz-4
    boolPageResult = saveAccessInJsonData();
    if (boolPageResult) {
      schedulerPage();
      loadInSchedulerPage();
      //    #rpt-wiz-5 display: none;
      idNumber++;
    } else {
      //Movement
      boolPageResult = true;
    }
  } else if (itemDivId == "rpt-wiz-5") {
    // This Page Is Empty => rpt-wiz-5
    boolPageResult = saveScheduler();
  }
  if (boolPageResult) {
    document.getElementById(itemDivId).style.display = "none";
    if (idNumber < ITEM_INDEX) {
      nextIdNumber = parseInt(idNumber) + 1;
      nextitemDivId = "rpt-wiz-" + nextIdNumber;
      NowLiId = "Li" + itemDivId;
      nextLiId = `Li${nextitemDivId}`;
      if (nextitemDivId == "rpt-wiz-2") {
        //Next Page Is rpt-wiz-2
        document.getElementById("container").style.display = "block";
      } else if (nextitemDivId == "rpt-wiz-3") {
        // Next Page Is rpt-wiz-3
        document.getElementById("divContainer").style.display = "block";
      }
      if (nextIdNumber < ITEM_INDEX) {
        document.getElementById(nextitemDivId).style.display = "block";
      }
      document.getElementById(nextLiId).classList.add("active");
      document.getElementById(NowLiId).classList.remove("active");
    }
    boolPageResult = false;
  }
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**nextTab---End
// نوار بالای تمپلیت
//-------------------------------------clickNavbar_Start
function clickNavbar(liId) {
  //ورودی شناسه نوار منوی صفحه ی مورد نظر است
  let idNumber = liId.split("-")[2];
  if (ITEM_INDEX === undefined) {
    const ITEM_INDEX = 6;
  }
  if (idNumber <= ITEM_INDEX) {
    let itemDivId = liId.split("Li")[1];
    for (let index = 1; index <= ITEM_INDEX; index++) {
      let strDivId = "rpt-wiz-" + index;
      let strLiId = "Lirpt-wiz-" + index;
      document.getElementById(strLiId).classList.add("active");
      document.getElementById(strLiId).classList.remove("active");
      document.getElementById(strLiId).style.fontWeight = "normal";
      document.getElementById(strDivId).style.display = "none";
    }
    document.getElementById(liId).classList.add("active");
    document.getElementById(itemDivId).style.display = "block";
    //document.getElementById("container").style.display = "block";
    const container = document.getElementById("container");
    if (container) {
      container.style.display = "block";
    }
  }
}
//-------------------------------------clickNavbar_Start
// اعتبار سنجی صفحه مشخصات کلی
//-----------------------------------------generalSpecifications---Start
function generalSpecifications() {
  let tmpSelectReportSchema = document.getElementById("selectReportSchema");
  let tmpFieldValue =
    tmpSelectReportSchema.options[tmpSelectReportSchema.selectedIndex].value;
  if (BOOL_FIRST_COUNT && boolFirstCountThirdPage) SAVE_ITEMS = false;
  if (LAST_SCHEMA_VALUE != tmpFieldValue) {
    SAVE_ITEMS = false;
    LAST_SCHEMA_VALUE = tmpFieldValue;
    LAST_SCHEMA_INDEX = tmpSelectReportSchema.selectedIndex;
  }
  let tmpTitle = document.getElementById("tltleTxt").value;
  let tmpHeader = document.getElementById("headerTxt").value;
  let tmpFooter = document.getElementById("footerTxt").value;
  let tmpDescription = document.getElementById("descriptionTxt").value;
  if (
    tmpTitle.trim() != "" &&
    tmpHeader.trim() != "" &&
    tmpFooter.trim() != ""
  ) {
    TMP_LABEL = JsonData.Label = tmpTitle;
    TMP_HEADER = JsonData.Header = tmpHeader;
    TMP_FOOTER = JsonData.Footer = tmpFooter;
    TMP_DESCRIPTION = JsonData.Description = tmpDescription;
    return true;
  } else {
    return false;
  }
}
//-----------------------------------------generalSpecifications---End
//تابع گرفتن زیر مجموعه
//-------------------------------------getListByFilter_Start
function getListByFilter(list, fieldName, fieldValue) {
  //ورودی اول رفرنس ستون های جیسون دیتا است
  //ورودی دوم  دیتا ست است
  //ورودی سوم مقدار دراپ دان لیست شمای گزارش است
  return $.grep(list, function (obj, i) {
    return obj[fieldName] == fieldValue;
  });
}
//-------------------------------------getListByFilter_End
// گرفتن دیتا بر اساس شمای انتخابی در دراپ دان لیست صفحه مشخصات کلی
//-------------------------------------showColumnPage_Start
function showColumnPage() {
  let tmpSelectReportSchema = document.getElementById("selectReportSchema");
  let tmpFieldValue = "";
  let tmpFieldName = "Dataset";
  let tmpList = JsonData.RefColumns;
  if (
    tmpSelectReportSchema.options[tmpSelectReportSchema.selectedIndex] &&
    typeof tmpSelectReportSchema.options[tmpSelectReportSchema.selectedIndex]
      .value !== "undefined"
  ) {
    tmpFieldValue =
      tmpSelectReportSchema.options[tmpSelectReportSchema.selectedIndex].value;

    tmpFieldValue = getDatasetName(tmpFieldValue);
    REPORT_SCHEMA_ARRAY = getListByFilter(tmpList, tmpFieldName, tmpFieldValue);
  }
  return REPORT_SCHEMA_ARRAY;
}
//-------------------------------------showColumnPage_End
// نمایش صفحه فیلتر ها
//****************---------------------------*****showFiltersPage_Start
function showFiltersPage() {
  let tmpType = "";
  let tmpBoolType = false;
  let tmpStringType = false;
  let tmpNumberType = false;
  let tmpDateType = false;
  let ArrItems = [];
  let tmpValue;
  let tmpLabel;
  let ArrayItems = [];
  FILTER_filterArr = [];
  if (CREATE_MODE) {
    jsonDataFilterArray = [];
    jsonDataFilterArray.push(rules_basic);
  }
  $.each(REPORT_CHANGE_SCHEMA_ARRAY, function (index, data) {
    tmpType = data.Type;
    tmpType = tmpType.toLowerCase();
    if (tmpType == "boolean") tmpBoolType = true;
    if (
      tmpType == "string" ||
      tmpType == "localstring" ||
      tmpType == "latinstring" ||
      tmpType == "text"
    )
      tmpStringType = true;
    if (
      tmpType == "integer" ||
      tmpType == "biginteger" ||
      tmpType == "money" ||
      tmpType == "double"
    )
      tmpNumberType = true;
    if (tmpType == "date" || tmpType == "time" || tmpType == "datetime")
      tmpDateType = true;

    if (tmpStringType) {
      if (data.Items != null && data.Items != undefined) {
        for (let i in data.Items) {
          tmpValue = data.Items[i].Name;
          if (!tmpValue) {
            tmpValue = data.Items[i].Id;
          }
          tmpLabel = data.Items[i].Label;
          ArrItems.push([tmpValue, tmpLabel]);
          ArrayItems.push({ tmpValue, tmpLabel });
        }
      }
    }
    if (data.GroupBy == undefined) {
      FILTER_filterArr.push({
        id: data.Name,
        idCol: data.ID,
        name: data.Name,
        label: data.Label,
        type: tmpType,
        sortType: "",
        groupBy: "",
        input: "",
        values: "",
        placeholder: "",
        validation: "",
        TmpViewName: VIEW_TITLE,
        items: ArrayItems,
      });
      tmpBoolType
        ? ((FILTER_filterArr[index].input = "select"),
          (FILTER_filterArr[index].values = {
            0: reportResources.get("no"),
            1: reportResources.get("yes"),
          }),
          (tmpBoolType = false))
        : (tmpBoolType = false);
      if (tmpStringType) {
        data.Items.length === 0
          ? (FILTER_filterArr[index].input = "text")
          : (FILTER_filterArr[index].input = "select");
        let a = Object.fromEntries(ArrItems);
        FILTER_filterArr[index].values = a;
        ArrItems = [];
        tmpStringType = false;
      }
    }
  });
  boolFirstCountThirdPage = false;
}
//****************---------------------------*****showFiltersPage_End
// حذف مقدار تکراری از شی توسط این توابع انجام می گیرد
//------------------------------------------repeatValue_Start
//ورودی آرایه اصلی است
function removeRepeatValue(tmpArray) {
  const outputArray = [
    ...new Map(tmpArray.map((item) => [item.tmpId, item])).values(),
  ];
  return outputArray;
}
function removeRepeatColumn(tmpArray) {
  const outputArray = [
    ...new Map(tmpArray.map((item) => [item.ID, item])).values(),
  ];
  return outputArray;
}
function removeRepeatFilter(tmpArray) {
  const outputArray = [
    ...new Map(tmpArray.map((item) => [item.idCol, item])).values(),
  ];
  return outputArray;
}
//------------------------------------------repeatValue_End
//------------------------------------------------Page4_Start********************************************
// ذخیره چک باکس نقش کاربری،در آرایه ی موقتی
//--------------------------saveRolesChk_Start
function saveRolesChk(checkID, numID) {
  //ورودی اول شناسه دراپ دان لیست نقش کاربری است
  //ورودی دوم شماره ی شناسه است
  let strLabel = $("#rolesLabelChk_" + numID).text();
  ROLES_CHECKED_ARRAY.push({
    elementId: checkID,
    idNumber: numID,
    labelText: strLabel,
  });
}
//--------------------------saveRolesChk_End
// حذف چک باکس نقش کاربری ،از آرایه ی موقتی
//--------------------------deleteRolesChk_Start
function deleteRolesChk(checkID, numID) {
  //ورودی اول شناسه دراپ دان لیست نقش کاربری است
  //ورودی دوم شماره ی شناسه است
  for (let i in ROLES_CHECKED_ARRAY) {
    if (ROLES_CHECKED_ARRAY[i].elementId == checkID)
      ROLES_CHECKED_ARRAY.splice(i, 1);
  }
}
//--------------------------deleteRolesChk_End
// ذخیره چک باکس گروه کاربری،در آرایه ی موقتی
//--------------------------saveGroupsChk_Start
function saveGroupsChk(checkID, numID) {
  //ورودی اول شناسه دراپ دان لیست گروه کاربری است
  //ورودی دوم شماره ی شناسه است
  let strLabel = $("#groupsLabelChk_" + numID).text();
  GROUPS_CHECKED_ARRAY.push({
    elementId: checkID,
    idNumber: numID,
    labelText: strLabel,
  });
}
//--------------------------saveGroupsChk_End
// حذف چک باکس گروه کاربری،از آرایه ی موقتی
//--------------------------deleteGroupsChk_Start
function deleteGroupsChk(checkID, numID) {
  //ورودی اول شناسه دراپ دان لیست گروه کاربری است
  //ورودی دوم شماره ی شناسه است
  for (let i in GROUPS_CHECKED_ARRAY) {
    if (GROUPS_CHECKED_ARRAY[i].elementId == checkID)
      GROUPS_CHECKED_ARRAY.splice(i, 1);
  }
}
//--------------------------deleteGroupsChk_End
//---ذخیره چک باکس های تیک زده شده در آرایه خروجی
//--------------------------saveAccessInOUTPUT_Start
function saveAccessInJsonData() {
  JsonData.AccessRoles = [];
  JsonData.AccessGroups = [];
  if (ROLES_CHECKED_ARRAY.length > 0) {
    for (const i in ROLES_CHECKED_ARRAY) {
      JsonData.AccessRoles.push({
        Id: ROLES_CHECKED_ARRAY[i].idNumber,
        Label: ROLES_CHECKED_ARRAY[i].labelText,
      });
    }
  }
  if (GROUPS_CHECKED_ARRAY.length > 0) {
    for (const i in GROUPS_CHECKED_ARRAY) {
      JsonData.AccessGroups.push({
        Id: GROUPS_CHECKED_ARRAY[i].idNumber,
        Label: GROUPS_CHECKED_ARRAY[i].labelText,
      });
    }
  }
  return true;
}
//--------------------------saveAccessInOUTPUT_End
//------------------------------------------------Page4_End********************************************
//-----------Page5_START_*_*_*_*_*_*
// ذخیره دیتای موجود در صفحه ی زمانبندی،در آرایه ی موقتی
//--------------------------saveRolesChk_Start
function saveScheduler() {
  SCHEDULER_ARRAY = [];
  let tmpSchedulesEnable = $("#schedulingChk").prop("checked");
  let tmpOccurs = $("#selectSchedulingPeriod option:selected").text();
  //let tmpOccurs = $("#selectSchedulingPeriod option:selected").value();
  let tmpSendTime = $("#postTimeTxt").val();
  let tmpExportType = $("#selectExportType").val();
  let tmpSendToAllUsers = $("#sendAllChk").prop("checked");
  let tmpSaveReport = $("#saveReportChk").prop("checked");
  let SendReport = $("#sendEmailsChk").prop("checked");
  SCHEDULER_ARRAY.push({
    SchedulesEnable: tmpSchedulesEnable,
    Occurs: tmpOccurs,
    Month: null,
    Week: null,
    DayMonth: null,
    Daily: null,
    Saturday: false,
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    SendTime: tmpSendTime,
    ExportType: tmpExportType,
    SendToAllUsers: tmpSendToAllUsers,
    SaveReport: tmpSaveReport,
    ReportPath: "",
    SendReport: SendReport,
    SendEmails: "",
  });
  switch (tmpOccurs) {
    case `${reportResources.get("monthly")}`:
      let tmpMounthmonthly = $("#eachMonthTxt-monthly").val();
      if (tmpMounthmonthly == null || tmpMounthmonthly == "")
        tmpMounthmonthly = 1;

      SCHEDULER_ARRAY[0].Month = +tmpMounthmonthly;
      let tmpDayhmonthly = $("#eachDayTxt-monthly").val();
      if (tmpDayhmonthly == null || tmpDayhmonthly == "") tmpDayhmonthly = 1;

      SCHEDULER_ARRAY[0].DayMonth = +tmpDayhmonthly;
      break;
    case `${reportResources.get("weekly")}`:
      let tmpWeekly = $("#eachTxt-weekly").val();
      if (tmpWeekly == null || tmpWeekly == "") tmpWeekly = 1;

      SCHEDULER_ARRAY[0].Week = +tmpWeekly;
      SCHEDULER_ARRAY[0].Sunday = $("#sundayChk").prop("checked");
      SCHEDULER_ARRAY[0].Monday = $("#mondayChk").prop("checked");
      SCHEDULER_ARRAY[0].Tuesday = $("#tuesdayChk").prop("checked");
      SCHEDULER_ARRAY[0].Wednesday = $("#wednesdayChk").prop("checked");
      SCHEDULER_ARRAY[0].Wednesday = $("#wednesdayChk").prop("checked");
      SCHEDULER_ARRAY[0].Thursday = $("#thursdayChk").prop("checked");
      SCHEDULER_ARRAY[0].Friday = $("#fridayChk").prop("checked");
      SCHEDULER_ARRAY[0].Saturday = $("#saturdayChk").prop("checked");
      break;
    case `${reportResources.get("daily")}`:
      let tmpDayDaily = $("#eachDayTxt-daily").val();
      if (tmpDayDaily == null || tmpDayDaily == "") tmpDayDaily = 1;

      SCHEDULER_ARRAY[0].Daily = +tmpDayDaily;
      break;
  }
  let tmpReportPath = $("#reportPath").val();
  if (tmpReportPath != "") SCHEDULER_ARRAY[0].ReportPath = tmpReportPath;

  let tmpSendEmails = $("#sendEmails").val();
  if (tmpSendEmails != "") SCHEDULER_ARRAY[0].SendEmails = tmpSendEmails;

  return saveSchedulerInJsonData();
}
//--------------------------saveRolesChk_End
//SCHEDULER_ARRAY
function saveSchedulerInJsonData() {
  if (SCHEDULER_ARRAY.length > 0) {
    JsonData.Schedule = [];
    JsonData.Schedule = SCHEDULER_ARRAY;
    return true;
  }
}
//-----------Page5_END_*_*_*_*_*_*
//پر کردن ستون ها در  آرایه جیسون دیتا
//----------------------------------------------------------------------------------------------------EndnewFillFilterSelect
function fillColumnParameters() {
  if (OBJECT_ARRAY.length > 0) {
    NEW_ARRAY_COLUMN = [];
    let Tmp_Filter;
    let TmpFilterLabel = "";
    let TmpoptionSort;
    let TmpCommandOprator;
    OBJECT_ARRAY.map((item, index) => {
      let strSelectSortype = item.sortTarget;
      let strcommanOprator = item.commandTarget;
      let strfilter = item.filterTarget;
      let TmpSelectFilter = document.getElementById(strfilter);
      if (TmpSelectFilter) {
        if (TmpSelectFilter.options[TmpSelectFilter.selectedIndex] != undefined)
          Tmp_Filter =
            TmpSelectFilter.options[TmpSelectFilter.selectedIndex].value;
        if (TmpSelectFilter.options[TmpSelectFilter.selectedIndex] != undefined)
          TmpFilterLabel =
            TmpSelectFilter.options[TmpSelectFilter.selectedIndex].text;
      }
      let Tmpselect = document.getElementById(strSelectSortype);

      if (Tmpselect) {
        if (
          Tmpselect.options[Tmpselect.selectedIndex] &&
          typeof Tmpselect.options[Tmpselect.selectedIndex].value !==
            "undefined"
        ) {
          TmpoptionSort = Tmpselect.options[Tmpselect.selectedIndex].value;
        } else {
          return false;
        }
      }

      let TmpselectOprator = document.getElementById(strcommanOprator);
      if (TmpselectOprator) {
        if (
          TmpselectOprator.options[TmpselectOprator.selectedIndex] &&
          typeof TmpselectOprator.options[TmpselectOprator.selectedIndex]
            .value !== "undefined"
        ) {
          TmpCommandOprator =
            TmpselectOprator.options[TmpselectOprator.selectedIndex].value;
        } else {
          return false;
        }
        NEW_ARRAY_COLUMN.push({
          ID: "",
          Name: Tmp_Filter,
          Label: TmpFilterLabel,
          Type: "",
          TextExpression: "",
          SortType: TmpoptionSort,
          SortOrder: "1",
          GroupBy: TmpCommandOprator,
          EnumTypeID: "",
          RefEntityID: "",
          EntityAttributeID: "",
        });
      }
    });
    NEW_ARRAY_COLUMN.map((item, i) => {
      for (let index = 0; index < JsonData.RefColumns.length; index++) {
        if (item.Name == JsonData.RefColumns[index].Name) {
          item.ID = JsonData.RefColumns[index].ID;
          item.Type = JsonData.RefColumns[index].Type;
          item.TextExpression = JsonData.RefColumns[index].Exprssion;
          item.EnumTypeID = JsonData.RefColumns[index].EnumTypeID;
          item.RefEntityID = JsonData.RefColumns[index].RefEntityID;
          item.EntityAttributeID = JsonData.RefColumns[index].EntityAttributeID;
        }
      }
    });
    return true;
  }
}
//تابع اعتبارسنجی و در نهایت ذخیره سازی و ایجاد خروجی جیسون
//-------------------------****************-------------------------Export_Start
function Export() {
  BOOL_EXPORT = true;
  let boolPageCheck = false;
  let itemDivId = "rpt-wiz-1";
  //------------------------چک کردن صفحه مشخصات کلی
  boolPageCheck = generalSpecifications();

  if (boolPageCheck) {
    //------------------------چک کردن صفحه ستون
    boolPageCheck = false;
    itemDivId = "rpt-wiz-2";
    fillObjectArrayParameters();
    //------پر کردن ستون ها
    boolPageCheck = fillColumnParameters();
    if (boolPageCheck) {
      DATASET_ID = $("#selectReportSchema").val();
      JsonData.DatasetID = DATASET_ID;
      JsonData.DatasetName = getDatasetName(DATASET_ID);
      JsonData.Columns = removeRepeatColumn(JsonData.Columns);
      //------------------------چک کردن صفحه فیلتر
      boolPageCheck = false;
      itemDivId = "rpt-wiz-3";
      $("#builder-basic").queryBuilder("getSQL", "question_mark");
      boolPageCheck = getFilterPage();
      if (!BOOL_EXPORT) itemDivId = "rpt-wiz-2";

      if (boolPageCheck) {
        //------------------------چک کردن صفحه دسترسی
        boolPageCheck = false;
        itemDivId = "rpt-wiz-4";
        boolPageCheck = saveAccessInJsonData();
        // if (boolPageCheck) {
        //------------------------چک کردن صفحه زمانبندی
        boolPageCheck = false;
        itemDivId = "rpt-wiz-5";
        boolPageCheck = saveScheduler();
        if (boolPageCheck) {
          JsonData.Columns = removeRepeatColumn(NEW_ARRAY_COLUMN);
          if (JsonData.Filter.length <= 1) {
            const filterbase = '[{"condition":"AND","rules":[],"valid":true}]';
            const jsonDataFilter = JSON.stringify(JsonData.Filter);
            if (filterbase === jsonDataFilter || jsonDataFilter === "[]")
              JsonData.Filter = JSON.parse(filterbase)[0];
          }
          OUTPUT[0].AccessRoles = JsonData.AccessRoles;
          OUTPUT[0].AccessGroups = JsonData.AccessGroups;
          OUTPUT[0].Columns = JsonData.Columns;
          OUTPUT[0].DatasetID = DATASET_ID;
          OUTPUT[0].DatasetName = JsonData.DatasetName;
          OUTPUT[0].Description = JsonData.Description;
          OUTPUT[0].Filter = JsonData.Filter;
          OUTPUT[0].Footer = JsonData.Footer;
          OUTPUT[0].GroupingLevel = JsonData.GroupingLevel;
          OUTPUT[0].Header = JsonData.Header;
          OUTPUT[0].Label = JsonData.Label;
          OUTPUT[0].ModuleID = JsonData.ModuleID;
          OUTPUT[0].ReportID = JsonData.ReportID;
          OUTPUT[0].Schedule = JsonData.Schedule;
          OUTPUT[0].SelectClause = JsonData.SelectClause;
          OUTPUT[0].WhereClause = JsonData.WhereClause;
          OUTPUT[0].CompleteQuery = setCompleteQuery(
            JsonData.SelectClause,
            JsonData.WhereClause
          );
          BOOL_EXPORT = true;
          return JSON.stringify(OUTPUT[0], null, 2);
        } else {
          ValidationError(itemDivId);
        }
      } else {
        ValidationError(itemDivId);
      }
    } else {
      ValidationError(itemDivId);
    }
  } else {
    ValidationError(itemDivId);
  }
}
//-------------------------****************-------------------------Export_End
// کانکت کردن رشته ی کوئری 
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function setCompleteQuery(selectClause, whereClause) {
  let newSelectString = "";
  if (whereClause !== "") {
    const regex = /ORDER BY.*$/;
    const match = selectClause.match(regex);
    whereClause = whereClause.replaceAll("'", "''");
    if (match) {
      newSelectString =
        selectClause.replace(regex, "") +
        " WHERE " +
        whereClause +
        " " +
        match[0];
    } else {
      newSelectString = selectClause + " WHERE " + whereClause;
    }
  } else {
    if (selectClause) newSelectString = selectClause;
  }
  return newSelectString;
}

//اعمال سی_اس_اس که در هنگام اعتبار سنجی و در هنگام بروز خطا به صفحه ی مورد نظر می رود
//----*----*----*----*----*----*----*----*----*----*----*----*----*----*----*----*----*----*ValidationError_Start
function ValidationError(itemDivId) {
  //ورودی شناسه صفحه ی مورد نظر است
  let idNumber = itemDivId.split("-")[2];
  //    #rpt-wiz-5 display: none;
  if (idNumber === 5) idNumber++;

  for (let index = 1; index < ITEM_INDEX; index++) {
    let tmpDiv = "rpt-wiz-" + index;
    let strLiId = "Lirpt-wiz-" + index;
    document.getElementById(tmpDiv).style.display = "none";
    document.getElementById(strLiId).classList.add("active");
    document.getElementById(strLiId).classList.remove("active");
    document.getElementById(strLiId).style.fontWeight = "normal";
  }
  document.getElementById("Lirpt-wiz-" + idNumber).classList.add("active");
  document.getElementById(itemDivId).style.display = "block";
  BOOL_EXPORT = false;
  // alert("لطفاً تمامی مقادیر را پر نمایید .");
  alert(reportResources.get("emptyValidation"));
}
//----*----*----*----*----*----*----*----*----*----*----*----*----*----*----*----*----*----*ValidationError_End
//ایجاد فایل خروجی در پوشه دانلود ها
//----------------------------------------------ExportFile_Start
ExportFile = () => {
  const filename = "ReportDesigner.json";
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(Export())
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  alert("ذخیره سازی انجام شد . ");
};
//----------------------------------------------ExportFile_End
