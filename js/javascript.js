function changePage(page,reverse){
    $.mobile.changePage( page, {
        transition: "slide",
        reverse: reverse,
        changeHash: true
    });	
}

var fs_path="";

//http://stackoverflow.com/questions/11175489/ios-phonegap-media-object-how-do-i-access-a-resource-in-the-www-folder
//get relative path
getPhoneGapPath = function () {
    'use strict';
    var path = window.location.pathname;
    var phoneGapPath = path.substring(0, path.lastIndexOf('/') + 1);
    return phoneGapPath;
}

function audio_play_click(){
    if(timer_count==3) counter=setInterval(timer, 1000); else return 0;
    //if(recording==false){ if(recording_count==-1){ $('.audio-play').hide(); $('#record-buttons').hide(); $('.audio-pause').show();_pauseAudio=false;_stopAudio=false; my_media.play();playAudio();} else playRecording();}
    if(recording==false){ 
        if(recording_count==-1){ 
            $('.audio-play').hide(); 
            $('#record-buttons').hide(); 
            $('.audio-pause').show();
            _pauseAudio=false;
            _stopAudio=false; 
            my_media.play();
            playAudio();
        } 
        else 
            playRecording();
    }
}

function audio_pause_click(){
    if(timer_count==3) counter=setInterval(timer, 1000); else return 0;
    pauseAudio();
}

var _orientation=null;
$( window ).on( "orientationchange", function( event ) {
      _orientation=event.orientation; //alert(_orientation)
      if(_orientation=='landscape'){
          $('#quran_image').css('width','60%')
          $('.text').css('width','30%')
          $('.text').css('top','20%')
      }
      else if(_orientation=='portrait'){
          $('#quran_image').css('width','100%')
          $('.text').css('width','90%')
          $('.text').css('bottom','25%')
      }
      $(".desc").css("height",$(".alphabets").height())
      $(".makharij_intro_text").css("height",$(window).height()-$(".makharij_intro_title").height()-$("._title").height()-$(".head").height()-50)
      $(".makharij_intro_text").niceScroll({touchbehavior:true});
      $("#dua_text").css("height",$(window).height()-$("#dua_title").height()-$("#dua_image").height()-$(".head").height()-50)
      $("#dua_text").niceScroll({touchbehavior:true});
      $(".articulation_detail_text").css("height",$(window).height()-$(".articulation_detail_image").height()-$(".articulation_detail_title").height()-$("._title").height()-$(".head").height()-100)
      $(".articulation_detail_text").niceScroll({touchbehavior:true});
});


function getURLParameter(name) {
    return decodeURIComponent(
        (location.search.match(RegExp("[?|&]" + name + '=(.+?)(&|$)')) || [, null])[1]
    );
}

var db = openDatabase ("easyquran", "1.0", "easyquran", 655350);
$(document).ready(function(){
    /*$( "#popupPanelLessons" ).on({
        popupbeforeposition: function() {
            var h = $( window ).height()-5;
            $( "#popupPanelLessons" ).css( "height", h );
        }
    });*/
 
    //getUsers();
 
    
    /*$("#create").bind ("click", function (event)
    {

      

    });*/
});
function getUsers(){//alert('1')
        db.transaction (function (transaction){
            var sql =  "select User,Icon from users";
            transaction.executeSql (sql, undefined, function (transaction, result){//alert ("success");
                var j=0;
                //show all users in main.html
                for(var i=0;i<result.rows.length;i++){
                    if(result.rows.item(i).User=="Guest")
                        $("#guest").html(result.rows.item(i).User+"<br><img width='46px' onclick='stopAudio_dua();changePage(&#39;lesson.html?user="+result.rows.item(i).User+"&#39;,false)' src='images/"+result.rows.item(i).Icon+"' />");
                    else
                        $("#user"+j++).html(result.rows.item(i).User+"<br><img width='46px' onclick='stopAudio_dua();changePage(&#39;lesson.html?user="+result.rows.item(i).User+"&#39;,false)' src='images/"+result.rows.item(i).Icon+"' />");
                }
                if(result.rows.length==4) //users table has 4 rows that are allowd maximum, disable create user button
                    $(".create").hide();
                //$.mobile.loading( 'hide' );
                document.addEventListener("deviceready", onDeviceReady, false);
            }, firstLoad); //error: as the app loads for very first time,db does not exit, so create it, and downlaod audio files
        });
}
    
function firstLoad(transaction, err) {//alert('2')
       
    /*setTimeout(function(){
      downloadAudio();  
    },2000);*/
    
       
    $.mobile.loading( 'show', {
	text: 'Deploying Database - Please wait...',
	textVisible: true,
	theme: 'a',
	html: ""
    });
    
        //populate database
      $.get('db/easyquran.sql', function(sql) {//alert(sql.split(";").length)
           var sql_array = new Array();
           sql_array = sql.split(";");
           db.transaction (function (transaction){
              for(i=0;i<=sql_array.length;i++){//alert(sql_array[i])
                transaction.executeSql (sql_array[i], undefined, function (){
                  
                }, showUsers);//last record is empty, so it gives error, and showUsers()is called to show users at main.html
              }
              //alert("Database successfully deployed");
            });
        }, 'text');
      //download();   //first time download
}

function showUsers(transaction, err){    
  getUsers();
  setTimeout(function(){
      $.mobile.loading( 'hide' );  
  },4000);
  
  //alert ("DB error : " + err.message);
  //return false;
}

var selectLoginIconCount=-1;
//selects 1 icon and deselects other 2 icons in login.html
function selectLoginIcon(id){
    for(i=1;i<4;i++){
        if(id=="LoginIcon"+i){
            $('#LoginIcon'+i).addClass('LoginIcon');
            selectLoginIconCount=i;
        }
        else
            $('#LoginIcon'+i).removeClass('LoginIcon');
    }
}

 //creates user in main.html
function createUser(){
    if(selectLoginIconCount==-1 && $('#user').val()=="")
        alert("Select an icon and Enter a username");
    else
        if(selectLoginIconCount!=-1 && $('#user').val()=="")
            alert("Enter a username");
        else
            if(selectLoginIconCount==-1 && $('#user').val()!="")
                alert("Select an icon");
            else
            if(selectLoginIconCount!=-1 && $('#user').val()!=""){  //icon is selected and user name is entered
                db.transaction (function (transaction){
                    var sql =  "insert into users (User, Icon) values ('"+$('#user').val()+"','LoginIcon"+selectLoginIconCount+".png')";
                    transaction.executeSql (sql, undefined, function (){
                        alert ("New user created");
                        changePage('main.html', true);
                    }, createUserError);
                });
            }
}
function createUserError(transaction, err){
    alert("DB error : " + err.message);
}

//Lesson page show----------------------------------------------
lesson_no=1;
$(document).on("pageshow", "#lesson", function () {
    $("#bookmars_button").html("<div class='ui-controlgroup-controls'><a href='bookmarks.html?user='"+$('#user_lesson').html()+" data-rel='dialog' data-role='button' data-corners='true' data-shadow='true' data-iconshadow='true' data-wrapperels='span' data-theme='c' class='ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-c'><span class='ui-btn-inner'><span class='ui-btn-text'>Show Bookmarks</span></span></a></div>");
    $("#auto").change(function () {
        $('.audio-play').show();$('.audio-pause').hide();$('.audio-stop').show(); 
    });
    $("#manual").change(function () {
        $('.audio-play').hide();$('.audio-pause').hide();$('.audio-stop').hide(); 
    });
    $("#repeat").change(function () {
        $('.audio-play').show();$('.audio-pause').hide();$('.audio-stop').show(); 
    });
    $("#bar #user_lesson").html(getURLParameter('user'));
    recording_count=-1;
    getLessons();
    getRecordings();
    loadLesson(1);
    $("#popupPanelLessons").niceScroll({touchbehavior:true});
    $("#popupPanelRecordings").niceScroll({touchbehavior:true});
 });
/* 		
$(document).bind('pagechange', function() {
    if($.mobile.activePage.attr('id')=='lesson'){
     
    }
});*/

//get all recordins of a user and populate list in lesson.html
recording_count=-1;
result_set_recordings=null;
function getRecordings(){
    var sql =  "select _id,lessoninfo_Lesson,startWord,endWord from recordings where users_id=(select _id from Users where User='"+$('#user_lesson').html()+"')";
    db.transaction (function (transaction){
        transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
            result_set_recordings = result;
            $("#recordings").html('');
            for(i=0;i<result.rows.length;i++){
                $("#recordings").html($("#recordings").html() + "<a onclick='loadRecording("+i+");' href='#' data-role='button' data-corners='true' data-shadow='true' data-iconshadow='true' data-wrapperels='span' data-theme='c' class='ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-c'><span class='ui-btn-inner'><span class='ui-btn-text'>"+i+": Recording Lesson "+result.rows.item(i).lessoninfo_Lesson+"</span></span></a>"); 
            }           
        });
    });
}
//load database for the recording
function loadRecording(i){
     recording_count=i;
     loadMedia();
     $(".audio-pause").hide();
     $('.record-mic').hide();
     stopAudio();
     clearMarker(); 
      
     $("#lessonno").html(recording_count+": Recording Lesson "+result_set_recordings.rows.item(recording_count).lessoninfo_Lesson);
     $("#lessonImage").attr("src","lessons/Lesson_"+result_set_recordings.rows.item(recording_count).lessoninfo_Lesson+".png");    
     //$('.audio-position').html("");

    var sql =  "select x1,y1,x2,y2 from lessoninfo where Lesson="+result_set_recordings.rows.item(recording_count).lessoninfo_Lesson;
    db.transaction (function (transaction){
        transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
            result_set = result;
            placeMarkerRecording(result_set_recordings.rows.item(recording_count).startWord)
            $(".audio-play").show();//alert(result_set.rows.item(0).starttime);
            if(recording==true){
                recording=false; 
                $('.record-stop').hide();
                $('.record-play').hide();
            }
        });
    });
    
 }

