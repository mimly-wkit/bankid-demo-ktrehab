$(function() {

    $.post(BEHANDLARE_URL + '/conference/get_jwt_token/' + meetingid, function(response) {
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
        /* userInfo: {
            displayName: document.getElementById('user').value
        }, */
        parentNode: document.querySelector('#meet'),
        // parentNode: undefined,
        configOverwrite: {
            
            fileRecordingsEnabled: false,
            liveStreamingEnabled: true,

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
                'microphone', 'camera', 'livestreaming', 'hangup','chat','desktop', 'settings', 'raisehand','tileview'
            ],
            
        },
        interfaceConfigOverwrite: {
            HIDE_INVITE_MORE_HEADER: true,
            MOBILE_APP_PROMO: false,
            SHOW_JITSI_WATERMARK: false,
            TOOLBAR_ALWAYS_VISIBLE: false,
            TOOLBAR_BUTTONS: ['hangup','microphone','livestreaming', 'chat','desktop', 'camera', 'settings', 'raisehand','tileview']
        }
    }
    var api = new JitsiMeetExternalAPI(domain, options);

    api.addEventListener('readyToClose',  function(){
            console.log('call hung up fron add Event Listener Event');
            var sessionName = meetingid;
            return new Promise((resolve)=>{
                $.post(BEHANDLARE_URL+'conference/check_leave_status/'+sessionName,function(resp){
                    // resolve(resp)
                    window.location.href = BEHANDLARE_URL+'/group_meetings/attend/'+meetingid,true;
                    
                })
            });
            // alert('call hung up fron add Event Listener Event');
            });
            /* Meeting Close */
    
    api.on('participantJoined',(event) => {
        $('#overlay').addClass('d-none');
            //alert(event.displayName);
            //console.warn(api.getParticipantsInfo());
        
    });

    isJitsiVideo = true;
    
  }
if(isJitsiVideo)
{
    updateCurrUsers();
}	
    //users = api.getParticipantsInfo();
    //console.log(users);
    //alert('apiparticipantsinfo');
}

function updateCurrUsers() {
    console.log('update session userr');
    var pid = document.getElementById('psid').value;
    $.post(BEHANDLARE_URL + 'conference/update_session_user/', {
        sess: meetingid,
        p: pid
    }, function(resp) {

    })
}
function close_sess()
{
    return new Promise((resolve)=>{

        $.post(BEHANDLARE_URL+'conference/complete_sesion/'+meetingid,function(resp){
            resolve(resp)
        })
        });
}
