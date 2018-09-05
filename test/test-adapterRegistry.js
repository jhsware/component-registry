var expect = require('expect.js');

const AdapterRegistry = require('../lib').AdapterRegistry;

const Interface = require('../lib').createInterfaceClass('test');
var createObjectPrototype = require('../lib').createObjectPrototype;
const { Adapter } = require('../lib');

describe('Adapter Registry', function() {

    it('can be created', function() {        
        var registry = new AdapterRegistry();
        
        expect(registry).to.not.be(undefined);
    });
    
    it('can register adapter with custom registry', function() {
        var registry = new AdapterRegistry();
        
        var IUser = new Interface({name: "IUser"});
        
        var IUserAdapter = new Interface({name: "IUserAdapter"});
        
        var UserAdapter = new Adapter({
            registry: registry,
            implements: IUserAdapter,
            adapts: IUser
        })
        
        var UserPrototype = createObjectPrototype({
            implements: [IUser]
        });
        
        var theUser = new UserPrototype();
        
        var ua = new IUserAdapter(theUser, { registry: registry });

        expect(ua).to.be.a(UserAdapter);
    });

    it('can get adapter with custom registry using registry.getAdapter', function() {
        var registry = new AdapterRegistry();
        
        var IUser = new Interface({name: "IUser"});
        
        var IUserAdapter = new Interface({name: "IUserAdapter"});
        
        var UserAdapter = new Adapter({
            registry: registry,
            implements: IUserAdapter,
            adapts: IUser
        })
        
        var UserPrototype = createObjectPrototype({
            implements: [IUser]
        });
        
        var theUser = new UserPrototype();
        
        var ua = registry.getAdapter(theUser, IUserAdapter);

        expect(ua).to.be.a(UserAdapter);
    });
    
    it('can get an adapter registered by interface', function() {
        var registry = new AdapterRegistry();
        
        var IUser = new Interface({name: "IUser"});
        
        var IUserAdapter = new Interface({name: "IUserAdapter"});
        
        var UserAdapter = new Adapter({
            registry: registry,
            implements: IUserAdapter,
            adapts: IUser
        })
        
        
        var UserPrototype = createObjectPrototype({
            implements: [IUser]
        });
        
        var theUser = new UserPrototype();
        
        var ua = new IUserAdapter(theUser, { registry: registry });

        expect(ua).to.be.a(UserAdapter);
    });
    
    it('can get an adapter by specifying the adaptsInterface param', function() {
        var registry = new AdapterRegistry();
        
        var IUser = new Interface({name: "IUser"});
        
        var IStrong = new Interface({name: "IStrong"});
        
        var IUserAdapter = new Interface({name: "IUserAdapter"});
        
        var StrongAdapter = new Adapter({
            registry: registry,
            implements: IUserAdapter,
            adapts: IStrong
        })
        
        
        var UserPrototype = createObjectPrototype({
            implements: [IUser, IStrong]
        });
        
        var theUser = new UserPrototype();
        
        // TODO: Do we want to keep this? How about short form?
        var ua = registry.getAdapter(theUser, IUserAdapter, IStrong);

        expect(ua).to.be.a(StrongAdapter);
    });
    
    it('can get an adapter registered by object', function() {
        var registry = new AdapterRegistry();
        
        var UserPrototype = createObjectPrototype({});
        
        var IUserAdapter = new Interface({name: "IUserAdapter"});
        
        var UserAdapter = new Adapter({
            registry: registry,
            implements: IUserAdapter,
            adapts: UserPrototype
        })
        
        var theUser = new UserPrototype();
        
        var ua = new IUserAdapter(theUser, { registry: registry });
        
        expect(ua).to.be.a(UserAdapter);
    });
    
    
    it('can get an adapter registered by interface by providing interface', function() {
        var registry = new AdapterRegistry();
        
        var IUser = new Interface({name: "IUser"});
        
        var IUserAdapter = new Interface({name: "IUserAdapter"});
        
        var UserAdapter = new Adapter({
            registry: registry,
            implements: IUserAdapter,
            adapts: IUser
        })
        
        // TODO: This looks pretty useless, should we support this?
        var ua = registry.getAdapter(IUser, IUserAdapter);

        expect(ua).to.be.a(UserAdapter);
    });
    
    it("returns an error when registering an adapter that doesn't implement interface", function() {});
    it("returns an error when trying to get an adapter that doesn't exist", function() {});
    
    it('can get an adapter for inherited prototype', function() {
        var registry = new AdapterRegistry();
        
        var IBase = new Interface({name: "IBase"});
        
        var BasePrototype = createObjectPrototype({
            implements: [IBase],
        });
        
        var IListWidget = new Interface({name: "IListWidget"});
        
        var BaseListWidget = new Adapter({
            registry: registry,
            implements: IListWidget,
            adapts: IBase
        })
        
        var UserPrototype = createObjectPrototype({
            extends: [BasePrototype]
        });
        
        var theUser = new UserPrototype();
        
        var listWidget = new IListWidget(theUser, { registry: registry });

        expect(listWidget).to.be.a(BaseListWidget);
    });
    
    it('can get an adapter for specific prototype', function() {
        var registry = new AdapterRegistry();
        
        var IBase = new Interface({name: 'IBase'});
        
        var BasePrototype = createObjectPrototype({
            implements: [IBase],
        });
        
        var IListWidget = new Interface({name: 'IListWidget'});
        
        var BaseListWidget = new Adapter({
            registry: registry,
            implements: IListWidget,
            adapts: IBase
        })
        
        var IUser = new Interface({name: 'IUser'});
        
        var UserPrototype = createObjectPrototype({
            extends: [BasePrototype],
            implements: [IUser]
        });
        
        var UserListWidget = new Adapter({
            registry: registry,
            implements: IListWidget,
            adapts: IUser
        })
        
        var theUser = new UserPrototype();
        
        var listWidget = new IListWidget(theUser, { registry: registry });

        expect(listWidget).to.be.a(UserListWidget);
        expect(listWidget).not.to.be.a(BaseListWidget);
    });
    
});