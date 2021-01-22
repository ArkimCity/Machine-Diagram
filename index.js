// import { OutlineEffect } from '/node_modules/three/examples/jsm/effects/OutlineEffect.js';
//기본 설정 - 화면 구성 및 시야각, 최대거리 최소 거리 등
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
scene.background = new THREE.Color(0x444158);
const texts = [];
const renderer = new THREE.WebGLRenderer();
// let effect = new OutlineEffect(renderer);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//OrbitControls 적용


const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.enabled = true;

function switchOrbitControls() {
    if (controls.enabled) {
        controls.enabled = false;
        model.controlStatus = false;
    } else {
        controls.enabled = true;
        model.controlStatus = true;
    }
}

//라이트 설정
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

let pointLight1 = new THREE.PointLight(0xFFFFFF, 3, 50);
scene.add(pointLight1);

camera.position.set(40, 20, 60);
controls.target = new THREE.Vector3(15, 0, 0);
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

function move(element) {
    if (key == "up") {
        element.position.z += 10
    } else if (key == "up") {
        element.position.z -= 10
    } else if (key == "left") {
        element.position.x += 10
    } else if (key == "right") {
        element.position.x -= 10
    }
}

//큐브들 생성
let i = -1;


//라인 생성

const lines = {};

function addLine(startPoint, endPoint) {
    if (Object.keys(lines).includes(startPoint + "," + endPoint)){
        lines[startPoint + "," + endPoint].material.lineWidth += 0.1
        lines[startPoint + "," + endPoint].material.color.b -= 0.1
        lines[startPoint + "," + endPoint].material.color.g -= 0.1
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
        if (lines[tempkey].material.lineWidth > 0){
            lines[tempkey].material.lineWidth -= 0.1
            lines[tempkey].material.color.b += 0.1
            lines[tempkey].material.color.g += 0.1
        }
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




//큐브 추가
function cubeAdd(point, msg) {
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

    addWord(msg, cubes["cube" + i].position, i);
    scene.add(cubes["cube" + i]);

    domEvents.addEventListener(cubes["cube" + i], 'mousedown', onDocumentMouseDown, false);
}

//실린더 추가
function cylAdd(point, msg) {
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

    addWord(msg, cubes["cube" + i].position, i);
    scene.add(cubes["cube" + i]);

    domEvents.addEventListener(cubes["cube" + i], 'mousedown', onDocumentMouseDown, false);
}


function addWord(msg, position, index){
    //폰트로더
    let textMesh;
    const fontLoader = new THREE.FontLoader();
    //텍스트 추가
    fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
        let material = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            opacity: 0.8, 
            transparent: true, 
            side: THREE.DoubleSide, 
            wireframe: false 
        });
    
        if (msg == null){
            msg = model.label;
        }

        let fontGeometry = new THREE.TextGeometry( msg, {
            font: font,
            size: 0.8,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.008,
            bevelOffset: 0,
            bevelSegments: 5
        } );
        
        textGeo = new THREE.BufferGeometry().fromGeometry( fontGeometry );
        textMesh = new THREE.Mesh( textGeo, material );
        textMesh.position.x = position.x - 0.4
        textMesh.position.y = position.y + 2
        textMesh.position.z = position.z

        model.x = 0;
        model.y = 0;
        model.z = 0;
        model.label = "";
        texts["text" + index] = textMesh
        scene.add(textMesh)
    });
}

function addAxisWord(msg, position){
    //폰트로더
    let textMesh;
    const fontLoader = new THREE.FontLoader();
    //텍스트 추가
    fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
        let material = new THREE.MeshBasicMaterial({ 
            color: 0x8f96a5, 
            opacity: 0.8, 
            transparent: true, 
            side: THREE.DoubleSide, 
            wireframe: false 
        });
    
        if (msg == null){
            msg = model.label;
        }

        let fontGeometry = new THREE.TextGeometry( msg, {
            font: font,
            size: 0.8,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.008,
            bevelOffset: 0,
            bevelSegments: 5
        } );
        
        textGeo = new THREE.BufferGeometry().fromGeometry( fontGeometry );
        textMesh = new THREE.Mesh( textGeo, material );
        
        textMesh.position.x = position.x - 0.4
        textMesh.position.y = position.y + 2
        textMesh.position.z = position.z

        scene.add(textMesh)
    });
}
