var photoshop = function(canvas, context, img, handleRegion) {
  if(canvas.unbind) {
    canvas.unbind();
  }

  context.strokeStyle = "black";
  context.fillStyle = "rgba(255,255,255,0.2)";

  var down = p1 = p2 = false;
  var parent = canvas.parentNode;

  function coord(evt) {
    var x = evt.layerX;
    var y = evt.layerY;
    // x -= canvas.offsetLeft;
    // y -= canvas.offsetTop;
    evt.x = x;
    evt.y = y;
  }

  function draw() {
    context.drawImage(img, 0, 0);
    if(p1 && p2) {
      context.fillRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
      context.strokeRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
    }
  }

  function mark(evt) {
    coord(evt);
    down = true;
    p1 = { x: evt.x, y: evt.y };
  };

  function drag(evt) {
    if (down) {
      coord(evt);
      p2 = { x: evt.x, y: evt.y };
    }
    draw();
  };

  function unmark() {
    down = false;
    handleRegion(canvas, context, img, p1, p2);
    p1 = p2 = false;
    draw();
  };

  function reposition(evt) {
    if (down) {
      var key = evt.keyCode;
      if(key==37) { evt.preventDefault(); p1.x--; }
      if(key==38) { evt.preventDefault(); p1.y--; }
      if(key==39) { evt.preventDefault(); p1.x++; }
      if(key==40) { evt.preventDefault(); p1.y++; }
      draw();
    }
  }

  canvas.addEventListener("mousedown", mark);
  canvas.addEventListener("mousemove", drag);
  canvas.addEventListener("mouseup", unmark);
  document.addEventListener("keypress", reposition);

  canvas.unbind = function() {
    canvas.removeEventListener("mousedown", mark);
    canvas.removeEventListener("mousemove", drag);
    canvas.removeEventListener("mouseup", unmark);
    document.removeEventListener("keypress", reposition);
  }

  draw();
};