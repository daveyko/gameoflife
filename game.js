var gameOfLife = {

  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

  sliderChange: function(){
    let gameOfLifeObj = this
    var slideSize = document.getElementById('myRange')
    var slideSpeed = document.getElementById('mySpeed')
    let speed = 1 / slideSpeed.value

    slideSize.onchange = function(){
      let rowId
      let rows = document.getElementsByTagName('tr').length
      let cols = document.getElementsByTagName('tr').length
      let sliderVal = this.value
      let numCellsRow = document.getElementsByTagName('tr')[0].childNodes.length
      if (sliderVal > numCellsRow){
        for (var row = 0; row < rows; row++){
          rowId = document.getElementById(`row+${row}`)
          for (var col = rows; col < sliderVal; col++){
            rowId.insertCell(0)
          }
        }
      } else {
        for (var rowDel = 0; rowDel < rows; rowDel++){
          rowId = document.getElementById(`row+${rowDel}`)
          for (var colDel = sliderVal; colDel < numCellsRow; colDel++){
            rowId.deleteCell(0)
          }
        }
      }

      let table = document.getElementById('board')
      let numRowsToAdd
      let numRowsToRemove
      let newRow
      if (sliderVal > cols){
        numRowsToAdd = sliderVal - cols
        for (var addedRow = 0; addedRow < numRowsToAdd; addedRow++ ) {
          newRow = table.insertRow(addedRow)
          for (var addedCell = 0; addedCell < sliderVal; addedCell++){
            newRow.insertCell(addedCell)
          }
        }
      } else {
        numRowsToRemove = cols - sliderVal
        for (var removeRow = 0; removeRow < numRowsToRemove; removeRow++){
          table.deleteRow(0)
        }
      }
      gameOfLifeObj.renameCellId()
      gameOfLifeObj.forEachCell((cell) => {
        cell.onclick = gameOfLifeObj.setupBoardEvents.onCellClick
     })
    }

    slideSpeed.onchange = function(){
      speed = 1 / this.value
      if (gameOfLifeObj.stepInterval){
        gameOfLifeObj.stopAutoPlay()
        gameOfLifeObj.stepInterval = setInterval(gameOfLifeObj.step.bind(gameOfLifeObj),
        speed)
      }
    }
  },

  renameCellId: function(){
    let cellCounter = 0
    let rowLength  = document.getElementsByTagName('tr').length
    let colLength = document.getElementsByTagName('tr')[0].childNodes.length
    for (var row = 0; row < rowLength; row++){
      document.getElementsByTagName('tr')[row].id = `row+${row}`
      for (var col = 0; col < colLength; col++){
        document.getElementsByTagName('td')[cellCounter].id = `${col}-${row}`
        if (!document.getElementsByTagName('td')[cellCounter].hasAttribute('data-status') || document.getElementsByTagName('td')[cellCounter].dataset.status === 'dead'){
          document.getElementsByTagName('td')[cellCounter].setAttribute('data-status', 'dead')
        } else {
          document.getElementsByTagName('td')[cellCounter].className = document.getElementsByTagName('td')[cellCounter].dataset.status
        }
        cellCounter++
      }
    }

  },

  createAndShowBoard: function () {

    // create <table> element
    if (document.getElementsByTagName('tbody').length){
      var tbody = document.getElementsByTagName('tbody')[0]
      tbody.remove()
    }
    var goltable = document.createElement('tbody');
    var heightTable = 12
    var widthTable = 12
    // build Table HTML
    var tablehtml = '';
    for (var h = 0; h < heightTable; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w = 0; w < widthTable; w++) {
        tablehtml += "<td data-status='dead' id='" + w + '-' + h + "'></td>";
      }
      tablehtml += '</tr>';
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);
    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {

    var rowLength = document.getElementsByTagName('tr').length;
    var colLength = document.getElementsByTagName('tr')[0].childNodes.length;
    for (var row = 0; row < rowLength; row++) {
      for (var col = 0; col < colLength; col++) {
        var currentCell = document.getElementById(col + '-' + row)
        iteratorFunc(currentCell);
      }
    }
  },

  setupBoardEvents: function() {


    var onCellClick = function (e) {

      if (this.dataset.status === 'dead') {
        this.className = 'alive';
        this.dataset.status = 'alive';
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
      }
    };

    this.setupBoardEvents.onCellClick = onCellClick


    this.forEachCell(function(cell){
      cell.onclick = onCellClick
    })

    let gameOfLifeObj = this;

    document.getElementById('clear_btn').addEventListener('click', function(){
      gameOfLifeObj.clear();
    });

    document.getElementById('reset_btn').addEventListener('click', function(){
      gameOfLifeObj.random();
    });

    document.getElementById('step_btn').addEventListener('click',  function(){
      gameOfLifeObj.step();
    });

    document.getElementById('play_btn').addEventListener('click', function(){
      gameOfLifeObj.enableAutoPlay()
    })

    document.getElementById('fileInput').addEventListener('change', function(){
      gameOfLifeObj.fileRead()
    })

    gameOfLifeObj.sliderChange()

  },

  clear: function(){
    this.forEachCell(function(cell){
      cell.className = 'dead'
      cell.dataset.status = 'dead'
    })
  },


  random: function(){

    function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function toRand(cell){
      if (getRandomIntInclusive(0, 1) === 0){

        cell.className = 'dead ';
        cell.dataset.status = 'dead';
      }
      else {

        cell.className = 'alive';
        cell.dataset.status = 'alive';
      }
    }

    this.forEachCell(toRand)
  }
  ,
  step: function () {

    var gameOfLifeObj = this;

    var returnNeighborArr = function(cell){
      var neighborArr = [];
      var coordinate = cell.id.split('-').map(Number);
      for (var i = coordinate[0] - 1; i <= coordinate[0] + 1; i++){
        for (var j = coordinate[1] - 1; j <= coordinate[1] + 1; j++){
          if (i >= 0 && j >= 0 && i <= document.getElementsByTagName('tr').length - 1 && j <= document.getElementsByTagName('tr').length - 1 && ([i, j].toString() !== [coordinate[0], coordinate[1]].toString())){
            neighborArr.push([i, j])
          }
        }

      }
      var idArr = neighborArr.map(function(element){
        return element.join('-')
      });

      var aliveNeighbors = idArr.filter(function(id){
        return document.getElementById(id).className === 'alive';
      })

      if (cell.dataset.status === 'alive' && cell.className === 'alive'){
        if (aliveNeighbors.length < 2){
          cell.dataset.status = 'dead';
        }
        else if (aliveNeighbors.length > 3){
          cell.dataset.status = 'dead';
        }
      }

      else  if (aliveNeighbors.length === 3){
          cell.dataset.status = 'alive';
        }
    }


    var setNewClass = function(cell){
      cell.className = cell.dataset.status;
    }

    var runStep = function(){
      gameOfLifeObj.forEachCell(returnNeighborArr);
      gameOfLifeObj.forEachCell(setNewClass);
    }

    runStep()
  },

  enableAutoPlay: function () {
    var slide = document.getElementById('mySpeed')
    let speed = 1 / slide.value

    if (!this.stepInterval){
      this.stepInterval = setInterval(this.step.bind(this), speed)
    } else {
      return this.stopAutoPlay()
      }
    },

    stopAutoPlay: function(){
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    },

    fileRead: function(){
      let gameOfLifeObj = this
      let rawContents
      let fileContents = []
      let fileInput = document.getElementById('fileInput')
      let file = fileInput.files[0]
      let textType = /text.*/
      let setBoardFile = function(cell){
        let row = Number(cell.id.split('-')[1])
        let col = Number(cell.id.split('-')[0])
        if (row < fileContents.length && col < fileContents[0].length) {
        if (fileContents[row][col] && fileContents[row][col] === 'O') {
          cell.className = 'alive'
          cell.dataset.status = 'alive'
        }
      }
    }
      if (file.type.match(textType) || !file.type){
        let reader = new FileReader()
        reader.onload = function(){
          rawContents = reader.result.split('\n')
          for (var line = 0; line < rawContents.length; line++){
            if (rawContents[line][0] !== '!' && rawContents[line] !== ''){
              fileContents.push(rawContents[line].split(''))
            }
          }
          if (fileContents[0].length > document.getElementsByTagName('tr')[0].childNodes.length) {

            let rowId
            let rows = document.getElementsByTagName('tr').length
              for (var row = 0; row < rows; row++){
                rowId = document.getElementById(`row+${row}`)
                for (var col = rows; col < fileContents[0].length; col++){
                  rowId.insertCell(0)
                }
              }
            }

            if (fileContents.length > document.getElementsByTagName('tr').length) {

              let table = document.getElementById('board')
              let numRowsToAdd
              let newRow
              let cols = document.getElementsByTagName('tr').length
                numRowsToAdd = fileContents.length - cols
                for (var addedRow = 0; addedRow < numRowsToAdd; addedRow++ ) {
                  newRow = table.insertRow(addedRow)
                  for (var addedCell = 0; addedCell < fileContents.length; addedCell++){
                    newRow.insertCell(addedCell)
                  }
              }
            }
            gameOfLifeObj.renameCellId()
            gameOfLifeObj.forEachCell(setBoardFile)
          }
        reader.readAsText(file)
      } else {
        console.log('File not supported!')
      }
    }
};

gameOfLife.createAndShowBoard();
