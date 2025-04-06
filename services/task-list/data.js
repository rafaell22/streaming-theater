import fs from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readTasks = async () => {
 try {
    const tasks = await fs.readFile(join(__dirname, './data/tasks.json'), 'utf8');
    return JSON.parse(tasks);
  } catch(errorLoadingTasks) {
    throw errorLoadingTasks;
  }
}

const saveTasks = async (tasks) => {
 try {
    await fs.writeFile(join(__dirname, './data/tasks.json'), JSON.stringify(tasks), 'utf8');
  } catch(errorSavingTasks) {
    throw errorSavingTasks;
  }
}

export { readTasks, saveTasks };
