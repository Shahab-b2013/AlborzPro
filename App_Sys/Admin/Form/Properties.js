/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.2.0*/
/* Release Ferdos.BPMS*/

//Form_group Properties

function Form_Group_Prop(id) {
    //form-group Hide
    $(`#SettingField i`).addClass("fa-rotate-90");
    $(`.form-group`).css("border", "");
    $(`.form-group`).css("cursor", "default");
    $(`.form-group`).css("background-color", "");
    $(`.form-group .ImgIcon`).css("display", "none");
    //form-group Show
    $(`#${id}`).css("border", "1px solid #ccc");
    $(`#${id}`).css("border-radius", "2px");
    $(`#${id}`).css("cursor", "move");
    $(`#${id}`).css("background-color", "var(--A4)");
    $(`#${id} .ImgIcon`).css("display", "block");

    //UI
    labelProp($(`#${id}`).find(`label`).attr(`id`));

    let getInputID = id.replaceAll("group", "item");
    let getType = $(`#${getInputID}`).attr(`datatype`);
    switch (getType) {
        case `Text`:
        case `String`:
        case `LatinString`:
        case `LocalString`:
        case `Computed`:
            TextboxProp(getInputID);
            break;
        case `BigInteger`:
        case `Integer`:
            NumberBoxProp(getInputID);
            break;
        case `Money`:
            MoneyProp(getInputID);
            break;

        case `Time`:
            TimeProp(getInputID);
            break;

        case `Date`:
            DateProp(getInputID);
            break;

        case `DateTime`:
            DateProp(getInputID);
            break;

        case `Boolean`:
            CheckBoxProp(getInputID);
            break;

        case `Password`:
            PasswordProp(getInputID);
            break;

        case `File`:
        case `Image`:
            FileProp(getType, getInputID);
            break;

        case `Enum`:
        case `System`:
            SelectProp(getInputID);
            break;
        case `Table`:
            TableProp(getInputID);
            break;
            case `SelectiveTable`:
                SelectiveTableProp(getInputID);
                break;
        // case `Image`:
        //   ImageProp(getInputID);
        //break;
        case `Sms`:
            SmsProp(getInputID);
            break;
        case `Agreement`:
            AgreementProp(getInputID);
            break;
        case `FacilityBox`:
            FacilitiesProp(getInputID);
            break;
        case `TimingBox`:
            AmentityTimesProp(getInputID);
            break;

        default:
            break;
    }
}
function SettingChild_empty() {
    $(`#SettingFieldChild`).css("display", "block");
    $(`#SettingFieldChild`).empty();
}

