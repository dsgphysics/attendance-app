let students = [
    { roll: 1, name: "AADEEP KUMAR MONDAL" }, { roll: 2, name: "AAHANA KUNDU" }, { roll: 3, name: "AASHRAYA PRANJAPATI" },
    { roll: 4, name: "ABHINABA PRAMANIK" }, { roll: 5, name: "ABHINANDAN NASKAR" }, { roll: 6, name: "ABHIRUP GANGULY" },
    { roll: 7, name: "ADITYA SARKAR" }, { roll: 8, name: "ADRIJA NASKAR" }, { roll: 9, name: "ADRITO ROY" },
    { roll: 10, name: "AKASH DEY" }, { roll: 11, name: "ANIDYA MISHRA" }, { roll: 12, name: "ANIKA ARIF" },
    { roll: 13, name: "ANKITA NAIYA" }, { roll: 14, name: "ANURAG DEY" }, { roll: 15, name: "ANUSKA DAS" },
    { roll: 16, name: "ANUSKA GHOSH" }, { roll: 17, name: "ARSHIA DHAR" }, { roll: 18, name: "ASHNARGHYA JANA" },
    { roll: 19, name: "BIHAAN MAJUMDER" }, { roll: 20, name: "BISHWARUP ACHARJEE" }, { roll: 21, name: "DEBMALLYO NASKAR" },
    { roll: 22, name: "DIBAKAR KUMAR" }, { roll: 23, name: "DIVYANSHI SANTRA" }, { roll: 24, name: "HRITAM BHATTACHARYA" },
    { roll: 25, name: "JUHI SARDAR" }, { roll: 26, name: "PARTHIB DEY" }, { roll: 27, name: "RISHAN BHATTACHARYA" },
    { roll: 28, name: "RIYANK GHOSH" }, { roll: 29, name: "ROHAN SINHA" }, { roll: 30, name: "ROUNAK DAS" },
    { roll: 31, name: "SAMRIDDHI MISHRA" }, { roll: 32, name: "SAMRIDHA MAJUMDAR" }, { roll: 33, name: "SAPTAK SINHA" },
    { roll: 34, name: "SENJUTI PATRA" }, { roll: 35, name: "SHRINIKA CHAKRABORTY" }, { roll: 36, name: "SHUVOJIT SEN" },
    { roll: 37, name: "SOUJANYA BHATTACHARYA" }, { roll: 38, name: "SOUMYADEEP MAITI" }, { roll: 39, name: "SOUMYAJIT MALLICK" },
    { roll: 40, name: "SOURISH SENGUPTA" }, { roll: 41, name: "SRESTHA ROY" }, { roll: 42, name: "SRIJA DAS" },
    { roll: 43, name: "SUBHODEEP MONDAL" }, { roll: 44, name: "TITHI DEBNATH" }, { roll: 45, name: "TRIPARNA MANDAL" }
];

let attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
let currentAttendance = {};

function loadStudents(filter = "") {
    let table = document.getElementById('attendance-table');
    table.innerHTML = '';
    students.filter(s => s.name.toLowerCase().includes(filter.toLowerCase())).forEach(student => {
        let isAbsent = currentAttendance[student.name] === 'Absent';
        let row = `<tr>
            <td>${student.roll}</td>
            <td>${student.name}</td>
            <td><input type="checkbox" class="absent-checkbox" ${isAbsent ? 'checked' : ''} data-name="${student.name}"></td>
        </tr>`;
        table.innerHTML += row;
    });
    document.querySelectorAll('.absent-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            currentAttendance[this.dataset.name] = this.checked ? 'Absent' : 'Present';
        });
    });
}

document.getElementById('searchStudent').addEventListener('input', () => {
    loadStudents(document.getElementById('searchStudent').value);
});

function markAllPresent() {
    currentAttendance = {}; 
    document.querySelectorAll('.absent-checkbox').forEach(checkbox => checkbox.checked = false);
}

function submitAttendance() {
    let date = document.getElementById("attendanceDate").value;
    if (!date) {
        alert("Please select a date.");
        return;
    }

    if (!attendanceRecords[date]) {
        attendanceRecords[date] = {};
    }

    students.forEach(student => {
        attendanceRecords[date][student.name] = currentAttendance[student.name] || "Present";
    });

    localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
    
    // Refresh the table immediately
    loadAttendanceRecords();

    // Show summary popup
    showSummaryPopup(date);
}

