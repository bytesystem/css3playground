if (typeof console === "undefined") {
  console = {
    log: function() {},
    debug: function() {}
  };
}

var csspl = (function(csspl) {
  var $win = $(window),
      $doc = $(document),
      $body = $doc.find("body"),
      subscriptions = {},
      rpc;
  
  var __subscribe = function(events, cb, once) {
    _(events.replace(/(\s)\s*/g, "$1").split(" ")).forEach(function(e) {
      subscriptions[e] || (subscriptions[e] = []);
      subscriptions[e].push({ cb: cb, once: once });
    });
  };
  
  csspl.subscribe = function(e, cb) {
    __subscribe(e, cb, false);
  };
  
  csspl.subscribeOnce = function(e, cb) {
    __subscribe(e, cb, true);
  };
  
  csspl.publish = function(events) {
    var args = Array.prototype.slice.call(arguments, 1);
    _(events.replace(/(\s)\s*/g, "$1").split(" ")).forEach(function(e) {
      _(subscriptions[e] && subscriptions[e]).forEach(function(obj, index) {
        obj.cb && obj.cb.apply(this, args);
        obj.once && subscriptions[e].splice(index, 1);
      });
    });
  };
  
  csspl.widget = function(name, fn) {
    csspl[name] = fn($win, $doc);
  };
  
  var ajax = function(type, url, data, success, rpc) {
    var progress = setTimeout(function() { $body.addClass("progress") }, 500);
    
    $.ajax({
      type: type,
      url: url,
      data: data,
      success: function() {
        clearTimeout(progress);
        $body.removeClass("progress");
        success.apply(this, arguments);
      },
      error: function() {
        clearTimeout(progress);
        $body.removeClass("progress");
      }
    });
  };
  
  csspl.get = function(url, data, success) {
    if (typeof data === "function") {
      success = data;
      data = {};
    }
    ajax("GET", url, data, success, false);
  };
  
  csspl.post = function(url, data, success, sslurl) {
    if (sslurl) {
      console.log("make sslrequest")
      var sslready = function() { rpc.post(url, data, success); };
      rpc ? sslready() : (rpc = csspl.sslbridge.consumer(sslurl, function() { sslready(); }));
    } else {
      ajax("POST", url, data, success, false);
    }
  };
  
  csspl.start = function() {
    csspl.publish("csspl:ready", $doc);
  };
  
  $(window).on("load",function() {
    csspl.publish("csspl:load", $doc);
  });
  
  return csspl;
})(typeof csspl === "undefined" ? {} : csspl);

$(function() {
  csspl.start();
});
