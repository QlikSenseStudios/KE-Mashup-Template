var prefix = window.location.pathname.substr(
  0,
  window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1
);
var config = {
  host: window.location.hostname,
  prefix: prefix,
  port: window.location.port,
  isSecure: window.location.protocol === "https:",
};
require.config({
  baseUrl:
    (config.isSecure ? "https://" : "http://") +
    config.host +
    (config.port ? ":" + config.port : "") +
    config.prefix +
    "resources",
});
//Requaire Qlik APIs
require(["js/qlik"], function (qlik) {
  qlik.setOnError(function (error) {
    $("#popupText").append(error.message + "<br>");
    $("#popup").fadeIn(1000);
  });
  $("#closePopup").click(function () {
    $("#popup").hide();
  });
  //open apps -- inserted here --
  //get objects -- inserted here --
  //Grab Current Selections
  app.getList("SelectionObject", function (reply) {
    $selections = $("#currSelections");
    $selections.html("");
    //Setting Starting variable
    var selectionsObject = reply.qSelectionObject.qSelections;
    //console.log(selectionsObject);
    //Total Selections Badge
    var initialValue = 0;
    var totalSelections = selectionsObject.reduce(function (acc, cur) {
      return acc + cur.qSelectedCount;
    }, initialValue);
    if (totalSelections == 0) {
      $(".notification .badge").hide();
    } else {
      $(".notification .badge").show().html(totalSelections);
    }
    //Loop through selections and append to modal
    $.each(selectionsObject, function (key, value) {
      //Setting Starting variables
      var field = value.qField;
      var numSelected = value.qSelectedCount;
      var total = value.qTotal;
      var threshold = 5;
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
});
