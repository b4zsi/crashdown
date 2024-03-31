$(document).ready(function () {
  var numRows = 9; // Initial number of rows
  var numCols = 17; // Initial number of columns
  var rows = 3;

  // Colors for the blocks
  var colors = ["red", "yellow", "green", "blue"];

  // Function to generate random color
  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Function to generate an empty game board
  function generateEmptyBoard() {
    var board = "";
    for (var i = 0; i < 2; i++) {
      var row = '<div class="row">';
      for (var j = 0; j < numCols; j++) {
        row += '<div class="block"></div>';
      }
      row += "</div>";
      board += row;
    }
    $("#game-board").html(board);
  }

  function calculateScore(blocksRemoved) {
    var basePoints = 10; // Base points for each block removed
    var bonusPoints = (blocksRemoved - 1) * basePoints; // Bonus points for removing multiple blocks simultaneously
    return basePoints + bonusPoints;
  }

  // Function to populate the game board with random-colored blocks
  function populateBoard() {
    $(".block").each(function () {
      console.log(this);
      $(this).addClass(getRandomColor());
    });
  }

  // Function to add a new row
  function addRow() {
    if (rows >= numRows) return;
    var newRow = '<div class="row">';
    for (var i = 0; i < numCols; i++) {
      newRow += '<div class="block ' + getRandomColor() + '"></div>';
    }
    newRow += "</div>";
    $("#game-board").prepend(newRow);
    numRows++;
    console.log(rows);
    rows++;
  }

  // Function to remove blocks recursively and add new row
  function removeBlocks(clickedBlock) {
    var color1 = clickedBlock.attr("class").toString();
    var color = color1.split(" ")[1];
    console.log(color);
    var blocksToRemove = getAdjacentBlocks(clickedBlock, color);
    var numBlocksRemoved = blocksToRemove.length;
    blocksToRemove.remove();
    if ($("#game-board").children().last().children().length === 0) {
      addRow();
    }
    var score = calculateScore(numBlocksRemoved);
    updatePoints(parseInt($("#points").text()) + score);
  }

  function updatePoints(score) {
    $("#points").text(score);
  }

  // Function to get all adjacent blocks of the same color recursively
  function getAdjacentBlocks(block, color, visited = []) {
    var blockClass = block.attr("class");
    if (
      !blockClass ||
      blockClass.indexOf(color) === -1 ||
      visited.indexOf(block[0]) !== -1
    ) {
      return $();
    }

    visited.push(block[0]);

    var neighbors = getNeighbors(block, color);

    return neighbors.reduce(function (acc, neighbor) {
      return acc.add(getAdjacentBlocks(neighbor, color, visited));
    }, block);
  }

  // Function to get adjacent blocks of the same color
  function getNeighbors(block, color) {
    var neighbors = [];
    var row = block.parent();
    var index = block.index();

    var top = row.prev().children().eq(index);
    var bottom = row.next().children().eq(index);

    if (top.length && top.hasClass(color)) {
      neighbors.push(top);
    }
    if (bottom.length && bottom.hasClass(color)) {
      neighbors.push(bottom);
    }

    var left = block.prev();
    var right = block.next();

    if (left.length && left.hasClass(color)) {
      neighbors.push(left);
    }
    if (right.length && right.hasClass(color)) {
      neighbors.push(right);
    }

    return neighbors;
  }

  // Initialize the game board
  generateEmptyBoard();
  populateBoard();

  // Event listener for block clicks
  $(document).on("click", ".block", function () {
    removeBlocks($(this));
    console.log($("#game-board .row:last-child .block").length);
    if ($("#game-board .row:last-child .block").length < numCols) {
      addRow();
    }
  });

  function updateTimer(timeInSeconds) {
    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = timeInSeconds % 60;
    $("#timer").text(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
  }

  // Function to start the timer
  function startTimer() {
    var totalTimeInSeconds = 120; // 2 minutes
    var timer = setInterval(function () {
      totalTimeInSeconds--;
      updateTimer(totalTimeInSeconds);
      if (totalTimeInSeconds <= 0) {
        clearInterval(timer); // Stop the timer when it reaches 0
      }
    }, 1000);
  }

  // Start the timer
  startTimer();

  // Event listener for block clicks
  $(document).on("click", ".block", function () {
    var clickedBlock = $(this);
    removeBlocks(clickedBlock);

    var color = clickedBlock.attr("class").split(" ")[0];
    var blocksToRemove = getAdjacentBlocks(clickedBlock, color);
    if (blocksToRemove.length > 1) {
      addTime(500); // Add 5 seconds to the timer
    }
  });

  // Function to add time to the timer
  function addTime(seconds) {
    var currentTime = $("#timer").text().split(":");
    var minutes = parseInt(currentTime[0]);
    var newSeconds = parseInt(currentTime[1]) + seconds;
    if (newSeconds >= 60) {
      minutes += Math.floor(newSeconds / 60);
      newSeconds %= 60;
    }
    $("#timer").text(minutes + ":" + (newSeconds < 10 ? "0" : "") + newSeconds);
  }
});
