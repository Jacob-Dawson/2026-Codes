// js goes here
import { zuksTable, zuksTableHm, eliteTable, secondaryDrops, teritaryDrops } from "./data.js";

// event listeners

document.getElementById("toggle-hm").addEventListener("change",hardmodeToggle,false);
document.getElementById("simulate-button").addEventListener("click",simulateClickEvent,false);
document.getElementById("dropLog-button").addEventListener("click",openDropLog,false);
document.getElementById("dataLog-button").addEventListener("click",openDataLog,false);
document.getElementById("drop-odds-button").addEventListener("click",showOdds,false);
document.getElementById("drop-odds-close-button").addEventListener("click",showOdds,false);
document.getElementById("disclaimer-button").addEventListener("click",showDisclaimer,false);

// variables

let hardmode = false;
let totalCoins = 0;
let ekZekkilPieces = [0,0,0]
let dataLog = []; // log of data
let kills;

//console.log(zuksTable)

// - odds table

printOdds();

function printOdds(){

    let dropOddsModal = ``;

    //console.log("Odds:");
    dropOddsModal += `<div class='oddsTitle'>Odds:</div>`;

    //console.log("Zuk's Table:")
    dropOddsModal += `<div class='oddsSection'><div class='oddsSubtitle'>Zuk's Table:</div>`;

    zuksTable.forEach(record => {

        //console.log(`${checkSimilar(record.quantity)} x ${record.name} ~ ${record.rarity}/${getDropDenom(zuksTable)} (${record.price.toLocaleString()} x coins)`)
        dropOddsModal += `<div class='oddsRecord'>${checkSimilar(record.quantity)} x ${record.name} ~ ${record.rarity}/${getDropDenom(zuksTable)} (${record.price.toLocaleString()} x coins)</div>`;
        
    });

    //console.log("")

    //console.log("Elite Table:")
    dropOddsModal += `</div><div class='oddsSection'><div  class='oddsSubtitle'>Elite Table:</div>`;

    eliteTable.forEach(record => {

        //console.log(`${checkSimilar(record.quantity)} x ${record.name} ~ ${record.rarity}/${getDropDenom(eliteTable)} (${record.price.toLocaleString()} x coins)`)
        dropOddsModal += `<div class='oddsRecord'>${checkSimilar(record.quantity)} x ${record.name} ~ ${record.rarity}/${getDropDenom(eliteTable)} (${record.price.toLocaleString()} x coins)</div>`;


    });

    //console.log("");

    //console.log("Secondary Table:")
    dropOddsModal += `</div><div class='oddsSection'><div class='oddsSubtitle'>Secondary Table:</div>`;

    secondaryDrops.forEach(record => {

        if(record.name != "Nothing"){

            //console.log(`${checkSimilar(record.quantity)} x ${record.name} ~ ${record.rarity}/${getDropDenom(secondaryDrops)} (${record.price.toLocaleString()} x coins)`)
            dropOddsModal += `<div class='oddsRecord'>${checkSimilar(record.quantity)} x ${record.name} ~ ${record.rarity}/${getDropDenom(secondaryDrops)} (${record.price.toLocaleString()} x coins)</div>`;

        }

    })

    //console.log("");

    //console.log("Teritary Table:")
    dropOddsModal += `</div><div class='oddsSection'><div class='oddsSubtitle'>Teritary Table:</div>`;

    teritaryDrops.forEach(record => {

        if(record.name != "Nothing"){

            //console.log(`${checkSimilar(record.quantity)} x ${record.name} ~ ${record.rarity}/${getDropDenom(teritaryDrops)} (${record.price.toLocaleString()} x coins)`)
            dropOddsModal += `<div class='oddsRecord'>${checkSimilar(record.quantity)} x ${record.name} ~ ${record.rarity}/${getDropDenom(teritaryDrops)} (${record.price.toLocaleString()} x coins)</div>`;

        }

    })

    //console.log("")

    //console.log(dropOddsModal);

    dropOddsModal += `</div>`

    document.getElementById("drop-odds").innerHTML = `${dropOddsModal}`;

}

