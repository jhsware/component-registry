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
        expect(user.getStoredVal()).to.equal("123");
        expect(user._IUser.getStoredVal.call(user)).to.equal("123");
    });
    
    it("can inherit from several other object prototypes call all constructors", function() {
        var IUser = createInterface({name: 'IUser'});
        
        var User = createObjectPrototype({
            implements: [IUser],
            constructor: function () {
                this.userVal = 1;
            }
        })
        
        var ISpecial = createInterface({name: 'ISpecial'});
        
        var Special = createObjectPrototype({
            implements: [ISpecial],
            constructor: function (data) {
                this.specialVal = 2;
            },
        })
                
        var ISuperSpecialUser = createInterface({name: 'ISuperSpecialUser'});
        
        var SuperSpecialUser = createObjectPrototype({
            extends: [Special, User],
            implements: [ISuperSpecialUser],
            constructor: function (data) {
                this._ISpecial.constructor.call(this, data);
                this._IUser.constructor.call(this, data);
                this.superSpecialVal = 3;
            },
        })
        
        var user = new SuperSpecialUser();
        
        expect(user).to.be.a(SuperSpecialUser);
        expect(user.userVal).to.equal(1);
        expect(user.specialVal).to.equal(2);
        expect(user.superSpecialVal).to.equal(3);
    });
    
    it("todo...", function() {});
});