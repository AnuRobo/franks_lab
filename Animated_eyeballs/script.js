const canvas 	= document.getElementById("canvas1");
const ctx 		= canvas.getContext("2d");
canvas.width 	= window.innerWidth;
canvas.height 	= window.innerHeight;

let eyes 		= []

// commonly used to store angles
// later we will calculate its value and pass it to sine and cosine to work out which way our eys is looking
let theta;

// to store our current mouse position
const mouse = {
	x : undefined,
	y : undefined
};

// event listener for mouse move position every time
// every time mouse event occurs object is updated with new coordinates
// This is how we called Mouse tracking in JavaScript
window.addEventListener("mousemove", function(evenet){
	mouse.x = event.x;
	mouse.y = event.y;
//	console.log(event)
});

class Eye {
	// mandatory 
	// pass three arguments it will store values for x and y position and radius which will later randomized for each object
	constructor(x, y, radius){
		this.x 		= x;
		this.y 		= y;
		this.radius = radius;
	}
	
	// this method take randomized values of each eye and draw it on canvas
	draw(){
		// draw eys
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
		ctx.fillStyle = 'red';
		ctx.fill()
		ctx.closePath();  // should be called whenever imaginary pen leaves the canvas and move somewhere else to draw another object ;
		
		// draw iris
		// sine and coine trigonometric functions will give us values we need to roll the eye around in a circle similar to 
		// these functions take an angle in radians and return a value between -1 and +1, when used together we can create a position around the circle
		// formula gives you the current position around the circle based an angle pass to it 
		// center coordinate is the position of the center point on the x and y axis and offset is how far from the center point you want the center of the new circle to be 
		// So how do we know what angle we pass to it we will use the current center point and current mouse position to create right angled triangle  
		// JavaScript has built-in function to calculate slope of  hypotenuse in right angled triangle the function is called Math.atan2() so we calculate the angle and store it in a variable theta
		// we just pass theta value in sine and cosine in our draw method, to have our eye follow the cursor 
		/* for more detail follow this link :- https://www.adammarcwilliams.co.uk/animating-javascript-trigonometry/ */
		//let iris_dx 	= mouse.x - this.x;
		//let iris_dy 	= mouse.y - this.y;
		
		// get angle
		let dx 	= mouse.x - this.x;
		let dy 	= mouse.y - this.y;
		theta 			= Math.atan2(dy, dx);
		
		let iris_x 		= this.x + Math.cos(theta) * this.radius/10;
		let iris_y		= this.y + Math.sin(theta) * this.radius/10;
		let irisRadius 	= this.radius / 1.2;
		ctx.beginPath();
		ctx.arc(iris_x, iris_y, irisRadius, 0, Math.PI * 2, true);
		ctx.fillStyle 	= "white";
		ctx.fill();
		ctx.closePath();
	
	
		// draw pupil
		//let pupil_dx 	= mouse.x - this.x;
		//let pupil_dy	= mouse.y - this.y;
		//theta			= Math.atan2(dy, dx);
		let pupil_x		= this.x + Math.cos(theta) * this.radius/1.9;
		let pupil_y		= this.y + Math.sin(theta) * this.radius/1.9;
		let pupilRadius	= this.radius / 2.5;
		ctx.beginPath();
		ctx.arc(pupil_x, pupil_y, pupilRadius, 0, Math.PI * 2, true);
		ctx.fillStyle 	= 'black';
		ctx.fill();
		ctx.closePath();

		
		// draw pupil reflection 
		ctx.beginPath();
		ctx.arc(pupil_x-pupilRadius/3, pupil_y-pupilRadius/3, pupilRadius/2, 0, Math.PI * 2, true);
		ctx.fillStyle = "rgba(255,255,255,0.1)";
		ctx.fill();
		ctx.closePath();
		
		// draw mouse
		// draw a circle around our current mouse X and Y position 
		ctx.beginPath();
		ctx.arc(mouse.x,mouse.y, 15, 0, Math.PI * 2, true);
		ctx.fillStyle = "gold";
		ctx.fill();
		ctx.closePath();
	}
}

// This function purpose to create randomized values for each eye object
function init(){
	eyes = [];
	let numberOfEyes = 200;
	// for explaination for algorithm for circles with no overlap watch DAN SHIFFMAN videos 
	// To avoid Overlap we need to collision check everytime we pushed a new eye to our eyes array
	// This is just a simple brute force algorithm
	let overlapping = false;
	//if our loop ran 10000 times and couldn't find enough non overlapping circles it will just exit the loop instead of freezing our browser
	let protection 	= 10000;
	// increase a return we try to calculate new coordinates until it reaches protection value
	let counter 	= 0;	
	
	//this will run until our eyes array is filled with number of eyes specified in our numberOfeyes variable 
	// at the same time it will check if our counter is lower than protection 
	while (eyes.length < numberOfEyes && counter < protection){
		// object with three propertites
		let eye = {
			// random number b/w 0 and canvas width
			x		: Math.random() * canvas.width,
			// random number b/w 0 and canvas height
			y		: Math.random() * canvas.height,
			// random number between 5 and 105
			radius	: Math.floor(Math.random() * 100) + 5	
		};
		// overlap into false in case previous loop set it to true
		overlapping = false;
		
		// will run for every eye in our eys array
		// for loop will bw compareing against previous eyes in our eyes array not the numberOfEyes
		for(let i = 0; i < eyes.length; i++){
			// created previous eye so we can compare it
			let previousEye = eyes[i];
			// to calculate a distance od two circles we pythagorus formula 
			let dx = eye.x - previousEye.x;  
			let dy = eye.y - previousEye.y;
			let distance = Math.sqrt(dx*dx + dy*dy); 
			// radius new eye plus radius of previous eye it means they are colliding
			// comparing new eye against every other eye we have already created 
			if (distance < (eye.radius + previousEye.radius)){
				/*if they collide we set overlap into true and break the loop because it doesn't have to 
				check the new eye against the rest of the array if we found collision */ 
				overlapping = true;
				break;
			}
		}
		if (!overlapping){
			eyes.push(new Eye(eye.x, eye.y, eye.radius))
		}
		counter++;
	}
}

function animate(){
	// api
	// this way function will call itself recursively over and over, this is our animation loop
	requestAnimationFrame(animate);
	
	// Every frame we will first draw a semi-transparent rectangle the size of our canvas
	// do this to give our mouse cursor a bit of a trail to follow it 	
	ctx.fillStyle = "rgba(0,0,0,.25)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	for (let i = 0; i < eyes.length; i++){
		eyes[i].draw();
	}
}

init()
animate()

window.addEventListener("resize", function(){
	canvas.width 	= innerWidth;
	canvas.height 	= innerHeight;
	init();
});