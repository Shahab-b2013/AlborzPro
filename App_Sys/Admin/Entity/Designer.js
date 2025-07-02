/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.1.0.0*/
/* Release Ferdos.BPMS*/

function renderDesigner(designJson) {
    Import_CS(designJson);
}

function saveDesign(_alert) {
    if (Object.keys(graph.getModel().cells).length > 2) {
        let _export = Export();
        var data = new FormData();
        data.append("design", JSON.stringify(_export));
        data.append("xml", BaseXml(jsonToXml(_export.EntityModel)));
        data.append("id", _pageKey);
        var $Entity = new edExecutor(data, _alert);
        $Entity.submit(data);
    } else {
        if (_alert)
            swal(`${EntityResources.get("designeNotFound")}`, {
                icon: "warning",
            });
    }
}