function showOdds(){

    let dropOddsModal = document.getElementById("drop-odds-container");

    if(getComputedStyle(dropOddsModal).display == "flex"){

        dropOddsModal.style.display = "none";

    } else if(getComputedStyle(dropOddsModal).display == "none"){

        dropOddsModal.style.display = "flex";

    }

}

// - simulation

//dropSimulation(kills)

function dropSimulation(amount){

    ekZekkilPieces = [0,0,0]
    totalCoins = 0;
    dataLog = [];

    const msg = `You received:`;
    let dropLogOutput = document.getElementById("dropLog-output");
    dropLogOutput.innerHTML = ``;
    dropLogOutput.innerHTML += `<p>Drop Log</p>`;

    for(let i=0; i<amount; i++){

        let dropMsg = ``;
        let dataRecord = {
            kill: i+1,
            items: []
        }

        const eliteTableDrop = rollDrop(eliteTable);

        dropMsg += `<div class='killSection'> <p class='killNo'>Kill ${i+1}:</p><p>${msg} ${eliteTableDrop[0]}</p>`

        //console.log(typeof(dropMsg))

        dataRecord.items.push({
            dropAmount: eliteTableDrop[1][0],
            dropValue: eliteTableDrop[1][1],
            drop: eliteTableDrop[1][2]
        })

        if(hardmode === true){

            const zuksTableHmDrop = rollDrop(zuksTableHm);

            if(zuksTableHmDrop[0].includes("codex") || zuksTableHmDrop[0].includes("Ful") === true){

                dropMsg += `<p class="highValueDrop">${msg} ${zuksTableHmDrop[0]}</p>`

            } else {

                dropMsg += `<p>${msg} ${zuksTableHmDrop[0]}</p>`
            
            }

            dataRecord.items.push({
                dropAmount: zuksTableHmDrop[1][0],
                dropValue: zuksTableHmDrop[1][1],
                drop: zuksTableHmDrop[1][2]
            })

            const teritaryDrop = rollDrop(teritaryDrops);

            if(teritaryDrop[0].includes("Nothing") === false){

                dropMsg += `<p class="highValueDrop">${msg} ${teritaryDrop[0]}</p>`

                dataRecord.items.push({
                    dropAmount: teritaryDrop[1][0],
                    dropValue: teritaryDrop[1][1],
                    drop: teritaryDrop[1][2]
                })

            }

        } else {

            const zuksTableDrop = rollDrop(zuksTable);

            if(zuksTableDrop[0].includes("codex") || zuksTableDrop[0].includes("Ful") === true){

                dropMsg += `<p class="highValueDrop">${msg} ${zuksTableDrop[0]}</p>`

            } else {

                dropMsg += `<p>${msg} ${zuksTableDrop[0]}</p>`
            
            }

            dataRecord.items.push({
                dropAmount: zuksTableDrop[1][0],
                dropValue: zuksTableDrop[1][1],
                drop: zuksTableDrop[1][2]
            })

        }
        
        dropMsg += `<p>Total Coins: ${totalCoins.toLocaleString()}</p></div>`

        dropLogOutput.innerHTML += dropMsg;

        dataLog.push(dataRecord)

    }

    //console.log(dataLog);

    printDataLog(dataLog);

}

function rollDrop(dropTable){

    const dropDenom = getDropDenom(dropTable);

    const randNum = Math.floor(Math.random()*dropDenom);

    let counter = 0;
    let dropFocus = 0;
    while(counter <= dropDenom){

        if(counter > randNum){

            let drop = dropTable[dropFocus-1];

            // check to see if we get a ekZekkil piece, so we can then try to spread the pieces out as per the drop rule
            if(dropTable[1].name == "Obsidian blade" && drop.name != "Nothing"){

                drop = checkEkZekkilPieces(dropTable,drop)

            }

            let dropAmount = rollAmount(drop.quantity);
            let dropValue = (drop.price/drop.quantity.low)*dropAmount;

            let result = `${dropAmount} x ${drop.name} (${dropValue.toLocaleString()} x coins)`

            totalCoins += dropValue;

            return [result,[dropAmount,dropValue,drop]];

        } else {

            counter += dropTable[dropFocus].rarity;
            dropFocus++;

        }

    }

}

