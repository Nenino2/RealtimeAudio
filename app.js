const recordDom = document.getElementById('record_button');

async function record() {
  const mediaStream = await navigator.mediaDevices.getUserMedia({  video: false, audio: true });
  const mediaRecorder = new MediaRecorder(mediaStream, {mimeType:  'video/webm; codecs="opus"'});
  const chunks = []
  const audio = new Audio();
  const secondInterval = 3;
  mediaRecorder.ondataavailable = (event) => {
    if (event.data) {
      chunks.push(event.data)
      const senderBlob = new Blob(chunks, {type: 'video/webm; codecs="opus"'});
      const reader = new FileReader();
      reader.readAsDataURL(senderBlob); 
      reader.onloadend = async () => {
          const base64data = reader.result;                
          const receiverBlob = await (await fetch(base64data)).blob();
          const url = URL.createObjectURL(receiverBlob);
          audio.src = url;
          audio.play();
          audio.currentTime = (chunks.length-1)*secondInterval
          console.log(audio);
      }
    }
  }
  mediaRecorder.start(secondInterval*1000);
}


recordDom.addEventListener('click', record)