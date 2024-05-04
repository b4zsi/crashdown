$(document).ready(function () {
  var numCols = $("#game-board").width() / 70;
  var rows = 3;
  var totalTimeInSeconds = 60;
  var clickCount = 0;
  var sound = false;
  var colors = ["red", "green", "blue"];

  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function generateEmptyBoard() {
    var board = "";
    for (var i = 0; i < 3; i++) {
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
    var basePoints = 10;
    var bonusPoints = (blocksRemoved - 1) * basePoints;
    return basePoints + bonusPoints;
  }

  function populateBoard() {
    $(".block").each(function () {
      $(this).addClass(getRandomColor());
    });
  }

  function addRow() {
    if (rows === 9) {
      showGameOver(parseInt($("#points").text()));
      setInterval(10000);
      return;
    }
    var newRow = '<div class="row">';
    for (var i = 0; i < numCols; i++) {
      newRow += '<div class="block ' + getRandomColor() + '"></div>';
    }
    newRow += "</div>";
    $("#game-board").prepend(newRow);
    rows++;

    newRow += '<div class="block ' + getRandomColor() + '"></div>';
  }

  function removeBlocksWithFade(blocksToRemove) {
    blocksToRemove.each(function () {
      $(this).fadeOut(1000, function () {
        $(this).remove();
      });
    });
  }

  function removeBlocks(clickedBlock) {
    var color1 = clickedBlock.attr("class").toString();
    var color = color1.split(" ")[1];
    var blocksToRemove = getAdjacentBlocks(clickedBlock, color);
    if (blocksToRemove.length > 5) {
      totalTimeInSeconds += 6;
    }

    if (blocksToRemove.length >= 5) {
      removeBlocksWithFade(blocksToRemove);
    } else {
      blocksToRemove.each(function () {
        $(this).remove();
      });
    }

    var rowIndex = clickedBlock.parent().index();
    var columnIndex = clickedBlock.index();

    dropBlocksAbove(rowIndex, columnIndex);

    var numBlocksRemoved = blocksToRemove.length;
    var score = calculateScore(numBlocksRemoved);
    updatePoints(parseInt($("#points").text()) + score);
  }

  function dropBlocksAbove(rowIndex, columnIndex) {
    var rows1 = $("#game-board").children();
    for (var i = rowIndex - 1; i >= 0; i--) {
      var currentRow = rows1.eq(i);
      var blockAbove = currentRow.children().eq(columnIndex);
      var blockBelow = rows1
        .eq(i + 1)
        .children()
        .eq(columnIndex);
      if (blockAbove.hasClass("block")) {
        blockBelow.clone().appendTo(currentRow);
        blockBelow.remove();
      }
    }
  }

  function updatePoints(score) {
    $("#points").text(score);
  }

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

  generateEmptyBoard();
  populateBoard();

  $(document).on("click", ".block", function () {
    
    if (!sound) {
      startTimer();
      var zene = document.getElementById("sound");
      zene.play();
      sound = true;
    }
    removeBlocks($(this));
    var counter = 0;
    for (var i = 0; i < 9; i++) {
      if (isRowEmpty(i)) {
        counter++;
      }
    }
    rows = counter;
    if (clickCount % 3 === 0) {
      addRow();
    }
    clickCount++;

    var currentPoints = parseInt($("#points").text());
    if (currentPoints >= 1500) {
      setInterval(10000);
      showWinPage(currentPoints);
    }
  });

  function updateTimer(timeInSeconds) {
    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = timeInSeconds % 60;
    $("#timer").text(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
  }

  function isRowEmpty(rowIndex) {
    var row = $("#game-board").children().eq(rowIndex);
    var isEmpty = true;
    row.children().each(function () {
      if ($(this).hasClass("block")) {
        isEmpty = false;
        return false;
      }
    });
    return isEmpty;
  }

  function showGameOver(score) {

    const playerName = prompt("Enter your name:");
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    leaderboard.push({ name: playerName, score: score });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    $("#game-container").hide();
    $("#game-over-score").text(score);
    $("#game-over-container").show();
  }
  function showWinPage(score) {
    const playerName = prompt("Enter your name:");
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    leaderboard.push({ name: playerName, score: score });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    var winSound = document.getElementById("winSound");
    winSound.play();
    totalTimeInSeconds = 1000000;
    $("#game-container").hide();
    $("#win-container").show();
    $("#win-score").text(score);
  }

  function startTimer() {
    var timer = setInterval(function () {
      totalTimeInSeconds--;
      updateTimer(totalTimeInSeconds);
      if (
        (totalTimeInSeconds <= 0 && totalTimeInSeconds !== -1) ||
        $("#game-board").children() === 9
      ) {
        clearInterval(timer);
        showGameOver(parseInt($("#points").text()));
      }
    }, 1000);
  }

});
$(function () {
  const leaderboardBody = $("#leaderboard-body");
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboard.sort((a, b) => b.score - a.score);

  for (let i = 0; i < leaderboard.length; i++) {
      const name = leaderboard[i].name;
      const score = leaderboard[i].score;

      const row = $("<tr></tr>");
      row.append(`<td>${name}</td>`);
      row.append(`<td>${score}</td>`);

      leaderboardBody.append(row);
  }
});
