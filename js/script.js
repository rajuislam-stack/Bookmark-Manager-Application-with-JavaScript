//Importing functions

import {elementCreate, extractUniqueTags, createCard, showElement, hideElement, extractTags, dateFormetter, findResult, updateDropdownPosition, sortingBysortbydropdownoptions, domainName, filterByTags, margeFilterArr, showConfirmationMessage } from "./bookmarkOperations.js";

import {fetchData } from "./utils.js";


let bookmarksArr = [];    //Storing all bookmars object (Main Array)

let filterBookmarksArr = [];  //For applying all features like seaching, filtering, sorting and so on.


//All rendering logic 

//Navigation from Home to Archived and vice versa

let isHomeActive = true;

let isSerching = false;

let isFilterByTags = false;

const home = document.getElementsByClassName('home')[0];
      home.classList.add("selectedBackground");
const archived = document.getElementsByClassName('archived')[0];
const showCardsInHome = document.getElementsByClassName('bookmark-grid-container')[0];
const showCardsInArchive = document.getElementsByClassName('bookmark-grid-container')[1];
hideElement(showCardsInArchive); //default hide

const allBookmark_text = document.getElementById('bookmark-heading-main');

home.addEventListener('click', ()=>{
   if(isSerching || isFilterByTags) return;

   if(!isHomeActive){
      sidebarModal.classList.remove('active-sidebar');      //Closing sidebar section
      sidebar.classList.remove('active-sidebar')
   }

   showElement(showCardsInHome);
   hideElement(showCardsInArchive);
   allBookmark_text.textContent = 'All Bookmarks'
   isHomeActive = true;
   home.classList.add('selectedBackground');
   archived.classList.remove('selectedBackground');

   
})

archived.addEventListener('click', ()=>{
   if(isSerching || isFilterByTags) return;
   if(isHomeActive){
      sidebarModal.classList.remove('active-sidebar');      //Closing sidebar section
      sidebar.classList.remove('active-sidebar')
   }

  showElement(showCardsInArchive);
  hideElement(showCardsInHome);
  allBookmark_text.textContent = 'Archived Bookmarks'
  isHomeActive = false;
  archived.classList.add('selectedBackground');
  home.classList.remove('selectedBackground');
})

//Displaying Archived and Home  cards

let activeSortby = 'recently added';


function displayCards(filterBookmarksArr){
     showCardsInArchive.innerHTML = '' ;
     showCardsInHome.innerHTML = '';

    if(activeSortby == 'recently added'){
    filterBookmarksArr =  sortingBysortbydropdownoptions(0, filterBookmarksArr);
    }
    if(activeSortby == 'recently visited'){
      filterBookmarksArr = sortingBysortbydropdownoptions(1, filterBookmarksArr);
    }
    if(activeSortby == 'most visited'){
      filterBookmarksArr = sortingBysortbydropdownoptions(2, filterBookmarksArr);   //Sorting by sortby button before rendering cards
    }
    
    filterBookmarksArr.sort((a,b)=> b.pinned - a.pinned);  //Default sorting for pinned bookmarks
   
    if(isSerching || isFilterByTags){
      for( let i = 0; i < filterBookmarksArr.length; i++){
        showCardsInHome.appendChild(createCard(filterBookmarksArr[i]));
      }
      return;
    }


    for( let i = 0; i < filterBookmarksArr.length; i++){

     if(filterBookmarksArr[i].isArchived) {    
     showCardsInArchive.appendChild(createCard(filterBookmarksArr[i]))
     }
   else {          
      showCardsInHome.appendChild(createCard(filterBookmarksArr[i]))
     }
    }
   }

//Displaying all tag dynamically

