//wrap all the code in a self-executing function so we will have no global variable
//this will keep the variables private

(function(){
    //object for players
    let player1 = {playing: 1, winner: 0};
    let player2 = {playing: 0, winner: 0};

    //object for gameboard r=row c=column
    let gameBoard = {
        r1c1: "X", r1c2: "O", r1c3: "X",
        r2c1: "X", r2c2: "X", r2c3: "X",
        r3c1: "X", r3c2: "O", r3c3: "O",                 
    };

})();