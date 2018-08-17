# ProcessTimer
**High-resolution timer class** <a href="https://github.com/juliyvchirkov/process-timer"><img src="https://github.com/favicon.ico" width="20" height="20" valign="middle" ></a> <a href="https://www.npmjs.com/package/process-timer"><img src="https://avatars0.githubusercontent.com/u/6078720?s=20&v=4" width="20" height="20" valign="middle"></a> <a href="https://www.jsdelivr.com/package/npm/process-timer"><img src="https://data.jsdelivr.com/v1/package/npm/process-timer/badge?style=rounded" valign="middle"></a> 

Implements timestamps processing in a handy simple way

```javascript
 /**
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
```

Designed to cover any version of NodeJs & almost any browser being in use nowadays

Utilizes `process.hrtime` method if available (NodeJs v0.7.6 & above), falls back to `performance.now` if available (modern browsers), in turn falls back to `Date.now` (legacy browsers & NodeJs v0.7.5 & below) 

## Install

**NodeJs**

```bash
npm install process-timer
```

**A browser**

Obtain from <a href="https://www.jsdelivr.com/package/npm/process-timer"><img src="https://www.jsdelivr.com/img/logo.png" valign="middle" width="80" height="20"></a>

```html
<script src="https://cdn.jsdelivr.net/npm/process-timer@1/process-timer.min.js" async></script>
```

## Usage

**NodeJs**

```javascript
const ProcessTimer = require('process-timer')
const timer = new ProcessTimer()
```

**A browser**

```javascript
var timer = new ProcessTimer()
```

Retrieving a timestamp

```javascript
/**
 * A number of seconds (accurate to nanoseconds) 
 * elapsed since a timer has been instantiated
 */
console.log(timer.ns)

/**
 * A number of seconds (accurate to microseconds) 
 * elapsed since a timer has been instantiated
 */
console.log(timer.us)

/**
 * A number of seconds (accurate to milliseconds) 
 * elapsed since a timer has been instantiated
 */
console.log(timer.ms)

/**
 * A number of seconds elapsed since a timer 
 * has been instantiated
 */
console.log(timer.s)

/**
 * A number of nanoseconds elapsed since a timer 
 * has been instantiated
 */
console.log(timer.nsec)

/**
 * A number of microseconds elapsed since a timer 
 * has been instantiated
 */
console.log(timer.usec)

/**
 * A number of milliseconds elapsed since a timer 
 * has been instantiated
 */
console.log(timer.msec)

/**
 * A number of seconds elapsed since a timer 
 * has been instantiated
 */
console.log(timer.sec)
```

## Samples

The most common use case

```javascript
const ProcessTimer = require('process-timer')
/**
 * Launching a timer
 */
const timer = new ProcessTimer()

try {
    /**
     * … processing …
     */

    /**
     * Retrieving a number of seconds (accurate to microseconds) to note the milestone
     */
     console.log('Code block of Subroutine #14 has been reached on %s sec', timer.us)

    /**
     * Subroutine #14
     */
    if (['-?', '-h', '--help', '--usage'].includes(process.argv[2])) {
        /**
         * Launching another timer inside the subroutine
         */
        const subroutineTimer = new ProcessTimer()

         /**
          * … processing …
          */

         /**
          * Retrieving a number of seconds (accurate to microseconds) to note
          * the completion of subroutine
          */
         console.log('Subroutine #14 time: %s sec', subroutineTimer.us)
    }

   /**
    * … processing …
    */

   /**
    * Retrieving a number of seconds (accurate to microseconds)
    * to note the completion
    */
    console.log('Total time: %s sec', timer.us)
} catch (error) {
    /**
     * Retrieving a number of seconds (accurate to nanoseconds)  
     * elapsed before a failure
     */
    console.error('Crashed on %s sec\n%s', timer.ns, error.stack)
}
```

Retrieving a number of nanoseconds / microseconds / milliseconds / seconds per se

```javascript
const ProcessTimer = require('process-timer')
const timer = new ProcessTimer()

try {
    /**
     * … processing …
     */

    /**
     * Retrieving a number of microseconds to note a milestone
     */
    console.log('Got here after %s μs', timer.usec)

    /**
     * … processing …
     */

    /**
     * Retrieving a number of seconds along w/ a number of millisecond
     * to note the completion
     */
    console.log('Total time: %s sec (%s ms)', timer.sec, timer.msec)    
} catch (error) {
    /**
     * Retrieving a number of nanoseconds elapsed before a failure
     */
    console.error('Crashed on %s ns\n%s', timer.nsec, error.stack)
}
```

The constructor accepts a text suffix to append an outcome of `timer.ns`, `timer.us`, `timer.ms` & `timer.s` (needless to say this suffix turns the type of outcome of these getters from `Number` into `String`)

```javascript
const ProcessTimer = require('process-timer')
const timer = new ProcessTimer('s')

setTimeout(() => {
    const milestone = timer.us
    
    /**
     * Expected output:
     * 'string'
     * '8.008321s'
     */
    console.log(typeof milestone)
    console.log(milestone)
}, 8000)
```

Hint: one can pass an empty suffix to the constructor to force the type of outcome of the above quadruplet to become `String` w/ no appendix

```javascript
const ProcessTimer = require('process-timer')
const timer = new ProcessTimer('')

setTimeout(() => {
    const milestone = timer.us 
    
    /**
     * Expected output:
     * 'string'
     * '8.008321'
     */
    console.log(typeof milestone)
    console.log(milestone)
}, 8000)
```

## Bugs

If you have faced some bug, please [follow this link to create the issue](https://github.com/juliyvchirkov/process-timer/issues) & thanks for your time & contribution in advance!

**glory to Ukraine!** 🇺🇦

Juliy V. Chirkov, [twitter.com/juliychirkov](https://twitter.com/juliychirkov)
