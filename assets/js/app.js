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

    const currentUser = JSON.parse(

    sessionStorage.getItem("currentUser")

);

    const greetingName = currentUser?.name?.split(" ")[0] || "";



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
`${greet}, ${greetingName} 🌿`;
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

// Dashboard rendering (task-list, progress, deadlines) now lives
// further down, after buildStudyPlan() is defined — see
// "DASHBOARD (SCHEDULER-DRIVEN)" section near the end of this file.

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

const hoursInput=document.getElementById("taskHours");

const estimatedHours=hoursInput ? parseFloat(hoursInput.value) : NaN;

if(title.trim()==="" || date===""){

alert("Please enter both task name and due date.");

return;

}

tasks.push({

title,

date,

priority,

completed:false,

focus:false,

estimatedHours: isNaN(estimatedHours) ? null : estimatedHours

});

localStorage.setItem(

"tasks",

JSON.stringify(tasks)

);

document.getElementById("taskTitle").value="";

if(hoursInput){
hoursInput.value="";
}

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

    const {summary} = buildStudyPlan();

    fill.style.setProperty("--progress", summary.overallProgress);

    text.textContent = `${summary.overallProgress}%`;

    const taskProgressText =
        document.getElementById("taskProgressText");

    const subjectProgressText =
        document.getElementById("subjectProgressText");

    const chapterProgressText =
        document.getElementById("chapterProgressText");

    const taskProgressBar =
        document.getElementById("taskProgressBar");

    const subjectProgressBar =
        document.getElementById("subjectProgressBar");

    const chapterProgressBar =
        document.getElementById("chapterProgressBar");

    if(taskProgressText){
        taskProgressText.textContent =
            summary.overallTaskProgress + "%";
    }

    if(taskProgressBar){
        taskProgressBar.style.width =
            summary.overallTaskProgress + "%";
    }

    if(subjectProgressText){

        const subjectCompletionRate =
            summary.totalSubjects === 0
            ? 0
            : Math.round(
                (summary.completedSubjects / summary.totalSubjects) * 100
            );

        subjectProgressText.textContent =
            subjectCompletionRate + "%";

        if(subjectProgressBar){
            subjectProgressBar.style.width =
                subjectCompletionRate + "%";
        }

    }

    if(chapterProgressText){
        chapterProgressText.textContent =
            summary.overallSubjectProgress + "%";
    }

    if(chapterProgressBar){
        chapterProgressBar.style.width =
            summary.overallSubjectProgress + "%";
    }

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
function getSubjectRenderOrder(){

    return subjects

        .map((subject,index)=>({subject,index}))

        .sort((a,b)=>{

            const aCompleted = isSubjectCompleted(a.subject);
            const bCompleted = isSubjectCompleted(b.subject);

            if(aCompleted === bCompleted){

                return 0;

            }

            return aCompleted ? 1 : -1;

        });

}

function buildSubjectCardsHtml(order){

    let html = "";

    order.forEach(({subject,index})=>{

        const progress=Math.round(
            (subject.completed/subject.total)*100
        );

        const completed = isSubjectCompleted(subject);

        const badgeHtml = completed
            ? `<span class="subjectBadge completed">✓ Completed</span>`
            : `<span class="subjectBadge ${subject.difficulty.toLowerCase()}">${subject.difficulty}</span>`;

        const addChapterHtml = completed
            ? `<button class="editSubject" disabled>+ Chapter</button>`
            : `<button class="editSubject" onclick="increaseChapter(${index})">+ Chapter</button>`;

        html += `

        <div class="subjectCard ${completed ? "completed" : ""}" data-subject-key="${index}">

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

                ${badgeHtml}

            </div>

            <div class="subjectRight">

                ${addChapterHtml}

                <button
                class="deleteSubject"
                onclick="deleteSubject(${index})">

                Delete

                </button>

            </div>

        </div>

        `;

    });

    return html;

}

function renderSubjectCards(container, order){

    container.innerHTML = buildSubjectCardsHtml(order);

}

