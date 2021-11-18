window.onload = initialize;

    var initialInfo=[];
    var relatedPhongListings=[];
    var userId="";

    function initialize(){
        axios.get('http://localhost:3000/entry/userPage/getUserId')
        .then(function (response) {
            userId=response.data;
            console.log("user id↓");
            console.log(userId);
            loadUserPage();
        }).catch(function (error) {
            console.log(error);
        });
    }


function loadUserPage(){
    var tabs = document.getElementsByClassName("tab")
    var contents = document.getElementsByClassName("content")
    for(var i=0;i<tabs.length;i++){
        tabs[i].index = i;
        tabs[i].onclick = function(){
            for(var j=0;j<tabs.length;j++){
                tabs[j].className = tabs[j].className.replace(' selected', '').trim();
                contents[j].className = contents[j].className.replace(' show-contents', '').trim();
            }
            this.className = this.className + ' selected';
            contents[this.index].className = contents[this.index].className + ' show-contents';
        };
    }

    let reqUrlone='http://localhost:3000/entry/userPage/getUserInfo/'+userId;
    getRequest(reqUrlone,    //get basic user info
        function(data) {
            initialInfo = data;
            console.log("got initial data↓")
            console.log(initialInfo);
            fillInfo();
        },
        function(xhr) { console.error(xhr); });

    getRequest('http://localhost:3000/entry/userPage/changeImageRoutes/hellochangeimage',    //change db image routes
    function(data) {
        console.log("change image routes↓")
        console.log(data);
    },
    function(xhr) { console.error(xhr); });

    let reqUrltwo='http://localhost:3000/entry/userPage/phoneListings/'+userId;    //get related phone listings
    axios.get(reqUrltwo) 
    .then(function (response) {
        relatedPhongListings=response.data;
        console.log("related phone listings from server side↓");
        console.log(relatedPhongListings);
        fillPhoneListings();
    })
    .catch(function (error) {
        console.log(error);
    });
}


