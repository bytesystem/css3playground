csspl.widget("helloworld", function($win, $doc) {

  csspl.subscribe("csspl:ready ajax:inserted", function($node) {
    console.log("Hello World");
  });
});
