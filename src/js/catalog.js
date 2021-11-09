window.lottie = require('lottie-web');

let placeholder = document.querySelector(".catalog-items");
let chairs;
let chairsDefault;
let id;
let basketAmount = document.querySelector(".amount-of-chairs")
basketAmount.innerHTML = localStorage.getItem('amountOfChairs');

let allCont = document.querySelector('.all-content');
allCont.style.display = 'none';

//animation
let animation = lottie.loadAnimation({
    container: document.getElementById('anim'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'ChairLottie.json'
})

window.onload = function(){
    let el = document.getElementById('anim');
    window.setTimeout(function () {
        el.style.display = 'none';
        allCont.style.display = 'block';
        document.body.style['overflow-y'] = "scroll";
      }, 3000);
  };

//получение стульев

function getChairsDescription() {
    return fetch('https://furniture-a1bbb-default-rtdb.europe-west1.firebasedatabase.app/.json')
        .then(function (response) {
            return response.json(); //превращение строки в js-объект
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
        });
}
getChairsDescription();



//отрисовка стульев

function renderChairs(chairs) {
    for (let i = 0; i < chairs.length; i++) {
        let chair = chairs[i];
        let classNumber = "first";
        if (i > 5 && i < 12) {
            classNumber = "second";
        }
        if (i >= 12) {
            classNumber = "third";
        }
        const template = `
            <div class="item ${classNumber}" data-bs-toggle="modal" data-bs-target="#myModal"
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

// соответствие модулей  
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
        let chairObj = {id:id, quantity:quantity};
        parsedChairsArray.push(chairObj);
        stringChairsArray = JSON.stringify(parsedChairsArray);
        localStorage.setItem("chairsArray", stringChairsArray); 
    }
}

// добавление дополнительных стульев

let buttonIsClicked = 0;
let seeMore = document.querySelector(".see-more-btn")
seeMore.onclick = () => {
    $('.second').addClass('displayed');
    $('.second').removeClass('second');
    if (buttonIsClicked > 0) {
        $('.third').addClass('displayed');
        $('.third').removeClass('third');
    }
    buttonIsClicked++;
}

// сортировка

let sortByPrice = document.querySelector('.sort-price');
let sortByPriceHigh = document.querySelector('.sort-price-high');
let sortByDefault = document.querySelector('.sort-default');

sortByPrice.onclick = () => {
    if (chairs) {
        let sortedChairs = chairs.sort(function (a, b) {
            return a.price - b.price
        })
        placeholder.innerHTML = "";
        renderChairs(sortedChairs);
    }
}
sortByPriceHigh.onclick = () => {
    if (chairs) {
        let sortedChairs = chairs.sort(function (a, b) {
            return b.price - a.price
        })
        placeholder.innerHTML = "";
        renderChairs(sortedChairs);
    }
}
sortByDefault.onclick = () => {
    if (chairs) {
        placeholder.innerHTML = "";
        renderChairs(chairsDefault);
    }
}

// ADD ONE 

let buttonAddOne = document.querySelector(".add-one"); 
let chairQuantity = document.querySelector(".chair-quantity");
let counter = 1;
buttonAddOne.onclick = () => { 
    if(counter >= 3){
        counter = 3;
    }else{
        chairQuantity.innerHTML = ++counter;
    }
}
let modalEvent = document.querySelector("#myModal");
modalEvent.addEventListener('hidden.bs.modal', function (e) {
    counter = 1;
    chairQuantity.innerHTML = 1;
})

