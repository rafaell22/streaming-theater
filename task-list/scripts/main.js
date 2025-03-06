const tasks = {
  TODO: [],
  DOING: [],
  DONE: [],
}

const lists = {
  TODO: document.querySelector('#todo ul'),
  DOING: document.querySelector('#doing ul'),
  DONE: document.querySelector('#done ul'),
}

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

  tasks.TODO.sort((a, b) => a - b);
  tasks.DOING.sort((a, b) => a - b);
  tasks.DONE.sort((a, b) => a - b);

  tasks.TODO.forEach((t) => addItemToList(t, 'TODO'));

  tasks.DOING.forEach((t) => addItemToList(t, 'DOING'));

  tasks.DONE.forEach((t) => addItemToList(t, 'DONE'));

  document.querySelector('main').addEventListener('click', (event) => {
    const target = event.target;
    const id = target.id;
    if(target.classList.contains('todo')) {
      updateTaskFromTo(id, 'TODO', 'DOING');
      return;
    }

    if(target.classList.contains('doing')) {
      updateTaskFromTo(id, 'DOING', 'DONE');
      return;
    }
  });

  document.querySelector('main').addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const target = event.target;
    const id = target.id;
    if(target.classList.contains('doing')) {
      updateTaskFromTo(id, 'DOING', 'TODO');
      return;
    }

    if(target.classList.contains('done')) {
      const id = target.id;
      updateTaskFromTo(id, 'DONE', 'DOING');
      return;
    }
  });
})()

const updateTaskFromTo = (id, from, to) => {
  const taskIndex = tasks[from].findIndex(t => t.id === id);
  if(taskIndex >= 0) {
    const tasksFound = tasks[from].splice(taskIndex, 1);
    tasks[to].push(tasksFound[0]);
    removeItemFromList(tasksFound[0].id);
    addItemToList(tasksFound[0], to);
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
