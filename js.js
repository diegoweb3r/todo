// Estado da aplicação ---------------------
let todoEmEdicao = null;
let todos = [];
// Estado da aplicação ---------------------

// Elementos DOM  ---------------------
const addTodoButton = document.getElementById("add-todo-button");
const searchTodo = document.querySelector(".search-button");
const todoText = document.getElementById("todoText");
const todoList = document.getElementById("todo-list");
const incompleteFilter = document.querySelector(".incomplete-filter-button");
const completeFilter = document.querySelector(".complete-filter-button");
const personalFilter = document.querySelector(".personal-filter-button");
const profesionalFilter = document.querySelector(".profesional-filter-button");
const cleanButton = document.querySelectorAll(".clean-button");
const errorMsg = document.getElementById("error-msg");
const filtersContainer = document.querySelector(".filter-buttons-container");
const searchCard = document.querySelector(".search-todo-buttons-container");
// Elementos DOM  ---------------------

// Event Listener  ---------------------
addTodoButton.addEventListener("click", handleAddButtonClick);
todoText.addEventListener("input", cleanValidationError);
todoList.addEventListener("click", handleTodoListClick);
filtersContainer.addEventListener("click", handleTodoSearch);
searchCard.addEventListener("click", handleSearchCardClick);
searchTodo.addEventListener("click", handleSearch);
// Event Listener  ---------------------


//Fluxo principal (Adicionar/Editar)  ---------------------
function handleAddButtonClick(e){
  e.preventDefault();
  handleAddOrEdit();
}

function handleAddOrEdit() {
 if (todoEmEdicao) {
    saveEditedTodo();
  } else {
    addTodo();
  }
}
//Fluxo principal (Adicionar/Editar)  ---------------------


//Validação  ---------------------
function isTodoValid(todoText, todoType) {
  return todoText.trim() !== "" && !!todoType;
}

function showValidationError(){
  errorMsg.classList.remove("hidden");
}

function cleanValidationError(){
 errorMsg.classList.add("hidden");
}
//Validação  ---------------------

//CRUD - Adiciona/Constroi elementos   ---------------------
function addTodo() {
  const todoTextToAdd = todoText.value;
  const todoTypeToAdd = getSelectedTodoType();

  if (!isTodoValid(todoTextToAdd, todoTypeToAdd)) {
    showValidationError();
    return
  }

  cleanValidationError();

 const newTodo = {
  id: Date.now(),
  text: todoTextToAdd.trim(),
  type: todoTypeToAdd,
  completed: false
 }

 todos.push(newTodo);
 saveTodosToStorage();
 renderTodos();

 cleanAddTodoCard();
}

function createTodoCard(todo) {
  const todoCard = document.createElement("article");
  todoCard.classList.add("todo-card");

  todoCard.dataset.id = todo.id;

  const textContainerCard = document.createElement("div");
  textContainerCard.classList.add("text-container");

  const pText = document.createElement("p");
  pText.classList.add("todo-title");
  pText.textContent = todo.text;

  const pType = document.createElement("p");
  pType.classList.add("todo-type");
  pType.textContent = todo.type;
  todoCard.dataset.category = todo.type;

  textContainerCard.appendChild(pText);
  textContainerCard.appendChild(pType);

  const buttonsContainerCard = document.createElement("div");
  buttonsContainerCard.classList.add("buttons-container");

  const completeButton = createButton("Completar", "complete-todo", "control-buttons");
  
  const editButton = createButton("Editar", "edit-todo", "control-buttons")
 
  const deleteButton = createButton("Excluir", "delete-todo", "control-buttons")
 
  buttonsContainerCard.appendChild(completeButton);
  buttonsContainerCard.appendChild(editButton);
  buttonsContainerCard.appendChild(deleteButton);

  todoCard.appendChild(textContainerCard);
  todoCard.appendChild(buttonsContainerCard);

  if (todo.completed) {
  todoCard.classList.add("completed");
  }

  return todoCard;
}

function createButton(text, ...classList){
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(...classList);
  return button;
}

//CRUD - Lista (Completa e Deleta)   ---------------------
function handleTodoListClick(event){
  const button = event.target.closest("button");
  if(!button) return;

  if (button.classList.contains("complete-todo")) {
    completeTodo(button);
  } else if (button.classList.contains("delete-todo")) {
    deleteTodo(button);
  } else if (button.classList.contains("edit-todo")) {
    editTodo(button);
  }
}

function completeTodo(button) {
  const todoCard = button.closest(".todo-card");
  if(!todoCard) return;
  
  const id = Number(todoCard.dataset.id);
  const todo = todos.find(todo => todo.id === id);
  if(!todo) return;
  
  todo.completed = !todo.completed;
  saveTodosToStorage();
  renderTodos();

}

