$(document).ready(function(){
    //connect to the socket server.
    console.log("connect to"  + document.domain + ":" + document.port + "/test");
    var socket = io.connect('wss://' + location.host + '/test');
    //var numbers_received = [];
    var numbers = [
        { label: "Sensor 1", value: 0 },
        { label: "Sensor 2", value: 0 },
        { label: "Sensor 3", value: 0 },
        { label: "Sensor 4", value: 0 },
        { label: "Sensor 5", value: 0 },
        { label: "Sensor 6", value: 0 },
    ];

    // create the chart
    var chart = anychart.pie();

    chart_redraw = function() {
        console.log("chart_redraw called");

        // set the chart title
        chart.title("Accumulated Volume (in mL)");

        // add the data
        var data = [];
        for (i = 0; i < 6; i++) {
            data.push({ x: numbers[i].label, value: numbers[i].value});
        }

        chart.data(data);

        // set legend position
        chart.legend().position("right");
        // set items layout
        chart.legend().itemsLayout("vertical");

        // display the chart in the container
        chart.container('chart');
        chart.draw();

        var sorted_numbers = [];
        numbers.forEach(function(a) { sorted_numbers.push({ label: a.label, value: a.value}); });
        sorted_numbers.sort(function(a, b){ return a.value - b.value; }).reverse();
        get_label = function(n) { return n.label + ": " + n.value; }

        for (i = 0; i < sorted_numbers.length; i++) {
            $("#id_0" + (i + 1)).text(get_label(sorted_numbers[i]));
    }

    // redraw chart every 5 seconds
    setInterval(chart_redraw, 5000);

    //receive details from server
    for (i = 0; i < numbers.length; i++) {
        socket.on("newnumber" + (i + 1), function(msg) {
        console.log("Received number " + (i + 1) + " " + msg);
        numbers[i].value = parseInt(msg.number);
        $("#log" + (i + 1)).attr("placeholder", numbers[i].label + ": " + numbers[i].value).blur();
    });
});
