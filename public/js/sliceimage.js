var sliceImage = function(img, p1, p2, handler) {
  var x = Math.min(p1.x, p2.x),
      y = Math.min(p1.y, p2.y),
      X = Math.max(p1.x, p2.x),
      Y = Math.max(p1.y, p2.y),
      w = X-x,
      h = Y-y,
      slice,
      ctx,
      data;

  slice = document.createElement("canvas");
  slice.width = w;
  slice.height = h;
  ctx = slice.getContext("2d");

  var slicer = function() {
    ctx.drawImage(img, -x, -y);
    data = slice.toDataURL("image/png");
    handler(data);
  };

  if (img instanceof Image) { return slicer(); }

  var imgdata = img;
  var img = new Image();
  img.onload = slicer;
  img.src = imgdata;
};
