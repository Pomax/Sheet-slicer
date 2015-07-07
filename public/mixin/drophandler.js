window.SliceItMixin = {

  handleDroppedData: function(data, idx, total) {
    if(data.indexOf("data:image/")===0) {
      if (this.props.clear) {
        this.props.clear();
      }

      this.dropdata = data;

      var canvas = this.refs.canvas.getDOMNode();
      var img = new Image();
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext("2d");
        photoshop(canvas, context, img, this.handleRegion);
      }.bind(this);
      img.src = data;
    }
  },

  handleRegion: function(canvas, context, img, p1, p2) {
    sliceImage(img, p1, p2, function(data) {
      if (data.length > 25) {
        this.handleRegionData(data, p1, p2);
      }
    }.bind(this));
  }

};
