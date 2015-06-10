$(document).ready(function(){
    $('button#submit').click(function(){
        event.preventDefault();
        var data = $("#form").serializeArray();
        $.post("post/", data, function(){
            console.log("success");
        });
    });
});