//get all lessons and populate list in lesson.html
function getLessons(){
    var sql =  "select distinct Lesson from lessoninfo";
    db.transaction (function (transaction){
        transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
            for(i=0;i<result.rows.length;i++){
                $("#lessons").html($("#lessons").html() + "<a onclick='recording_count="+-1+";loadLesson("+result.rows.item(i).Lesson+");' href='#' data-role='button' data-corners='true' data-shadow='true' data-iconshadow='true' data-wrapperels='span' data-theme='c' class='ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-c'><span class='ui-btn-inner'><span class='ui-btn-text'>Lesson "+result.rows.item(i).Lesson+"</span></span></a>"); 
            }           
        });
    });
}


result_set=null;
//load database for the lesson
 function loadLesson(lessonno){
     $.mobile.silentScroll(0);
     lesson_no = lessonno;
     loadMedia();
     $(".audio-pause").hide();
     $('.record-mic').show();
     stopAudio();
     clearMarker(); 
     playingCount=-1;
     
     if((lesson_no>=1 && lesson_no<=13) || lesson_no==17)
        $("#lessonno").html("<a href='#' onclick='changePage(&#39;lesson_detail.html?lesson="+lesson_no+"&user="+$('#user_lesson').html()+"&#39;, false)' data-role='button' data-mini='true' data-inline='true' data-corners='true' data-shadow='true' data-iconshadow='true' data-wrapperels='span' data-theme='c' class='ui-btn ui-shadow ui-btn-corner-all ui-mini ui-btn-inline ui-btn-up-c'><span class='ui-btn-inner'><span class='ui-btn-text'>Intro</span></span></a><span style='margin-left:40%'>Lesson "+lesson_no+"</span>");
     else
         $("#lessonno").html("<a href='#' style='visibility: hidden' data-role='button' data-mini='true' data-inline='true' data-corners='true' data-shadow='true' data-iconshadow='true' data-wrapperels='span' data-theme='c' class='ui-btn ui-shadow ui-btn-corner-all ui-mini ui-btn-inline ui-btn-up-c'><span class='ui-btn-inner'><span class='ui-btn-text'>Intro</span></span></a>Lesson "+lesson_no);
     $("#lessonImage").attr("src","lessons/Lesson_"+lesson_no+".png");    
     //$('.audio-position').html("");
     

    var sql =  "select Lesson,x1,y1,x2,y2,starttime from lessoninfo where Lesson="+lesson_no;
    db.transaction (function (transaction){
        transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
            result_set = result;
            markerCount=0;
            if($('#auto').is(':checked')){
                 $('.audio-play').show();$('.audio-pause').hide();$('.audio-stop').show(); 
            }
            else if($('#manual').is(':checked')){
                 $('.audio-play').hide();$('.audio-pause').hide();$('.audio-stop').hide(); 
            }
            else if($('#repeat').is(':checked')){
                 $('.audio-play').show();$('.audio-pause').hide();$('.audio-stop').show(); 
            }
            if(recording==true){
                recording=false; 
                $('.record-stop').hide();
                $('.record-play').hide();
                clearMarker();
            }
        });
    });
    
    
 }
 
        
lessonImageOriginalWidth = 956;
lessonImageOriginalHeight = null;
_x=null;
_y=null;        
 function setImageVariables(){
     lessonImageOriginalHeight = $("#lessonImage").height() / $("#lessonImage").width() * lessonImageOriginalWidth;
     _x = $("#lessonImage").width() / lessonImageOriginalWidth;
     _y = $("#lessonImage").height() / lessonImageOriginalHeight;
 }       
 
 markerCount=0;
 function placeMarker(count){
                markerCount=count;
                setImageVariables();
                $("#lesson #marker").css("left",result_set.rows.item(markerCount).x1*_x+"px"); 
                $("#lesson #marker").css("top",result_set.rows.item(markerCount).y1*_y+"px"); 
                $("#lesson #marker").css("width",(result_set.rows.item(markerCount).x2*_x)-(result_set.rows.item(markerCount).x1*_x)+"px"); //x22-x1
                $("#lesson #marker").css("height",(result_set.rows.item(markerCount).y2*_y)-(result_set.rows.item(markerCount).y1*_y)+"px");  //y2-y1  
                $("#bookmark-disabled").hide();
                $("#bookmark-enabled").show();
                
                currentYScrollPosition = $(document).scrollTop();
                bottomY = result_set.rows.item(markerCount).y2*_y;//alert(bottomY + "   "+ ($(window).height()-$('#footer').height()-$('#footer').height()+currentYScrollPosition))
                if(bottomY > ($(window).height()-$('#footer').height()-$('#footer').height()+currentYScrollPosition)){
                    amountToScroll = bottomY - ($(window).height()-$('#footer').height()+currentYScrollPosition);
                    $.mobile.silentScroll(currentYScrollPosition+amountToScroll+$('#footer').height()+$('#footer').height())
                }
 }
 function placeMarkerRecording(count){
                if(count>result_set_recordings.rows.item(recording_count).endWord){ 
                    stopAudio();
                    return true;
                }
                else{
                    setImageVariables();
                    $("#lesson #marker").css("left",result_set.rows.item(count).x1*_x+"px"); 
                    $("#lesson #marker").css("top",result_set.rows.item(count).y1*_y+"px"); 
                    $("#lesson #marker").css("width",(result_set.rows.item(count).x2*_x)-(result_set.rows.item(count).x1*_x)+"px"); //x22-x1
                    $("#lesson #marker").css("height",(result_set.rows.item(count).y2*_y)-(result_set.rows.item(count).y1*_y)+"px");  //y2-y1  
                }
                
 }
 function clearMarker(){
     //clear marker
     $("#lesson #marker").css("left",0+"px"); 
     $("#lesson #marker").css("top",0+"px"); 
     $("#lesson #marker").css("width",0+"px"); 
     $("#lesson #marker").css("height",0+"px"); 
     $("#bookmark-enabled").hide();
     $("#bookmark-disabled").show();
     markerCount=0;
 }

$(document).on("pageshow", "#main", function () {
    $( window ).orientationchange();
    getUsers();    
});

var timer_count=3;
var counter=null;
function timer(){
  timer_count=timer_count-1;
  if (timer_count <= 0)
  {
     clearInterval(counter);
     timer_count=3;
     //counter ended, do something here
     return;
  }
}

$(document).on( "vclick", "#lessonImage", function(e) {
    //alert(timer_count)
    if(timer_count==3)
        counter=setInterval(timer, 1000);
    else
        return 0;
    //alert(e.pageX + " " + e.pageY)
     // audio is already being played and mode is set to auto or repeat
    if(($('#auto').is(':checked') || $('#repeat').is(':checked')) && $('.audio-play').is(':hidden') && recording==false){
        //stopAudio(); 
  
        if (my_media) {
            my_media.stop();
            _stopAudio=true;
            //clearInterval(mediaTimer);
            //mediaTimer = null;
            //playingCount=-1;
        }

        setTimeout(function(){
            
            offsetX = (document.body.clientWidth - $("#lessonImage").width()) / 2;    // X offset of image
            offsetY = 131;    // Y offset of image
            tapX = e.pageX - offsetX;
            tapY = e.pageY - offsetY;
            setImageVariables();
            audioPosition = null;
            for(i=0;i<result_set.rows.length;i++){//alert(result_set.rows.item(i).starttime.toFixed(1)=='10.2')
                if( (tapX > (result_set.rows.item(i).x1*_x)) && (tapX < (result_set.rows.item(i).x2*_x)) && (tapY > (result_set.rows.item(i).y1*_y)) && (tapY < (result_set.rows.item(i).y2*_y)) ){   
                    $("#lesson #marker").css("left",result_set.rows.item(i).x1*_x+"px"); 
                    $("#lesson #marker").css("top",result_set.rows.item(i).y1*_y+"px"); 
                    $("#lesson #marker").css("width",(result_set.rows.item(i).x2*_x)-(result_set.rows.item(i).x1*_x)+"px"); //x22-x1
                    $("#lesson #marker").css("height",(result_set.rows.item(i).y2*_y)-(result_set.rows.item(i).y1*_y)+"px");  //y2-y1
                    
                    audioPosition = result_set.rows.item(i).starttime;
                    $("#bookmark-disabled").hide();
                    $("#bookmark-enabled").show();
    
                    break;
                }
            }
            
            $('.audio-play').hide();$('.record-mic').hide();$('.audio-pause').show();
            my_media.play();
            _pauseAudio=true;_stopAudio=false;
            playingCount=i;
            seekAudio(audioPosition*1000); 
            _pauseAudio=false;
            my_media.play();
            playAudio();
        },2000);
        
    }
    
    // audio is not already being played and mode is set to auto or repeat
    else if(($('#auto').is(':checked') || $('#repeat').is(':checked')) && $('.audio-play').is(':visible') && recording==false){ 

            offsetX = (document.body.clientWidth - $("#lessonImage").width()) / 2;    // X offset of image
            offsetY = 131;    // Y offset of image
            tapX = e.pageX - offsetX;
            tapY = e.pageY - offsetY;
            setImageVariables();
            audioPosition = null;
            for(i=0;i<result_set.rows.length;i++){//alert(result_set.rows.item(i).starttime.toFixed(1)=='10.2')
                if( (tapX > (result_set.rows.item(i).x1*_x)) && (tapX < (result_set.rows.item(i).x2*_x)) && (tapY > (result_set.rows.item(i).y1*_y)) && (tapY < (result_set.rows.item(i).y2*_y)) ){   
                    $("#lesson #marker").css("left",result_set.rows.item(i).x1*_x+"px"); 
                    $("#lesson #marker").css("top",result_set.rows.item(i).y1*_y+"px"); 
                    $("#lesson #marker").css("width",(result_set.rows.item(i).x2*_x)-(result_set.rows.item(i).x1*_x)+"px"); //x22-x1
                    $("#lesson #marker").css("height",(result_set.rows.item(i).y2*_y)-(result_set.rows.item(i).y1*_y)+"px");  //y2-y1
                    
                    audioPosition = result_set.rows.item(i).starttime;
                    $("#bookmark-disabled").hide();
                    $("#bookmark-enabled").show();
                    
                    break;
                }
            }
            /*currentYScrollPosition = $(document).scrollTop();
                bottomY = result_set.rows.item(i).y2*_y;//alert(bottomY + "   "+ ($(window).height()-$('#footer').height()-$('#footer').height()+currentYScrollPosition))
                if(bottomY > ($(window).height()-$('#footer').height()-$('#footer').height()+currentYScrollPosition)){
                    amountToScroll = bottomY - ($(window).height()-$('#footer').height()+currentYScrollPosition);
                    $.mobile.silentScroll(currentYScrollPosition+amountToScroll+$('#footer').height()+$('#footer').height())
                }*/
                
        $('.audio-play').hide();$('.record-mic').hide();$('.audio-pause').show();
        my_media.stop();
        my_media.play();
        setTimeout(function(){
            my_media.pause();
            setTimeout(function(){
                playingCount=i;
                seekAudio(audioPosition*1000);
                _pauseAudio=false;_stopAudio=false;
                my_media.play();
                playAudio();
            },5);
            
        },5);
        
        
    }
    
    // audio is not already being played and mode is set to manual
    else if($('#manual').is(':checked') && recording==false){
        
            offsetX = (document.body.clientWidth - $("#lessonImage").width()) / 2;    // X offset of image
            offsetY = 131;    // Y offset of image
            tapX = e.pageX - offsetX;
            tapY = e.pageY - offsetY;
            setImageVariables();
            audioPosition = null;
            for(i=0;i<result_set.rows.length;i++){//alert(result_set.rows.item(i).starttime.toFixed(1)=='10.2')
                if( (tapX > (result_set.rows.item(i).x1*_x)) && (tapX < (result_set.rows.item(i).x2*_x)) && (tapY > (result_set.rows.item(i).y1*_y)) && (tapY < (result_set.rows.item(i).y2*_y)) ){   
                    $("#lesson #marker").css("left",result_set.rows.item(i).x1*_x+"px"); 
                    $("#lesson #marker").css("top",result_set.rows.item(i).y1*_y+"px"); 
                    $("#lesson #marker").css("width",(result_set.rows.item(i).x2*_x)-(result_set.rows.item(i).x1*_x)+"px"); //x22-x1
                    $("#lesson #marker").css("height",(result_set.rows.item(i).y2*_y)-(result_set.rows.item(i).y1*_y)+"px");  //y2-y1
                    
                    audioPosition = result_set.rows.item(i).starttime;
                    $("#bookmark-disabled").hide();
                    $("#bookmark-enabled").show();
                    
                    break;
                }
            }
        
        playingCount=i;
        if(playingCount>=0 && playingCount<result_set.rows.length-1)
           duration=(result_set.rows.item(playingCount+1).starttime-result_set.rows.item(playingCount).starttime)*1000;
        else if(playingCount==result_set.rows.length-1)
           duration=-1;
        my_media.play();
        setTimeout(function(){
            seekAudio(audioPosition*1000);
            if(duration!=-1){
                setTimeout(function(){
                    my_media.stop();
                },duration);
            }
        },5);
        
    }
    
    //recording is true
    else if(recording==true){
            
            var offsetX = (document.width - $("#lessonImage").width()) / 2;    // X offset of image
            var offsetY = 131;    // Y offset of image
            var tapX = e.pageX - offsetX;
            var tapY = e.pageY - offsetY;
            setImageVariables();
            var audioPosition = null;
            for(i=0;i<result_set.rows.length;i++){//alert(result_set.rows.item(i).starttime.toFixed(1)=='10.2')
                if( (tapX > (result_set.rows.item(i).x1*_x)) && (tapX < (result_set.rows.item(i).x2*_x)) && (tapY > (result_set.rows.item(i).y1*_y)) && (tapY < (result_set.rows.item(i).y2*_y)) ){   
                    $("#lesson #marker").css("left",result_set.rows.item(i).x1*_x+"px"); 
                    $("#lesson #marker").css("top",result_set.rows.item(i).y1*_y+"px"); 
                    $("#lesson #marker").css("width",(result_set.rows.item(i).x2*_x)-(result_set.rows.item(i).x1*_x)+"px"); //x22-x1
                    $("#lesson #marker").css("height",(result_set.rows.item(i).y2*_y)-(result_set.rows.item(i).y1*_y)+"px");  //y2-y1
                    
                    startWord = i;
                    $("#bookmark-disabled").hide();
                    $("#bookmark-enabled").show();
                    
                    break;
                }
            }
            
    }
    
});