const showTags = document.getElementById('showTags')

 function displayTags(bookmarksArr){

  let tagsArr =  extractUniqueTags(bookmarksArr)  //Extracting unique tags and frequency count
  const tagsFrequency = tagsArr[0];
  let uniqueTags = [...tagsArr[1]];
  

  showTags.innerHTML = '' ;

  for(let tag of uniqueTags){
   const div =  elementCreate('div');
         div.setAttribute('class', 'indivisual-tag-div');

   const label = elementCreate('label');
         label.setAttribute('class', 'labelElement')
   const input = elementCreate('input');
         input.setAttribute('id', tag)
   const p = elementCreate('p');

   input.type = 'checkbox';
   label.append(input , tag )

   p.textContent = tagsFrequency[tag];

   div.append(label , p)

   showTags.append(div)

  }

}

//Filter by sidebar tags


const resetBtn = document.getElementById('reset-button');
     hideElement(resetBtn)


window.addEventListener('click', (event)=>{
     
 if(event.target.matches('input[type=checkbox]')){
  
 const checkboxNodeList = showTags.querySelectorAll('input[type=checkbox]')
 
   filterBookmarksArr = filterByTags(checkboxNodeList, bookmarksArr, event.target);

  
 if(filterBookmarksArr.length == 0 ){
   hideElement(resetBtn);
   isFilterByTags = false;

   if(isHomeActive){
      showElement(showCardsInHome);
      hideElement(showCardsInArchive);
      allBookmark_text.textContent = 'All Bookmarks';
   }
   else{
     hideElement(showCardsInHome);
      showElement(showCardsInArchive);
      allBookmark_text.textContent = 'Archived Bookmarks';
   }
    filterBookmarksArr = bookmarksArr;
    displayCards(filterBookmarksArr);
 }
 else{

   showElement(resetBtn);
   isFilterByTags = true;
   hideElement(showCardsInArchive)
   showElement(showCardsInHome)
    displayCards(filterBookmarksArr)
    allBookmark_text.textContent = 'All Bookmarks';
   }
 
 }


 if(event.target == resetBtn){

     const checkboxNodeList = showTags.querySelectorAll('input[type=checkbox]');

     for (let checkbox of checkboxNodeList){
       checkbox.checked = false;
     }
     
     isFilterByTags = false;
     margeFilterArr.length = null;
     hideElement(resetBtn);
     filterBookmarksArr = bookmarksArr;
     displayCards(filterBookmarksArr);

     if(isHomeActive){
      showElement(showCardsInHome);
      hideElement(showCardsInArchive);
      allBookmark_text.textContent = 'All Bookmarks';
   }
   else{
     hideElement(showCardsInHome);
      showElement(showCardsInArchive);
      allBookmark_text.textContent = 'Archived Bookmarks';
   }
 }
 
})




//Adding all features 


//Searching feature

const search_input = document.getElementById('search_input');
    
search_input.addEventListener('input',(event)=>{
     hideElement(showCardsInArchive);
     showElement(showCardsInHome);
     
       
     let searchValue = event.target.value.trim();
         allBookmark_text.textContent = `Results for "${searchValue}"` ;

    if(searchValue){
      isSerching = true;
    }
    else{
      isSerching = false;
    }

    if(searchValue == '' && isHomeActive == true){
      showElement(showCardsInHome);
      hideElement(showCardsInArchive);
      allBookmark_text.textContent = 'All Bookmarks';
     }
     if (searchValue == '' && isHomeActive == false){
      showElement(showCardsInArchive);
      hideElement(showCardsInHome);
      allBookmark_text.textContent = 'Archived Bookmarks'
     }
     
    
      filterBookmarksArr =  findResult(bookmarksArr, searchValue);
          
       displayCards(filterBookmarksArr);

          //if no result found

          if(filterBookmarksArr.length == 0) {
            const noResultImg = elementCreate('img');
                  noResultImg.setAttribute('src','../assets/images/no-result.svg');
            showCardsInHome.append(noResultImg);
            allBookmark_text.textContent = `"No results"`
          }
})


//profile dropdown, Sortby Dropdown, home actions dropdown, archieve actions dropdown

const dropdown_modal = document.getElementById('dropdown-modal');   //Accessing main modal


