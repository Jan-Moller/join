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

function renderBoardTaskCard() {
    let card = document.getElementById('board_task_card_in_progress');
    card.innerHTML = '';
    card.innerHTML += /*html*/ `

    <article class="board_task_card">
        <span class="board_task_card_user_story">User Story</span>
        <h4>Kochwelt Page & Recipe Recommender</h4>
        <p>Build start page with recipe recommendation...</p>
        <section class="board_card_subtask_section">
            <div class="w3-light-grey">
                <div class="w3-blue" style="width:75%"></div>
            </div>
            <span class="bord_card_subtask_amount"><div>1</div>/<div>2</div><span class="board_card_subtaks_text">Subtasks</span></span>
        </section>
        <section>
        
        </section>
    </article>

    `
}