function AgreementProp(id) {
    let backColor_RGB = $(`#${id}`)
        .css(`backgroundColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    let borderColor_RGB = $(`#${id}`)
        .css(`borderColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    //UI
    let Textbox =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
            "item"
        )}</span>` +
        `<table id="PropTable" class="table table-bordered"><tbody id="Tbody2">`;
    Textbox += `</tbody ></table></div>`;
    //$(`#SettingFieldChild`).append(Textbox);
    // FontProp(id, formResources.get("fonttext"));
    $(`#SettingFieldChild`).append(Textbox);
    VariableProp(id);
    //Command
    $(`#backgroundColorTXT`).on(`input`, () => {
        $(`#${id}`).css(`backgroundColor`, $(`#backgroundColorTXT`).val());
    });
    $(`#borderColorTXT`).on(`input`, () => {
        $(`#${id}`).css(`borderColor`, $(`#borderColorTXT`).val());
    });
}

function SmsProp(id) {
    let backColor_RGB = $(`#${id}`)
        .css(`backgroundColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    let borderColor_RGB = $(`#${id}`)
        .css(`borderColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    //UI
    let Textbox =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
            "item"
        )}</span>` +
        `<table id="PropTable" class="table table-bordered"><tbody id="Tbody2">`;
    Textbox += `</tbody ></table></div>`;
    //$(`#SettingFieldChild`).append(Textbox);
    // FontProp(id, formResources.get("fonttext"));
    $(`#SettingFieldChild`).append(Textbox);
    VariableProp(id);
    //Command
    $(`#backgroundColorTXT`).on(`input`, () => {
        $(`#${id}`).css(`backgroundColor`, $(`#backgroundColorTXT`).val());
    });
    $(`#borderColorTXT`).on(`input`, () => {
        $(`#${id}`).css(`borderColor`, $(`#borderColorTXT`).val());
    });
}


function FacilitiesProp(id) {
    let backColor_RGB = $(`#${id}`)
        .css(`backgroundColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    //UI
    let tbl =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus">${formResources.get(
            "table"
        )}</span>` +
        `<table id="PropTable" class="table  table-bordered"> <tbody id="Tbody2">`;
    // tbl +=
    //   `<tr><td class="td1">${formResources.get(
    //     "select"
    //   )}</td><td class="td2"><select id="tblSelect" class="selectProp">` +
    //   `<option value="1">${formResources.get("titlecolumn")}</option>` +
    //   `<option value="2">${formResources.get("content")}</option>` +
    //   `</select></td></tr>`;
    // tbl +=
    //   `<tr><td class="td1">${formResources.get(
    //     "backcolor"
    //   )}</td><td class="td2"><input id="backgroundColorTXT" type="color" ` +
    //   `value="${rgbToHex(
    //     +backColor_RGB[0],
    //     +backColor_RGB[1],
    //     +backColor_RGB[2]
    //   )}" ></td></tr>`;
    tbl += `</tbody ></table></div>`;
    $(`#SettingFieldChild`).append(tbl);
    VariableProp(id);
}

function AmentityTimesProp(id) {
    let backColor_RGB = $(`#${id}`)
        .css(`backgroundColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    //UI
    let tbl =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus">${formResources.get(
            "table"
        )}</span>` +
        `<table id="PropTable" class="table  table-bordered"> <tbody id="Tbody2">`;
    // tbl +=
    //   `<tr><td class="td1">${formResources.get(
    //     "select"
    //   )}</td><td class="td2"><select id="tblSelect" class="selectProp">` +
    //   `<option value="1">${formResources.get("titlecolumn")}</option>` +
    //   `<option value="2">${formResources.get("content")}</option>` +
    //   `</select></td></tr>`;
    // tbl +=
    //   `<tr><td class="td1">${formResources.get(
    //     "backcolor"
    //   )}</td><td class="td2"><input id="backgroundColorTXT" type="color" ` +
    //   `value="${rgbToHex(
    //     +backColor_RGB[0],
    //     +backColor_RGB[1],
    //     +backColor_RGB[2]
    //   )}" ></td></tr>`;
    tbl += `</tbody ></table></div>`;
    $(`#SettingFieldChild`).append(tbl);
    VariableProp(id);
    // FontProp(id, formResources.get("tablefont"));

    //Command
    $(`#backgroundColorTXT`).on(`input`, () => {
        +$(`#tblSelect`).val() == 1
            ? $(`#${id}`)
                .children()
                .eq(0)
                .css(`backgroundColor`, $(`#backgroundColorTXT`).val())
            : $(`#${id}`)
                .children()
                .eq(1)
                .css(`backgroundColor`, $(`#backgroundColorTXT`).val());
    });
}

//TextBox Properties
function TextboxProp(id) {
    let backColor_RGB = $(`#${id}`)
        .css(`backgroundColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    let borderColor_RGB = $(`#${id}`)
        .css(`borderColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    //UI
    let Textbox =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
            "item"
        )}</span>` +
        `<table id="PropTable" class="table table-bordered"><tbody id="Tbody2">`;
    // Textbox +=
    //   `<tr><td class="td1">${formResources.get(
    //     "backcolor"
    //   )}</td><td class="td2"><input id="backgroundColorTXT" type="color" ` +
    //   `value="${rgbToHex(
    //     +backColor_RGB[0],
    //     +backColor_RGB[1],
    //     +backColor_RGB[2]
    //   )}" ></td></tr>`;
    // Textbox +=
    //   `<tr><td class="td1">${formResources.get(
    //     "bordercolor"
    //   )}</td><td class="td2"><input id="borderColorTXT" type="color" ` +
    //   `value="${rgbToHex(
    //     +borderColor_RGB[0],
    //     +borderColor_RGB[1],
    //     +borderColor_RGB[2]
    //   )}"></td></tr>`;
    Textbox += `</tbody ></table></div>`;
    $(`#SettingFieldChild`).append(Textbox);
    // FontProp(id, formResources.get("fonttext"));
    VariableProp(id);

    //Command
    $(`#backgroundColorTXT`).on(`input`, () => {
        $(`#${id}`).css(`backgroundColor`, $(`#backgroundColorTXT`).val());
    });
    $(`#borderColorTXT`).on(`input`, () => {
        $(`#${id}`).css(`borderColor`, $(`#borderColorTXT`).val());
    });
}

//IntBox Properties
function NumberBoxProp(id) {
    let backColor_RGB = $(`#${id}`)
        .css(`backgroundColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);
    let borderColor_RGB = $(`#${id}`)
        .css(`borderColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    //UI
    let textBox =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
            "number"
        )}</span>` +
        `<table id="PropTable" class="table  table-bordered"> <tbody id="Tbody2">`;
    // textBox +=
    //   `<tr><td class="td1">${formResources.get(
    //     "backcolor"
    //   )}</td><td class="td2"><input id="backgroundColorTXT" type="color" ` +
    //   `value="${rgbToHex(
    //     +backColor_RGB[0],
    //     +backColor_RGB[1],
    //     +backColor_RGB[2]
    //   )}" ></td></tr>`;
    // textBox +=
    //   `<tr><td class="td1">${formResources.get(
    //     "bordercolor"
    //   )}</td><td class="td2"><input id="borderColorTXT" type="color" ` +
    //   `value="${rgbToHex(
    //     +borderColor_RGB[0],
    //     +borderColor_RGB[1],
    //     +borderColor_RGB[2]
    //   )}"></td></tr>`;

    textBox += `</tbody ></table></div>`;
    $(`#SettingFieldChild`).append(textBox);
    // FontProp(id, formResources.get("fonttext"));
    VariableProp(id);

    //Command
    $(`#backgroundColorTXT`).on(`input`, () => {
        $(`#${id}`).css(`backgroundColor`, $(`#backgroundColorTXT`).val());
    });
    $(`#borderColorTXT`).on(`input`, () => {
        $(`#${id}`).css(`borderColor`, $(`#borderColorTXT`).val());
    });
}

//Password Properties
function PasswordProp(id) {
    //UI
    TextboxProp(id);
    //Command
}

//Label Properties
function labelProp(id) {
    // disable data title
    let boxID = id.replaceAll("-lbl", "");
    let getVariable = [];
    let _disabled = false;
    if (localStorage.getItem("Variables" + $ProcessID))
        getVariable = JSON.parse(localStorage.getItem("Variables" + $ProcessID));
    let _id = boxID.replaceAll("group", "item");
    let filt = getVariable.filter(
        (x) =>
            x.RowKey == $(`#` + boxID).attr("foreignkey") &&
            x.DataType == $(`#` + _id).attr("datatype")
    );
    if (filt.length) _disabled = true;

    //UI
    SettingChild_empty();

    let _fixlabel;
    if ($(`#` + boxID).attr("fixlabel") != "undefined") {
        $(`#` + boxID).attr("fixlabel") != undefined
            ? (_fixlabel = $(`#` + boxID).attr("fixlabel"))
            : (_fixlabel = $(`#` + boxID).attr("fixlabel"));
    }

    let geItem = $(`#${id}`).hasClass(`group-info`)
        ? $(`#${id}`).find(`h4.group-title`)
        : $(`#${id}`);
    let idd = $(`#${id}`).parent().attr("id");
    if ($(`#${idd} input[type="password"]`).length == 0) {
        let label =
            `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
                "title"
            )}</span>` +
            `<table id="PropTable" class="table table-bordered">` +
            `<tbody id="Tbody">`;
        if (id.split("-")[1] != "info") {
            label += `<tr><td class="td1">${formResources.get(
                "fixLabel"
            )}</td><td class="td2"><input placeholder = "${formResources.get(
                "titleinsert"
            )}" id="FixLabel" class="textlbl" value="${_fixlabel}"/> </td></tr>`;
        }
        label += `<tr><td class="td1">${formResources.get(
            "titletext"
        )}</td><td class="td2"><input placeholder = "${formResources.get(
            "titleinsert"
        )}" id="textlbl" class="textlbl" value="${geItem.text()}" /> </td></tr>`;

        label += `</tbody></table></div>`;
        $(`#SettingFieldChild`).append(label);
        $(`#textlbl`).focus();
    }

    // FontProp(id, formResources.get("titlefont"));

    //Command
    $(`#textlbl`).on(`input`, () => {
        $(`#textlbl`).css("border", "0px");
        if (!$(`#textlbl`).val()) {
            geItem.text(``);
        } else {
            geItem.text($(`#textlbl`).val());
            if (geItem.hasClass(`divHeader`)) {
                geItem.css(`color`, `#fff`);
            } else {
                geItem.css(`color`, `#000`);
            }
        }
    });

    $(`#FixLabel`).on(`input`, (e) => {
        $(`#FixLabel`).css("border", "0px");
        if (!$(`#FixLabel`).val()) {
            $(`#` + boxID).attr("fixlabel", "");
        } else {
            $(`#` + boxID).attr("fixlabel", $(`#FixLabel`).val());
        }
    });
}

//DropDown Properties
function SelectProp(id) {
    TextboxProp(id);
}

//CheckBox Properties
function CheckBoxProp(id) {
    //UI
    let checkBox =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
            "check"
        )}</span>` +
        `<table id="PropTable" class="table  table-bordered">` +
        `<tbody id="Tbody2">`;
    // checkBox += `<tr><td class="td1">${formResources.get(
    //   "default"
    // )}</td><td class="td2"><select  id="selectCheck" class="selectProp"><option value=false>${formResources.get(
    //   "deactive"
    // )}</option><option value=true>${formResources.get(
    //   "active"
    // )}</option></select></td></tr>`;
    checkBox += `</tbody ></table ></div>`;
    $(`#SettingFieldChild`).append(checkBox);
    VariableProp(id);

    //Command
    $(`#selectCheck`).click(() =>
        $(`#selectCheck`).val() == `true`
            ? $(`#${id}`).prop(`checked`, true)
            : $(`#${id}`).prop(`checked`, false)
    );
}

//TimeBox Properties
function TimeProp(id) {
    //UI
    let timeBox =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
            "time"
        )}</span>` +
        `<table id="PropTable" class="table table-bordered">` +
        `<tbody id="Tbody2">`;
    timeBox += `</tbody ></table ></div>`;
    $(`#SettingFieldChild`).append(timeBox);
    VariableProp(id);

    //Command
}

//DateBox Properties
function DateProp(id) {
    //UI
    let date =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
            "date"
        )}</span>` +
        `<table id="PropTable" class="table  table-bordered">` +
        `<tbody id="Tbody2">`;
    date += `</tbody ></table ></div>`;
    $(`#SettingFieldChild`).append(date);
    VariableProp(id);

    //Command
}

//MoneyProp Properties
function MoneyProp(id) {
    let backColor_RGB = $(`#${id}`)
        .css(`backgroundColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);
    let borderColor_RGB = $(`#${id}`)
        .css(`borderColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    //UI
    let money =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
            "money"
        )}</span>` +
        `<table id="PropTable" class="table  table-bordered"> <tbody id="Tbody2">`;
    // money +=
    //   `<tr><td class="td1">${formResources.get(
    //     "backcolor"
    //   )}</td><td class="td2"><input id="backgroundColorTXT" type="color" ` +
    //   `value="${rgbToHex(
    //     +backColor_RGB[0],
    //     +backColor_RGB[1],
    //     +backColor_RGB[2]
    //   )}" ></td></tr>`;
    // money +=
    //   `<tr><td class="td1">${formResources.get(
    //     "bordercolor"
    //   )}</td><td class="td2"><input id="borderColorTXT" type="color" ` +
    //   `value="${rgbToHex(
    //     +borderColor_RGB[0],
    //     +borderColor_RGB[1],
    //     +borderColor_RGB[2]
    //   )}"></td></tr>`;
    money += `</tbody ></table></div>`;
    $(`#SettingFieldChild`).append(money);
    // FontProp(id, formResources.get("fontmoney"));
    VariableProp(id);

    //Command

    $(`#backgroundColorTXT`).on(`input`, () => {
        $(`#${id}`).css(`backgroundColor`, $(`#backgroundColorTXT`).val());
    });
    $(`#borderColorTXT`).on(`input`, () => {
        $(`#${id}`).css(`borderColor`, $(`#borderColorTXT`).val());
    });
}

//File Properties
function FileProp(getType, id) {
    //UI
    let File =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
            getType == "File" ? "file" : "img"
        )}</span>` +
        `<table id="PropTable" class="table  table-bordered">` +
        `<tbody id="Tbody2">`;
    File += `</tbody ></table ></div>`;
    $(`#SettingFieldChild`).append(File);
    VariableProp(id);

    //Command
}

//Row Properties
function GroupProp(elem) {
    if ($(`#FixLabel`).val() == "") {
        if ($(`#FixLabel`).val() == "") {
            $(`#FixLabel`).css("border", "1px solid red");
            $(`#FixLabel`).css("border-radius", "2px");
        }
    } else {
        $(`#SettingField i`).addClass("fa-rotate-90");
        //form-group Hide
        $(`.form-group`).css("border", "");
        $(`.form-group`).css("border-radius", "0px");
        $(`.form-group`).css("background-color", "");
        $(`.form-group .ImgIcon`).css("display", "none");

        //UI

        let parentId = elem.parentNode.id;
        let id = parentId.replace(`form-group-`, `group-info-`);

        labelProp(id);

        let setColumn = `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
            "box"
        )}</span>`;
        setColumn += `<table id="PropTable" class="table  table-bordered"><tbody id="Tbody">`;
        setColumn += `<tr><td class="td1">${formResources.get(
            "columnnum"
        )}</td><td class="td2"><select  id="colId" class="selectProp"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></td></tr>`;
        setColumn += `</tbody></table></div>`;
        $(`#SettingFieldChild`).append(setColumn);

        // let setBoxs = `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus">${formResources.get(
        //   "boxitems"
        // )}</span>`;
        // setBoxs += `<table id="PropTable" class="table  table-bordered"><tbody id="Tbody">`;
        // setBoxs +=
        //   `<tr><td style="border-left: 0px;"><span class="propTitlePlus" style="font-size:10px;border-left: 0px;">${formResources.get(
        //     "titles"
        //   )}</span></td></tr><tr><td class="td1"> ${formResources.get(
        //     "fontfamily"
        //   )}</td><td class="td2"><select id="fontFamilyRow" class="selectProp">` +
        //   `<option value="IRANSansWeb">IRANSansWeb</option>` +
        //   `<option value="Tahoma">Tahoma</option>` +
        //   `<option value="Source Sans Pro">Source Sans Pro</option>` +
        //   `<option value="B Zar">B Zar</option></select></td></tr>`;
        // setBoxs += `<tr><td class="td1"> ${formResources.get(
        //   "fontsize"
        // )} </td><td class="td2"><input id="fontSizeRow" class="fontSize" type="number" value="14"></td></tr>`;
        // setBoxs += `<tr><td class="td1"> ${formResources.get(
        //   "fontcolor"
        // )} </td><td class="td2"><input id="fontColorRow" class="fontColor" type="color"></td></tr>`;
        // setBoxs +=
        //   `<tr><td style="border-left: 0px;"><span class="propTitlePlus" style="font-size:10px;"${formResources.get(
        //     "items"
        //   )}</span></span></tr><tr><td class="td1"> ${formResources.get(
        //     "fontfamily"
        //   )}</td><td class="td2"><select id="fontFamilyRowInput" class="selectProp">` +
        //   `<option value="IRANSansWeb">IRANSansWeb</option>` +
        //   `<option value="Tahoma">Tahoma</option>` +
        //   `<option value="Source Sans Pro">Source Sans Pro</option>` +
        //   `<option value="B Zar">B Zar</option></select></td></tr>`;
        // setBoxs += `<tr><td class="td1"> ${formResources.get(
        //   "fontsize"
        // )} </td><td class="td2"><input id="fontSizeRowInput" class="fontSize" type="number" value="14"></td></tr>`;
        // setBoxs += `<tr><td class="td1"> ${formResources.get(
        //   "fontcolor"
        // )} </td><td class="td2"><input id="fontColorRowInput" class="fontColor" type="color"></td></tr>`;
        // setBoxs += `<tr><td class="td1">${formResources.get(
        //   "backcolor"
        // )}</td><td class="td2"><input id="backgroundColorInput" type="color" value="#fffbf9" ></td></tr>`;
        // setBoxs += `<tr><td class="td1">${formResources.get(
        //   "bordercolor"
        // )}</td><td class="td2"><input id="borderColorInput" type="color" value="#cccccc"></td></tr>`;
        // setBoxs += `</tbody></table></div>`;
        // $(`#SettingFieldChild`).append(setBoxs);

        //Command
        //onclick
        //Label
        let inputID;
        let selectInput;
        $(`#fontFamilyRow`).on("input", () => {
            inputID = $(`#${id}`).parent().attr("id");
            selectInput = $(`#${inputID} .form-item-lbl`);
            for (let i in selectInput)
                selectInput.css("font-family", $("#fontFamilyRow").val());
        });
        $(`#fontSizeRow`).on("input", () => {
            inputID = $(`#${id}`).parent().attr("id");
            selectInput = $(`#${inputID} .form-item-lbl`);
            for (let i in selectInput)
                selectInput.css("font-size", +$("#fontSizeRow").val());
        });
        $(`#fontColorRow`).on("input", () => {
            inputID = $(`#${id}`).parent().attr("id");
            selectInput = $(`#${inputID} .form-item-lbl`);
            for (let i in selectInput)
                selectInput.css("color", $("#fontColorRow").val());
        });
        //Input
        $(`#fontFamilyRowInput`).on("input", () => {
            inputID = $(`#${id}`).parent().attr("id");
            selectInput = $(`#${inputID} .form-input`);
            for (let i in selectInput)
                selectInput.css("font-family", $("#fontFamilyRowInput").val());
        });
        $(`#fontSizeRowInput`).on("input", () => {
            inputID = $(`#${id}`).parent().attr("id");
            selectInput = $(`#${inputID} .form-input`);
            for (let i in selectInput)
                selectInput.css("font-size", +$("#fontSizeRowInput").val());
        });
        $(`#fontColorRowInput`).on("input", () => {
            inputID = $(`#${id}`).parent().attr("id");
            selectInput = $(`#${inputID} .form-input`);
            for (let i in selectInput)
                selectInput.css("color", $("#fontColorRowInput").val());
        });
        $(`#backgroundColorInput`).on("input", () => {
            inputID = $(`#${id}`).parent().attr("id");
            selectInput = $(`#${inputID} .form-input, .rm-control`);
            for (let i in selectInput)
                selectInput.css("backgroundColor", $("#backgroundColorInput").val());
        });

        $(`#borderColorInput`).on("input", () => {
            inputID = $(`#${id}`).parent().attr("id");
            selectInput = $(`#${inputID} .form-input, .rm-control`);
            for (let i in selectInput)
                selectInput.css("borderColor", $("#borderColorInput").val());
        });

        //split Row
        let groupDivIdArray = [];
        function groupDivId(elem) {
            let parnetnodeID = elem.parentNode.id;
            parnetnodeID = document.getElementById(parnetnodeID);
            for (let q in parnetnodeID.childNodes) {
                if (parnetnodeID.childNodes[q].id) {
                    let id = parnetnodeID.childNodes[q].id;
                    if ($(`#${id}`).hasClass(`form-group-body`)) groupDivIdArray.push(id);
                }
            }
            return [...new Set(groupDivIdArray)];
        }

        $(`#colId`).change(() => {
            const groupDivs = groupDivId(elem);
            const mainDiv = $(`#${groupDivs[0]}`);

            switch (+$(`#colId`).val()) {
                case 1:
                    // Set the main div's class to span 8 columns
                    mainDiv.attr("class", "form-group-body col-md-8");

                    // Move all children from other divs into the main div and remove the empty divs
                    for (let k = 1; k < groupDivs.length; k++) {
                        const elements = $(`#${groupDivs[k]}`).children();
                        for (let j = 0; j < elements.length; j++) {
                            const id = elements[j].id;
                            if ($(`#${id}`).hasClass("form-group")) {
                                mainDiv.append($(`#${id}`));
                            }
                        }
                        $(`#${groupDivs[k]}`).remove();
                    }
                    break;

                case 2:
                    // Set the main div's class to span 4 columns
                    mainDiv.attr("class", "form-group-body col-md-4");

                    const div2ID = groupDivs[0].replace("-0", "-1");
                    const div3ID = groupDivs[0].replace("-0", "-2");

                    // Move all children from other divs into the main div
                    for (let k = 1; k < groupDivs.length; k++) {
                        const elements = $(`#${groupDivs[k]}`).children();
                        for (let j = 0; j < elements.length; j++) {
                            const id = elements[j].id;
                            if ($(`#${id}`).hasClass("form-group")) {
                                mainDiv.append($(`#${id}`));
                            }
                        }
                    }

                    // Remove any existing div2 and div3
                    $(`#${div3ID}`).remove();
                    $(`#${div2ID}`).remove();

                    // Create a new div2 and insert it after the minidiv
                    const div2 = `
            <div class="form-group-body col-md-4" style="border-radius:4px" ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)" id="${div2ID}"></div>
          `;
                    const minidiv = $(`#${groupDivs[0]}`).next()[0].id;
                    $(`#${minidiv}`).after($(div2));

                    // Set the next div to be a no-drop zone
                    mainDiv.next().attr("class", "col-md-1 noDrop");

                    // Move half of the children from the main div to div2
                    const div1Items = mainDiv.children();
                    for (
                        let k = Math.round(div1Items.length / 2);
                        k < div1Items.length;
                        k++
                    ) {
                        const elementId = div1Items[k].id;
                        $(`#${div2ID}`).append($(`#${elementId}`));
                    }
                    break;

                case 3:
                    // Set the main div's class to span 3 columns
                    mainDiv.attr("class", "form-group-body col-md-3");

                    // Remove the class from the next div to hide it
                    mainDiv.next().attr("class", "");

                    const div3IDNew = groupDivs[0].replace("-0", "-2");
                    const div2IDNew = groupDivs[0].replace("-0", "-1");

                    // Check if the next next div has form-group-body class to prevent select buttons div and set its class to span 3 columns
                    if (mainDiv.next().next().hasClass("form-group-body")) {
                        mainDiv.next().next().attr("class", "form-group-body col-md-3");
                    }

                    // Create new div2 and div3
                    const div2Clone = `
            <div class="form-group-body col-md-3" style="border-radius:4px" ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)" id="${div2IDNew}"></div>
          `;
                    const div3 = `
            <div class="form-group-body col-md-3" style="border-radius:4px" ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)" id="${div3IDNew}"></div>
          `;

                    // Insert the new divs after the main div or the next next div based on the current structure
                    if (
                        $(
                            `#${groupDivs[0].replace("-0", "").replace("-body", "")}`
                        ).children().length == 4
                    ) {
                        // Length 4 means swich from case1 to case3
                        mainDiv.next().after(div2Clone);
                        mainDiv.next().after(div3);
                    } else {
                        // Swich from case2 to case3
                        mainDiv.next().next().after(div3);
                    }

                    // Gather all items from the main div and the next div
                    const div1ItemsArr = mainDiv.children().get();
                    const div2ItemsArr = $(`#${groupDivs[1]}`).children().get();
                    const allItemsArr = [...div2ItemsArr, ...div1ItemsArr];
                    const sum = allItemsArr.length;

                    // Get the base ID for the new divs
                    const divID = div3IDNew.replace("-2", "-");

                    if (sum > 2) {
                        // Distribute items evenly among the three divs
                        let divIndex = 0;
                        for (let i = 0; i < sum; i++) {
                            const elementId = allItemsArr[i].id;
                            $(`#${divID}${divIndex}`).append($(`#${elementId}`));
                            divIndex = (divIndex + 1) % 3; // Cycle through divs 0, 1, and 2
                        }
                    }
                    break;
            }
        });

        //onload
        $(`#colId`).val(groupDivId(elem).length);
    }
}

//Table
function TableProp(id) {
    let backColor_RGB = $(`#${id}`)
        .css(`backgroundColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    //UI
    let tbl =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus">${formResources.get(
            "table"
        )}</span>` +
        `<table id="PropTable" class="table  table-bordered"> <tbody id="Tbody2">`;
    // tbl +=
    //   `<tr><td class="td1">${formResources.get(
    //     "select"
    //   )}</td><td class="td2"><select id="tblSelect" class="selectProp">` +
    //   `<option value="1">${formResources.get("titlecolumn")}</option>` +
    //   `<option value="2">${formResources.get("content")}</option>` +
    //   `</select></td></tr>`;
    // tbl +=
    //   `<tr><td class="td1">${formResources.get(
    //     "backcolor"
    //   )}</td><td class="td2"><input id="backgroundColorTXT" type="color" ` +
    //   `value="${rgbToHex(
    //     +backColor_RGB[0],
    //     +backColor_RGB[1],
    //     +backColor_RGB[2]
    //   )}" ></td></tr>`;
    tbl += `</tbody ></table></div>`;
    $(`#SettingFieldChild`).append(tbl);
    VariableProp(id);
    // FontProp(id, formResources.get("tablefont"));

    //Command
    $(`#backgroundColorTXT`).on(`input`, () => {
        +$(`#tblSelect`).val() == 1
            ? $(`#${id}`)
                .children()
                .eq(0)
                .css(`backgroundColor`, $(`#backgroundColorTXT`).val())
            : $(`#${id}`)
                .children()
                .eq(1)
                .css(`backgroundColor`, $(`#backgroundColorTXT`).val());
    });
}
function SelectiveTableProp(id) {
    let backColor_RGB = $(`#${id}`)
        .css(`backgroundColor`)
        .replaceAll(`rgb(`, ``)
        .replaceAll(`)`, ``)
        .split(`,`);

    //UI
    let tbl =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus">${formResources.get(
            "table"
        )}</span>` +
        `<table id="PropTable" class="table  table-bordered"> <tbody id="Tbody2">`;
    // tbl +=
    //   `<tr><td class="td1">${formResources.get(
    //     "select"
    //   )}</td><td class="td2"><select id="tblSelect" class="selectProp">` +
    //   `<option value="1">${formResources.get("titlecolumn")}</option>` +
    //   `<option value="2">${formResources.get("content")}</option>` +
    //   `</select></td></tr>`;
    // tbl +=
    //   `<tr><td class="td1">${formResources.get(
    //     "backcolor"
    //   )}</td><td class="td2"><input id="backgroundColorTXT" type="color" ` +
    //   `value="${rgbToHex(
    //     +backColor_RGB[0],
    //     +backColor_RGB[1],
    //     +backColor_RGB[2]
    //   )}" ></td></tr>`;
    tbl += `</tbody ></table></div>`;
    $(`#SettingFieldChild`).append(tbl);
    VariableProp(id);
    // FontProp(id, formResources.get("tablefont"));

    //Command
    $(`#backgroundColorTXT`).on(`input`, () => {
        +$(`#tblSelect`).val() == 1
            ? $(`#${id}`)
                .children()
                .eq(0)
                .css(`backgroundColor`, $(`#backgroundColorTXT`).val())
            : $(`#${id}`)
                .children()
                .eq(1)
                .css(`backgroundColor`, $(`#backgroundColorTXT`).val());
    });
}

//IMG Properties
function ImageProp(id) {
    //UI
    let height = $(`#${id}`).css(`height`).replaceAll(`px`, ``);
    let radius = $(`#${id}`).css(`border-radius`).replaceAll(`%`, ``);

    let Imagebox =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${formResources.get(
            "img"
        )}</span>` +
        `<table id="PropTable" class="table table-bordered"> <tbody id="TableProp">`;

    Imagebox += `<tr><td class="td1">${formResources.get(
        "radius"
    )}</td><td class="td2"><input type='range' min="0" max="50" step="1"  class="textProp" value="${radius}" oninput="radiusChagne(event,'${id}')"/></td></tr>`;

    Imagebox += `<tr><td class="td1">${formResources.get(
        "size"
    )}</td><td class="td2"><input type='range' min="50" max="300" step="1"  class="textProp" value="${height}" oninput="height_width_Chagne(event,'${id}')"/></td></tr>`;
    Imagebox += `</tbody ></table></div>`;
    $(`#SettingFieldChild`).append(Imagebox);
}

function height_width_Chagne(e, id) {
    if (typeof id === "object") id = $(id).attr("id");
    $(`#${id}`).css("height", +$(e.target).val() + "px");
    $(`#${id}`).css("width", +$(e.target).val() + "px");
    let radius = $(`#${id}`).css(`border-radius`).replaceAll(`px`, ``);
    $(`#${id}`).css("border-radius", radius + "%");
}

function radiusChagne(e, id) {
    if (typeof id === "object") id = $(id).attr("id");
    $(`#${id}`).css("border-radius", +$(e.target).val() + "%");
}

function positionChange(e, id) {
    $(`#${id}`).parent().css("display", "block");
    const a = $(e.target).val();
    if (a == "right") {
        $(`#${id}`).parent().css("text-align", "right");
        $(`#${id}`).parent().parent().css("text-align", "right");
    } else if (a == "center") {
        $(`#${id}`).parent().css("text-align", "center");
        $(`#${id}`).parent().parent().css("text-align", "center");
    } else if (a == "left") {
        $(`#${id}`).parent().css("text-align", "left");
        $(`#${id}`).parent().parent().css("text-align", "left");
    }
}

/*
 **FONT
 */
function FontProp(id, text) {
    //UI
    let Default =
        `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus">${text}</span>` +
        `<table class="table  table-bordered" style=""><tbody id="Tbody"><tr><td class="td1">${formResources.get(
            "fontfamily"
        )}</td><td class="td2"><select id="fontFamily-${id}" class="selectProp">` +
        `<option value="IRANSansWeb">IRANSansWeb</option>` +
        `<option value="B Titr">B Titr</option>` +
        `<option value="Tahoma">Tahoma</option>` +
        `<option value="Source Sans Pro">Source Sans Pro</option>` +
        `</select></td></tr>`;
    Default += `<tr><td class="td1">${formResources.get(
        "fontsize"
    )}</td><td class="td2"><input id="fontSize-${id}" type="number" class="fontSize"  value="14"></td></tr>`;

    Default += `<tr><td class="td1">${formResources.get(
        "fontcolor"
    )}</td><td class="td2"><input id="fontColor-${id}" type="color" class="fontColor"  value="#000000"></td></tr></tbody></table></div>`;
    $(`#SettingFieldChild`).append(Default);

    //command
    // Row
    if ($(`#${id}`).hasClass(`group-info`)) {
        //get font setting
        const SetFontFamily = $(`#${id}`)
            .find(`h4.group-title`)
            .css(`font-family`)
            .split(`,`)[0]
            .replaceAll(`"`, ``);
        const SetFontSize = $(`#${id}`)
            .find(`h4.group-title`)
            .css(`font-size`)
            .replaceAll(`px`, ``);
        const SetFontColor = $(`#${id}`)
            .find(`h4.group-title`)
            .css(`color`)
            .replaceAll(`rgb(`, ``)
            .replaceAll(`)`, ``)
            .split(`,`);

        //onclick
        $(`#fontFamily-${id}`).on(`input`, () =>
            $(`#${id}`)
                .find(`h4.group-title`)
                .css(`font-family`, $(`#fontFamily-${id}`).val())
        );

        $(`#fontSize-${id}`).on(`input`, () =>
            $(`#${id}`)
                .find(`h4.group-title`)
                .css(`font-size`, +$(`#fontSize-${id}`).val())
        );
        $(`#fontColor-${id}`).on(`input`, () =>
            $(`#${id}`)
                .find(`h4.group-title`)
                .css(`color`, $(`#fontColor-${id}`).val())
        );

        //onload
        $(`#fontFamily-${id}`).val(SetFontFamily);
        $(`#fontSize-${id}`).val(SetFontSize);
        $(`#fontColor-${id}`).val(
            rgbToHex(+SetFontColor[0], +SetFontColor[1], +SetFontColor[2])
        );
    } else {
        //Other
        const SetFontFamily = $(`#${id}`)
            .css(`font-family`)
            .split(`,`)[0]
            .replaceAll(`"`, ``);
        const SetFontSize = $(`#${id}`).css(`font-size`).replaceAll(`px`, ``);
        const SetFontColor = $(`#${id}`)
            .css(`color`)
            .replaceAll(`rgb(`, ``)
            .replaceAll(`)`, ``)
            .split(`,`);

        //ONCLICK
        //font Family
        $(`#fontFamily-${id}`).change(() => {
            if ($(`#tblSelect`).val()) {
                //is table
                if (+$(`#tblSelect`).val() == 1) {
                    //header
                    $(`#${id}`)
                        .children()
                        .eq(0)
                        .css(
                            `font-family`,
                            $(`#fontFamily-${id}`).val().replaceAll('"', "")
                        );
                    //row number
                    $(`#${id}`)
                        .children()
                        .eq(1)
                        .css(
                            `font-family`,
                            $(`#fontFamily-${id}`).val().replaceAll('"', "")
                        );
                } else {
                    //body
                    $(`#${id} tr td`).css(
                        "font-family",
                        $(`#fontFamily-${id}`).val().replaceAll('"', "")
                    );
                }
            } else {
                $(`#${id}`).css(
                    `font-family`,
                    +$(`#fontFamily-${id}`).val().replaceAll('"', "")
                );
            }
        });

        // } $(`#${id}`).css(`font-family`, $(`#fontFamily-${id}`).val().replaceAll('"', '')));

        //font Size
        $(`#fontSize-${id}`).change(() => {
            if ($(`#tblSelect`).val()) {
                //is table
                if (+$(`#tblSelect`).val() == 1) {
                    //header
                    $(`#${id}`)
                        .children()
                        .eq(0)
                        .css(`font-size`, $(`#fontSize-${id}`).val() + "px");
                    //row number
                    $(`#${id}`)
                        .children()
                        .eq(1)
                        .css(`font-size`, $(`#fontSize-${id}`).val() + "px");
                } else {
                    //body
                    $(`#${id} tr td`).css(
                        "font-size",
                        +$(`#fontSize-${id}`).val() + "px"
                    );
                }
            } else {
                $(`#${id}`).css(`font-size`, +$(`#fontSize-${id}`).val() + "px");
            }
        });

        //font Color
        $(`#fontColor-${id}`).on(`input`, () => {
            if ($(`#tblSelect`).val()) {
                //is table
                +$(`#tblSelect`).val() == 1
                    ? //header
                    $(`#${id}`)
                        .children()
                        .eq(0)
                        .css(`color`, $(`#fontColor-${id}`).val())
                    : //body
                    $(`#${id}`)
                        .children()
                        .eq(1)
                        .css(`color`, $(`#fontColor-${id}`).val());
            } else {
                $(`#${id}`).css(`color`, $(`#fontColor-${id}`).val());
            }
        });

        //ONLOAD
        $(`#fontFamily-${id}`).val(SetFontFamily);
        $(`#fontSize-${id}`).val(SetFontSize);
        $(`#fontColor-${id}`).val(
            rgbToHex(+SetFontColor[0], +SetFontColor[1], +SetFontColor[2])
        );
    }
}

//Font  Settings
function Plus_Minus_Prop(elem) {
    let Item = $(elem).parent().children().eq(2);
    if (Item.css(`display`) == `none`) {
        Item.show();
        $(elem).attr(`class`, `propTitleIcon fa fa-minus-square-o`);
    } else {
        Item.hide();
        $(elem).attr(`class`, `propTitleIcon fa fa-plus-square-o`);
    }
}

function br() {
    $(`#SettingFieldChild`).append(document.createElement(`br`));
}

function DataType(id) {
    let type = $(`#${id}`).attr("datatype");
    let arr = [];
    if (
        type == "LocalString" ||
        type == "LatinString" ||
        type == "String" ||
        type == "Computed"
    ) {
        arr = ["LocalString", "LatinString", "String"];
    } else if (type == "Time") {
        arr = ["Time"];
    } else if (type == "Text") {
        arr = ["Text"];
    } else if (type == "Date") {
        arr = ["Date"];
    } else if (type == "DateTime") {
        arr = ["DateTime"];
    } else if (type == "Boolean") {
        arr = ["Boolean"];
    } else if (type == "Money") {
        arr = ["Money"];
    } else if (type == "BigInteger" || type == "Integer") {
        arr = ["BigInteger", "Integer"];
    } else if (type == "File") {
        arr = ["File"];
    } else if (type == "Image") {
        arr = ["Image"];
    } else if (type == "System" || type == "Enum") {
        arr = ["System", "Enum"];
    } else if (type == "Table") {
        arr = ["Table"];
    } else if (type == "SelectiveTable") {
        arr = ["SelectiveTable"];
    }

    let item = "";
    for (let i in arr)
        item += `<option value="${arr[i]}">${formResources.get(arr[i])}</option>`;

    return item;
}

function InputCount() {
    return (
        `<option value="Single">` +
        formResources.get("Single") +
        `</option><option value="Array">` +
        formResources.get("Array") +
        `</option>`
    );
}

function EntityType() {
    ref = JSON.parse(localStorage.getItem("EntityTypes" + $ProcessID));
    if (!ref) {
        alert("please press save button");
    } else {
        if (ref)
            return ref.map(
                (Item) => `<option value="${Item.ID}">${Item.Label}</option>`
            );
    }
}

function EnumType() {
    let options = "";
    $.ajax({
        type: "POST",

        url: "../../App_Sys/Services/Admin/Process.asmx/GetEnumTypes",

        data: "",

        contentType: false,
        async: false,
        dataType: "xml",

        processData: false,

        error: function (jqXHR, textStatus, errorThrown) {
            alert(JSON.stringify(jqXHR));
            return options;
        },
        success: function (data) {
            Obj_EnumType = JSON.parse(
                data.getElementsByTagName("string")[0].childNodes[0].nodeValue
            );
            if (Obj_EnumType) {
                for (let i in Obj_EnumType)
                    options += `<option value="${Obj_EnumType[i].ID}">${Obj_EnumType[i].Label}</option>`;

                options += `<option value="add">${formResources.get(
                    "additem"
                )}</option>`;
            }
        },
    });

    return options;
}

function VariableProp(id) {
    let boxID = id.replaceAll("item", "group");
    let getVariable = [];
    let _disabled = false;
    if (localStorage.getItem("Variables" + $ProcessID))
        getVariable = JSON.parse(localStorage.getItem("Variables" + $ProcessID));

    let filt = getVariable.filter(
        (x) => x.RowKey == $(`#` + boxID).attr("foreignkey")
        // &&
        // x.DataType == $(`#` + id).attr("datatype")
    );

    if (filt.length) _disabled = true;

    $(`#FixLabel`).attr("disabled", _disabled);

    //datatype
    let item = `<tr><td class="td1">${formResources.get(
        "DataType"
    )}</td><td class="td2"><select id="DataType" class="selectProp" ${_disabled ? "disabled" : ""
        }>${DataType(id)}</select></td></tr>`;

    //Entitytype
    item += `<tr style="display:none"><td class="td1">${formResources.get(
        "Entity"
    )}</td><td class="td2"><select id="EntityID" class="selectProp" ${_disabled ? "disabled" : ""
        }>${EntityType()}</select></td></tr>`;

    //Enumtype
    item += `<tr style="display:none"><td class="td1">${formResources.get(
        "List"
    )}</td><td class="td2"><select id="EnumID" class="selectProp" elementID="${id}" onchange="Enum_addItem(id)" ${_disabled ? "disabled" : ""
        }>${EnumType()}</select></td></tr>`;

    //computed
    // item += `<tr style="display:none"><td class="td1">${formResources.get(
    //   "Formula"
    // )}</td><td class="td2"><textarea id="ComputedID" style="direction:ltr;max-width: 125px;" class="" ${
    //   _disabled ? "disabled" : ""
    // }></textarea></td></tr>`;

    //inputcount
    item += `<tr><td class="td1">${formResources.get(
        "inputcount"
    )}</td><td class="td2"><select id="InputCount" class="selectProp" ${_disabled ? "disabled" : ""
        } >${InputCount()}</select></td></tr>`;

    // Add visibility dropdown
    item += `<tr id="visibility">
<td class="td1" style="display: flex; width: 100% !important; height: 24px !important; font-size: 11px !important;">
  ${formResources.get("visibility")}
</td>
<td class="td2">
  <select id="visibilitySelect" class="selectProp">
  <option value="true" ${$(`#` + id).attr("visibility") == "true" ? "selected" : ""
        }>
    ${formResources.get("visible")}
  </option>
    <option value="false" ${$(`#` + id).attr("visibility") == "false" ? "selected" : ""
        }>
      ${formResources.get("invisible")}
    </option>
  </select>
</td>
</tr>`;

    // Add read-only dropdown
    item += `<tr id="readonly">
<td class="td1" style="display: flex; width: 100% !important; height: 24px !important;">
  ${formResources.get("readonly")}
</td>
<td class="td2">
  <select id="readonlySelect" class="selectProp" ${$(`#` + id).attr("visibility") === "false" ? "disabled" : ""
        }>
    <option value="false" ${$(`#` + id).attr("read-only") == "false" ? "selected" : ""
        }>
      ${formResources.get("no")}
    </option>
    <option value="true" ${$(`#` + id).attr("read-only") == "true" ? "selected" : ""
        }>
      ${formResources.get("yes")}
    </option>
  </select>
</td>
</tr>`;

    // Add required dropdown
    item += `<tr id="required">
   <td class="td1" style="display: flex; width: 100% !important; height: 24px !important; font-size: 11px !important;">
     ${formResources.get("required")}
   </td>
   <td class="td2">
     <select id="requiredSelect" class="selectProp" >
       <option value="false" ${$(`#` + id).attr("isrequired") == "false" ? "selected" : ""
        }>
         ${formResources.get("no")}
       </option>
       <option value="true" ${$(`#` + id).attr("isrequired") == "true" ? "selected" : ""
        }>
         ${formResources.get("yes")}
       </option>
     </select>
   </td>
 </tr>`;

    if (
        $(`#` + id).attr("inputtype") != "Table" &&
        $(`#` + id).attr("inputtype") != "SelectiveTable" &&
        $(`#` + id).attr("inputtype") != "FileBrowse" &&
        $(`#` + id).attr("inputtype") != "Image"
    ) {





        item += `<tr id="DefaultValueTR"><td class="td1" style="display: flex;width:100% !important;height: 24px !important;">${ $(`#` + id).attr("inputtype")=="FacilityBox"?"آیتم های رزرو":formResources.get(
            "defaultvalue"
        )}</td><td class="td2">`;

        if ($(`#` + id).attr("inputtype") == "SelectBox") {
            item += `<select id="selectDefaultValue" class="selectProp"></select>`;
        } else if ($(`#` + id).attr("inputtype") == "CheckBox") {
            item += `<select id="selectDefaultValue" class="selectProp">
      <option value="False">${formResources.get("unchecked")}</option>
      <option value="True">${formResources.get("checked")}</option>
      </select>`;
        }
        if ($(`#${id}`).attr("inputtype") == "DateBox") {
            item += `<input id="DefaultValue" class="textlbl dateMask" style="margin:0;width:81%;"/>`;
            // Checkbox with initial state based on defaultvalChecked attribute
            if ($(`#${id}`).attr("defaultvalChecked") === "true") {
                item += `<input id="DefaultValueCheckBox" type="checkbox" style="margin:0;outline:black !important;" checked>`;
                // Set placeholder when checkbox is checked initially
                item += `<script>
                  $(document).ready(function() {
                    $("#DefaultValue").attr("placeholder", "Current DateTime");
                    $("#DefaultValue").attr("disabled", true);
                  });
                </script>`;
            } else {
                item += `<input id="DefaultValueCheckBox" type="checkbox" style="margin:0;outline:black !important;">`;
            }
            item += `<label for="myCheckbox"></label><span class="tooltip-text" id="tooltip">${formResources.get(
                "checkedDefaultValue"
            )}</span>`;
        } else if ($(`#${id}`).attr("inputtype") == "TimeBox") {
            item += `<input id="DefaultValue" data-inputmask="&quot;alias&quot;: &quot;zz:mm&quot;" class="textlbl timeMask" style="width:80%;margin:0;"/>`;
            // Checkbox with initial state based on defaultvalChecked attribute
            if ($(`#${id}`).attr("defaultvalChecked") === "true") {
                item += `<input id="DefaultValueCheckBox" type="checkbox" style="margin:0;outline:black !important;" checked>`;
                // Set placeholder when checkbox is checked initially
                item += `<script>
                  $(document).ready(function() {
                    $("#DefaultValue").attr("placeholder", "Current DateTime");
                    $("#DefaultValue").attr("disabled", true);
                  });
                </script>`;
            } else {
                item += `<input id="DefaultValueCheckBox" type="checkbox" style="margin:0;outline:black !important;">`;
            }
            item += `<label for="myCheckbox"></label><span class="tooltip-text" id="tooltip">${formResources.get(
                "checkedDefaultValue"
            )}</span>`;
        } else if ($(`#${id}`).attr("inputtype") == "DateTimeBox") {
            item += `<input id="DefaultValue" class="textlbl datetimeMask" style="margin:0;width:80%;"/>`;
            // Checkbox with initial state based on defaultvalChecked attribute
            if ($(`#${id}`).attr("defaultvalChecked") === "true") {
                item += `<input id="DefaultValueCheckBox" type="checkbox" style="margin:0;outline:black !important;" checked>`;
                // Set placeholder when checkbox is checked initially
                item += `<script>
                  $(document).ready(function() {
                    $("#DefaultValue").attr("placeholder", "Current DateTime");
                    $("#DefaultValue").attr("disabled", true);
                  });
                </script>`;
            } else {
                item += `<input id="DefaultValueCheckBox" type="checkbox" style="margin:0;outline:black !important;">`;
            }
            item += `<label for="myCheckbox"></label><span class="tooltip-text" id="tooltip">${formResources.get(
                "checkedDefaultValue"
            )}</span>`;
        } else {
            item += `<input id="DefaultValue" type="${typeConvertor(
                $(`#` + id).attr("datatype")
            )}" class="textlbl" style="margin:0;${typeConvertor($(`#` + id).attr("datatype")) == "number"
                ? "width:100%;"
                : "max-width: 100px;"
                } direction: rtl;"/>`;
        }
    }
    //todo
    item += `</td></tr>`;
    // elementID="${id}" onclick="Events
    //nullable
    // item += `<tr><td class="td1">${formResources.get(
    //   "nullable"
    // )}</td><td class="td2"><select id="Nullable" class="selectProp"><option value="false">${formResources.get(
    //   "false"
    // )}</option><option value="true">${formResources.get(
    //   "true"
    // )}</option></select></td></tr>`;
    // //read-only
    // item += `<tr><td class="td1">${formResources.get(
    //   "readonly"
    // )}</td><td class="td2"><select id="Readonly" class="selectProp"><option value="false">${formResources.get(
    //   "false"
    // )}</option><option value="true">${formResources.get(
    //   "true"
    // )}</option></select></td></tr>`;

    //hint
    // item += `<tr><td class="td1">${formResources.get(
    //   "description"
    // )}</td><td class="td2"><input  id="Hint" class="textlbl"></input></td></tr>`;

    //Events
    if ($(`#${id}`).attr("datatype") == "Enum") {
        item += `<tr id="EventsTR"><td class="td1">${formResources.get(
            "events"
        )}</td><td id="EventsTd2" class="td2"><i id="Events" class="textlbl glyphicon glyphicon-option-horizontal" elementID="${id}" onclick="Events(event,id)" ></i><span id="EventSpan">
    ${JSON.parse($(`#${id}`).attr("events")) == [] ||
                JSON.parse($(`#${id}`).attr("events")) == "undefined" ||
                $(`#${id}`).attr("events") == "[]"
                ? "No Events"
                : "Events"
            }</span></td></tr>`;
    }

    $(`#Tbody2`).append(item);

    // Add change event to visibility dropdown
    $("#visibilitySelect").on("change", (event) => {
        const selectedValue = $(event.target).val();
        if (selectedValue === "true") {
            $("#visibilitySelect").prev().text(formResources.get("visible"));
            $(`#${id}`).attr("visibility", "true");
            // $(`#requiredSelect`).prop("disabled", false);
            // $(`#readonlySelect`).prop("disabled", false);
        } else {
            $("#visibilitySelect").prev().text(formResources.get("invisible"));
            $(`#${id}`).attr("visibility", "false");
            // $(`#requiredSelect`).val("false");
            // $(`#readonlySelect`).val("false");
            // $(`#requiredSelect`).prop("disabled", true);
            // $(`#readonlySelect`).prop("disabled", true);
            // $(`#${id}`).attr("isrequired", "false");
            // $(`#${id}`).attr("nullable", "true");
        }
    });

    // Add change event to readonly dropdown
    $("#readonlySelect").on("change", (event) => {
        const selectedValue = $(event.target).val();
        if (selectedValue === "true") {
            $("#readonlySelect").prev().text(formResources.get("yes"));
            $(`#${id}`).attr("read-only", "true");
            $(`#requiredSelect`).val("false");
            $(`#${id}`).attr("isrequired", "false");
            $(`#${id}`).attr("nullable", "true");
        } else {
            $("#readonlySelect").prev().text(formResources.get("no"));
            $(`#${id}`).attr("read-only", "false");
        }
    });

    // Add change event to required dropdown
    $("#requiredSelect").on("change", (event) => {
        const selectedValue = event.target.value;
        if (selectedValue === "true") {
            if ($(`#readonlySelect`).val() == "true") {
                // $(`#readonlySelect`).val("false");
                // $(`#${id}`).attr("read-only", "false");
            }
            // $(`#visibilitySelect`).val("true");
            // $(`#${id}`).attr("visibility", "true");
            $(`#${id}`).attr("isrequired", "true");
        } else {
            $(`#${id}`).attr("isrequired", "false");
        }
    });

    //TOOLTIP
    if (
        $(`#` + id).attr("inputtype") == "DateBox" ||
        $(`#` + id).attr("inputtype") == "TimeBox" ||
        $(`#` + id).attr("inputtype") == "DateTimeBox"
    ) {
        const checkbox = document.getElementById("DefaultValueCheckBox");
        const tooltip = document.getElementById("tooltip");

        //ToolTip For Default value checkbox
        checkbox.addEventListener("mouseover", () => {
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";
        });
        checkbox.addEventListener("mouseout", () => {
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = "0";
        });

        checkbox.addEventListener("click", (event) => {
            const DefaultValue = document.getElementById("DefaultValue");
            if (event.target.checked) {
                $("#DefaultValue").val("");
                DefaultValue.setAttribute("disabled", true);
                $(`#${id}`).attr("defaultvalue", "CurrentDateTime");
                $("#DefaultValue").attr("placeHolder", "Current DateTime");
                $(`#${id}`).attr("defaultvalChecked", "true");
            } else {
                DefaultValue.removeAttribute("disabled");
                $("#DefaultValue").attr("placeHolder", "");
                $("#DefaultValue").val("");
                $(`#${id}`).attr("defaultvalue", "");
                $(`#${id}`).attr("defaultvalChecked", "false");
                return;
            }
        });
    }

    $(".dateMask").attr("data-inputmask", '"alias": "shamsi"');

    $(".dateMask").inputmask();

    $(".dateMask").css("text-align", "left");

    $(".datetimeMask").attr("data-inputmask", '"mask": "x/m/d h:s"');

    $(".datetimeMask").inputmask();

    $(".datetimeMask").css("text-align", "left");

    $(".timeMask").inputmask();

    $(".timeMask").css("text-align", "left");

    //load

    $(`#DataType`).val(
        $(`#${id}`).attr("datatype") != "undefined"
            ? $(`#${id}`).attr("datatype")
            : ""
    );
    if (
        $(`#${id}`).attr("entitytypeid") == "undefined" ||
        $(`#${id}`).attr("entitytypeid") == ""
    ) {
        if ($(`#${id}`).attr("datatype") == "System") {
            $(`#EntityID`).val($(`#EntityID option:first-child`).val());
            $(`#${id}`).attr("entitytypeid", $(`#EntityID option:first-child`).val());
        }
    } else {
        $(`#EntityID`).val($(`#${id}`).attr("entitytypeid"));
    }

    // $(`#ComputedID`).val(
    //   $(`#${id}`).attr("formula") != "undefined"
    //     ? $(`#${id}`).attr("formula")
    //     : ""
    // );

    if (
        $(`#${id}`).attr("enumtypeid") == "undefined" ||
        $(`#${id}`).attr("enumtypeid") == 0
    ) {
        if ($(`#${id}`).attr("datatype") == "Enum") {
            $(`#EnumID`).val($(`#EnumID option:first-child`).val());
            $(`#${id}`).attr("enumtypeid", $(`#EnumID option:first-child`).val());
        }
    } else {
        $(`#EnumID`).val($(`#${id}`).attr("enumtypeid"));
    }

    $(`#InputCount`).val(
        $(`#${id}`).attr("inputcount") != "undefined"
            ? $(`#${id}`).attr("inputcount")
            : ""
    );

    if ($(`#${id}`).attr("inputtype") == "SelectBox") {
        $(`#selectDefaultValue`).append(
            EventItems(id.replaceAll("form-item-", ""))
        );

        if ($(`#${id}`).attr("defaultvalue") != "") {
            $(`#selectDefaultValue`).val($(`#${id}`).attr("defaultvalue"));
        } else {
            $(`#selectDefaultValue`).val(
                $(`#selectDefaultValue option:first-child`).val()
            );

            if ($(`#${id}`).attr("datatype") != "System") {
                $(`#${id}`).attr(
                    "DefaultValue",
                    $(`#selectDefaultValue option:first-child`).val()
                );
            }
        }

        $(`#DefaultValue`).remove();
    }
    if ($(`#${id}`).attr("inputtype") == "CheckBox") {
        if ($(`#${id}`).attr("defaultvalue") != "") {
            $(`#selectDefaultValue`).val($(`#${id}`).attr("defaultvalue"));
        } else {
            $(`#selectDefaultValue`).val(
                $(`#selectDefaultValue option:first-child`).val()
            );

            $(`#${id}`).attr(
                "DefaultValue",
                $(`#selectDefaultValue option:first-child`).val()
            );
        }
    } else {
        $(`#DefaultValue`).val(
            $(`#${id}`).attr("defaultvalue") != "undefined"
                ? $(`#${id}`).attr("defaultvalue")
                : ""
        );
    }

    $(`#EnumID`).on("change", () => {
        $(`#selectDefaultValue`).empty();
        if ($(`#EnumID`).val() != "add") {
            $(`#DefaultValueTR`).css("display", "table-row");
            $(`#selectDefaultValue`).append(
                EventItems(id.replaceAll("form-item-", ""))
            );

            $(`#${id}`).attr(
                "DefaultValue",
                $(`#selectDefaultValue option:first-child`).val()
            );
        } else {
            $(`#DefaultValueTR`).hide();
        }

        $(`#${id}`).attr("events", "[]");
        $(`#EventSpan`).text("No Events");
    });

    // const defaultVal = $(`#${id}`).attr("defaultvalue");
    // if (
    //   defaultVal == "CurrentDate" ||
    //   defaultVal == "CurrentTime" ||
    //   defaultVal == "CurrentDateTime"
    // ) {
    //   $(`#DefaultValueCheckBox`).attr("checked", true);
    //   $(`#DefaultValue`).attr("disabled", true);
    // } else {
    //   $(`#DefaultValueCheckBox`).attr("checked");
    //   $(`#DefaultValue`).attr("disabled", true);
    // }

    $(`#Nullable`).val(
        $(`#${id}`).attr("nullable") != "undefined"
            ? $(`#${id}`).attr("nullable")
            : ""
    );
    $(`#Readonly`).val(
        $(`#${id}`).attr("read-only") != "undefined"
            ? $(`#${id}`).attr("read-only")
            : ""
    );
    let _id = "form-group-lbl-" + id.split("-")[2] + "-hint";
    $(`#Hint`).val($(`#` + _id).text());
    hide_show();

    //command//tod
    $(`#DataType`).on(`input`, () => {
        $(`#InputCount option`).remove();
        $(`#InputCount`).append(InputCount());

        $(`#${id}`).attr("datatype", $(`#DataType`).val());

        if ($(`#DataType`).val() == "System") {
            $(`#EntityID`).val($(`#EntityID option:first-child`).val());
            $(`#${id}`).attr("entitytypeid", $(`#EntityID`).val());
            $(`#${id}`).attr("enumtypeid", 0);
            $(`#${id}`).attr("defaultvalue", "");
            $(`#${id}`).attr("events", "[]");
            $(`#DefaultValueTR`).css("display", "none");
            $(`#EventSpan`).text("No Events");
        } else {
            $(`#EnumID`).val($(`#EnumID option:first-child`).val());
            $(`#${id}`).attr("enumtypeid", $(`#EnumID`).val());
            $(`#${id}`).attr("entitytypeid", 0);
            $(`#DefaultValueTR`).css("display", "table-row");
            $(`#EventsTR`).css("display", "table-row");
            $(`#${id}`).attr("defaultvalue", $(`#selectDefaultValue`).val());
        }

        hide_show();
    });
    $(`#InputCount`).on(`input`, () => {
        $(`#${id}`).attr("inputcount", $(`#InputCount`).val());
    });
    $(`#EntityID`).on(`input`, () => {
        $(`#${id}`).attr("entitytypeid", $(`#EntityID`).val());
    });
    $(`#EnumID`).on(`input`, (e) => {
        localStorage.setItem("currentFormItemID", id);
        $(`#${id}`).attr("enumtypeid", $(`#EnumID`).val());
    });

    // $(`#ComputedID`).on(`input`, () => {
    //   $(`#${id}`).attr("formula", $(`#ComputedID`).val());
    // });

    $(`#Nullable`).on(`input`, () => {
        $(`#${id}`).attr("nullable", $(`#Nullable`).val());
    });

    $(`#selectDefaultValue`).on("change", () => {
        $(`#${id}`).attr("DefaultValue", $(`#selectDefaultValue`).val());
    });

    $(`#DefaultValue`).on(`input`, () => {
        $(`#${id}`).attr("defaultvalue", $(`#DefaultValue`).val());
    });

    $(`#Readonly`).on(`input`, () => {
        $(`#${id}`).attr("read-only", $(`#Readonly`).val());
    });
    $(`#Hint`).on(`input`, () => {
        let _id = "form-group-lbl-" + id.split("-")[2] + "-hint";
        $(`#${_id}`).text($(`#Hint`).val());
    });
}

