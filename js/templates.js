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

function renderDetailedTaskCard(taskIndex, task, categoryClass, due_date, taskPriority, taskPriorityImg, assignedContactsHTML, subtask) {
    let card = document.getElementById('detailed_task_card_dialog');
    card.innerHTML = '';
    card.innerHTML = /*html*/ `
    <article>
        <header class="board_detailed_card_header">
            <span class="board_task_card_${categoryClass}">${task.task_category}</span>
            <img onclick="closeDetailedCardDialog()" class="closeDetailedCardBtn" src="/assets/img/close.png" alt="Schließen Button">
        </header>
        <h2 class="board_detailed_card_title">${task.task_title}</h2>
        <p class="board_detailed_card_description">${task.task_description}</p>
        <section>
            <article class="detailed_task_card_infos">
                <span class="detailed_task_subheadline">Due date:</span>
                <span>${due_date}</span>
            </article>
            <article class="detailed_task_card_infos">
                <span class="detailed_task_subheadline">Priority:</span>
                <div class="detailed_task_priority_task"><span>${taskPriority}</span> <span>${taskPriorityImg}</span></div>
            </article>
            <article>
                <span class="detailed_task_subheadline">Assigned To:</span>
                <div>${assignedContactsHTML}</div>
            </article>
             <article>
                <span class="detailed_task_subheadline">Subtask:</span>
                <div>${subtask}</div>
            </article>
            <footer class="detailed_task_card_footer">
                <article onclick="deleteTaskFromBoard('${task.task_id}', '${taskIndex}' )" class="detailed_task_card_footer_article">
                    <img src="/assets/img/subtasks_icon_delete.png" alt="Löschen-Symbol">
                    <span>Delete</span>
                </article>
                <span class="footer_border"></span>
                <article onclick="openDetailedTaskCardEditView('${taskIndex}')" class="detailed_task_card_footer_article">
                    <img src="/assets/img/subtasks_icon_edit.png" alt="Bearbeitungssymbol">
                    <span>Edit</span>
                </article>
            </footer>
        </section>
    </article>
    `
}

function renderDetailedTaskCardEditView(taskIndex, task, categoryClass, due_date, taskPriority, taskPriorityImg, assignedContactsHTML, subtask) {
    let card = document.getElementById('detailed_task_card_dialog_edit_view');
    card.innerHTML = '';
    card.innerHTML = /*html*/ `
    <article>
        <header class="board_detailed_card_header">
            <span></span>
            <img onclick="closeDetailedCardDialogEditView()" class="closeDetailedCardBtn" src="/assets/img/close.png" alt="Schließen Button">
        </header>
        <article class="detailed_card_edit_view_info_article">
            <span>Title</span>
            <input class="" value="${task.task_title}">
            <div class="edit_view_error_message"></div>
        </article>
        <article class="detailed_card_edit_view_info_article">
            <span>Description</span>
            <input value="${task.task_description}">
            <div class="edit_view_error_message"></div>
        </article>
       <article class="detailed_card_edit_view_info_article">
                <span>Due Date</span>
                <input type="date" value="${due_date}">
        </article>
            <article class="detailed_task_card_infos detailed_task_card_info_prio">
                <span class="detailed_task_subheadline">Priority:</span>
                <section class="board_edit_task_priority_btns">
                        <div class="board_edit_task_priority_element" onclick="editTaskPriority('urgent', '${taskIndex}')" id="board_urgent_task">
                            Urgent <img src="assets/img/urgent_prio_icon.png" alt="Urgent Icon"></div>
                        <div class="board_edit_task_priority_element" onclick="editTaskPriority('medium', '${taskIndex}')" id="board_medium_task">
                            Medium <img src="assets/img/medium_prio_icon.png" alt="Medium Icon"></div>
                        <div class="board_edit_task_priority_element" onclick="editTaskPriority('low', '${taskIndex}')" id="board_low_task">
                            Low<img src="assets/img/low_prio_icon.png" alt="Low Icon">
                        </div>
                    </section>
            </article>
            <article>
                <span class="detailed_task_subheadline">Assigned To:</span>
                <div>${assignedContactsHTML}</div>
            </article>
             <article>
                <span class="detailed_task_subheadline">Subtask:</span>
                <div>${subtask}</div>
            </article>
            <footer class="detailed_task_card_footer">
                <article onclick="deleteTaskFromBoard('${task.task_id}', '${taskIndex}' )" class="detailed_task_card_footer_article">
                    <img src="/assets/img/subtasks_icon_delete.png" alt="Löschen-Symbol">
                    <span>Delete</span>
                </article>
                <span class="footer_border"></span>
                <article onclick="openDetailedTaskCardEditView()" class="detailed_task_card_footer_article">
                    <img src="/assets/img/subtasks_icon_edit.png" alt="Bearbeitungssymbol">
                    <span>Edit</span>
                </article>
            </footer>
    </article>
    `
}