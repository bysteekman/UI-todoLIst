"use strict";

const tasksEndpoint = "https://localhost:5001/api/lists/6/tasks";

const identity = (a) => a

let taskApi = {
    getAll() {
        return fetch(`${tasksEndpoint}?all=true`)
        .then(response => response.json())
    },
    createTask(task) {
        return fetch(tasksEndpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(res => res.json().then(res.ok ? identity : (err) => Promise.reject(err)))
    },
    deleteTask(id) {
        return fetch(`${tasksEndpoint}/${id}`, {
                method: 'DELETE'
            })
    },
    changeTaskStatus (id, done) {
        return fetch(`${tasksEndpoint}/1`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                'done': done
            })
        })
    }
};

const alertError = (error) => {
    alert(`Can't ${error} the task`);
};

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
        let taskNode = deleteButton.closest('.task');
        taskApi.deleteTask(taskNode.id)
            .then(response => response.ok ? taskNode.remove() : alertError('delete'));
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

        taskApi.changeTaskStatus(taskNode.id, checkbox.checked)
            .then(res => res.ok ? taskNode.classList.toggle('completed_task', checkbox.checked) : alertError('change'));

        // const task = todoList.find(item => taskNode.id == item.id);
        // task.done = checkbox.checked;
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

function handleError () {
    listElement.innerHTML += 'Can`t load task list :(';
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

// todoList.forEach(pageOutput);

listElement.addEventListener('click', deleteElement);
listElement.addEventListener('click', makeItemDone);
listElement.addEventListener('click', setOption);
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm);
    const task = new TodoItem(Object.fromEntries(formData.entries()));
    taskApi.createTask(task)
        .then(pageOutput)
        .then(_ => taskForm.reset())
        .catch(error => alert(error.title));
});

taskApi.getAll()
    .then(tasks => tasks.forEach(pageOutput))
    .catch(handleError);;