const profileImg = document.getElementsByClassName('profile-img')[0];
const profile_dropdown = document.getElementById('profile-dropdown');
let  profile_dropdown_width = profile_dropdown.offsetWidth;  
const lightThemeButton = document.getElementsByClassName('change-theme')[0];
const darkThemeButton = document.getElementsByClassName('change-theme')[1];
const signInModal = document.getElementsByClassName('sign-in-modal')[0];        //Accessing profile dropdown elements
const signInPage = document.getElementsByClassName('sign-in-page')[0];
const formElement = signInPage.querySelector('form') ;    
const logInButton = signInPage.querySelector('button');
const anchorElements = signInPage.querySelectorAll('a');

  
const sortBybtn = document.getElementsByClassName('sort-by')[0];
const sortByDropdown = document.getElementById('sortby-dropdown');   //Accessing sortby dropdown elements
let sortByDropdownWidth = sortByDropdown.offsetWidth;  
const sortbyDropdownOptions = document.getElementsByClassName('sortby-dropdown-option');
const iconCheck = document.getElementsByClassName('icon-check');        


const homeActionsDropdown = document.getElementById('home-actions-dropdown');
let homeActionsDropdownWidth = homeActionsDropdown.offsetWidth;                  //Accessing home and archieve dropdown elements
const archiveActionsDropdown = document.getElementById('archieve-actions-dropdown');
let archiveActionsDropdownWidth = archiveActionsDropdown.offsetWidth;   


hideElement(homeActionsDropdown);
hideElement(archiveActionsDropdown);
hideElement(profile_dropdown);
hideElement(sortByDropdown);
hideElement(dropdown_modal); 


//Profile dropdown related logic

const rootHtmlElement = document.documentElement;

window.addEventListener('click', (e)=>{
   
  //Showing profile dropdown

  if(e.target == profileImg){
   showElement(profile_dropdown);
   updateDropdownPosition(profileImg, profile_dropdown, profile_dropdown_width);
   showElement(dropdown_modal);  
   
   return;
  }



  //Changing Theme (Light or Dark mood)
  
  let clickedLightButton = e.target.closest('.light-theme');
  let clickedDarkButton = e.target.closest('.dark-theme');

  if(clickedLightButton){

      lightThemeButton.classList.add('active-theme');
      darkThemeButton.classList.remove('active-theme')


      rootHtmlElement.classList.remove('active-theme');

      hideElement(profile_dropdown);
      hideElement(dropdown_modal)
     
       localStorage.setItem('theme', 'light');

      return;
  }

  if (clickedDarkButton){
     lightThemeButton.classList.remove('active-theme')
     darkThemeButton.classList.add('active-theme');
     
     rootHtmlElement.classList.add('active-theme')

     hideElement(profile_dropdown);
     hideElement(dropdown_modal)

     localStorage.setItem('theme', 'dark');

     return;
  }



 

  //Log-in and Log-out features

  if(e.target.closest('.log-out-div')){

    let inputList = signInPage.querySelectorAll('input[type=text]');
    for(let input of inputList){
       input.value = ''
    }
    showElement(signInModal);
    hideElement(dropdown_modal)
    hideElement(profile_dropdown);
  
    localStorage.setItem('isLogin', 'false');
  }
  

  if(e.target == logInButton){

    e.preventDefault();

    let inputElements =  signInPage.querySelectorAll('input');

  for(let inputElement of inputElements){
     
     if(!inputElement.value){
      alert('Please enter your information!'); 
      return;
     }
  }

   hideElement(signInModal);
   localStorage.setItem('isLogin', 'true');

   showConfirmationMessage(confirmationMessageDiv, confirmationModal, confirmationImg, 'icon-check', confirmationText, 'You have successfully logged in.')
  
  }


  
  for(let anchorElement of anchorElements){
    if(e.target == anchorElement){
      e.preventDefault()
    }
  }

  
})



