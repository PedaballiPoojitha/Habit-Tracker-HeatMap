const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

let currentDate = new Date();
let habitData = JSON.parse(localStorage.getItem("habitData")) || {};

const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function formatDate(year, month, day) {
    month = String(month).padStart(2, "0");
    day = String(day).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function renderCalendar() {
    calendar.innerHTML = "";

    // Day names
    daysOfWeek.forEach(day => {
        const div = document.createElement("div");
        div.className = "day-name";
        div.textContent = day;
        calendar.appendChild(div);
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent =
        currentDate.toLocaleString("default", { month: "long" }) +
        " " + year;

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "day empty";
        calendar.appendChild(empty);
    }

    let monthlyCompleted = 0;

    for (let day = 1; day <= totalDays; day++) {
        const dateKey = formatDate(year, month + 1, day);
        const level = habitData[dateKey] || 0;

        if (level > 0) monthlyCompleted++;

        const div = document.createElement("div");
        div.className = `day level-${level}`;
        div.textContent = day;

        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            div.classList.add("today");
        }

        div.title = `${dateKey} | Level: ${level}`;

        div.addEventListener("click", () => {
            habitData[dateKey] = (habitData[dateKey] || 0) + 1;
            if (habitData[dateKey] > 4) habitData[dateKey] = 0;
            localStorage.setItem("habitData", JSON.stringify(habitData));
            renderCalendar();
        });

        calendar.appendChild(div);
    }

    updateStats(monthlyCompleted, totalDays);
}

function updateStats(done, totalDays) {
    const percent = Math.round((done / totalDays) * 100);

    document.getElementById("progress").textContent =
        `📊 Progress: ${percent}%`;

    document.getElementById("total").textContent =
        `✅ Total: ${done}`;

    calculateStreak();
}

function calculateStreak() {
    let streak = 0;
    let today = new Date();

    for (let i = 0; i < 365; i++) {
        let d = new Date();
        d.setDate(today.getDate() - i);

        let key = formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate());

        if (habitData[key] > 0) {
            streak++;
        } else {
            break;
        }
    }

    document.getElementById("streak").textContent =
        `🔥 Streak: ${streak} days`;
}

function changeMonth(step) {
    currentDate.setMonth(currentDate.getMonth() + step);
    renderCalendar();
}

function resetMonth() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= totalDays; day++) {
        const key = formatDate(year, month + 1, day);
        delete habitData[key];
    }

    localStorage.setItem("habitData", JSON.stringify(habitData));
    renderCalendar();
}

renderCalendar();
