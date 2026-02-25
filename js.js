const addTodoButton = document.getElementById("add-todo-button");
const searchTodo = document.querySelector(".search-button");
const todoText = document.getElementById("todoText");
const todoList = document.getElementById("todo-list");
let todoEmEdicao = null;
const incompleteFilter = document.querySelector(".incomplete-filter-button");
const completeFilter = document.querySelector(".complete-filter-button");
const personalFilter = document.querySelector(".personal-filter-button");
const profesionalFilter = document.querySelector(".profesional-filter-button");
const cleanButton = document.querySelectorAll(".clean-button");
const errorMsg = document.getElementById("error-msg");
const filtersContainer = document.querySelector(".filter-buttons-container");


function handleAddButtonClick(e){
  e.preventDefault();
  handleAddOrEdit();
}

addTodoButton.addEventListener("click", handleAddButtonClick);

function isTodoValid(todoText, todoType) {
  return todoText.trim() !== "" && !!todoType;
}

function handleAddOrEdit() {
 if (todoEmEdicao) {
    saveEditedTodo();
  } else {
    addTodo();
  }
}

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

function addTodo() {
  const todoTextToAdd = todoText.value;
  const todoTypeToAdd = getSelectedTodoType();

  if (!isTodoValid(todoTextToAdd, todoTypeToAdd)) {
    showValidationError();
    return
  }

  cleanValidationError();

  const card = createTodoCard(todoTextToAdd, todoTypeToAdd);
  todoList.appendChild(card);

  cleanAddTodoCard();
}

function showValidationError(){
  errorMsg.classList.remove("hidden");
}

function cleanValidationError(){
 errorMsg.classList.add("hidden");
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

  const completeButton = createButton("Completar", "complete-todo", "control-buttons");
  
  const editButton = createButton("Editar", "edit-todo", "control-buttons")
 
  const deleteButton = createButton("Exlcuir", "delete-todo", "control-buttons")
 
  buttonsContainerCard.appendChild(completeButton);
  buttonsContainerCard.appendChild(editButton);
  buttonsContainerCard.appendChild(deleteButton);

  todoCard.appendChild(textContainerCard);
  todoCard.appendChild(buttonsContainerCard);

  return todoCard;
}

function createButton(text, ...classList){
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(...classList);
  return button;
}

todoList.addEventListener("click", handleTodoListClick);

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

    const isCompleted = todoCard.classList.toggle("completed");

    if (isCompleted) {
      todoList.appendChild(todoCard);
    } else {
      todoList.prepend(todoCard);
    }
}

function deleteTodo(button) {
  const todoCard = button.closest(".todo-card");
  if (!todoCard) return; 
  if (!confirmDelete()) return;

  todoCard.remove();
}

function confirmDelete(){
  return confirm("Voce quer deletar a tarefa?");
}

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
  todoEmEdicao = todoCard;
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

  const selectedType = getSelectedTodoType();
  todoEmEdicao.querySelector(".todo-title").textContent = todoText.value;
  todoEmEdicao.querySelector(".todo-type").textContent = selectedType;
  todoEmEdicao.dataset.category = selectedType.trim();
  
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

filtersContainer.addEventListener("click", handleTodoSearch);

function handleTodoSearch(event){
  const button = event.target.closest("button");
  if(!button) return;

  if (button.classList.contains("incomplete-filter-button")) {
    incompleteTodoFilter(button);
  } else if (button.classList.contains("complete-filter-button")) {
    completeTodoFilter(button);
  } else if (button.classList.contains("personal-filter-button")) {
    personalTodoFilter(button);
  } else if (button.classList.contains("profesional-filter-button")) {
    profesionalTodoFilter(button);
  } else if (button.classList.contains("clean-button")) {
    cleanTodoFilter(button);
  }
}

function incompleteTodoFilter() {
  filterTodos(todo => !todo.classList.contains("completed"));
};

function completeTodoFilter(){
  filterTodos(todo => todo.classList.contains("completed"));
}

function personalTodoFilter(){
  filterTodos(todo => todo.dataset.category === "Pessoal");
}

function profesionalTodoFilter(){
  filterTodos(todo => todo.dataset.category === "Profissional");
}
 
function cleanTodoFilter(){
  resetSearchInput();
  showAllTodos();
}

function filterTodos(predicate){
  const allTodos = document.querySelectorAll(".todo-card");
  allTodos.forEach((todo) => {
    todo.style.display = predicate(todo) ? "flex" : "none";
  });
}

function resetSearchInput(){
  const searchInput = document.getElementById("search-input");
  searchInput.value = "";
  searchInput.placeholder = "Busque sua tarefa";
  searchInput.focus();
}

function showAllTodos(){
  filterTodos(() => true);
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

const searchCard = document.querySelector(".search-todo-buttons-container");
searchCard.addEventListener("click", handleSearchCardClick);