window.onload = function(){

   //Extracting current theme (Dark or Light)

  let currentTheme = localStorage.getItem('theme');      
    
  if(!currentTheme || currentTheme == 'light'){
   lightThemeButton.classList.add('active-theme');
  rootHtmlElement.classList.remove('active-theme')
  }
  else{
    darkThemeButton.classList.add('active-theme');
    rootHtmlElement.classList.add('active-theme')
  }


  //Extracting log-in information (Log-in or Log-out)

  let isLogIN = localStorage.getItem('isLogin');  
  
  if(!isLogIN || isLogIN == 'false'){
    showElement(signInModal);      
  }
  if(isLogIN == 'true' ){                  
   hideElement(signInModal);
  }
}






//Sort by dropdown related logic

  sortBybtn.addEventListener('click', ()=>{
      showElement(sortByDropdown);
      updateDropdownPosition(sortBybtn,sortByDropdown,sortByDropdownWidth)
      showElement(dropdown_modal);   //Showing sortby-dropdown
  })

for(let i = 1; i < iconCheck.length; i++){
   hideElement(iconCheck[i]);      //Hide checkbox icons except recently added 
}

window.addEventListener('click', (e)=>{
  let clickedOption =  e.target.closest('.sortby-dropdown-option');
  
  if(clickedOption){
  let clickedOptionId = clickedOption.getAttribute('id');

  for(let i = 0; i < iconCheck.length; i++){
   hideElement(iconCheck[i]);      //Hide all checkbox icons
  }

   showElement(iconCheck[clickedOptionId]);  //Display one check icon 

  if(clickedOptionId == 0){
    activeSortby = 'recently added';
    displayCards(filterBookmarksArr);
  }

  if(clickedOptionId == 1){
   activeSortby = 'recently visited';
   displayCards(filterBookmarksArr);
  }

  if (clickedOptionId == 2){
  activeSortby = 'most visited'
  displayCards(filterBookmarksArr);
  }
  }

})




//Home and archieve dropdown logic and Related features (visit, copy url , archieve ,unarchieve and so on)

let clickedObj;
let dotMenuBtn;

const pinUnpinImg = document.getElementById('pin-unpin-img');
const pinUnpinText = document.getElementById('pin-unpin-text');

const confirmationModal = document.getElementById('confirmation-modal');
const confirmationMessageDiv = document.getElementById("confirmation-message");
const confirmationCloseBtn = document.getElementById('confirmation-close-btn');
const confirmationImg = document.getElementById("confirmation-img");
const confirmationText = document.getElementById("confirmation-text");        //Accessing confirmation related elements (Toast)
      hideElement(confirmationModal);
      hideElement(confirmationMessageDiv);

 

let nextId = 19;
let activeAddEditButton = 'add-button';
const modalSection = document.getElementById('modal-section');
const addEditSection = document.getElementsByClassName('add-edit-section')[0];
      hideElement(modalSection);
      hideElement(addEditSection);
const addBookmarkBtn = document.getElementById('add-bookmark-btn');
const crossBtn = document.getElementById('cross-btn');
const cancelBtn = document.getElementById('cancel-btn');  
const addBtn = document.getElementById('add-btn');
const headerText = document.getElementById("header-text");
const saveUpdateText = document.getElementById("save-update-text");
const title = document.getElementById('title_input');
const description = document.getElementById('description_input');
const url_input = document.getElementById('url_input');
const tags = document.getElementById('tag_input');          //Adding and editing elements accesss


let active_archieve_unarchive_delete = 'archive-unarchive';
const archieveUnarchieveDeleteDialog = document.getElementById("archieve-unarchieve-delete-section");
      hideElement(archieveUnarchieveDeleteDialog);
const dialogHeaderText = document.getElementById("dialog-header-text");
const dialogCrossBtn = document.getElementById("dialog-cross-btn");
const dialogText = document.getElementById("dialog-text");
const dialogCancelBtn = document.getElementById("dialog-cancel-btn");
const dialogAddBtn = document.getElementById("dialog-add-btn");    //Archieve, unarchieve and delete dialog popup elements access


                                                 

