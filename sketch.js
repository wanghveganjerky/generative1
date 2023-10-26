let ready = false;
let osc;
let osc2;
let osc3;
let osc4; 
let osc5; 
let osc6; 
let waveform;
let stopAnimation = false;
let randomValue = Math.random()*17;
let colors = ["#CFB3FF", "#CEB3FF", "#071FFF", "##FFB7FF", "#FFF603", "#9DE1A4", '#FFC1FC','#F2A6E3','#ADF7E2','#0497FE','#fefe99','#39FF14',' #002199','#B0C4DE','#E68DAA','#EAA8F0','#0184D4','#F3001B','#FDD87E','#D4FF57','#9C81EB','#FF5DDA','#9F8BDD','#CAD3FE']; 

//-------------------------------------------------------------//
function setup() {
  createCanvas(windowWidth, windowHeight);
}

//-------------------------------------------------------------//
function mousePressed() {
  if (!ready) {
    ready = true;
    initializeAudio();
  }
}

//-------------------------------------------------------------//
function initializeAudio() {
  let oscType = ['sine', 'triangle', 'square', 'sawtooth'];
  osc = new Tone.Oscillator();
  osc.type = oscType[Math.floor(Math.random() * oscType.length)]; // randomly select an oscillator type
  osc.frequency.value = 12*randomValue; // this is pitch in hertz(hz)        // this value could be random
  osc.start();
  osc.toDestination(); // connect oscillator to the audio output

  osc2 = new Tone.Oscillator();
  osc2.type ='sawtooth'; // change sine to sine9 would change visuals,
  osc2.frequency.value = randomValue; // this is pitch in hertz(hz)        // this value could be random
  osc2.start();
  osc2.toDestination(); // connect oscillator to the audio output

  let lfo = new Tone.LFO(1, 20, 20); // lfo defaults to sine wave, look into change to other, change numbers to more random, 1 to 0.1
  lfo.connect(osc2.frequency);
  lfo.start();
  
  osc3 = new Tone.Oscillator();
  osc3.type =  'sawtooth'; // change sine to sine9 would change visuals,
  osc3.frequency.value = randomValue; // this is pitch in hertz(hz)        // this value could be random
  osc3.start();
  osc3.toDestination(); // connect oscillator to the audio output

  osc4 = new Tone.Oscillator(); // new oscillator
  osc4.type = 'sine'; // set type to sine
  osc4.frequency.value = randomValue; // this value;
  osc4.start();
  osc4.toDestination();

  osc5 = new Tone.Oscillator(); // new oscillator
  osc5.type = 'sawtooth'; // set type to sine
  osc5.frequency.value = randomValue;
  osc5.start();
  osc5.toDestination();

  osc6 = new Tone.Oscillator(); // new oscillator
  osc6.type = 'sawtooth'; // set type to sine
  osc6.frequency.value = randomValue;
  osc6.start();
  osc6.toDestination();

  let lfo2 = new Tone.LFO(.1, 120, 20); // lfo defaults to sine wave, look into change to other, change numbers to more random, 1 to 0.1
  lfo2.connect(osc3.frequency);
  lfo2.start();

  waveform = new Tone.Waveform();
  wave2 = new Tone.Waveform();
  wave3 = new Tone.Waveform();
  wave4 = new Tone.Waveform();
  wave5 = new Tone.Waveform();
  wave6 = new Tone.Waveform();
  Tone.Master.connect(waveform);
  Tone.Master.volume.value = -7/randomValue; // -9 decibles       // this value could be random
}

