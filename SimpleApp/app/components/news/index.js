'use strict';
var createObjectPrototype = require('component-registry').createObjectPrototype;

var BaseObjectProto = require('../base_object');
var INews = require('../../interfaces').INews;

var NewsPrototype = createObjectPrototype({
    implements: [INews],
    extends: [BaseObjectProto],
    title: 'I am a news item!'
})

module.exports = NewsPrototype;