//wrap all the code in a self-executing function so we will have no global variable
//this will keep the variables private

(function(){
    //object for players
    let player = {marker: "X", winner: ""};

    //cache DOM
    const gbCache = document.querySelector("#gameboard");
    const r1c1Cache = document.querySelector("#r1c1");
    const r1c2Cache = document.querySelector("#r1c2");
    const r1c3Cache = document.querySelector("#r1c3");
    const r2c1Cache = document.querySelector("#r2c1");
    const r2c2Cache = document.querySelector("#r2c2");
    const r2c3Cache = document.querySelector("#r2c3");
    const r3c1Cache = document.querySelector("#r3c1");
    const r3c2Cache = document.querySelector("#r3c2");
    const r3c3Cache = document.querySelector("#r3c3");
    const ruSureDialog = document.querySelector("#ru-sure-dialog");
    const restartBtn = document.querySelector("#restart-btn");
    const ruSureBtnNo = document.querySelector("#ru-sure-btn-no");
    const ruSureBtnYes = document.querySelector("#ru-sure-btn-yes");
    const infoScreen = document.querySelector("#info-screen");

    //game status
    let gameOver = false;

    //object for gameboard r=row c=column
    let gameBoard = {
        r1c1: "", r1c2: "", r1c3: "",
        r2c1: "", r2c2: "", r2c3: "",
        r3c1: "", r3c2: "", r3c3: "",
        
        //rows and columns and diagonals
        r1: function() {return this.r1c1 + this.r1c2 + this.r1c3},
        r2: function() {return this.r2c1 + this.r2c2 + this.r2c3},
        r3: function() {return this.r3c1 + this.r3c2 + this.r3c3},
        c1: function() {return this.r1c1 + this.r2c1 + this.r3c1},
        c2: function() {return this.r1c2 + this.r2c2 + this.r3c2},
        c3: function() {return this.r1c3 + this.r2c3 + this.r3c3},
        d1: function() {return this.r1c1 + this.r2c2 + this.r3c3},
        d2: function() {return this.r3c1 + this.r2c2 + this.r1c3},
        wholeBoard: function() {return this.r1c1 + this.r1c2 + this.r1c3 +
                                       this.r2c1 + this.r2c2 + this.r2c3 + 
                                       this.r3c1 + this.r3c2 + this.r3c3},

        _playTurn: function() {
            //concatenate wholeboard = all nine cells
            let allEntries = this.wholeBoard();
            //use this to count number X and number of O to see whose turn it is to play
            let countX = allEntries.match(/X/g);
            let countO = allEntries.match(/O/g);
            //if countX gt countY then it is countY turn to play
            if      (countX  == null && countO == null) player.marker = "X";
            else if (countX !== null && countO == null) player.marker = "O";
            else if (countX.length > countO.length) player.marker = "O";
            else player.marker = "X";

            infoScreen.textContent = "Player " + player.marker + "'s turn";
        },

        _getData: function(cellID) {
            if      (cellID == "r1c1" && this.r1c1 == "") this.r1c1 = player.marker;
            else if (cellID == "r1c2" && this.r1c2 == "") this.r1c2 = player.marker;
            else if (cellID == "r1c3" && this.r1c3 == "") this.r1c3 = player.marker;
            else if (cellID == "r2c1" && this.r2c1 == "") this.r2c1 = player.marker;
            else if (cellID == "r2c2" && this.r2c2 == "") this.r2c2 = player.marker;
            else if (cellID == "r2c3" && this.r2c3 == "") this.r2c3 = player.marker;
            else if (cellID == "r3c1" && this.r3c1 == "") this.r3c1 = player.marker;
            else if (cellID == "r3c2" && this.r3c2 == "") this.r3c2 = player.marker;
            else if (cellID == "r3c3" && this.r3c3 == "") this.r3c3 = player.marker;
        },

        //get boarddata
        _render: function() {
            r1c1Cache.textContent = this.r1c1;
            r1c2Cache.textContent = this.r1c2;
            r1c3Cache.textContent = this.r1c3;
            r2c1Cache.textContent = this.r2c1;
            r2c2Cache.textContent = this.r2c2;
            r2c3Cache.textContent = this.r2c3;
            r3c1Cache.textContent = this.r3c1;
            r3c2Cache.textContent = this.r3c2;
            r3c3Cache.textContent = this.r3c3;
        },

        //check for winner
        _chkWinner: function() {
            let r1 = this.r1();
            let r2 = this.r2();
            let r3 = this.r3();
            let c1 = this.c1();
            let c2 = this.c2();
            let c3 = this.c3();
            let d1 = this.d1();
            let d2 = this.d2();

            let winnr = false;
            let winnxString = "None";
            let winnxPlayer = "None";
            let winnxRowCol = "None";

            if      (r1 == "XXX" || r1 == "OOO") {winnxString = r1; winnxRowCol = "r1";}
            else if (r2 == "XXX" || r2 == "OOO") {winnxString = r2; winnxRowCol = "r2";}
            else if (r3 == "XXX" || r3 == "OOO") {winnxString = r3; winnxRowCol = "r3";}
            else if (c1 == "XXX" || c1 == "OOO") {winnxString = c1; winnxRowCol = "c1";}
            else if (c2 == "XXX" || c2 == "OOO") {winnxString = c2; winnxRowCol = "c2";}     
            else if (c3 == "XXX" || c3 == "OOO") {winnxString = c3; winnxRowCol = "c3";}
            else if (d1 == "XXX" || d1 == "OOO") {winnxString = d1; winnxRowCol = "d1";}
            else if (d2 == "XXX" || d2 == "OOO") {winnxString = d2; winnxRowCol = "d2";}

            if (winnxString !== "None") {
                winnr = true;
                winnxPlayer = winnxString.charAt(0);
            }

            return {winnr, winnxPlayer, winnxRowCol};
        },

        _reset: function() {
            this.r1c1 = "";
            this.r1c2 = "";
            this.r1c3 = "";
            this.r2c1 = "";
            this.r2c2 = "";
            this.r2c3 = "";
            this.r3c1 = "";
            this.r3c2 = "";
            this.r3c3 = "";
            player.marker = "X";
            player.winner = "";
            gameOver = false;
        }
    };

    //button opens a modal dialog
    restartBtn.addEventListener("click", () => {
        ruSureDialog.showModal();
    });

    //Form cancel button closes the dialog box
    ruSureBtnNo.addEventListener("click", () => {
        ruSureDialog.close();
    });

    //Form cancel button closes the dialog box
    ruSureBtnYes.addEventListener("click", () => {
        gameBoard._reset();
        gameBoard._render();
        infoScreen.textContent = "Player X to start";

        infoScreen.classList.remove("redText");
        infoScreen.classList.remove("blueText");

        r1c1Cache.classList.remove("redText");
        r1c2Cache.classList.remove("redText");
        r1c3Cache.classList.remove("redText");
        r2c1Cache.classList.remove("redText");
        r2c2Cache.classList.remove("redText");
        r2c3Cache.classList.remove("redText");
        r3c1Cache.classList.remove("redText");
        r3c2Cache.classList.remove("redText");
        r3c3Cache.classList.remove("redText");
        
        r1c1Cache.classList.remove("blueText");
        r1c2Cache.classList.remove("blueText");
        r1c3Cache.classList.remove("blueText");
        r2c1Cache.classList.remove("blueText");
        r2c2Cache.classList.remove("blueText");
        r2c3Cache.classList.remove("blueText");
        r3c1Cache.classList.remove("blueText");
        r3c2Cache.classList.remove("blueText");
        r3c3Cache.classList.remove("blueText");

        ruSureDialog.close();
    });

    //**game play**
    //Listen for clicks on gameboard by players
    gbCache.addEventListener("click", (event) => {
        if (gameOver === false) {
            //determines whose turn it is to play
            gameBoard._playTurn();
            let cellID = event.target.id;
            //console.log("Player " + player.marker + " does " + cellID);
            gameBoard._getData(cellID);
            gameBoard._render();

            //determines whose turn it is to play after the click to handover
            gameBoard._playTurn();
            colorPlayerTurn();

           //check for winner
            //gameBoard._chkWinner();
            if (gameBoard._chkWinner().winnr === true) {
                infoScreen.textContent = "Winner is " + gameBoard._chkWinner().winnxPlayer;
                colorWinnxRow(gameBoard._chkWinner().winnxRowCol, gameBoard._chkWinner().winnxPlayer);
                gameOver = true;
            }
            else if (gameBoard.wholeBoard().length == 9) {
                //console.log("The Board is full - Its DRAW game!");
                infoScreen.textContent = "Game Over - It's a Draw!";
                gameOver = true;
            };
        }

        function colorWinnxRow(wxLine, wxPlayer) {
            let txtColor;

            if (wxPlayer == "X") {
                infoScreen.classList.add("redText");
                infoScreen.classList.remove("blueText");
                txtColor = "redText";
            }
            else if (wxPlayer == "O") {
                infoScreen.classList.add("blueText");
                infoScreen.classList.remove("redText");
                txtColor = "blueText";
            }

            if (wxLine == "r1") {
                r1c1Cache.classList.add(txtColor);
                r1c2Cache.classList.add(txtColor);
                r1c3Cache.classList.add(txtColor);
            }
            else if (wxLine == "r2") {
                r2c1Cache.classList.add(txtColor);
                r2c2Cache.classList.add(txtColor);
                r2c3Cache.classList.add(txtColor);
            }
            else if (wxLine == "r3") {
                r3c1Cache.classList.add(txtColor);
                r3c2Cache.classList.add(txtColor);
                r3c3Cache.classList.add(txtColor);
            }
            else if (wxLine == "c1") {
                r1c1Cache.classList.add(txtColor);
                r2c1Cache.classList.add(txtColor);
                r3c1Cache.classList.add(txtColor);
            }
            else if (wxLine == "c2") {
                r1c2Cache.classList.add(txtColor);
                r2c2Cache.classList.add(txtColor);
                r3c2Cache.classList.add(txtColor);
            }
            else if (wxLine == "c3") {
                r1c3Cache.classList.add(txtColor);
                r2c3Cache.classList.add(txtColor);
                r3c3Cache.classList.add(txtColor);
            }
            else if (wxLine == "d1") {
                r1c1Cache.classList.add(txtColor);
                r2c2Cache.classList.add(txtColor);
                r3c3Cache.classList.add(txtColor);
            }
            else if (wxLine == "d2") {
                r3c1Cache.classList.add(txtColor);
                r2c2Cache.classList.add(txtColor);
                r1c3Cache.classList.add(txtColor);
            }

        }

        function colorPlayerTurn() {
            if (player.marker == "X") {
                infoScreen.classList.add("redText");
                infoScreen.classList.remove("blueText");
            }
            else if (player.marker == "O") {
                infoScreen.classList.add("blueText");
                infoScreen.classList.remove("redText");
            }
        }
    });

})();