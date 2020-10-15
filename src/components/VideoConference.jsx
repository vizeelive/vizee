import React from 'react';

const VideoConference = (props) => {
  const jitsiContainerId = 'jitsi-container-id';
  // const [jitsi, setJitsi] = React.useState({});

  // const loadJitsiScript = () => {
  //   let resolveLoadJitsiScriptPromise = null;

  //   const loadJitsiScriptPromise = new Promise((resolve) => {
  //     resolveLoadJitsiScriptPromise = resolve;
  //   });

  //   const script = document.createElement('script');
  //   script.src = 'https://meet.jit.si/external_api.js';
  //   script.async = true;
  //   script.onload = () => resolveLoadJitsiScriptPromise(true);
  //   document.body.appendChild(script);

  //   return loadJitsiScriptPromise;
  // };

  React.useEffect(() => {
    let jitsi;
    const initialiseJitsi = async () => {
      // if (!window.JitsiMeetExternalAPI) {
      //   console.log('JITSI-LOAD');
      //   await loadJitsiScript();
      // }

      jitsi = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName: props.roomName,
        disableInviteFunctions: true,
        parentNode: document.getElementById(jitsiContainerId),
        userInfo: {
          email: props?.user?.email,
          displayName: props?.user?.name
        }
      });

      // setJitsi(_jitsi);
    };
    console.log('JITSI-ON');
    initialiseJitsi();

    return () => { console.log('JITSI-OFF'); return jitsi?.dispose?.() };
  }, [props]);

  return <div id={jitsiContainerId} style={{ height: 500, width: '100%' }} />;
};

export default React.memo(VideoConference, () => true);
