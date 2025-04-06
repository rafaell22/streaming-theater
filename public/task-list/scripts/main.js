const TASK_STATUS = {
  TODO: 'TODO',
  DOING: 'DOING',
  DONE: 'DONE'
}

const tasks = {};
tasks[TASK_STATUS.TODO] = [];
tasks[TASK_STATUS.DOING] = [];
tasks[TASK_STATUS.DONE] = [];

const lists = {};
lists[TASK_STATUS.TODO] = document.querySelector('#todo ul');
lists[TASK_STATUS.DOING] = document.querySelector('#doing ul');
lists[TASK_STATUS.DONE] = document.querySelector('#done ul');

const loadTasks = async () => {
  try {
    const data = await fetch('http://localhost:8080/task-list/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return await data.json();
  } catch(errorLoadingTasks) {
    console.log('Error loading tasks!');
    console.log(errorLoadingTasks);
  }
}

(async () => {
  const tasksData = await loadTasks();

  tasksData.active.forEach((t) => {
    tasks[t.status].push(t);
  });

  tasks[TASK_STATUS.TODO].sort((a, b) => a - b);
  tasks[TASK_STATUS.DOING].sort((a, b) => a - b);
  tasks[TASK_STATUS.DONE].sort((a, b) => a - b);

  tasks[TASK_STATUS.TODO].forEach((t) => addItemToList(t, TASK_STATUS.TODO));

  tasks[TASK_STATUS.DOING].forEach((t) => addItemToList(t, TASK_STATUS.DOING));

  tasks[TASK_STATUS.DONE].forEach((t) => addItemToList(t, TASK_STATUS.DONE));

  document.querySelector('main').addEventListener('click', (event) => {
    const target = event.target;
    const id = target.id;
    if(target.classList.contains('todo')) {
      updateTaskFromTo(id, TASK_STATUS.TODO, TASK_STATUS.DOING);
      return;
    }

    if(target.classList.contains('doing')) {
      updateTaskFromTo(id, TASK_STATUS.DOING, TASK_STATUS.DONE);
      return;
    }
  });

  document.querySelector('main').addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const target = event.target;
    const id = target.id;
    if(target.classList.contains('doing')) {
      updateTaskFromTo(id, TASK_STATUS.DOING, TASK_STATUS.TODO);
      return;
    }

    if(target.classList.contains('done')) {
      const id = target.id;
      updateTaskFromTo(id, TASK_STATUS.DONE, TASK_STATUS.DOING);
      return;
    }
  });
})()

const updateTaskFromTo = async (id, from, to) => {
  const taskIndex = tasks[from].findIndex(t => t.id === id);
  if(taskIndex >= 0) {
    const tasksFound = tasks[from].splice(taskIndex, 1);
    removeItemFromList(tasksFound[0].id);
    addItemToList(tasksFound[0], to);

    try {
      await fetch(`http://localhost:8080/task-list/tasks/${tasksFound[0].id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: to }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch(errorUpdatingTask) {
      console.log('Error updating task!');
      console.log(errorUpdatingTask);

      removeItemFromList(tasksFound[0].id);
      addItemToList(tasksFound[0], from);
      return;
    }

    tasks[to].push(tasksFound[0]);
  }
}

const removeItemFromList = (id) => {
  const li = document.getElementById(id);
  li.parentNode.removeChild(li);
}

const addItemToList = (task, type) => {
  const li = document.createElement('li');
  li.textContent = task.description;
  li.id = task.id;

  li.classList.add(type.toLowerCase());
  lists[type].appendChild(li);
}