function getDropDenom(dropTable){

    let sum = 0;

    dropTable.forEach(record => {

        sum += Number(record.rarity)

    });

    return sum;

}

function rollAmount(recordQty){

    const randNum = Math.floor(Math.random()*(recordQty.high - recordQty.low + (recordQty.low == recordQty.high ? 0 : 1)))+(recordQty.low);

    return randNum;

}

function checkSimilar(recordQty){

    let result = "";

    if(recordQty.low == recordQty.high){

        result += recordQty.low;

    } else {

        result += recordQty.low + "-" + recordQty.high;

    }

    return result;

}

// check to see EkZekkil Pieces are spread correctly
function checkEkZekkilPieces(dropTable,drop){

    const indexElem = dropTable.indexOf(drop)
    let consistencyFlag = true;
    let newDrop = drop;

    for(let i=0; i<ekZekkilPieces.length; i++){

        if(ekZekkilPieces[indexElem-1] < ekZekkilPieces[i]){

            consistencyFlag = false;
            ekZekkilPieces[indexElem-1] += 1;
            break;

        } else if(ekZekkilPieces[indexElem-1] > ekZekkilPieces[i]) {

            consistencyFlag = false;
            ekZekkilPieces[i] += 1;
            newDrop = dropTable[i+1]
            break;

        }

    }

    if(consistencyFlag == true){

        ekZekkilPieces[indexElem-1] += 1;

    }

    return newDrop;

}

// events

function hardmodeToggle(e){

    if(e.target.checked === true){

        hardmode = true;

    } else if(e.target.checked === false){

        hardmode = false;
 
    }

}

function simulateClickEvent(e){

    let killInput = Number(document.getElementById("kill-input").value);

    if(validateInput(killInput) === false){

        alert("Please enter a value from 1 to 1000 inclusive");
        document.getElementById("kill-input").value = 100;
        return;

    }

    dropSimulation(killInput);

    document.getElementById("output-buttons").style.display = "block";
    document.getElementById("dropLog-output").style.display = "block";
    document.getElementById("dataLog-output").style.display = "none";

}

function openDropLog(e){

    document.getElementById("dataLog-output").style.display = "none";
    document.getElementById("dropLog-output").style.display = "block";

}

function openDataLog(e){

    document.getElementById("dataLog-output").style.display = "block";
    document.getElementById("dropLog-output").style.display = "none";

}

// drop log manipulation

function printDataLog(log){

    let dataContent = document.getElementById("dataLog-content");

    dataContent.innerHTML = ``;

    for(let i=0; i<log.length; i++){

        let records = log[i]

        let tempBuilder = ``;

        for(let j=0; j<records.items.length; j++){

            let record = records.items[j]

            let tempContent = `<div>${records.kill}</div>`;

            if(record.dropValue >= 100000000){

                tempContent += `<div class="highValueDrop">${record.drop.name}</div>`

            } else {

                tempContent += `<div>${record.drop.name}</div>`

            }
                               
            tempContent += `<div>${record.dropAmount}</div>
                               <div>${record.dropValue.toLocaleString()}</div>`

            tempBuilder += `<div class="dataRecord">${tempContent}</div>`

        }

        dataContent.innerHTML += `${tempBuilder}`

    }

}

// disclaimer

function showDisclaimer(){

    alert("This is under construction 🚧")

}

// input validation

function validateInput(input){

    if(input > 0 && input <= 1000){

        return true;

    } else {

        return false;

    }

}