//실린더 추가
function cylAdd(point, msg) {
    i++;
    let material = new THREE.MeshBasicMaterial({ 
        color: 0xff0000, 
        opacity: 0.9, 
        transparent: true, 
        side: THREE.DoubleSide, 
        wireframe: false 
    });

    let cylGeometry = new THREE.CylinderGeometry(2,2,1,20);
    let midCylGeometry = new THREE.CylinderGeometry(1.5,1.5,5,20);

    let mesh2 = new THREE.Mesh(cylGeometry, material);
    mesh2.position.y += 1.5;
    mesh2.updateMatrix();

    let mesh3 = new THREE.Mesh(cylGeometry, material);
    mesh3.position.y += 3;
    mesh3.updateMatrix();

    let midmesh = new THREE.Mesh(midCylGeometry, material);
    midmesh.position.y += 2.5;
    midmesh.updateMatrix();

    cylGeometry.merge(mesh2.geometry, mesh2.matrix);
    cylGeometry.merge(mesh3.geometry, mesh3.matrix);
    cylGeometry.merge(midmesh.geometry, midmesh.matrix);

    let mesh = new THREE.Mesh(cylGeometry, material)

    geomteries["cube" + i] = mesh;

    geomteries["cube" + i].position.x = parseInt(point[0]);
    geomteries["cube" + i].position.y = parseInt(point[1]);
    geomteries["cube" + i].position.z = parseInt(point[2]);

    addWord(msg, geomteries["cube" + i].position, i);
    scene.add(geomteries["cube" + i]);

    domEvents.addEventListener(geomteries["cube" + i], 'mousedown', onDocumentMouseDown, false);
}


