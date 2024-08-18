function onOpen() {
  let prep = GSFileUploadPrep ();
  prep.onOpen ();
}

function onOpen_old () {
    // Logger.log ("onOpen 1");
  GSFileUpload.withUploadFolderID ("1V7UJvrcoF87ApQZzj95KdCUwwy3aAX60");
  // Logger.log ("onOpen 2");
  GSFileUpload.withCustomForm ("MyIndex");
  // Logger.log ("onOpen 3");
  GSFileUpload.onOpen ();
  // Logger.log ("onOpen 4");
}

// /* @Include JavaScript and CSS Files */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
