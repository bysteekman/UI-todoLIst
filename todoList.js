"use strict";

class TodoItem {
    constructor(titleOrObject, description, dueDate, done, id) {
        if (typeof titleOrObject === 'object') {
            convertInputDate(titleOrObject);
            Object.assign(this, titleOrObject);
        } else {
            this.title = titleOrObject;
            this.description = description;
            this.dueDate = dueDate;
            this.done = done;
            this.id = id;
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
let lastId = 1;
let todoList = [
    new TodoItem('First task', '', now, false, 1),
    // new TodoItem(2, 'Second task', null, now),
    // new TodoItem(3, 'Third task', 'Very important task, you must do it because you will be fired, this is simple task for you', new Date("2021-04-01")),
    // new TodoItem(4, 'Fourth task', 'Go to holy guys, ask them to fix a mouse'),
]

function convertInputDate (form) {
    let inputDate = new Date(form.dueDate);
    if (inputDate.getFullYear() < now.getFullYear()) {
        inputDate.setFullYear(now.getFullYear());
    }
    form.dueDate = inputDate;
    return form;
}
let deleteElement = (event) => {
    const deleteButton = event.target;
    if (deleteButton.tagName === 'SPAN') {
        let taskElement = document.getElementById(deleteButton.dataset.id);
        // звернути увагу на елемент таск
        let index = todoList.indexOf(taskElement);
        todoList.splice(index, 1);
        taskElement.remove();
    }
};

function displayDiv(value) {
    let divElements = listElement.querySelectorAll('.completed_div');
    for (let i = 0; i < divElements.length; i++) {
        // console.log(divElements[i]);
        divElements[i].setAttribute('style', `display: ${value};`);
    }
};

let setOption = (event) => {
    const view = event.target;
    if (view.tagName === 'INPUT' && view.type === 'radio') {
        if (view.id === 'all_tasks') {
            displayDiv('flex');
        } else {
            displayDiv('none');
        }
    }
};

let makeItemDone = (event) => {
    let checkbox = event.target;
    if (checkbox.tagName === 'INPUT' && checkbox.type === 'checkbox') {
        let taskNode = checkbox.closest('.task');
        taskNode.classList.toggle('completed_div', checkbox.checked)
        if (checkbox.checked) {
            if (document.getElementById('not_completed').checked) {
                taskNode.setAttribute('style', 'display: none;');
            }
        }
        const task = todoList.find(item => checkbox.id == item.id);
        task.done = checkbox.checked;
        console.log(task);
    }
};

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
    console.log(task)
    pageOutput(task);
    taskForm.reset();
});

function pageOutput(item) {
    listElement.innerHTML += todoItemOutput(item);
}

function todoItemOutput(item) {
    const { id, title, description, dueDate, done } = item;

    let correctFormatDate = dueDate ? `(${monthNames[dueDate.getMonth()]} ${dueDate.getDate()})` : '';
    let doneCheck = done ? 'checked' : '';
    let doneTask = done ? 'completed_task' : '';
    let invalidDate = dueDate < now ? ' invalid_date' : '';
    let descriptionNotNull = description != null ? description : '';
    let completedTask = done ? 'style="display: none;"' : '';

    let output = `
    <div id="task_${id}" class="task ${doneTask}" ${completedTask}>
        <p>
            <input type="checkbox" id="${id}" name="itemCheckbox" ${doneCheck}> 
            <em class="task_status">${title}</em>
            <em class="date${invalidDate}">${correctFormatDate}</em>
        </p>
        <p class="task_description">${descriptionNotNull}</p>
        <span data-id="task_${id}"></span>
    </div>`;
    return output;
}

todoList.forEach(pageOutput);