function appendElement(e, name, parentElement){
    let newElement = document.createElement(e);
    newElement.className = name;
    parentElement.appendChild(newElement);
    return newElement;
}

// url
var url = 'https://api.appworks-school.tw/api/1.0/';
var hostName = 'https://api.appworks-school.tw/';


// ------- search input --------

var submitButton = document.getElementById('search2');
var searchButton = document.querySelector('#search1');
var searchInput = document.querySelector('.pop-up-input');
var searchInputWeb = document.querySelector('#web-input');


searchButton.addEventListener('click', () => {
   searchInput.setAttribute('id', 'pop-up-input');
   searchButton.style.display = 'none';
   submitButton.style.display = 'block';

});


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


var putData = function(data){

    var variants = data.variants;

    // ------- container -> product picture --------

    let productPic = appendElement('div', 'product-pic', container);
    let img = appendElement('img', 'img', productPic);
    img.src = data.main_image;
    img.alt = 'product';

    // ------- container -> index --------

    let index = appendElement('div', 'index', container);

    // ------- container -> index -> main index --------

    let mainIndex = appendElement('div', 'main-index', index);
    let name = appendElement('div', 'name', mainIndex);
    let number = appendElement('div', 'number', mainIndex);
    let price = appendElement('div', 'price', mainIndex);
    let bottomLine = appendElement('div', 'bottom-line', mainIndex);
    let selector = appendElement('div', 'selector', mainIndex);
    let color = appendElement('div', 'color', selector);
    let colorText = appendElement('div', 'text', color);
    let colorIcons = appendElement('div', 'icons', color);
    
    let size = appendElement('div', 'size', selector);
    let sizeText = appendElement('div', 'text', size);
    let sizeIcons = appendElement('div', 'icons', size);
    
    let chooseNumber = appendElement('div', 'choose-number', mainIndex);
    let decreButton = appendElement('button', 'decrease', chooseNumber);
    let amount = appendElement('p', 'amount', chooseNumber);
    let increButton = appendElement('button', 'increase', chooseNumber);

    let addCart = appendElement('div', 'add-cart', mainIndex);
    let addCartButton = appendElement('button', 'add-cart-button', addCart);
    
    name.innerText = data.title;
    number.innerText = data.id;
    price.innerText = `TWD. ${data.price}`;
    bottomLine.innerHTML = '&nbsp;';


    // ------- decide the amount of stock --------

    // defalt number in the button 

    var amountNumber = 0;
    amount.innerText = amountNumber;

    // color

    var colorIconArray = [];
    colorText.innerText = '顏色';
    for(var i = 0; i<data.colors.length; i++){
        let colorIcon = appendElement('div', 'icon', colorIcons);
        colorIcon.style.backgroundColor = `#${data.colors[i].code}`;
        colorIcon.colorCode = data.colors[i].code;
        colorIcon.colorName = data.colors[i].name;
        colorIconArray[i] = colorIcon;
    }

    var selectedColorCode;
    var selectedColorName;
    colorIconArray.map((colorIcon) => {
        colorIcon.addEventListener('click', (e) => {
            for(var i = 0; i<colorIconArray.length; i++){
                colorIconArray[i].style.outlineColor = '#ececec';
            }
            e.target.style.outlineColor = '#979797';
            selectedColorCode = e.target.colorCode;
            selectedColorName = e.target.colorName;
            amountNumber = 0;
            amount.innerText = amountNumber;
            addCartOrNot(amountNumber);

            decideStock();
            return;
        })
    })

    // size

    var  sizeIconArray = [];
    sizeText.innerText = '尺寸';
    for(var i = 0; i<data.sizes.length; i++){
        let sizeIcon = appendElement('div', 'icon', sizeIcons);
        sizeIcon.innerText = data.sizes[i];
        sizeIcon.size = data.sizes[i];
        sizeIconArray[i] = sizeIcon;
    }

    var selectedSize;
    sizeIconArray.map((sizeIcon) => {
        sizeIcon.addEventListener('click', (e) => {
            for(var i = 0; i<sizeIconArray.length; i++){
                sizeIconArray[i].style.backgroundColor = '#ececec';
                sizeIconArray[i].style.color = '#3f3a3a';
            }
            e.target.style.backgroundColor = 'black';
            e.target.style.color = '#f5f5f5';
            selectedSize = e.target.size;
            amountNumber = 0;
            amount.innerText = amountNumber;
            addCartOrNot(amountNumber);

            decideStock();
            return;
        })
    })

    // decide amount of stock by selectedcolor and selectedsize

    var stockAmount;
    function decideStock(){
        for(var i = 0; i<variants.length; i++){
            addCartOrNot(amountNumber);
            if(variants[i].color_code === selectedColorCode){
                if(variants[i].size === selectedSize){
                    stockAmount = variants[i].stock;
                    return;
                }
            }else if(variants[i].size === selectedSize){
                if(variants[i].color_code === selectedColorCode){
                    stockAmount = variants[i].stock;
                    return;
                }
            }
        }
    }

    
    // increase and decrease button
    
    decreButton.innerText = '-';
    increButton.innerText = '+';
    addCartButton.innerText = '請選擇尺寸'

    decreButton.addEventListener('click', () => {
        if(amountNumber > 0){
            amountNumber -= 1;
            amount.innerText = amountNumber;
        }
        addCartOrNot(amountNumber);
    })
    increButton.addEventListener('click', () => {
        if(amountNumber < stockAmount){
            amountNumber += 1;
            amount.innerText = amountNumber;
        }
        addCartOrNot(amountNumber);
    })


    
    function addCartOrNot(amountNumber){
        if(amountNumber === 0){
            addCartButton.innerText = '請選擇尺寸';
        }else{
            addCartButton.innerText = '加入購物車';
        }
    }

    let orderItemsList = [];
    var orderItemsListJson;

    addCartButton.addEventListener('click', () => {

        if(amountNumber !== 0){
            let orderItems = {
                'id': data.id,
                'name': data.title,
                'price': data.price,
                'img': data.main_image,
                'color': {
                    'name': selectedColorName,
                    'code': selectedColorCode
                },
                'size': selectedSize,
                'qty': amountNumber,
                'stockAmount': stockAmount 
            };
    
            var isMatch;
            if(!localStorage.getItem('orderItemsList')){
                orderItemsList.push(orderItems);
                orderItemsListJson = JSON.stringify(orderItemsList);
                localStorage.setItem('orderItemsList', orderItemsListJson);
            }else{
                orderItemsList = JSON.parse(localStorage.getItem('orderItemsList'));
                isMatch = false;
                for(var i = 0; i<orderItemsList.length; i++){
                    if(orderItems.id === orderItemsList[i].id && orderItems.color.name === orderItemsList[i].color.name && orderItems.size === orderItemsList[i].size){
                        orderItemsList[i].qty = orderItems.qty;
                        orderItemsListJson = JSON.stringify(orderItemsList);
                        localStorage.setItem('orderItemsList', orderItemsListJson);
                        isMatch = true;
                        break;
                    }
                }
                
                if(isMatch === false){
                    orderItemsList.push(orderItems);
                    orderItemsListJson = JSON.stringify(orderItemsList);
                    localStorage.setItem('orderItemsList', orderItemsListJson);
                }
            }
    
            var total = 0;
            for(var i = 0; i<orderItemsList.length; i++){
                total += Number(orderItemsList[i].qty);
            }
            totalInCart = total;
            cartNumberIcon.innerText = totalInCart;
            localStorage.setItem('totalInCart', totalInCart);
            alert('商品已加入購物車');
            return;
        }
    })
    

    // ------- container -> index -> sub index --------

    let subIndex = appendElement('div', 'sub-index', index);
    let paragraph = appendElement('p', 'paragraph', subIndex);
    descriptionArray = data.description.split('\r\n');
    let description = descriptionArray.join('</br>');
    paragraph.innerHTML = `*${data.note}</br></br>${data.texture}</br>${description}</br></br>產地：${data.place}</br>清洗方式：${data.wash}`

    // ------- container -> detail --------

    let detail = appendElement('div', 'detail', container);
    let title = appendElement('div', 'title', detail);
    let decorationLine = appendElement('div', 'decoration-line', detail);
    let story = appendElement('p', 'story', detail);
    

    title.innerText = '細部說明';
    decorationLine.innerHTML = '&nbsp';
    story.innerText = data.story;
    for(var i = 0; i<data.images.length; i++){
        let image = appendElement('img', 'img', detail);
        image.src = data.images[i];
    }
};


 // ------- put products details in page --------


