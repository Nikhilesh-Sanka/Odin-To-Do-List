import "./styles.css";

//Global Variables//
let projects=[];
let currentProject;
let taskBeingEdited;
let DOMObjects={
    display:document.querySelector("#display"),
    addProjectBtn:document.querySelector("#add-projects-btn"),
    sidebar:document.querySelector("#project-name-section"),
    taskDisplay:document.querySelector('.project-task-display')
}
//Global Variables//


//Objects//
class Project {
    constructor(name){
        this.name=name;
        this.tasks=[];
        this.processedName=processName(name);
    }
}

class Task {
    constructor(name,date,description,priority){
        this.name=name;
        this.date=date;
        this.description=description;
        this.processedName=processName(name);
        this.isCompleted="no";
        this.priority=priority;
    }
}
//Objects//


//DOM Manipulation//

//Project related manipulation//
const showProjectForm = () => {
    console.log("clicked");
    DOMObjects.display.innerHTML=  `<form id="project-form" method="POST" action="">
                                        <label for="project-name-input">Project Name:</label>
                                        <input type="text" name="project-name-input" id="project-name-input">
                                        <button>Submit</button>
                                    </form>`;
    document.querySelector("#project-form button").addEventListener("click",validateInputAndAddProject);
}
const validateInputAndAddProject = (event) => {
    event.preventDefault();
    let input=document.querySelector("#project-name-input").value;
    if(input!==""){
        if(projects.every((project)=>project.name!==processName(input))){
            addProject(input);
            DOMObjects.display.innerHTML="";
        }
        else{
            alert(`${input} already exists`);
        }
    }
    else{
        DOMObjects.display.innerHTML="";
    }
}
const addProjectToSidebar = (project) => {
    const btn = document.createElement("button");
    let span=document.createElement("span");
    btn.id="btn"+project.processedName;
    btn.innerText=`${project.name}`;
    span.innerText="x";
    btn.appendChild(span);
    DOMObjects.sidebar.appendChild(btn);
    document.querySelector(`#btn${project.processedName}`).addEventListener("click",openProject(project));
    document.querySelector(`#btn${project.processedName} span`).addEventListener("dblclick",deleteProject);
}
const openProject = (project) => {
    return function () {
        arrangeTasksBasedOnPriority(project);
        document.querySelector(`#btn${project.processedName}`).style.color="white";
        document.querySelector(`#btn${project.processedName}`).style.backgroundColor="grey";
        if(currentProject!==undefined&&currentProject!==project){
            document.querySelector(`#btn${currentProject.processedName}`).style.color="black";
            document.querySelector(`#btn${currentProject.processedName}`).style.backgroundColor="antiquewhite";
        }
        currentProject=project;
        display.innerHTML= `<h2>${project.name.toUpperCase()} TASKS</h2>
                            <button id="${project.processedName}-task-add-btn" class="task-add-btn">Add Task</button>
                            <div id="${project.processedName}" class="project-task-display">
                            </div>`
        for(let task of project.tasks){
            document.querySelector(`#${project.processedName}`).innerHTML+=`<div class="task" id="task${task.processedName}">
                                                                                <h3>${task.name}</h3>
                                                                                <p class="date">${task.date}</p>
                                                                                <p class="description">${task.description}</p>
                                                                                <button class="check-box ${isTaskCompleted(task)}"></button>
                                                                                <button class="edit">edit</button>
                                                                                <button class="delete">delete</button>
               
                                                                             </div>`
        }
        for(let task of project.tasks){
            styleTaskBasedOnPriority(task.processedName,task.priority);
        }
        document.querySelector(`#${project.processedName}-task-add-btn`).addEventListener("click", showTaskForm);
        document.querySelectorAll(".delete").forEach((deleteBtn) => {
            deleteBtn.addEventListener("click",removeTask);
        }) 
        document.querySelectorAll(".check-box").forEach((checkBox) => {
            checkBox.addEventListener("click",getTaskAndChangeStatus);
        })
        document.querySelectorAll(".edit").forEach((editBtn) => {
            editBtn.addEventListener("click",showTaskForm);
        })
    }
}
//Project Related Manipulation//
/*****************************************/
//Task Related Manipulation//
const showTaskForm = (event) => {
    DOMObjects.display.innerHTML =   `<form id="task-form" method="POST" action="">
                                        <label for="task-name-input">Task Name:</label>
                                        <input type="text" id="task-name-input" name="task-name-input">
                                        <label for="task-date-input">Task Due Date</label>
                                        <input type="date" id="task-date-input" name="task-date-input">
                                        <label for="task-description-input">Task Description:</label>
                                        <textarea id="task-description-input" cols="50" rows="10"></textarea>
                                        <label for="task-priority">Task Priority:</label>
                                        <select id="task-priority">
                                            <option value="high">high</option>
                                            <option value="medium">medium</option>
                                            <option value="low">low</option>
                                        </select>
                                        <button type="submit" id="task-form-submit">Submit</button>
                                        <button type="button" id="task-form-close">Close</button>
                                    </form>`;
    let nameDOM=document.querySelector("#task-name-input")
    let dateDOM=document.querySelector("#task-date-input");
    let descriptionDOM=document.querySelector("#task-description-input");
    let taskPriorityDOM=document.querySelector(`#task-priority`);
    if(event.target.innerText!=="edit"){
        document.querySelector("#task-form-submit").addEventListener("click",addTask);
    }
    else{
        taskBeingEdited=event.target.parentNode.id.slice(4,);
        currentTask = currentProject.tasks.find((task) => task.processedName===taskBeingEdited);
        nameDOM.value=currentTask.name;
        dateDOM.value=currentTask.date;
        descriptionDOM.value=currentTask.description;
        document.querySelector("#task-form-submit").addEventListener("click",editTaskAndUpdateDOM(taskBeingEdited,nameDOM,dateDOM,descriptionDOM,taskPriorityDOM));
    }
    document.querySelector("#task-form-close").addEventListener("click",openProject(currentProject));
}