// function checkDefaultValue(event) {
//   const elemId = $(event.target).attr("elementID");
//   if ($(event.target).is(":checked")) {
//     if ($(`#DataType`).val() == "Date") {
//       $(`#DefaultValue`).val("Current Date");
//       $(`#` + elemId).attr("defaultvalue", "Current Date");
//     } else if ($(`#DataType`).val() == "Time") {
//       $(`#DefaultValue`).val("Current Time");
//       $(`#` + elemId).attr("defaultvalue", "Current Time");
//     } else if ($(`#DataType`).val() == "DateTime") {
//       $(`#DefaultValue`).val("Current DateTime");
//       $(`#` + elemId).attr("defaultvalue", "Current DateTime");
//     } else if ($(`#DataType`).val() == "Boolean") {
//       $(`#DefaultValue`).val(formResources.get("active"));
//       $(`#` + elemId).attr("defaultvalue", "active");
//     }
//     $(`#DefaultValue`).removeAttr("disabled");
//   } else {
//     $(`#DefaultValue`).attr("disabled", true);
//     $(`#DefaultValue`).val("");
//   }
// }

function Events(ev, id) {
    let elementID = $(`#` + id)
        .attr("elementID")
        .split("-")[2];

    let div =
        '<div id="myModal" class="modal" >' +
        '<div id="modalPopUp" class="modal-content">' +
        "</div></div>";
    $("#content").append(div);

    let Table = `<div id="Title" style="font-size:14px;">${formResources.get(
        "events"
    )}</div>`;
    Table +=
        '<div class="" style="height:300px !important;direction:rtl;border-bottom:1px solid #ccc;margin-bottom:10px;display:contents;">' +
        `<div style="height: 50px;"><button id="btnAdd_Event` +
        `" class="btn btn-success" onclick="addEventItems(${elementID})" style="";
    align-items: center;">${formResources.get("add")}</button>` +
        `</div><div class="tableFixHead">` +
        `<table id="EventTbl" class="table table-bordered table-hover" style="font-size: 14px;">` +
        "<thead>" +
        "<tr>" +
        `<th scope="col" data-sortable="true" style="width:40px;" >${formResources.get(
            "row"
        )}</th>` +
        `<th scope="col" data-sortable="true" style="width:80px;" >${formResources.get(
            "fieldname"
        )}</th>` +
        `<th scope="col" style="width:200px;">${formResources.get(
            "selectvalue"
        )}</th>` +
        `<th scope="col" style="width:200px;">${formResources.get(
            "eventItem"
        )}</th>` +
        `<th scope="col" style="width:150px;">${formResources.get(
            "eventType"
        )}</th>` +
        `<th scope="col" style="width:150px;">${formResources.get(
            "operationsID"
        )}</th>` +
        `</tr>` +
        `</thead >` +
        `<tbody>${EventBody(id)}</tbody>` +
        `</table></div></div>`;

    Table += `<div style="margin-top:15px;"><button id="btnPopup" class="btn btn-primary btn_submint_exit" onclick="EventSubmit(${elementID})">${formResources.get(
        "insert"
    )}</button>`;
    Table += `<button id="btnPopup" class="btn btn-light btn_submint_exit" onclick="EventExit(${elementID})" style="margin:0px 5px;">${formResources.get(
        "cancel"
    )}</button> </div>`;

    $(`#modalPopUp`).append(Table);
    $("#myModal").css("display", "block");
    $("#modalPopUp").css("width", "max-content");
}