function loadAttendanceRecords() {
    let table = document.getElementById('attendance-records');
    table.innerHTML = "";
    let dates = Object.keys(attendanceRecords);
    if (dates.length === 0) return;
    let headerRow = `<tr><th>Student Name</th>${dates.map(date => `<th>${date}</th>`).join('')}</tr>`;
    table.innerHTML += headerRow;
    students.forEach(student => {
        let row = `<tr><td>${student.name}</td>`;
        dates.forEach(date => {
            row += `<td>${attendanceRecords[date][student.name] || 'Present'}</td>`;
        });
        row += "</tr>";
        table.innerHTML += row;
    });
}

function exportAttendance() {
    let csvContent = "Student Name";
    let dates = Object.keys(attendanceRecords);
    csvContent += "," + dates.join(",") + "\n";
    students.forEach(student => {
        let row = `${student.name}`;
        dates.forEach(date => {
            row += "," + (attendanceRecords[date][student.name] || 'Present');
        });
        csvContent += row + "\n";
    });
    let blob = new Blob([csvContent], { type: 'text/csv' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "attendance_records.csv";
    link.click();
}

function deleteAttendance() {
    let date = document.getElementById('deleteDate').value;
    if (date && attendanceRecords[date]) {
        delete attendanceRecords[date];
        localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
        alert("Attendance data for " + date + " has been deleted.");
        loadAttendanceRecords();
    } else {
        alert("No attendance data found for this date!");
    }
}

function updateSummaryRows() {
    let table = document.getElementById("attendance-records");
    let dates = Object.keys(attendanceRecords);
    if (dates.length === 0) return;

    let totalPresent = {}, totalAbsent = {};

    students.forEach(student => {
        dates.forEach(date => {
            let status = attendanceRecords[date][student.name] || 'Present';
            if (!totalPresent[date]) totalPresent[date] = 0;
            if (!totalAbsent[date]) totalAbsent[date] = 0;
            status === 'Absent' ? totalAbsent[date]++ : totalPresent[date]++;
        });
    });

    table.innerHTML += `<tr><td><b>Total Present</b></td>${dates.map(date => `<td>${totalPresent[date]}</td>`).join('')}</tr>`;
    table.innerHTML += `<tr><td><b>Total Absent</b></td>${dates.map(date => `<td>${totalAbsent[date]}</td>`).join('')}</tr>`;
    table.innerHTML += `<tr><td><b>Total Students</b></td>${dates.map(() => `<td>${students.length}</td>`).join('')}</tr>`;
}

function loadAttendanceRecords() {
    let table = document.getElementById("attendance-records");
    table.innerHTML = "";
    let dates = Object.keys(attendanceRecords);
    if (dates.length === 0) return;

    let headerRow = `<tr><th>Student Name</th>${dates.map(date => `<th>${date}</th>`).join('')}</tr>`;
    table.innerHTML += headerRow;

    students.forEach(student => {
        let row = `<tr><td>${student.name}</td>`;
        dates.forEach(date => {
            let status = attendanceRecords[date][student.name] || 'Present';
            row += `<td>${status}</td>`;
        });
        row += "</tr>";
        table.innerHTML += row;
    });

    updateSummaryRows(); // Call function to add present/absent rows
}

function showSummaryPopup(date) {
    let totalPresent = 0, totalAbsent = 0;

    students.forEach(student => {
        if (attendanceRecords[date][student.name] === "Absent") {
            totalAbsent++;
        } else {
            totalPresent++;
        }
    });

    let summaryMessage = `📅 Date: ${date}\n🏫 Class: VIII A\n✅ Total Present: ${totalPresent}\n❌ Total Absent: ${totalAbsent}\n👥 Total Students: ${students.length}`;

    document.getElementById("summary-text").innerText = summaryMessage;
    document.getElementById("summary-popup").style.display = "block";
}

function copySummary() {
    let text = document.getElementById("summary-text").innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Summary copied!");
    });
}

function closePopup() {
    document.getElementById("summary-popup").style.display = "none";
}

function submitAttendance() {
    let date = document.getElementById("attendanceDate").value;
    if (!date) {
        alert("Please select a date.");
        return;
    }

    if (!attendanceRecords[date]) {
        attendanceRecords[date] = {};
    }

    students.forEach(student => {
        attendanceRecords[date][student.name] = currentAttendance[student.name] || "Present";
    });

    localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
    
    // Show summary popup
    showSummaryPopup(date);
}

window.onload = () => {
    loadStudents();
    loadAttendanceRecords();
};
