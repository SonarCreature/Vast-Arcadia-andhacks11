import "./styles.css"
import event_data from './data/events.json' assert {type: 'json'}
import tech_data from './data/technologies.json' assert {type: 'json'}


const eventData = JSON.parse(JSON.stringify(event_data));
const techData = JSON.parse(JSON.stringify(tech_data));
let events = ["national_leader", "researcher"];
let technologies = []
let log_changes = [];

let biostability = 500;
let biostability_del = -50;
let year = 2025;
let tech_open = false;
let dialog_open = true;

const nextButton = document.getElementById('next');
const dialog = document.getElementById("event-dialog");
const arrow = document.getElementById("arrow");

nextButton.addEventListener("click", () => {
    if(dialog_open) return;
    let randomEvent = Math.floor(Math.random() * events.length)
    loadEvent(randomEvent)
    dialog.show()
    dialog_open = true;
    document.getElementById('next').classList.remove('active')
})

arrow.addEventListener("click", () => {
    toggleTechnologies();
})

function tutorial(){
    let log = new Object()
    log.text = "Hello Agent Num: 8000";
    log.color = 'white';
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "Vast Arcadia has detected disturbances across time, and a climate crisis threatens our utopia.";
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "We have selected you to avert this catastrophe, by travelling back to the year 2025, and changing the course of history to ensure our existence.";
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "The terminal in front of you is the Temporal Injection and Manipulation Encoding Machine, or T.I.M.E. Machine";
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "On the left you can see the current year, and two numbers.";
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "The first number is the current Biosphere Health, your goal is to get this above 1000";
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "The second is the current Biosphere Stability, and will be added or subtracted to the Biosphere Health each year";
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "In the top left corner you'll see a small arrow, clicking on it will open the Technology and Agendas Menu";
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "This shows the status of any research or political changes your decisions might cause";
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "In front of you is the Event Log, where you will see your actions play out";
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "Press the Next Year button whenever it glows to travel a year forward, and insert yourself into a new event";
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "You have until 2030 to right the course of history";
    eventLog(log);
    log = new Object()
    log.color = 'white';
    log.text = "Good Luck, Agent.";
    eventLog(log);
    updateLog();
}

function secondTutorial(){
    let log = new Object()
    log.text = "!!! INCOMING TRANSMISSION !!!";
    log.color = 'white';
    eventLog(log);
    log = new Object()
    log.text = "Concerning";
    log.color = 'white';
    eventLog(log);
    log = new Object()
    log.text = "It would appear that our desired trajectory for the Biosphere would have required changes to have started decades before your insertion.";
    log.color = 'white';
    eventLog(log);
    log = new Object()
    log.text = "Command has authorized your continued involvement until 2075, your new objectives are:";
    log.color = 'white';
    eventLog(log);
    log = new Object()
    log.text = "1. Ensure that total biosphere collapse does not occur (keep Biosphere Health above 0)";
    log.color = 'white';
    eventLog(log);
    log = new Object()
    log.text = "2. Attempt to restore the Biosphere Health to above 1000 by 2075";
    log.color = 'white';
    eventLog(log);
    log = new Object()
    log.text = "Good Luck, Agent";
    log.color = 'white';
    eventLog(log);
}

function loadEvent(toLoad){
    let info = eventData[`${events[toLoad]}`];
    document.getElementById('event-title').textContent = info.name;
    document.getElementById('event-description').textContent = info.description;
    document.getElementById('event-img').src = `images/${info.image}`
    let optionMenu = document.createElement('div');
    optionMenu.id = 'options';
    document.getElementById("event-dialog").appendChild(optionMenu)
    //console.log(info.options)
    for (let option of info.options){
        console.log("hi");
        let newButton = document.createElement('button');
        newButton.textContent = option.name;
        newButton.classList += "option"
        newButton.addEventListener('click', () => {
            biostability += option.biosphere;
            biostability_del += option.permanent_biosphere;
            let log = new Object()
            log.text = option.log;
            log.color = 'red';
            eventLog(log);
            startTech(option.technology)
            addEvents(option.add_events)
            endYear();
            optionMenu.remove();
        })
        newButton.addEventListener('mouseover', () => {
            newButton.textContent = option.hover;
        })
        newButton.addEventListener('mouseleave', () => {
            newButton.textContent = option.name;
        })
        optionMenu.appendChild(newButton);
    }
};

function endYear(){
    dialog.close()
    year += 1;
    changeBiostab();
    //biostability += biostability_del
    updateTech();
    let log = new Object()
    log.text = `Current Biosphere Health: ${biostability}, Current Biosphere Growth ${biostability_del}`;
    log.color = 'white';
    eventLog(log);
    if(year === 2030){secondTutorial()};
    updateLog();
    if(biostability <= 0){
        endGame("bad_end")
    }
    if(year >= 2075 && biostability >= 1000){
        endGame("good_end")
    }
    if(year >= 2075 && biostability < 1000){
        endGame("neutral_end")
    }
}

