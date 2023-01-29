$(function() {

    // collects the jwt token and user joins meeting
    $.post(BASE_URL +'/gconferenece/get_jwt_token/' + meetingid + '/' + tkn, function(response) {
        //console.log(JSON.parse(response));
        //console.log('hejsan'); 
        var resp = JSON.parse(response);
        init_jitsi(resp.domain, resp.jwt, meetingid);
        
        /* Take in time */


    });
});

let isJitsiVideo= false;
function init_jitsi(domain, jwt, room) {
    if(!isJitsiVideo && api == undefined) {

    var domain = domain + ":8443";
    var options = {
        roomName: room,
        jwt: jwt,
        userInfo: {
            displayName: document.getElementById('user').value,
            email : document.getElementById('user-email').value,
            /* email: 'email@jitsiexamplemail.com',
            displayName: 'John Doe' */
        },
        parentNode: document.querySelector('#meet'),
        // parentNode: undefined,
        configOverwrite: {
            
            fileRecordingsEnabled: false,
            liveStreamingEnabled: false,
            disableDeepLinking: true,
            disableInviteFunctions: true,
            doNotStoreRoom: true,
            // UI
            disableResponsiveTiles: true,
            hideLobbyButton: false,
            requireDisplayName: true,
            disableShortcuts: true,
            enableClosePage: false,
            disable1On1Mode: true,
            toolbarButtons: [
                'microphone', 'camera', 'hangup','chat', 'settings', 'raisehand','filmstrip','tileview'
            ],
            
        },
        interfaceConfigOverwrite: {
            HIDE_INVITE_MORE_HEADER: true,
            MOBILE_APP_PROMO: true,
            SHOW_JITSI_WATERMARK: false,
            TOOLBAR_ALWAYS_VISIBLE: false,
            TOOLBAR_BUTTONS: ['hangup','microphone', 'camera', 'chat','settings', 'raisehand','filmstrip','tileview']
        }
    }
    var api = new JitsiMeetExternalAPI(domain, options);
   
    api.addEventListener('readyToClose',  function(){
            console.log('call hung up fron add Event Listener Event');
            var sessionName = meetingid;
            
                $.post(BASE_URL+'/immediateconference/check_leave_status/'+sessionName,function(resp){
                    // resolve(resp)
                    //window.location.href = BASE_URL+'/group_conference/'+tkn+'/'+meetingid,true;

                    // Sends the user back to conference_group_meeting
                    window.history.back();
                })
           
            // alert('call hung up fron add Event Listener Event');
            });
            /* Meeting Close */
    
    api.on('participantJoined',(event) => {
        $('#overlay').addClass('d-none');
            // alert(event.displayName);
            //console.warn('participant Joined');
            //console.warn(event);
    });

    isJitsiVideo = true;
    
  }
if(isJitsiVideo)
{
    updateCurrUsers();
}	

}

function updateCurrUsers() {
    console.log('update session userr');
    var pid = document.getElementById('psid').value;
    $.post(BASE_URL + '/gconferenece/update_session_user/', {
        sess: meetingid,
        p: pid,
        tkn:tkn
    }, function(resp) {

    })
}
