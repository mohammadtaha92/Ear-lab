import * as THREE from "../libs/three/three.module.js";

export function createModel(scene) {
  const group = new THREE.Group();

  const membraneMat = new THREE.MeshPhysicalMaterial({
    color: 0xe9a9a0,
    roughness: 0.48,
    clearcoat: 0.85,
    side: THREE.DoubleSide,
  });

  const rimMat = new THREE.MeshPhysicalMaterial({
    color: 0xc77d7e,
    roughness: 0.38,
    clearcoat: 0.7,
  });

  const boneMat = new THREE.MeshPhysicalMaterial({
    color: 0xf3d3a0,
    roughness: 0.4,
    clearcoat: 0.5,
  });

  const highlightMat = new THREE.MeshStandardMaterial({
    color: 0xffd9ce,
    roughness: 0.4,
  });

  const segments = 96;
  const rings = 32;
  const vertices = [];
  const indices = [];

  for (let j = 0; j <= rings; j++) {
    const v = j / rings;
    const radius = v;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;

      const x = Math.cos(angle) * radius * 0.82;
      const y = Math.sin(angle) * radius * 1.08;
      const z = -0.17 * (1 - radius * radius);

      vertices.push(x, y, z);
    }
  }

  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < segments; i++) {
      const a = j * (segments + 1) + i;
      const b = a + segments + 1;

      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );

  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const membrane = new THREE.Mesh(geometry, membraneMat);
  group.add(membrane);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.82, 0.075, 18, 120),
    rimMat,
  );

  rim.scale.set(1, 1.32, 1);
  group.add(rim);

  const innerRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.018, 12, 100),
    highlightMat,
  );

  innerRim.scale.set(1, 1.32, 1);
  innerRim.position.z = -0.015;
  group.add(innerRim);

  const malleusCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.05, 0.82, 0.02),
    new THREE.Vector3(-0.02, 0.55, 0.04),
    new THREE.Vector3(0.02, 0.25, 0.08),
    new THREE.Vector3(0.09, -0.05, 0.12),
    new THREE.Vector3(0.18, -0.48, 0.08),
  ]);

  const malleus = new THREE.Mesh(
    new THREE.TubeGeometry(malleusCurve, 90, 0.045, 16, false),
    boneMat,
  );

  group.add(malleus);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 32, 24), boneMat);

  head.position.set(-0.05, 0.85, 0.02);
  head.scale.set(0.85, 1.25, 0.8);
  group.add(head);

  const lateralProcess = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 24, 20),
    boneMat,
  );

  lateralProcess.position.set(-0.02, 0.58, 0.08);
  group.add(lateralProcess);

  const umbo = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 28, 20),
    highlightMat,
  );

  umbo.position.set(0.09, -0.05, 0.13);
  group.add(umbo);

  const lightSpot = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 20, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  );

  lightSpot.position.set(-0.35, 0.25, 0.015);
  lightSpot.scale.set(1, 1.6, 0.3);
  group.add(lightSpot);

  group.rotation.set(0.08, -0.12, -0.08);
  group.scale.setScalar(1.05);

  scene.add(group);
  return group;
}
