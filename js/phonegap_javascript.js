fs_path="";

// PhoneGap is ready
function onDeviceReady() {
    alert("Phonegap ready");
    gotFS();
    
    
    //$('.progress-bar').hide();
    //gotFSFirst();
}
/*
function gotFSFirst(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function onFileSystemSuccess(fileSystem) {
        fileSystem.root.getDirectory(
            "easyquran",
            {create: true, exclusive: false},
            function(dir){
                alert("Created dir " +dir.fullPath);
                download(dir.fullPath);
            },
            function(error){
                alert("Error creating directory "+error.code);
            }
        );
    }, gotFSFail);
}*/

function gotFS(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function onFileSystemSuccess(fileSystem) {
        fileSystem.root.getDirectory(
            "easyquran",
            {create: true, exclusive: false},
            function(dir){
                 //alert("Got dir " +dir.fullPath);
                 //audio_source=dir.fullPath + "/lesson"+lesson_no+".mp3";
                 fs_path=dir.fullPath;
            },
            function(error){
                alert("Error getting directory "+error.code);
            }
        );
    }, gotFSFail);
}

function gotFSFail() {
    alert("failed to get filesystem");
}

function downloadAudio(){
    $('.progress-bar').show();
    var lesson_audio = new Array("dua-foreverytime.mp3","dua-opening.mp3","end-dua.mp3",
    "lesson1.mp3","lesson2.mp3","lesson3.mp3","lesson4.mp3","lesson5.mp3","lesson6.mp3","lesson7.mp3","lesson8.mp3","lesson9.mp3",
    "lesson10.mp3","lesson11.mp3","lesson12.mp3","lesson13.mp3","lesson14.mp3","lesson15.mp3","lesson16.mp3","lesson17.mp3",
    "lesson4-spell.mp3","lesson5-spell.mp3","lesson6-spell.mp3","lesson7-spell.mp3","lesson8-spell.mp3","lesson9-spell.mp3",
    "lesson10-spell.mp3","lesson11-spell.mp3","lesson13-spell.mp3");
        
    var fileTransfer = new FileTransfer();
    var filePath="";
    var uri="";
    
    for(i=0;i<lesson_audio.length;i++){
        
        filePath = fs_path+"/"+lesson_audio[i];
        
        uri = encodeURI("http://bluyeti.com/EasyQuran/Audios/"+lesson_audio[i]);
                //var uri = encodeURI("http://bluyeti.com/EasyQuran/Lessons/Lesson_"+lessonno+".png");
                
                fileTransfer.download(
                    uri,
                    filePath,
                    function(entry) {
                       $("#progress-text").html($("#progress-text").html() + "download complete:" + entry.fullPath + "\n");
                    },
                    function(error) {
                        $("#progress-text").html($("#progress-text").html() + "download error:" + error.source + "\n")
                        //alert("download error:\nsource " + error.source + "\ntarget " + error.target + "\ncode " + error.code);
                    }
                );              
    }
    fileTransfer.onprogress = function(progressEvent) {
                    perc = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                    $('#progress-bar').val(perc); 
                    $('#progress-bar').slider('refresh');
                } 
}
/*
function download(){
    
    var lesson_audio = new Array("dua-foreverytime.mp3","dua-opening.mp3","end-dua.mp3",
    "lesson1.mp3","lesson2.mp3","lesson3.mp3","lesson4.mp3","lesson5.mp3","lesson6.mp3","lesson7.mp3","lesson8.mp3","lesson9.mp3",
    "lesson10.mp3","lesson11.mp3","lesson12.mp3","lesson13.mp3","lesson14.mp3","lesson15.mp3","lesson16.mp3","lesson17.mp3",
    "lesson4-spell.mp3","lesson5-spell.mp3","lesson6-spell.mp3","lesson7-spell.mp3","lesson8-spell.mp3","lesson9-spell.mp3",
    "lesson10-spell.mp3","lesson11-spell.mp3","lesson13-spell.mp3");
    var fileTransfer = new FileTransfer();
    for(i=0;i<lesson_audio.length;i++){
        
        var filePath = fs_path+"/"+lesson_audio[i];
        
        //check if if already exists
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            if(evt.target.result == null) { // file does not exists, so download it
                
                var uri = encodeURI("http://bluyeti.com/EasyQuran/Audios/"+lesson_audio[i]);
                //var uri = encodeURI("http://bluyeti.com/EasyQuran/Lessons/Lesson_"+lessonno+".png");

                fileTransfer.download(
                    uri,
                    filePath,
                    function(entry) {
                       $("#progress-text").html($("#progress-text").html() + "download complete:" + entry.fullPath + "\n");
                    },
                    function(error) {
                        $("#progress-text").html($("#progress-text").html() + "download error:" + error.source + "\n")
                        //alert("download error:\nsource " + error.source + "\ntarget " + error.target + "\ncode " + error.code);
                    }
                );
                   
            } 
            else {    // Otherwise the file exists
                $("#progress-text").html($("#progress-text").html() + "file already exists:" + lesson_audio[i] + "\n");
            }         
        };
        // We are going to check if the file exists
        reader.readAsDataURL(filePath); 
        
    }
    fileTransfer.onprogress = function(progressEvent) {
        perc = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
        $('#progress-bar').val(perc); 
        $('#progress-bar').slider('refresh');
    } 
}*/
        