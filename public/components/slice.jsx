var Slice = React.createClass({
  statics: {
    validates: function(slice) {
      return (!!slice.company && !!slice.name && !!slice.thumb);
    }
  },

  mixins: [
    window.DragAndDropMixin,
    window.SliceItMixin
  ],

  getInitialState: function() {
    var data = this.props.data;
    return {
      company: data.company || "",
      line: data.line || "",
      name: data.name || "",
      incomplete: "incomplete ",
      dropzones: ["canvas"],
      thumb: data.thumb || false
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    var state = this.state;

    if(state.incomplete && Slice.validates(this.state)) {
      this.setState({ incomplete: '' });
    }
    else if(!state.incomplete && !Slice.validates(this.state)) {
      this.setState({ incomplete: "incomplete " });
    }

    var thumb = state.thumb;
    if (thumb !== prevState.thumb) {
      var img = this.refs.imgthumb;
      sliceImage(this.dropdata, thumb.p1, thumb.p2, function(data) {
        // virtual data! it's derived from the state, not encoded
        img.getDOMNode().src = data;
      });
    }
  },

  componentDidMount: function() {
    var state = this.state;

    this.handleDroppedData(this.props.url, 1, 1);

    if(state.incomplete && Slice.validates(this.state)) {
      this.setState({ incomplete: '' });
    }
    else if(!state.incomplete && !Slice.validates(this.state)) {
      this.setState({ incomplete: "incomplete " });
    }

    var thumb = this.state.thumb;
    if (thumb) {
      var img = this.refs.imgthumb;
      sliceImage(this.dropdata, thumb.p1, thumb.p2, function(data) {
        // virtual data! it's derived from the state, not encoded
        img.getDOMNode().src = data;
      });
    }
  },

  render: function() {
    return <div className={this.state.incomplete + "slice"}>
      <span onClick={this.props.removeSlice}>X</span>
      <div className="data">
        <canvas ref="canvas" />
      </div>
      <fieldset>
        <div> <label>Company:</label> <input type="text" value={this.state.company} onChange={this.set("company")} /> </div>
        <div> <label>Line:</label>    <input type="text" value={this.state.line} onChange={this.set("line")} />       </div>
        <div> <label>Name:</label>    <input type="text" value={this.state.name} onChange={this.set("name")} />       </div>
        <div> <label>Thumbnail:</label> { this.state.thumb ? <img ref="imgthumb" /> : <em>select thumbnail from slice</em> }</div>
      </fieldset>
    </div>;
  },

  set: function(varname) {
    return function(evt) {
      var update = {};
      update[varname] = evt.target.value;
      this.setState(update, this.update);
    }.bind(this);
  },

  update: function() {
    this.props.onUpdate({
      company: this.state.company,
      name: this.state.name,
      thumb: this.state.thumb
    });
  },

  handleRegionData: function(data, p1, p2) {
    if (data !== "data:,") {
      var thumb = { p1: p1, p2: p2 };
      this.setState({ thumb: thumb }, this.update);
    }
  }
});