var MemCache = function(id) {
  this.id = id;
  this.cache = {};
};

MemCache.prototype ={
  mirror: function(map) {
    var cache = this.cache;
    Object.keys(map).forEach(function(key) {
      cache[key] = JSON.parse(JSON.stringify(map[key]));
    });
    Object.keys(cache).forEach(function(key) {
      if (!map[key]) { delete cache[key]; }
    })
  },

  get: function(key) {
    return this.cache[key];
  },

  put: function(key, value) {
    this.cache[key] = vale;
  },

  clear: function() {
    this.cache = {};
  }
};
