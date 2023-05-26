const connection = require('./connection');
const getAll = async () => {
  const [tasks] = await connection.execute('SELECT * FROM tasks');
  return tasks;
};
const createTasks = async (tasks) => {
  const { title } = tasks;
  const dateUTC = new Date(Date.now()).toUTCString();
  const query = 'INSERT INTO tasks(title, status, created_at) VALUES (?, ?, ?)';
  const [createdTasks] = await connection.execute(query, [
    title,
    'pendente',
    dateUTC,
  ]);
  return { insertID: createdTasks.insertId };
};
const deleteTask = async (id) => {
  const [removedTask] = await connection.execute(
    'DELETE FROM tasks WHERE id = ?',
    [id]
  );
  return removedTask;
};
const updateTask = async (id, tasks) => {
  const query = 'UPDATE tasks SET title = ?, status = ? WHERE id = ?';
  const { title, status } = tasks;
  const [updatedTask] = await connection.execute(query, [title, status, id]);
  return updatedTask;
};

module.exports = {
  getAll,
  createTasks,
  deleteTask,
  updateTask,
};
