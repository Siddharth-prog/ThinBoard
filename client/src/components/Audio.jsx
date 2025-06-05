// client/src/components/Audio.jsx
import React, { useEffect, useState } from 'react';

function Audio({ socket, roomId }) {
  const [stream, setStream] = useState(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
      setStream(mediaStream);
    });
  }, []);

  const toggleMute = () => {
    if (!stream) return;
    stream.getAudioTracks()[0].enabled = muted;
    setMuted(!muted);

    if (!muted) {
      socket.emit('audio-stream', { roomId, audioData: stream });
    }
  };

  return (
    <button onClick={toggleMute} className="bg-purple-500 text-white px-4 py-1 rounded">
      {muted ? 'Unmute' : 'Mute'}
    </button>
  );
}

export default Audio;
