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
let lastId = 2;
let todoList = [
    new TodoItem('First task', '', now, true, 1),
    // new TodoItem(2, 'Second task', null, now),
    new TodoItem('Third task', 'Very important task, you must do it because you will be fired, this is simple task for you', new Date("2021-04-01"), false, 2),
    // new TodoItem(4, 'Fourth task', 'Go to holy guys, ask them to fix a mouse'),
]

function convertInputDate (form) {
    let inputDate = new Date(form.dueDate);
    form.dueDate = inputDate;
    return form;
}
let deleteElement = (event) => {
    const deleteButton = event.target;
    if (deleteButton.tagName === 'SPAN') {
        let task = deleteButton.closest('.task')
        let todoItem = todoList.find(item => task.id == item.id);
        let index = todoList.indexOf(todoItem);
        todoList.splice(index, 1);
        task.remove();
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
    // console.log(task);
    pageOutput(task);
    taskForm.reset();
});

function pageOutput(item) {
    let taskList = listElement.querySelector('.task_list');
    taskList.innerHTML += todoItemOutput(item);
}

function todoItemOutput(item) {
    const { id, title, description, dueDate, done } = item;

    let correctFormatDate = dueDate ? `(${monthNames[dueDate.getMonth()]} ${dueDate.getDate()})` : '';
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