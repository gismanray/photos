var photos = {};
var num = 0;
var index = 0;
var tick = 0;
var timerID = 0;
var stops = 5;
var speed = 2;
var picw = 700;
var pic = null

$(document).ready(function(){
	var mobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
	if (mobile) {	// for mobile device
		showarrows(true);
		showsetting(true);
		$("#pic").on("swipeleft", function() { next(); })
				 .on("swiperight", function() { prev();	})
				 .on("tap", function() { doplay(); });
		$("#prev").on("tap", function() { prev(); });
		$("#next").on("tap", function() { next(); });
	} else {	// for computer
		$("#pic").on("click", function() { doplay(); })
				 .on("mouseover", function() { $("#pause").css("visibility", "visible"); })
				 .on("mouseout", function() { $("#pause").css("visibility", "hidden"); });
		$("#prev").on("click", function() { prev(); })
				  .on("mouseover", function() { showarrows(true) })
				  .on("mouseout", function() { showarrows(false) });
		$("#next").on("click", function() { next(); })
				  .on("mouseover", function() { showarrows(true) })
				  .on("mouseout", function() { showarrows(false) });
		$("#arrl").on("mouseover", function() { showarrows(true); });
		$("#arrr").on("mouseover", function() { showarrows(true); });
		$("#pause").on("mouseover", function() { $(this).css("visibility", "visible"); })
				   .on("click", function() { doplay(); });
		$("#sett").on("mouseover", function() { showsetting(true); })
				  .on("mouseout", function() { showsetting(false); });
	}
		
	$("#conf").on("click", function() { showpanel(); });
	$("#slow").on("click", function() { doslow(); });
	$("#fast").on("click", function() { dofast(); });
	$("#bar").on("mousedown", function(e) { clickbar($(this), e); });
	$("#conf").on("mouseover", function() { $(this).attr('src', 'images/gears_red.png'); })
			  .on("mouseout", function() { $(this).attr('src', 'images/gears.png'); });
	$("#resize").on("click", function() { resize($(this)); });
	
	$("#alb").on("mouseover", function(e) {
		$(this).attr("src", "images/album64b.png");
	}).on("mouseout", function(e) {
		$(this).attr("src", "images/album64a.png");
	}).on("click", function() {
		$("#pnl").css("display", "block");
	});
	$("#shw").on("mouseover", function(e) {
		$(this).attr("src", "images/frame64b.png");
	}).on("mouseout", function(e) {
		$(this).attr("src", "images/frame64a.png");
	}).on("click", function() {
		window.location = "gallery.html";
	});

	$("#info").on("mouseover", function() {
		$(this).attr("src", "images/infob.png");
	}).on("mouseout", function() {
		$(this).attr("src", "images/infoa.png");
	}).on("click", function() {
		$("#msg").css("display", "block");
	});

	$("#xmsg").on("mouseover", function() {
		$(this).css("color", "#ff0000");
	}).on("mouseout", function() {
		$(this).css("color", "#000000");
	}).on("click", function() {
		$("#msg").css("display", "none");
	});

	$("#msg").on("mouseleave", function() {
		$(this).css("display", "none");
	});
	
	$("#pnl").on("mouseover", function() {
		$(this).css("display", "block");
	}).on("mouseout", function() {
		$(this).css("display", "none");
	});
	
	// get the javascript native img element (pic)
	pic = document.getElementById("pic");
	// add the "load" event listener
	pic.addEventListener("load", resizePicture); 
	
	album = getCookie("album");
	if (album == "") album = "home";    // default album
	
	createMenu();
	openAlbum(album, reload=true);
});

// Photo class
class Photo {
	constructor() {
		this.src = '';
		this.caption = '';
		//this.width = 0;	// slides2.3.js does not need picture dimensions in xml
		//this.height = 0;
	}
}

function showarrows(yes) {
	if (yes) {
		$("#arrl").css("visibility", "visible");
		$("#arrr").css("visibility", "visible");
	} else {
		$("#arrl").css("visibility", "hidden");
		$("#arrr").css("visibility", "hidden");
	}
}

function showsetting(yes) {
	if (yes) {
		$("#conf").css("visibility", "visible");
	} else {
		$("#conf").css("visibility", "hidden");
	}
} 

function startSlides() {
	if (tick > stops) {
		index++;
		if (index == num) index = 0;
		setCookie("index", index, 5);
		changePicture();
		//tick = 0;
		for (var i=1; i<=5; i++) {
			$("#cir"+i).css("visibility", 'hidden');
		}
	} else {
		if (tick > 0)
			$("#cir"+tick).css("visibility", 'visible');
		tick++;
	}
	timerID = setTimeout("startSlides()", 500+(4-speed)*250);
}

function stopSlides() {
    if (timerID) {
        clearTimeout(timerID);
        timerID = 0;
    }
}

function prev() {
	index--;
	if (index<0) index=num-1;
	setCookie("index", index, 5);

	changePicture();
}

function next() {
	index++;
	if (index==num) index=0;
	setCookie("index", index, 5);
	
	changePicture();
}

function doplay() {
	if (timerID) {
		stopSlides();
	} else {
		startSlides();
	}
}

