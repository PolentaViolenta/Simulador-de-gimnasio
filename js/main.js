const btnStrength = document.getElementById("btnStrength");
const btnVolume = document.getElementById("btnVolume");
const daysContainer = document.getElementById("daysContainer");
const routineContainer = document.getElementById("routineContainer");
const userRoutineList = document.getElementById("userRoutine");

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const strengthExercises = [
    { name: "Sentadilla", reps: "6 x 4" },
    { name: "Press de banca", reps: "6 x 4" },
    { name: "Peso muerto", reps: "6 x 4" }
];

const volumeExercises = [
    { name: "Aperturas", reps: "12 x 4" },
    { name: "Press inclinado", reps: "10 x 4" },
    { name: "Extensiones de tríceps", reps: "15 x 3" }
];

let userRoutine = JSON.parse(localStorage.getItem("userRoutine")) || [];
let selectedTraining = null;

function showDays() {
    daysContainer.innerHTML = "";
    daysOfWeek.forEach(day => {
        const btn = document.createElement("button");
        btn.textContent = day;
        btn.classList.add("day-btn");
        btn.addEventListener("click", () => selectDay(day));
        daysContainer.appendChild(btn);
    });
}

btnStrength.addEventListener("click", () => {
    selectedTraining = "strength";
    showDays();
    routineContainer.innerHTML = "";
});

btnVolume.addEventListener("click", () => {
    selectedTraining = "volume";
    showDays();
    routineContainer.innerHTML = "";
});

function selectDay(day) {
    routineContainer.innerHTML = `<h3>Día seleccionado: ${day}</h3>`;

    let exercises = [];

    if (selectedTraining === "strength") {
        exercises = strengthExercises;
    } else if (selectedTraining === "volume") {
        exercises = volumeExercises;
    } else {
        routineContainer.innerHTML += `<p>Elegí primero Fuerza o Volumen.</p>`;
        return;
    }

    const select = document.createElement("select");
    select.id = "exerciseSelect";

    exercises.forEach(ex => {
        const option = document.createElement("option");
        option.value = ex.name;
        option.textContent = `${ex.name} (${ex.reps})`;
        select.appendChild(option);
    });

    routineContainer.appendChild(select);

    const addBtn = document.createElement("button");
    addBtn.textContent = "Agregar ejercicio";
    addBtn.addEventListener("click", () => {
        const selectedName = select.value;
        const selectedExercise = exercises.find(ex => ex.name === selectedName);
        addExercise(day, selectedExercise);
    });

    routineContainer.appendChild(addBtn);
}

function addExercise(day, exercise) {
    let dayEntry = userRoutine.find(entry => entry.day === day);

    if (!dayEntry) {
        dayEntry = { day: day, exercises: [] };
        userRoutine.push(dayEntry);
    }

    const exists = dayEntry.exercises.some(ex => ex.name === exercise.name);

    if (exists) {
        alert("Ese ejercicio ya está agregado en este día.");
        return;
    }

    dayEntry.exercises.push(exercise);

    saveRoutine();
    renderRoutine();
}

function saveRoutine() {
    localStorage.setItem("userRoutine", JSON.stringify(userRoutine));
}

function renderRoutine() {
    userRoutineList.innerHTML = "";

    if (userRoutine.length === 0) {
        userRoutineList.innerHTML = "<li>No tenés días guardados aún.</li>";
        return;
    }

    userRoutine.forEach((entry, index) => {
        const li = document.createElement("li");
        li.classList.add("user-day");

        li.innerHTML = `
            <strong>${entry.day}</strong>:
            ${entry.exercises.map(ex => `${ex.name} (${ex.reps})`).join(", ")}
            <button class="btn btn-edit" data-index="${index}">Editar</button>
            <button class="btn btn-delete" data-index="${index}">Eliminar</button>
        `;

        userRoutineList.appendChild(li);
    });

    userRoutineList.onclick = (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const index = Number(btn.dataset.index);

        if (btn.classList.contains("btn-edit")) {
            editDay(index);
        }

        if (btn.classList.contains("btn-delete")) {
            deleteDay(index);
        }
    };
}

function deleteDay(index) {
    userRoutine.splice(index, 1);
    saveRoutine();
    renderRoutine();
}

function editDay(index) {
    const entry = userRoutine[index];
    if (!entry) return;

    const firstExercise = entry.exercises[0]?.name || "";
    const isStrength = strengthExercises.map(e => e.name).includes(firstExercise);

    selectedTraining = isStrength ? "strength" : "volume";

    showDays();
    selectDay(entry.day);

    routineContainer.insertAdjacentHTML("afterbegin",
        `<p style="color:green">Estás editando <strong>${entry.day}</strong>.</p>`
    );
}

renderRoutine();
