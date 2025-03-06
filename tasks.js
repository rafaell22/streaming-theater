import fs from 'node:fs/promises';

const readTasks = async () => {
 try {
    const tasks = await fs.readFile('./data/tasks.json', 'utf8');
    return JSON.parse(tasks);
  } catch(errorLoadingTasks) {
    throw errorLoadingTasks;
  }
}

const saveTasks = async (tasks) => {
 try {
    await fs.writeFile('./data/tasks.json', JSON.stringify(tasks), 'utf8');
  } catch(errorSavingTasks) {
    throw errorSavingTasks;
  }
}

export { readTasks, saveTasks };
