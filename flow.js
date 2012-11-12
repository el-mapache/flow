module.exports = Async = {
	map: function(items,callback,end) {
		var results = [], resultsCount = 0;
		
		if(typeof end !== 'function' || typeof callback !== 'function') {
			throw new Error('An interator and end function must be passed to map.');
		}
		
		if(items.length === 0) {
			return end(null,results);
		}
		
		items.forEach(function(item,index) {
			callback(item,function(err,data) {
				if(err) {
					return end(err);
				}
				
				results[index] = data;
				++resultsCount;
				if(resultsCount === items.length) {
					return end(null,results);
				}
			});
		});
	},
	

	serial: function(callbacks,end) {
		var results = [];
		function next() {
			var callback = callbacks.shift();
			if(callback) {
				callback(function(error, data) {
					if(error) {
						return end(error);
					}
					
					results.push(data);
					next();
				});
			} else {
				end(results);
			}
		};
		next();
	},

	parallel: function(callbacks,end) {
		var results = [], resultsCount = 0;
		callbacks.forEach(function(fn, index) {
			fn(function(data) {
				results[index] = data;
				++resultsCount;
				if(resultsCount === callbacks.length) { 
					return end(results); 
				}
			});
		});
	},

	throttle: function(limit,callbacks,end) {
		var results = [], 
				currentProcesses = 1,
				process = 0;
		
		function next() {
			var callback;
	
			--currentProcesses;
			if(process === callbacks.length && currentProcesses === 0) {
				end(results);
			}
	
			while(currentProcesses < limit && callbacks[process]) {
				callback = callbacks[process];
				(function(index) {
					callback(function(data) {
						results[index] = data;
						next();
					});
				}(process));
				++process;
				++currentProcesses;
			}
		}

		next();
	},
	
	chain: function(callbacks,end) {
		var callback = callbacks.shift(),
				position = 0, base;
		
		function tail(data) {
			if(callbacks.length === 0) {
				return end(data);
			} else {
				base = data;
				++position;
				return step();
			}
		}
		
		function step() {
			if(position === 0) {
				callback(function(data) {
					tail(data);
				});
			} else {
				callback = callbacks.shift();
				callback(base,function(data) {
					tail(data);
				});
			}
		}
		
		step();
	},

	buildFnList: function(items,fn,context) {
		var count = 0,
				list = [],
				len = items.length;
		
		while(count < len) {
			(function(index) {
				list[index] = function(next) { fn.call(context,items[index],next) };
			}(count));
			++count;
		}
		return list;
	},
	
	toArray: function(args,index) {
		var results = [], i, len;
		for(i = (index || 0),len = args.length; i < len; i++) {
			results[i] = args[i];
		}
		return results;
	}
};