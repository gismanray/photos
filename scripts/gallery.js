var frmbrdr = 60;			// frame border width
var white = 60;				// white space
var matt = 4;				// mat thickness
var large = false;			// large frame size
var path = "";				// photo path
var photos = null;			// photo collection
var reviews = null;			// photo reviews
var frmtlc, frmtrc, frmllc, frmlrc, frmtop, frmbot, frmlef, frmrig;
var box, mat, pic, cap, ctl, alb, shw, pnl, info, msg, xmsg;
var win = null, cmt = null;	// comment window, comment icon
var olink = null;
var cmtid = null;			// photo comment id

window.onload = main;
function main() {
	links = document.getElementById('links');
	box = document.getElementById('box');
	mat = document.getElementById('mat');
	pic = document.getElementById('pic');
	cap = document.getElementById('cap');
	cmt = document.getElementById('cmt');
	ctl = document.getElementById('ctl');
	alb = document.getElementById('alb');
	pnl = document.getElementById('pnl');
	shw = document.getElementById('shw');
  	win = document.getElementById('win');
	msg = document.getElementById('msg');
	xmsg = document.getElementById('xmsg');
	info = document.getElementById('info');
	win.style.left = ((window.innerWidth - 600) / 2) + "px";
	
	pic.addEventListener("load", resize);
	ctl.addEventListener("click", changeSize);
	ctl.addEventListener("mouseout", function() { this.style.display='none' });
	cmt.addEventListener("click", showReview);
	
	info.addEventListener("click", () => {
		msg.style.display = "block";
	});

	xmsg.addEventListener("click", () => {
		msg.style.display = "none";
	});
	xmsg.addEventListener("mouseover", (event) => {
		event.currentTarget.style.color = "#ff0000";
	});
	xmsg.addEventListener("mouseout", (event) => {
		event.currentTarget.style.color = "#808080";
	});
	msg.addEventListener("mouseout", (event) => {
		event.currentTarget.style.display = "none";
	});
	
	var album = getParameter("album");
	if (album == null) {
		album = getCookie("album");
		if (album == "") album = "home";    // default album
	} else {
		alb.style.display = "none";
		shw.style.display = "none";
	}
	
	createMenu();
	createFrame();	// create picture frame
	openAlbum(album, reload=true);
	
	alb.addEventListener("click", function(e) {
		if (pnl.style.display != "block") {
			pnl.style.display = "block";
		} else {
			pnl.style.display = "none";
		}
	});
	alb.addEventListener("mouseover", function(e) {
		this.src = "images/album64b.png";
	});
	alb.addEventListener("mouseout", function(e) {
		this.src = "images/album64a.png";
	});

	shw.addEventListener("click", function() {
		window.location = "slides.html";
	});
	shw.addEventListener("mouseover", function(e) {
		this.src = "images/slides64b.png";
	});
	shw.addEventListener("mouseout", function(e) {
		this.src = "images/slides64a.png";
	});
	

	pnl.addEventListener("mouseout", function(e) {
		this.style.display = "none";
		e.stopPropagation();
	});
	pnl.addEventListener("mouseover", function(e) {
		this.style.display = "block";
		e.stopPropagation();
	});
	var albums = document.getElementsByClassName('alb'); 
	for (i=0; i<albums.length; i++) {
		albums[i].addEventListener("mouseover", function(event) {
			pnl.style.display = "block";
		});
	}

    let isDragging = false;
    let offsetX, offsetY;
    win.addEventListener('mousedown', (e) => {
        isDragging = true;
        // Calculate the offset from the mouse position to the div's top-left corner
        offsetX = e.clientX - win.offsetLeft; 
        offsetY = e.clientY - win.offsetTop;
        //console.log("ox="+offsetX+"; oy="+offsetY);
        win.style.cursor = 'grabbing'; // Change cursor while dragging
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // Calculate new position based on mouse position and initial offset
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        // Update the div's position
        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        win.style.cursor = 'grab'; // Reset cursor
    });

    let xbtn = document.getElementById('xbtn');
    xbtn.addEventListener('mouseover', (e) => {
        xbtn.style.backgroundImage = "radial-gradient(at 40% 40%, #ffcccc 1%, pink 15%, red 70%)";
    });
    xbtn.addEventListener('mouseout', (e) => {
        xbtn.style.backgroundImage = "radial-gradient(at 40% 40%, #ccffcc 1%, #88ff88 15%, green 70%)";
    });
  
    xbtn.addEventListener('click', () => {
        win.style.display = "none";
    });
}

