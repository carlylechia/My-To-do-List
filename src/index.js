import './style.css';
import setState from './modules/getStates.js';

let tasks = [];
const taskWrapper = document.querySelector('.to-dos');
const newTask = document.querySelector('.new-task');
const addNewTask = document.querySelector('.submit');
const clearAll = document.querySelector('.clear-all');

const addToLocalStorage = () => {
  localStorage.setItem('myTasks', JSON.stringify(tasks));
};

const getFromLocalStorage = () => {
  if (localStorage.getItem('myTasks')) {
    tasks = JSON.parse(localStorage.getItem('myTasks'));
  }
  return tasks;
};

const resetIndex = (tasks) => {
  for (let i = 0; i < tasks.length; i += 1) {
    let indx = i + 1;
    indx = i;
    tasks[i].index = indx;
  }
};

const editTask = (desc, index) => {
  tasks[index].description = desc;
  addToLocalStorage();
};

const displayTasks = () => {
  taskWrapper.innerHTML = '';
  taskWrapper.classList.add('drag-list');
  const mylocal = getFromLocalStorage();
  mylocal.forEach((tsk, index) => {
    const li = document.createElement('li');
    li.setAttribute('draggable', 'true');
    li.setAttribute('data-index', index);
    li.classList.add('draggable');
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    if (tsk.checked === true) {
      checkbox.setAttribute('checked', 'checked');
    }

    checkbox.addEventListener('change', (e) => {
      e.preventDefault();
      // eslint-disable-next-line no-use-before-define
      strikeThrough();
      setState(tasks, e.target, tsk.index);
      addToLocalStorage();
    });

    const rmvTask = (index) => {
      const mylocal = getFromLocalStorage();
      mylocal.splice(index, 1);
      for (let i = index; i < mylocal.length; i += 1) {
        mylocal[i].index -= 1;
      }
      addToLocalStorage();
      displayTasks();
    };

    const taskDesc = document.createElement('input');
    taskDesc.classList.add('todotask');
    taskDesc.value = tsk.description;

    const strikeThrough = () => taskDesc.classList.toggle('strike');

    const hold = document.createElement('i');
    hold.classList.add('fas', 'fa-grip-lines');
    hold.setAttribute('draggable', 'true');

    const deleteTask = document.createElement('i');
    taskDesc.addEventListener('change', (e) => {
      e.preventDefault();
      editTask(e.target.value, tsk.index);
      taskDesc.blur();
    });
    deleteTask.classList.add('fas', 'fa-solid', 'fa-trash');
    deleteTask.addEventListener('click', () => {
      rmvTask(tsk.index);
      resetIndex(mylocal);
      addToLocalStorage();
      displayTasks();
    });

    li.append(checkbox, taskDesc, hold, deleteTask);
    taskWrapper.appendChild(li);
  });
  // eslint-disable-next-line no-use-before-define
  dragDrop();
};

function swapTasks(fromIndex, toIndex) {
  const taskOne = tasks[fromIndex].querySelector('.draggable');
  const taskTwo = tasks[toIndex].querySelector('.draggable');

  tasks[fromIndex].appendChild(taskTwo);
  tasks[toIndex].appendChild(taskOne);
}

let dragStartIndex;

function dragStart() {
  dragStartIndex = +this.closest('li').getAttribute('index');
}
function drop() {
  const dragEndIndex = +this.getAttribute('index');
  swapTasks(dragStartIndex, dragEndIndex);

  this.classList.remove('over');
}
function dragOver(e) {
  e.preventDefault();
}
function dragEnter() {
  this.classList.add('over');
}
function dragLeave() {
  this.classList.remove('over');
}

const dragDrop = () => {
  const draggables = document.querySelectorAll('.draggable');
  const dragged = document.querySelectorAll('.drag-list li');

  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', dragStart);
  });

  dragged.forEach((item) => {
    item.addEventListener('drop', drop);
    item.addEventListener('dragover', dragOver);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  });
};
const clearCompletedTasks = () => {
  tasks = tasks.filter((item) => !item.checked);
  resetIndex(tasks);
  addToLocalStorage();
  displayTasks();
};

clearAll.addEventListener('click', clearCompletedTasks);

const addToTasks = () => {
  const position = tasks.length;
  tasks.push({
    checked: false,
    description: newTask.value,
    index: position,
  });
  newTask.value = '';
  addToLocalStorage();
  displayTasks();
};

const reset = document.getElementById('reset');

const clearAllTasks = () => {
  tasks = [];
};

reset.addEventListener('click', () => {
  clearAllTasks();
  addToLocalStorage();
  displayTasks();
});

addNewTask.addEventListener('click', (e) => {
  e.preventDefault();
  addToTasks();
});

document.addEventListener('DOMContentLoaded', () => {
  getFromLocalStorage();
  displayTasks();
});