recording=false;
startWord=-1;
endWord=-1;
function record_mic(){
    if(timer_count==3) counter=setInterval(timer, 1000); else return 0;
    if(recording==false){
        recording=true;
        $('.record-stop').show();
        startWord = 0;
        placeRecordMarker(0);
    }
    else{
        recording=false; 
        $('.record-stop').hide();
        $('.record-play').hide();
        clearMarker();
    }
} 
function record_play(){
    if(timer_count==3) counter=setInterval(timer, 1000); else return 0;
    if(recording==true){
        $('.record-play').show();
        $('.record-stop').hide();
        endWord=startWord;
        var sql =  "select max(_id) as maxID from recordings";
        db.transaction (function (transaction){
            transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
                recordAudio(result.rows.item(0).maxID);
            });
        });
    }
} 
function record_stop(){
    if(timer_count==3) counter=setInterval(timer, 1000); else return 0;
    if(recording==true){
        $('.record-stop').show();
        $('.record-play').hide();
        stopRecordAudio();
    }
} 

//add recording in database
function addRecording(){
      
    var sql =  "insert into recordings(users_id,lessoninfo_Lesson,startWord,endWord) values((select _id from Users where User='"+$('#user_lesson').html()+"'),"+lesson_no+","+startWord+","+endWord+")";
    db.transaction (function (transaction){
        transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
            console.log("addRecording():Audio Recording Success");
            startWord=endWord; 
            getRecordings();
        },addRecording_error);
    });
}
function addRecording_error(transaction, err){
    console.log("DB error : " + err.message);
}

function placeRecordMarker(count){
    setImageVariables();
    if(count<result_set.rows.length){
        $("#lesson #marker").css("left",result_set.rows.item(count).x1*_x+"px"); 
        $("#lesson #marker").css("top",result_set.rows.item(count).y1*_y+"px"); 
        $("#lesson #marker").css("width",(result_set.rows.item(count).x2*_x)-(result_set.rows.item(count).x1*_x)+"px"); //x22-x1
        $("#lesson #marker").css("height",(result_set.rows.item(count).y2*_y)-(result_set.rows.item(count).y1*_y)+"px");  //y2-y1
    }
    else{
        record_stop();
    }
}

function addBookmark(){
    var sql =  "insert into bookmarks(users_id,lessoninfo_id) select (select _id from Users where User='"+$('#user_lesson').html()+"'),(select _id from lessoninfo where Lesson="+lesson_no+" and cast(starttime as int)="+Math.floor(result_set.rows.item(markerCount-1).starttime)+") where not exists (select 1 from bookmarks where users_id=(select _id from Users where User='"+$('#user_lesson').html()+"') and lessoninfo_id=(select _id from lessoninfo where Lesson="+lesson_no+" and cast(starttime as int)="+Math.floor(result_set.rows.item(markerCount-1).starttime)+"))";
    db.transaction (function (transaction){
        transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
            console.log("addBookmark():Adding Bookmark Success");
        },addBookmark_error);
    });
}
function addBookmark_error(transaction, err){
    console.log("DB error : " + err.message);
}

function deleteBookmark(id){
    var sql =  "delete from bookmarks where _id="+id;
    db.transaction (function (transaction){
        transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
            getBookmarks();
            console.log("deleteBookmark():Deleting Bookmark Success");
        },deleteBookmark_error);
    });
}
function deleteBookmark_error(transaction, err){
    console.log("DB error : " + err.message);
}
function getBookmarks(){
    var sql =  "select bookmarks._id,lessoninfo_id,Lesson,x1,y1,x2,y2,starttime from lessoninfo,bookmarks where bookmarks.lessoninfo_id=lessoninfo._id and bookmarks.users_id=(select _id from Users where User='"+getURLParameter('user')+"')";
    db.transaction (function (transaction){
        transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
            $("#bookmark").html('');
            for(i=0;i<result.rows.length;i++){
                width=result.rows.item(i).x2-result.rows.item(i).x1+'px';
                height=result.rows.item(i).y2-result.rows.item(i).y1+'px';
                $("#bookmark").html($("#bookmark").html() + 
                    "<li style='height:"+height+"' class='ui-li ui-li-static ui-btn-up-c ui-li-has-thumb ui-first-child ui-last-child'>\n\
                     <p class='ui-li-aside ui-li-desc'><img onclick='deleteBookmark("+result.rows.item(i)._id+")' src='images/delete.png'></p>\n\
                     <div style='background:url(lessons/Lesson_"+result.rows.item(i).Lesson+".png);background-position:-"+result.rows.item(i).x1+"px -"+result.rows.item(i).y1+"px;width:"+width+";height:"+height+"' onclick='playBookmark("+result.rows.item(i).lessoninfo_id+","+result.rows.item(i).Lesson+","+result.rows.item(i).starttime+")' class='ui-li-img'></div>\n\
                     <h3 class='ui-li-heading'>Lesson "+result.rows.item(i).Lesson+"</h3><h3 class='ui-li-heading'>Word Starts at "+result.rows.item(i).starttime+" sec</h3></li>"); 
            } 
        },getBookmarks_error);
    });
}
/*
function getBookmarks(){
    var sql =  "select bookmarks._id,lessoninfo_id,Lesson,x1,y1,x2,y2,starttime from lessoninfo,bookmarks where bookmarks.lessoninfo_id=lessoninfo._id and bookmarks.users_id=(select _id from Users where User='"+getURLParameter('user')+"')";
    db.transaction (function (transaction){
        transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
            $("#bookmark").html('');
            for(i=0;i<result.rows.length;i++){
                $("#bookmark").html($("#bookmark").html() + 
                    "<li class='ui-li ui-li-static ui-btn-up-c ui-li-has-thumb ui-first-child ui-last-child'>\n\
                     <p class='ui-li-aside ui-li-desc'><img onclick='deleteBookmark("+result.rows.item(i)._id+")' src='images/delete.png'></p>\n\
                     <img onclick='playBookmark("+result.rows.item(i).lessoninfo_id+","+result.rows.item(i).Lesson+","+result.rows.item(i).starttime+")' src='lessons/Lesson_"+result.rows.item(i).Lesson+".png' class='ui-li-thumb'>\n\
                     <h3 class='ui-li-heading'>Lesson "+result.rows.item(i).Lesson+"</h3><h3 class='ui-li-heading'>Word Starts at "+result.rows.item(i).starttime+" sec</h3></li>"); 
            } 
        },getBookmarks_error);
    });
}*/
function getBookmarks_error(transaction, err){
    console.log("DB error : " + err.message);
}

