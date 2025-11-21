const btnStrength = document.getElementById("btnStrength"); 
const btnVolume = document.getElementById("btnVolume");

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const daysContainer = document.getElementById("daysContainer");
const routineContainer = document.getElementById("routineContainer");

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
    
    if (selectedTraining === "strength") {
        showRoutine(strengthExcercises);
    } else if (selectedTraining === "volume") {
        showRoutine(volumeExcercises);
    }
}