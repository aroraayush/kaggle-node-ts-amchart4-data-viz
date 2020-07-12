$(document).ready(() => {
    $('.select-city').append(`<option value="0">All Stations</option>`);     
    stationData.forEach(element => {
        $('.select-city').append(`<option value="${element["Station code"]}">${element["Station name(district)"]}</option>`);     
    });
    resetDatePicker();
    $(document).on("click",".clear-btn",function() {
        $(this).attr("disabled", true)
        $("#txtFrom").val("");
        $("#txtTo").val("");
        $('.select-city').val(0);
        resetDatePicker();
        chart.data = allStationSummaryData;
        $(this).attr("disabled", false)
    });

    $(document).on("change",".select-city",function() {
        $(this).attr("disabled", true)
        let selectVal = $('.select-city').val();
        if($('#txtFrom').val().trim().length && $('#txtTo').val().trim().length){
            updateChart(stationWiseData[selectVal]);
        }
        else{
            chart.data = selectVal == 0 ? allStationSummaryData : stationWiseData[selectVal]
        }
        $(this).attr("disabled", false)
    });
});

// Create a container child
let chart = am4core.create("chartdiv", am4charts.XYChart);
chart.data = allStationSummaryData;
chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarY = new am4core.Scrollbar();

/* Create axes */
let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 50;
dateAxis.renderer.grid.template.location = 0.5;
dateAxis.startLocation = 0;
dateAxis.endLocation = 0.5;
dateAxis.dataFields.category = "Measurement date";

/* Create value axis */
let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.title.text = "(ppm)";

/* Create series */
let series1 = chart.series.push(new am4charts.LineSeries());
series1.dataFields.valueY = "SO2";
series1.dataFields.dateX = "Measurement date";
series1.name = "SO2";
series1.strokeWidth = 3;
series1.tensionX = 0.7;
// series1.stroke = am4core.color("#ff0000"); // red
series1.tooltipText = "{name}: [bold]{valueY}[/]";

let series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.valueY = "NO2";
series2.dataFields.dateX = "Measurement date";
series2.name = "NO2";
series2.strokeWidth = 3;
series2.tensionX = 0.7;
// series1.stroke = am4core.color("#008000"); // green
series2.tooltipText = "{name}: [bold]{valueY}[/]";

let series3 = chart.series.push(new am4charts.LineSeries());
series3.dataFields.valueY = "O3";
series3.dataFields.dateX = "Measurement date";
series3.name = "O3";
series3.strokeWidth = 3;
series3.tensionX = 0.7;
// series1.stroke = am4core.color("#0000FF"); // blue
series3.tooltipText = "{name}: [bold]{valueY}[/]";

let series4 = chart.series.push(new am4charts.LineSeries());
series4.dataFields.valueY = "CO";
series4.dataFields.dateX = "Measurement date";
series4.name = "CO";
series4.strokeWidth = 3;
series4.tensionX = 0.7;
// series1.stroke = am4core.color("#FFA500"); // orange
series4.tooltipText = "{name}: [bold]{valueY}[/]";

/* Add legend */
chart.legend = new am4charts.Legend();

/* Create a cursor */
chart.cursor = new am4charts.XYCursor();

/* Configure cursor lines */
chart.cursor.lineX.stroke = am4core.color("#808080"); // grey
chart.cursor.lineX.strokeWidth = 4;
chart.cursor.lineX.strokeOpacity = 0.2;
chart.cursor.lineX.strokeDasharray = "";

chart.cursor.lineY.stroke = am4core.color("#808080"); // grey
chart.cursor.lineY.strokeWidth = 4;
chart.cursor.lineY.strokeOpacity = 0.2;
chart.cursor.lineY.strokeDasharray = "";

// Fix axis scale on load
chart.events.on("ready", function(ev) {
    valueAxis.min = valueAxis.minZoomed;
    valueAxis.max = valueAxis.maxZoomed;
});

// Used for Dev Data Set

/* Adding an axis break */
// const axisBreak = valueAxis.axisBreaks.create();
// axisBreak.startValue = 0.15;
// axisBreak.endValue = 0.7;
// axisBreak.breakSize = 0.05;

// axisBreak.events.on("over", () => {
//   axisBreak.animate(
//     [
//       { property: "breakSize", to: 1 },
//       { property: "opacity", to: 0.1 },
//     ],
//     900,
//     am4core.ease.sinOut
//   );
// });
// axisBreak.events.on("out", () => {
//   axisBreak.animate(
//     [
//       { property: "breakSize", to: 0.05 },
//       { property: "opacity", to: 1 },
//     ],
//     900,
//     am4core.ease.quadOut
//   );
// });

updateChart = (data) => {
    if(!$('#txtFrom').val().trim().length || !$('#txtTo').val().trim().length){
        alert('Please fill "From" date before "To" date');
        $("#txtFrom").val("");
        $("#txtTo").val("");
        resetDatePicker();
    }
    else{
        const TIME_START_UNIX = new Date($('#txtFrom').val()).getTime();
        const TIME_QUERY_STOP_UNIX = new Date($('#txtTo').val()).getTime();
        const newSummaryData = _.filter(data,(item) => {
            return _.inRange(
                new Date(item["Measurement date"]).getTime(),
                TIME_START_UNIX, 
                TIME_QUERY_STOP_UNIX + 1
            );
        })
        chart.data = newSummaryData;
    }
}

resetDatePicker = () => {
      $("#txtTo").datepicker({
        numberOfMonths: 1,
        minDate: new Date(2017, 1 - 1, 1),
        maxDate: new Date(2019, 12 - 1, 31),
        defaultDate: new Date(2017, 1 - 1, 1),
        onSelect: function (selected) {
            var dt = new Date(selected);
            dt.setDate(dt.getDate() - 1);
            $("#txtFrom").datepicker("option", "maxDate", dt);
            updateChart(allStationSummaryData);
        }
    });
    $("#txtFrom").datepicker({
        numberOfMonths: 1,
        minDate: new Date(2017, 1 - 1, 1),
        maxDate: new Date(2019, 12 - 1, 31),
        defaultDate: new Date(2017, 1 - 1, 1),
        onSelect: function (selected) {
            var dt = new Date(selected);
            dt.setDate(dt.getDate() + 1);
            $("#txtTo").datepicker("option", "minDate", dt);
        }
    });
    $('#txtTo, #txtFrom').val('').
      datepicker('option', {minDate: new Date(2017, 1 - 1, 1), maxDate: new Date(2019, 12 - 1, 31),defaultDate: new Date(2017, 1 - 1, 1)});
    
}