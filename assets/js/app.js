if(
    !sessionStorage.getItem("loggedIn")
){
    window.location.href="../index.html";
}

// ===============================
// GREETING
// ===============================

const greeting = document.getElementById("greeting");

if(greeting){

    const hour = new Date().getHours();

    const settings = JSON.parse(localStorage.getItem("settings"));

    const name = settings?.name || "";

    let greet="";

    if(hour<12){

        greet="Good Morning";

    }

    else if(hour<17){

        greet="Good Afternoon";

    }

    else{

        greet="Good Evening";

    }

    greeting.textContent =

    name

    ? `${greet}, ${name} 🌿`

    : `${greet} 🌿`;

}


// ===============================
// DATE
// ===============================

const dateElement = document.getElementById("date");

if(dateElement){

    const today = new Date();

    const options = {

        weekday:"long",

        day:"numeric",

        month:"long"

    };

    dateElement.textContent =
    today.toLocaleDateString("en-IN",options);

}



// ===============================
// QUOTES
// ===============================

const quotes=[

"Success is the sum of small efforts repeated every day.",

"The secret of getting ahead is getting started.",

"Discipline is remembering what you want.",

"Small progress is still progress.",

"The pages you read today become the wisdom you carry tomorrow.",

"Stay patient. Stay consistent.",

"Action is the foundational key to success.",

"The future depends on what you do today.",

"Your future self is watching.",

"One focused hour beats five distracted ones.",

"Fall in love with the process."

];

const quote=document.getElementById("quote");

if(quote){

    const random=Math.floor(Math.random()*quotes.length);

    quote.textContent=quotes[random];

}



// ===============================
// TASK STORAGE
// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];



// ===============================
// DASHBOARD TASKS
// ===============================

const taskList=document.getElementById("task-list");

if(taskList){

    if(tasks.length===0){

        taskList.innerHTML=`

        <div class="empty">

        🌿

        <p>Your compass is clear.</p>

        <span>Add your first task from Planner.</span>

        </div>

        `;

    }

    else{

        taskList.innerHTML="";

        tasks.slice(0,5).forEach(task=>{

            taskList.innerHTML += `

<label class="task">

<input
type="checkbox"
${task.completed ? "checked" : ""}
onchange="toggleTask(${tasks.indexOf(task)})">

<div>

<strong>${task.title}</strong>

<br>

<small>${task.date}</small>

</div>

</label>

`;

`;
                <div>

                    <strong>${task.title}</strong>

                    <br>

                    <small>${task.date}</small>

                </div>

            </div>

            `;

        });

    }

}



// ===============================
// PROGRESS
// ===============================

const fill=document.getElementById("progressFill");

const text=document.getElementById("progressText");

if(fill && text){

    const completed=

    tasks.filter(task=>task.completed).length;

    const percent=

    tasks.length===0

    ?0

    :Math.round((completed/tasks.length)*100);

    fill.style.width=percent+"%";

    text.textContent=

    percent+"% Completed";

}



// ===============================
// DEADLINES
// ===============================

const deadline=document.getElementById("deadline-list");

if(deadline){

    if(tasks.length===0){

        deadline.innerHTML="No upcoming deadlines.";

    }

    else{

        tasks.slice(0,4).forEach(task=>{

            deadline.innerHTML+=`

            <div class="deadline">

                <strong>${task.title}</strong>

                <p>${task.date}</p>

            </div>

            `;

        });

    }

}
// ======================
// PLANNER
// ======================

function renderTasks(){

const container=document.getElementById("allTasks");

container.innerHTML="";

tasks.forEach((task,index)=>{

container.innerHTML+=`

<div class="taskCard">

<div class="left">

<h3>${task.title}</h3>

<p>${task.date}</p>

<span class="priority ${task.priority.toLowerCase()}">

${task.priority}

</span>

</div>

<div>

<button
class="delete"
onclick="deleteTask(${index})">

Delete

</button>

</div>

</div>

`;

});

}

const addButton=document.getElementById("addTask");

if(addButton){



renderTasks();
updatePlannerStats();
addButton.onclick=()=>{

const title=document.getElementById("taskTitle").value;

const date=document.getElementById("taskDate").value;

const priority=document.getElementById("priority").value;

if(title.trim()==="" || date===""){

alert("Please enter both task name and due date.");

return;

}

tasks.push({

title,

date,

priority,

completed:false,

focus:false

});

localStorage.setItem(

"tasks",

JSON.stringify(tasks)

);

document.getElementById("taskTitle").value="";

renderTasks();
updatePlannerStats();

}

}
// ======================
// PLANNER STATISTICS
// ======================

