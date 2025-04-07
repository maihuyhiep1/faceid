import { InferenceSession, Tensor } from 'onnxruntime-web';
let session = null;
export async function initFaceModel() {
  if (session) return session;
  session = await InferenceSession.create(
    process.env.PUBLIC_URL + '/models/face_security.onnx',
    { executionProviders: ['wasm'], graphOptimizationLevel: 'all' }
  );
  return session;
}
export async function getEmbeddingFromImageData(imageData) {
  const sess = await initFaceModel();
  const inputTensor = new Tensor('float32', imageData, [1, 3, 160, 160]);
  const outputMap = await sess.run({ input: inputTensor });
  return outputMap.output.data;
}