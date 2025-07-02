/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.5.0.0*/
/* Release Ferdos.BPMS*/

// urlParams is null when used for embedding
window.urlParams = window.urlParams || {};

// Public global variables
window.MAX_REQUEST_SIZE = window.MAX_REQUEST_SIZE || 10485760;
window.MAX_AREA = window.MAX_AREA || 15000 * 15000;

// URLs for save and export
window.EXPORT_URL = window.EXPORT_URL || "/../export";
window.SAVE_URL = window.SAVE_URL || "/../save";
window.OPEN_URL = window.OPEN_URL || "/..";
window.RESOURCES_PATH = window.RESOURCES_PATH || "/../App_Base/Js/resources";
window.STENCIL_PATH = window.STENCIL_PATH || "/../App_Base/Js/MxGraph/stencils";
window.IMAGE_PATH = window.IMAGE_PATH || "/../App_Base/Js/MxGraph/src/images";
window.STYLE_PATH = window.STYLE_PATH || "";
window.CSS_PATH = window.CSS_PATH || "/../App_Base/Css";
// window.OPEN_FORM = window.OPEN_FORM || '/../App_Base/Js/MxGraph/stencils/open.html';

// Sets the base path, the UI language via URL param and configures the
// supported languages to avoid 404s. The loading of all core language
// resources is disabled as all required resources are in grapheditor.
// properties. Note that in this example the loading of two resource
// files (the special bundle and the default bundle) is disabled to
// save a GET request. This requires that all resources be present in
// each properties file since only one file is loaded.
window.mxBasePath = window.mxBasePath || "/../App_Base/Js/MxGraph/src";
window.mxLanguage = window.mxLanguage || urlParams["lang"];
window.mxLanguages = window.mxLanguages || ["fa"];
