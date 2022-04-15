$(document).ready(function(){
    //connect to the socket server.
    console.log("connect to"  + document.domain + ":" + document.port + "/test");
    var socket = io.connect('wss://' + location.host + '/test');
    //var numbers_received = [];
    var num1 = 0;
    var num2 = 0;
    var num3 = 0;
    var num4 = 0;
    var num5 = 0;
    var num6 = 0;

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
            { x: "Sensor 4", value: num4 },
            { x: "Sensor 5", value: num5 },
            { x: "Sensor 6", value: num6 },
        ];
        chart.data(data);

        // set legend position
        chart.legend().position("right");
        // set items layout
        chart.legend().itemsLayout("vertical");

        chart.height("800px");

        // display the chart in the container
        chart.container('chart');
        chart.draw();

        var numbers = [ num1, num2, num3, num4, num5, num6 ].sort().reverse();
        get_label = function(n) {
            if (n == num1) return "Sensor 1: " + n;
            if (n == num2) return "Sensor 2: " + n;
            if (n == num3) return "Sensor 3: " + n;
            if (n == num4) return "Sensor 4: " + n;
            if (n == num5) return "Sensor 5: " + n;
            if (n == num6) return "Sensor 6: " + n;
        }

        $("#id_01").text(get_label(numbers[0]));
        $("#id_02").text(get_label(numbers[1]));
        $("#id_03").text(get_label(numbers[2]));
        $("#id_04").text(get_label(numbers[3]));
        $("#id_05").text(get_label(numbers[4]));
        $("#id_06").text(get_label(numbers[5]));
    }

    // redraw chart every 5 seconds
    setInterval(chart_redraw, 5000);

    //receive details from server
    socket.on('newnumber', function(msg) {
        console.log("Received number 1" + msg);
        num1 = msg.number;
        $('#log').attr("placeholder", "Sensor 1: " + num1).blur();
    });

    socket.on('newnumber2', function(msg) {
        console.log("Received number 2" + msg);
        num2 = msg.number;
        $('#log2').attr("placeholder", "Sensor 2: " + num2).blur();
    });

    socket.on('newnumber3', function(msg) {
        console.log("Received number 3" + msg);
        num3 = msg.number;
        $('#log3').attr("placeholder", "Sensor 3: " + num3).blur();
    });

    socket.on('newnumber4', function(msg) {
        console.log("Received number 4" + msg);
        num4 = msg.number;
        $('#log4').attr("placeholder", "Sensor 4: " + num4).blur();
    });

    socket.on('newnumber5', function(msg) {
        console.log("Received number 5" + msg);
        num5 = msg.number;
        $('#log5').attr("placeholder", "Sensor 5: " + num5).blur();
    });

    socket.on('newnumber6', function(msg) {
        console.log("Received number 6" + msg);
        num6 = msg.number;
        $('#log6').attr("placeholder", "Sensor 6: " + num6).blur();
    });

});
