require('./spec_helpers.js');

describe("Async",function() {
	
	it("responds to map",function() {
		typeof async['map'].should.be.a('function');
	});
	
	it("responds to parallel",function() {
		typeof async['parallel'].should.be.a('function');
	});
	
	it("responds to throttle",function() {
		typeof async['throttle'].should.be.a('function');
	});
	
	it("responds to serial",function() {
		typeof async['serial'].should.be.a('function');
	});
	
	it("responds to chain",function() {
		typeof async['chain'].should.be.a('function');
	});
}); // Async end