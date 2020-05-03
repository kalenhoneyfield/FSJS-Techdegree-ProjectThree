/******************************************
Treehouse FSJS Techdegree:
project 3 - Interactive Form
******************************************/

//grab all the individual portions(ids) we'll need throughout this project
const name = document.getElementById('name')
const emailAddress = document.getElementById('mail')
const jobTitle = document.getElementById('title')
const jobTitleTextBox = document.getElementById('other-title')
const colorOptions = document.getElementById('color')
const designOptions = document.getElementById('design')

const activities = document.getElementsByClassName('activities')[0]
const activitiesCheckboxes = activities.querySelectorAll("input[type='checkbox']")

//we won't have any options for paypal, bitcoin, or credit card expiration dates so we'll forgo grabbing those values here
const paymentMenu = document.getElementById('payment')
const creditCardNum = document.getElementById('cc-num')
const creditCardZip = document.getElementById('zip')
const creditCardCVV = document.getElementById('cvv')

//lastly grab the submit button
const submitButton = document.querySelectorAll("button[type='submit']")[0]


//When the page first loads, the first text field should be in focus by default.
//This isn't technically true, but it is pragmatically true... the grading sheet appears to indicate this is the desired outcome
name.focus()

//hide the other job title text box be default, using the built in is-hidden class
jobTitleTextBox.classList.add('is-hidden')
//and it's label
jobTitleTextBox.labels[0].classList.add('is-hidden')
//add event listener to detect a change and test if the "other" job option was selected, if so, display the now hidden text field by removing the is-hidden class
jobTitle.addEventListener("change", (e) => {
    if(e.target.value == "other"){
        jobTitleTextBox.classList.remove('is-hidden')
        jobTitleTextBox.labels[0].classList.remove('is-hidden')
    }
    else{
        jobTitleTextBox.classList.add('is-hidden')
        jobTitleTextBox.labels[0].classList.add('is-hidden')
    }
});


//Until a theme is selected from the “Design” menu, 
//no color options appear in the “Color” drop down 
//and the “Color” field reads “Please select a T-shirt theme”.

/*
    Step 1: Get the color options menu then hide it
    Step 2: create the default menu item, make sure it is selected, and disabled so the user shouldn't be able to select it (no one wants to get to a conference and have their loot shirt read "Please select a T-shirt theme")
    Step 3: prepend this item to the menu
    Step 4: hide all other items on the menu
    Step 5: Get the design options menu
    Step 6: add an event listen to this menu
    Step 7: hide/unhide options that should (not) be shown based on the selected design choices
*/

colorOptions.classList.add('is-hidden')
colorOptions.labels[0].classList.add('is-hidden')
const colorMenuDefault = document.createElement('option')
colorMenuDefault.value = ''
colorMenuDefault.innerText = "Please select a T-shirt theme"
colorMenuDefault.setAttribute("selected", true) 
colorMenuDefault.setAttribute("disabled", true) 

colorOptions.prepend(colorMenuDefault)

//start by hiding everything
resetColorOptionMenu()

//function to hide everything, and reset the selected item to the first item we created
function resetColorOptionMenu(){
    for(let i = 0; i < colorOptions.options.length; i++){
        const please = RegExp(/^Please/)
        if( !please.test(colorOptions.options[i].innerText) ){
            colorOptions.options[i].classList.add('is-hidden')
        }
        else{
            colorOptions.selectedIndex = i
        }
    }
}

//function for hiding/unhiding menu options based on a regex 
//call the reset function first to zero out the menu should someone back track and attempt to select an item combination that would not work.
//use case example: user selects puns design, then selects Cornflower Blue, then goes back and selects hearts design.
function setColorOptionMenu(regex){
    resetColorOptionMenu()
    //ignore the first item on the list, as that should be our default item
    for(let i = 1; i < colorOptions.options.length; i++){
       
        if( !regex.test(colorOptions.options[i].innerText) ){
            colorOptions.options[i].classList.add('is-hidden')
        }
        else{
            colorOptions.options[i].classList.remove('is-hidden')
        }
    }
}

