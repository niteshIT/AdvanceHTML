document
  .getElementById("taskForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    addTask();
  });

function showForm() {
  document.getElementById("taskFormModal").style.display = "block";
}

function closeForm() {
  document.getElementById("taskFormModal").style.display = "none";
}

// function showForm() {
//   $("#taskFormModal").modal("show");
// }

// function closeForm() {
//   $("#taskFormModal").modal("hide");
// }

let taskIdCounter = localStorage.getItem("taskId")
  ? parseInt(localStorage.getItem("taskId"))
  : 0;

function addTask() {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;

  const task = document.createElement("div");
  task.className = "task-item";
  task.draggable = true;
  task.id = `task-${taskIdCounter++}`;
  task.ondragstart = drag;

  task.innerHTML = `<h5>${title}</h5><p>${description}</p>`;

  document.getElementById("todo").appendChild(task);
  saveTask(task.id, "todo", title, description);
  document.getElementById("taskForm").reset();

  // Save the updated taskId to localStorage
  localStorage.setItem("taskId", taskIdCounter);
  closeForm();
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const task = document.getElementById(data);
  // if (event.target.id === "trash") {
  //   deleteTask(data);
  // } else {
  //   event.target.appendChild(task);
  //   console.log(event.target);
  //   updateTaskState(data, event.target.id);
  // }

  const allowedDropTargets = ["todo", "inprogress", "done", "trash"];
  let dropTarget = event.target;
  console.log(dropTarget);
  // Find the closest parent that is a valid drop target
  while (
    !allowedDropTargets.includes(dropTarget.id) &&
    dropTarget !== document.body
  ) {
    dropTarget = dropTarget.parentElement;
  }
  console.log(dropTarget.id);
  if (allowedDropTargets.includes(dropTarget.id)) {
    if (dropTarget.id === "trash") {
      deleteTask(data);
    } else {
      dropTarget.appendChild(task);
      updateTaskState(data, dropTarget.id);
    }
  }
}

function saveTask(id, state, title, description) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ id, state, title, description });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskState(id, newState) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].state = newState;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function deleteTask(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  document.getElementById(id).remove();
}
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = "task-item";
    taskElement.draggable = true;
    taskElement.id = task.id;
    taskElement.ondragstart = drag;

    taskElement.innerHTML = `<h5>${task.title}</h5><p>${task.description}</p>`;

    document.getElementById(task.state).appendChild(taskElement);
  });
}
document.addEventListener("dragover", function (event) {
  const threshold = 100; // Distance from the edge to start scrolling
  const scrollSpeed = 100; // Speed of scrolling

  if (event.clientY > window.innerHeight - threshold) {
    window.scrollBy(0, scrollSpeed);
  } else if (event.clientY < threshold) {
    window.scrollBy(0, -scrollSpeed);
  }
});

document.addEventListener("DOMContentLoaded", loadTasks);
