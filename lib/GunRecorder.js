export class GunRecorder {
  mediaRecorder = null;
  mediaStream = null;

  constructor(config) {
    this.onDataAvailable = config.onDataAvailable;
    this.recorderOptions = {
      mimeType: config.mimeType
    }
    this.cameraOptions = config.cameraOptions
  }

  async record() {
    this.mediaStream = await navigator.mediaDevices.getUserMedia(this.cameraOptions);
    this.mediaRecorder = new MediaRecorder(this.mediaStream, this.recorderOptions);
    this.mediaRecorder.ondataavailable = this.onDataAvailable;
    this.mediaRecorder.start(1000)
  }
}