//the design menu, add event listener
//regex is used here in case someone wants to add addtional color options to the menu,
// as long as they still define the style options the same, no changes to the code are
// needed to find and appropriately select the new colors 
designOptions.addEventListener("change", (e) => {
    let punex = RegExp(/Pun/)
    let heartex = RegExp(/♥/) //quite confused as to why I need to copypasta a heart into here when I have the code, regex pal seems to be able to find that heart by the &#9829;
    if(e.target.value === "Select Theme"){ //if nothing is selected, nothing should be shown
        resetColorOptionMenu()
        colorOptions.classList.add('is-hidden')
        colorOptions.labels[0].classList.add('is-hidden')
    }
    else if(e.target.value === "js puns"){ //if the puns design is selected, show the puns designs
        setColorOptionMenu(punex)
        colorOptions.classList.remove('is-hidden')
        colorOptions.labels[0].classList.remove('is-hidden')
    }
    else if(e.target.value === "heart js"){ //if the hearts design is selected, show the hearts deisgns
        setColorOptionMenu(heartex)
        colorOptions.classList.remove('is-hidden')
        colorOptions.labels[0].classList.remove('is-hidden')
    }
})



//create a span to hold and display the total selected cost of the conference
//make sure it won't be displayed until we need it
//add it to the dom
const confCostSpan = document.createElement('span')
confCostSpan.classList.add('is-hidden')

activities.append(confCostSpan)

for(let i = 0; i < activitiesCheckboxes.length; i++){ //loop through all the checkboxes and add an event handler to them
    activitiesCheckboxes[i].addEventListener("change", (e) => {
        confSessionConflicts()
        confCalcCost() //its possible that both of these functions could have been combined into one, however for clarity and debugging I have kept them seperate
    })
}
//calculate the cost of the event per selected items, and if the cost is greater than zero(at least 1 item selected) display the total cost
function confCalcCost(){
    let cost = 0
    for(let i = 0; i < activitiesCheckboxes.length; i++){
        
        if(activitiesCheckboxes[i].checked === true){
            cost += parseInt(activitiesCheckboxes[i].dataset.cost)
        }
    }
    if(cost > 0){
        confCostSpan.innerText = "Total: $" + cost
        confCostSpan.classList.remove('is-hidden')
    }
    else{
        confCostSpan.classList.add('is-hidden')
    }
}

//determine selected items and disable other items with conflicts based on the day and time value
function confSessionConflicts(){
    let dats = []
    for(let i = 0; i < activitiesCheckboxes.length; i++){
        if( activitiesCheckboxes[i].checked === true ){
            dats.push( activitiesCheckboxes[i].dataset.dayAndTime ) //build array of currently selected items
        }
    }
    for(let i = 0; i < activitiesCheckboxes.length; i++){
        if( activitiesCheckboxes[i].checked === false ){ //check the other items on the list to see if a conflict exists
            if( dats.indexOf(activitiesCheckboxes[i].dataset.dayAndTime ) != -1 ){ 
                activitiesCheckboxes[i].setAttribute('disabled', true)
            }
            else{
                activitiesCheckboxes[i].removeAttribute('disabled')
            }
        }
    }   
}

//Display payment sections based on the payment option chosen in the select menu.
/*
    Step 1: get payment element, set CC as the selected payment option, disable the "Select Payment Method" option 
    Step 2: hide all payments options
    Step 3: show only the payment option that is selected
*/


paymentMenu.options[0].setAttribute('disabled', true)
paymentMenu.selectedIndex = 1

//grab all the payment options and place them into an array so that we can more easily loop through them
const paymentTypeElementsById = [ 
                    document.getElementById('credit-card'), 
                    document.getElementById('paypal'), 
                    document.getElementById('bitcoin') 
                ]

//loop through all the payment options and hide all but the currently selected item
for(let i = 0; i < paymentTypeElementsById.length; i++){
    const test = testPaymentValues(paymentMenu.value, paymentTypeElementsById[i].id)
    if(test){
        paymentTypeElementsById[i].classList.remove('is-hidden')
    }
    else{
        paymentTypeElementsById[i].classList.add('is-hidden')
    }
}

