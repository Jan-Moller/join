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
            "status": tasksResponse[taskKey].task_status,
            "task_due_date": tasksResponse[taskKey].task_due_date,
            "task_priority": tasksResponse[taskKey].task_priority, 
              }
        )
        console.log(tasks);

    }
}