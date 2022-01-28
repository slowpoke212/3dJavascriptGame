var res = 500
var fov = 60
var mapadd = 500
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var rays = []
var walls = []

var pi = Math.pi
repeater = null
function degtorad(degrees){
	return degrees * (3.14/180)
}
function isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}
function drawLine(ctx, begin, end, stroke = 'black', width = 1) {
    if (stroke) {
        ctx.strokeStyle = stroke;
    }

    if (width) {
        ctx.lineWidth = width;
    }

    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x,end.y);
    ctx.stroke();
}
const player = {
	x : 250,
	y : 20,
	xmove : 0,
	ymove : 0,
	width: 20,
	height: 20,
	direction: 2,
	raddirection : degtorad(this.direction),
	spinleft : false
}

function ray (x,y,dir){//ray constructor
	
	this.x = x,
	this.y = y,
	this.width = 0.000001,
	this.height = 0.00001,
	this.deltaX = Math.sin(degtorad(dir))*10,//takes sin of players direction to find the delta
	this.deltaY = Math.cos(degtorad(dir))*10//takes cosin of players direction to find the delta
}
function wall (x,y,w,h,color){//wall constructor
	this.x = x,
	this.y = y,
	this.width = w,
	this.height = h,
	this.color = color
}
walls.push(new wall(400,30,50,100, 'green'))
walls.push(new wall(100, 400, 50, 100, 'blue'))

walls.push(new wall(250, 50, 250, 40, 'green'))
walls.push(new wall(100, 400, 50, 100, 'blue'))
window.addEventListener('keydown', function (e) {//keydown
  key = e.key//this is the key

	//player movement down input 
	if (key == "d"){
	player.spinleft = true
	}
	if (key == "a"){
	player.spinright = true
	}


	if (key == "w"){
		player.xmove = Math.sin(degtorad(player.direction)) * 5
		player.ymove = Math.cos(degtorad(player.direction)) * 5
	}
	if (key == "s") {
		player.xmove = Math.sin(degtorad(player.direction)) * -5
		player.ymove = Math.cos(degtorad(player.direction)) * -5
	}

}, false);



//key stuff
window.addEventListener('keyup', function (e) {
	keyup = e.key
	//player movement up input
	if (keyup == "w" || keyup == "s"){
	player.ymove = 0
	player.xmove = 0
	}
	if (key == "s") {
		player.xmove = 0
		player.ymove = 0
	}
	if (keyup == "d"){
	player.spinleft = false
	}
	if (keyup == "a"){
	player.spinright = false
	}
}, false);






//tick function
function tick(){
	
	repeater1 = setTimeout(tick, 15);
	
	
	player.x += player.xmove
	player.y += player.ymove
	for (i = 0; i < walls.length; i++) {//loops through all walls
		while (isCollide(player, walls[i])) {
			player.x -= player.xmove/4
			player.y -= player.ymove /4
		}
	}
		

	if (player.spinleft == true){
	player.direction+=4
	
	}
	if (player.spinright == true){
	player.direction-=4
	
	}
	
	
	
	


}
//draw function
function draw(){
	repeater = setTimeout(draw, 10);//makes it go forever
	rays = []
	for (i = 0; i < res; i++){//creating correct the amount of rays
	rays[i] = new ray(player.x,player.y, player.direction + i*(fov/res) - fov/2)//renders the rays with a spread
	}
	for (i = 0; i < rays.length; i++){
		while (rays[i].done != true) {
		rays[i].x += rays[i].deltaX
		rays[i].y += rays[i].deltaY
		if (rays[i].x > c.width + mapadd || rays[i].x < -mapadd) {
			
			rays[i].done = true
			rays[i].missed = true
		}
		if (rays[i].y > c.height +mapadd || rays[i].y < -mapadd) {
			rays[i].done = true
			rays[i].missed = true
		}
		for (a = 0; a < walls.length; a++){
			if (isCollide(walls[a], rays[i])) {
				while (isCollide(walls[a], rays[i])) {
					rays[i].x -= rays[i].deltaX/10
					rays[i].y -= rays[i].deltaY/10

				}
				rays[i].done = true
			}

		}

		
	}
	rays[i].len = Math.sqrt((player.x-rays[i].x)**2+(player.y-rays[i].y)**2)
	}

	//-----------------------------------------------



	ctx.clearRect(0, 0, c.width, c.height)//clears canvas
	ctx.fillStyle = 'grey'
	ctx.fillRect(0,c.height/2+10,c.width, c.height/2)
	ctx.fillStyle = 'blue'//makes player blue
	/*
	ctx.fillRect(player.x-player.width/2,player.y-player.height/2,player.width,player.height)//renders player
	for (i = 0; i < rays.length; i++){//loops through all rays
		drawLine(ctx, player, rays[i])
	}


	for (i = 0; i < walls.length; i++){//loops through all walls
		ctx.fillStyle = walls[i].color//sets the walls to whatever color they are
		ctx.fillRect(walls[i].x, walls[i].y, walls[i].width,walls[i].height)//renders walls
	}
	*/
	drawingX = 0;
	for(i = 0;i<res;i++){
		LineHeight = 20000/rays[i].len;
		if (rays[i].missed != true) {
			rcolor = 255-rays[i].len
			ctx.fillStyle = 'rgb(' + rcolor + ',' + 0 + ',' + 0 + ')';
			ctx.fillRect(drawingX, c.height / 2 - LineHeight / 2, c.width / res, LineHeight)
			ctx.font = '48px serif';
			
		}
		

		drawingX += c.width / res;
	}
	


}



draw();
tick();