window.addEventListener('click',(e)=>{

  //showing home and archieve dropdowns

  if(e.target.closest('.dropdown-menu-dot')){

    dotMenuBtn = e.target.closest('.dropdown-menu-dot');    //Dropdown Dot button

   clickedObj = bookmarksArr.find((bookmarkObj)=>{
   return bookmarkObj.id == dotMenuBtn.id;
  })
  
 if(clickedObj.isArchived){
   showElement(archiveActionsDropdown)
  updateDropdownPosition(dotMenuBtn, archiveActionsDropdown, archiveActionsDropdownWidth);
  showElement(dropdown_modal)
 }
 else if(!clickedObj.isArchived && clickedObj.pinned){
   pinUnpinImg.setAttribute('src', "assets/images/icon-unpin.svg")
   pinUnpinImg.setAttribute('alt', 'icon-unpin');
   pinUnpinText.textContent = 'Unpin';

  showElement(homeActionsDropdown);
  updateDropdownPosition(dotMenuBtn, homeActionsDropdown, homeActionsDropdownWidth);
  showElement(dropdown_modal);
 }
 else{
  pinUnpinImg.setAttribute('src', "assets/images/icon-pin.svg")           //showing home and archieve dropdowns
  pinUnpinImg.setAttribute('alt', 'icon-pin');
  pinUnpinText.textContent = 'Pin';

  showElement(homeActionsDropdown);
  updateDropdownPosition(dotMenuBtn, homeActionsDropdown, homeActionsDropdownWidth);
  showElement(dropdown_modal);
 }

  }

 //Home and archieve related features (Visit , copy url, edit etc.)

let dropdownMenuOptionButton =  e.target.closest('.dropdown-menu');

if(dropdownMenuOptionButton){

  if(dropdownMenuOptionButton.classList.contains('visit-btn')){

    let expectedObjFilter = filterBookmarksArr.find((bookmarkObj)=> bookmarkObj.id == clickedObj.id);
        expectedObjFilter.visitCount  = expectedObjFilter.visitCount + 1;  
        expectedObjFilter.lastVisited = new Date();

      //Note: expectedObjFilter mutates the original object of the main bookmarks array 

      displayCards(filterBookmarksArr);
      hideElement(homeActionsDropdown);
      hideElement(archiveActionsDropdown);
      hideElement(dropdown_modal);
      
      window.open(expectedObjFilter.url);
 
 }
 else if(dropdownMenuOptionButton.classList.contains('copy-url-btn')){

    navigator.clipboard.writeText(clickedObj.url);
      
    showConfirmationMessage(confirmationMessageDiv, confirmationModal, confirmationImg,'icon-copy' , confirmationText, 'Link copied to clipboard.')       //Confirmation Popup
 }
 else if(dropdownMenuOptionButton.classList.contains('pin-unpin-btn')){

     let expectedObj = filterBookmarksArr.find((bookmarkObj)=> bookmarkObj.id == clickedObj.id);
     expectedObj.pinned = !expectedObj.pinned;
     displayCards(filterBookmarksArr);
     hideElement(homeActionsDropdown);
     hideElement(archiveActionsDropdown);
     hideElement(dropdown_modal);


     if(expectedObj.pinned){
       showConfirmationMessage(confirmationMessageDiv, confirmationModal, confirmationImg,'icon-pin' , confirmationText, 'Bookmark pinned to top.')       //Confirmation Popup
     }
     else{
       showConfirmationMessage(confirmationMessageDiv, confirmationModal, confirmationImg,'icon-unpin' , confirmationText, 'Bookmark unpinned from top.')       //Confirmation Popup
     }

 }
 else if(dropdownMenuOptionButton.classList.contains('edit-btn')){
   modalSection.style.display = 'flex';
   showElement(addEditSection);
   hideElement(archieveUnarchieveDeleteDialog);
   headerText.textContent = 'Edit bookmark';
   saveUpdateText.textContent = 'Update your save link details- Change the title, descriptions, URL or tags anytime.';
   title.value = clickedObj.title;
   description.value = clickedObj.description;
   url_input.value = clickedObj.url;
   tags.value = clickedObj.tags;
   activeAddEditButton = 'edit-button';
  addBtn.textContent = 'Save Bookmark';
 }
 else if(dropdownMenuOptionButton.classList.contains('archieve-unarchieve-btn')){
      modalSection.style.display = 'flex';
      showElement(archieveUnarchieveDeleteDialog)

      if(clickedObj.isArchived){
        dialogHeaderText.textContent = 'Unarchive bookmark';
        dialogText.textContent = 'Move this bookmark back to your active list ?'
        dialogAddBtn.textContent = 'Unarchive';
        dialogAddBtn.classList.remove('delete');
        active_archieve_unarchive_delete = 'archive-unarchive'
      }
      else{
        dialogHeaderText.textContent = 'Archive bookmark';
        dialogText.textContent = 'Are you sure you want to archive this bookmark ?'
        dialogAddBtn.textContent = 'Archive';
        dialogAddBtn.classList.remove('delete');
        active_archieve_unarchive_delete = 'archive-unarchive'
      }
    }
 else if(dropdownMenuOptionButton.classList.contains('delete-btn')){
        modalSection.style.display = 'flex';
        showElement(archieveUnarchieveDeleteDialog)

        dialogHeaderText.textContent = 'Delete bookmark';
        dialogText.textContent = 'Are you sure you want to delete this bookmark ?'
        dialogAddBtn.textContent = 'Delete Permanently';
        dialogAddBtn.classList.add('delete');
        active_archieve_unarchive_delete = 'delete'
 }


}

 
})       




