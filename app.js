const recordDom = document.getElementById('record_button');
const listenDom = document.getElementById('listen_button');
const gun = new Gun({ peers: ['https://gunjs-server.herokuapp.com/gun'] });
const secondInterval = 3;

async function record() {
  const mediaStream = await navigator.mediaDevices.getUserMedia({  video: false, audio: true });
  const mediaRecorder = new MediaRecorder(mediaStream, {mimeType:  'video/webm; codecs="opus"'});
  const chunks = []
  mediaRecorder.ondataavailable = (event) => {
    if (event.data) {
      chunks.push(event.data)
      const senderBlob = new Blob(chunks, {type: 'video/webm; codecs="opus"'});
      const reader = new FileReader();
      reader.readAsDataURL(senderBlob); 
      reader.onloadend = async () => {
        const base64data = reader.result;                
        gun.get('liveaudio').put({base64data});
      }
    }
  }
  mediaRecorder.start(secondInterval*1000);
}

async function listen() {
  const audio = new Audio();
  gun.get('liveaudio').on(async ({base64data}) => {
    audio.pause();
    const receiverBlob = await (await fetch(base64data)).blob();
    const url = URL.createObjectURL(receiverBlob);
    const oldTime = audio.currentTime;
    audio.src = url;
    audio.currentTime = oldTime;
    audio.play();
    console.log(audio);
    index++;
  })
}

recordDom.addEventListener('click', record)
listenDom.addEventListener('click', listen)