// Learning outcomes
// First  -  How to draw different shapes other than circles or rectangles on canvas 
// Second -  How to make particles spin around in circles
// Third  -  How to create particle trails
/* To draw the stars we uae function that is reusable and can generate stars with any number of spikes and slso generate shapes like hexagons */

const canvas  	= document.getElementById("canvas1")
const ctx		= canvas.getContext("2d")
canvas.width	= window.innerWidth
canvas.height 	= window.innerHeight

let particlesArray

class Particle {
	// Every class needs a constructor, which is a special method for creating and initializing an Object created with class 
	constructor(moveRadius, step, position, size){
		this.moveRadius = moveRadius
		this.step 		= step
		this.position 	= position
		this.size 		= size
	}
	
	draw(){
		ctx.beginPath()
		// This method take atleast five arguments and it will draw a simple circle on canvas
		// Main arguments for us are the first two. These stand for the position on the x and y axis. This is a big part of our circular motion animation
		// we will use basic trigonometry. For x-position we call Math.cos() method, this method by default rotates Infinitely back and forth b/w -1 and +1
		// cos(0)==1 and cos(180)==-1
		// we will pass it this.position  attribute which we will later set as a random number along a circle 
		/* we multiply it by this.moveRadius which will increase the rotation of cosine (which is by default minus one to plus one), it will increase that 
		that roation to minus moveRadius to plus moveRadius. Then we add canvas width divided by 2 this will set the center of our circle in the middle 
		of the canvas. So now we have our particles rotating left to right between two positions defined by its moveRadius value. Second argument for the 
		Y position we will use Math.sine(0 function and do the same thing but for the canvas height*/
		// Math.PI*2 == 360deg
		// Now we have these two methods pulling on our particles in a way that will result in a circle motion if we increase this.position property
		ctx.arc(Math.cos(this.position)*this.moveRadius + canvas.width/2, Math.sin(this.position)*this.moveRadius + canvas.height/2, this.size, 0, Math.PI*2)
		/* context.arc(x,y,r,sAngle,eAngle,counterclockwise);
		Parameter Values
		Parameter			Description	
		x					The x-coordinate of the center of the circle	
		y					The y-coordinate of the center of the circle	
		r					The radius of the circle	
		sAngle				The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)	
		eAngle				The ending angle, in radians	
		counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise. */
		
		ctx.closePath()	
		ctx.fillStyle = 'white'
		ctx.fill()
	}
	
	update(){
		// it has to increase particles position by particles step value and then call draw method to draw our circle at the new position
		this.position += this.step;
		this.draw()
	}
}

// this function job is the fill particle array with particles with randomized values
function init(){
	particlesArray = []
	// the number here will indicate how many particles we create 
	for(let i = 0; i < 500; i++ ){
		// moveRadius will random number b/w 0 and canvas width, this will define the size of our entire rotating particle area
		let moveRadius = Math.random() * canvas.width
		
		// step will be small random number, this will be particle speed, because we are adding this number to particles position in the update method
		let step = (Math.random()*0.002) + 0.002
		
		// Position will be a random number along circle area Math.PI*2
		// we pass this number to sine and cosine multiplied by particles moveRadius property and set center as the middle of canvas, this will cause the particles to spin around in circular motion 
		let position = Math.random()*(Math.PI*2)
		
		let size = (Math.random() * 8) + 0.5
		
		// we push these four variables into our particlesArray by calling new keyword on our Particle class
		// new keyword will create a new particle object with our randomized values for loop will do this for 500 times
		particlesArray.push(new Particle(moveRadius, step, position, size))
	}
}


function animate(){
	requestAnimationFrame(animate)
	// we want our particles to leave trails as they move so instead after every step of animation i will draw a semi-transparent rectangle 
	ctx.fillStyle = 'rgba(0,0,0,0.1)'
	ctx.fillRect(0,0,innerWidth, innerHeight)
	
	for(let i = 0; i < particlesArray.length; i++){
		particlesArray[i].update()
	}
}

window.addEventListener("resize", function(){
	canvas.width  = innerWidth
	canvas.height = innerHeight
})
// call init to initialize new particle array and fill it with particle objects with randomized values 
init()

// call animate to set things in motion 
animate()