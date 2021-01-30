function addMachine(point,msg) {
    
    let dae;
    let kinematics;
    let kinematicsTween;
    const tweenParameters = {};

    const loader = new THREE.ColladaLoader();
    // loader.load( './models/collada/kawada-hironx.dae', function ( collada ) {
    loader.load('./models/collada/abb_irb52_7_120.dae', function (collada) {
        i++;
        dae = collada.scene;
        dae.traverse(function (child) {
            if (child.isMesh) {
                // model does not have normals
                child.material.flatShading = true;
            }
        });
        dae.scale.x = dae.scale.y = dae.scale.z = 7;
        dae.updateMatrix();
        kinematics = collada.kinematics;

        geomteries["cube" + i] = dae;

        addWord(msg, geomteries["cube" + i].position, i);

        geomteries["cube" + i].position.x = parseInt(point[0]);
        geomteries["cube" + i].position.y = parseInt(point[1]);
        geomteries["cube" + i].position.z = parseInt(point[2]);

        scene.add(geomteries["cube" + i]);

        domEvents.addEventListener(geomteries["cube" + i], 'mousedown', onDocumentMouseDown, false);
        setupTween();
    });

    function setupTween() {

        const duration = THREE.MathUtils.randInt(1000, 5000);

        const target = {};

        for (const prop in kinematics.joints) {

            if (kinematics.joints.hasOwnProperty(prop)) {

                if (!kinematics.joints[prop].static) {

                    const joint = kinematics.joints[prop];

                    const old = tweenParameters[prop];

                    const position = old ? old : joint.zeroPosition;

                    tweenParameters[prop] = position;

                    target[prop] = THREE.MathUtils.randInt(joint.limits.min, joint.limits.max);

                }

            }

        }

        kinematicsTween = new TWEEN.Tween(tweenParameters).to(target, duration).easing(TWEEN.Easing.Quadratic.Out);

        kinematicsTween.onUpdate(function (object) {

            for (const prop in kinematics.joints) {

                if (kinematics.joints.hasOwnProperty(prop)) {

                    if (!kinematics.joints[prop].static) {

                        kinematics.setJointValue(prop, object[prop]);

                    }

                }

            }

        });

        kinematicsTween.start();

        setTimeout(setupTween, duration);

    }


}