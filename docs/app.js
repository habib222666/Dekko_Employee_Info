const SUPABASE_URL = 'https://' + 'jborzgwqlinwkeiquivy' + '.supabase.co';
const SUPABASE_KEY = "sb_publishable_W_h2UbIqWWJNGZfRnJSojg_JCpHW7qN";

const rememberLogin =
    document.getElementById("rememberLogin");


/* =========================
   ELEMENTS
========================= */

const employeeList = document.getElementById("employeeList");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const resultCount = document.getElementById("resultCount");
const departmentSection = document.getElementById("departmentSection");
const departmentCards = document.getElementById("departmentCards");
const allDepartmentsButton = document.getElementById("allDepartmentsButton");
const allEmployeesButton = document.getElementById("allEmployeesButton");
const favoriteEmployeesButton = document.getElementById("favoriteEmployeesButton");
const departmentPage = document.getElementById("departmentPage");
const departmentPageTitle = document.getElementById("departmentPageTitle");
const departmentEmployeeList = document.getElementById("departmentEmployeeList");
const departmentBackButton = document.getElementById("departmentBackButton");
const favoritePage = document.getElementById("favoritePage");
const favoriteEmployeeList = document.getElementById("favoriteEmployeeList");
const favoriteBackButton = document.getElementById("favoriteBackButton");
const birthdayButton = document.getElementById("birthdayButton");
const birthdayPage = document.getElementById("birthdayPage");
const birthdayBackButton = document.getElementById("birthdayBackButton");
const birthdayEmployeeList = document.getElementById("birthdayEmployeeList");
const birthdayMonths = document.getElementById("birthdayMonths");
const allEmployeesPage = document.getElementById("allEmployeesPage");
const allEmployeesBackButton = document.getElementById("allEmployeesBackButton");

let favoriteEmployees = JSON.parse(
    localStorage.getItem("favoriteEmployees") || "[]"
);

function isFavorite(employee) {
    return favoriteEmployees.includes(
        String(employee.employee_no)
    );
}

async function toggleFavorite(employee) {

    const employeeNo = String(employee.employee_no);
    const newFavorite = !isFavorite(employee);

    if (newFavorite) {
        favoriteEmployees.push(employeeNo);
    } else {
        favoriteEmployees =
            favoriteEmployees.filter(
                id => id !== employeeNo
            );
    }

    localStorage.setItem(
        "favoriteEmployees",
        JSON.stringify(favoriteEmployees)
    );

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/employee_dekko_v2?employee_no=eq.${encodeURIComponent(employeeNo)}`,
            {
                method: "PATCH",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    favorite: newFavorite
                })
            }
        );

        if (!response.ok) {
            console.error(
                "Failed to sync favorite:",
                await response.text()
            );
        }
    } catch (error) {
        console.error("Favorite sync error:", error);
    }
}


departmentBackButton.addEventListener("click", function() {

    detailsPage.style.display = "none";
    allEmployeesPage.style.display = "none";
    favoritePage.style.display = "none";
    birthdayPage.style.display = "none";

    if (departmentEmployeeList.style.display !== "none") {

        departmentEmployeeList.style.display = "none";
        departmentEmployeeList.innerHTML = "";

        departmentCards.style.display = "grid";
        departmentPage.style.display = "block";
        departmentPageTitle.textContent = "🏢 All Departments";

    } else {

        departmentPage.style.display = "none";
        departmentCards.style.display = "none";

        listPage.style.display = "block";
        departmentSection.style.display = "block";
        employeeList.style.display = "block";

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


const listPage = document.getElementById("listPage");
const detailsPage = document.getElementById("detailsPage");
const employeeDetails = document.getElementById("employeeDetails");
const backButton = document.getElementById("backButton");

const adminButton = document.getElementById("adminButton");

const loginPage = document.getElementById("loginPage");
const loginBackButton = document.getElementById("loginBackButton");
const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");
const loginButton = document.getElementById("loginButton");
const forgotPasswordButton = document.getElementById("forgotPasswordButton");
const resetPasswordPage = document.getElementById("resetPasswordPage");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const updatePasswordButton = document.getElementById("updatePasswordButton");
const resetStatus = document.getElementById("resetStatus");
const loginStatus = document.getElementById("loginStatus");

const adminPage = document.getElementById("adminPage");
const adminBackButton = document.getElementById("adminBackButton");
const logoutButton = document.getElementById("logoutButton");

const employeeSelect = document.getElementById("employeeSelect");
const photoInput = document.getElementById("photoInput");
const uploadPhotoButton = document.getElementById("uploadPhotoButton");
const uploadStatus = document.getElementById("uploadStatus");


let employees = [];


/* =========================
   SUPABASE AUTH
========================= */

let accessToken = null;

const hashParams = new URLSearchParams(
    window.location.hash.substring(1)
);

if (hashParams.get("access_token")) {

    accessToken = hashParams.get("access_token");

    listPage.style.display = "none";
    detailsPage.style.display = "none";
    loginPage.style.display = "none";
    adminPage.style.display = "none";
    resetPasswordPage.style.display = "block";
}



/* =========================
   DESIGNATION NORMALIZATION
========================= */

const DESIGNATION_ORDER = [
    "Executive Director (ED)",
    "Chief Financial Officer (CFO)",
    "Chief Marketing Officer (CMO)",
    "Head of Operation",
    "Head of Planning",
    "Head of Supply Chain Management",
    "Divisional Head",
    "Deputy General Manager (DGM)",
    "Asst. General Manager (AGM)",
    "Sr. Manager",
    "Manager",
    "In Charge",
    "Deputy Manager",
    "Asst. Manager",
    "CS Team Lead",
    "Team Lead",
    "Sr. Executive",
    "Sr. Designer",
    "Executive",
    "Designer",
    "Graphics Designer",
    "3D Designer",
    "Fashion Designer",
    "Interior Designer",
    "Jr. Executive",
    "Jr. Merchandiser",
    "Data Management Officer (DMO)",
    "Pattern Master",
    "Messenger",
    "Office Assistant",
    "Driver",
    "Delivery Man",
    "Intern"
];

const DESIGNATION_RANK = new Map(
    DESIGNATION_ORDER.map(
        (designation, index) => [designation, index]
    )
);

function normalizeDesignation(designation) {

    const value = String(designation || "").trim();

    const groups = {
        "Executive Director (ED)": [
            "Executive Director",
            "ED"
        ],
        "Chief Financial Officer (CFO)": [
            "Chief Financial Officer",
            "CFO"
        ],
        "Chief Marketing Officer (CMO)": [
            "Chief Marketing Officer",
            "CMO"
        ],
        "Deputy General Manager (DGM)": [
            "Deputy General Manager",
            "DGM"
        ],
        "Asst. General Manager (AGM)": [
            "Asst. General Manager",
            "AGM"
        ],
        "Data Management Officer (DMO)": [
            "Data Management Officer",
            "DMO"
        ]
    };

    for (const [groupName, values] of Object.entries(groups)) {
        if (values.some(item =>
            item.toLowerCase() === value.toLowerCase()
        )) {
            return groupName;
        }
    }

    return value || "Other";
}

function populateDesignationFilter() {

    const filter = document.getElementById("designationFilter");

    if (!filter) return;

    const designations = [...new Set(
        employees.map(employee =>
            normalizeDesignation(employee.designation)
        )
    )].filter(Boolean);

    designations.sort((a, b) => {
        const rankA =
            DESIGNATION_RANK.has(a)
                ? DESIGNATION_RANK.get(a)
                : DESIGNATION_ORDER.length;

        const rankB =
            DESIGNATION_RANK.has(b)
                ? DESIGNATION_RANK.get(b)
                : DESIGNATION_ORDER.length;

        if (rankA !== rankB) {
            return rankA - rankB;
        }

        return a.localeCompare(b);
    });

    filter.innerHTML =
        '<option value="">All Designations</option>';

    designations.forEach(designation => {

        const option = document.createElement("option");

        option.value = designation;
        option.textContent = designation;

        filter.appendChild(option);

    });
}

/* =========================
   LOAD EMPLOYEES
========================= */

async function loadEmployees() {

    employeeList.innerHTML =
        "<p>Loading employees...</p>";

    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/employee_dekko_v2?select=*`,
            {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Supabase error: " + response.status
            );

        }


        employees = await response.json();

        // Load favorite status from Supabase
        favoriteEmployees = employees
            .filter(employee => employee.favorite === true)
            .map(employee => String(employee.employee_no));

        localStorage.setItem(
            "favoriteEmployees",
            JSON.stringify(favoriteEmployees)
        );


        showDepartmentCards();

        showEmployees(employees);

        populateDesignationFilter();
        loadEmployeeSelect();


    } catch (error) {

        console.error(error);


        employeeList.innerHTML =
            "<p>Employee data load হয়নি।</p>";


        resultCount.textContent = "";

    }

}


/* =========================
   INITIALS
========================= */

function getInitials(name) {

    if (!name) {

        return "E";

    }


    const words =
        name.trim().split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0].charAt(0) +
        words[1].charAt(0)
    ).toUpperCase();

}


/* =========================
   PHOTO URL
========================= */

