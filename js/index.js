function appendElement(e, name, parentElement){
    let newElement = document.createElement(e);
    newElement.className = name;
    parentElement.appendChild(newElement);
    return newElement;
}


// -------- url --------

var url = 'https://api.appworks-school.tw/api/1.0/';
var hostName = 'https://api.appworks-school.tw/';

// -------- header element --------

var header = document.querySelector('header');
var banners = appendElement('div', 'banners', header);

// -------- section element --------

var section = document.querySelector('section');
var newContainer = appendElement('div', 'container', section);

// -------- default value --------

var nextPage = 0;
var loading = false;
var scrollToButton = false;
var currentCategory = 'all';



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


// -------- render items in page function --------

var putData = function(data){
    for(var i = 0;i<data.length;i++){
        let newItem = appendElement('div', 'item', newContainer);
        let newItemA = appendElement('a', 'a', newItem);
        newItemA.href = `product.html?id=${data[i].id}`;
        let newImg = appendElement('img', 'img', newItemA);
        newImg.src = data[i].main_image;
        let newName = appendElement('p', 'name', newItemA);
        newName.innerText = data[i].title;

        let newColor = appendElement('div', '', newItemA);
        let dataColor = data[i].colors;  //array
        for(var j = 0;j<dataColor.length;j++){
            let colorBlock = appendElement('div', 'color', newColor);
            colorBlock.style.display = 'inline-block';
            colorBlock.style.backgroundColor = `#${dataColor[j].code}`;
        }
        
        let newPrice = appendElement('p', 'price', newItemA);
        newPrice.innerText = `TWD. ${data[i].price}`;
    }
};

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


// --------- when click to different category, run to different pages function -----------

function chooseCategory(){
    if(currentUrlTag){
        if(currentUrlTag === 'women'){
            newContainer.innerHTML='';
            currentCategory = 'women';
            ajax('women');
            
        }else if(currentUrlTag === 'men'){
            newContainer.innerHTML='';
            currentCategory = 'men';
            ajax('men');
            
        }else if(currentUrlTag === 'accessories'){
            newContainer.innerHTML='';
            currentCategory = 'accessories';
            ajax('accessories');
            
        }else{
            newContainer.innerHTML='';
            currentCategory = 'search';
            ajax('search');
            
        }
    }else{
        newContainer.innerHTML='';
        ajax('all');
        currentCategory = 'all';
    }
}


// --------- ajax function ----------


function ajax(category){
    loading = true;
    var req = new XMLHttpRequest();
    if(scrollToButton === false){
        if(currentCategory === 'search'){
            req.open('GET',`${url}products/${category}?keyword=${currentUrlTag}`);
        }else{
            req.open('GET',`${url}products/${category}`);
        }
    }else if(scrollToButton === true){
        if(nextPage){
            if(currentCategory === 'search'){
                req.open('GET',`${url}products/${category}?keyword=${currentUrlTag}&paging=${nextPage}`);
            }else{
                req.open('GET',`${url}products/${category}?paging=${nextPage}`);
            }
        }else {
            loading = false;
            scrollToButton = false;
            return;
        }
    }

    req.onload = function(){
        loading = false;
        if(req.status === 200){
            var productsList = JSON.parse(req.responseText);
            var data = productsList.data;
            nextPage = productsList.next_paging;
            putData(data);
        }else if(req.status === 400){
            console.log('Error message.');
        }
    }
    
    req.send();
}


function marketing(){
    var req = new XMLHttpRequest();
    
    req.open('GET', `${url}marketing/campaigns`);

    req.onload = function(){
        var productsList = JSON.parse(req.responseText);
        var data = productsList.data;
        

        for(var i = 0; i<data.length; i++){
            let banner = appendElement('div', 'banner', banners);
            banner.id = `bannerIndex${i}`;
            banner.style.opacity = 0;
            banner.style.backgroundImage = `url(${hostName}${data[i].picture})`;

            let text = appendElement('p', 'text', banner);
            let smallCap = document.createElement('span');
            smallCap.id = 'small-cap';
            let pictureStortyArray = data[i].story.split("\r\n");
            let pictureStortyHtml = '';
            let pictureStortyLastLine = pictureStortyArray[pictureStortyArray.length-1];
            for(var j = 0; j<pictureStortyArray.length-1; j++){
                pictureStortyHtml += pictureStortyArray[j]+'</br>'
            }

            smallCap.innerHTML = pictureStortyLastLine;
            text.innerHTML = pictureStortyHtml;
            text.appendChild(smallCap);

        }     

        var circles = appendElement('div', 'circles', banners);

        for(var i = 0; i<data.length; i++){
            let circle = appendElement('div', 'circle', circles);
            circle.id = `circleIndex${i}`;
        }

        if(req.status === 200){
            
            let currentBannerIndex = 0;  
            function slide(){
                for(var i = 0; i<data.length; i++){
                    let eachBanner = document.getElementById(`bannerIndex${i}`);
                    eachBanner.style.opacity = 0;
                    let eachCircle = document.getElementById(`circleIndex${i}`);
                    eachCircle.style.backgroundColor = '#BDC3C7';
                }
                
                let currentBanner = document.getElementById(`bannerIndex${currentBannerIndex}`);
                currentBanner.style.opacity = 1;
                let currentCircle = document.getElementById(`circleIndex${currentBannerIndex}`);
                currentCircle.style.backgroundColor = '#8b572a';

                if(currentBannerIndex<data.length-1){
                    currentBannerIndex += 1;
                }else{
                    currentBannerIndex = 0;
                }       
            }

            slide();
            setInterval(slide, 10000);

        }else if(req.status === 400){
            console.log('Error message.');
        }       
    }

    req.send();
}


window.onload = function(){
    marketing();
    chooseCategory();
    document.getElementById('loading').style.display = 'none';
}


window.addEventListener('scroll', () => {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var scrolled = window.scrollY;
    if(scrolled+100 > scrollable && loading === false){
        scrollToButton = true;
        ajax(currentCategory);
    } 
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




