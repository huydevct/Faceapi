const video = document.getElementById("videoElm");

const loadFaceAPI = async () => {
  await faceapi.nets.faceLandmark68Net.loadFromUri("./models");
  await faceapi.nets.faceRecognitionNet.loadFromUri("./models");
  await faceapi.nets.tinyFaceDetector.loadFromUri("./models");
  await faceapi.nets.faceExpressionNet.loadFromUri("./models");
};

function getCameraStream() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
      video.srcObject = stream;
    });
  }
}

video.addEventListener("playing", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight
  }

  setInterval(async () => {
    const detects = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceExpressions();

    const resizedDetect = faceapi.resizeResults(detects, displaySize);
    canvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
    faceapi.draw.drawDetections(canvas, resizedDetect);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetect);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetect);
  }, 300);
});

loadFaceAPI().then(getCameraStream);
