$(document).ready(function(){
    //connect to the socket server.
    console.log("connect to"  + document.domain + ":" + document.port + "/test");
    var socket = io.connect('wss://' + location.host + '/test');
    //var numbers_received = [];
    var num1 = 0;
    var num2 = 0;
    var num3 = 0;

    // create the chart
    var chart = anychart.pie();

    chart_redraw = function() {
        console.log("chart_redraw called");

        // set the chart title
        chart.title("Accumulated Volume (in mL)");

        // add the data
        var data = [
            { x: "Sensor 1", value: num1 },
            { x: "Sensor 2", value: num2 },
            { x: "Sensor 3", value: num3 },
        ];
        chart.data(data);

        // set legend position
        chart.legend().position("right");
        // set items layout
        chart.legend().itemsLayout("vertical");

        // display the chart in the container
        chart.container('chart');
        chart.draw();
    }

    // redraw chart every 5 seconds
    setInterval(chart_redraw, 5000);

    //receive details from server
    socket.on('newnumber', function(msg) {
        console.log("Received number 1" + msg);
        num1 = msg.number;
        $('#log').attr("placeholder", "Sensor 1:       " + num1).blur();
    });

    socket.on('newnumber2', function(msg) {
        console.log("Received number 2" + msg);
        num2 = msg.number;
        $('#log2').attr("placeholder", "Sensor 2:       " + num2).blur();
    });

    socket.on('newnumber3', function(msg) {
        console.log("Received number 3" + msg);
        num3 = msg.number;
        $('#log3').attr("placeholder", "Sensor 3:       " + num3).blur();
    });
});
