let newTask = {
    'task_title': '',
    'task_description': '',
    'task_due_date': '',
    'task_priority': '',
    'assigned_contacts': [],
    'task_category': '',
    'subtasks': [],
}

function setTaskPriority(prio) {
    let priority = document.getElementById(`${prio}` + '_task');

    if (priority.classList.contains(`${prio}` + '_task')) {
        priority.classList.remove(`${prio}` + '_task');
    } else {
        removeTaskPriority();
        priority.classList.add(`${prio}` + '_task');
    }
}

function removeTaskPriority() {
    let prios = ['urgent', 'medium', 'low']
    for (let i = 0; i < prios.length; i++) {
        const prio = prios[i];
        if (document.getElementById(prio + '_task').classList.contains(prio + '_task')) { document.getElementById(prio + '_task').classList.remove(prio + '_task') }
    }
}

function showContactsDropdown() {
    let content = document.getElementById('contacts_dropdown_content');
    let dropdown_icon_open = document.getElementById('contacts_dropdown_icon_open');
    let dropdown_icon_close = document.getElementById('contacts_dropdown_icon_close');
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
        console.log(contact);

    }
}
function showTaskCategoryDropdown() {
    let content = document.getElementById('category_dropdown_content');
    let dropdown_icon_open = document.getElementById('categroy_dropdown_icon_open');
    let dropdown_icon_close = document.getElementById('categroy_dropdown_icon_close');
    content.classList.toggle('show');
    dropdown_icon_open.classList.toggle('d_none');
    dropdown_icon_close.classList.toggle('d_none');

}

function selectTaskCategory(category) {
    let contentBtn = document.getElementById('category_dropdown_btn');
    let content = document.getElementById('category_dropdown_content');
    contentBtn.innerHTML = category;
    content.classList.toggle('show');
}

function addSubtaskInput() {
    let inputRef = document.getElementById('task_subtasks');
    let subtask = inputRef.value;
    newTask.subtasks.push(subtask);
    renderSubtaskList();
    inputRef.value = '';
}

function clearSubtaskInput() {
    let inputRef = document.getElementById('task_subtasks');
    inputRef.value = '';
}

function deleteSubtask(i) {
    newTask.subtasks.splice(i, 1);
    renderSubtaskList();
}

function editSubtaskInput(i) {
    let inputRef = document.getElementById(`subtask_${i}`);
    inputRef.focus();
}

function editSubtaskList(i){
    let subtask = document.getElementById(`subtask_${i}`);
    newTask.subtasks[i] = subtask.value; 
    renderSubtaskList();
}