function createMenu() {
	readTextFile("json/menu.json", function(text) {
		const menu = JSON.parse(text);
		var strlinks = "";
		for (i=0; i<menu.length; i++) {
			strlinks += "<p class='lnk alb' onclick=openAlbum('" + menu[i].json + "')>" + menu[i].item + "</p>";
		}
		pnl.innerHTML = strlinks;
	});
}

function openAlbum(jsonfile, reload=false) {
	setCookie("album", jsonfile, 120);
	jsonfile = "json/" + jsonfile + ".json";
	readTextFile(jsonfile, function(text) {
		var json = JSON.parse(text);
		photos = json.photos;
		reviews = json.reviews;
		path = json.path; 
		if (path.slice(-1) != "/") path += "/";
		
		var strlinks = "Photos ";
		for (i=0; i<photos.length; i++) {
			//console.log(photos[i].url);
			strlinks += '&nbsp;<span id="link' + i + '" class="lnk" onclick="showPhoto(this, ' +
						(i) + ')">' + ('0'+(i+1)).slice(-2) + '</span> |';
		}
		links.innerHTML = strlinks;
		//olink = null;
		
		if (reload) {
			var index = getCookie("index");
			if (index == "") index = 0;
		} else {
			var index = 0;
		}
		olink = document.getElementById('link'+index);
		
		showPhoto(olink, index);  // display the first picture
	});
}


function createFrame() {
	frmtlc = document.createElement('img');
	frmtlc.setAttribute("id", "frm_tlc")
	frmtlc.setAttribute("src", "images/frm_tlc.jpg");
	frmtlc.classList.add("frm");
	box.appendChild(frmtlc);
	
	frmtrc = document.createElement('img');
	frmtrc.setAttribute("id", "frm_trc")
	frmtrc.setAttribute("src", "images/frm_trc.jpg");
	frmtrc.classList.add("frm");
	box.appendChild(frmtrc);

	frmllc = document.createElement('img');
	frmllc.setAttribute("id", "frm_llc")
	frmllc.setAttribute("src", "images/frm_llc.jpg");
	frmllc.classList.add("frm");
	box.appendChild(frmllc);

	frmlrc = document.createElement('img');
	frmlrc.setAttribute("id", "frm_lrc")
	frmlrc.setAttribute("src", "images/frm_lrc.jpg");
	frmlrc.classList.add("frm");
	box.appendChild(frmlrc);
	frmlrc.addEventListener("mouseover", function() { ctl.style.display='block' });

	frmtop = document.createElement('img');
	frmtop.setAttribute("id", "frm_top")
	frmtop.setAttribute("src", "images/frm_top.jpg");
	frmtop.classList.add("frm");
	box.appendChild(frmtop);

	frmbot = document.createElement('img');
	frmbot.setAttribute("id", "frm_bot")
	frmbot.setAttribute("src", "images/frm_bot.jpg");
	frmbot.classList.add("frm");
	box.appendChild(frmbot);

	frmlef = document.createElement('img');
	frmlef.setAttribute("id", "frm_lef")
	frmlef.setAttribute("src", "images/frm_lef.jpg");
	frmlef.classList.add("frm");
	box.appendChild(frmlef);

	frmrig = document.createElement('img');
	frmrig.setAttribute("id", "frm_rig")
	frmrig.setAttribute("src", "images/frm_rig.jpg");
	frmrig.classList.add("frm");
	box.appendChild(frmrig);
}

