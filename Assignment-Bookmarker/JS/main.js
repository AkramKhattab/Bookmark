// Get references to HTML elements
var siteName = document.getElementById("bookmarkName");
var siteURL = document.getElementById("bookmarkURL");
var submitBtn = document.getElementById("submitBtn");
var tableContent = document.getElementById("tableContent");
var deleteBtns;
var visitBtns;
var closeBtn = document.getElementById("closeBtn");
var boxModal = document.querySelector(".box-info");
var bookmarks = [];
var updateIndex; // Declare globally

// Check if there are existing bookmarks in local storage
if (localStorage.getItem("bookmarksList")) {
    // Retrieve existing bookmarks from local storage
    bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));

    // Display existing bookmarks on the page
    for (var x = 0; x < bookmarks.length; x++) {
        displayBookmark(x);
    }
}

// Event listener for the search input
var searchInput = document.getElementById("bookmarkSearch");

searchInput.addEventListener("input", function () {
    var searchQuery = searchInput.value.toLowerCase();
    filterBookmarks(searchQuery);
});

// Event listener for the "Update" buttons
var updateBtns = document.querySelectorAll(".btn-update");
if (updateBtns) {
    for (var m = 0; m < updateBtns.length; m++) {
        updateBtns[m].addEventListener("click", function (e) {
            // Retrieve the index from the button's data attribute
            updateIndex = e.target.dataset.index;

            // Populate the input fields with the data to be updated
            siteName.value = bookmarks[updateIndex].siteName;
            siteURL.value = bookmarks[updateIndex].siteURL;

            // Change the text and functionality of the Submit button
            submitBtn.textContent = "Update";
            submitBtn.removeEventListener("click", submitBookmark); // Remove the old event listener
            submitBtn.addEventListener("click", function () {
                updateBookmark(updateIndex);
            });

            // Display info event
            document.dispatchEvent(new Event("info"));
        });
    }
}

// Function to update a bookmark
function updateBookmark(index) {
    // Check if both site name and URL have valid classes
    if (
        siteName.classList.contains("is-valid") &&
        siteURL.classList.contains("is-valid")
    ) {
        // Update the bookmark object
        bookmarks[index].siteName = capitalize(siteName.value);
        bookmarks[index].siteURL = siteURL.value;

        // Save bookmarks to local storage
        localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));

        // Display the bookmarks in the table
        updateDisplay();

        // Clear input fields and remove valid classes
        clearInput();
        siteName.classList.remove("is-valid");
        siteURL.classList.remove("is-valid");

        // Reattach event listeners for "Delete" and "Visit" buttons
        attachEventListeners();

        // Change the text and functionality of the Submit button back to Create
        submitBtn.textContent = "Submit";
        submitBtn.removeEventListener("click", updateBookmark); // Remove the old event listener
        submitBtn.addEventListener("click", submitBookmark);
    } else {
        // Display the error modal if input is invalid
        boxModal.classList.remove("d-none");
    }
}

// Function to attach event listeners for "Delete" and "Visit" buttons
function attachEventListeners() {
    deleteBtns = document.querySelectorAll(".btn-delete");
    visitBtns = document.querySelectorAll(".btn-visit");

    // Attach event listeners for "Delete" buttons
    for (var i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener("click", deleteBookmark);
    }

    // Attach event listeners for "Visit" buttons
    for (var j = 0; j < visitBtns.length; j++) {
        visitBtns[j].addEventListener("click", visitWebsite);
    }
}

// Attach initial event listeners
attachEventListeners();

// Function to filter bookmarks based on the search query
function filterBookmarks(query) {
    // Clear the table content
    tableContent.innerHTML = "";

    // Filter bookmarks based on the search query
    var filteredBookmarks = bookmarks.filter(function (bookmark) {
        return (
            bookmark.siteName.toLowerCase().includes(query) ||
            bookmark.siteURL.toLowerCase().includes(query)
        );
    });

    // Display the filtered bookmarks
    for (var i = 0; i < filteredBookmarks.length; i++) {
        displayBookmark(bookmarks.indexOf(filteredBookmarks[i]));
    }
}

