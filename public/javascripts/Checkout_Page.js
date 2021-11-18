function getJsonObject(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) success(JSON.parse(xhr.responseText));
            } else {
                if (error) error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

cartList = [];
window.onload = getJsonObject('http://localhost:3000/entry/checkoutPage/data',
    function (data) {
        cartList = data;
        loadCart(cartList);

    },
    function (xhr) { console.error(xhr); }

);


function loadCart(cartList) {

    var table_body = document.getElementById('cart_table').getElementsByTagName('tbody')[0];
    var total_price = 0;
    for (var i = 0; i < cartList.length; i++) {
        var current_row = table_body.insertRow(i);
        var title_cell = current_row.insertCell(0);
        var price_cell = current_row.insertCell(1);
        var quantity_cell = current_row.insertCell(2);
        var remove_cell = current_row.insertCell(3);

        current_row.setAttribute("id", `table-row-${i}`)

        //insert title, price
        title_cell.innerHTML = cartList[i].title;
        price_cell.innerHTML = cartList[i].price;

        price_cell.setAttribute("class", "price");


        //insert quantity and make it adjustable
        var qty = document.createElement("input");
        qty.value = cartList[i].quantity;
        qty.setAttribute("type", "number");
        qty.setAttribute("class", "quantity");
        qty.setAttribute("min", "0");
        qty.setAttribute("max", cartList[i].stock);
        qty.setAttribute("id", `qty-${i}`)

        qty.addEventListener("change", sumup, false);

        quantity_cell.appendChild(qty);

        //insert remove function
        var btn = document.createElement("button");
        btn.innerHTML = 'Remove';
        btn.setAttribute("value", "remove");
        btn.setAttribute("name", "remove_button");
        btn.setAttribute("type", "button");
        btn.setAttribute("id", `btn-${i}`);
        btn.addEventListener("click", remove_item, false);
        remove_cell.appendChild(btn);

    }
    sumup()

}

function remove_item(event) {
    var clicked_index = parseInt(event.target.id.substring(4));
    // console.log(clicked_index);
    var answer = window.confirm("Would you like to remove this item from the cart?");
    if (answer) {
        document.getElementById(`table-row-${clicked_index}`).remove();
    }
    else {
        console.log("cancel");
    }
    //update the price
    sumup();
}

//calculate the total price and remove if quantity change to 0
function sumup() {
    var rows = document.querySelectorAll("tr");
    var total = 0;
    //calculate total price
    for (var j = 1; j < rows.length - 1; j++) {
        var current_price = parseFloat(rows[j].querySelector(".price").innerHTML);
        var current_qty = rows[j].querySelector(".quantity").value;
        total += current_price * current_qty;
    }
    //if quantity change to 0, remove the item
    if (event.target.value == 0) {
        var clicked_index = parseInt(event.target.id.substring(4));
        var answer = window.confirm("Would you like to remove this item from the cart?");
        if (answer) {
            document.getElementById(`table-row-${clicked_index}`).remove();
        }
        else {
            console.log("cancel");
        }
    }
    // assign the total price value
    document.getElementById("total-price").value = "Total Price: " + total;
}


//function to update stock in phonelisting database
function updateStock() {
    var num = document.querySelectorAll('tr').length - 1; //deduct thead
    //loop to search the DOM table element
    for(var i=0; i < num; i++) { // 
        //loop to find corresponding stock by title
        var table_title = document.getElementById(`table-row-${i}`).getElementsByTagName('td')[0].innerHTML;
        
        for(var j=0; j < cartList.length; j++) {
            //compare table element title and title in cartlist
            var cartlist_title = cartList[j].title;
            var result = table_title.localeCompare(cartlist_title);
            var count = 0;
            if(result == 0){ // if title match 
                console.log(++count)
                var old_stock = cartList[j].stock;
                var order_qty = document.querySelectorAll("tr")[i+1].querySelector(".quantity").value;
                var new_stock = old_stock - order_qty;
                console.log(new_stock)
                let data = 
                    'title='+table_title+
                    '&new_stock='+new_stock;
                    axios.post('http://localhost:3000/entry/checkoutPage/update', data)
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    }
    //redirect to home page 
    window.location.href='/';
}