function animateSubjectReorder(container, order){

    const existingCards =
        container.querySelectorAll(".subjectCard");

    // Only animate a pure reorder (same number of cards).
    // Add/delete fall back to the plain instant render,
    // exactly as before.
    if(existingCards.length !== order.length){

        renderSubjectCards(container, order);
        return;

    }

    const firstRects = {};

    existingCards.forEach(card=>{

        const key = card.getAttribute("data-subject-key");

        firstRects[key] = card.getBoundingClientRect();

    });

    renderSubjectCards(container, order);

    const newCards =
        container.querySelectorAll(".subjectCard");

    newCards.forEach(card=>{

        const key = card.getAttribute("data-subject-key");

        const first = firstRects[key];

        if(!first){
            return;
        }

        const last = card.getBoundingClientRect();

        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;

        if(deltaX === 0 && deltaY === 0){
            return;
        }

        card.style.transition = "none";
        card.style.transform =
            `translate(${deltaX}px, ${deltaY}px)`;

        requestAnimationFrame(()=>{

            card.style.transition = "transform 380ms ease";
            card.style.transform = "translate(0,0)";

        });

    });

}

function playSettleAnimation(container, index){

    const card = container.querySelector(
        `.subjectCard[data-subject-key="${index}"]`
    );

    if(!card){
        return;
    }

    card.classList.add("settling");

    // force a reflow so the browser registers the
    // "settling" (pre-completion) look before we
    // remove it, guaranteeing the transition plays
    void card.offsetHeight;

    requestAnimationFrame(()=>{

        requestAnimationFrame(()=>{

            card.classList.remove("settling");

        });

    });

}

function renderSubjects(){

    const container = document.getElementById("allSubjects");

    if(!container) return;

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

    animateSubjectReorder(container, getSubjectRenderOrder());

}
function increaseChapter(index){

    if(subjects[index].completed >= subjects[index].total){

        return;

    }

    const previousOrder = getSubjectRenderOrder();

    const wasCompleted = isSubjectCompleted(subjects[index]);

    subjects[index].completed++;

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

    updateSubjectStats();

    const nowCompleted = isSubjectCompleted(subjects[index]);

    const container = document.getElementById("allSubjects");

    const justCompleted = !wasCompleted && nowCompleted;

    if(justCompleted && container){

        // Phase A: update this card in place (same slot),
        // then let it settle visually before reordering.
        renderSubjectCards(container, previousOrder);

        playSettleAnimation(container, index);

        setTimeout(()=>{

            renderSubjects();

        }, 380);

        return;

    }

    renderSubjects();

}
function deleteSubject(index){

    const container = document.getElementById("allSubjects");

    const subjectRef = subjects[index];

    const card = container
        ? container.querySelector(`.subjectCard[data-subject-key="${index}"]`)
        : null;

    const finishDelete = () => {

        const currentIndex = subjects.indexOf(subjectRef);

        if(currentIndex === -1){
            return;
        }

        subjects.splice(currentIndex,1);

        localStorage.setItem(
            "subjects",
            JSON.stringify(subjects)
        );

        renderSubjects();
        updateSubjectStats();

    };

    if(!card){

        finishDelete();
        return;

    }

    card.classList.add("removing");

    setTimeout(finishDelete, 350);

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

    const currentUser = JSON.parse(

    sessionStorage.getItem("currentUser")

);

let allSettings = JSON.parse(

    localStorage.getItem("allSettings")

) || {};

allSettings[currentUser.email] = settings;

localStorage.setItem(

    "allSettings",

    JSON.stringify(allSettings)

);

    alert("Preferences saved successfully!");

}



// =============================
// LOAD SETTINGS
// =============================