$(document).on("pageshow", "#bookmarks", function () {
    getBookmarks();
});

$(document).on("pageshow", "#dua", function () {
    windowHeight = $(window).height();
    $('#dua_image').css('height',windowHeight/2);
    $('#dua_title').css('margin-top',(windowHeight/2)-50);
    $("#dua_text").css("height",$(window).height()-$("#dua_title").height()-$("#dua_image").height()-$(".head").height()-50)
    $("#dua_text").niceScroll({touchbehavior:true});
    if(getURLParameter('dua')==0){
        $("h1").html('Opening Dua');
        $("#dua_title").html('DUA/SUPPLICATION');
        $("#dua_text").html('<p>I seek refuge with All from the Shaitan, the Rejected</p><p>In the name of Allah, the All Merciful, the Mercy-Giving.</p><p>O Allah, peace be upon Prophet Muhammad, eternal peace till the Day of Judgment.</p><p>All praise and thanks is due to Allah, praise that is pure and blessed, filling the heavens and the earth and more and beyond; filling whatever He wills.</p><p>O My Lord, open up my chest (with understanding and guidance), and make my task easier for me.  And loosen up the knot from my tongue (make the words flow clear and smooth from my tongue), so that they will understand my speech.</p><p>O Allah, bring light (guidance) to my heart, light to my chest, light to my hearing, light to my eyesight, light to my tongue, and light within me.  O Lord of the worlds.</p><p>O Allah, we ask the best of the deeds, the best within them.  We seek your refuge from the worst of deeds, and the worst within them.</p><p>O Allah, peace and blessing be upon Prophet Muhammad, his family, and his companions.</p>');
        loadMedia_dua('dua-opening'); 
    }
    else if(getURLParameter('dua')==1){
        $("h1").html('Closing Dua'); 
        $("#dua_title").html('DUA/SUPPLICATION');
        $("#dua_text").html('<p>O Allah, peace be upon Prophet Muhammad, eternal and complete peace till the Day of Judgment.<p></p>All praise and thanks is due to Allah, All praise and thanks is due to Allah. All praise and thanks is due to Allah, with whose blessing the best of deeds can be completed.<p></p>To Allah belongs the most true and just words. To Allah belongs the most true and just words. Truthful is the Almighty Lord. <p></p>All praise and thanks is due to Allah, the praise and thanks of the most grateful.<p></p>We seek repentance from our Lord from all our mistakes. O Lord, complete our light (guidance) and accept our repentance. Indeed You are the All Merciful, the Mercy-Giving.<p></p>O Lord, give us blessing in this world, and blessing in the hereafter.Protect us from the suffering of Hellfire, and make us enter Paradise with those who do the best of deeds.<p></p>Glorified is the Supreme Lord, the most powerful; the Lord that is high above what some ascribe to. And peace upon all prophets, and thanks to the Lord of the Worlds.<p></p>O Lord, peace and blessing be upon Prophet Muhammad, and all his family, and his companions.</p>');
        loadMedia_dua('end-dua');        
    }
    
    playAudio_dua();
});


result_makharij=null;        
$(document).on("pageshow", "#makharij", function () {
    
    $(".desc").css("height",$(".alphabets").height())
    
    var sql =  "select starttime from lessoninfo where Lesson=1";
    db.transaction (function (transaction){
        transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
           result_makharij=result;
           loadMedia_makharij();
        });
    });
    
    $('.alphabets div').click(function(){
        //hide marker
        for(i=1;i<=29;i++)
            $('#alphabet_'+i).removeClass('marker');
        //show marker
        $('#'+this.id).addClass('marker');
        var file=this.id.substr(this.id.indexOf('_')+1);
        var image=null;
        var word=null;
        var desc=null;
        if(file=='1'){
            image='<img src="images/makharij/a.png">';
            word='Alif';
            desc='The Alif is madd letetr and originates from the empty space in the mouth and the throat. This letter doesn’t have a specific space where it finishis at life the other letters, instead it finishes with stopping of the sound.';
        }     
        else if(file=='2'){
            image='<img src="images/makharij/w.png">';
            word='Baa';
            desc='This is articulated by bringing the 2 lips together.';
        }     
        else if(file=='3'){
            image='<img src="images/makharij/o.png">';
            word='Taa';
            desc='The articulation point of the TAA is the top part of the tip of the tongue and the root of the upper incisor teeth.';
        }     
        else if(file=='4'){
            image='<img src="images/makharij/s.png">';
            word='Thaa';
            desc='This is pronounced from the tip of the tongue and the edge of the upper incisors. The tip of the tongue should protrude slightly to be visible from the outside. A common mistake is that the tongue is not protruded and doesn’t touch the incisors and kept inside the mouth below the top gumline which makes it sound like SAA.';
        }     
        else if(file=='5'){
            image='<img src="images/makharij/f.png">';
            word='Jeem';
            desc='The Jeem is articulated from the middle of the tongue and the roof of the mouth.';
        }     
        else if(file=='6'){
            image='<img src="images/makharij/b.png">';
            word='Haa';
            desc='This is pronounced from the middle of the throat.';
        }     
        else if(file=='7'){
            image='<img src="images/makharij/c.png">';
            word='Khaa';
            desc='This is pronounced from the highest part of the throat.';
        }     
        else if(file=='8'){
            image='<img src="images/makharij/o.png">';
            word='Daal';
            desc='The articulation point of the DAAL is the top part of the tip of the tongue and the root of the upper incisor teeth.';
        }     
        else if(file=='9'){
            image='<img src="images/makharij/s.png">';
            word='Thaal';
            desc='This is pronounced from the tip of the tongue and the edge of the upper incisors. The tip of the tongue should protrude slightly to be visible from the outside.';
        }     
        else if(file=='10'){
            image='<img src="images/makharij/l.png">';
            word='Raa';
            desc='The articulation for this letter is the top of the tip of the tongue and the opposite gum of the two top incisor teeth. This is pronounced from just inside the articulation point of the Noon letter.'
        }     
        else if(file=='11'){
            image='<img src="images/makharij/q.png">';
            word='Zaa';
            desc='This is articulated from between the tip of the tongue and between the upper incisors and slightly above the lower incisors. A small gap is left between the tongue and the incisors when pronouncing it. When pronouncing this letter, the air is exhaled softly. This exhalation should be continued otherwise the pronunciation will not be correct.';
        }     
        else if(file=='12'){
            image='<img src="images/makharij/q.png">';
            word='Seen';
            desc='This is articulated from between the tip of the tongue and between the upper incisors and slightly above the lower incisors. A small gap is left between the tongue and the incisors when pronouncing it. When pronouncing this letter, the air is exhaled softly. This exhalation should be continued otherwise the pronunciation will not be correct.';
        }     
        else if(file=='13'){
            image='<img src="images/makharij/g.png">';
            word='Sheen';
            desc='This is articulated from the middle of the tongue and the roof of the mouth.';
        }     
        else if(file=='14'){
            image='<img src="images/makharij/p.png">';
            word='Saad';
            desc='This is articulated from between the tip of the tongue and between the upper incisors and slightly above the lower incisors. A small gap is left between the tongue and the incisors when pronouncing it. When pronouncing this letter, the air is exhaled softly. This exhalation should be continued otherwise the pronunciation will not be correct. A common problem is that people often round their lips when pronouncing this sound. The lower jaw should be dropped and the mouth should be wide open when pronouncing it.';
        }     
        else if(file=='15'){
            image='<img src="images/makharij/i.png">';
            word='Daad';
            desc='This is articulated from the left or right of the tongue and what lies opposite it on the above molar teeth. It has been reported that Omar (RA) could pronounce it from either side. This is one of the most difficult sounds to pronounce. A common problem is that people often round their lips when pronouncing this sound. The lower jaw should be dropped and the mouth should be wide open when pronouncing it.';
        }     
        else if(file=='16'){
            image='<img src="images/makharij/n.png">';
            word='Taa';
            desc='The articulation point is the top part of the tip of the tongue and the root of the upper incisor teeth.';
        }     
        else if(file=='17'){
            image='<img src="images/makharij/r.png">';
            word='Thaa';
            desc='This is pronounced from the tip of the tongue and the edge of the upper incisors. The tip of the tongue should protrude slightly to be visible from the outside. A common problem is that people often round their lips when pronouncing this sound. The lower jaw should be dropped and the mouth should be wide open when pronouncing it.';
        }     
        else if(file=='18'){
            image='<img src="images/makharij/b.png">';
            word='Ayn';
            desc='This is pronounced from the middle of the throat';
        }     
        else if(file=='19'){
            image='<img src="images/makharij/c.png">';
            word='Ghayn';
            desc='This is pronounced from the highest part of the throat';
        }     
        else if(file=='20'){
            image='<img src="images/makharij/t.png">';
            word='Faa';
            desc='This is articulated from the inside of the lower lip and the lower edge of two top incisors.';
        }     
        else if(file=='21'){
            image='<img src="images/makharij/d.png">';
            word='Qaaf';
            desc='This is from the deepest part of the tongue to what is opposite it on the soft palette.';
        }     
        else if(file=='22'){
            image='<img src="images/makharij/e.png">';
            word='Kaaf';
            desc='From the articulation point of the QAF a little more towards the front of the tongue.';
        }     
        else if(file=='23'){
            image='<img src="images/makharij/j.png">';
            word='Laam';
            desc='This is pronounced from the tip of the tongue and the gum of the upper incisor teeth';
        }     
        else if(file=='24'){
            image='<img src="images/makharij/v.png">';
            word='Meem';
            desc='This is articulated by bringing the 2 lips together.';
        }     
        else if(file=='25'){
            image='<img src="images/makharij/k.png">';
            word='Nuun';
            desc='It is articulated from the tip of the tongue to what lies opposite it of the gums of the upper incisor teeth. This is slightly below the articulation point of the LAAM.';
        }     
        else if(file=='26'){
            image='<img src="images/makharij/u.png">';
            word='Waaw';
            desc='When pronouncing this letter the two lips come together and protrude forward slightly.';
        }     
        else if(file=='27'){
            image='<img src="images/makharij/a.png">';
            word='Haa';
            desc='The Haa is pronounced from the back (deepest part) of the throat. The sound emanates from the inside and moves towards the front of the mouth.';
        }     
        else if(file=='28'){
            image='<img src="images/makharij/a.png">';
            word='Hamza';
            desc='The Hamza is pronounced from the back (deepest part) of the throat. The sound emanates from the inside and moves towards the front of the mouth.';
        }     
        else if(file=='29'){
            image='<img src="images/makharij/w.png">';
            word='Yaa';
            desc='This is articulated from the middle of the tongue and the roof of the mouth.';
            
        }      
        
        $('.image').html(image);
        $('.word').html("<img src='images/alphabets/"+file+".png'><span>"+word+"</span>");
        $('.desc ._text').html(desc);

        audioPosition = result_makharij.rows.item(parseInt(file-1)).starttime;
        duration=(result_makharij.rows.item(parseInt(file)).starttime-result_makharij.rows.item(parseInt(file-1)).starttime)*1000;

        playAudio_makharij();
        setTimeout(function(){
            my_media_makharij.seekTo(audioPosition*1000);
            setTimeout(function(){
                pauseAudio_makharij();
            },duration);
        },5);

    });
});

