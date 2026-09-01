import * as Inochi2D from './main.js';
import * as THREE from 'three';

console.log('MINIMAL START');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

camera.position.set(0, 0, 500);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

document.body.appendChild(renderer.domElement);

async function loadPuppet() {
  try {
    console.log('LOADING MODEL...');

    const puppet =
      await Inochi2D.INP.inImportFromURL('./model.inp');

    console.log('MODEL LOADED:', puppet);

    const puppetObject =
      Inochi2D.Renderer.renderPuppet(
        puppet,
        scene,
        camera,
        renderer
      );

    console.log('PUPPET OBJECT:', puppetObject);

    animate();

  } catch (error) {
    console.error('MODEL LOAD ERROR:', error);
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

loadPuppet();
