/**
 * @class ProcessTimer
 * @provides High-resolution timer class for NodeJs & browsers
 *           Implements timestamps processing in a handy simple way
 *
 * @author https://juliyvchirkov.github.io
 * @version 1.0.2 17/08/2018
 * @release https://github.com/juliyvchirkov/process-timer/releases/tag/v1.0.2
 * @bugs https://github.com/juliyvchirkov/process-timer/issues
 * @license MIT
 *
 * @see README.md
 *
 * ProcessTimer {
 *     VERSION : '1.0.2',
 *     nsec : [Getter],
 *     usec : [Getter],
 *     msec : [Getter],
 *     sec : [Getter]
 *     ns : [Getter],
 *     us : [Getter],
 *     ms : [Getter],
 *     s : [Getter]
 * }
 */

'use strict'

/**
 * Universal module definition, turned into one-liner for simplicity & conciseness
 *
 * @see https://github.com/umdjs/umd
 */
;(function (global, factory) {
    typeof define === 'function' && define.amd
        ? define(factory)
        : typeof module === 'object' && module.exports
            ? (module.exports = factory)
            : (global.ProcessTimer = factory)
})(this, function ProcessTimer (suffix) {
    'use strict'

    var CLASSID = 'ProcessTimer'
    var VERSION = '1.0.2'

    /**
     * Defines or modifies a property of an object
     *
     * A TypeError is thrown on failure
     *
     * @param {object} object     The object on which to define the property
     * @param {string} property   The name of the property to be defined or modified
     * @param {object} descriptor The descriptor for the property being defined or
     *                            modified
     *
     * @returns {object} The object that was passed to the function
     */
    function defineProperty (object, property, descriptor) {
        var data = 'value'
        var accessorGet = 'get'
        var accessorSet = 'set'
        var errorPrefix = 'Cannot define or modify property “' + property + '” '
        var errorMessage = null

        /**
         * Defines or modifies an accessor property of an object
         *
         * @param {string} id The name of the accessor property to be defined
         *                    or modified (either “get” or “set”)
         *
         * @returns {void}
         */
        function defineAccessor (id) {
            var __define__ = '__define' + id[0].toUpperCase() + id.slice(1) + 'ter__'
            var __lookup__ = '__lookup' + __define__.slice(8)

            errorMessage = errorPrefix + id + 'ter'

            try {
                object[__define__](property, descriptor[id])

                if (object[__lookup__](property) === descriptor[id]) {
                    errorMessage = null
                }
            } catch (error) {}
        }

        try {
            Object.defineProperty(object, property, descriptor)
        } catch (error) {
            if (data in descriptor) {
                try {
                    object[property] = descriptor[data]
                } catch (error) {
                } finally {
                    if (object[property] !== descriptor[data]) {
                        errorMessage = errorPrefix + data
                    }
                }
            } else {
                accessorGet in descriptor && defineAccessor(accessorGet)
                accessorSet in descriptor && defineAccessor(accessorSet)
            }
        } finally {
            if (errorMessage) {
                throw new TypeError(errorMessage)
            } else {
                return object
            }
        }
    }

    /**
     * Defines or modifies properties of an object
     *
     * A TypeError is thrown on failure
     *
     * @param {object} object     The object on which to define properties
     * @param {object} properties An object whose own enumerable properties
     *                            constitute descriptors for the properties
     *                            to be defined or modified
     *
     * @returns {object} The object that was passed to the function
     */
    function defineProperties (object, properties) {
        var errorMessage = null

        try {
            Object.defineProperties(object, properties)
        } catch (error) {
            try {
                for (var property in properties) {
                    defineProperty(object, property, properties[property])
                }
            } catch (error) {
                errorMessage = error.message
            }
        } finally {
            if (errorMessage) {
                throw new TypeError(errorMessage)
            } else {
                return object
            }
        }
    }

    /**
     * Makes an object immutable if Object.freeze method is available
     *
     * @param {object} object The object to freeze
     *
     * @returns {object} The object that was passed to the function
     */
    function freeze (object) {
        try {
            Object.freeze(object)
        } catch (error) {
        } finally {
            return object
        }
    }

    /**
     * Returns a string indicating the type of an object or a primitive
     *
     * A TypeError is thrown if invoked w/o arguments
     *
     * @param { … } item The object or primitive whose type is to be determined
     *
     * @returns {string} The type of the item that was passed to the function
     */
    function typeOf (item) {
        if (arguments.length === 0) {
            throw new TypeError('Object or primitive has been expected, got nothing')
        }

        var itemTypeof = null

        try {
            itemTypeof = item.constructor.name.toLowerCase()
        } catch (error) {
        } finally {
            return itemTypeof && itemTypeof !== typeof item
                ? itemTypeof
                : Object.prototype.toString.call(item).slice(8, -1).toLowerCase()
        }
    }

    /**
     * Returns a timer startpoint (a [seconds, nanoseconds] array tuple w/
     * unique timestamp) if invoked w/o arguments. Further this array being
     * passed back produces a diff (a [seconds, nanoseconds] array tuple w/
     * time elapsed since a timer has been instantiated) on return
     *
     * A TypeError is thrown on anything but an array tuple
     *
     * @param {array} time The return of this function called w/o arguments
     *
     * @returns {array} A high-resolution timestamp in a [seconds,
     *                  nanoseconds] array tuple, where nanoseconds
     *                  is the remaining part of the timestamp that
     *                  can't be represented in second precision
     */
    function hrtime (time) {
        try {
            return process.hrtime(time)
        } catch (error) {
            time = time || [0, 0]

            var timeTypeof = typeOf(time)
            var timeTypeofArray = timeTypeof === 'array'

            if (timeTypeofArray && time.length === 2) {
                var now =
                    (typeof performance === 'object' &&
                    typeOf(performance) === 'performance' &&
                    typeOf(performance.now) === 'function'
                        ? performance
                        : Date
                    ).now() * 1e-3
                var sec = Math.floor(now) - time[0]
                var nsec = Math.floor((now % 1) * 1e9) - time[1]
                var shift = (nsec < 0) * 1

                return [sec - shift, nsec + shift * 1e9]
            } else {
                throw new TypeError(
                    'Array tuple has been expected, got ' +
                        (timeTypeofArray ? 'incompatible one' : timeTypeof)
                )
            }
        }
    }

    /**
     * The above shims have been designed to sand off some rough edges between
     * NodeJs & various browser engines thru a number of modern & legacy methods
     * sequenced within single functions in order to keep the main routine utterly
     * simple & concise
     */

    var classConstructor = 'Class constructor ' + CLASSID + ' '

    if (!(this instanceof ProcessTimer)) {
        throw new TypeError(classConstructor + 'cannot be invoked w/o “new”')
    }

    if (arguments.length !== 0 && typeof suffix !== 'string') {
        throw new TypeError('String has been expected, got ' + typeOf(suffix))
    }

    /**
     * Converts an integer of a high-resolution timestamp into a double
     * according to the given precision
     *
     * Utilized to process ns, us & ms getters
     *
     * @param {number} stamp An integer of a high-resolution timestamp
     * @param {number} depth The precision (either 9 or 6 or 3)
     *
     * @returns {number} A double of a high-resolution timestamp that
     *                   was passed to the function
     */
    function getHRSec (stamp, depth) {
        var precision = Math.pow(10, -depth)
        var sec = (stamp * precision).toFixed(depth)

        return (sec * 1 - (sec.slice(-1) === '0' ? precision : 0)).toFixed(depth) * 1
    }

    /**
     * The main routine
     */
    try {
        return freeze(
            defineProperties(this, {
                VERSION : {
                    enumerable : true,
                    value : VERSION
                },
                /**
                 * A suffix to append the return of ns, us, ms & s getters
                 * (a string that was passed to the constructor if any, null
                 * otherwise)
                 */
                suffix : {
                    value : typeOf(suffix) === 'string' ? suffix : null
                },
                /**
                 * A timer startpoint (a [seconds, nanoseconds] array tuple
                 * w/ unique timestamp)
                 */
                time : {
                    value : freeze(hrtime())
                },
                /**
                 * @getter nsec
                 *
                 * @returns {number} A number of nanoseconds elapsed since
                 *                   a timer has been instantiated
                 */
                nsec : {
                    enumerable : true,
                    get : function get () {
                        var time = hrtime(this.time)

                        return time[0] * 1e9 + time[1]
                    }
                },
                /**
                 * @getter usec
                 *
                 * @returns {number} A number of microseconds elapsed since
                 *                   a timer has been instantiated
                 */
                usec : {
                    enumerable : true,
                    get : function get () {
                        return Math.round(this.nsec * 1e-3)
                    }
                },
                /**
                 * @getter msec
                 *
                 * @returns {number} A number of milliseconds elapsed since
                 *                   a timer has been instantiated
                 */
                msec : {
                    enumerable : true,
                    get : function get () {
                        return Math.round(this.nsec * 1e-6)
                    }
                },
                /**
                 * @getter sec
                 *
                 * @returns {number} A number of seconds elapsed since a timer
                 *                   has been instantiated
                 */
                sec : {
                    enumerable : true,
                    get : function get () {
                        return Math.round(this.nsec * 1e-9)
                    }
                },
                /**
                 * @getter ns
                 *
                 * @returns {number|string} A number of seconds (accurate to
                 *                          nanoseconds) elapsed since a timer
                 *                          has been instantiated
                 */
                ns : {
                    enumerable : true,
                    get : function get () {
                        return getHRSec(this.nsec, 9) + this.suffix
                    }
                },
                /**
                 * @getter us
                 *
                 * @returns {number|string} A number of seconds (accurate to
                 *                          microseconds) elapsed since a timer
                 *                          has been instantiated
                 */
                us : {
                    enumerable : true,
                    get : function get () {
                        return getHRSec(this.usec, 6) + this.suffix
                    }
                },
                /**
                 * @getter ms
                 *
                 * @returns {number|string} A number of seconds (accurate to
                 *                          milliseconds) elapsed since a timer
                 *                          has been instantiated
                 */
                ms : {
                    enumerable : true,
                    get : function get () {
                        return getHRSec(this.msec, 3) + this.suffix
                    }
                },
                /**
                 * @getter s
                 *
                 * @returns {number|string} A number of seconds elapsed since
                 *                          a timer has been instantiated
                 */
                s : {
                    enumerable : true,
                    get : function get () {
                        return this.sec + this.suffix
                    }
                }
            })
        )
    } catch (error) {
        throw new TypeError(
            classConstructor +
                'is unable to provide an instance (' +
                error.message +
                ')'
        )
    }
})
