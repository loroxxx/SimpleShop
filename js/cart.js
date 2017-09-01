
function Cart() {

    var map = {};
    var totalAmount = 0;
    var public = new Object();
    var products;
    var cartWrapper;
    var cartBody;
    var cartList;
    var cartTrigger;
    var cartCount;
    var addToCartBtn;
    var products;



    function toggleCart(bool) {
        var cartIsOpen = (typeof bool === 'undefined') ? cartWrapper.hasClass('cart-open') : bool;

        if (cartIsOpen) {
            cartWrapper.removeClass('cart-open');

            setTimeout(function() {
                cartBody.scrollTop(0);
                //check if cart empty to hide it
                if (Number(products.children().length) == 0) cartWrapper.addClass('empty');
            }, 500);
        } else {
            cartWrapper.addClass('cart-open');
        }
    }


    function updateCartCount() {

        var count = products.children().length;
        var dom=$('#count');
        dom.hide(100,function(){
        	dom.text(count);
        	dom.show();
        });



    }

    function calTotal() {
        totalAmount = 0;
        for (i in map) {
            totalAmount = (Number(totalAmount) + Number(map[i].amount)).toFixed(2);
        }

        // map.total=total;
        $('#totalAmount').text(totalAmount);

    }

    function saveStorage() {
        // console.log(JSON.stringify(map));	
        localStorage.cartContext = JSON.stringify(map);
        localStorage.totalAmount = JSON.stringify(totalAmount);
        // console.log(localStorage.cartContext);
        // console.log(localStorage.totalAmount);

    }



    public.init = function() {

        cartWrapper = $('.cd-cart-container');
        if (cartWrapper.length > 0) {

        	//绑定变量
            cartBody = cartWrapper.find('.body')
            products = $('#products');
            cartList = cartBody.find('ul').eq(0);
            cartTrigger = cartWrapper.children('.cd-cart-trigger');
            cartCount = cartTrigger.children('.count')
   			products = $('#products');


   			//绑定事件
            cartTrigger.on('click', function(event) {
                event.preventDefault();
                toggleCart();
            });

            cartWrapper.on('click', function(event) {
                if ($(event.target).is($(this))) {
                    toggleCart(true);
                }
            });


            $('.add-to-cart').on('click', function(event) {
                event.preventDefault();
                var p = new Object();
                p.title = $(this).data('title');
                p.price = $(this).data('price');
                p.code  = $(this).data('code');
                p.href  = $(this).data('href');
                p.img   = $(this).data('img');
                p.amount = p.price;
                p.num = 1;
                public.add(p);
            });


            $('.remove-all').on('click', function(event) {
                event.preventDefault();

                public.remove();

            });

            $('#products').on('click', '#delete-item', function(event) {
                event.preventDefault();
                var product = $(this).parents('.product');

                public.delete(product.attr("id"));

            });


            $('.checkout').on('click', function(event) {
                public.checkout();
            });


        }
    }



    public.add = function(p) {

        if (typeof(map[p.code]) == "undefined" || map[p.code] === null) {

            map[p.code] = p;
            
            //金额在显示的时候，截取2位小数点
            var productAdded = $('<li class="product" id="' + p.code + '"><div class="product-image"><a href="#0"><img src="' + p.img + '" alt="placeholder"></a></div><div class="product-detail"><p id="product-name">' + p.title + '</p><p id="product-num">'+'<a href="#">- <a/>' + p.num + '<a href="#"> +<a/>'+'</p><p id="product-amount">' + p.amount.toFixed(2) + '</p></div><div class="product-delete"><a id="delete-item" href="#">delete</a></div></li>');
            cartList.prepend(productAdded);

        } else {
            var p = map[p.code];
            p.num = p.num + 1;

            p.amount = p.num * p.price;

            var num = products.find('#' + p.code).find('#product-num');
            num.text(p.num);
            var amount = products.find('#' + p.code).find('#product-amount');
            amount.text(p.amount.toFixed(2));
        }
        // show cart
        cartWrapper.removeClass('empty');
        updateCartCount();
        calTotal();
        saveStorage();
    }




    public.delete = function(code) {
        // map[code]=null;
        console.log(map);
        delete map[code];
        console.log(map);
        var product = products.find('#' + code);
        product.hide(300, function() {
            product.remove()
        });
        updateCartCount();

        calTotal();
        saveStorage();
        // calTotal();
    }

    public.remove = function() {
        map = new Object();
        products.find('li').remove();
        updateCartCount();
        // calTotal();
        totalAmount = 0;
        $('#totalAmount').text(0);
        saveStorage();
    }


    public.checkout = function() {


    }


    public.show = function() {
        console.log(JSON.stringify(map));
    }



    public.initData = function() {
        map = JSON.parse(localStorage.cartContext);
        totalAmount = JSON.parse(localStorage.totalAmount);
        console.log('totalAmount:'+totalAmount);
        if(totalAmount===0){
        	cartWrapper.addClass('empty');
        	return;
        }

        for (var i in map) {
       		var p=map[i];
            var productAdded = $('<li class="product" id="' + p.code + '"><div class="product-image"><a href="#0"><img src="' + p.img + '" alt="placeholder"></a></div><div class="product-detail"><p id="product-name">' + p.title + '</p><p id="product-num">' + p.num + '</p><p id="product-amount">' + p.amount + '</p></div><div class="product-delete"><a id="delete-item" href="#">delete</a></div></li>');
            cartList.prepend(productAdded);

        }
         updateCartCount();
 		 $('#totalAmount').text(totalAmount);
 		cartWrapper.removeClass('empty');

    }

    //返回公共方法
    return public;

}

// var cart=new Cart();

// cart.init();
