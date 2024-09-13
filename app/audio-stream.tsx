import React, { useEffect, useRef, useState } from 'react';

const AudioComponent: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [responseAudio, setResponseAudio] = useState<string | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    websocketRef.current = new WebSocket('ws://192.168.0.106:8080/call/connection');

    websocketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'audio') {
        setResponseAudio(data.audio);
        // Play the audio response
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.play();
      }
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && websocketRef.current) {
          websocketRef.current.send(event.data);
        }
      };

      mediaRecorderRef.current.start(250); // Send audio data every 250ms
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <button
  className={`px-4 py-2 rounded-md text-white ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
  onClick={isRecording ? stopRecording : startRecording}
>
  {isRecording ? 'Stop Recording' : 'Start Recording'}
</button>
      {responseAudio && <p>Received audio response</p>}
    </div>
  );
};

export default AudioComponent;