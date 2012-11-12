require('./spec_helpers.js');

describe("#map()",function() {
	var map = async.map,
			items = [{name: "Wolf"},{name: "Mann"}],
			end = function(err,result) {
				console.log(result);
			},
			getName = function(obj,cb) {
				var delay = Math.floor(Math.random() * 5 + 1) * 1;
				setTimeout(function() {
					if(!obj.hasOwnProperty('name')) {
						cb('bad data');
					} else {
						cb(null,obj.name);
					}
				},delay);
			};
	it("takes three arguments",function () {	
		map.length.should === 3
	});
	
	context("errors",function() {
		it("throws an error if the second argument is not a function",function() {
			(function() {
				map(items,null,end);
			}).should.throw();
		});
	
		it("throws an error if the third argument is not a function",function() {
			(function() {
				map(items,getName);
			}).should.throw();
		});
		
		it("stops execution and returns an error",function(done) {
			var items = [{name: 'adam'},{age: '29'}];
			map(items,getName,function(error,result) {
				done();
				error.should.not.eql(null);
			});
		});
	});
	
	context("success",function() {
		it("immediately returns an empty array if first argument is empty",function(done) {
			map([],getName,function(err,result) {
				done();
				result.should.eql([]);
			});
		});
		
		it("returns an array of data in the expected order",function(done) {
			map(items,getName,function(err,result) {
				done();
				result.should === ['adam','eve'];
			});
		});
	});
}); // map end