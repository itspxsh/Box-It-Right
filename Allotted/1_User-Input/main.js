// start input
let boxCount = 1;

document.getElementById("addBoxBtn").addEventListener("click", () => {
    if (boxCount < 100) {
        // Create a new table row
        const newBoxRow = document.createElement("tr");
        newBoxRow.classList.add("boxInput");
        newBoxRow.innerHTML = ` 
            <td class="order">${boxCount + 1}</td>
            <td><input type="text" id="boxName${boxCount}" required /></td>
            <td><input type="number" id="length${boxCount}" required /></td>
            <td><input type="number" id="width${boxCount}" required /></td>
            <td><input type="number" id="height${boxCount}" required /></td>
            <td><input type="number" id="weight${boxCount}" required /></td>
            <td><input type="number" id="quantity${boxCount}" required /></td>
            <td><select id="fragile${boxCount}" required>
                <option value="false">Not Fragile</option>
                <option value="true">Fragile</option>
            </select></td>
            <td><button type="button" class="deleteBtn"><i class='bx bx-trash' ></i></button></td>
        `;

        // Append the new row to the table body
        const tableBody = document.querySelector("#boxTable tbody");
        tableBody.appendChild(newBoxRow);

        // Add an input listener for the quantity field
        const quantityInput = document.getElementById(`quantity${boxCount}`);
        quantityInput.addEventListener("input", function () {
            let quantity = parseInt(this.value, 10);
            if (quantity < 1) {
                this.value = 1;
            }
        });

        // Increment box count
        boxCount++;
    } else {
        alert("You can only add up to 100 boxes.");
    }
});

// Use event delegation for delete button
document.querySelector("#boxTable tbody").addEventListener("click", (e) => {
    if (e.target.classList.contains("deleteBtn")) {
        const row = e.target.closest("tr");
        row.remove();
        updateOrder(); // Update order after deleting a row
    }
});

// Update order function
function updateOrder() {
    const rows = document.querySelectorAll("#boxTable tbody .boxInput");
    rows.forEach((row, index) => {
        row.querySelector(".order").textContent = index + 1;

        // อัปเดต id ของ input ในแถว
        row.querySelectorAll("input, select").forEach((input) => {
            const oldId = input.id;
            if (oldId) {
                const newId = oldId.replace(/\d+$/, index);
                input.id = newId;
            }
        });
    });
    boxCount = rows.length; // อัปเดต boxCount
}
// end input

async function calculatePacking() {
    const boxes = [];
    const boxesContainer = document.getElementById("boxes");

    const baseLength = parseFloat(document.getElementById("baseLength").value);
    const baseWidth = parseFloat(document.getElementById("baseWidth").value);
    const baseHeight = parseFloat(document.getElementById("baseHeight").value);

    if (!baseLength || !baseWidth || !baseHeight) {
        alert("Please enter valid dimensions for the base box.");
        return;
    }

    scrollToBottom();

    const boxInputs = boxesContainer.getElementsByClassName("boxInput");
    for (let i = 0; i < boxInputs.length; i++) {
        const name = boxInputs[i].querySelector(`#boxName${i}`).value;
        const quantity = parseInt(boxInputs[i].querySelector(`#quantity${i}`).value) || 1;
        const length = boxInputs[i].querySelector(`#length${i}`);
        const width = boxInputs[i].querySelector(`#width${i}`);
        const height = boxInputs[i].querySelector(`#height${i}`);
        const weight = boxInputs[i].querySelector(`#weight${i}`);
        const fragileDropdown = boxInputs[i].querySelector(`#fragile${i}`);

        if (!name || !length.value || !width.value || !height.value || !weight.value || !fragileDropdown) {
            alert(`Box ${i + 1} has invalid or missing data.`);
            return;
        }

        const fragile = fragileDropdown.value === "true";

        for (let q = 0; q < quantity; q++) {
            boxes.push({
                name: name,
                length: parseFloat(length.value),
                width: parseFloat(width.value),
                height: parseFloat(height.value),
                weight: parseFloat(weight.value),
                fragile: fragile
            });
        }
    }

    if (boxes.length === 0) {
        alert("Please enter at least one box.");
        return;
    }

    const requestBody = {
        base_dimensions: [baseWidth, baseHeight, baseLength],
        boxes
    };
    console.log("Request Body:", requestBody);

    try {
        const response = await fetch("http://127.0.0.1:5000/calculate_packing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to calculate packing");
        }

        const packedBoxes = await response.json();
        console.log("Packed boxes data:", packedBoxes);

        // Show packed details with transition effect
        const boxInfoContainer = document.getElementById("packedBoxesInfo");
        boxInfoContainer.innerHTML = '';

        // Ensure the packedBoxesInfo container is visible with a smooth transition
        boxInfoContainer.style.display = "block";  // Make it visible
        setTimeout(() => boxInfoContainer.classList.add('show'), 10);  // Add transition class

        visualizePacking(packedBoxes, baseWidth, baseHeight, baseLength);
    } catch (error) {
        console.error("Error:", error);
        alert(error.message || "There was an error while calculating the packing. Please try again.");
    }
}