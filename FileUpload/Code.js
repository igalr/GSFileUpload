const GSFileUpload = {
  withUploadFolderID(folderid) {
    PropertiesService.getDocumentProperties().setProperty("GSFolderID", folderid);
    PropertiesService.getDocumentProperties().setProperty("GSFormFile", "FileUpload/Index");

    return this;
  },

  withCustomForm(filename) {
    PropertiesService.getDocumentProperties().setProperty("GSFormFile", filename);
    return this;
  },

  onOpen() {
    Logger.log("GSFileUpload.onOpen");
    SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('Upload')
      .addItem('Attach File', 'GSFileUpload.launchUploadPage')
      .addToUi();
  },

  launchUploadPageLocal() {
    let formFile = PropertiesService.getDocumentProperties().getProperty("GSFormFile");
    Logger.log("Loading form " + formFile);
    let template = HtmlService.createTemplateFromFile(formFile);
    template.params = {
      ssheetid: SpreadsheetApp.getActive().getId(),
      sheetname: SpreadsheetApp.getActiveSheet().getName(),
      range: SpreadsheetApp.getActiveRange().getA1Notation()
    };

    SpreadsheetApp.getUi ().showModalDialog (template.evaluate(), "Upload File");
  },

  launchUploadPage() {
    let scriptURL = "https://script.google.com/a/macros/redleafsolutions.ca/s/AKfycbzgc-qOKU1GZtdtG7eGPyet8WdJ7RkawI1CENF1g0LpEFkwn1G-WoTKcDTCQmquK71X/exec";
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
    Logger.log("GSFileUpload.uploadFiles " + JSON.stringify(formObject));

    let folderID = PropertiesService.getDocumentProperties().getProperty("GSFolderID");

    let ssheet = SpreadsheetApp.openById(formObject.ssheetid);
    let sheet = ssheet.getSheetByName(formObject.sheetname);
    let range = sheet.getRange(formObject.range);

    Logger.log("Upload folder " + folderID);
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

    Logger.log("The file URL " + fileUrl);
    return fileUrl;
  }
}

function doGet(e) {
  Logger.log(JSON.stringify(e.parameter));
  let formFile = PropertiesService.getDocumentProperties().getProperty("GSFormFile");
  Logger.log("Loading form " + formFile);
  let template = HtmlService.createTemplateFromFile(formFile);
  template.params = e.parameter;
  return template.evaluate();
}

function GSUploadFiles(formObject) {
  return GSFileUpload.uploadFiles(formObject);
}
