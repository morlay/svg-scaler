var eventStream = require('event-stream');
var sax = require("sax");
var SvgPath = require('svgpath');


module.exports = svgScaler;

function svgScaler(options) {
    return eventStream.map(function (file, callback) {
        if (file.isBuffer()) {
            saxParser(String(file.contents), options, function (result) {
                file.contents = new Buffer(result);
                callback(null, file);
            });
        }
    });
}

function saxParser(svgSrcString, options, callback) {

    if (typeof options !== 'object') {
        throw new Error('options need an object');
    }

    var scale = options.scale || 1;
    var dx = 0;
    var dy = 0;

    var parser = sax.parser(true); // set to false for html-mode

    var svgDestString = '';

    parser.onerror = function (e) {
        console.log(e);
    };

    parser.onclosetag = function (node) {
        print("</" + node + ">");
    };

    parser.onopentag = function (node) {

        switch (node.name) {
            case 'svg':
                if (options.width) {
                    if (node.attributes.width >= node.attributes.height) {
                        scale = options.width / node.attributes.width;
                        dy = (node.attributes.width - node.attributes.height) / 2 * scale;
                    } else {
                        scale = options.width / node.attributes.height;
                        dx = (node.attributes.height - node.attributes.width) / 2 * scale;
                    }
                }

                node.attributes.width = node.attributes.width * scale + dx;
                node.attributes.height = node.attributes.height * scale + dy;

                node.attributes.viewBox = [0, 0, node.attributes.width, node.attributes.height].join(' ');
                break;
            case 'path':
                node.attributes.d = new SvgPath(node.attributes.d)
                    .scale(scale)
                    .translate(dx, dy)
                    .round(2)
                    .toString();
                break;
            case 'circle':
                node.attributes.cx = node.attributes.cx * scale + dx;
                node.attributes.cy = node.attributes.cy * scale + dy;
                node.attributes.r = node.attributes.r * scale;

                break;
            case 'ellipse':
                node.attributes.cx = node.attributes.cx * scale + dx;
                node.attributes.cy = node.attributes.cy * scale + dy;
                node.attributes.rx = node.attributes.rx * scale;
                node.attributes.ry = node.attributes.ry * scale;
        }

        print("<" + node.name);

        Object.keys(node.attributes).forEach(function (key) {
            print(" " + key + "=\"" + entity(String(node.attributes[key])) + "\"")
        });

        print(">");

    };

    parser.onend = function () {
        callback('<?xml version="1.0" encoding="utf-8"?>' + svgDestString);
    };

    function print(string) {
        svgDestString += string;
    }

    function entity(str) {
        return str.replace('"', '&quot;')
    }

    parser.write(svgSrcString).close(); // start process

}