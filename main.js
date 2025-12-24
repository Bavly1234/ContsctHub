var btn = document.getElementById("openFormBtn")
var overlay = document.getElementById("overlay")
var xMark = document.getElementById("closeFormBtn")
var form = document.querySelector(".contact-modal");
var cancelbtn = document.getElementById("cancelFormBtn")
var saveBtn = document.getElementById("saveBtn")
var nameInput = document.getElementById("contactName");
var phoneInput = document.getElementById("contactPhone");
var emailInput = document.getElementById("contactEmail");
var addressInput = document.getElementById("contactAddress");
var groupSelect = document.getElementById("contactGroup");
var notesInput = document.getElementById("contactNotes");
var favoriteCheckbox = document.getElementById("contactFavorite");
var emergencyCheckbox = document.getElementById("contactEmergency");
var no_contact = document.getElementById("no_contact")
var contact_app = document.getElementById("contact_app")
var total = document.getElementById("total")
var phoneError = document.getElementById("phoneError");
var num = document.getElementById("num")
var favTotal = document.getElementById("favTotal")
var favContainer = document.getElementById("favourite_contacts");
var emerTotal = document.getElementById("emerTotal")
var emergencyContainer = document.getElementById("emergencyContact");
var searchInput = document.getElementById("searchInput");
var currentEditIndex;
var contactList = JSON.parse(localStorage.getItem("contacts")) || [];


xMark.addEventListener("click", closeform)
cancelbtn.addEventListener("click", closeform)
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeform();
    }
});

overlay.addEventListener("click", function (e) {
    if (!form.contains(e.target)) {
        closeform();
    }
});
searchInput.addEventListener("input", searchContacts);

btn.addEventListener("click", openform)
saveBtn.addEventListener("click", addContact)
phoneInput.addEventListener("input", function () {



    if (!egyptPhoneRegex.test(phoneInput.value.trim())) {
        phoneError.classList.remove("d-none");
        phoneInput.classList.add("is-invalid");
    }
    else {
        phoneError.classList.add("d-none");
        phoneInput.classList.remove("is-invalid");
    }
});



var egyptPhoneRegex = /^(010|011|012)\d{8}$/;

function isDuplicatePhone(phone, exceptIndex) {
    for (var i = 0; i < contactList.length; i++) {
        if (i !== exceptIndex && contactList[i].phone === phone) {
            return true;
        }
    }
    return false;
}



function addContact() {

    if (nameInput.value.trim() === "") {
        Swal.fire({ icon: "error", title: "Missing Name" });
        return;
    }

    if (phoneInput.value.trim() === "") {
        Swal.fire({ icon: "error", title: "Missing Phone" });
        return;
    }

    var phone = phoneInput.value.trim();

    if (currentEditIndex !== null && currentEditIndex !== undefined) {

        if (isDuplicatePhone(phone, currentEditIndex)) {
            Swal.fire({
                icon: "error",
                title: "Duplicate Phone",
                text: "This phone number already exists"
            });
            return;
        }

        updateProduct();

        Swal.fire({
            icon: "success",
            title: "Updated!",
            timer: 1500,
            showConfirmButton: false
        });

    } 
    else {

        if (isDuplicatePhone(phone, -1)) {
            Swal.fire({
                icon: "error",
                title: "Duplicate Phone"
            });
            return;
        }

        var contactData = {
            name: nameInput.value,
            phone: phone,
            email: emailInput.value,
            address: addressInput.value,
            group: groupSelect.value,
            notes: notesInput.value,
            favorite: favoriteCheckbox.checked,
            emergency: emergencyCheckbox.checked
        };

        contactList.push(contactData);

        Swal.fire({
            icon: "success",
            title: "Added!",
            timer: 1500,
            showConfirmButton: false
        });
    }

    localStorage.setItem("contacts", JSON.stringify(contactList));
    renderContacts();
    clearForm();
    closeform();
    currentEditIndex = null;
}


