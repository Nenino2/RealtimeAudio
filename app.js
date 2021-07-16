const recordDom = document.getElementById('record_button');
const remoteDom = document.getElementById('remote')

async function record() {
  const mediaStream = await navigator.mediaDevices.getUserMedia({  video: false, audio: true });
  const mediaRecorder = new MediaRecorder(mediaStream, {mimeType:  'video/webm; codecs="opus"'});
  const chunks = []
  mediaRecorder.ondataavailable = (event) => {chunks.push(event.data)}
  mediaRecorder.start(100);

  setTimeout(() => {
    console.log(chunks);
    mediaRecorder.stop();
    const senderBlob = new Blob(chunks, {type: 'video/webm; codecs="opus"'});



    const reader = new FileReader();
    reader.readAsDataURL(senderBlob); 
    reader.onloadend = async () => {
        const base64data = reader.result;                
        console.log(base64data); // data you'll save on gundb
        const receiverBlob = await (await fetch(base64data)).blob();
        console.log(receiverBlob)
        const url = URL.createObjectURL(receiverBlob);
        remoteDom.src = url;

    }
  }, 5000);
}


recordDom.addEventListener('click', record)