var Loader = React.createClass({
  getInitialState: function() {
    return {
      sheets: []
    };
  },

  componentWillMount: function() {
    var _this = this;
    API.list(function(list) {
      _this.setState({ sheets: list });
    });
    document.addEventListener("keyup", function(evt) {
      _this.props.onCancel();
    });
  },

  render: function() {
    var _this = this;

    var sheets = this.state.sheets.map(function(id) {
      return <div>
        {id}:
        <button className="sheetloader" onClick={_this.loadSheet(id)}>
          <img src={"sheets/"+id}/>
        </button>
      </div>;
    });

    return <div className="loader" hidden={!this.props.visible}>
      <h1> Available sheets:</h1>
      <div className="sheets">
        {sheets}
      </div>
    </div>;
  },

  loadSheet: function(id) {
    var _this = this;
    return function(evt) {
      _this.props.onPick(id);
    };
  }
});