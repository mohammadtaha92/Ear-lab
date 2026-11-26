import * as THREE from "../libs/three/three.module.js";
import { OrbitControls } from "../libs/three/jsm/controls/OrbitControls.js";

import { createModel as cochlea } from "../models/cochlea.js";
import { createModel as ossicles } from "../models/ossicles.js";
import { createModel as auricle } from "../models/auricle.js";
import { createModel as eardrum } from "../models/eardrum.js";
import { createModel as canals } from "../models/semicircular-canals.js";
import { createModel as eustachian } from "../models/eustachian-tube.js";

const models = {
  cochlea,
  ossicles,
  auricle,
  eardrum,
  "semicircular-canals": canals,
  "eustachian-tube": eustachian,
};

document.querySelectorAll("canvas[data-model]").forEach((canvas) => {
  const modelName = canvas.dataset.model;
  const createModel = models[modelName];

  if (!createModel) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  scene.add(new THREE.AmbientLight(0xffffff, 1.8));

  const light = new THREE.DirectionalLight(0xffffff, 2.5);
  light.position.set(3, 5, 6);
  scene.add(light);

  const fillLight = new THREE.DirectionalLight(0xb8d8ff, 1.2);
  fillLight.position.set(-4, 1, -3);
  scene.add(fillLight);

  const model = createModel(scene);

  const bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  const sphere = bounds.getBoundingSphere(new THREE.Sphere());

  model.position.sub(center);

  const radius = Math.max(sphere.radius, 0.5);

  camera.position.set(0, 0, radius * 3.4);
  camera.near = radius / 100;
  camera.far = radius * 100;
  camera.updateProjectionMatrix();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom = true;
  controls.minDistance = radius * 1.4;
  controls.maxDistance = radius * 7;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1;
  controls.target.set(0, 0, 0);

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) return;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement);
  resize();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
});
