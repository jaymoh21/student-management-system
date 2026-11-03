// Get HTML elements
const studentForm = document.getElementById("add-student-form");
const studentList = document.getElementById("student-list");
const searchInput = document.getElementById("search-student");

const totalStudents = document.getElementById("total-students");
const activeStudents = document.getElementById("active-students");
const inactiveStudents = document.getElementById("inactive-students");

const submitButton = document.getElementById("submit-button");
const cancelEditButton = document.getElementById("cancel-edit");
const formTitle = document.getElementById("form-title");
const emptyMessage = document.getElementById("empty-message");

// Load students from LocalStorage
let students = JSON.parse(localStorage.getItem("students")) || [];

let editingAdmission = null;

// Save students to LocalStorage
function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

// Update dashboard statistics
function updateDashboard() {
  totalStudents.textContent = students.length;

  activeStudents.textContent = students.filter(function (student) {
    return student.status === "Active";
  }).length;

  inactiveStudents.textContent = students.filter(function (student) {
    return student.status === "Inactive";
  }).length;
}

// Display students
function displayStudents(studentArray = students) {
  studentList.innerHTML = "";

  emptyMessage.hidden = studentArray.length !== 0;

  studentArray.forEach(function (student) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = student.name;

    const ageCell = document.createElement("td");
    ageCell.textContent = student.age;

    const classCell = document.createElement("td");
    classCell.textContent = student.class;

    const admissionCell = document.createElement("td");
    admissionCell.textContent = student.admission;

    const statusCell = document.createElement("td");
    statusCell.textContent = student.status;
    statusCell.className =
      student.status === "Active" ? "status-active" : "status-inactive";

    const actionsCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";

    editButton.addEventListener("click", function () {
      editStudent(student.admission);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";

    deleteButton.addEventListener("click", function () {
      deleteStudent(student.admission);
    });

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    row.append(
      nameCell,
      ageCell,
      classCell,
      admissionCell,
      statusCell,
      actionsCell,
    );

    studentList.appendChild(row);
  });

  updateDashboard();
}

// Add or update a student
studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = Number(document.getElementById("age").value);
  const studentClass = document.getElementById("class").value.trim();
  const admission = document.getElementById("admission").value.trim();
  const status = document.getElementById("status").value;

  if (
    !name ||
    !studentClass ||
    !admission ||
    !Number.isInteger(age) ||
    age < 1
  ) {
    alert("Please enter valid student details.");
    return;
  }

  // Check for duplicate admission numbers
  const duplicate = students.some(function (student) {
    return (
      student.admission === admission && student.admission !== editingAdmission
    );
  });

  if (duplicate) {
    alert("This admission number already exists!");
    return;
  }

  const student = {
    name: name,
    age: age,
    class: studentClass,
    admission: admission,
    status: status,
  };

  if (editingAdmission !== null) {
    const index = students.findIndex(function (item) {
      return item.admission === editingAdmission;
    });

    if (index !== -1) {
      students[index] = student;
    }
  } else {
    students.push(student);
  }

  saveStudents();
  displayStudents();
  resetForm();
});

// Edit student
function editStudent(admission) {
  const student = students.find(function (item) {
    return item.admission === admission;
  });

  if (!student) return;

  document.getElementById("name").value = student.name;
  document.getElementById("age").value = student.age;
  document.getElementById("class").value = student.class;
  document.getElementById("admission").value = student.admission;
  document.getElementById("status").value = student.status;

  editingAdmission = admission;

  formTitle.textContent = "Edit Student";
  submitButton.textContent = "Update Student";
  cancelEditButton.hidden = false;

  studentForm.scrollIntoView({ behavior: "smooth" });
}

// Delete student
function deleteStudent(admission) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this student?",
  );

  if (!confirmDelete) return;

  students = students.filter(function (student) {
    return student.admission !== admission;
  });

  saveStudents();
  displayStudents();

  if (editingAdmission === admission) {
    resetForm();
  }
}

// Reset form
function resetForm() {
  studentForm.reset();

  editingAdmission = null;

  formTitle.textContent = "Add Student";
  submitButton.textContent = "Add Student";
  cancelEditButton.hidden = true;
}

// Cancel editing
cancelEditButton.addEventListener("click", function () {
  resetForm();
});

// Search students
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase().trim();

  const filteredStudents = students.filter(function (student) {
    return (
      student.name.toLowerCase().includes(searchTerm) ||
      student.class.toLowerCase().includes(searchTerm) ||
      student.admission.toLowerCase().includes(searchTerm)
    );
  });

  displayStudents(filteredStudents);
});

// Initial page display
displayStudents();
