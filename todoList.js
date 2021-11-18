"use strict";

let tasksEndpoint = "https://localhost:5001/api/lists/6/tasks?all=true";

class TodoItem {
    constructor(id, title, description, dueDate, done) {
        if (typeof id === 'object') {
            convertInputDate(id);
            Object.assign(this, id);
        } else {
            this.id = id;
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.done = done;
        }
    }
}
const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sept", "Oct",
    "Nov", "Dec"
];

const listElement = document.getElementById('tasks');
const taskForm = document.forms['task'];

var now = new Date();
// let lastId = 2;
// let todoList = [
//     new TodoItem(1, 'First task', '', now, true),
//     new TodoItem(2, 'Third task', 'Very important task, you must do it because you will be fired, this is simple task for you', new Date("2021-04-01"), false),
// ]

function convertInputDate (taskItem) {
    taskItem.dueDate = taskItem.dueDate ? new Date(taskItem.dueDate) : null;
    return taskItem;
}

let deleteElement = (event) => {
    const deleteButton = event.target;
    if (deleteButton.tagName === 'SPAN') {
        let taskNode = deleteButton.closest('.task')
        let index = todoList.findIndex(item => task.id == item.id);
        todoList.splice(index, 1);
        taskNode.remove();
    }
};

let setOption = (event) => {
    const button = event.target;
    if (button.tagName === 'BUTTON' && button.id === 'button_for_task') {
        let tasks = button.closest('#tasks');
        if (tasks.classList.contains('hide')) {
            tasks.classList.remove('hide');
            button.innerHTML = 'Get Actual Tasks';
        } else {
            tasks.classList.add('hide');
            button.innerHTML = 'Get All Tasks';
        }
    }
};

let makeItemDone = (event) => {
    let checkbox = event.target;
    if (checkbox.tagName === 'INPUT' && checkbox.type === 'checkbox') {
        let taskNode = checkbox.closest('.task');
        taskNode.classList.toggle('completed_task', checkbox.checked)
        const task = todoList.find(item => taskNode.id == item.id);
        task.done = checkbox.checked;
        console.log(task.done)
    }
};

function pageOutput(item) {
    let task = new TodoItem(item);
    let taskList = listElement.querySelector('.task_list');
    taskList.innerHTML += todoItemOutput(task);
}
function checkDateOutput (value){
    return value < 10 ? '0' + value : value;
}

function todoItemOutput(item) {
    const { id, title, description, dueDate, done } = item;

    let correctFormatDate = dueDate ? `${checkDateOutput(dueDate.getMonth())}.${checkDateOutput(dueDate.getDate())}` : '';
    let doneCheck = done ? 'checked' : '';
    let doneTask = done ? ' completed_task' : '';
    let overdueDate = dueDate < now ? ' overdue_date' : '';
    let descriptionNotNull = description != null ? description : '';

    let output = `
    <div id="${id}" class="task${doneTask}">
        <p>
            <input type="checkbox" name="itemCheckbox" ${doneCheck}> 
            <em class="task_status">${title}</em>
            <em class="date${overdueDate}">${correctFormatDate}</em>
        </p>
        <p class="task_description">${descriptionNotNull}</p>
        <span></span>
    </div>`;
    return output;
}

todoList.forEach(pageOutput);

listElement.addEventListener('click', deleteElement);
listElement.addEventListener('click', makeItemDone);
listElement.addEventListener('click', setOption);
taskForm.addEventListener('submit', (event) => {
    ++lastId;
    event.preventDefault();
    const formData = new FormData(taskForm);
    const task = new TodoItem(Object.fromEntries(formData.entries()));
    task.id = lastId;
    todoList.push(task);
    pageOutput(task);
    taskForm.reset();
});

fetch(tasksEndpoint)
    .then(response => response.json())
    .then(tasks => tasks.forEach(pageOutput));