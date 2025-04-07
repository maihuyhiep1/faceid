import React, { useRef, useState, useEffect } from 'react';
import { getEmbeddingFromImageData } from '../onnx/faceModel';

export default function EnrollFace({ userId }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function start() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
    }
    start();
  }, []);
  
  const capture = () => {
    const width = 160, height = 160;
    const ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);
    const floatData = new Float32Array(width * height * 3);
    for (let i = 0; i < width * height; i++) {
      floatData[i] = data[i*4] / 255;
      floatData[i + width*height] = data[i*4+1] / 255;
      floatData[i + 2*width*height] = data[i*4+2] / 255;
    }
    return floatData;
  };

  const handleEnroll = async () => {
    setStatus('Processing...');
    const imgData = capture();
    const emb = await getEmbeddingFromImageData(imgData);
    localStorage.setItem(`faceid_${userId}`, JSON.stringify(Array.from(emb)));
    setStatus('Enrolled successfully!');
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <video ref={videoRef} width={160} height={160} className="border" />
      <canvas ref={canvasRef} width={160} height={160} style={{ display: 'none' }} />
      <button onClick={handleEnroll} className="px-4 py-2 bg-green-500 text-white rounded">Enroll Face</button>
      <div>{status}</div>
    </div>
  );
}
