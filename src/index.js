const pipesElement = document.getElementById('all-pipes');
const body = document.querySelector('body');
const skull = document.getElementById('character-img');
const score = document.getElementById('score');

let scoreValue;
if (!localStorage.getItem('highScore')) {
    localStorage.setItem('highScore', scoreValue);
}

let bodyKeyUp;
let bodyKeyDown;
    
/** @description Interval to make skull go down */
let skullGoingDown = setInterval(() => {
    manageSkullPosition(true);
}, 1);

/** @description Interval to make skull go up */
let skullGoingUp;

/** @description When space is clicked, the skull goes up */
bodyKeyDown = body.onkeydown = function(e) {
    if (e.code.toLowerCase() === 'space') {
        if (skullGoingDown) {
            clearInterval(skullGoingDown);
            skullGoingDown = 0;
        }

        if (!skullGoingUp) {
            skullGoingUp = setInterval(() => {
                manageSkullPosition(false);
            }, 1);
        }
    }
}

/** @description When space is release, the skull goes down */
bodyKeyUp = body.onkeyup = function(e) {
    if (e.code.toLowerCase() === 'space') {
        if (skullGoingUp) {
            clearInterval(skullGoingUp);
            skullGoingUp = 0;
        }

        if (!skullGoingDown) {
            skullGoingDown = setInterval(() => {
                manageSkullPosition(true);
            }, 1);
        }
    }
}

/**
 * @description Manages skull position going down or up
 * @param {boolean} goingDown true if it's going down, false if not
 */
const manageSkullPosition = function(goingDown) {
    const skullPosition = skull.style.bottom;
    const onlyNumber = Number(skullPosition.replace(/\D/g, ''));
    
    if (goingDown) {
        if (onlyNumber) {
            skull.style.bottom = `${onlyNumber - 1}px`;
            rotateSkull(45);
        }
        else
            rotateSkull(0);
    }
    else {
        if (onlyNumber < pipesElement.clientHeight - 62) {
            skull.style.bottom = `${onlyNumber + 1}px`;
            rotateSkull(-45);
        }
    }
}

/** 
 * @description Rotates the skull when going up or down
 * @param {number} deg Rotate degrees 
 */
const rotateSkull = function(deg) {
    skull.style.webkitTransform = `rotate(${deg}deg)`; 
    skull.style.mozTransform = `rotate(${deg}deg)`; 
    skull.style.msTransform = `rotate(${deg}deg)`; 
    skull.style.oTransform = `rotate(${deg}deg)`; 
    skull.style.transform = `rotate(${deg}deg)`;
}

/** @description Starts the game */
const game = function() {
    scoreValue = 0;
    score.value = 0;
    pipesElement.innerHTML = '';

    // Start values of pipes and skull
    pipesElement.style.right = '-2000px';
    skull.style.bottom = '0px';
    
    let pipesPosition = [];
    
    /** @description Get the body height of the up and down pipe */
    const getPipeBodyHeight = function() {
        let upperHeight = Math.floor(Math.random() * 90) + 1;
    
        if (upperHeight < 20)
            upperHeight = 20;
        else if(upperHeight > 70)
            upperHeight = 70;
    
        const downHeight = 100 - upperHeight;
    
        return { up: upperHeight, down: downHeight };
    }
    
    /** @description Makes the game move */
    const moveGame = setInterval(() => {
        let { right } = pipesElement.style;
        const isNegative = right.includes('-');
    
        right = right.replace(/\D/g, '');
        right = Number(right);
        if (isNegative)
            right = right - 1;
        else
            right = right + 1;
    
        pipesElement.style.right = `${isNegative ? '-' : ''}${right}px`;
        if (pipesPosition[0])
            checkColision();
    }, 1);
    
    /** @description Create a new pipe */
    const createPipe = setInterval(() => {
        if (pipesPosition.length < 10) {
            const { up, down } = getPipeBodyHeight();
        
            const newPipeHTML = `
                <div class="pipe-box">
                    <div class="up-pipe-box" style="height: calc(${up}% - 50px)">
                        <div class="pipe-body"></div>
                        <div class="pipe-head"></div>
                    </div>
                    <div class="down-pipe-box" style="height: calc(${down}% - 50px)">
                        <div class="pipe-head"></div>
                        <div class="pipe-body"></div>
                    </div>
                </div>`;
            pipesElement.insertAdjacentHTML('beforeend', newPipeHTML);
            
            pipesPosition.push({ up, down, elem: pipesElement.lastChild });
        }
    }, 1000);
    
    // The width between the pipes
    let betweenPipe = {
        start: 26,
        end: 126
    }

    /** @description Check if the skull colide with some pipe */
    const checkColision = function() {
        const { elem } = pipesPosition[0];
        const nextPipeHeight = elem.getBoundingClientRect();
    
        // Remove pipe colision validation from array
        const onlyNumberSkull = Number(skull.style.bottom.replace(/\D/g, ''));
    
        if (nextPipeHeight.x >= betweenPipe.start && nextPipeHeight.x <= betweenPipe.end) {

            // The area for the skull to fit between the up and down pipes
            const areaToFit = 110 - skull.clientHeight;
            // Game over condition
            if (onlyNumberSkull < elem.lastElementChild.clientHeight || 
                onlyNumberSkull > elem.lastElementChild.clientHeight + areaToFit) {
                // Clear intervals
                clearInterval(skullGoingDown);
                clearInterval(skullGoingUp);
                clearInterval(createPipe);
                clearInterval(moveGame);
                
                // Load retry message
                retryMessage();
            }
        }

        
        if (nextPipeHeight.x <= betweenPipe.start) {
            betweenPipe = {
                start: betweenPipe.start,
                end: betweenPipe.start + 100
            }
            score.value = ++scoreValue;
            pipesPosition.shift();
        }
    }
}

game();

const retryMessage = function() {
    if (Number(localStorage.getItem('highScore')) < scoreValue) {
        localStorage.setItem('highScore', scoreValue);
    } 
    const retryElement = `
        <h2>YOU ARE DEAD</h2>
        <button onClick="retry()">Tentar novamente?</button>
    `
    document.getElementById('retry').insertAdjacentHTML('beforeend', retryElement);
}

const retry = function() {
    document.getElementById('retry').innerHTML = '';
    game();
}

const audio = document.getElementById('audio');

const audiosSrc = [
    './assets/Slipknot - Spit It Out [OFFICIAL VIDEO].mp3',
    './assets/Slipknot - The Heretic Anthem (Audio).mp3',
    './assets/Slipknot - The Blister Exists (Audio).mp3'
]

/** @description Plays audio has played */
const playAudio = setInterval(() => {
    audio.play()
        .then(_ => clearInterval(playAudio))
}, 100);

audio.onended = function() {
    if(audiosSrc[0])
        audio.src= audiosSrc[0];
    audiosSrc.unshift()
    audio.play();
};