var expect = require('expect.js');

const { globalRegistry: registry } = require('../lib');

const Interface = require('../lib').createInterfaceClass('test');
const { Adapter, Utility } = require('../lib');
var createObjectPrototype = require('../lib').createObjectPrototype;

describe('Global Registry', function() {
    beforeEach(function () {
        registry.utilities = {}
        registry.adapters = {}
    })

    it('can be created', function() {
        expect(registry).to.not.be(undefined);
    });

    it('can get an unnamed utility', function() {
        var IDummyUtility = new Interface({name: "IDummyUtility"});
        
        var DummyUtility = new Utility({
            implements: IDummyUtility
        });
        
        var util = new IDummyUtility();
        
        expect(util).to.be.a(DummyUtility);
    });
    
    it('can get a named utility', function() {
        var IDummyUtility = new Interface({name: "IDummyUtility"});
        
        var DummyUtility = new Utility({
            implements: IDummyUtility,
            name: 'basic'
        });
        
        var util = new IDummyUtility('basic');
        
        expect(util).to.be.a(DummyUtility);
    });
    
    it('can get the correct named utility', function() {
        var IDummyUtility = new Interface({name: "IDummyUtility"});
        
        var DummyUtility = new Utility({
            implements: IDummyUtility,
            name: 'basic'
        });
        
        var NotMeUtility = new Utility({
            implements: IDummyUtility,
            name: 'not me'
        });
        
        var util = new IDummyUtility('basic');
        
        expect(util).to.be.a(DummyUtility);
        expect(util).not.to.be.a(NotMeUtility);
    });
    
    it("returns 'undefined' if named utility isn't found and we have passed true at end", function() {
        var IDummyUtility = new Interface({name: "IDummyUtility"});
        
        var DummyUtility_1 = new Utility({
            implements: IDummyUtility,
            name: 'one'
        });
        
        var utils = registry.getUtility(IDummyUtility, 'two', undefined);
        
        expect(utils).to.be(undefined);
    });
    
    it('can register adapter with convenience method', function() {
        var IUser = new Interface({name: "IUser"});
        
        var IUserAdapter = new Interface({name: "IUserAdapter"});
        
        var UserAdapter = new Adapter({
            implements: IUserAdapter,
            adapts: IUser
        })
        
        var UserPrototype = createObjectPrototype({
            implements: [IUser]
        });
        
        var theUser = new UserPrototype();
        
        var ua = new IUserAdapter(theUser);

        expect(ua).to.be.a(UserAdapter);
    });
    
    it('can get an adapter registered by interface', function() {
        var IUser = new Interface({name: "IUser"});
        
        var IUserAdapter = new Interface({name: "IUserAdapter"});
        
        var UserAdapter = new Adapter({
            implements: IUserAdapter,
            adapts: IUser
        })
        
        var UserPrototype = createObjectPrototype({
            implements: [IUser]
        });
        
        var theUser = new UserPrototype();
        
        var ua = new IUserAdapter(theUser);

        expect(ua).to.be.a(UserAdapter);
    });
    
    it('can get an adapter by specifying the adaptsInterface param', function() {
        var IUser = new Interface({name: "IUser"});
        
        var IStrong = new Interface({name: "IStrong"});
        
        var IUserAdapter = new Interface({name: "IUserAdapter"});
        
        var StrongAdapter = new Adapter({
            implements: IUserAdapter,
            adapts: IStrong
        })
        
        var UserPrototype = createObjectPrototype({
            implements: [IUser, IStrong]
        });
        
        var theUser = new UserPrototype();
        
        var ua = registry.getAdapter(theUser, IUserAdapter, IStrong);

        expect(ua).to.be.a(StrongAdapter);
    });
    
    it('can get an adapter registered by object', function() {
        var UserPrototype = createObjectPrototype({});
        
        var IUserAdapter = new Interface({name: "IUserAdapter"});
        
        var UserAdapter = new Adapter({
            implements: IUserAdapter,
            adapts: UserPrototype
        })
        
        var theUser = new UserPrototype();
        
        var ua = new IUserAdapter(theUser);
        
        expect(ua).to.be.a(UserAdapter);
    });
    
    
    it('can get an adapter registered by interface by providing interface', function() {
        var IUser = new Interface({name: "IUser"});
        
        var IUserAdapter = new Interface({name: "IUserAdapter"});
        
        var UserAdapter = new Adapter({
            implements: IUserAdapter,
            adapts: IUser
        })
        
        // TODO: This is pretty useless, should we support it?
        var ua = registry.getAdapter(IUser, IUserAdapter);

        expect(ua).to.be.a(UserAdapter);
    });
    
    it('can get an adapter for specific prototype', function() {
        var IBase = new Interface({name: 'IBase'});
        
        var BasePrototype = createObjectPrototype({
            implements: [IBase],
        });
        
        var IListWidget = new Interface({name: 'IListWidget'});
        
        var BaseListWidget = new Adapter({
            implements: IListWidget,
            adapts: IBase
        })
        
        var IUser = new Interface({name: 'IUser'});
        
        var UserPrototype = createObjectPrototype({
            extends: [BasePrototype],
            implements: [IUser]
        });
        
        var UserListWidget = new Adapter({
            implements: IListWidget,
            adapts: IUser
        })
        
        var theUser = new UserPrototype();
        
        var listWidget = new IListWidget(theUser);

        expect(listWidget).to.be.a(UserListWidget);
        expect(listWidget).not.to.be.a(BaseListWidget);
    });
});