function getPhoto(employee) {

    if (employee.photo_path) {

        const photoId =
            "photo_" + employee.employee_no + "_" +
            Math.random().toString(36).substring(2, 8);

        const photoUrl =
            `${SUPABASE_URL}/storage/v1/object/employee-photos/${employee.photo_path}`;

        setTimeout(async () => {

            try {

                const response = await fetch(photoUrl, {
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": "Bearer " + SUPABASE_KEY
                    }
                });

                if (!response.ok) {
                    throw new Error("HTTP " + response.status);
                }

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);

                const img = document.getElementById(photoId);

                if (img) {
                    img.src = imageUrl;
                }

            } catch (error) {

                console.error(
                    "Photo loading failed:",
                    employee.employee_no,
                    error
                );

                const img = document.getElementById(photoId);

                if (img) {
                    img.style.display = "none";

                    if (img.nextElementSibling) {
                        img.nextElementSibling.style.display = "flex";
                    }
                }
            }

        }, 0);

        return `
            <img
                id="${photoId}"
                src=""
                class="employee-photo"
                alt="${employee.employee_name || "Employee"}"
            >
            <div
                class="employee-photo-placeholder"
                style="display:none;"
            >
                No Photo
            </div>
        `;
    }

    return `
        <div class="employee-photo-placeholder">
            No Photo
        </div>
    `;
}

function showDepartmentCards() {

    departmentCards.innerHTML = "";

    const departments = {};

    employees.forEach((employee) => {

        const department =
            (employee.department || "Other").trim();

        if (!departments[department]) {
            departments[department] = [];
        }

        departments[department].push(employee);
    });

    const departmentNames =
        Object.keys(departments).sort((a, b) =>
            a.localeCompare(b)
        );

    departmentNames.forEach((department, index) => {

        const card =
            document.createElement("button");

        card.type = "button";
        card.className =
            "department-card department-color-" +
            ((index % 30) + 1);

        card.innerHTML = `
            <span class="department-name">
                ${department}
            </span>
            <span class="department-count">
                ${departments[department].length} Employees
            </span>
        `;

        card.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();

            searchInput.value = "";

            departmentPageTitle.textContent = department;

            departmentCards.style.display = "none";
            departmentEmployeeList.innerHTML = "";
            departmentEmployeeList.style.display = "flex";

            const selectedEmployees = departments[department];

            selectedEmployees.forEach((employee) => {
                const div = document.createElement("div");
                div.className = "employee-card";

                div.innerHTML = `
                    <div class="employee-card-top">
                        ${getPhoto(employee)}
                        <div class="employee-card-info">
                            <h3>${employee.employee_name || "-"}</h3>
                            <p>${employee.designation || "-"}</p>
                            <span>${employee.employee_no || "-"}</span>
                        </div>
                    </div>
                    <div class="employee-card-actions">

                        <button class="favorite-button" type="button">
                            ${isFavorite(employee) ? "❤️" : "♡"}
                        </button>

                        <button class="view-button" type="button">
                            View Details
                        </button>

                    </div>
                `;

                div.querySelector(".view-button").addEventListener(
                    "click",
                    function() {
                        showDetails(employee, "department");
                    }
                );

                div.querySelector(".favorite-button")
                    .addEventListener(
                        "click",
                        function() {
                            toggleFavorite(employee);
                            this.textContent =
                                isFavorite(employee) ? "❤️" : "♡";
                        }
                    );

                departmentEmployeeList.appendChild(div);
            });

            listPage.style.display = "none";
            departmentPage.style.display = "block";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };

        departmentCards.appendChild(card);
    });

    departmentSection.style.display =
        departmentNames.length ? "block" : "none";
}

function showFavoriteEmployees() {

    favoriteEmployeeList.innerHTML = "";

    const favorites = employees.filter(function(employee) {
        return isFavorite(employee);
    });

    if (favorites.length === 0) {
        favoriteEmployeeList.innerHTML =
            "<p>No favorite employees found.</p>";
        return;
    }

    favorites.forEach(function(employee) {

        const div = document.createElement("div");

        div.className = "employee-card";

        div.innerHTML = `
            <div class="employee-card-top">
                ${getPhoto(employee)}
                <div class="employee-card-info">
                    <h3>${employee.employee_name || "-"}</h3>
                    <p>${employee.designation || "-"}</p>
                    <span>${employee.employee_no || "-"}</span>
                </div>
            </div>

            <div class="employee-card-actions">

                <button class="favorite-button" type="button">
                    ❤️
                </button>

                <button class="view-button" type="button">
                    View Details
                </button>

            </div>
        `;

        div.querySelector(".favorite-button")
            .addEventListener(
                "click",
                function() {
                    toggleFavorite(employee);
                    showFavoriteEmployees();
                }
            );

        div.querySelector(".view-button")
            .addEventListener(
                "click",
                function() {
                    showDetails(employee, "favorite");
                }
            );

        favoriteEmployeeList.appendChild(div);
    });
}


function showEmployees(list, targetList = employeeList) {

    const sortedList = [...list].sort((a, b) => {

        const rankA =
            DESIGNATION_RANK.has(
                normalizeDesignation(a.designation)
            )
                ? DESIGNATION_RANK.get(
                    normalizeDesignation(a.designation)
                )
                : DESIGNATION_ORDER.length;

        const rankB =
            DESIGNATION_RANK.has(
                normalizeDesignation(b.designation)
            )
                ? DESIGNATION_RANK.get(
                    normalizeDesignation(b.designation)
                )
                : DESIGNATION_ORDER.length;

        if (rankA !== rankB) {
            return rankA - rankB;
        }

        return String(a.employee_name || "")
            .localeCompare(
                String(b.employee_name || "")
            );
    });

    targetList.innerHTML = "";


    if (targetList === employeeList) {
        resultCount.textContent =
            `${list.length} employee${list.length === 1 ? "" : "s"} found`;
    }


    if (list.length === 0) {

        targetList.innerHTML =
            "<p>No employees found.</p>";

        return;

    }


    sortedList.forEach((employee) => {

        const div =
            document.createElement("div");


        div.className =
            "employee-card";


        div.innerHTML = `

            <div class="employee-card-top">

                ${getPhoto(employee)}

                <div class="employee-card-info">

                    <h3>
                        ${employee.employee_name || "-"}
                    </h3>

                    <p>
                        ${employee.designation || "-"}
                    </p>

                    <span>
                        ${employee.employee_no || "-"}
                    </span>

                </div>

            </div>


            <div class="employee-card-actions">

                <button class="favorite-button" type="button">

                    ${isFavorite(employee) ? "❤️" : "♡"}

                </button>

                <button class="view-button" type="button">

                    View Details

                </button>

            </div>

        `;


        div.querySelector(".view-button")
            .addEventListener(
                "click",
                function() {

                    showDetails(employee, "allEmployees");

                }
            );


        div.querySelector(".favorite-button")
            .addEventListener(
                "click",
                function() {
                    toggleFavorite(employee);
                    this.textContent =
                        isFavorite(employee) ? "❤️" : "♡";
                }
            );

        targetList.appendChild(div);

    });

}


/* =========================
   EMPLOYEE DETAILS
========================= */

let detailsPreviousPage = "list";

function showDetails(employee, previousPage = "list") {

    detailsPreviousPage = previousPage;

    listPage.style.display =
        "none";

    allEmployeesPage.style.display =
        "none";

    departmentPage.style.display =
        "none";

    favoritePage.style.display =
        "none";


    detailsPage.style.display =
        "block";


    employeeDetails.innerHTML = `

        <div class="profile-card">

            <div class="profile-photo">

                ${getPhoto(employee)}

            </div>


            <h2>

                ${employee.employee_name || "-"}

            </h2>


            <p class="profile-designation">

                ${employee.designation || "-"}

            </p>


            <p class="profile-company">

                ${employee.company || "-"}

            </p>

        </div>


        <div class="details-card">

            <div class="detail-row">
                <span>
                    Employee ID
                </span>
                <strong>
                    ${employee.employee_no || "-"}
                </strong>
            </div>

            <div class="detail-row">
                <span>
                    Department
                </span>
                <strong>
                    ${employee.department || "-"}
                </strong>
            </div>

            <div class="detail-row">
                <span>
                    Official No.
                </span>
                <strong>
                    ${employee.phone_official || "-"}
                </strong>
            </div>

            <div class="detail-row">
                <span>
                    Personal No.
                </span>
                <strong>
                    ${employee.personal_no || "-"}
                </strong>
            </div>

            <div class="detail-row">
                <span>
                    Email Address
                </span>
                <strong>
                    ${employee.email_official || "-"}
                </strong>
            </div>

            <div class="detail-row">
                <span>
                    PABX No.
                </span>
                <strong>
                    ${employee.pabx_number || "-"}
                </strong>
            </div>

            <div class="detail-row">
                <span>
                    Blood Group
                </span>
                <strong>
                    ${employee.blood_group || "-"}
                </strong>
            </div>

            <div class="detail-row">
                <span>
                    Joining Date
                </span>
                <strong>
                    ${employee.joining_date || "-"}
                </strong>
            </div>

            <div class="detail-row">
                <span>
                    Date of Birth
                </span>
                <strong>
                    ${employee.date_of_birth || "-"}
                </strong>
            </div>

            <div class="detail-row">
                <span>
                    NID No.
                </span>
                <strong>
                    ${employee.nid || "-"}
                </strong>
            </div>

            <div class="detail-row">
                <span>
                    TIN No.
                </span>
                <strong>
                    ${employee.tin_no || "-"}
                </strong>
            </div>

            <div class="detail-row">
                <span>
                    QR Code
                </span>
                <strong>
                    <div id="employeeQRCode"></div>
                </strong>
            </div>

        </div>

    `;


    const qrContainer = document.getElementById("employeeQRCode");

    if (qrContainer && employee.employee_no) {
        const qrUrl =
            "https://www.dekkolegacy.com/employees/" +
            encodeURIComponent(employee.employee_no);

        const img = document.createElement("img");
        img.src =
            "https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=" +
            encodeURIComponent(qrUrl);
        img.width = 130;
        img.height = 130;
        img.alt = "QR Code";

        qrContainer.innerHTML = "";
        qrContainer.appendChild(img);
    }
}


/* =========================
   EMPLOYEE SELECT
========================= */