function updatePlannerStats(){

    const total = document.getElementById("taskCount");
    const completed = document.getElementById("completedCount");
    const pending = document.getElementById("pendingCount");

    if(!total || !completed || !pending){
        return;
    }

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(task => task.completed).length;

    const pendingTasks = totalTasks - completedTasks;

    total.textContent = totalTasks;
    completed.textContent = completedTasks;
    pending.textContent = pendingTasks;

}



function deleteTask(index){

    tasks.splice(index,1);

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    renderTasks();
    updatePlannerStats();
    updateProgress();

}

function toggleTask(index){

tasks[index].completed = !tasks[index].completed;

localStorage.setItem(

"tasks",

JSON.stringify(tasks)

);

updateProgress();

}
function updateProgress(){

    const fill = document.getElementById("progressFill");
    const text = document.getElementById("progressText");

    if(!fill || !text) return;

    const completed =
        tasks.filter(task => task.completed).length;

    const percent =
        tasks.length === 0
        ? 0
        : Math.round(completed / tasks.length * 100);

    fill.style.width = percent + "%";

    text.textContent = `${percent}% Completed`;

}
// ======================================
// SUBJECTS
// ======================================

let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

const addSubjectBtn = document.getElementById("addSubject");

if(addSubjectBtn){

    renderSubjects();
    updateSubjectStats();

    addSubjectBtn.onclick = () => {

        const name = document.getElementById("subjectName").value.trim();
        const exam = document.getElementById("examDate").value;
        const total = parseInt(document.getElementById("totalChapters").value);
        const completed = parseInt(document.getElementById("completedChapters").value);
        const difficulty = document.getElementById("difficulty").value;

        if(
            name==="" ||
            exam==="" ||
            isNaN(total) ||
            isNaN(completed)
        ){

            alert("Please fill all fields.");

            return;

        }

        if(completed>total){

            alert("Completed chapters cannot exceed total chapters.");

            return;

        }

        subjects.push({

            name,
            exam,
            total,
            completed,
            difficulty

        });

        localStorage.setItem(
            "subjects",
            JSON.stringify(subjects)
        );

        document.getElementById("subjectName").value="";
        document.getElementById("examDate").value="";
        document.getElementById("totalChapters").value="";
        document.getElementById("completedChapters").value="";

        renderSubjects();
        updateSubjectStats();

    };

}
function renderSubjects(){

    const container = document.getElementById("allSubjects");

    if(!container) return;

    container.innerHTML="";

    if(subjects.length===0){

        container.innerHTML=`

        <div class="empty">

        📚

        <p>No subjects added yet.</p>

        <span>Add your first subject.</span>

        </div>

        `;

        return;

    }

    subjects.forEach((subject,index)=>{

        const progress=Math.round(
            (subject.completed/subject.total)*100
        );

        container.innerHTML+=`

        <div class="subjectCard">

            <div class="subjectLeft">

                <div class="subjectTop">

                    <h2>${subject.name}</h2>

                </div>

                <p class="subjectDate">

                    Exam :
                    ${subject.exam}

                </p>

                <div class="subjectProgress">

                    <div
                    class="subjectFill"
                    style="width:${progress}%">

                    </div>

                </div>

                <p class="progressText">

                    ${subject.completed}
                    /
                    ${subject.total}
                    Chapters Completed

                </p>

                <span
                class="subjectBadge ${subject.difficulty.toLowerCase()}">

                ${subject.difficulty}

                </span>

            </div>

            <div class="subjectRight">

                <button
                class="editSubject"
                onclick="increaseChapter(${index})">

                + Chapter

                </button>

                <button
                class="deleteSubject"
                onclick="deleteSubject(${index})">

                Delete

                </button>

            </div>

        </div>

        `;

    });

}
function increaseChapter(index){

    if(subjects[index].completed < subjects[index].total){

        subjects[index].completed++;

    }

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

    renderSubjects();
    updateSubjectStats();

}
function deleteSubject(index){

    subjects.splice(index,1);

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

    renderSubjects();
    updateSubjectStats();

}
function updateSubjectStats(){

    const totalSubjects=document.getElementById("subjectCount");

    const examCount=document.getElementById("examCount");

    const average=document.getElementById("averageProgress");

    if(!totalSubjects) return;

    totalSubjects.textContent=subjects.length;

    let upcoming=0;

    let progress=0;

    const today=new Date();

    subjects.forEach(subject=>{

        const exam=new Date(subject.exam);

        const diff=Math.ceil(
            (exam-today)/(1000*60*60*24)
        );

        if(diff>=0 && diff<=7){

            upcoming++;

        }

        progress+=
        (subject.completed/subject.total)*100;

    });

    examCount.textContent=upcoming;

    if(subjects.length===0){

        average.textContent="0%";

    }

    else{

        average.textContent=

        Math.round(progress/subjects.length)

        +"%";

    }

}
// ======================================
// ANALYTICS
// ======================================

