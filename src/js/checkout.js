const { event } = require("jquery");
 
function getOrder(){
    let chairsStringArray = localStorage.getItem('chairsArray');
    if(!chairsStringArray){
        return;
    }
    let chairsArray = JSON.parse(chairsStringArray);
    for(i=0; i<chairsArray.length; i++){
        let chair = chairsArray[i]
        let chairId = chair.id;
        let chairQuantity = chair.quantity;
        getChairsDescription(chairId, chairQuantity);
    }
}
getOrder();
let chairsInBasket = [];
function getChairsDescription(chairId, chairQuantity) {
    return fetch('https://furniture-a1bbb-default-rtdb.europe-west1.firebasedatabase.app/' + chairId + '.json')
        .then(function (response) {
            return response.json(); //превращение строки в js-объект
        })
        .then(function (chairInfo) {
            let chair = Object.entries(chairInfo);
            let chairObj = Object.fromEntries(chair);
            chairObj.id = chairId;
            chairObj.quantity = chairQuantity;
            chairsInBasket.push(chairObj);
            renderChairs(chairObj.img, chairObj.name, chairObj.price, chairId, chairQuantity);
        })
        .catch(function (error) {
            console.error(error);
        });
}

let checkoutPlaceholder = document.querySelector(".order-container");
let totalPrice = document.querySelector(".total-price-value");
let currentPrice = 0;
let amountOfChairs = 0;
let basketAmount = document.querySelector(".amount-of-chairs"); 

function renderChairs(img, name, price, id, quantity) {
    const template = `
            <div class="buying">
            <img class="chair-icon" src="${img}"></img>
            <div class="chair-info">
                <span class="chair-order-name">${name}</span>
                <span class="chair-price">$${price}</span>
                <span class="chair-quantity">Quantity: ${quantity}</span>
            </div>
            <button type="button" class="btn-close displayed" onclick="deleteElement('${id}')"></button>
            </div>
            `;
    amountOfChairs += 1;
    localStorage.setItem("amountOfChairs", amountOfChairs);
    basketAmount.innerHTML = localStorage.getItem('amountOfChairs');
    checkoutPlaceholder.innerHTML = checkoutPlaceholder.innerHTML + template;
    price = price * quantity;
    if(currentPrice === 0){
        currentPrice = price;
    } else{
        currentPrice += price;
    }
    totalPrice.innerHTML = "$"+ currentPrice;
}

window.deleteElement = function (chairId){
    amountOfChairs = 0;
    let chairsStringArray = localStorage.getItem('chairsArray');
    let chairsArray = JSON.parse(chairsStringArray);
    chairsInBasket = chairsInBasket.filter(function(chair) {
        return chair.id !== chairId;
    });
    checkoutPlaceholder.innerHTML = '';
    currentPrice = 0; 
    basketAmount.innerHTML = "0";
    for(let i=0; i<chairsInBasket.length; i++){
        renderChairs(chairsInBasket[i].img, chairsInBasket[i].name, 
                    chairsInBasket[i].price, chairsInBasket[i].id, chairsInBasket[i].quantity);
    }
    
    let filteredArray = chairsArray.filter(function(chair) {
        return chair.id !== chairId;
    });
    let stringFilteredArray = JSON.stringify(filteredArray);
    localStorage.setItem("chairsArray", stringFilteredArray);
    if(chairsInBasket.length === 0){
        totalPrice.innerHTML = "$0";
    }
}


