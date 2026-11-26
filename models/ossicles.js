import * as THREE from "../libs/three/three.module.js";

export function createModel(scene) {
  const group = new THREE.Group();

  const bone = new THREE.MeshPhysicalMaterial({
    color: 0xf0c78e,
    roughness: 0.42,
    clearcoat: 0.45,
  });

  const highlight = new THREE.MeshStandardMaterial({
    color: 0xffe4b8,
    roughness: 0.38,
  });

  function rod(a, b, radius, material = bone) {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const direction = new THREE.Vector3().subVectors(end, start);

    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.78, radius, direction.length(), 16),
      material,
    );

    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );

    group.add(mesh);
    return mesh;
  }

  function joint(position, radius = 0.085) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 24, 20),
      highlight,
    );

    mesh.position.set(...position);
    group.add(mesh);
  }

  joint([-0.82, 0.12, 0], 0.12);
  rod([-0.82, 0.12, 0], [-0.58, -0.04, 0], 0.065);
  rod([-0.58, -0.04, 0], [-0.38, -0.36, 0], 0.045);

  const malleusHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 32, 24),
    bone,
  );

  malleusHead.position.set(-0.86, 0.28, 0);
  malleusHead.scale.set(0.9, 1.15, 0.72);
  group.add(malleusHead);

  joint([-0.12, 0.08, 0], 0.14);
  rod([-0.12, 0.08, 0], [0.08, -0.12, 0], 0.075);
  rod([0.08, -0.12, 0], [0.22, -0.42, 0], 0.05);
  rod([-0.12, 0.08, 0], [-0.27, 0.34, 0], 0.06);

  const incusBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 28, 22),
    bone,
  );

  incusBody.position.set(-0.16, 0.14, 0);
  incusBody.scale.set(1.1, 0.75, 0.8);
  group.add(incusBody);

  const arch = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.48, -0.02, 0),
    new THREE.Vector3(0.55, 0.22, 0),
    new THREE.Vector3(0.78, 0.22, 0),
    new THREE.Vector3(0.85, -0.02, 0),
  ]);

  group.add(
    new THREE.Mesh(new THREE.TubeGeometry(arch, 60, 0.045, 12, false), bone),
  );

  rod([0.48, -0.02, 0], [0.44, -0.26, 0], 0.04);
  rod([0.85, -0.02, 0], [0.88, -0.26, 0], 0.04);

  const shape = new THREE.Shape();
  shape.absellipse(0, 0, 0.17, 0.09, 0, Math.PI * 2, false, 0);

  const footplate = new THREE.Mesh(
    new THREE.ShapeGeometry(shape, 32),
    highlight,
  );

  footplate.position.set(0.66, -0.28, 0);
  group.add(footplate);

  group.scale.setScalar(1.12);
  group.rotation.z = -0.08;

  scene.add(group);
  return group;
}
