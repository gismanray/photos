const data = [
{coords: [738, 1403], name: "王建清"},
{coords: [934, 1366], name: "彭保发"},
{coords: [1110, 1391], name: "谭德和"},
{coords: [1277, 1370], name: "李大仁"},
{coords: [1477, 1382], name: "周一兵"},
{coords: [1665, 1358], name: "谭建平"},
{coords: [1878, 1333], name: "张远明"},
{coords: [2045, 1329], name: "刘北洲"},
{coords: [2217, 1342], name: "彭伟"},
{coords: [2397, 1354], name: "宋忆怀"},
{coords: [2572, 1337], name: "陈志"},
{coords: [2711, 1358], name: "彭正乔"},
{coords: [2866, 1350], name: "胡国华"},
{coords: [3050, 1342], name: "吴存鑫"},
{coords: [3246, 1346], name: "曹才力"},
{coords: [3451, 1354], name: "陈学江"},
{coords: [3675, 1346], name: "郑云有"},
{coords: [616, 1623], name: "刘健喜"},
{coords: [828, 1619], name: "周海鱼"},
{coords: [1032, 1636], name: "李仁贵"},
{coords: [1232, 1619], name: "黄湘平"},
{coords: [1502, 1619], name: "张伟然"},
{coords: [1657, 1607], name: "贺跃明"},
{coords: [1878, 1636], name: "唐忠旺"},
{coords: [2094, 1628], name: "谢慧杰"},
{coords: [2303, 1623], name: "刘筱清"},
{coords: [2507, 1611], name: "王青云"},
{coords: [2703, 1623], name: "庄大春"},
{coords: [2928, 1644], name: "刘小金"},
{coords: [3140, 1656], name: "朱芳国"},
{coords: [3303, 1644], name: "周德芳"},
{coords: [3451, 1623], name: "张海龙"},
{coords: [3655, 1579], name: "赵华雄"},
{coords: [3884, 1562], name: "吴三成"},
{coords: [4116, 1542], name: "袁正武"},
{coords: [767, 1930], name: "陈小月"},
{coords: [971, 1905], name: "王慧志"},
{coords: [1179, 1901], name: "刘鸣鸣"},
{coords: [1388, 1885], name: "刘萍"},
{coords: [1616, 1844], name: "毛德华"},
{coords: [1808, 1885], name: "蒋子凡"},
{coords: [2025, 1873], name: "周平德"},
{coords: [2241, 1873], name: "石忆邵"},
{coords: [2495, 1864], name: "刘新平"},
{coords: [2723, 1856], name: "刘永明"},
{coords: [2952, 1856], name: "黄瑞红"},
{coords: [3169, 1848], name: "梁晓云"},
{coords: [3418, 1840], name: "曾定植"},
{coords: [3634, 1840], name: "吴君维"},
{coords: [3912, 1856], name: "左恒治"},
{coords: [4133, 1807], name: "曹一民"},
{coords: [550, 2167], name: "周剑倩"},
{coords: [726, 2191], name: "何丽平"},
{coords: [942, 2191], name: "孙云仙老师"},
{coords: [1204, 2159], name: "吴辅成老师"},
{coords: [1486, 2163], name: "邓美成老师"},
{coords: [1732, 2180], name: "周庆发老师"},
{coords: [2000, 2126], name: "？？？"},
{coords: [2290, 2118], name: "何业衡老师"},
{coords: [2576, 2150], name: "程伟民老师"},
{coords: [2875, 2165], name: "丁书记"},
{coords: [3099, 2138], name: "？？？"},
{coords: [3365, 2163], name: "潘小其"},
{coords: [3647, 2150], name: "欧阳安交"},
{coords: [3908, 2126], name: "贺明岳"},
{coords: [4186, 2110], name: "李万斌"},
];

const frmw = 930;
const frmh = 626;
const imgw = 4650;
const imgh = 3130;

var frmlef = 0;
var frmtop = 0;
var imglef = 0;
var imgtop = 0;
var scale = 0.2;
var x0 = 0, y0 = 0;

