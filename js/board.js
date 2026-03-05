let tasks = [];

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
    let tasksResponse = await getData(`/users/${userKey}/tasks`);
    let taskKeyArray = Object.keys(tasksResponse);
    console.log(tasksResponse);


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
        }
        )
    }

    console.log(tasks);

}

function renderAllTasks() {
    clearBoardColumns();
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        task.task_category === 'Technical Task' ? categoryClass = 'technical_task' : categoryClass = 'user_story';
        let subtasksAmount = !task.subtasks ? 0 : task.subtasks.length;
        let subtasksDoneAmount = countSubtasksStatus(task.subtasks);
        let subtaskRatio = subtasksAmount === 0 ? 0 : (subtasksDoneAmount / subtasksAmount) * 100;
        let taskPriority = task.task_priority ? `<img src="assets/img/${task.task_priority}_prio_icon.png" alt="Priorität: ${task.task_priority}">` : '';
        let contactInitials = createTaskContactList(task.assigned_contacts);
        renderBoardTaskCard(task, categoryClass, subtasksAmount, subtasksDoneAmount, subtaskRatio, taskPriority, contactInitials);
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
}

