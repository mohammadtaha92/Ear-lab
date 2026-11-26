import * as THREE from "../libs/three/three.module.js";

export function createModel(scene) {
  const group = new THREE.Group();

  const outerMat = new THREE.MeshPhysicalMaterial({
    color: 0xd98991,
    roughness: 0.4,
    clearcoat: 0.7,
    side: THREE.DoubleSide,
  });

  const innerMat = new THREE.MeshPhysicalMaterial({
    color: 0xffc9c4,
    roughness: 0.5,
    side: THREE.DoubleSide,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xb96c78,
    roughness: 0.45,
  });

  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.25, 0.65, 0),
    new THREE.Vector3(-0.95, 0.52, 0.02),
    new THREE.Vector3(-0.62, 0.27, 0.05),
    new THREE.Vector3(-0.25, -0.02, 0.08),
    new THREE.Vector3(0.15, -0.32, 0.12),
    new THREE.Vector3(0.62, -0.53, 0.16),
    new THREE.Vector3(1.05, -0.57, 0.18),
  ]);

  const tubularSegments = 120;
  const radialSegments = 32;
  const frames = path.computeFrenetFrames(tubularSegments, false);

  const positions = [];
  const indices = [];
  const innerPositions = [];
  const innerIndices = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const point = path.getPointAt(t);

    const radius = 0.07 + 0.13 * t;

    for (let j = 0; j <= radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2;

      const normal = frames.normals[i].clone().multiplyScalar(Math.cos(angle));
      const binormal = frames.binormals[i]
        .clone()
        .multiplyScalar(Math.sin(angle));

      const direction = normal.add(binormal);

      const outerPoint = point.clone().addScaledVector(direction, radius);
      const innerPoint = point
        .clone()
        .addScaledVector(direction, radius * 0.58);

      positions.push(outerPoint.x, outerPoint.y, outerPoint.z);
      innerPositions.push(innerPoint.x, innerPoint.y, innerPoint.z);
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = a + radialSegments + 1;

      indices.push(a, a + 1, b);
      indices.push(b, a + 1, b + 1);

      innerIndices.push(a, b, a + 1);
      innerIndices.push(b, b + 1, a + 1);
    }
  }

  const outerGeometry = new THREE.BufferGeometry();

  outerGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );

  outerGeometry.setIndex(indices);
  outerGeometry.computeVertexNormals();

  const outerTube = new THREE.Mesh(outerGeometry, outerMat);
  group.add(outerTube);

  const innerGeometry = new THREE.BufferGeometry();

  innerGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(innerPositions, 3),
  );

  innerGeometry.setIndex(innerIndices);
  innerGeometry.computeVertexNormals();

  const innerTube = new THREE.Mesh(innerGeometry, innerMat);
  group.add(innerTube);

  const start = path.getPointAt(0);
  const end = path.getPointAt(1);

  const startRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.07, 0.025, 12, 48),
    rimMat,
  );

  startRim.position.copy(start);
  startRim.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    path.getTangentAt(0).normalize(),
  );

  group.add(startRim);

  const endRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.035, 12, 48),
    rimMat,
  );

  endRim.position.copy(end);
  endRim.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    path.getTangentAt(1).normalize(),
  );

  group.add(endRim);

  const cartilage = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 32, 24),
    outerMat,
  );

  cartilage.position.set(-0.45, 0.12, 0.06);
  cartilage.scale.set(1.2, 0.65, 0.75);
  group.add(cartilage);

  group.rotation.set(0.08, -0.12, 0.05);
  group.scale.setScalar(1.05);

  scene.add(group);
  return group;
}
