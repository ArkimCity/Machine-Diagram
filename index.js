// import { OutlineEffect } from '/node_modules/three/examples/jsm/effects/OutlineEffect.js';
//기본 설정 - 화면 구성 및 시야각, 최대거리 최소 거리 등
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0x444158);

const renderer = new THREE.WebGLRenderer();
// let effect = new OutlineEffect(renderer);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



//OrbitControls 적용


const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.enabled = true;

function switchOrbitControls(){
    if (controls.enabled == true){
        controls.enabled = false;
    } else {
        controls.enabled = true;
    }
}

//position 등의 변경 후에는 컨트롤 업데이트 해줘야 함
controls.update();


//큐브 추가
const geometry = new THREE.BoxGeometry(2,3,2);

let cubes = {};

//threex로 이벤트 추가 
var domEvents = new THREEx.DomEvents(camera, renderer.domElement);

function onDocumentMouseDown(event) {
    let picked = Object.values(cubes).indexOf(event.target);

    if (model.boxnumber == picked) {
        event.target.material.color.b = 0;
        model.boxnumber = null;
        model.startPoint = null;
        model.endPoint = null;
        console.log("to null");
    } else {
        if (model.boxnumber != null) {
            model.startPoint = model.boxnumber;
            model.endPoint = picked;
            cubes["cube" + model.boxnumber].material.color.b = 0;
        }
        model.boxnumber = picked
        event.target.material.color.b = 1;
        console.log(picked + "선택");
    }
}

function move(key) {
    if (key == "up") {
        cubes["cube" + model.boxnumber].position.z += 10
    } else if (key == "up") {
        cubes["cube" + model.boxnumber].position.z -= 10
    } else if (key == "left") {
        cubes["cube" + model.boxnumber].position.x += 10
    } else if (key == "right") {
        cubes["cube" + model.boxnumber].position.x -= 10
    }
}

//큐브들 생성
let totalNumber = 0;
let i = totalNumber - 1;

let k = 0;
while (k < totalNumber) {
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
    let cube = new THREE.Mesh(geometry, material);
    cubes["cube" + k] = cube;
    domEvents.addEventListener(cubes["cube" + k], 'mousedown', onDocumentMouseDown, false);
    k++;
}

//큐브들 포지셔닝
let cubesKeys = Object.keys(cubes);
for (let j = 0; j < cubesKeys.length; j++) {
    cubes["cube" + j].position.x = (Math.random() - 0.5) * 10;
    cubes["cube" + j].position.y = (Math.random() - 0.5) * 10;
    cubes["cube" + j].position.z = (Math.random() - 0.5) * 10;

    scene.add(cubes["cube" + j]);
}

//라인 생성

const lines = {};

function addLine(startPoint, endPoint) {
    if (Object.keys(lines).includes(startPoint + "," + endPoint)){
        lines[startPoint + "," + endPoint].material.lineWidth += 0.1
    } else {
        let startCubePosition = cubes["cube" + startPoint].position;
        let endCubePosition = cubes["cube" + endPoint].position;
    
        let route = [-startCubePosition.x + endCubePosition.x,-startCubePosition.y + endCubePosition.y,-startCubePosition.z + endCubePosition.z]
    
        let points = [];
    
        points.push(new THREE.Vector3(0,0,0));
        points.push(new THREE.Vector3(route[0]*1/3 + Math.random() * 2 - 1,route[1]*1/3 + Math.random() * 2 + 1,route[2]*1/3 + Math.random() * 2 - 1));
        points.push(new THREE.Vector3(route[0]*2/3 + Math.random() * 2 - 1,route[1]*2/3 + Math.random() * 2 + 1,route[2]*2/3 + Math.random() * 2 - 1));
        points.push(new THREE.Vector3(route[0],route[1],route[2]));
    
        let curve = new THREE.CatmullRomCurve3(points);
    
        let points2 = curve.getPoints(20);
        let geometry = new THREE.BufferGeometry().setFromPoints(points2);
    
        //meshline try
        const meshLine = new MeshLine();
        meshLine.setPoints(points2);
    
        meshLine.setPoints(geometry, p => 2); // makes width 2 * lineWidth
        meshLine.setPoints(geometry, p => 2 + Math.sin(50 * p)); // makes width sinusoidal
        
        const material = new MeshLineMaterial();
        const mesh = new THREE.Mesh(meshLine, material);
        mesh.position.x = startCubePosition.x
        mesh.position.y = startCubePosition.y
        mesh.position.z = startCubePosition.z
        
        mesh.material.lineWidth = 0.1
        scene.add(mesh);
        lines[startPoint + "," + endPoint] = mesh
    }
}
 
