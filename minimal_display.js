console.log("MINIMAL DISPLAY START");
import * as Inochi2D from './main.js';
import * as THREE from 'three';
const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 3000;
const cameraHeight = cameraWidth / aspectRatio;
const camera = new THREE.OrthographicCamera(
  -cameraWidth / 2,
  cameraWidth / 2,
  cameraHeight / 2,
  -cameraHeight / 2,
  0.01,
  10000
);
camera.position.set(0, 0, 500);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(
  window.innerWidth,
  window.innerHeight
);
document.body.appendChild(renderer.domElement);
console.log("THREE READY");
async function loadPuppet() {
  console.log("LOADING MODEL...");
  try {
    const puppet =
      await Inochi2D.INP.inImportFromURL('./model.inp');
    console.log("MODEL LOADED:", puppet);
    Inochi2D.Renderer.renderPuppet(
      puppet,
      scene,
      camera,
      renderer
    );
    console.log("MODEL RENDERED");
    animate();
  } catch (error) {
    console.error("MODEL LOAD ERROR:", error);
  }
}
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
loadPuppet();
