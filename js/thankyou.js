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


// --------- order number ---------

var orderNumber = document.getElementById('order-number');
orderNumber.innerText = localStorage.getItem('orderNumber');


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
