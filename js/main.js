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

    if (path.includes("strength")) loadGroups("strength");
    if (path.includes("volume")) loadGroups("volume");
    if (routineList) showRoutines();
    if (daySelect) daySelect.addEventListener("change", renderLiveRoutine);
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
        div.innerHTML = `<p><strong>${ex.name}</strong> (${ex.reps})</p><button>Agregar</button>`;

        div.querySelector("button").onclick = () => {
            const exists = routine.some(r => 
                r.day === daySelect.value && r.group === group && r.name === ex.name
            );
            if (exists) { alert("Este ejercicio ya está en tu rutina para este día."); return; }

            routine.push({
                day: daySelect.value,
                group,
                name: ex.name,
                reps: ex.reps,
                secondary: ex.secondary || []
            });
            localStorage.setItem("routine", JSON.stringify(routine));
            renderLiveRoutine();
        };

        exerciseContainer.appendChild(div);
    });

    showRecommendations(type);
}

function showRecommendations(type) {
    const day = daySelect.value;
    if (!day) return;

    const dayExercises = routine.filter(ex => ex.day === day);
    let recommendedGroups = [];
    dayExercises.forEach(ex => {
        if (ex.secondary && ex.secondary.length) recommendedGroups = recommendedGroups.concat(ex.secondary);
    });

    recommendedGroups = [...new Set(recommendedGroups)];
    const existingGroups = dayExercises.map(ex => ex.group);
    recommendedGroups = recommendedGroups.filter(g => !existingGroups.includes(g));
    if (recommendedGroups.length === 0) return;

    const recDiv = document.createElement("div");
    recDiv.innerHTML = "<h4>Ejercicios recomendados</h4>";
    recommendedGroups.forEach(g => {
        if (data[type][g]) {
            data[type][g].forEach(ex => {
                const alreadyAdded = dayExercises.some(d => d.name === ex.name && d.group === g);
                if (!alreadyAdded) {
                    const p = document.createElement("p");
                    p.textContent = `${ex.name} (${g})`;
                    recDiv.appendChild(p);
                }
            });
        }
    });

    const oldRec = exerciseContainer.querySelector("div h4");
    if (oldRec) oldRec.parentNode.remove();
    exerciseContainer.appendChild(recDiv);
}

function renderLiveRoutine() {
    if (!daySelect.value) return;
    const day = daySelect.value;
    const dayExercises = routine.filter(ex => ex.day === day);
    liveTitle.textContent = `Tu rutina para ${day}`;
    liveList.innerHTML = "";
    if (dayExercises.length === 0) { liveList.innerHTML = "<li>No hay ejercicios todavía</li>"; return; }
    dayExercises.forEach(ex => {
        const li = document.createElement("li");
        li.textContent = `${ex.name} (${ex.group}) - ${ex.reps}`;
        liveList.appendChild(li);
    });
    showRecommendations(location.pathname.includes("strength") ? "strength" : "volume");
}

function showRoutines() {
    if (!routine.length) { routineList.innerHTML = "<li>No hay rutinas guardadas</li>"; return; }
    const grouped = {};
    routine.forEach((item, index) => {
        if (!grouped[item.day]) grouped[item.day] = [];
        grouped[item.day].push({ ...item, index });
    });

    routineList.innerHTML = "";
    Object.keys(grouped).forEach(day => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${day}</strong><button onclick="deleteDay('${day}')">Eliminar día</button><ul>${grouped[day].map(ex => `<li>${ex.name} (${ex.group})<button onclick="deleteExercise(${ex.index})">Eliminar</button></li>`).join("")}</ul>`;
        routineList.appendChild(li);
    });
}

function deleteExercise(index) {
    routine.splice(index, 1);
    localStorage.setItem("routine", JSON.stringify(routine));
    showRoutines();
    if(daySelect.value) showRecommendations(location.pathname.includes("strength") ? "strength" : "volume");
}

function deleteDay(day) {
    routine = routine.filter(ex => ex.day !== day);
    localStorage.setItem("routine", JSON.stringify(routine));
    showRoutines();
    if(daySelect.value) showRecommendations(location.pathname.includes("strength") ? "strength" : "volume");
}
