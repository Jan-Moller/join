let newTask = {
    'task_title': '',
    'task_description': '',
    'task_due_date': '',
    'task_priority': '',
    'assigned_contacts': [],
    'task_category': '',
    'subtasks': [],
    'task_status': ''
}

function initAddTask() {
    init('nav_item_add_task')
}

function setTaskPriority(prio) {
    let priority = document.getElementById(`${prio}` + '_task');

    if (priority.classList.contains(`${prio}` + '_task')) {
        priority.classList.remove(`${prio}` + '_task');
        newTask.task_priority = '';
    } else {
        removeTaskPriority();
        priority.classList.add(`${prio}` + '_task');
        newTask.task_priority = prio;
    }
}

function removeTaskPriority() {
    let prios = ['urgent', 'medium', 'low']
    for (let i = 0; i < prios.length; i++) {
        const prio = prios[i];
        if (document.getElementById(prio + '_task').classList.contains(prio + '_task')) { document.getElementById(prio + '_task').classList.remove(prio + '_task') }
    }
    newTask.task_priority = '';
}

function showContactsDropdown() {
    let content = document.getElementById('contacts_dropdown_content');
    let dropdown_icon_open = document.getElementById('contacts_dropdown_icon_open');
    let dropdown_icon_close = document.getElementById('contacts_dropdown_icon_close');
    content.classList.toggle('show');
    dropdown_icon_open.classList.toggle('d_none');
    dropdown_icon_close.classList.toggle('d_none');
}

function showContactsDropdownEdit() {
    let content = document.getElementById('contacts_dropdown_content_edit');
    let dropdown_icon_open = document.getElementById('contacts_dropdown_icon_open_edit');
    let dropdown_icon_close = document.getElementById('contacts_dropdown_icon_close_edit');
    content.classList.toggle('show');
    dropdown_icon_open.classList.toggle('d_none');
    dropdown_icon_close.classList.toggle('d_none');
}

function selectTaskContact(id) {
    let contactRef = document.getElementById(id);
    let img = contactRef.querySelector('img');
    contactRef.classList.toggle('bg_choosen_contact');

    if (contactRef.classList.contains('bg_choosen_contact')) {
        img.src = "assets/img/check_btn_checked.png";
        newTask.assigned_contacts.push(id)
    } else {
        img.src = "assets/img/contact_check_btn.png";
        const index = newTask.assigned_contacts.indexOf(id);
        if (index > -1) {
            newTask.assigned_contacts.splice(index, 1);
        }
    }
    showSelectedTaskContacts()
}

function showSelectedTaskContacts() {
    let displayContactsRef = document.getElementById('choosen_task_contacts_section');
    displayContactsRef.innerHTML = '';
    for (let i = 0; i < newTask.assigned_contacts.length; i++) {
        const contact = newTask.assigned_contacts[i];
        displayContactsRef.innerHTML += `${contact}`;
    }
}

function showTaskCategoryDropdown() {
    let content = document.getElementById('category_dropdown_content');
    let dropdown_icon_open = document.getElementById('category_dropdown_icon_open');
    let dropdown_icon_close = document.getElementById('category_dropdown_icon_close');
    content.classList.toggle('show');
    dropdown_icon_open.classList.toggle('d_none');
    dropdown_icon_close.classList.toggle('d_none');
}

function selectTaskCategory(category) {
    let contentBtn = document.getElementById('category_dropdown_btn');
    let content = document.getElementById('category_dropdown_content');
    contentBtn.innerHTML = category;
    content.classList.toggle('show');
    newTask.task_category = category;
}

function addSubtaskInput(event) {
    if (event) event.preventDefault();
    let inputRef = document.getElementById('task_subtasks');
    let subtask = inputRef.value;
    if (!subtask.trim()) return;
    newTask.subtasks.push( {"subtask": subtask, "subtask_status": "to_do"});
    renderSubtaskList();
    inputRef.value = '';
    inputRef.focus();
}

