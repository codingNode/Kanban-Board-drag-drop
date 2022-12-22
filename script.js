const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const columnLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArray = [];

// Drag Functionality
let draggedItem;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArray =[backlogListArray,progressListArray,completeListArray,onHoldListArray];
  const arrItems = ['backlog', 'progress', 'complete', 'onHold'];

  arrItems.forEach((item,index)=>{
    localStorage.setItem(`${item}Items`, JSON.stringify(listArray[index]));
  })
  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}


// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)')

  listEl.textContent = item;
  columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad)
  {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';

  backlogListArray.forEach((backlog,index)=>{
    createItemEl(backlogList,0,backlog,index);
  })
  // Progress Column
  progressList.textContent = '';

  progressListArray.forEach((progress,index)=>{
    createItemEl(progressList,1,progress,index);
  })

  // Complete Column
  completeList.textContent = '';

  completeListArray.forEach((complete,index)=>{
    createItemEl(completeList,2,complete,index);
  })

  // On Hold Column
  onHoldList.textContent = '';

  onHoldListArray.forEach((onHold,index)=>{
    createItemEl(onHoldList,3,onHold,index);
  })

  // Run getSavedColumns only once, Update Local Storage


}

function drag(e)
{
  draggedItem = e.target;
  console.log("draggedItem: ", draggedItem);
}

function allowDrop(e)
{
  e.preventDefault();
  
}
function dragEnter(column)
{
  currentColumn = column;
  columnLists[column].classList.add('over');
}
function drop(e)
{
  e.preventDefault();
  columnLists.forEach((column)=>{
    column.classList.remove('over');
  });

  const parent = columnLists[currentColumn];
  parent.appendChild(draggedItem);
}


updateDOM()
