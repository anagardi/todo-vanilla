const port = 8000;

const url = `http://localhost:${port}/api/item`;

const newTask = document.getElementById("new-task");

function animateButtonOnClick(button) {
    button.addEventListener("mousedown", function () {
        button.classList.add("pressed");
    });

    button.addEventListener("mouseup", function () {
        button.classList.remove("pressed");
    });
}

function initDate() {
    let date = new Date().toDateString();
    document.getElementById("date").innerText = date;
}

function renderList(list) {

    document.getElementById("tasks").innerHTML = '';

    for (let i = 0; i < list.length; i++) {

        let li = document.createElement("li");

        let checked = '';
        let complete = '';
        let disabled = '';

        if (list[i].complete) {
            checked = "checked";
            complete = "complete"
            disabled = "disabled";
        }

        li.innerHTML = `<div id=${list[i].id} class='wrapper task'>` +
            "<input type='button' class='btn check " + checked + "' onclick='handleClickCheck(" + list[i].id + ")'>" +
            "<input type='text' class='title " + complete + "' value='" + list[i].title + "' readonly>" +
            "<input type='button' class='btn edit " + disabled + "' onclick='handleClickEdit(" + list[i].id + ")'>" +
            "<input type='button' class='btn delete' onclick='handleClickDelete(" + list[i].id + ")'>" +
            "</div>";

        document.getElementById("tasks").appendChild(li);
    }
}

async function getTodos() {

    try {
        const respons = await fetch(url);
        const data = await respons.json();
        renderList(data);
    } catch (error) {
        console.log(error);
    }
}

async function handleClickAdd() {

    if (newTask.value != '') {

        const respons = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                title: newTask.value,
                complete: false,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const json = await respons.json();
        console.log(json);
        newTask.value = "";
        return getTodos();
    }
}

async function handleClickCheck(i) {

    // console.log(i);

    var li = document.getElementById(i);

    // console.log(li);

    let check = li.querySelector(".check");
    let title = li.querySelector(".title");
    let editBtn = li.querySelector(".edit");

    // console.log(title);

    if (check.classList.contains("checked")) {
        check.classList.remove("checked");
        title.classList.remove("complete");
        editBtn.classList.remove("disabled");
    }
    else {
        check.classList.add("checked");
        title.classList.add("complete");
        editBtn.classList.add("disabled");
    }

    if (title.value === '') {
        handleClickDelete(i);
    }
    else {

        const respons = await fetch(url + '/' + i, {
            method: 'PUT',
            body: JSON.stringify({
                title: title.value,
                complete: check.classList.contains("checked"),
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    }
}

async function handleClickEdit(i) {

    var li = document.getElementById(i);

    let title = li.querySelector(".title");

    if (title.classList.contains("complete")) return;

    let editBtn = li.querySelector(".edit");

    if (title.value.length === 0) {
        handleClickDelete(i);
    } else {
        if (editBtn.classList.contains("pressed")) {

            title.classList.remove("editing");
            title.setAttribute("readonly", true);
            editBtn.classList.remove("pressed");

            const respons = await fetch(url + '/' + i, {
                method: 'PUT',
                body: JSON.stringify({
                    title: title.value,
                    complete: false,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then((respons) => respons.json())
                .then((json) => console.log(json));
            return getTodos();
        }
        else {
            editBtn.classList.add("pressed");
            title.classList.add("editing");
            title.removeAttribute("readonly");
            title.focus();
            let length = title.value.length;
            title.setSelectionRange(length, length);
        }
    }
}

async function handleClickDelete(i) {

    const respons = await fetch(url + '/' + i, {
        method: 'DELETE',
    })
        .then(() => console.log(`task ${i} deleted`));

    return getTodos();
}

animateButtonOnClick(document.querySelector(".add"));

initDate();

getTodos();