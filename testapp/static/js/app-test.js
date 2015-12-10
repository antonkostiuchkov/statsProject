$(document).ready(function() {
    var options = {
        interval: "month",
        limit: "1"
    };

    // $.getJSON('/query/' + options.interval + '/' + options.limit + '/', function(data, jqXHR){

    // });

    var url = '/query/' + options.interval + '/' + options.limit + '/';

    $.ajax({
            url: url,
            type: 'GET',
            dataType: 'JSON',
            beforeSend: function () {
                console.log("Still working!");
            },
            success: function (data, jqXHR) {

                console.log("Hurray!");
                console.log(data);
                console.log(options.limit);
            },
            error: function () {
                alert('Service error');
            }
        });

});