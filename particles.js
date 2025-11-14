import { checkBounds, moveParticle, getParticle, setParticle } from "./canvas.js";
import { getRandomInt } from "./util.js";

/**
 * Base particle class
 */
class Particle {
    constructor() {
        this.color = "";
        this.type = "";
    }

    /**
     * Returns true if the particle should swap with other when trying
     * to move onto the same grid location as {@link other}.
     * 
     * EX: Let sand sink below water
     * 
     * @param {Particle} other 
     * @returns {boolean} Should the particle swap
     */
    swap(other) {
        return false;
    }

    /**
     * Update the particle at location (row, col)
     * 
     * @param {number} row 
     * @param {number} col 
     */
    update(row, col) {

    }
}

/**
 * Sand particle
 */
export class Sand extends Particle {
    constructor() {
        super();
        this.color = "orange";
        this.type = "sand";
    }

    swap(other) {
        return other.type === "Water";
    }

    update(row, col) {
        // Fall due to gravity
        let newRow = row + 1;

        // If nothing below move down
        if (!moveParticle(row, col, newRow, col, this.swap)) {
            if (Math.random() * 2 >= 1){
                if (Math.random() * 2 >= 1){
                  moveParticle(row, col, newRow, col-1, this.swap);
                } else{
                  moveParticle(row, col, newRow, col-2, this.swap);  
                }
            } else{
                 if (Math.random() * 2 >= 1){
                  moveParticle(row, col, newRow, col+1, this.swap);
                } else{
                  moveParticle(row, col, newRow, col+2, this.swap);  
                }
            }
        }
    }
}

export class Water extends Particle{

    constructor(){
        super();
        this.color = "blue";
        this.type = "Water";
    }

    swap(other){
        
    }

    update(row, col) {

        // Try to move down
        if (getRandomInt(0, 2) && !getParticle(row+1, col)) {
            moveParticle(row, col, row+1, col, super.swap);
        } 
        
        // Move left or right
        if (getRandomInt(0, 1) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, super.swap);
        }
        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, super.swap);
        }
    }

}

export class Stone extends Particle{

    constructor(){
        super();
        this.color = "grey";
        this.type = "Stone";
    }

};

export class Dirt extends Particle{

    constructor(){
        super();
        this.color = "saddlebrown";
        this.type = "Dirt";
    }

    swap(other){
        return other.type === "Water";
    }


    update(row, col) {
        // Fall due to gravity
        let newRow = row + 1;

        // If nothing below move down
        if (!moveParticle(row, col, newRow, col, this.swap)) {
            if (Math.random() * 2 >= 1){
                moveParticle(row, col, newRow, col-1, this.swap);
            } else{
                moveParticle(row, col, newRow, col+1, this.swap);
            }
        }

        let swapped = false;
        let smothered = false;

        let newParticle = getParticle(row - 1, col);
        if (newParticle){
            this.color = "saddlebrown";
            smothered = true;
        }

        for (let i = -3; i < 4; i++){
            let particle = getParticle(row, col + i);
            if (particle){
                if (particle.type === "Water" && !smothered){
                    this.color = "green";
                    swapped = true;
                    break;
                }
            }
        }

        for (let i = -1; i < 2; i++){
            let particle = getParticle(row + i, col - 1);
            if (particle){
                if (particle.color === "green" && !smothered){
                    this.color = "green";
                    swapped = true;
                    break;
                }
            }
            particle = getParticle(row + i, col + 1);
            if (particle){
                if (particle.color === "green" && !smothered){
                    this.color = "green";
                    swapped = true;
                    break;
                }
            }
        }

        if (!swapped){
            this.color = "saddlebrown";
        }
    }
};

/**
 * Create particle based on dropdown name
 * 
 * @param {string} value 
 * @returns 
 */
export function checkParticleType(value) {
    if (value == "Sand") {
        return new Sand();
    } 

    if (value == "Water") {
        return new Water();
    }

    if (value === "Stone"){
        return new Stone();
    }

    if (value === "Dirt"){
        return new Dirt();
    }
}