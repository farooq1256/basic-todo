// showToastify function
function showToastify(msg, type) {
    let bgColor = "";
    switch (type) {
        case "success":
            bgColor = "green";
            break;
        case "error":
            bgColor = "red";
            break;
        default:
            bgColor = "#000";
            break;
    }
    Toastify({
        text: msg,
        duration: 3000,
        gravity: "bottom",
        position: "left",
        style: {
            background: bgColor,
        }
    }).showToast();
}
document.getElementById("appDateTask").style.display = "none"
// create getRandamId
const getRandamId = () => {
    return Math.random().toString(32).slice(2);
}

// handleSumbit function
const handleSubmit = (event) => {
    // event.preventDefault();
    
    let task = document.getElementById("task").value;
    task = task.trim();
    if (task.length < 3) {
        showToastify("Enter the correct task", "error");
        return;
    }
    let todo = {
        task
    };
    todo.id = getRandamId();
    todo.status = "active";

    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    showToastify("A new todo has been successfully added to the list", "success");
    document.getElementById("task").value = '';
    showTodos();
}

function showTodos() {
    document.getElementById("output").innerHTML = "";
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    if (!todos.length) {
        document.getElementById("output").innerHTML = "Sorry no todo has in list"
        return
    }
   
    let tableStart = '<div class="table-responsive"><table class="table">'
    let tableHead = '<thead><tr><th scope="col">#</th><th scope="col">Todo Task</th><th scope="col">Actions</th></tr></thead>';
    
    let tableEnd = ' </table></div>'
    
    let tableBody = ''
    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        tableBody += `<tr><th scope="row">${i + 1}</th><td>${todo.task}</td><td><button class="btn btn-sm btn-info" data-value="${todo.id}" onclick="editTodo(event)">Edit</button><button class="btn ms-2 btn-danger" data-value="${todo.id}" onclick="delTodo(event)">Delete</button></td></tr>`
    }
    // show result
    let table = tableStart + tableHead + "<tbody>" + tableBody + "</tbody>" + tableEnd
    document.getElementById("output").innerHTML = table;

    createPagination();
    displayRecords();
}

// update funcation
const editTodo = (event) => {
    let todoId = event.target.getAttribute('data-value');
    let todos = JSON.parse(localStorage.getItem("todos"));
    let todo = todos.find(todo => todo.id === todoId);
    const { task } = todo;
    document.getElementById("task").value = task;
    localStorage.setItem("appDateTodo", JSON.stringify(todo));
    document.getElementById("submit").style.display = "none";
    document.getElementById("appDateTask").style.display = "block";
}

// handel edit
const handleEdit = () => {
    let todoEdit = JSON.parse(localStorage.getItem("appDateTodo"));
    let updateTask = document.getElementById("task").value;
    const updatedTodo = { ...todoEdit, task: updateTask };

    const todos = JSON.parse(localStorage.getItem("todos"));
    let todoAfterUpdated = todos.map(todo => {
        if (todo.id === todoEdit.id) 
            return updatedTodo;
        return todo;
    });

    localStorage.setItem("todos", JSON.stringify(todoAfterUpdated));
    showToastify("A todo has been successfully updated", "success");
    showTodos();
    document.getElementById("task").value = '';
    document.getElementById("submit").style.display = "block";
    document.getElementById("appDateTask").style.display = "none";
}

// delete function
const delTodo = (event) => {
    let todoId = event.target.getAttribute('data-value');
    let todos = JSON.parse(localStorage.getItem("todos"));
    let todoAfterDelete = todos.filter(todo => todo.id !== todoId);
    localStorage.setItem("todos", JSON.stringify(todoAfterDelete));
    showToastify("A todo is successfully deleted from the list", "success");
    showTodos();
}

