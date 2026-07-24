/* ==========================================
   RevScore™ Project Evaluator
   script.js
========================================== */

const steps = document.querySelectorAll(".step");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const wizard = document.getElementById("wizard");
const wizardCard = document.getElementById("wizardCard");
const results = document.getElementById("results");

const restart = document.getElementById("restart");

let currentStep = 0;

/* ==========================
   Navigation
========================== */

function showStep(index){

steps.forEach(step=>step.classList.remove("active"));

steps[index].classList.add("active");

progressFill.style.width=((index+1)/steps.length)*100+"%";

progressText.innerHTML=`Step ${index+1} of ${steps.length}`;

prevBtn.style.visibility=index===0?"hidden":"visible";

nextBtn.innerHTML=index===steps.length-1
?"Calculate RevScore™"
:"Next →";

}

showStep(currentStep);

/* ==========================
   Validation
========================== */

function validateStep(){

const radios=steps[currentStep].querySelectorAll("input");

return [...radios].some(r=>r.checked);

}

/* ==========================
   Buttons
========================== */

nextBtn.addEventListener("click",()=>{

if(!validateStep()){

alert("Please select one option before continuing.");

return;

}

if(currentStep<steps.length-1){

currentStep++;

showStep(currentStep);

}

else{

calculateScore();

}

});

prevBtn.addEventListener("click",()=>{

if(currentStep>0){

currentStep--;

showStep(currentStep);

}

});

/* ==========================
   Get Scores
========================== */

function value(name){

const selected=document.querySelector(`input[name="${name}"]:checked`);

return selected?Number(selected.value):0;

}

/* ==========================
   Calculate
========================== */

function calculateScore(){

const impact=value("impact");

const effort=value("effort");

const people=value("people");

const learning=value("learning");

const criticality=value("criticality");

const strategy=value("strategy");

const total=

impact+

effort+

people+

learning+

criticality+

strategy;

showResults({

impact,

effort,

people,

learning,

criticality,

strategy,

total

});

}

/* ==========================
   Results
========================== */

function showResults(data){

wizardCard.style.display="none";

results.classList.remove("hidden");

animateScore(data.total);

document.getElementById("impactScore").textContent=data.impact;

document.getElementById("effortScore").textContent=data.effort;

document.getElementById("peopleScore").textContent=data.people;

document.getElementById("learningScore").textContent=data.learning;

document.getElementById("criticalityScore").textContent=data.criticality;

document.getElementById("strategyScore").textContent=data.strategy;

const title=document.getElementById("priorityTitle");

const text=document.getElementById("recommendation");

if(data.total>=80){

title.innerHTML="🏆 Highest Priority";

text.innerHTML=

"This initiative should move to the top of your roadmap. It delivers significant business value while aligning strongly with organizational goals.";

}

else if(data.total>=70){

title.innerHTML="🟢 Strong Candidate";

text.innerHTML=

"A valuable initiative that deserves consideration during the current planning cycle.";

}

else if(data.total>=60){

title.innerHTML="🟡 Consider Carefully";

text.innerHTML=

"This project has potential but competes with higher-impact initiatives. Review timing and available resources.";

}

else{

title.innerHTML="🔴 Low Priority";

text.innerHTML=

"This project is unlikely to deliver enough value today. Consider postponing or redefining its scope.";

}

}

/* ==========================
   Animated Counter
========================== */

function animateScore(score){

const element=document.getElementById("finalScore");

let current=0;

const speed=15;

const timer=setInterval(()=>{

current++;

element.textContent=current;

if(current>=score){

clearInterval(timer);

}

},speed);

}

/* ==========================
   Restart
========================== */

restart.addEventListener("click",()=>{

wizard.reset();

results.classList.add("hidden");

wizardCard.style.display="block";

currentStep=0;

showStep(currentStep);

window.scrollTo({

top:0,

behavior:"smooth"

});

});

/* ==========================
   Keyboard Support
========================== */

document.addEventListener("keydown",(e)=>{

if(e.key==="ArrowRight"){

nextBtn.click();

}

if(e.key==="ArrowLeft"){

prevBtn.click();

}

if(e.key==="Enter"){

if(document.activeElement.tagName!=="BUTTON"){

nextBtn.click();

}

}

});

/* ==========================
   Progress Animation
========================== */

document.querySelectorAll("input").forEach(input=>{

input.addEventListener("change",()=>{

const label=input.parentElement;

label.animate(

[

{

transform:"scale(1)"

},

{

transform:"scale(1.02)"

},

{

transform:"scale(1)"

}

],

{

duration:180

}

);

});

});

/* ==========================
   Console Banner
========================== */

console.log(

"%cRevScore™ Project Evaluator",

"color:#635BFF;font-size:18px;font-weight:bold"

);

console.log(

"Built with vanilla HTML, CSS & JavaScript."

);