function clearSubtaskInput(event) {
    if (event) event.preventDefault();
    let inputRef = document.getElementById('task_subtasks');
    inputRef.value = '';
    inputRef.focus();
}

function deleteSubtask(i, event) {
    if (event) event.preventDefault();
    newTask.subtasks.splice(i, 1);
    renderSubtaskList();
}

function editSubtaskInput(i) {
    let inputRef = document.getElementById(`subtask_${i}`);
    inputRef.focus();
}

function editSubtaskList(i, event) {
    if (event) event.preventDefault();
    let subtask = document.getElementById(`subtask_${i}`);
    newTask.subtasks[i].subtask = subtask.value;
    renderSubtaskList();
}

async function addTask() {
    if (!checkRequiredInputElements()) {
        return;
    }
    
    let title = document.getElementById('task_title');
    let description = document.getElementById('task_description');
    let due_date = document.getElementById('task_due_date');

    newTask.task_title = title.value;
    newTask.task_description = description.value;
    newTask.task_due_date = due_date.value;

    await addTaskData();
    showSuccessfullTaskDialog();
}

function clearTaskFormular() {
    let title = document.getElementById('task_title');
    let description = document.getElementById('task_description');
    let due_date = document.getElementById('task_due_date');
    let contacts = document.getElementById('choosen_task_contacts_section');
    let category = document.getElementById('category_dropdown_btn');
    let subtasks = document.getElementById('subtask_list');
    title.value = '';
    description.value = '';
    due_date.value = '';
    due_date.type = 'text';
    contacts.innerHTML = '';
    category.innerHTML = 'Select task category';
    subtasks.innerHTML = '';
    clearTaskVar()
}

function clearTaskVar() {
    newTask.assigned_contacts = '';
    newTask.task_category = '';
    newTask.subtasks = '';
    removeTaskPriority();
}

function checkRequiredInputElements() {
    let title = document.getElementById('task_title');
    let due_date = document.getElementById('task_due_date');
    let category = document.getElementById('category_dropdown');
    let isValid = true;

    title.classList.remove('error_message');
    due_date.classList.remove('error_message');
    category.classList.remove('error_message');

    isValid = checkRequiredTaskTitle(isValid, title);
    isValid = checkRequiredTaskDate(isValid, due_date) && isValid;
    isValid = checkRequiredTaskCategory(isValid, category) && isValid;

    return isValid;
}

function checkRequiredTaskTitle(isValid, title) {
    if (title.value == '') {
        title.classList.add('error_message');
        document.getElementById('title_error_msg').innerHTML = 'This field is required';
        isValid = false;
    }
    else { document.getElementById('title_error_msg').innerHTML = ''; }
    return isValid
}

function checkRequiredTaskDate(isValid, due_date) {
    if (due_date.value == '') {
        due_date.classList.add('error_message');
        document.getElementById('due_date_error_msg').innerHTML = 'This field is required'
        isValid = false;
    }
    else { document.getElementById('due_date_error_msg').innerHTML = ''; }

    return isValid
}

function checkRequiredTaskCategory(isValid, category) {
    if (newTask.task_category == '') {
        category.classList.add('error_message');
        document.getElementById('task_category_error_msg').innerHTML = 'This field is required'
        isValid = false;
    }
    else { document.getElementById('task_category_error_msg').innerHTML = ''; }

    return isValid
}

async function addTaskData() {
    let userKey = sessionStorage.getItem('currentUserKey')
    await postData(`/users/${userKey}/tasks`, data = newTask);
}

function showSuccessfullTaskDialog() {
    let addTaskBoardDialog = document.getElementById('add_task_board_dialog');
    if (addTaskBoardDialog && addTaskBoardDialog.open) {
        addTaskBoardDialog.close();
    }
    let dialog = document.getElementById('task_dialog');
    dialog.showModal();
    setTimeout(() => {
        dialog.close();
        window.location.href = 'board.html';
    }, 2000);
}