function deleteTodo(button) {
  const todoCard = button.closest(".todo-card");
  if (!todoCard) return; 

  const id = Number(todoCard.dataset.id);

  if (!confirm("Voce quer deletar a tarefa?")) return;

  todos = todos.filter(todo => todo.id !== id);

  saveTodosToStorage();
  renderTodos();
}
//CRUD - Lista (Completa e Deleta)   ---------------------

//CRUD Lista (Edita) ---------------------
function editTodo(button) { 
  if(!canStartEditing()) return;
  const todoCard = button.closest(".todo-card");
  if(!todoCard) return;

  startEditing(todoCard);
}

function canStartEditing(){
  if (todoEmEdicao) {
      alert("Por favor, salve ou cancele a edição atual antes de editar outra tarefa.");
      return false; 
  }
  return true;
}

function startEditing(todoCard){
  todoEmEdicao = Number(todoCard.dataset.id);
  markCardAsEditing(todoCard);
}

function markCardAsEditing(todoCard){
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

function saveEditedTodo() {
  if (!todoEmEdicao) return;

  const newText = todoText.value.trim();
  const selectedType = getSelectedTodoType();

  if (!isTodoValid(newText, selectedType)) {
    showValidationError();
    return
  }

  const todo = todos.find(todo => todo.id === todoEmEdicao);
  if(!todo) return;

  todo.text = newText;
  todo.type = selectedType;


  todoEmEdicao = null;

  addTodoButton.textContent = "Adicionar";
  document.querySelector(".add-todo-title").textContent = "Adicionar tarefa";


  saveTodosToStorage();
  renderTodos();
  cleanAddTodoCard();

  
}
//CRUD Lista (Edita) ---------------------

//Busca  ---------------------
function handleSearch(e){
  e.preventDefault();

  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput.value.toLowerCase().trim();

  const allTodos = document.querySelectorAll(".todo-card");

  allTodos.forEach((todo) => {
    const titleText = todo.querySelector(".todo-title").textContent.toLowerCase();
    todo.style.display = titleText.includes(searchTerm) ? "flex" : "none";
  });
}

function handleSearchCardClick(event){
  const button = event.target.closest("button");
  if (!button) return;

  if(button.classList.contains("clean-search-button")){
    cleanSearch();
  }
}

function cleanSearch(){
  resetSearchInput();
  showAllTodos();
}
//Busca  ---------------------

//Filtros  ---------------------
function handleTodoSearch(event){
  const button = event.target.closest("button");
  if(!button) return;

   if (button.classList.contains("incomplete-filter-button")) {
    filterTodos(todo => !todo.classList.contains("completed"));
  } else if (button.classList.contains("complete-filter-button")) {
    filterTodos(todo => todo.classList.contains("completed"));
  } else if (button.classList.contains("personal-filter-button")) {
    filterTodos(todo => todo.dataset.category === "Pessoal");
  } else if (button.classList.contains("profesional-filter-button")) {
    filterTodos(todo => todo.dataset.category === "Profissional");
  } else if (button.classList.contains("clean-button")) {
    resetSearchInput();
    showAllTodos();
  }

}

function filterTodos(predicate){
  const allTodos = document.querySelectorAll(".todo-card");
  allTodos.forEach((todo) => {
    todo.style.display = predicate(todo) ? "flex" : "none";
  });
}

function showAllTodos(){
  filterTodos(() => true);
}
//Filtros  ---------------------

//Utilitarios  ---------------------
function getSelectedTodoType(){
  const selected = document.querySelector('input[name="type-todo"]:checked');
  return selected?.value || null;
}

function getSelectedTodoRadio(){
  return document.querySelector('input[name="type-todo"]:checked');
}

function cleanAddTodoCard() {
  const selectedTypeRadio = getSelectedTodoRadio();
  todoText.value = "";
  todoText.placeholder = "Digite sua tarefa";
  if (selectedTypeRadio) {
    selectedTypeRadio.checked = false;
  }
}

function confirmDelete(){
  return confirm("Voce quer deletar a tarefa?");
}

function cleanTodoFilter(){
  resetSearchInput();
  showAllTodos();
}

function resetSearchInput(){
  const searchInput = document.getElementById("search-input");
  searchInput.value = "";
  searchInput.placeholder = "Busque sua tarefa";
  searchInput.focus();
}
//Utilitarios  ---------------------

//LocalStorage  ---------------------
function saveTodosToStorage(){
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodosFromStorage(){
  const stored = localStorage.getItem("todos");
  if(!stored) return;

  todos = JSON.parse(stored);
}
//LocalStorage  ---------------------


// Renderização  ---------------------
function renderTodos(){
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const card = createTodoCard(todo);
    todoList.appendChild(card);
  });
}

loadTodosFromStorage();
renderTodos();