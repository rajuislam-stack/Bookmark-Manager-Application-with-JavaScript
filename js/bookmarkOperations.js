//Logical operations


//Creating card element and  tags

export function createCard(bookmarkObj){
    const card = elementCreate('div');
          card.setAttribute('class', 'indivisual-card')

    const card_container = elementCreate('div');
          card_container.setAttribute('class', 'indivisual-card-containder')
   const card_container_header = cardHeader(bookmarkObj) //Creating header section
   
  
    const card_container_devider = elementCreate('hr');
    const card_container_description = elementCreate('p');
          card_container_description.style.alignSelf = 'flex-start';
          card_container_description.textContent = bookmarkObj.description;
    
    const card_container_tags = createTags(bookmarkObj.tags);  //Creating tags section

     const card_container_footer = cardFooter(bookmarkObj)  //creating fooder section


     //Assinging to the main card section

     card_container.append(card_container_header, card_container_devider, card_container_description, card_container_tags)
   
     card.append(card_container, card_container_footer)

      return card ;

}

//Creating Header Section

function cardHeader(bookmarkObj){
  const header = elementCreate('header');
        header.setAttribute('class', 'indivisual-card-header')
  //logo 

    const header_logo = elementCreate('div');
          header_logo.setAttribute('class', 'card-header-logo')
    const header_logo_img = elementCreate('img')
          header_logo_img.setAttribute('src', bookmarkObj.favicon);
          header_logo_img.style.width = '40px';
          header_logo_img.style.height = '40px';
          header_logo.append(header_logo_img)

   //Title and Url

    const header_info = elementCreate('div');
    const header_info_title = elementCreate('h2');
          header_info_title.textContent  = bookmarkObj.title

    const header_info_url = elementCreate('p');
          header_info_url.textContent = domainName(bookmarkObj.url);

          header_info.append(header_info_title, header_info_url)

    //Menu

    const header_menu = elementCreate('div');
          header_menu.setAttribute('class',`dropdown-menu-dot`);
          header_menu.setAttribute('id', bookmarkObj.id)

    const header_menu_img = elementCreate('img')
          header_menu_img.setAttribute('src', "../assets/images/icon-menu-bookmark.svg");
          header_menu.append(header_menu_img)


   //assinging to the main parent
   
    header.append(header_logo, header_info, header_menu);

   return header ;
}



//Creating tag section

export function createTags(tagsArr){
    const card_tags_container = elementCreate('div');
          card_tags_container.setAttribute('class','card_tags_containder');
    for( let tag of tagsArr){
       const span = elementCreate('span');
       span.textContent = tag ;
       card_tags_container.appendChild(span);
    }

    return card_tags_container ;
}


//Creating footer section

function cardFooter(bookmarkObj){
   const card_footer = elementCreate('footer');
         card_footer.setAttribute('class', 'card_footer')
   const card_footer_info = elementCreate('div');
         card_footer_info.setAttribute('class', 'card_footer_info');
  
   //views

   const card_views = elementCreate('div');
         card_views.className = 'footer-info-div';
   const card_views_img = elementCreate('img')
         card_views_img.setAttribute('src', '../assets/images/icon-visit-count.svg');
   const card_views_span = elementCreate('span');
         card_views_span.textContent = bookmarkObj.visitCount;
         card_views.append(card_views_img, card_views_span )
         
    //clock (last visited)

   const card_time = elementCreate('div');
         card_time.className = 'footer-info-div';
   const card_clock_img = elementCreate('img')
         card_clock_img.setAttribute('src', '../assets/images/icon-last-visited.svg' );
   const card_time_span = elementCreate('span');
         card_time_span.textContent =  dateFormetter(bookmarkObj.lastVisited)
         card_time.append(card_clock_img,card_time_span )

   //date (Created at)

   const card_date = elementCreate('div');
         card_date.className = 'footer-info-div';
   const card_date_celender = elementCreate('img')
         card_date_celender.setAttribute('src', '../assets/images/icon-created.svg');
   const card_date_span = elementCreate('span');
         card_date_span.textContent = dateFormetter(bookmarkObj.createdAt)
         card_date.append(card_date_celender,card_date_span)


    //assing to the info section and then main footer

    card_footer_info.append(card_views, card_time, card_date);

    if(bookmarkObj.isArchived){
    const archived = elementCreate('div');
          archived.setAttribute('class','archieve-div');
    const archived_span = elementCreate('span')
          archived_span.textContent = "Archived";
          archived.appendChild(archived_span);
          
      card_footer.append(card_footer_info, archived);
    }
   else if(bookmarkObj.pinned){

     const pinned = elementCreate('div');
     const pinned_img = elementCreate('img')
           pinned_img.setAttribute('src', '../assets/images/icon-pin.svg');
           pinned_img.style.width = '18px';
           pinned_img.style.height = '18px';
           pinned.append(pinned_img)

      card_footer.append(card_footer_info, pinned);
    }
    else{
      card_footer.append(card_footer_info);
    }


    return card_footer;
}


//Formatting last visited date and created at 

export function dateFormetter(date){
    if(!date) return "Never";
   
    let dateObj = new Date(date);
    
   return new Intl.DateTimeFormat("en-GB",{
      day:"numeric",
      month:'short'
   }).format(dateObj);
}