function loadEmployeeSelect() {

    employeeSelect.innerHTML = `
        <option value="">
            Select employee
        </option>
    `;


    employees.forEach((employee) => {

        const option =
            document.createElement("option");


        option.value =
            employee.employee_no;


        option.textContent =
            `${employee.employee_no} - ${employee.employee_name}`;


        employeeSelect.appendChild(option);

    });

}


/* =========================
   ADMIN BUTTON
========================= */

if (adminButton) {
    adminButton.addEventListener(
        "click",
        function() {

            listPage.style.display = "none";
            detailsPage.style.display = "none";
            loginPage.style.display = "block";
            loginStatus.textContent = "";

        }
    );
}


/* =========================
   LOGIN BACK
========================= */

loginBackButton.addEventListener(
    "click",
    function() {

        loginPage.style.display =
            "none";


        listPage.style.display =
            "block";

    }
);


/* =========================
   RESET PASSWORD
========================= */

updatePasswordButton.addEventListener(
    "click",
    async function() {

        const password = newPassword.value;
        const confirm = confirmPassword.value;

        if (!password || !confirm) {
            resetStatus.textContent =
                "Please enter both password fields.";
            return;
        }

        if (password !== confirm) {
            resetStatus.textContent =
                "Passwords do not match.";
            return;
        }

        resetStatus.textContent =
            "Updating password...";

        try {

            const response = await fetch(
                `${SUPABASE_URL}/auth/v1/user`,
                {
                    method: "PUT",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization":
                            "Bearer " + accessToken,
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.msg ||
                    data.error_description ||
                    "Password update failed."
                );
            }

            resetStatus.textContent =
                "Password updated successfully.";

            newPassword.value = "";
            confirmPassword.value = "";

        } catch (error) {

            console.error(error);

            resetStatus.textContent =
                error.message;
        }
    }
);


/* =========================
   FORGOT PASSWORD
========================= */

forgotPasswordButton.addEventListener(
    "click",
    async function() {

        const email = adminEmail.value.trim();

        if (!email) {
            loginStatus.textContent =
                "Please enter your admin email first.";
            return;
        }

        loginStatus.textContent =
            "Sending password reset email...";

        try {

            const response = await fetch(
                `${SUPABASE_URL}/auth/v1/recover`,
                {
                    method: "POST",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        redirect_to: window.location.origin +
                            window.location.pathname
                    })
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(
                    data.msg ||
                    data.error_description ||
                    "Password reset failed."
                );
            }

            loginStatus.textContent =
                "Password reset email sent. Check your email.";

        } catch (error) {

            console.error(error);

            loginStatus.textContent =
                error.message;
        }
    }
);


/* =========================
   RESTORE SAVED ADMIN SESSION
========================= */

async function restoreSavedAdminSession() {

    const savedSession =
        localStorage.getItem(
            "dekko_admin_session"
        );

    if (!savedSession) return;

    try {

        const session =
            JSON.parse(savedSession);

        if (!session.access_token) {
            localStorage.removeItem(
                "dekko_admin_session"
            );
            return;
        }

        const response =
            await fetch(
                `${SUPABASE_URL}/auth/v1/user`,
                {
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization":
                            "Bearer " +
                            session.access_token
                    }
                }
            );

        if (!response.ok) {
            localStorage.removeItem(
                "dekko_admin_session"
            );
            return;
        }

        accessToken =
            session.access_token;

        loginPage.style.display =
            "none";

        adminPage.style.display =
            "block";

        uploadStatus.textContent = "";

        console.log(
            "Saved admin session restored."
        );

    } catch (error) {

        console.error(
            "Session restore failed:",
            error
        );

        localStorage.removeItem(
            "dekko_admin_session"
        );
    }
}

restoreSavedAdminSession();


/* =========================
   ADMIN LOGIN
========================= */