function changeBiostab(){
    biostability += biostability_del;
    document.getElementById('biostab').textContent = biostability;
    document.getElementById('dbiostab').textContent = biostability_del;
    document.getElementById('year').textContent = year;
    let percent = biostability/1000
    if(percent > 1) percent = 1;
    if(percent < 0) percent = 0;
    let newColor = [(1 - percent) * 255, percent * 255, 0]
    document.documentElement.style.setProperty('--health-color', `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`)
    document.getElementById('bio').animate(
        [
            {color: "white"},
            {color: `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`}
        ],
        {
            duration: 1000
        }
    )
}

function eventLog(a){
    log_changes.push(a);
}

function updateLog(){
    if(log_changes.length === 0) {
        dialog_open = false;
        document.getElementById('next').classList += 'active';
        return;
    }
    let currentevent = log_changes.shift();
    let newLog = document.createElement('div')
    newLog.classList += 'log';
    newLog.textContent = currentevent.text;
    newLog.style.color = currentevent.color;
    newLog.style.borderColor = currentevent.color;
    document.getElementById("eventlog").appendChild(newLog);
    let newanim = newLog.animate(
        [
            {transform:'scale(0, 1)', backgroundColor: currentevent.color},
            {transform:'scale(1, 1)', backgroundColor: 'black'}
        ],
        {
            duration: 500,
        }
    )
    let someElement = document.getElementById('eventlog');
    someElement.scrollTop = someElement.scrollHeight;
    newanim.addEventListener('finish', () =>{
        
        console.log("animation end")
        setTimeout(() => {updateLog()}, 2000);
    })
}

function endGame(ending){
    alert(ending);
}

function addEvents(toAdd){
    events = events.concat(toAdd);
    console.log(events);
}

function startTech(tech){
    if(tech === ""){
        return;
    }
    let info = techData[`${tech}`]
    let newTech = new Object();
    let effects = info.effects;
    newTech.name = info.name;
    newTech.type = info.type;
    newTech.time = info.time + 1;
    newTech.image = info.image;
    newTech.effectLog = info.effectlog
    newTech.description = info.description;
    newTech.complete = false;
    newTech.techID = makeTechIndicator(info);
    newTech.completion = () =>{
        console.log(`completed tech: ${newTech.name}`)
        biostability_del += effects.permanent_biosphere;
        biostability += effects.biosphere;
        console.log(biostability_del);
    }
    technologies.push(newTech)
    let log = new Object()
    log.text = info.log;
    log.color = 'cyan';
    eventLog(log);
    //console.log(`started tech: ${info.name}`)
}

function makeTechIndicator(info){
    console.log('making indicator');
    let indicator = document.createElement('div');
    indicator.classList += "tech";
    let newImage = document.createElement('img');
    newImage.src = `images/${info.image}`
    indicator.appendChild(newImage);
    let container = document.createElement('div');
    indicator.appendChild(container);
    let title = document.createElement('span');
    title.classList += 'tech-title';
    title.textContent = info.name;
    container.appendChild(title);
    let timer = document.createElement('span');
    timer.classList += 'tech-timer';
    timer.textContent = `Years Remaining: ${info.time}`
    container.appendChild(timer);
    let description = document.createElement('span');
    description.classList += 'tech-description';
    description.textContent = info.description;
    container.appendChild(description);
    let newId = crypto.randomUUID();
    indicator.dataset.id = newId;
    document.getElementById('tech-status').appendChild(indicator);
    return newId;
}

function updateTech(){
    //console.log(technologies)
    for(let num in technologies){
        tech = technologies[num]
        console.log(tech)
        if(tech.complete === true){
            continue;
        }

        tech.time -= 1; 

        document.querySelector(`[data-id="${tech.techID}"] .tech-timer`).textContent = `Years Remaining: ${tech.time}`

        if(tech.time === 0){
            document.querySelector(`[data-id="${tech.techID}"]`).style.borderColor = "cyan";
            document.querySelector(`[data-id="${tech.techID}"] .tech-timer`).style.borderColor = "cyan";
            document.querySelector(`[data-id="${tech.techID}"]`).style.color = "cyan";
            document.querySelector(`[data-id="${tech.techID}"] .tech-timer`).textContent = `Complete`;
            tech.complete = true;
            tech.completion()
            let log = new Object()
            log.text = `Research Complete: ${tech.name}, ${tech.effectLog}`;
            log.color = 'green';
            eventLog(log);
        }
        
    }
}

function toggleTechnologies(){

    let animdirection = 'normal';
    document.getElementById("tech-status").style.visibility = 'visible';
    if (tech_open){ 
    animdirection = 'reverse'
    document.getElementById("tech-status").style.visibility = 'hidden';
    };
    console.log(animdirection);
    tech = document.getElementById("tech");
    tech.animate(
        [
            {flexBasis: "50px"},
            {flexBasis: "30%"}
        ],
        {
            duration: 1000,
            easing: 'ease-out',
            fill: 'forwards',
            direction: `${animdirection}`
        }
    )
    arrow.animate(
        [
            {transform: 'rotate(0deg)'},
            {transform: 'rotate(180deg)'}
        ],
        {
            duration: 1000,
            easing: 'ease-out',
            fill: 'forwards',
            direction: `${animdirection}`
        }
    )
    tech_open = !tech_open
}

tutorial();