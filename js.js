const addTodoButton = document.getElementById("add-todo-button");
const searchTodo = document.querySelector(".search-button");
const todoText = document.getElementById("todoText");
const todoList = document.getElementById("todo-list");
let todoEmEdicao = null;
const incompleteFilter = document.querySelector(".incomplete-filter-button");
const completeFilter = document.querySelector(".complete-filter-button");
const personalFilter = document.querySelector(".personal-filter-button");
const profesionalFilter = document.querySelector(".profesional-filter-button");
const cleanButton = document.querySelector(".clean-button");

addTodoButton.addEventListener("click", (e) => {
  e.preventDefault();
  addOrEditButton();
});

function addTodoValidation(todoText, todoType) {
  if (todoText.trim() === "" || !todoType) {
    alert("Digite o nome e/ou tipo da tarefa");
    return false;
  }

  return true;
}

function addOrEditButton() {
  if (addTodoButton.textContent === "Adicionar") {
    addTodo();
  } else {
    saveEditedTodo();
  }
}

function cleanAddTodoCard() {
  const selectedType = document.querySelector(
    'input[name="type-todo"]:checked',
  );
  todoText.value = "";
  todoText.placeholder = "Digite sua tarefa";
  if (selectedType) {
    selectedType.checked = false;
  }
}

function addTodo() {
  const selectedType = document.querySelector(
    'input[name="type-todo"]:checked',
  );
  const todoTextToAdd = todoText.value;
  const todoTypeToAdd = selectedType?.value;
  if (!addTodoValidation(todoTextToAdd, todoTypeToAdd)) return;
  createTodoCard(todoTextToAdd, todoTypeToAdd);
  cleanAddTodoCard();
}

function createTodoCard(text, type) {
  const todoCard = document.createElement("article");
  todoCard.classList.add("todo-card");

  const textContainerCard = document.createElement("div");
  textContainerCard.classList.add("text-container");

  const pText = document.createElement("p");
  pText.classList.add("todo-title");
  pText.textContent = text;

  const pType = document.createElement("p");
  pType.classList.add("todo-type");
  pType.textContent = type;
  todoCard.dataset.category = type;

  textContainerCard.appendChild(pText);
  textContainerCard.appendChild(pType);

  const buttonsContainerCard = document.createElement("div");
  buttonsContainerCard.classList.add("buttons-container");

  const completeButton = document.createElement("button");
  completeButton.classList.add("complete-todo");
  completeButton.classList.add("control-buttons");
  completeButton.textContent = "Completar";

  const editButton = document.createElement("button");
  editButton.classList.add("edit-todo");
  editButton.classList.add("control-buttons");
  editButton.textContent = "Editar";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-todo");
  deleteButton.classList.add("control-buttons");
  deleteButton.textContent = "Excluir";

  buttonsContainerCard.appendChild(completeButton);
  buttonsContainerCard.appendChild(editButton);
  buttonsContainerCard.appendChild(deleteButton);

  todoCard.appendChild(textContainerCard);
  todoCard.appendChild(buttonsContainerCard);

  document.querySelector("#todo-list").appendChild(todoCard);
}

todoList.addEventListener("click", (event) => {
  completeTodo(event);
  deleteTodo(event);
  editTodo(event);
});

function completeTodo(event) {
  if (event.target.classList.contains("complete-todo")) {
    const todoCard = event.target.closest(".todo-card");
    todoCard.classList.toggle("completed");
    if (todoCard.classList.contains("completed")) {
      todoList.appendChild(todoCard);
    } else {
      todoList.prepend(todoCard);
    }
  }
}

function deleteTodo(event) {
  if (event.target.classList.contains("delete-todo")) {
    const todoCard = event.target.closest(".todo-card");
    const confirmaçãoDelete = confirm("Voce quer deletar a tarefa?");
    if (confirmaçãoDelete) {
      todoCard.remove();
    }
  }
}

function editTodo(event) {
  if (event.target.classList.contains("edit-todo")) {
    if (!event.target.classList.contains("edit-todo")) return;
    if (todoEmEdicao) {
    alert("Por favor, salve ou cancele a edição atual antes de editar outra tarefa.");
    return; 
  }    const todoCard = event.target.closest(".todo-card");
    todoEmEdicao = todoCard;
    const addTodoSectionTitle = document.querySelector(".add-todo-title");
    addTodoSectionTitle.textContent = "Editar tarefa";
    todoCard.classList.add("edit-todo-card");
    addTodoButton.textContent = "Editar";
    const todoTitle = todoCard.querySelector(".todo-title");
    todoText.value = todoTitle.textContent;
    const todoType = todoCard.querySelector(".todo-type").textContent;
    const radio = document.querySelector(
      `input[name="type-todo"][value="${todoType.trim()}"]`,
    );
    if (radio) {
      radio.checked = true;
    }
    const editButton = todoCard.querySelector(".edit-todo");
    editButton.style.visibility = "hidden";
  }
}

function saveEditedTodo() {
  if (!todoEmEdicao) return;

  const selectedType = document.querySelector(
    'input[name="type-todo"]:checked',
  );

  todoEmEdicao.querySelector(".todo-title").textContent = todoText.value;
  todoEmEdicao.querySelector(".todo-type").textContent = selectedType.value;

  todoEmEdicao.classList.remove("edit-todo-card");
  const editButton = todoEmEdicao.querySelector(".edit-todo");

  todoEmEdicao = null;

  addTodoButton.textContent = "Adicionar";
  document.querySelector(".add-todo-title").textContent = "Adicionar tarefa";
  cleanAddTodoCard();

  editButton.style.visibility = "visible";
}

searchTodo.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = document.querySelector("#search-input");
  const searchTerm = searchInput.value.toLowerCase().trim();

  const allTodos = document.querySelectorAll(".todo-card");
  allTodos.forEach((todo) => {
    const titleText = todo
      .querySelector(".todo-title")
      .textContent.toLowerCase();
    if (titleText.includes(searchTerm)) {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
});

incompleteFilter.addEventListener("click", (e) => {
  e.preventDefault();
  const allTodos = document.querySelectorAll(".todo-card");

  allTodos.forEach((todo) => {
    const isComplete = todo.classList.contains("completed");
    if (!isComplete) {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
});

completeFilter.addEventListener("click", (e) => {
  e.preventDefault();
  const allTodos = document.querySelectorAll(".todo-card");

  allTodos.forEach((todo) => {
    const isComplete = todo.classList.contains("completed");
    if (isComplete) {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
});

personalFilter.addEventListener("click", (e) => {
  e.preventDefault();
  const allTodos = document.querySelectorAll(".todo-card");

  allTodos.forEach((todo) => {
    if (todo.dataset.category === "Pessoal") {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
});

profesionalFilter.addEventListener("click", (e) => {
  e.preventDefault();
  const allTodos = document.querySelectorAll(".todo-card");

  allTodos.forEach((todo) => {
    if (todo.dataset.category === "Profissional") {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
});

cleanButton.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = document.getElementById("search-input");
  searchInput.value = "";
  searchInput.placeholder = "Busque sua tarefa";
  const allTodos = document.querySelectorAll(".todo-card");
  allTodos.forEach((todo) => {
    todo.style.display = "flex";
  });

  searchInput.focus();
});
