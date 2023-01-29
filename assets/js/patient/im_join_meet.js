$(function() {

    $.post(BEHANDLARE_URL + '/immediateconference/get_jwt_token/' + meetingid, function(response) {
        // console.log(JSON.parse(response));
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
            displayName: document.getElementById('user').value
        },
        parentNode: document.querySelector('#meet'),
        // parentNode: undefined,
        configOverwrite: {
            
			startWithVideoMuted: false,
			startWithAudioMuted: false,
            fileRecordingsEnabled: false,
            liveStreamingEnabled: false,
            disableDeepLinking: true,
            disableInviteFunctions: true,
            doNotStoreRoom: true,
            toolbarButtons: ['chat'],
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
            TOOLBAR_BUTTONS: ['hangup','microphone', 'livestreaming', 'camera', 'chat','settings', 'raisehand','filmstrip','tileview']
        }
    }
	console.log("im meeting")
    var api = new JitsiMeetExternalAPI(domain, options);
   
    api.addEventListener('readyToClose',  function(){
            console.log('call hung up fron add Event Listener Event');
            var sessionName = meetingid;
            
                $.post(BEHANDLARE_URL+'/immediateconference/check_leave_status/'+sessionName,function(resp){
                    // resolve(resp)
                    window.location.href = BEHANDLARE_URL+'/immediateconference/startmeeting/'+meetingid,true;
                    
                })
           
            // alert('call hung up fron add Event Listener Event');
            });
            /* Meeting Close */
    
    api.on('participantJoined',(event) => {
        $('#overlay').addClass('d-none');
            // alert(event.displayName);
        
    });

    isJitsiVideo = true;
    
  }
if(isJitsiVideo)
{
    updateCurrUsers();
}	

}

function updateCurrUsers() {
    console.log('update session userrr');
    var pid = document.getElementById('psid').value;
    $.post(BEHANDLARE_URL + '/immediateconference/update_session_user/', {
        sess: meetingid,
        p: pid
    }, function(resp) {

    })
}
