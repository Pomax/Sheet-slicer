var App = React.createClass({
  getInitialState: function() {
    this.cache = false;
    return {
      slices: {},
      ratio: 50,
      cleared: false,
      sheet: false,
      showLoader: false
    };
  },

  componentDidMount: function() {
    var _this = this;
    document.addEventListener("keyup", function(evt) {
      if (evt.ctrlKey && (evt.keyCode === 76 || evt.keyCode === 108)) {
        _this.setState({ showLoader: true });
      }
    });
  },

  render: function() {
    var onpick = function(id) {
      this.setState(
        { showLoader: false},
        function() { this.load(id); }
      );
    }.bind(this);

    var oncancel = function() {
      this.setState({ showLoader: false });
    }.bind(this);

    return <div>

      <Loader visible={this.state.showLoader}
              onCancel={oncancel}
              onPick={onpick}/>

      <Sheet ratio={100 - this.state.ratio}
             sheet={this.state.sheet}
             setSheet={this.setSheet}
             addSlice={this.addSlice} />

      <Divider ratio={this.state.ratio}
               onChange={this.updateRatio} />

      <Slices ratio={this.state.ratio}
              data={this.state.slices}
              cleared={this.state.cleared}
              removeSlice={this.removeSlice}
              updateSlice={this.updateSlice}
              save={this.save}/>

    </div>;
  },

  setSheet: function(sheet, cachedSlices) {
    this.cache = new MemCache(sheet);
    this.setState({
      sheet: sheet,
      slices: cachedSlices ? cachedSlices : {},
      cleared: true
    }, this.sync);
  },

  updateRatio: function(ratio) {
    this.setState({ ratio: parseInt(ratio) });
  },

  addSlice: function(slice, p1, p2) {
    var slices = this.state.slices;
    slices[slice] = { time: Date.now(), p1:p1, p2:p2 };
    this.setState({ slices: slices }, this.sync);
  },

  updateSlice: function(slice, data) {
    var slices = this.state.slices;
    Object.keys(data).forEach(function(p) {
      slices[slice][p] = data[p];
    });
    this.setState({ slices: slices }, this.sync);
  },

  removeSlice: function(slice) {
    var slices = this.state.slices;
    delete slices[slice];
    this.setState({ slices: slices }, this.sync);
  },

  sync: function() {
    this.cache.mirror(this.state.slices);
  },

  save: function() {
    var slices = this.state.slices;
    var data = {
      sheet: this.state.sheet,
      slices: Object.keys(slices).map(function(key) { return slices[key]; })
    };
    API.save(data, function() {
      console.log("saved");
    });
  },

  list: function() {

  },

  load: function(sheetid) {
    API.load(sheetid, function(sheet, slices) {
      this.setSheet(sheet);
      this.setState({ slices: slices });
    }.bind(this));
  }
});