const analyticsTasks = document.getElementById("analyticsTasks");

if(analyticsTasks){

    loadAnalytics();

}

function loadAnalytics(){

    const analyticsCompleted =
    document.getElementById("analyticsCompleted");

    const analyticsSubjects =
    document.getElementById("analyticsSubjects");

    const studyScore =
    document.getElementById("studyScore");

    const overallFill =
    document.getElementById("overallProgress");

    const overallText =
    document.getElementById("overallProgressText");

    const examList =
    document.getElementById("examList");

    const subjectProgress =
    document.getElementById("subjectProgressList");

    const studyInsight =
    document.getElementById("studyInsight");



    // ==========================
    // BASIC COUNTS
    // ==========================

    const totalTasks = tasks.length;

    const completedTasks =
    tasks.filter(task=>task.completed).length;

    const totalSubjects =
    subjects.length;



    analyticsTasks.textContent = totalTasks;

    analyticsCompleted.textContent = completedTasks;

    analyticsSubjects.textContent = totalSubjects;



    // ==========================
    // OVERALL PROGRESS
    // ==========================

    let progress = 0;

    if(totalTasks>0){

        progress = Math.round(
        (completedTasks/totalTasks)*100);

    }

    overallFill.style.width = progress + "%";

    overallText.textContent =
    progress + "% Completed";



    // ==========================
    // STUDY SCORE
    // ==========================

    let score = progress;

    if(totalSubjects>0){

        let subjectProgressValue = 0;

        subjects.forEach(subject=>{

            subjectProgressValue +=

            (subject.completed/subject.total)*100;

        });

        subjectProgressValue /= totalSubjects;

        score = Math.round(

            (progress + subjectProgressValue)/2

        );

    }

    studyScore.textContent = score + "/100";



    // ==========================
    // UPCOMING EXAMS
    // ==========================

    examList.innerHTML="";

    if(subjects.length===0){

        examList.innerHTML=`

        <div class="analyticsEmpty">

        📚

        <p>No subjects yet.</p>

        </div>

        `;

    }

    else{

        const today = new Date();

        subjects.forEach(subject=>{

            const exam = new Date(subject.exam);

            const days = Math.ceil(

                (exam-today)

                /(1000*60*60*24)

            );

            examList.innerHTML += `

            <div class="examItem">

                <div>

                    <div class="examSubject">

                        ${subject.name}

                    </div>

                </div>

                <div class="examDays">

                    ${days} days

                </div>

            </div>

            `;

        });

    }



    // ==========================
    // SUBJECT PROGRESS
    // ==========================

    subjectProgress.innerHTML="";

    if(subjects.length===0){

        subjectProgress.innerHTML=`

        <div class="analyticsEmpty">

        📖

        <p>No subjects available.</p>

        </div>

        `;

    }

    else{

        subjects.forEach(subject=>{

            const percent = Math.round(

                (subject.completed/

                subject.total)*100

            );

            subjectProgress.innerHTML += `

            <div class="subjectProgressRow">

                <div class="subjectProgressHeader">

                    <span>

                    ${subject.name}

                    </span>

                    <span>

                    ${percent}%

                    </span>

                </div>

                <div class="subjectProgressBar">

                    <div

                    class="subjectProgressFill"

                    style="width:${percent}%">

                    </div>

                </div>

            </div>

            `;

        });

    }



    // ==========================
    // STUDY INSIGHT
    // ==========================

    if(totalTasks===0 && totalSubjects===0){

        studyInsight.innerHTML =

        "🌱 Start by creating a few tasks and adding your subjects. Your insights will appear here.";

    }

    else if(score>=85){

        studyInsight.innerHTML=

        "🏆 Outstanding! You're consistently staying ahead. Keep the momentum going.";

    }

    else if(score>=70){

        studyInsight.innerHTML=

        "✨ Great progress! Completing a few more tasks today will push your study score even higher.";

    }

    else if(score>=50){

        studyInsight.innerHTML=

        "📖 You're halfway there. Try finishing one pending task and one chapter today.";

    }

    else{

        studyInsight.innerHTML=

        "⚠ Your schedule needs some attention. Focus on completing today's tasks before adding new ones.";

    }

}
// ======================================
// SETTINGS
// ======================================

const saveSettingsBtn = document.getElementById("saveSettings");