function loadSettings(){

    const currentUser = JSON.parse(

        sessionStorage.getItem("currentUser")

    );

    const allSettings = JSON.parse(

        localStorage.getItem("allSettings")

    ) || {};

    const settings =

        allSettings[currentUser.email];

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
// SMART STUDY SCHEDULER
// (single reusable source of truth —
// Dashboard, Planner and Analytics will
// all read from buildStudyPlan())
// ======================================

function getDaysRemaining(dateString){

const today=new Date();
today.setHours(0,0,0,0);

const target=new Date(dateString);
target.setHours(0,0,0,0);

return Math.round(
(target-today)/(1000*60*60*24)
);

}

function getDeadlineScore(dateString){

const diffDays=getDaysRemaining(dateString);

if(diffDays<0){
return 150;
}

if(diffDays===0){
return 100;
}

if(diffDays===1){
return 90;
}

if(diffDays===2){
return 80;
}

if(diffDays<=5){
return 60;
}

if(diffDays<=10){
return 40;
}

if(diffDays<=20){
return 20;
}

return 5;

}

function isSubjectCompleted(subject){

return subject.total>0 && subject.completed>=subject.total;

}

function buildStudyPlan(){

const plan=[];

const today=new Date();
today.setHours(0,0,0,0);

// ---------- TASKS ----------

tasks.forEach(task=>{

if(task.completed){

return;

}

const deadlineScore=
getDeadlineScore(task.date);

let priorityBonus=10;

if(task.priority==="High"){

priorityBonus=30;

}

else if(task.priority==="Medium"){

priorityBonus=20;

}

const estimatedHours=

(task.estimatedHours && task.estimatedHours>0)

?task.estimatedHours

:1;

// workload is a small, secondary factor —
// capped so it can never outweigh a deadline tier
const workloadScore=
Math.min(estimatedHours*2,10);

const score=

(deadlineScore+priorityBonus)+workloadScore;

plan.push({

type:"task",

title:task.title,

score:Math.round(score),

deadline:task.date,

daysRemaining:getDaysRemaining(task.date),

estimatedHours,

completed:false,

priority:task.priority

});

});

// ---------- SUBJECTS ----------

subjects.forEach(subject=>{

const remaining=

subject.total-subject.completed;

if(remaining<=0){

return;

}

const deadlineScore=

getDeadlineScore(subject.exam);

let difficultyMultiplier=1.0;

if(subject.difficulty==="Medium"){

difficultyMultiplier=1.2;

}

else if(subject.difficulty==="Hard"){

difficultyMultiplier=1.5;

}

// workload is a small, secondary factor —
// capped so a huge subject can never
// outweigh a near-term deadline
const workloadScore=

Math.min(remaining*0.5,10);

const score=

(deadlineScore*difficultyMultiplier)+workloadScore;

const examDate=new Date(subject.exam);
examDate.setHours(0,0,0,0);

let daysLeft=Math.round(

(examDate-today)/(1000*60*60*24)

);

if(daysLeft<1){

daysLeft=1;

}

const chaptersToday=

Math.max(

1,

Math.ceil(remaining/daysLeft)

);

const estimatedHours=

+((chaptersToday*45)/60).toFixed(1);

plan.push({

type:"subject",

title:subject.name,

score:Math.round(score),

deadline:subject.exam,

daysRemaining:getDaysRemaining(subject.exam),

estimatedHours,

completed:false,

difficulty:subject.difficulty,

remainingChapters:remaining,

completedChapters:subject.completed,

totalChapters:subject.total,

chaptersToday

});

});

// ---------- STABLE SORT ----------
// 1. higher score first
// 2. earlier deadline first
// 3. tasks before subjects
// 4. alphabetical title

plan.sort((a,b)=>{

if(b.score!==a.score){

return b.score-a.score;

}

const deadlineDiff=

new Date(a.deadline)-new Date(b.deadline);

if(deadlineDiff!==0){

return deadlineDiff;

}

if(a.type!==b.type){

return a.type==="task" ? -1 : 1;

}

return a.title.localeCompare(b.title);

});

// ---------- SUMMARY ----------

const completedTasks=

tasks.filter(t=>t.completed).length;

const completedSubjects=

subjects.filter(isSubjectCompleted).length;

const completedChapters=

subjects.reduce(

(sum,s)=>sum+s.completed,0

);

const totalChapters=

subjects.reduce(

(sum,s)=>sum+s.total,0

);

const totalEstimatedHours=

+plan.reduce(

(sum,item)=>sum+item.estimatedHours,0

).toFixed(1);

const upcomingDeadlinesCount=

plan.filter(

item=>item.daysRemaining<=7

).length;

const summary={

totalTasks:tasks.length,

completedTasks,

pendingTasks:tasks.length-completedTasks,

totalSubjects:subjects.length,

completedSubjects,

activeSubjects:subjects.length-completedSubjects,

completedChapters,

totalChapters,

overallTaskProgress:

tasks.length>0

?Math.round((completedTasks/tasks.length)*100)

:0,

overallSubjectProgress:

totalChapters>0

?Math.round((completedChapters/totalChapters)*100)

:0,

overallProgress:

(tasks.length+totalChapters)>0

?Math.round(

((completedTasks+completedChapters)/

(tasks.length+totalChapters))*100

)

:0,

totalEstimatedHours,

recommendedStudySessions:plan.length,

upcomingDeadlinesCount

};

return {

plan,

summary

};

}

// ======================================
// SMART STUDY SCHEDULER — RENDER
// (display only, reads buildStudyPlan())
// ======================================

const generatePlanBtn =
document.getElementById("generatePlan");

if(generatePlanBtn){

generatePlanBtn.onclick =
renderStudyPlan;

}

function renderStudyPlan(){

const container =
document.getElementById("studyPlan");

if(!container) return;

container.innerHTML="";

if(tasks.length===0 && subjects.length===0){

container.innerHTML=`

<div class="empty">

📚

<p>No tasks or subjects found.</p>

</div>

`;

return;

}

const {plan}=buildStudyPlan();

if(plan.length===0){

container.innerHTML=`

<div class="empty">

🎉

<p>Everything is completed.</p>

</div>

`;

return;

}

plan.forEach(item=>{

const goalLine=

item.type==="subject"

?`Today's Goal: <strong>${item.chaptersToday} chapter(s)</strong>`

:`Due: <strong>${item.deadline}</strong>`;

container.innerHTML+=`

<div class="planCard">

<h3>

${item.type==="subject" ? "📖" : "📝"} ${item.title}

</h3>

<p class="planInfo">

${goalLine}

</p>

<div class="planHours">

⏳

${item.estimatedHours}

hours recommended

</div>

</div>

`;

});

}
// ======================================
// DASHBOARD (SCHEDULER-DRIVEN)
// All dashboard sections read directly
// from buildStudyPlan()'s {plan, summary}.
// No statistic is recalculated here.
// ======================================

function renderDashboardSummary(summary){

    const tasksCompletedEl =
        document.getElementById("dashTasksCompleted");

    const tasksPendingEl =
        document.getElementById("dashTasksPending");

    const subjectsCompletedEl =
        document.getElementById("dashSubjectsCompleted");

    const activeSubjectsEl =
        document.getElementById("dashActiveSubjects");

    const completedChaptersEl =
        document.getElementById("dashCompletedChapters");

    const totalChaptersEl =
        document.getElementById("dashTotalChapters");

    if(!tasksCompletedEl){
        return;
    }

    tasksCompletedEl.textContent = summary.completedTasks;
    tasksPendingEl.textContent = summary.pendingTasks;
    subjectsCompletedEl.textContent = summary.completedSubjects;
    activeSubjectsEl.textContent = summary.activeSubjects;
    completedChaptersEl.textContent = summary.completedChapters;
    totalChaptersEl.textContent = summary.totalChapters;

    const upcomingCountEl =
        document.getElementById("dashUpcomingCount");

    if(upcomingCountEl){
        upcomingCountEl.textContent = summary.upcomingDeadlinesCount;
    }

}

function formatDueLabel(daysRemaining){

    if(daysRemaining < 0){
        return "Overdue";
    }

    if(daysRemaining === 0){
        return "Due Today";
    }

    if(daysRemaining === 1){
        return "Due Tomorrow";
    }

    return `Due in ${daysRemaining} days`;

}

function formatHoursLabel(estimatedHours){

    return `${estimatedHours} ${estimatedHours === 1 ? "Hour" : "Hours"}`;

}

function formatPriorityLabel(priority){

    if(priority === "High"){
        return "🔥 High Priority";
    }

    if(priority === "Medium"){
        return "🟡 Medium Priority";
    }

    return "🟢 Low Priority";

}

function renderDashboardStudyPlan(plan){

    const container =
        document.getElementById("task-list");

    if(!container){
        return;
    }

    container.innerHTML = "";

    if(plan.length === 0){

        container.innerHTML = `

<div class="empty">

🎉

<p>Everything is completed.</p>

</div>

`;

        return;

    }

    plan.slice(0,3).forEach((item,i)=>{

        if(item.type === "task"){

            container.innerHTML += `

<div class="planCard">

<label class="planCheckbox">

<input type="checkbox" onclick="handleDashboardCheckboxClick(${i}, this)">

<span class="taskTitle">${item.title}</span>

</label>

<p class="planInfo">📅 ${formatDueLabel(item.daysRemaining)}</p>

<p class="planInfo">⏱ ${formatHoursLabel(item.estimatedHours)}</p>

<p class="planInfo">${formatPriorityLabel(item.priority)}</p>

</div>

`;

            return;

        }

        // Subjects stay read-only, compact format

        container.innerHTML += `

<div class="planCard">

<h3>

📚 ${item.title}

</h3>

<p class="planInfo">Today's Goal: <strong>${item.chaptersToday} chapter(s)</strong></p>

<p class="planInfo">⏱ ${formatHoursLabel(item.estimatedHours)}</p>

</div>

`;

    });

}

function handleDashboardCheckboxClick(planIndex, checkboxEl){

    const card = checkboxEl.closest(".planCard");

    if(card){
        card.classList.add("completing");
    }

    setTimeout(()=>{

        completeDashboardTask(planIndex);

    }, 300);

}

function completeDashboardTask(planIndex){

    const {plan} = buildStudyPlan();

    const item = plan[planIndex];

    if(!item || item.type !== "task"){
        return;
    }

    const taskIndex = tasks.findIndex(
        t => !t.completed &&
        t.title === item.title &&
        t.date === item.deadline
    );

    if(taskIndex === -1){
        return;
    }

    tasks[taskIndex].completed = true;

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    renderDashboard();

}

function getWorkloadLevel(summary, plan){

    const highPriorityCount =
        plan.filter(
            item => item.type === "task" && item.priority === "High"
        ).length;

    if(summary.totalEstimatedHours <= 2 && highPriorityCount === 0){

        return {emoji:"🟢", label:"Light"};

    }

    if(summary.totalEstimatedHours <= 5 && highPriorityCount <= 2){

        return {emoji:"🟡", label:"Moderate"};

    }

    return {emoji:"🔴", label:"Heavy"};

}

function getPreferredStudyTime(){

    const currentUser = JSON.parse(
        sessionStorage.getItem("currentUser")
    );

    if(!currentUser){
        return "Morning";
    }

    const allSettings = JSON.parse(
        localStorage.getItem("allSettings")
    ) || {};

    const settings = allSettings[currentUser.email];

    return (settings && settings.studyTime) || "Morning";

}

function getStudyWindowLabel(studyTime){

    const windows = {

        Morning:"8:00 AM – 11:00 AM",

        Afternoon:"12:00 PM – 3:00 PM",

        Evening:"6:00 PM – 9:00 PM",

        Night:"9:00 PM – 12:00 AM"

    };

    return windows[studyTime] || windows.Morning;

}

function renderDashboardWorkload(summary, plan){

    const hoursEl =
        document.getElementById("dashTotalHours");

    const sessionsEl =
        document.getElementById("dashSessions");

    const levelEl =
        document.getElementById("workloadLevel");

    const windowEl =
        document.getElementById("preferredWindow");

    if(!hoursEl || !sessionsEl){
        return;
    }

    hoursEl.textContent = summary.totalEstimatedHours;
    sessionsEl.textContent = summary.recommendedStudySessions;

    if(levelEl){

        const level = getWorkloadLevel(summary, plan);

        levelEl.textContent =
            `${level.emoji} ${level.label} Workload`;

    }

    if(windowEl){

        const studyTime = getPreferredStudyTime();

        windowEl.innerHTML =
            `${studyTime}<br>${getStudyWindowLabel(studyTime)}`;

    }

}

function renderDashboardDeadlines(plan){

    const container =
        document.getElementById("deadline-list");

    if(!container){
        return;
    }

    container.innerHTML = "";

    const upcoming =
        [...plan]
        .sort((a,b)=>a.daysRemaining-b.daysRemaining)
        .slice(0,5);

    if(upcoming.length === 0){

        container.innerHTML = `

<div class="empty">

🎉

<p>No upcoming deadlines.</p>

</div>

`;

        return;

    }

    upcoming.forEach(item=>{

        let daysLabel;

        if(item.daysRemaining < 0){

            daysLabel = "Overdue";

        }

        else if(item.daysRemaining === 0){

            daysLabel = "Today";

        }

        else{

            daysLabel = `${item.daysRemaining} day(s) left`;

        }

        container.innerHTML += `

<div class="deadline">

<strong>${item.type === "subject" ? "📖" : "📝"} ${item.title}</strong>

<p>${daysLabel}</p>

</div>

`;

    });

}

function renderDashboardFocus(plan){

    const container =
        document.getElementById("focusCardBody");

    if(!container){
        return;
    }

    if(plan.length === 0){

        container.innerHTML = `

<div class="empty">

🎉

<p>Nothing left for today.</p>

</div>

`;

        return;

    }

    const item = plan[0];

    const goalLine =
        item.type === "subject"
        ? `<p class="planInfo">Today's Chapter Goal: <strong>${item.chaptersToday} chapter(s)</strong></p>`
        : "";

    container.innerHTML = `

<h3>

${item.type === "subject" ? "📖" : "📝"} ${item.title}

</h3>

<p class="planInfo">

Type: <strong>${item.type === "subject" ? "Subject" : "Task"}</strong>

</p>

<p class="planInfo">

Deadline: <strong>${item.deadline}</strong>

</p>

<p class="planInfo">

Priority Score: <strong>${item.score}</strong>

</p>

${goalLine}

<div class="planHours">

⏳

${item.estimatedHours}

hours recommended

</div>

`;

}

function buildDashboardInsights(plan, summary){

    const insights = [];

    const upcomingCount =
        plan.filter(
            item => item.daysRemaining >= 0 && item.daysRemaining <= 7
        ).length;

    if(upcomingCount > 0){

        insights.push(
            `You have ${upcomingCount} deadline(s) this week.`
        );

    }

    const topSubject =
        plan.find(item => item.type === "subject");

    if(topSubject){

        insights.push(
            `${topSubject.title} requires the most attention.`
        );

    }

    if(summary.totalChapters > 0){

        insights.push(
            `${summary.overallSubjectProgress}% of your chapters are completed.`
        );

    }

    if(summary.totalTasks > 0){

        insights.push(
            `You have completed ${summary.completedTasks} of ${summary.totalTasks} tasks.`
        );

    }

    const level = getWorkloadLevel(summary, plan);

    insights.push(
        `Today's workload is ${level.label.toLowerCase()}.`
    );

    return insights;

}

function renderDashboardInsights(plan, summary){

    const container =
        document.getElementById("insightsList");

    if(!container){
        return;
    }

    container.innerHTML = "";

    const insights = buildDashboardInsights(plan, summary);

    insights.forEach(insight=>{

        container.innerHTML += `<p class="planInfo">• ${insight}</p>`;

    });

}

function getRecentlyCompleted(){

    const completedTasks =
        tasks
        .filter(t => t.completed)
        .map(t => ({title:t.title, type:"task"}));

    const completedSubjects =
        subjects
        .filter(isSubjectCompleted)
        .map(s => ({title:s.name, type:"subject"}));

    return [...completedTasks, ...completedSubjects]
        .reverse()
        .slice(0,5);

}

function renderDashboardRecentlyCompleted(){

    const container =
        document.getElementById("recentCompletedList");

    if(!container){
        return;
    }

    container.innerHTML = "";

    const recent = getRecentlyCompleted();

    if(recent.length === 0){

        container.innerHTML = `

<div class="empty">

📭

<p>Nothing completed yet.</p>

</div>

`;

        return;

    }

    recent.forEach(item=>{

        container.innerHTML += `

<div class="deadline">

<strong>✓ ${item.title}</strong>

<p>${item.type === "subject" ? "Subject" : "Task"}</p>

</div>

`;

    });

}

function buildQuickStatus(plan, summary){

    if(plan.length === 0){

        return "Everything for today is completed. Great job!";

    }

    const soonSubject =
        plan.find(
            item => item.type === "subject" && item.daysRemaining <= 2
        );

    if(soonSubject){

        const when =
            soonSubject.daysRemaining <= 0
            ? "today"
            : `in ${soonSubject.daysRemaining} day(s)`;

        return `You have an exam ${when}. Focus on ${soonSubject.title}.`;

    }

    if(summary.totalEstimatedHours >= 5){

        return `Busy day ahead: approximately ${summary.totalEstimatedHours} study hours.`;

    }

    const remainingTasks =
        plan.filter(item => item.type === "task").length;

    if(remainingTasks > 0){

        return `Great progress! Only ${remainingTasks} task(s) remain today.`;

    }

    return "You're on track for today.";

}

function renderDashboardQuickStatus(plan, summary){

    const container =
        document.getElementById("quickStatus");

    if(!container){
        return;
    }

    container.textContent = buildQuickStatus(plan, summary);

}

function renderDashboard(){

    const {plan, summary} = buildStudyPlan();

    updateProgress();

    renderDashboardSummary(summary);
    renderDashboardStudyPlan(plan);
    renderDashboardWorkload(summary, plan);
    renderDashboardDeadlines(plan);
    renderDashboardFocus(plan);
    renderDashboardInsights(plan, summary);
    renderDashboardRecentlyCompleted();
    renderDashboardQuickStatus(plan, summary);

}

renderDashboard();

// ===============================
// LOGOUT
// ===============================

function logout(){

    sessionStorage.removeItem("loggedIn");

    sessionStorage.removeItem("currentUser");

    window.location.href="../index.html";

}