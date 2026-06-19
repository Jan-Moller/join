let userContacts = [];

async function renderAllContacts() {
    await getContactData();
    let contactsListRef = document.getElementById('contact_list');
    contactsListRef.innerHTML = '';

    userContacts.sort((a, b) => a.contact_name.localeCompare(b.contact_name));

    let currentLetter = '';
    for (let i = 0; i < userContacts.length; i++) {
        const contact = userContacts[i];
        let firstLetter = contact.contact_name.charAt(0).toUpperCase();

        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            contactsListRef.innerHTML += `<div class="contact_list_letter_header">${currentLetter}</div>`;
        }
        contactsListRef.innerHTML += renderContactFromAllContacts(contact.contact_id, contact.contact_name, contact.contact_initials, contact.initial_bg, contact.contact_mail);

    }
}

async function getContactData() {
    userContacts = [];
    let userKey = loadCurrentUser()
    let contactsResponse = await getData(`users/${userKey}/contacts`)

    if (!contactsResponse) return;
    let contactsKeyArray = Object.keys(contactsResponse);

    for (let i = 0; i < contactsKeyArray.length; i++) {
        const contactElement = contactsKeyArray[i];
        userContacts.push({
            "contact_initials": contactsResponse[contactElement].contact_initials,
            "contact_mail": contactsResponse[contactElement].contact_mail,
            "contact_name": contactsResponse[contactElement].contact_name,
            "contact_phone": contactsResponse[contactElement].contact_phone,
            "initial_bg": contactsResponse[contactElement].initial_bg,
            "contact_id": contactElement,
            "tasks_assigned": [],
        })
    }
    userContacts.sort((a, b) => a.contact_name.localeCompare(b.contact_name))
}

function openAddContactDialog() {
    let dialogRef = document.getElementById('add_contact_dialog_ref');
    dialogRef.showModal();
    renderAddContactDialog(dialogRef);
}

function closeAddContactDialog() {
    let dialogRef = document.getElementById('add_contact_dialog_ref');
    dialogRef.classList.add('closing');
    dialogRef.addEventListener('animationend', () => {
        dialogRef.classList.remove('closing');
        dialogRef.close();
    }, { once: true });
}

async function createContact() {
    let userKey = loadCurrentUser();
    let name = document.getElementById('contact_name');
    let strName = name.value.split(' ').map(w => w[0]).join('');
    let initials = strName.length > 1 ? strName[0] + strName.at(-1) : strName[0];
    let mail = document.getElementById('contact_email');
    let phone = document.getElementById('contact_phone');
    let newContact = {
        "contact_name": name.value.charAt(0).toUpperCase(0) + name.value.slice(1),
        "contact_initials": initials.toUpperCase(),
        "contact_mail": mail.value,
        "contact_phone": phone.value,
        "initial_bg": getRandomColor(),
        "tasks_assgined": [],
    }
    await postData(`users/${userKey}/contacts`, data = newContact);
    renderAllContacts();
    closeAddContactDialog();
}

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
}

function showCurrentContact(contact_id) {
    let contactRef = document.getElementById('current_contact_ref');
    contactRef.innerHTML = '';

    const contact = userContacts.find(c => c.contact_id === contact_id);
    if (!contactRef || !contact) return;
    renderCurrentContactDetails(
        contactRef,
        contact.contact_id,
        contact.contact_name,
        contact.contact_initials,
        contact.initial_bg,
        contact.contact_mail,
        contact.contact_phone
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteContact(contact_id) {
    let contactRef = document.getElementById('current_contact_ref');
    let dialogRef = document.getElementById('add_contact_dialog_ref');
    let userKey = loadCurrentUser();
    await deleteData(`users/${userKey}/contacts/${contact_id}`);
    await renderAllContacts();
    contactRef.innerHTML = '';
    if (dialogRef.open) { closeAddContactDialog(); }
}

function openContactDetailsEditMode(contact_id) {
    let contactRef = document.getElementById('add_contact_dialog_ref');
    contactRef.showModal();

    const contact = userContacts.find(c => c.contact_id === contact_id);
    if (!contactRef || !contact) return;
    renderEditContactDialog(
        contactRef,
        contact.contact_id,
        contact.contact_name,
        contact.contact_initials,
        contact.initial_bg,
        contact.contact_mail,
        contact.contact_phone
    );
}

async function editContact(contact_id, contact_bg) {
    let userKey = loadCurrentUser();
    let name = document.getElementById('contact_name');
    let strName = name.value.split(' ').map(w => w[0]).join('');
    let initials = strName.length > 1 ? strName[0] + strName.at(-1) : strName[0];
    let mail = document.getElementById('contact_email');
    let phone = document.getElementById('contact_phone');
    let newContact = {
        "contact_name": name.value.charAt(0).toUpperCase(0) + name.value.slice(1),
        "contact_initials": initials.toUpperCase(),
        "contact_mail": mail.value,
        "contact_phone": phone.value,
        "initial_bg": contact_bg,
        "tasks_assgined": [],
    }
    await updateContactData(contact_id, newContact, userKey)

}

async function updateContactData(contact_id, newContact, userKey) {
    await putData(`users/${userKey}/contacts/${contact_id}`, data = newContact);
    await renderAllContacts();
    let update_contacts = await findAllTasksForContact(contact_id, userKey);
    await updateAssignedContactsinBoard(update_contacts);
    showCurrentContact(contact_id);
    closeAddContactDialog();
}

async function findAllTasksForContact(contact, userKey) {
    let tasksResponse = await getData(`users/${userKey}/tasks/`);
    let results = [];

    if (!tasksResponse) {
        return [];
    }
    let taskKeys = Object.keys(tasksResponse);
    for (let i = 0; i < taskKeys.length; i++) {
        const taskKey = taskKeys[i];
        const assigned = tasksResponse[taskKey].assigned_contacts || [];

        const match = assigned.find(t => t.contact_id === contact);
        if (match) {
            results.push({
                task_id: taskKey,
                contact_id: contact
            })}
    }
    return results;
}

async function updateAssignedContactsinBoard(update_contacts) {
    
    
};
