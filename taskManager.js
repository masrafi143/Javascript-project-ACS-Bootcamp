// Array to store all tasks
let tasks = [];

// Use localStorage for persistence
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            tasks = JSON.parse(savedTasks); // Leverage JSON.stringify() and JSON.parse() for localStorage
            renderTasks(); // Display the tasks
        }
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

// Use localStorage for persistence
function saveTasks() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Leverage JSON.stringify() and JSON.parse() for localStorage
    } catch (error) {
        console.error("Error saving tasks:", error);
    }
}

// Function to add a new task
function addTask(title, description, priority, dueDate = null) {
    // Create a new task object
    const task = {
        id: Date.now(), // Use Date.now() for unique IDs
        title,
        description,
        priority,
        dueDate, // Optional due date - Add due date to tasks
        completed: false // New tasks are not completed by default
    };

    tasks.push(task); // Add the new task to the tasks array
    saveTasks(); // Save the updated tasks array to localStorage
    renderTasks(); // Display the updated tasks
}

// Function to delete a task by ID
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId); // Remove the task with the specified ID
    saveTasks(); // Save the updated tasks array to localStorage
    renderTasks(); // Display the updated tasks
}

// Function to update a task by ID
function updateTask(taskId, updates) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, ...updates }; // Update the specified task
        }
        return task;
    });
    saveTasks(); // Save the updated tasks array to localStorage
    renderTasks(); // Display the updated tasks
}

// Function to toggle task completion
function toggleTaskCompletion(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.completed = !task.completed; // Toggle the completion status
        }
        return task;
    });
    saveTasks(); // Save the updated tasks array to localStorage
    renderTasks(); // Display the updated tasks
}

// Implement task filtering
function filterTasks(criteria) {
    let filteredTasks = tasks;

    if (criteria === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (criteria === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (criteria === "highPriority") {
        filteredTasks = tasks.filter(task => task.priority === "high");
    }

    renderTasks(filteredTasks); // Display the filtered tasks
}

// Add task sorting functionality
function sortTasks(criteria) {
    if (criteria === "dueDate") {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (criteria === "priority") {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    renderTasks(); // Display the sorted tasks
}

// Create task search feature
function searchTasks(query) {
    const searchResults = tasks.filter(task =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase())
    );
    renderTasks(searchResults); // Display the search results
}

// Function to display tasks in the HTML
function renderTasks(taskArray = tasks) {
    try {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = ""; // Clear existing tasks

        taskArray.forEach(task => {
            // Create a new task item
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item");
            if (task.completed) {
                taskItem.classList.add("task-completed");
            }

            // Set the task item content
            taskItem.innerHTML = `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <span>Priority: ${task.priority}</span>
                    ${task.dueDate ? `<span>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ""}
                </div>
                <div class="task-actions">
                    <button class="complete-btn">${task.completed ? "Undo" : "Complete"}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            // Add event listeners to the buttons
            taskItem.querySelector(".complete-btn").addEventListener("click", () => toggleTaskCompletion(task.id));
            taskItem.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task.id));

            // Add the task item to the task list
            taskList.appendChild(taskItem);
        });
    } catch (error) {
        console.error("Error rendering tasks:", error);
    }
}

// Event listener for form submission to add a new task
const taskForm = document.getElementById("taskForm");
taskForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload

    try {
        // Get the task details from the form inputs
        const title = document.getElementById("taskTitle").value;
        const description = document.getElementById("taskDescription").value;
        const priority = document.getElementById("taskPriority").value;
        const dueDate = document.getElementById("taskDueDate")?.value;

        addTask(title, description, priority, dueDate); // Add the new task

        // Clear the form after submission
        taskForm.reset();
    } catch (error) {
        console.error("Error adding task from form:", error);
    }
});

// Event listener for filter dropdown
document.getElementById("filterTasks").addEventListener("change", (e) => {
    filterTasks(e.target.value); // Filter tasks based on selected criteria
});

// Event listener for sort dropdown
document.getElementById("sortTasks").addEventListener("change", (e) => {
    sortTasks(e.target.value); // Sort tasks based on selected criteria
});

// Event listener for search input
document.getElementById("searchTasks").addEventListener("input", (e) => {
    searchTasks(e.target.value); // Search tasks based on input query
});

// Load tasks when the page loads
loadTasks();
