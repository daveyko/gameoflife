var gameOfLife = {

  width: 12,
  height: 12, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game
  createAndShowBoard: function () {

    // create <table> element
    var goltable = document.createElement("tbody");

    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },
  forEachCell: function (iteratorFunc) {
    var rowLength = this.width;
    var colLength = this.height;
    for(var row=0; row<rowLength; row++) {
      for(var col=0; col<colLength; col++) {
        var currentCell = document.getElementById(row + '-' + col)
        iteratorFunc(currentCell);
      }
    }
    /*
      All cells have <td data-status="dead" id="x-y"></td>
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */
  },

  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y"
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "click" events that allow a user to click on
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"

    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white

    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board

    var onCellClick = function (e) {
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?
      // how to set the style of the cell when it's clicked
      if (this.dataset.status === 'dead') {
        this.className = 'alive';
        this.dataset.status = 'alive';
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
      }
    };
    var iterator = function(cell) {
      cell.addEventListener('click', onCellClick);
    }
    this.forEachCell(iterator);
  },

  clear: function(){

    var thisvar = this;

    var toDead = function(cell){
      cell.className = 'dead';
      cell.dataset.status = 'dead';
    }

    var clearButton = document.getElementById('clear_btn');
    clearButton.addEventListener('click', function(){
      thisvar.forEachCell(toDead);
    })
  },


  random: function(){

    var thisvar = this;

    function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
    var toRand = function(cell){
      if (getRandomIntInclusive(0,1) === 0){

        cell.className = 'dead ';
        cell.dataset.status = 'dead';
      }
      else{

        cell.className = 'alive';
        cell.dataset.status = 'alive';
      }
    }
    var randButton = document.getElementById('reset_btn');
    randButton.addEventListener('click', function(){
      thisvar.forEachCell(toRand);
    })

  }
  ,
  step: function () {

    var thisvar = this;

    var returnNeighborArr = function(cell){
      var neighborArr = [];
      var coordinate = cell.id.split('-').map(Number);
      for (var i = coordinate[0] - 1; i <= coordinate[0] + 1; i++){
        for (var j = coordinate[1] - 1; j <= coordinate[1] + 1; j++){
          if (i >= 0 && j >= 0 && i <= 11 && j<=11 && ([i,j].toString() !== [coordinate[0],coordinate[1]].toString())){
            neighborArr.push([i,j])
          }
        }

      }
      var idArr = neighborArr.map(function(element){
        return element.join('-')
      });

      var aliveNeighbors = idArr.filter(function(id){
        return document.getElementById(id).className === 'alive';
      })


      if(cell.dataset.status === 'alive' && cell.className === 'alive'){
        if (aliveNeighbors.length < 2){
          cell.dataset.status = 'dead';
        }
        else if (aliveNeighbors.length > 3){
          cell.dataset.status = 'dead';
        }
      }

      else{
        if (aliveNeighbors.length === 3){
          cell.dataset.status = 'alive';
        }
      }
    }


    var setNewClass = function(cell){
      cell.className = cell.dataset.status;
    }

    var stepButton = document.getElementById('step_btn');

    var runStep = function(){
      thisvar.forEachCell(returnNeighborArr);
      thisvar.forEachCell(setNewClass);
    }


    stepButton.addEventListener('click',  runStep);


    // }
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game.
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors
  },
  enableAutoPlay: function () {
    var thisvar = this;
    var autoPlay = document.getElementById('play_btn')
    autoPlay.addEventListener('click', function(){
      setInterval(function(){
      document.getElementById('step_btn').click();
    }, 1000)})
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
  }

};
gameOfLife.createAndShowBoard();
gameOfLife.clear();
gameOfLife.random();
gameOfLife.step();
gameOfLife.enableAutoPlay();
