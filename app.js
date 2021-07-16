const recordDom = document.getElementById('record_button');
const listenDom = document.getElementById('listen_button');
const gun = new Gun({ peers: ['https://gunjs-server.herokuapp.com/gun'] });
const secondInterval = 3;

async function record() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    const mediaRecorder = new MediaRecorder(mediaStream);
    const chunks = []
    mediaRecorder.ondataavailable = (event) => {
      if (event.data) {
        chunks.push(event.data)
        const senderBlob = new Blob(chunks);
        const reader = new FileReader();
        reader.readAsDataURL(senderBlob); 
        reader.onloadend = async () => {
          const base64data = reader.result;                
          gun.get('liveaudio').put({base64data});
        }
      }
    }
    mediaRecorder.start(secondInterval*1000);
  } catch(error) {
    alert(error)
  }
}

async function listen() {
  try {
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
  } catch(error) {
    alert(error)
  }
}

recordDom.addEventListener('click', record)
listenDom.addEventListener('click', listen)