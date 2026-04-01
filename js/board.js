let tasks = [];
let currentTask = '';

function initBoard() {
    init('nav_item_board');
    renderTaskBoard();
}

function openAddTaskDialog() {
    let dialog = document.getElementById('add_task_board_dialog');
    dialog.showModal();
}

async function renderTaskBoard() {
    let userKey = loadCurrentUser();
    await getAllTaskData(userKey);
    renderAllTasks();
}

function loadCurrentUser() {
    let currentUser = sessionStorage.getItem('currentUserKey')
    return currentUser
}

async function getAllTaskData(userKey) {
    tasks = [];
    let tasksResponse = await getData(`/users/${userKey}/tasks`);
    if (!tasksResponse) return;
    let taskKeyArray = Object.keys(tasksResponse);
    for (let i = 0; i < taskKeyArray.length; i++) {
        const taskKey = taskKeyArray[i];
        tasks.push({
            "task_id": taskKey,
            "task_category": tasksResponse[taskKey].task_category,
            "task_status": tasksResponse[taskKey].task_status,
            "task_due_date": tasksResponse[taskKey].task_due_date,
            "task_priority": tasksResponse[taskKey].task_priority,
            "task_title": tasksResponse[taskKey].task_title,
            "task_description": tasksResponse[taskKey].task_description,
            "subtasks": tasksResponse[taskKey].subtasks,
            "assigned_contacts": tasksResponse[taskKey].assigned_contacts,
        })
    }
}

function renderAllTasks() {
    clearBoardColumns();
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        let taskIndex = tasks.indexOf(task);
        task.task_category === 'Technical Task' ? categoryClass = 'technical_task' : categoryClass = 'user_story';
        let subtasksAmount = !task.subtasks ? 0 : task.subtasks.length;
        let subtasksDoneAmount = countSubtasksStatus(task.subtasks);
        let subtaskRatio = subtasksAmount === 0 ? 0 : (subtasksDoneAmount / subtasksAmount) * 100;
        let taskPriority = task.task_priority ? `<img src="assets/img/${task.task_priority}_prio_icon.png" alt="Priorität: ${task.task_priority}">` : '';
        let contactInitials = createTaskContactList(task.assigned_contacts);
        renderBoardTaskCard(task, categoryClass, subtasksAmount, subtasksDoneAmount, subtaskRatio, taskPriority, contactInitials, taskIndex);
    }
    showPlaceholdersForEmptyColumns();
}

function clearBoardColumns() {
    let columns = ['to-do', 'in_progress', 'await_feedback', 'done'];
    for (let i = 0; i < columns.length; i++) {
        let column = document.getElementById(`board_task_card_${columns[i]}`);
        if (column) column.innerHTML = '';
    }
}

function showPlaceholdersForEmptyColumns() {
    let columns = ['to-do', 'in_progress', 'await_feedback', 'done'];
    for (let i = 0; i < columns.length; i++) {
        let column = document.getElementById(`board_task_card_${columns[i]}`);
        if (column && column.innerHTML.trim() === '') {
            column.innerHTML = '<article><div class="board_no_task_placeholder"><span>No tasks To do</span></div></article>';
        }
    }
}

function countSubtasksStatus(subtasks) {
    let subtaskDoneAmount = 0;
    if (subtasks) {
        for (let i = 0; i < subtasks.length; i++) {
            const subtask = subtasks[i];
            subtask.subtask_status == 'done' ? subtaskDoneAmount++ : subtaskDoneAmount
        } return subtaskDoneAmount
    }
    else { return 0 }
}

function createTaskContactList(contacts) {
    let contactList = '';

    if (contacts) {
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            contactList += `<div class="contact_initials">${contact}</div>`;
        }
        return contactList;
    } else { return '' };
}