//return true if the value and the id are equivalent else return false
function testPaymentValues(value, elemId){
    const regex = /(^[cpb][a-z]{5}[a-z]?)(\D?)(\w*$)/
    const valueText = value.replace(regex, '$1$3')
    const idText = elemId.replace(regex, '$1$3')
    return valueText == idText
}
//event handler to check which payment type should be displayed
paymentMenu.addEventListener('change', (e) => {
    for(let i = 0; i < paymentTypeElementsById.length; i++){
        const test = testPaymentValues(e.target.value, paymentTypeElementsById[i].id)
        if(test){
            paymentTypeElementsById[i].classList.remove('is-hidden')
        }
        else{
            paymentTypeElementsById[i].classList.add('is-hidden')
        }
    }
})

//check all the values that can be focused and blurred sanely
name.addEventListener('blur', (e) => {
    name.classList.remove('error')
    name.labels[0].classList.remove('empty')
    if( !isNotBlank( e.target.value ) ){
        name.classList.add('error')
        name.labels[0].classList.add('empty')
    }  
})
emailAddress.addEventListener('blur', (e) => {
    emailAddress.classList.remove('error')
    emailAddress.labels[0].className = ''
    if( !isNotBlank( e.target.value ) ){
        emailAddress.classList.add('error')
        emailAddress.labels[0].classList.add('empty')
    }
    else if( !isEmail(e.target.value) ){
        emailAddress.classList.add('error')
        emailAddress.labels[0].classList.add('invalidEmail')
    }
})
jobTitleTextBox.addEventListener('blur', (e) => {
    jobTitleTextBox.classList.remove('error')
    jobTitleTextBox.labels[0].classList.remove('empty')
    if( !isNotBlank( e.target.value ) ){
        jobTitleTextBox.classList.add('error')
        jobTitleTextBox.labels[0].classList.add('empty')
    }  
})
creditCardNum.addEventListener('blur', (e) => {
    creditCardNum.classList.remove('error')
    creditCardNum.labels[0].className = ''
    if( !isNotBlank( e.target.value ) ){
        creditCardNum.classList.add('error')
        creditCardNum.labels[0].classList.add('empty')
    }
    else if( !isthirteenSixteen(e.target.value) ){
        creditCardNum.classList.add('error')
        creditCardNum.labels[0].classList.add('invalidCCnum')
    }
})
creditCardZip.addEventListener('blur', (e) => {
    creditCardZip.classList.remove('error')
    creditCardZip.labels[0].className = ''
    if( !isNotBlank( e.target.value ) ){
        creditCardZip.classList.add('error')
        creditCardZip.labels[0].classList.add('empty')
    }
    else if( !isFiveZipCode(e.target.value) ){
        creditCardZip.classList.add('error')
        creditCardZip.labels[0].classList.add('invalidZip')
    }
})
creditCardCVV.addEventListener('blur', (e) => {
    creditCardCVV.classList.remove('error')
    creditCardCVV.labels[0].className = ''
    if( !isNotBlank( e.target.value ) ){
        creditCardCVV.classList.add('error')
        creditCardCVV.labels[0].classList.add('empty')
    }
    else if( !isThreeDigits(e.target.value) ){
        creditCardCVV.classList.add('error')
        creditCardCVV.labels[0].classList.add('invalidCVV')
    }
})