var EventsArray = [];
function EventBody(id) {
    let elementID = $(`#` + id)
        .attr("elementID")
        .split("-")[2];
    EventsArray = [];
    let item = "";
    if ($(`#form-item-` + elementID).attr("events") != undefined) {
        let _event = JSON.parse($(`#form-item-` + elementID).attr("events"));
        if (_event !== "[]") EventsArray = _event;

        if (EventsArray.length) {
            let count = 1;
            for (let i = 0; i < EventsArray.length; i++) {
                for (let j = 0; j < EventsArray[i].actions.length; j++) {
                    item += `<tr><td>${count}</td>`;
                    item += `<td>${EventsArray[i].actions[j].target}</td>`;
                    item += `<td>${EventsArray[i].value}</td>`;
                    item += `<td>${EventsArray[i].actions[j].targetName}</td>`;
                    item += `<td>${EventsArray[i].actions[j].actionType}</td>`;
                    item += `<td><span id="Row_Delete_${count}" class=" glyphicon glyphicon-trash" onclick="Row_Deleted_btn(id)"></span></td></tr>`;
                    count++;
                }
            }
        }
    } else {
        EventsArray = [];
    }
    return item;
}
function Row_Deleted_btn(id) {
    let tr = $("#" + id)
        .parent()
        .parent();
    tr.remove();
    const _target = tr.children().eq(1).html();
    const _value = tr.children().eq(2).html();
    const _targetName = tr.children().eq(3).html();
    const _actionType = tr.children().eq(4).html();
    const elem = EventsArray.filter((x) => x.value == _value);


    if (elem.length) {
        let _action = elem[0].actions.filter(
            (x) =>
                x.target == _target &&
                x.targetName == _targetName &&
                x.actionType == _actionType

        );

        

        if (_action.length)
            elem[0].actions.splice(elem[0].actions.indexOf(_action[0]), 1);


        if (elem[0].actions.length == 0)
            EventsArray.splice(EventsArray.indexOf(elem[0]), 1);
    }

}

