//function that checks if localstorage is empty or not
//if localstorage is empty it redirects user to index.html
//if not date is beign loaded
document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
    	if(!localStorage.getItem('result')){
    		window.location = 'index.html';
    		return;
    	}
        loadData();
    }
}
//function for load data
function loadData(){
	var i=1;
	var resultBar = document.getElementById("result-bar");
	var data = JSON.parse(localStorage.getItem('result'));
	var timer = setInterval(function(){
		if(i<data.percent){
			i++;
			resultBar.style.width = i + '%';
			document.getElementById("results-percentage").innerText = i + "%";
			colorBar(resultBar, i);
		} else {
			clearInterval(timer);
		}
	},50);
	if(data.percent == 0){
		document.getElementById("results-percentage").innerText =  "0%";
		colorBar(resultBar, 0);
	}
	document.getElementById("results").innerText = data.percent + "%";
	localStorage.removeItem('result');

}
//function for changing bar colors
function colorBar(resultBar, value){
	clearClass(resultBar);
	if(value <= 25){
		resultBar.className += " progress-bar-danger";
	} else if (value <= 50){
		resultBar.className += " progress-bar-warning";
	} else if (value <= 75){
		resultBar.className += " progress-bar-info";
	} else {
		resultBar.className += " progress-bar-success";
	}
}
//function that clears bar colors
function clearClass(resultBar){
	resultBar.classList.remove('progress-bar-danger');
	resultBar.classList.remove('progress-bar-warning');
	resultBar.classList.remove('progress-bar-info');
	resultBar.classList.remove('progress-bar-success');
}
//function that redirects user to play again
function playAgain(){
	window.location = 'index.html';
}