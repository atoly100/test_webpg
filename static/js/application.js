$(document).ready(function(){
    //connect to the socket server.
    console.log("connect to"  + document.domain + ":" + document.port + "/test");
    var socket = io.connect('wss://' + location.host + '/test');
    //var numbers_received = [];
    var numbers = [
        { label: "Sensor 1: ", value: 0 },
        { label: "Sensor 2: ", value: 0 },
        { label: "Sensor 3: ", value: 0 },
        { label: "Sensor 4: ", value: 0 },
        { label: "Sensor 5: ", value: 0 },
        { label: "Sensor 6: ", value: 0 }
    ];

    // create the chart
    var chart = anychart.pie();

    chart_redraw = function() {
        console.log("chart_redraw called");

        // set the chart title
        chart.title("Accumulated Volume (in mL)");

        // add the data
        var data = [
            { x: "Sensor 1", value: numbers[0].value },
            { x: "Sensor 2", value: numbers[1].value },
            { x: "Sensor 3", value: numbers[2].value },
            { x: "Sensor 4", value: numbers[3].value },
            { x: "Sensor 5", value: numbers[4].value },
            { x: "Sensor 6", value: numbers[5].value },
        ];
        chart.data(data);

        // set legend position
        chart.legend().position("right");
        // set items layout
        chart.legend().itemsLayout("vertical");

        // display the chart in the container
        chart.container('chart');
        chart.draw();

        compare_func = function(a, b) { return a.value - b.value; };
        // make a copy of numbers to sorted_numbers to avoid updates affecting sort order
        var sorted_numbers = [];
        numbers.forEach(function(a) { sorted_numbers.push({ label: a.label, value: a.value })});
        sorted_numbers.sort(compare_func).reverse();
        get_label = function(n) { return `${n.label} ${n.value}`; };
        var update_func = function(a, index){ $(`#id_0${index}`).text(get_label(sorted_numbers[index])); };
        sorted_numbers.forEach(update_func);
//        $("#id_01").text(get_label(sorted_numbers[0]));
//        $("#id_02").text(get_label(sorted_numbers[1]));
//        $("#id_03").text(get_label(sorted_numbers[2]));
//        $("#id_04").text(get_label(sorted_numbers[3]));
//        $("#id_05").text(get_label(sorted_numbers[4]));
//        $("#id_06").text(get_label(sorted_numbers[5]));
    }

    // redraw chart every 5 seconds
    setInterval(chart_redraw, 5000);

    //receive details from server
    socket.on('newnumber', function(msg) {
        console.log("Received number 1" + msg);
        numbers[0].value = parseInt(msg.number);
        $('#log').attr("placeholder", "Sensor 1: " + msg.number).blur();
    });

    socket.on('newnumber2', function(msg) {
        console.log("Received number 2" + msg);
        numbers[1].value = parseInt(msg.number);
        $('#log2').attr("placeholder", "Sensor 2: " + msg.number).blur();
    });

    socket.on('newnumber3', function(msg) {
        console.log("Received number 3" + msg);
        numbers[2].value = parseInt(msg.number);
        $('#log3').attr("placeholder", "Sensor 3: " + msg.number).blur();
    });

    socket.on('newnumber4', function(msg) {
        console.log("Received number 4" + msg);
        numbers[3].value = parseInt(msg.number);
        $('#log4').attr("placeholder", "Sensor 4: " + msg.number).blur();
    });

    socket.on('newnumber5', function(msg) {
        console.log("Received number 5" + msg);
        numbers[4].value = parseInt(msg.number);
        $('#log5').attr("placeholder", "Sensor 5: " + msg.number).blur();
    });

    socket.on('newnumber6', function(msg) {
        console.log("Received number 6" + msg);
        numbers[5].value = parseInt(msg.number);
        $('#log6').attr("placeholder", "Sensor 6: " + msg.number).blur();
    });

});