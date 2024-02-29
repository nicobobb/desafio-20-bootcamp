const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const addForm = document.getElementById("addForm");
const userElement = document.getElementById("user");
const editFormModal = document.getElementById("editFormModal");
const editForm = document.getElementById("editForm");
const nameEdit = document.getElementById("nameEdit");
const emailEdit = document.getElementById("emailEdit");
const passwordEdit = document.getElementById("passwordEdit");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const nameEditError = document.getElementById("nameEditError");
const emailEditError = document.getElementById("emailEditError");
const passwordEditError = document.getElementById("passwordEditError");
const successModal = document.getElementById("successModal");

const closeSuccessModal = document.querySelector("#successModal .close");

const showSuccessModal = (message) => {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successModal.style.display = "block";
};

const hideSuccessModal = () => {
    successModal.style.display = "none";
};

closeSuccessModal.addEventListener("click", () => {
    hideSuccessModal();
});

window.addEventListener("click", (event) => {
    if (event.target === successModal) {
        hideSuccessModal();
    }
});

const validationName = (name) => {
    return name.trim().length >= 3;
};

const validationEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validationPassword = (passwordStr) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(passwordStr);
};

const showModalEdit = (isVisibled) => {
    if (isVisibled) {
        editForm.style.opacity = "1";
        editFormModal.style.display = "block";
    } else {
        editForm.style.opacity = "0";
        editFormModal.style.display = "none";
    }
};

class TablaUsuarios {
    constructor(id, name, mail, password) {
        this.id = id;
        this.name = name;
        this.mail = mail;
        this.password = password;
    }

    getHtmlUser() {
        return `
        <div class="user__container">
                <div class="info__container">
                    <h2 class="info__name">${this.name}</h2>
                    <div class="info__dataContainer">
                        <h3 class="info__mail">${this.mail}</h3>
                        <h3 class="info__password">${this.password}</h3>
                    </div>
                </div>
                <div class="button__container">
                    <i class="fa-solid fa-rotate-right" data-id="${this.id}"></i>
                    <i class="fa-solid fa-xmark" data-id="${this.id}"></i>
                </div>
            </div>
        `;
    }
}

const storedUsers = localStorage.getItem("allUsers");
let allUsers = [];
let idUser = "";

if (storedUsers) {
    allUsers = JSON.parse(storedUsers).map((userData) => {
        return new TablaUsuarios(
            userData.id,
            userData.name,
            userData.mail,
            userData.password
        );
    });
}

addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let validated = true;
    const name = nameInput.value;
    const mail = emailInput.value;
    const password = passwordInput.value;

    if (!validationName(name)) {
        nameError.textContent = "El nombre no es válido.";
        nameError.style.opacity = "1";
        validated = false;
    } else {
        nameError.textContent = "";
        nameError.style.opacity = "0";
    }

    if (!validationEmail(mail)) {
        emailError.textContent = "El email no es válido.";
        emailError.style.opacity = "1";
        validated = false;
    } else {
        emailError.textContent = "";
        emailError.style.opacity = "0";
    }

    if (!validationPassword(password)) {
        passwordError.textContent = "La contraseña no es válida.";
        passwordError.style.opacity = "1";
        validated = false;
    } else {
        passwordError.textContent = "";
        passwordError.style.opacity = "0";
    }

    if (validated) {
        let newUser = new TablaUsuarios(randomId(), name, mail, password);

        allUsers.push(newUser);
        localStorage.setItem("allUsers", JSON.stringify(allUsers));

        addForm.reset();
        renderUsers();
        showSuccessModal("Usuario registrado correctamente");
    }
});

const renderUsers = () => {
    if (allUsers.length === 0) {
        userElement.innerHTML = `<p class="msjEmpty ">Todavía no tiene un usuario registrado</p>`;
    } else {
        userElement.innerHTML = "";
        allUsers.forEach((user) => {
            const userHtml = user.getHtmlUser();
            userElement.innerHTML += userHtml;
        });
    }
};

const randomId = () => {
    return Math.random().toString(36).slice(2, 11);
};

const editUser = (userId) => {
    showModalEdit(true);
    allUsers.map((user) => {
        if (user.id === userId) {
            idUser = user.id;
            nameEdit.value = user.name;
            emailEdit.value = user.mail;
            passwordEdit.value = user.password;
        }
    });
};

const deleteUser = (userId) => {
    allUsers = allUsers.filter((user) => user.id !== userId);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    renderUsers();
    showSuccessModal("Usuario eliminado");
};

renderUsers();

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("fa-rotate-right")) {
        const userId = event.target.dataset.id;
        editUser(userId);
    } else if (event.target.classList.contains("fa-xmark")) {
        const userId = event.target.dataset.id;
        deleteUser(userId);
    }
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let validated = true;
    const newName = nameEdit.value;
    const newMail = emailEdit.value;
    const newPassword = passwordEdit.value;

    if (!validationName(newName)) {
        nameEditError.textContent = "El nombre no es válido.";
        nameEditError.style.opacity = "1";

        validated = false;
    } else {
        nameEditError.textContent = "";
        nameEditError.style.opacity = "0";
    }

    if (!validationEmail(newMail)) {
        emailEditError.textContent = "El email no es válido.";
        emailEditError.style.opacity = "1";
        validated = false;
    } else {
        emailEditError.textContent = "";
        emailEditError.style.opacity = "0";
    }

    if (!validationPassword(newPassword)) {
        passwordEditError.textContent = "La contraseña no es válida.";
        passwordEditError.style.opacity = "1";
        validated = false;
    } else {
        passwordEditError.textContent = "";
        passwordEditError.style.opacity = "0";
    }

    if (validated) {
        allUsers.forEach((c) => {
            if (c.id === idUser) {
                c.name = newName;
                c.mail = newMail;
                c.password = newPassword;
            }
        });
        localStorage.setItem("allUsers", JSON.stringify(allUsers));
        renderUsers();
        showModalEdit(false);
        showSuccessModal("Usuario actualizado correctamente");
    }
});