$(document).on("pageshow", "#makharij_intro", function () {
    $(".makharij_intro_text").css("height",$(window).height()-$(".makharij_intro_title").height()-$("._title").height()-$(".head").height()-50)
    $(".makharij_intro_text").niceScroll({touchbehavior:true});
});

$(document).on("pageshow", "#articulation_detail", function () {    
    
    if(getURLParameter('articulation_detail')==1){
        $(".articulation_detail_title").html('EMPTY SPACE IN THE MOUTH AND THROAT');
        $(".articulation_detail_image").html('<img src="images/makharij/articulation/1.png">');
        $(".articulation_detail_alphabets").html('<img onclick="alphabet_click(1)" src="images/alphabets/1.png"><img onclick="alphabet_click(26)" src="images/alphabets/26.png"><img onclick="alphabet_click(29)" src="images/alphabets/29.png">');
        $(".articulation_detail_text").html('<p>The empty space in the mouth and throat is a place and an articulation point at the same time. The three madd (lengthened) letters originate from this general area, these letters are:<p>1. The Alif preceded by a letter with a fat-hah (and the true Alif is only in this state); the Arabic Alif never takes a vowel and is always preceded by a Fatha  َ(  ا) <p>2. The wow with a sukoon preceded by a letter with a Dammah (  ُؤ)<p>3. The ya’ with a sukoon preceded by a letter with a Kasra (  ِئ)<p>These three madd letters do not have a specific place that they are pronounced from, unlike all the other letters; instead these letters finish articulating with the stopping of the sound. <p>The madd letters are lengthened two counts if they are not followed by a Hamzah or a sukoon. The lengthening when there is a Hamzah or sukoon after the madd letter will be covered, insha’ Allah, in future lessons. <p>Common mistakes in these letters <p>Many times a reciter lets the sound of some or all of these letters come up from the empty space of the throat into the nose, and a nasalization (or ghunnah) of one or all of these letters then occurs. The most common letter for this to happen with is the lengthened “wow”.   ُؤ <p>To rid oneself of this error, the sound needs to be focused up and out the mouth. To practice and see if this error is present one should close off the nostrils and say the madd letter; if the sound becomes muted with the pinching off of the nostrils, or if it sounds like one has a cold, it is indeed coming up through the nose, and therefore incorrect. <p>A less common mistake is pronouncing one or all of these letters from a specific place in the throat. The resultant sound is usually a cross between one of the letters that are supposed to be articulated from the throat, and the madd letter. To tell if this mistake is present, one needs to say the madd letter, and if there is a pull in the throat, it is then incorrect. These madd letters should be pronounced with using only the vibration of the vocal cords and an accompanying opening of the mouth for the alif, a circling of the lips for the lengthened wow,ُؤ and a lowering of the jaw with the lengthened ya’.ِ ئ');
    }
    else if(getURLParameter('articulation_detail')==2){
        $(".articulation_detail_title").html('DEEPEST PART OF THE TONGUE');
        $(".articulation_detail_image").html('<img src="images/makharij/articulation/2.png">');
        $(".articulation_detail_alphabets").html('<img onclick="alphabet_click(21)" src="images/alphabets/21.png"><img onclick="alphabet_click(22)" src="images/alphabets/22.png">');
        $(".articulation_detail_text").html('<p>There are two letters that use the deepest part of the tongue in articulation. They are ك and  ق.<p>  ق Is articulated from the deepest part of the tongue and what lies opposite to it from the roof of the mouth in the area of the soft palate.<p>  ك Is articulated from the deepest part of the tongue and what lies opposite to it from the roof of the mouth in the area of the hard palate. This letter is closer to the mouth than the  ق .<p>Common Mistakes in these letters <p>The non-Arab has more than a few common mistakes with these two letters. The first letter,  قis not a common letter in other languages, and even the Arabs have substituted this letter for others in different colloquial Arabic dialects. Egyptians and Shaamis substitute a hamzah for the  ق in their dialect. The Gulf Arabs use a “g” sound in their dialect for this letter. <p>There are two mistakes in articulating this when reciting the Qur’an. Usually it is a problem in the articulation point. Either the letter is articulated on the hard palate or close to it, so it ends up sounding like an English “k”, or the letter is pronounced not from the tongue, but from the throat, and the resultant incorrect sound is a cross between a غ  and a  ق. Native English speakers tend to make the first type of error, and Muslims of eastern origin tend to make the second type of error.<p>ك  is often mispronounced at an articulation point further back in the mouth than the correct articulation point. The resultant letter is often closer to a  قthan the correct desired sound. Muslims from the East, such as Pakistan, Indonesia, Malaysia, and the Philippines tend to have this error. Native English speakers sometimes pronounce this letter a little further back in the mouth than is totally correct so there is no air heard with the letter. In truth, there should be a running of air when this letter is pronounced correctly.');
    }
    else if(getURLParameter('articulation_detail')==3){
        $(".articulation_detail_title").html('THROAT');
        $(".articulation_detail_image").html('<img src="images/makharij/articulation/3.png">');
        $(".articulation_detail_text").html('<p>There are three places of articulation in the throat; each place has two letters emitted from therein. <p>1.	ء   ه 	Deepest part of the throat (farthest from mouth)<p>2.	ع   ح	Middle part of the throat<p>3.	غ   خ	Closest part of the throat (closest from mouth)<p>The deepest part of the throat<p>The deepest part of the throat is the furthest away from the mouth and the closest to the chest. Two letters are articulated from here. They are the  ء     and the   ه .<p>The middle part of the throat<p>The middle part of the throat lies half way in between the beginning and the end of the throat. The two letters that are emitted from here are: ح   and ع . <p>The closest part of the throat<p>The closest part of the throat is the beginning of the throat, or the closest to the mouth. Two letters are articulated from this area, they are:    غand  خ   . <p>Common mistakes in these letters<p>These letters are uncommon to many languages, especially English, outside of the Hamzah, and many would say the ha’,  but even the the English “h” is often pronounced at a position higher in the throat than the Arabic ha’. <p>The two letters from the middle of the throat need practice to succeed in their proper pronunciation. The first step is getting used to using the throat, especially the middle, and then work should begin on the letter: ح   . Think of the throat squeezing against itself from the middle, and try to pronounce it from that point. There is plenty of air that runs with this letter.<p>  عis the second letter from this area is pronounced from the same point, but has more of a rolling sound. <p>The last two letters pronounced from the upper part of the throat (closest to the mouth) also need practice to achieve a correct pronunciation. <p>  خis often mispronounced as a “k” by non-Arabs. The “k” is not articulated from the throat; rather it is articulated from the posterior portion of the tongue and the roof of the mouth. <p>  غmany times is mispronounced as a “g” like the first “g” in the word “garage”. One way of finding the articulation area is by gargling. The sound emitted with a deep gargle is close to the Arabic letter. <p>Turn the audio on and do loads of practice with the Sheikh.	');
    }
    else if(getURLParameter('articulation_detail')==4){
        $(".articulation_detail_title").html('MIDDLE OF THE TONGUE');
        $(".articulation_detail_image").html('<img src="images/makharij/articulation/4.png">');
        $(".articulation_detail_alphabets").html('<img onclick="alphabet_click(5)" src="images/alphabets/5.png"><img onclick="alphabet_click(13)" src="images/alphabets/13.png"><img onclick="alphabet_click(29)" src="images/alphabets/29.png">');
        $(".articulation_detail_text").html('<p>Three letters use the middle of the tongue for their articulation. They are   ج,ش, and the unlengenthened   ئ  <p>These three letters are articulated from the middle of the tongue and what lies opposite to it from the roof of the mouth. This means the middle of the tongue collides with the roof of the mouth when these letters are articulated without a vowel, and the middle of the tongue separates with strength from the roof of the mouth when the letters are voweled. The ya’ here is not the madd letter ya’, which was previously stated to be articulated from the non-specific area of the empty space in the throat and mouth. The madd letter ya’ is a ya’ saakinah preceded by a kasrah, NOT a fatha. When the ya’ saakinah is preceded by a fatha, this currently discussed articulation point is used. <p>Common mistakes in these letters<p>The mistakes that may occur with these letters tend to more in the area of characteristics than in the specific articulation point, but not exclusively so. The ج  is often mispronounced by Arabs and non Arabs alike, with a running of the sound, like the French “j”. This letter, in Arabic, is a strong letter, and there is imprisonment of the running of the sound, and imprisonment of the running of air. To pronounce it correctly, first make sure the middle of the tongue is being used, and not the anterior portion of the tongue, then concentrate on not letting any sound and air run out when saying the letter.<p>  ش can be articulated incorrectly, especially by those with a significant overbite. Those that may have an overbite have to take the extra measure of protruding the lower jaw until the bottom and top teeth are aligned. It may take a little practice, but is indeed possible to pronounce it correctly, even with the overbite. There is a lot of air that fills the mouth and runs out with this letter. Westerners sometimes pronounce this like the English “sh”, which has a more forward position than the Arabic .<p>The unlengenthened   ئ   sometimes mistakenly is articulated with an accompanying running of air. This letter should not have air running with it, so care needs to be taken to control the air and suppress its excessive outward flow.');
    }
    else if(getURLParameter('articulation_detail')==5){
        $(".articulation_detail_title").html('THE SIDE OR EDGE OF THE TONGUE');
        $(".articulation_detail_image").html('<img src="images/makharij/articulation/5.png">');
        $(".articulation_detail_alphabets").html('<img onclick="alphabet_click(15)" src="images/alphabets/15.png">');
        $(".articulation_detail_text").html('<p>There are two letters that use the side of the tongue for articulation. <p>They do not use the same part of the side of the tongue, rather the  ض uses the posterior two thirds of the side (or edge) of the tongue, and the  لuses the anterior one third (closest to the mouth) portion of the side of the tongue. <p>The letter ض<p>This letter is articulated from the one or both sides of the tongue and from the molars and the gum area next to the molars. The posterior two thirds of the side of the tongue is used for this letter. This letter can be articulated from one side (right or left) of the tongue alone, or from both sides of the tongue simultaneously. <p> ضhas the characteristic of compression of the sound, as well as tafkheem (heaviness), so the deep part of the tongue raises up when pronouncing it and compresses the sound at the same time. <p>Common mistakes in the letter ض<p>The  ض takes practice, patience, and dua’ to perfect its articulation. The most common mistake in its pronunciation is using the tip of the tongue instead of the side (posterior two thirds). The resultant sound then is that of a  د. Using the middle of the tongue and what opposes it of the middle of the roof of the mouth is another common error. The resultant sound is sort of like a heavy  د. <p>Some Arabs even sometimes have difficulty pronouncing  ض correctly. Some areas of the Arab world consistently pronounce this letter using the tip of the tongue and the teeth and the resultant sound is exactly that of a  ظ. This is most noted in Sudan. <p>Another less common mistake is of going too far back to articulate it; back to the throat, in this case the sound is similar to a swallowing sound mixed with a letter. <p>The letter ل<p>This letter has the widest articulation points of all the Arabic letters. It is articulated from the anterior one third of the sides of the tongue until the sides end at the tip, and what lies opposite to them of the gums of the two top front incisors, the two top lateral incisors, the two top canines, and the two top premolars. The articulation of this letter is then in the shape of an arc, with both sides until the tongue ends at the tip meeting up with with gums of all the mentioned teeth. It is to be noted that it is a fine line of the sides of the tongue that meets up with the gums, and it does not include the top of the tongue. The articulation of the  لis an upward movement, not a forward movement like “L” is in English. <p>Common mistakes in the letter ل<p> The most common mistake is that of using just the tip and not the sides of the tongue to pronounce this letter, and the resultant sound is that of a noon, since the noon is articulated very close to the   ل. Another mistake for native English speakers is pronouncing using the underside of the tongue and the actual plates of the two front teeth. The resultant sound is a heavy sound, just as the English “L”.');
    }
    else if(getURLParameter('articulation_detail')==6){
        $(".articulation_detail_title").html('TIP OF THE TONGUE');
        $(".articulation_detail_image").html('<img src="images/makharij/articulation/6.png">');
        $(".articulation_detail_alphabets").html('<img onclick="alphabet_click(11)" src="images/alphabets/11.png"><img onclick="alphabet_click(14)" src="images/alphabets/14.png"><img onclick="alphabet_click(12)" src="images/alphabets/12.png"><img onclick="alphabet_click(17)" src="images/alphabets/17.png"><img onclick="alphabet_click(9)" src="images/alphabets/9.png"><img onclick="alphabet_click(4)" src="images/alphabets/4.png"><img onclick="alphabet_click(3)" src="images/alphabets/3.png"><img onclick="alphabet_click(8)" src="images/alphabets/8.png"><img onclick="alphabet_click(16)" src="images/alphabets/16.png"><img onclick="alphabet_click(10)" src="images/alphabets/10.png"><img onclick="alphabet_click(25)" src="images/alphabets/25.png">');
        $(".articulation_detail_text").html('<p>Articulation points of the  نand the  ر<p>The letter  ن<p>This letter is articulated from the tip of the tongue and what lies opposite to it from the gum of the two front top incisors.  نis articulated a bit forward on the gums from the place of the ل.<p>This letter is not always pronounced clearly, and the articulation point is only applied when it is pronounced clearly, namely when it has a vowel on it, or if it has a sukoon on it and is followed by one of the following six letters: ء(همزة)    ه(هاء)  ع(عين)  ح(حاء)  غ(غين)  خ(خاء)  <p>The rules for the  ن when it has no vowel (saakinah), and is not followed by one of the above six letters, will be explained later, insha’ Allah. <p>Common mistakes in this letter <p>The mistakes with this letter tend to be few. The most common mistake is that of using too large an area of the tongue and including the top of the tongue, instead of just the tip. <p>The letter  ر  <p>This letter is emitted from the tip of the tongue with the top of the tip and what lies opposite to it of the gums of the two front top incisors. The tip with the top of the tip need to strike the gums to produce this sound correctly. There should be no trilling of the tongue when pronouncing this letter. <p>Common mistakes in this letter <p>The first and most common mistake in the   ر is not striking the tip with the top of the tip to the gums. The English “r” is articulated without the tongue striking on any part of the mouth, so many native English speakers have to practice a bit to say the  ر correctly. One should physically feel the tongue hit the gum of the two top front incisors. <p>Another mistake that some have is using the soft tissue behind the gum for a striking place for the tongue. It is quite difficult to get the tip and the top involved when the soft tissue area is used, so the resultant sound is deep and rolling, but not correct. <p>Still other make the aforementioned error of repeated trilling of the tongue when pronouncing the  ر. The scholars have cautioned against this. This usually can be fixed by leaving a small space for the sound to run out at the very tip of the tongue. If the tip is up tight against the gum, there is no place for the sound to run, pressure builds up and can only released by the incorrect excessive trilling. <p>The articulation point of the   ط  د  ت   <p>These letters are pronounced from the top side of the tip of the tongue and the gum line of the two front upper incisors. The gum line is exactly where the gum meets the teeth. The part of the tongue used in these letters is a small part of the top of the tip, not any farther back than the very tip area. <p>Common mistakes in these letters<p>The mistake that occurs most often in these letters is using the soft elevated area behind the gum instead of the gum line. The English “t” and “d” are articulated at this position which is further back in the mouth than the Arabic   د and  ت. When these letters are emitted back too far, their sound gets heavy. Another problem that may occur in all of the letters in this group is not using just the top of the tip, but instead using a large portion of the top of the tongue. This is common in Urdu speaking Muslims as well as native English speakers, and it contributes to a heavy sounding letter.<p> ط is a letter that has both tafkheem (heaviness) and sticks to the roof of the mouth. It is the strongest of all the letters of the Arabic language. The most common mistake (outside of the above mistakes) in this letter is not getting it strong enough, as well as not sticking most of the tongue up to the roof of the mouth while pronouncing it. Since this letter is not common to many languages, it needs practice to be proficient in its proper articulation. Listening to a known accomplished reciter can assist in learning the proper sound for the ط. <p>Articulation points of the    ص  ز  س<p>These three letters are emitted from the tip of the tongue and the plates of the two front top incisors, at a point just above the two front lower incisors. There is a little space left in between the tip of the tongue and the plates of the teeth when pronouncing these letters. The term “plate” refers to the long axis of the tooth, and in this case, the long axis that is on the internal side, rather than the external side of the teeth.<p>These letters are also called   الصفِّير letters, which means “whistle”. They are called that due to the accompany whistle type sound heard when they are emitted properly. <p>Common mistakes in these letters<p>The most common mistake that occurs in the three letters as a group is in the lack of      الصفير (whistle). Usually this problem is due to a strong overbite. Those that have a large overbite though, can still learn to pronounce these letters correctly by making compensation in the lower jaw. The lower jaw should be protruded until it aligns with the upper jaw while saying these three letters, and insha’ Allah they will come out clearly with the proper “whistle” sound. A note to remember, the tongue should not press up against the plates of the teeth or the sound will be incorrectly imprisoned when trying to say these letters. <p>Another mistake that occurs singularly in the   ص is not making it heavy enough. It is one of the tafkheem (heavy) letters, and it also has the characteristic of sticking. If the   صis not made heavy enough, it sounds just like, or very close to a   س. The sticking of the tongue with the  ص is not at the articulation area, but rather with the back of the tongue. It sticks to the very back of the soft palate while pronouncing this letter. <p>Articulation point of the  ظ  ذ  ث   <p>These letters are emitted from the tip of the tongue (from the top side of the tip) and the bottom edges of the two top front incisors. Care should be taken to make sure the top of the tip is really colliding or separating (depending whether there is no vowel or a vowel) with the edges of the teeth and not the plates of the teeth. <p>Common mistakes in these letters <p>These three letters are some of the most mispronounced letters in the Arabic language by both Arabs and non-Arabs. The main reason for this is the corruption of pure classical Arabic and the colloquialization of many letters to other forms. This colloquialization unfortunately, has carried over to the way some recite the Qur’an, and with this mistake the reciter could unintentionally change the intended meaning of the Qur’an. This error should be attended to and fixed as soon as possible by the student of the Qur’an.<p>The   ظis often mispronounced as a heavy form of “z”. The reason for this (mechanically speaking) is not using the top of the tip with the edges of the incisors, and instead using the back plates of the two front incisors, which as covered in the last tidbit, is the articulation point for the   ص  ز  س. It is then understandable the mechanical reason for this letter to erroneously sound like a “z” when the incorrect articulation point is used. The  ظis a letter that has tafkheem, or heaviness, and that characteristic tends to be present even in the misarticulated form of the letter, and therefore the heavy “z” sound. Some transliterations of the Qur’an, which we caution against using, write this letter in English as “z”. This contributes to non-Arabs also reciting this letter incorrectly. <p>Some students of the Qur’an may have the articulation point of this letter correct, but do not make the necessary tafkheem, or heaviness that is needed when reciting this letter. The posterior portion of the tongue needs to rise up to the roof of the mouth for tafkheem to take place. <p>The   ذis many times mispronounced as a plain “z”. Again, Arabs as well as non-Arabs have this error. The solution is again using the top of the tip of the tongue and the bottom edges of the two top front incisors. There should be enough protrusion of the tip tongue in all three of these letters so that it is visible to the observer. <p>The   ثfrequently is pronounced as a   سby mistake. This mistake can occur with both Arabs and non-Arabs. The same reason as discussed above is the cause for this: using the wrong articulation point.<p>In summary the common mistake in these three letters is using the articulation point of the “whistle” group of letters  ص  ز  س   instead of their own unique articulation point. The tip of the tongue needs to collide or separate with the bottom edges of the two top front incisors, and not the internal plates of the two top incisors. ');
    }
    else if(getURLParameter('articulation_detail')==7){
        $(".articulation_detail_title").html('THE TWO LIPS');
        $(".articulation_detail_image").html('<img src="images/makharij/articulation/7.png">');
        $(".articulation_detail_alphabets").html('<img onclick="alphabet_click(20)" src="images/alphabets/20.png"><img onclick="alphabet_click(2)" src="images/alphabets/2.png"><img onclick="alphabet_click(26)" src="images/alphabets/26.png"><img onclick="alphabet_click(24)" src="images/alphabets/24.png">');
        $(".articulation_detail_text").html('<p>Articulation point of the letter ف <p>The articulation point of the  ف is between the inside of the lower lip and the tips (or edges) of the two top front incisors. This means that there is a meeting of these two parts of articulation to make the correct sound of this letter. <p>Common mistakes in this letter<p>The English letter “f” uses the middle of the lower lip and the edges or tips of the two front top incisors. As mentioned above in the articulation point definition of the Arabic  ف, the inside of the lower lip is used. If the English speaking student of the Qur’an does not make a conscience effort to use the inside of the lip, some of the characteristic of the   ف, namely the running of the sound as well as the breath, will be imprisoned. The sound will not be a true Arabic   ف then, but an English “f”. <p>Some areas in the Far East do not have an “f” in their language. The natives of these countries tend to substitute a “p” for an “f” when they are speaking a language that has an “f”. This obviously will carry over to the recitation of the Qur’an when there is a word with a   فin it. Practice is needed to pronounce the Arabic   ف, and not use a “p”, which does not exist in the Arabic language. <p>Articulation point of the two lips  ؤ  ب  م  <p>There are three letters that are articulated from the two lips, but they do not all three share the same mechanism in articulation. <p>The unlengthened   ؤ is articulated by forming a circle of the two lips without the two lips meeting completely. <p>The   م is articulated by closing the two lips together <p>The letter   بis articulated by closing the two lips together, but a stronger closing than the meem. <p>Common mistakes in these letters<p>The   ؤ is often mispronounced as a “v” by some Urdu speaking Muslims as well as Turkish speaking Muslims from Turkey and former Russian republics. This is due to the absence of   ؤ in the Turkish dialects, and the presence of both the wow and va’ in Urdu. There is no “v” in Arabic, and “v” has the same articulation point as the “f”. This problem can be overcome by practicing using both lips and pressing on them when pronouncing the unlengthened   ؤ. At the beginning much practice will be needed to overcome this mispronunciation. The student of the Qur’an may want to make note of all the unlengthened   ؤin a passage he/she is reciting or memorizing, and practice those phrases or words to make sure they all come out correctly. <p>Westerners have to take care that they really do put pressure on the two lips when pronouncing the   ؤ, otherwise the sound comes out weak like a “w”, which is not the same sound as the Arabic   ؤ. <p>The   م is not a letter that commonly has mistakes. The only thing to take heed of is not to press the lips together too hard. <p>The   بsometimes gets air in it, which is not a characteristic of the Arabic   ب, and the resultant sound is that of a “p”, which as stated before, does not exist in the Arabic language. The pressure on this letter is more on the inside of the lower lip than the outside, whereas “p” uses more of the outside of the lips, and has running air with it. There is an imprisonment of both the running of the sound and the running of the breath in the letter   بwhich makes it a strong letter. ');
    }
    else if(getURLParameter('articulation_detail')==8){
        $(".articulation_detail_title").html('THE NASAL PASSAGE');
        $(".articulation_detail_image").html('<img onclick="alphabet_click(8)" src="images/makharij/articulation/8.png">');
        $(".articulation_detail_text").html('<p>Ghunna<p>The nasal passage: From the hole of nose towards the inside of the mouth, here there is one articulation point, that of the ghunnah');
    }
    
    $(".articulation_detail_text").css("height",$(window).height()-$(".articulation_detail_image").height()-$(".articulation_detail_title").height()-$("._title").height()-$(".head").height()-100)
    $(".articulation_detail_text").niceScroll({touchbehavior:true});
    
    var sql =  "select starttime from lessoninfo where Lesson=1";
    db.transaction (function (transaction){
        transaction.executeSql (sql, undefined, function (transaction, result){ //alert(result.rows.length);
           result_makharij=result;
           loadMedia_makharij();
        });
    });
    
    
    
});

