import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const container = document.getElementById("threejs-container");

const scene = new THREE.Scene();
scene.background = null;
const camera = new THREE.PerspectiveCamera(
  75,
  container.offsetWidth / container.offsetHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.offsetWidth, container.offsetHeight);

document.getElementById("threejs-canvas").appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial();
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0.5, -10);
// scene.add(cube);

const ambientLight = new THREE.AmbientLight("0xf5da9e", 3);
const mainLight = new THREE.DirectionalLight("0xFF5B00", 6);
mainLight.position.set(10, 10, 10);

const hemiLight = new THREE.HemisphereLight("white", "darkslategray", 1);

scene.add(ambientLight);
scene.add(mainLight);
// scene.add(hemiLight)

const size = 10;
const divisions = 10;

// const gridHelper = new THREE.GridHelper(size, divisions);
// scene.add(gridHelper);

camera.position.z = 1;
camera.position.y = 0.5;
camera.position.x = 0;
camera.rotation.x = 0;

// const controls = new OrbitControls(camera, renderer.domElement);

let model = null;
let model2 = null;
let model3 = null;

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderConfig({ type: "js" });
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
loader.setDRACOLoader(dracoLoader);

loader.load("/qcs.gltf", function (gltf) {
  model = gltf.scene;
  model.material = new THREE.MeshLambertMaterial();
  model.rotation.x = (Math.PI / 180) * 70;
  model.position.set(0.5, 1, -2.5);
  model.scale.set(0.4, 0.4, 0.4);
  scene.add(model);

  model2 = gltf.scene.clone();
  model2.position.set(-0.5, -0.1, -2.5);
  model2.rotation.z = (Math.PI / 180) * -15;
  scene.add(model2);

  model3 = gltf.scene.clone();
  model3.position.set(0.5, -1.1, -2.5);
  model3.rotation.z = (Math.PI / 180) * 15;
  scene.add(model3);
});

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  render();
}

const generateRotation = (base, multiplier) => {
  const scroll =
    (document.documentElement.scrollTop || document.body.scrollTop) /
    ((document.documentElement.scrollHeight || document.body.scrollHeight) -
      document.documentElement.clientHeight);
  return (Math.PI / 180) * base + (Math.PI / 180) * scroll * multiplier;
};

function animate() {
  requestAnimationFrame(animate);
  // playScrollAnimations()

  if (model && model2 && model3) {
    // model.rotation.x += 0.01;

    model.rotation.z = generateRotation(15, 1000);
    model2.rotation.z = generateRotation(-10, -1000);
    model3.rotation.z = generateRotation(30, 2000);
  }

  renderer.render(scene, camera);
}
animate();