// filter function
const filterTodos = () => {
    let filter = document.getElementById("searchTask").value.toLowerCase();
    let rows = document.querySelectorAll("#output tbody tr");
    let todoFound = false;

    rows.forEach(row => {
        let task = row.getElementsByTagName("td")[0].innerText.toLowerCase();
        if (task.indexOf(filter) > -1) {
            row.style.display = "";
            todoFound = true;
        } else {
            row.style.display = "none";
        }
    });

    if (!todoFound) {
        document.getElementById("output").innerHTML = "Todo not found";
    }
}

// Pagination
let records_per_page = 5;
let current_page = 1;

document.getElementById("recode-size").addEventListener("change", (event) => {
    records_per_page = parseInt(event.target.value);
    current_page = 1;
    showTodos();
});

function displayRecords() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const start = (current_page - 1) * records_per_page;
    const end = Math.min(start + records_per_page, todos.length);
    let statement = '';

    for (let i = start; i < end; i++) {
        statement += `<tr><th scope="row">${i + 1}</th><td>${todos[i].task}</td><td><button class="btn btn-sm btn-info" data-value="${todos[i].id}" onclick="editTodo(event)">Edit</button><button class="btn ms-2 btn-danger" data-value="${todos[i].id}" onclick="delTodo(event)">Delete</button></td></tr>`;
    }

    document.getElementById("output").innerHTML = `<div class="table-responsive"><table class="table"><thead><tr><th scope="col">#</th><th scope="col">Todo Task</th><th scope="col">Actions</th></tr></thead><tbody>${statement}</tbody></table></div>`;
    updatePagination();
}