function addEventItems(elementID) {
    let div =
        '<div id="SubmyModal" class="modal" >' +
        '<div id="SubmodalPopUp" class="modal-content">' +
        "</div></div>";
    $("#myModal").append(div);

    let item = `<div id="Title" style="font-size:14px;">${formResources.get(
        "addEventList"
    )}</div>`;
    //EventItems
    item += `<label class="lblPopup lbl" style="display: block;width: auto;margin-top:10px;">${formResources.get(
        "enumList"
    )}</label>`;
    item += `<div class="input-group"><select id="EventItems" class="selectPopup event" >${EventItems(
        elementID
    )}</select></div>`;
    //Items
    item += `<label class="lblPopup lbl" style="display: block;width: auto;margin-top:10px;">${formResources.get(
        "eventItem"
    )}</label>`;
    item += `<div class="input-group"><select id="AllElements" multiple  class="selectPopup event" >${AllElements(
        elementID
    )}</select></div>`;
    //EventTypes
    item += `<label class="lblPopup lbl" style="display: block;width: auto;margin-top:10px;">${formResources.get(
        "event"
    )}</label>`;
    item += `<div class="input-group"><select id="EventType" class="selectPopup event" >${EventType()}</select></div>`;

    item += `<div style="border-top: 1px solid #ccc;padding-top: 5px;margin-top:15px;"><button id="btnPopup" class="btn btn-primary btn_submint_exit" onclick="SubEventSubmit(${elementID})">${formResources.get(
        "insert"
    )}</button>`;
    item += `<button id="btnPopup" class="btn btn-light btn_submint_exit" onclick="SubEventExit(${elementID})" style="margin:0px 5px;">${formResources.get(
        "cancel"
    )}</button> </div>`;
    $(`#SubmodalPopUp`).append(item);

    $("#SubmyModal").css("display", "block");
    $("#SubmodalPopUp").css("width", "500px");
    $(`.event`).select2();
    $(`.event`).select2();
    $(`.select2-container`).css("position", "revert");
}
function EventSubmit(elementID) {
    $(`#form-item-` + elementID).attr("events", JSON.stringify(EventsArray));
    if ($(`#EventTbl tbody tr`).length) {
        $(`#EventSpan`).text("Events");
    } else {
        $(`#EventSpan`).text("No Events");
    }
    EventExit();
}