//basic validation function, if it only contains white space, it should be considered blank
function isNotBlank(val){
    if(val.length > 0){ //if there really is nothing here, then just skip the regex and go straight to false
        let regex = RegExp(/^[\s]+$/)
        return !regex.test(val)
    }
    else{
        return false
    }
}
//is the supplied value an email?
function isEmail(val){
    if(val.length > 0){
        let regex = RegExp(/^[^@]+@[^@.]+\.[a-z]+$/i)
        return regex.test(val)
    }
    else{
        return false
    }
}
//is the supplied value a 13-16 digit number
function isthirteenSixteen(val){
    if(val.length > 0){
        let regex = RegExp(/^(\d{13})\d?\d?\d?$/)
        return regex.test(val)
    }
    else{
        return false
    }
}
//is the supplied value a 5 digit number
function isFiveZipCode(val){
    if(val.length > 0){
        let regex = RegExp(/^(\d{5})$/)
        return regex.test(val)
    }
    else{
        return false
    }
}
//is the supplied value a 3 digit number
function isThreeDigits(val){
    if(val.length > 0){
        let regex = RegExp(/^(\d{3})$/)
        return regex.test(val)
    }
    else{
        return false
    }
}
//Are there checkboxes that have been checked?
function atLeastOneChecked(collection){
    let bool = false
    for(let i = 0; i < collection.length; i++){
        if(collection[i].checked === true){
            bool = true
            break //as soon as we find a checked box, we can stop the loop
        }
    }
    return bool
}
//is a shirt selected?
function isShirtSelected(val){
    return val != ''
}

//should the submit button be disabled? 
//if the name is blank: yes
//if the email is either blank or invalid: yes
//if no activities have been selected: yes
//if payment type credit card is selected but the number is not between 13 and 16 digits: yes
//if payment type credit card is selected but the zip code is not 5 digits: yes
//if payment type credit card is selected but the CVV is not 3 digits: yes
//else: no
//We'll add an event listioner to the submit button to prevent submission should any of the above evaluate to true
submitButton.addEventListener('click', (e) => {
    
    //build a referenceable object with the state of each validation check to loop through later
    let errorState = {
        name: isNotBlank(name.value),
        emailAddress: isNotBlank(emailAddress.value) && isEmail(emailAddress.value),
        activities: atLeastOneChecked(activitiesCheckboxes),
        colorOptions: isShirtSelected(colorOptions.value)
    }
    if(jobTitle.value === 'other'){
        errorState.jobTitleTextBox = isNotBlank(jobTitleTextBox.value)
    }
    if(paymentMenu.value === 'credit card'){
        errorState.creditCardNum = isNotBlank(creditCardNum.value) && isthirteenSixteen(creditCardNum.value)
        errorState.creditCardZip = isNotBlank(creditCardZip.value) && isFiveZipCode(creditCardZip.value)
        errorState.creditCardCVV = isNotBlank(creditCardCVV.value) && isThreeDigits(creditCardCVV.value)
    }

    let keys = Object.keys(errorState)
    for(let i = 0; i < keys.length; i++){
        if(!errorState[keys[i]]){  //is the test(s) above did not pass, they would be false, not(!) this value
            eval(keys[i]).classList.add('error') //give the item our helper error class
            eval(keys[i]).focus() //focus the item with the error state
            eval(keys[i]).blur() //blur it to help pop out the helper error message texts
            
            if(keys[i] == 'colorOptions'){ //if the user didn't select a t shirt let them know
                popUpModal()
            }

            e.preventDefault() //stop the sunmit button from firing it's actions
        }
        else{
            eval(keys[i]).classList.remove('error') //if this item passed its validation check, remove the error class
        }
    }

    console.log(errorState)
    
    
})


//in case someone doesn't select a T-Shirt design/color let them know
//its hard to point someone to a hidden selection box as the missing item
function popUpModal(){
    let clearDoc = document.getElementById('modal')
    if(clearDoc){
        clearDoc.remove()
    }
    const modal = document.createElement('div')
    const modalBox = document.createElement('div')
    const modalMsg = document.createElement('p')
    const closeBtn = document.createElement('span')
    modal.id = 'modal'
    modal.classList.add('popup')
    modalBox.classList.add('popup-content')
    closeBtn.id = 'closeModal'
    closeBtn.innerHTML = '&times;'
    modalMsg.innerHTML = 'Oops! Looks like you forgot to select a T-Shirt. <br>We\'d hate for you to miss out on your loot'

    modalBox.append(closeBtn)
    modalBox.append(modalMsg)
    modal.append(modalBox)

    closeBtn.addEventListener('click', (e) => {
        modal.style.display = 'none'
    })
    document.body.append(modal)
    modal.style.display = 'block'
}