loginButton.addEventListener(
    "click",
    async function() {

        const email =
            adminEmail.value.trim();


        const password =
            adminPassword.value;


        if (!email) {

            loginStatus.textContent =
                "Please enter email.";

            return;

        }


        if (!password) {

            loginStatus.textContent =
                "Please enter password.";

            return;

        }


        loginStatus.textContent =
            "Logging in...";


        try {

            const response =
                await fetch(
                    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
                    {
                        method: "POST",

                        headers: {
                            "apikey": SUPABASE_KEY,
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error_description ||
                    data.msg ||
                    "Login failed."
                );

            }


            accessToken =
                data.access_token;

            if (rememberLogin && rememberLogin.checked) {

                localStorage.setItem(
                    "dekko_admin_session",
                    JSON.stringify({
                        access_token: data.access_token,
                        refresh_token: data.refresh_token || null
                    })
                );

            } else {

                localStorage.removeItem(
                    "dekko_admin_session"
                );
            }


            loginStatus.textContent =
                "Login successful!";


            adminEmail.value = "";

            adminPassword.value = "";


            loginPage.style.display =
                "none";


            adminPage.style.display =
                "block";


            uploadStatus.textContent = "";

            if (window.__openSalaryAfterLogin) {
                window.__openSalaryAfterLogin = false;

                const salaryBtn =
                    document.getElementById("salaryButton");

                if (salaryBtn) salaryBtn.click();
            }


        } catch (error) {

            console.error(error);


            loginStatus.textContent =
                "Login failed: " +
                error.message;

        }

    }
);


/* =========================
   ADMIN BACK
========================= */

adminBackButton.addEventListener(
    "click",
    function() {

        adminPage.style.display =
            "none";


        listPage.style.display =
            "block";


        uploadStatus.textContent =
            "";

    }
);


/* =========================
   LOGOUT
========================= */

logoutButton.addEventListener(
    "click",
    function() {

        accessToken = null;

        localStorage.removeItem(
            "dekko_admin_session"
        );


        adminPage.style.display =
            "none";


        listPage.style.display =
            "block";


        uploadStatus.textContent =
            "";

    }
);


/* =========================
   PHOTO UPLOAD
========================= */

uploadPhotoButton.addEventListener(
    "click",
    async function() {

        if (!accessToken) {

            uploadStatus.textContent =
                "Please login first.";

            return;

        }


        const employeeNo =
            employeeSelect.value;


        const file =
            photoInput.files[0];


        if (!employeeNo) {

            uploadStatus.textContent =
                "Please select an employee.";

            return;

        }


        if (!file) {

            uploadStatus.textContent =
                "Please select a photo.";

            return;

        }


        const employee =
            employees.find(
                e =>
                    e.employee_no === employeeNo
            );


        if (!employee) {

            uploadStatus.textContent =
                "Employee not found.";

            return;

        }


        uploadStatus.textContent =
            "Uploading photo...";


        try {

            const extension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            const fileName =
                `${employeeNo}.${extension}`;


            const uploadResponse =
                await fetch(
                    `${SUPABASE_URL}/storage/v1/object/employee-photos/${fileName}`,
                    {
                        method: "POST",

                        headers: {
                            "apikey": SUPABASE_KEY,
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": file.type
                        },

                        body: file
                    }
                );


            if (!uploadResponse.ok) {

                const errorText =
                    await uploadResponse.text();


                throw new Error(
                    errorText
                );

            }


            const updateResponse =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/employee_dekko_v2?employee_no=eq.${encodeURIComponent(employeeNo)}`,
                    {
                        method: "PATCH",

                        headers: {
                            "apikey": SUPABASE_KEY,
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                            "Prefer": "return=minimal"
                        },

                        body: JSON.stringify({
                            photo_path: fileName
                        })
                    }
                );


            if (!updateResponse.ok) {

                throw new Error(
                    "Photo uploaded but database update failed."
                );

            }


            uploadStatus.textContent =
                "Photo uploaded successfully!";


            photoInput.value = "";


            await loadEmployees();


        } catch (error) {

            console.error(error);


            uploadStatus.textContent =
                "Upload failed: " +
                error.message;

        }

    }
);


/* =========================
   BACK BUTTON
========================= */

backButton.addEventListener(

    "click",

    function() {

        detailsPage.style.display =
            "none";

        if (detailsPreviousPage === "favorite") {

            listPage.style.display =
                "none";

            departmentPage.style.display =
                "none";

            favoritePage.style.display =
                "block";

            showFavoriteEmployees();

        } else if (detailsPreviousPage === "department") {

            listPage.style.display =
                "none";

            allEmployeesPage.style.display =
                "none";

            favoritePage.style.display =
                "none";

            departmentPage.style.display =
                "block";

            departmentCards.style.display =
                "none";

        } else if (detailsPreviousPage === "allEmployees") {

            departmentPage.style.display =
                "none";

            favoritePage.style.display =
                "none";

            listPage.style.display =
                "none";

            allEmployeesPage.style.display =
                "block";

            showEmployees(employees);

        } else {

            favoritePage.style.display =
                "none";

            departmentPage.style.display =
                "none";

            listPage.style.display =
                "block";

            departmentSection.style.display =
                "block";

            employeeList.style.display =
                "block";
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

);


/* =========================
   ALL DEPARTMENTS
========================= */

allDepartmentsButton.addEventListener(
    "click",
    function() {

        listPage.style.display = "none";
        allEmployeesPage.style.display = "none";
        favoritePage.style.display = "none";
        birthdayPage.style.display = "none";
        detailsPage.style.display = "none";

        departmentCards.style.display = "grid";
        departmentEmployeeList.innerHTML = "";

        departmentPage.style.display = "block";

        departmentPageTitle.textContent = "🏢 All Departments";
        departmentEmployeeList.innerHTML = "";

        showDepartmentCards();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


/* =========================
   FAVORITE EMPLOYEES
========================= */

favoriteEmployeesButton.addEventListener(
    "click",
    function() {

        showFavoriteEmployees();

        listPage.style.display = "none";
        departmentPage.style.display = "none";
        favoritePage.style.display = "block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


favoriteBackButton.addEventListener(
    "click",
    function() {

        favoritePage.style.display = "none";
        listPage.style.display = "block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


/* =========================
   DEPARTMENT / ALL EMPLOYEES
========================= */

allEmployeesButton.addEventListener(
    "click",
    function() {

        searchInput.value = "";

        listPage.style.display = "none";
        departmentPage.style.display = "none";
        favoritePage.style.display = "none";
        birthdayPage.style.display = "none";

        allEmployeesPage.style.display = "block";

        showEmployees(employees);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);

if (allEmployeesBackButton) {
    allEmployeesBackButton.addEventListener(
        "click",
        function() {

            allEmployeesPage.style.display = "none";
            listPage.style.display = "block";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    function() {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();

        const selectedDesignation =
            designationFilter
                ? designationFilter.value
                : "";

        const filtered =
            employees.filter(employee => {

                const matchesDesignation =
                    !selectedDesignation ||
                    normalizeDesignation(
                        employee.designation
                    ) === selectedDesignation;

                const text =
                    `${employee.employee_name || ""} ` +
                    `${employee.employee_no || ""} ` +
                    `${employee.company || ""} ` +
                    `${employee.department || ""} ` +
                    `${employee.designation || ""}`;

                const matchesSearch =
                    !searchText ||
                    text.toLowerCase()
                        .includes(searchText);

                return matchesDesignation &&
                       matchesSearch;
            });

        showEmployees(filtered);

    }
);



/* =========================
   CLEAR SEARCH
========================= */

clearSearch.addEventListener(
    "click",
    function() {

        searchInput.value = "";

        if (designationFilter) {
            designationFilter.value = "";
        }

        showEmployees(employees);


        searchInput.focus();

    }
);


/* =========================
   START APP
========================= */

loadEmployees();


/* =========================
   CREATE NEW USER
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const createUserButton = document.getElementById("createUserButton");

    if (!createUserButton) return;

    createUserButton.addEventListener("click", async function () {

        const email = prompt("Enter new user email:");

        if (!email) return;

        const password = prompt("Enter password (minimum 6 characters):");

        if (!password) return;

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        createUserButton.disabled = true;
        createUserButton.textContent = "Creating...";

        try {

            const response = await fetch(
                `${SUPABASE_URL}/auth/v1/signup`,
                {
                    method: "POST",
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            console.log("Create User Response:", data);

            if (!response.ok) {
                throw new Error(
                    data.msg ||
                    data.message ||
                    data.error_description ||
                    "User creation failed"
                );
            }

            alert(
                "User created successfully!\n\n" +
                "Email: " + email
            );

        } catch (error) {

            console.error("Create User Error:", error);

            alert(
                "User creation failed:\n\n" +
                error.message
            );

        } finally {

            createUserButton.disabled = false;
            createUserButton.textContent = "Create New User";

        }

    });

});

/* =========================
   BIRTHDAY FEATURE
========================= */

function showBirthdayEmployees(month) {
    if (!birthdayEmployeeList) return;

    const monthNumber = String(month).padStart(2, "0");

    const birthdayEmployees = employees
        .filter(employee => {
            const birthday = String(employee.birthday || "").trim();
            return /^\d{1,2}-\d{1,2}$/.test(birthday) &&
                   birthday.split("-")[1].padStart(2, "0") === monthNumber;
        })
        .sort((a, b) => {
            const dayA = parseInt(String(a.birthday).split("-")[0], 10);
            const dayB = parseInt(String(b.birthday).split("-")[0], 10);
            return dayA - dayB;
        });

    if (birthdayEmployees.length === 0) {
        birthdayEmployeeList.innerHTML =
            '<p class="no-birthday">No birthdays in this month.</p>';
        return;
    }

    birthdayEmployeeList.innerHTML = `
        <div class="birthday-table-wrapper">
            <table class="birthday-table">
                <thead>
                    <tr>
                        <th>Sl.</th>
                        <th>Employee Name</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${birthdayEmployees.map((employee, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${employee.name || employee.employee_name || ""}</td>
                            <td>${employee.designation || ""}</td>
                            <td>${employee.department || ""}</td>
                            <td>${(() => {
                                const parts = String(employee.birthday || "").split("-");
                                const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                                if (parts.length === 2) {
                                    const day = parts[0].padStart(2, "0");
                                    const month = months[parseInt(parts[1], 10) - 1];
                                    return month ? `${day} ${month}` : employee.birthday || "";
                                }
                                return employee.birthday || "";
                            })()}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function openBirthdayPage() {
    listPage.style.display = "none";
    adminButton.style.setProperty("display", "none", "important");
    document.getElementById("appTitle").style.display = "none";
    departmentSection.style.display = "none";
    employeeList.style.display = "none";
    departmentPage.style.display = "none";
    favoritePage.style.display = "none";
    detailsPage.style.display = "none";
    birthdayPage.style.display = "block";

    birthdayEmployeeList.innerHTML =
        '<p class="birthday-instruction">Select a month to view birthdays.</p>';
}

if (birthdayButton) {
    birthdayButton.addEventListener("click", openBirthdayPage);
}

if (birthdayBackButton) {
    birthdayBackButton.addEventListener("click", () => {
        birthdayPage.style.display = "none";
        listPage.style.display = "block";
        adminButton.style.removeProperty("display");
        document.getElementById("appTitle").style.display = "";
        departmentSection.style.display = "block";
        employeeList.style.display = "block";
    });
}

if (birthdayMonths) {
    birthdayMonths.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            birthdayMonths.querySelectorAll("button").forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");
            showBirthdayEmployees(button.dataset.month);
        });
    });
}

/* =========================
   DESIGNATION FILTER
========================= */

const designationFilter =
    document.getElementById("designationFilter");

if (designationFilter) {

    designationFilter.addEventListener(
        "change",
        function() {

            const selectedDesignation =
                this.value;

            const searchText =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const filtered =
                employees.filter(employee => {

                    const matchesDesignation =
                        !selectedDesignation ||
                        normalizeDesignation(
                            employee.designation
                        ) === selectedDesignation;

                    const text =
                        `${employee.employee_name || ""} ` +
                        `${employee.employee_no || ""} ` +
                        `${employee.company || ""} ` +
                        `${employee.department || ""} ` +
                        `${employee.designation || ""}`;

                    const matchesSearch =
                        !searchText ||
                        text.toLowerCase()
                            .includes(searchText);

                    return matchesDesignation &&
                           matchesSearch;
                });

            showEmployees(filtered);

        }
    );

}

/* =========================
   ADD NEW EMPLOYEE
========================= */

const showAddEmployeeButton =
    document.getElementById("showAddEmployeeButton");

const addEmployeeForm =
    document.getElementById("addEmployeeForm");

const saveNewEmployeeButton =
    document.getElementById("saveNewEmployeeButton");

const addEmployeeStatus =
    document.getElementById("addEmployeeStatus");

if (showAddEmployeeButton && addEmployeeForm) {

    showAddEmployeeButton.addEventListener(
        "click",
        function() {

            if (addEmployeeForm.style.display === "none") {

                addEmployeeForm.style.display = "block";

                showAddEmployeeButton.textContent =
                    "− Close Add Employee";

            } else {

                addEmployeeForm.style.display = "none";

                showAddEmployeeButton.textContent =
                    "+ Add New Employee";
            }

        }
    );
}

if (saveNewEmployeeButton) {

    saveNewEmployeeButton.addEventListener(
        "click",
        async function() {

            const employeeName =
                document.getElementById("newEmployeeName").value.trim();

            const designation =
                document.getElementById("newEmployeeDesignation").value.trim();

            const company =
                document.getElementById("newEmployeeCompany").value.trim();

            const employeeNo =
                document.getElementById("newEmployeeNo").value.trim();

            const department =
                document.getElementById("newEmployeeDepartment").value.trim();

            const officialNo =
                document.getElementById("newEmployeeOfficialNo").value.trim();

            const personalNo =
                document.getElementById("newEmployeePersonalNo").value.trim();

            const emailOfficial =
                document.getElementById("newEmployeeEmail").value.trim();

            const pabxNumber =
                document.getElementById("newEmployeePabx").value.trim();

            const bloodGroup =
                document.getElementById("newEmployeeBloodGroup").value.trim();

            const joiningDate =
                document.getElementById("newEmployeeJoiningDate").value;

            const birthday =
                document.getElementById("newEmployeeBirthday").value.trim();

            const nid =
                document.getElementById("newEmployeeNid").value.trim();

            const tinNo =
                document.getElementById("newEmployeeTin").value.trim();

            const bankName =
                document.getElementById("newEmployeeBankName").value.trim();

            const accountNo =
                document.getElementById("newEmployeeAccountNo").value.trim();

            if (!employeeName) {
                alert("Employee Name is required.");
                return;
            }

            if (!employeeNo) {
                alert("Employee ID is required.");
                return;
            }

            if (!accessToken) {
                alert("Please login first.");
                return;
            }

            saveNewEmployeeButton.disabled = true;
            saveNewEmployeeButton.textContent = "Saving...";

            addEmployeeStatus.textContent =
                "Saving employee...";

            try {

                const response = await fetch(
                    `${SUPABASE_URL}/rest/v1/employee_dekko_v2`,
                    {
                        method: "POST",

                        headers: {
                            "apikey": SUPABASE_KEY,
                            "Authorization":
                                `Bearer ${accessToken}`,
                            "Content-Type":
                                "application/json",
                            "Prefer":
                                "return=representation"
                        },

                        body: JSON.stringify({
                            employee_name: employeeName,
                            designation: designation,
                            company: company,
                            employee_no: employeeNo,
                            department: department,
                            phone_official: officialNo,
                            personal_no: personalNo,
                            email_official: emailOfficial,
                            pabx_number: pabxNumber,
                            blood_group: bloodGroup,
                            joining_date: joiningDate || null,
                            birthday: birthday,
                            nid: nid,
                            tin_no: tinNo,
                            bank_name: bankName,
                            account_no: accountNo
                        })
                    }
                );

                const data = await response.json();

                console.log(
                    "Add Employee Response:",
                    data
                );

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        data.details ||
                        data.hint ||
                        data.error ||
                        "Employee could not be added."
                    );
                }

                addEmployeeStatus.textContent =
                    "Employee added successfully.";

                alert(
                    "Employee added successfully!"
                );

                document.getElementById(
                    "newEmployeeName"
                ).value = "";

                document.getElementById(
                    "newEmployeeDesignation"
                ).value = "";

                document.getElementById(
                    "newEmployeeCompany"
                ).value = "";

                document.getElementById(
                    "newEmployeeNo"
                ).value = "";

                document.getElementById(
                    "newEmployeeDepartment"
                ).value = "";

                document.getElementById(
                    "newEmployeeOfficialNo"
                ).value = "";

                document.getElementById(
                    "newEmployeePersonalNo"
                ).value = "";

                document.getElementById(
                    "newEmployeeEmail"
                ).value = "";

                document.getElementById(
                    "newEmployeePabx"
                ).value = "";

                document.getElementById(
                    "newEmployeeBloodGroup"
                ).value = "";

                document.getElementById(
                    "newEmployeeJoiningDate"
                ).value = "";

                document.getElementById(
                    "newEmployeeBirthday"
                ).value = "";

                document.getElementById(
                    "newEmployeeNid"
                ).value = "";

                document.getElementById(
                    "newEmployeeTin"
                ).value = "";

                document.getElementById("newEmployeeBankName").value = "";
                document.getElementById("newEmployeeAccountNo").value = "";

                await loadEmployees();

            } catch (error) {

                console.error(
                    "Add Employee Error:",
                    error
                );

                addEmployeeStatus.textContent =
                    "Error: " + error.message;

                alert(
                    "Employee could not be added:\n\n" +
                    error.message
                );

            } finally {

                saveNewEmployeeButton.disabled = false;

                saveNewEmployeeButton.textContent =
                    "Save Employee";
            }

        }
    );

}




/* ATTENDANCE CHECK IN/OUT - SUPABASE */
(function () {
    const page = document.getElementById("attendancePage");
    if (!page) return;

    const checkIn = document.getElementById("checkInButton");
    const checkOut = document.getElementById("checkOutButton");
    const status = document.getElementById("attendanceStatus");
    const inTime = document.getElementById("attendanceCheckInTime");
    const outTime = document.getElementById("attendanceCheckOutTime");
    const hours = document.getElementById("attendanceWorkingHours");
    const message = document.getElementById("attendanceMessage");
    const history = document.getElementById("attendanceHistory");
    const present = document.getElementById("attendancePresentDays");
    const openButton = document.getElementById("attendanceButton");

    if (!checkIn || !checkOut) return;

    const todayKey = () => new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());

    const monthStartKey = () => todayKey().slice(0, 7) + "-01";

    const timeText = value => value
        ? new Date(value).toLocaleTimeString("en-GB", {
            timeZone: "Asia/Dhaka",
            hour: "2-digit",
            minute: "2-digit"
        })
        : "—";

    const dateText = value => new Date(value + "T12:00:00+06:00")
        .toLocaleDateString("en-GB", {
            timeZone: "Asia/Dhaka",
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    async function api(path, options = {}) {
        if (!accessToken) {
            throw new Error("Please log in to use Attendance.");
        }

        const response = await fetch(`${SUPABASE_URL}${path}`, {
            ...options,
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });

        const text = await response.text();
        let data = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch (_) {
            data = text;
        }

        if (!response.ok) {
            throw new Error(
                data && data.message
                    ? data.message
                    : "Attendance request failed (" + response.status + ")."
            );
        }

        return data;
    }

    function showWorkingHours(record) {
        if (!record || !record.check_in) {
            hours.textContent = "—";
            return;
        }

        const start = new Date(record.check_in).getTime();
        const end = record.check_out
            ? new Date(record.check_out).getTime()
            : Date.now();
        const minutes = Math.max(0, Math.floor((end - start) / 60000));

        hours.textContent =
            Math.floor(minutes / 60) + "h " + (minutes % 60) + "m";
    }

    function showToday(record) {
        inTime.textContent = timeText(record && record.check_in);
        outTime.textContent = timeText(record && record.check_out);
        showWorkingHours(record);

        if (!record || !record.check_in) {
            status.textContent = "Not Checked In";
            checkIn.disabled = false;
            checkOut.disabled = true;
        } else if (!record.check_out) {
            status.textContent = "Checked In";
            checkIn.disabled = true;
            checkOut.disabled = false;
        } else {
            status.textContent = "Checked Out";
            checkIn.disabled = true;
            checkOut.disabled = true;
        }
    }

    async function loadAttendance() {
        if (!accessToken) {
            checkIn.disabled = true;
            checkOut.disabled = true;
            message.textContent = "Please log in before using Attendance.";
            return;
        }

        checkIn.disabled = true;
        checkOut.disabled = true;
        message.textContent = "Loading attendance…";

        try {
            const query =
                "/rest/v1/employee_attendance" +
                "?select=attendance_date,check_in,check_out" +
                "&attendance_date=gte." + monthStartKey() +
                "&order=attendance_date.desc";

            const rows = await api(query);
            const records = Array.isArray(rows) ? rows : [];
            const today = records.find(r => r.attendance_date === todayKey());

            showToday(today || null);
            present.textContent = String(
                records.filter(r => r.check_in).length
            );

            history.replaceChildren();

            if (!records.length) {
                const empty = document.createElement("p");
                empty.textContent = "No attendance records this month.";
                history.appendChild(empty);
            } else {
                records.forEach(record => {
                    const row = document.createElement("p");
                    const label = record.check_out
                        ? timeText(record.check_in) + " to " + timeText(record.check_out)
                        : timeText(record.check_in) + " — Checked In";
                    row.textContent = dateText(record.attendance_date) + " — " + label;
                    history.appendChild(row);
                });
            }

            const todayDate = document.getElementById("attendanceTodayDate");
            if (todayDate) {
                todayDate.textContent = new Date().toLocaleDateString("en-GB", {
                    timeZone: "Asia/Dhaka",
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                });
            }

            message.textContent = "";
        } catch (error) {
            message.textContent = error.message || "Could not load attendance.";
            console.error("Attendance load failed:", error);
        }
    }

    async function submitAttendance(action) {
        checkIn.disabled = true;
        checkOut.disabled = true;
        message.textContent = "Saving attendance…";

        try {
            await api("/rest/v1/rpc/attendance_" + action, {
                method: "POST",
                body: "{}"
            });

            message.textContent = "Attendance saved successfully.";
            await loadAttendance();
        } catch (error) {
            message.textContent = error.message || "Could not save attendance.";
            console.error("Attendance save failed:", error);
            await loadAttendance();
        }
    }

    checkIn.addEventListener("click", () => submitAttendance("check_in"));
    checkOut.addEventListener("click", () => submitAttendance("check_out"));

    if (openButton) {
        openButton.addEventListener("click", () => {
            if (page.style.display !== "none") loadAttendance();
        });
    }

    page.addEventListener("click", event => {
        if (event.target && event.target.id === "attendanceBackButton") return;
    });

    loadAttendance();
})();
/* ATTENDANCE PAGE NAVIGATION */
(function () {
    const openButton = document.getElementById("attendanceButton");
    const page = document.getElementById("attendancePage");
    const backButton = document.getElementById("attendanceBackButton");
    if (!openButton || !page || !backButton) return;

    openButton.addEventListener("click", function () {
        document.getElementById("listPage").style.display = "none";
        document.getElementById("departmentSection").style.display = "none";
        page.style.display = "block";
        const date = document.getElementById("attendanceTodayDate");
        if (date) date.textContent = new Date().toLocaleDateString(undefined, {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        });
    });

    backButton.addEventListener("click", function () {
        page.style.display = "none";
        document.getElementById("listPage").style.display = "block";
        document.getElementById("departmentSection").style.display = "block";
    });
})();

/* ATTENDANCE CALENDAR DATE */
(function () {
    function updateAttendanceCalendar() {
        const month = document.getElementById("attendanceMonth");
        const date = document.getElementById("attendanceDate");
        if (!month || !date) return;

        const today = new Date();
        month.textContent = today.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
        date.textContent = today.getDate();
    }

    updateAttendanceCalendar();
    setInterval(updateAttendanceCalendar, 60000);
})();

/* SALARY MANAGEMENT - ADMIN ONLY */
(function () {
    "use strict";

    const ADMIN_UID = "e5090917-b885-41b4-8062-e208fd6ab287";

    document.addEventListener("DOMContentLoaded", function () {
        const $ = id => document.getElementById(id);
        const salaryButton = $("salaryButton");
        const salaryPage = $("salaryPage");
        const salaryStatus = $("salaryStatus");
        const management = $("salaryManagement");
        const loginButton = $("salaryLoginButton");
        const employeeSelect = $("salaryEmployee");
        const slipEmployee = $("paySlipEmployee");
        const monthInput = $("salaryMonth");
        const slipMonth = $("paySlipMonth");
        const saveStatus = $("salarySaveStatus");
        const csvStatus = $("salaryCsvStatus");
        const slipResult = $("paySlipResult");

        if (!salaryButton || !salaryPage || !management) {
            console.error("Salary HTML elements not found.");
            return;
        }

        const currentMonth = new Date().toISOString().slice(0, 7);
        if (monthInput) monthInput.value = currentMonth;
        if (slipMonth) slipMonth.value = currentMonth;

        let employeeNumbers = new Set();
        let employeeInfo = new Map();

        async function checkAdmin() {
            if (!accessToken) throw new Error("Please log in first.");

            const response = await fetch(SUPABASE_URL + "/auth/v1/user", {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: "Bearer " + accessToken
                }
            });

            if (!response.ok) throw new Error("Session expired. Please log in again.");

            const user = await response.json();
            if (user.id !== ADMIN_UID) {
                throw new Error("This account is not authorized for Salary Management.");
            }
        }

        function apiHeaders() {
            return {
                apikey: SUPABASE_KEY,
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json"
            };
        }

        async function loadEmployees() {
            const response = await fetch(
                SUPABASE_URL +
                "/rest/v1/employee_dekko_v2?select=employee_no,employee_name,department,designation,joining_date,bank_name,account_no&order=employee_name.asc",
                { headers: apiHeaders() }
            );

            if (!response.ok) {
                throw new Error("Employee list error: " + await response.text());
            }

            const employees = await response.json();
            employeeNumbers = new Set();
            employeeInfo = new Map();

            [employeeSelect, slipEmployee].forEach(select => {
                if (select) select.replaceChildren(new Option("Select employee", ""));
            });

            employees.forEach(employee => {
                if (!employee.employee_no) return;

                const no = String(employee.employee_no);
                employeeNumbers.add(no);
                employeeInfo.set(no, employee);

                const label = [
                    employee.employee_name || "Unnamed",
                    no,
                    employee.department || ""
                ].filter(Boolean).join(" — ");

                [employeeSelect, slipEmployee].forEach(select => {
                    if (select) select.add(new Option(label, no));
                });
            });

            if (!employeeNumbers.size) throw new Error("No employees found.");
        }

        async function initializeSalary() {
            management.style.display = "none";
            if (loginButton) loginButton.style.display = "none";
            salaryStatus.textContent = "Checking Admin access...";

            try {
                await checkAdmin();
                await loadEmployees();
                management.style.display = "block";
                salaryStatus.textContent = "Admin verified. Salary Management is ready.";
            } catch (error) {
                salaryStatus.textContent = error.message;
                if (loginButton) loginButton.style.display = "inline-block";
            }
        }

        salaryButton.addEventListener("click", async function () {
            try {
                await checkAdmin();
            } catch (error) {
                if (!accessToken) {
                    window.__openSalaryAfterLogin = true;

                    if (listPage) listPage.style.display = "none";
                    if (detailsPage) detailsPage.style.display = "none";
                    if (loginPage) loginPage.style.display = "block";

                    if (loginStatus) {
                        loginStatus.textContent =
                            "Please log in to access Salary Management.";
                    }
                    return;
                }

                window.alert(error.message || "Access denied.");
                return;
            }

            const idsToHide = [
                "listPage", "allEmployeesPage", "favoritePage",
                "birthdayPage", "departmentPage", "detailsPage",
                "attendancePage", "adminPage", "loginPage"
            ];

            idsToHide.forEach(id => {
                const page = $(id);
                if (page) page.style.display = "none";
            });

            const departmentSection = $("departmentSection");
            const employeeList = $("employeeList");
            const appTitle = $("appTitle");

            if (departmentSection) departmentSection.style.display = "none";
            if (employeeList) employeeList.style.display = "none";
            if (appTitle) appTitle.style.display = "none";

            salaryPage.style.display = "block";
            window.scrollTo({ top: 0, behavior: "smooth" });
            initializeSalary();
        });

        const salaryBackButton = $("salaryBackButton");
        if (salaryBackButton) {
            salaryBackButton.addEventListener("click", function () {
                salaryPage.style.display = "none";

                const homePage = $("listPage");
                const adminButton = $("adminButton");
                const appTitle = $("appTitle");
                const departmentSection = $("departmentSection");
                const employeeList = $("employeeList");

                if (homePage) homePage.style.display = "block";
                if (adminButton) adminButton.style.removeProperty("display");
                if (appTitle) appTitle.style.display = "";
                if (departmentSection) departmentSection.style.display = "block";
                if (employeeList) employeeList.style.display = "block";

                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        if (loginButton) {
            loginButton.addEventListener("click", function () {
                salaryPage.style.display = "none";
                const adminButton = $("adminButton");
                if (adminButton) adminButton.click();
            });
        }

        function getAmount(id) {
            const n = Number($(id).value);
            if (!Number.isFinite(n) || n < 0) {
                throw new Error("Enter valid non-negative salary amounts.");
            }
            return Math.round(n * 100) / 100;
        }

        const earningIds = [
            "houseRentAllowance",
            "medicalAllowance",
            "conveyanceAllowance",
            "specialAllowance"
        ];

        const deductionIds = [
            "employeeProvidentFund",
            "incomeTax",
            "healthInsurance",
            "loanRepayment",
            "otherDeductions"
        ];

        function componentTotal(ids) {
            return ids.reduce((sum, id) => sum + getAmount(id), 0);
        }

        function updateNet() {
            try {
                const basic = getAmount("basicSalary");
                const allowances = componentTotal(earningIds);
                const deductions = componentTotal(deductionIds);

                $("salaryAllowances").value = allowances.toFixed(2);
                $("salaryDeductions").value = deductions.toFixed(2);
                $("salaryNetPreview").textContent =
                    (basic + allowances - deductions).toFixed(2);
            } catch (_) {
                $("salaryNetPreview").textContent = "Invalid amount";
            }
        }

        ["basicSalary", ...earningIds, ...deductionIds].forEach(id => {
            if ($(id)) $(id).addEventListener("input", updateNet);
        });

        async function saveRecords(records) {
            const response = await fetch(
                SUPABASE_URL +
                "/rest/v1/salary_records?on_conflict=employee_no,salary_month",
                {
                    method: "POST",
                    headers: {
                        ...apiHeaders(),
                        Prefer: "resolution=merge-duplicates,return=minimal"
                    },
                    body: JSON.stringify(records)
                }
            );

            if (!response.ok) {
                throw new Error("Database error (" + response.status + "): " +
                    await response.text());
            }
        }

        const form = $("salaryEntryForm");
        if (form) {
            form.addEventListener("submit", async function (event) {
                event.preventDefault();
                saveStatus.textContent = "Saving...";

                try {
                    await checkAdmin();

                    const employeeNo = employeeSelect.value;
                    const month = monthInput.value;
                    const workingDays = Number($("salaryWorkingDays").value);
                    const presentDays = Number($("salaryPresentDays").value);
                    const leaveDays = Number($("salaryLeaveDays").value);
                    const absentDays = Number($("salaryAbsentDays").value);

                    const basic = getAmount("basicSalary");

                    const houseRent = getAmount("houseRentAllowance");
                    const medical = getAmount("medicalAllowance");
                    const conveyance = getAmount("conveyanceAllowance");
                    const special = getAmount("specialAllowance");
                    const allowances = houseRent + medical + conveyance + special;

                    const providentFund = getAmount("employeeProvidentFund");
                    const incomeTaxAmount = getAmount("incomeTax");
                    const healthInsurance = getAmount("healthInsurance");
                    const loanRepayment = getAmount("loanRepayment");
                    const otherDeductionsAmount = getAmount("otherDeductions");
                    const deductions = providentFund + incomeTaxAmount +
                        healthInsurance + loanRepayment + otherDeductionsAmount;

                    const attendance = [workingDays, presentDays, leaveDays, absentDays];
                    if (!attendance.every(n => Number.isInteger(n) && n >= 0)) {
                        throw new Error("Attendance days must be non-negative whole numbers.");
                    }

                    if (!employeeNumbers.has(employeeNo)) {
                        throw new Error("Select a valid employee.");
                    }
                    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
                        throw new Error("Select a valid salary month.");
                    }
                    if (deductions > basic + allowances) {
                        throw new Error("Deductions cannot exceed total earnings.");
                    }

                    await saveRecords([{
                        employee_no: employeeNo,
                        salary_month: month,
                        working_days: workingDays,
                        present_days: presentDays,
                        leave_days: leaveDays,
                        absent_days: absentDays,
                        basic_salary: basic,
                        house_rent_allowance: houseRent,
                        medical_allowance: medical,
                        conveyance_allowance: conveyance,
                        special_allowance: special,
                        employee_provident_fund: providentFund,
                        income_tax: incomeTaxAmount,
                        health_insurance: healthInsurance,
                        loan_repayment: loanRepayment,
                        other_deductions: otherDeductionsAmount,
                        allowances: allowances,
                        deductions: deductions,
                        status: $("salaryPublishStatus").value
                    }]);

                    saveStatus.textContent = "Salary saved successfully.";
                } catch (error) {
                    saveStatus.textContent = error.message;
                }
            });
        }

        function parseCsvLine(line) {
            const fields = [];
            let value = "";
            let quoted = false;

            for (let i = 0; i < line.length; i++) {
                const ch = line[i];

                if (ch === '"' && quoted && line[i + 1] === '"') {
                    value += '"';
                    i++;
                } else if (ch === '"') {
                    quoted = !quoted;
                } else if (ch === "," && !quoted) {
                    fields.push(value.trim());
                    value = "";
                } else {
                    value += ch;
                }
            }

            fields.push(value.trim());
            return fields;
        }

        const csvComponentColumns = [
            "house_rent_allowance", "medical_allowance",
            "conveyance_allowance", "special_allowance",
            "employee_provident_fund", "income_tax",
            "health_insurance", "loan_repayment", "other_deductions"
        ];

        const templateButton = $("salaryCsvTemplateButton");
        if (templateButton) {
            templateButton.addEventListener("click", function () {
                const headers = [
                    "employee_no", "salary_month", "basic_salary",
                    ...csvComponentColumns, "status"
                ];
                const sample = [
                    "EMP001", "2026-10", "25000",
                    "5000", "1000", "500", "1500",
                    "1000", "500", "200", "0", "0", "Draft"
                ];
                const csv = headers.join(",") + "\n" + sample.join(",") + "\n";
                const url = URL.createObjectURL(
                    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" })
                );
                const link = document.createElement("a");
                link.href = url;
                link.download = "salary_template.csv";
                link.click();
                URL.revokeObjectURL(url);
            });
        }

        const uploadButton = $("salaryCsvUploadButton");
        const csvFileInput = $("salaryCsvFile");
        let pendingCsvRecords = null;

        let csvPreview = $("salaryCsvPreview");
        if (!csvPreview && csvStatus) {
            csvPreview = document.createElement("div");
            csvPreview.id = "salaryCsvPreview";
            csvStatus.insertAdjacentElement("afterend", csvPreview);
        }

        function resetCsvPreview() {
            pendingCsvRecords = null;
            if (uploadButton) uploadButton.textContent = "Preview & Validate CSV";
            if (csvPreview) csvPreview.replaceChildren();
        }

        if (csvFileInput) {
            csvFileInput.addEventListener("change", resetCsvPreview);
        }

        function showCsvPreview(records) {
            if (!csvPreview) throw new Error("CSV preview area is unavailable.");

            csvPreview.replaceChildren();
            const heading = document.createElement("h3");
            heading.textContent = "CSV Preview — " + records.length + " record(s)";
            csvPreview.appendChild(heading);

            const note = document.createElement("p");
            note.textContent =
                "Validation passed. Review these totals before confirming upload.";
            csvPreview.appendChild(note);

            const table = document.createElement("table");
            table.className = "payslip-table";
            const thead = document.createElement("thead");
            const headRow = document.createElement("tr");

            [
                "Employee ID", "Salary Month", "Basic",
                "Total Earnings", "Total Deductions", "Net Pay", "Status"
            ].forEach(label => {
                const th = document.createElement("th");
                th.textContent = label;
                headRow.appendChild(th);
            });

            thead.appendChild(headRow);
            table.appendChild(thead);

            const tbody = document.createElement("tbody");
            records.forEach(record => {
                const row = document.createElement("tr");
                const values = [
                    record.employee_no,
                    record.salary_month,
                    record.basic_salary.toFixed(2),
                    (record.basic_salary + record.allowances).toFixed(2),
                    record.deductions.toFixed(2),
                    (record.basic_salary + record.allowances - record.deductions).toFixed(2),
                    record.status
                ];

                values.forEach(value => {
                    const td = document.createElement("td");
                    td.textContent = String(value);
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            csvPreview.appendChild(table);
        }

        if (uploadButton) {
            uploadButton.textContent = "Preview & Validate CSV";

            uploadButton.addEventListener("click", async function () {
                try {
                    await checkAdmin();

                    if (!pendingCsvRecords) {
                        csvStatus.textContent = "Validating CSV...";
                        const file = csvFileInput && csvFileInput.files[0];
                        if (!file) throw new Error("Choose a CSV file first.");

                        const lines = (await file.text()).replace(/^\uFEFF/, "")
                            .split(/\r?\n/).filter(line => line.trim());

                        if (lines.length < 2) throw new Error("CSV has no data rows.");

                        const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase());
                        const coreRequired = [
                            "employee_no", "salary_month", "basic_salary", "status"
                        ];

                        coreRequired.forEach(h => {
                            if (!headers.includes(h)) {
                                throw new Error("Missing CSV column: " + h);
                            }
                        });

                        const hasComponents = csvComponentColumns.every(h => headers.includes(h));
                        const hasLegacy = headers.includes("allowances") &&
                            headers.includes("deductions");

                        if (!hasComponents && !hasLegacy) {
                            throw new Error(
                                "CSV must include all 9 component columns or both legacy columns: allowances,deductions."
                            );
                        }

                        const records = [];
                        const seen = new Set();

                        lines.slice(1).forEach((line, index) => {
                            const rowNumber = index + 2;
                            const values = parseCsvLine(line);

                            if (values.length !== headers.length) {
                                throw new Error("Invalid column count on CSV row " + rowNumber);
                            }

                            const row = {};
                            headers.forEach((h, i) => row[h] = values[i]);

                            const employeeNo = row.employee_no.trim();
                            if (!employeeNumbers.has(employeeNo)) {
                                throw new Error("Unknown employee number on CSV row " + rowNumber);
                            }
                            if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(row.salary_month)) {
                                throw new Error("Invalid month on CSV row " + rowNumber);
                            }

                            const numberFor = (name, fallback = "0") => {
                                const raw = row[name] === undefined || row[name] === ""
                                    ? fallback : row[name];
                                const n = Number(raw);
                                if (!Number.isFinite(n) || n < 0) {
                                    throw new Error("Invalid " + name + " on CSV row " + rowNumber);
                                }
                                return Math.round(n * 100) / 100;
                            };

                            const basic = numberFor("basic_salary");
                            const components = {};
                            csvComponentColumns.forEach(name => {
                                components[name] = hasComponents
                                    ? numberFor(name)
                                    : 0;
                            });

                            let allowances;
                            let deductions;

                            if (hasComponents) {
                                allowances =
                                    components.house_rent_allowance +
                                    components.medical_allowance +
                                    components.conveyance_allowance +
                                    components.special_allowance;

                                deductions =
                                    components.employee_provident_fund +
                                    components.income_tax +
                                    components.health_insurance +
                                    components.loan_repayment +
                                    components.other_deductions;
                            } else {
                                allowances = numberFor("allowances");
                                deductions = numberFor("deductions");
                                components.special_allowance = allowances;
                                components.other_deductions = deductions;
                            }

                            if (deductions > basic + allowances) {
                                throw new Error("Deductions too high on CSV row " + rowNumber);
                            }

                            const status = row.status || "Draft";
                            if (!["Draft", "Published"].includes(status)) {
                                throw new Error("Status must be Draft or Published on row " + rowNumber);
                            }

                            const key = employeeNo + "|" + row.salary_month;
                            if (seen.has(key)) {
                                throw new Error("Duplicate employee/month in CSV: " + key);
                            }
                            seen.add(key);

                            records.push({
                                employee_no: employeeNo,
                                salary_month: row.salary_month,
                                basic_salary: basic,
                                ...components,
                                allowances: allowances,
                                deductions: deductions,
                                status: status
                            });
                        });

                        pendingCsvRecords = records;
                        showCsvPreview(records);
                        uploadButton.textContent = "Confirm Upload";
                        csvStatus.textContent =
                            "Preview ready. Check the rows, then click Confirm Upload.";
                        return;
                    }

                    const recordsToSave = pendingCsvRecords;
                    csvStatus.textContent = "Uploading " + recordsToSave.length + " record(s)...";
                    await saveRecords(recordsToSave);
                    csvStatus.textContent =
                        "Successfully uploaded " + recordsToSave.length + " record(s).";
                    resetCsvPreview();
                } catch (error) {
                    resetCsvPreview();
                    csvStatus.textContent = error.message;
                }
            });
        }

        const viewButton = $("viewPaySlipButton");
        if (viewButton) {
            viewButton.addEventListener("click", async function () {
                slipResult.replaceChildren();
                slipResult.textContent = "Loading Pay Slip...";

                try {
                    await checkAdmin();

                    const employeeNo = slipEmployee.value;
                    const month = slipMonth.value;

                    if (!employeeNumbers.has(employeeNo)) throw new Error("Select an employee.");
                    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
                        throw new Error("Select a valid month.");
                    }

                    const query = new URLSearchParams({
                        select: "employee_no,salary_month,basic_salary,allowances,deductions,net_pay,status,house_rent_allowance,medical_allowance,conveyance_allowance,special_allowance,employee_provident_fund,income_tax,health_insurance,loan_repayment,other_deductions,working_days,present_days,leave_days,absent_days",
                        employee_no: "eq." + employeeNo,
                        salary_month: "eq." + month
                    });

                    const response = await fetch(
                        SUPABASE_URL + "/rest/v1/salary_records?" + query,
                        { headers: apiHeaders() }
                    );

                    if (!response.ok) {
                        throw new Error("Pay Slip request failed: " + await response.text());
                    }

                    const rows = await response.json();
                    slipResult.replaceChildren();

                    if (!rows.length) {
                        slipResult.textContent = "No salary record found for this employee/month.";
                        return;
                    }

                    const record = rows[0];
                    const employee = employeeInfo.get(employeeNo) || {};

                    const safe = value => String(value ?? "—").replace(
                        /[&<>"']/g,
                        char => ({
                            "&": "&amp;",
                            "<": "&lt;",
                            ">": "&gt;",
                            '"': "&quot;",
                            "'": "&#39;"
                        })[char]
                    );

                    const amount = value =>
                        Number(value || 0).toLocaleString("en-BD", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });

                    const getEmployeeValue = (...keys) => {
                        for (const key of keys) {
                            const value = employee[key];
                            if (value !== undefined && value !== null && value !== "") {
                                return value;
                            }
                        }
                        return "—";
                    };

                    const monthDate = new Date(record.salary_month + "-01T12:00:00");
                    const monthName = Number.isNaN(monthDate.getTime())
                        ? record.salary_month
                        : monthDate.toLocaleDateString("en-GB", {
                            month: "long",
                            year: "numeric"
                        });

                    const year = Number(String(record.salary_month).slice(0, 4));
                    const monthNumber = Number(String(record.salary_month).slice(5, 7));
                    const lastDay = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();

                    const period = Number.isNaN(monthDate.getTime())
                        ? record.salary_month
                        : "01 " + monthDate.toLocaleDateString("en-GB", {
                            month: "short",
                            year: "numeric"
                        }) + " – " + lastDay + " " +
                        monthDate.toLocaleDateString("en-GB", {
                            month: "short",
                            year: "numeric"
                        });

                    const basic = Number(record.basic_salary || 0);

                    const houseRent = Number(record.house_rent_allowance || 0);
                    const medical = Number(record.medical_allowance || 0);
                    const conveyance = Number(record.conveyance_allowance || 0);
                    const special = Number(record.special_allowance || 0);

                    const providentFund = Number(record.employee_provident_fund || 0);
                    const incomeTax = Number(record.income_tax || 0);
                    const healthInsurance = Number(record.health_insurance || 0);
                    const loanRepayment = Number(record.loan_repayment || 0);
                    const otherDeductions = Number(record.other_deductions || 0);

                    const storedAllowances = Number(record.allowances || 0);
                    const storedDeductions = Number(record.deductions || 0);

                    const hasEarningComponents =
                        houseRent !== 0 || medical !== 0 ||
                        conveyance !== 0 || special !== 0;

                    const hasDeductionComponents =
                        providentFund !== 0 || incomeTax !== 0 ||
                        healthInsurance !== 0 || loanRepayment !== 0 ||
                        otherDeductions !== 0;

                    const legacyAllowances =
                        !hasEarningComponents ? storedAllowances : 0;
                    const legacyDeductions =
                        !hasDeductionComponents ? storedDeductions : 0;

                    const allowances = houseRent + medical + conveyance + special;
                    const deductions = providentFund + incomeTax +
                        healthInsurance + loanRepayment + otherDeductions;

                    const totalEarnings = basic + allowances + legacyAllowances;
                    const totalDeductions = deductions + legacyDeductions;
                    const netPay = Number(record.net_pay || 0);

                    function wordsUnderThousand(number) {
                        const ones = [
                            "Zero", "One", "Two", "Three", "Four", "Five",
                            "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
                            "Twelve", "Thirteen", "Fourteen", "Fifteen",
                            "Sixteen", "Seventeen", "Eighteen", "Nineteen"
                        ];
                        const tens = [
                            "", "", "Twenty", "Thirty", "Forty", "Fifty",
                            "Sixty", "Seventy", "Eighty", "Ninety"
                        ];
                        let result = "";

                        if (number >= 100) {
                            result += ones[Math.floor(number / 100)] + " Hundred";
                            number %= 100;
                            if (number) result += " ";
                        }

                        if (number >= 20) {
                            result += tens[Math.floor(number / 10)];
                            number %= 10;
                            if (number) result += "-" + ones[number];
                        } else if (number > 0 || !result) {
                            result += ones[number];
                        }

                        return result;
                    }

                    function amountInWords(value) {
                        let number = Math.floor(Math.abs(value));
                        if (number === 0) return "Zero Taka Only";

                        const groups = [
                            [10000000, "Crore"],
                            [100000, "Lakh"],
                            [1000, "Thousand"],
                            [1, ""]
                        ];
                        const parts = [];

                        for (const [size, label] of groups) {
                            if (number >= size) {
                                const count = Math.floor(number / size);
                                number %= size;
                                parts.push(
                                    wordsUnderThousand(count) +
                                    (label ? " " + label : "")
                                );
                            }
                        }

                        return parts.join(" ") + " Taka Only";
                    }

                    const optionalDetails = [
                        ["Designation", getEmployeeValue("designation", "job_title")],
                        ["Joining Date", getEmployeeValue("joining_date", "date_of_joining", "date_joined")],
                        ["Working Days", record.working_days],
                        ["Present Days", record.present_days],
                        ["Leave Days", record.leave_days],
                        ["Absent Days", record.absent_days]
                    ];

                    const detail = (label, value) => {
                        if (value === undefined || value === null || value === "" || value === "—") return "";
                        return `<div class="payslip-detail">
                            <span>${safe(label)}</span>
                            <strong>${safe(value)}</strong>
                        </div>`;
                    };

                    slipResult.innerHTML = `
                        <article class="professional-payslip">
                            <header class="payslip-company">
                                <img src="assets/icons/Dekko%20logo.jpg" alt="Dekko Logo" class="payslip-company-logo">
                                <div class="payslip-company-text">
                                    <h2>Dekko Accessories Ltd.</h2>


                                    <p>Head Office: Shimanto Shambhar (8th Floor),</p>
                                    <p>Road No. 2, Dhanmondi, Dhaka-1205</p>
                                    <p>Phone: +880 9666774400</p>
                                    <p>www.dekkolegacy.com</p>
                                </div>
                            </header>

                            <div class="payslip-heading">
                                <h3>Pay Slip</h3>
                                <p>For the Month of ${safe(monthName)}</p>
                                <span class="payslip-status">${safe(record.status || "—")}</span>
                            </div>

                            <section class="payslip-section">
                                <h4>Emp. Information</h4>
                                <div class="payslip-details-grid">
                                    <div class="payslip-info-column">
                                        ${detail("Employee ID", record.employee_no || employee.employee_no || "—")}
                                        ${detail("Employee Name", employee.employee_name || "—")}
                                        ${detail("Designation", optionalDetails[0][1])}
                                        ${detail("Department", employee.department || "—")}
                                        ${detail("Joining Date", optionalDetails[1][1])}
                                        ${detail("Pay Period", period)}
                                    </div>
                                    <div class="payslip-info-column">
                                        ${detail("Bank Name", getEmployeeValue("bank_name"))}
                                        ${detail("Account No.", getEmployeeValue("account_no"))}
                                        ${detail("Working Days", optionalDetails[2][1])}
                                        ${detail("Present Days", optionalDetails[3][1])}
                                        ${detail("Leave Days", optionalDetails[4][1])}
                                        ${detail("Absent Days", optionalDetails[5][1])}
                                    </div>
                                </div>
                            </section>

                            <div class="payslip-components-grid">
<section class="payslip-section">
                                <h4>Earning</h4>
                                <table class="payslip-table">
                                    <thead>
                                        <tr><th>Particulars</th><th>Amount</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>Basic Salary</td><td>${amount(basic)}</td></tr>
                                        <tr><td>House Rent Allowance</td><td>${amount(houseRent)}</td></tr>
                                        <tr><td>Medical Allowance</td><td>${amount(medical)}</td></tr>
                                        <tr><td>Conveyance Allowance</td><td>${amount(conveyance)}</td></tr>
                                        <tr><td>Special Allowance</td><td>${amount(special)}</td></tr>
                                        ${legacyAllowances ? `<tr><td>Allowances (legacy record)</td><td>${amount(legacyAllowances)}</td></tr>` : ""}
                                        <tr class="payslip-total-row"><td>Total Earnings</td><td>${amount(totalEarnings)}</td></tr>
                                    </tbody>
                                </table>
                            </section>

                            <section class="payslip-section">
                                <h4>Deduct</h4>
                                <table class="payslip-table">
                                    <thead>
                                        <tr><th>Particulars</th><th>Amount</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>Employee Provident Fund</td><td>${amount(providentFund)}</td></tr>
                                        <tr><td>Income Tax</td><td>${amount(incomeTax)}</td></tr>
                                        <tr><td>Health Insurance</td><td>${amount(healthInsurance)}</td></tr>
                                        <tr><td>Loan Repayment</td><td>${amount(loanRepayment)}</td></tr>
                                        <tr><td>Other Deductions</td><td>${amount(otherDeductions)}</td></tr>
                                        ${legacyDeductions ? `<tr><td>Deductions (legacy record)</td><td>${amount(legacyDeductions)}</td></tr>` : ""}
                                        <tr class="payslip-total-row"><td>Total Deductions</td><td>${amount(totalDeductions)}</td></tr>
                                    </tbody>
                                </table>
                            </section>

                                                        </div>

                            <section class="payslip-net">
                                <span>NET PAY (BDT)</span>
                                <strong>${amount(netPay)}</strong>
                            </section>

                            <section class="payslip-words">
                                <p><strong>Net Pay (in Words):</strong> ${safe(amountInWords(netPay))}</p>
                            </section>

                            <footer class="payslip-footer">
                                <p>This is a system-generated payslip. For any query, please contact the HR Department.</p>
                                <div class="payslip-signature">
                                    <div class="payslip-signature-line"></div>
                                    <strong>Authorized Signature</strong>
                                    <span>HR Department</span>
                                </div>
                            </footer>
                        </article>
                    `;

                    const page = $("paySlipPage");
                    const pageContent = $("paySlipPageContent");
                    const salaryPage = $("salaryPage");

                    if (!page || !pageContent || !salaryPage) {
                        throw new Error("Pay Slip page could not be opened.");
                    }

                    pageContent.innerHTML = slipResult.innerHTML;
                    page.style.display = "block";
                    salaryPage.style.display = "none";
                    window.scrollTo(0, 0);

                    const printButton = $("printPaySlipButton");
                    if (printButton) printButton.style.display = "inline-block";
                } catch (error) {
                    slipResult.textContent = error.message;
                }
            });
        }

        const printButton = $("printPaySlipButton");
        if (printButton) {
            printButton.addEventListener("click", function () {
                window.print();
            });
        }

        const paySlipPageBackButton = $("paySlipPageBackButton");
        if (paySlipPageBackButton) {
            paySlipPageBackButton.addEventListener("click", function () {
                const page = $("paySlipPage");
                const salaryPage = $("salaryPage");
                if (page) page.style.display = "none";
                if (salaryPage) salaryPage.style.display = "block";
            });
        }

        const paySlipPagePrintButton = $("paySlipPagePrintButton");
        if (paySlipPagePrintButton) {
            paySlipPagePrintButton.addEventListener("click", function () {
                if (window.AndroidPaySlipPdf &&
                    typeof window.AndroidPaySlipPdf.downloadPaySlipPdf === "function") {
                    window.AndroidPaySlipPdf.downloadPaySlipPdf();
                } else {
                    window.print();
                }
            });
        }
    });
})();