//Find unique tag

let tagsArr = [];

export function  extractUniqueTags(bookmarksArr){
      tagsArr.length = null;
      
     for(let i = 0; i < bookmarksArr.length; i++){
    tagsArr =  [...tagsArr, ...bookmarksArr[i].tags];
     }
  
  const tagsFrequency =  findFrequency(tagsArr)

   const uniqueTags = new Set(tagsArr);

    return [tagsFrequency, uniqueTags]
}


//Find frequency of tags

function findFrequency(tagsArr){
 const tagsCount =  tagsArr.reduce((acc, value)=>{
   acc[value] = acc[value] ? acc[value] + 1: 1
    return acc;
   }, {})

   return tagsCount;
}

//Extract tags array from input

export function extractTags(tag_value){
    let tagsArr = tag_value.replace(/\s+/g, '').split(',');
    return tagsArr  ;
}


//Filtering by tags 

export let margeFilterArr = [];

export function filterByTags(checkboxElements, bookmarksArr,clickedCheckbox){
    
         if(!clickedCheckbox.checked){
              let tagName = clickedCheckbox.getAttribute('id');
             margeFilterArr = margeFilterArr.filter((bookmarkObj)=> !bookmarkObj.tags.includes(tagName))
            }

        for(let checkboxElement of checkboxElements){

            if(checkboxElement.checked == true){
             
              let tagName = checkboxElement.getAttribute('id');
              
              let filteredArr =  bookmarksArr.filter((bookmarkObj)=> bookmarkObj.tags.includes(tagName));
                  
              let unicqueElements =  filteredArr.filter((bookmarkObj)=> !margeFilterArr.includes(bookmarkObj))
      
               margeFilterArr = [...margeFilterArr, ...unicqueElements]
            }

        }

    return margeFilterArr;
   
}


//Extract domain name 

export function domainName(urlStr){
  let domain = new URL(urlStr).hostname;
  return domain;
}



//Find searching result

export function findResult(bookmarksArr, searchValue){
      
   const searchResultArr = bookmarksArr.filter((bookmarkObj)=>{
        let makeOnelineSearchValue = searchValue.toLowerCase().replace(/\s+/g, '');
        let makeOnelineTitle = bookmarkObj.title.toLowerCase().trim().replace(/\s+/g, '');

        return  makeOnelineTitle.includes(makeOnelineSearchValue);
       });
      
    return searchResultArr ;
}


//Calculate Dropdown positions


export function  updateDropdownPosition(dropdownButton,mainDropdown, dropdownWidth ){
 let rect = dropdownButton.getBoundingClientRect();
  
  mainDropdown.style.top = `${rect.bottom + 8}px`;
  mainDropdown.style.left = `${rect.right - dropdownWidth}px`;
}



//Filtering for sortby dropdown


export function sortingBysortbydropdownoptions(sortByOptionId,bookmarksArr){
      let sortedArr;

      if(sortByOptionId == 0){
        sortedArr = bookmarksArr.sort((bookmarkObjA,bookmarkObjB)=>{
          let recentyAddedA =  new Date(bookmarkObjA.createdAt);
              recentyAddedA = recentyAddedA.getTime();

          let recentyAddedB = new Date(bookmarkObjB.createdAt);
               recentyAddedB = recentyAddedB.getTime();           //Recently added

        return  recentyAddedB  - recentyAddedA;
        })
      }
      if(sortByOptionId == 1){
       sortedArr = bookmarksArr.sort((bookmarkObjA,bookmarkObjB)=>{
          let recentyVisitedA =  new Date(bookmarkObjA.lastVisited);
              recentyVisitedA = recentyVisitedA.getTime();

          let recentyVisitedB = new Date(bookmarkObjB.lastVisited);
               recentyVisitedB = recentyVisitedB.getTime();           //Recently visited

        return  recentyVisitedB  - recentyVisitedA;
        })
      }
      if(sortByOptionId == 2){    //Most visited
       sortedArr = bookmarksArr.sort((bookmarkObjA, bookmarkObjB)=> bookmarkObjB.visitCount - bookmarkObjA.visitCount);
      }                         

   return sortedArr;
}


//Toast popup (Confirmation message)

export function showConfirmationMessage(confirmationMessageDiv, confirmationModal, confirmationImg, imgSrc, confirmationTextElement, text ){
       showElement(confirmationMessageDiv);
       showElement(confirmationModal);

       confirmationImg.setAttribute('src', `assets/images/${imgSrc}.svg`);
      confirmationTextElement.textContent = text;
       
       setTimeout(() => {
             confirmationMessageDiv.classList.add('show-confirmation-div-smothly');
             }, 50);

             setTimeout(() => {
             confirmationMessageDiv.classList.remove('show-confirmation-div-smothly');  //Showing and removing popup automatically
             }, 3000);

             setTimeout(() => {
               hideElement(confirmationModal);
      }, 4000);
}






//Small Operations in below


//Creating elements 

 export function elementCreate(eName){
 return  document.createElement(eName)
}

//Show elements

export function showElement(element){
 return element.style.display = '';
}


//Hide elements

export function hideElement(element){
 element.style.display = 'none';
}

