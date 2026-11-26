import * as THREE from "../libs/three/three.module.js";

export function createModel(scene) {
  const group = new THREE.Group();

  const canalMat = new THREE.MeshPhysicalMaterial({
    color: 0x72c8c0,
    roughness: 0.3,
    clearcoat: 0.8,
  });

  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xd6fff5,
    roughness: 0.35,
  });

  const ampullaMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0a6a7,
    roughness: 0.38,
    clearcoat: 0.55,
  });

  const rings = [
    { r: 0.82, rot: [0.12, 0.05, 0.05], offset: [-0.18, 0.08, 0] },
    { r: 0.72, rot: [1.48, 0.12, 0.1], offset: [0.16, 0.02, 0.02] },
    { r: 0.67, rot: [0.1, 1.45, 0.28], offset: [0, -0.12, -0.06] },
  ];

  rings.forEach((item, index) => {
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(item.r, 0.075, 18, 100),
      canalMat,
    );

    torus.rotation.set(...item.rot);
    torus.position.set(...item.offset);
    group.add(torus);

    const inner = new THREE.Mesh(
      new THREE.TorusGeometry(item.r, 0.018, 10, 100),
      innerMat,
    );

    inner.rotation.copy(torus.rotation);
    inner.position.copy(torus.position);
    group.add(inner);

    const ampulla = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 28, 22),
      ampullaMat,
    );

    ampulla.position.set(
      item.offset[0] + (index - 1) * 0.15,
      item.offset[1] - 0.67,
      item.offset[2] + 0.03,
    );

    ampulla.scale.set(0.9, 1.25, 0.85);
    group.add(ampulla);
  });

  const vestibule = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 36, 28),
    ampullaMat,
  );

  vestibule.scale.set(1.15, 0.82, 0.9);
  vestibule.position.set(0, -0.02, 0);
  group.add(vestibule);

  group.rotation.set(0.18, -0.25, 0.08);

  scene.add(group);
  return group;
}
