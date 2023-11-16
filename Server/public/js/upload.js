const imageBox = document.getElementById("imageBox");
const fileInput = document.getElementById("fileInput");
console.log(fileInput)

// Array to store dropped or selected files
let selectedImages = [];

// Function to update the displayed images
function updateImageDisplay() {
    imageBox.innerHTML = "";
    for (let i = 0; i < selectedImages.length; i++) {
        const imgElement = document.createElement("img");
        const img = document.createElement("input")
        img.style.display = "none"
        img.type = "file"
        img.setAttribute("name",`jersey_image${i + 1}`)
        imageBox.style.display = "flex"
        imageBox.style.flexDirection = "row"
        imgElement.style.width = "100px"
        imgElement.style.height = "fit-content"
        imgElement.src = URL.createObjectURL(selectedImages[i]);
        imageBox.appendChild(imgElement);
        formContainer.appendChild(img)

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.style.backgroundColor = "red";
        removeButton.style.color = "white";
        removeButton.style.padding = "2px 7px 2px 7px";
        removeButton.textContent = "X";
        removeButton.addEventListener("click", () => {
            selectedImages.splice(i, 1);
            updateImageDisplay();
        });
        imageBox.appendChild(removeButton);
        // console.log(selectedImages[i].name);
        console.log(`jersey_image${i + 1}`);
    }
}

// Event listeners for drag and drop
imageBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    imageBox.classList.add("dragover");
});

imageBox.addEventListener("dragleave", () => {
    imageBox.classList.remove("dragover");
});

imageBox.addEventListener("drop", (e) => {
    e.preventDefault();
    imageBox.classList.remove("dragover");
    const files = e.dataTransfer.files;

    for (const file of files) {
        if (selectedImages.length < 3 && file.type.startsWith("image/")) {
            selectedImages.push(file);
        }
    }

    updateImageDisplay();
});

// Event listener for manual file input
fileInput.addEventListener("change", () => {
    const files = fileInput.files;
    for (const file of files) {
        if (selectedImages.length < 3 && file.type.startsWith("image/")) {
            selectedImages.push(file);
        }
    }

    updateImageDisplay();
});

// Add a click event to the "imageBox" to trigger the hidden file input
imageBox.addEventListener("click", () => {
    fileInput.click();
});