function getRequest(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
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


function fillInfo(){
    document.getElementById("firstName").value=initialInfo[0].firstname;
    document.getElementById("lastName").value=initialInfo[0].lastname;
    document.getElementById("email").value=initialInfo[0].email;
}


function fillPhoneListings(){
    var tbody_tag=document.querySelector("tbody");
    tbody_tag.innerHTML="";
    for(let i=0; i<relatedPhongListings.length; i++){
        let create_phoneinfo_row=document.createElement("tr");
        create_phoneinfo_row.setAttribute("id","phone"+i);
        create_phoneinfo_row.innerHTML= 
            '<td class="phone-title">'+relatedPhongListings[i].title+'</td>'+
            '<td>'+relatedPhongListings[i].brand+'</td>'+
            '<td><image class="related-phone-image" src="'+relatedPhongListings[i].image+'"/></td>'+
            '<td>'+relatedPhongListings[i].stock+'</td>'+
            '<td>'+relatedPhongListings[i].price+'</td>'+
            '<td><input type="checkbox" name="disableCBName" id="disableCheckbox'+i+'"/></td>'+
            '<td><input type="checkbox" name="deleteCBName" id="deleteCheckbox'+i+'"/></td>'
        tbody_tag.appendChild(create_phoneinfo_row)

        if(relatedPhongListings[i].disabled!=undefined){
            let disCheckboxId="disableCheckbox"+i;
            let disCheckboxEle=document.getElementById(disCheckboxId);
            disCheckboxEle.checked=true;
        }
    }
}


function updateProfile(){
    let firstName=document.getElementById("firstName").value;
    let lastName=document.getElementById("lastName").value;
    let email=document.getElementById("email").value;
    let data = 'firstname='+firstName+'&lastname='+lastName+'&email='+email+'&id='+userId;
    console.log("will send to server: "+data);
    var initialPwd=prompt("please input the your password: ")
    // console.log(121212121212,pwd);
    if(initialPwd==null){
        console.log("cancel to input current password!")
    }else{
        let pwd2=md5(initialPwd);
        let pwd={userPwd:pwd2};
        axios.post('http://localhost:3000/entry/userPage/checkPwd', pwd)
                .then(function (response) {
                    console.log("pppppppppppwwwwwwwwwwwwwwwddddddddddd",response)
                    if(response.data=='correctpwd'){
                       axios.post('http://localhost:3000/entry/userPage/updateUserInfo', data)
                                .then(function (response) {
                                    console.log("after click update profile bt - response↓");
                                    console.log(response);
                                    if(response.data=='successProfile'){
                                        alert("Updated!");
                                        loadUserPage();
                                    }
                                 })
                                .catch(function (error) {
                                    console.log(error);
                                });
                    }else{
                        alert("Incorrect password!");
                        loadUserPage();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
    }  
}


function changePassword(){
    let curPasswordInitial=document.getElementById("cur-pwd").value;
    let newPassword=document.getElementById("new-pwd").value;
    // console.log(66666666666,curPasswordInitial)
    if(curPasswordInitial==""){
        alert("please input your current password!");
    }else{
        let curPassword2=md5(curPasswordInitial);
        let curPassword={userPwd:curPassword2};
        axios.post('http://localhost:3000/entry/userPage/checkPwd', curPassword)
        .then(function (response) {
            console.log(response,77777777777777777)
            if(response.data=='correctpwd'){
                let newPassword2=md5(newPassword);
                let data = 'password='+newPassword2+'&id='+userId;
                axios.post('http://localhost:3000/entry/userPage/userInfo/pwd', data)
                        .then(function (response) {
                            console.log(response);
                            if(response.data=='successPwd'){
                                alert("Password changed successfully!");
                                loadUserPage();
                                document.getElementById("cur-pwd").value="";
                                document.getElementById("new-pwd").value="";
                            }else{
                                alert(response)
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
            }else{
                alert("Current password is incorrect!")
                loadUserPage();
                document.getElementById("cur-pwd").value="";
                document.getElementById("new-pwd").value="";
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    }
}


function addNewListing(){
    let newBrand=document.getElementById("create-brand").value;
    let newTitle=document.getElementById("create-title").value;
    let newStock=document.getElementById("create-stock").value;
    let newPrice=document.getElementById("create-price").value;

    if(!isNumber(newStock) || !isNumber(newPrice)){
        alert("The stock and price must be a number!");
        document.getElementById("create-stock").value="";
        document.getElementById("create-price").value="";
    }else if(newBrand!="pendingBrand"&&newTitle!=""&&newStock!=""&&newPrice!=""){
        let data = 
            'title='+newTitle+
            '&brand='+newBrand+
            '&stock='+newStock+
            '&price='+newPrice+
            '&id='+userId;
        axios.post('http://localhost:3000/entry/userPage/userInfo/newlisting', data)
            .then(function (response) {
                console.log(response);
                if(response.data=='successAddListing'){
                    alert("Add new listing successfully!");
                    loadUserPage();
                    fillPhoneListings();
                    document.getElementById("create-brand").value="pendingBrand";
                    document.getElementById("create-title").value="";
                    document.getElementById("create-stock").value="";
                    document.getElementById("create-price").value="";
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }else{
        alert("You have to input all the information above")
    }
}


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

function saveChanges(){
    var disableInfo=[];
    var notDis=[];
    var deleteInfo=[];
    var disableCB_tags=document.getElementsByName("disableCBName");
    var deleteCB_tags=document.getElementsByName("deleteCBName");

    for(let i=0;i<relatedPhongListings.length;i++){
        if(disableCB_tags[i].checked==true){
            disableInfo.push(relatedPhongListings[i]._id);
        }else{
            notDis.push(relatedPhongListings[i]._id);
        }
        if(deleteCB_tags[i].checked==true){
            deleteInfo.push(relatedPhongListings[i]._id);
        }
    }

    function postDisableReq(){
        return axios.post('http://localhost:3000/entry/userPage/disablePhoneListings', disableInfo);
    }
    function postNotDisableReq(){
        return axios.post('http://localhost:3000/entry/userPage/notDisablePhoneListings', notDis);
    }

    function postDeleteReq(){
        return axios.post('http://localhost:3000/entry/userPage/deletePhoneListings', deleteInfo);
    }

    axios.all([postDisableReq(),postNotDisableReq(),postDeleteReq()]).then(axios.spread(function(disable,notDisable,deletePhong){
                // debugger
                console.log("disable: ",disable);
                console.log("notDisable: ",notDisable);
                console.log("deletePhong: ",deletePhong);
            })).then(()=>{
                alert("Changes Saved!")
            }).catch(function (error) {
                    console.log(error);
                });
    loadUserPage();
}


function signOut(){
    axios.get('http://localhost:3000/users/logout')
    .then(function (response) {
        window.location.href="http://localhost:3000/";

        history.pushState(null, null, "http://localhost:3000/");
        window.addEventListener('popstate', function () {
            history.pushState(null, null, "http://localhost:3000/");
        });
    })
    .catch(function (error) {
        console.log(error);
    });
}

function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/;
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}