// Function to display a bookmark in the table
function displayBookmark(indexOfWebsite) {
    // Extract the URL from the bookmark and format it
    var userURL = bookmarks[indexOfWebsite].siteURL;
    var httpsRegex = /^https?:\/\//g;
    if (httpsRegex.test(userURL)) {
        validURL = userURL;
        fixedURL = validURL
            .split("")
            .splice(validURL.match(httpsRegex)[0].length)
            .join("");
    } else {
        var fixedURL = userURL;
        validURL = `https://${userURL}`;
    }

    // Create HTML for a new row in the table
    var newBookmark = `
        <tr>
            <td>${indexOfWebsite + 1}</td>
            <td>${bookmarks[indexOfWebsite].siteName}</td>
            <td>
                <button class="btn btn-visit" data-index="${indexOfWebsite}">
                    <i class="fa-solid fa-eye pe-2"></i>Visit
                </button>
            </td>
            <td>
                <button class="btn btn-delete pe-2" data-index="${indexOfWebsite}">
                    <i class="fa-solid fa-trash-can"></i>
                    Delete
                </button>
            </td>
            <td>
                <button class="btn btn-update pe-2" data-index="${indexOfWebsite}">
                    <i class="fa-solid fa-pencil"></i>
                    Update
                </button>
            </td>
        </tr>
    `;

    // Append the new row to the table
    tableContent.innerHTML += newBookmark;
}

// Function to clear input fields
function clearInput() {
    siteName.value = "";
    siteURL.value = "";
}

// Function to capitalize the first letter of a string
function capitalize(str) {
    let strArr = str.split("");
    strArr[0] = strArr[0].toUpperCase();
    return strArr.join("");
}

// Event listener for the submit button
submitBtn.addEventListener("click", function () {
    // Check if both site name and URL have valid classes
    if (
        siteName.classList.contains("is-valid") &&
        siteURL.classList.contains("is-valid")
    ) {
        if (submitBtn.textContent === "Submit") {
            // Create a new bookmark object
            var bookmark = {
                siteName: capitalize(siteName.value),
                siteURL: siteURL.value,
            };

            // Add the new bookmark to the array
            bookmarks.push(bookmark);
        } else if (submitBtn.textContent === "Update") {
            // Update the bookmark object
            bookmarks[updateIndex].siteName = capitalize(siteName.value);
            bookmarks[updateIndex].siteURL = siteURL.value;
        }

        // Handle common submission logic
        handleSubmission();
    } else {
        // Display the error modal if input is invalid
        boxModal.classList.remove("d-none");
    }
});

// Function to handle common submission logic
function handleSubmission() {
    // Save bookmarks to local storage
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));

    // Update the display
    updateDisplay();

    // Clear input fields and remove valid classes
    clearInput();
    siteName.classList.remove("is-valid");
    siteURL.classList.remove("is-valid");

    // Change the text and functionality of the Submit button back to Create
    submitBtn.textContent = "Submit";
    submitBtn.removeEventListener("click", updateBookmark); // Remove the old event listener
    submitBtn.addEventListener("click", function () {
        // Set the updateIndex to -1 to avoid unwanted updates
        updateIndex = -1;
        submitBookmark();
    });
}

// Function to update the display
function updateDisplay() {
    // Clear the table content
    tableContent.innerHTML = "";

    // Display the bookmarks in the table
    for (var k = 0; k < bookmarks.length; k++) {
        displayBookmark(k);
    }

    // Reattach event listeners for "Delete" and "Visit" buttons
    attachEventListeners();
}

// Function to delete a bookmark
function deleteBookmark(e) {
    // Clear the table content
    tableContent.innerHTML = "";

    // Get the index of the bookmark to be deleted
    var deletedIndex = e.target.dataset.index;

    // Remove the bookmark from the array
    bookmarks.splice(deletedIndex, 1);

    // Re-display the remaining bookmarks
    updateDisplay();

    // Save the updated bookmarks to local storage
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
}

// Function to visit a website
function visitWebsite(e) {
    // Get the index of the bookmark to be visited
    var websiteIndex = e.target.dataset.index;

    // Check if the URL has the correct format and open the website
    var httpsRegex = /^https?:\/\//;
    try {
        if (httpsRegex.test(bookmarks[websiteIndex].siteURL)) {
            open(bookmarks[websiteIndex].siteURL);
        } else {
            open(`https://${bookmarks[websiteIndex].siteURL}`);
        }
    } catch (error) {
        // Handle the error if the website cannot be opened
        console.error("Error opening website:", error.message);
    }
}

// Regular expressions for validation
var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

// Event listeners for input validation
siteName.addEventListener("input", function () {
    validate(siteName, nameRegex);
});

siteURL.addEventListener("input", function () {
    validate(siteURL, urlRegex);
});

// Function to validate input against a regular expression
function validate(element, regex) {
    var testRegex = regex;
    if (testRegex.test(element.value)) {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
    } else {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
    }
}

// Event listener for closing the error modal
function closeModal() {
    boxModal.classList.add("d-none");
}

// Event listeners for closing the error modal
closeBtn.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
    if (e.key == "Escape") {
        closeModal();
    }
});

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("box-info")) {
        closeModal();
    }
});

// Event listener for the "info" event
document.addEventListener("info", function () {
    // Add your logic here to handle the "info" event
    console.log("Info event received");
});
