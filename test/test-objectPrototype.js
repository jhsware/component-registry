var assert = require('assert');
var expect = require('expect.js');

var Interface = require('../lib').Interface;
var createInterface = require('../lib').createInterface;
var createObjectPrototype = require('../lib').createObjectPrototype;

describe('Object Prototypes', function() {
    it('can be created', function() {
        var IUser = createInterface({name: 'IUser'});
        
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
        var IUser = createInterface({name: 'IUser'});
        
        var userProto = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        var ISpecialUser = createInterface({name: 'ISpecialUser'});
        
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
        var IUser = createInterface({name: 'IUser'});
        
        var userProto = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        var ISpecialUser = createInterface({name: 'ISpecialUser'});
        
        var specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser],
            sayHo: function () {
                return "Ho!"
            }
        })
        
        var user = new specialUserProto();
        
        var ISuperSpecialUser = createInterface({name: 'ISuperSpecialUser'});
        
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
        var IUser = createInterface({name: 'IUser'});
        
        var User = createObjectPrototype({
            implements: [IUser],
            constructor: function () {
                this.storedVal = (this.storedVal || '') + '1';
            },
            getStoredVal: function () {
                return this.storedVal;
            }
        })
        
        var ISpecialUser = createInterface({name: 'ISpecialUser'});
        
        var SpecialUser = createObjectPrototype({
            extends: [User],
            implements: [ISpecialUser],
            constructor: function (data) {
                this._IUser.constructor.call(this, data);
                this.storedVal = (this.storedVal || '') + '2';
            },
        })
                
        var ISuperSpecialUser = createInterface({name: 'ISuperSpecialUser'});
        
        var SuperSpecialUser = createObjectPrototype({
            extends: [SpecialUser],
            implements: [ISuperSpecialUser],
            constructor: function (data) {
                this._ISpecialUser.constructor.call(this, data);
                this.storedVal = (this.storedVal || '') + '3';
            },
        })
        
        var user = new SuperSpecialUser();
        
        expect(user).to.be.a(SuperSpecialUser);
        expect(user.getStoredVal()).to.be("123");
        expect(user._IUser.getStoredVal.call(user)).to.be("123");
    });
    
    it("todo...", function() {});
});