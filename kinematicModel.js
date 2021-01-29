function machine(x,y,z) {
    let dae;
    let kinematics;
    let kinematicsTween;
    const tweenParameters = {};

    const loader = new THREE.ColladaLoader();
    // loader.load( './models/collada/kawada-hironx.dae', function ( collada ) {
    loader.load('./models/collada/abb_irb52_7_120.dae', function (collada) {
        dae = collada.scene;
        dae.traverse(function (child) {
            if (child.isMesh) {
                // model does not have normals
                child.material.flatShading = true;
            }
        });
        dae.scale.x = dae.scale.y = dae.scale.z = 10;
        dae.updateMatrix();
        kinematics = collada.kinematics;
        dae.position.x = x;
        dae.position.y = y;
        dae.position.z = z;
        scene.add(dae);
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