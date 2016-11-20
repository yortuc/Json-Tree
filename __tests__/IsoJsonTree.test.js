var expect 	 = require('chai').expect;
var JsonTree = require('../lib/IsoJsonTree.js');
var React 	 = require('react');

var enzyme 	 = require('jest-enzyme');
var shallow  = require('enzyme').shallow;
var mount 	 = require('enzyme').mount;

describe('Primitives: ', ()=> {
	it('render string', ()=> {
		
		var json = {
		  isim: 'Evren'
		};

		var elm = React.createElement(JsonTree, {data: json}, null);
	    var wrapper = mount(elm);

		expect(wrapper.find("EditorString")).to.have.length(1);
	});

	it('render numeric', ()=> {
		
		var json = {
		  yas: 32
		};

		var elm = React.createElement(JsonTree, {data: json}, null);
	    var wrapper = mount(elm);

		expect(wrapper.find("EditorNumeric")).to.have.length(1);
	});

	it('render boolean', ()=> {
		
		var json = {
		  evli: true
		};

		var elm = React.createElement(JsonTree, {data: json}, null);
	    var wrapper = mount(elm);

		expect(wrapper.find("EditorBoolean")).to.have.length(1);
	});

	it('render iso-date', ()=> {
		
		var json = {
		  dt: "1984-04-28"
		};

		var elm = React.createElement(JsonTree, {data: json}, null);
	    var wrapper = mount(elm);

		expect(wrapper.find("EditorDate")).to.have.length(1);
	});
});

describe('Complex: ', ()=> {
	it('render array', ()=> {
		
		var json = {
		  arr: [1,2,3,4]
		};

		var elm = React.createElement(JsonTree, {data: json}, null);
	    var wrapper = mount(elm);

		expect(wrapper.find("EditorArray")).to.have.length(1);
	});

	it('render function', ()=> {
		var jsObj = {
			someFunc: function someFunc(param) {
				return true;
			}
		}
		
		var elm = React.createElement(JsonTree, {data: jsObj}, null);
	    var wrapper = mount(elm);

		expect(wrapper.find("EditorFunc")).to.have.length(1);
	});
});