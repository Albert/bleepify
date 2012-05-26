
(function(){

  // the minimum version of jQuery we want
  var v = "1.3.2";

  // check prior inclusion and version
  if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
    var done = false;
    var script = document.createElement("script");
    script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
    script.onload = script.onreadystatechange = function(){
      if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        done = true;
        initMyBookmarklet();
      }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
    jquery.noConflict();
  } else {
    initMyBookmarklet();
  }

  function initMyBookmarklet() {

    (window.myBookmarklet = function() {
      
        var context = new webkitAudioContext()
          , source  = context.createBufferSource()
          , request = new XMLHttpRequest()
          ;

        request.addEventListener( 'load', function( e ){
          context.decodeAudioData( request.response, function( decoded_data ){
            source.buffer = decoded_data;
            source.connect( context.destination );
          }, function( e ){
          });
        }, false );


        // request.open( 'GET', '26777__junggle__btn402.mp3', true );
        request.open( 'GET', 'http://albert-hwang.com/wordpress/wp-content/uploads/2012/05/26777__junggle__btn402.mp3', true );
        request.responseType = "arraybuffer";
        request.send();


        function playSound(pitchShift){
          var newSource = context.createBufferSource();
          newSource.buffer = source.buffer;
          newSource.connect( context.destination );
          newSource.playbackRate.value = pitchShift;
          newSource.noteOn( 0 );
        };

      jQuery('*').each(function(index){
        var $this = jQuery(this);
        var oldBorder = $this.css("border");
        setTimeout(function () {
          $this.css("border", "1px solid red");
          playSound($this.parents().length);
        }, (index + 1) * 100);
        setTimeout(function() {
          $this.css("border", oldBorder);
        }, (index + 2) * 100);
      });
    })();
  }

})();