csspl.widget("fullscreen", function($win, $doc) {

  csspl.subscribe("csspl:load ajax:inserted", function($node) {
    
    $node.on("click", ".js_fullscreen", function(){
        if ( screenfull ) {
            screenfull.request();
        }
    });
    
  });

});