function showPhoto(me, index) {
	win.style.display = "none";		// hide comment window
	pic.src = path + photos[index].file;
	cap.innerHTML = photos[index].cap;

	olink.classList.add("lnk");
	olink.style.color = "";
	me.classList.remove("lnk");
	me.style.color = "#f00";
	olink = me;
	setCookie("index", index, 5);

	if (photos[index].cmt == undefined) {
		cmt.style.display = "none";
		cmtid = null;
	} else {
		cmt.style.display = "block";
		cmtid = photos[index].cmt;
	}
}

function resize() {
	var frmwidth = 0;
	var imgw = pic.naturalWidth;
	var imgh = pic.naturalHeight;
	if (imgw > imgh) {
		if (large) {
			frmwidth = 1024;
		} else {
			frmwidth = 800;
		}
	} else {
		if (large) {
			frmwidth = 720;
		} else {
			frmwidth = 600;
		}
	}
	
	var picw = frmwidth - (frmbrdr + white + matt) * 2;
	var pich = picw * imgh / imgw;
	var frmheight = pich + (frmbrdr + white + matt) * 2;	

	box.style.height = frmheight + "px";
	box.style.width = frmwidth + "px";
	pic.style.width = picw + "px";
		
	// position the frame borders
	frmtlc.style = "top:0px; left:0px; width:" + frmbrdr + "px";
	frmtrc.style = "top:0px; left:" + (frmwidth - frmbrdr) + "px; width:" + frmbrdr + "px";
	frmllc.style = "top:" + (frmheight - frmbrdr) + "px; left:0px; width:" + frmbrdr + "px";
	frmlrc.style = "top:" + (frmheight - frmbrdr) + "px; left:" + (frmwidth - frmbrdr) + "px; width:" + frmbrdr + "px";
	frmtop.style = "top:0px; left:" + frmbrdr + "px; width:" + (frmwidth-frmbrdr*2) + "px; height:" + frmbrdr + "px";
	frmbot.style = "top:" + (frmheight - frmbrdr) + "px; left:" + frmbrdr + "px; width:" + (frmwidth - frmbrdr*2) + "px; height:" + frmbrdr + "px";
	frmlef.style = "top:" + frmbrdr + "px; left:0px; width:" + frmbrdr + "px; height:" + (frmheight - frmbrdr*2) + "px";
	frmrig.style = "top:" + frmbrdr + "px; left:" + (frmwidth - frmbrdr) + "px; width:" + frmbrdr + "px; height:" + (frmheight-frmbrdr*2) + "px";

	mat.style = "position:absolute; top:" + (frmbrdr+white) + "px; left:" + (frmbrdr+white) + "px; width:" + picw + "px; height:" + pich + "px; border-width:" + matt + "px";	
	pic.style = "position:absolute; top:0px; left:0px; width:" + picw + "px";
	cap.style = "position:absolute; left:" + (frmbrdr+white+5) + "px; bottom:" + (frmbrdr+white-22) + "px; font-family:arial; font-size:10pt; color:#888;";
	//cmt.style = "position:absolute; left:" + (box.offsetLeft + frmwidth - 24) + "px; top:" + (box.offsetTop + frmheight+10) + "px; display:" + cmt.style.display;	// this overrides all the style settings
	cmt.style.left = (box.offsetLeft + frmwidth - 24) + "px";
	cmt.style.top = (box.offsetTop + frmheight + 10) + "px";
}

function changeSize() {
	large = !large;
	if (large) {
		frmbrdr = 75;
		white = 75;
		ctl.src = "images/shrink.png";
		ctl.style.right = "80px";
		ctl.style.bottom = "80px";
	}else {
		frmbrdr = 60;
		white = 60;
		ctl.src = "images/enlarge.png";
		ctl.style.right = "65px";
		ctl.style.bottom = "65px";
	}
	resize();
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

function readTextFile(file, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.overrideMimeType("application/json");
    xhttp.open("GET", file, true);
    xhttp.onload = function() {
		callback(xhttp.responseText);
	}
	xhttp.send(null); 
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

function showReview() {
	if (cmtid == null) return;
    win.style.display = "block"; 
    document.getElementById('page').innerHTML = reviews[cmtid].join("");
}
