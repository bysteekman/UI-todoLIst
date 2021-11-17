"use strict";

class TodoItem {
    constructor(id, title, description, dueDate, done){
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.done = done;
    }
}
const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sept", "Oct",
    "Nov", "Dec"
  ];

const listElement = document.getElementById('tasks');

let now = new Date();
let todoList = [
    new TodoItem(1, 'First task', '', now, true),
    new TodoItem(2, 'Second task', null, now),
    new TodoItem(3, 'Third task', 'Very important task, you must do it because you will be fired, this is simple task for you', new Date("2021-04-01")),
    new TodoItem(4, 'Fourth task', 'Go to holy guys, ask them to fix a mouse'),
]

let deleteElement = (event) => {
    const target = event.target;
    if(target.tagName === 'SPAN') {
        let divToDelete = document.getElementById(`${target.title}`);
        let index = todoList.indexOf(divToDelete);
        todoList.splice(index, 1);
        divToDelete.remove();
    }
};

function displayDiv (value) {
    let divElements = listElement.getElementsByClassName('completed_div');
    for (let i = 0; i < divElements.length; i++) {
        // console.log(divElements[i]);
        divElements[i].setAttribute('style', `display: ${value};`);
    }
};

let setOption = (event) => {
    const target = event.target;
    if (target.tagName === 'INPUT' && target.type === 'radio') {
        if (target.id === 'all_tasks') {
            displayDiv('flex');
        } else {
            displayDiv('none');
        }
    }
};

let makeItemDone = (event) => {
    let target = event.target;
    if(target.tagName === 'INPUT' && target.type === 'checkbox') {
        if (target.checked) {
            let div = document.getElementById(`task_${target.id}`);
            div.classList.add('completed_div');
            if(document.getElementById('not_completed').checked) {
                div.setAttribute('style', 'display: none;');
            }
        } else {
            document.getElementById(`task_${target.id}`).classList.remove("completed_div");
        }
        todoList.map(item => target.id == item.id ? item.done = target.checked : item);
        // todoList.map(item => console.log(item));
    }
};

listElement.addEventListener('click', deleteElement);
listElement.addEventListener('click', makeItemDone);
listElement.addEventListener('click', setOption);

function pageOutput (item) {
    listElement.innerHTML += todoItemOutput(item);
}

function todoItemOutput(item) {
    const { id, title, description, dueDate, done } = item;
    
    let correctFormatDate = (dueDate != null && dueDate != undefined && dueDate != '') ? `(${monthNames[dueDate.getMonth()]} ${dueDate.getDate()})` : '';
    let doneCheck = done ? 'checked' : '';
    let doneDiv = done ? 'completed_div' : '';
    let invalidDate = dueDate < now ? ' invalid_date' : '';
    let descriptionNotNull = description != null ? description : '';
    let completedTask = done ? 'style="display: none;"' : '';

    let output = `<div id="task_${id}" class="${doneDiv}" ${completedTask}><p><input type="checkbox" id="${id}" name="itemCheckbox" ${doneCheck}> <em class="task_status">${title}</em><em class="date${invalidDate}">${correctFormatDate}</em></p><p class="task_description">${descriptionNotNull}</p><span title="task_${id}"></span></div>`;
    return output;
}

todoList.forEach(pageOutput);