function SubEventSubmit(elementID) {    
    let jsonTarget = {
        value: "[" + $(`#EventItems`).val() + "]",
        targetName: $(`#AllElements option:selected`)  
                      .map(function() { 
                          return $(this).text();     
                      })
                      .get()                         
                      .join(', '),                  
        targetID: $(`#AllElements option:selected`)  
                      .map(function() { 
                          return $(this).attr("targetid");     
                      })
                      .get()                      
                      .join(', '),  
        targetType: "",
        actionType: $(`#EventType`).val(),
        target: $(`#AllElements`).val(),
    };

    var fgID = jsonTarget.targetID; 
    var element = $('#' + fgID);

    let isBoxitem = false;
    let isFormitem = false;

    var fgIDs = jsonTarget.targetID.split(',').map(id => id.trim());
    
    fgIDs.forEach(id => {
        if (id) { 
            let tmpElement = $('#' + id);
            if (tmpElement.hasClass('form-group-box')) {
                isBoxitem = true;
            } else {
                isFormitem = true;
            }
        }
    });

    if(isBoxitem && isFormitem) {
        alert(formResources.get("EventConflict"))
        return;
    }
    //add target type dynamically
    jsonTarget.targetType = element.hasClass('form-group-box') ? "FormGroupBox" : "FormItem";

    if (jsonTarget.targetName != "") {
        let objValue = EventsArray.length
            ? EventsArray.filter((x) => x.value == jsonTarget.value)
            : [];
        if (objValue.length) {
            //Add
            objValue[0].actions.push({
                actionType: jsonTarget.actionType,
                targetType: jsonTarget.targetType,
                targetName: jsonTarget.targetName,
                target: jsonTarget.target,
                targetID: jsonTarget.targetID,
            });
        } else {
            //New
            EventsArray.push({
                value: jsonTarget.value,
                actions: [
                    {
                        actionType: jsonTarget.actionType,
                        targetType: jsonTarget.targetType,
                        targetName: jsonTarget.targetName,
                        target: jsonTarget.target,
                        targetID: jsonTarget.targetID,
                    },
                ],
            });
        }

        //insert ui
        let RowCount = $(`#EventTbl tr`).length;
        let tr = `<tr><td>${RowCount}</td><td>${jsonTarget.target}</td><td>${jsonTarget.value}</td><td>${jsonTarget.targetName}</td><td>${jsonTarget.actionType}</td><td><span id="Row_Delete_${RowCount}" class=" glyphicon glyphicon-trash" onclick="Row_Deleted_btn(id)"></span></td></tr>`;
        $(`#EventTbl tbody`).append(tr);

        SubEventExit();
    } else {
        $(`#select2-AllElements-container`).parent().css("border-color", "#f00");
    }
}

