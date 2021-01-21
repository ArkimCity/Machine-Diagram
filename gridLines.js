const gridmaterial = new THREE.LineBasicMaterial({
	color: 0xff0000
});
const gridLitematerial = new THREE.LineBasicMaterial({
    color: 0xff0000,
    opacity: 0.3, 
    transparent: true, 
});

const gridlines = [];

const gridpointsX = [];
gridpointsX.push(new THREE.Vector3(-100, 0, 0));
gridpointsX.push(new THREE.Vector3(100, 0, 0));
const gridgeometryX = new THREE.BufferGeometry().setFromPoints(gridpointsX);
gridlines.push(new THREE.Line(gridgeometryX, gridmaterial));

const gridpointsY = [];
gridpointsY.push(new THREE.Vector3(0, -100, 0));
gridpointsY.push(new THREE.Vector3(0, 100, 0));
const gridgeometryY = new THREE.BufferGeometry().setFromPoints(gridpointsY);
gridlines.push(new THREE.Line(gridgeometryY, gridmaterial));

const gridpointsZ = [];
gridpointsZ.push(new THREE.Vector3(0, 0, -100));
gridpointsZ.push(new THREE.Vector3(0, 0, 100));
const gridgeometryZ = new THREE.BufferGeometry().setFromPoints(gridpointsZ);
gridlines.push(new THREE.Line(gridgeometryZ, gridmaterial));

for (let i = 0; i < 100; i+= 5) {
    let tempGridpointsZ = [];

    tempGridpointsZ.push(new THREE.Vector3(0, i-0, -0));
    tempGridpointsZ.push(new THREE.Vector3(0, i-0, 100));

    let gridLitegeometry = new THREE.BufferGeometry().setFromPoints(tempGridpointsZ);
    
    // gridlines.push(new THREE.Line(gridLitegeometry, gridLitematerial));

    let tempGridpointsZ2 = [];

    tempGridpointsZ2.push(new THREE.Vector3(i-0, 0, -0));
    tempGridpointsZ2.push(new THREE.Vector3(i-0, 0, 100));

    let gridLitegeometry2 = new THREE.BufferGeometry().setFromPoints(tempGridpointsZ2);

    gridlines.push(new THREE.Line(gridLitegeometry2, gridLitematerial));
}

for (let i = 0; i < 100; i+= 5) {
    let tempGridpointsX = [];

    tempGridpointsX.push(new THREE.Vector3(-0, i-0, 0));
    tempGridpointsX.push(new THREE.Vector3(100, i-0, 0));

    let gridLitegeometry = new THREE.BufferGeometry().setFromPoints(tempGridpointsX);

    // gridlines.push(new THREE.Line(gridLitegeometry, gridLitematerial));

    let tempGridpointsX2 = [];

    tempGridpointsX2.push(new THREE.Vector3(0, 0, i-0));
    tempGridpointsX2.push(new THREE.Vector3(100, 0, i-0));

    let gridLitegeometry2 = new THREE.BufferGeometry().setFromPoints(tempGridpointsX2);

    gridlines.push(new THREE.Line(gridLitegeometry2, gridLitematerial));
}

for (let i = 0; i < 100; i+= 5) {
    let tempGridpointsY = [];

    tempGridpointsY.push(new THREE.Vector3(0, 0, i-0));
    tempGridpointsY.push(new THREE.Vector3(0, 100, i-0));

    let gridLitegeometry = new THREE.BufferGeometry().setFromPoints(tempGridpointsY);

    // gridlines.push(new THREE.Line(gridLitegeometry, gridLitematerial));

    let tempGridpointsY2 = [];

    tempGridpointsY2.push(new THREE.Vector3(i-0, 0, 0));
    tempGridpointsY2.push(new THREE.Vector3(i-0, 100, 0));

    let gridLitegeometry2 = new THREE.BufferGeometry().setFromPoints(tempGridpointsY2);

    // gridlines.push(new THREE.Line(gridLitegeometry2, gridLitematerial));
}

for (gridline of gridlines) {
    scene.add( gridline );
}

//축에 기본
addAxisWord("Axis X", {x:40,y:5,z:0})
addAxisWord("Axis Y", {x:5,y:30,z:0})
addAxisWord("Axis Z", {x:0,y:5,z:30})

for (let i=0; i<100; i += 10) {
    addAxisWord(String(i), {x:i,y:0,z:0})
    addAxisWord(String(i), {x:0,y:i,z:0})
    addAxisWord(String(i), {x:0,y:0,z:i})
}