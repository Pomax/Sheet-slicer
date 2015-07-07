var Sheet = React.createClass({
  mixins: [
    window.DragAndDropMixin,
    window.SliceItMixin
  ],

  getInitialState: function() {
    return {
      dropzones: ["canvas"],
      highlight: false,
      empty: true
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.sheet !== prevProps.sheet) {
      this.setState({ empty: false}, function() {
        this.handleDroppedData(this.props.sheet, 1, 1);
      });
    }
  },

  render: function() {
    var style = {
      right: this.props.ratio + "%"
    };

    var className = [
      this.state.highlight ? "highlight" : '',
      this.state.empty ? "empty" : ''
    ].join(' ').trim();

    return <div className="sheet pane" style={style}>
      <canvas ref="canvas" className={className}/>
      <div ref="overlay" />
    </div>;
  },

  fileDropped: function(data) {
    this.setState({ empty: false });
    this.props.setSheet(data);
  },

  handleRegionData: function(data, p1, p2) {
    if (this.props.addSlice) {
      this.props.addSlice(data, p1, p2);
    }
  }
});