//Move to archive , unarchive and delete actions

window.addEventListener('click',(e)=>{
  
   if(e.target == dialogAddBtn && active_archieve_unarchive_delete == 'delete'){
    
    bookmarksArr = bookmarksArr.filter((bookmarkObj) => bookmarkObj.id !== clickedObj.id);

      isSerching = false;
      isFilterByTags = false;
      hideElement(resetBtn);
      margeFilterArr.length = null;
     search_input.value = ''
     filterBookmarksArr = bookmarksArr;

     getData()

     if(isHomeActive){
      showElement(showCardsInHome);
      hideElement(showCardsInArchive);
      allBookmark_text.textContent = 'All Bookmarks';
     }
     else{
       showElement(showCardsInArchive);
      hideElement(showCardsInHome);
      allBookmark_text.textContent = 'Archived Bookmarks'
     }
     
    
    hideElement(modalSection);                    
    hideElement(archieveUnarchieveDeleteDialog);
    hideElement(dropdown_modal);
    hideElement(homeActionsDropdown);          //Delete
    hideElement(archiveActionsDropdown);


    showConfirmationMessage(confirmationMessageDiv, confirmationModal, confirmationImg,'icon-delete' , confirmationText, 'Bookmark deleted.')       //Confirmation Popup
   }
   
   if(e.target == dialogAddBtn && active_archieve_unarchive_delete == 'archive-unarchive'){
  
     
       if(clickedObj.isArchived){
      showConfirmationMessage(confirmationMessageDiv, confirmationModal, confirmationImg,'icon-unarchive' , confirmationText, 'Bookmark restored.')       //Confirmation Popup
     }
     else{
       showConfirmationMessage(confirmationMessageDiv, confirmationModal, confirmationImg,'icon-archive' , confirmationText, 'Bookmark archived.')       //Confirmation Popup
     }


      let expectedObj = filterBookmarksArr.find((bookmarkObj)=> bookmarkObj.id == clickedObj.id);
     expectedObj.isArchived = !expectedObj.isArchived;
   
     isSerching = false;
     search_input.value = ''
     filterBookmarksArr = bookmarksArr;
     displayCards(filterBookmarksArr);
  
     
     if(isHomeActive){
      showElement(showCardsInHome);            //Move to archive and unarchive
      hideElement(showCardsInArchive);
      allBookmark_text.textContent = 'All Bookmarks';
     }
     else{
       showElement(showCardsInArchive);
      hideElement(showCardsInHome);
      allBookmark_text.textContent = 'Archived Bookmarks'
     }
     

     
     hideElement(modalSection);                     
     hideElement(archieveUnarchieveDeleteDialog);
     hideElement(dropdown_modal)
     hideElement(homeActionsDropdown);          
     hideElement(archiveActionsDropdown);
     
   }
})


