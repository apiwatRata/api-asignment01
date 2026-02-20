module.exports = {
    randomInt:   (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomNumber:   (min, max) => {
        return Math.random() * ((max) - (min) + 1) + (min);
    },

    sleep: (ms) =>{
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}