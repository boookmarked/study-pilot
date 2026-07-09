// ===============================
// GREETING
// ===============================

const greeting = document.getElementById("greeting");

if(greeting){

    const hour = new Date().getHours();

    if(hour < 12){
        greeting.textContent = "Good Morning 🌿";
    }
    else if(hour < 17){
        greeting.textContent = "Good Afternoon 🌿";
    }
    else{
        greeting.textContent = "Good Evening 🌿";
    }

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

const addButton=document.getElementById("addTask");

if(addButton){

const renderTasks=()=>{

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

location.reload();

}
function toggleTask(index){

tasks[index].completed = !tasks[index].completed;

localStorage.setItem(

"tasks",

JSON.stringify(tasks)

);

location.reload();

}