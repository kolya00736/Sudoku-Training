const SECONDS = 30; const SCORE = 500;

const time = document.getElementById('time');
const score = document.getElementById('score');
const table = document.getElementById('board');
const buttons = document.getElementById('buttons');

let timer, seconds, scoreValue;
let hiddenCount, answerCount;

function newGame(difficulty) {
    seconds = SECONDS;
    scoreValue = 0;
    hiddenCount = difficulty;

    document.getElementById('info').hidden = true;
    buttons.hidden = true;

    time.innerText = "Времени осталось - 00:" + seconds;
    score.innerText = "Набрано очков - 0/" + SCORE;
    time.hidden = false;
    score.hidden = false;

    timer = setInterval(startTimer, 1000);

    createTable();
}

function startTimer() {
    seconds--;

    if (seconds === 0)
        gameEnd("К сожалению время вышло. Вы набрали " + scoreValue + " очков");
    else
        time.innerText = "Времени осталось - " + new Date(seconds * 1000).toISOString().substring(14, 19);

    // if (seconds === 5)
    //     time.style.color = "#bf0000";
    // else if (seconds === 4)
    //     time.style.color = "#5c0101";
    // else if (seconds === 3)
    //     time.style.color = "#850000";
    // else if (seconds === 2)
    //     time.style.color = "#e30202";
    // else if (seconds === 1)
    //     time.style.color = "#FF0000";
}

function createTable() {
    table.innerHTML = "";
    table.hidden = false;

    let hidden = getRndNumbers();
    let digits = getShuffledArray();
    let index = 0;

    for (let i = 0; i < 3; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 3; j++) {
            let cell = document.createElement("td");
            cell.id = digits[index];
            
            let isHide = true;

            hidden.forEach(function(num) {
                if (num === digits[index]) isHide = false;
            });
            
            if (isHide) 
                cell.innerText = digits[index];
            else
                cell.innerText = "";
            
            // if (num === digits[index]) {
            //     console.log(num, " vs ", digits[index]);
            //     cell.innerText = "";
            // } else {
            //     cell.innerText = digits[index];
            // }

            row.append(cell);
            index++;
        }

        table.append(row);
    }

    answerCount = 0;
}

function getRndNumbers() {
    let numbers = [];
    for (let i = 0; i < hiddenCount; i++) {
        while (!numbers[i]) {
            let num = Math.round(0.5 + Math.random() * 9);
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
    }

    console.log(numbers); 
    return numbers;
}

function getShuffledArray() {
    let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = digits.length - 1; i > 0; i--) {
        let num = Math.floor(Math.random() * (i + 1));
        let tmp = digits[num];
        digits[num] = digits[i];
        digits[i] = tmp;
    }
    return digits;
}

function scoreUpdate(value) {
    scoreValue += value;
    score.innerText = "Набрано очков - " + scoreValue + "/" + SCORE;
}

function gameEnd(text) {
    clearInterval(timer);
    
    table.innerHTML = "";
    table.hidden = true;
    score.hidden = true;
    buttons.hidden = false;
    time.innerText = text;
}

document.onkeydown = function(e) {
    if (e.key >= 1 && e.key <= 9) {

        if (!table.innerHTML) return;
        let element = document.getElementById(e.key);

        if (element.innerText == e.key) {
            if (!element.classList.contains("wrong")) {
                element.classList.add("wrong");
                scoreUpdate(-10);
            }
        } else {
            element.classList.add("correct");
            element.innerText = e.key;
            answerCount++;
			scoreUpdate(100);
			
            if (answerCount === hiddenCount) {
                if (scoreValue >= SCORE)
                    setTimeout(function() {
                        gameEnd("Ура! Вы набрали " + scoreValue + " очков");
                    }, 500);
                else
                    setTimeout(createTable, 500);
            }
        }

        // for (let i = 0, row; row = table.rows[i]; i++) {
        //     for (let j = 0, cell; cell = row.cells[j]; j++) {
        //         if (cell.innerText === "") {
        //             if (cell.id === e.key) {
        //                 cell.classList.add("correct");
        //                 cell.innerText = e.key;

        //                 answerCount++;

        //                 if (answerCount === hiddenCount) {
        //                     scoreUpdate(100);
        //                     setTimeout(fillTable, 500);
        //                 }

        //             } else {
        //                 let clickedElem = document.getElementById(e.key);
        //                 if (!clickedElem.classList.contains("exists")) {
        //                     clickedElem.classList.add("exists");
        //                     scoreUpdate(-10);
        //                 }
        //             }
        //         }
        //     }
        // }
    }
}