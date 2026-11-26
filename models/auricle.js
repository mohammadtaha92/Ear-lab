import * as THREE from "../libs/three/three.module.js";

export function createModel(scene) {
  const group = new THREE.Group();

  const skin = new THREE.MeshPhysicalMaterial({
    color: 0xe9a0a0,
    roughness: 0.42,
    clearcoat: 0.38,
  });

  const lightSkin = new THREE.MeshPhysicalMaterial({
    color: 0xf4b8b0,
    roughness: 0.4,
    clearcoat: 0.42,
  });

  const shadow = new THREE.MeshStandardMaterial({
    color: 0xb96f78,
    roughness: 0.58,
  });

  const outline = new THREE.Shape();

  outline.moveTo(-0.25, -1.0);
  outline.bezierCurveTo(-0.85, -0.82, -0.92, 0.05, -0.66, 0.72);
  outline.bezierCurveTo(-0.4, 1.25, 0.35, 1.24, 0.63, 0.76);
  outline.bezierCurveTo(0.88, 0.35, 0.73, -0.34, 0.38, -0.82);
  outline.bezierCurveTo(0.22, -1.04, -0.02, -1.1, -0.25, -1.0);

  const ear = new THREE.Mesh(
    new THREE.ExtrudeGeometry(outline, {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.09,
      bevelThickness: 0.08,
      curveSegments: 28,
    }),
    skin,
  );

  ear.position.z = -0.08;
  group.add(ear);

  const helixCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, -0.78, 0.2),
    new THREE.Vector3(-0.66, -0.28, 0.22),
    new THREE.Vector3(-0.65, 0.42, 0.22),
    new THREE.Vector3(-0.28, 0.93, 0.22),
    new THREE.Vector3(0.25, 0.95, 0.22),
    new THREE.Vector3(0.52, 0.55, 0.22),
    new THREE.Vector3(0.5, 0.05, 0.22),
  ]);

  group.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(helixCurve, 120, 0.095, 16, false),
      lightSkin,
    ),
  );

  const antihelix = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, -0.55, 0.29),
    new THREE.Vector3(-0.18, -0.12, 0.31),
    new THREE.Vector3(0.12, 0.22, 0.31),
    new THREE.Vector3(0.24, 0.63, 0.28),
  ]);

  group.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(antihelix, 70, 0.07, 14, false),
      lightSkin,
    ),
  );

  const concha = new THREE.Mesh(new THREE.SphereGeometry(0.34, 36, 28), shadow);

  concha.position.set(0.22, -0.03, 0.2);
  concha.scale.set(0.72, 1.18, 0.24);
  group.add(concha);

  const tragus = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 28, 20),
    lightSkin,
  );

  tragus.position.set(0.48, -0.28, 0.32);
  tragus.scale.set(0.8, 1.2, 0.75);
  group.add(tragus);

  const lobe = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 32, 24),
    lightSkin,
  );

  lobe.position.set(-0.2, -0.82, 0.13);
  lobe.scale.set(0.95, 0.75, 0.62);
  group.add(lobe);

  group.rotation.y = -0.12;
  group.rotation.z = -0.08;

  scene.add(group);
  return group;
}
