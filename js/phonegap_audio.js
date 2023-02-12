// Audio player
        //
        var my_media = null;
        var my_media_dua = null;
        var my_media_makharij = null;
        var mediaTimer = null;
        
        function loadMedia(){
            if(my_media) my_media.release();
            // Create Media object from src audio_source
            if(recording_count==-1)
                my_media = new Media(getPhoneGapPath()+"Audio/lesson"+lesson_no+".aac", onSuccess, onError);
            else{
                my_media = new Media(fs_path+"/recording"+result_set_recordings.rows.item(recording_count)._id+".aac", onSuccess, onError);
                recordingCount=result_set_recordings.rows.item(recording_count).startWord;
            }
        }
        
        function loadMedia_dua(file){
            // Create Media object from src audio_source
            my_media_dua = new Media(getPhoneGapPath()+"Audio/"+file+".aac", onSuccess_dua, onError);
        }
        
        function loadMedia_makharij(){
            // Create Media object from src audio_source
            my_media_makharij = new Media(getPhoneGapPath()+"Audio/lesson1.aac", onSuccess_makharij, onError);
        }
        
        function playAudio_dua() {
            // Play audio
            my_media_dua.play();
            $(".audio-pause_dua").show();
            $(".audio-play_dua").hide();
        }
        
        function playAudio_makharij() {
            // Play audio
            my_media_makharij.play();
        }
    
        // Play recording
        //
        recordingCount=-1;
        function playRecording() {
            
            $(".audio-play").hide();
            $('.record-mic').hide();
            $('.record-stop').hide();
            $('.record-play').hide();
            
            // Play audio
            my_media.play();

            // Update my_media position every second
            if (mediaTimer == null) {
                mediaTimer = setInterval(function() {
                    // get my_media position
                    my_media.getCurrentPosition(
                        // success callback
                        function(position) {
                            if (position > -1) {
                                placeMarkerRecording(recordingCount++);
                            }
                        },
                        // error callback
                        function(e) {
                            console.log("Error getting pos=" + e);
                        }
                    );
                }, 1000);
            }
            $(".audio-pause").show();
            return true;
        }

        // Play audio
        //
        playingCount=-1;
        function playAudio() {
            if(_pauseAudio==true){
                pauseAudio();
                my_media.pause();
                return true;
            }
            else if(_stopAudio==true){
                stopAudio();
                return true;
            }
                
            if(playingCount==-1)
                duration=result_set.rows.item(0).starttime*1000; 
            else if(playingCount>=0 && playingCount<result_set.rows.length-1)
                duration=(result_set.rows.item(playingCount+1).starttime-result_set.rows.item(playingCount).starttime)*1000;
            else if(playingCount==result_set.rows.length-1)
                duration=-1;
            //console.log("playingCount = "+playingCount);
            if(duration!=-1){
                // Play audio
                //my_media.play();
                setTimeout(function(){
                    //my_media.pause();
                    playingCount++;
                    if(playingCount<result_set.rows.length){    //play next word
                        //setTimeout(function(){
                            placeMarker(playingCount);
                            //seekAudio(result_set.rows.item(playingCount).starttime*1000);
                            playAudio();
                        //},100);
                    }
                },duration);
            }
            
            else if(duration==-1){ //console.log("duration = -1");   //play last word
                //my_media.play();
            }
            
            // Update my_media position every milisecond
            /*if (mediaTimer == null) {
                mediaTimer = setInterval(function() {
                    // get my_media position
                    my_media.getCurrentPosition(
                        // success callback
                        function(position) {//console.log(position);
                            if (position >= 0) {
                                setAudioPosition(position);
                            }
                        },
                        // error callback
                        function(e) {
                            console.log("Error getting pos=" + e);
                            setAudioPosition("Error: " + e);
                        }
                    );
                }, 1);
            }*/
            
        }   
        
        // Play Bookmark
        function playBookmark(lessoninfo_id,Lesson,starttime){
            duration=-1;
            db.transaction (function (transaction){
                lessoninfo_id=lessoninfo_id+1;
                var sql =  "select starttime from lessoninfo where _id="+lessoninfo_id+" and Lesson="+Lesson;
                transaction.executeSql (sql, undefined, function (transaction, result){//alert(result.rows.length)//alert("Duration " + result.rows.item(0).starttime + " - " + starttime + " = " + duration);
                    if(result.rows.length==1)
                        duration=(result.rows.item(0).starttime-starttime)*1000;
                    else if(result.rows.length==0)
                        duration=-1;
                    my_mediaBookmark = new Media(getPhoneGapPath()+"Audio/lesson"+Lesson+".aac", onSuccessBookmark, onError);
                    // Play audio
                    my_mediaBookmark.play();
                    setTimeout(function(){
                        my_mediaBookmark.pause();
                        setTimeout(function(){
                            my_mediaBookmark.seekTo(starttime*1000);
                            my_mediaBookmark.play();
                            if(duration!=-1){
                                setTimeout(function(){
                                    my_mediaBookmark.stop();
                                },duration);
                            }
                        },5);
                    },5);
                }, playBookmarkError);
            });            
        }
        
        function playBookmarkError(transaction, err){
            console.log("DB error : " + err.message);
        }

        // Pause audio
        //
        _pauseAudio=false;
        function pauseAudio() {
            if (my_media) {
                _pauseAudio=true;
                $(".audio-pause").hide();
                //my_media.pause();
                $(".audio-play").show();
                //clearInterval(mediaTimer);
                //mediaTimer = null;
            }
        }
        
        function pauseAudio_dua() {
            if (my_media_dua) {
                my_media_dua.pause();
                $(".audio-play_dua").show();
                $(".audio-pause_dua").hide();
            }
        }
        
        function pauseAudio_makharij() {
            if (my_media_makharij) {
                my_media_makharij.pause();
            }
        }

        // Stop audio
        //
        _stopAudio=false;
        function stopAudio() {
            if (my_media) {
                _stopAudio=true;
                $(".audio-pause").hide();
                my_media.stop();
                $(".audio-play").show();
                $('.record-stop').hide();
                $('.record-play').hide();
                $('.record-stop').hide();
                $('.record-mic').show();
                $('.audio-position').html('');
                clearInterval(mediaTimer);
                mediaTimer = null;
                clearMarker();
                playingCount=-1;
                if(recording_count!=-1){
                    recordingCount=result_set_recordings.rows.item(recording_count).startWord;
                }
                if($('#manual').is(':checked') && recording==false){
                    $('.audio-play').hide();$('.audio-pause').hide();$('.audio-stop').hide(); 
                }
            }
        }
        
        function stopAudio_dua() {
            if (my_media_dua) {
                my_media_dua.stop();
            }
        }
        
        // onSuccessBookmark Callback
        //
        function onSuccessBookmark() {
            console.log("playAudio():Audio Success");
            my_mediaBookmark.stop();
            my_mediaBookmark.release(); 
        }

        // onSuccess Callback
        //
        function onSuccess() {
            console.log("playAudio():Audio Success");
            //playingCount=-1;
            stopAudio();
            if($('#repeat').is(':checked')){
                _pauseAudio=false;_stopAudio=false;
                my_media.play();
                playAudio();
            }    
        }
        
        // onSuccess Callback
        //
        function onSuccess_dua() {
            console.log("playAudio_dua():Audio Success");
            my_media_dua.stop();
            my_media_dua.release(); 
        }
        
        function onSuccess_makharij() {
            console.log("playAudio_makharij():Audio Success");
            my_media_makharij.stop();
            my_media_makharij.release(); 
        }

        // onError Callback
        //
        function onError(error){
            if(error.code!=0 && error.code!=1){
                alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
            }
            else if(error.code==1){
                alert('Audio file is not available!');
            }  
        }

        // Set audio position
        //
        /*function setAudioPosition(position){
            $('.audio-position').html(position);
        }*/
        
        function seekAudio(position){
            if (my_media) {
                my_media.seekTo(position);
            }
        }
        
        
        var my_mediaRec=null;
        var recInterval=null;
        // Record audio
        //
        function recordAudio(maxID){
            maxID++;
            my_mediaRec = new Media(fs_path+"/recording"+maxID+".aac", onSuccessRecord, onError);

            // Record audio
            my_mediaRec.startRecord();

            recInterval = setInterval(function() {
                endWord++;
                placeRecordMarker(endWord)
            }, 1000);

        }
        
        // Set record position
        //
        /*function setRecordPosition(position){
            $('.audio-position').html(position);
            //placeMarker(position)
        }*/
        
        function stopRecordAudio(){
            my_mediaRec.stopRecord();
            my_mediaRec.release();
            clearInterval(recInterval);
            my_mediaRec=null;
            addRecording();    
        }
        
        // onSuccess Callback
        //
        function onSuccessRecord() {
            console.log("recordAudio():Audio Success");
        }

