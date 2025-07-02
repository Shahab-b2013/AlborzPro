/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.1.0.0*/
/* Release Ferdos.BPMS*/

//RGB to HEX
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function jsonToXml(Obj, root = "root") {
  let xmlStr = ``;

  const jsonToXmlRecursive = (jsonObj, rootName) => {
    let xmlStr = `<${rootName}`;

    // Adding attributes to the root element
    if (jsonObj != null) {
      if (jsonObj.hasOwnProperty("_attributes")) {
        for (const attrKey in jsonObj._attributes) {
          if (jsonObj._attributes.hasOwnProperty(attrKey)) {
            xmlStr += ` ${attrKey}="${jsonObj._attributes[attrKey]}"`;
          }
        }
      }
    }

    xmlStr += `>`;

    for (const key in jsonObj) {
      if (key !== "_attributes" && jsonObj.hasOwnProperty(key)) {
        const value = jsonObj[key];
        if (Array.isArray(value)) {
          value.forEach((item) => (xmlStr += jsonToXmlRecursive(item, key)));
        } else if (typeof value === "object") {
          xmlStr += jsonToXmlRecursive(value, key);
        } else {
          if (
            key != "EnumTypeID" &&
            key != "IsComposition" &&
            key != "UiId" &&
            key != "DestinationEntityID" &&
            key != "SourceEntityID" &&
            key != "AttributeTypeID"
          ) {
            if (key == "EnumType") {
              if (value != "None") xmlStr += `<${key}>${value}</${key}>`;
            } else if (key == "Formula") {
              if (value != "" && value != null)
                xmlStr += `<${key}>${value}</${key}>`;
            } else {
              xmlStr += `<${key}>${value}</${key}>`;
            }
          }
        }
      }
    }
    xmlStr += `</${rootName}>`;

    return xmlStr;
  };

  xmlStr += jsonToXmlRecursive(Obj, root);

  return xmlStr;
}
