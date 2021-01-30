function animate() {
  requestAnimationFrame(animate);

  for (let cubekey of Object.keys(geomteries)) {
    // geomteries[cubekey].rotation.x += 0.1 * Math.random();
    // geomteries[cubekey].rotation.y += 0.1 * Math.random();
    // geomteries[cubekey].rotation.z += 0.1 * Math.random();
  }
  controls.update();
  renderer.render(scene, camera);
  TWEEN.update();
  
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  
}
animate();

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth; // clientWith / height 가 임의로 늘려준 사이즈
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;   // width 및 height 는 캔버스 고유의 사이즈인 듯
  if (needResize) {
    renderer.setSize(width, height, false);
  }

  
  return needResize;
}