var currentUrlString = location.href;
var currentUrl = new URL(currentUrlString);
var currentUrlId = currentUrl.searchParams.get('id');


var section = document.querySelector('section');
var container = appendElement('div', 'container', section);


function getProductDetail(){
    var req = new XMLHttpRequest();
    req.open('GET', `${url}products/details?id=${currentUrlId}`);

    req.onload = function(){
        var productsList = JSON.parse(req.responseText);
        var data = productsList.data;

        putData(data);
    };

    req.send();
}

window.onload = function(){
    getProductDetail();
}



var totalInCart;
var cartNumberIcon = document.getElementById('cart-number-icon');
if(localStorage.getItem('totalInCart')){
    totalInCart = Number(localStorage.getItem('totalInCart'));
}else{
    totalInCart = 0;
}
cartNumberIcon.innerText = totalInCart;


// -------- Facebook log in ----------

window.fbAsyncInit = function() {
    FB.init({
      appId      : '658497228331611',
      cookie     : true,
      xfbml      : true,
      version    : 'v7.0'
    });

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    }); 
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response){
   if (response.status === 'connected'){
       // 已登入
       console.log('logged in!');
       document.getElementById('member2').addEventListener('click', () => {
        window.location = 'member.html';
       });
   } else {
       // 尚未登入
       console.log('not logged in!');
       document.getElementById('member2').addEventListener('click', () => {
        // 進行登入程序
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