function searchForExistingTask() {
    let searchInput = document.getElementById('task_search_input').value.toLowerCase();
    let filteredTasks = tasks.filter(task =>
        task.task_title.toLowerCase().includes(searchInput) ||
        task.task_description.toLowerCase().includes(searchInput)
    );
    console.log(filteredTasks);
    renderFilteredTasks(filteredTasks);
}


function renderFilteredTasks(filteredTasks) {
    clearBoardColumns();
    for (let i = 0; i < filteredTasks.length; i++) {
        const task = filteredTasks[i];
        let taskIndex = tasks.indexOf(task);
        task.task_category === 'Technical Task' ? categoryClass = 'technical_task' : categoryClass = 'user_story';
        let subtasksAmount = !task.subtasks ? 0 : task.subtasks.length;
        let subtasksDoneAmount = countSubtasksStatus(task.subtasks);
        let subtaskRatio = subtasksAmount === 0 ? 0 : (subtasksDoneAmount / subtasksAmount) * 100;
        let taskPriority = task.task_priority ? `<img src="assets/img/${task.task_priority}_prio_icon.png" alt="Priorität: ${task.task_priority}">` : '';
        let contactInitials = createTaskContactList(task.assigned_contacts);
        renderBoardTaskCard(task, categoryClass, subtasksAmount, subtasksDoneAmount, subtaskRatio, taskPriority, contactInitials, taskIndex);
    }
    showPlaceholdersForEmptyColumns();
}


function openDetailedTaskCard(taskIndex) {
    let task = tasks[taskIndex];
    let card = document.getElementById('detailed_task_card_dialog');
    card.showModal();
    task.task_category === 'Technical Task' ? categoryClass = 'technical_task' : categoryClass = 'user_story';
    let due_date = formatDate(task.task_due_date);
    let taskPriorityImg = task.task_priority ? `<img src="assets/img/${task.task_priority}_prio_icon.png" alt="Priorität: ${task.task_priority}">` : '';
    let taskPriority = task.task_priority ? task.task_priority.charAt(0).toUpperCase() + task.task_priority.substring(1).toLowerCase() : 'None';
    let assignedContactsHTML = createDetailedTaskContactListHTML(task.assigned_contacts)
    let subtask = createDetailedTaskSubtaskHTML(task.subtasks)
    renderDetailedTaskCard(taskIndex, task, categoryClass, due_date, taskPriority, taskPriorityImg, assignedContactsHTML, subtask);
}

function formatDate(dateString) {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function createDetailedTaskContactListHTML(contacts) {
    let contactList = '';

    if (contacts) {
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            contactList += `
            <article class="detailed_task_contact_list">
                <div class="contact_initials contact_initilas_detailed_task">${contact}</div>
                <span>Jan Möller</span>
            </article> `
        }
        return contactList;
    } else { return '' };
}

function createDetailedTaskContactListHTMLEditView(contacts) {
    let contactList = '';
    if (contacts) {
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            contactList += /*html*/ `
           <div class="contact_initials_edit_view">${contact}</div>`
        }
        return contactList;
    } else { return '' };
}


function createDetailedTaskSubtaskHTML(subtasks) {
    let subtaskHTML = '';

    if (subtasks) {
        for (let i = 0; i < subtasks.length; i++) {
            const subtask = subtasks[i];
            let img = subtask.subtask_status = 'to_do' ? subtask.subtask_status : 'done';
            subtaskHTML += /*html*/ `
            <article class="detailed_task_card_subtask_article">
                <img src="/assets/img/subtask_checkbox_${img}.png" alt="Subtask_status">
                <span>${subtask.subtask}</span>
            </article>
              `
        }
    }
    return subtaskHTML;
}

function closeDetailedCardDialog() {
    let dialogRef = document.getElementById('detailed_task_card_dialog');
    dialogRef.close();
}

function closeDetailedCardDialogEditView() {
    let dialogRef = document.getElementById('detailed_task_card_dialog_edit_view');
    dialogRef.close();
}

