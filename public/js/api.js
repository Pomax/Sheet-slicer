var API = {
  save: function(data, callback) {
    var url = "/api/save";
    var params = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Content-length", params.length);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        callback();
      }
    }
    xhr.send(params);
  },

  load: function(sheetid, callback) {
    var url = "/api/load/" + sheetid;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        var data = JSON.parse(xhr.response);
        var sheet = data.sheet;
        var slices = {}
        var slen = data.slices.length;
        data.slices.forEach(function(slice, idx) {
          sliceImage(sheet, slice.p1, slice.p2, function(data) {
            slices[data] = slice;
            if (idx === slen-1) {
              setTimeout(function() {
                callback(sheet, slices);
              }, 1);
            }
          })
        });
      }
    }
    xhr.send(null);
  },

  list: function(callback) {
    var url = "/api/list";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        callback( JSON.parse(xhr.response) );
      }
    }
    xhr.send(null);
  }
};

