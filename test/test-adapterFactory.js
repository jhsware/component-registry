import expect from 'expect.js'
import { createInterfaceClass } from '../lib'
const Interface = createInterfaceClass('test')
import { Adapter, globalRegistry, createObjectPrototype } from '../lib'


describe('Adapter Factory', function() {
    beforeEach(function () {
        globalRegistry.adapters = {}
    })

    it('can create an adapter', function() {
        var IUser = new Interface({name: 'IUser'});
        var IDisplayWidget = new Interface({name: 'IDisplayWidget'});

        var adapter = new Adapter({
            implements: IDisplayWidget,
            adapts: IUser
        })
        
        expect(adapter).not.to.be(undefined);
    });

    it("checks for existence of methods in implemnented interface", function() {
        var IUser = new Interface({name: 'IUser'});
        var IDisplayWidget = new Interface({name: 'IDisplayWidget'});
        
        IDisplayWidget.prototype.render = function () {}
        
        var adapter = new Adapter({
          implements: IDisplayWidget,
          adapts: IUser,
          render: function () {}
        })
    
        expect(adapter).not.to.be(undefined);

        var failed
        try {
            var adapter = new Adapter({
              implements: IDisplayWidget,
              adapts: IUser
            })
        } catch (e) {
            failed = true
        }
        expect(failed).to.equal(true);
    });

    it("make sure we actually can call the methods on the adapter", function() {
        var IUser = new Interface({name: 'IUser'});
        var IDisplayWidget = new Interface({name: 'IDisplayWidget'});
        
        IDisplayWidget.prototype.render = function () {}
        
        var adapter = new Adapter({
          implements: IDisplayWidget,
          adapts: IUser,
          render(inp) {
              return inp
          }
        })

        const User = createObjectPrototype({
            implements: [IUser]
        })
    
        const theUser = new User()

        const outp = new IDisplayWidget(theUser).render('test')

        expect(outp).to.be('test');
    });
});