//Adding and editing bookmarks  feature 


addBookmarkBtn.addEventListener('click', ()=>{
   headerText.textContent = 'Add bookmark';
   saveUpdateText.textContent = 'Save a link with details to keep your collection organized.';
   title.value = '';
   description.value = '';
   url_input.value = '';
   tags.value = '';
  modalSection.style.display = 'flex';     //Open the bookmark adder form
  showElement(addEditSection)
  hideElement(archieveUnarchieveDeleteDialog);
  activeAddEditButton = 'add-button';
  addBtn.textContent = 'Add Bookmark';
})


crossBtn.addEventListener('click',()=>{
  hideElement(modalSection);
  hideElement(addEditSection)
})                                  

cancelBtn.addEventListener('click', ()=>{   //Close the bookmark adder form
  hideElement(modalSection);
  hideElement(addEditSection)
})

window.addEventListener('click', (event)=>{
  if(event.target == modalSection ){
    hideElement(modalSection);           //Close all modal
    hideElement(addEditSection);
    hideElement(archieveUnarchieveDeleteDialog);
  }

  if(event.target.closest('#dialog-cross-btn') || event.target.closest('#dialog-cancel-btn')){
    hideElement(modalSection);        
    hideElement(addEditSection);                 //Close archive, unarchive, and delete diolog popup
    hideElement(archieveUnarchieveDeleteDialog);
  }
})


addBtn.addEventListener('click',(e)=>{
   
   
  if(activeAddEditButton == 'add-button'){
     
     if(title.value == ''){
      alert('Please enter a title!');                    //Input validation
      return;
     }
     else if(description.value == ''){
      alert('Please enter a description!')
      return;
     }
     else if(url_input.value == '' ){
      alert('Please enter a URL!');
      return;
     }
     else if(url_input.value !== '' &&  !/^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(url_input.value) ){
      alert('Please provide a valid url!');
      return;
     }
     else if(tags.value == ''){
      alert('Please enter  tags!');
      return;
     }
      else{

        const newBookmarkObj = {};             //Adding a new card to the Main array
        
        newBookmarkObj.id = `bm-${nextId++}`
        newBookmarkObj.title = title.value.trim() ;
        newBookmarkObj.url =  url_input.value ;

        newBookmarkObj.favicon = `https://www.google.com/s2/favicons?domain=${domainName(url_input.value)}&sz=64` ;  //Extracting favicon
        newBookmarkObj.description = description.value ;
        newBookmarkObj.tags =  extractTags(tags.value);
        newBookmarkObj.pinned = false;
        newBookmarkObj.isArchived = false;
        newBookmarkObj.visitCount = 0;
        newBookmarkObj.createdAt =  new Date();
        newBookmarkObj.lastVisited = null;
        bookmarksArr.push(newBookmarkObj);
        filterBookmarksArr = bookmarksArr;
       
         search_input.value = '';
         isSerching = false;

         showElement(showCardsInHome);
         hideElement(showCardsInArchive);
         allBookmark_text.textContent = 'All Bookmarks'
         isHomeActive = true;
         home.classList.add('selectedBackground');
         archived.classList.remove('selectedBackground')

         getData()

        title.value =  ''
        url_input.value = ''
        description.value = ''
        tags.value = ''

        hideElement(modalSection);
        hideElement(addEditSection);

       showConfirmationMessage(confirmationMessageDiv, confirmationModal, confirmationImg,'icon-check' , confirmationText, 'Bookmark added successfully.')       //Confirmation Popup
  }
}

  if(activeAddEditButton == 'edit-button'){

    if(title.value == ''){
      alert('Please enter a title!');                    //Input validation
      return;
     }
     else if(description.value == ''){
      alert('Please enter a description!')
      return;
     }
     else if(url_input.value == '' ){
      alert('Please enter a URL!');
      return;
     }
     else if(url_input.value !== '' &&  !/^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(url_input.value) ){
      alert('Please provide a valid url!');
      return;
     }
     else if(tags.value == ''){
      alert('Please enter  tags!');
      return;
     }
     else{

        filterBookmarksArr =  filterBookmarksArr.map((bookmarkObj)=>{     //Editing exiting card 
      if(bookmarkObj.id == clickedObj.id){
        bookmarkObj.title = title.value.trim() ;
        bookmarkObj.url =  url_input.value ;
        bookmarkObj.favicon = `https://www.google.com/s2/favicons?domain=${domainName(url_input.value)}&sz=64` ;  //Extracting favicon
        bookmarkObj.description = description.value ;
        bookmarkObj.tags =  extractTags(tags.value);
        return bookmarkObj;
      }
      else {
        return bookmarkObj;
      }

    })
    
    let nodeList = showTags.querySelectorAll('input[type=checkbox]');
      
    getData()


      hideElement(modalSection);
      hideElement(addEditSection);
      hideElement(homeActionsDropdown);           
      hideElement(archiveActionsDropdown);
      hideElement(dropdown_modal); 
      hideElement(archieveUnarchieveDeleteDialog) ;

      showConfirmationMessage(confirmationMessageDiv, confirmationModal, confirmationImg,'icon-check' , confirmationText, 'Changes saved.')       //Confirmation Popup

   }
    }
   
}) 


