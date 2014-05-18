function setCookie(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}

function getHttpObject() {
   var http_request = new XMLHttpRequest();
   try{
      // Opera 8.0+, Firefox, Chrome, Safari
      http_request = new XMLHttpRequest();
   }catch (e){
      // Internet Explorer Browsers
      try{
         http_request = new ActiveXObject("Msxml2.XMLHTTP");
      }catch (e) {
         try{
            http_request = new ActiveXObject("Microsoft.XMLHTTP");
         }catch (e){
            // Something went wrong
            alert("Your browser broke!");
            return false;
         }
      }
   }
   return http_request
}

function getResponse (http_request) {
    var response = "{}";
    if (http_request.readyState === 4 && http_request.status === 200) {
        response = http_request.responseText;
    }
    return JSON.parse(response);
}

function removeAllOptions (obj) {
    for(i=obj.length-1; i>0; i--) {
        obj.remove(i);
    }
}

function getSelectedOption (obj) {
    var sindex = obj.options[obj.selectedIndex]
    return [sindex.value, sindex.text];
}

function getOptionIndex (obj, value, text) {
    for (var i = obj.options.length - 1; i >= 0; i--) {
        if (obj.options[i].value == value && obj.options[i].text == text) {
            return i;
        }
    }
    return 0;
}

function executeOnLoad() {
    var msg = document.getElementById('Msg');
    var country_obj = document.getElementById('country');
    var city_obj = document.getElementById('city');
    var cinema_obj = document.getElementById('cinema')

    disableall(true);

    city_obj.onchange = function () {
        var selected = getSelectedOption(city_obj);
        setCookie("city", selected[0] + "%" + selected[1], 5);
        updateCinemas(selected[0], false);
    }

    country_obj.onchange = function () {
        var selected = getSelectedOption(country_obj);
        setCookie("country", selected[0] + "%" + selected[1], 5);
        updateCities(selected[0]);
    }

    cinema_obj.onchange = function () {
        var label = document.getElementById("cinema-label").innerHTML.toLowerCase()
        var selected = getSelectedOption(cinema_obj)
        if (label.match("cinema")) {
            updateDates(selected[0], undefined)
        } else {
            updateDates(undefined, selected[0])
        }
    }

    processCookie();
}

function processCookie () {
    var country_obj = document.getElementById('country');
    var city_obj = document.getElementById('city');    
    var cookie = getCookie("country");
    if (cookie !== "") {
        var c = cookie.split("%");
        var index = getOptionIndex(country_obj, c[0], c[1]);
        if (index > 0) {
            country_obj.selectedIndex = index;
            index = 0;
            updateCities(c[0], false);
            cookie = getCookie("city");
            if (cookie !== "") {
                c = cookie.split("%");
                index = getOptionIndex(city_obj, c[0], c[1]);
                city_obj.selectedIndex = index;                
            }
            city_obj.onchange();
        }
    }
}


function handleRadio (type) {
    var city_obj = document.getElementById("city")
    var selected = getSelectedOption(city_obj)
    switch(type) {
        case 'cinema':  updateCinemas(selected[0]);
                        break;
        case 'movie':   updateMovies(selected[0]);
                        break;
        default: alert("its default"); break;
    }
}

function disableall (disable) {
    var city_obj = document.getElementById('city');
    var cinema_obj = document.getElementById('cinema');
    var date = document.getElementById('date');
    var cinema_radio = document.getElementById("rcinema");
    var movie_radio = document.getElementById("rmovie");
    city_obj.disabled = disable;
    cinema_obj.disabled = disable;
    date.disabled = disable;
    cinema_radio.disabled = disable;
    movie_radio.disabled = disable;

    if (disable == false) {
        cinema_radio.checked = true;
    }
}

function updateCities (country, async) {
    async = typeof async !== 'undefined' ? async : true;
    var city_obj = document.getElementById('city');
    var url = "/shows/" + country + "/listCities/";
    var http_request = getHttpObject();
    http_request.onreadystatechange=function () {
        var response = getResponse(http_request);
        removeAllOptions(city_obj);
        for (var key in response['cities']) {
            var option = document.createElement("option");
            option.text = response['cities'][key];
            option.value = key;
            city_obj.add(option);
        }
        city_obj.selectedIndex = 0;
    }
    http_request.open("GET", url, async);
    http_request.send(null);
    disableall(false);
}

function updateCinemas(city, async) {
    async = typeof async !== 'undefined' ? async : true;
    var cinema_obj = document.getElementById("cinema");
    var date_obj = document.getElementById("date");
    
    removeAllOptions(cinema_obj);
    removeAllOptions(date_obj)

    document.getElementById("cinema-label").innerHTML = "Select Cinema";
    cinema_obj.options[0].value = 0;
    cinema_obj.options[0].text = "Choose Cinema...";

    var url = "/shows/" + city + "/listCinemas/";
    var http_request = getHttpObject();
    http_request.onreadystatechange =  function () {
        var response = getResponse(http_request);
        for (var key in response['cinemas']) {
            var option = document.createElement("option");
            option.text = response['cinemas'][key];
            option.value = key;
            cinema_obj.add(option);
        }
        cinema_obj.selectedIndex = 0;
    }
    http_request.open("GET", url, async);
    http_request.send(null);
}

function updateMovies(city, async) {
    async = typeof async !== 'undefined' ? async : true;
    var cinema_obj = document.getElementById("cinema");
    var date_obj = document.getElementById("date");

    removeAllOptions(cinema_obj);
    removeAllOptions(date_obj);

    document.getElementById("cinema-label").innerHTML = "Select Movie";
    cinema_obj.options[0].value = 0;
    cinema_obj.options[0].text = "Choose Moive...";

    var url = "/shows/" + city + "/listMovies/";
    var http_request = getHttpObject();
    http_request.onreadystatechange =  function () {
        var response = getResponse(http_request);
        for (var key in response['movies']) {
            var option = document.createElement("option");
            option.text = response['movies'][key];
            option.value = key;
            cinema_obj.add(option);
        }
        cinema_obj.selectedIndex = 0;
    }
    http_request.open("GET", url, async);
    http_request.send(null);
}


function updateDates(cinema, movie, async) {
    async = typeof async !== 'undefined' ? async : true;
    var date_obj = document.getElementById("date");
    var msg = document.getElementById('Msg');    
    removeAllOptions(date_obj);

    var url = "/shows/"
    if (cinema) {
        url += cinema + "/listDatesByCinema/";
    } else {
        url += movie + "/listDatesByMovie/";
    }

    var http_request = getHttpObject();
    http_request.onreadystatechange =  function () {
        var response = getResponse(http_request);
        var dates = response['dates'];
        for (var d=0; d < dates.length; d++) {
            var option = document.createElement("option");
            option.text = dates[d];
            option.value = dates[d];
            date_obj.add(option);
        }
        date_obj.selectedIndex = 0;
    }
    http_request.open("GET", url, async);
    http_request.send(null);
}