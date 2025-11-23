const btnStrength = document.getElementById("btnStrength"); 
const btnVolume = document.getElementById("btnVolume");

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const daysContainer = document.getElementById("daysContainer");
const routineContainer = document.getElementById("routineContainer");
const userRoutineList = document.getElementById("userRoutine")

let selectedTraining = null;

const strengthExcercises = [
    { name: "Sentadilla", reps: "6 x 4" },
    { name: "Press de banca", reps: "6 x 4"},
    { name: "Peso muerto", reps: "6 x 4"}
];

const volumeExcercises = [
    { name: "Aperturas", reps: "12 x 4"},
    { name: "Press inclinado", reps: "10 x 4"},
    { name: "Extensiones de tríceps", reps: "15 x 3"}
];

let userRoutine = JSON.parse(localStorage.getItem("userRoutine")) || [];
renderUserRoutine();

function showRoutine(excercises) {
    routineContainer.innerHTML = "";
    excercises.forEach(ex => {
        const item = document.createElement("p");
        item.textContent = `${ex.name} - ${ex.reps}`;
        routineContainer.appendChild(item);
    });
}

function showDays() {
    daysContainer.innerHTML = ""; 
    daysOfWeek.forEach(day => {
        const button = document.createElement("button");
        button.textContent = day;
        button.classList.add("day-btn");
        button.addEventListener("click", () => selectDay(day));
        daysContainer.appendChild(button);
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

    let selectedExercises = [];
    
    if (selectedTraining === "strength") {
        selectedExercises = strengthExcercises;
        showRoutine(strengthExcercises);
    } else if (selectedTraining === "volume") {
        selectedExercises = volumeExcercises;
        showRoutine(volumeExcercises);
    } else {
        routineContainer.innerHTML += `<p style="color:#b00">Seleccioná primero un tipo de rutina (Fuerza o Volumen).</p>`;
        return;
    }

    const addBtn = document.createElement("button");
    addBtn.textContent = "Agregar a mi rutina";
    addBtn.addEventListener("click", () => {
        addToUserRoutine(day, selectedExercises);
    });

    routineContainer.appendChild(addBtn);
}

function addToUserRoutine(day,excercises) {
    const dayRoutine = {
        day: day,
        excercises: excercises
    }

    const existingIndex = userRoutine.findIndex(entry => entry.day === day);

    if (existingIndex !== -1) {
        userRoutine[existingIndex] = dayRoutine;
    } else {
        userRoutine.push(dayRoutine);
    }

    saveUserRoutine();
    renderUserRoutine();
}

function renderUserRoutine() {
    userRoutineList.innerHTML = "";

    if(userRoutine.length === 0) {
        userRoutineList.innerHTML = "<li>No tenés días guardados aún.</li>";
        return;
    }

    userRoutine.forEach((enty.index) => {
        const li = document.createElement("li");
        li.classList.add("user-day");
        li.dataset.index = index;

        li.innerHTML = `
            <strong>${entry.day}</strong>:
            ${entry.exercises.map(ex => `${ex.name} (${ex.reps})`).join(", ")}
            <button class="btn small btn-edit" data-index="${index}" title="Editar">Editar</button>
            <button class="btn small btn-delete" data-index="${index}" title="Eliminar">Eliminar</button>
        `;
        
        userRoutineList.appendChild(li);
    });

    userRoutine.onclick = (e) => {
        const btn = e.target.closest("button");
        if(!btn) return;
        const idx = Number(btn.dataset.index);
        if (btn.classList.contains("btn-edit")) {
            startEditDay(idx);
        }
    };
}

function deleteDayRoutine(index) {

    userRoutine.splice(index, 1);
    saveUserRoutine();
    renderUserRoutine();
}


function startEditDay(index) {
    const entry = userRoutine[index];
    if (!entry) return;


    const firstName = entry.exercises[0]?.name || "";
    const strengthNames = strengthExcercises.map(e => e.name);
    const isStrength = strengthNames.includes(firstName);

    selectedTraining = isStrength ? "strength" : "volume";


    showDays();

    selectDay(entry.day);

    routineContainer.insertAdjacentHTML('afterbegin', `<p style="color:#166534">Estás editando <strong>${entry.day}</strong>. Cambiá lo que quieras y presioná "Agregar a mi rutina" para guardar.</p>`);
}


function saveUserRoutine() {
    localStorage.setItem("userRoutine", JSON.stringify(userRoutine));
}