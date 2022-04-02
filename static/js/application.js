
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

    // set the chart title
    chart.title("Population by Race for the United States: 2010 Census");

    // add the data
    var data = [
        { x: "Sensor 1", value: num1 },
        { x: "Sensor 2", value: num2 },
        { x: "Sensor 3", value: num3 },
    ];
    chart.data(data);

    // display the chart in the container
    chart.container('chart');
    chart.draw();

    chart_redraw = function() {
        console.log("chart_redraw: n1 = " + num1 + " n2 = " + num2 + " n3 = " + num3)
        chart.draw();
    }

    //receive details from server
    socket.on('newnumber', function(msg) {
        console.log("Received number" + msg);
        num1 = msg.number;
        $('#log').html(num1);
        chart_redraw();
    });

    socket.on('newnumber2', function(msg) {
        console.log("Received number" + msg);
        num2 = msg.number;
        $('#log2').html(num2);
        chart_redraw();
    });

    console.log("just before newnumber3")
    socket.on('newnumber3', function(msg) {
        console.log("Received number" + msg);
        num3 = msg.number;
        $('#log3').html(num3);
        chart_redraw();
    });
});
