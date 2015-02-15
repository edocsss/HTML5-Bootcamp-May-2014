(function() {
    
    //Global variable declaration
    var ROWS = 6;
    var COLS = 7;
    var ROW_HEIGHT = 90;
    var COL_WIDTH = 90;
    
    //To set and change the color of a particular piece
    var styleMap = {
        0: "unset",
        1: "player1",
        2: "player2"
    };
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
/* Piece object and prototypes block */
    
    //Creating an object of each piece of circle
    function Piece (row, col, parentEl, game) {
        this.row = row;
        this.col = col;
        this.game = game;
        this.player = 0; //default player; this.player defines who owns a particular piece
        
        //Creating the pieces -> no layout yet
        this.pieceEl = document.createElement('div');
        parentEl.appendChild(this.pieceEl);
        this.pieceEl.classList.add('piece');
        this.pieceEl.classList.add('unset');
        this.pieceEl.style.width = '76px';
        this.pieceEl.style.height = '76px';
        
        //Positioning the pieces onto the board
        var boardHeight = ROW_HEIGHT * ROWS;
        this.pieceEl.style.left = (this.col) * COL_WIDTH + 7 + "px";
        this.pieceEl.style.top = boardHeight - ((this.row + 1) * ROW_HEIGHT) + 7 + "px";
        this.pieceEl.innerHTML = this.row + ' ' + this.col;
        
        //Without "bind(this)", the clickedPiece function will not understand to whom "this" refers to!
        this.pieceEl.addEventListener('click', this.clickedPiece.bind(this));
    }
    
    
    //Use the Piece.prototype since we need to know the column and the row of that particular CLICKED piece
    Piece.prototype.clickedPiece = function (event) {
        console.log("Clicked", this.row, this.row);
        this.game.clickedColumn(this.col);
    };
    
    
    //Changing the owner of this particular piece -> the "just" clicked piece
    Piece.prototype.setPlayer = function (player) {
        this.player = player; //this sets the player of this particular "clicked" piece
        this.removeStyle();
        
        var style = styleMap[player];
        this.pieceEl.classList.add(style);
    };
    
    
    //Removing all styles in the 
    Piece.prototype.removeStyle = function () {
        for (var key in styleMap) {
            var style = styleMap[this.player];
            this.pieceEl.classList.remove(style);
        }
    };
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
/* Game object and prototypes block */
        
    //Main game function
    function Game(el) {
        this.activePlayer = 1;
        this.active = true;
        
        this.boardEl = document.createElement('div');
        this.boardEl.classList.add('board');
        el.appendChild(this.boardEl);
        
        this.messageEl = document.createElement('div');
        this.messageEl.classList.add('message');
        el.appendChild(this.messageEl);
        
        this.boardEl.style.width = COLS * COL_WIDTH + "px";
        this.boardEl.style.height = ROWS * ROW_HEIGHT + "px";
        
        this.setupBoard();
    }
    
    
    
    //Creating the board
    Game.prototype.setupBoard = function() {
        this.pieces = [];
        
        for (var row = 0; row < ROWS; row++) {
            this.pieces[row] = [];
            
            for (var col = 0; col < COLS; col++) {
                var piece = new Piece(row, col, this.boardEl, this);
                this.pieces[row][col] = piece;
            }
        }
    };
    
    
    //Use Game.prototype because we only need to change the 
    Game.prototype.clickedColumn = function (col) {
        //When a player wins, the active enabler will become false and the clicked column will not continue changing the piece color
        if (!this.active)
            return;
        
        //Keep looping until it finds an empty piece -> use RETURN
        for (var row = 0; row < ROWS; row++) {
            var piece = this.pieces[row][col];
            
            //piece.player === 0 means that the piece is not owned by any player yet -> therefore, it can be changed into a player's pieces
            if (piece.player === 0) {
                piece.setPlayer(this.activePlayer);
                this.checkWin(row, col, this.activePlayer);
                this.switchActivePlayer();
                return;
            }
        }
    };
    
    
    //Check whether a player wins
    Game.prototype.checkWin = function (checkRow, checkCol, player) {
        //checkRow & checkCol tell where the last piece clicked
        //Player = the current active player
        
        /*  
            How does it work?
            
            When a piece is clicked, this function will be run. It will first check for any 4 adjacent pieces with the same color vertically
            and horizontally.
            
            When it has finished checking the first two conditions, it will return whenever there are 4 adjacent pieces with the same color
            and write who wins in the HTML.
            
            The last condition is the diagonal winning condition. There are two ways to win -> diagonal diagonal upper right to lower left OR 
            upper left to lower right.
            
            The first checking is the left to right condition. 
            It checks the "just" clicked piece first. Then, it goes down to any pieces on the left down of the clicked piece and checks whether 
            it has the same color. If it is, then increments the counter. Otherwise, GO OUT FROM THAT LOOP!
            
            After that, it checks the up right piece (EXCLUDING THE CURRENT PIECE / THE JUST CLICKED PIECE -> AVOID DOUBLE COUNTING). If the upper
            right piece has the same color, increments the counter. Otherwise, GO OUT FROM THAT LOOP!
            
            Then, no player has won yet, it goes to the next condition -> the UPPER LEFT TO LOWER RIGHT.
            It checks with the same mechanism!
        */
        
        //Check vertical win condition
        var verStreak = 0;
        for (var row = 0; row < ROWS; row++) {
            var piece = this.pieces[row][checkCol];
            
            if (piece.player === player)
                verStreak++;
            else
                verStreak = 0;
            
            if (verStreak === 4) {
                this.messageEl.innerHTML = "Player " + player + " win!";
                this.active = false;
                return;
            }
        }
        
        //Check horizontal win condition
        var horStreak = 0;
        for (var col = 0; col < COLS; col++) {
            var piece = this.pieces[checkRow][col];
            
            if (piece.player === player)
                horStreak++;
            else
                horStreak = 0;
            
            if (horStreak === 4) {
                this.messageEl.innerHTML = "Player " + player + " win!";
                this.active = false;
                return;
            }
        }
        
        /* DIAGONAL CONDITION CHECKING STARTS HERE!! */
        
        //Check diagonal NE to SW condition
        var neswStreak = 0;
        for (var i = 0; checkRow - i >= 0 && checkCol - i >= 0; i++) {
            //Move down to the left to check the piece
            var piece = this.pieces[checkRow - i][checkCol - i]; 
            
            if (piece.player === player)
                neswStreak++;
            else
                break;
            
            if (neswStreak === 4) {
                this.messageEl.innerHTML = "Player " + player + " win!";
                this.active = false;
                return;
            }
        }
        
        //Check diagonal SW to NE condition
        for (var i = 1; checkRow + i < ROWS && checkCol + i < COLS; i++) {
            //Move up to the right to check the piece
            var piece = this.pieces[checkRow + i][checkCol + i];
            
            if (piece.player === player)
                neswStreak++;
            else
                break;
            
            console.log(neswStreak);
            if (neswStreak === 4) {
                this.messageEl.innerHTML = "Player " + player + " win!";
                this.active = false;
                return;
            }
        }
        
        //Check diagonal SE to NW condition
        var senwStreak = 0;
        for (var i = 0; checkRow - i >= 0 && checkCol + i < COLS; i++) {
            //Move down to the right
            var piece = this.pieces[checkRow - i][checkCol + i];
            
            if (piece.player === player)
                senwStreak++;
            else
                break;
            
            if (senwStreak === 4) {
                this.messageEl.innerHTML = "Player " + player + " win!";
                this.active = false;
                return;
            }
        }
        
        for (var i = 1; checkRow + i < ROWS && checkCol - i >= 0; i++) {
            //Move up to the left
            var piece = this.pieces[checkRow + i][checkCol - i];
            
            if (piece.player === player)
                senwStreak++;
            else
                break;
            
            if (senwStreak === 4) {
                this.messageEl.innerHTML = "Player " + player + " win!";
                this.active = false;
                return;
            }
        }
        
        /* DIAGONAL CONDITION CHECKING ENDS HERE!! */
        
    };
    
    
    //Switch the active player (change player turn), right after changing the piece owner
    Game.prototype.switchActivePlayer = function() {
        if (this.activePlayer  === 1) {
            this.activePlayer = 2;
        } 
        
        else if (this.activePlayer === 2) {
            this.activePlayer = 1;
        }
    };
    
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //Load the game when the window is ready
    window.addEventListener("DOMContentLoaded", function() {
        var containerEl = document.getElementById('game');
        new Game(containerEl);
    });  
}) ();