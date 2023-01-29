$(document).ready(() => {

    var webComponent = document.querySelector('openvidu-webcomponent');
    var form = document.getElementById('main');

    if(webComponent.getAttribute("openvidu-secret") != undefined && webComponent.getAttribute("openvidu-server-url") != undefined ){
        form.style.display = 'none';
        form.className = 'd-none';
        webComponent.style.display = 'block';
    }

    
    webComponent.addEventListener('joinSession', (event) => {
    var interval = setInterval(function(){ getvidele(interval) }, 1000);
        
     });
    webComponent.addEventListener('leaveSession', (event) => {
        // form.style.display = 'block';
        form.className = 'auth-wrapper';
        webComponent.style.display = 'none';
        
        var notesBTN = document.getElementById('notesBtn');
        // alert(notesBTN.getAttribute('title'));
        if(notesBTN.getAttribute('title') == 'behandlare')
        {
            notesBTN.className = 'btn btn-warning mb-4 shadow-1';
        }
        var sessionName = document.getElementById('sessionName').value;
        check_leave_session(sessionName).then((sessionstatus) => {
            if(sessionstatus == 'sessioncompleted')
            {
                var endsessBtn = document.getElementById('endsessBtn');
                endsessBtn.className = 'btn btn-danger mb-4 shadow-1';
            }
        });

       

        /* console.log('leave_session'); */
    });
    webComponent.addEventListener('error', (event) => {
        console.log('Error event', event.detail);
    });
});

function joinSession() {
    var sessionName = document.getElementById('sessionName').value;
    var user = document.getElementById('user').value;
    var form = document.getElementById('main');
    var webComponent = document.querySelector('openvidu-webcomponent');
    var tokens = [];
    var u_type = document.getElementById('u-type').value;
    if(u_type != 'behandlare')
    {
        update_autopublish();
    }
    var audio_sesvar = true;
    /* if(u_type == 'behandlare')
    {
        var audio_sesvar = true;
    }else
    {
        var audio_sesvar = false;
    } */
    // alert(autopublish)
    var ovSettings = {
        chat: true,
        autopublish: false,
        toolbarButtons: {
          audio: audio_sesvar,
          video: true,
          screenShare: false,
          fullscreen: true,
          exit: true,
        }
      };
      

    // form.style.display = 'none';
    /* form.className = 'd-none';
    webComponent.style.display = 'block'; */

    // $('.shadow-2').html('<span class="fa fa-spinner fa-spin" role="status"></span>');
      $('#spinner-text').removeClass('d-none');
    if(webComponent.getAttribute("openvidu-secret") != undefined && webComponent.getAttribute("openvidu-server-url") != undefined ){
        location.reload();
    }else {
        getToken(sessionName).then((token1) => {
            tokens.push(token1);
            getToken(sessionName).then((token2) => {
                tokens.push(token2);
                form.className = 'd-none';
                webComponent.style.display = 'block';
                // $('.shadow-2').html('JOIN NOW');
                $('#spinner-text').addClass('d-none');

                webComponent.sessionConfig = { sessionName, user, tokens, ovSettings };
            });    
        });

        if(tokens)
        {
            setTimeout(function(){ updateCurrUsers(); }, 20000);
        }
    }
}

function getToken(sessionName) {
    return createSession(sessionName).then((sessionId) => createToken(sessionId));
}



function createSession(sessionName)
{
    return new Promise((resolve) => {
        $.ajax({
            type: 'POST',
            url: BEHANDLARE_URL+'conference/get_session/1',
            data: { m1d: sessionName },
            success: function(response){
                resolve(response)
            },
            error: (error) => {
                if (error.status === 409) {
                    resolve(sessionName);
                } else {
                    console.warn('No connection to OpenVidu Server. This may be a certificate error at OpenVidu URL');
                    if (
                        window.confirm(
                            'No connection to OpenVidu Server. This may be a certificate error at  Openvidu URL \n\nClick OK to navigate and accept it. ' +
                                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at Openvidu Server',
                        )
                    ) {
                        var OPENVIDU_SERVER_URL = 'https://demos.openvidu.io'  + ':4443'
                        location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                    }
                }
            }
        });
    });
}

function createToken(sessionId)
{
    
    return new Promise((resolve) => {
        $.ajax({
            type: 'POST',
            url: BEHANDLARE_URL + 'conference/get_tokens/1',
            data: {  sess : sessionId  },
            success: function(resp) {
                // var response1 = JSON.parse(resp);
                resolve(resp.token)
            }  ,
             error: function(error) 
             {
                //  console.log(error);
                 if(error.status == 405)
                 {
                     alert('We are not able to reach the server, Please try again!');
                    window.location.reload();
                 }
                //  alert(sessionId);
                //  getToken(sessionId);
                //  joinSession();
             }
        });
       
    });
} 

function updateCurrUsers()
{
    console.log('update session user');
    var sessionName = document.getElementById('sessionName').value;
    var pid = document.getElementById('psid').value;
    $.post(BEHANDLARE_URL+'conference/update_session_user/',{sess:sessionName,p:pid},function(resp){
        
    })
}

function check_leave_session(sessionName)
{
    return new Promise((resolve)=>{
        $.post(BEHANDLARE_URL+'conference/check_leave_status/'+sessionName,function(resp){
            resolve(resp)
        })
    });
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


function getvidele(interval)
{
    var ele = document.getElementsByTagName("video");
   
    if(ele.length == 1)
    {
        $('.modal_wait').modal('show');
        // console.log(interval);
    }
    else
    {
        $('.modal_wait').modal('hide');
        clearInterval(interval);
    }

}