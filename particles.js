import { checkBounds, moveParticle, getParticle, setParticle, getTemp } from "./canvas.js";
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

        let nearbyParticle = getParticle(row - 1, col);
        if (nearbyParticle){
            if (nearbyParticle.type == "Lava"){
                let thisParticle = new Steam();
                setParticle(row,col,thisParticle);
            }
        }
        nearbyParticle = getParticle(row + 1, col);
        if (nearbyParticle){
            if (nearbyParticle.type == "Lava"){
                let thisParticle = new Steam();
                setParticle(row,col,thisParticle);
            }
        }
        nearbyParticle = getParticle(row, col + 1);
        if (nearbyParticle){
            if (nearbyParticle.type == "Lava"){
                let thisParticle = new Steam();
                setParticle(row,col,thisParticle);
            }
        }
        nearbyParticle = getParticle(row, col - 1);
        if (nearbyParticle){
            if (nearbyParticle.type == "Lava"){
                let thisParticle = new Steam();
                setParticle(row,col,thisParticle);
            }
        }

        let temp = getTemp();
        if (temp == 0){
            if (!getRandomInt(0,25)){
                let newParticle = new Snow();
                setParticle(row,col,newParticle);
            }
        } else{
            if (!getRandomInt(0,100100-(1000 * temp))){
                let newParticle = new Steam();
                setParticle(row,col,newParticle);
            }
        }

        if (!getRandomInt(0,1000) && !getParticle(row - 1, col)){
            let particle = new Steam();
            setParticle(row,col,particle);
        }

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

        let swapped = false;

        // If nothing below move down
        if (!moveParticle(row, col, newRow, col, this.swap)) {
            if (Math.random() * 2 >= 1){
                moveParticle(row, col, newRow, col-1, this.swap);
            } else{
                moveParticle(row, col, newRow, col+1, this.swap);
            }
        }

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
                if (particle.color === "green" && !smothered && this.color !== "tan"){
                    this.color = "green";
                    swapped = true;
                    break;
                }
            }
            particle = getParticle(row + i, col + 1);
            if (particle){
                if (particle.color === "green" && !smothered && this.color !== "tan"){
                    this.color = "green";
                    swapped = true;
                    break;
                }
            }
        }

        let temp = getTemp();
        if (temp > 45){
            if (!getRandomInt(0,(550-(temp*5))) && !getParticle(row - 1, col)){
                this.color = "tan";
                swapped = true;
            }
        } else{
           if (!getRandomInt(0,200) && this.color === "tan"){
                this.color = "saddlebrown";
                swapped = false;
            } 
        }

        if (!swapped && this.color !== "tan"){
            this.color = "saddlebrown";
        }
    }
};

export class Steam extends Particle{

    constructor(){
        super();
        this.type = "Steam";
        this.color = "gainsboro";
    }

    swap(other){
        return other.type === "water"; 
    }

    update(row,col){

    //changes trapped steam back into water
    let particle = getParticle(row - 1, col);
    if (particle){
        if (particle.type === "Water"){
            particle = new Water();
            setParticle(row,col,particle);
        }
    }

    let trapped = true
    //changes an occassional cloud steam back into water (rain)
    for (let i = -1; i < 2; i++){
        let particle = getParticle(row + i, col - 1);
        if (particle){
            if (particle.type !== "Steam"){
                trapped = false;
                break;
            }
        } else{
            trapped = false;
        }
        particle = getParticle(row + i, col + 1);
        if (particle){
            if (particle.type !== "Steam"){
                trapped = false;
                break;
            }
        } else{
            trapped = false;
        }
    }

    if (trapped && !getRandomInt(0,50 + temp) && !getParticle(row + 1, col)){
        let temp = getTemp();
        if (temp > 0){
            let newParticle = new Water();
            setParticle(row,col,newParticle);
        } else{
            let newParticle = new Snow();
            setParticle(row,col,newParticle);
        }
    }

    // Try to move down
    if (getRandomInt(0, 2) && !getParticle(row-1, col)) {
        moveParticle(row, col, row-1, col, super.swap);
    } 
        
    // Move left or right
    if (getRandomInt(0, 1) && !getParticle(row, col+1)) {
        moveParticle(row, col, row, col+1, super.swap);
    }
    else if (!getParticle(row, col-1)) {
        moveParticle(row, col, row, col-1, super.swap);
    }

    }
};

export class Snow extends Particle{

    constructor(){
        super();
        this.color = "lightblue";
        this.type = "Snow";
    }

    swap(other){

    }

    update(row,col){

        let temp = getTemp();
        if (temp > 0){
            if (!getRandomInt(0,25)){
                let newParticle = new Water();
                setParticle(row,col,newParticle);
            }
        }

        if (!getRandomInt(0,4)){
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

};

export class Lava extends Particle{

    constructor(){
        super();
        if (getRandomInt(0,1)){
            this.color = "coral";
        } else{
            this.color = "red";
        }
        this.type = "Lava";
    }

    swap(other){
        return other.type === "Lava" || other.type === "Steam";
    }

    update(row,col){

        if (!getRandomInt(0,15)){
            if (this.color === "red"){
                this.color = "coral";
            } else{
                this.color = "red";
            }
        }

        let temp = getTemp();
        if (temp < 5){
            if (!getRandomInt(0,20)){
                let newParticle = new Obsidian();
                setParticle(row,col,newParticle);
            }
        }

        if (!getRandomInt(0,10000) && temp != 100){
            let particle = new Obsidian();
            setParticle(row,col,particle);
        }

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

};

export class Obsidian extends Stone{
    
    constructor(){
        super();
        this.color = "black";
        this.type = "Obsidian";
    }

    update(row,col){
        let temp = getTemp();
        if (temp == 100){
            let newParticle = new Lava();
            setParticle(row,col,newParticle);
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

    if (value === "Steam"){
        return new Steam();
    }

    if (value === "Snow"){
        return new Snow();
    }

    if (value === "Erase"){
        return null;
    }

    if (value === "Lava"){
        return new Lava();
    }

    if (value === "Obsidian"){
        return new Obsidian();
    }
}