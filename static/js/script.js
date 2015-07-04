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
        var data = $(this).serializeArray();
        if(checkValues(data)) {
            return;
        }
        highlightMissing();
        event.preventDefault();
    })
});
