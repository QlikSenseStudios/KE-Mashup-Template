//Configuring your Qlik Sense host
var prefix = window.location.pathname.substr(
  0,
  window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1
);
//To define the actual Qlik associative engine connection, which is used when you open an app or get a list of apps. This is covered by the config JavaScript object, used as a parameter in the openApp call.*/
var config = {
  host: window.location.hostname,
  prefix: prefix,
  port: window.location.port,
  isSecure: window.location.protocol === "https:",
};
//To define where the Qlik Sense client side software and extensions should be loaded from. This is achieved by configuring RequireJS with the require.config call and setting the baseUrl.
require.config({
  baseUrl:
    (config.isSecure ? "https://" : "http://") +
    config.host +
    (config.port ? ":" + config.port : "") +
    config.prefix +
    "resources",
});
//Setting the global require and alert. RequireJS is used as a module loader
require(["js/qlik"], function (qlik) {
  qlik.setOnError(function (error) {
    $("#popupText").append(error.message + "<br>");
    $("#popup").fadeIn(1000);
  });
  $("#closePopup").click(function () {
    $("#popup").hide();
  });
  //open apps -- inserted here --
  var app = qlik.openApp("Nutra_Green_Sales_BAStart.qvf", config);
  //window.qlik = qlik;
  //get objects -- inserted here --
  //app.getObject("QVChart02", "Sqf");
  //app.getObject('QVChart01','AgRhJR');
  /*
  app.visualization.get("AgRhJR").then(function (vis) {
    $("#QVChart01").is(":visible") && vis.show("QVChart01");
    $(".nav-tabs > a").on("shown.bs.tab", function () {
      $("#QVChart01").is(":visible") ? vis.show("QVChart01") : vis.close();
      console.log(`First Viz loaded`);
      window.q = vis;
    });
  });
  app.visualization.get("Sqf").then(function (vis) {
    $("#QVChart02").is(":visible") && vis.show("QVChart02");
    $(".nav-tabs > a").on("shown.bs.tab", function () {
      $("#QVChart02").is(":visible") ? vis.show("QVChart02") : vis.close();
      console.log(`Second Viz loaded`);
    });
  });*/
 
  //callbacks -- inserted here --
  
  function KPIHours(reply, app) {
    $("#QVKPI2")[0].innerText =
      reply.qHyperCube.qDataPages[0].qMatrix[0][0].qText;
  }
  function DealsKPI(reply, app) {
    $("#QVKPI1")[0].innerText =
      reply.qHyperCube.qDataPages[0].qMatrix[0][0].qText;
  }
  //create cubes and lists -- inserted here --
  app.createCube(
    {
      qInitialDataFetch: [
        {
          qHeight: 20,
          qWidth: 1,
        },
      ],
      qDimensions: [],
      qMeasures: [
        {
          qDef: {
            qDef: "pick(ceil(log10(sum(LineSalesAmount))/3),\r\n\n          num(sum(LineSalesAmount),'#,##0.0'),\n\n          num(sum(LineSalesAmount)/1000,'#,##0.0 K'),\n\n          num(sum(LineSalesAmount)/1000000,'#,##0.0 M')\n\n     )   & ''",
          },
          qLabel: "Deals",
          qLibraryId: null,
          qSortBy: {
            qSortByState: 0,
            qSortByFrequency: 0,
            qSortByNumeric: 0,
            qSortByAscii: 1,
            qSortByLoadOrder: 0,
            qSortByExpression: 0,
            qExpression: {
              qv: " ",
            },
          },
        },
      ],
      qSuppressZero: false,
      qSuppressMissing: false,
      qMode: "S",
      qInterColumnSortOrder: [],
      qStateName: "$",
    },
    DealsKPI
  );
  app.createCube(
    {
      qInitialDataFetch: [
        {
          qHeight: 20,
          qWidth: 1,
        },
      ],
      qDimensions: [],
      qMeasures: [
        {
          qDef: {
            qDef: "Count(Country)",
          },
          qLabel: "Count(Country)",
          qLibraryId: null,
          qSortBy: {
            qSortByState: 0,
            qSortByFrequency: 0,
            qSortByNumeric: 0,
            qSortByAscii: 1,
            qSortByLoadOrder: 0,
            qSortByExpression: 0,
            qExpression: {
              qv: " ",
            },
          },
        },
      ],
      qSuppressZero: false,
      qSuppressMissing: false,
      qMode: "S",
      qInterColumnSortOrder: [],
      qStateName: "$",
    },
    KPIHours
  );
  //Grab Current Selections
  app.getList("SelectionObject", function (reply) {
    $selections = $("#currSelections");
    $selections.html("");
    //Setting Starting variable
    var selectionsObject = reply.qSelectionObject.qSelections;
    var selectionsObjectlength = reply.qSelectionObject.qSelections.length;
    //console.log(reply.qSelectionObject.qSelections.length);
    //Total Selections Badge
    var initialValue = 0;
    var totalSelections = selectionsObject.reduce(function (acc, cur) {
      return acc + cur.qSelectedCount;
    }, initialValue);
    if (totalSelections == 0) {
      $(".notification .badge").hide();
    } else {
      $(".notification .badge").show().html(selectionsObjectlength);
    }
    //Loop through selections and append to modal
    $.each(selectionsObject, function (key, value) {
      //Setting Starting variables
      var field = value.qField;
      var numSelected = value.qSelectedCount;
      var total = value.qTotal;
      var threshold = 3;
      var selectedStr = value.qSelected;
      if (numSelected <= threshold) {
        var html = "";
        html += "<span class='selected-field-container' id='" + field + "'>";
        html += "<span class='selected-field'>" + field + ": </span>";
        html += selectedStr;
        html += "<span class='clear-field'>X</span>";
        html += "</span>";
        $selections.append(html);
      } else {
        var html = "";
        html += "<span class='selected-field-container' id='" + field + "'>";
        html += "<span class='selected-field'>" + field + ": </span>";
        html += numSelected + " of " + total;
        html += "<span class='clear-field'>X</span>";
        html += "</span>";
        $selections.append(html);
      }
    });
    //Clear selection
    $(".clear-field").click(function () {
      var field = $(this).parent().attr("id");
      app.field(field).clear();
    });
  });
  //selections Navigation
  $("[data-control]").click(function () {
    var $element = $(this);
    switch (
      $element.data("control") ////we are targeting that element using jquery
    ) {
      case "clear":
        app.clearAll();
        break;
      case "back":
        app.back();
        break;
      case "forward":
        app.forward();
        break;
    }
  });
  // find the bootstrap tab changing event
  // invoke qlik.resize(); in it
  $('[data-toggle="pill"]').on("shown.bs.tab", function () {
    qlik.resize();
    // Some code you want to run when tab is clicked (before the tab is shown)
  });
  $(".right_menu").on("shown.bs.collapse", function () {
    qlik.resize();
    // Some code you want to run when tab is clicked (before the tab is shown)
  });
  $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
    qlik.resize();
  });
});
