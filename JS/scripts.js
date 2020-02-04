// Tutaj dodacie zmienne globalne do przechowywania elementów takich jak np. lista czy input do wpisywania nowego todo
let $list, addBtn, editBtn, delBtn, doneBtn, label, input, divModal, 
  popInput, closePop, currentTODO, currentID, tempLabel;

const todoUrl = "http://195.181.210.249:3000/todo/";

function main() {
  prepareDOMElements();
  prepareDOMEvents();
  prepareInitialList(1);
};

function prepareDOMElements() {
  // To będzie idealne miejsce do pobrania naszych elementów z drzewa DOM i zapisanie ich w zmiennych
  $list = document.getElementById('list');
  input=document.querySelector('#myInput'); 
  addBtn=document.querySelector('#addTodo'); 
  divModal=document.querySelector('#myModal'); 
  popInput=document.querySelector('#popupInput');
  cancTodo=document.querySelector('#cancelTodo');
  acceTodo=document.querySelector('#acceptTodo');
  closePop=document.querySelector('#closePopup');
};

function prepareDOMEvents() {
  // Przygotowanie listenerów
  $list.addEventListener('click', listClickManager);
  input.addEventListener('focus', function(event) {
  });

  event.target.addEventListener('click', function(event) {
    event.preventDefault(); 
    switch (event.target.id) {
      case 'addTodo': {
        if(input.value.trim()!=='') {
          todoPost();
          console.log(currentID);
          createElement(input.value);
          addNewElementToList(input.value);
        };  
        break;
      }
      case 'cancelTodo':
      case 'closePopup': {
        closePopup(event);
        break;
      }
      case 'acceptTodo': {
        currentTODO.innerText=popInput.value;
        currentID=currentTODO.parentElement.dataset.id;
        axios.put(todoUrl+currentID, {title: popInput.value
        }).then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log('err', err);
        });
        closePopup(event);
        break;
      }
    };
})};

function todoPost() {
axios.post(todoUrl, {title: input.value
}).then((response) => {
    prepareInitialList(0);
    input.value='';
}).catch((err) => {
    console.log('err', err);
})
};

function prepareInitialList(nr) {
  // Tutaj utworzymy sobie początkowe todosy. Mogą pochodzić np. z tablicy
  axios.get(todoUrl).then(response=> {
      this.data=response.data;
      this.data.forEach((todo) => {
      if(nr===1)  
          addNewElementToList(todo); 
      currentID=todo.id;
      $list.lastElementChild.dataset.id=currentID;
      });
  }).catch((err) => {
      console.log('err', err);
  });
};

function addNewElementToList(title) {
  //obsługa dodawanie elementów do listy
  const newElement = createElement(title);
  $list.appendChild(newElement);
};

function createElement(title) {
  // Tworzyc reprezentacje DOM elementu return newElement
  // return newElement
  const newElement = document.createElement('li');
  
  function createListButtons(text, className) {
    let button=document.createElement('button');
    button.innerText=text;
    button.className=className;
    return button;
  };

  editBtn = createListButtons('Edit','edit');   
  delBtn = createListButtons('Delete','delete');
  doneBtn = createListButtons('Mark as Done','done');
  label = document.createElement('label');
  label.textContent = input.value || title.title;
  newElement.dataset.id=title.id;
  currentID=title.id;
  newElement.append(label,delBtn,editBtn,doneBtn);
  return newElement;
};

function listClickManager(event/* event- event.target */) { //obsługa zdarzeń na liście
  // Rozstrzygnięcie co dokładnie zostało kliknięte i wywołanie odpowiedniej funkcji
  // event.target.parentElement.id
  switch (event.target.className) {
    case 'delete': {
      elemRemove(event);
      break;
    }
    case 'edit': {
      openPopup(event);
      break;
    }
    case 'done': {
      elemDone(event);
      break;
    }
  }
};

function openPopup(event) {
    // Otwórz popup
  divModal.classList.toggle("modal-active");
  currentTODO = event.target.parentElement.firstChild;
  popInput.value=event.target.parentElement.firstChild.textContent;
};

function closePopup(event) {
  // Zamknij popup
  console.log(event.target);
  divModal.classList.toggle("modal-active");
};

function elemRemove(event) {
  currentID=event.target.parentElement.dataset.id;
  console.log(currentID);
  event.target.parentElement.remove();
  axios.delete(todoUrl+currentID).then((response) => {
    console.log(response);
  }).catch((err) => {
      console.log('err', err);
  });
};

function elemDone(event) {
  event.target.setAttribute("disabled",true);
  event.target.parentElement.firstChild.classList.add("task-done")
};

document.addEventListener('DOMContentLoaded', main);