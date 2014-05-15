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

function updateCities (country, async) {
    async = typeof async !== 'undefined' ? async : true;
    var city_obj = document.getElementById('city');
    var url = "/shows/" + country + "/listCities/";
    var http_request = getHttpObject();
    http_request.onreadystatechange=function () {
        var response = getResponse(http_request);
        removeAllOptions(city_obj)
        for (var key in response['cities']) {
            var option = document.createElement("option");
            option.text = response['cities'][key];
            option.value = key;
            city_obj.add(option);
        }
        city_obj.disabled = false;
    }
    http_request.open("GET", url, async);
    http_request.send(null);
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
    return -1;
}

function executeOnLoad() {
    var msg = document.getElementById('Msg');
    var country_obj = document.getElementById('country');
    var city_obj = document.getElementById('city');
    var theatre_obj = document.getElementById('theatre');
    var movie_obj = document.getElementById('movie');
    city_obj.disabled = true;
    theatre_obj.disabled = true;
    movie_obj.disabled = true;

    var cookie = getCookie("country");
    if (cookie !== "") {
        var c = cookie.split("%");
        var index = getOptionIndex(country_obj, c[0], c[1]);
        if (index !== -1) {
            country_obj.selectedIndex = index;
            updateCities(c[0], false);
            cookie = getCookie("city");
            if (cookie !== "") {
                c = cookie.split("%");
                index = getOptionIndex(city_obj, c[0], c[1]);
                if (index !== -1) {
                    city_obj.selectedIndex = index;
                }
            }
        }
    }

    country_obj.onchange = function () {
        var selected = getSelectedOption(country_obj);
        setCookie("country", selected[0] + "%" + selected[1], 5);
        updateCities(selected[0]);
    }

    city_obj.onchange = function () {
        var selected = getSelectedOption(city_obj);
        setCookie("city", selected[0] + "%" + selected[1], 5);
    }
}