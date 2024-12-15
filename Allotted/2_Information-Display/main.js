// start switch status
window.addEventListener('load', function () {
    // เลือก switch โดยใช้ id หรือ class ของมัน
    const switchElement = document.querySelector('.switch input');

    // ตั้งค่าให้ switch อยู่ในสถานะปิดตอนเปิดเว็บ
    switchElement.checked = false;

    // ตรวจสอบสถานะของ switch และตั้งค่า packedBoxesInfo ให้ปิด
    const packedBoxesInfo = document.getElementById("packedBoxesInfo");
    packedBoxesInfo.style.display = "none";  // เริ่มต้นให้ packedBoxesInfo ซ่อนอยู่

    const box = document.getElementsByClassName("box"); // เริ่มต้นให้ box ซ่อนอยู่

    const space = document.getElementById("space");  // เริ่มต้นให้ space ซ่อนอยู่
});

document.querySelector(".switch input").addEventListener("change", function (e) {
    const packedBoxesInfo = document.getElementById("packedBoxesInfo");
    const boxes = document.getElementsByClassName("box"); // คืนค่า HTMLCollection
    const space = document.getElementById("space");

    if (e.target.checked) {
        packedBoxesInfo.style.display = "block";
        setTimeout(() => packedBoxesInfo.classList.add('show'), 10);

        // ใช้ Array.from เพื่อแปลง HTMLCollection เป็น Array แล้ววนลูป
        Array.from(boxes).forEach(box => {
            box.style.display = "block";
            setTimeout(() => box.classList.add('show'), 10);
        });

        space.style.display = "block";
        setTimeout(() => space.classList.add('show'), 10);
    } else {
        packedBoxesInfo.classList.remove('show');
        setTimeout(() => packedBoxesInfo.style.display = "none", 300);

        Array.from(boxes).forEach(box => {
            box.classList.remove('show');
            setTimeout(() => box.style.display = "none", 300);
        });

        space.classList.remove('show');
        setTimeout(() => space.style.display = "none", 300);
    }
});
// end switch status


// start the info tab
function displayBoxInfo(box, color) {
    const boxInfoContainer = document.getElementById("packedBoxesInfo");

    // ถ้ามีข้อมูลกล่องที่ถูกบรรจุแล้ว ให้เพิ่มหัวข้อใหญ่ที่ด้านบน
    if (!boxInfoContainer.hasChildNodes()) {
        const header = document.createElement("h2");
        header.innerText = "Placed Box Details";
        boxInfoContainer.appendChild(header);
    }

    // สร้างแถบข้อมูลของแต่ละกล่อง
    const boxInfoDiv = document.createElement("div");
    boxInfoDiv.classList.add("packedBoxInfo");
    boxInfoDiv.style.padding = "10px";
    boxInfoDiv.style.marginBottom = "10px";
    boxInfoDiv.style.borderRadius = "5px";
    boxInfoDiv.style.borderLeft = `5px solid #${color.toString(16)}`;
    boxInfoDiv.style.fontSize = "14px";

    const position = `<span>Position:</span> (${box.x.toFixed(1)}, ${box.y.toFixed(1)}, ${box.z.toFixed(1)})<br>`;

    // แสดงข้อมูลของกล่อง
    boxInfoDiv.innerHTML = `
    <strong>${box.name}</strong><br>
    <span>Size: ${box.length} × ${box.width} × ${box.height} cm</span><br>
    <span>Weight: ${box.weight} kg</span><br>
    ${position}
    ${box.fragile ? '<span style="color: #ef4444">⚠️ Fragile</span>' : ''}
`;


    boxInfoContainer.appendChild(boxInfoDiv);
}

function calculateSpaceUsage(packedBoxes, baseWidth, baseHeight, baseLength) {
    let spaceUsed = 0;
    let spaceRemaining = 0;
    let fragileCount = 0;

    packedBoxes.forEach(box => {
        // Assuming box dimensions and fragile status
        let boxVolume = box.width * box.height * box.length;
        spaceUsed += boxVolume;

        if (box.isFragile) {
            fragileCount++;
        }
    });

    spaceRemaining = (baseWidth * baseHeight * baseLength) - spaceUsed;
    spaceUsed = (spaceUsed / (baseWidth * baseHeight * baseLength)) * 100;
    spaceRemaining = (spaceRemaining / (baseWidth * baseHeight * baseLength)) * 100;

    return {
        spaceUsed,
        spaceRemaining,
        fragileCount
    };
}

document.querySelector(".switch input").addEventListener("change", function (e) {
    const packedBoxesInfo = document.getElementById("packedBoxesInfo");
    const boxes = document.getElementsByClassName("box"); // ใช้ getElementsByClassName จะคืนค่า HTMLCollection
    const space = document.getElementById("space");

    if (e.target.checked) {
        packedBoxesInfo.style.display = "block";
        setTimeout(() => packedBoxesInfo.classList.add('show'), 10);

        // Loop through each .box element and show it
        Array.from(boxes).forEach(box => {
            box.style.display = "block";
            setTimeout(() => box.classList.add('show'), 10);
        });

        space.style.display = "block";
        setTimeout(() => space.classList.add('show'), 10);
    } else {
        packedBoxesInfo.classList.remove('show');
        setTimeout(() => packedBoxesInfo.style.display = "none", 300);

        // Loop through each .box element and hide it
        Array.from(boxes).forEach(box => {
            box.classList.remove('show');
            setTimeout(() => box.style.display = "none", 300);
        });

        space.classList.remove('show');
        setTimeout(() => space.style.display = "none", 300);
    }
});
// end the info tab



document.getElementById("calculateBtn").addEventListener("click", function () {
    calculatePacking();  // Existing function to calculate packed boxes

    const switchElement = document.querySelector(".switch input");
    const packedBoxesInfo = document.getElementById("packedBoxesInfo");
    const box = document.querySelector('.box'); // The .box div you want to show
    const space = document.getElementById("space");

    // Change switch status to checked
    switchElement.checked = true;

    // Show packedBoxesInfo if switch is selected
    packedBoxesInfo.style.display = switchElement.checked ? "block" : "none";

    // Show unplacedBoxesInfo
    box.classList.add('show'); // Show the box

});