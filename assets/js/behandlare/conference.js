$(function() {

    // $.noConflict();
    $.post(BEHANDLARE_URL+'conference/gua', function(response) {
        if (response == 'error') {
            $('.modal_cng_brow').modal("show");
        }
    });

    let reco_sess = sessionStorage.getItem("recommondation")
    if(typeof(reco_sess) !== 'undefined')
    {
        if(reco_sess != 'yes')
        {
            setTimeout(function(){ 
                if (window.innerWidth < 800) {
                    if(window.sessionStorage) { 
                        sessionStorage.setItem("recommondation", 'yes');
                        $('.recommandModel').modal('show');
                    }
                }
            }, 3000);
        }
    }
    
    
    $('#notesBtn').on('click',function()
    {
        var meeting_id = $('#meeting_id').html();
        $.post(BEHANDLARE_URL+'conference/get_notes/'+meeting_id, function(response) {
            $('#notesbody').html(response)
        $('#notesModal').modal("show");
    });
    });
});
function Areyousure()
{
    if(confirm('Are you sure you want to end this session ?'))
    {
        $('#feedbackModal').modal('show');
    }
    else
    {
        return false;
    }
}

function form_submit(form) {
    
    $('form#' + form + ' button[type="submit"]').prop('disabled', true);
    $('form#' + form + ' input[type="submit"]').prop('disabled', true);
    var data = new FormData($('#' + form)[0]);
    $.ajax({
        type: "POST",
        url: $('form#' + form).attr('action'),
        data: data,
        mimeType: "multipart/form-data",
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
            var formErrors = $.parseJSON(data);
            if (typeof formErrors == 'object') {
                for (var key in formErrors) {
                    if (formErrors.hasOwnProperty(key)) {
                        if (key == 'success_msg_close_modal') {
                            alert(formErrors[key]);
                            $('#' + form)[0].reset();
                            
                            $('#notesModal').modal('hide');
                        }
                        else if(key == 'success_msg_redirect')
                        {
                            alert(formErrors[key]);
                            location.href=BEHANDLARE_URL+'meetings';
                        }
                        else {
                            // toastr.error('Error', formErrors[key],{timeOut: 3000});
                            alert(formErrors[key]);
                            
                        }
                    }
                }
            }
            $('form#' + form + ' button[type="submit"]').prop('disabled', false);
            $('form#' + form + ' input[type="submit"]').prop('disabled', false);
            return false;
        }
    });
    return false;
}   
        