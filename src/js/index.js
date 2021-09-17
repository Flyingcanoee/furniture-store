window.$ = require('jquery')

// //скролл страницы
let navContacts = document.getElementById("navContacts")
let navAbout = document.getElementById("navAbout")
let navInteriors = document.getElementById("navInteriors")
let basketAmount = document.querySelector(".amount-of-chairs")
basketAmount.innerHTML = localStorage.getItem('amountOfChairs');
navContacts.onclick = function scrollTo() {
    smoothScrollingTo('#contacts');
}
navAbout.onclick = function scrollTo() {
    smoothScrollingTo('#about');
}
navInteriors.onclick = function scrollTo() {
    smoothScrollingTo('#interior');
}

function smoothScrollingTo(target) {
    $('html,body').animate({
        scrollTop: $(target).offset().top
    }, 1000);
}

var myCarousel = document.getElementById('carouselExampleIndicators');
//Названия стульев

let chairName0 = document.getElementById("chair0");
let chairName1 = document.getElementById("chair1");
let chairName2 = document.getElementById("chair2");
let chairNames = [chairName0, chairName1, chairName2];

// Вторые названия 

let chairFirstName0 = document.getElementById('chairFirstName0');
let chairFirstName1 = document.getElementById('chairFirstName1');
let chairFirstName2 = document.getElementById('chairFirstName2');

let chairFirstNames = [chairFirstName0, chairFirstName1, chairFirstName2];

myCarousel.addEventListener('slide.bs.carousel', function (argument) {
    const chairNum = argument.to;
    const chairExNum = argument.from;
    chairNames[chairNum].classList.add("higher-position");
    chairFirstNames[chairNum].classList.add("higher-position-first-name");
    chairNames[chairExNum].classList.remove("higher-position");
    chairFirstNames[chairExNum].classList.remove("higher-position-first-name");
})

// ADD ONE 

let buttonAddOne = document.querySelector(".add-one");
let chairQuantity = document.querySelector(".chair-quantity");
let counter = 1;
buttonAddOne.onclick = () => {
    if (counter >= 3) {
        counter = 3;
    } else {
        chairQuantity.innerHTML = ++counter;
    }
}
$('#myModal').on('hidden.bs.modal', function (e) {
    counter = 1;
    chairQuantity.innerHTML = 1;
})

// получение стульев:

let placeholder = document.querySelector(".items-phone-container");
let chairs;
let chairsDefault;
let id;

function getChairsDescription() {
    return fetch('https://furniture-a1bbb-default-rtdb.europe-west1.firebasedatabase.app/.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (chairsInfo) {
            chairs = Object.values(chairsInfo);
            id = Object.keys(chairsInfo);
            chairsDefault = [...chairs];
            for (i = 0; i < chairsDefault.length; i++) {
                chairsDefault[i].id = id[i];
            }
            renderChairs(chairsDefault);
            return chairs;
        })

        .catch(function (error) {
            console.error(error);
        })

}
getChairsDescription();

//отрисовка стульев

function renderChairs(chairs) {
    for (let i = 0; i < 8; i++) {
        let chair = chairs[i];
        const template = `
            <div class="item" data-bs-toggle="modal" data-bs-target="#myModal"
            onclick="modalModify('${chair.img}', '${chair.name}', '${chair.price}', 
            '${chair.availableQuantity}', '${chair.id}')" >
            <img src="${chair.img}" class="chair-photo" alt="">
            <h4 class="chair-name">${chair.name}</h4>
            <p class="price">$${chair.price}</p>
            </div>
            `;

        placeholder.innerHTML = placeholder.innerHTML + template;
    }
}

//соответствие модулей
let whatIsInArray = localStorage.getItem("chairsArray");
if (!whatIsInArray) {
    localStorage.setItem("chairsArray", "[]");
}

window.modalModify = (img, name, price, quantity, id) => {
    let modalImg = document.querySelector(".modal-image");
    let modalChairName = document.querySelector(".chair-name")
    let modalChairPrice = document.querySelector(".chair-price")
    modalImg.setAttribute("src", img);
    modalChairName.innerHTML = name;
    modalChairPrice.innerHTML = "$" + price;
    let order = document.querySelector('.order');
    order.onclick = () => {
        quantity = counter;
        let chairsArray = localStorage.getItem('chairsArray');
        let parsedChairsArray = JSON.parse(chairsArray);
        let chairObj = {
            id: id,
            quantity: quantity
        };
        parsedChairsArray.push(chairObj);
        stringChairsArray = JSON.stringify(parsedChairsArray);
        localStorage.setItem("chairsArray", stringChairsArray);
    }
}