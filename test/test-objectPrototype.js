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
    
    it("can inherit from other object prototypes two levels deep", function() {
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
        
        var ISuperSpecialUser = createInterface();
        
        var superSpecialUserProto = createObjectPrototype({
            extends: [specialUserProto],
            implements: [ISuperSpecialUser],
            sayYay: function () {
                return "Yay!"
            }
        })
        
        var user = new superSpecialUserProto();
        
        expect(user).to.be.a(superSpecialUserProto);
        expect(user.sayHi()).to.be("Hi!");
        expect(user.sayHo()).to.be("Ho!");
        expect(user.sayYay()).to.be("Yay!");
    });
    
    it("can inherit from other object prototypes two levels deep and call all constructors", function() {
        var IUser = createInterface();
        
        var userProto = createObjectPrototype({
            implements: [IUser],
            constructor: function () {
                this.storedVal = (this.storedVal || '') + '1';
            },
            getStoredVal: function () {
                return this.storedVal;
            }
        })
        
        var ISpecialUser = createInterface();
        
        var specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser],
            constructor: function (data, _super_) {
                _super_._constructor.call(this, data);
                this.storedVal = (this.storedVal || '') + '2';
            },
        })
        
        var user = new specialUserProto();
        
        var ISuperSpecialUser = createInterface();
        
        var superSpecialUserProto = createObjectPrototype({
            extends: [specialUserProto],
            implements: [ISuperSpecialUser],
            constructor: function (data, _super_) {
                _super_._constructor.call(this, data);
                this.storedVal = (this.storedVal || '') + '3';
            },
        })
        
        var user = new superSpecialUserProto();
        
        expect(user).to.be.a(superSpecialUserProto);
        expect(user.getStoredVal()).to.be("123");
    });
    
    it("todo...", function() {});
});