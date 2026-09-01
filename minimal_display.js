console.log("MINIMAL DISPLAY START");
import * as Inochi2D from './main.js';
import * as THREE from 'three';
console.log("IMPORT OK");
console.log("Inochi2D:", Inochi2D);
console.log("THREE:", THREE);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  -1500,
  1500,
  1500,
  -1500,
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
renderer.render(scene, camera);
console.log("THREE CANVAS CREATED");
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
    renderer.render(scene, camera);
  } catch (error) {
    console.error("MODEL LOAD ERROR:", error);
  }
}
loadPuppet();
