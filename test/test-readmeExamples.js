var expect = require('expect.js');

const { createInterfaceClass, Adapter, createObjectPrototype, globalRegistry } = require('component-registry')

class consoleMock {
  log(inp) {
    this.logResult = inp
  }
}

describe('Readme Examples', function() {
  beforeEach(function () {
    globalRegistry.adapters = {}
  })

  it('Sample Code', function() {
    let console = new consoleMock()

    const Interface = createInterfaceClass('test')

    const IUser = new Interface({name: 'IUser'})

    const IDisplayWidget = new Interface({name: 'IDisplayWidget'})
    IDisplayWidget.prototype.render = function () {}

    const adapter = new Adapter({
        implements: IDisplayWidget,
        adapts: IUser,
        render () {
            console.log(`I am a ${this.context._type}`)
        }
    })

    const User = createObjectPrototype({
        implements: [IUser],
        constructor(params) {
            this._type = 'User'
        }
    })

    const oneUser = new User()

    new IDisplayWidget(oneUser).render()
    // [console]$ I am a User
    
    expect(console.logResult).to.be('I am a User');
  });
})

