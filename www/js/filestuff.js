document.addEventListener("deviceready", init, false);
document.getElementById("showFile").onclick = readBackFile;


// The directory to store data
//var store;
var dirEntry;

// Element used for status updates
var $status;

// Dumb scope!
// For updating a message string.
var msg;

// URL of our asset if doing file transfer
var assetURL = encodeURI("https://raw.githubusercontent.com/cfjedimaster/Cordova-Examples/master/readme.md");

// File name of our important data file we didn't ship with the app
var fileName = 'userdata.json';

function init() {
  console.log("In app.js...");
  $status = document.querySelector(".status");
  msg = 'Gonna request file system...';
  console.log(msg);
  $status.innerHTML = msg;
  requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFileSystem, fileSystemFail);
  
//  console.log(cordova.file);
  

//    $status.innerHTML = "Checking for data file.";

//    store = cordova.file.dataDirectory;
//    console.log('store+filename: ' + store + fileName);
    
    //Check for the file. 
//    window.resolveLocalFileSystemURL(store + fileName, appStart, downloadAsset);
    
    //resolveLocalFileSystemURL(fileName, appStart, downloadAsset);
  
}


function gotFileSystem(fileSystem) {
  msg = 'Got fileSystem';
  console.log(msg);
  $status.innerHTML = msg;

  dirEntry = fileSystem.root;
  
  dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
    console.log(fileEntry);
    msg = 'Got file pointer to ' + fileName;
    console.log(msg);
    $status.innerHTML = msg;
    
    msg = 'File size ' + fileEntry.file.length;
    console.log(msg);
    $status.innerHTML = msg;

    if (fileEntry.file.length > 1) {
      // Read the file.
      fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function(e) {
          var $dataOutput = document.querySelector(".dataOutput");
          $dataOutput.innerHTML = this.result;
        };
        reader.readAsText(file);
      },
      fileReadError);
    }
    else {
      createFile(fileEntry);
    }
  },
  function(error) {
    msg = 'Error getting pointer to file. Code: ' + error.code;
    console.log(msg);
    $status.innerHTML = msg;
  });
}

function fileReadError(err) {
  msg = 'Error reading file: ' + err.code;
  console.log(msg);
  $status.innerHTML = msg;
}

function createFile(fe) {
    fe.createWriter(function(writer){
      msg = 'Creating file: ' + fileName;
      console.log(msg);
      $status.innerHTML = msg;
      
      var jsonOut = JSON.stringify({"name": "Fred", "id": "0U812"});
      console.log(jsonOut);
      
      var $dataOutput = document.querySelector(".dataOutput");
      $dataOutput.innerHTML = 'Data written to new file: ' + jsonOut;
      
      var blob = new Blob([jsonOut], {type:'text/plain'});
      console.log('Blob: ');
      console.log(blob);
      writer.write(blob);

    }, function(error) {
        msg = "Error writing to file. Code: " + error.code;
        console.log(msg);
        $status.innerHTML = msg;
    });
}


function fileSystemFail(err) {
  msg = 'fileSystemFail::error: ' + err.code;
  console.log(msg);
  $status.innerHTML = msg;
}


// Quick and dirty function.
function readBackFile() {
  msg = 'Got file pointer to ' + fileName;
  console.log(msg);
  $status.innerHTML = msg;

  requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
  
    var newDirEntry = fs.root;
  
    newDirEntry.getFile(fileName, {create: false, exclusive: false}, function(fe) {
      console.log(fe);
      msg = 'Got file pointer to ' + fileName;
      console.log(msg);
      //$status.innerHTML = msg;
      
      msg = 'File size ' + fe.file.length;
      console.log(msg);
      //$status.innerHTML = msg;
  
      // Read the file.
      fe.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function(e) {
          var $dataOutput = document.querySelector(".dataOutput");
          $dataOutput.innerHTML = this.result;
          var newJSON = JSON.parse(this.result);
          console.log(newJSON);
        };
        reader.readAsText(file);
      },
      fileReadError);
    },
    function(err) {
      msg = 'Error getting pointer to file. Code: ' + err.code;
      console.log(msg);
      //$status.innerHTML = msg;
    })
  },
  function(err) {
    msg = 'Error getting pointer to file. Code: ' + err.code;
    console.log(msg);
    $status.innerHTML = msg;
  });
}


/*
function downloadAsset(err) {
  //console.log(cordova.file);

  console.log('in downloadAsset...');
  console.log('err: ' + err.code);
  //var putFile = store + fileName;
  var putFile = fileName;
  if (err.code === 1) { // File not found...
    console.log('File not found...downloading...');
    var fileTransfer = new window.FileTransfer();
    console.log('fileTransfer object created...');
    console.log("About to start transfer");
    // Replaced store + fileName below wtih putFile
    fileTransfer.download(assetURL, putFile.toURL(),
        function(entry) {
            console.log("Success!");
            appStart();
        }, 
        function(err) {
            console.log("Error");
            console.dir(err);
        }, true); // true == trustAllHosts - TODO: DO NOT USE IN PRODUCTION
  }
  else {
    console.log('downloadAsset::err.code: ' + err.code);
  }
}
*/
/* OLD version
function downloadAsset() {
    var fileTransfer = new FileTransfer();
    console.log("About to start transfer");
    fileTransfer.download(assetURL, store + fileName, 
        function(entry) {
            console.log("Success!");
            appStart();
        }, 
        function(err) {
            console.log("Error");
            console.dir(err);
        });
}
*/

//I'm only called when the file exists or has been downloaded.
/*
function appStart() {
    $status.innerHTML = "App ready!";
}
*/

/*
function onAppReady() {
  // Request file system
  requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

}
*/


/*
function myAppReady() {
  "use strict";
  console.log('document APP_READY was caught.')
}
document.addEventListener("APP_READY", myAppReady, false) ;
*/

/*
function myAppReadyWin() {
  "use strict";
  console.log('window APP_READY was caught.')
}
window.addEventListener("APP_READY", myAppReadyWin, false) ;
*/



