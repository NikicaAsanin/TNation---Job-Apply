var dataObj;
var cities = [];
var doneTypingInterval = 500;
var typingTimer;
//function that is loading data on document ready for interaction
document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        loadData();
    }
}
//load json file
function loadData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        dataObj = JSON.parse(this.responseText);
    }
  };
  xhttp.open("GET", "podaci.json", true);
  xhttp.send();
}

// Panel for game start 
function startGame(){
     document.getElementById('overlay-screen').style.display = 'none';
     initGameData();
}

//Define game ends and compare resaults with json file podaci.json(tacno)
function endGame(){
    var correct = dataObj.tacno.length;
    var correctUser = 0;
    for(var j=0;j<cities.length;j++){
        for(var i=0;i<dataObj.tacno.length; i++){
            if(cities[j] == dataObj.tacno[i]){
                correctUser++;
                break;  
            }
        }
    }
    //inser in local storage
    var percent = 100 * correctUser/correct;
    var result = { 'corrent' : correctUser, 'percent' :  percent};
    localStorage.setItem("result", JSON.stringify(result));
    window.location = 'results.html';
}
//main game initialisation function
function initGameData(){
    localStorage.removeItem('result');
    var timeLeft = dataObj.vreme;
    var check = document.getElementById('gameTime');
    var gameTime = setInterval(countDown, 1000);
    document.getElementById("span-area").innerHTML = dataObj.oblast;
    displayTime(timeLeft);
    enableButtons();
    initListeners();
    function countDown(){
        if(timeLeft == 0){
            clearTimeout(gameTime);
            endGame();
        }else{
            timeLeft--;
            displayTime(timeLeft);
        }
    }
}
// Function for time changing color if its lower than 10
function displayTime(timeLeft){
    var gameTime = document.getElementById('gameTime');
    var coloIcon = document.getElementById('icon-time-color');
     gameTime.innerHTML = getMinutesAndSecondsFromSeconds(timeLeft);
     if(timeLeft <= 10){
        coloIcon.style.color = 'red';
        gameTime.style.color = 'red';
     }
}
//Function for changing time 100seconds to 1minut and 40seconds
function getMinutesAndSecondsFromSeconds(time){
    var mins = ~~(time / 60);
    var secs = time % 60;
    secs = (secs < 10) ? "0"+secs : secs;
    mins = (mins < 10) ? "0" + mins : mins; 
    return mins+":"+secs;
}

//Query selector can be used but IE below 11 will not work
function enableButtons(){
    var enableButtons = document.getElementsByTagName("button");
    for(var i = 0; i < enableButtons.length; i++) {
        enableButtons[i].disabled = false;
    }
    document.getElementById("city").disabled = false;
}

//function that add input items to the list
//function adds item even if input text is not same case as countries defined in JSON
function addToList(){
    var inputField = document.getElementById("city");
    var textValue = inputField.value;
    var indexOfSearch = dataObj.ponudjene.findIndex(item => textValue.toLowerCase() === item.toLowerCase());
    var indexOfData = (cities.length > 0) ? cities.findIndex(item => textValue.toLowerCase() === item.toLowerCase()) : -1;
    if(indexOfData === -1 && indexOfSearch !== -1){
        textValue = dataObj.ponudjene[indexOfSearch];
        createDomForCity(textValue);
        cities.push(textValue);
        inputField.value = '';
    }
}
//Function that add cities Dom to the list
function createDomForCity(textValue){
    var citiesList = document.getElementById("cities_list");
    var el =  document.createElement("li");
    el.innerHTML = textValue + '<span title="Remove added city" onclick="removeFromList(this)" class="icon-cities glyphicon glyphicon-remove"></span>';
    citiesList.append(el);
}

//function that remove city from the list
function removeFromList(city){
    var li = city.parentElement;
    var index = cities.indexOf(li.innerText);
     cities.splice(index,1);
    var parentOfLi = li.parentElement;
    parentOfLi.removeChild(li);
}
//function that is preparing and adding dom elements for auto complete
function showAutoComplete(results){
    var autocomplete = document.getElementById("autocomplete-div");
    autocomplete.innerHTML = '';
    for(var i = 0; i < results.length; i++){
        var element = document.createElement("li");
        element.setAttribute('onclick','addCityToInput(this);');
        element.innerText = results[i];
        autocomplete.append(element);
    }
    autocomplete.style.display = 'block';
    autocomplete.scrollTop = 0;
}
//function that hides auto complete div
function hideAutoComplete(){
    document.getElementById("autocomplete-div").style.display = 'none';
}
//function that takes value from clicked <li> to input and hides auto complete
function addCityToInput(city){
    var textValue = city.innerText;
    document.getElementById("city").value = textValue;
    hideAutoComplete();
}

//function that checks if user is done with typing 
function initListeners(){
    var cityInput = document.getElementById("city");
    cityInput.onkeydown = function(evt) {
        clearTimeout(typingTimer);
    };

    cityInput.onkeyup = function() {
        hideAutoComplete();
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    };
}
//function that is filtering cities list based on user input and prepares 
//auto complete results when user is done with typing
function doneTyping(){
    var cityInput = document.getElementById("city");
    var results = [];
    for(var i = 0; i < dataObj.ponudjene.length; i++)
    {
        if(dataObj.ponudjene[i].toLowerCase().indexOf(cityInput.value.toLowerCase()) !== -1){
            results.push(dataObj.ponudjene[i]);
        }
    }
    showAutoComplete(results);
}

