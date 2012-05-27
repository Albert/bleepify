
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
        request.open( 'GET', 'http://staging.albert-hwang.com/26777__junggle__btn402.mp3', true );
        request.responseType = "arraybuffer";
        request.send();

        var major = [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8];
        var minor = [1, 9/8, 6/5, 4/3, 3/2, 8/5, 9/5]; // of course, for now, w/out context, this is just a major scale of another note...
        var blues = [1, 6/5, 4/3, 45/32, 3/2, 9/5];
        var chromatic = [1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8];
        var arpeggio = [1, 5/4, 3/2];
        var arpeggio7 = [1, 5/4, 3/2, 15/8];
        
        function playSound(depth, scale){
          var newSource = context.createBufferSource();
          newSource.buffer = source.buffer;
          newSource.connect( context.destination );
          baseNote = .2;
          octave = Math.floor(depth / scale.length);
          octaveFactor = Math.pow(2, octave);
          note = (depth) % scale.length;
          tone = baseNote * octaveFactor * scale[note];
          newSource.playbackRate.value = tone;
          newSource.noteOn( 0 );
        };

      jQuery(':visible').each(function(index){
        var $this = jQuery(this);
        var oldBorder = $this.css("border");
        setTimeout(function () {
          $this.css("border", "1px solid red");
          playSound($this.parents().length, major);
        }, (index + 3) * 400);
        setTimeout(function() {
          $this.css("border", oldBorder);
        }, (index + 4) * 400);
      });
    })();
  }

})();