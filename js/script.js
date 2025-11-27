const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const todoBody = document.getElementById('todo-body');
const emptyState = document.getElementById('empty-state');
const filterSelect = document.getElementById('filter-todo');
const errorMsg = document.getElementById('error-message');

// load Data
document.addEventListener('DOMContentLoaded', loadTodos);
addBtn.addEventListener('click', addTodo);
filterSelect.addEventListener('change', filterTodos);

function addTodo() {
    const text = todoInput.value;
    const date = dateInput.value;

    // Validasi Input
    errorMsg.innerText = "";
    if (text === '') {
        errorMsg.innerText = "Task cannot be empty!";
        return;
    }
    if (date === '') {
        errorMsg.innerText = "Please select a date!";
        return;
    }

    // Validasi Tanggal 
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0,0,0,0);
    if(selectedDate < today) {
        errorMsg.innerText = "Date cannot be in the past!";
        return;
    }

    // Buat Objek Todo
    const todo = {
        id: Date.now(),
        text: text,
        date: date,
        completed: false
    };

    // Simpan ke LocalStorage
    saveLocal(todo);
    
    // Tampil ke Layar
    createTodoElement(todo);
    
    // Reset Input
    todoInput.value = '';
    dateInput.value = '';
    checkEmpty();
}

function createTodoElement(todo) {
    // Cek Filter saat membuat elemen
    const currentFilter = filterSelect.value;
    if (currentFilter === 'completed' && !todo.completed) return;
    if (currentFilter === 'pending' && todo.completed) return;

    const tr = document.createElement('tr');
    tr.classList.add('todo-item');
    tr.setAttribute('data-id', todo.id);

    // Tentukan class status
    const statusClass = todo.completed ? 'status-completed' : 'status-pending';
    const statusText = todo.completed ? 'Completed' : 'Pending';
    const textDecoration = todo.completed ? 'text-completed' : '';

    tr.innerHTML = `
        <td class="${textDecoration}">${todo.text}</td>
        <td>${todo.date}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
            <button onclick="toggleComplete(${todo.id})" class="action-btn btn-check">
                <i class="fas fa-check-circle"></i>
            </button>
            <button onclick="deleteTodo(${todo.id})" class="action-btn btn-trash">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    todoBody.appendChild(tr);
    checkEmpty();
}

function toggleComplete(id) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed;
        }
        return todo;
    });
    localStorage.setItem('todos', JSON.stringify(todos));
    refreshList();
}

function deleteTodo(id) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    refreshList();
}

function deleteAll() {
    if(confirm("Are you sure you want to delete all tasks?")) {
        localStorage.removeItem('todos');
        refreshList();
    }
}

function saveLocal(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(function(todo) {
        createTodoElement(todo);
    });
    checkEmpty();
}

function filterTodos(e) {
    refreshList();
}

function refreshList() {
    // Hapus semua tampilan
    todoBody.innerHTML = "";
    
    // Load ulang berdasarkan filter
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const filterValue = filterSelect.value;

    todos.forEach(todo => {
        switch(filterValue) {
            case "all":
                createTodoElement(todo);
                break;
            case "completed":
                if(todo.completed) createTodoElement(todo);
                break;
            case "pending":
                if(!todo.completed) createTodoElement(todo);
                break;
        }
    });
    checkEmpty();
}

function checkEmpty() {
    if (todoBody.children.length === 0) {
        emptyState.classList.add('show-empty');
    } else {
        emptyState.classList.remove('show-empty');
    }
}