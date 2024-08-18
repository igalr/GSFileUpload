function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
  .createMenu('Upload')
  .addItem('Attach File', "launchUploadPage")
  .addToUi();
}

function launchUploadPage () {
  new GSFileUploadPrep ().launchUploadPage ();
}

// /* @Include JavaScript and CSS Files */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
