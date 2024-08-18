const GSFileUpload = {
  withUploadFolderID (folderid) {
    Logger.log ("withUploadFolderID " + folderid);
    PropertiesService.getDocumentProperties().setProperty ("GSFolderID", folderid);
    PropertiesService.getDocumentProperties().setProperty ("GSFormFile", "GSFileUploadIndex");
    return this;
  },

  withCustomForm (filename) {
    Logger.log ("withCustomForm " + filename);
    PropertiesService.getDocumentProperties().setProperty ("GSFormFile", filename);
    return this;
  },

  onOpen() {
    Logger.log ("GSFileUpload.onOpen");
    SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('Upload')
      .addItem('Attach File', 'GSFileUpload.launchUploadPage')
      .addToUi();
  },

  launchUploadPage() {
    Logger.log ("launchUploadPage " + JSON.stringify (this));
    Logger.log ("launchUploadPage 2 " + PropertiesService.getDocumentProperties().getProperty ("GSFolderID"));
    Logger.log ("launchUploadPage 3 " + PropertiesService.getDocumentProperties().getProperty ("GSFormFile"));
    let scriptURL = "https://script.google.com/macros/s/AKfycbySRK7iaGhd0VCfjSPaVoiV8WXUixEI9ZYKFP1M7qRnM_yXFa6JK7LM_iml92t4RhBp/exec";
    let ssheetid = encodeURI(SpreadsheetApp.getActive().getId());
    let sheetname = encodeURI(SpreadsheetApp.getActiveSheet().getName());
    let range = SpreadsheetApp.getActiveRange();
    if (range.getNumColumns() * range.getNumRows() != 1) {
      SpreadsheetApp.getUi().alert("You need to select only one blank cell");
      return;
    }
    if (range.getValue() != "") {
      SpreadsheetApp.getUi().alert("The selected cell must be empty");
      return;
    }
    let notation = encodeURI(range.getA1Notation());

    let html = '<html><body><script>';
    html += `window.open ("${scriptURL}?ssheetid=${ssheetid}&sheetname=${sheetname}&range=${notation}", "_blank");`;
    html += 'google.script.host.close();';
    html += '</script></body></html>';
    SpreadsheetApp.getUi().showModelessDialog(HtmlService.createHtmlOutput(html).setHeight(1).setWidth(1), " ");
  },

  uploadFiles(formObject) {
    Logger.log(JSON.stringify(formObject));

    let folderID = PropertiesService.getDocumentProperties().getProperty ("GSFolderID");

    let ssheet = SpreadsheetApp.openById(formObject.ssheetid);
    let sheet = ssheet.getSheetByName(formObject.sheetname);
    let range = sheet.getRange(formObject.range);

    var folder = DriveApp.getFolderById(folderID);
    var fileUrl;

    if (formObject.myFile.length > 0) {
      var blob = formObject.myFile;
      var file = folder.createFile(blob);
      file.setDescription("Uploaded by " + Session.getEffectiveUser().getEmail());
      fileUrl = file.getUrl();
    } else {
      fileUrl = "Record saved without a file";
    }

    let formula = `hyperlink("${fileUrl}", "${formObject.label}")`;
    if (range != null) {
      range.setFormula(formula);
    }

    return fileUrl;
  }
}

function doGet(e) {
  Logger.log(JSON.stringify(e));

  let formFile = PropertiesService.getDocumentProperties().getProperty ("GSFormFile");
  let template = HtmlService.createTemplateFromFile(formFile);
  template.params = e.parameter;
  template.script = {
    authToken: ScriptApp.getOAuthToken(),
    scriptID: ScriptApp.getScriptId(),
    serviceURL: ScriptApp.getService().getUrl()
  };
  template.session = {
    activeUser: Session.getActiveUser().getEmail(),
    locale: Session.getActiveUserLocale(),
    effectiveUser: Session.getEffectiveUser().getEmail(),
    timezone: Session.getScriptTimeZone()
  }
  return template.evaluate();
}

function GSUploadFiles (formObject) {
  return GSFileUpload.uploadFiles (formObject);
}
