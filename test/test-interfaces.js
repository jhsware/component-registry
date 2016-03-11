var assert = require('assert');
var expect = require('expect.js');

var Interface = require('../lib').Interface;
var createInterface = require('../lib').createInterface;
var createObjectPrototype = require('../lib').createObjectPrototype;
var createUtility = require('../lib').createUtility;
var createAdapter = require('../lib').createAdapter;

describe('Interfaces', function() {
    it('can be created', function() {
        var IUser = createInterface({name: 'IUser'});
                
        expect(IUser.name).to.be('IUser');
    });
    
    it('can test if an object implements it', function() {
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

    it('can test if an adapter implements it', function() {
        var INotImplemented = createInterface({name: 'INotImplemented'});

        var IUser = createInterface({name: 'IUser'});        
        var userPrototype = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        var IPrintUser = createInterface({name: 'IPrintUser'});
        var printAdapter = createAdapter({
            implements: IPrintUser,
            adapts: IUser,
            print: function () {
                return "Hi!"
            }
        })
        
        var user = new userPrototype();
        var printUser = new printAdapter(user);
        
        expect(IPrintUser.providedBy(printUser)).to.be(true);
        expect(INotImplemented.providedBy(printUser)).to.be(false);
    });

    
    it('can test if a utility impelements it (single interface)', function() {
        var IUserFactory = createInterface({name: 'IUser'});
        
        var INotImplemented = createInterface({name: 'INotImplemented'});
        
        var userPrototypeFactory = createUtility({
            implements: IUserFactory,
            doStuff: function () {
                return "Hi!"
            }
        })
        
        var factory = new userPrototypeFactory();
        
        expect(IUserFactory.providedBy(factory)).to.be(true);
        expect(INotImplemented.providedBy(factory)).to.be(false);
    });

});