function renderContacts() {


    contact_app.innerHTML = "";

    if (contactList.length === 0) {
        no_contact.classList.remove("d-none");
        return;
    }

    no_contact.classList.add("d-none");

    for (var i = 0; i < contactList.length; i++) {
        var c = contactList[i];
        var emergencyIcon;

        if (c.emergency === true) {
            emergencyIcon = "fas fa-heart-pulse text-danger";
        } else {
            emergencyIcon = "fas fa-heart text-muted";
        }


        if (c.favorite === true) {
            favicon = "text-warning";
        } else {
            favicon = "";
        }

        contact_app.innerHTML += `
        <div class="col-12 col-md-6">

            <div class="contact-card mt-2 d-flex flex-column overflow-hidden">

                <div class="card-body">

                    <div class="card-header d-flex align-items-start">
                        <div class="avatar d-flex align-items-center justify-content-center">
                            ${c.name.charAt(0).toUpperCase()}
                        </div>

                        <div class="info">
                            <h3>${c.name}</h3>

                            <div class="contact-row d-flex align-items-center">
                                <i class="fa-solid fa-phone"></i>
                                <span>${c.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-details">

                        ${c.email ? `
                        <div class="contact-row d-flex align-items-center">
                            <i class="fa-solid fa-envelope"></i>
                            <span>${c.email}</span>
                        </div>` : ""}

                        ${c.address ? `
                        <div class="contact-row d-flex align-items-center">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>${c.address}</span>
                        </div>` : ""}

                    </div>

                    ${c.group ? `
                    <div class="card-group">
                        <span>${c.group}</span>
                    </div>` : ""}

                </div>

                <div class="card-actions d-flex justify-content-between align-items-center">

                    <div class="actions-left">
                        <a href="tel:${c.phone}">
                            <button >
                                <i class="fa-solid fa-phone"></i>
                            </button>
                        </a>

                        ${c.email ? `
                        <a href="mailto:${c.email}">
                            <button>
                                <i class="fa-solid fa-envelope"></i>
                            </button>
                        </a>` : ""}
                    </div>

                    <div class="actions-right">
                        <button onclick="toggleFavorite(${i})">
                            <i class="fa-solid fa-star ${favicon}"></i>
                        </button>

                        <button onclick="toggleEmergency(${i})">
                            <i class="fa-solid ${emergencyIcon}"></i>
                        </button>

                              <button onclick="setUpdate(${i})"">
                            <i class="fa-solid fa-pen "></i>
                        </button>

                        <button onclick="deleteContact(${i})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                </div>

            </div>

        </div>
        `;
    }

    countFavorites()
    countEmergency()
    renderFavouriteContacts();
    renderEmergencyContacts()
    initializeCounts()

}

function setUpdate(index) {
    currentEditIndex = index;

    nameInput.value = contactList[index].name;
    phoneInput.value = contactList[index].phone;
    emailInput.value = contactList[index].email || "";
    addressInput.value = contactList[index].address || "";
    groupSelect.value = contactList[index].group || "";
    notesInput.value = contactList[index].notes || "";
    favoriteCheckbox.checked = contactList[index].favorite;
    emergencyCheckbox.checked = contactList[index].emergency;

    openform();
}

function updateProduct() {
    contactList[currentEditIndex].name = nameInput.value
    contactList[currentEditIndex].phone = phoneInput.value
    contactList[currentEditIndex].email = emailInput.value
    contactList[currentEditIndex].address = addressInput.value
    contactList[currentEditIndex].group = groupSelect.value
    contactList[currentEditIndex].notes = notesInput.value
    contactList[currentEditIndex].favorite = favoriteCheckbox.checked
    contactList[currentEditIndex].emergency = emergencyCheckbox.checked
}

