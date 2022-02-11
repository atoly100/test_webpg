
$(document).ready(function(){
    //connect to the socket server.
    console.log("connect to"  + document.domain + ":" + document.port + "/test");
    var socket = io.connect('wss://' + location.host + '/test');
    //var numbers_received = [];
    var num1 = 0;
    var num2 = 0;
    var num3 = 0;

    //receive details from server
    socket.on('newnumber', function(msg) {
        console.log("Received number" + msg);
        num1 = msg.number;
        $('#log').html(num1);
    });

    socket.on('newnumber2', function(msg) {
        console.log("Received number" + msg);
        num2 = msg.number;
        $('#log2').html(num2);
    });

    console.log("just before newnumber3")
    socket.on('newnumber3', function(msg) {
        console.log("Received number" + msg);
        num3 = msg.number;
        $('#log3').html(num3);
    });
});
