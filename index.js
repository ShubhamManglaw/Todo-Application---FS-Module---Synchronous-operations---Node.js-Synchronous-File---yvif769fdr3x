const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.txt');

// Ensure db.txt exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, '');
}

// Convert the text file format to JSON array
const dbTextToJson = (text) => {
  if (!text || !text.trim()) return [];
  const clean = text.trim();
  const formattedString = '[' + clean.split(/\}\s*\r?\n\s*\{/).join('},{') + ']';
  try {
    return JSON.parse(formattedString);
  } catch (e) {
    return [];
  }
};

// Convert JSON array to the stored text format
const JsonToDbText = (jsonArray) => {
  if (!jsonArray || jsonArray.length === 0) return '';
  return jsonArray.map(todo => JSON.stringify(todo, null, 2)).join('\n') + '\n';
};

const getTodosSync = () => {
  if (!fs.existsSync(DB_PATH)) return '';
  return fs.readFileSync(DB_PATH, 'utf8');
};

const getTodoSync = (id) => {
  const text = getTodosSync();
  const arr = dbTextToJson(text);
  const todo = arr.find(item => String(item.id) === String(id));
  return todo ? JSON.stringify(todo) : null;
};

const createTodoSync = (todoTitle) => {
  const obj = {
    id: Date.now(),
    title: todoTitle,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const text = getTodosSync();
  const todos = dbTextToJson(text);
  todos.push(obj);

  fs.writeFileSync(DB_PATH, JsonToDbText(todos));
};

const updateTodoSync = (id, updates) => {
  const text = getTodosSync();
  const todos = dbTextToJson(text);

  todos.forEach(item => {
    if (String(item.id) === String(id)) {
      Object.assign(item, updates);
      item.updatedAt = new Date().toISOString();
    }
  });

  fs.writeFileSync(DB_PATH, JsonToDbText(todos));
};

const deleteTodoSync = (id) => {
  const text = getTodosSync();
  const todos = dbTextToJson(text);

  const filtered = todos.filter(item => String(item.id) !== String(id));

  fs.writeFileSync(DB_PATH, JsonToDbText(filtered));
};

module.exports = {
  getTodosSync,
  getTodoSync,
  createTodoSync,
  updateTodoSync,
  deleteTodoSync,
};
