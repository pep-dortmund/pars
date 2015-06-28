function checkValues(data){
    var required = 0;
    $(data).each(function(index, value){
        if(value.value == ""){
            required = required + 1;
        }
    });
    if(required == 0){
        return true;
    }
    return false;
}

function highlightMissing(){
    $("input.required").each(function(index, input){
        console.log($(input).val());
        if(!$(input).val()){
            $(input).parent().parent().addClass("has-error");
        } else {
            $(input).parent().parent().removeClass("has-error");
        }
    });
}

$(document).ready(function(){
    $("#form").submit(function(){
        event.preventDefault();
        $(".alert").addClass("hidden");
        var data = $(this).serializeArray();
        highlightMissing();
        if(checkValues(data)) {
            console.log("Values ok, sending request");
            var jqxhr = $.post($(this).attr("action"), data, function(){
                console.log("success");
                $("#alert-added-successfully").removeClass("hidden");
            });
            jqxhr.fail(function(data){
                $("#email").parent().parent().addClass("has-error");
                $("#alert-error").removeClass("hidden");
                $("#alert-error div.alert-text").html(data.responseText);
                console.log("Error", data);
            });
        }
    })
});
