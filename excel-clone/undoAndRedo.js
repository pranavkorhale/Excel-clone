document.getElementById("undo").addEventListener("click", function() {
  document.execCommand("undo");
});

document.getElementById("redo").addEventListener("click", function() {
  document.execCommand("redo");
});
