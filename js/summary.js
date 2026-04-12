let tasks = []

async function initSummary() {
    init('nav_item_summary');
    await getCurrentTaskData()
}

async function getCurrentTaskData() {
    let userKey = sessionStorage.getItem('currentUserKey')
    let tasksResponse = await getData(`/users/${userKey}/tasks`);
    let taskKeyArray = Object.keys(tasksResponse);
    console.log(tasksResponse);


    for (let i = 0; i < taskKeyArray.length; i++) {
        const taskKey = taskKeyArray[i];
        tasks.push({
            "user_id": userKey,
            "task_id": taskKey,
            "task_status": tasksResponse[taskKey].task_status,
            "task_due_date": tasksResponse[taskKey].task_due_date,
            "task_priority": tasksResponse[taskKey].task_priority,
        }
        )
    }
    renderTaskSummary(tasks);
}

function renderTaskSummary(tasks) {
    let to_do_ref = document.getElementById('summary_task_to_do');
    let done_ref = document.getElementById('summary_task_done');
    let urgent_ref = document.getElementById('summary_task_urgent');
    let in_board_ref = document.getElementById('summary_task_in_board');
    let progress_ref = document.getElementById('summary_task_in_progress');
    let await_feedback_ref = document.getElementById('summary_task_awaiting_feedback');

    let amount_to_dos = tasks.filter((task) => task.task_status == 'To-do');
    let amount_done = tasks.filter((task) => task.task_status == 'Done');
    let amount_progress = tasks.filter((task) => task.task_status == 'Task in Progress');
    let amount_feedback = tasks.filter((task) => task.task_status == 'Awaiting Feedback');
    let amount_urgent = tasks.filter((task) => task.task_priority == 'urgent');
    let amount_in_board = tasks.length;
    getNextTaskDueDate(tasks);
    console.log(amount_in_board);

    to_do_ref.innerHTML = amount_to_dos.length;
    done_ref.innerHTML = amount_done.length;
    urgent_ref.innerHTML = amount_urgent.length;
    in_board_ref.innerHTML = amount_in_board;
    progress_ref.innerHTML = amount_progress.length;
    await_feedback_ref.innerHTML = amount_feedback.length;
}

function getNextTaskDueDate() {
    let due_date_ref = document.getElementById('summary_task_due_date');
    let next_due_date_array = tasks.filter((task) => task.task_priority == 'urgent' && task.task_due_date).map((task) => task.task_due_date);
    let closest = Infinity;
    const now = new Date();

    next_due_date_array.forEach(function (d) {
        const date = new Date(d);
        if (date >= now && (date < new Date(closest) || date < closest)) {
            closest = d;
        }
    });

    if (closest == Infinity) {
        due_date_ref.innerHTML = 'No urgent deadline'
    } else {
        due_date_ref.innerHTML = new Date(closest).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}

function forwardToBoardHTML() {
    window.location.href = 'board.html';
}