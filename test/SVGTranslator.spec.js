var assert = require("assert");
var should = require('chai').should();

var SVGTranslator = require('../lib/SVGTranslator');


describe('SVGTranslator Parser', function () {

    var svgTranslator = null;

    beforeEach(function () {
        svgTranslator = new SVGTranslator({});
    });


    it('_echoOpenTag', function () {
        assert.equal(svgTranslator._echoOpenTag({
            name: 'test',
            attributes: {
                a: 1,
                b: 2
            }
        }), '<test a="1" b="2">')
    });

    it('_echoCloseTag', function () {
        assert.equal(svgTranslator._echoCloseTag('test'), '</test>')
    });


});


describe('SVGTranslator Node Translate', function () {

    var svgTranslator = null;

    beforeEach(function () {
        svgTranslator = new SVGTranslator({
            scale: 10
        });
    });

    it('nodePointsShapeScale', function () {

        var node = {
            name: 'polyline',
            attributes: {
                points: '350,75   379,161 469,161 397,215 423,301 350,250 277,301 303,215 231,161 321,161   '
            }
        };

        svgTranslator.nodePointsShapeScale(node);

        assert.equal(node.attributes.points, '3500,750 3790,1610 4690,1610 3970,2150 4230,3010 3500,2500 2770,3010 3030,2150 2310,1610 3210,1610')
    });

    it('nodeBaseShapeScale', function () {

        var node = {
            name: 'rect',
            attributes: {
                x: 1,
                y: 1,
                width: 10,
                height: 10,
                rx: 3,
                ry: 3
            }
        };

        svgTranslator.nodeBaseShapeScale(node);

        assert.equal(node.attributes.x, 10);
        assert.equal(node.attributes.y, 10);
        assert.equal(node.attributes.width, 100);
        assert.equal(node.attributes.height, 100);
        assert.equal(node.attributes.rx, 30);
        assert.equal(node.attributes.ry, 30);

    });

    it('svgCenterScale center y', function () {

        var node = {
            name: 'svg',
            attributes: {
                width: '400px',
                height: '200px'
            }
        };

        svgTranslator.options.width = 500;

        svgTranslator.svgCenterScale(node);

        assert.equal(node.attributes.width, 500);
        assert.equal(node.attributes.height, 500);
        assert.equal(svgTranslator.dy, (400 - 200) / 2);

    });

    it('svgCenterScale center x', function () {

        var node = {
            name: 'svg',
            attributes: {
                width: '200px',
                height: '400px'
            }
        };

        svgTranslator.options.width = 500;

        svgTranslator.svgCenterScale(node);

        assert.equal(node.attributes.width, 500);
        assert.equal(node.attributes.height, 500);
        assert.equal(svgTranslator.dx, (400 - 200) / 2);

    });

    it('svgCenterScale have been center', function () {

        var node = {
            name: 'svg',
            attributes: {
                width: '400',
                height: '400'
            }
        };

        svgTranslator.options.width = 500;

        svgTranslator.svgCenterScale(node);

        assert.equal(node.attributes.width, 500);
        assert.equal(node.attributes.height, 500);
        assert.equal(svgTranslator.dx, 0);
        assert.equal(svgTranslator.dy, 0);

    });


});