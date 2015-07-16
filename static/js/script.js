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

function validMail(email){
    var pattern = new RegExp(/^(\w*\d*\.*)*$/);
    return pattern.test(email);
}

function checkMail(){
    var val = $("#email").val();
    $("#email").val(
        val
        .replace("@tu-dortmund.de", "")
        .replace("@udo.edu", "")
    );
    if(!validMail($("#email").val())){
        $("#email").parent().parent().addClass("has-error");
        return false;
    } else {
        $("#email").parent().parent().removeClass("has-error");
        return true;
    }
};

function highlightMissing(){
    $("input.required").each(function(index, input){
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
        if(checkValues(data) && checkMail()) {
            return;
        }
        highlightMissing();
        checkMail();
        event.preventDefault();
    })
    $("#email").change(checkMail);
});
