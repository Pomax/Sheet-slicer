
var Slices = React.createClass({
  render: function() {
    var style = { left:  "calc(" + this.props.ratio + "% + 10px)" };
    var content = <h1>Drag an image into the left panel for slicing...</h1>;

    if(this.props.cleared) {
      content = <h1>Click-drag to create one or more slices from your image...</h1>;
    }

    var slices = this.props.data;
    var keys = Object.keys(slices);
    if (keys.length > 0) {

      var disabled = keys.some(function(c) { if(!Slice.validates(slices[c])) return true; });

      slices = keys.map(function(c) {
        if (slices[c]) {
          return <Slice url={c} key={slices[c].time} removeSlice={this.remove(c)} onUpdate={this.update(c)} data={slices[c]}/>;
        }
      }.bind(this)).filter(function(c) { return !!c; });

      content = [
        <button key="savebutton" onClick={this.submit} disabled={disabled}>Save slices for this sheet</button>,
        { slices }
      ];
    }

    return <div className="slices pane" style={style}>{ content }</div>
  },
  remove: function(c) {
    return function() {
      this.props.removeSlice(c);
    }.bind(this);
  },
  update: function(c) {
    return function(data) {
      this.props.updateSlice(c, data);
    }.bind(this);
  },
  submit: function() {
    this.props.save();
  }
});