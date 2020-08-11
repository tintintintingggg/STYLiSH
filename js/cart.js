function appendElement(e, name, parentElement){
    let newElement = document.createElement(e);
    newElement.className = name;
    parentElement.appendChild(newElement);
    return newElement;
}


// -------- Facebook log in ----------

var signinData;
window.fbAsyncInit = function() {
    FB.init({
      appId      : '658497228331611',
      cookie     : true,
      xfbml      : true,
      version    : 'v7.0'
    });
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
        signinData = {
            'provider': 'facebook',
            'access_token': accessToken
        }
    }); 
};


(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var accessToken;
function statusChangeCallback(response){
   if (response.status === 'connected'){
       // 已登入
       accessToken = response.authResponse.accessToken;
       console.log('logged in!');
       document.getElementById('member2').addEventListener('click', () => {
        window.location = 'member.html';
       });
   } else {
       // 尚未登入
       console.log('not logged in!');
       document.getElementById('member2').addEventListener('click', () => {
        FB.login(function(response) {
        statusChangeCallback(response);
        }, {
            scope: 'public_profile,email'
        });
        });
   }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}


// -------- url --------

var url = 'https://api.appworks-school.tw/api/1.0/';
var hostName = 'https://api.appworks-school.tw/';



// -------- pop up search input --------

var submitButton = document.getElementById('search2');
var searchButton = document.querySelector('#search1');
var searchInput = document.querySelector('.pop-up-input');
var searchInputWeb = document.querySelector('#web-input');

searchButton.addEventListener('click', () => {
   searchInput.setAttribute('id', 'pop-up-input');
   searchButton.style.display = 'none';
   submitButton.style.display = 'block';

});


// --------- get tag name from url -----------

var currentUrlString = location.href;
var currentUrl = new URL(currentUrlString);
var currentUrlTag = currentUrl.searchParams.get('tag');


var searchItemName;
var searchItemButton = document.getElementById('searchItemButton');
searchItemButton.addEventListener('click', () => {
    if(window.innerWidth < 751){
        searchItemName = searchInput.value;
    }else{
        searchItemName = searchInputWeb.value;
    }
    searchItemButton.href = `index.html?tag=${searchItemName}`;
    
});


// -------- store amount of items added to cart ---------

var cartNumberIcon = document.getElementById('cart-number-icon');

var totalInCart;
if(localStorage.getItem('totalInCart')){
    totalInCart = Number(localStorage.getItem('totalInCart'));
}else{
    totalInCart = 0;
}
cartNumberIcon.innerText = totalInCart;


var orderItemsList = [];
if(JSON.parse(localStorage.getItem('orderItemsList'))){
    orderItemsList = JSON.parse(localStorage.getItem('orderItemsList'));
}

var shoppingCart = document.querySelector('.shopping-cart');
var shoppingCartTitle = appendElement('div', 'title', shoppingCart);
shoppingCartTitle.innerText = `購物車 (${orderItemsList.length})`;
var webTitle = appendElement('div', 'web-title', shoppingCartTitle);
var amountTitle = appendElement('div', 'web-qty', webTitle);
amountTitle.innerText = '數量';
var unitPriceTitle = appendElement('div', 'web-unitP', webTitle);
unitPriceTitle.innerText = '單價';
var totalPriceTitle = appendElement('div', 'web-totalP', webTitle);
totalPriceTitle.innerText = '小計';

var productsIncart = appendElement('div', 'products-incart', shoppingCart);

function putCartProductsInfo(){
    if(JSON.parse(localStorage.getItem('orderItemsList'))){
        orderItemsList = JSON.parse(localStorage.getItem('orderItemsList'));
        for(var i = 0; i<orderItemsList.length; i++){
            let item = appendElement('div', 'item', productsIncart);
            // id
            item.id = `item${i}`; 
    
            let itemInfo = appendElement('div', 'item-info', item);
            let itemImgDiv = appendElement('div', 'item-img-container', itemInfo);
            let itemImg = appendElement('img', 'item-img', itemImgDiv);
            itemImg.src = orderItemsList[i].img;
            let itemContent = appendElement('div', 'content', itemInfo);
            let itemName = appendElement('div', 'name', itemContent);
            itemName.innerText = orderItemsList[i].name;
            let itemId = appendElement('div', 'id', itemContent);
            itemId.innerText = orderItemsList[i].id;
            let itemColor = appendElement('div', 'color', itemContent);
            let itemColorName = appendElement('div', 'text', itemColor);
            itemColorName.innerText = '顏色';
            let itemColorDetail = appendElement('div', 'detail', itemColor);
            itemColorDetail.innerText = orderItemsList[i].color.name;
            let itemSize = appendElement('div', 'size', itemContent);
            let itemSizeName = appendElement('div', 'text', itemSize);
            itemSizeName.innerText = '尺寸';
            let itemSizeDetail = appendElement('div', 'detail', itemSize);
            itemSizeDetail.innerText = orderItemsList[i].size;
    
            let buyingInfo = appendElement('div', 'buying-info', item);
            let buyingQty = appendElement('div', 'qty', buyingInfo);
            let qtyText = appendElement('div', 'text', buyingQty);
            qtyText.innerText = '數量';
            let qtySelectDiv = appendElement('div', 'select-qty', buyingQty);
            let qtySelect = appendElement('select', 'select', qtySelectDiv);
            // id
            qtySelect.id = `select${i}`;
            for(var j = 1; j<orderItemsList[i].stockAmount+1; j++){
                let qtySelectOpt = appendElement('option', 'option', qtySelect);
                qtySelectOpt.value = j;
                qtySelectOpt.innerText = j;
                if(j == orderItemsList[i].qty){
                    qtySelectOpt.selected = 'selected';
                }
            }
            let selectedOption = qtySelect.options[qtySelect.selectedIndex].value;
    
            let buyingUnitPrice = appendElement('div', 'unit-price', buyingInfo);
            let unitText = appendElement('div', 'text', buyingUnitPrice);
            unitText.innerText = '單價';
            let unitDetail = appendElement('div', 'detail', buyingUnitPrice);
            //id 
            unitDetail.id = `unitPrice${i}`;
            unitDetail.value = orderItemsList[i].price;
            unitDetail.innerText = `NT.${orderItemsList[i].price}`;
    
            let buyingTotalPrice = appendElement('div', 'total-price', buyingInfo);
            let totalText = appendElement('div', 'text', buyingTotalPrice);
            totalText.innerText = '小計';
            let totalDetail = appendElement('div', 'detail', buyingTotalPrice);
            // id
            totalDetail.id = `totalPrice${i}`;
            totalDetail.value = orderItemsList[i].price*selectedOption;
            totalDetail.innerText = `NT.${orderItemsList[i].price*selectedOption}`;
    
            let img = appendElement('img', 'remove-logo', item);
            // id
            img.id = i;
            img.src = 'images/cart-remove.png';
            img.addEventListener('mouseover', () => {
                img.src = 'images/cart-remove-hover.png';
            })
            img.addEventListener('mouseout', () => {
                img.src = 'images/cart-remove.png';
            })
        }
    }
}


// -------- changeTotalPrice ---------



function changeTotalPrice(){
    if(JSON.parse(localStorage.getItem('orderItemsList'))){
        for(var i = 0; i<orderItemsList.length; i++){
            let selectQty = document.getElementById(`select${i}`);
            let totalPrice = document.getElementById(`totalPrice${i}`);
            let unitPrice = document.getElementById(`unitPrice${i}`);
            selectQty.onchange = function(){
                totalPrice.value = unitPrice.value*selectQty.value;
                totalPrice.innerText = `NT.${unitPrice.value*selectQty.value}`;
                totalInCart = 0;
                for(var j = 0; j<orderItemsList.length; j++){
                    if(orderItemsList[j].qty !== document.getElementById(`select${j}`).value){
                        orderItemsList[j].qty = document.getElementById(`select${j}`).value;
                    }
                    totalInCart += Number(orderItemsList[j].qty);
                }
                orderItemsListJson = JSON.stringify(orderItemsList);
                localStorage.setItem('orderItemsList', orderItemsListJson);
                localStorage.setItem('totalInCart', totalInCart);
                cartNumberIcon.innerText = localStorage.getItem('totalInCart');
                calcTotalPaied();
                changeTotalPrice();
            }
        }
    }
}

// -------- remove items ---------


function removeItem(){
    if(JSON.parse(localStorage.getItem('orderItemsList'))){
        for(var i = 0; i<orderItemsList.length; i++){
            let removeLogo = document.getElementById(i);
            removeLogo.addEventListener('click', (e) => {
                var index = Number(e.target.id);
                orderItemsList.splice(index, 1);
                orderItemsListJson = JSON.stringify(orderItemsList);
                localStorage.setItem('orderItemsList', orderItemsListJson);
                productsIncart.innerHTML = '';
                putCartProductsInfo();
                alert('你已移除一項商品');
    
                totalInCart = 0;
                for(var j = 0; j<orderItemsList.length; j++){
                    totalInCart += Number(orderItemsList[j].qty);
                }
                localStorage.setItem('totalInCart', totalInCart);
                cartNumberIcon.innerText = localStorage.getItem('totalInCart');
                shoppingCartTitle.innerText = `購物車 (${orderItemsList.length})`;
                calcTotalPaied();
                changeTotalPrice();
                removeItem();
            })
        }
    }
}

// -------- calculate total price and shipping ---------

function calcTotalPaied(){
    if(JSON.parse(localStorage.getItem('orderItemsList'))){
        var totalAmount = document.getElementById('total-amount');
        var totalPaied = document.getElementById('total-paied');
        var sum = 0;
        for(var i = 0; i<orderItemsList.length; i++){
            sum += orderItemsList[i].qty*orderItemsList[i].price;
        }
        totalAmount.innerText = sum;
        totalPaied.innerText = sum+60;
        return;
    }
}


// --------- tappay ---------

TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox');

TPDirect.card.setup({
    fields: {
        number: {
            element: document.getElementById('card-number'),
            placeholder: '**** **** **** ****',
        },
        expirationDate: {
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: document.getElementById('card-ccv'),
            placeholder: 'ccv'
        }
    }
})


let postData;
var checkedTime = document.getElementById('anytime').value;
var prime;
var submitButton = document.querySelector('#submit-button');


function desideCheckedTime(){
    if(document.getElementById('morning').checked){
        checkedTime = document.getElementById('morning').value;
    }else if(document.getElementById('afternoon').checked){
        checkedTime = document.getElementById('afternoon').value;
    }else{
        checkedTime = document.getElementById('anytime').value;
    }
}


function putPostData(prime, time){
    orderItemsList = JSON.parse(localStorage.getItem('orderItemsList'));
    var subtotalSum = 0;
    for(var i = 0; i<orderItemsList.length; i++){
        let subtotal = orderItemsList[i].qty*orderItemsList[i].price;
        subtotalSum += subtotal;
    }

    postData = {
        "prime": prime,
        "order": {
            "shipping": "delivery",
            "payment": "credit_card",
            "subtotal": subtotalSum,
            "freight": 60,
            "total": subtotalSum+60,
            "recipient": {
                "name": document.getElementById('recipient').value,
                "phone": document.getElementById('cellphone').value,
                "email": document.getElementById('email').value,
                "address": document.getElementById('address').value,
                "time": time
            },
            "list": []
        }
    }

    for(var i = 0; i<orderItemsList.length; i++){
        postData.order.list[i] = {};
        postData.order.list[i].id = orderItemsList[i].id;
        postData.order.list[i].name = orderItemsList[i].id;
        postData.order.list[i].price = orderItemsList[i].price;
        postData.order.list[i].color = {};
        postData.order.list[i].color.code = orderItemsList[i].color.code;
        postData.order.list[i].color.name = orderItemsList[i].color.name;
        postData.order.list[i].size = orderItemsList[i].size;
        postData.order.list[i].qty = orderItemsList[i].qty;
    }
    
}


var orderNumber;
var regPhone = /[0-9]{10}/;
var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

submitButton.addEventListener('click', () => {
    TPDirect.card.getPrime(function (result) {
        if (result.status !== 0) {
            alert('信用卡資訊有誤');
        }
        prime = result.card.prime
        if(document.getElementById('recipient').value && document.getElementById('cellphone').value && document.getElementById('email').value && document.getElementById('address').value){
            if(!document.getElementById('cellphone').value.match(regPhone) || document.getElementById('cellphone').value.length !== 10){
                alert('手機號碼格式填寫錯誤（需填入十碼數字）');
            }else if(!document.getElementById('email').value.match(regEmail)){
                alert('E-mail 格式填寫錯誤');
            }else {
                desideCheckedTime();
                putPostData(prime, checkedTime);
                ajax(postData);
                signin(signinData);
                return;
            }
        }else if(!document.getElementById('recipient').value){
            alert('收件人姓名有缺失！');
        }else if(!document.getElementById('cellphone').value){
            alert('手機號碼有缺失！');
        }else if(!document.getElementById('email').value){
            alert('E-mail 有缺失！');
        }else if(!document.getElementById('address').value){
            alert('地址有缺失！');
        }
    })
})


function ajax(postData){
    document.getElementById('loading').style.display = 'flex';
    var req = new XMLHttpRequest();
    req.open('POST', `${url}order/checkout`);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    req.onload = function(){
       console.log('Connect is ready!');
       var res = req.responseText;
       var resObj = JSON.parse(res);
       orderNumber = resObj.data.number;
       localStorage.setItem('orderNumber',orderNumber);
       document.getElementById('loading').style.display = 'none';
       alert('付款成功！');
       localStorage.removeItem('orderItemsList');
       localStorage.removeItem('totalInCart');
       window.location = 'thankyou.html';
    }
    req.send(JSON.stringify(postData));
}


function signin(signinData){
    var req = new XMLHttpRequest();
    req.open('POST', `${url}user/signin`);
    req.setRequestHeader("Content-type", "application/json");
    req.onload = function (){
        console.log('signin is ready');
    }
    req.send(JSON.stringify(signinData));
}

window.onload = function(){
    orderItemsList = JSON.parse(localStorage.getItem('orderItemsList'));
    putCartProductsInfo();
    calcTotalPaied()
    changeTotalPrice();  
    removeItem();
}