const removeTask = (event) => {
    let taskName=event.target.parentNode.id.slice(4,);
    deleteTask(taskName,currentProject);
    openProject(currentProject)();
    console.log(projects);
}
const editTaskAndUpdateDOM = (taskName,name,date,description,taskPriority) => {
    return function (event) {
        event.preventDefault();
        if(name.value!==""&&date.value!==""&description.value!==""){
            if(currentProject.tasks.every((task) => task.processedName!==processName(name.value))||taskName===processName(name.value)){
                editTask(taskName,name.value,date.value,description.value,taskPriority.value);
                openProject(currentProject)();
            }
            else{
                alert(`${name} already exists`);
            }
        }
        else{
            alert("enter valid details");
        }
    }
}
const styleTaskBasedOnPriority = (taskName,priority) => {
    let borderColor;
    switch (priority){
        case "high":
            borderColor="red";
            break;
        case "medium":
            borderColor="orange";
            break;
        case "low":
            borderColor="green";
            break;
    }
    document.querySelector(`#task${taskName}`).style.borderLeft=`5px solid ${borderColor}`;
}
//Task Related Manipulation//


//DOM Manipulation//


//Application Logic//
const addProject = (newProjectName) => {
    let newProject = new Project(newProjectName);
    projects.push(newProject);
    localStorage.setItem("projects",JSON.stringify(projects));
    addProjectToSidebar(newProject);
}
const processName = (name) => {
    for(let i=0;i<name.length;i++){
        if(name[i]!==" "){
            return name.slice(i,).split(" ").join("-");
        }
    }
}
const addTask = (event) => {
    let nameDOM=document.querySelector("#task-name-input");
    let dateDOM=document.querySelector("#task-date-input");
    let descriptionDOM=document.querySelector("#task-description-input");
    let taskPriorityDOM=document.querySelector("#task-priority");
    event.preventDefault();
    if(nameDOM.value!==""&&dateDOM.value!==""&&descriptionDOM.value!==""){
        if(currentProject.tasks.every((task) => task.processedName!==nameDOM.value)){
            currentProject.tasks.push(new Task(nameDOM.value,dateDOM.value,descriptionDOM.value,taskPriorityDOM.value));
            projects=projects.map((project) => {
                if(project.processedName===currentProject.processedName){
                    return currentProject;
                }
                else{
                    return project;
                }
            })
            localStorage.setItem("projects",JSON.stringify(projects));
            console.log(currentProject);
            openProject(currentProject)();
        }
        else{
            alert(`${nameDOM.value} Task already Exists`);
        }
    }
    else{
        alert("Please Enter Valid Properties");
    }
}
const deleteTask = (taskName,project) => {
    project.tasks=project.tasks.filter((task) => task.processedName!==taskName);
    projects=projects.map((proj) => {
        if(proj.processedName!==project.processedName){
            return proj;
        }
        else{
            return project;
        }
    });
    localStorage.setItem("projects",JSON.stringify(projects));
}
const isTaskCompleted = (task) => {
    if(task.isCompleted==="yes"){
        return "completed";
    }
    else{
        return "";
    }
}
const getTaskAndChangeStatus = (event) => {
    let taskName=event.target.parentNode.id.slice(4,);
    console.log(taskName);
    currentProject.tasks=currentProject.tasks.map((task) => {
        if(task.processedName===taskName){
            if(task.isCompleted==="yes"){
                task.isCompleted="no";
                return task;
            }
            else{
                task.isCompleted="yes";
                return task;
            }
        }
        else{
            return task;
        }
    })
    console.log(currentProject);
    projects=projects.map((project) => {
        if(project.ProcessedName===currentProject.processedName){
            return currentProject;
        }
        else{
            return project;
        }
    })
    console.log(projects);
    localStorage.setItem("projects",JSON.stringify(projects));
    event.target.classList.toggle("completed");
    console.log(event.target.classList);
    document.querySelectorAll(".completed").forEach((checkBox)=>{
        checkBox.computedStyleMap.backgroundColor="green";
    })
}
const editTask = (taskName,newNameValue,newDateValue,newDescriptionValue,newPriority) => {
    currentProject.tasks=currentProject.tasks.map((task) => {
        if(taskName===task.processedName){
            task.name=newNameValue;
            task.date=newDateValue;
            task.description=newDescriptionValue;
            task.priority=newPriority;
            return task;
        }
        else{
            return task;
        }
    });
    projects=projects.map((proj) => {
        if(proj.name===currentProject.name){
            return currentProject;
        }
        else{
            return proj;
        }
    })
    localStorage.setItem("projects",JSON.stringify(projects));
}
const deleteProject = (event) => {
    let projectName=event.target.parentNode.id.slice(3,);
    projects=projects.filter((project) => project.processedName!==projectName);
    localStorage.setItem("projects",JSON.stringify(projects));
    if(currentProject!==undefined){
        if(projectName===currentProject.processedName){
            DOMObjects.display.innerHTML="";
        }
    }
    DOMObjects.sidebar.innerHTML='';
    projects.forEach((project) => {
        addProjectToSidebar(project);
    })
    currentProject=undefined;
}
const arrangeTasksBasedOnPriority = (project) => {
    if(project.tasks.length!==0){
        let highTaskArray=project.tasks.filter((task) => task.priority==="high");
        let mediumTaskArray=project.tasks.filter((task) => task.priority==="medium");
        let lowTaskArray=project.tasks.filter((task) => task.priority==="low");
        project.tasks=[...highTaskArray,...mediumTaskArray,...lowTaskArray];
    }
}
//Application Logic//


//main.js//
window.onload=()=>{
    if(localStorage.getItem('projects')!==null){
        projects=JSON.parse(localStorage.getItem("projects"));
        projects.forEach((project) => {
            addProjectToSidebar(project);
        });
    }
}
DOMObjects.addProjectBtn.addEventListener("click",showProjectForm);
//main.js//
