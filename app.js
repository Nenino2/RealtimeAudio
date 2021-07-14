import {GunRecorder} from './lib/GunRecorder.js'
import {GunStreamer} from './lib/GunStreamer.js'
import {GunViewer} from './lib/GunViewer.js'

const MIMETYPE_AUDIO_ONLY = 'video/webm; codecs="opus"';
const recordVideoDom = document.getElementById('record_button');
const STREAM_ID = "remote"//Probably need a dynamic one make sure your video id is the same for the viewer

//Configure GunViewer 
var viewer_config = {
  mimeType: MIMETYPE_AUDIO_ONLY,
  streamerId: STREAM_ID,//ID of the streamer
  catchup: false,//Skip to last frame when there is to much loading. Set to false to increase smooth playback but with latency
  debug: true,//For debug logs  
}

var gunViewer = new GunViewer(viewer_config);

//Configure GUN to pass to streamer
var peers = ['https://gunmeetingserver.herokuapp.com/gun'];
var opt = { peers: peers };
var gunDB = Gun(opt);

// Get data from gun and pass along to viewer
gunDB.get(STREAM_ID).on(function (data) {
  gunViewer.onStreamerData(data);
});


//Config for the GUN GunStreamer
var streamer_config = {
  dbRecord: "gunmeeting",//The root of the streams
  streamId: STREAM_ID,//The user id you wanna stream  
  gun: gunDB,//Gun instance
  url: "https://cdn.jsdelivr.net/gh/QVDev/GunStreamer@0.0.9/js/parser_worker.js"
}

const gunStreamer = new GunStreamer(streamer_config)


var recorder_config = {
  mimeType: MIMETYPE_AUDIO_ONLY,
  onDataAvailable: gunStreamer.onDataAvailable,//MediaRecorder data available callback
  cameraOptions: {  video: false, audio: true },
}

//Init the recorder
const gunRecorder = new GunRecorder(recorder_config);

recordVideoDom.addEventListener('click', function() {
    gunRecorder.record();
})