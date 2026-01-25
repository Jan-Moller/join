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

function showTaskCategoryDropdown() {
    let content = document.getElementById('category_dropdown_content');
    let dropdown_icon_open = document.getElementById('categroy_dropdown_icon_open');
    let dropdown_icon_close = document.getElementById('categroy_dropdown_icon_close');
    content.classList.toggle('show');
    dropdown_icon_open.classList.toggle('d_none');
    dropdown_icon_close.classList.toggle('d_none');

}

function selectTaskCategory(category) {
    let content = document.getElementById('category_dropdown_btn');
    content.innerHTML = category;
}