document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    const userEmail = localStorage.getItem('userEmail');
    document.getElementById('userName').textContent = userEmail.split('@')[0];
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadUserData();
    loadPunchData();
    renderMiniCalendar();
    checkAlerts();
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    });
});
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('currentDateTime').textContent = now.toLocaleDateString('en-US', options);
}
function loadUserData() {
    const userData = {
        email: localStorage.getItem('userEmail'),
        name: "Dr. Faculty Member",
        designation: "Assistant Professor",
        weeklyTarget: 35,
        department: "Computer Science"
    };
    document.getElementById('designationBadge').textContent = userData.designation;
    document.getElementById('weekTarget').textContent = `${userData.weeklyTarget}h`;
}
function loadPunchData() {
    const punchData = {
        todayHours: 4.5,
        weekHours: 22,
        monthHours: 78,
        weekTarget: 35,
        progress: (22 / 35) * 100
    };
    document.getElementById('todayHours').textContent = formatHours(punchData.todayHours);
    document.getElementById('weekHours').textContent = formatHours(punchData.weekHours);
    document.getElementById('monthHours').textContent = formatHours(punchData.monthHours);
    
    const progressFill = document.getElementById('weekProgress');
    progressFill.style.width = `${punchData.progress}%`;
    document.getElementById('progressText').textContent = `${Math.round(punchData.progress)}% completed`;
    if (punchData.progress < 40) {
        progressFill.style.backgroundColor = '#e74c3c';
    } else if (punchData.progress < 70) {
        progressFill.style.backgroundColor = '#f39c12';
    } else {
        progressFill.style.backgroundColor = '#2ecc71';
    }
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysLeft = 5 - dayOfWeek;
    if (daysLeft > 0) {
        const hoursNeeded = punchData.weekTarget - punchData.weekHours;
        const dailyNeeded = hoursNeeded / daysLeft;
        
        if (dailyNeeded > 8) {
            document.getElementById('projectionText').textContent = 
                `You need to work ${dailyNeeded.toFixed(1)}h/day to meet target`;
            document.getElementById('projectionText').style.color = '#e74c3c';
        } else if (dailyNeeded > 5) {
            document.getElementById('projectionText').textContent = 
                `You need to work ${dailyNeeded.toFixed(1)}h/day to meet target`;
            document.getElementById('projectionText').style.color = '#f39c12';
        } else {
            document.getElementById('projectionText').textContent = 
                'On track to complete weekly hours';
            document.getElementById('projectionText').style.color = '#2ecc71';
        }
    }
}
function formatHours(hours) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
}
function renderMiniCalendar() {
    const calendarEl = document.getElementById('miniCalendar');
    calendarEl.innerHTML = '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day header';
        dayEl.textContent = day;
        calendarEl.appendChild(dayEl);
    });
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'calendar-day inactive';
        calendarEl.appendChild(emptyEl);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = i;
        if (i === now.getDate() && currentMonth === now.getMonth()) {
            dayEl.classList.add('today');
        }
        if (i <= now.getDate() && Math.random() > 0.3) {
            if (Math.random() > 0.8) {
                dayEl.classList.add('missed');
            } else if (Math.random() > 0.6) {
                dayEl.classList.add('partial');
            } else {
                dayEl.classList.add('worked');
            }
        }
        calendarEl.appendChild(dayEl);
    }
}
function checkAlerts() {
    const alertBox = document.getElementById('alertBox');
    alertBox.innerHTML = '';
    const today = new Date();
    const dayOfWeek = today.getDay();
    if (dayOfWeek === 5) { 
        const weekHours = 22;
        const weekTarget = 35;
        if (weekHours < weekTarget * 0.6) {
            const alert = document.createElement('div');
            alert.className = 'alert warning';
            alert.innerHTML = `<strong>Warning:</strong> You've only completed ${Math.round((weekHours/weekTarget)*100)}% of your weekly hours. You have ${weekTarget - weekHours} hours remaining to complete by today.`;
            alertBox.appendChild(alert);
        }
    }
    if (dayOfWeek >= 3) { 
        const alert = document.createElement('div');
        alert.className = 'alert info';
        alert.innerHTML = `<strong>Reminder:</strong> Don't forget to punch in/out for accurate time tracking.`;
        alertBox.appendChild(alert);
    }
    const weekHours = 22;
    const weekTarget = 35;
    if (weekHours >= weekTarget * 0.8) {
        const alert = document.createElement('div');
        alert.className = 'alert success';
        alert.innerHTML = `<strong>Great job!</strong> You're on track to meet your weekly hours target.`;
        alertBox.appendChild(alert);
    }
}