function createPagination() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const total_pages = Math.ceil(todos.length / records_per_page);
    let paginationHTML = '';

    paginationHTML += `<li class="page-item"><a class="page-link" id="prevBtn" href="javascript:void(0)" onclick="prevPage()" tabindex="-1" aria-disabled="true">Previous</a></li>`;
    for (let i = 1; i <= total_pages; i++) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="goToPage(${i})">${i}</a></li>`;
    }
    paginationHTML += `<li class="page-item"><a class="page-link" id="nextBtn" href="javascript:void(0)" onclick="nextPage()">Next</a></li>`;

    document.getElementById("pagination").innerHTML = paginationHTML;
    updatePagination();
}

function updatePagination() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const total_pages = Math.ceil(todos.length / records_per_page);

    document.querySelectorAll(".page-item").forEach(item => item.classList.remove("active"));
    document.querySelectorAll(".page-item")[current_page].classList.add("active");

    if (current_page === 1) {
        document.getElementById("prevBtn").parentElement.classList.add("disabled");
    } else {
        document.getElementById("prevBtn").parentElement.classList.remove("disabled");
    }

    if (current_page === total_pages) {
        document.getElementById("nextBtn").parentElement.classList.add("disabled");
    } else {
        document.getElementById("nextBtn").parentElement.classList.remove("disabled");
    }
    document.getElementById("pages-details").innerHTML = `Showing ${start} to ${end} of ${total}`;


}

function prevPage() {
    if (current_page > 1) {
        current_page--;
        displayRecords();
    }
}

function nextPage() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const total_pages = Math.ceil(todos.length / records_per_page);
    if (current_page < total_pages) {
        current_page++;
        displayRecords();
    }
}

function goToPage(page) {
    current_page = page;
    displayRecords();
}

// Initial call to show todos
showTodos();





















// // showToastify function
// function showToastify(msg, type) {
//     let bgColor = "";
//     switch (type) {
//         case "success":
//             bgColor = "green";
//             break;
//         case "error":
//             bgColor = "red";
//             break;
//         default:
//             bgColor = "#000";
//             break;
//     }
//     Toastify({
//         text: msg,
//         duration: 3000,
//         gravity: "bottom",
//         position: "left",
//         style: {
//             background: bgColor,
//         }
//     }).showToast();
// }

// document.getElementById("appDateTask").style.display = "none";

// // create getRandamId
// const getRandamId = () => {
//     return Math.random().toString(32).slice(2);
// };

// // handleSumbit function
// const handleSubmit = (event) => {
//     // event.preventDefault();
    
//     let task = document.getElementById("task").value;
//     task = task.trim();
//     if (task.length < 3) {
//         showToastify("Enter the correct task", "error");
//         return;
//     }
//     let todo = {
//         task
//     };
//     todo.id = getRandamId();
//     todo.status = "active";

//     const todos = JSON.parse(localStorage.getItem("todos")) || [];
//     todos.push(todo);
//     localStorage.setItem("todos", JSON.stringify(todos));
//     showToastify("A new todo has been successfully added to the list", "success");
//     document.getElementById("task").value = '';
//     showTodos();
// };

// function showTodos() {
//     document.getElementById("output").innerHTML = "";
//     const todos = JSON.parse(localStorage.getItem("todos")) || [];
//     if (!todos.length) {
//         document.getElementById("output").innerHTML = "Sorry no todo has in list";
//         return;
//     }
   
//     let tableStart = '<div class="table-responsive"><table class="table">';
//     let tableHead = '<thead><tr><th scope="col">#</th><th scope="col">Todo Task</th><th scope="col">Actions</th></tr></thead>';
//     let tableEnd = ' </table></div>';
//     let tableBody = '';

//     for (let i = 0; i < todos.length; i++) {
//         let todo = todos[i];
//         tableBody += `<tr><th scope="row">${i + 1}</th><td>${todo.task}</td><td><button class="btn btn-sm btn-info" data-value="${todo.id}" onclick="editTodo(event)">Edit</button><button class="btn ms-2 btn-danger" data-value="${todo.id}" onclick="delTodo(event)">Delete</button></td></tr>`;
//     }

//     let table = tableStart + tableHead + "<tbody>" + tableBody + "</tbody>" + tableEnd;
//     document.getElementById("output").innerHTML = table;

//     createPagination();
//     displayRecords();
// }

// // update function
// const editTodo = (event) => {
//     let todoId = event.target.getAttribute('data-value');
//     let todos = JSON.parse(localStorage.getItem("todos"));
//     let todo = todos.find(todo => todo.id === todoId);
//     const { task } = todo;
//     // const tas = todo.status
//     document.getElementById("task").value = task;
//     localStorage.setItem("appDateTodo", JSON.stringify(todo));
//     document.getElementById("submit").style.display = "none";
//     document.getElementById("appDateTask").style.display = "block";
// };

// // handle edit
// const handleEdit = () => {
//     let todoEdit = JSON.parse(localStorage.getItem("appDateTodo"));
//     let updateTask = document.getElementById("task").value;
//     const updatedTodo = { ...todoEdit, task: updateTask };

//     const todos = JSON.parse(localStorage.getItem("todos"));
//     let todoAfterUpdated = todos.map(todo => {
//         if (todo.id === todoEdit.id) 
//             return updatedTodo;
//         return todo;
//     });

//     localStorage.setItem("todos", JSON.stringify(todoAfterUpdated));
//     showToastify("A todo has been successfully updated", "success");
//     showTodos();
//     document.getElementById("task").value = '';
//     document.getElementById("submit").style.display = "block";
//     document.getElementById("appDateTask").style.display = "none";
// };

// // delete function
// const delTodo = (event) => {
//     let todoId = event.target.getAttribute('data-value');
//     let todos = JSON.parse(localStorage.getItem("todos"));
//     let todoAfterDelete = todos.filter(todo => todo.id !== todoId);
//     localStorage.setItem("todos", JSON.stringify(todoAfterDelete));
//     showToastify("A todo is successfully deleted from the list", "success");
//     showTodos();
// };

// // // filter function
// // const filterTodos = () => {
// //     let filter = document.getElementById("searchTask").value.toLowerCase();
// //     let rows = document.querySelectorAll("#output tbody tr");
// //     let todoFound = false;

// //     rows.forEach(row => {
// //         let task = row.getElementsByTagName("td")[0].innerText.toLowerCase();
// //         if (task.indexOf(filter) > -1) {
// //             row.style.display = "";
// //             todoFound = true;
// //         } else {
// //             row.style.display = "none";
// //         }
// //     });

// //     if (!todoFound) {
// //         document.getElementById("output").innerHTML = "Todo not found";
// //     }
// // };

// // // Pagination
// // let records_per_page = 5;
// // let current_page = 1;

// // document.getElementById("recode-size").addEventListener("change", (event) => {
// //     records_per_page = parseInt(event.target.value);
// //     current_page = 1;
// //     showTodos();
// // });

// // function displayRecords() {
// //     const todos = JSON.parse(localStorage.getItem("todos")) || [];
// //     const start = (current_page - 1) * records_per_page + 1;
// //     const end = Math.min(start + records_per_page - 1, todos.length);
// //     let statement = '';

// //     for (let i = start - 1; i < end; i++) {
// //         statement += `<tr><th scope="row">${i + 1}</th><td>${todos[i].task}</td><td><button class="btn btn-sm btn-info" data-value="${todos[i].id}" onclick="editTodo(event)">Edit</button><button class="btn ms-2 btn-danger" data-value="${todos[i].id}" onclick="delTodo(event)">Delete</button></td></tr>`;
// //     }

// //     document.getElementById("output").innerHTML = `<div class="table-responsive"><table class="table"><thead><tr><th scope="col">#</th><th scope="col">Todo Task</th><th scope="col">Actions</th></tr></thead><tbody>${statement}</tbody></table></div>`;
// //     updatePagination(start, end, todos.length);
// // }

