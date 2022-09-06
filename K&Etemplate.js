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
  //Logic for Reload Time
  app.getAppLayout().then((e)=>
  {
  console.log('reload time received')
  var reloadTime = e.layout.qLastReloadTime;
	 $('[class="reloadTime"]').text(reloadTime);
  }
  )
  window.qlik = qlik;
  window.app=app;
  //get objects -- inserted here --
	app.getObject('QVChart07','dRmyeqf');
	app.getObject('QVChart06','xLwPNAh');
	app.getObject('QVChart04','vpREJB');
	app.getObject('QVChart05','WrTk');
	app.getObject('QVChart03','wDkVFV');
  //app.getObject("QVChart02", "Sqf");
  //app.getObject('QVChart01','AgRhJR');
  //Once we have dragged and dropped qlik objects on qv placeholders -> we get the qv objects and to use the on/off (to control what viz to show on click of tabs), we switch the code to app.visualization
  app.visualization.get("AgRhJR").then(function (vis) {
    $("#QVChart01").is(":visible") && vis.show("QVChart01");
    $(".nav-tabs > a").on("shown.bs.tab", function () {
      if($("#QVChart01").is(":visible")){
	  vis.show("QVChart01")
	  console.log('QVChart01 shown')
	  }
	  else{
	  vis.close();
	  console.log('QVChart01 removed')
   }
  
      window.q = vis;
    });
	
  });
  app.visualization.get("Sqf").then(function (vis) {
    $("#QVChart01").is(":visible") && vis.show("QVChart02");
    $(".nav-tabs > a").on("shown.bs.tab", function () {
      if($("#QVChart02").is(":visible")){
	  vis.show("QVChart02")
	  console.log('QVChart02 shown')
	  }
	  else{
	  vis.close();
	  console.log('QVChart02 removed')
   }
  
      window.q = vis;
    });
	
  });
  app.getObject("QV10", "DPbBaUJ");
  app.getObject("QV09", "SQuTJpD");
  app.getObject("QV06", "ZLSRZ");
  app.getObject("QV07", "MFpX");
  app.getObject("QV05", "AdxGz");
  app.getObject("QV04", "qPkDqhp");
  app.getObject("QV03", "EqpwebF");
  app.getObject("QV02", "svseAV");
  app.getObject("QV01", "UbLKVfv");
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
  // This is used for resizing qlik charts when the navigation tabs and filter/selections tabs are triggered
  $('a[data-toggle="tab"],[data-toggle="pill"]').on("shown.bs.tab", function () {
  	 console.log('resize')
    qlik.resize();
      });
  // This is used for resizing qlik charts when the filter panel and navigation side bar are triggered
  $('[data-toggle="canvas"][aria-expanded="false"],.bs-canvas-close,.hamburger').on('click', function() {
 
	setTimeout(()=>{ console.log('resize');qlik.resize()}, 500);
   
  });
});
