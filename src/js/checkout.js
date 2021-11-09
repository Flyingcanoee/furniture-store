const {
    event
} = require("jquery");

document.body.style['overflow-y'] = "scroll";

function getOrder() {
    let chairsStringArray = localStorage.getItem('chairsArray');
    if (!chairsStringArray) {
        return;
    }
    let chairsArray = JSON.parse(chairsStringArray);
    for (i = 0; i < chairsArray.length; i++) {
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
    if (currentPrice === 0) {
        currentPrice = price;
    } else {
        currentPrice += price;
    }
    totalPrice.innerHTML = "$" + currentPrice;
}

window.deleteElement = function (chairId) {
    amountOfChairs = 0;
    localStorage.setItem("amountOfChairs", amountOfChairs);
    let chairsStringArray = localStorage.getItem('chairsArray');
    let chairsArray = JSON.parse(chairsStringArray);
    chairsInBasket = chairsInBasket.filter(function (chair) {
        return chair.id !== chairId;
    });
    checkoutPlaceholder.innerHTML = '';
    currentPrice = 0;
    basketAmount.innerHTML = "0";
    for (let i = 0; i < chairsInBasket.length; i++) {
        renderChairs(chairsInBasket[i].img, chairsInBasket[i].name,
            chairsInBasket[i].price, chairsInBasket[i].id, chairsInBasket[i].quantity);
    }

    let filteredArray = chairsArray.filter(function (chair) {
        return chair.id !== chairId;
    });
    let stringFilteredArray = JSON.stringify(filteredArray);
    localStorage.setItem("chairsArray", stringFilteredArray);
    if (chairsInBasket.length === 0) {
        totalPrice.innerHTML = "$0";
    }
}


window.doValidation = function (event) {
    event.preventDefault();
    var myModal = new bootstrap.Modal(document.querySelector('#myModal'));
    myModal.toggle();
}

// написание телефона в форме

window.formatPhoneNumber = function (value) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 1) return phoneNumber;
    if (phoneNumberLength < 5) {
        return `${phoneNumber[0]}(${phoneNumber.slice(1, phoneNumberLength)})`;
    }
    if (phoneNumberLength < 8) {
        return `${phoneNumber[0]}(${phoneNumber.slice(1, 4)})${phoneNumber.slice(4, phoneNumberLength)}`;
    }
    if (phoneNumberLength < 10) {
        return `${phoneNumber[0]}(${phoneNumber.slice(1, 4)})${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, phoneNumberLength)}`;
    }
    if (phoneNumberLength < 12) {
        return `${phoneNumber[0]}(${phoneNumber.slice(1, 4)})${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 9)}-${phoneNumber.slice(9, 11)}`;
    }
}
let previousPhoneNum = "";
window.phoneNumberFormatter = function () {
    const inputField = document.getElementById("phone");
    const formattedInputValue = formatPhoneNumber(inputField.value);
    if(previousPhoneNum.length < inputField.value.length){
        inputField.value = formattedInputValue;
    }
    if(formattedInputValue!==undefined){
        previousPhoneNum = formattedInputValue;
    }
}
// написание даты
let previousDateNum = "";
window.dateFormatter = function () {
    const inputField = document.getElementById("date");
    const formattedInputValue = formatTheDate(inputField.value);
    if(previousDateNum.length < inputField.value.length){
        inputField.value = formattedInputValue;
    }
    if(formattedInputValue !== undefined){
        previousDateNum = formattedInputValue;
    } 
}
window.formatTheDate = function (value) {
    if (!value) return value;
    const date = value.replace(/[^\d]/g, "");
    const dateLength = date.length;
    if (dateLength < 2) {
        return date
    }
    if (dateLength < 5) {
        return `${date.slice(0,2)}/${date.slice(2, dateLength)}`
    }
    if (dateLength < 9) {
        return `${date.slice(0,2)}/${date.slice(2, 4)}/${date.slice(4, 8)}`
    }
}

// написание номера карты
let previousCardNum = "";
window.cardFormatter = function () {
    const inputField = document.getElementById("card");
    const formattedInputValue = formatTheCard(inputField.value);
    if(previousCardNum.length < inputField.value.length){
        inputField.value = formattedInputValue;
    }
    if(formattedInputValue !== undefined){
        previousCardNum = formattedInputValue;
    }
}
window.formatTheCard = function (value) {
    if (!value) return value;
    const card = value.replace(/[^\d]/g, "");
    const cardLength = card.length;
    if (cardLength < 5) {
        return card;
    }
    if (cardLength < 8) {
        return `${card.slice(0, 4)} ${card.slice(4, cardLength)}`;
    }
    if(cardLength<12) {
        return `${card.slice(0, 4)} ${card.slice(4, 8)} ${card.slice(8,cardLength)}`;
    }
    if(cardLength<17) {
        return `${card.slice(0, 4)} ${card.slice(4, 8)} ${card.slice(8,12)} ${card.slice(12, cardLength)}`;
    }
}