var Divider = React.createClass({

  componentDidMount: function() {
    var node = this.getDOMNode();
    var moving = false;
    var onchange = this.props.onChange;
    function mark(evt) { moving = true; }
    function unmark() { moving = false; }
    function reposition(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if(moving) {
        var newratio = 100 * evt.clientX / window.innerWidth;
        onchange(newratio);
      }
    }
    node.addEventListener("mousedown", mark);
    node.addEventListener("mouseup", unmark);
    node.addEventListener("mousemove", reposition);
  },

  render: function() {
    var style = {
      left: "calc(" + this.props.ratio + "% + 0px)"
    };
    return <div className="divider pane" style={style} />;
  }
});