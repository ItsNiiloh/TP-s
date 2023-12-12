document.addEventListener("DOMContentLoaded", () => {
    // Récuperer elements dans le DOM
    const taskForm = document.getElementById("taskForm");
    const taskTitle = document.getElementById("taskTitle");
    const taskPriority = document.getElementById("taskPriority");
    const taskList = document.getElementById("taskList");
    const deleteBtn = document.getElementById("deleteButton");

    // Local Storage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


    // Fonction pour afficher les tâches dans la liste
    function renderTasks() {
        taskList.innerHTML = "";
        // Creation des elements HTML pour chaque tâche
        tasks.forEach((task, index) => {
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed || false;
            const taskText = document.createElement("span");
            taskText.textContent = task.title;

            // Ajouter des elements a la liste
            listItem.appendChild(checkbox);
            listItem.appendChild(taskText);

            // Changer colleur de la tâche en function de la difficulté
            switch (task.priority) {
                case "1":
                    taskText.style.color = "red";
                    break;
                case "2":
                    taskText.style.color = "blue";
                    break;
                case "3":
                    taskText.style.color = "green";
                    break;
            }

            // Barrer la tâche completé
            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    taskText.style.textDecoration = "line-through";
                } else {
                    taskText.style.textDecoration = "none";
                }

                tasks[index].completed = checkbox.checked;
                localStorage.setItem("tasks", JSON.stringify(tasks));
            });

            if (task.completed) {
                taskText.style.textDecoration = "line-through";
            }

            // Ajouter les elements a la liste des tâches
            taskList.appendChild(listItem);
        });
    }


    // Affichage initial des tâches
    renderTasks();

    // Ajout de nouvelle tâches
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTask = {
            title: taskTitle.value,
            priority: taskPriority.value,
        };
        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        taskTitle.value = "";
    });


    // Button pour supprimer les tâches
    deleteBtn.addEventListener("click", () => {
        let deletedCount = 0;
        const checkboxes = taskList.querySelectorAll('li input[type="checkbox"]');

        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                tasks.splice(index - deletedCount, 1);
                deletedCount++;
            }
        });

        // Mise a jour local storage
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();

        // Notification de suppression de tâcges
        if (deletedCount > 0) {
            const notification = document.createElement("div");
            notification.textContent = `${deletedCount} tâches ont été supprimées.`;
            taskList.prepend(notification);
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    });
});