function EventType() {
    let opt = `<option value="Hide">${formResources.get("Hide")}</option>
  <option value="Show">${formResources.get("Show")}</option>
  <option value="Enable">${formResources.get("Enable")}</option>
  <option value="Disable">${formResources.get("Disable")}</option>
 <option value="Reload">${formResources.get("Reload")}</option>`;
    return opt;
}

function EventItems(id) {
    let _id = "form-item-" + id;
    let enumid = $(`#` + _id).attr("enumtypeid");
    if (enumid == "" || enumid == "null")
        enumid = $(`#EnumID option:first-child`).val();
    let opt;
    if ($(`#` + _id).attr("datatype") == "Enum") {
        $.ajax({
            type: "POST",
            url: "../../App_Sys/Services/Admin/Process.asmx/GetEnums",
            data: `{"enumTypeId":"${enumid}"}`,
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            processData: false,
            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.stringify(jqXHR));
            },
            success: function (data) {
                let _Arr = JSON.parse(data.d);

                for (let i in _Arr) {
                    opt += `<option value="${_Arr[i].Label}">${_Arr[i].Label}</option>`;
                }
            },
        });
        return opt;
    }
}

function AllElements(id) {
    let currentElemn = "form-group-" + id;
    let _Arr = $("#content .form-group");
    let _ArrGroupBox = $("#content .form-group-box");
    let opt;
    for (let i = 0; i < _Arr.length; i++) {
        if (_Arr[i].id != currentElemn) {
            const lbl = $.trim($(`#${_Arr[i].id} .lbl`).eq(0).html());
            let targetid = _Arr[i].id.replaceAll("group", "item");
            let systemid = $(`#${targetid}`).attr("systemid");

            opt += `<option value="${systemid}" targetid="${_Arr[i].id}">${lbl}</option>`;
        }
    }
    for (let i = 0; i < _ArrGroupBox.length; i++) {
        var parentDiv = $(`#${currentElemn}`).closest('.form-group-box');
        if (_ArrGroupBox[i].id != parentDiv.attr('id')) {
            const idGroupBox = _ArrGroupBox[i].id.split('-').pop();
            const labelGroupBox = $('#group-info-' + idGroupBox + ' h4').text();
            opt += `<option value="${labelGroupBox}" targetid="${_ArrGroupBox[i].id}">${labelGroupBox}</option>`;
        }
    }
    return opt;
}
function Enum_addItem(id) {
    let elementID = $(`#` + id)
        .attr("elementID")
        .split("-")[2];
    if ($("#" + id).val() == "add") {
        let lastid = +$("#" + id + " option:nth-last-child(2)").val();

        lastid = lastid >= 11000 ? lastid - 11000 + 1 : lastid + 1;
        const syslblDefaultValue = "Type " + lastid;
        let div =
            '<div id="myModal" class="modal" >' +
            '<div id="modalPopUp" class="modal-content">' +
            "</div></div>";
        $("#content").append(div);

        $("#myModal").css("display", "block");
        $("#modalPopUp").css("width", "500px");

        let item = `<div id="Title" style="font-size:14px;">${formResources.get(
            "addEnumList"
        )}</div>`;
        item += `<label class="lblPopup lbl" style="display: block;width: auto;">${formResources.get(
            "systemLabel"
        )}</label>`;
        item += `<div class="input-group" ><input id="syslbl" type="text" class="txtPopup" style="border-radius: 0px;" value="${syslblDefaultValue}" onkeypress="return ValidateKey(event)"></div>`;
        item += `<small style="display: block;" class="text-muted">English characters</small>`;
        item += `<label class="lblPopup lbl" style="display: block;width: auto;margin-top:20px;">${formResources.get(
            "dataLabel"
        )}</label>`;
        item += `<div class="input-group"><input id="datalbl" onkeypress="return submitok(event,${elementID})"  type="text" class="txtPopup" style="border-radius: 0px;"></div>`;

        item += `<div style="border-top: 1px solid #ccc;padding-top: 5px;margin-top:45px;"><button id="btnPopup" class="btn btn-primary btn_submint_exit" onclick="EnumFormSubmit(${elementID})">${formResources.get(
            "insert"
        )}</button>`;
        item += `<button id="btnPopup" class="btn btn-light btn_submint_exit" onclick="EnumExit(${elementID})" style="margin:0px 5px;">${formResources.get(
            "cancel"
        )}</button> </div>`;
        $(`#modalPopUp`).append(item);
        $(`#datalbl`).focus();
    } else {
        $("#" + id).val($(`#EnumID`).val());
    }
}
function submitok(ev, elementID) {
    if (ev.keyCode == 13) EnumFormSubmit(elementID);
}

