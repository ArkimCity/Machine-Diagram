function animate() {
    requestAnimationFrame(animate);

    for (let cubekey of Object.keys(cubes)) {
        // cubes[cubekey].rotation.x += 0.1 * Math.random();
        // cubes[cubekey].rotation.y += 0.1 * Math.random();
        // cubes[cubekey].rotation.z += 0.1 * Math.random();
    }
    controls.update();
    renderer.render(scene, camera);
}
animate();
