    let diamondSequenceRow = [5, 2, 1, 7, 6, 3, 0, 4];
    let diamondSequenceCol = [0, 1, 2, 3, 4, 5, 6, 7];
    let classMemory = {};
    let element = document.getElementById('board');
    for (let i = 0; i < 8; i++) {
        let index = diamondSequenceRow.indexOf(i);
        let row = document.createElement("div");
        row.setAttribute('class', 'row');
        for (let j = 0; j < 8; j++) {
            let cell = document.createElement("div");
            cell.setAttribute('class', 'cell');
            cell.setAttribute('x', i);
            cell.setAttribute('y', j);
            if (diamondSequenceCol[index] == j) {
                cell.classList.add("diamond");
            }
            cell.onclick = function() {
                this.style.backgroundSize = 'contain';
                if (this.className.split(" ").indexOf('diamond') == -1) {
                    let min = Infinity,
                        final = { hor: Infinity, ver: Infinity };
                    for (let i = 0; i < 8; i++) {
                        let hor = diamondSequenceRow[i] - parseInt(this.getAttribute('x'));
                        let ver = diamondSequenceCol[i] - parseInt(this.getAttribute('y'));
                        let sum = (hor * hor) + (ver * ver);
                        if (parseInt(Math.sqrt(sum) * 1000) < min) {
                            final.hor = diamondSequenceRow[i];
                            final.ver = diamondSequenceCol[i];
                            min = (Math.sqrt(sum) * 1000);
                        }
                    }
                    let quadrant = {
                        x: final.hor - parseInt(this.getAttribute('x')),
                        y: final.ver - parseInt(this.getAttribute('y'))
                    }

                    let angle = Math.abs(Math.atan(final.hor - parseInt(this.getAttribute('x'))) / (final.ver - parseInt(this.getAttribute('y')))) * 180 / Math.PI;

                    if (quadrant.x > 0 && quadrant.y > 0) {
                        angle = angle;
                    } else if (quadrant.x > 0 && quadrant.y < 0) {
                        angle += 90;
                    } else if (quadrant.x < 0 && quadrant.y > 0) {
                        angle += 270;
                    } else if (quadrant.x < 0 && quadrant.y < 0) {
                        angle += 180;
                    } else {
                        if (quadrant.y == -1) {
                            angle = 180;
                        } else if (quadrant.y == 1) {
                            angle = 0;
                        } else if (quadrant.x == -1) {
                            angle = 270;
                        } else if (quadrant.x == 1) {
                            angle = 90;
                        }
                    }
                    this.className = "cell arrow";
                    this.style.transform = `rotate(${parseInt(angle)}deg)`;
                }

            };
            row.appendChild(cell);
        }
        element.appendChild(row);
    };

    global.save = function() {
        let element = document.querySelectorAll('[x]');
        Object.keys(element).map((item) => {
            classMemory[`${parseInt(element[item].getAttribute('x'))},${parseInt(element[item].getAttribute('y'))}`] = { class: element[item].className, backgroundSize: element[item].style.backgroundSize ,transform: element[item].style.transform};
        });
        localStorage.setItem("Diamond-Sweeper-Memory", JSON.stringify(classMemory));
        alert('Your game progress is saved !!!')
    }

    global.undo = function() {
    	classMemory = JSON.parse(localStorage.getItem("Diamond-Sweeper-Memory"));
        Object.keys(classMemory).map((item) => {
            let placement = item.split(',');
            let curr = document.querySelectorAll(`div[x="${placement[0]}"][y="${placement[1]}"]`);
            curr[0].className = classMemory[item].class;
            curr[0].style.backgroundSize = classMemory[item].backgroundSize;
            curr[0].style.transform = classMemory[item].transform;
        });
    }

    global.done = function() {
        let element = document.querySelectorAll('[x]');
        alert(`Your Score is : ${Object.keys(element).reduce((count,item)=>{
        if(element[item].className === 'cell' || element[item].className === 'cell diamond') count++;
        return count;},0)}`)
        return;
    }