function EnumFormSubmit(elementID) {
    var _data = new FormData();
    _data.append(
        "design",
        JSON.stringify({ ELabel: $(`#syslbl`).val(), Label: $(`#datalbl`).val() })
    );
    $.ajax({
        type: "POST",
        url: "../../App_Sys/Services/Admin/Process.asmx/EditEnumType",
        data: _data,
        contentType: false,
        async: false,
        dataType: "xml",
        processData: false,
        error: function (jqXHR, textStatus, errorThrown) {
            alert(JSON.stringify(jqXHR));
        },
        success: function (data) {
            let _LastOBJ = JSON.parse(
                data.getElementsByTagName("string")[0].childNodes[0].nodeValue
            )[0];

            //enum list in ui updated
            Obj_EnumType.push({ ID: _LastOBJ.ID, Label: _LastOBJ.Label });

            $("#form-item-" + elementID).attr("enumtypeid", _LastOBJ.ID);

            let myPromise = new Promise(function (myResolve) {
                if (Obj_EnumType) {
                    let options = "";
                    let count = 0;
                    for (let i in Obj_EnumType) {
                        options += `<option value="${Obj_EnumType[i].ID}">${Obj_EnumType[i].Label}</option>`;
                        if (count == Obj_EnumType.length - 1) myResolve(options);
                        count++;
                    }
                }
            });

            myPromise.then(function (options) {
                if (options != "") {
                    $(`#EnumID`).empty();
                    $(`#EnumID`).append(
                        (options += `<option value="add">${formResources.get(
                            "additem"
                        )}</option>`)
                    );
                    $(`#EnumID`).val($(`#EnumID option:nth-last-child(2)`).val());
                }
            });
        },
    });

    EnumExit();
}

function EnumExit(id) {
    $("#myModal").remove();
    $(`#EnumID`).val(11001);
    $("#form-item-" + id).attr("enumtypeid", 11001);
}
function SubEventExit() {
    $("#SubmyModal").remove();
}
function EventExit() {
    $("#myModal").remove();
}

function hide_show() {
    if ($(`#DataType`).val() == "System") {
        $(`#EntityID`).parent().parent().show();
        $(`#ComputedID`).parent().parent().hide();
        $(`#EnumID`).parent().parent().hide();
        // $("#InputCount option[value='List']").remove();
        $(`#DefaultValueTR`).hide();
    } else if ($(`#DataType`).val() == "Enum") {
        $(`#DefaultValueTR`).css("display", "table-row");
        $(`#EntityID`).parent().parent().hide();
        $(`#ComputedID`).parent().parent().hide();
        $(`#EnumID`).parent().parent().show();
        $("#InputCount option[value='List']").remove();
    } else if ($(`#DataType`).val() == "Computed") {
        $(`#EntityID`).parent().parent().hide();
        $(`#ComputedID`).parent().parent().show();
        $(`#EnumID`).parent().parent().hide();
        $("#InputCount option[value='Array']").remove();
        $("#InputCount option[value='List']").remove();
    } else if ($(`#DataType`).val() == "Table"||$(`#DataType`).val() == "SelectiveTable") {
        // $("#InputCount option[value='Array']").remove();
        $("#InputCount option[value='Single']").remove();
        $(`#EntityID`).parent().parent().hide();
        $(`#ComputedID`).parent().parent().hide();
        $(`#EnumID`).parent().parent().hide();
    } else {
        $("#InputCount option[value='Array']").remove();
        $("#InputCount option[value='List']").remove();
        $(`#EntityID`).parent().parent().hide();
        $(`#ComputedID`).parent().parent().hide();
        $(`#EnumID`).parent().parent().hide();
    }
}

function ValidateKey(ev) {
    var allowed =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789";
    return allowed.indexOf(String.fromCharCode(ev.keyCode)) == -1 ? false : true;
}
function ValidateKey2(ev) {
    var allowed =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 # آاب پ ت ث ج چ ح خ دذرزژس ش ط ظ ع غ ف ق ک گ ل م ن و ه ی";
    return allowed.indexOf(String.fromCharCode(ev.keyCode)) == -1 ? false : true;
}

function typeConvertor(type) {
    switch (type) {
        case "String":
        case "Text":
            return "text";
            break;
        case "Integer":
        case "Money":
            return "number";
            break;
        default:
            "text";
            break;
    }
}