//-------------------------------------------------------------//
function draw() {
  
  if (ready) {
    // our main sketch is ready
    if (millis() < 1800) {
      background(0, 0);
      clear();
      // randomly choose whether stroke is dotted or connected
      let isDotted = Math.random() < 0.5;
      
      // set stroke weight and cap style
      strokeWeight(Math.random() * 90);
      if (isDotted) {
        strokeCap(SQUARE);
        stroke(randomValue)
        
      } else {
        strokeCap(PROJECT);
      }
      
      stroke(colors[Math.floor(Math.random() * colors.length)]);
      blendMode(DIFFERENCE,EXCLUSION, BURN,DODGE);
      stroke(colors[Math.floor(Math.random() * colors.length)]);
      
      let buffer = waveform.getValue(0); // grab left channel
      let start = 0;
      for (let i = 1; i < buffer.length; i++) {
        if (buffer[i - 1] < 0 && buffer[i] >= 0) {
          start = i;
          break;
        }
      }
        clear();
        
      let end = buffer.length;
      clear();
      beginShape();
      clear();
  
      for (let i = start; i < end; i++) {
        let x = map(i, start, end, randomValue, width);
        let y = map(buffer[i], -1, .07, randomValue, height);
      
        // randomly draw connected or dotted line
        if (isDotted) {
          if (i % randomValue === 0) {
            // gap between dots
            beginShape();
            endShape();
            ellipseMode(CORNER);
            quad(x,y);
            arc(x,y);
            ellipse(x,y);
            vertex(x,y);
            // square(x,y)
            // triangle(x,y)  
            
          } else {
            // draw dot
            point(x, y);
            ellipseMode(CORNER);
            //    quad(x,y);
            // arc(x,y);
            ellipse(x,y);
            vertex(x,y);
            //  square(x,y)
            // triangle(x,y)  
          }
        } else {
          // draw connected line
          if (i === start) {
            // first point
            arc(x,y);
          } else {
            // subsequent points
            let xPrev = map(i - 1, start, end, 0, width);
            let yPrev = map(buffer[i - 1], -1, randomValue, randomValue, height);
            
            line(xPrev, yPrev, x, y);
          }
        }
      }
      vertex(0, 0); // top-left
      vertex(width, 0); // top-right
      vertex(width, height); // bottom-right
      vertex(0, height); // bottom-left
      endShape(CLOSE);
      
    } else if (!stopAnimation) {
      stopAnimation = true;
      noLoop(); // stop the animation
    }
  } else {
    background('white');
    fill(colors[Math.floor(Math.random() * colors.length)]);
    textAlign(CENTER, CENTER);
    textSize(28);
    text('Press anywhere to start', width / 2, height / 2 - 15); // first line
    text('Refresh to start over', width / 2, height / 2 + 15); 
    // blendMode(DIFFERENCE,EXCLUSION );
  }
}

//-------------------------------------------------------------//

// function draw() {
//   if (ready) {
//     // our main sketch is ready
//     if (millis() < 1000) {
//       background(0, 20);
//       stroke('white');
//       strokeWeight((Math.random() * 17));
//       blendMode(DIFFERENCE);
//       fill('pink');

//       let buffer = waveform.getValue(0); //  grab left channel

// let start = 0;
// for (let i = 1; i < buffer.length; i++) {
//   if (buffer[i - 1] < 0 && buffer[i] >= 0) {
//     start = i;
//     break;
//   }
// }

// let end = buffer.length;

// beginShape();
// for (let i = start; i < end; i++) {
//   let x = map(i, start, end, 0, width);
//   let y = map(buffer[i], -1, 1, 0, height);
//   vertex(x, y);
// }

//       vertex(width, height); // bottom right
//       vertex(0, height); // bottom left
//       endShape(CLOSE);
//     } else if (!stopAnimation) {
//       stopAnimation = true;
//       noLoop(); // stop the animation
//     }
//   } else {
//     background('white');
//     fill('white');
//     textAlign(CENTER, CENTER);
//     text('click me !', width / 2, height / 2);
//   }
// }


// function draw() {
//   if (ready) {
//     // our main sketch is ready
//     if (millis() < 1000) {
//       background(0, 20);
//       stroke('white');
//       strokeWeight((Math.random() * 17));
//       blendMode(DIFFERENCE);
//       fill('pink');

//       let buffer = waveform.getValue(0); //  grab left channel

//       let start = 0;
//       for (let i = 1; i < buffer.length; i++) {
//         if (buffer[i - 1] < 0 && buffer[i] >= 0) {
//           start = i;
//           break;
//         }
//       }

//       let end = buffer.length / 2 + start;

//       let rotation = random(TWO_PI); // generate a random angle of rotation
      
//       push(); // save the current transformation matrix
//       translate(width / 2, height / 2); // move to the center of the canvas
//       rotate(rotation); // rotate by the random angle
//       beginShape();
//       for (let i = start; i < end; i++) {
//         let x = map(i, start, end, 0, width);
//         let y = map(buffer[i], -1, 1, 0, height);
//         vertex(x, y);
//       }
//       vertex(width, height); // bottom right
//       vertex(0, height); // bottom left
//       endShape(CLOSE);
//       pop(); // restore the previous transformation matrix
//     } else if (!stopAnimation) {
//       stopAnimation = true;
//       noLoop(); // stop the animation
//     }
//   } else {
//     background('black');
//     fill('white');
//     textAlign(CENTER, CENTER);
//     text('click me !', width / 2, height / 2);
//   }
// }
