var assert = require('assert');
var expect = require('expect.js');

var Interface = require('../lib').Interface;
var createInterface = require('../lib').createInterface;
var createObjectPrototype = require('../lib').createObjectPrototype;

describe('Interfaces', function() {
    it('can be created', function() {
        var IUser = createInterface({name: 'IUser'});
                
        expect(IUser.name).to.be('IUser');
    });
    
    it('can test if an object impelements it', function() {
        var IUser = createInterface({name: 'IUser'});
        
        var INotImplemented = createInterface({name: 'INotImplemented'});
        
        var userPrototype = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        var user = new userPrototype();
        
        expect(IUser.providedBy(user)).to.be(true);
        expect(INotImplemented.providedBy(user)).to.be(false);
    });

});