/* ==========================================
   RevScore™ Calculator v2
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

const leadModal = document.getElementById("leadModal");
const submitLead = document.getElementById("submitLead");

let currentStep = 0;
let calculatorResult = null;

/* ==========================================
   Navigation
========================================== */

function showStep(index){

    steps.forEach(step=>step.classList.remove("active"));

    steps[index].classList.add("active");

    progressFill.style.width =
        ((index+1)/steps.length)*100 + "%";

    progressText.innerHTML =
        `Step ${index+1} of ${steps.length}`;

    prevBtn.style.visibility =
        index===0
        ? "hidden"
        : "visible";

    nextBtn.innerHTML =
        index===steps.length-1
        ? "Calculate My RevScore™"
        : "Next →";

}

showStep(currentStep);

/* ==========================================
   Validation
========================================== */

function validateStep(){

    const radios =
        steps[currentStep]
        .querySelectorAll("input");

    return [...radios].some(r=>r.checked);

}

/* ==========================================
   Navigation Buttons
========================================== */

nextBtn.addEventListener("click",()=>{

    if(!validateStep()){

        alert(
            "Please choose an option before continuing."
        );

        return;

    }

    if(currentStep < steps.length-1){

        currentStep++;

        showStep(currentStep);

        return;

    }

    calculateScore();

});

prevBtn.addEventListener("click",()=>{

    if(currentStep===0) return;

    currentStep--;

    showStep(currentStep);

});

/* ==========================================
   Helpers
========================================== */

function value(name){

    const selected =
        document.querySelector(
            `input[name="${name}"]:checked`
        );

    return selected
        ? Number(selected.value)
        : 0;

}

/* ==========================================
   Calculate
========================================== */

function calculateScore(){

    const impact = value("impact");
    const effort = value("effort");
    const people = value("people");
    const learning = value("learning");
    const criticality = value("criticality");
    const strategy = value("strategy");

    const total =
        impact +
        effort +
        people +
        learning +
        criticality +
        strategy;

    calculatorResult = {

        impact,
        effort,
        people,
        learning,
        criticality,
        strategy,
        total

    };

    openLeadModal();

}

/* ==========================================
   Modal
========================================== */

function openLeadModal(){

    leadModal.classList.remove("hidden");

}

function closeLeadModal(){

    leadModal.classList.add("hidden");

}
/* ==========================================
   Submit Lead
========================================== */

submitLead.addEventListener("click", submitLeadForm);
document
.getElementById("leadEmail")
.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        submitLeadForm();

    }

});

document
.getElementById("leadName")
.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        submitLeadForm();

    }

});

async function submitLeadForm(){

    const name =
        document.getElementById("leadName").value.trim();

    const email =
        document.getElementById("leadEmail").value.trim();

    const error =
        document.getElementById("leadError");

    error.innerHTML = "";

    if(name===""){

        error.innerHTML="Please enter your first name.";

        return;

    }

    if(email===""){

        error.innerHTML="Please enter your work email.";

        return;

    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){

        error.innerHTML="Please enter a valid email.";

        return;

    }

    submitLead.disabled = true;

    submitLead.innerHTML =
        "Generating Results...";

    let priority = "";

    if(calculatorResult.total>=80){

        priority="Highest Priority";

    }

    else if(calculatorResult.total>=70){

        priority="Strong Candidate";

    }

    else if(calculatorResult.total>=60){

        priority="Consider Carefully";

    }

    else{

        priority="Low Priority";

    }

    try{

        const response = await fetch(

            "https://formspree.io/f/mdaqyzog",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    "Accept":"application/json"

                },

                body:JSON.stringify({

                    name,

                    email,

                    score:calculatorResult.total,

                    priority,

                    impact:calculatorResult.impact,

                    effort:calculatorResult.effort,

                    people:calculatorResult.people,

                    learning:calculatorResult.learning,

                    criticality:calculatorResult.criticality,

                    strategy:calculatorResult.strategy,

                    source:"RevScore Calculator",

                    version:"2.0"

                })

            }

        );

        if(!response.ok){

    const message = await response.text();

    console.log(message);

    throw new Error(message);

}

        closeLeadModal();

        showResults(calculatorResult);

    }

    catch(e){

    console.error(e);

    error.innerHTML = e.message;

    submitLead.disabled = false;

    submitLead.innerHTML = "Unlock My Results →";

}

    }


/* ==========================================
   Results
========================================== */

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

    const recommendation=document.getElementById("recommendation");

    if(data.total>=80){

        title.innerHTML="🏆 Highest Priority";

        recommendation.innerHTML=

        "Excellent choice. This initiative deserves immediate attention and should be prioritized on your roadmap.";

    }

    else if(data.total>=70){

        title.innerHTML="🟢 Strong Candidate";

        recommendation.innerHTML=

        "A valuable initiative with strong business potential. Consider scheduling it during your current planning cycle.";

    }

    else if(data.total>=60){

        title.innerHTML="🟡 Consider Carefully";

        recommendation.innerHTML=

        "This project has value but should compete with higher-impact initiatives before receiving investment.";

    }

    else{

        title.innerHTML="🔴 Low Priority";

        recommendation.innerHTML=

        "This initiative is unlikely to deliver meaningful business impact today. Reassess its timing or scope.";

    }

}

/* ==========================================
   Animated Score
========================================== */

function animateScore(score){

    const element=document.getElementById("finalScore");

    let current=0;

    const timer=setInterval(()=>{

        current++;

        element.textContent=current;

        if(current>=score){

            clearInterval(timer);

        }

    },15);

}

/* ==========================================
   Restart
========================================== */

restart.addEventListener("click",()=>{

    wizard.reset();

    calculatorResult = null;

    currentStep = 0;

    results.classList.add("hidden");

    wizardCard.style.display = "block";

    showStep(currentStep);

    // Reset modal fields
    document.getElementById("leadName").value = "";
    document.getElementById("leadEmail").value = "";
    document.getElementById("leadError").innerHTML = "";

    // Reset button
    submitLead.disabled = false;
    submitLead.innerHTML = "Unlock My Results →";

    // Close modal if it's open
    closeLeadModal();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

/* ==========================================
   Keyboard
========================================== */

document.addEventListener("keydown",(e)=>{

    if(leadModal.classList.contains("hidden")){

        if(e.key==="ArrowRight"){

            nextBtn.click();

        }

        if(e.key==="ArrowLeft"){

            prevBtn.click();

        }

    }

});

/* ==========================================
   Option Animation
========================================== */

document.querySelectorAll("input").forEach(input=>{

    input.addEventListener("change",()=>{

        input.parentElement.animate(

            [

                {

                    transform:"scale(1)"

                },

                {

                    transform:"scale(1.03)"

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

/* ==========================================
   Console
========================================== */

console.log(

"%cRevScore™ Calculator v2",

"color:#635BFF;font-size:18px;font-weight:bold"

);

console.log(

"Lead generation enabled with Formspree."

);