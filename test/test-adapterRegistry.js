var assert = require('assert');
var expect = require('expect.js');

var AdapterRegistry = require('../lib').AdapterRegistry;
var createInterface = require('../lib').createInterface;
var createObjectPrototype = require('../lib').createObjectPrototype;
var createAdapter = require('../lib').createAdapter;

describe('Adapter Registry', function() {
    it('can be created', function() {        
        var registry = new AdapterRegistry();
        
        expect(registry).to.not.be(undefined);
    });
    
    it('can register adapter with convenience method', function() {
        var registry = new AdapterRegistry();
        
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
        var registry = new AdapterRegistry();
        
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
        var registry = new AdapterRegistry();
        
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
        var registry = new AdapterRegistry();
        
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
        var registry = new AdapterRegistry();
        
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
    
    it("returns an error when registering an adapter that doesn't implement interface", function() {});
    it("returns an error when trying to get an adapter that doesn't exist", function() {});
    
    it('can get an adapter for inherited prototype', function() {
        var registry = new AdapterRegistry();
        
        var IBase = createInterface({name: "IBase"});
        
        var BasePrototype = createObjectPrototype({
            implements: [IBase],
        });
        
        var IListWidget = createInterface({name: "IListWidget"});
        
        var BaseListWidget = createAdapter({
            implements: IListWidget,
            adapts: IBase
        })
        
        registry.registerAdapter(BaseListWidget);
        
        
        var UserPrototype = createObjectPrototype({
            extends: [BasePrototype]
        });
        
        var theUser = new UserPrototype();
        
        var listWidget = registry.getAdapter(theUser, IListWidget);

        expect(listWidget).to.be.a(BaseListWidget);
    });
    
    it('can get an adapter for specific prototype', function() {
        var registry = new AdapterRegistry();
        
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