if(saveSettingsBtn){

    loadSettings();

    saveSettingsBtn.onclick = saveSettings;

}



// =============================
// SAVE SETTINGS
// =============================

function saveSettings(){

    const settings = {

        name: document.getElementById("userName").value.trim(),

        email: document.getElementById("userEmail").value.trim(),

        goal: document.getElementById("studyGoal").value,

        studyTime: document.getElementById("studyTime").value

    };

    localStorage.setItem(

        "settings",

        JSON.stringify(settings)

    );

    alert("Preferences saved successfully!");

}



// =============================
// LOAD SETTINGS
// =============================

function loadSettings(){

    const settings = JSON.parse(

        localStorage.getItem("settings")

    );

    if(!settings) return;

    document.getElementById("userName").value =
    settings.name || "";

    document.getElementById("userEmail").value =
    settings.email || "";

    document.getElementById("studyGoal").value =
    settings.goal || "";

    document.getElementById("studyTime").value =
    settings.studyTime || "Morning";

}
// =============================
// CLEAR TASKS
// =============================

const clearTasksBtn = document.getElementById("clearTasks");

if(clearTasksBtn){

    clearTasksBtn.onclick = ()=>{

        if(confirm("Delete all tasks?")){

            localStorage.removeItem("tasks");

            tasks=[];

            alert("All tasks deleted.");

        }

    };

}



// =============================
// CLEAR SUBJECTS
// =============================

const clearSubjectsBtn = document.getElementById("clearSubjects");

if(clearSubjectsBtn){

    clearSubjectsBtn.onclick = ()=>{

        if(confirm("Delete all subjects?")){

            localStorage.removeItem("subjects");

            subjects=[];

            alert("All subjects deleted.");

        }

    };

}
// =============================
// RESET APP
// =============================

const resetBtn = document.getElementById("clearEverything");

if(resetBtn){

    resetBtn.onclick = ()=>{

        if(confirm(

            "This will erase EVERYTHING.\n\nContinue?"

        )){

            localStorage.clear();

            alert("StudyPilot has been reset.");

            window.location.reload();

        }

    };

}
// ======================================
// SMART STUDY PLANNER
// ======================================

const generatePlanBtn =
document.getElementById("generatePlan");

if(generatePlanBtn){

generatePlanBtn.onclick =
generateStudyPlan;

}

function generateStudyPlan(){

const container =
document.getElementById("studyPlan");

if(!container) return;

container.innerHTML="";

if(subjects.length===0){

container.innerHTML=`

<div class="empty">

📚

<p>No subjects found.</p>

</div>

`;

return;

}

let plan=[];

const today=new Date();

subjects.forEach(subject=>{

const remaining=
subject.total-subject.completed;

if(remaining<=0){

return;

}

const examDate=
new Date(subject.exam);

let daysLeft=Math.ceil(

(examDate-today)

/

(1000*60*60*24)

);

if(daysLeft<1){

daysLeft=1;

}

let urgency;

if(daysLeft<=2){

urgency=5;

}

else if(daysLeft<=5){

urgency=4;

}

else if(daysLeft<=10){

urgency=3;

}

else{

urgency=2;

}

let difficulty;

switch(subject.difficulty){

case "Hard":

difficulty=3;

break;

case "Medium":

difficulty=2;

break;

default:

difficulty=1;

}

let workload;

if(remaining>=15){

workload=3;

}

else if(remaining>=8){

workload=2;

}

else{

workload=1;

}

const score=

urgency+

difficulty+

workload;

const chaptersToday=

Math.max(

1,

Math.ceil(

remaining/daysLeft

)

);

const hours=

(chaptersToday*

(difficulty==3?1.5:

difficulty==2?1:

0.75)

).toFixed(1);

plan.push({

name:subject.name,

score,

chaptersToday,

hours,

difficulty:subject.difficulty

});

});
plan.sort((a,b)=>b.score-a.score);

plan=plan.slice(0,3);

if(plan.length===0){

container.innerHTML=`

<div class="empty">

🎉

<p>Everything is completed.</p>

</div>

`;

return;

}

plan.forEach(subject=>{

container.innerHTML+=`

<div class="planCard">

<h3>

📖 ${subject.name}

</h3>

<p class="planInfo">

Today's Goal:
<strong>

${subject.chaptersToday}

chapter(s)

</strong>

</p>

<p class="planInfo">

Difficulty:

${subject.difficulty}

</p>

<div class="planHours">

⏳

${subject.hours}

hours recommended

</div>

</div>

`;

});

}
// ===============================
// LOGOUT
// ===============================

function logout(){

    sessionStorage.removeItem("loggedIn");

    window.location.href="../index.html";

}