var assert = require('assert');
var expect = require('expect.js');

var Interface = require('../lib').Interface;
var createInterface = require('../lib').createInterface;
var createObjectPrototype = require('../lib').createObjectPrototype;

describe('Object Prototypes', function() {
    it('can be created', function() {
        var IUser = createInterface();
        
        var userPrototype = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        var user = new userPrototype();
        
        expect(user).to.be.a(userPrototype);
        expect(user.sayHi()).to.be("Hi!");
    });
    
    it("can inherit from other object prototypes", function() {
        var IUser = createInterface();
        
        var userProto = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        var ISpecialUser = createInterface();
        
        var specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser],
            sayHo: function () {
                return "Ho!"
            }
        })
        
        var user = new specialUserProto();
        
        expect(user).to.be.a(specialUserProto);
        expect(user.sayHi()).to.be("Hi!");
        expect(user.sayHo()).to.be("Ho!");
    });
    it("todo...", function() {});
});