//시간에 따라 라인이 점 점 줄어들어야 하는 함수

let removeLine = () => {
    for (let tempkey of Object.keys(lines)){
        lines[tempkey].material.lineWidth -= 0.1
    console.log("리무브 실행중");
    }
};


//원 추가
function shoot(startPoint, endPoint) {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshToonMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.x = cubes["cube" + startPoint].position.x;
    sphere.position.y = cubes["cube" + startPoint].position.y;
    sphere.position.z = cubes["cube" + startPoint].position.z;

    scene.add(sphere);

    cubes["cube" + startPoint].position.x - cubes["cube" + endPoint].position.x;
    cubes["cube" + startPoint].position.y - cubes["cube" + endPoint].position.y;
    cubes["cube" + startPoint].position.z - cubes["cube" + endPoint].position.z;

    startMove = function () {
        let tempNumber = 0;
        let playAlert = setInterval(function () {
            let maxNumber = 15
            if (tempNumber == maxNumber) {
                stopMove(playAlert);
                scene.remove(sphere)
            }
            sphere.position.x -= (cubes["cube" + startPoint].position.x - cubes["cube" + endPoint].position.x) / maxNumber
            sphere.position.y -= (cubes["cube" + startPoint].position.y - cubes["cube" + endPoint].position.y) / maxNumber
            sphere.position.z -= (cubes["cube" + startPoint].position.z - cubes["cube" + endPoint].position.z) / maxNumber
            tempNumber++
        }, 25);
    };

    stopMove = function (playAlert) {
        clearInterval(playAlert);
    };

    startMove()
}

//라이트 설정
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

let pointLight1 = new THREE.PointLight(0xFFFFFF, 3, 50);
scene.add(pointLight1);

camera.position.set(0, 5, 0);
controls.target = new THREE.Vector3(30, 0, 30);
controls.update();


//큐브 추가
function cubeAdd(point) {
    i++;
    let material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        opacity: 0.8, 
        transparent: true, 
        side: THREE.DoubleSide, 
        wireframe: false 
    });

    cubes["cube" + i] = new THREE.Mesh(geometry, material);

    cubes["cube" + i].position.x = parseInt(point[0]);
    cubes["cube" + i].position.y = parseInt(point[1]);
    cubes["cube" + i].position.z = parseInt(point[2]);

    scene.add(cubes["cube" + i]);

    domEvents.addEventListener(cubes["cube" + i], 'mousedown', onDocumentMouseDown, false);
}

//실린더 추가
function cylAdd(point) {
    i++;
    let material = new THREE.MeshBasicMaterial({ 
        color: 0xff0000, 
        opacity: 0.8, 
        transparent: true, 
        side: THREE.DoubleSide, 
        wireframe: false 
    });

    let cylGeometry = new THREE.CylinderGeometry(2,2,3);

    cubes["cube" + i] = new THREE.Mesh(cylGeometry, material);

    cubes["cube" + i].position.x = parseInt(point[0]);
    cubes["cube" + i].position.y = parseInt(point[1]);
    cubes["cube" + i].position.z = parseInt(point[2]);

    scene.add(cubes["cube" + i]);

    domEvents.addEventListener(cubes["cube" + i], 'mousedown', onDocumentMouseDown, false);
}


//로더
let loader = new THREE.ObjectLoader();
//텍스트 추가
// loader.load('prototype/gentilis_regular.typeface.json', function (font) {
// });
// const textGeometry = new THREE.TextGeometry( 'Hello three.js!', {
//     font: 'Helvetica',
//     size: 80,
//     height: 5,
//     curveSegments: 12,
//     bevelEnabled: true,
//     bevelThickness: 10,
//     bevelSize: 8,
//     bevelOffset: 0,
//     bevelSegments: 5
// } );