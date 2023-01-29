$(function () {
  $.post(
    BEHANDLARE_URL + "/conference/get_jwt_token/" + meetingid,
    function (response) {
      // console.log(JSON.parse(response));
      var resp = JSON.parse(response);
      init_jitsi(resp.domain, resp.jwt, meetingid);
      /* Take in time */
    }
  );
});

let isJitsiVideo = false;

function init_jitsi(domain, jwt, room) {
  if (!isJitsiVideo && api == undefined) {
    console.log("update session userrrr3");

    var domain = domain + ":8443";
    console.log(domain);
	var options = {
        roomName: room,
        jwt: jwt,
		userInfo: {
       		displayName: document.getElementById("user").value,
   		},
        parentNode: document.querySelector('#meet'),
        // parentNode: undefined,
        configOverwrite: {
            
            fileRecordingsEnabled: false,
            liveStreamingEnabled: false,

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
                'microphone', 'camera', 'hangup','chat','desktop', 'settings', 'raisehand','tileview'
            ],
            
        },
        interfaceConfigOverwrite: {
            HIDE_INVITE_MORE_HEADER: true,
            MOBILE_APP_PROMO: false,
            SHOW_JITSI_WATERMARK: false,
            TOOLBAR_ALWAYS_VISIBLE: false,
            TOOLBAR_BUTTONS: ['hangup','microphone', 'chat','desktop', 'camera', 'settings', 'raisehand','tileview']
        }
    }
    // var options = {
    //   roomName: room,
    //   jwt: jwt,
    //   userInfo: {
    //     displayName: document.getElementById("user").value,
    //   },
    //   parentNode: document.querySelector("#meet"),
    //   // parentNode: undefined,
    //   configOverwrite: {
    //     startWithVideoMuted: false,
    //     fileRecordingsEnabled: false,
    //     liveStreamingEnabled: true,
    //     desktopSharingFirefoxDisabled: false,
    //     desktopSharingChromeDisabled: false,
    //     disableInviteFunctions: true,
    //     doNotStoreRoom: true,
    //     // UI
    //     disableResponsiveTiles: true,
    //     hideLobbyButton: false,
    //     requireDisplayName: true,
    //     disableShortcuts: true,
    //     enableClosePage: false,
    //     disable1On1Mode: true,
    //     toolbarButtons: [
    //       "microphone",
    //       "camera",
    //       "screenshare",
	// 	  "livestreaming",
    //       "hangup",
    //       "chat",
    //       "sharedvideo",
    //       "settings",
    //       "raisehand",
    //       "tileview",
    //     ],
    //   },
    //   interfaceConfigOverwrite: {
    //     HIDE_INVITE_MORE_HEADER: true,
    //     MOBILE_APP_PROMO: false,
    //     SHOW_JITSI_WATERMARK: false,
    //     TOOLBAR_ALWAYS_VISIBLE: false,
    //     TOOLBAR_BUTTONS: [
    //       "hangup",
    //       "microphone",
    //       "screenshare",
	// 	  "livestreaming",
    //       "chat",
    //       "camera",
    //       "settings",
    //       "raisehand",
    //       "tileview",
    //     ],
    //   },
    // };
    var api = new JitsiMeetExternalAPI(domain, options);
    if (api == undefined) {
      console.error("Failed to load Jitsi AP");
    }

    api.addEventListener("readyToClose", function () {
      console.log("call hung up fron add Event Listener Event");
      var sessionName = meetingid;
      return new Promise((resolve) => {
        $.post(
          BEHANDLARE_URL + "conference/check_leave_status/" + sessionName,
          function (resp) {
            // resolve(resp)
            (window.location.href =
              BEHANDLARE_URL + "/conference/attend/" + meetingid),
              true;
          }
        );
      });
      // alert('call hung up fron add Event Listener Event');
    });
    /* Meeting Close */

    api.on("participantJoined", (event) => {
      $("#overlay").addClass("d-none");
      // alert(event.displayName);
    });

    isJitsiVideo = true;
  }
  if (isJitsiVideo) {
    updateCurrUsers();
  }
}

function updateCurrUsers() {
  console.log("update session userrrr hej");
  var pid = document.getElementById("psid").value;
  $.post(
    BEHANDLARE_URL + "conference/update_session_user/",
    {
      sess: meetingid,
      p: pid,
    },
    function (resp) {}
  );
}

function close_sess() {
  return new Promise((resolve) => {
    $.post(
      BEHANDLARE_URL + "conference/complete_sesion/" + meetingid,
      function (resp) {
        resolve(resp);
      }
    );
  });
}
