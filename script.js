const character = document.getElementById('character');
const gameContainer = document.getElementById('game-container');
const obstacles = document.getElementsByClassName('obstacle');
const step = 10;

document.addEventListener('keydown', (event) => {
    let top = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
    let left = parseInt(window.getComputedStyle(character).getPropertyValue('left'));

    switch (event.key) {
        case 'ArrowUp':
            if (top > 0) character.style.top = `${top - step}px`;
            break;
        case 'ArrowDown':
            if (top < (gameContainer.clientHeight - character.clientHeight)) character.style.top = `${top + step}px`;
            break;
        case 'ArrowLeft':
            if (left > 0) character.style.left = `${left - step}px`;
            break;
        case 'ArrowRight':
            if (left < (gameContainer.clientWidth - character.clientWidth)) character.style.left = `${left + step}px`;
            break;
    }
});

function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

setInterval(() => {
    for (let obstacle of obstacles) {
        if (isColliding(character, obstacle)) {
            alert('Game Over!');
            character.style.top = '450px';
            character.style.left = '10px';
        }
    }
}, 100);
