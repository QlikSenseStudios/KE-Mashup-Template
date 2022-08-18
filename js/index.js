/* var prefix = window.location.pathname.substr(
  0,
  window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1
);

var config = {
  host: window.location.hostname,
  prefix: prefix,
  port: window.location.port,
  isSecure: window.location.protocol === "https:"
};

var app;

var appRequire = require.config({
  context: "appRequire",
  baseUrl: "./",
  paths: {
    jquery: "https://code.jquery.com/jquery-3.3.1.min",
    jqueryui: "https://code.jquery.com/ui/1.12.1/jquery-ui.min",
    bootstrap:
      "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min",
    bootstrapSelect:
      "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/js/bootstrap-select.min"
  },
  shim: {
    jqueryui: {
      deps: ["jquery"]
    },
    bootstrap: {
      deps: ["jquery", "jqueryui"]
    },
    bootstrapSelect: {
      deps: ["jquery", "jqueryui", "bootstrap"]
    }
  }
});

require.config({
  baseUrl:
    (config.isSecure ? "https://" : "http://") +
    config.host +
    (config.port ? ":" + config.port : "") +
    config.prefix +
    "resources"
});

require(["js/qlik"], function(qlik) {
  //callbacks -- inserted here --
  //open apps -- inserted here --

  // EXPORTING QLIK TO GLOBAL SCOPE
  window.qlik = qlik;
  // EXPOERTING APP TO GLOBAL SCOPE
  window.app = app;

  function AppUi(app) {
    //Require app.js
    require({ context: "appRequire" }, ["app/app.js"]);
  }

  //get objects -- inserted here --

  if ( app ) {
    new AppUi( app )
  }

}); */


require.config({
  baseUrl: 'lib',
  paths: {
    jquery: "../js/jquery.slim.min",
    bootstrap:"../js/bootstrap.bundle.min"
  },
  shim: {
    bootstrap: {
      deps: ["jquery"]
    }
  }
});

require(['../app/app.js'])


$(document).ready(function () {
    /**** JS logic for Menu Icon  *****/
    $(".hamburger .hamburger__inner").click(function () {
      $(".wrapper").toggleClass("active")
    })
    /**** JS logic for Filter Pane *****
    Refer https://as-tx.github.io/bootstrap-off-canvas-sidebar/offset-overlay-full-demo.html#
    ****/
    var bsDefaults = {
      offset: false,
      overlay: true,
      width: '30%'
    },
      bsMain = $('.bs-offset-main'),
      bsOverlay = $('.bs-canvas-overlay');
    $('[data-toggle="canvas"][aria-expanded="false"]').on('click', function () {
      var canvas = $(this).data('target'),
        opts = $.extend({}, bsDefaults, $(canvas).data()),
        prop = $(canvas).hasClass('bs-canvas-right') ? 'margin-right' : 'margin-left';
      if (opts.width === '100%')
        opts.offset = false;
      $(canvas).css('width', opts.width);
      if (opts.offset && bsMain.length)
        bsMain.css(prop, opts.width);
      $(canvas + ' .bs-canvas-close').attr('aria-expanded', "true");
      $('[data-toggle="canvas"][data-target="' + canvas + '"]').attr('aria-expanded', "true");
      if (opts.overlay && bsOverlay.length)
        bsOverlay.addClass('show');
      return false;
    });
    $('.bs-canvas-close, .bs-canvas-overlay').on('click', function () {
      var canvas, aria;
      if ($(this).hasClass('bs-canvas-close')) {
        canvas = $(this).closest('.bs-canvas');
        aria = $(this).add($('[data-toggle="canvas"][data-target="#' + canvas.attr('id') + '"]'));
        if (bsMain.length)
          bsMain.css(($(canvas).hasClass('bs-canvas-right') ? 'margin-right' : 'margin-left'), '');
      } else {
        canvas = $('.bs-canvas');
        aria = $('.bs-canvas-close, [data-toggle="canvas"]');
        if (bsMain.length)
          bsMain.css({
            'margin-left': '',
            'margin-right': ''
          });
      }
      canvas.css('width', '');
      aria.attr('aria-expanded', "false");
      if (bsOverlay.length)
        bsOverlay.removeClass('show');
      return false;
    });
  })