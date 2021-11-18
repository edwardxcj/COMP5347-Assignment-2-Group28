window.onload=initialMainPage; //first get the users status(for showing different contents) and then run the loadMainPage()

var soldOutSoonData=[];
var bestSellersData=[];
var loged=false;

function initialMainPage(){
    axios.get('http://localhost:3000/entry/userPage/getUserStatus')
        .then(function (response) {
            //console.log(response,233333333);
            if(response.data=="loged"){
                loged=true;
                loadMainPage();
            }else{
                loged=false;
                loadMainPage();
            }
        }).catch(function (error) {
            console.log(error);
        });
    //hide the search state when initiate
    document.getElementById("phone-table").style.visibility = "hidden";
}


function loadMainPage(){
   
    var userProfileBtn_tags=document.getElementById("user-profile-btn");
    var logOutBtn_tags=document.getElementById("log-out-btn");
    var logInBtn_tags=document.getElementById("log-in-btn");
    if(!loged){
        userProfileBtn_tags.style.visibility="hidden";
        logOutBtn_tags.style.display="none";
    } else{
        logInBtn_tags.style.display="none";
    }
    //main page -- sold out soon
    axios.get('http://localhost:3000/entry/mainPage/soldOutSoon/hellosoldoutsoon')
    .then(function (response) {
        soldOutSoonData=response.data;
        console.log("sold out data↓");
        console.log(soldOutSoonData);
        fillSoldOut();
    })
    .catch(function (error) {
        console.log(error);
    });

    //main page -- best sellers
    axios.get('http://localhost:3000/entry/mainPage/bestSellers/hellobestsellers')
    .then(function (response) {
        bestSellersData=response.data;
        console.log("best sellers data↓");
        console.log(bestSellersData);
        fillBestSellers();
    })
    .catch(function (error) {
        console.log(error);
    });

}

// fill the sold out data to html
function fillSoldOut(){
    var soldout_tag=document.getElementById("sold-out-phonelist");
    soldout_tag.innerHTML="";
    for(let i=0; i<soldOutSoonData.length; i++){
        let create_soldout_row=document.createElement("tr");
        create_soldout_row.innerHTML= 
            '<td class="title-size">'+soldOutSoonData[i].title+'</td>'+
            '<td><image class="sold-out-image" src="'+soldOutSoonData[i].image+'"/></td>'+
            '<td>'+soldOutSoonData[i].price+'</td>'
        soldout_tag.appendChild(create_soldout_row)
    }
}

// fill the best sellers data to html
function fillBestSellers(){
    var bestsellers_tag=document.getElementById("best-sellers-phonelist");
    bestsellers_tag.innerHTML="";
    for(let i=0; i<bestSellersData.length; i++){
        let create_bestsellers_row=document.createElement("tr");
        create_bestsellers_row.innerHTML= 
            '<td class="title-size">'+bestSellersData[i].title+'</td>'+
            '<td><image class="best-seller-image" src="'+bestSellersData[i].image+'"/></td>'+
            '<td>'+bestSellersData[i].avgRating.toFixed(2)+'</td>'
        bestsellers_tag.appendChild(create_bestsellers_row)
    }
}


function goHomePage(){
    window.location.href="http://localhost:3000/";
}

function goCheckout(){
    if(loged){
    window.location.href='/checkoutPage';
    }else{
    window.location.href='/login';
    // http://localhost:3000/login
    }
}

function goLogout(){

    window.location.href='/login'
}

function goLogout(){
    axios.get('http://localhost:3000/users/logout')
    .then(function (response) {
        window.location.href="http://localhost:3000/";
    })
    .catch(function (error) {
        console.log(error);
    });
}

var searchResult;
//function to search according to user input
function SearchByTitle() {
    // get content
    var searchBox_text = document.getElementById("search-value").value.toLowerCase();
    var data = "title=" + searchBox_text;
    

    axios.post("/searchbytitle", data).then(res=>{
        searchResult = res  
        showResultOnPage(searchResult.data)
    })
}


function showResultOnPage(phoneList) {
    //show the search state
    document.getElementById("phone-table").style.visibility = "visible";

    //set a table to show list
    var table_body = document.getElementById("phone-table").getElementsByTagName('tbody')[0];
    // delete pre-showed list
    tr_elements = document.getElementById("phone-table").querySelectorAll('tr')
    console.log("tr_elements: "+tr_elements);
    for(let i=0;i<tr_elements.length-1;i++){
        tr_elements[i].remove()
    }

    //console.log(phoneList)
    for(var i=0; i < phoneList.length; i++) {
        var current_row = table_body.insertRow(i); 
        var title_cell = current_row.insertCell(0);
        var brand_cell = current_row.insertCell(1);
        var price_cell = current_row.insertCell(2);

        //insert title,brand and price
        title_cell.innerHTML = phoneList[i].title;
        brand_cell.innerHTML = phoneList[i].brand
        price_cell.innerHTML = phoneList[i].price;
    }
}

function FilterByBrand() {

    var brand_list = document.getElementById("brand_list")

    var selected = brand_list.options[brand_list.selectedIndex].value;
    

    var length = searchResult.data.length;
    var filterResult = []

    for(let i=0; i<length;i++){
        if(selected === searchResult.data[i].brand){
            filterResult.push(searchResult.data[i]);
        }

    }
    showResultOnPage(filterResult)
}

function FilterByPrice() {
    var brand_list = document.getElementById("price_range_list")
    var selected = brand_list.options[brand_list.selectedIndex].value;
    var begin = selected.substring(0,3)
    var end = selected.substring(4,7)
    
    var length = searchResult.data.length;
    var filterResult = []

    for(let i=0; i<length;i++){
        if(begin < searchResult.data[i].price && searchResult.data[i].price < end){
            filterResult.push(searchResult.data[i]);
        }
    }
    showResultOnPage(filterResult)
}
