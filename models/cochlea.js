import * as THREE from "../libs/three/three.module.js";

export function createModel(scene) {
  const group = new THREE.Group();

  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0xe89aa8,
    roughness: 0.32,
    clearcoat: 0.8,
  });

  const innerMat = new THREE.MeshPhysicalMaterial({
    color: 0xffd0d2,
    roughness: 0.38,
    clearcoat: 0.55,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xfff0e8,
    roughness: 0.42,
  });

  const turns = 2.65;
  const points = [];

  for (let i = 0; i <= 360; i++) {
    const t = i / 360;
    const a = t * Math.PI * 2 * turns;
    const r = 0.12 + 0.88 * t;

    points.push(
      new THREE.Vector3(
        Math.cos(a) * r,
        Math.sin(a) * r,
        0.1 * Math.sin(a * 0.55),
      ),
    );
  }

  const spiral = new THREE.CatmullRomCurve3(points);

  const shell = new THREE.Mesh(
    new THREE.TubeGeometry(spiral, 420, 0.105, 20, false),
    shellMat,
  );

  group.add(shell);

  const innerPoints = [];

  for (let i = 0; i <= 300; i++) {
    const t = i / 300;
    const a = t * Math.PI * 2 * turns;
    const r = 0.12 + 0.88 * t;

    innerPoints.push(
      new THREE.Vector3(
        Math.cos(a) * r,
        Math.sin(a) * r,
        0.1 * Math.sin(a * 0.55) + 0.09,
      ),
    );
  }

  const innerCurve = new THREE.CatmullRomCurve3(innerPoints);

  group.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(innerCurve, 350, 0.035, 10, false),
      accentMat,
    ),
  );

  const apex = new THREE.Mesh(new THREE.SphereGeometry(0.14, 32, 24), innerMat);

  apex.position.set(0, 0, 0.04);
  group.add(apex);

  const base = new THREE.Mesh(new THREE.SphereGeometry(0.28, 40, 32), shellMat);

  base.position.set(1.02, 0, 0);
  base.scale.set(1.05, 0.85, 0.72);
  group.add(base);

  const opening = new THREE.Mesh(
    new THREE.TorusGeometry(0.17, 0.035, 14, 48),
    accentMat,
  );

  opening.position.set(1.05, 0, 0.19);
  group.add(opening);

  group.rotation.set(-0.15, 0.18, 0.08);

  scene.add(group);
  return group;
}
