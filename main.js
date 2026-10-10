document.addEventListener("DOMContentLoaded", () => {
  const levelSelect = document.getElementById("level");
  const gradeSelect = document.getElementById("grade");
  const subjectSelect = document.getElementById("subject");
  const strandSelect = document.getElementById("strand");
  const saveBtn = document.getElementById("saveBtn");
  const form = document.getElementById("assessmentForm");

  // 1. Populate Education Levels on load
  for (let level in cbcCurriculum) {
    const opt = document.createElement("option");
    opt.value = level;
    opt.textContent = level;
    levelSelect.appendChild(opt);
  }

  // 2. Cascading: Level Change -> Populate Grades
  levelSelect.addEventListener("change", () => {
    gradeSelect.innerHTML = '<option value="">-- Select Grade --</option>';
    subjectSelect.innerHTML = '<option value="">-- Select Learning Area --</option>';
    strandSelect.innerHTML = '<option value="">-- Select Strand --</option>';

    const selectedLevel = levelSelect.value;
    if (selectedLevel && cbcCurriculum[selectedLevel]) {
      for (let grade in cbcCurriculum[selectedLevel]) {
        const opt = document.createElement("option");
        opt.value = grade;
        opt.textContent = grade;
        gradeSelect.appendChild(opt);
      }
    }
  });

  // 3. Cascading: Grade Change -> Populate Subjects
  gradeSelect.addEventListener("change", () => {
    subjectSelect.innerHTML = '<option value="">-- Select Learning Area --</option>';
    strandSelect.innerHTML = '<option value="">-- Select Strand --</option>';

    const selectedLevel = levelSelect.value;
    const selectedGrade = gradeSelect.value;
    if (selectedLevel && selectedGrade && cbcCurriculum[selectedLevel][selectedGrade]) {
      for (let subject in cbcCurriculum[selectedLevel][selectedGrade]) {
        const opt = document.createElement("option");
        opt.value = subject;
        opt.textContent = subject;
        subjectSelect.appendChild(opt);
      }
    }
  });

  // 4. Cascading: Subject Change -> Populate Strands
  subjectSelect.addEventListener("change", () => {
    strandSelect.innerHTML = '<option value="">-- Select Strand --</option>';

    const selectedLevel = levelSelect.value;
    const selectedGrade = gradeSelect.value;
    const selectedSubject = subjectSelect.value;

    if (selectedLevel && selectedGrade && selectedSubject && cbcCurriculum[selectedLevel][selectedGrade][selectedSubject]) {
      cbcCurriculum[selectedLevel][selectedGrade][selectedSubject].forEach(strand => {
        const opt = document.createElement("option");
        opt.value = strand;
        opt.textContent = strand;
        strandSelect.appendChild(opt);
      });
    }
  });

  // 5. Load existing records on startup
  displayRecords();

  // 6. Save Record Logic
  saveBtn.addEventListener("click", () => {
    const learnerName = document.getElementById("learnerName").value.trim();
    const level = levelSelect.value;
    const grade = gradeSelect.value;
    const subject = subjectSelect.value;
    const strand = strandSelect.value;
    const performanceLevel = document.getElementById("performanceLevel").value;
    const remarks = document.getElementById("remarks").value.trim();

    if (!learnerName || !level || !grade || !subject || !strand) {
      alert("Please enter the learner name and select Level, Grade, Learning Area, and Strand.");
      return;
    }

    const record = {
      id: Date.now(),
      learnerName: learnerName,
      level: level,
      grade: grade,
      subject: subject,
      strand: strand,
      performanceLevel: performanceLevel,
      remarks: remarks,
      date: new Date().toLocaleDateString()
    };

    let records = JSON.parse(localStorage.getItem("cbc_assessments")) || [];
    records.push(record);
    localStorage.setItem("cbc_assessments", JSON.stringify(records));

    // Reset learner name and remarks inputs
    document.getElementById("learnerName").value = "";
    document.getElementById("remarks").value = "";

    alert("Assessment record saved successfully!");
    displayRecords();
  });

  // 7. CSV Export Logic
  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      let records = JSON.parse(localStorage.getItem("cbc_assessments")) || [];
      if (records.length === 0) {
        alert("No saved assessment records to export!");
        return;
      }

      let csvRows = [];
      csvRows.push(["ID", "Learner Name", "Level", "Grade", "Learning Area", "Strand", "Performance Level", "Remarks", "Date"].join(","));

      records.forEach(r => {
        let row = [
          r.id,
          `"${r.learnerName}"`,
          `"${r.level}"`,
          `"${r.grade}"`,
          `"${r.subject}"`,
          `"${r.strand}"`,
          `"${r.performanceLevel}"`,
          `"${(r.remarks || "").replace(/"/g, '""')}"`,
          `"${r.date}"`
        ];
        csvRows.push(row.join(","));
      });

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `CBC_Assessment_Log_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // 8. Render & Filter Assessment Records
  function displayRecords(filterQuery = "") {
    let records = JSON.parse(localStorage.getItem("cbc_assessments")) || [];
    let recordsContainer = document.getElementById("recordsDisplay");

    if (!recordsContainer) {
      recordsContainer = document.createElement("div");
      recordsContainer.id = "recordsDisplay";
      recordsContainer.style.marginTop = "20px";
      form.parentNode.appendChild(recordsContainer);
    }

    if (records.length === 0) {
      recordsContainer.innerHTML = "<p style='text-align:center; color:#777; font-size:0.9rem;'>No saved assessment records yet.</p>";
      return;
    }

    // Filter by learner name, level, grade, or subject
    const filtered = records.filter(r => 
      r.learnerName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.grade.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(filterQuery.toLowerCase())
    );

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h3 style="color:#1b4d3e; font-size:1.1rem;">Saved Assessment Log (${filtered.length})</h3>
      </div>
      <input type="text" id="searchInput" placeholder="🔍 Search learner name or grade..." value="${filterQuery}" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:6px; margin-bottom:12px; font-size:0.9rem;">
    `;

    if (filtered.length === 0) {
      html += "<p style='text-align:center; color:#777; font-size:0.85rem; padding:10px;'>No matching records found.</p>";
    } else {
      filtered.forEach(item => {
        html += `
          <div style="background:#ffffff; border-left:4px solid #27ae60; padding:12px; margin-bottom:10px; border-radius:6px; box-shadow:0 2px 5px rgba(0,0,0,0.05); position:relative;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <strong style="font-size:1rem; color:#2c3e50;">${item.learnerName}</strong>
              <button onclick="deleteRecord(${item.id})" style="background:#e74c3c; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; width:auto; cursor:pointer;">Delete</button>
            </div>
            <div style="font-size:0.85rem; margin-top:4px; color:#555;">
              ${item.level} | ${item.grade} | <strong>${item.subject}</strong>
            </div>
            <div style="font-size:0.85rem; margin-top:2px; color:#444;">
              Strand: ${item.strand} — <span style="color:#1b4d3e; font-weight:bold;">${item.performanceLevel}</span>
            </div>
            ${item.remarks ? `<p style="font-size:0.8rem; color:#666; margin-top:6px; font-style:italic;">"${item.remarks}"</p>` : ''}
            <div style="font-size:0.7rem; color:#aaa; margin-top:6px; text-align:right;">Saved on ${item.date}</div>
          </div>
        `;
      });
    }

    recordsContainer.innerHTML = html;

    // Re-attach listener to search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        displayRecords(e.target.value);
      });
      // Place cursor at the end of search field
      searchInput.focus();
      searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    }
  }

  // 9. Global Delete Function
  window.deleteRecord = function(id) {
    if (confirm("Are you sure you want to delete this assessment record?")) {
      let records = JSON.parse(localStorage.getItem("cbc_assessments")) || [];
      records = records.filter(item => item.id !== id);
      localStorage.setItem("cbc_assessments", JSON.stringify(records));
      displayRecords();
    }
  };
});
