$(document).ready(function(){
  
  var player = SC.Widget($('iframe.sc-widget')[0]);
  var pOffset = $('.waveform').offset();
  var pWidth = $('.waveform').width();
  var scrub;
  var playPause = document.querySelector('.player-button');
  
  let playing = false;
  
  player.bind(SC.Widget.Events.READY, function() {
    setInfo();
    // player.play();
  }); //Set info on load
  
  playPause.addEventListener('click', () => {
    player.toggle();
    playing = !playing;
    if(playing) {
      playPause.dataset.playing = 'true';
      $('.player-button').html("PAUSE");
      $('.spinner').attr("id", "play");


    } else playPause.dataset.playing = 'false',
      $('.player-button').html("PLAY");
      $('.spinner').removeAttr("id");
      $('.spinner').prop("id", "pause");

  });
  
  
  
  player.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
    if( e.relativePosition < 0.0 ) { setInfo(); }
    //Event listener when track is playing
    
    $('.position').css('left', ( e.relativePosition*100)+"%");
  });
  
  $('.waveform').click(function(e){ //Get position of mouse for scrubbing
    scrub = (e.pageX-pOffset.left);
  });
  
  const waveform = document.querySelector('.waveform');
  waveform.onmousemove = function(e) {
    var t = ((e.pageX - e.currentTarget.offsetLeft) / e.currentTarget.offsetWidth) * pWidth;
    $('.scrub-position').css('left', t);
    console.log(t);
  }
  
  
  
  
  $('.player').click(function(){ //Use the position to seek when clicked
    $('.position').css('left',scrub+"px");
    var seek = player.duration*(scrub/pWidth); 
    player.seekTo(seek);
  });
  
  
  
  // Function to change ms to XX:XX:XX
  var timecode = function(ms) {
    var hms = function(ms) {
          return {
            h: Math.floor(ms/(60*60*1000)),
            m: Math.floor((ms/60000) % 60),
            s: Math.floor((ms/1000) % 60)
          };
        }(ms),
        tc = []; // Timecode array to be joined with ':'

    if (hms.h > 0) {
      tc.push(hms.h);
    }

    tc.push((hms.m < 10 && hms.h > 0 ? "0" + hms.m : hms.m));
    tc.push((hms.s < 10  ? "0" + hms.s : hms.s));

    return tc.join(':');
  };
  
  function setInfo() {
    $('.spinner').attr("id", "play");
    player.getCurrentSound(function(song) {
      
        // Get the waveform image
        var waveformPng =
            song.waveform_url
                .replace('json', 'png')
                .replace('wis', 'w1');
      
      $('.waveform').css('background-image', "url('" + waveformPng + "')");    
      
      // Set the track name
      var info = song.title;
      $('.player-title').html(info);
      
      // Set total duration
      var duration = timecode(song.duration);
      $('.duration').html(duration);
      
      // Set current time stamp
      player.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
        var percent = e.relativePosition
        var current = timecode(song.duration*percent);
        $('.current').html(current);
      });
      
      player.current = song;
    });
    
    
    
    player.getDuration(function(value){
      player.duration = value;
    });

    player.isPaused(function(bool){
      player.getPaused = bool;
    });
  }
  
});

$(".player-button").on("tap click", function () {
  
        $('.spinner').attr("id", "play");
      });
  