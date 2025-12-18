let data = {};
let routine = JSON.parse(localStorage.getItem("routine")) || [];

const groupsContainer = document.getElementById("groupsContainer");
const exerciseContainer = document.getElementById("exerciseContainer");
const routineList = document.getElementById("routineList");
const daySelect = document.getElementById("daySelect");
const liveTitle = document.getElementById("liveTitle");
const liveList = document.getElementById("liveList");

fetch("../data/exercises.json")
    .then(res => res.json())
    .then(json => {
        data = json;
        init();
    });

function init() {
    const path = location.pathname;

    if (path.includes("strength")) {
        loadGroups("strength");
    }

    if (path.includes("volume")) {
        loadGroups("volume");
    }

    if (routineList) {
        showRoutines();
    }

    if (daySelect) {
        daySelect.addEventListener("change", renderLiveRoutine);
    }
}

function loadGroups(type) {
    groupsContainer.innerHTML = "";

    Object.keys(data[type]).forEach(group => {
        const btn = document.createElement("button");
        btn.textContent = group.toUpperCase();
        btn.onclick = () => loadExercises(type, group);
        groupsContainer.appendChild(btn);
    });
}

function loadExercises(type, group) {
    if (!daySelect.value) {
        exerciseContainer.innerHTML = "<p>Seleccioná un día primero</p>";
        return;
    }

    exerciseContainer.innerHTML = `<h3>${group.toUpperCase()}</h3>`;

    data[type][group].forEach(ex => {
        const div = document.createElement("div");

        div.innerHTML = `
            <p><strong>${ex.name}</strong> (${ex.reps})</p>
            <button>Agregar</button>
        `;

        div.querySelector("button").onclick = () => {
            // Validar si ya está en la rutina del mismo día
            const exists = routine.some(r => 
                r.day === daySelect.value &&
                r.group === group &&
                r.name === ex.name
            );

            if (exists) {
                alert("Este ejercicio ya está en tu rutina para este día.");
                return;
            }

            routine.push({
                day: daySelect.value,
                group,
                name: ex.name,
                reps: ex.reps
            });

            localStorage.setItem("routine", JSON.stringify(routine));
            renderLiveRoutine();
            showRecommendations(type, ex.secondary);
        };

        exerciseContainer.appendChild(div);
    });
}

function showRecommendations(type, secondary) {
    if (!secondary || !secondary.length) return;

    const rec = document.createElement("div");
    rec.innerHTML = "<h4>Ejercicios recomendados</h4>";

    secondary.forEach(group => {
        if (data[type][group]) {
            data[type][group].forEach(ex => {
                const p = document.createElement("p");
                p.textContent = `${ex.name} (${group})`;
                rec.appendChild(p);
            });
        }
    });

    exerciseContainer.appendChild(rec);
}

function renderLiveRoutine() {
    if (!daySelect.value) return;

    const day = daySelect.value;
    const dayExercises = routine.filter(ex => ex.day === day);

    liveTitle.textContent = `Tu rutina para ${day}`;
    liveList.innerHTML = "";

    if (dayExercises.length === 0) {
        liveList.innerHTML = "<li>No hay ejercicios todavía</li>";
        return;
    }

    dayExercises.forEach(ex => {
        const li = document.createElement("li");
        li.textContent = `${ex.name} (${ex.group}) - ${ex.reps}`;
        liveList.appendChild(li);
    });
}

function showRoutines() {
    if (!routine.length) {
        routineList.innerHTML = "<li>No hay rutinas guardadas</li>";
        return;
    }

    const grouped = {};

    routine.forEach((item, index) => {
        if (!grouped[item.day]) grouped[item.day] = [];
        grouped[item.day].push({ ...item, index });
    });

    routineList.innerHTML = "";

    Object.keys(grouped).forEach(day => {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${day}</strong>
            <button onclick="deleteDay('${day}')">Eliminar día</button>
            <ul>
                ${grouped[day]
                    .map(ex => `
                        <li>
                            ${ex.name} (${ex.group})
                            <button onclick="deleteExercise(${ex.index})">Eliminar</button>
                        </li>
                    `)
                    .join("")}
            </ul>
        `;

        routineList.appendChild(li);
    });
}

function deleteExercise(index) {
    routine.splice(index, 1);
    localStorage.setItem("routine", JSON.stringify(routine));
    showRoutines();
}

function deleteDay(day) {
    routine = routine.filter(ex => ex.day !== day);
    localStorage.setItem("routine", JSON.stringify(routine));
    showRoutines();
}