function openAlbum(album, reload=false) {
	setCookie("album", album, 120);
	jsonfile = "json/" + album + ".json";
	readTextFile(jsonfile, function(text) {
		const json = JSON.parse(text);
		var title = json.title;
		if (title == null) title = "My Photo Gallery";
		$("#title").html(title);
		
		var path = json.path;
		if (path.slice(-1) != "/") path += "/";
		
		const pictures = json.photos;
		num = pictures.length;

		for (var i=0; i<num; i++) {
			var photo = new Photo();
			photo.src = path + pictures[i].file;
			photo.caption = pictures[i].cap;
			
			var image = new Image(); // preload image
			image.src = photo.src;
			
			photos[i.toString()] = photo;
		}
		
		if (reload) {
			index = getCookie("index");
			if (index == "") {
				index = 0;
			} else {
				index = parseInt(index);
			}
		} else {
			index = 0;
		}
		changePicture();
		startSlides();
	});
}

function createMenu() {
	readTextFile("json/menu.json", function(text) {
		const menu = JSON.parse(text);
		var strlinks = "";
		for (i=0; i<menu.length; i++) {
			strlinks += "<p class='lnk alb' onclick=openAlbum('" + menu[i].json + "')>" + menu[i].item + "</p>";
		}
		$("#pnl").html(strlinks);
	});
}

function readTextFile(file, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.overrideMimeType("application/json");
    xhttp.open("GET", file, true);
    xhttp.onload = function() {
		callback(xhttp.responseText);
	}
	xhttp.send(null); 
}

function getParameter(name) {
	var url = window.location.href;
	var p1 = url.indexOf(name+"=", 0);
	if (p1<0) return null;
	p1 = p1+name.length+1;
	var p2 = url.indexOf("&", p1+1);
	if (p2 == -1)
		p2 = url.length;
	
	var val = url.substring(p1, p2);
	val = val.replace(/%20/gi, " ");
		
	return val; 
}

function resizePicture() {
	// this function is trigged by the "load" event of the pic element
	var width = pic.naturalWidth;
	var height = pic.naturalHeight;
	var rhw = height / width;
	if (rhw < 1) {
		width = picw;
		height = picw * rhw;
	} else {
		if (picw == 700) {
			height = 500;
		} else {	// picw = 960
			height = 700;
		}
		width = height / rhw;
	}
	$("#pic").css("width", width+"px");
	$("#pic").css("height", height+"px");
	$("#cap").css("top", (height+48)+"px");
	$("#cap").html(photos[index.toString()].caption+"  ");
	
}

function changePicture() { 
	var width = photos[index].width;
	var height = photos[index].height;
	
	$("#pic").attr({"src": photos[index.toString()].src})
	.animate({"opacity": 0.0})
	.animate({"opacity": 1.0}, 250);
	//$("#pic").animate({"opacity": 0.1}, 250);
		
	$("#idx").html((index+1)+"/"+num);
	tick = 0;
	for (var i=1; i<=5; i++) {
		$("#cir"+i).css("visibility", "hidden");
	}
}

function showpanel() {
	var pnl = $("#panl");
	if (pnl.css("visibility") == "hidden") {
		pnl.css("visibility", "visible");
	} else {
		pnl.css("visibility", "hidden");
	}
}

function doslow() {
	if (speed > 0) {
		speed--;
	} else {
		return;
	}
	var x = 25 + speed * 22;
	$("#dot").css("left", x+"px");
}

function dofast() {
	if (speed < 4) {
		speed++;
	} else {
		return;
	}
	var x = 25 + speed * 22;
	$("#dot").css("left", x+"px");
}

function clickbar(element, e) {
	var offset = element.offset();
	var x = e.pageX - offset.left;
	speed = Math.floor(x / 25 + 0.5);
	var x = 25 + speed * 22;
	$("#dot").css("left", x+"px");	
}

function resize(icon) {
	if (icon.attr("src") == "images/enlarge.png") {
		icon.attr({"src": "images/shrink.png", "title": "shrink"});
		doresize("large");
	} else {
		icon.attr({"src": "images/enlarge.png", "title": "enlarge"});
		doresize("small");
	}
}

function doresize(size) {
	if (size == 'small') {
		$("#frame").css({"width":"800px", "height":"640px", "border-radius":"15px"});
		$("#box").css({"top":"20px", "left":"50px", "width":"700px", "height":"575px"});
		$("#title").css("width", "700px");
		$("#cap").css("width", "700px");
		$("#prev").css({"width":"50px;", "height":"500px"});
		$("#next").css({"left":"750px", "width":"50px;", "height":"500px"});
		$("#arrl").css("top", "210px");
		$("#arrr").css("top", "210px");
		$("#pause").css({"top":"240px", "left":"320px"});
		picw = 700;
		changePicture();
	} else {
		$("#frame").css({"width": "1080px", "height": "864px", "border-radius":"20px"});
		$("#box").css({"top":"30px", "left":"60px", "width":"960px", "height":"760px"});
		$("#title").css("width", "960px");
		$("#cap").css("width", "960px");
		$("#prev").css({"width":"60px", "height":"680px"});
		$("#next").css({"left":"1020px", "width":"60px", "height":"680px"});
		$("#arrl").css("top", "300px");
		$("#arrr").css("top", "300px");
		$("#pause").css({"top":"310px", "left":"450px"});
		picw = 960;
		changePicture();
	}
}


function setCookie(cname, cvalue, minutes) {
    var d = new Date();
     d.setTime(d.getTime() + (minutes*60*1000));
    var expires = "expires="+d.toUTCString();
     document.cookie = cname + "=" + cvalue + "; " + expires;
 }

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
     return "";
}
