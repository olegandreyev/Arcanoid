
var cavas = document.getElementById('canvas');


function Brick(x,y,radius,color){
	Ball.call(this,x,y,radius,'blue')
}
Brick.prototype = Object.create(Ball.prototype);
Brick.prototype.constructor = 'Brick'
Brick.prototype.isIntersec = function(obj){
	var dx = this.x - obj.x;
	var dy = this.y - obj.y;
	var dest1 = Math.sqrt(dx*dx + dy*dy);
	var dest2 = Math.max(this.radius, obj.radius)
	return dest1 <= dest2;
}


function Bar(x,y,length,color){
	this.x = x;
	this.y = y;
	this.length = length;
	this.color = color || 'grey'
}
Bar.prototype.left = function(){
	if(this.x > 0){
		this.x-=20;
	}
}
Bar.prototype.right = function(){
	if(this.x < canvas.width - (20*this.length)){
		this.x+=20;
	}
}
Bar.prototype.render = function(ctx){
	for(var i = 0; i < this.length; i++){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x+(i*20),this.y,20,20);
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x+5+(i*20),this.y+5,10,10);
	}
}

function Ball(x,y,radius,color){
	this.x = x;
	this.y = y;
	this.radius = radius || 10;
	this.dx = 0;
	this.dy = 0;
	this.isFrozen = true;
	this.color = color ||'red';
}

Ball.prototype.setColor = function(color){
	this.color = color;
}
Ball.prototype.render = function(ctx){
	ctx.fillStyle  =this.color;
	ctx.beginPath();
	ctx.arc(this.x, this.y,this.radius,2*Math.PI,false)
	ctx.fill();
}
Ball.prototype.move = function(){
	if(!this.isFrozen){
		this.x+=this.dx;
		this.y+=this.dy;
	}
}
Ball.prototype.checkBounds = function(minX,maxX,minY,maxY){
	if(this.x < minX){
		this.x = minX;
		this.dx = - this.dx;
	}
	if(this.x > maxX){
		this.x = maxX
		this.dx = - this.dx;
	}
	if(this.y < minY){
		this.y = minY;
		this.dy = - this.dy;
	}
	if(this.y > maxY){
		this.y = maxY
		this.dy = - this.dy;
	}
}
Ball.prototype.setDirection = function(angle){
	this.dx = Math.cos(angle) * 10
	this.dy = Math.sin(angle) * 10
}

Ball.prototype.start = function(){
	this.isFrozen = false;
}
Ball.prototype.isIntersecOfBar = function(obj){
	if(this.x >= obj.x){
		if(this.x <= obj.x+20*obj.length){
			if(this.y >= obj.y - 10){
				this.y = obj.y - 15;
				return true;
			}
		}
	}
	return false;
}

var ctx = canvas.getContext('2d');
window.addEventListener('keydown',function(e){
	switch(e.keyCode){
		case 37 : player1.left();
		break;
		case 39 : player1.right();
		break;
		case 32 : ball.start();
		break;

	}
})



var player1 = new Bar(canvas.width /2, canvas.height-40, 4)
var ball = new Ball(player1.x+40, player1.y-10,10)
ball.setDirection(180)
var bricks = []
for(var i =20;i<cavas.width;i+=40){
	for(var j =20;j<cavas.height/4;j+=40){
		var brick = new Brick(i,j);
		brick.setColor('blue')
		bricks.push(new Brick(i,j))
	}
}

function run(){
	ball.checkBounds(10,canvas.width - 10, 10, canvas.height-10)
	if(!ball.isFrozen && ball.isIntersecOfBar(player1)){
		ball.setDirection(80+Math.random()*10)
	}
    bricks = bricks.filter(function(brick){
		if(brick.isIntersec(ball)){
			ball.setDirection(Math.random()*360)
			return false;
		}
		return true;
	})
	ball.move();
	update();

	if(bricks.length === 0){
		alert('YOU WIN')
		return;
	}
	if(ball.y >= cavas.height - 10){
		alert("YOU FAIL");
		return;
	}
	setTimeout(run,30)
}

function update(){
	ctx.fillStyle='black'
	ctx.fillRect(0,0,800,600)
	player1.render(ctx);
	ball.render(ctx);
	bricks.forEach(function(br){
		br.render(ctx);
	})
}
run();