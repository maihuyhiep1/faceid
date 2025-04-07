import React, { useRef, useState, useEffect } from 'react';
import { getEmbeddingFromImageData } from '../onnx/faceModel';

export default function VerifyFace({ userId, threshold = 0.6 }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [result, setResult] = useState('');

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

  const handleVerify = async () => {
    setResult('Processing...');
    const stored = localStorage.getItem(`faceid_${userId}`);
    if (!stored) return setResult('No enrollment data found.');
    const template = new Float32Array(JSON.parse(stored));
    const imgData = capture();
    const emb = await getEmbeddingFromImageData(imgData);
    let sum = 0;
    for (let i = 0; i < emb.length; i++) {
      const d = emb[i] - template[i]; sum += d*d;
    }
    const dist = Math.sqrt(sum);
    setResult(dist < threshold ? 'Verified ✓' : `Failed (dist=${dist.toFixed(3)})`);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <video ref={videoRef} width={160} height={160} className="border" />
      <canvas ref={canvasRef} width={160} height={160} style={{ display: 'none' }} />
      <button onClick={handleVerify} className="px-4 py-2 bg-blue-500 text-white rounded">Verify Face</button>
      <div>{result}</div>
    </div>
  );
}