function deleteContact(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete contact: ${contactList[index].name}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {

            contactList.splice(index, 1);
            localStorage.setItem("contacts", JSON.stringify(contactList));

            if (searchInput.value.trim() !== "") {
                searchContacts();
            } else {
                renderContacts();
            }

            countFavorites();
            countEmergency();
            renderFavouriteContacts();
            renderEmergencyContacts();

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

function searchContacts() {

    var searchValue = searchInput.value.toLowerCase();
    var cartoana = "";

    for (var i = 0; i < contactList.length; i++) {
        var c = contactList[i];

        if (
            c.name.toLowerCase().includes(searchValue) ||
            c.phone.includes(searchValue) ||
            (c.email && c.email.toLowerCase().includes(searchValue))
        ) {

            cartoana += `
            <div class="col-12 col-md-6">
                <div class="contact-card mt-2 d-flex flex-column overflow-hidden">

                    <div class="card-body">
                        <div class="card-header d-flex align-items-start">
                            <div class="avatar d-flex align-items-center justify-content-center">
                                ${c.name.charAt(0).toUpperCase()}
                            </div>

                            <div class="info">
                                <h3>${c.name}</h3>
                                <div class="contact-row d-flex align-items-center">
                                    <i class="fa-solid fa-phone"></i>
                                    <span>${c.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div class="card-details">
                            ${c.email ? `
                            <div class="contact-row d-flex align-items-center">
                                <i class="fa-solid fa-envelope"></i>
                                <span>${c.email}</span>
                            </div>` : ""}

                            ${c.address ? `
                            <div class="contact-row d-flex align-items-center">
                                <i class="fa-solid fa-location-dot"></i>
                                <span>${c.address}</span>
                            </div>` : ""}
                        </div>

                        ${c.group ? `<div class="card-group"><span>${c.group}</span></div>` : ""}
                    </div>

                    <div class="card-actions d-flex justify-content-between align-items-center">
                        <div class="actions-left">
                            <a href="tel:${c.phone}">
                                <button><i class="fa-solid fa-phone"></i></button>
                            </a>
                        </div>

                        <div class="actions-right">
                            <button onclick="toggleFavorite(${i})">
                                <i class="fa-solid fa-star ${c.favorite ? 'text-warning' : ''}"></i>
                            </button>

                            <button onclick="toggleEmergency(${i})">
                                <i class="fa-solid fa-heart ${c.emergency ? 'text-danger' : ''}"></i>
                            </button>

                            <button onclick="setUpdate(${i})">
                                <i class="fa-solid fa-pen"></i>
                            </button>

                            <button onclick="deleteContact(${i})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            `;
        }
    }

    contact_app.innerHTML = cartoana || `
       <div  class="row g-3">
                        <div id="no_contact"
                            class="col-12 empty-state text-center d-flex flex-column justify-content-center align-items-center">
                            <div class="no-contacts-icon d-flex justify-content-center align-items-center mb-2">
                                <i class="fas fa-address-book text-secondary fs-1"></i>
                            </div>
                            <p class="text-muted mb-1">No contacts found</p>
                            <p class="text-muted small">Click "Add Contact" to get started</p>
                        </div>
                    </div>    `;
}

function openform() {
    overlay.classList.remove("d-none")
}
function closeform() {
    overlay.classList.add("d-none")
}
function toggleFavorite(index) {
    contactList[index].favorite = !contactList[index].favorite;
    localStorage.setItem("contacts", JSON.stringify(contactList));
    renderContacts();
}
function toggleEmergency(index) {
    contactList[index].emergency = !contactList[index].emergency;
    localStorage.setItem("contacts", JSON.stringify(contactList));
    renderContacts();
}
function countFavorites() {
    var favCount = 0;

    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].favorite === true) {
            favCount++;
        }
    }

    favTotal.innerHTML = favCount;
}
function countEmergency() {
    var EmergencyCount = 0;

    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].emergency === true) {
            EmergencyCount++;
        }
    }

    emerTotal.innerHTML = EmergencyCount;
}
function clearForm() {
    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    addressInput.value = "";
    groupSelect.value = "";
    notesInput.value = "";
    favoriteCheckbox.checked = false;
    emergencyCheckbox.checked = false;
    phoneError.classList.add("d-none");
    phoneInput.classList.remove("is-invalid");
}
function renderFavouriteContacts() {
    favContainer.innerHTML = "";
    initializeCounts()
    var hasFavourite = false;

    for (var i = 0; i < contactList.length; i++) {
        var c = contactList[i];

        if (c.favorite === true) {
            hasFavourite = true;

            favContainer.innerHTML += `
                <div class="contact-item d-flex align-items-center gap-3 p-2 rounded-3 mt-3 cursor-pointer">

                    <!-- Avatar -->
                    <div class="avatar d-flex align-items-center justify-content-center">
                        ${c.name.charAt(0).toUpperCase()}
                    </div>

                    <!-- Info -->
                    <div class="flex-grow-1 text-truncate">
                        <h6 class="mb-0 text-truncate">${c.name}</h6>
                        <small class="text-muted text-truncate d-block">${c.phone}</small>
                    </div>

                    <!-- Call Button -->
                    <a href="tel:${c.phone}" class="call-btn text-decoration-none d-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-phone"></i>
                    </a>

                </div>
            `;
        }
    }

    if (!hasFavourite) {
        favContainer.innerHTML = `
            <p class="text-center text-muted mb-0 py-5">
                No favourite  contacts yet
            </p>
        `;
    }
}
function renderEmergencyContacts() {
    emergencyContainer.innerHTML = "";
    initializeCounts()
    var hasEmergency = false;

    for (var i = 0; i < contactList.length; i++) {
        var c = contactList[i];

        if (c.emergency === true) {
            hasEmergency = true;

            emergencyContainer.innerHTML += `
                <div class="contact-item d-flex align-items-center gap-3 p-2 rounded-3 mt-3 cursor-pointer">

                    <div class="avatar d-flex align-items-center justify-content-center">
                        ${c.name.charAt(0).toUpperCase()}
                    </div>

                    <div class="flex-grow-1 text-truncate">
                        <h6 class="mb-0 text-truncate">${c.name}</h6>
                        <small class="text-muted text-truncate d-block">${c.phone}</small>
                    </div>

                    <a href="tel:${c.phone}" class="call-btn text-decoration-none d-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-phone"></i>
                    </a>

                </div>
            `;
        }
    }

    if (!hasEmergency) {
        emergencyContainer.innerHTML = `
            <p class="text-center text-muted mb-0 py-5">
                No emergency contacts yet
            </p>
        `;
    }
}
function initializeCounts() {
    total.innerHTML = contactList.length
    num.innerHTML = contactList.length
}

initializeCounts()
renderContacts()
renderFavouriteContacts();
renderEmergencyContacts();