async function connectToVoice(id) {
  console.log("%c[VOICECLIENT.js]", "color:purple;text-decoration:underline;","Connecting to "+id+"...");
  let audioChunks = [];
  await navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
    let mediaRecorder = new MediaRecorder(stream);
  
    mediaRecorder.addEventListener('dataavailable', function(event) {
      audioChunks.push(event.data);
    });
  
    let isRecording = false;
  
    function startRecording() {
      if (!isRecording) {
        audioChunks.length = 0; // Clear previous audio chunks
        mediaRecorder.start();
        isRecording = true;
      }
    }
  
    function stopRecording() {
      if (isRecording) {
        mediaRecorder.stop();
        isRecording = false;
      }
    }
  
    // Start recording when the user allows access to the microphone
    startRecording();
  
    // Stop recording after a certain duration and start a new recording
    console.log("%c[VOICECLIENT.js]", "color:purple;text-decoration:underline;","Connected!");
    setInterval(function() {
      stopRecording();
      startRecording();
    }, 2000);
  
    setInterval(function() {
      if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioURL = blobToBase64(audioBlob);
        const payload = {
          "type": "voiceTransmit",
          "id": null,
          "data": audioURL,
          "token": localStorage.getItem("token")
        }
        websck.send(JSON.stringify(payload));
  
        // Clear audio chunks for the next recording
        audioChunks.length = 0;
      }
    }, 1000);
  })
  .catch(function(error) {
    console.error('Error accessing microphone:', error);
  });
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(b64) {
  const byteCharacters = atob(b64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type: 'audio/webm'});
  return blob
}

function playback(data) {
  var audio = new Audio(base64ToBlob(data));
  audio.play();
}

let mediaRecorder;
let audioChunks;

//connectToVoice("minecraft")

console.log("%c[VOICECLIENT.js]", "color:purple;text-decoration:underline;","Ready");