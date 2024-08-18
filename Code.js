function onOpen() {
  // Logger.log ("onOpen 1");
  GSFileUpload.withUploadFolderID ("1V7UJvrcoF87ApQZzj95KdCUwwy3aAX60");
  // Logger.log ("onOpen 2");
  GSFileUpload.withCustomForm ("MyIndex");
  // Logger.log ("onOpen 3");
  GSFileUpload.onOpen ();
  // Logger.log ("onOpen 4");
}

// function launchUploadPage() {
//   let scriptURL = "https://script.google.com/macros/s/AKfycbySRK7iaGhd0VCfjSPaVoiV8WXUixEI9ZYKFP1M7qRnM_yXFa6JK7LM_iml92t4RhBp/exec";
//   let ssheetid = encodeURI (SpreadsheetApp.getActive ().getId ());
//   let sheetname = encodeURI (SpreadsheetApp.getActiveSheet ().getName ());
//   let range = SpreadsheetApp.getActiveRange ();
//   if (range.getNumColumns()*range.getNumRows() != 1) {
//     SpreadsheetApp.getUi().alert ("You need to select only one blank cell");
//     return;
//   }
//   if (range.getValue () != "") {
//     SpreadsheetApp.getUi().alert ("The selected cell must be empty");
//     return;
//   }
//   let notation = encodeURI (range.getA1Notation ());
  
//   let html = '<html><body><script>';
//   html += `window.open ("${scriptURL}?ssheetid=${ssheetid}&sheetname=${sheetname}&range=${notation}", "_blank");`;
//   html += 'google.script.host.close();';
//   html += '</script></body></html>';
//   SpreadsheetApp.getUi ().showModelessDialog (HtmlService.createHtmlOutput (html).setHeight (1).setWidth (1), " ");
// }

// /**
//  * Upload files to Google Drive and save record to Google Sheet
//  * By www.bpwebs.com
//  * References: https://stackoverflow.com/a/26497772/2391195
//  *             https://developers.google.com/apps-script/guides/html/communication#index.html_4
//  */

// const folderID = "1U7_DaKddvEDlXfw1iSmke_7Y-v_c4nRQ";

// function doGet(e) {
//   Logger.log(JSON.stringify(e));

//   let template = HtmlService.createTemplateFromFile('Index');
//   template.params = e.parameter;
//   template.script = {
//     authToken: ScriptApp.getOAuthToken(),
//     scriptID: ScriptApp.getScriptId(),
//     serviceURL: ScriptApp.getService().getUrl()
//   };
//   template.session = {
//     activeUser: Session.getActiveUser().getEmail(),
//     locale: Session.getActiveUserLocale(),
//     effectiveUser: Session.getEffectiveUser().getEmail(),
//     timezone: Session.getScriptTimeZone()
//   }
//   return template.evaluate();
// }

// /* @Include JavaScript and CSS Files */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// function uploadFiles(formObject) {
//   Logger.log (JSON.stringify (formObject));

//   let ssheet = SpreadsheetApp.openById(formObject.ssheetid);
//   let sheet = ssheet.getSheetByName(formObject.sheetname);
//   let range = sheet.getRange(formObject.range);

//   var folder = DriveApp.getFolderById(folderID);
//   var fileUrl;

//   if (formObject.myFile.length > 0) {
//     var blob = formObject.myFile;
//     var file = folder.createFile(blob);
//     file.setDescription("Uploaded by " + Session.getEffectiveUser().getEmail());
//     fileUrl = file.getUrl();
//   } else {
//     fileUrl = "Record saved without a file";
//   }

//   let formula = `hyperlink("${fileUrl}", "${formObject.label}")`;
//   if (range != null) {
//     range.setFormula(formula);
//   }

//   return fileUrl;
// }