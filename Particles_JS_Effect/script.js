// FIRST  - collision detection with a circle around the mouse
// SECOND - every particles needs to be aware of every other particles current location to decide if they are close enough to be connected with a line ( For this one we will need to use "nested loops")
// THIRD  - if you notice the line connecting the dots is not the same all the time. It animates from being invisible to being fully visible the closer the particles are together  

const canvas 	= document.getElementById("canvas1")
//console.log(canvas)
const ctx 		= canvas.getContext("2d")
canvas.width 	= window.innerWidth
canvas.height 	= window.innerHeight
//console.log(canvas.width)
//console.log(canvas.height)

let particleArray


// mouse radius area scale depends on canvas size 
let mouse = {
	x:null,
	y:null,
	radius:(canvas.height/80) * (canvas.width/80)
}
// To get the current mouse position we will create an event listener for "mousemove"
// this will fire evry time user moves the mouse.
// This listener has access to the event object, which we will need
window.addEventListener("mousemove", function(event){
	mouse.x = event.x 
	mouse.y = event.y
})



// We create a class for particle, we will use it to create a randomized particle
// DirectionX and DirectionY will hold the value for number of pixels our particle animate each step along the x and y axis
function Particle(x, y, directionX, directionY, size, color){
	this.x 			= x
	this.y 			= y
	this.directionX = directionX
	this.directionY = directionY
	this.size 		= size
	this.color 		= color
}	
// add draw() prototype
// method to draw individual particle
Particle.prototype.draw = function(){
	ctx.beginPath()
	ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
	ctx.fillStyle = this.color
	ctx.fill()
}
// check particle position, check mouse position, move the particle, draw the particles
Particle.prototype.update = function(){
	// check if particle is still within canvas
	if(this.x > canvas.width || this.x < 0){
		this.directionX = -this.directionX
	}
	if(this.y > canvas.height  || this.y < 0){
		this.directionY = -this.directionY
	}
	
	// check collision detection - mouse detection / particle position
	// Now we need to check if the current mouse position overlaps with the current particle position
	/* collision detection is between two circles. This algorithm works by taking the centre points of the 
	two circles and ensuring the distance between the centre points are less than the two radii added together. */
	let dx = mouse.x - this.x
	let dy = mouse.y - this.y
	let distance = Math.sqrt(dx*dx + dy*dy)
	if(distance < mouse.radius + this.size){
		// we have a collision
		
		// additional checks to see which side the particle is coming from so we can 
		// decide which direction we want to push it 
		if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
			this.x +=10
		}
		if(mouse.x > this.x && this.x > this.size * 10){
			this.x -=10 
		}
		if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
			this.y +=10
		}
		if(mouse.y > this.y && this.y > this.size * 10){
			this.y -=10 
		}
	}
	
	// After we have checked all of this we will move the other particles that are
	// that are currently not colliding with the mouse along their x and y axis by adding their directionX and directionY value to x and y
	this.x += this.directionX
	this.y += this.directionY
	
	// draw particle 
	this.draw()
}

// create particle array / initializing
function init(){
	particleArray = []
	
	// calculating number of particles from the current canvas dimension 
	let numberOfParticles = (canvas.width * canvas.height)/9000
	
	for(let i = 0; i < numberOfParticles*3 ; i++){
		let size 		= (Math.random() * 5) + 1
		let x 			= (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2)
		let y 			= (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2)
		let directionX 	= (Math.random() * 5) - 2.5
		let directionY 	= (Math.random() * 5) - 2.5
		let color 		= 'white'
		
		particleArray.push(new Particle(x, y, directionX, directionY, size, color))
	} 
}


// animate
function animate(){
	requestAnimationFrame(animate)
	ctx.clearRect(0, 0, innerWidth, innerHeight)
	for(let i = 0; i < particleArray.length; i++){
		particleArray[i].update()
	}
	connect()
}

// check if particles are close enough to draw line between
function connect(){
	let opacityValue = 1;
	// we will nested loops for this
	// First we will cycle through variable "a" and inside we will cycle through variable "b"
	// variable "a" represent each individual paricle in our array and a variable "b" will represent all the consecutive particles in the same array.
	for(let a = 0; a < particleArray.length; a++){
		for(let b = a; b < particleArray.length; b++){
			let distance = ((particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x)) + ((particleArray[a].y - particleArray[b].y)*(particleArray[a].y - particleArray[b].y)) 
			if(distance < (canvas.width/7) * (canvas.height/7)){
				opacityValue = 1 - (distance/20000)
				ctx.strokeStyle = 'rgba(140,85,31,'+ opacityValue + ')'
				ctx.lineWidth = 1
				ctx.beginPath()
				ctx.moveTo(particleArray[a].x, particleArray[a].y)
				ctx.lineTo(particleArray[b].x, particleArray[b].y)
				ctx.stroke()
			}
		} 
	}
}

// resize event
window.addEventListener("resize", function(event){
	canvas.width  = innerWidth
	canvas.height = innerHeight
	mouse.radius  = ((canvas.height/80)*(canvas.height/80));
	init();
})

// mouse out event
window.addEventListener("mouseout", function(){
	mouse.x = undefined
	mouse.x = undefined
})

init()
animate()