// // function createPagination() {
// //     const todos = JSON.parse(localStorage.getItem("todos")) || [];
// //     const total_pages = Math.ceil(todos.length / records_per_page);
// //     let paginationHTML = '';

// //     paginationHTML += `<li class="page-item"><a class="page-link" id="prevBtn" href="javascript:void(0)" onclick="prevPage()" tabindex="-1" aria-disabled="true">Previous</a></li>`;
// //     for (let i = 1; i <= total_pages; i++) {
// //         paginationHTML += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="goToPage(${i})">${i}</a></li>`;
// //     }
// //     paginationHTML += `<li class="page-item"><a class="page-link" id="nextBtn" href="javascript:void(0)" onclick="nextPage()">Next</a></li>`;

// //     document.getElementById("pagination").innerHTML = paginationHTML;
// //     updatePagination();
// // }

// // function updatePagination(start = 1, end = 1, total = 0) {
// //     const todos = JSON.parse(localStorage.getItem("todos")) || [];
// //     const total_pages = Math.ceil(todos.length / records_per_page);

// //     document.querySelectorAll(".page-item").forEach(item => item.classList.remove("active"));
// //     document.querySelectorAll(".page-item")[current_page].classList.add("active");

// //     if (current_page === 1) {
// //         document.getElementById("prevBtn").parentElement.classList.add("disabled");
// //     } else {
// //         document.getElementById("prevBtn").parentElement.classList.remove("disabled");
// //     }

// //     if (current_page === total_pages) {
// //         document.getElementById("nextBtn").parentElement.classList.add("disabled");
// //     } else {
// //         document.getElementById("nextBtn").parentElement.classList.remove("disabled");
// //     }

// //     document.getElementById("pages-details").innerHTML = `Showing ${start} to ${end} of ${total}`;
// // }

// // function prevPage() {
// //     if (current_page > 1) {
// //         current_page--;
// //         displayRecords();
// //     }
// // }

// // function nextPage() {
// //     const todos = JSON.parse(localStorage.getItem("todos")) || [];
// //     const total_pages = Math.ceil(todos.length / records_per_page);
// //     if (current_page < total_pages) {
// //         current_page++;
// //         displayRecords();
// //     }
// // }

// // function goToPage(page) {
// //     current_page = page;
// //     displayRecords();
// // }

// // // Initial call to show todos
// // showTodos();
















