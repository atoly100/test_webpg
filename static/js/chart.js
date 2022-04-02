anychart.onDocumentReady(function() {
    var log = document.getElementById("log").innerText
    var log2 = document.getElementById("log2").innerText
    var log3 = document.getElementById("log3").innerText

    // set the data
    var data = [
        {x: "Sensor 1", value: log},
        {x: "Sensor 2", value: log2},
        {x: "Sensor 3", value: log3},
    ];

    // create the chart
    var chart = anychart.pie();

    // set the chart title
    chart.title("Population by Race for the United States: 2010 Census");

    // add the data
    chart.data(data);

    // display the chart in the container
    chart.container('chart');
    chart.draw();

});
