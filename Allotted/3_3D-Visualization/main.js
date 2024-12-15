function addLabel(value, axis, position, sizeTuple) {
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new THREE.TextGeometry(value.toFixed(1), {
            font: font,
            size: 0.75,
            height: 0.1,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        if (axis === 0) {
            textMesh.position.set(position, -sizeTuple[1] / 2 - 2, -sizeTuple[2] / 2);
        } else if (axis === 1) {
            textMesh.position.set(-sizeTuple[0] / 2 - 2, position, -sizeTuple[2] / 2);
        } else if (axis === 2) {
            textMesh.position.set(-sizeTuple[0] / 2, -sizeTuple[1] / 2 - 2, position);
        }
        rulerGroup.add(textMesh);
        labelMeshes.push(textMesh);
    });
}

function updateLabels() {
    labelMeshes.forEach((label) => {
        label.lookAt(camera.position);
    });
}

function createDynamicRulerLines(sizeTuple) {
    for (let axis = 0; axis < 3; axis++) {
        for (let i = 0; i <= DIVISIONS; i++) {
            const interval = sizeTuple[axis] / DIVISIONS;
            const position = i * interval - sizeTuple[axis] / 2;
            const axisVector = [new THREE.Vector3(), new THREE.Vector3()];

            if (axis === 0) {
                axisVector[0].set(position, -sizeTuple[1] / 2, -sizeTuple[2] / 2);
                axisVector[1].set(position, -sizeTuple[1] / 2 - 1, -sizeTuple[2] / 2);
            } else if (axis === 1) {
                axisVector[0].set(-sizeTuple[0] / 2, position, -sizeTuple[2] / 2);
                axisVector[1].set(-sizeTuple[0] / 2 - 1, position, -sizeTuple[2] / 2);
            } else if (axis === 2) {
                axisVector[0].set(-sizeTuple[0] / 2, -sizeTuple[1] / 2, position);
                axisVector[1].set(-sizeTuple[0] / 2, -sizeTuple[1] / 2 - 1, position);
            }

            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000FF });
            const geometry = new THREE.BufferGeometry().setFromPoints(axisVector);
            const line = new THREE.Line(geometry, lineMaterial);
            rulerGroup.add(line);

            addLabel(i * interval, axis, position, sizeTuple);
        }
    }

    scene.add(rulerGroup);
}

renderer.setAnimationLoop(() => {
    updateLabels();
    renderer.render(scene, camera);
});

const raycaster = new THREE.Raycaster();
const tooltip = document.getElementById("tooltip");
const edgeHighlight = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry()),
    new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
);
scene.add(edgeHighlight);

document.addEventListener("mousemove", (event) => {
    const rect = container.getBoundingClientRect();

    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        tooltip.style.display = "none";
        edgeHighlight.visible = false;
        return;
    }

    const coords = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
    );

    raycaster.setFromCamera(coords, camera);

    const intersections = raycaster.intersectObjects(boxesGroup.children, true);

    boxesGroup.children.forEach(obj => {
        obj.material.opacity = 0.75;
        obj.material.transparent = true;
    });

    if (intersections.length > 0) {
        const selectedObject = intersections[0].object;
        const properties = selectedObject.userData;

        selectedObject.material.opacity = 1.0;

        tooltip.innerHTML = `
            <strong>Name: </strong>${properties.name || 'N/A'}<br>
            <strong>Size: </strong>${properties.width} x ${properties.length} x ${properties.height} cm<br>
            <strong>Weight: </strong>${properties.weight} Kg<br>
            <strong>Fragile: </strong>${properties.fragile ? "Yes" : "No"}
        `;
        tooltip.style.left = `${event.pageX - tooltip.offsetWidth / 2 + 100}px`;
        tooltip.style.top = `${event.pageY - tooltip.offsetHeight / 2}px`;

        tooltip.style.display = "block";

        // Highlight the edges
        edgeHighlight.geometry.dispose();
        edgeHighlight.geometry = new THREE.EdgesGeometry(selectedObject.geometry);
        edgeHighlight.position.copy(selectedObject.position);
        edgeHighlight.visible = true;
    } else {
        tooltip.style.display = "none";
        edgeHighlight.visible = false;
    }
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();