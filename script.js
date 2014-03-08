(function(){

  // the minimum version of jQuery we want
  var v = "1.3.2";

  // check prior inclusion and version
  if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
    var done = false;
    var script = document.createElement("script");
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
    script.onload = script.onreadystatechange = function(){
      if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        done = true;
        initMyBleepify();
      }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  } else {
    initMyBleepify();
  }
  var style = document.createElement("link");
  style.type = "text/css";
  style.rel = "stylesheet";
  style.href = "https://s3.amazonaws.com/Bleepify/style.css?r=" + Math.floor(Math.random()*80000);
  //style.href = "/style.css?r=" + Math.floor(Math.random()*80000);
  document.getElementsByTagName("head")[0].appendChild(style);

  function initMyBleepify() {

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
        request.open( 'GET', 'https://s3.amazonaws.com/Bleepify/bleep.mp3', true );
        request.responseType = "arraybuffer";
        request.send();

        var ctrl ='';
        ctrl=ctrl+ '<div id="bleepifyControllerWrap">';
        ctrl=ctrl+ '  <div id="bleepifyController">';
        ctrl=ctrl+ '    <div class="bleepifyH1">Bleepify It!</div>';
        ctrl=ctrl+ '    <div>';
        ctrl=ctrl+ '      <div class="bleepifyH2">Time Between Bleeps</div>';
        ctrl=ctrl+ '      <input id="bleepifySecondsBtwn" type="text" name="bleepifySecondsBtwn" value=".075" />';
        ctrl=ctrl+ '      <label style="font-size: 16px; color: #00ff00;">Seconds</label>';
        ctrl=ctrl+ '    </div>';
        ctrl=ctrl+ '    <div>';
        ctrl=ctrl+ '      <div class="bleepifyH2">Scale</div>';
        ctrl=ctrl+ '      <a href="#" class="scale-selector active" id="bleepify-major">Major</a>';
        ctrl=ctrl+ '      <a href="#" class="scale-selector" id="bleepify-chromatic">Chromatic</a>';
        ctrl=ctrl+ '      <a href="#" class="scale-selector" id="bleepify-blues">Blues</a>';
        ctrl=ctrl+ '      <a href="#" class="scale-selector" id="bleepify-arpeggio">Arpeggio</a>';
        ctrl=ctrl+ '      <a href="#" class="scale-selector" id="bleepify-arpeggio7">Arpeggio7</a>';
        ctrl=ctrl+ '    </div>';
        ctrl=ctrl+ '    <a href="#" id="runBleepify">&#9834; Run</a>';
        ctrl=ctrl+ '    <div style="clear: both;"></div>';
        ctrl=ctrl+ '  </div>';
        ctrl=ctrl+ '  <a href="#" id="bleepifyOpenClose" title="hide panel" alt="hide panel">hide / show Bleepify</a>';
        ctrl=ctrl+ '</div>';
        jQuery(ctrl).appendTo(jQuery("body"));
        jQuery("#bleepifyOpenClose").click(function() {
          jQuery("#bleepifyController").slideToggle();
          return false;
        });
        jQuery('.scale-selector').click(function() {
          jQuery('.scale-selector.active').removeClass('active');
          jQuery(this).addClass("active");
          return false;
        });
        var letBleepifyRun = true;
        jQuery('#runBleepify').click(function() {
          if (!jQuery(this).hasClass('bleepify-running')) {
            jQuery(this).addClass("bleepify-running").html("Stop");
            letBleepifyRun = true;
            var scaleToRun = jQuery(".scale-selector.active").attr("id").replace("bleepify-", "");
            var delayTime = jQuery("#bleepifySecondsBtwn").attr("value") * 1000.0;
            bleepify(jQuery("body"), scales[scaleToRun], delayTime);
          } else {
            cleanupBleepify();
          }
        });

        var scales = {
          "major": [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8],
          "minor": [1, 9/8, 6/5, 4/3, 3/2, 8/5, 9/5],
          "blues": [1, 6/5, 4/3, 45/32, 3/2, 9/5],
          "chromatic": [1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8],
          "arpeggio": [1, 5/4, 3/2],
          "arpeggio7": [1, 5/4, 3/2, 15/8]
        };

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

      function bleepify($el, scale, delayTime) {
        if (!$el.hasClass('alreadyBleeped')) {
          $el.addClass('alreadyBleeped');
          if ($el.filter(":visible").length > 0) {
            setTimeout(function () {
              var formerlyBeeping = jQuery(".bleeping");
              if (formerlyBeeping.length > 0) {
                formerlyBeeping.css("border", formerlyBeeping.data("oldBorder")).removeClass("bleeping");
              }
              $el.addClass("bleeping").data("oldBorder", $el.css("border")).css("border", "1px solid red");
              playSound($el.parents().length, scale);
              bleepifyNextItem($el, scale, delayTime);
            }, delayTime);
          } else {
            bleepifyNextItem($el, scale, delayTime);
          }
        } else {
          bleepifyNextItem($el, scale, delayTime);
        }
      }

      function bleepifyNextItem($el, scale, delayTime) {
        var nextItem;
        if ($el.children().length > 0 && (! $el.hasClass("ancestorsExplored"))) {
          $el.addClass("ancestorsExplored");
          nextItem = $el.children().eq(0);
        } else if ($el.next().length > 0) {
          nextItem = $el.next();
        } else if ($el.parent().length > 0){
          nextItem = $el.parent();
        }
        if ($el.parent().length == 0) {
          cleanupBleepify();
        } else {
          if (letBleepifyRun) {
            bleepify(nextItem, scale, delayTime);
          } else {
            cleanupBleepify();
          }
        }
      }

      function cleanupBleepify() {
        jQuery(".ancestorsExplored").removeClass("ancestorsExplored");
        jQuery(".alreadyBleeped").removeClass("alreadyBleeped");
        var formerlyBeeping = jQuery(".bleeping");
        if (formerlyBeeping.length > 0) {
          formerlyBeeping.css("border", formerlyBeeping.data("oldBorder")).removeClass("bleeping");
        }
        jQuery("#runBleepify").removeClass("bleepify-running").html("&#9834; Run");
        letBleepifyRun = false;
      }

      // setTimeout(function () {
      //   bleepify(jQuery('body'), major, 100);
      // }, 500);
    })();
  }
})();
