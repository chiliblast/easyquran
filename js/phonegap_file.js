fs_path="";
//fileTransfer = null;
// PhoneGap is ready
function onDeviceReady() {
    //alert("Phonegap ready");
    gotFS();
    setTimeout(function(){
        if(first_main==true){ // main page is opened for the first time
            first_main=false;
            loadMedia_dua('dua-for-everytime'); 
            my_media_dua.play();
        }
    },2000);
}

var first_main=true;
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
/*
audioFilesCount=0;
function downloadAudio(){
    //$('.progress-bar').show();
    $.mobile.loading( 'show', {
	text: 'Downloading Audio - Please wait...',
	textVisible: true,
	theme: 'a',
	html: ""
    });
        
    var lesson_audio = new Array("dua-for-everytime.mp3","dua-opening.mp3","end-dua.mp3",
    "lesson1.mp3","lesson2.mp3","lesson3.mp3","lesson4.mp3","lesson5.mp3","lesson6.mp3","lesson7.mp3","lesson8.mp3","lesson9.mp3",
    "lesson10.mp3","lesson11.mp3","lesson12.mp3","lesson13.mp3","lesson14.mp3","lesson15.mp3","lesson16.mp3","lesson17.mp3",
    "lesson4-spell.mp3","lesson5-spell.mp3","lesson6-spell.mp3","lesson7-spell.mp3","lesson8-spell.mp3","lesson9-spell.mp3",
    "lesson10-spell.mp3","lesson11-spell.mp3","lesson13-spell.mp3");
        
    fileTransfer = new FileTransfer();
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
                        audioFilesCount++;//alert(audioFilesCount)
                        if(audioFilesCount==lesson_audio.length) {
                            $.mobile.loading( 'hide' ); 
                            alert('Audio files downloaded successfully');
                        }
                       //$("#progress-text").html($("#progress-text").html() + "download complete:" + entry.fullPath + "\n");
                    },
                    function(error) {
                        //$("#progress-text").html($("#progress-text").html() + "download error:" + error.source + "\n")
                        //alert("download error:\nsource " + error.source + "\ntarget " + error.target + "\ncode " + error.code);
                    }
                );              
    }
    fileTransfer.onprogress = function(progressEvent) {
                    perc = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                    //$('#progress-bar').val(perc); 
                    //$('#progress-bar').slider('refresh');
                    //$("#progress-text").html(perc);
                    if(perc>=100){
                        $.mobile.loading( 'hide' );
                        showUsers();
                    }                      
                } 
}   */   