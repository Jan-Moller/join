function renderSubtaskList() {
    let listRef = document.getElementById('subtask_list');
    listRef.innerHTML = '';

    for (let i = 0; i < newTask.subtasks.length; i++) {
        const subtask = newTask.subtasks[i];
        listRef.innerHTML += /*html*/`
        <div class="subtask_item">
            <input maxlength="35" id="subtask_${i}" type="text" value="${subtask}">
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
    `
    }

}