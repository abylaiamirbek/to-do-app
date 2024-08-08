let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('add-task-btn').addEventListener('click', addTask);
});

async function loadTasks() {
    tasks = await window.go.main.App.GetTasks();
    renderTasks();
}

async function addTask() {
    const titleInput = document.getElementById('task-title');
    const dueDateInput = document.getElementById('task-due-date');
    const priorityInput = document.getElementById('task-priority');

    const title = titleInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = parseInt(priorityInput.value);

    if (title === '') {
        alert('Please enter a task title');
        return;
    }

    const newTask = await window.go.main.App.AddTask(title, dueDate, priority);
    tasks.push(newTask);
    renderTasks();

    titleInput.value = '';
    dueDateInput.value = '';
    priorityInput.value = '1';
}

async function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        await window.go.main.App.DeleteTask(id);
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }
}

async function toggleTaskStatus(id) {
    const updatedTask = await window.go.main.App.ToggleTaskStatus(id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex] = updatedTask;
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');

    taskList.innerHTML = '';
    completedTaskList.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        if (task.done) {
            completedTaskList.appendChild(taskElement);
        } else {
            taskList.appendChild(taskElement);
        }
    });
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task ${task.done ? 'done' : ''} priority-${task.priority}`;

    const titleElement = document.createElement('span');
    titleElement.className = 'task-title';
    titleElement.textContent = task.title;
    taskElement.appendChild(titleElement);

    const dueDateElement = document.createElement('span');
    dueDateElement.className = 'task-due-date';
    dueDateElement.textContent = task.dueDate;
    taskElement.appendChild(dueDateElement);

    const priorityElement = document.createElement('span');
    priorityElement.className = `task-priority priority-${task.priority}`;
    priorityElement.textContent = ['Low', 'Medium', 'High'][task.priority - 1];
    taskElement.appendChild(priorityElement);

    const toggleButton = document.createElement('button');
    toggleButton.textContent = task.done ? 'Undo' : 'Done';
    toggleButton.onclick = () => toggleTaskStatus(task.id);
    taskElement.appendChild(toggleButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteTask(task.id);
    taskElement.appendChild(deleteButton);

    return taskElement;
}
