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
let dragging = false;

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
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout',`updateItem(${column},${index})`);
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
    if(backlog)
    {
      createItemEl(backlogList,0,backlog,index);
    }
    
  })
  
  // Progress Column
  progressList.textContent = '';

  progressListArray.forEach((progress,index)=>{
    if(progress)
    {
      createItemEl(progressList,1,progress,index);
    }
    
  })

  // Complete Column
  completeList.textContent = '';

  completeListArray.forEach((complete,index)=>{
    if(complete)
    {
      createItemEl(completeList,2,complete,index);
    }
    
  })

  // On Hold Column
  onHoldList.textContent = '';

  onHoldListArray.forEach((onHold,index)=>{
    if(onHold)
    {
      createItemEl(onHoldList,3,onHold,index);
    }
    
  })

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns()
}

// updating the item
function updateItem(col,id)
{

  const selectedArr = listArray[col];
  const item = columnLists[col].children[id].textContent;
  if(!dragging)
  {
        if(!item)
      {
        delete selectedArr[id]
      }
      else
      {
        selectedArr[id] = item
      }
      updateDOM()
  }
  
}

// adding new item
function addNewItem(column)
{
  // to remove whitespaces
  const itemText = addItemContainers[column].textContent.trim();
  
  if(itemText)
  {
    listArray[column].push(itemText);
    addItemContainers[column].textContent =''
    updateDOM();
  } 
}

// show add new item box
function showAdd(column)
{
  addBtns[column].style.visibility = 'hidden';
  addItemContainers[column].style.display = 'flex';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].setAttribute('contenteditable','true');
  addItemContainers[column].style.color = 'black';
}

//hiding new item box on save button
function hideAdd(column)
{
  addBtns[column].style.visibility = 'visible';
  addItemContainers[column].style.display = 'none';
  saveItemBtns[column].style.display = 'none';
  addNewItem(column);
}

// Rebuilding after drag and drop
function rebuildArrays()
{
  // backlogList
  backlogListArray =[];
  for(let i=0 ; i < backlogList.children.length; i++)
  {
    backlogListArray.push(backlogList.children[i].textContent);
  }

  // progressList
  progressListArray =[];
  for(let i=0 ; i < progressList.children.length; i++)
  {
    progressListArray.push(progressList.children[i].textContent);
  }

  // completeList
  completeListArray =[];
  for(let i=0 ; i < completeList.children.length; i++)
  {
    completeListArray.push(completeList.children[i].textContent);
  }

  // onHoldList
  onHoldListArray =[];
  for(let i=0 ; i < onHoldList.children.length; i++)
  {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  updateDOM()
  
}

function drag(e)
{
  draggedItem = e.target;
  dragging = true;
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
  dragging = false;
  rebuildArrays();
}


updateDOM()
