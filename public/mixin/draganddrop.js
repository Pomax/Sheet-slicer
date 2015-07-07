(function setupDragAndDrop() {

  function cancel(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  function readFileData(component, e, fileDropHandler) {
    var files = e.dataTransfer.files;
    var i = 0;
    var total = files.length;
    var data;


    function next() {
      if(i===total) return;
      var reader = buildReader(i, total);
      reader.readAsDataURL(files[i]);
      i++;
    }

    function buildReader(idx, total) {
      var reader = new FileReader();
      reader.addEventListener("loadend", function (e) {
        data = this.result;
        if (fileDropHandler) { fileDropHandler(data); }
        component.handleDroppedData(data, idx, total);
        next();
      });
      return reader;
    }

    next();

  }

  function setup(component, htmlElement) {
    var highlight = function (e) { component.highlight(); return cancel(e); };
    var unhighlight = function (e) { component.unhighlight(); return cancel(e); };
    var node = htmlElement.getDOMNode();
    node.addEventListener("dragenter", highlight);
    node.addEventListener("dragover", cancel);
    node.addEventListener("dragleave", unhighlight);
    node.addEventListener("dragexit", unhighlight);
    node.addEventListener("drop", function (e) {
      unhighlight(e);
      readFileData(component, e, function(data) {
        if (component.fileDropped) {
          component.fileDropped(data)
        }
      });
      return false;
    });
  }

  // Mixin object
  var mixin = {
    componentDidMount: function() {
      var dz = this.state.dropzones;
      dz.forEach(function(dropzone) {
        var element = this.refs[dropzone];
        setup(this, element);
      }.bind(this));
    },
    highlight: function() {
      this.setState({ highlight: true });
    },
    unhighlight: function() {
      this.setState({ highlight: false });
    }
  };


  // Node.js return
  if (typeof process !== "undefined" && process.args) {
    module.exports = mixin;
  }

  else if(typeof require !== "undefined" && typeof define !== "undefined") {
    define(function() {
      return mixin;
    });
  }

  else if (typeof window !== "undefined" && window.FileReader !== 'undefined') {
    window.DragAndDropMixin = mixin;
  }

}());
