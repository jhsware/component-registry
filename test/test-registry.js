var assert = require('assert');
var expect = require('expect.js');

var registry = require('../lib').globalRegistry;
var createInterface = require('../lib').createInterface;
var createUtility = require('../lib').createUtility;
var createAdapter = require('../lib').createAdapter;
var createObjectPrototype = require('../lib').createObjectPrototype;

describe('Global Registry', function() {
    it('can be created', function() {
        expect(registry).to.not.be(undefined);
    });

    it('can get an unnamed utility', function() {
        var IDummyUtility = createInterface({name: "IDummyUtility"});
        
        var DummyUtility = createUtility({
            implements: IDummyUtility
        });
        registry.registerUtility(DummyUtility);
        
        var util = registry.getUtility(IDummyUtility);
        
        expect(util).to.be.a(DummyUtility);
    });
    
    it('can get a named utility', function() {
        var IDummyUtility = createInterface({name: "IDummyUtility"});
        
        var DummyUtility = createUtility({
            implements: IDummyUtility,
            name: 'basic'
        });
        registry.registerUtility(DummyUtility);
        
        var util = registry.getUtility(IDummyUtility, 'basic');
        
        expect(util).to.be.a(DummyUtility);
    });
    
    it('can get the correct named utility', function() {
        var IDummyUtility = createInterface({name: "IDummyUtility"});
        
        var DummyUtility = createUtility({
            implements: IDummyUtility,
            name: 'basic'
        });
        registry.registerUtility(DummyUtility);
        
        var NotMeUtility = createUtility({
            implements: IDummyUtility,
            name: 'not me'
        });
        registry.registerUtility(NotMeUtility);
        
        var util = registry.getUtility(IDummyUtility, 'basic');
        
        expect(util).to.be.a(DummyUtility);
        expect(util).not.to.be.a(NotMeUtility);
    });
    
    it("returns 'undefined' if named utility isn't found and we have passed true at end", function() {
        var IDummyUtility = createInterface({name: "IDummyUtility"});
        
        var DummyUtility_1 = createUtility({
            implements: IDummyUtility,
            name: 'one'
        });
        registry.registerUtility(DummyUtility_1);
        
        var utils = registry.getUtility(IDummyUtility, 'two', undefined);
        
        expect(utils).to.be(undefined);
    });
    
    it('can register adapter with convenience method', function() {
        var IUser = createInterface({name: "IUser"});
        
        var IUserAdapter = createInterface({name: "IUserAdapter"});
        
        var UserAdapter = createAdapter({
            implements: IUserAdapter,
            adapts: IUser
        }).registerWith(registry);        
        
        var UserPrototype = createObjectPrototype({
            implements: [IUser]
        });
        
        var theUser = new UserPrototype();
        
        var ua = registry.getAdapter(theUser, IUserAdapter);

        expect(ua).to.be.a(UserAdapter);
    });
    
    it('can get an adapter registered by interface', function() {
        var IUser = createInterface({name: "IUser"});
        
        var IUserAdapter = createInterface({name: "IUserAdapter"});
        
        var UserAdapter = createAdapter({
            implements: IUserAdapter,
            adapts: IUser
        })
        
        registry.registerAdapter(UserAdapter);
        
        
        var UserPrototype = createObjectPrototype({
            implements: [IUser]
        });
        
        var theUser = new UserPrototype();
        
        var ua = registry.getAdapter(theUser, IUserAdapter);

        expect(ua).to.be.a(UserAdapter);
    });
    
    it('can get an adapter by specifying the adaptsInterface param', function() {
        var IUser = createInterface({name: "IUser"});
        
        var IStrong = createInterface({name: "IStrong"});
        
        var IUserAdapter = createInterface({name: "IUserAdapter"});
        
        var StrongAdapter = createAdapter({
            implements: IUserAdapter,
            adapts: IStrong
        })
        
        registry.registerAdapter(StrongAdapter);
        
        
        var UserPrototype = createObjectPrototype({
            implements: [IUser, IStrong]
        });
        
        var theUser = new UserPrototype();
        
        var ua = registry.getAdapter(theUser, IUserAdapter, IStrong);

        expect(ua).to.be.a(StrongAdapter);
    });
    
    it('can get an adapter registered by object', function() {
        var UserPrototype = createObjectPrototype({});
        
        var IUserAdapter = createInterface({name: "IUserAdapter"});
        
        var UserAdapter = createAdapter({
            implements: IUserAdapter,
            adapts: UserPrototype
        })
        
        registry.registerAdapter(UserAdapter);
        
        var theUser = new UserPrototype();
        
        var ua = registry.getAdapter(theUser, IUserAdapter);
        
        expect(ua).to.be.a(UserAdapter);
    });
    
    
    it('can get an adapter registered by interface by providing interface', function() {
        var IUser = createInterface({name: "IUser"});
        
        var IUserAdapter = createInterface({name: "IUserAdapter"});
        
        var UserAdapter = createAdapter({
            implements: IUserAdapter,
            adapts: IUser
        })
        
        registry.registerAdapter(UserAdapter);
        
        var ua = registry.getAdapter(IUser, IUserAdapter);

        expect(ua).to.be.a(UserAdapter);
    });
    
    it('can get an adapter for specific prototype', function() {
        var IBase = createInterface({name: 'IBase'});
        
        var BasePrototype = createObjectPrototype({
            implements: [IBase],
        });
        
        var IListWidget = createInterface({name: 'IListWidget'});
        
        var BaseListWidget = createAdapter({
            implements: IListWidget,
            adapts: IBase
        })
        
        registry.registerAdapter(BaseListWidget);
        
        var IUser = createInterface({name: 'IUser'});
        
        var UserPrototype = createObjectPrototype({
            extends: [BasePrototype],
            implements: [IUser]
        });
        
        var UserListWidget = createAdapter({
            implements: IListWidget,
            adapts: IUser
        })
        
        registry.registerAdapter(UserListWidget);
        
        
        var theUser = new UserPrototype();
        
        var listWidget = registry.getAdapter(theUser, IListWidget);

        expect(listWidget).to.be.a(UserListWidget);
        expect(listWidget).not.to.be.a(BaseListWidget);
    });
});