window.onload = main;
function main() {
	const frame = document.getElementById('frame');
	const photo = document.getElementById('photo');
	const tag1 = document.getElementById('tag1');
	const tag2 = document.getElementById('tag2');
	const icon = document.getElementById('icon');
	const zmb = document.getElementById('zmb');
	
	frmlef = frame.offsetLeft;
	frmtop = frame.offsetTop;
	
	photo.onwheel = zoom;	
	photo.ondragstart = function(event) { 
		x0 = event.clientX;
		y0 = event.clientY;
	}
	photo.ondragend = function() { 
		imglef = -this.offsetLeft;
		imgtop = -this.offsetTop;
		//console.log("imglef=" + imglef + ", imgtop=" + imgtop);
	}
	photo.ondrag = pan;
	photo.onmousemove = identify;
	
	icon.onmouseover = function() {
		document.getElementById('note').style.visibility = "visible";
	}
	icon.onmouseout = function() {
		document.getElementById('note').style.visibility = "hidden";
	}
	
	// boxfaces();	// do not delete this line
}

window.onresize = resize;
function resize() {
	frmlef = frame.offsetLeft;
	frmtop = frame.offsetTop;
}

function zoom(event) {
	event.preventDefault();
	const s0 = scale		// preserve previous scale
	const mx = event.clientX - frmlef;	// mouse x
	const my = event.clientY - frmtop;	// mouse y
	//console.log("(mx, my) = (" + mx + ", " + my + ")");
	
	// calculate new scale
	scale = Math.min(Math.max(scale - event.deltaY / 2000, 0.2), 1.25); //.toFixed(4);
	//console.log("scale = " + scale);
	
	this.style.width = imgw * scale; + "px";	// scale the image
	
	// calculate new position of the image
	imglef = (imglef + mx) * scale / s0 - mx;
	imgtop = (imgtop + my) * scale / s0 - my;

	if (imglef < 0) imglef = 0;		// avoid left blank
	if (imgtop < 0) imgtop = 0;		// avoid top blank
	if (imgw * scale - imglef < frmw) imglef = imgw * scale - frmw;	// avoid right blank
	if (imgh * scale - imgtop < frmh) imgtop = imgh * scale - frmh;	// avoid bottom blank
	//console.log("imglef: " + imglef + ", imgtop: " + imgtop);
	
	this.style.left = (-imglef) + "px";
	this.style.top = (-imgtop) + "px";
	tag1.innerText = "";
}

function pan(event) {
	event.preventDefault();
	
	let ex = event.clientX;
	let ey = event.clientY;
	if (ex == 0 && ey == 0) return;	// when mouse up, ex and ey are 0s

	let dx = event.clientX - x0;
	let dy = event.clientY - y0;
	//console.log("dx = " + dx + ", dy = " + dy);
	
	let lef = dx - imglef;
	let top = dy - imgtop;
	if (lef > 0) lef = 0;	// avoid left blank
	if (top > 0) top = 0;	// avoid top blank
	if (imgw * scale + lef < frmw) lef = frmw - imgw * scale;	// avoid right blank
	if (imgh * scale + top < frmh) top = frmh - imgh * scale;	// avoid bottom blank
	
	this.style.left = lef + "px";
	this.style.top = top + "px";
	tag1.innerText = "";
}

function identify(event) {
	let imgx = (event.clientX - frmlef + imglef) / scale;
	let imgy = (event.clientY - frmtop + imgtop) / scale;
	//console.log("x = " + imgx.toFixed(0) + ", y = " + imgy.toFixed(0));
		
	var found = false;
	for (var i=0; i<data.length; i++) {
		if (Math.abs(imgx - data[i].coords[0]) > 62) continue;
		if (Math.abs(imgy - data[i].coords[1]) > 62) continue;
		
		if (scale > 0.25) {
			tag1.innerText = data[i].name;
			tag1.style.left = (event.clientX - frmlef - data[i].name.length * 10) + "px";
			tag1.style.top = (event.clientY - frmtop + 25) + "px";
		} else {
			inset.style.display = "block";
			tag2.innerText = data[i].name;
			mugs.style.left = (115 - data[i].coords[0]) + "px";
			mugs.style.top = (115 - data[i].coords[1]) + "px";
		}
		
		found = true;		
		break;
	} 
	if (!found) {
		tag1.innerText = "";
		inset.style.display = "none";
	}
	
}

function boxfaces() {
	for (var i=0; i<data.length; i++) {
		var div = document.createElement('div');
		div.setAttribute("class", "face");
		div.style.left = (data[i].coords[0] * scale - imglef - 12) + "px";
		div.style.top = (data[i].coords[1] * scale - imgtop - 12) + "px";
		frame.append(div);
	}
}
