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
                <img onmousedown="deleteSubtask('${i}', event)" src="assets/img/subtasks_icon_delete.png" alt="Löschen-Icon">
            </div>
            <div class="subtask_edit_input_icon_section_focused">
                <img onmousedown="deleteSubtask('${i}', event)" src="assets/img/subtasks_icon_delete.png" alt="Löschen-Icon">
                <div class="subtask_border"></div>
                <img onmousedown="editSubtaskList('${i}', event)" src="assets/img/subtasks_icon_check.png" alt="Bestätigung-Icon">
            </div>
        </div> 
    `;
        }
    }
}

function renderBoardTaskCard(task, categoryClass, total_subtasks, totalSubtasksDone, subtaskRatio, taskPrio, contactInitials, taskIndex) {
    let card = document.getElementById(`board_task_card_${task.task_status}`);
    card.innerHTML += /*html*/ `

    <article draggable="true" ondragstart="startDragging(${taskIndex})" class="board_task_card" onclick="openDetailedTaskCard(${taskIndex})">
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

function renderDetailedTaskCardEditView(cardEditView, taskIndex, task, categoryClass, due_date, taskPriority, taskPriorityImg, assignedContactsHTML, subtask) {
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
            <input  id="task_title_edit_view" value="${task.task_title}">
            <div class="edit_view_error_message"></div>
        </article>
        <article class="detailed_card_edit_view_info_article">
            <span>Description</span>
            <input id="task_description_edit_view" value="${task.task_description}">
            <div class="edit_view_error_message"></div>
        </article>
       <article class="detailed_card_edit_view_info_article">
                <span>Due Date</span>
                <input id="task_date_edit_view" type="date" value="${due_date}">
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
                 <section class="contacts_dropdown">
                        <div class="contacts_dropdown_wrapper" onclick="showContactsDropdownEdit()">
                            <input type="text" class="contacts_dropdown_btn"
                                placeholder="Select contacts to assign" readonly>
                            <img id="contacts_dropdown_icon_close_edit" class="contacts_dropdown_icon"
                                src="assets/img/arrow_drop_down_closed.png" alt="Pfeilbild geschlossen">
                            <img id="contacts_dropdown_icon_open_edit" class="contacts_dropdown_icon d_none"
                                src="assets/img/arrow_drop_down_open.png" alt="Pfeilbild offen">
                        </div>
                        <article id="choosen_task_contacts_section" class="choosen_task_contacts_section"></article>
                        <div id="contacts_dropdown_content_edit" class="contacts_dropdown_content">
                        </div>
                    </section>
                    <section class="assigned_contacts_to_task">  
                        <div id="choosen_task_contacts_section_edit" class="choosen_task_contacts_section">${assignedContactsHTML}</div>
                    </section>
            </article>
             <article class="detailed_task_subheadline_board">
                <span class="detailed_task_subheadline">Subtask:</span>
               
                <article class="add_task_input_element">
                    <input maxlength="35" placeholder="Add new Subtask" id="task_subtasks_edit" type="text"
                        onkeydown="if(event.key === 'Enter') { event.preventDefault(); addSubtaskInputEditView(); } else if(event.key === 'Escape') { event.preventDefault(); clearSubtaskInputEditView(); }">
                    <div class="subtask_input_icon_section_board">
                        <img onmousedown="clearSubtaskInputEditView(event)" src="assets/img/subtasks_icon_cancel.png"
                            alt="Storno-Icon">
                        <div class="subtask_border"></div>
                        <img onmousedown="addSubtaskInputEditView(event)" src="assets/img/subtasks_icon_check.png"
                            alt="Bestätigung-Icon">
                    </div>
                    <div id="subtask_list_edit" class="subtask_list"></div>
                </article>
            </article>
            <footer class="detailed_task_card_footer">
                <article onclick="setTaskChanges(${taskIndex})" class="detailed_task_card_footer_article">
                    <button>Ok ✓</button>
                </article>
            </footer>
    </article>
    `
} 

function renderAddContactDialog(dialogRef) {
    dialogRef.innerHTML = /*html*/ `
     <div class="add_content_dialog_content">
            <aside class="add_contact_dialog_aside">
                <img src="assets/img/join_logo_large.png" alt="Logo">
                <h1>Add contact</h1>
                <p>Tasks are better with a team!</p>
            </aside>
            <section class="add_contact_right_section">
                <img onclick="closeAddContactDialog()" class="contact_close_btn" src="assets/img/addtask_cancel.png" alt="Cancel Button">
                <article class="add_contact_form_section">
                    <img src="assets/img/contact_person_icon.png" alt="Personen Icon">
                    <form id="add_contact_form" action="" onsubmit="createContact(); return false">
                        <input required placeholder="Name" type="text" name="contact_name" id="contact_name">
                        <input required placeholder="Email" type="email" name="contact_email" id="contact_email">
                        <input required placeholder="Phone" type="tel" name="contact_pjone" id="contact_phone">
                        <article class="add_contact_buttons">
                            <button type="button" class="button_white" onclick="closeAddContactDialog()">Cancel</button>
                            <button type="submit" form="add_contact_form">Create contact</button>
                        </article>
                    </form>
                </article>
            </section>
        </div> `
}

function renderContactFromAllContacts(contact_id, contact_name, contact_initials, contact_bg, contact_mail) {
    return /*html*/ `
<article class="contact_list_item" onclick="showCurrentContact('${contact_id}')">
    <span style="background: ${contact_bg}"  class="contact_initials">${contact_initials}</span>
    <div class="contact_info_section">
        <span>${contact_name}</span>
        <a href="mailto:${contact_mail}">${contact_mail}</a>
    </div>
    
</article>
`
}

function renderCurrentContactDetails(contactRef, contact_id, contact_name, contact_initials, contact_bg, contact_mail, contact_phone) {
    contactRef.innerHTML = /*html*/ `
<section class="contact_detailed_info_header">
    <article class="main_contact_details_initials" style="background-color: ${contact_bg}">${contact_initials}</article>
    <article class="main_contact_details_name_section">
        <h2>${contact_name}</h2>
        <section class="main_contact_details_action_section"> 
            <div>
                <img src="/assets/img/delete.png" alt="">
                <span class="edit_contact_btn" onclick="openContactDetailsEditMode('${contact_id}')">Edit</span>
            </div>
            <div>
                <img src="/assets/img/edit.png" alt="">
                <span class="delete_contact_btn" onclick="deleteContact('${contact_id}')">Delete</span>
            </div>
        </section>
    </article>
</section>
<section class="contact_detailed_info_section">
    <h3>Contact Information</h3>

    <dl class="contact_details_list">
        <dt class="contact_details_label">Email</dt>
        <dd><a id="contact_details_mail" href="mailto:${contact_mail}">${contact_mail}</a></dd>
        <dt class="contact_details_label">Phone</dt>
        <dd><a id="contact_details_phone" href="tel:${contact_phone}">${contact_phone}</a></dd>
    </dl>

</section>
`
}

function renderEditContactDialog(contactRef, contact_id, contact_name, contact_initials, contact_bg, contact_mail, contact_phone) {
    contactRef.innerHTML = /*html*/ `
     <div class="add_content_dialog_content">
            <aside class="add_contact_dialog_aside">
                <img src="assets/img/join_logo_large.png" alt="Logo">
                <h1>Edit contact</h1>
            </aside>
            <section class="add_contact_right_section">
                <img onclick="closeAddContactDialog()" class="contact_close_btn" src="assets/img/addtask_cancel.png" alt="Cancel Button">
                <article class="add_contact_form_section">
                    <article class="edit_contact_details_initials" style="background-color: ${contact_bg}">${contact_initials}</article>
                    <form id="add_contact_form" action="" onsubmit="editContact('${contact_id}', '${contact_bg}'); return false">
                        <input value="${contact_name}" required placeholder="Name" type="text" name="contact_name" id="contact_name">
                        <input value="${contact_mail}" required placeholder="Email" type="email" name="contact_email" id="contact_email">
                        <input value="${contact_phone}" required placeholder="Phone" type="tel" name="contact_pjone" id="contact_phone">
                        <article class="add_contact_buttons">
                            <button type="button" onclick="deleteContact('${contact_id}')"class="button_white">Delete</button>
                            <button type="submit" form="add_contact_form">Save</button>
                        </article>
                    </form>
                </article>
            </section>
        </div> `
}
