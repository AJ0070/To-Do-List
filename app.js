function addTask() {
  var taskInput = document.getElementById('taskInput');
  var taskText = taskInput.value;
  var taskDate = document.getElementById('taskDate').value;
  var taskTime = document.getElementById('taskTime').value;

  if (taskText.trim() === "") {
    alert("Please enter a task!");
    return;
  }

  // Create a unique key for each date
  var dateKey = 'tasks_' + taskDate;

  // Retrieve tasks for the current date from local storage
  var storedTasks = localStorage.getItem(dateKey);
  var tasks = storedTasks ? JSON.parse(storedTasks) : [];

  // Add the new task to the tasks array
  tasks.push({
    task: taskText,
    time: taskTime
  });

  // Save the updated tasks array back to local storage
  localStorage.setItem(dateKey, JSON.stringify(tasks));

  // Update the task list on the page
  updateTaskList(dateKey);

  // Clear input fields
  taskInput.value = "";
  document.getElementById('taskDate').value = "";
  document.getElementById('taskTime').value = "";
}

function updateTaskList(dateKey) {
  var tableBody = document.getElementById('taskList');
  tableBody.innerHTML = ""; // Clear the existing content

  // Retrieve tasks for the current date from local storage
  var storedTasks = localStorage.getItem(dateKey);
  var tasks = storedTasks ? JSON.parse(storedTasks) : [];

  // Populate the table with tasks
  tasks.forEach(function(task) {
    var newRow = tableBody.insertRow();
    var cellTask = newRow.insertCell(0);
    var cellDate = newRow.insertCell(1);
    var cellTime = newRow.insertCell(2);
    var cellAction = newRow.insertCell(3);

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.onchange = function () {
      newRow.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    };

    var label = document.createElement('label');
    label.appendChild(checkbox);

    cellTask.appendChild(document.createTextNode(task.task));
    cellDate.appendChild(document.createTextNode(dateKey.split('_')[1])); // Extract the date
    cellTime.appendChild(document.createTextNode(task.time));
    cellAction.appendChild(label);

    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.appendChild(document.createTextNode('Delete'));
    deleteButton.onclick = function () {
      deleteTask(dateKey, tasks, newRow.rowIndex);
    };

    cellAction.appendChild(deleteButton);
  });
}

function deleteTask(dateKey, tasks, rowIndex) {
  // Remove the task from the tasks array
  tasks.splice(rowIndex - 1, 1);

  // Save the updated tasks array back to local storage
  localStorage.setItem(dateKey, JSON.stringify(tasks));

  // Update the task list on the page
  updateTaskList(dateKey);
}

// Load tasks for the current date on page load
document.addEventListener("DOMContentLoaded", function() {
  var currentDate = new Date().toISOString().split('T')[0];
  var dateKey = 'tasks_' + currentDate;
  updateTaskList(dateKey);
});