function alphabet_click(file){
        audioPosition = result_makharij.rows.item(parseInt(file-1)).starttime;
        duration=(result_makharij.rows.item(parseInt(file)).starttime-result_makharij.rows.item(parseInt(file-1)).starttime)*1000;

        playAudio_makharij();
        setTimeout(function(){
            my_media_makharij.seekTo(audioPosition*1000);
            setTimeout(function(){
                pauseAudio_makharij();
            },duration);
        },5);
}

$(document).on("pageshow", "#lesson_detail", function () {
    windowHeight = $(window).height();
    $('#lesson_detail_image').css('height',windowHeight/2);
    $('#lesson_detail_title').css('margin-top',(windowHeight/2)-50);
    $("#lesson_detail_text").css("height",$(window).height()-$("#lesson_detail_title").height()-$("#lesson_detail_image").height()-$(".head").height()-50)
    $("#lesson_detail_text").niceScroll({touchbehavior:true});
    if(getURLParameter('lesson')==1){
        $("#lesson_detail_title").html('Huruuf Mufridaat (Individual Letters)');
        $("#lesson_detail_text").html('<p>These are the pillars/ base of recitation. It is imperative that you memorize these letters with correct pronunciation / tajweed. Also learn the placement of dots on the letters.<p>Read the chart from left to right and right to left. Also read from top to bottom and from bottom to top.<p>Do not move ahead until you have memorized this lesson. Listen to the Shaykh and follows his way.  You can listen in automatic mode or manual mode, one letter at a time, by changing the settings.<p>Huruuf Mufridaat<p>The Huruuf Mufridaat are 29 in total.<p>Pronounce the Huruuf Mufridaat according to the rules of Tajweed and Qira’at. Recite the letters in the following way با  [Baa], تا [Taa], ثا  [Thaa].<p>Among the 29 letters, there are 7 letters that are always pronounced a full mouth (deeply). This group of letters is known as the Huruuf Musta’liyah, they are as follows:ق  غ  ظ  ط  ض  ص  خ  , when joined together, these letters are pronounced  ضَغْطٍ قِظْخُصَّ [Khussa Daghtin Qizh]<p>Only 4 letters are pronounced from the lips, و ف م ب   for all other letters, the lips should not touch each other.');
    }
    else if(getURLParameter('lesson')==2){ 
        $("#lesson_detail_title").html('Huruuf Murakkabaat (Compound letters)');
        $("#lesson_detail_text").html('<p>When 2 or more letters unite the form a Murakkab (Compound).<p>Read each letter of the Murakkab (Compound) letters separately just like you would read the Huruuf Mufridaat (individual letters). For example in لا , the letter on the right is ل  and the letter on the left is الف . Listen to the Shaykh recite and follow.<p>Try to memorize the letters with the same shape by swapping the dots on them. For example if you move the dot of ب   to the top then what letter does it make? And if you move the dots of ج to the top then what letter does it make?<p>What are the differences in the letters ث and ش   or letters   ق and  ت   ?<p>Make sure that you pronounce the letters in the Ma’ruf manner with the Arabic tone and accent.<p>In Arabic when two or more letters are joined together and written, their form is changed. Usually the head of the letter is written and body is omitted.<p>The letters which are almost identical, when in the compound form, can be identified by the alterations in the number and position of the dots.'); 
    }
    else if(getURLParameter('lesson')==3){ 
        $("#lesson_detail_title").html('Huruuf Muqataat');
        $("#lesson_detail_text").html('<p>The Huruuf Muqataat appear at the beginning of some of the Surahs of the Holy Quran.<p>Read these letters separately, stretch them according to the defined length, and also perform nasalization (Ghunna) when Ikfa and Idgham occur. Listen to the Shaykh and follow.'); 
    }
    else if(getURLParameter('lesson')==4){ 
        $("#lesson_detail_title").html('Harakat (Short vowels)');
        $("#lesson_detail_text").html('<p>Fatha/Zabr (َ) Qasra/Zer (ِ) and Dammah/Paish (ُ) are known as the Harakat. The Fatha and Dammah are found above the letters whereas the Qasra is found below it.<p>The letter that has a Harakat is called a Mutaharrik.<p>Recite the harakat correctly without stretching them and without incorrect shortening.<p>Identify and memorize the harakat- Fatha (Zabr), Kasra (Zer) and Dammah (Paish).<p>Fatha is the straight line on the top of a letter. It is the vowel ‘a’ and is pronounced like a       short ‘a’. Fatha is pronounced by opening the mouth and raising the voice.<p>Kasra is the straight line on the bottom of a letter. It is the vowel ‘e’ and is pronounced like a short ‘e’. Qasra is pronounced by dropping the tone of the voice.<p>Dammah is the curled up line on the top of a letter.  It is the vowel ‘u’ and has a sound in between ‘o’ and ‘u’. Dammah is pronounced by rounding your lips.<p>Recite the harakat correctly without stretching them and without incorrect shortening.<p>If a harakat or Jazm (sign of sukoon) appears on an Alif, then it is read as Hamzah   أ اِ   اَ   اُ<p>Note - If the letter ر ا has a Fatha or Dammah it is pronounced deeply. If the letter       راhas a Qasra it is pronounced delicately.<p>Read this lesson without spelling (i.e continuois) and spell-reading. See the options.<p>Take special care to pronounce the Harakat<p>Create an apparent distinction between the letters which are Qareeb-us-Saut i.e. the letters that sound similar.'); 
    }
    else if(getURLParameter('lesson')==5){ 
        $("#lesson_detail_title").html('Tanween');
        $("#lesson_detail_text").html('<p>Read this lesson without spelling (i.e continuois) and spell-reading. See the options.<p>Two Fatha (ً), Two Qasra (ٍ) and Two Dammah (ٌ) are called Tanween. <p>Practice “Ghunna” in this lesson. <p>Ghunna<p>Ghunna is the nasal sound.<p>If after Noon Sakin or Tanween any of the following letters appear: ر ل خ غ ح ع ه ء then Noon Sakin or Tanween will be read very clearly and distinctly. (Ghunna and Ikfa will not be made)<p>For the rest of the letters appearing after Noon Sakin or Tanween Ghunna will be made.<p>Exercise:  why are we doing Ghunna in this word and why not in the other?'); 
    }
    else if(getURLParameter('lesson')==6){ 
        $("#lesson_detail_title").html('Exercise of Harakat and Tanween. (Exercise of compound letters with Tanwin)');
        $("#lesson_detail_text").html('<p>Practice reading the letters separately with their harakat like you did in lesson 4 and then using spell reading mode practice with audio how to join them together.<p>Work thru this lesson by using both methods i.e. with and without spellings.<p>Take care to correctly pronounce the harakat, Tanween and all the letters particularly the Huruuf Musta’liyah (the letters that are read deeply)<p>Remember the Ghunna rule!   If after Noon Sakin or Tanween any of the following letters appear: ر ل خ غ ح ع ه ء then Noon Sakin or Tanween will be read very clearly and distinctly. (Ghunna and Ikfa will not be made)<p>Other then these 8 letters if any of the other letters appear after Noon Sakin or Tanween then you have to do Ghunna.<p>If there is a Fatha on ر then it is read heavy but if there is a kasra then ر is read delicately.'); 
    }
    else if(getURLParameter('lesson')==7){ 
        $("#lesson_detail_title").html('Alif Sagheera, Yaa Sagheera and Wow Sagheera');
        $("#lesson_detail_text").html('<p>Alif Sagheera stands in the place of an Alif.  Hence    باَ       = ب’.   It is also called Upright Fatha or Daggar Alif.<p>Yaa Sagheera stands in place of Yaa Saakin. Hence     بيِ      =   ,ب    <p>Wow Sagheera stands in place of a Wow Sakin. Hence   بوُ   =   ب‘<p>Avoid doing Ghunna on Huruuf Maaddah appearing after letters م   and    ن .     <p>For example in the letters        ن‘ ،  ناَ،  نؤُ،  نئِ،  م‘ِ، ماَ،  مؤُ،  مىِ   the sounds of       و  ا  ى   is not nasal but from the hollow part of the mouth.'); 
    }
    else if(getURLParameter('lesson')==8){ 
        $("#lesson_detail_title").html('Huruuf Maaddah and Leen');
        $("#lesson_detail_text").html('<p>Huruuf Maaddah<p>There are three Huruuf Maaddah: ، و، يا<p>If there is a Fatha before Alif ا    َ   (Alif Maaddah)<p>Dammah before Wow Sakin ُ و      (Wow Maaddah)<p>Kasra before Yaa Sakin ِ  ي                (Yaa Maaddah)<p>Then these letters are read longer. They are called Maaddah Asli.<p>Example      بوُ  بيِباَ<p>Huruuf Leen:<p>If there is a Fatha before Yaa Sakin and Wow Sakin then they are called Huruuf Leen.  َ و   َي<p>These letters are pronounced quickly in a soft tone. Refrain from reading in a passive voice. It should be read in an active voice.'); 
    }
    else if(getURLParameter('lesson')==9){ 
        $("#lesson_detail_title").html('Huruuf Leen');
        $("#lesson_detail_text").html('<p>There are 2 Huruuf Leen: Wow and Yaa<p>When there is a Fatha before the Wow Sakin then the Wow becomes Leen e.g. جَو<p>When there ia a Fatha before the Yaa Sakin then the Yaa becomes Leen e.g.       جِئ<p>Pronounce the Huruuf Leen gently and correctly without stretching or exaggerated resonance (sudden pausing)'); 
    }
    else if(getURLParameter('lesson')==10){ 
        $("#lesson_detail_title").html('SUKOON OR JAZM');
        $("#lesson_detail_text").html('<p>The sign َ   is known as Jazm. A letter with Jazm is described as Sakin.<p>The letter with a Jazm is read with the Mutaharrik letter before it.<p>Always pronounce the Hamzah Sakin (  ء  أ   ) with slight resonance  A sudden pause at the end)<p>Huruuf Qalqalah<p>There are 5 Huruuf Qalqalah د  ج  ب  ط  ق   when joined together they are pronounced as  جد   قطبe letters so that the sound echoes.<p>When the Huruuf Qalqalah are Sakin (ie have a Jazm on them) make sure the echo in the sound is clear.<p>The word Qalqalah means movement. There must be movement and motion (within the Makhraj) when pronouncing the<p>Memorize what Jazm looks like.<p>Q. What is the letter with Jazm called?  <p>A. Sakin<p>Q. How many times can you read the Sakin letter?  <p>A. You can read it only once by joining it to the letter before it.<p>Try to differentiate between letter that sound similar letters e.g. س and   ص ز, ظ  ذ, and also b/w ت   ط  and   ق   ك'); 
    }
    else if(getURLParameter('lesson')==11){ 
        $("#lesson_detail_title").html('NOON SAKIN AND TANWEEN (IZHAR AND IKFAH)');
        $("#lesson_detail_text").html('<p>The Noon Sakin and Tanween have four rules: 1) Izhar 2) Ikfah   3) Idgham 4) Iqlab.<p>1) IZHAR. If any letter from the Huruuf Halqiyyah is found after a Noon Sakin or Tanween, then Izhar will be done i.e. the sound of Noon will be clear. Nasalization (Ghunna) will not take place when reading the Noon Sakin or Tanween. The Huruuf Halqiyyah are 6 and they are:  ء  ح  ع  ه  غ  خ<p>2) IKHFA.  If any letter from the Huruuf Ikfah is found after a Noon Sakin or Tanween, then Ikfa will be done i.e. one would read the Noon Sakin or Tanween with nasalization (Ghunna). The Huruuf Ikfa are` 15 and they are        ك  ق  ف  ظ  ط  ض  ص  ش  س  ز  ذ  د  ج  ث  ت  <p>3) IDGHAM. If any letter from the Huruuf Yarmalun is found after Noon Sakin or Tanween then Idgham will be done, without Ghunna in the letters “ر   ” and “ل”and with Ghunna in the remaining4 letters. The Huruuf Yarmalun are 6 and they are:           ن  و  ل  م  ر  ئ<p>4) IQLAB. If the letter “ب " is found after Noon Sakin or Tanween, then do Iqlab i.e change the Noon Sakin or Tanween into Meem and do Ikfah (pronounce with nasalization)'); 
    }
    else if(getURLParameter('lesson')==12){ 
        $("#lesson_detail_title").html('TASHDEED');
        $("#lesson_detail_text").html('<p>The curved sign ( ّ  ) is known  as tashdeed. A letter with Tashdeed mark is called MUSHADDAD letter.<p>Read the Mushaddad letter twice. It will first read while being joined with the Mutaharrik letter before it and then will be read with a slight pause with its own Harakat.<p>Ghunna is always done in the Noon Mushaddah and Meem Mushaddah. The meaning of Ghunna is to take the sound into the nose i.e. Nasalization, duration of the Ghunna is equal to the length of Alif.<p>When a letter from the Huruuf Qalqalah is Mushaddad, pronounce the letter with extra stress and an emphasized echo.<p>If the first letter is Mutaharrik, the second Sakin and the second Sakin and the third Mushaddad, then in most cases not all, the Sakin letter is not read and the Mutaharrik letter is joined with the Mushaddad.<p>e.g   عَبَدتُم  will be read as  عَبَتّم<p>Q. What does a  tashdeed look like?<p>A. It is a curved sign. (Small “w”)<p>Q. What is the letter with a tashdeed called?<p>A. Mushaddad.<p>Q. How many times do you read the Mushaddad letter?<p>A. Twice. First time it is read joined with the letter before it and second time on its own.'); 
    }
    else if(getURLParameter('lesson')==13){ 
        $("#lesson_detail_title").html('EXCERCISE TASHDEED');
        $("#lesson_detail_text").html('<p>Noon and Meem Mushaddad always have a Ghunna. The nasalization should not exceed the duration of two harakat. (2-3 second duration) <p>If there is a Sukoon before Raa Sakin, then look at the letter before it. If there is a Fatha or Dammah on that letter then Raa is pronounced heavy if there is a Kasra before it then it is read fine.<p>The states in which the letter R is pronounced deeply:<p>When the Raa has a Fatha or Dammah.<p>When the Raa has two Fatha or two Dammah.<p>When the Raa has a upright Fatha (Khara Fatha) or an Uulta Dammah.<p>When the letter before a Raa Sakin has a Fatha or a Dammah<p>When there is an Aridhi Kasra (temporary Kasra) before the Raa Sakin<p>When after a Raa Sakin any letter from the Huruuf Mustaliyah appears in the same word<p>The states in which the letter Raa is pronounced lightly:<p>When there is a Kasra or two Kasra under the Raa<p>When there is a Kasra before the Raa Sakin in the same word<p>When there is Yaa Sakin before the Raa Sakin'); 
    }
    else if(getURLParameter('lesson')==14){ 
        $("#lesson_detail_title").html('LAST LESSON – INCLUDES RULES OF MEEM SAKIN');
        $("#lesson_detail_text").html('<p>THE RULES OF MEEM SAKIN<p>Meem Sakin has three rules: 1) Idgham Shafawi   2) Ikfah Shafawi  3) Izhar Shafawi<p>1)	Idgham Shafawi: If after a Meem Sakin another Meem appears, then Idgham Shafawi (with Ghunna) will be done within the Meem Sakin.<p>2)	Ikfah Shafawi: If after a Meem Sakin, the letter ب appears then Ikfa Shafawi (Ghunna) will take place within the Meem Sakin.<p>3)	Izhar Shafawi: If after a Meem Sakin any letter excluding the letters ب and م appears then Izhar Shafawi will take place within the Meem Sakin i.e. here nasalization (Ghunna) will not be done.'); 
    }
});