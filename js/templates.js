function renderSubtaskList() {
    let listRef = document.getElementById('subtask_list');
    listRef.innerHTML = '';

    for (let i = 0; i < newTask.subtasks.length; i++) {
        const subtask = newTask.subtasks[i];
        if (typeof subtask === 'object' && subtask.subtask) {
            listRef.innerHTML += /*html*/`
        <div class="subtask_item">
            <input maxlength="35" id="subtask_${i}" type="text" value="${subtask.subtask}">
            <div class="subtask_edit_input_icon_section">
                <img onclick="editSubtaskInput('${i}')" src="assets/img/subtasks_icon_edit.png" alt="Edit-Icon">
                <div class="subtask_border"></div>
                <img onmousedown="deleteSubtask('${i}')" src="assets/img/subtasks_icon_delete.png" alt="Löschen-Icon">
            </div>
            <div class="subtask_edit_input_icon_section_focused">
                <img onmousedown="deleteSubtask('${i}')" src="assets/img/subtasks_icon_delete.png" alt="Löschen-Icon">
                <div class="subtask_border"></div>
                <img onmousedown="editSubtaskList('${i}')" src="assets/img/subtasks_icon_check.png" alt="Bestätigung-Icon">
            </div>
        </div> 
    `;
        }
    }
}

function renderBoardTaskCard(task, categoryClass, total_subtasks, totalSubtasksDone, subtaskRatio, taskPrio, contactInitials, taskIndex) {
    let card = document.getElementById(`board_task_card_${task.task_status}`);
    card.innerHTML += /*html*/ `

    <article class="board_task_card" onclick="openDetailedTaskCard(${taskIndex})">
        <span class="board_task_card_${categoryClass}">${task.task_category}</span>
        <h4>${task.task_title}</h4>
        <p>${task.task_description}</p>
        <section class="board_card_subtask_section">
            <div class="w3-light-grey">
                <div class="w3-blue" style="width:${subtaskRatio}%"></div>
            </div>
            <span class="bord_card_subtask_amount"><div>${totalSubtasksDone}</div>/<div>${total_subtasks}</div><span class="board_card_subtaks_text">Subtasks</span></span>
        </section>
        <section class="assigned_contacts_section">
            <article class="assigned_contacts_to_task">  
                ${contactInitials}
            </article>
             ${taskPrio}
        </section>
    </article>

    `
}