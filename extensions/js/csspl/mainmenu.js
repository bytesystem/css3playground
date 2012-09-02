csspl.widget("mainmenu", function($win, $doc) {

    var Mainmenu = function($node) {

      var $items = $node.find("li"),
          $frame = $node.next().find("iframe");

      $items.on("click", function(){
        
        var $this = $(this),
            url = $this.data("url");
        
        $items.removeClass("active");
        $frame.attr("src",url);
        $this.addClass("active");
        
      });

    };

  csspl.subscribe("csspl:load ajax:inserted", function($node) {
    new Mainmenu($node.find(".js_menu"));
  });

});