//Show or hide sidebar modal

const sidebarModal = document.getElementsByClassName('sidebar-container-modal')[0];
const sidebar = document.getElementsByClassName('sidebar-container')[0];

window.addEventListener('click', (e)=>{
     
    if(e.target.closest('#show-sidebar-menu-btn')){
    sidebarModal.classList.add('active-sidebar');      //Showing sidebar section
    sidebar.classList.add('active-sidebar')
    }

    if(e.target.closest('#close-sidebar-btn')){
      sidebarModal.classList.remove('active-sidebar');      //Closing sidebar section
      sidebar.classList.remove('active-sidebar')
    }

    if(e.target == sidebarModal){
      sidebarModal.classList.remove('active-sidebar');      //Closing sidebar section
      sidebar.classList.remove('active-sidebar')
    }
})







  window.addEventListener('scroll',()=>{               //Scrolling dropdowns with dropdown buttons
  if(sortByDropdown.style.display !== 'none'){
    updateDropdownPosition(sortBybtn,sortByDropdown,sortByDropdownWidth);
  }

  if(homeActionsDropdown.style.display !== 'none'){
    updateDropdownPosition(dotMenuBtn, homeActionsDropdown, homeActionsDropdownWidth);
  }
  
  if(archiveActionsDropdown.style.display !== 'none'){
    updateDropdownPosition(dotMenuBtn, archiveActionsDropdown, archiveActionsDropdownWidth);
  }
})


    
  window.addEventListener('click',(e)=>{

  if(e.target == dropdown_modal){
    hideElement(profile_dropdown);
    hideElement(sortByDropdown);
    hideElement(homeActionsDropdown);           //Closing all dropdowns
    hideElement(archiveActionsDropdown);
    hideElement(dropdown_modal);   
  }

  if(e.target == confirmationModal || e.target == confirmationCloseBtn){
    confirmationMessageDiv.classList.remove("show-confirmation-div-smothly");
   setTimeout(() => {
    hideElement(confirmationMessageDiv);
    hideElement(confirmationModal)
   }, 350);
  }
})








//Fetching bookmarks array from utils.js

let x = 0;

async function getData() {
     if(x == 0){
          bookmarksArr = await fetchData()
          filterBookmarksArr = bookmarksArr;
         x = 1 ;
     }
     
//all functional fn call
    
    displayCards(filterBookmarksArr);
    displayTags(bookmarksArr)
}

getData()





