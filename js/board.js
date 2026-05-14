let tasks = [];
let currentTask = '';
let currentDraggedElement;

function initBoard() {
    init('nav_item_board');
    renderTaskBoard();
}

function openAddTaskDialog(task_status) {
    let dialog = document.getElementById('add_task_board_dialog');
    dialog.showModal();
    newTask.task_status = task_status;
}

async function renderTaskBoard() {
    let userKey = loadCurrentUser();
    await getAllTaskData(userKey);
    renderAllTasks();
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

function startDragging(taskIndex) {
    currentDraggedElement = taskIndex;
}

function allowDrop(event) {
    event.preventDefault();
}

async function moveTask(status) {
    let userKey = loadCurrentUser();
    tasks[currentDraggedElement].task_status = status;
    await putData(`users/${userKey}/tasks/${tasks[currentDraggedElement].task_id}/task_status`, data = status);
    await getAllTaskData(userKey);
    renderAllTasks();
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
            contactList += `<div class="contact_initials" style="background-color:${contact.initial_bg}">${contact.contact_initials}</div>`;
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
    let subtask = createDetailedTaskSubtaskHTML(task.subtasks, taskIndex)
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
                <div class="contact_initials contact_initilas_detailed_task" style="background-color: ${contact.initial_bg}">${contact.contact_initials}</div>
                <span>${contact.contact_name}</span>
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
           <div class="contact_initials_edit_view" style="background-color: ${contact.initial_bg}">${contact.contact_initials}</div>`
        }
        return contactList;
    } else { return '' };
}


function createDetailedTaskSubtaskHTML(subtasks, taskIndex) {
    let subtaskHTML = '';

    if (subtasks) {
        for (let i = 0; i < subtasks.length; i++) {
            const subtask = subtasks[i];
            let img = subtask.subtask_status === 'to_do' ? 'to_do' : 'done';
            subtaskHTML += /*html*/ `
            <article class="detailed_task_card_subtask_article">
                <img onclick="changeSubtaskStatus(${taskIndex}, ${i})" id="subtask_(${i})" src="/assets/img/subtask_checkbox_${img}.png" alt="Subtask_status">
                <span>${subtask.subtask}</span>
            </article>
              `
        }
    }
    return subtaskHTML;
}

async function changeSubtaskStatus(taskIndex, i) {
    let userKey = loadCurrentUser();
    let subtask = tasks[taskIndex].subtasks[i];
    let imgRef = document.getElementById(`subtask_(${i})`);
    subtask.subtask_status === 'to_do' ? subtask.subtask_status = 'done' : subtask.subtask_status = 'to_do'
    imgRef.src = `/assets/img/subtask_checkbox_${subtask.subtask_status}.png`;
    await putData(`users/${userKey}/tasks/${tasks[taskIndex].task_id}/subtasks/${i}/subtask_status`, data = subtask.subtask_status);
    await getAllTaskData(userKey);
    renderAllTasks();
}



function closeDetailedCardDialog() {
    let dialogRef = document.getElementById('detailed_task_card_dialog');
    dialogRef.close();
}

async function closeDetailedCardDialogEditView() {
    let userKey = loadCurrentUser();
    let dialogRef = document.getElementById('detailed_task_card_dialog_edit_view');
    await getAllTaskData(userKey);
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
    currentTask = JSON.parse(JSON.stringify(tasks[taskIndex]));
    if (!currentTask.assigned_contacts) currentTask.assigned_contacts = [];
    if (!Array.isArray(currentTask.assigned_contacts)) {
        currentTask.assigned_contacts = Object.values(currentTask.assigned_contacts);
    }
    currentTask.task_category === 'Technical Task' ? categoryClass = 'technical_task' : categoryClass = 'user_story';
    let due_date = currentTask.task_due_date;
    let taskPriorityImg = currentTask.task_priority ? `<img src="assets/img/${currentTask.task_priority}_prio_icon.png" alt="Priorität: ${currentTask.task_priority}">` : '';
    let taskPriority = currentTask.task_priority ? currentTask.task_priority.charAt(0).toUpperCase() + currentTask.task_priority.substring(1).toLowerCase() : 'None';
    let assignedContactsHTML = createDetailedTaskContactListHTMLEditView(currentTask.assigned_contacts);
    let subtask = createDetailedTaskSubtaskHTML(currentTask.subtasks);
    renderDetailedTaskCardEditView(cardEditView, taskIndex, currentTask, categoryClass, due_date, taskPriority, taskPriorityImg, assignedContactsHTML, subtask);
    setCurrentPriorityInEditView(currentTask.task_priority);
    renderSubtaskListEditView();
    renderTaskContactsEditView(currentTask, taskIndex);
}

async function renderTaskContactsEditView(currentTask, taskIndex) {
    let userContacts = await getUserContactData();
    console.log(userContacts)

    let contactsRef = document.getElementById('contacts_dropdown_content_edit');
    if (!contactsRef || !userContacts) return;
    contactsRef.innerHTML = '';
    for (let i = 0; i < userContacts.length; i++) {
        const contact = userContacts[i];
        if (!checkForAssignedContact(contact, currentTask)) {
            renderTaskContactEditViewNotChoosen(contactsRef, contact, i, taskIndex)
        }
        else {
            renderTaskContactEditViewContactChoosen(contactsRef, contact, i, taskIndex)
        }
    }
}

async function selectTaskContactEditView(id, i, taskIndex) {
    let contactRef = document.getElementById(id);
    let img = contactRef.querySelector('img');
    contactRef.classList.toggle('bg_choosen_contact');

    if (contactRef.classList.contains('bg_choosen_contact')) {
        img.src = "assets/img/check_btn_checked.png";
        if (!currentTask.assigned_contacts) currentTask.assigned_contacts = [];
        if (!Array.isArray(currentTask.assigned_contacts)) {
            currentTask.assigned_contacts = Object.values(currentTask.assigned_contacts);
        }
        currentTask.assigned_contacts.push(userContacts[i]);

    } else {
        img.src = "assets/img/contact_check_btn.png";
        const index = currentTask.assigned_contacts.findIndex(c => c.contact_id === userContacts[i].contact_id);
        if (index > -1) {
            currentTask.assigned_contacts.splice(index, 1);
        }
    }
    showSelectedTaskContactsEditView(taskIndex)
}

function showSelectedTaskContactsEditView(taskIndex) {
    let displayContactsRef = document.getElementById('choosen_task_contacts_section_edit');
    if (!displayContactsRef) return;
    displayContactsRef.innerHTML = '';
    for (let i = 0; i < currentTask.assigned_contacts.length; i++) {
        const contact = currentTask.assigned_contacts[i];
        displayContactsRef.innerHTML += `
        <div class="contact_name_infos">
            <span style="background-color: ${contact.initial_bg}" class="contact_initials">${contact.contact_initials}</span>
        </div>
        `;
    }
}

function renderTaskContactEditViewNotChoosen(contactsRef, contact, i, taskIndex) {
    contactsRef.innerHTML += /*html*/ `
          <article class="task_contact_item" id="contact_${i}" onclick="selectTaskContactEditView('contact_${i}', ${i}, ${taskIndex})">
            <div class="contact_name_infos">
                <span style="background-color: ${contact.initial_bg}" class="contact_initials">${contact.contact_initials}</span>
                <span>${contact.contact_name}</span>
            </div>
            <img src="assets/img/contact_check_btn.png" alt="Bild einer Dropbox">
            </article>
        `
}

function renderTaskContactEditViewContactChoosen(contactsRef, contact, i, taskIndex) {
    contactsRef.innerHTML += /*html*/ `
          <article class="task_contact_item bg_choosen_contact" id="contact_${i}" onclick="selectTaskContactEditView('contact_${i}', ${i}, ${taskIndex})">
            <div class="contact_name_infos">
                <span style="background-color: ${contact.initial_bg}" class="contact_initials">${contact.contact_initials}</span>
                <span>${contact.contact_name}</span>
            </div>
            <img src="assets/img/check_btn_checked.png" alt="Bild einer Dropbox">
            </article> `
}

function checkForAssignedContact(contact, currentTask) {
    if (!currentTask.assigned_contacts) return false;
    return currentTask.assigned_contacts.some(c => c.contact_id === contact.contact_id);
}

async function setTaskChanges(taskIndex) {
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
    openDetailedTaskCard(taskIndex);
    closeEditCardDialog();
}

function closeEditCardDialog() {
    let cardEditView = document.getElementById('detailed_task_card_dialog_edit_view');
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

function renderSubtaskListEditView() {
    let listRef = document.getElementById('subtask_list_edit');
    listRef.innerHTML = '';

    if (!currentTask.subtasks) {
        currentTask.subtasks = [];
    }

    for (let i = 0; i < currentTask.subtasks.length; i++) {
        const subtask = currentTask.subtasks[i];
        if (typeof subtask === 'object' && subtask.subtask) {
            listRef.innerHTML += /*html*/`
        <div class="subtask_item">
            <input maxlength="35" id="subtask_edit_${i}" type="text" value="${subtask.subtask}">
            <div class="subtask_edit_input_icon_section">
                <img onclick="editSubtaskInputEditView('${i}')" src="assets/img/subtasks_icon_edit.png" alt="Edit-Icon">
                <div class="subtask_border"></div>
                <img onmousedown="deleteSubtaskEditView('${i}', event)" src="assets/img/subtasks_icon_delete.png" alt="Löschen-Icon">
            </div>
            <div class="subtask_edit_input_icon_section_focused">
                <img onmousedown="deleteSubtaskEditView('${i}', event)" src="assets/img/subtasks_icon_delete.png" alt="Löschen-Icon">
                <div class="subtask_border"></div>
                <img onmousedown="editSubtaskListEditView('${i}', event)" src="assets/img/subtasks_icon_check.png" alt="Bestätigung-Icon">
            </div>
        </div> 
    `;
        }
    }
}

function addSubtaskInputEditView(event) {
    if (event) event.preventDefault();
    let inputRef = document.getElementById('task_subtasks_edit');
    let subtask = inputRef.value;

    if (!subtask.trim()) return;

    if (!currentTask.subtasks) {
        currentTask.subtasks = [];
    }

    currentTask.subtasks.push({ "subtask": subtask, "subtask_status": "to_do" });
    renderSubtaskListEditView();
    inputRef.value = '';
    inputRef.focus();
}

function clearSubtaskInputEditView(event) {
    if (event) event.preventDefault();
    let inputRef = document.getElementById('task_subtasks_edit');
    inputRef.value = '';
    inputRef.focus();
}

function deleteSubtaskEditView(i, event) {
    if (event) event.preventDefault();
    currentTask.subtasks.splice(i, 1);
    renderSubtaskListEditView();
}

function editSubtaskInputEditView(i) {
    let inputRef = document.getElementById(`subtask_edit_${i}`);
    inputRef.focus();
}

function editSubtaskListEditView(i, event) {
    if (event) event.preventDefault();
    let subtask = document.getElementById(`subtask_edit_${i}`);
    currentTask.subtasks[i].subtask = subtask.value;
    renderSubtaskListEditView();
}