async function deleteTaskFromBoard(task_id, taskIndex) {
    let userKey = loadCurrentUser();
    tasks.splice(taskIndex, 1)
    await deleteData(`/users/${userKey}/tasks/${task_id}`);
    renderAllTasks();
    closeDetailedCardDialog();
}

function openDetailedTaskCardEditView(taskIndex) {
    let card = document.getElementById('detailed_task_card_dialog');
    let cardEditView = document.getElementById('detailed_task_card_dialog_edit_view');
    card.close();
    cardEditView.showModal();
    currentTask = tasks[taskIndex];
    currentTask.task_category === 'Technical Task' ? categoryClass = 'technical_task' : categoryClass = 'user_story';
    let due_date = currentTask.task_due_date;
    let taskPriorityImg = currentTask.task_priority ? `<img src="assets/img/${currentTask.task_priority}_prio_icon.png" alt="Priorität: ${currentTask.task_priority}">` : '';
    let taskPriority = currentTask.task_priority ? currentTask.task_priority.charAt(0).toUpperCase() + currentTask.task_priority.substring(1).toLowerCase() : 'None';
    let assignedContactsHTML = createDetailedTaskContactListHTMLEditView(currentTask.assigned_contacts);
    let subtask = createDetailedTaskSubtaskHTML(currentTask.subtasks);
    renderDetailedTaskCardEditView(cardEditView, taskIndex, currentTask, categoryClass, due_date, taskPriority, taskPriorityImg, assignedContactsHTML, subtask);
    setCurrentPriorityInEditView(currentTask.task_priority);
    console.log(tasks);
}

async function setTaskChanges() {
    let cardEditView = document.getElementById('detailed_task_card_dialog_edit_view');
    let changedTask = {};
    let title = document.getElementById('task_title_edit_view');
    let description = document.getElementById('task_description_edit_view');
    let date = document.getElementById('task_date_edit_view');
    let prio = currentTask.task_priority;

    changedTask.assigned_contacts = currentTask.assigned_contacts,
        changedTask.subtasks = currentTask.subtasks,
        changedTask.task_category = currentTask.task_category,
        changedTask.task_description = description.value,
        changedTask.task_due_date = date.value,
        changedTask.task_priority = prio,
        changedTask.task_status = currentTask.task_status,
        changedTask.task_title = title.value

    await changeTaskData(currentTask.task_id, changedTask);
    cardEditView.close();
}

async function changeTaskData(task_id, changedTask) {
    let userKey = sessionStorage.getItem('currentUserKey');
    await putData(`/users/${userKey}/tasks/${task_id}/`, data = changedTask);
    await getAllTaskData(userKey);
    renderAllTasks();
}

async function editTaskPriority(prio, taskIndex) {
    let priority = document.getElementById('board_' + `${prio}` + '_task');

    if (priority.classList.contains('board_' + `${prio}` + '_task')) {
        priority.classList.remove('board_' + `${prio}` + '_task');
        currentTask.task_priority = '';
    } else {
        removeBoardTaskPriority(taskIndex);
        priority.classList.add('board_' + `${prio}` + '_task');
        currentTask.task_priority = prio;
    }

    console.log(currentTask);

}

function removeBoardTaskPriority(taskIndex) {
    let prios = ['urgent', 'medium', 'low']
    for (let i = 0; i < prios.length; i++) {
        const prio = prios[i];
        if (document.getElementById('board_' + prio + '_task').classList.contains('board_' + prio + '_task')) { document.getElementById('board_' + prio + '_task').classList.remove('board_' + prio + '_task') }
    }
    tasks[taskIndex].task_priority = '';
}

function setCurrentPriorityInEditView(priority) {
    if (priority) {
        let priorityElement = document.getElementById('board_' + priority + '_task');
        if (priorityElement) {
            priorityElement.classList.add('board_' + priority + '_task');
        }
    }
}