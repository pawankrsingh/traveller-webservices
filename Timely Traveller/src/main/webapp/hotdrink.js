/*####################################################################
 * Abstract Data Type interfaces
 *
 * These are mainly interfaces defining how to use the built-in
 * JavaScript types to emulate more complex types.  For example, the
 * Dictionary interface just describes an object in which name/value
 * pairs are stored as properties.  Similarly, the ArraySet interface
 * just describes an array in which every element is assumed to be
 * unique.
 */
var hd;
(function (hd) {
    var utility;
    (function (utility) {
        /*==================================================================
         * An ArraySet is simply an array where each element only occurs
         * in the array once.
         *
         * To make this, I copied from the standard "lib.d.ts" definitions
         * file all the members of the "Array" interface which make sense on
         * a set.  Thus, any array will automatically fuffill this
         * interface.
         *
         * Extra set functionality is provided through external functions.
         *
         * All ArraySet functions are in their own namespace to avoid
         * confusion.
         */
        var arraySet;
        (function (arraySet) {
            /*----------------------------------------------------------------
             * Make a copy.
             */
            function clone(as) {
                return as.slice(0);
            }
            arraySet.clone = clone;
            /*----------------------------------------------------------------
             * Test whether set contains element.
             */
            function contains(as, value) {
                return as.indexOf(value) != -1;
            }
            arraySet.contains = contains;
            /*----------------------------------------------------------------
             * Add element to set.
             * @returns the set
             * Useful with Array.reduce -- e.g.
             *   set = [3, 1, 4, 1, 5, 9, 3].reduce( arraySet.build, [] )
             */
            function build(as, value) {
                if (as.indexOf(value) == -1) {
                    as.push(value);
                }
                return as;
            }
            arraySet.build = build;
            /*----------------------------------------------------------------
             * Add element to set.
             * @returns true if element was added, false if it was already
             * contained by the set
             */
            function add(as, value) {
                if (as.indexOf(value) == -1) {
                    as.push(value);
                    return true;
                }
                else {
                    return false;
                }
            }
            arraySet.add = add;
            /*----------------------------------------------------------------
             * Remove element from set.
             * @returns true if element was removed, false if it was not
             * contained by the set.
             */
            function remove(as, value) {
                var index = as.indexOf(value);
                if (index != -1) {
                    as.splice(index, 1);
                    return true;
                }
                else {
                    return false;
                }
            }
            arraySet.remove = remove;
            /*----------------------------------------------------------------
             * Calculate the union of two sets.
             */
            function union(as, bs) {
                return as.concat(bs.filter(function (b) {
                    return as.indexOf(b) == -1;
                }));
            }
            arraySet.union = union;
            /*----------------------------------------------------------------
             * Optimization for when we know the sets are disjoint to begin
             * with.
             */
            function unionKnownDisjoint(as, bs) {
                return as.concat(bs);
            }
            arraySet.unionKnownDisjoint = unionKnownDisjoint;
            /*----------------------------------------------------------------
             * Calculate the intersection of two sets.
             */
            function intersect(as, bs) {
                return as.filter(function (a) {
                    return bs.indexOf(a) != -1;
                });
            }
            arraySet.intersect = intersect;
            /*----------------------------------------------------------------
             * Calculate set difference.
             */
            function difference(as, bs) {
                return as.filter(function (a) {
                    return bs.indexOf(a) == -1;
                });
            }
            arraySet.difference = difference;
            /*----------------------------------------------------------------
             * Test for subset relation.
             */
            function isSubset(as, bs) {
                return as.every(function (a) {
                    return bs.indexOf(a) != -1;
                });
            }
            arraySet.isSubset = isSubset;
            /*----------------------------------------------------------------
             * Test for disjoint arrays.
             */
            function areDisjoint(as, bs) {
                return as.every(function (a) {
                    return bs.indexOf(a) == -1;
                });
            }
            arraySet.areDisjoint = areDisjoint;
            /*----------------------------------------------------------------
             * Test for equal arrays.
             */
            function areEqual(as, bs) {
                return as.length == bs.length && isSubset(as, bs);
            }
            arraySet.areEqual = areEqual;
            /*----------------------------------------------------------------
             * Build set from array (remove duplicates).
             */
            function fromArray(as) {
                // For some reason, TypeScript does not infer this type correctly
                var b = build;
                var f = as.reduce(b, []);
                return f;
            }
            arraySet.fromArray = fromArray;
        })(arraySet = utility.arraySet || (utility.arraySet = {}));
        /*==================================================================
         * A StringSet is simply an object used to store strings as property
         * names.  Since the value of the property does not matter, only the
         * property name, the boolean value "true" is used as the value;
         * this has the added bonus of simplifying the membership test.
         *
         * Extra set functionality is provided through external functions.
         *
         * All StringSet functions are in their own namespace to avoid
         * confusion.
         */
        var stringSet;
        (function (stringSet) {
            /*----------------------------------------------------------------
             * Make a copy.
             */
            function clone(ss) {
                var copy = {};
                for (var s in ss) {
                    if (ss[s]) {
                        copy[s] = true;
                    }
                }
                return copy;
            }
            stringSet.clone = clone;
            /*----------------------------------------------------------------
             * Test whether set contains element.
             */
            function contains(ss, s) {
                return ss[s];
            }
            stringSet.contains = contains;
            /*----------------------------------------------------------------
             * Add element to set.
             * @returns the set
             * Useful with Array.reduce -- e.g.
             *   set = ['hey', 'there', 'hi', 'there'].reduce( stringSet.build, [] )
             */
            function build(ss, s) {
                ss[s] = true;
                return ss;
            }
            stringSet.build = build;
            /*----------------------------------------------------------------
             * Add element to set.
             * @returns true if element was added, false if it was already
             * contained by the set
             */
            function add(ss, s) {
                if (ss[s]) {
                    return false;
                }
                else {
                    return ss[s] = true;
                }
            }
            stringSet.add = add;
            /*----------------------------------------------------------------
             * Remove element from set.
             * @returns true if element was removed, false if it was not
             * contained by the set.
             */
            function remove(ss, s) {
                if (ss[s]) {
                    delete ss[s];
                    return true;
                }
                else {
                    return false;
                }
            }
            stringSet.remove = remove;
            /*----------------------------------------------------------------
             * Gets all members of the set.
             */
            stringSet.members = Object.keys;
            /*----------------------------------------------------------------
             * Iteration
             */
            function forEach(ss, callback, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                for (var el in ss) {
                    callback.call(thisArg, el);
                }
            }
            stringSet.forEach = forEach;
            /*----------------------------------------------------------------
             * Calculate the union of two sets.
             */
            function union(as, bs) {
                var cs = {};
                for (var el in as) {
                    cs[el] = true;
                }
                for (var el in bs) {
                    cs[el] = true;
                }
                return cs;
            }
            stringSet.union = union;
            /*----------------------------------------------------------------
             * Calculate the intersection of two sets.
             */
            function intersect(as, bs) {
                var cs = {};
                for (var el in as) {
                    if (bs[el]) {
                        cs[el] = true;
                    }
                }
                return cs;
            }
            stringSet.intersect = intersect;
            /*----------------------------------------------------------------
             * Calculate set difference.
             */
            function difference(as, bs) {
                var cs = {};
                for (var el in as) {
                    if (!(el in bs)) {
                        cs[el] = true;
                    }
                }
                return cs;
            }
            stringSet.difference = difference;
            /*----------------------------------------------------------------
             * Build set from list of strings.
             */
            function fromArray(as) {
                return as.reduce(build, {});
            }
            stringSet.fromArray = fromArray;
        })(stringSet = utility.stringSet || (utility.stringSet = {}));
        /*==================================================================
         * This is a very simple queue implementation, basically storing
         * everything as an array with a varying initial index.
         */
        var Queue = (function () {
            function Queue() {
                this.begin = 0;
                this.end = 0;
            }
            /*----------------------------------------------------------------
             */
            Queue.prototype.isEmpty = function () {
                return this.begin == this.end;
            };
            /*----------------------------------------------------------------
             */
            Queue.prototype.isNotEmpty = function () {
                return this.begin != this.end;
            };
            /*----------------------------------------------------------------
             */
            Queue.prototype.enqueue = function (t) {
                this[this.end++] = t;
            };
            /*----------------------------------------------------------------
             */
            Queue.prototype.dequeue = function () {
                var t = this[this.begin];
                this[this.begin] = undefined;
                ++this.begin;
                if (this.begin >= this.end) {
                    this.begin = this.end = 0;
                }
                return t;
            };
            /*----------------------------------------------------------------
             */
            Queue.prototype.remove = function (t) {
                var removed = false;
                for (var i = this.begin, l = this.end; i < l; ++i) {
                    if (!removed && this[i] === t) {
                        removed = true;
                    }
                    if (removed) {
                        this[i] = this[i + 1];
                    }
                }
                if (removed) {
                    --this.end;
                    if (this.begin >= this.end) {
                        this.begin = this.end = 0;
                    }
                }
            };
            return Queue;
        })();
        utility.Queue = Queue;
        /*==================================================================
         */
        var Heap = (function () {
            function Heap(comesBefore) {
                this.members = [];
                this.length = 0;
                this.comesBefore = comesBefore;
            }
            Heap.prototype.contains = function (el) {
                return this.members.indexOf(el) >= 0;
            };
            Heap.prototype.push = function (el) {
                this.members.push(el);
                this.upheap(this.length);
                ++this.length;
            };
            Heap.prototype.pushAll = function (els) {
                for (var i = 0, l = els.length; i < l; ++i) {
                    this.members.push(els[i]);
                    this.upheap(this.length);
                    ++this.length;
                }
            };
            Heap.prototype.pop = function () {
                var result = this.members[0];
                var last = this.members.pop();
                if (--this.length > 0) {
                    this.members[0] = last;
                    this.downheap(0);
                }
                return result;
            };
            Heap.prototype.upheap = function (i) {
                var el = this.members[i];
                while (i > 0) {
                    var parentI = Math.floor((i + 1) / 2) - 1;
                    var parent = this.members[parentI];
                    if (this.comesBefore(el, parent)) {
                        this.members[parentI] = el;
                        this.members[i] = parent;
                        i = parentI;
                    }
                    else {
                        break;
                    }
                }
            };
            Heap.prototype.downheap = function (i) {
                var length = this.members.length;
                var el = this.members[i];
                while (true) {
                    var childI = 2 * i + 1;
                    if (childI < length) {
                        var child = this.members[childI];
                        var child2I = childI + 1;
                        if (child2I < length) {
                            var child2 = this.members[child2I];
                            if (this.comesBefore(child2, child)) {
                                childI = child2I;
                                child = child2;
                            }
                        }
                        if (this.comesBefore(child, el)) {
                            this.members[childI] = el;
                            this.members[i] = child;
                            i = childI;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
            };
            return Heap;
        })();
        utility.Heap = Heap;
    })(utility = hd.utility || (hd.utility = {}));
})(hd || (hd = {}));
/*####################################################################
 * Stand-alone helper functions, as well as a few generic interfaces.
 */
var hd;
(function (hd) {
    var utility;
    (function (utility) {
        /*------------------------------------------------------------------
         * Makes a "construction binder" - a function which takes its
         * arguments and binds them to a constructor, making a specialized
         * constructor.
         *
         * So this:
         *   fBinder = makeConstructionBinder( F );
         *   Fxy = fBinder( x, y );
         *   Fab = fBinder( a, b );
         *   f1 = new Fxy();
         *   f2 = new Fab();
         * is effectively the same as this:
         *   f1 = new F( x, y );
         *   f2 = new F( a, b );
         */
        function makeConstructorBinder(klass) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var arg1 = Array.prototype.slice.call(arguments, 1);
            return function () {
                var arg2 = Array.prototype.slice.call(arguments, 0);
                return klass.bind.apply(klass, [null].concat(arg1, arg2));
            };
        }
        utility.makeConstructorBinder = makeConstructorBinder;
        (function (Fuzzy) {
            Fuzzy[Fuzzy["No"] = 0] = "No";
            Fuzzy[Fuzzy["Yes"] = 1] = "Yes";
            Fuzzy[Fuzzy["Maybe"] = 2] = "Maybe";
        })(utility.Fuzzy || (utility.Fuzzy = {}));
        var Fuzzy = utility.Fuzzy;
        ;
        /*------------------------------------------------------------------
         * Does nothing.  Reuse this to avoid creating a bunch of empty
         * functions.
         */
        function noop() { }
        utility.noop = noop;
        /*------------------------------------------------------------------
         * Creates a duplicate of an object.  Note that this is a shallow
         * copy:  it's an object with the same prototype whose properties
         * point to the same values.
         */
        function shallowCopy(obj) {
            var orig = obj;
            var copy = Object.create(Object.getPrototypeOf(obj));
            for (var key in orig) {
                if (orig.hasOwnProperty(key)) {
                    copy[key] = (orig)[key];
                }
            }
            return copy;
        }
        utility.shallowCopy = shallowCopy;
        /*------------------------------------------------------------------
         * Creates a duplicate of an object.  Note that this is a deep
         * copy:  it will recursively copy any objects pointed to by this
         * object.  (So make sure there are no cycles.)
         */
        function deepCopy(obj) {
            var orig = obj;
            var copy = Array.isArray(obj)
                ? [] : Object.create(Object.getPrototypeOf(obj));
            for (var key in orig) {
                if (orig.hasOwnProperty(key)) {
                    if (typeof orig[key] === 'object') {
                        copy[key] = deepCopy(orig[key]);
                    }
                    else {
                        copy[key] = orig[key];
                    }
                }
            }
            return copy;
        }
        utility.deepCopy = deepCopy;
        /*------------------------------------------------------------------
         */
        function partition(ts, fn) {
            return ts.reduce(function build(d, t) {
                var key = fn(t);
                if (key in d) {
                    d[key].push(t);
                }
                else {
                    d[key] = [t];
                }
                return d;
            }, {});
        }
        utility.partition = partition;
        /*------------------------------------------------------------------
         * Map function over array and concatenate the results
         */
        function concatmap(ts, fn, thisArg) {
            if (thisArg === void 0) { thisArg = null; }
            var results = [];
            for (var i = 0, l = ts.length; i < l; ++i) {
                var result = fn.call(thisArg, ts[i], i, ts);
                Array.prototype.push.apply(results, Array.isArray(result) ? result : [result]);
            }
            return results;
        }
        utility.concatmap = concatmap;
        /*------------------------------------------------------------------
         * Map function over array in reverse order
         */
        function reversemap(ts, fn, thisArg) {
            if (thisArg === void 0) { thisArg = null; }
            var results = [];
            for (var i = ts.length - 1; i >= 0; --i) {
                results.push(fn.call(thisArg, ts[i], i, ts));
            }
            return results;
        }
        utility.reversemap = reversemap;
        function interpolate() {
            var as = [];
            for (var i = 0, l = arguments.length; i < l; ++i) {
                var a = arguments[i];
                if (Array.isArray(a)) {
                    as.push.apply(as, a);
                }
                else if (a !== undefined) {
                    as.push(a);
                }
            }
            return as;
        }
        utility.interpolate = interpolate;
        /*------------------------------------------------------------------
         * The compare function for numbers (most commonly used for sorting)
         */
        function numCompare(a, b) {
            return a - b;
        }
        utility.numCompare = numCompare;
        function dateCompare(a, b) {
            return a.valueOf() - b.valueOf();
        }
        utility.dateCompare = dateCompare;
        /*==================================================================
          The following functions are all simple functions intended to be
          used with the built-in array iteration functions
          (e.g. filter, map, etc.)
         *==================================================================*/
        /*------------------------------------------------------------------
         * Simple predicates to test type of object.  Written in curried
         * form.
         */
        function isType(type) {
            return function (obj) {
                return obj instanceof type;
            };
        }
        utility.isType = isType;
        function isNotType(type) {
            return function (obj) {
                return !(obj instanceof type);
            };
        }
        utility.isNotType = isNotType;
        /*------------------------------------------------------------------
         * Simple predicates to test for key in object.  Written in curried
         * form.
         */
        function nameIsIn(obj) {
            return function (name) {
                return name in obj;
            };
        }
        utility.nameIsIn = nameIsIn;
        function nameIsNotIn(obj) {
            return function (name) {
                return !(name in obj);
            };
        }
        utility.nameIsNotIn = nameIsNotIn;
        /*----------------------------------------------------------------
         * Simple function to get property with given name.  Written in
         * curried form.
         */
        function toValueIn(obj) {
            return function (name) {
                return obj[name];
            };
        }
        utility.toValueIn = toValueIn;
        /*------------------------------------------------------------------
         * Simple function to get the id property of an object.
         */
        function getId(obj) {
            return obj.id;
        }
        utility.getId = getId;
    })(utility = hd.utility || (hd.utility = {}));
})(hd || (hd = {}));
/*####################################################################
 * Defines hd.utility.console for logging.
 *
 * This is a duplicate of window.console, with the addition that there
 * are certain content-specific consoles which can be either enabled
 * or disabled.  If they are disabled, then the logging functions are
 * still there, but they don't do anything.
 *
 * For example:
 *   // Always prints to console
 *   hd.utility.console.log( 'Hello' );
 *
 *   // Only prints if the "async" logger is enabled; otherwise no-op
 *   hd.utility.console.async.log( 'Hello' );
 *
 *   // Prints if at least one of "async", "solve", or "promise" is enabled
 *   hd.utility.console.async.solve.promise.log( 'Hello' );
 */
var hd;
(function (hd) {
})(hd || (hd = {}));
hd.globalConsole = console;
var hd;
(function (hd) {
    var utility;
    (function (utility) {
        /*==================================================================
         * This class has two types of members.  First it has all the
         * logging functions from window.console.  Second it has links
         * to various content-specific consoles.
         */
        var Console = (function () {
            function Console() {
                // logging functions
                this.dir = utility.noop;
                this.error = utility.noop;
                this.group = utility.noop;
                this.groupCollapsed = utility.noop;
                this.groupEnd = utility.noop;
                this.info = utility.noop;
                this.log = utility.noop;
                this.time = utility.noop;
                this.timeEnd = utility.noop;
                this.trace = utility.noop;
                this.warning = utility.noop;
                // content-specific consoles
                this.async = this;
                this.compile = this;
            }
            return Console;
        })();
        utility.Console = Console;
        /*==================================================================
         * There are three consoles: the root console, the enabled console,
         * and the disabled console.
         */
        /*
         * The root console:
         * - Console functions come from window.console
         * - Enabled links point to enabled console
         * - Disabled links point to disabled console
         */
        utility.console = new Console();
        /*
         * The enabled console:
         * - Console functions come from window.console
         * - Enabled links point to enabled console
         * - Dsiabled links point to enabled console
         */
        var enabled = new Console();
        /*
         * The disabled console:
         * - Console functions are noop
         * - Enabled links point to enabled console
         * - Disabled links point to disabled console
         */
        var disabled = new Console();
        // This helper function creates a bound version of a specific
        // window.console function
        function bindConsoleFunction(name) {
            var consoleFns = hd.globalConsole;
            if (consoleFns[name]) {
                return consoleFns[name].bind(hd.globalConsole);
            }
        }
        // Set console functions for root/enabled consoles
        utility.console.dir = enabled.dir =
            bindConsoleFunction('dir');
        utility.console.error = enabled.error =
            bindConsoleFunction('error');
        utility.console.group = enabled.group =
            bindConsoleFunction('group');
        utility.console.groupCollapsed = enabled.groupCollapsed =
            bindConsoleFunction('groupCollapsed');
        utility.console.groupEnd = enabled.groupEnd =
            bindConsoleFunction('groupEnd');
        utility.console.info = enabled.info =
            bindConsoleFunction('info');
        utility.console.log = enabled.log =
            bindConsoleFunction('log');
        utility.console.time = enabled.time =
            bindConsoleFunction('time');
        utility.console.timeEnd = enabled.timeEnd =
            bindConsoleFunction('timeEnd');
        utility.console.trace = enabled.trace =
            bindConsoleFunction('trace');
        utility.console.warning = enabled.warning =
            bindConsoleFunction('warning');
        // Set console links for root/disabled
        enableConsole('async');
        disableConsole('compile');
        /*------------------------------------------------------------------
         * Enable a content-specific console
         */
        function enableConsole(name) {
            utility.console[name] =
                disabled[name] = enabled;
        }
        utility.enableConsole = enableConsole;
        /*------------------------------------------------------------------
         * Disable a content-specific console
         */
        function disableConsole(name) {
            utility.console[name] =
                disabled[name] = disabled;
        }
        utility.disableConsole = disableConsole;
    })(utility = hd.utility || (hd.utility = {}));
})(hd || (hd = {}));
/*####################################################################
 * Exports the "schedule" function, which schedules a function to be
 * executed at the next available time after the current line of
 * execution has finished -- effectively window.setTimeout( fn, 0 )
 * or the non-standard window.setImmediate( fn ).
 *
 * Two ways this is different from setTimeout( fn, 0 ):
 * 1. Guarantees that, if schedule( f ) is called before schedule( g )
 *    then f will be called before g.
 * 2. Supports associating a priority with a function (0 = highest
 *    priority; increasing number = decreasing priority); will always
 *    run higher priority function first regardless of when it was
 *    scheduled.
 */
var hd;
(function (hd) {
    var utility;
    (function (utility) {
        /*==================================================================
         * Remembers everything needed to perform a single requested
         * execution.
         */
        var ScheduledTask = (function () {
            function ScheduledTask(priority, fn, thisArg, params) {
                this.priority = priority;
                this.fn = fn;
                this.thisArg = thisArg;
                this.params = params;
            }
            ScheduledTask.prototype.run = function () {
                try {
                    this.fn.apply(this.thisArg, this.params);
                }
                catch (e) {
                    utility.console.error(e);
                }
            };
            return ScheduledTask;
        })();
        utility.ScheduledTask = ScheduledTask;
        /*==================================================================
         * Invoke the next scheduled task
         */
        // queues, indexed by their priority
        var taskqueues = [];
        // total number of tasks queued up
        var taskcount = 0;
        // id of the current timeout
        var timerId = null;
        function runTasks() {
            do {
                var task = null;
                // get the next task from the first non-empty queue
                for (var i = 0; task === null && i < taskqueues.length; ++i) {
                    var queue = taskqueues[i];
                    if (queue && queue.isNotEmpty()) {
                        task = queue.dequeue();
                    }
                }
                // run the task
                if (task) {
                    task.run();
                    --taskcount;
                }
                else {
                    taskcount = 0;
                }
            } while (taskcount > 0);
            if (taskcount) {
                timerId = setTimeout(runTasks, 0);
            }
            else {
                timerId = null;
            }
        }
        /*==================================================================
         * Schedule a function to be run later.
         */
        function schedule(priority, fn, thisArg) {
            var params = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                params[_i - 3] = arguments[_i];
            }
            if (priority < 0) {
                try {
                    fn.apply(thisArg, params);
                }
                catch (e) {
                    utility.console.error(e);
                }
                return null;
            }
            else {
                var task = new ScheduledTask(priority, fn, thisArg, params);
                // add the task to the approriate queue
                var queue = taskqueues[priority];
                if (queue === undefined) {
                    queue = taskqueues[priority] = new utility.Queue();
                }
                queue.enqueue(task);
                ++taskcount;
                // set timer to run all scheduled tasks
                if (!timerId) {
                    timerId = setTimeout(runTasks, 0);
                }
                return task;
            }
        }
        utility.schedule = schedule;
        function deschedule(task) {
            var queue = taskqueues[task.priority];
            if (queue) {
                queue.remove(task);
            }
        }
        utility.deschedule = deschedule;
    })(utility = hd.utility || (hd.utility = {}));
})(hd || (hd = {}));
//# sourceMappingURL=utility.js.mapvar __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/*####################################################################
 * Interfaces related to Observable design pattern.
 */
var hd;
(function (hd) {
    var reactive;
    (function (reactive) {
        reactive.ObservablePriority = -1;
        /*==================================================================
         */
        var ProxyObserver = (function () {
            function ProxyObserver(object, next_cb, error_cb, completed_cb, id) {
                this.object = object;
                this.next_cb = next_cb;
                this.error_cb = error_cb;
                this.completed_cb = completed_cb;
                this.id = id;
            }
            ProxyObserver.prototype.onNext = function (value) {
                if (this.next_cb) {
                    this.next_cb.call(this.object, value, this.id);
                }
            };
            ProxyObserver.prototype.onError = function (error) {
                if (this.error_cb) {
                    this.error_cb.call(this.object, error, this.id);
                }
            };
            ProxyObserver.prototype.onCompleted = function () {
                if (this.completed_cb) {
                    this.completed_cb.call(this.object, this.id);
                }
            };
            return ProxyObserver;
        })();
        reactive.ProxyObserver = ProxyObserver;
        /*==================================================================
         * Straightforward implementation of Observable.
         */
        var BasicObservable = (function () {
            function BasicObservable() {
            }
            /*----------------------------------------------------------------
             * Predicate to tell if anyone's listening
             */
            BasicObservable.prototype.hasObservers = function () {
                return this['#observers'].length > 0;
            };
            BasicObservable.prototype.addObserver = function (object, onNext, onError, onCompleted, id) {
                var observer;
                if (arguments.length == 1) {
                    observer = object;
                }
                else {
                    observer = new ProxyObserver(object, onNext, onError, onCompleted, id);
                }
                if (this.hasOwnProperty('#observers')) {
                    this['#observers'].push(observer);
                }
                else {
                    // copy on write
                    this['#observers'] = [observer];
                }
                return observer;
            };
            /*----------------------------------------------------------------
             * Cancel subscription by a particular observer.
             */
            BasicObservable.prototype.removeObserver = function (observer) {
                var removed = false;
                for (var i = this['#observers'].length; i >= 0; --i) {
                    var o = this['#observers'][i];
                    if (o === observer ||
                        (o instanceof ProxyObserver &&
                            o.object === observer)) {
                        this['#observers'].splice(i, 1);
                        removed = true;
                    }
                }
                return removed;
            };
            /*----------------------------------------------------------------
             * Send "next" event to all observers.
             */
            BasicObservable.prototype.sendNext = function (value) {
                this['#observers'].slice(0).forEach(function (observer) {
                    observer.onNext(value);
                    //u.schedule( ObservablePriority, observer.onNext, observer, value );
                });
            };
            /*----------------------------------------------------------------
             * Send "error" event to all observers.
             */
            BasicObservable.prototype.sendError = function (error) {
                this['#observers'].slice(0).forEach(function (observer) {
                    observer.onError(error);
                    //u.schedule( ObservablePriority, observer.onError, observer, error );
                });
            };
            /*----------------------------------------------------------------
             * Send "completed" event to all observers.
             */
            BasicObservable.prototype.sendCompleted = function () {
                this['#observers'].slice(0).forEach(function (observer) {
                    observer.onCompleted();
                    //u.schedule( ObservablePriority, observer.onCompleted, observer );
                });
                delete this['#observers'];
            };
            return BasicObservable;
        })();
        reactive.BasicObservable = BasicObservable;
        // Inherited empty observer list
        BasicObservable.prototype['#observers'] = [];
        /*==================================================================
         * Combine list of ovservables into a single observable
         */
        var Union = (function (_super) {
            __extends(Union, _super);
            /*----------------------------------------------------------------
             * Watch everything
             */
            function Union(sources) {
                _super.call(this);
                // Number of observables completed
                this.completedCount = 0;
                this.count = sources.length;
                sources.forEach(function (obs) {
                    obs.addObserver(this);
                });
            }
            /*----------------------------------------------------------------
             * Pass along.
             */
            Union.prototype.onNext = function (value) {
                this.sendNext(value);
            };
            /*----------------------------------------------------------------
             * Pass along.
             */
            Union.prototype.onError = function (error) {
                this.sendError(error);
            };
            /*----------------------------------------------------------------
             * Wait for the last; then pass along.
             */
            Union.prototype.onCompleted = function () {
                if (++this.completedCount == this.count) {
                    this.sendCompleted();
                }
            };
            return Union;
        })(BasicObservable);
        reactive.Union = Union;
    })(reactive = hd.reactive || (hd.reactive = {}));
})(hd || (hd = {}));
/*####################################################################
 * The ObservableProperty class.
 */
var hd;
(function (hd) {
    var reactive;
    (function (reactive) {
        var u = hd.utility;
        reactive.PropertyPriority = 3;
        var Scheduled;
        (function (Scheduled) {
            Scheduled[Scheduled["None"] = 0] = "None";
            Scheduled[Scheduled["Init"] = 1] = "Init";
            Scheduled[Scheduled["Update"] = 2] = "Update";
        })(Scheduled || (Scheduled = {}));
        ;
        /*==================================================================
         * An observable value that belongs to an object.
         */
        var ObservableProperty = (function (_super) {
            __extends(ObservableProperty, _super);
            /*----------------------------------------------------------------
             * Initialize properties
             */
            function ObservableProperty(value, eq) {
                _super.call(this);
                // Is there an update currently scheduled?
                this.scheduled = Scheduled.None;
                this.needInit = null;
                this.value = value;
                if (eq) {
                    this.eq = eq;
                }
            }
            /*----------------------------------------------------------------
             * Used to schedule an "onNext" notification for either an
             * individual observer or else all observers.
             */
            ObservableProperty.prototype.scheduleUpdate = function () {
                if (this.scheduled === Scheduled.None) {
                    this.scheduled = Scheduled.Update;
                    u.schedule(reactive.PropertyPriority, this.update, this);
                }
                else {
                    this.scheduled = Scheduled.Update;
                }
            };
            ObservableProperty.prototype.scheduleInit = function (observer) {
                if (this.needInit) {
                    this.needInit.push(observer);
                }
                else {
                    this.needInit = [observer];
                }
                if (this.scheduled === Scheduled.None) {
                    this.scheduled = Scheduled.Init;
                    u.schedule(reactive.PropertyPriority, this.update, this);
                }
            };
            /*----------------------------------------------------------------
             * Sends "onNext" notification to some or all observers.
             */
            ObservableProperty.prototype.update = function () {
                // In case callbacks should modify this property, we store these locally and reset them
                var scheduled = this.scheduled;
                this.scheduled = Scheduled.None;
                var init = this.needInit;
                this.needInit = null;
                if (scheduled === Scheduled.Update) {
                    if (this.hasValue(this.lastUpdate)) {
                        scheduled = Scheduled.Init;
                    }
                    else {
                        this.lastUpdate = this.value;
                        this.sendNext(this.value);
                    }
                }
                if (scheduled === Scheduled.Init && init) {
                    init.forEach(function (observer) {
                        u.schedule(reactive.ObservablePriority, observer.onNext, observer, this.value);
                    }, this);
                }
            };
            ObservableProperty.prototype.addObserverInit = function (object, onNext, onError, onCompleted, id) {
                var added;
                if (arguments.length === 1) {
                    added = _super.prototype.addObserver.call(this, object);
                }
                else {
                    added = _super.prototype.addObserver.call(this, object, onNext, onError, onCompleted, id);
                }
                if (added && this.value !== undefined) {
                    this.scheduleInit(added);
                }
                return added;
            };
            /*----------------------------------------------------------------
             * Setter.  Sends a "next" notification if the value has changed.
             */
            ObservableProperty.prototype.set = function (value) {
                if (!this.hasValue(value)) {
                    this.value = value;
                    this.scheduleUpdate();
                }
            };
            /*----------------------------------------------------------------
             * Setter.  Sends a "next" notification no matter what.
             */
            ObservableProperty.prototype.hardSet = function (value) {
                this.value = value;
                this.scheduleUpdate();
            };
            /*----------------------------------------------------------------
             * Getter.
             */
            ObservableProperty.prototype.get = function () {
                return this.value;
            };
            /*----------------------------------------------------------------
             * Comparison.
             */
            ObservableProperty.prototype.hasValue = function (value) {
                if (this.eq) {
                    return this.eq(this.value, value);
                }
                else {
                    if (typeof value === "object") {
                        return false;
                    }
                    else {
                        return this.value === value;
                    }
                }
            };
            return ObservableProperty;
        })(reactive.BasicObservable);
        reactive.ObservableProperty = ObservableProperty;
    })(reactive = hd.reactive || (hd.reactive = {}));
})(hd || (hd = {}));
/*####################################################################
 * Extensions are Observers and Observables.  They take events
 * produced by an Observable, modify them somehow, and then pass them
 * on.
 */
var hd;
(function (hd) {
    var reactive;
    (function (reactive) {
        /*==================================================================
         * Base class - simply take an event and pass it on.
         *
         * Derived classes can simply modify any events that are needed.
         */
        var Extension = (function (_super) {
            __extends(Extension, _super);
            function Extension() {
                _super.apply(this, arguments);
            }
            Extension.prototype.onNext = function (value) {
                this.sendNext(value);
            };
            Extension.prototype.onError = function (error) {
                this.sendError(error);
            };
            Extension.prototype.onCompleted = function () {
                this.sendCompleted();
            };
            return Extension;
        })(reactive.BasicObservable);
        reactive.Extension = Extension;
        /*------------------------------------------------------------------
         * Creates an extension from a single transformation function.
         */
        var FunctionExtension = (function (_super) {
            __extends(FunctionExtension, _super);
            function FunctionExtension(fn, boundArgs) {
                _super.call(this);
                this.fn = (boundArgs && boundArgs.length) ? fn.bind.apply(fn, [null].concat(boundArgs)) : fn;
            }
            FunctionExtension.prototype.onNext = function (value) {
                try {
                    this.sendNext(this.fn(value));
                }
                catch (e) {
                    this.sendError(e);
                }
            };
            FunctionExtension.prototype.onError = function (error) {
                this.sendError(error);
            };
            FunctionExtension.prototype.onCompleted = function () {
                this.sendCompleted();
            };
            return FunctionExtension;
        })(Extension);
        reactive.FunctionExtension = FunctionExtension;
        /*==================================================================
         * Basically a linked list of extensions, treated as a single
         * extension.  Can be empty, in which case it just acts as a
         * pass-through.
         */
        var Chain = (function (_super) {
            __extends(Chain, _super);
            /*----------------------------------------------------------------
             * Link together
             */
            function Chain(exts) {
                _super.call(this);
                this.exts = exts = exts ? exts.slice(0) : [];
                for (var i = 1, l = exts.length; i < l; ++i) {
                    exts[i - 1].addObserver(exts[i]);
                }
                if (i > 1) {
                    this.forward(exts[l - 1]);
                }
            }
            /*----------------------------------------------------------------
             * Observe and pass on.
             */
            Chain.prototype.forward = function (ext) {
                ext.addObserver(this, this.sendNext, this.sendError, this.sendCompleted);
            };
            /*----------------------------------------------------------------
             * Pass values to head of the list.
             */
            Chain.prototype.onNext = function (value) {
                if (this.exts.length) {
                    this.exts[0].onNext(value);
                }
                else {
                    this.sendNext(value);
                }
            };
            /*----------------------------------------------------------------
             * Pass errors to head of the list.
             */
            Chain.prototype.onError = function (error) {
                if (this.exts.length) {
                    this.exts[0].onError(error);
                }
                else {
                    this.sendError(error);
                }
            };
            /*----------------------------------------------------------------
             * Pass completed to head of the list.
             */
            Chain.prototype.onCompleted = function () {
                if (this.exts.length) {
                    this.exts[0].onCompleted();
                }
                else {
                    this.sendCompleted();
                }
            };
            /*----------------------------------------------------------------
             * Add new extension to the tail of the list
             */
            Chain.prototype.push = function (ext) {
                if (this.exts.length) {
                    var last = this.exts[this.exts.length - 1];
                    last.removeObserver(this);
                    last.addObserver(ext);
                }
                this.forward(ext);
                this.exts.push(ext);
            };
            /*----------------------------------------------------------------
             * Remove extension from the tail of the list
             */
            Chain.prototype.pop = function () {
                if (this.exts.length) {
                    var ext = this.exts.pop();
                    ext.removeObserver(this);
                    if (this.exts.length) {
                        this.forward(this.exts[this.exts.length - 1]);
                    }
                }
                return ext;
            };
            /*----------------------------------------------------------------
             * Add new extension to the head of the list
             */
            Chain.prototype.unshift = function (ext) {
                if (this.exts.length) {
                    ext.addObserver(this.exts[0]);
                }
                else {
                    this.forward(ext);
                }
                this.exts.unshift(ext);
            };
            /*----------------------------------------------------------------
             * Remove extension from the tail of the list
             */
            Chain.prototype.shift = function () {
                if (this.exts.length) {
                    var ext = this.exts.shift();
                    if (this.exts.length) {
                        ext.removeObserver(this.exts[0]);
                    }
                    else {
                        ext.removeObserver(this);
                    }
                }
                return ext;
            };
            return Chain;
        })(reactive.BasicObservable);
        reactive.Chain = Chain;
        var HotSwap = (function (_super) {
            __extends(HotSwap, _super);
            function HotSwap(source) {
                _super.call(this);
                this.source = source;
                this.target = null;
                source.addObserverInit(this, this.onNextTarget, null, null);
            }
            HotSwap.prototype.addObserverInit = function () {
                var o = _super.prototype.addObserver.apply(this, arguments);
                if (this.last) {
                    o.onNext(this.last);
                }
                return o;
            };
            HotSwap.prototype.onNextTarget = function (target) {
                if (this.target) {
                    this.target.removeObserver(this);
                }
                this.target = target;
                if (this.target) {
                    target.addObserverInit(this, this.onTargetNext, this.onTargetError, this.onTargetCompleted);
                }
            };
            HotSwap.prototype.onNext = function (value) {
                if (this.target) {
                    this.target.onNext(value);
                }
            };
            HotSwap.prototype.onError = function (error) {
                if (this.target) {
                    this.target.onError(error);
                }
            };
            HotSwap.prototype.onCompleted = function () {
                if (this.target) {
                    this.target.onCompleted();
                }
            };
            HotSwap.prototype.onTargetNext = function (value) {
                this.last = value;
                this.sendNext(value);
            };
            HotSwap.prototype.onTargetError = function (error) {
                this.sendError(error);
            };
            HotSwap.prototype.onTargetCompleted = function () {
                this.sendCompleted();
                this.target = null;
            };
            return HotSwap;
        })(reactive.BasicObservable);
        reactive.HotSwap = HotSwap;
        /*==================================================================
         */
        var Delay = (function (_super) {
            __extends(Delay, _super);
            function Delay(time_ms) {
                _super.call(this);
                this.time_ms = time_ms;
            }
            Delay.prototype.onNext = function (value) {
                setTimeout(this.sendNext.bind(this, value), this.time_ms);
            };
            Delay.prototype.onError = function (error) {
                setTimeout(this.sendError.bind(this, error), this.time_ms);
            };
            Delay.prototype.onCompleted = function () {
                setTimeout(this.sendCompleted.bind(this), this.time_ms);
            };
            return Delay;
        })(Extension);
        reactive.Delay = Delay;
        /*==================================================================
         * Cuts down the number of events produced.  When it receives an
         * event, it waits a specified amount of time.  If other events come
         * in during that time period then it discards the first event; if
         * not, then it passes it on.
         */
        var StabilizerState;
        (function (StabilizerState) {
            StabilizerState[StabilizerState["None"] = 0] = "None";
            StabilizerState[StabilizerState["Next"] = 1] = "Next";
            StabilizerState[StabilizerState["Error"] = 2] = "Error";
        })(StabilizerState || (StabilizerState = {}));
        ;
        var Stabilizer = (function (_super) {
            __extends(Stabilizer, _super);
            /*----------------------------------------------------------------
             * Initialize
             */
            function Stabilizer(time_ms, flush) {
                if (time_ms === void 0) { time_ms = 400; }
                _super.call(this);
                // What event we are waiting on
                this.state = StabilizerState.None;
                // The timer id for the event we are waiting on
                this.task = null;
                this.time = time_ms;
                this.flush = flush;
                // Make personalized version of this callback which
                //   always invokes on this object
                this.onTimeout = this.onTimeout.bind(this);
            }
            /*----------------------------------------------------------------
             * Throw away any events currently being waited on, and wait on
             * this one.
             */
            Stabilizer.prototype.onNext = function (value) {
                if (this.flush !== undefined && value === this.flush) {
                    if (this.task) {
                        clearTimeout(this.task);
                        this.onTimeout();
                    }
                }
                else {
                    this.state = StabilizerState.Next;
                    this.arg = value;
                    if (this.task) {
                        clearTimeout(this.task);
                    }
                    this.task = setTimeout(this.onTimeout, this.time);
                }
            };
            /*----------------------------------------------------------------
             * Throw away any events currently being waited on, and wait on
             * this one.
             */
            Stabilizer.prototype.onError = function (error) {
                this.state = StabilizerState.Error;
                this.arg = error;
                if (this.task) {
                    clearTimeout(this.task);
                }
                this.task = setTimeout(this.onTimeout, this.time);
            };
            /*----------------------------------------------------------------
             * Fire any events currently being waited on, and then the
             * "completed" event.
             */
            Stabilizer.prototype.onCompleted = function () {
                if (this.task) {
                    clearTimeout(this.task);
                    this.onTimeout();
                }
                this.sendCompleted();
            };
            /*----------------------------------------------------------------
             * Done waiting - fire the event being waited on
             */
            Stabilizer.prototype.onTimeout = function () {
                if (this.state == StabilizerState.Next) {
                    this.sendNext(this.arg);
                }
                else if (this.state == StabilizerState.Error) {
                    this.sendError(this.arg);
                }
                this.state = StabilizerState.None;
                this.task = null;
            };
            return Stabilizer;
        })(Extension);
        reactive.Stabilizer = Stabilizer;
        /*==================================================================
         */
        var ReplaceError = (function (_super) {
            __extends(ReplaceError, _super);
            function ReplaceError(replacement) {
                _super.call(this);
                this.replacement = replacement;
            }
            ReplaceError.prototype.onError = function (value) {
                this.sendError(this.replacement);
            };
            return ReplaceError;
        })(Extension);
        reactive.ReplaceError = ReplaceError;
        var Required = (function (_super) {
            __extends(Required, _super);
            function Required() {
                _super.apply(this, arguments);
            }
            Required.prototype.onNext = function (value) {
                if (value === undefined || value === null || value === '') {
                    this.sendError('Required');
                }
                else {
                    this.sendNext(value);
                }
            };
            return Required;
        })(Extension);
        reactive.Required = Required;
        var Default = (function (_super) {
            __extends(Default, _super);
            function Default(defaultValue) {
                _super.call(this);
                this.defaultValue = defaultValue;
            }
            Default.prototype.onNext = function (value) {
                if (value === undefined || value === null || value === '') {
                    this.sendNext(this.defaultValue);
                }
                else {
                    this.sendNext(value);
                }
            };
            Default.prototype.onError = function () {
                this.sendNext(this.defaultValue);
            };
            return Default;
        })(Extension);
        reactive.Default = Default;
        /*==================================================================
         * Convert value to string using toString method.
         */
        var ToString = (function (_super) {
            __extends(ToString, _super);
            function ToString() {
                _super.apply(this, arguments);
            }
            ToString.prototype.onNext = function (value) {
                if (value === undefined || value === null) {
                    this.sendNext("");
                }
                else {
                    this.sendNext(value.toString());
                }
            };
            return ToString;
        })(Extension);
        reactive.ToString = ToString;
        /*==================================================================
         * Convert value to JSON string.
         */
        var ToJson = (function (_super) {
            __extends(ToJson, _super);
            function ToJson() {
                _super.apply(this, arguments);
            }
            ToJson.prototype.onNext = function (value) {
                this.sendNext(JSON.stringify(value));
            };
            return ToJson;
        })(Extension);
        reactive.ToJson = ToJson;
        /*==================================================================
         * Round number to specified number of digits after decimal point.
         */
        var Round = (function (_super) {
            __extends(Round, _super);
            function Round(places) {
                if (places === void 0) { places = 0; }
                _super.call(this);
                this.scale = 1;
                if (places < 0) {
                    for (var i = 0, l = places; i > l; --i) {
                        this.scale /= 10;
                    }
                }
                else {
                    for (var i = 0, l = places; i < l; ++i) {
                        this.scale *= 10;
                    }
                }
            }
            Round.prototype.onNext = function (value) {
                this.sendNext(Math.round(value * this.scale) / this.scale);
            };
            return Round;
        })(Extension);
        reactive.Round = Round;
        /*==================================================================
         * Convert number to string with fixed number of decimal places.
         */
        var NumberToFixed = (function (_super) {
            __extends(NumberToFixed, _super);
            function NumberToFixed(places) {
                _super.call(this);
                this.places = places;
            }
            NumberToFixed.prototype.onNext = function (value) {
                this.sendNext(value.toFixed(this.places));
            };
            return NumberToFixed;
        })(Extension);
        reactive.NumberToFixed = NumberToFixed;
        /*==================================================================
         * Convert number to string with given precision.
         */
        var NumberToPrecision = (function (_super) {
            __extends(NumberToPrecision, _super);
            function NumberToPrecision(sigfigs) {
                _super.call(this);
                this.sigfigs = sigfigs;
            }
            NumberToPrecision.prototype.onNext = function (value) {
                this.sendNext(value.toPrecision(this.sigfigs));
            };
            return NumberToPrecision;
        })(Extension);
        reactive.NumberToPrecision = NumberToPrecision;
        /*==================================================================
         * Convert number to fixed using exponential notation.
         */
        var NumberToExponential = (function (_super) {
            __extends(NumberToExponential, _super);
            function NumberToExponential(places) {
                _super.call(this);
                this.places = places;
            }
            NumberToExponential.prototype.onNext = function (value) {
                this.sendNext(value.toExponential(this.places));
            };
            return NumberToExponential;
        })(Extension);
        reactive.NumberToExponential = NumberToExponential;
        /*==================================================================
         * Convert string value to number.
         */
        var ToNumber = (function (_super) {
            __extends(ToNumber, _super);
            function ToNumber() {
                _super.apply(this, arguments);
            }
            ToNumber.prototype.onNext = function (value) {
                var n = Number(value);
                if (value == '' || isNaN(n) || n === Infinity) {
                    this.sendError("Invalid number");
                }
                else {
                    this.sendNext(n);
                }
            };
            return ToNumber;
        })(Extension);
        reactive.ToNumber = ToNumber;
        /*==================================================================
         * Scale a number by a constant factor.
         */
        var ScaleNumber = (function (_super) {
            __extends(ScaleNumber, _super);
            function ScaleNumber(scale) {
                _super.call(this);
                this.scale = 1;
                this.scale = scale;
            }
            ScaleNumber.prototype.onNext = function (value) {
                this.sendNext(this.scale * value);
            };
            return ScaleNumber;
        })(Extension);
        reactive.ScaleNumber = ScaleNumber;
        /*==================================================================
         * Convert value to date.
         */
        var ToDate = (function (_super) {
            __extends(ToDate, _super);
            function ToDate() {
                _super.apply(this, arguments);
            }
            ToDate.prototype.onNext = function (value) {
                var d;
                if (value == '' || isNaN((d = new Date(value)).getTime())) {
                    this.sendError("Invalid date");
                }
                else {
                    this.sendNext(d);
                }
            };
            return ToDate;
        })(Extension);
        reactive.ToDate = ToDate;
        /*==================================================================
         * Convert date value to string.
         */
        var DateToString = (function (_super) {
            __extends(DateToString, _super);
            function DateToString() {
                _super.apply(this, arguments);
            }
            DateToString.prototype.onNext = function (value) {
                this.sendNext(value ? value.toLocaleString() : '');
            };
            return DateToString;
        })(Extension);
        reactive.DateToString = DateToString;
        /*==================================================================
         */
        var DateToDateString = (function (_super) {
            __extends(DateToDateString, _super);
            function DateToDateString() {
                _super.apply(this, arguments);
            }
            DateToDateString.prototype.onNext = function (value) {
                this.sendNext(value ? value.toLocaleDateString() : '');
            };
            return DateToDateString;
        })(Extension);
        reactive.DateToDateString = DateToDateString;
        /*==================================================================
         */
        var DateToTimeString = (function (_super) {
            __extends(DateToTimeString, _super);
            function DateToTimeString() {
                _super.apply(this, arguments);
            }
            DateToTimeString.prototype.onNext = function (value) {
                this.sendNext(value ? value.toLocaleTimeString() : '');
            };
            return DateToTimeString;
        })(Extension);
        reactive.DateToTimeString = DateToTimeString;
        /*==================================================================
         * Converts milliseconds to date string.
         */
        var DateToMilliseconds = (function (_super) {
            __extends(DateToMilliseconds, _super);
            function DateToMilliseconds() {
                _super.apply(this, arguments);
            }
            DateToMilliseconds.prototype.onNext = function (value) {
                this.sendNext(value ? value.getTime() : 0);
            };
            return DateToMilliseconds;
        })(Extension);
        reactive.DateToMilliseconds = DateToMilliseconds;
        /*==================================================================
         */
        var MillisecondsToDate = (function (_super) {
            __extends(MillisecondsToDate, _super);
            function MillisecondsToDate() {
                _super.apply(this, arguments);
            }
            MillisecondsToDate.prototype.onNext = function (value) {
                this.sendNext(new Date(value));
            };
            return MillisecondsToDate;
        })(Extension);
        reactive.MillisecondsToDate = MillisecondsToDate;
        /*==================================================================
         */
        var Offset = (function (_super) {
            __extends(Offset, _super);
            function Offset(dx, dy) {
                _super.call(this);
                this.dx = dx;
                this.dy = dy;
            }
            Offset.prototype.onNext = function (value) {
                this.sendNext({ x: value.x + this.dx, y: value.y + this.dy });
            };
            return Offset;
        })(Extension);
        reactive.Offset = Offset;
        /*==================================================================
         */
        var PointToString = (function (_super) {
            __extends(PointToString, _super);
            function PointToString() {
                _super.apply(this, arguments);
            }
            PointToString.prototype.onNext = function (value) {
                this.sendNext('(' + value.x + ', ' + value.y + ')');
            };
            return PointToString;
        })(Extension);
        reactive.PointToString = PointToString;
    })(reactive = hd.reactive || (hd.reactive = {}));
})(hd || (hd = {}));
/*####################################################################
 * This is an implementation of the Promises/A+ standard.  See
 *   http://promisesaplus.com/
 * The entire spec is implemented.  Additionally, I have added extra
 * functionality in response to needs of our particular library.
 * Extra features are:
 *
 * 1.) Promise doubles as an Observable.  It issues an onNext for each
 *     notification.  If promise is fulfilled, it issues an onNext
 *     followed by an onCompleted.  If promise is rejected, it issues
 *     an onError followed by an onCompleted.
 *
 * 2.) Promise has an observable event named "ondropped".  This event
 *     sends onNext any time the last dependency of a promise is
 *     removed --- i.e., whenever the promise has a single dependency,
 *     and "removeDependency" is called to remove it.  Notes:
 *
 *     - A dependency is different from an observer.  This event fires
 *       only when the last dependency is removed, regardless of
 *       whether or not there are observers.
 *
 *     - When a promise is settled, the event sends onCompleted.
 *
 *     - The value sent for onNext is the promise itself.
 *
 * 3.) Promise is an Observer<Promise>.  Any promise received is
 *     immediately removed as a dependency.  Thus, given two promises,
 *     p and q, the following code:
 *
 *         p.addDependency( q );
 *         q.ondropped.addObserver( p );
 *
 *     has the this effect: If p is settled, the result passes on to
 *     q.  If q ever fires an ondropped event, then it is removed as a
 *     dependency from p.
 */
var hd;
(function (hd) {
    var reactive;
    (function (reactive) {
        var u = hd.utility;
        reactive.PromisePriority = 2;
        reactive.DroppedPriority = 1;
        /*==================================================================
         * Private type associating a dependency with the promise for the
         * dependency's value.
         */
        var DependencyBinding = (function () {
            function DependencyBinding(object, fulfilled_cb, rejected_cb, progress_cb, id, promise) {
                this.object = object;
                this.fulfilled_cb = fulfilled_cb;
                this.rejected_cb = rejected_cb;
                this.progress_cb = progress_cb;
                this.id = id;
                this.promise = promise;
            }
            DependencyBinding.prototype.onFulfilled = function (value) {
                if (this.fulfilled_cb) {
                    callHandler(this.fulfilled_cb, this.object, value, this.id, this.promise // result resolves this prmoise
                    );
                }
                else if (this.promise) {
                    this.promise.resolve(value); // Must assume T == U
                }
            };
            DependencyBinding.prototype.onRejected = function (reason) {
                if (this.rejected_cb) {
                    callHandler(this.rejected_cb, this.object, reason, this.id, this.promise // result resolves this promise
                    );
                }
                else if (this.promise) {
                    this.promise.reject(reason);
                }
            };
            DependencyBinding.prototype.onProgress = function (value) {
                if (this.progress_cb) {
                    callHandler(this.progress_cb, this.object, value, this.id, undefined // result resolves this promise
                    );
                }
            };
            return DependencyBinding;
        })();
        /*==================================================================
         * Private enum for promise state
         */
        (function (State) {
            State[State["Pending"] = 0] = "Pending";
            State[State["Fulfilled"] = 1] = "Fulfilled";
            State[State["Rejected"] = 2] = "Rejected";
        })(reactive.State || (reactive.State = {}));
        var State = reactive.State;
        (function (Usage) {
            Usage[Usage["Unknown"] = 0] = "Unknown";
            Usage[Usage["Used"] = 1] = "Used";
            Usage[Usage["Unused"] = 2] = "Unused";
            Usage[Usage["Delayed"] = 3] = "Delayed";
        })(reactive.Usage || (reactive.Usage = {}));
        var Usage = reactive.Usage;
        ;
        /*==================================================================
         * Implementation of Promises/A+.
         */
        var Promise = (function (_super) {
            __extends(Promise, _super);
            /*----------------------------------------------------------------
             * Option to create promise already fulfilled.
             */
            function Promise(value) {
                _super.call(this);
                // State of the promise
                this.state = State.Pending;
                // Whether this promise has been resolved with another promise
                this.open = true;
                // Promise usage
                this.usage = new reactive.ObservableProperty(Usage.Unknown);
                // Event fired when promise loses all observers
                this.ondropped = new reactive.BasicObservable();
                if (arguments.length > 0) {
                    this.resolve(value);
                }
            }
            /*----------------------------------------------------------------
             * State inspection methods.
             */
            Promise.prototype.isFulfilled = function () {
                return this.state === State.Fulfilled;
            };
            Promise.prototype.isRejected = function () {
                return this.state === State.Rejected;
            };
            Promise.prototype.isPending = function () {
                return this.state === State.Pending;
            };
            Promise.prototype.isSettled = function () {
                return this.state !== State.Pending;
            };
            Promise.prototype.hasValue = function () {
                return 'value' in this;
            };
            Promise.prototype.inspect = function () {
                if (this.state === State.Fulfilled) {
                    return { state: 'fulfilled', value: this.value };
                }
                else if (this.state === State.Rejected) {
                    return { state: 'rejected', reason: this.reason };
                }
                else {
                    if ('value' in this) {
                        return { state: 'pending', value: this.value };
                    }
                    else {
                        return { state: 'pending' };
                    }
                }
            };
            Promise.prototype.addDependency = function (object, onFulfilled, onRejected, onProgress, id) {
                var dependency;
                if (arguments.length == 1) {
                    dependency = object;
                }
                else {
                    dependency =
                        new DependencyBinding(object, onFulfilled, onRejected, onProgress, id);
                }
                if (this.state !== State.Pending) {
                    u.schedule(reactive.PromisePriority, this.dischargeDependency, this, dependency);
                }
                else {
                    // Debug info
                    if (reactive.plogger && this.dependencies.length == 0) {
                        reactive.plogger.nowHasDependencies(this);
                    }
                    if (this.hasOwnProperty('dependencies')) {
                        this.dependencies.push(dependency);
                    }
                    else {
                        // copy on write
                        this.dependencies = [dependency];
                    }
                }
                if (this.usage.get() === Usage.Unknown) {
                    this.usage.set(Usage.Used);
                }
                return dependency;
            };
            Promise.prototype.bindDependency = function (promise, object, onFulfilled, onRejected, onProgress, id) {
                var binding;
                if (arguments.length < 3) {
                    var d = object;
                    binding = this.addDependency(object, d.onFulfilled, d.onRejected, d.onProgress);
                }
                else {
                    binding = this.addDependency(object, onFulfilled, onRejected, onProgress, id);
                }
                binding.promise = promise;
                return binding;
            };
            /*----------------------------------------------------------------
             * Unsubscribe a dependency.
             *
             * Note that this implementation does not watch for duplicate
             * dependencies; this will only remove a single subscription of
             * the dependency.  If a dependency has been added multiple times
             * then it must be removed multiple times.
             */
            Promise.prototype.removeDependency = function (object) {
                var found = false;
                for (var i = this.dependencies.length - 1; i >= 0; --i) {
                    var d = this.dependencies[i];
                    if (d === object ||
                        (d instanceof DependencyBinding &&
                            d.object === object)) {
                        this.dependencies.splice(i, 1);
                        // Check to see if this promise is dropped
                        if (this.dependencies.length == 0) {
                            // Debug info
                            if (reactive.plogger) {
                                reactive.plogger.lostAllDependencies(this);
                            }
                            u.schedule(reactive.DroppedPriority, this.ondropped.sendNext, this.ondropped, this);
                        }
                        found = true;
                    }
                }
                return found;
            };
            /*----------------------------------------------------------------
             */
            Promise.prototype.hasDependencies = function () {
                return this.dependencies.length > 0;
            };
            Promise.prototype.resolve = function (value) {
                if (this.open) {
                    this.resolveFirst(value);
                }
            };
            Promise.prototype.resolveFirst = function (value) {
                if (this.state === State.Pending) {
                    if (value === this) {
                        this.reject(new TypeError("Attempted to resolve a promise with itself"));
                    }
                    else {
                        if (value instanceof Promise) {
                            // When other promise resolves, we resolve
                            this.open = false;
                            value.addDependency(this);
                        }
                        else if ((typeof value === 'object' || typeof value === 'function') &&
                            typeof value.then === 'function') {
                            // Provides compatability with other promise implementations
                            this.open = false;
                            this.resolveThen(value);
                        }
                        else {
                            // A value fulfills the promise
                            this.fulfill(value);
                        }
                    }
                }
            };
            /*----------------------------------------------------------------
             * Resolves a value that is not a promise but does have a "then"
             * method.
             *
             * Basically this is a wrapper to make sure the "then" method
             * behaves like a promise: only resolves/rejects once; doesn't
             * throw exceptions
             */
            Promise.prototype.resolveThen = function (value) {
                var pending = true;
                var This = this;
                try {
                    value.then(function (value) {
                        if (pending) {
                            pending = false;
                            This.resolve(value);
                        }
                    }, function (reason) {
                        if (pending) {
                            pending = false;
                            This.reject(reason);
                        }
                    }, function (value) {
                        if (pending) {
                            This.notify(value);
                        }
                    });
                }
                catch (e) {
                    if (pending) {
                        pending = false;
                        This.reject(e);
                    }
                }
            };
            /*----------------------------------------------------------------
             * Called when resolving concluded we really have a value and
             * not a further promise.
             */
            Promise.prototype.fulfill = function (value) {
                this.state = State.Fulfilled;
                this.value = value;
                // Debug info
                if (reactive.plogger) {
                    reactive.plogger.isSettled(this);
                }
                // Notify dependencies
                var dependencies = this.dependencies;
                u.schedule(reactive.PromisePriority, function () {
                    for (var i = 0, l = dependencies.length; i < l; ++i) {
                        dependencies[i].onFulfilled(value);
                    }
                }, this);
                // Notify observers
                this.sendNext(value);
                // Clean up
                delete this.dependencies;
                this.sendCompleted();
                u.schedule(reactive.DroppedPriority, this.ondropped.sendCompleted, this.ondropped);
            };
            /*----------------------------------------------------------------
             * Rejects the promise with specified reason.
             */
            Promise.prototype.reject = function (reason) {
                if (this.open) {
                    this.rejectFirst(reason);
                }
            };
            Promise.prototype.rejectFirst = function (reason) {
                if (this.state === State.Pending) {
                    this.state = State.Rejected;
                    this.reason = reason;
                    delete this.value;
                    // Debug info
                    if (reactive.plogger) {
                        reactive.plogger.isSettled(this);
                    }
                    // Notify dependencies
                    var dependencies = this.dependencies;
                    u.schedule(reactive.PromisePriority, function () {
                        for (var i = 0, l = dependencies.length; i < l; ++i) {
                            dependencies[i].onRejected(reason);
                        }
                    }, this);
                    // Notify observers
                    this.sendError(reason);
                    // Clean up
                    delete this.dependencies;
                    this.sendCompleted();
                    u.schedule(reactive.DroppedPriority, this.ondropped.sendCompleted, this.ondropped);
                }
            };
            /*----------------------------------------------------------------
             * Called once promise has been resolved to notify dependency.
             */
            Promise.prototype.dischargeDependency = function (binding) {
                if (this.state === State.Fulfilled) {
                    binding.onFulfilled(this.value);
                }
                else if (this.state === State.Rejected) {
                    binding.onRejected(this.reason);
                }
            };
            /*----------------------------------------------------------------
             * Sends a progress value to all dependencies.
             *
             * This is basically an event: if you're not subscribed when it
             * fires then you just don't get it.
             */
            Promise.prototype.notify = function (value) {
                if (this.open) {
                    this.notifyFirst(value);
                }
            };
            Promise.prototype.notifyFirst = function (value) {
                if (this.state == State.Pending) {
                    this.value = value;
                    // Notify dependencies
                    var dependencies = this.dependencies;
                    u.schedule(reactive.PromisePriority, function () {
                        for (var i = 0, l = dependencies.length; i < l; ++i) {
                            dependencies[i].onProgress(value);
                        }
                    }, this);
                    // Notify observers
                    this.sendNext(value);
                }
            };
            Promise.prototype.then = function (onFulfilled, onRejected, onProgress) {
                if (typeof onFulfilled !== 'function') {
                    onFulfilled = null;
                }
                if (typeof onRejected !== 'function') {
                    onRejected = null;
                }
                if (typeof onProgress !== 'function') {
                    onProgress = null;
                }
                if (onFulfilled || onRejected || onProgress) {
                    var p = new Promise();
                    this.bindDependency(p, null, onFulfilled, onRejected, onProgress);
                    return p;
                }
                else {
                    return this;
                }
            };
            Promise.prototype.catch = function (onRejected) {
                if (typeof onRejected === 'function') {
                    var p = new Promise();
                    this.bindDependency(p, null, null, onRejected, null);
                    return p;
                }
                else {
                    return this;
                }
            };
            /*----------------------------------------------------------------
             * Chaining based approach to dependencies.
             *
             * Creates a new dependency with the specified onProgress
             * callback; returns a promise for that dependency's value.
             */
            Promise.prototype.progress = function (onProgress) {
                if (typeof onProgress === 'function') {
                    var p = new Promise();
                    this.bindDependency(p, null, null, null, onProgress);
                    return p;
                }
                else {
                    return this;
                }
            };
            Promise.prototype.onError = function () { };
            Promise.prototype.onCompleted = function () { };
            Promise.all = function () {
                if (arguments.length) {
                    var final = new Promise();
                    var values = [];
                    var count = 0;
                    var length = arguments.length;
                    var update = function (i, v) {
                        values[i] = v;
                        if (++count == length) {
                            final.resolve(values);
                        }
                    };
                    for (var i = 0; i < arguments.length; ++i) {
                        signup(arguments[i], i, update);
                    }
                }
                else {
                    var final = new Promise([]);
                }
                return final;
            };
            return Promise;
        })(reactive.BasicObservable);
        reactive.Promise = Promise;
        Promise.prototype.onFulfilled = Promise.prototype.resolveFirst;
        Promise.prototype.onRejected = Promise.prototype.rejectFirst;
        Promise.prototype.onProgress = Promise.prototype.notifyFirst;
        Promise.prototype.onNext = Promise.prototype.removeDependency;
        // Inherited empty dependency list
        Promise.prototype['dependencies'] = [];
        /*================================================================--
         * Add a callback to f to promise p.
         */
        function signup(p, i, f) {
            p.then(function (v) {
                f(i, v);
            });
        }
        /*==================================================================
         * Function to call a handler on a dependency.
         */
        function callHandler(handler, dependency, value, id, promise) {
            try {
                var result = handler.call(dependency, value, id);
                if (promise) {
                    promise.resolve(result);
                }
            }
            catch (e) {
                console.warn(e);
                if (promise) {
                    promise.reject(e);
                }
            }
        }
    })(reactive = hd.reactive || (hd.reactive = {}));
})(hd || (hd = {}));
/*####################################################################
* Defines PromiseLadder, which converts a sequence of promises into
* a single observable.
*/
var hd;
(function (hd) {
    var reactive;
    (function (reactive) {
        /*==================================================================
         * Converts a sequence of promises into a single observable by
         * firing on fulfilled promises only if no more recent promises
         * have fulfilled.  So, once a promise is fulfilled, any older
         * promises are dropped.
         *
         * Invariant:  entries[0].state == 'fulfilled' || entries[0].state == 'rejected'
         */
        var PromiseLadder = (function (_super) {
            __extends(PromiseLadder, _super);
            /*----------------------------------------------------------------
             * Initialize
             */
            function PromiseLadder() {
                _super.call(this);
                var p = new reactive.Promise();
                if (reactive.plogger) {
                    reactive.plogger.register(p, 'ladder', 'ladder initialization');
                }
                p.resolve(undefined);
                this.entries = [{ promise: p,
                        state: 'fulfilled',
                        value: undefined
                    }
                ];
            }
            /*----------------------------------------------------------------
             * Is there any possibility the value will change (assuming no
             * further promises are added)?
             */
            PromiseLadder.prototype.isSettled = function () {
                var i = this.entries.length - 1;
                while (this.entries[i].state === 'failed') {
                    --i;
                }
                return this.entries[i].state !== 'pending';
            };
            /*----------------------------------------------------------------
             */
            PromiseLadder.prototype.currentFailed = function () {
                return this.entries[this.entries.length - 1].state === 'failed';
            };
            /*----------------------------------------------------------------
             * Get the most recent promise on the ladder.
             */
            PromiseLadder.prototype.getCurrentPromise = function () {
                return this.entries[this.entries.length - 1].promise;
            };
            /*----------------------------------------------------------------
             * Get a promise forwarded from most recent promise
             */
            PromiseLadder.prototype.forwardPromise = function (forward) {
                var last = this.entries.length - 1;
                // Try to forward
                if (!this.tryToForward(forward, last)) {
                    forward.ondropped.addObserver(this, this.onForwardDropped, null, null, this.entries[last].promise);
                    // If fails, add to forward list
                    if (!this.entries[last].forwards) {
                        this.entries[last].forwards = [forward];
                    }
                    else {
                        this.entries[last].forwards.push(forward);
                    }
                }
                return forward;
            };
            /*----------------------------------------------------------------
             */
            PromiseLadder.prototype.findPromiseIndex = function (p) {
                for (var i = 0, l = this.entries.length; i < l; ++i) {
                    if (this.entries[i].promise === p) {
                        return i;
                    }
                }
                return -1;
            };
            /*----------------------------------------------------------------
             * Find most recent entry to produce results.
             * "Results" means either fulfilled, rejected, or pending with a
             * notification.
             */
            PromiseLadder.prototype.getMostRecent = function () {
                for (var i = this.entries.length - 1; i >= 0; --i) {
                    var entry = this.entries[i];
                    var state = entry.state;
                    if (state === 'fulfilled' ||
                        state === 'rejected' ||
                        (state === 'pending' && 'value' in entry)) {
                        break;
                    }
                }
                return i;
            };
            /*----------------------------------------------------------------
             * Add new promises to the ladder.
             */
            PromiseLadder.prototype.addPromise = function (promise) {
                // Add promise
                this.entries.push({ promise: promise, state: 'pending' });
                // Subscribe
                promise.addDependency(this, this.onPromiseFulfilled, this.onPromiseRejected, this.onPromiseProgress, promise);
            };
            /*----------------------------------------------------------------
             * Do work for fulfilled promise
             */
            PromiseLadder.prototype.onPromiseFulfilled = function (value, promise) {
                var i = this.findPromiseIndex(promise);
                if (i >= 0) {
                    this.entries[i].state = 'fulfilled';
                    this.entries[i].value = value;
                    if (this.getMostRecent() == i) {
                        this.sendNext(value);
                    }
                    this.updateForwardsStartingFrom(i);
                }
            };
            /*----------------------------------------------------------------
             * Do work for rejected promise
             */
            PromiseLadder.prototype.onPromiseRejected = function (reason, promise) {
                var i = this.findPromiseIndex(promise);
                if (i >= 0) {
                    // Differentiate between "rejected" and "failed"
                    if (reason === null || reason === undefined) {
                        this.entries[i].state = 'failed';
                        // Special case 1:  this promise previously produced a notification;
                        //   thus, we need to fall-back to the previous answer
                        var mostRecent = this.getMostRecent();
                        if ('value' in this.entries[i] && mostRecent < i) {
                            var entry = this.entries[mostRecent];
                            if (entry.state === 'rejected') {
                                this.sendNext(entry.reason);
                            }
                            else {
                                this.sendNext(entry.value);
                            }
                        }
                        else if (i == this.entries.length - 1) {
                            this.sendError(null);
                        }
                    }
                    else {
                        this.entries[i].state = 'rejected';
                        this.entries[i].reason = reason;
                        if (this.getMostRecent() == i) {
                            this.sendError(reason);
                        }
                    }
                    this.updateForwardsStartingFrom(i);
                }
            };
            /*----------------------------------------------------------------
             * Do work for promise notification
             */
            PromiseLadder.prototype.onPromiseProgress = function (value, promise) {
                var i = this.findPromiseIndex(promise);
                if (i >= 0) {
                    this.entries[i].value = value;
                    if (this.getMostRecent() == i) {
                        this.sendNext(value);
                    }
                    this.updateForwardsStartingFrom(i);
                }
            };
            /*----------------------------------------------------------------
             * Forwarded promise no longer needed
             */
            PromiseLadder.prototype.onForwardDropped = function (forward, promise) {
                var i = this.findPromiseIndex(promise);
                var forwards = this.entries[i].forwards;
                if (i >= 0 && forwards) {
                    var j = forwards.indexOf(forward);
                    if (j >= 0) {
                        if (forwards.length == 1) {
                            this.entries[i].forwards = undefined;
                            this.dropUnneededPromises();
                        }
                        else {
                            forwards.splice(j, 1);
                        }
                    }
                }
            };
            /*----------------------------------------------------------------
             * Try to perform all forwards starting at index i and continuing
             * up as long as promises were failed.
             */
            PromiseLadder.prototype.updateForwardsStartingFrom = function (i) {
                // Try to perform all forwards for this promise
                this.tryToForwardList(i, i);
                // Try to perform any forwards for more recent promises that have failed
                for (var j = i + 1, l = this.entries.length; j < l && this.entries[j].state === 'failed'; ++j) {
                    this.tryToForwardList(j, i);
                }
                // Clean up
                this.dropUnneededPromises();
            };
            /*----------------------------------------------------------------
             * Try to forward each promise on the list.  Returns list of
             * promises which could /not/ be forwarded.
             */
            PromiseLadder.prototype.tryToForwardList = function (target, start) {
                var forwards = this.entries[target].forwards;
                if (forwards) {
                    var remaining = [];
                    for (var i = 0, l = forwards.length; i < l; ++i) {
                        if (!this.tryToForward(forwards[i], start)) {
                            remaining.push(forwards[i]);
                        }
                    }
                    this.entries[target].forwards = remaining.length == 0 ? undefined : remaining;
                }
            };
            /*----------------------------------------------------------------
             * Try to settle forward using this.promises[i].  Returns true iff
             * forward was settled.
             */
            PromiseLadder.prototype.tryToForward = function (forward, i) {
                var entry = this.entries[i];
                if (entry.state === 'fulfilled') {
                    forward.resolve(entry.value);
                    return true;
                }
                if (entry.state === 'rejected') {
                    forward.reject(entry.reason);
                    return true;
                }
                if (entry.state === 'failed') {
                    return this.tryToForward(forward, i - 1);
                }
                if (entry.state === 'pending' && 'value' in entry) {
                    forward.notify(entry.value);
                }
                return false;
            };
            /*----------------------------------------------------------------
             * Drop all promises which are settled or which can no longer
             * affect the ladder value and have no forwards.
             */
            PromiseLadder.prototype.dropUnneededPromises = function () {
                var last = this.entries.length - 1;
                var removeAnswered = false;
                var removePending = false;
                for (var i = last; i >= 0; --i) {
                    var entry = this.entries[i];
                    var state = entry.state;
                    if (state === 'fulfilled' || state === 'rejected') {
                        if (removeAnswered) {
                            this.entries.splice(i, 1);
                        }
                        removeAnswered = true;
                        removePending = true;
                    }
                    else {
                        if (entry.forwards) {
                            removeAnswered = false;
                        }
                        else if (state === 'failed') {
                            if (i != last) {
                                this.entries.splice(i, 1);
                            }
                        }
                        else if (state === 'pending') {
                            if (removePending) {
                                this.entries.splice(i, 1);
                            }
                        }
                    }
                }
            };
            return PromiseLadder;
        })(reactive.BasicObservable);
        reactive.PromiseLadder = PromiseLadder;
    })(reactive = hd.reactive || (hd.reactive = {}));
})(hd || (hd = {}));
/*####################################################################
 * Lifting function over values to function over promises.
 */
var hd;
(function (hd) {
    var reactive;
    (function (reactive) {
        /*==================================================================
         * The actual lifting function.
         */
        function liftFunction(fn, numOutputs, mask) {
            if (numOutputs === void 0) { numOutputs = 1; }
            if (mask === void 0) { mask = null; }
            return function () {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i - 0] = arguments[_i];
                }
                var pack = new ParameterPack(parameters, mask);
                var fnCall = new SingleFunctionCall(fn, pack.promise, numOutputs);
                return (fnCall.outputPromises.length <= 1) ?
                    fnCall.outputPromises[0] : fnCall.outputPromises;
            };
        }
        reactive.liftFunction = liftFunction;
        /*==================================================================
         * Takes a Promise<any>[], and returns a Promise<any[]>.
         */
        var ParameterPack = (function () {
            /*----------------------------------------------------------------
             * Creates dependencies for each input promise
             */
            function ParameterPack(inputs, mask) {
                // The corresponding values produced by the input promises
                this.values = [];
                // How many input promises have been fulfilled
                this.numFulfilled = 0;
                var numInputs = inputs.length;
                this.inputs = inputs;
                this.values.length = numInputs;
                this.promise = new reactive.Promise();
                if (reactive.plogger) {
                    reactive.plogger.register(this.promise, 'parampack', 'parameter pack');
                }
                this.promise.ondropped.addObserver(this);
                if (numInputs) {
                    for (var i = 0; i < numInputs; ++i) {
                        if (mask && mask[i]) {
                            this.onParameterFulfilled(inputs[i], i);
                        }
                        else {
                            inputs[i].addDependency(this, this.onParameterFulfilled, this.onParameterRejected, this.onParameterProgress, i);
                        }
                    }
                }
                else {
                    this.promise.resolve(this.values);
                }
            }
            /*----------------------------------------------------------------
             * Set the corresponding value; fulfill or notify
             */
            ParameterPack.prototype.onParameterFulfilled = function (value, index) {
                this.values[index] = value;
                if (++this.numFulfilled == this.values.length) {
                    this.promise.resolve(this.values);
                }
                else {
                    this.promise.notify(this.values);
                }
            };
            /*----------------------------------------------------------------
             * If any parameter fails then we fail.
             */
            ParameterPack.prototype.onParameterRejected = function (reason, index) {
                this.promise.reject(null);
            };
            /*----------------------------------------------------------------
             * Set the corresponding value; notify
             */
            ParameterPack.prototype.onParameterProgress = function (value, index) {
                this.values[index] = value;
                this.promise.notify(this.values);
            };
            /*----------------------------------------------------------------
             * When parameters no longer needed, unsubscribe from all
             */
            ParameterPack.prototype.onNext = function () {
                this.inputs.forEach(function (p) {
                    p.removeDependency(this);
                }, this);
                this.promise.ondropped.removeObserver(this);
            };
            ParameterPack.prototype.onError = function () { };
            ParameterPack.prototype.onCompleted = function () { };
            return ParameterPack;
        })();
        reactive.ParameterPack = ParameterPack;
        /*==================================================================
         * Takes a function and a promise for an array of parameters,
         * returns a promise for the result of calling the function.
         * Only calls the function one time, once all parameters are ready.
         */
        var SingleFunctionCall = (function () {
            /*----------------------------------------------------------------
             * Subscribes to parameters; creates output promises
             */
            function SingleFunctionCall(fn, parameters, numOutputs) {
                // Promises for each output produced
                this.outputPromises = [];
                this.fn = fn;
                this.parameters = parameters;
                parameters.addDependency(this);
                for (var i = 0; i < numOutputs; ++i) {
                    var p = new reactive.Promise();
                    p.ondropped.addObserver(this);
                    this.outputPromises.push(p);
                }
            }
            /*----------------------------------------------------------------
             * Call the function and pass on results
             */
            SingleFunctionCall.prototype.onFulfilled = function (value) {
                var numOutputs = this.outputPromises.length;
                try {
                    var result = this.fn.apply(null, value);
                    if (numOutputs > 0) {
                        if (numOutputs == 1) {
                            result = [result];
                        }
                        else if (!Array.isArray(result)) {
                            throw new TypeError('Multi-output lifted function did not return array');
                        }
                    }
                    for (var i = 0; i < numOutputs; ++i) {
                        this.outputPromises[i].resolve(result[i]);
                        if (result[i] instanceof reactive.Promise && !result[i].isSettled()) {
                            this.outputPromises[i].ondropped.addObserver(result[i]);
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                    for (var i = 0; i < numOutputs; ++i) {
                        this.outputPromises[i].reject(e);
                    }
                }
            };
            /*----------------------------------------------------------------
             * If the parameters fail then the function fails
             */
            SingleFunctionCall.prototype.onRejected = function (reason) {
                var numOutputs = this.outputPromises.length;
                for (var i = 0; i < numOutputs; ++i) {
                    this.outputPromises[i].reject(reason);
                }
            };
            /*----------------------------------------------------------------
             * Ignore
             */
            SingleFunctionCall.prototype.onProgress = function () { };
            /*----------------------------------------------------------------
             * If everyone stops listening to the result, we cancel the call
             */
            SingleFunctionCall.prototype.onNext = function () {
                var anyRelevant = this.outputPromises.some(function (p) {
                    return p.hasDependencies();
                });
                if (!anyRelevant) {
                    this.parameters.removeDependency(this);
                    this.outputPromises.forEach(function (p) {
                        p.reject(null);
                    });
                }
            };
            // ignore
            SingleFunctionCall.prototype.onError = function () { };
            // ignore
            SingleFunctionCall.prototype.onCompleted = function () { };
            return SingleFunctionCall;
        })();
        reactive.SingleFunctionCall = SingleFunctionCall;
    })(reactive = hd.reactive || (hd.reactive = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var reactive;
    (function (reactive) {
        var u = hd.utility;
        var PromiseLogger = (function () {
            function PromiseLogger() {
                this.count = 1;
                this.outstanding = [];
            }
            PromiseLogger.prototype.register = function (p, tag, reason) {
                if (p.id) {
                    console.error('Logging problem: attempt to re-register promise ' + p.id);
                }
                else {
                    p.id = tag + '#' + this.count++;
                }
            };
            PromiseLogger.prototype.checkId = function (p) {
                if (!p.id) {
                    this.register(p, 'unknown');
                }
            };
            PromiseLogger.prototype.nowHasDependencies = function (p) {
                this.checkId(p);
                u.arraySet.add(this.outstanding, p);
                console.log('Promise expected: ' + p.id);
            };
            PromiseLogger.prototype.lostAllDependencies = function (p) {
                this.checkId(p);
                u.arraySet.remove(this.outstanding, p);
                console.log('Promise dropped:  ' + p.id);
            };
            PromiseLogger.prototype.isSettled = function (p) {
                this.checkId(p);
                u.arraySet.remove(this.outstanding, p);
                console.log('Promise settled:  ' + p.id);
            };
            PromiseLogger.prototype.report = function () {
                if (this.outstanding.length) {
                    console.log('Outstanding: ' +
                        this.outstanding.map(function (p) {
                            return p.id;
                        }).join(', '));
                }
                else {
                    console.log('No outstanding promises');
                }
                return this.outstanding;
            };
            PromiseLogger.prototype.activation = function (inputs, outputs) {
                console.log('Activation: ' +
                    inputs.map(u.getId).join(', ') +
                    ' -> ' +
                    outputs.map(u.getId).join(', '));
            };
            return PromiseLogger;
        })();
        reactive.PromiseLogger = PromiseLogger;
    })(reactive = hd.reactive || (hd.reactive = {}));
})(hd || (hd = {}));
//# sourceMappingURL=reactive.js.map/*####################################################################
 * GraphWalker and DigraphWalker for performing depth-first
 * traversals.
 *
 * This was written for bipartite graphs, so traversal methods include
 * the option to visit every node or every other node.
 */
var hd;
(function (hd) {
    var graph;
    (function (graph) {
        /*==================================================================
         * Base class for walkers.  Has the actual traversal methods --
         * subclasses just provide traversal parameters.
         */
        var DfsWalker = (function () {
            /*----------------------------------------------------------------
             * Special method for collected array
             */
            function DfsWalker() {
                // Every node visited by the walker
                this.visited = {};
                // Nodes collected by the walker
                this.collected = [];
                var walker = this;
                this.collected.and = function () { return walker; };
            }
            /*----------------------------------------------------------------
             * Get all nodes collected by the walker.
             */
            DfsWalker.prototype.result = function () {
                return this.collected;
            };
            DfsWalker.prototype.collect = function (visit, starting) {
                if (Array.isArray(starting)) {
                    starting.forEach(function (n) {
                        this.collectRec(visit, n);
                    }, this);
                }
                else {
                    this.collectRec(visit, starting);
                }
                return this.collected;
            };
            /*----------------------------------------------------------------
             * The actual recursive traversal function.
             */
            DfsWalker.prototype.collectRec = function (visit, nid) {
                if (this.visited[nid]) {
                    return;
                }
                this.visited[nid] = true;
                if (visit >= 0) {
                    // We know this is unique, so just push
                    this.collected.push(nid);
                }
                var toEdges = this.edges[nid];
                for (var n2id in toEdges) {
                    this.collectRec(-visit, n2id);
                }
            };
            return DfsWalker;
        })();
        graph.DfsWalker = DfsWalker;
    })(graph = hd.graph || (hd.graph = {}));
})(hd || (hd = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/*####################################################################
 * The hd.graph.Digraph class.
 */
var hd;
(function (hd) {
    var graph;
    (function (graph_1) {
        /*==================================================================
         * A directed graph.
         */
        var Digraph = (function () {
            function Digraph() {
                // Labels for nodes which have one
                this.labels = {};
                // All incoming edges
                this.ins = {};
                // All outgoing edges
                this.outs = {};
            }
            /*----------------------------------------------------------------
             * Is node in the graph?
             */
            Digraph.prototype.hasNode = function (n) {
                return n in this.outs;
            };
            /*----------------------------------------------------------------
             * Is edge in the graph?
             */
            Digraph.prototype.hasEdge = function (from, to) {
                return this.hasNode(from) && this.outs[from][to];
            };
            /*----------------------------------------------------------------
             * Getter for node label.
             */
            Digraph.prototype.getLabel = function (n) {
                return this.labels[n];
            };
            /*----------------------------------------------------------------
             * Setter for node label.
             */
            Digraph.prototype.setLabel = function (n, label) {
                if (label === undefined) {
                    delete this.labels[n];
                }
                else {
                    this.labels[n] = label;
                }
            };
            /*----------------------------------------------------------------
             * Add node to the graph.  Has no effect if node already in graph.
             */
            Digraph.prototype.addNode = function (n, label) {
                if (label !== undefined) {
                    this.labels[n] = label;
                }
                this.outs[n] = {};
                this.ins[n] = {};
            };
            /*----------------------------------------------------------------
             * Add edge to the graph.
             */
            Digraph.prototype.addEdge = function (from, to) {
                this.outs[from][to] = true;
                this.ins[to][from] = true;
            };
            /*----------------------------------------------------------------
             * Curried version of addEdge - returns a function which can be
             * used to add edges going to specified node.
             */
            Digraph.prototype.addEdgeTo = function (to) {
                var graph = this;
                return function (from) {
                    graph.addEdge(from, to);
                };
            };
            /*----------------------------------------------------------------
             * Curried version of addEdge - returns a function which can be
             * used to add edges coming from specified node.
             */
            Digraph.prototype.addEdgeFrom = function (from) {
                var graph = this;
                return function (to) {
                    graph.addEdge(from, to);
                };
            };
            /*----------------------------------------------------------------
             * Remove node from the graph.
             */
            Digraph.prototype.removeNode = function (n) {
                delete this.labels[n];
                for (var to in this.outs[n]) {
                    delete this.ins[to][n];
                }
                for (var from in this.ins[n]) {
                    delete this.outs[from][n];
                }
                delete this.outs[n];
                delete this.ins[n];
            };
            /*----------------------------------------------------------------
             * Remove edge from the graph.
             */
            Digraph.prototype.removeEdge = function (from, to) {
                delete this.outs[from][to];
                delete this.ins[to][from];
            };
            /*----------------------------------------------------------------
             * All nodes in the graph.
             */
            Digraph.prototype.getNodes = function () {
                return Object.keys(this.outs);
            };
            /*----------------------------------------------------------------
             * Only nodes which have labels.
             */
            Digraph.prototype.getLabeledNodes = function () {
                return Object.keys(this.labels);
            };
            /*----------------------------------------------------------------
             * Only nodes which do not have labels.
             */
            Digraph.prototype.getUnlabeledNodes = function () {
                return Object.keys(this.outs).filter(function (id) {
                    return !(id in this.labels);
                });
            };
            /*----------------------------------------------------------------
             * All outgoing edges for one particular node.
             */
            Digraph.prototype.getOutsFor = function (n) {
                var ns = [];
                var outs = this.outs[n];
                for (var n2 in outs) {
                    if (outs[n2]) {
                        ns.push(n2);
                    }
                }
                return ns;
            };
            /*----------------------------------------------------------------
             * All incoming edges for one particular node.
             */
            Digraph.prototype.getInsFor = function (n) {
                var ns = [];
                var ins = this.ins[n];
                for (var n2 in ins) {
                    if (ins[n2]) {
                        ns.push(n2);
                    }
                }
                return ns;
            };
            return Digraph;
        })();
        graph_1.Digraph = Digraph;
        /*==================================================================
         * DfsWalker for a Graph.  Can walk over outgoing edges for
         * downstream traversal, or incoming edges for upstream traversal.
         */
        var DigraphWalker = (function (_super) {
            __extends(DigraphWalker, _super);
            /*----------------------------------------------------------------
             * Stores digraph so that it can access its incoming and outgoing
             * edges as needed.
             */
            function DigraphWalker(digraph) {
                _super.call(this);
                this.digraph = digraph;
            }
            DigraphWalker.prototype.nodesDownstream = function (starting) {
                this.edges = this.digraph.outs;
                return this.collect(0, starting);
            };
            DigraphWalker.prototype.nodesDownstreamSameType = function (starting) {
                this.edges = this.digraph.outs;
                return this.collect(1, starting);
            };
            DigraphWalker.prototype.nodesDownstreamOtherType = function (starting) {
                this.edges = this.digraph.outs;
                return this.collect(-1, starting);
            };
            DigraphWalker.prototype.nodesUpstream = function (starting) {
                this.edges = this.digraph.ins;
                return this.collect(0, starting);
            };
            DigraphWalker.prototype.nodesUpstreamSameType = function (starting) {
                this.edges = this.digraph.ins;
                return this.collect(1, starting);
            };
            DigraphWalker.prototype.nodesUpstreamOtherType = function (starting) {
                this.edges = this.digraph.ins;
                return this.collect(-1, starting);
            };
            return DigraphWalker;
        })(graph_1.DfsWalker);
        graph_1.DigraphWalker = DigraphWalker;
    })(graph = hd.graph || (hd.graph = {}));
})(hd || (hd = {}));
/*####################################################################
 * The ConstraintGraph interface and classes.
 *
 * A constraint graph is simply a wrapper around a directed graph.  It
 * provides a more controlled way to build up the graph, as well as
 * methods which perform the standard queries you'd expect to perform.
 * Wrapping the graph also provides the opportunity to provide caching
 * for common queries if desired.
 *
 * A constraint graph may be viewed as a hypergraph, in which the
 * variables are nodes and the methods are hyperedges going from the
 * input variables to the output variables.  Thus, the "addVariable"
 * function adds a node to the graph, and the "addMethod" function
 * adds a hyperedge to the graph.
 */
var hd;
(function (hd) {
    var graph;
    (function (graph) {
        var u = hd.utility;
        /*==================================================================
         * This implementation of ConstraintGraph does not do any caching.
         * All information is stored in the graph (constraint ids are
         * stored as labels for method nodes).  Queries are recaclulated
         * every time directly from the graph.
         */
        var NoCachingConstraintGraph = (function () {
            function NoCachingConstraintGraph() {
                // The directed graph
                this.graph = new graph.Digraph();
            }
            /*----------------------------------------------------------------
             * Given a list of methods, return a set of the corresponding
             * constraints.
             */
            NoCachingConstraintGraph.prototype.constraintsFor = function (mids) {
                var cids = {};
                mids.forEach(function (mid) {
                    cids[this.graph.getLabel(mid)] = true;
                }, this);
                return Object.keys(cids);
            };
            /*----------------------------------------------------------------
             * Add variable node to the graph.
             */
            NoCachingConstraintGraph.prototype.addVariable = function (vid) {
                this.graph.addNode(vid);
            };
            /*----------------------------------------------------------------
             * Add method node to the graph.
             * Also add edges which use this new node at the same time.
             * Precondition: all inputs/outputs have already been added to the graph
             */
            NoCachingConstraintGraph.prototype.addMethod = function (mid, cid, inputs, outputs) {
                this.graph.addNode(mid, cid);
                inputs.forEach(this.graph.addEdgeTo(mid));
                outputs.forEach(this.graph.addEdgeFrom(mid));
            };
            /*----------------------------------------------------------------
             * Remove specified variable (and all edges which use that node).
             * Precondition: any methods which use this as input/output have
             * already been removed from the graph
             */
            NoCachingConstraintGraph.prototype.removeVariable = function (vid) {
                this.graph.removeNode(vid);
            };
            /*----------------------------------------------------------------
             * Remove specified method (and all edges which use that node).
             */
            NoCachingConstraintGraph.prototype.removeMethod = function (mid) {
                var cid = this.constraintForMethod(mid);
                this.graph.removeNode(mid);
            };
            /*----------------------------------------------------------------
             * All variables contained in the constraint graph.
             */
            NoCachingConstraintGraph.prototype.variables = function () {
                return this.graph.getUnlabeledNodes();
            };
            /*----------------------------------------------------------------
             * All methods contained in the constraint graph.
             */
            NoCachingConstraintGraph.prototype.methods = function () {
                return this.graph.getLabeledNodes();
            };
            /*----------------------------------------------------------------
             * All constraints contained in the constraint graph.
             */
            NoCachingConstraintGraph.prototype.constraints = function () {
                return this.constraintsFor(this.graph.getLabeledNodes());
            };
            /*----------------------------------------------------------------
             */
            NoCachingConstraintGraph.prototype.contains = function (id) {
                return this.graph.hasNode(id);
            };
            /*----------------------------------------------------------------
             * All methods which use specified variable as input.
             */
            NoCachingConstraintGraph.prototype.methodsWhichInput = function (vid) {
                return this.graph.getOutsFor(vid);
            };
            /*----------------------------------------------------------------
             * All methods which use specified variable as output.
             */
            NoCachingConstraintGraph.prototype.methodsWhichOutput = function (vid) {
                return this.graph.getInsFor(vid);
            };
            /*----------------------------------------------------------------
             * All methods which use specified variable (whether input or
             * ouptut)
             */
            NoCachingConstraintGraph.prototype.methodsWhichUse = function (vid) {
                var ins = this.graph.getInsFor(vid);
                var outs = this.graph.getOutsFor(vid);
                return u.arraySet.union(ins, outs);
            };
            /*----------------------------------------------------------------
             * All constraints which have a method using the specified
             * variable as input.
             */
            NoCachingConstraintGraph.prototype.constraintsWhichInput = function (vid) {
                return this.constraintsFor(this.methodsWhichInput(vid));
            };
            /*----------------------------------------------------------------
             * All constraints which have a method using the specified
             * variable as output.
             */
            NoCachingConstraintGraph.prototype.constraintsWhichOutput = function (vid) {
                return this.constraintsFor(this.methodsWhichOutput(vid));
            };
            /*----------------------------------------------------------------
             * All constraints which use the specified variable.
             */
            NoCachingConstraintGraph.prototype.constraintsWhichUse = function (vid) {
                return this.constraintsFor(this.methodsWhichUse(vid));
            };
            /*----------------------------------------------------------------
             * The variables used as input for the specified method.
             */
            NoCachingConstraintGraph.prototype.inputsForMethod = function (mid) {
                return this.graph.getInsFor(mid);
            };
            /*----------------------------------------------------------------
             * The variables used as output for the specified method.
             */
            NoCachingConstraintGraph.prototype.outputsForMethod = function (mid) {
                return this.graph.getOutsFor(mid);
            };
            /*----------------------------------------------------------------
             * The variables used as either input or output for the specified
             * method.
             */
            NoCachingConstraintGraph.prototype.variablesForMethod = function (mid) {
                var ins = this.graph.getInsFor(mid);
                var outs = this.graph.getOutsFor(mid);
                return u.arraySet.union(ins, outs);
            };
            /*----------------------------------------------------------------
             * The constraint which specified method belongs to.
             */
            NoCachingConstraintGraph.prototype.constraintForMethod = function (mid) {
                return this.graph.getLabel(mid);
            };
            /*----------------------------------------------------------------
             * The variables used as input for at least one method in the
             * specified constraint.
             */
            NoCachingConstraintGraph.prototype.inputsForConstraint = function (cid) {
                var mids = this.methodsForConstraint(cid);
                var inputsList = mids.map(this.graph.getInsFor, this.graph);
                return inputsList.reduce(u.arraySet.union, []);
            };
            /*----------------------------------------------------------------
             * The variables used as output for at least one method in the
             * specified constraint.
             */
            NoCachingConstraintGraph.prototype.outputsForConstraint = function (cid) {
                var mids = this.methodsForConstraint(cid);
                var outputsList = mids.map(this.graph.getOutsFor, this.graph);
                return outputsList.reduce(u.arraySet.union, []);
            };
            /*----------------------------------------------------------------
             * The variables used by specified constraint.
             */
            NoCachingConstraintGraph.prototype.variablesForConstraint = function (cid) {
                var mids = this.methodsForConstraint(cid);
                var inputsList = mids.map(this.graph.getInsFor, this.graph);
                var outputsList = mids.map(this.graph.getOutsFor, this.graph);
                var inputs = inputsList.reduce(u.arraySet.union, []);
                var outputs = outputsList.reduce(u.arraySet.union, []);
                return u.arraySet.union(inputs, outputs);
            };
            /*----------------------------------------------------------------
             * The methods belonging to the specified constraint.
             */
            NoCachingConstraintGraph.prototype.methodsForConstraint = function (cid) {
                return this.methods().filter(function (mid) {
                    return this.graph.getLabel(mid) == cid;
                }, this);
            };
            return NoCachingConstraintGraph;
        })();
        graph.NoCachingConstraintGraph = NoCachingConstraintGraph;
        /*==================================================================
         * This implementation of ConstraintGraph expands on the simple
         * NoCachingConstraintGraph by keeping a set of all variable ids and
         * a map from constraint id to the methods in the constraint.
         * This speeds up the slowest queries from NoCachingConstraintGraph.
         */
        var CachingConstraintGraph = (function (_super) {
            __extends(CachingConstraintGraph, _super);
            function CachingConstraintGraph() {
                _super.apply(this, arguments);
                // Keeps ids of all variables
                this.vids = {};
                // Maps constraint ids to methods in the constraint
                this.cids = {};
            }
            /*----------------------------------------------------------------
             * Add variable / update cache
             */
            CachingConstraintGraph.prototype.addVariable = function (vid) {
                _super.prototype.addVariable.call(this, vid);
                this.vids[vid] = true;
            };
            /*----------------------------------------------------------------
             * Add method / update cache
             */
            CachingConstraintGraph.prototype.addMethod = function (mid, cid, ins, outs) {
                _super.prototype.addMethod.call(this, mid, cid, ins, outs);
                if (cid in this.cids) {
                    u.arraySet.add(this.cids[cid], mid);
                }
                else {
                    this.cids[cid] = [mid];
                }
            };
            /*----------------------------------------------------------------
             * Remove variable / update cache
             */
            CachingConstraintGraph.prototype.removeVariable = function (vid) {
                delete this.vids[vid];
                _super.prototype.removeVariable.call(this, vid);
            };
            /*----------------------------------------------------------------
             * Remove method / update cache
             */
            CachingConstraintGraph.prototype.removeMethod = function (mid) {
                var cid = this.graph.getLabel(mid);
                var allmids = this.cids[cid];
                u.arraySet.remove(allmids, mid);
                if (allmids.length == 0) {
                    delete this.cids[cid];
                }
                _super.prototype.removeMethod.call(this, mid);
            };
            /*----------------------------------------------------------------
             * Get variables from cache
             */
            CachingConstraintGraph.prototype.variables = function () {
                return Object.keys(this.vids);
            };
            /*----------------------------------------------------------------
             * Get constraints from cache
             */
            CachingConstraintGraph.prototype.constraints = function () {
                return Object.keys(this.cids);
            };
            /*----------------------------------------------------------------
             * Look up method from cache
             */
            CachingConstraintGraph.prototype.methodsForConstraint = function (cid) {
                var mids = this.cids[cid];
                return mids ? u.arraySet.clone(mids) : [];
            };
            return CachingConstraintGraph;
        })(NoCachingConstraintGraph);
        graph.CachingConstraintGraph = CachingConstraintGraph;
    })(graph = hd.graph || (hd.graph = {}));
})(hd || (hd = {}));
/*####################################################################
 * The SolutionGraph interface and class.
 *
 * A SolutionGraph is just a constraint graph; however, it is defined
 * as a subgraph of another constraint graph.  In hypergraph
 * terminology, the solution graph contains all the nodes (variables)
 * of the original graph, and some but not all the hyperedges
 * (methods).  More specifically, the solution graph contains at most
 * one method from each constraint of the original constraint graph.
 *
 * To help enforce this, the solution graph keeps a pointer to the
 * constraint graph it is a subset of.  Rather than supporting the
 * arbitrary editing functions of ConstraintGraph, the SolutionGraph
 * only supports adding and removing methods of the original
 * constraint graph.
 */
var hd;
(function (hd) {
    var graph;
    (function (graph) {
        /*==================================================================
         * A solution graph with light caching.
         */
        var CachingSolutionGraph = (function (_super) {
            __extends(CachingSolutionGraph, _super);
            function CachingSolutionGraph() {
                _super.apply(this, arguments);
            }
            /*----------------------------------------------------------------
             * Remove any hyperedges for specified constraint; then add
             * specified hyeredge.
             *
             * Note that it's fine if there are no hyperedges for the
             * specified constraint.  Similarly, "mid" may be "null" to
             * indicate that there should be no hyperedges for the specified
             * constraint.
             */
            CachingSolutionGraph.prototype.selectMethod = function (cid, mid, inputs, outputs) {
                if (!mid) {
                    mid = null;
                }
                var oldmid = this.selectedForConstraint(cid);
                if (oldmid != mid) {
                    if (oldmid) {
                        this.removeMethod(oldmid);
                    }
                    if (mid) {
                        this.addMethod(mid, cid, inputs, outputs);
                    }
                }
            };
            /*----------------------------------------------------------------
             * Query which method for specified constraint is currently in
             * the solution graph.
             */
            CachingSolutionGraph.prototype.selectedForConstraint = function (cid) {
                var methods = this.methodsForConstraint(cid);
                return methods ? methods[0] : null;
            };
            return CachingSolutionGraph;
        })(graph.CachingConstraintGraph);
        graph.CachingSolutionGraph = CachingSolutionGraph;
    })(graph = hd.graph || (hd.graph = {}));
})(hd || (hd = {}));
/*====================================================================
 * There are no stay constraints in the model; they exist only in the
 * constraint graph.  Thus, we create ids for them, but the ids do not
 * map to any actual objects.  The mapping between a variable id and
 * the corresponding stay constraint id is performed by a simple
 * string manipulation: simply take the id of the variable and append
 * "#sc" to the end.  Similarly, the single method of the stay
 * constraint (the "stay method") simply takes the id of the variable
 * and appends "#sm" to the end.  The following functions facilitate
 * that mapping.
 */
var hd;
(function (hd) {
    var graph;
    (function (graph) {
        /*------------------------------------------------------------------
         * Map variable id to stay method id.
         */
        function stayMethod(vid) {
            return vid + '#sm';
        }
        graph.stayMethod = stayMethod;
        /*------------------------------------------------------------------
         * Map variable id to stay constraint id.
         */
        function stayConstraint(vid) {
            return vid + '#sc';
        }
        graph.stayConstraint = stayConstraint;
        /*------------------------------------------------------------------
         * Test whether specified method id is a stay method id.
         */
        function isStayMethod(mid) {
            return (mid.substr(-3) == '#sm');
        }
        graph.isStayMethod = isStayMethod;
        /*------------------------------------------------------------------
         * Test whether specified method id is NOT a stay method id.
         */
        function isNotStayMethod(cid) {
            return (cid.substr(-3) != '#sm');
        }
        graph.isNotStayMethod = isNotStayMethod;
        /*------------------------------------------------------------------
         * Test whether specified constraint id is a stay constraint id.
         */
        function isStayConstraint(cid) {
            return (cid.substr(-3) == '#sc');
        }
        graph.isStayConstraint = isStayConstraint;
        /*------------------------------------------------------------------
         * Test whether specified constraint id is NOT a stay constraint id.
         */
        function isNotStayConstraint(cid) {
            return (cid.substr(-3) != '#sc');
        }
        graph.isNotStayConstraint = isNotStayConstraint;
    })(graph = hd.graph || (hd.graph = {}));
})(hd || (hd = {}));
//# sourceMappingURL=graph.js.mapvar hd;
(function (hd) {
    var model;
    (function (model) {
        model.debugIds = true;
        var namespaces = {};
        var namespaceCount = 0;
        var IdGenerator = (function () {
            function IdGenerator(ns) {
                this.namespace = ns;
                if (ns && !(ns in namespaces)) {
                    namespaces[ns] = ++namespaceCount;
                }
                this.count = 0;
            }
            IdGenerator.prototype.makeId = function (name) {
                var pieces = [];
                if (model.debugIds) {
                    pieces.push(name);
                }
                pieces.push('#');
                if (this.namespace) {
                    if (model.debugIds) {
                        pieces.push(this.namespace, '.');
                    }
                    else {
                        pieces.push(namespaces[this.namespace], '.');
                    }
                }
                pieces.push(++this.count);
                return pieces.join('');
            };
            return IdGenerator;
        })();
        model.IdGenerator = IdGenerator;
    })(model = hd.model || (hd.model = {}));
})(hd || (hd = {}));
/*####################################################################
 * The Variable class
 */
var hd;
(function (hd) {
    var model;
    (function (model) {
        var u = hd.utility;
        var r = hd.reactive;
        (function (VariableEventType) {
            VariableEventType[VariableEventType["changed"] = 0] = "changed";
            VariableEventType[VariableEventType["touched"] = 1] = "touched";
            VariableEventType[VariableEventType["pending"] = 2] = "pending";
            VariableEventType[VariableEventType["settled"] = 3] = "settled";
            VariableEventType[VariableEventType["setOutput"] = 4] = "setOutput";
        })(model.VariableEventType || (model.VariableEventType = {}));
        var VariableEventType = model.VariableEventType;
        /*==================================================================
         * Variable in the property model.
         */
        var Variable = (function () {
            /*----------------------------------------------------------------
             * Initialize members.  Optional EqualityPredicate is used to
             * determine when value has changed.
             */
            function Variable(id, name, value, eq, output) {
                // Error associated with this variable
                this.error = new r.ObservableProperty(null);
                // Is value stale?
                this.stale = new r.ObservableProperty(false);
                // Is the variable a source?
                this.source = new r.ObservableProperty(false);
                // Is the variable pending?
                this.pending = new r.ObservableProperty(false);
                // Is the variable contributing to an output?
                this.contributing = new r.ObservableProperty(u.Fuzzy.Yes);
                // Could the variable contribute to an output if edited?
                this.relevant = new r.ObservableProperty(u.Fuzzy.Yes);
                // Publishes events when value is touched or changed
                this.changes = new r.BasicObservable();
                this.id = id;
                this.name = name;
                this.value = new r.ObservableProperty(undefined, eq);
                this.output = new r.ObservableProperty(!!output);
                this.ladder = new r.PromiseLadder();
                // connect ladder to value
                this.ladder.addObserver(this, this.onLadderNext, this.onLadderError, null);
                if (value !== undefined) {
                    var p;
                    if (value instanceof r.Promise) {
                        p = value;
                    }
                    else {
                        p = new r.Promise();
                        if (r.plogger) {
                            r.plogger.register(p, this.name, "variable initialization");
                        }
                        p.resolve(value);
                    }
                    this.makePromise(p);
                }
            }
            /*----------------------------------------------------------------
             * Human readable name
             */
            Variable.prototype.toString = function () {
                return this.name;
            };
            /*----------------------------------------------------------------
             * Set output property and generate change event
             */
            Variable.prototype.setOutput = function (isOutput) {
                isOutput = !!isOutput;
                if (!this.output.hasValue(isOutput)) {
                    this.output.set(isOutput);
                    this.changes.sendNext({ type: VariableEventType.setOutput,
                        vv: this,
                        isOutput: isOutput });
                }
            };
            /*----------------------------------------------------------------
             * Make a promise to set the variable's value later.
             */
            Variable.prototype.makePromise = function (promise) {
                if (!(promise instanceof r.Promise)) {
                    var value = promise;
                    promise = new r.Promise();
                    if (r.plogger) {
                        r.plogger.register(promise, this.name, 'variable update');
                    }
                    promise.resolve(value);
                }
                this.ladder.addPromise(promise);
                if (this.pending.get() == false) {
                    this.pending.set(true);
                    this.stale.set(false);
                    this.changes.sendNext({ type: VariableEventType.pending, vv: this });
                }
            };
            /*----------------------------------------------------------------
             * Get a promise for the variable's value.
             */
            Variable.prototype.getCurrentPromise = function () {
                return this.ladder.getCurrentPromise();
            };
            /*----------------------------------------------------------------
             * Get a promise to be forwarded with the current variable value.
             */
            Variable.prototype.getForwardedPromise = function () {
                var p = new r.Promise();
                if (r.plogger) {
                    r.plogger.register(p, this.name + '#fwd', ' forwarded');
                }
                this.ladder.forwardPromise(p);
                return p;
            };
            /*----------------------------------------------------------------
             * Observer: subscribing to a variable == subscribing to its value
             */
            Variable.prototype.addObserver = function () {
                return this.value.addObserver.apply(this.value, arguments);
            };
            Variable.prototype.addObserverInit = function () {
                return this.value.addObserverInit.apply(this.value, arguments);
            };
            /*----------------------------------------------------------------
             * Observer: subscribing to a variable == subscribing to its value
             */
            Variable.prototype.removeObserver = function (observer) {
                return this.value.removeObserver(observer);
            };
            /*----------------------------------------------------------------
             * Observable: widget produces a value
             */
            Variable.prototype.onNext = function (value) {
                this.makePromise(value);
                this.changes.sendNext({ type: VariableEventType.changed, vv: this });
            };
            /*----------------------------------------------------------------
             * Observable: widget produces an error
             */
            Variable.prototype.onError = function (error) {
                var p = new r.Promise();
                if (r.plogger) {
                    r.plogger.register(p, this.name, 'variable update');
                }
                p.reject(error);
                this.makePromise(p);
                this.changes.sendNext({ type: VariableEventType.changed, vv: this });
            };
            /*----------------------------------------------------------------
             * Observable: unused - don't care if widget completes
             */
            Variable.prototype.onCompleted = function () {
                // No-op
            };
            /*----------------------------------------------------------------
             * Ladder produced a good value.
             */
            Variable.prototype.onLadderNext = function (value) {
                this.value.hardSet(value);
                this.error.set(null);
                this.stale.set(this.ladder.currentFailed());
                if (this.ladder.isSettled()) {
                    this.pending.set(false);
                    this.changes.sendNext({ type: VariableEventType.settled, vv: this });
                }
            };
            /*----------------------------------------------------------------
             * Ladder produced an error.
             */
            Variable.prototype.onLadderError = function (error) {
                if (error !== null) {
                    this.error.set(error);
                }
                this.stale.set(this.ladder.currentFailed());
                if (this.ladder.isSettled()) {
                    this.pending.set(false);
                    this.changes.sendNext({ type: VariableEventType.settled, vv: this });
                }
            };
            return Variable;
        })();
        model.Variable = Variable;
    })(model = hd.model || (hd.model = {}));
})(hd || (hd = {}));
/*####################################################################
 * The Method class.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var hd;
(function (hd) {
    var config;
    (function (config) {
        config.forwardSelfLoops = false;
    })(config = hd.config || (hd.config = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var model;
    (function (model) {
        var r = hd.reactive;
        /*==================================================================
         * An operation over variables in the property model
         */
        var Operation = (function () {
            /*----------------------------------------------------------------
             * Initialize members
             */
            function Operation(id, name, fn, inputs, outputs) {
                this.id = id;
                this.name = name;
                this.fn = fn;
                this.inputs = inputs;
                this.outputs = outputs;
            }
            /*----------------------------------------------------------------
             * Human readable name
             */
            Operation.prototype.toString = function () {
                return this.name;
            };
            /*----------------------------------------------------------------
             */
            Operation.prototype.activate = function (internal) {
                var params = [];
                var inputs = this.inputs;
                var outputs = this.outputs;
                var inputLookup = {};
                var outputLookup = {};
                // Collect parameter promises
                for (var i = 0, l = inputs.length; i < l; ++i) {
                    var param;
                    // An input is either a variable or a constant
                    if (inputs[i] instanceof model.Variable) {
                        var vv = inputs[i];
                        param = inputLookup[vv.id];
                        if (!param) {
                            if (outputs.indexOf(vv) >= 0 && hd.config.forwardSelfLoops) {
                                param = inputLookup[vv.id] = vv.getForwardedPromise();
                            }
                            else {
                                param = inputLookup[vv.id] = vv.getCurrentPromise();
                            }
                        }
                    }
                    else {
                        // If it's a constant, we create a satisfied promise
                        param = new r.Promise();
                        if (r.plogger) {
                            r.plogger.register(param, inputs[i], 'constant parameter');
                        }
                        param.resolve(inputs[i]);
                    }
                    params.push(param);
                }
                // Invoke the operation
                try {
                    var result = this.fn.apply(null, params);
                    // Ensure result is an array
                    if (outputs.length > 0) {
                        if (outputs.length == 1) {
                            result = [result];
                        }
                        else if (!Array.isArray(result)) {
                            throw new TypeError('Multi-output activating function did not return array');
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                    // Create failed promises for outputs
                    result = [];
                    for (var i = 0, l = outputs.length; i < l; ++i) {
                        var p = new r.Promise();
                        p.reject(null);
                        result.push(p);
                    }
                }
                // Set output promises
                for (var i = 0, l = outputs.length; i < l; ++i) {
                    // An output is either a variable or null
                    if (outputs[i] instanceof model.Variable) {
                        var vv = outputs[i];
                        if (outputLookup[vv.id]) {
                            console.error('Operation attempting to output same variable twice');
                        }
                        else {
                            var p = result[i];
                            outputLookup[vv.id] = p;
                            if (r.plogger) {
                                r.plogger.register(p, vv.name, 'output parameter');
                            }
                            if (internal) {
                                vv.makePromise(p);
                            }
                            else {
                                vv.onNext(p);
                            }
                        }
                    }
                }
                return { inputs: inputLookup,
                    outputs: outputLookup };
            };
            return Operation;
        })();
        model.Operation = Operation;
        /*==================================================================
         *  A method is an operation that is part of a constraint.  As such,
         *  it keeps track of input and output variables as they appear in
         *  the constraint graph.  Every input should be in inputVars, every
         *  output should be in outputVars.
         */
        var Method = (function (_super) {
            __extends(Method, _super);
            /*----------------------------------------------------------------
             * Initialize members
             */
            function Method(id, name, fn, inputs, outputs, inputVars, outputVars) {
                _super.call(this, id, name, fn, inputs, outputs);
                this.inputVars = inputVars;
                this.outputVars = outputVars;
            }
            return Method;
        })(Operation);
        model.Method = Method;
    })(model = hd.model || (hd.model = {}));
})(hd || (hd = {}));
/*####################################################################
 * The Constraint class.
 */
var hd;
(function (hd) {
    var model;
    (function (model) {
        /*==================================================================
         * A constraint in the property model.
         */
        var Constraint = (function () {
            /*----------------------------------------------------------------
             * Initialize members
             */
            function Constraint(id, name, variables) {
                // Variables used by this constraint
                this.variables = [];
                // Methods in this constraint
                this.methods = [];
                this.id = id;
                this.name = name;
                this.variables = variables;
            }
            /*----------------------------------------------------------------
             * Human readable name
             */
            Constraint.prototype.toString = function () {
                return this.name;
            };
            /*----------------------------------------------------------------
             * Add new method to constraint
             */
            Constraint.prototype.addMethod = function (method) {
                this.methods.push(method);
            };
            // Static constants for min/max strength
            Constraint.WeakestStrength = Number.MIN_VALUE;
            Constraint.RequiredStrength = Number.MAX_VALUE;
            return Constraint;
        })();
        model.Constraint = Constraint;
    })(model = hd.model || (hd.model = {}));
})(hd || (hd = {}));
/*####################################################################
 * The Model class.
 */
var hd;
(function (hd) {
    var model;
    (function (model) {
        var r = hd.reactive;
        /*==================================================================
         * Interface for anything which needs to know when the model grows
         * (e.g. RunTime).
         */
        (function (ModelculeEventType) {
            ModelculeEventType[ModelculeEventType["addConstraint"] = 0] = "addConstraint";
            ModelculeEventType[ModelculeEventType["removeConstraint"] = 1] = "removeConstraint";
        })(model.ModelculeEventType || (model.ModelculeEventType = {}));
        var ModelculeEventType = model.ModelculeEventType;
        /*==================================================================
         * Used by a model to keep track of what it contains.
         */
        var ModelculeData = (function () {
            function ModelculeData() {
                this.constraints = [];
                this.changes = new r.BasicObservable();
            }
            return ModelculeData;
        })();
        model.ModelculeData = ModelculeData;
        /*==================================================================
         * A modelcule has two purposes.
         *
         * The first is to act as a container for variables and constraints,
         * allowing a way to refer to them.  When ModelBuilder is given a
         * name for, say, the input to a method, it looks the name up in the
         * model.
         *
         * The second purpose is to server as a component -- a building
         * block for composing large models.  That one I haven't quite
         * worked out yet.  Until I do, this at least enforces the idea of a
         * model being contained in an object, as opposed to a gobal model.
         */
        var Modelcule = (function () {
            function Modelcule() {
            }
            /*----------------------------------------------------------------
             * Create observable property to represent value
             */
            Modelcule.defineProperty = function (m, name, value, property) {
                if (property) {
                    var prop = new r.ObservableProperty(value);
                    Object.defineProperty(m, '$' + name, { configurable: true,
                        enumerable: false,
                        value: prop
                    });
                    Object.defineProperty(m, name, { configurable: true,
                        enumerable: true,
                        get: prop.get.bind(prop),
                        set: prop.set.bind(prop)
                    });
                }
                else {
                    m[name] = value;
                }
            };
            /*----------------------------------------------------------------
             * Static getter for constraints
             */
            Modelcule.constraints = function (m) {
                return m['#hd_data'].constraints;
            };
            /*----------------------------------------------------------------
             * Static getter for changes
             */
            Modelcule.changes = function (m) {
                return m['#hd_data'].changes;
            };
            /*----------------------------------------------------------------
             * Add variable to modelcule, optionally storing it as a property.
             */
            Modelcule.addVariable = function (m, vv, name, property) {
                if (name) {
                    Modelcule.defineProperty(m, name, vv, property);
                }
            };
            /*----------------------------------------------------------------
             * Add constraint to model, optionally storing it as a property.
             */
            Modelcule.addConstraint = function (m, cc, name, property) {
                m['#hd_data'].constraints.push(cc);
                if (name) {
                    Modelcule.defineProperty(m, name, cc, property);
                }
                m['#hd_data'].changes.sendNext({ type: ModelculeEventType.addConstraint,
                    constraint: cc });
            };
            return Modelcule;
        })();
        model.Modelcule = Modelcule;
        /*==================================================================
         * I have the idea that, at some point, we may want to allow the
         * programmer to create his own subclasses of Modelcule.
         *
         * Rather than require every model subclass to call the model
         * constructor, we define a getter that creates it the first time it
         * is accessed.
         */
        Object.defineProperty(Modelcule.prototype, '#hd_data', {
            get: function makeData() {
                var data = new ModelculeData();
                Object.defineProperty(this, '#hd_data', { value: data });
                return data;
            }
        });
    })(model = hd.model || (hd.model = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var model;
    (function (model) {
        var eqn;
        (function (eqn) {
            /*==================================================================
             * A numeric literal.
             */
            var Number = (function () {
                function Number(text) {
                    this.text = text;
                }
                Number.prototype.print = function () { return this.text; };
                Number.prototype.hasVar = function () { return false; };
                Number.prototype.find = function (varname) { return null; };
                Number.prototype.extractDivisor = function (name) { return null; };
                return Number;
            })();
            eqn.Number = Number;
            /*==================================================================
             * A variable reference.
             */
            var Variable = (function () {
                function Variable(name) {
                    this.name = name;
                }
                Variable.prototype.print = function () { return this.name; };
                Variable.prototype.hasVar = function () { return true; };
                Variable.prototype.find = function (varname) {
                    return this.name == varname ? [] : null;
                };
                Variable.prototype.extractDivisor = function (name) { return null; };
                return Variable;
            })();
            eqn.Variable = Variable;
            /*==================================================================
             * A unary operation.
             */
            var UnaryOperation = (function () {
                function UnaryOperation(op, expr) {
                    this.op = op;
                    this.expr = expr;
                }
                UnaryOperation.prototype.print = function () { return '(' + this.op + this.expr.print() + ')'; };
                UnaryOperation.prototype.hasVar = function () { return this.expr.hasVar(); };
                UnaryOperation.prototype.find = function (varname) {
                    var path = this.expr.find(varname);
                    if (path) {
                        path.unshift('expr');
                    }
                    ;
                    return path;
                };
                UnaryOperation.prototype.extractDivisor = function (name) {
                    return this.expr.extractDivisor(name);
                };
                return UnaryOperation;
            })();
            eqn.UnaryOperation = UnaryOperation;
            /*==================================================================
             * A binary operation.
             */
            var BinaryOperation = (function () {
                function BinaryOperation(left, op, right) {
                    this.left = left;
                    this.op = op;
                    this.right = right;
                    // Only extract divisor once
                    this.extracted = false;
                }
                BinaryOperation.prototype.print = function () {
                    return '(' + this.left.print() + this.op + this.right.print() + ')';
                };
                BinaryOperation.prototype.hasVar = function () { return this.left.hasVar() || this.right.hasVar(); };
                BinaryOperation.prototype.find = function (varname) {
                    var path = this.left.find(varname);
                    if (path) {
                        path.unshift('left');
                    }
                    else {
                        path = this.right.find(varname);
                        if (path) {
                            path.unshift('right');
                        }
                    }
                    return path;
                };
                BinaryOperation.prototype.extractDivisor = function (name) {
                    var div = this.right.extractDivisor(name);
                    if (!div) {
                        div = this.left.extractDivisor(name);
                        if (!div && this.op == '/') {
                            if (!this.extracted) {
                                if (this.right.hasVar()) {
                                    div = this.right;
                                    if (!(this.right instanceof Variable)) {
                                        this.right = new Variable(name);
                                    }
                                }
                                this.extracted = true;
                            }
                        }
                    }
                    return div;
                };
                return BinaryOperation;
            })();
            eqn.BinaryOperation = BinaryOperation;
            /*==================================================================
             * Record-type for equation.
             */
            var Equation = (function () {
                function Equation(left, op, right) {
                    this.left = left;
                    this.op = op;
                    this.right = right;
                }
                return Equation;
            })();
            eqn.Equation = Equation;
            /*==================================================================
             * Parse string to generate equation.
             */
            function parse(line) {
                var tokens = line.match(/((\d+(\.\d*)?)|(\.\d+))([eE][+-]?\d+)?|[\w$]+|[<>=]=|\S/g);
                var position = 0;
                var eq = parseEquation();
                if (position === tokens.length) {
                    return eq;
                }
                else {
                    throw "Unexpected token after equation ended: '" + tokens[position] + "'";
                }
                /*----------------------------------------------------------------
                 * Factor := number
                 *         | variable
                 *         | unop Expression
                 *         | ( Expression )
                 */
                function parseFactor() {
                    var tok = tokens[position++];
                    if (tok.match(/^\.?\d/)) {
                        return new Number(tok);
                    }
                    else if (tok.match(/^[\w$]/)) {
                        return new Variable(tok);
                    }
                    else if (tok === '-') {
                        var expr = parseFactor();
                        return new UnaryOperation('-', expr);
                    }
                    else if (tok === '(') {
                        expr = parseExpression();
                        tok = tokens[position++];
                        if (tok !== ')') {
                            throw "Expected ')' but found '" + tok + "''";
                        }
                        return expr;
                    }
                    throw "Expected value but found '" + tok + "'";
                }
                /*----------------------------------------------------------------
                 * Term := Term * Term
                 *       | Term / Term
                 *       | Factor
                 */
                function parseTerm() {
                    var left = parseFactor();
                    var op = tokens[position];
                    while (op === '*' || op === '/') {
                        ++position;
                        var right = parseFactor();
                        left = new BinaryOperation(left, op, right);
                        op = tokens[position];
                    }
                    return left;
                }
                /*----------------------------------------------------------------
                 * Expression := Expression + Expression
                 *             | Expression - Expression
                 *             | Term
                 */
                function parseExpression() {
                    var left = parseTerm();
                    var op = tokens[position];
                    while (op === '+' || op === '-') {
                        ++position;
                        var right = parseTerm();
                        left = new BinaryOperation(left, op, right);
                        op = tokens[position];
                    }
                    return left;
                }
                /*----------------------------------------------------------------
                 * Equation := Expression == Expression
                 *           | Expression <= Expression
                 *           | Expression >= Expression
                 */
                function parseEquation() {
                    var left = parseExpression();
                    var op = tokens[position++];
                    if (!(op && op.match(/^[<>=]=$/))) {
                        throw "Expected equality but found '" + op + "'";
                    }
                    var right = parseExpression();
                    return new Equation(left, op, right);
                }
            }
            eqn.parse = parse;
            /*==================================================================
             * Generate JS code for body of function which solves for given
             * variable.
             */
            function fnBody(inputs, output, eq) {
                var expr = solve(eq, output);
                if (expr) {
                    var lines = [];
                    // Extract out each divisor to check for (== 0)
                    var i = 1;
                    var name;
                    do {
                        do {
                            name = 'd' + i++;
                        } while (name == output || inputs.indexOf(name) >= 0);
                        var d = expr.extractDivisor(name);
                        if (d) {
                            if (d instanceof Variable) {
                                lines.push('if (' + d.name + ' == 0) return ' + output + ';');
                            }
                            else {
                                lines.push('var ' + name + ' = ' + d.print() + ';');
                                lines.push('if (' + name + ' == 0) return ' + output + ';');
                            }
                        }
                    } while (d);
                    // Perform calculation
                    if (eq.op == '==') {
                        lines.push('return ' + expr.print() + ';');
                    }
                    else {
                        lines.push('if (' + eq.left.print() +
                            eq.op + eq.right.print() + ')');
                        lines.push('  return ' + output + ';');
                        lines.push('else');
                        lines.push('  return ' + expr.print() + ';');
                    }
                    return lines.join('\n');
                }
                else {
                    return null;
                }
            }
            eqn.fnBody = fnBody;
            /*==================================================================
             * Solve equation for one variable.
             */
            function solve(eq, name) {
                var path = eq.left.find(name);
                if (path) {
                    return reduce(eq.left, eq.right);
                }
                else {
                    path = eq.right.find(name);
                    if (path) {
                        return reduce(eq.right, eq.left);
                    }
                    else {
                        return null;
                    }
                }
                /*----------------------------------------------------------------
                 * Reduce left expression down until only variable remains;
                 * each reduction is mirrored in right expression.
                 */
                function reduce(left, right) {
                    if (path.length == 0) {
                        return right;
                    }
                    if (left instanceof UnaryOperation) {
                        var u = left;
                        path.shift();
                        return reduce(u.expr, new UnaryOperation(u.op, right));
                    }
                    else if (left instanceof BinaryOperation) {
                        var b = left;
                        if (b.op === '+') {
                            if (path.shift() === 'left') {
                                return reduce(b.left, new BinaryOperation(right, '-', b.right));
                            }
                            else {
                                return reduce(b.right, new BinaryOperation(right, '-', b.left));
                            }
                        }
                        else if (b.op === '-') {
                            if (path.shift() === 'left') {
                                return reduce(b.left, new BinaryOperation(right, '+', b.right));
                            }
                            else {
                                return reduce(b.right, new BinaryOperation(b.left, '-', right));
                            }
                        }
                        else if (b.op === '*') {
                            if (path.shift() === 'left') {
                                return reduce(b.left, new BinaryOperation(right, '/', b.right));
                            }
                            else {
                                return reduce(b.right, new BinaryOperation(right, '/', b.left));
                            }
                        }
                        else if (b.op === '/') {
                            if (path.shift() === 'left') {
                                return reduce(b.left, new BinaryOperation(right, '*', b.right));
                            }
                            else {
                                return reduce(b.right, new BinaryOperation(b.left, '/', right));
                            }
                        }
                    }
                }
            }
        })(eqn = model.eqn || (model.eqn = {}));
    })(model = hd.model || (hd.model = {}));
})(hd || (hd = {}));
/*####################################################################
 * The ModelBuilder class.
 */
var hd;
(function (hd) {
    var model;
    (function (model) {
        var u = hd.utility;
        var r = hd.reactive;
        /*==================================================================
         * The purpose of the ModelBuilder is to make it easy for
         * programmers to construct modelcules.
         *
         * The various factory methods spend a lot of time validating
         * parameters and massaging them to fit the parameters of the actual
         * object constructors.  (The object constructors themselves assume
         * all parameters have been validated and are in the expected
         * format.)
         */
        var ModelBuilder = (function () {
            function ModelBuilder() {
                // If the last thing created was a constraint or a method in a
                // constraint, this will point to the constraint; otherwise it
                // will be null
                this.last = null;
                var namespace;
                var modelcule;
                if (arguments.length > 0) {
                    if (typeof arguments[0] === 'string') {
                        namespace = arguments[0];
                        if (arguments.length > 1) {
                            modelcule = arguments[1];
                        }
                    }
                    else {
                        modelcule = arguments[0];
                    }
                }
                if (modelcule) {
                    this.target = modelcule;
                }
                else {
                    this.target = new model.Modelcule();
                }
                this.ids = new model.IdGenerator(namespace);
            }
            /*----------------------------------------------------------------
             * Get the modelcule that was built.
             */
            ModelBuilder.prototype.end = function () {
                this.endConstraint();
                return this.target;
            };
            /*----------------------------------------------------------------
             * Add a variable to the current modelcule.
             */
            ModelBuilder.prototype.variable = function (name, init, eq, output) {
                this.endConstraint();
                var indirect = false;
                var stripped = stripDollar(name);
                if (stripped) {
                    indirect = true;
                    name = stripped;
                }
                if (this.invalidName(name) || this.nameInUse(name)) {
                    return this;
                }
                if (eq && typeof eq !== 'function') {
                    console.error('Variable equality predicate must be a function');
                    return this;
                }
                // Create the variable if necessary
                var vv;
                if (init instanceof model.Variable) {
                    vv = init;
                    init = undefined;
                }
                else {
                    vv = new model.Variable(this.ids.makeId(name), name, init, eq);
                }
                if (output) {
                    vv.setOutput(true);
                }
                else {
                    vv.setOutput(false);
                }
                // Record variable
                model.Modelcule.addVariable(this.target, vv, name, indirect);
                return this;
            };
            ModelBuilder.prototype.variables = function () {
                this.endConstraint();
                var varorder;
                var vardefs;
                var output;
                if (typeof arguments[0] === 'string') {
                    varorder = arguments[0].trim().split(/\s*,\s*/);
                    vardefs = arguments[1] || {};
                    output = arguments[2];
                }
                else {
                    vardefs = arguments[0];
                    varorder = Object.keys(vardefs);
                    output = arguments[1];
                }
                varorder.forEach(function (name) {
                    this.variable(name, vardefs[name], undefined, output);
                }, this);
                return this;
            };
            /*----------------------------------------------------------------
             * Add a variable to current model, marking it as output.
             *   -OR-
             * Mark existing variable as output
             */
            ModelBuilder.prototype.outputVariable = function (name, init, eq) {
                this.endConstraint();
                if (arguments.length == 1 && this.target[name] instanceof model.Variable) {
                    this.target[name].setOutput(true);
                }
                else {
                    this.variable(name, init, eq, true);
                }
                return this;
            };
            ModelBuilder.prototype.interfaceVariable = function (name, init, eq) {
                this.endConstraint();
                if (arguments.length == 1 && this.target[name] instanceof model.Variable) {
                    this.target[name].setOutput(false);
                }
                else {
                    this.variable(name, init, eq, false);
                }
                return this;
            };
            ModelBuilder.prototype.outputVariables = function () {
                this.endConstraint();
                if (arguments.length == 1 && typeof arguments[0] === 'string') {
                    arguments[0].trim().split(/\s*,\s*/).forEach(function (name) {
                        this.outputVariable(name);
                    }, this);
                }
                else if (arguments.length > 1) {
                    this.variables(arguments[0], arguments[1], true);
                }
                else {
                    this.variables(arguments[0], true);
                }
                return this;
            };
            ModelBuilder.prototype.interfaceVariables = function () {
                this.endConstraint();
                if (arguments.length == 1 && typeof arguments[0] === 'string') {
                    arguments[0].trim().split(/\s*,\s*/).forEach(function (name) {
                        this.interfaceVariable(name);
                    }, this);
                }
                else if (arguments.length > 1) {
                    this.variables(arguments[0], arguments[1], false);
                }
                else {
                    this.variables(arguments[0], false);
                }
                return this;
            };
            /*----------------------------------------------------------------
             */
            ModelBuilder.prototype.parseSignature = function (optype, signature) {
                var inputNames, outputNames;
                var leftRight = signature.trim().split(/\s*->\s*/);
                if (leftRight.length != 2) {
                    console.error('Invalid ' + optype + ' signature: "' + signature + '"');
                    return null;
                }
                inputNames = leftRight[0] == '' ? [] : leftRight[0].split(/\s*,\s*/);
                outputNames = leftRight[1] == '' ? [] : leftRight[1].split(/\s*,\s*/);
                var mask = [];
                for (var i = 0, l = inputNames.length; i < l; ++i) {
                    var stripped = stripStar(inputNames[i]);
                    if (stripped) {
                        mask[i] = true;
                        inputNames[i] = stripped;
                    }
                }
                if (mask.length == 0) {
                    mask = null;
                }
                if (inputNames.some(this.unknownName, this) ||
                    outputNames.some(this.unknownName, this)) {
                    return null;
                }
                var inputs = inputNames.map(u.toValueIn(this.target));
                var outputs = outputNames.map(u.toValueIn(this.target));
                if (outputs.some(u.isNotType(model.Variable))) {
                    // Not an error, but not a selectable method
                    console.warn('Igorning ' + optype + ' with non-variable output(s): ' + signature);
                    return null;
                }
                var isUnique = function (el, i, a) {
                    return i == a.indexOf(el);
                };
                if (!outputs.every(isUnique)) {
                    console.error('Duplicate outputs in ' + optype + ' ' + signature);
                    return null;
                }
                var inputVars = u.arraySet.fromArray(inputs.filter(u.isType(model.Variable)));
                return { inputs: inputs,
                    outputs: outputs,
                    inputVars: inputVars,
                    mask: mask
                };
            };
            /*----------------------------------------------------------------
             * Add a method to the current modelcule.
             */
            ModelBuilder.prototype.asyncMethod = function (signature, fn) {
                return this.method(signature, fn, true);
            };
            ModelBuilder.prototype.method = function (signature, fn, async) {
                if (async === void 0) { async = false; }
                if (!this.last) {
                    console.error('Builder function "method" called with no constraint');
                    return this;
                }
                var op = this.parseSignature('method', signature);
                var constraintVars = this.last.variables;
                var isNotConstraintVar = function (vv) {
                    return constraintVars.indexOf(vv) < 0;
                };
                if (op.inputVars.some(isNotConstraintVar)) {
                    console.error("Input does not belong to constraint in method " + signature);
                    return this;
                }
                if (op.outputs.some(isNotConstraintVar)) {
                    console.error("Output does not belong to constraint in method " + signature);
                    return this;
                }
                // Create method
                var mm = new model.Method(this.ids.makeId(signature), signature, async ? fn : r.liftFunction(fn, op.outputs.length, op.mask), op.inputs, op.outputs, u.arraySet.difference(constraintVars, op.outputs), op.outputs);
                this.last.addMethod(mm);
                return this;
            };
            ModelBuilder.prototype.constraint = function () {
                this.endConstraint();
                var name, signature;
                if (arguments.length > 1) {
                    name = arguments[0];
                    signature = arguments[1];
                }
                else {
                    signature = arguments[0];
                }
                var varNames = signature.trim().split(/\s*,\s*/);
                if (varNames.some(this.unknownName, this)) {
                    return this;
                }
                var variables = varNames.map(u.toValueIn(this.target));
                if (!variables.every(u.isType(model.Variable))) {
                    console.error('Constraint may only contain variables');
                    return this;
                }
                // Create constraint
                var cc = new model.Constraint(this.ids.makeId(signature), signature, variables);
                // Record constraint
                this.last = cc;
                if (name) {
                    if (!this.invalidName(name) && !this.nameInUse(name)) {
                        model.Modelcule.defineProperty(this.target, name, this.last, false);
                    }
                }
                return this;
            };
            ModelBuilder.prototype.endConstraint = function () {
                if (this.last) {
                    model.Modelcule.addConstraint(this.target, this.last);
                    this.last = null;
                }
                return this;
            };
            /*----------------------------------------------------------------
             * Build constraint represented by simple equation.
             */
            ModelBuilder.prototype.equation = function (eqString) {
                this.endConstraint();
                // Parse the equation
                try {
                    var equation = model.eqn.parse(eqString);
                }
                catch (err) {
                    console.error(err);
                    return this;
                }
                // Check variables
                var varNames = eqString.match(/[a-zA-Z_$][\w$]*/g);
                if (varNames.some(this.unknownName, this)) {
                    console.error('Unknown variables in equation: "' + eqString + '"');
                    return this;
                }
                for (var i = 0, l = varNames.length; i < l; ++i) {
                    if (varNames.indexOf(varNames[i], i + 1) > -1) {
                        console.error('Duplicate variables in equation: "' + eqString + '"');
                        return this;
                    }
                }
                var variables = varNames.map(u.toValueIn(this.target));
                var inputs = variables.slice(0);
                var inputVars = inputs.filter(u.isType(model.Variable));
                // Create constraint
                var allNames = varNames.join(', ');
                var cc = new model.Constraint(this.ids.makeId(allNames), allNames, variables);
                try {
                    var notOutput = function (vv) {
                        return vv !== output;
                    };
                    for (var i = 0, l = varNames.length; i < l; ++i) {
                        // Partition input/output names
                        var outputName = varNames[i];
                        var output = this.target[outputName];
                        if (output instanceof model.Variable) {
                            // Make signature
                            var signature = allNames + ' -> ' + outputName;
                            // Build method function
                            var fnBody = model.eqn.fnBody(varNames, outputName, equation);
                            var args = [null].concat(varNames);
                            args.push(fnBody);
                            var fn = new (Function.bind.apply(Function, args))();
                            // Create method
                            var mm = new model.Method(this.ids.makeId(signature), signature, r.liftFunction(fn), inputs, [output], inputVars.filter(notOutput), [output]);
                            // Record method
                            cc.addMethod(mm);
                        }
                    }
                    // Record constraint
                    model.Modelcule.addConstraint(this.target, cc);
                }
                catch (e) {
                    console.error('Unable to create equation', e);
                }
                return this;
            };
            /*----------------------------------------------------------------
             */
            ModelBuilder.prototype.command = function (name, signature, fn, async) {
                if (async === void 0) { async = false; }
                this.endConstraint();
                var op = this.parseSignature('command', signature);
                var command = new model.Command(this.ids.makeId(signature), signature, async ? fn : r.liftFunction(fn, op.outputs.length, op.mask), op.inputs, op.outputs);
                this.target[name] = command;
                return this;
            };
            /*----------------------------------------------------------------
             */
            ModelBuilder.prototype.syncommand = function (name, signature, fn, async) {
                if (async === void 0) { async = false; }
                this.endConstraint();
                var op = this.parseSignature('syncommand', signature);
                var command = new model.SynchronousCommand(this.ids.makeId(signature), signature, async ? fn : r.liftFunction(fn, op.outputs.length, op.mask), op.inputs, op.outputs);
                this.target[name] = command;
                return this;
            };
            /*----------------------------------------------------------------
             * Test for invalid variable name
             */
            ModelBuilder.prototype.invalidName = function (name) {
                if (!name.match(/^[a-zA-Z$][\w\d$]*$/)) {
                    console.error('Invalid modelcule field name: "' + name + '"');
                    return true;
                }
                return false;
            };
            /*----------------------------------------------------------------
             * Test if name already in modelcule
             */
            ModelBuilder.prototype.nameInUse = function (name) {
                if (this.target.hasOwnProperty(name)) {
                    console.error('Cannot redefine modelcule field "' + name + '"');
                    return true;
                }
                return false;
            };
            /*----------------------------------------------------------------
             * Test if name not in modelcule
             */
            ModelBuilder.prototype.unknownName = function (name) {
                if (!this.target.hasOwnProperty(name)) {
                    console.error('Unknown modelcule field "' + name + '"');
                    return true;
                }
                return false;
            };
            return ModelBuilder;
        })();
        model.ModelBuilder = ModelBuilder;
        ModelBuilder.prototype['v'] = ModelBuilder.prototype.variable;
        ModelBuilder.prototype['vs'] = ModelBuilder.prototype.variables;
        ModelBuilder.prototype['ov'] = ModelBuilder.prototype.outputVariable;
        ModelBuilder.prototype['ovs'] = ModelBuilder.prototype.outputVariables;
        ModelBuilder.prototype['iv'] = ModelBuilder.prototype.interfaceVariable;
        ModelBuilder.prototype['ivs'] = ModelBuilder.prototype.interfaceVariables;
        ModelBuilder.prototype['c'] = ModelBuilder.prototype.constraint;
        ModelBuilder.prototype['m'] = ModelBuilder.prototype.method;
        ModelBuilder.prototype['a'] = ModelBuilder.prototype.asyncMethod;
        ModelBuilder.prototype['eq'] = ModelBuilder.prototype.equation;
        var initialStar = /^\s*\*\s*/;
        function stripStar(name) {
            return strip(name, initialStar);
        }
        var initialDollar = /^\s*\$\s*/;
        function stripDollar(name) {
            return strip(name, initialDollar);
        }
        function strip(name, re) {
            if (re.test(name)) {
                return name.replace(re, '');
            }
            else {
                return null;
            }
        }
    })(model = hd.model || (hd.model = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var model;
    (function (model) {
        var r = hd.reactive;
        var Path = (function (_super) {
            __extends(Path, _super);
            function Path(start, path) {
                _super.call(this);
                this.properties = null;
                this.start = start;
                this.path = path;
                this.followPath();
            }
            Path.prototype.get = function () {
                return this.result;
            };
            Path.prototype.addObserverInit = function (object, onNext, onError, onCompleted, id) {
                if (this.properties) {
                    var added;
                    if (arguments.length === 1) {
                        added = _super.prototype.addObserver.call(this, object);
                    }
                    else {
                        added = _super.prototype.addObserver.call(this, object, onNext, onError, onCompleted, id);
                    }
                    if (added) {
                        added.onNext(this.result);
                    }
                    return added;
                }
                else {
                    if (arguments.length == 1) {
                        object.onNext(this.result);
                    }
                    else {
                        onNext.call(object, this.result, id);
                    }
                }
            };
            Path.prototype.followPath = function () {
                var properties = [];
                var m = this.start;
                for (var i = 0, l = this.path.length; m != null && i < l; ++i) {
                    var name = this.path[i];
                    var propname = '$' + name;
                    if (propname in m) {
                        var p = m[propname];
                        p.addObserver(this, this.onChange, null, null);
                        properties.push(p);
                        m = p.get();
                    }
                    else {
                        m = m[name];
                    }
                }
                if (m !== this.result) {
                    this.result = m;
                    this.sendNext(m);
                }
                if (properties.length > 0) {
                    this.properties = properties;
                }
                else {
                    this.sendCompleted(); // should be unnecessary
                }
            };
            Path.prototype.onChange = function () {
                if (this.properties) {
                    this.properties.forEach(function (p) {
                        p.removeObserver(this);
                    }, this);
                    this.properties = null;
                }
                this.followPath();
            };
            return Path;
        })(r.BasicObservable);
        model.Path = Path;
    })(model = hd.model || (hd.model = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var model;
    (function (model) {
        var r = hd.reactive;
        var Command = (function (_super) {
            __extends(Command, _super);
            function Command() {
                _super.apply(this, arguments);
            }
            Command.prototype.onNext = function () {
                this.activate(false);
            };
            Command.prototype.onError = function () { };
            Command.prototype.onCompleted = function () { };
            return Command;
        })(model.Operation);
        model.Command = Command;
        var None = (function (_super) {
            __extends(None, _super);
            function None(observables) {
                _super.call(this);
                this.cache = [];
                this.observables = observables;
                this.cache.length = observables.length;
                var count = 0;
                for (var i = 0, l = observables.length; i < l; ++i) {
                    if (typeof observables[i].addObserverInit === 'function') {
                        observables[i].addObserverInit(this, this.onNext, null, null, count++);
                    }
                    else {
                        observables[i].addObserver(this, this.onNext, null, null, count++);
                    }
                }
            }
            None.prototype.onNext = function (value, count) {
                this.cache[count] = value ? true : false;
                var none = true;
                for (var i = 0, l = this.cache.length; i < l; ++i) {
                    if (this.cache[i] === undefined) {
                        return;
                    }
                    none = none && !this.cache[i];
                }
                if (this.result !== none) {
                    this.result = none;
                    this.sendNext(none);
                }
            };
            None.prototype.addObserverInit = function (object, onNext, onError, onCompleted, id) {
                var added;
                if (arguments.length === 1) {
                    added = _super.prototype.addObserver.call(this, object);
                }
                else {
                    added = _super.prototype.addObserver.call(this, object, onNext, onError, onCompleted, id);
                }
                if (added && this.result !== undefined) {
                    added.onNext(this.result);
                }
                return added;
            };
            None.prototype.get = function () {
                return this.result;
            };
            return None;
        })(r.BasicObservable);
        model.None = None;
        var SynchronousCommand = (function (_super) {
            __extends(SynchronousCommand, _super);
            function SynchronousCommand(id, name, fn, inputs, outputs) {
                _super.call(this, id, name, fn, inputs, outputs);
                var count = 0;
                var properties = [];
                for (var i = 0, l = inputs.length; i < l; ++i) {
                    var vv = inputs[i];
                    properties.push(vv.pending);
                    properties.push(vv.error);
                }
                this.ready = new None(properties);
            }
            SynchronousCommand.prototype.onNext = function () {
                if (this.ready.get()) {
                    this.activate(false);
                }
            };
            SynchronousCommand.prototype.onError = function () { };
            SynchronousCommand.prototype.onCompleted = function () { };
            return SynchronousCommand;
        })(Command);
        model.SynchronousCommand = SynchronousCommand;
        function varValue(vv) {
            return vv.value.get();
        }
    })(model = hd.model || (hd.model = {}));
})(hd || (hd = {}));
//# sourceMappingURL=model.js.mapvar hd;
(function (hd) {
    var dfa;
    (function (dfa) {
        var u = hd.utility;
        var g = hd.graph;
        var m = hd.model;
        /*==================================================================
         * A record for a single composite-constraint.
         * Records what constraints it combines, and defines methods in
         * terms of combinations of primitive methods.
         */
        var CompositeConstraint = (function () {
            /*----------------------------------------------------------------
             * Constructor
             * Creates a costraint composed from specified primitive
             * constraints.  The constraint is created empty (no methods).
             */
            function CompositeConstraint(cids) {
                // Mapping from composite-method id to ids of primitive methods that compose it
                this.compmids = {};
                this.cids = cids;
                this.id = newCompositeConstraintId(this.cids);
            }
            /*----------------------------------------------------------------
             * Factory method: creates a constraint composed of only a single
             * primitive constraint
             */
            CompositeConstraint.fromPrimitive = function (cgraph, cid) {
                var cmpc = new CompositeConstraint([cid]);
                cgraph.methodsForConstraint(cid).forEach(cmpc.addMethod, cmpc);
                return cmpc;
            };
            /*----------------------------------------------------------------
             * Get the ids of all composite-methods in this constraint
             */
            CompositeConstraint.prototype.getMethodIds = function () {
                return Object.keys(this.compmids);
            };
            /*----------------------------------------------------------------
             * Given a compoiste-method id, return the primitive method ids
             * that compose it.
             */
            CompositeConstraint.prototype.getPrimitiveIdsForMethod = function (mid) {
                return this.compmids[mid];
            };
            CompositeConstraint.prototype.addMethod = function (mids) {
                if (!Array.isArray(mids)) {
                    mids = [mids];
                }
                var mmid = newCompositeMethodId(mids);
                this.compmids[mmid] = mids;
            };
            return CompositeConstraint;
        })();
        dfa.CompositeConstraint = CompositeConstraint;
        /*==================================================================
         */
        function addCompositeMethods(compcgraph, fullcgraph, composite) {
            var vids = {};
            compcgraph.variables().forEach(function (vid) {
                u.stringSet.add(vids, vid);
            });
            for (var compmid in composite.compmids) {
                var mids = composite.compmids[compmid];
                var outs = {};
                for (var i = 0, l = mids.length; i < l; ++i) {
                    var mid = mids[i];
                    outs = fullcgraph.outputsForMethod(mid).reduce(u.stringSet.build, outs);
                }
                var ins = u.stringSet.difference(vids, outs);
                compcgraph.addMethod(compmid, composite.id, u.stringSet.members(ins), u.stringSet.members(outs));
            }
        }
        dfa.addCompositeMethods = addCompositeMethods;
        /*==================================================================
         */
        function makeConstraintGraph(cgraph, composite) {
            var compcgraph = new g.CachingConstraintGraph();
            cgraph.variables().forEach(compcgraph.addVariable, compcgraph);
            addCompositeMethods(compcgraph, cgraph, composite);
            return compcgraph;
        }
        dfa.makeConstraintGraph = makeConstraintGraph;
        /*==================================================================
         */
        function composeAllConstraints(cgraph) {
            var composites = cgraph.constraints()
                .filter(g.isNotStayConstraint)
                .map(CompositeConstraint.fromPrimitive.bind(null, cgraph));
            while (composites.length > 1) {
                var newcomposites = [];
                for (var i = 0, l = composites.length; i < l; i += 2) {
                    if (i + 1 < l) {
                        newcomposites.push(addConstraints(composites[i], composites[i + 1], cgraph));
                    }
                    else {
                        newcomposites.push(composites[i]);
                    }
                }
                composites = newcomposites;
            }
            return composites[0];
        }
        dfa.composeAllConstraints = composeAllConstraints;
        /*==================================================================
         * Take two composite-constraints and combine them, creating a new
         * composite constraint containing every valid combination of the
         * original methods.
         */
        function addConstraints(compA, compB, cgraph) {
            // Calculate all the individual constraints going into this multi-constraint
            var allcids = u.arraySet.unionKnownDisjoint(compA.cids, compB.cids);
            var compC = new CompositeConstraint(allcids);
            var compmidsA = compA.getMethodIds();
            var compmidsB = compB.getMethodIds();
            // Every combination of method from A with method from B
            for (var a = compmidsA.length - 1; a >= 0; --a) {
                var compmidA = compmidsA[a];
                for (var b = compmidsB.length - 1; b >= 0; --b) {
                    var compmidB = compmidsB[b];
                    // Calculate all the individual methods which would be combined
                    var allmids = u.arraySet.unionKnownDisjoint(compA.getPrimitiveIdsForMethod(compmidA), compB.getPrimitiveIdsForMethod(compmidB));
                    // Make a graph of all the methods
                    var mgraph = new g.Digraph();
                    cgraph.variables().forEach(mgraph.addNode, mgraph);
                    allmids.forEach(function (mid) {
                        var inputs = cgraph.inputsForMethod(mid);
                        var outputs = cgraph.outputsForMethod(mid);
                        mgraph.addNode(mid);
                        inputs.forEach(mgraph.addEdgeTo(mid));
                        outputs.forEach(mgraph.addEdgeFrom(mid));
                    });
                    // Check the graph to see if this is valid combination
                    if (isValidCompositeMethod(mgraph, allmids.reduce(u.stringSet.build, {}))) {
                        compC.addMethod(allmids);
                    }
                }
            }
            return compC;
        }
        /*==================================================================
         * Test a graph to make sure it is a valid multi-method.
         * - no two methods with the same output
         * - no cycles
         */
        function isValidCompositeMethod(mgraph, mids) {
            var indegree = {};
            var sources = [];
            var nodes = mgraph.getNodes();
            // Note: To test for cycles we basically do a topological sort of
            //       the nodes in the graph without remembering the result; we
            //       only care whether it worked or not.
            //
            //       Rather than actually removing nodes from the graph, we
            //       keep separate counters of how many edges are going into
            //       each node.
            // Initialize the counter for each node
            // Nodes with a count of zero are added to the sources list
            // If any variables have a count > 1, the graph is invalid
            //   (means more than one method is writing to the variable)
            var methodOutputConflict = false;
            nodes.forEach(function (id) {
                var count = mgraph.getInsFor(id).length;
                indegree[id] = count;
                if (count == 0) {
                    sources.push(id);
                }
                else if (count > 1 && !mids[id]) {
                    methodOutputConflict = true;
                }
            });
            if (methodOutputConflict) {
                return false;
            }
            // We "remove" source nodes by decrementing the counters of each
            // of its output variables
            var removeInput = function removeInput(nodeId) {
                if (--indegree[nodeId] == 0) {
                    sources.push(nodeId);
                }
            };
            var numvisited = 0;
            while (sources.length > 0) {
                var id = sources.pop();
                ++numvisited;
                mgraph.getOutsFor(id).forEach(removeInput);
            }
            // If we visited every node, then we have a topological ordering
            return (numvisited == nodes.length);
        }
        /*==================================================================
         */
        var ids = new m.IdGenerator();
        /*==================================================================
         * Create a unique descriptive id for a multi-constraint
         */
        function newCompositeConstraintId(cids) {
            var name = 'composite';
            if (m.debugIds) {
                var idparts = [];
                cids.forEach(function (cid) {
                    if (idparts.length != 0) {
                        idparts.push(' + ');
                    }
                    idparts.push('(', cid.substring(0, cid.indexOf('#')), ')');
                });
                name = idparts.join('');
            }
            return ids.makeId(name);
        }
        /*==================================================================
         * Create a unique descriptive id for a multi-method
         */
        function newCompositeMethodId(mids) {
            var name = 'composite';
            if (m.debugIds) {
                var idparts = [];
                mids.forEach(function (mid) {
                    if (idparts.length != 0) {
                        idparts.push(' + ');
                    }
                    idparts.push('(', mid.substring(0, mid.indexOf('#')), ')');
                });
                name = idparts.join('');
            }
            return ids.makeId(name);
        }
    })(dfa = hd.dfa || (hd.dfa = {}));
})(hd || (hd = {}));
/*####################################################################
 */
var hd;
(function (hd) {
    var dfa;
    (function (dfa_1) {
        var u = hd.utility;
        /*==================================================================
         * The interface for a DFA
         */
        // Defines order of compile
        (function (Order) {
            Order[Order["Low"] = 0] = "Low";
            Order[Order["High"] = 1] = "High";
        })(dfa_1.Order || (dfa_1.Order = {}));
        var Order = dfa_1.Order;
        ;
        /*==================================================================
         * A DFA in which nodes are simply unique strings.  Makes debugging
         * easy.  Required for compilation.
         *
         * Leaf nodes are simply the leaf value; ensures that leafs with the
         * same value use the same node.
         */
        var SoftLinkedDfa = (function () {
            function SoftLinkedDfa() {
                // Transition table for each node
                this.transitions = {};
                // Since all nodes are strings, we need a separate flag to keep
                // track of the leafs
                this.leafs = {};
                // Pointer to root node
                this.root = null;
                // How many nodes we have (used to generate unique strings)
                this.count = 0;
            }
            /*----------------------------------------------------------------
             * Create/return new node with given transition table
             */
            SoftLinkedDfa.prototype.addNode = function (transitions) {
                var id = 'n' + this.count++;
                if (this.count % 1000 == 0) {
                    u.console.compile.error(this.count + ' nodes...');
                }
                this.transitions[id] = transitions;
                return id;
            };
            /*----------------------------------------------------------------
             * Get list of all nodes
             */
            SoftLinkedDfa.prototype.getNodes = function () {
                return Object.keys(this.transitions);
            };
            /*----------------------------------------------------------------
             * Get transition table for a particular node
             */
            SoftLinkedDfa.prototype.getTransitions = function (node) {
                return this.transitions[node];
            };
            /*----------------------------------------------------------------
             * Set which node is the root (must be a node already in the DFA)
             */
            SoftLinkedDfa.prototype.setRoot = function (node) {
                this.root = node;
            };
            /*----------------------------------------------------------------
             * Get the root node
             */
            SoftLinkedDfa.prototype.getRoot = function () {
                return this.root;
            };
            /*----------------------------------------------------------------
             * Create/return new node with given leaf value
             */
            SoftLinkedDfa.prototype.addLeaf = function (leaf) {
                this.leafs[leaf] = true;
                return leaf;
            };
            /*----------------------------------------------------------------
             * Get value if parameter is leaf node; null if not a leaf
             */
            SoftLinkedDfa.prototype.getLeafValue = function (node) {
                return this.leafs[node] ? node : null;
            };
            return SoftLinkedDfa;
        })();
        dfa_1.SoftLinkedDfa = SoftLinkedDfa;
        var HardLinkedDfa = (function () {
            function HardLinkedDfa() {
                // List of all nodes
                this.nodes = [];
                // Pointer to root node
                this.root = null;
            }
            /*----------------------------------------------------------------
             * Create/return new node with given transition table
             */
            HardLinkedDfa.prototype.addNode = function (transitions) {
                this.nodes.push(transitions);
                return transitions;
            };
            /*----------------------------------------------------------------
             * Get list of all nodes
             */
            HardLinkedDfa.prototype.getNodes = function () {
                return this.nodes;
            };
            /*----------------------------------------------------------------
             * Get transition table for a particular node
             */
            HardLinkedDfa.prototype.getTransitions = function (node) {
                return node;
            };
            /*----------------------------------------------------------------
             * Set which node is the root (must be a node already in the DFA)
             */
            HardLinkedDfa.prototype.setRoot = function (node) {
                this.root = node;
            };
            /*----------------------------------------------------------------
             * Get the root node
             */
            HardLinkedDfa.prototype.getRoot = function () {
                return this.root;
            };
            /*----------------------------------------------------------------
             * Create/return new node with given leaf value
             */
            HardLinkedDfa.prototype.addLeaf = function (leaf) {
                return leaf;
            };
            /*----------------------------------------------------------------
             * Get value if parameter is leaf node; null if not a leaf
             */
            HardLinkedDfa.prototype.getLeafValue = function (node) {
                return (typeof node === 'string') ? node : null;
            };
            return HardLinkedDfa;
        })();
        dfa_1.HardLinkedDfa = HardLinkedDfa;
        /*==================================================================
         * DFA simulation function
         */
        function runDfa(dfa, input) {
            var node = dfa.getRoot();
            var plan;
            var i = dfa.order == Order.High ? input.length - 1 : 0;
            var di = dfa.order == Order.High ? -1 : 1;
            while (node && !(plan = dfa.getLeafValue(node))) {
                var nextNode = dfa.getTransitions(node)[input[i]];
                if (nextNode) {
                    node = nextNode;
                }
                i += di;
            }
            return plan ? plan : null;
        }
        dfa_1.runDfa = runDfa;
    })(dfa = hd.dfa || (hd.dfa = {}));
})(hd || (hd = {}));
/*####################################################################
 */
var hd;
(function (hd) {
    var dfa;
    (function (dfa_2) {
        var u = hd.utility;
        var g = hd.graph;
        /*==================================================================
         * Actual compilation function.  Sets up and runs builder.
         */
        function compileToDfa(dfa, cgraph, order) {
            // We're only interested in required constraints
            var cids = cgraph.constraints().filter(g.isNotStayConstraint);
            // Assert: all the constraints have been composed to a single constraint
            if (cids.length != 1) {
                console.error('Cannot compile a constraint graph to a decision tree unless it consists of a single constraint');
                return;
            }
            // Now we know the plans are just the methods of our one constraint
            // Map each plan to the stay constraints for its inputs
            var planInputs = {};
            var mids = cgraph.methodsForConstraint(cids[0]);
            for (var i = 0, l = mids.length; i < l; ++i) {
                var mid = mids[i];
                var midInputs = cgraph.inputsForMethod(mid);
                planInputs[mid] = midInputs.map(g.stayConstraint);
            }
            // Create list of all stay constraints
            var dfaInputs = cgraph.variables().map(g.stayConstraint);
            // Build the DFA
            var builder = new DfaBuilder(planInputs, dfaInputs);
            builder.buildDfa(dfa, order);
        }
        dfa_2.compileToDfa = compileToDfa;
        /*==================================================================
         * DFA building algorithm
         */
        var DfaBuilder = (function () {
            /*----------------------------------------------------------------
             * Initialize
             */
            function DfaBuilder(planInputs, inputs) {
                // Cache of nodes created indexed by path
                this.pathCache = {};
                // Cache of nodes created indexed by transition table
                this.transCache = {};
                // Used for debug output
                this.count = 0;
                this.max = 0;
                this.planInputs = planInputs;
                this.inputs = inputs;
            }
            /*----------------------------------------------------------------
             * Entry point
             */
            DfaBuilder.prototype.buildDfa = function (dfa, order) {
                this.dfa = dfa;
                this.dfa.order = order;
                this.count = 0;
                this.max = this.inputs.length * (this.inputs.length - 1);
                if (order == dfa_2.Order.Low) {
                    dfa.setRoot(this.buildLowTreeNode([], this.inputs));
                }
                else {
                    dfa.setRoot(this.buildHighTreeNode([], this.inputs, Object.keys(this.planInputs)));
                }
            };
            /*----------------------------------------------------------------
             * Attempts to find node with same transition table; if it cannot,
             * then it creates a new one
             */
            DfaBuilder.prototype.supplyNode = function (transitions) {
                // Make signature
                var keys = Object.keys(transitions);
                keys.sort();
                var pieces = [];
                keys.forEach(function (k) {
                    pieces.push(k, transitions[k]);
                });
                var transId = pieces.join(',');
                // Get node
                var node = this.transCache[transId];
                if (node) {
                    return node;
                }
                else {
                    return this.transCache[transId] = this.dfa.addNode(transitions);
                }
            };
            /*----------------------------------------------------------------
             * Build a single tree node for a high-order tree -- and,
             * recursively, all its children.
             */
            DfaBuilder.prototype.buildHighTreeNode = function (encountered, remaining, candidates) {
                var transitions = {};
                // Check to see if we've visited a communatively-equivalent path
                var copy = encountered.slice(0);
                copy.sort();
                var nodeId = copy.join(',');
                var node = this.pathCache[nodeId];
                if (node) {
                    return node;
                }
                var numTransitions = 0;
                // Try each remaining stay constraint
                for (var i = 0, l = remaining.length; i < l; ++i) {
                    // debug output
                    if (encountered.length == 1) {
                        ++this.count;
                        u.console.compile.error(this.count + '/' + this.max);
                    }
                    // We cycle through remaining inputs by shifting them off the front,
                    //   then pushing them on the back when we're done
                    var vid = remaining.shift();
                    // Rule out candidates that output to this variable
                    var reducedCandidates = candidates.filter(function (plan) {
                        return this.planInputs[plan].indexOf(vid) != -1;
                    }, this);
                    // See what we got
                    if (reducedCandidates.length == 1) {
                        transitions[vid] = this.dfa.addLeaf(reducedCandidates[0]);
                        ++numTransitions;
                    }
                    else if (reducedCandidates.length > 0 &&
                        reducedCandidates.length < candidates.length) {
                        encountered.push(vid);
                        transitions[vid] = this.buildHighTreeNode(encountered, remaining, reducedCandidates);
                        encountered.pop();
                        ++numTransitions;
                    }
                    // We're done - push on the back
                    remaining.push(vid);
                }
                // Assertion: should always have at least one transition
                if (numTransitions == 0) {
                    console.error('Building decision tree node with no transitions (we should have already found a solution by this point)');
                }
                // Create node
                return this.pathCache[nodeId] = this.supplyNode(transitions);
            };
            /*----------------------------------------------------------------
             * Build a single tree node for a low-order tree -- and,
             * recursively, all its children.
             */
            DfaBuilder.prototype.buildLowTreeNode = function (encountered, remaining) {
                var transitions = {};
                var numTransitions = 0;
                // Try each remaining stay contraint
                for (var i = 0, l = remaining.length; i < l; ++i) {
                    // debug output
                    if (encountered.length == 1) {
                        ++this.count;
                        u.console.compile.error(this.count + '/' + this.max);
                    }
                    // We cycle through remaining inputs by shifting them off the front,
                    //   then pushing them on the back when we're done
                    var vid = remaining.shift();
                    // See if we can uniquely determine a plan from this information
                    var plan = this.pickPlanFromLow(encountered, remaining);
                    if (plan) {
                        transitions[vid] = this.dfa.addLeaf(plan);
                        ++numTransitions;
                    }
                    else {
                        encountered.push(vid);
                        transitions[vid] = this.buildLowTreeNode(encountered, remaining);
                        encountered.pop();
                        ++numTransitions;
                    }
                    // We're done - push on the back
                    remaining.push(vid);
                }
                // Create node
                return this.supplyNode(transitions);
            };
            /*----------------------------------------------------------------
             * Determine whether the given variables uniquely determine a
             * plan.
             */
            DfaBuilder.prototype.pickPlanFromLow = function (encountered, remaining) {
                var candidates = [];
                // Only consider plans that don't write to any of the remaining variables
                for (var plan in this.planInputs) {
                    if (u.arraySet.isSubset(remaining, this.planInputs[plan])) {
                        candidates.push(plan);
                    }
                }
                // Go through encountered variables in reverse order and
                // rule out candidates that output to the variable
                var i = encountered.length - 1;
                while (i >= 0 && candidates.length > 1) {
                    var newCandidates = candidates.filter(function (plan) {
                        return this.planInputs[plan].indexOf(encountered[i]) != -1;
                    }, this);
                    if (newCandidates.length > 0) {
                        candidates = newCandidates;
                    }
                    --i;
                }
                if (candidates.length == 1) {
                    return candidates[0];
                }
                else {
                    return null;
                }
            };
            return DfaBuilder;
        })();
    })(dfa = hd.dfa || (hd.dfa = {}));
})(hd || (hd = {}));
//# sourceMappingURL=dfa.js.map/*====================================================================
 * A strength assignment tracks the relative strengths of different
 * constraints.  It can be used to compare two constraints, or to get
 * an entire list of all constraints in ascending order.
 *
 * It is assumed that the only constraints being tracked are
 * non-required constraints.  Thus, the strength assignment may assume
 * that any constraint it is not tracking is required.
 */
var hd;
(function (hd) {
    var plan;
    (function (plan) {
        /*==================================================================
         * This strength assignment operates by assigning a numeric value to
         * each constraint.  It is very fast at updating and at comparing
         * two constraints (since you just look up their associated
         * numbers), but slow at generating an ordered list (you would have
         * to sort a list from scratch using the comparison operator).
         */
        var NumericStrengthAssignment = (function () {
            function NumericStrengthAssignment() {
                // Strongest strength assigned so far
                this.strongest = 0;
                // Weakest strength assigned so far
                this.weakest = 0;
                // Map of constraint strengths
                this.strengths = {};
            }
            /*----------------------------------------------------------------
             * Add/re-order individual constraints
             */
            NumericStrengthAssignment.prototype.setToMax = function (cid) {
                this.strengths[cid] = ++this.strongest;
            };
            NumericStrengthAssignment.prototype.setToMin = function (cid) {
                this.strengths[cid] = --this.weakest;
            };
            /*----------------------------------------------------------------
             * Remove an individual constraint
             */
            NumericStrengthAssignment.prototype.remove = function (cid) {
                delete this.strengths[cid];
            };
            /*----------------------------------------------------------------
             * Test whether a constraint is required.
             */
            NumericStrengthAssignment.prototype.isRequired = function (cid) {
                return !(cid in this.strengths);
            };
            /*----------------------------------------------------------------
             */
            NumericStrengthAssignment.prototype.getOptionalsUnordered = function () {
                return Object.keys(this.strengths);
            };
            /*----------------------------------------------------------------
             * Comparison operator
             */
            NumericStrengthAssignment.prototype.compare = function (cid1, cid2) {
                if (cid1 in this.strengths) {
                    if (cid2 in this.strengths) {
                        return this.strengths[cid1] - this.strengths[cid2];
                    }
                    else {
                        return -1;
                    }
                }
                else {
                    if (cid2 in this.strengths) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            };
            return NumericStrengthAssignment;
        })();
        plan.NumericStrengthAssignment = NumericStrengthAssignment;
        /*==================================================================
         * This strength assignment operates by keeping an ordered list of
         * all constraints.  It is slow at updating and at comparing two
         * constraints (since it requires a linear search of the list), but
         * fast at generating an ordered list.
         */
        var ListStrengthAssignment = (function () {
            function ListStrengthAssignment() {
                // List of constraints from weakest to strongest
                this.strengths = [];
            }
            /*----------------------------------------------------------------
             * Add/re-order individual constraints
             */
            ListStrengthAssignment.prototype.setToMax = function (cid) {
                var i = this.strengths.indexOf(cid);
                if (i >= 0) {
                    this.strengths.splice(i, 1);
                }
                this.strengths.push(cid);
            };
            ListStrengthAssignment.prototype.setToMin = function (cid) {
                var i = this.strengths.indexOf(cid);
                if (i >= 0) {
                    this.strengths.splice(i, 1);
                }
                this.strengths.unshift(cid);
            };
            ListStrengthAssignment.prototype.setOptionals = function (cids) {
                this.strengths = cids;
            };
            /*----------------------------------------------------------------
             * Remove an individual constraint
             */
            ListStrengthAssignment.prototype.remove = function (cid) {
                var i = this.strengths.indexOf(cid);
                if (i >= 0) {
                    this.strengths.splice(i, 1);
                }
            };
            /*----------------------------------------------------------------
             * Get all optional constraints in order from weakest to
             * strongest.
             */
            ListStrengthAssignment.prototype.getList = function () {
                return this.strengths;
            };
            /*----------------------------------------------------------------
             * Comparison operator
             */
            ListStrengthAssignment.prototype.compare = function (cid1, cid2) {
                var i1 = this.strengths.indexOf(cid1);
                var i2 = this.strengths.indexOf(cid2);
                if (i1 >= 0) {
                    if (i2 >= 0) {
                        return i1 - i2;
                    }
                    else {
                        return -1;
                    }
                }
                else {
                    if (i2 >= 0) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            };
            return ListStrengthAssignment;
        })();
        plan.ListStrengthAssignment = ListStrengthAssignment;
    })(plan = hd.plan || (hd.plan = {}));
})(hd || (hd = {}));
/*####################################################################
 * Defines Planner interface.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/*####################################################################
 * Planner using the QuickPlan algorithm.
 */
var hd;
(function (hd) {
    var plan;
    (function (plan) {
        var u = hd.utility;
        var g = hd.graph;
        /*==================================================================
         * The planner object.
         */
        var QuickPlanner = (function () {
            /*----------------------------------------------------------------
             * Initialize from constraint graph.  Set all constraints to
             * be enforced.
             */
            function QuickPlanner(cgraph) {
                // The strength assignment
                this.strengths = new plan.NumericStrengthAssignment();
                this.cgraph = cgraph;
            }
            /*----------------------------------------------------------------
             * Get list of optional constraints only in order from weakest
             * to strongest.
             */
            QuickPlanner.prototype.getOptionals = function () {
                var cids = this.strengths.getOptionalsUnordered();
                cids.sort(this.strengths.compare.bind(this.strengths));
                return cids;
            };
            /*----------------------------------------------------------------
             * Reset all constraint strengths according to provided order from
             * weakest to strongest.  Any constraints not in the list are
             * assumed to be required.
             */
            QuickPlanner.prototype.setOptionals = function (order) {
                this.strengths = new plan.NumericStrengthAssignment();
                order.forEach(this.strengths.setToMax, this.strengths);
            };
            /*----------------------------------------------------------------
             * Remove single constraint from consideration.
             */
            QuickPlanner.prototype.removeOptional = function (cid) {
                this.strengths.remove(cid);
            };
            /*----------------------------------------------------------------
             * Make constraint optional (if it isn't already) and give it the
             * highest strength of all optional constraints.
             */
            QuickPlanner.prototype.setMaxStrength = function (cid) {
                this.strengths.setToMax(cid);
            };
            /*----------------------------------------------------------------
             * Make constraint optional (if it isn't already) and give it the
             * lowest strength of all optional constraints.
             */
            QuickPlanner.prototype.setMinStrength = function (cid) {
                this.strengths.setToMin(cid);
                // TODO: What needs to be resolved?
            };
            /*----------------------------------------------------------------
             */
            QuickPlanner.prototype.compare = function (cid1, cid2) {
                return this.strengths.compare(cid1, cid2);
            };
            /*----------------------------------------------------------------
             * Run planning algorithm; return true if planning succeeded.
             * Updates internal solution graph.
             */
            QuickPlanner.prototype.plan = function (oldSGraph, cidsToEnforce) {
                // Build a new QP solution graph that equals cgraph intersect sgraph
                var qpsgraph = this.sgraph = new QPSolutionGraph();
                this.cgraph.variables().forEach(qpsgraph.addVariable, qpsgraph);
                if (oldSGraph) {
                    this.cgraph.constraints().forEach(function (cid) {
                        var mid = oldSGraph.selectedForConstraint(cid);
                        if (mid) {
                            qpsgraph.addMethod(mid, cid, this.cgraph.inputsForMethod(mid), this.cgraph.outputsForMethod(mid));
                        }
                    }, this);
                }
                var qp = new QuickPlan(this.cgraph, this.strengths, qpsgraph, cidsToEnforce);
                return qp.run();
            };
            /*----------------------------------------------------------------
             * Get solution graph from last successful plan.
             */
            QuickPlanner.prototype.getSGraph = function () {
                return this.sgraph;
            };
            return QuickPlanner;
        })();
        plan.QuickPlanner = QuickPlanner;
        var QPSolutionGraph = (function (_super) {
            __extends(QPSolutionGraph, _super);
            function QPSolutionGraph() {
                _super.apply(this, arguments);
                // changes since last commit
                this.changes = {};
            }
            /*----------------------------------------------------------------
             * Make change to the graph
             */
            QPSolutionGraph.prototype.selectMethod = function (cid, mid, inputs, outputs) {
                var oldmid = this.selectedForConstraint(cid);
                if (oldmid != mid) {
                    // record the change
                    if (cid in this.changes) {
                        if (this.changes[cid].mid == mid) {
                            delete this.changes[cid];
                        }
                    }
                    else {
                        this.changes[cid] = { mid: oldmid,
                            inputs: oldmid ? this.inputsForMethod(oldmid) : null,
                            outputs: oldmid ? this.outputsForMethod(oldmid) : null
                        };
                    }
                    // make the switch
                    _super.prototype.selectMethod.call(this, cid, mid, inputs, outputs);
                }
            };
            /*----------------------------------------------------------------
             * Rollback any changes since the last commit.
             */
            QPSolutionGraph.prototype.rollback = function () {
                for (var cid in this.changes) {
                    _super.prototype.selectMethod.call(this, cid, this.changes[cid].mid, this.changes[cid].inputs, this.changes[cid].outputs);
                }
                this.changes = {};
            };
            /*----------------------------------------------------------------
             * Commit all changes since the last commit
             * (by forgetting about them).
             */
            QPSolutionGraph.prototype.commit = function () {
                this.changes = {};
            };
            return QPSolutionGraph;
        })(g.CachingSolutionGraph);
        plan.QPSolutionGraph = QPSolutionGraph;
        /*==================================================================
         * Performs one part of the Quick Plan algorithm:  enforce a
         * single constraint by retracting weaker constraints until it can
         * be enforced.
         */
        var QPSingle = (function () {
            /*----------------------------------------------------------------
             * Initialize members.
             */
            function QPSingle(cidToEnforce, fullcgraph, strengths, sgraph) {
                // Strongest constraint which has been retracted so far
                this.strongestRetractedCid = null;
                // Any variables which we have made undetermined (not output by any method)
                // by modifying constraints
                this.undeterminedVids = {};
                this.cidToEnforce = cidToEnforce;
                this.strengths = strengths;
                this.sgraph = sgraph;
                // Copy the subgraph we will be considering
                var upstreamConstraints = new g.DigraphWalker(sgraph.graph)
                    .nodesUpstreamOtherType(fullcgraph.variablesForConstraint(cidToEnforce))
                    .map(fullcgraph.constraintForMethod, fullcgraph);
                var copyFromFull = copyConstraintsFrom(fullcgraph);
                this.subcgraph = new g.CachingConstraintGraph();
                this.subcgraph = upstreamConstraints.reduce(copyFromFull, this.subcgraph);
                this.subcgraph = copyFromFull(this.subcgraph, cidToEnforce);
                // Find retractable constraints
                this.retractableCids = new u.Heap(function (cid1, cid2) {
                    return strengths.compare(cid1, cid2) < 0;
                });
                this.retractableCids.pushAll(this.subcgraph.constraints().filter(this.isRetractable, this));
                // Initialize free variable queue
                this.freeVarQueue =
                    this.subcgraph.variables().filter(this.isFreeVar, this);
            }
            /*----------------------------------------------------------------
             * Check to see if planning has succeeded yet.
             */
            QPSingle.prototype.targetConstraintSatisfied = function () {
                return this.sgraph.selectedForConstraint(this.cidToEnforce) !== undefined;
            };
            /*----------------------------------------------------------------
             * Geter for strongest retracted constraint
             */
            QPSingle.prototype.getStrongestRetractedCid = function () {
                return this.strongestRetractedCid;
            };
            /*----------------------------------------------------------------
             * Getter for undetermined variables
             */
            QPSingle.prototype.getUndeterminedVids = function () {
                return u.stringSet.members(this.undeterminedVids);
            };
            /*----------------------------------------------------------------
             * Attempt to enforce target constraint by repeatedly enforcing
             * constraints for any free variables, then retracting weaker
             * constraints (hopefully freeing more variables).
             */
            QPSingle.prototype.run = function () {
                this.enforceConstraintsForAnyFreeVariables();
                // Keep retracting as long as their are weaker constraints
                while (!this.targetConstraintSatisfied() &&
                    this.retractableCids.length > 0) {
                    // Retract
                    var retractCid = this.retractableCids.pop();
                    this.determineConstraint(retractCid, undefined);
                    this.enforceConstraintsForAnyFreeVariables();
                }
                // Did it work?
                if (this.targetConstraintSatisfied()) {
                    this.sgraph.commit();
                    return true;
                }
                else {
                    this.sgraph.rollback();
                    return false;
                }
            };
            /*----------------------------------------------------------------
             * Attempt to enforce constraints for any free variables by
             * selecting the method that outputs to it.
             */
            QPSingle.prototype.enforceConstraintsForAnyFreeVariables = function () {
                while (!this.targetConstraintSatisfied() &&
                    this.freeVarQueue.length > 0) {
                    var vid = this.freeVarQueue.pop();
                    var cids = this.subcgraph.constraintsWhichOutput(vid);
                    if (cids.length == 1) {
                        var cid = cids[0];
                        var mid = this.bestSelectableMethod(cid);
                        if (mid) {
                            this.determineConstraint(cid, mid);
                        }
                    }
                }
            };
            /*----------------------------------------------------------------
             * Return the method from the specified constraint which only
             * outputs to free variables.  If more than one is found,
             * returns the one with the fewest outputs.
             */
            QPSingle.prototype.bestSelectableMethod = function (cid) {
                var mids = this.subcgraph.methodsForConstraint(cid);
                var best = null;
                var bestCount = 0;
                mids.forEach(function (mid) {
                    var outputs = this.subcgraph.outputsForMethod(mid);
                    if (outputs.every(this.isFreeVar, this)) {
                        if (best === null || bestCount > outputs.length) {
                            best = mid;
                            bestCount = outputs.length;
                        }
                    }
                }, this);
                return best;
            };
            /*----------------------------------------------------------------
             * Set constraint in the solution graph -- either to a selected
             * method, or to undefined if it's being retracted
             */
            QPSingle.prototype.determineConstraint = function (cid, mid) {
                // Outputs of the old method become undetermined
                var oldmid = this.sgraph.selectedForConstraint(cid);
                if (oldmid) {
                    this.sgraph.outputsForMethod(oldmid)
                        .forEach(this.makeUndetermined, this);
                }
                // Make the switch
                this.sgraph.selectMethod(cid, mid, this.subcgraph.inputsForMethod(mid), this.subcgraph.outputsForMethod(mid));
                // Outputs of the new method are no longer undetermined
                if (mid) {
                    this.sgraph.outputsForMethod(mid)
                        .forEach(this.makeDetermined, this);
                }
                // Remove constraint from constraint graph
                var outputs = this.subcgraph.outputsForConstraint(cid);
                this.subcgraph.methodsForConstraint(cid)
                    .forEach(this.subcgraph.removeMethod, this.subcgraph);
                this.freeVarQueue =
                    this.freeVarQueue.concat(outputs.filter(this.isFreeVar, this));
                // Remember the strongest retracted
                if (mid === undefined &&
                    (this.strongestRetractedCid === null ||
                        this.strengths.compare(this.strongestRetractedCid, cid) < 0)) {
                    this.strongestRetractedCid = cid;
                }
            };
            /*----------------------------------------------------------------
             * Simple predicate to see if a variable is free.
             */
            QPSingle.prototype.isFreeVar = function (vid) {
                var cids = this.subcgraph.constraintsWhichOutput(vid);
                return cids.length == 1;
            };
            /*----------------------------------------------------------------
             * Simple predicate to see if a constraint is retractable.
             */
            QPSingle.prototype.isRetractable = function (cid) {
                return this.strengths.compare(cid, this.cidToEnforce) < 0;
            };
            /*----------------------------------------------------------------
             * Helper
             */
            QPSingle.prototype.makeUndetermined = function (vid) {
                u.stringSet.add(this.undeterminedVids, vid);
            };
            /*----------------------------------------------------------------
             * Helper
             */
            QPSingle.prototype.makeDetermined = function (vid) {
                u.stringSet.remove(this.undeterminedVids, vid);
            };
            return QPSingle;
        })();
        /*------------------------------------------------------------------
         * Helper function for copying constraints from one constraint
         * graph to another.
         *
         * Written in curried form to facilitate applying with forEach.
         */
        function copyConstraintsFrom(source) {
            return function (destination, cid) {
                source.variablesForConstraint(cid).forEach(function (vid) {
                    if (!destination.contains(vid)) {
                        destination.addVariable(vid);
                    }
                });
                source.methodsForConstraint(cid).forEach(function (mid) {
                    destination.addMethod(mid, cid, source.inputsForMethod(mid), source.outputsForMethod(mid));
                });
                return destination;
            };
        }
        /*==================================================================
         * The full Quick Plan algorithm.
         */
        var QuickPlan = (function () {
            /*----------------------------------------------------------------
             * Initialize
             */
            function QuickPlan(cgraph, strengths, sgraph, cidsToEnforce) {
                this.cgraph = cgraph;
                this.sgraph = sgraph;
                this.strengths = strengths;
                // Move the cids into a max-heap
                this.cidsToEnforce = new u.Heap(function (cid1, cid2) {
                    return strengths.compare(cid1, cid2) > 0;
                });
                this.cidsToEnforce.pushAll(cidsToEnforce);
            }
            /*----------------------------------------------------------------
             * Perform the quick-plan algorithm to enforce all specified
             * constraints (if possible)
             */
            QuickPlan.prototype.run = function () {
                var allSucceeded = true;
                // Go through constraints from strongest to weakest
                while (this.cidsToEnforce.length > 0) {
                    var cid = this.cidsToEnforce.pop();
                    // Try to enforce a single constraint
                    var plan1 = new QPSingle(cid, this.cgraph, this.strengths, this.sgraph);
                    if (plan1.run()) {
                        // Add back any constraints which may have become eligible
                        var strongestRetracted = plan1.getStrongestRetractedCid();
                        if (strongestRetracted) {
                            var unenforced = this.collectDownstreamUnenforced(cid, strongestRetracted, plan1.getUndeterminedVids());
                            unenforced.forEach(function (cid) {
                                if (!this.cidsToEnforce.contains(cid)) {
                                    this.cidsToEnforce.push(cid);
                                }
                            }, this);
                        }
                    }
                    else if (this.strengths.isRequired(cid)) {
                        allSucceeded = false;
                    }
                }
                return allSucceeded;
            };
            /*----------------------------------------------------------------
             * If we had to retract anything then we need to check for
             * constraints which may now be eligible for enforcing.  They are
             * the ones which are (1) downstream of something we retracted,
             * and (2) weaker than what we retracted
             */
            QuickPlan.prototype.collectDownstreamUnenforced = function (cid, strongestRetracted, undetermined) {
                // First, find all the downstream variables
                var selected = this.sgraph.selectedForConstraint(cid);
                var startingVars = u.arraySet.union(this.sgraph.outputsForMethod(selected), undetermined);
                var downstreamVariables = new g.DigraphWalker(this.sgraph.graph)
                    .nodesDownstreamSameType(startingVars);
                // Get constraints which write to those variables
                var cids = downstreamVariables
                    .map(this.cgraph.constraintsWhichOutput, this.cgraph)
                    .reduce(function (collected, cids) {
                    return cids.reduce(u.stringSet.build, collected);
                }, {});
                // Return the ones which are unenforced and weaker
                return u.stringSet.members(cids)
                    .filter(function (cid) {
                    return (this.strengths.compare(cid, strongestRetracted) < 0 &&
                        this.sgraph.selectedForConstraint(cid) === undefined);
                }, this);
            };
            return QuickPlan;
        })();
        // For type checking
        if (false) {
            var p = new QuickPlanner(null);
        }
    })(plan = hd.plan || (hd.plan = {}));
})(hd || (hd = {}));
/*####################################################################
 * Planner using compiled DFA function.
 */
var hd;
(function (hd) {
    var plan;
    (function (plan) {
        var g = hd.graph;
        /*==================================================================
         * The planner object.
         */
        var DfaFnPlanner = (function () {
            /*----------------------------------------------------------------
             * Initialize.
             */
            function DfaFnPlanner(cidIndexes, mids, fn, cgraph) {
                // Map stay constraints to an index number
                this.cidIndexes = {};
                this.cidCount = 0;
                // The strength assignment
                this.strengths = new plan.ListStrengthAssignment();
                this.cidIndexes = cidIndexes;
                this.cidCount = Object.keys(cidIndexes).length;
                this.mids = mids;
                this.fn = fn;
                this.cgraph = cgraph;
            }
            /*----------------------------------------------------------------
             * Get list of optional constraints only in order from weakest
             * to strongest.
             */
            DfaFnPlanner.prototype.getOptionals = function () {
                var reverseMap = [];
                for (var cid in this.cidIndexes) {
                    reverseMap[this.cidIndexes[cid]] = cid;
                }
                return this.strengths.getList().map(function (idx) {
                    return reverseMap[idx];
                });
            };
            /*----------------------------------------------------------------
             * Reset all constraint strengths according to provided order from
             * weakest to strongest.  Any constraints not in the list are
             * assumed to be required.
             */
            DfaFnPlanner.prototype.setOptionals = function (order) {
                for (var i = 0, l = order.length; i < l; ++i) {
                    var cid = order[i];
                    if (!(cid in this.cidIndexes)) {
                        this.cidIndexes[cid] = this.cidCount++;
                    }
                }
                this.strengths.setOptionals(order.map(function (cid) {
                    return this.cidIndexes[cid];
                }, this));
            };
            /*----------------------------------------------------------------
             * Remove single constraint from consideration.
             */
            DfaFnPlanner.prototype.removeOptional = function (cid) {
                console.error("Cannot make modifications to constraint graph with DFA planner");
            };
            /*----------------------------------------------------------------
             * Make constraint optional (if it isn't already) and give it the
             * highest strength of all optional constraints.
             */
            DfaFnPlanner.prototype.setMaxStrength = function (cid) {
                var idx = this.cidIndexes[cid];
                if (idx === undefined) {
                    idx = this.cidIndexes[cid] = this.cidCount++;
                }
                this.strengths.setToMax(idx);
            };
            /*----------------------------------------------------------------
             * Make constraint optional (if it isn't already) and give it the
             * lowest strength of all optional constraints.
             */
            DfaFnPlanner.prototype.setMinStrength = function (cid) {
                var idx = this.cidIndexes[cid];
                if (idx === undefined) {
                    idx = this.cidIndexes[cid] = this.cidCount++;
                }
                this.strengths.setToMin(idx);
            };
            /*----------------------------------------------------------------
             * Test whether first is stronger than second.
             */
            DfaFnPlanner.prototype.compare = function (cid1, cid2) {
                return this.strengths.compare(this.cidIndexes[cid1], this.cidIndexes[cid2]);
            };
            /*----------------------------------------------------------------
             * Run planning algorithm; return true if planning succeeded.
             */
            DfaFnPlanner.prototype.plan = function () {
                var selectedMethods = this.fn.call(null, this.strengths.getList());
                if (selectedMethods) {
                    this.selectedMethods = selectedMethods;
                    return true;
                }
                else {
                    return false;
                }
            };
            /*----------------------------------------------------------------
             * Get solution graph from last successful plan.
             */
            DfaFnPlanner.prototype.getSGraph = function () {
                var sgraph = new g.CachingSolutionGraph();
                this.cgraph.variables().forEach(sgraph.addVariable, sgraph);
                for (var i = 0, l = this.selectedMethods.length; i < l; ++i) {
                    var mid = this.mids[this.selectedMethods[i]];
                    sgraph.addMethod(mid, this.cgraph.constraintForMethod(mid), this.cgraph.inputsForMethod(mid), this.cgraph.outputsForMethod(mid));
                }
                return sgraph;
            };
            return DfaFnPlanner;
        })();
        plan.DfaFnPlanner = DfaFnPlanner;
        // For type checking
        if (false) {
            var p = new DfaFnPlanner(null, null, null, null);
        }
    })(plan = hd.plan || (hd.plan = {}));
})(hd || (hd = {}));
/*####################################################################
 * Planner which creates and simulates a DFA.
 */
var hd;
(function (hd) {
    var plan;
    (function (plan) {
        var g = hd.graph;
        var d = hd.dfa;
        /*==================================================================
         * The planner object
         */
        var ComposedPlanner = (function () {
            /*----------------------------------------------------------------
             * Initialize.
             */
            function ComposedPlanner(cgraph) {
                // The graph of the single, composed constraint
                this.compcgraph = new g.CachingConstraintGraph();
                // The strength assignment
                this.strengths = new plan.ListStrengthAssignment();
                this.cgraph = cgraph;
                this.recompose();
            }
            /*----------------------------------------------------------------
             * Get list of optional constraints only in order from weakest
             * to strongest.
             */
            ComposedPlanner.prototype.getOptionals = function () {
                return this.strengths.getList();
            };
            /*----------------------------------------------------------------
             * Reset all constraint strengths according to provided order from
             * weakest to strongest.  Any constraints not in the list are
             * assumed to be required.
             */
            ComposedPlanner.prototype.setOptionals = function (order) {
                this.strengths.setOptionals(order);
            };
            /*----------------------------------------------------------------
             * Remove single constraint from consideration.
             */
            ComposedPlanner.prototype.removeOptional = function (cid) {
                this.strengths.remove(cid);
            };
            /*----------------------------------------------------------------
             * Make constraint optional (if it isn't already) and give it the
             * highest strength of all optional constraints.
             */
            ComposedPlanner.prototype.setMaxStrength = function (cid) {
                this.strengths.setToMax(cid);
            };
            /*----------------------------------------------------------------
             * Make constraint optional (if it isn't already) and give it the
             * lowest strength of all optional constraints.
             */
            ComposedPlanner.prototype.setMinStrength = function (cid) {
                this.strengths.setToMin(cid);
            };
            /*----------------------------------------------------------------
             * Test whether first is stronger than second.
             */
            ComposedPlanner.prototype.compare = function (cid1, cid2) {
                return this.strengths.compare(cid1, cid2);
            };
            /*----------------------------------------------------------------
             * Run planning algorithm; return true if planning succeeded.
             */
            ComposedPlanner.prototype.plan = function (sgraph, cidsToEnforce) {
                // If changes have been made to cgraph must rebuild DFA
                if (cidsToEnforce.some(g.isNotStayConstraint)) {
                    this.recompose();
                }
                // Simulate DFA
                this.selected = d.runDfa(this.dfa, this.strengths.getList());
                return this.selected ? true : false;
            };
            /*----------------------------------------------------------------
             * Get solution graph from last successful plan.
             */
            ComposedPlanner.prototype.getSGraph = function () {
                var sgraph = new g.CachingSolutionGraph();
                this.cgraph.variables().forEach(sgraph.addVariable, sgraph);
                var selectedMethods = this.composite.compmids[this.selected];
                for (var i = 0, l = selectedMethods.length; i < l; ++i) {
                    var mid = selectedMethods[i];
                    sgraph.addMethod(mid, this.cgraph.constraintForMethod(mid), this.cgraph.inputsForMethod(mid), this.cgraph.outputsForMethod(mid));
                }
                return sgraph;
            };
            /*----------------------------------------------------------------
             */
            ComposedPlanner.prototype.recompose = function () {
                this.composite = d.composeAllConstraints(this.cgraph);
                this.compcgraph.methods().forEach(this.compcgraph.removeMethod, this.compcgraph);
                this.compcgraph.variables().forEach(this.compcgraph.removeVariable, this.compcgraph);
                this.cgraph.variables().forEach(this.compcgraph.addVariable, this.compcgraph);
                d.addCompositeMethods(this.compcgraph, this.cgraph, this.composite);
                this.dfa = new d.SoftLinkedDfa();
                d.compileToDfa(this.dfa, this.compcgraph, d.Order.High);
            };
            return ComposedPlanner;
        })();
        plan.ComposedPlanner = ComposedPlanner;
        // For type checking
        if (false) {
            var p = new ComposedPlanner(null);
        }
    })(plan = hd.plan || (hd.plan = {}));
})(hd || (hd = {}));
//# sourceMappingURL=plan.js.map/*####################################################################
 * The EnablementLabels class.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var hd;
(function (hd) {
    var enable;
    (function (enable) {
        var u = hd.utility;
        var r = hd.reactive;
        /*==================================================================
         * Label for an edge in the enablement graph.
         */
        (function (Label) {
            Label[Label["Irrelevant"] = 1] = "Irrelevant";
            Label[Label["AssumedRelevant"] = 2] = "AssumedRelevant";
            Label[Label["Relevant"] = 3] = "Relevant";
        })(enable.Label || (enable.Label = {}));
        var Label = enable.Label;
        ;
        /*==================================================================
         * The enablement graph is the same as the solution graph with
         * labels.  So, rather than copying the structure of the solution
         * graph, we just store here the labels.  Thus,
         *   SolutionGraph + EnablementLabels = EnablementGraph
         */
        var EnablementLabels = (function (_super) {
            __extends(EnablementLabels, _super);
            function EnablementLabels() {
                _super.apply(this, arguments);
                // (cid -> mid)
                this.selected = {};
                // Label for each method  (mid -> vid -> label)
                this.labels = {};
                this.scheduled = false;
            }
            /*----------------------------------------------------------------
             * Indicate new selected method for constraint.
             * Primarily just deletes any existing labels for that constraint.
             */
            EnablementLabels.prototype.selectMethod = function (cid, mid) {
                var oldmid = this.selected[cid];
                if (oldmid && oldmid != mid) {
                    delete this.labels[oldmid];
                }
                if (mid) {
                    this.labels[mid] = {};
                }
                this.selected[cid] = mid;
                this.schedule();
            };
            /*----------------------------------------------------------------
             * Get label for edge (vid, mid).  Does not check to see if
             * (vid, mid) is actually in the graph; default return value is
             * AssumedRelevant.
             */
            EnablementLabels.prototype.getLabel = function (vid, mid) {
                var midLabels = this.labels[mid];
                if (midLabels) {
                    var label = midLabels[vid];
                    return label ? label : Label.AssumedRelevant;
                }
                else {
                    return Label.AssumedRelevant;
                }
            };
            /*----------------------------------------------------------------
             * Set label for edge (vid, mid).  Has no effect if mid is not
             * selected method.
             */
            EnablementLabels.prototype.setLabel = function (vid, mid, label) {
                var midLabels = this.labels[mid];
                if (midLabels) {
                    if (midLabels[vid] !== label) {
                        midLabels[vid] = label;
                        this.schedule();
                    }
                }
            };
            /*----------------------------------------------------------------
             * Remove all labels for a constraint.
             */
            EnablementLabels.prototype.removeConstraint = function (mids) {
                for (var i = 0, l = mids.length; i < l; ++i) {
                    delete mids[i];
                }
            };
            /*----------------------------------------------------------------
             * Schedule a call to notify (unless one is already scheduled)
             */
            EnablementLabels.prototype.schedule = function () {
                if (!this.scheduled) {
                    this.scheduled = true;
                    u.schedule(4, this.notify, this);
                }
            };
            /*----------------------------------------------------------------
             * Perform an notify
             */
            EnablementLabels.prototype.notify = function () {
                this.scheduled = false;
                this.sendNext(this);
            };
            return EnablementLabels;
        })(r.BasicObservable);
        enable.EnablementLabels = EnablementLabels;
    })(enable = hd.enable || (hd.enable = {}));
})(hd || (hd = {}));
/*####################################################################
 * The UsageReporter class.
 */
var hd;
(function (hd) {
    var enable;
    (function (enable) {
        var r = hd.reactive;
        /*==================================================================
         * Updates enablement graph labels to reflect whether inputs were
         * used in a specific method invocation.
         *
         * Uses "Assumed" labels until all output promises have been
         * resolved; then switches to regular labels.
         *
         * Does not keep pointers to any promises; simply subscribes to
         * them.  Thus, when promises are reclaimed, these will be too.
         */
        var EnableReporter = (function () {
            /*----------------------------------------------------------------
             * Initialize and subscribe
             */
            function EnableReporter(egraph, mid, inputs, outputs) {
                // How many output promises have completed
                this.completedCount = 0;
                this.egraph = egraph;
                this.mid = mid;
                this.inputVids = Object.keys(inputs);
                this.outputCount = 0;
                // Watch dependency counts of all inputs
                for (var vid in inputs) {
                    inputs[vid].usage.addObserverInit(this, this.onNextUsage, null, null, vid);
                }
                // Watch all outputs
                for (var vid in outputs) {
                    outputs[vid].addObserver(this, null, null, this.onCompletedOutput);
                    ++this.outputCount;
                }
            }
            /*----------------------------------------------------------------
             * When an output promise completes
             */
            EnableReporter.prototype.onCompletedOutput = function () {
                if (++this.completedCount == this.outputCount && this.egraph) {
                    for (var i = 0, l = this.inputVids.length; i < l; ++i) {
                        var vid = this.inputVids[i];
                        if (this.egraph.getLabel(vid, this.mid) === enable.Label.AssumedRelevant) {
                            this.egraph.setLabel(vid, this.mid, enable.Label.Irrelevant);
                        }
                    }
                }
            };
            /*----------------------------------------------------------------
             * When input usage changes
             */
            EnableReporter.prototype.onNextUsage = function (usage, vid) {
                if (this.egraph) {
                    if (usage === r.Usage.Used) {
                        this.egraph.setLabel(vid, this.mid, enable.Label.Relevant);
                    }
                    else if (usage === r.Usage.Unused) {
                        this.egraph.setLabel(vid, this.mid, enable.Label.Irrelevant);
                    }
                    else if (this.completedCount < this.outputCount) {
                        this.egraph.setLabel(vid, this.mid, enable.Label.AssumedRelevant);
                    }
                }
            };
            /*----------------------------------------------------------------
             * Stop reporting results to enablement graph
             */
            EnableReporter.prototype.cancel = function () {
                this.egraph = null;
            };
            return EnableReporter;
        })();
        enable.EnableReporter = EnableReporter;
        /*==================================================================
         * Enablement manager is used to keep track of all the
         * EnableReporters and make sure that they get canceled when their
         * results are overwritten.  Also manages changes to egraph.
         */
        var EnablementManager = (function () {
            /*----------------------------------------------------------------
             * Initialize
             */
            function EnablementManager(cgraph) {
                // The reporters
                this.reporters = {};
                this.cgraph = cgraph;
                this.egraph = new enable.EnablementLabels();
            }
            /*----------------------------------------------------------------
             * Used to indicate a new method has been scheduled.  Updates
             * the enablement graph, creates new reporters, cancels old ones.
             */
            EnablementManager.prototype.methodScheduled = function (mid, inputs, outputs) {
                var cid = this.cgraph.constraintForMethod(mid);
                this.egraph.selectMethod(cid, mid);
                if (this.reporters[cid]) {
                    this.reporters[cid].cancel();
                }
                this.reporters[cid] =
                    new EnableReporter(this.egraph, mid, inputs, outputs);
            };
            return EnablementManager;
        })();
        enable.EnablementManager = EnablementManager;
    })(enable = hd.enable || (hd.enable = {}));
})(hd || (hd = {}));
/*####################################################################
 * Enablement checking functions
 */
var hd;
(function (hd) {
    var enable;
    (function (enable) {
        var u = hd.utility;
        var g = hd.graph;
        /*==================================================================
         * Check all variables for contributing.  A variable is contributing
         * if it can reach an output variable in the current solution graph.
         * We can check all variables at once by searching backwards
         * starting with the output variables.
         *
         * Returns dictionary mapping variable id to an enablement label.
         * For a given vid, the label will be:
         *   if there is a path to an output containing only
         *          Relevant edges
         *     => Relevant
         *   else if there is a path to an output containing only
         *          Relevant and AssumedRelevant edges
         *     => AssumedRelevant
         *   else if there is a path to an output
         *     => Irrelevant
         *   else
         *     => undefined
         *
         */
        function globalContributingCheck(sgraph, egraph, outputVids) {
            var contributing = {};
            // Perform reverse-search for each output
            outputVids.forEach(function (vid) {
                flood(vid, enable.Label.Relevant);
            });
            return contributing;
            /*----------------------------------------------------------------
             * Recursive searching routine.  Note that we may wind up
             * exploring a node multiple times if it has the potential to
             * improve a variables label.
             */
            function flood(vid, label) {
                if (label > (contributing[vid] || 0)) {
                    contributing[vid] = label;
                    // Travel up to any methods which output this variable
                    var nextMids = sgraph.methodsWhichOutput(vid);
                    for (var i = 0, l = nextMids.length; i < l; ++i) {
                        var nextMid = nextMids[i];
                        // Travel up to any variables which this method inputs
                        var nextVids = sgraph.inputsForMethod(nextMid);
                        nextVids.sort(function (a, b) {
                            return egraph.getLabel(b, nextMid) - egraph.getLabel(a, nextMid);
                        });
                        for (var j = 0, m = nextVids.length; j < m; ++j) {
                            var nextVid = nextVids[j];
                            // Recurse
                            var nextLabel = Math.min(label, egraph.getLabel(nextVid, nextMid));
                            flood(nextVid, nextLabel);
                        }
                    }
                }
            }
        }
        enable.globalContributingCheck = globalContributingCheck;
        /*==================================================================
         * Check a single variable for relevancy.  It's relevant if there
         * is some plan containing a path from the variable to the output
         * that does not contain any edges labeled Irrelevant in egraph.
         *
         * Note that this test can only return Yes or No.
         */
        function relevancyCheck(cgraph, egraph, outputVidSet, vid) {
            // Map of cid -> vid
            var selected = {};
            // Also used to trace our steps so that we do not select two
            //   methods from the same constraint
            return search(vid) ? u.Fuzzy.Yes : u.Fuzzy.No;
            /*----------------------------------------------------------------
             * Recursive searching function.  We search by building a path
             * from the variable method by method until we reach an output
             * variable.  Then we make sure that we can still find a plan
             * if we enforce the methods we've followed.
             */
            function search(vid) {
                if (outputVidSet[vid] && hasPlan(cgraph, selected)) {
                    return true;
                }
                var nextMids = cgraph.methodsWhichInput(vid);
                for (var i = 0, l = nextMids.length; i < l; ++i) {
                    var nextMid = nextMids[i];
                    var nextCid = cgraph.constraintForMethod(nextMid);
                    if (!selected[nextCid] &&
                        egraph.getLabel(vid, nextMid) !== enable.Label.Irrelevant) {
                        selected[nextCid] = nextMid;
                        var nextVids = cgraph.outputsForMethod(nextMid);
                        for (var j = 0, m = nextVids.length; j < m; ++j) {
                            if (search(nextVids[j])) {
                                return true;
                            }
                        }
                        selected[nextCid] = null;
                    }
                }
                return false;
            }
        }
        enable.relevancyCheck = relevancyCheck;
        /*==================================================================
         * Given a constraint graph and a set of methods, see if there is
         * a plan which uses those methods.
         */
        function hasPlan(cgraph, selected) {
            var cidsLeft = {};
            var numCidsLeft = 0;
            var vidCounts = {};
            var freeVarQueue = [];
            initCounts();
            enforceConstraintsForAnyFreeVariables();
            return numCidsLeft == 0;
            /*----------------------------------------------------------------
             * Count up number of constraints each variable uses.  Init
             * free variable queue.
             */
            function initCounts() {
                var cids = cgraph.constraints();
                for (var i = 0, l = cids.length; i < l; ++i) {
                    var cid = cids[i];
                    if (g.isStayConstraint(cid)) {
                        continue;
                    }
                    if (selected[cid]) {
                        // Mark output variables so they are never considered free
                        var vids = cgraph.outputsForMethod(selected[cid]);
                        for (var j = 0, m = vids.length; j < m; ++j) {
                            vidCounts[vids[j]] = -1;
                        }
                    }
                    else {
                        cidsLeft[cid] = true;
                        ++numCidsLeft;
                        var vids = cgraph.outputsForConstraint(cid);
                        for (var j = 0, m = vids.length; j < m; ++j) {
                            var vid = vids[j];
                            var count = vidCounts[vid];
                            if (count != -1) {
                                vidCounts[vid] = count ? count + 1 : 1;
                            }
                        }
                    }
                }
                freeVarQueue = cgraph.variables().filter(isFreeVar);
            }
            /*----------------------------------------------------------------
             * Repeatedly "enforce" any constraints which have a method that
             * writes only to free variables.  We use "enforce" loosely to
             * mean adjust all counters so that it is no longer considered.
             */
            function enforceConstraintsForAnyFreeVariables() {
                while (numCidsLeft > 0 && freeVarQueue.length > 0) {
                    var vid = freeVarQueue.pop();
                    var cids = cgraph.constraintsWhichOutput(vid).filter(isCidLeft);
                    if (cids.length == 1) {
                        var cid = cids[0];
                        if (hasSelectableMethod(cid)) {
                            determineConstraint(cid);
                        }
                    }
                }
            }
            /*----------------------------------------------------------------
             * Check whether there is at least one method in the constraint
             * that writes to only free variables.  We don't care which one
             * it is, only that it exists.
             */
            function hasSelectableMethod(cid) {
                var mids = cgraph.methodsForConstraint(cid);
                for (var i = 0, l = mids.length; i < l; ++i) {
                    var mid = mids[i];
                    var outputs = cgraph.outputsForMethod(mid);
                    if (outputs.every(isFreeVar)) {
                        return true;
                    }
                }
                return false;
            }
            /*----------------------------------------------------------------
             * Adjust counters so that constraint no longer considered.
             */
            function determineConstraint(cid) {
                cidsLeft[cid] = false;
                --numCidsLeft;
                var outputs = cgraph.outputsForConstraint(cid)
                    .forEach(function (vid) {
                    if (--vidCounts[vid] == 1) {
                        freeVarQueue.push(vid);
                    }
                });
            }
            /*----------------------------------------------------------------
             * Helper - is variable a free variable?
             */
            function isFreeVar(vid) {
                return vidCounts[vid] == 1;
            }
            /*----------------------------------------------------------------
             * Helper - is constraint still being considered?
             */
            function isCidLeft(cid) {
                return cidsLeft[cid];
            }
        }
    })(enable = hd.enable || (hd.enable = {}));
})(hd || (hd = {}));
//# sourceMappingURL=enable.js.map/*********************************************************************
 * A ConstraintSystem's duties are
 *   1. Translate a model into a constraint graph
 *   2. Watch the variables to see when they change
 *   3. Run the planner to get a new solution graph
 *   4. Run the evaluator to produce new values
 */
var hd;
(function (hd) {
    var config;
    (function (config) {
        config.defaultPlannerType = hd.plan.QuickPlanner;
        config.forwardEmergingSources = false;
    })(config = hd.config || (hd.config = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var system;
    (function (system) {
        var u = hd.utility;
        var r = hd.reactive;
        var m = hd.model;
        var g = hd.graph;
        var e = hd.enable;
        var c = hd.config;
        // scheduling priority for responding to state changes
        system.SystemUpdatePriority = 1;
        /*==================================================================
         * Update strategies
         */
        (function (Update) {
            Update[Update["None"] = 0] = "None";
            Update[Update["Immediate"] = 1] = "Immediate";
            Update[Update["Scheduled"] = 2] = "Scheduled";
        })(system.Update || (system.Update = {}));
        var Update = system.Update;
        /*==================================================================
         * The constraint system
         */
        var ConstraintSystem = (function () {
            /*----------------------------------------------------------------
             * Initialize members
             */
            function ConstraintSystem(plannerT, cgraphT) {
                if (plannerT === void 0) { plannerT = c.defaultPlannerType; }
                if (cgraphT === void 0) { cgraphT = g.CachingConstraintGraph; }
                // The current solution graph
                this.sgraph = null;
                // Lookup tables - convert ids back to objects
                this.variables = {};
                this.methods = {};
                this.constraints = {};
                // Update strategies
                this.updateOnVariableChange = Update.Scheduled;
                this.updateOnModelChange = Update.Scheduled;
                // Flags for scheduled updates
                this.isUpdateScheduled = false;
                this.isUpdateNeeded = false;
                this.solved = new r.ObservableProperty(true);
                // Constraints added since the last plan
                this.needEnforcing = {};
                this.needEvaluating = {};
                // Touch dependencies
                this.touchDeps = {};
                // Number of pending variables
                this.pendingCount = 0;
                this.outputVids = {};
                this.cgraph = new cgraphT();
                if (plannerT) {
                    this.planner = new plannerT(this.cgraph);
                }
                this.enable = new e.EnablementManager(this.cgraph);
                this.enable.egraph.addObserver(this, this.onNextEgraph, null, null);
            }
            ConstraintSystem.prototype.getCGraph = function () { return this.cgraph; };
            ConstraintSystem.prototype.getSGraph = function () { return this.sgraph; };
            ConstraintSystem.prototype.getPlanner = function () {
                if (!this.planner) {
                    this.planner = new c.defaultPlannerType(this.cgraph);
                }
                return this.planner;
            };
            /*----------------------------------------------------------------
             * Replace existing planner with new planner.
             */
            ConstraintSystem.prototype.switchToNewPlanner = function (plannerT) {
                var newPlanner = new plannerT(this.cgraph);
                if (this.planner) {
                    var oldPlanner = this.planner;
                    newPlanner.setOptionals(oldPlanner.getOptionals());
                }
                this.planner = newPlanner;
                this.cgraph.constraints().reduce(u.stringSet.build, this.needEnforcing);
                this.modelUpdate();
            };
            /*----------------------------------------------------------------
             * Respond to model changes
             */
            //--------------------------------------------
            // Register modelcule
            ConstraintSystem.prototype.addComponent = function (modelcule) {
                if (modelcule instanceof m.ModelBuilder) {
                    console.error('ModelBuilder passed to addComponent - did you forget to call end()?');
                    return;
                }
                // Add existing constraints
                m.Modelcule.constraints(modelcule).forEach(this.addConstraint, this);
                // Watch for constraint changes
                m.Modelcule.changes(modelcule).addObserver(this, this.onNextModelculeEvent, null, null);
            };
            //--------------------------------------------
            // De-register modelcule
            ConstraintSystem.prototype.removeComponent = function (modelcule) {
                // Remove existing constraints
                m.Modelcule.constraints(modelcule).forEach(this.removeConstraint, this);
                // Stop watching for changes
                m.Modelcule.changes(modelcule).removeObserver(this);
            };
            // --------------------------------------------
            // Dispatcher
            ConstraintSystem.prototype.onNextModelculeEvent = function (event) {
                switch (event.type) {
                    case m.ModelculeEventType.addConstraint:
                        this.addConstraint(event.constraint);
                        break;
                    case m.ModelculeEventType.removeConstraint:
                        this.removeConstraint(event.constraint);
                        break;
                }
            };
            //--------------------------------------------
            // Add a new constraint
            ConstraintSystem.prototype.addConstraint = function (cc) {
                if (!(cc.id in this.constraints)) {
                    this.constraints[cc.id] = cc;
                    cc.variables.forEach(this.addVariable, this);
                    cc.methods.forEach(this.addMethod.bind(this, cc.id));
                }
                // Mark for update
                this.needEnforcing[cc.id] = true;
                this.modelUpdate();
            };
            //--------------------------------------------
            // Remove existing constraint
            ConstraintSystem.prototype.removeConstraint = function (cc) {
                if (cc.id in this.constraints) {
                    delete this.constraints[cc.id];
                    cc.methods.forEach(this.removeMethod);
                    cc.variables.forEach(this.removeVariable); // no effect if variable used
                }
            };
            //--------------------------------------------
            // Add a new method
            ConstraintSystem.prototype.addMethod = function (cid, mm) {
                if (!(mm.id in this.methods)) {
                    this.methods[mm.id] = mm;
                    // Add to constraint graph
                    this.cgraph.addMethod(mm.id, cid, mm.inputVars.map(u.getId), mm.outputVars.map(u.getId));
                }
            };
            //--------------------------------------------
            // Remove existing method
            ConstraintSystem.prototype.removeMethod = function (mm) {
                if (mm.id in this.methods) {
                    delete this.methods[mm.id];
                    // Remove from constraint graph
                    this.cgraph.removeMethod(mm.id);
                }
            };
            /*----------------------------------------------------------------
             * Touch dependencies
             */
            ConstraintSystem.prototype.makeConstraintOptional = function (cc) {
                this.getPlanner().setMinStrength(cc.id);
            };
            ConstraintSystem.prototype.addTouchDependency = function (cc1, cc2) {
                var cid1, cid2;
                if (cc1 instanceof m.Variable) {
                    cid1 = g.stayConstraint(cc1.id);
                }
                else {
                    cid1 = cc1.id;
                }
                if (cc2 instanceof m.Variable) {
                    cid2 = g.stayConstraint(cc2.id);
                }
                else {
                    cid2 = cc2.id;
                }
                if (this.touchDeps[cid1]) {
                    u.arraySet.add(this.touchDeps[cid1], cid2);
                }
                else {
                    this.touchDeps[cid1] = [cid2];
                }
            };
            ConstraintSystem.prototype.addTouchDependencies = function (cc1, cc2s) {
                for (var i = 0, l = cc2s.length; i < l; ++i) {
                    this.addTouchDependency(cc1, cc2s[i]);
                }
            };
            ConstraintSystem.prototype.addTouchSet = function (ccs) {
                for (var i = 0, l = ccs.length; i < l; ++i) {
                    for (var j = 0; j < l; ++j) {
                        if (i != j) {
                            this.addTouchDependency(ccs[i], ccs[j]);
                        }
                    }
                }
            };
            ConstraintSystem.prototype.removeTouchDependency = function (cc1, cc2) {
                var cid1, cid2;
                if (cc1 instanceof m.Variable) {
                    cid1 = g.stayConstraint(cc1.id);
                }
                else {
                    cid1 = cc1.id;
                }
                if (cc2 instanceof m.Variable) {
                    cid2 = g.stayConstraint(cc2.id);
                }
                else {
                    cid2 = cc2.id;
                }
                var deps = this.touchDeps[cid1];
                if (deps) {
                    u.arraySet.remove(this.touchDeps[cid1], cid2);
                }
            };
            ConstraintSystem.prototype.removeTouchDependencies = function (cc1, cc2s) {
                for (var i = 0, l = cc2s.length; i < l; ++i) {
                    this.removeTouchDependency(cc1, cc2s[i]);
                }
            };
            ConstraintSystem.prototype.removeTouchSet = function (ccs) {
                for (var i = 0, l = ccs.length; i < l; ++i) {
                    for (var j = 0; j < l; ++j) {
                        if (i != j) {
                            this.removeTouchDependency(ccs[i], ccs[j]);
                        }
                    }
                }
            };
            /*----------------------------------------------------------------
             * Respond to variable changes
             */
            //--------------------------------------------
            // Add / register variable
            ConstraintSystem.prototype.addVariable = function (vv) {
                if (!(vv.id in this.variables)) {
                    this.variables[vv.id] = vv;
                    // Watch for variable events
                    if (vv.pending.get()) {
                        ++this.pendingCount;
                    }
                    if (vv.output.get()) {
                        this.outputVids[vv.id] = true;
                    }
                    vv.changes.addObserver(this, this.onNextVariableChange, null, null);
                    // Create stay constraint
                    var stayMethodId = g.stayMethod(vv.id);
                    var stayConstraintId = g.stayConstraint(vv.id);
                    // Add variable+stay to existing graphs
                    this.cgraph.addVariable(vv.id);
                    this.cgraph.addMethod(stayMethodId, stayConstraintId, [], [vv.id]);
                    // Set stay to optional
                    if (!vv.pending.get() && vv.value.get() === undefined) {
                        this.getPlanner().setMinStrength(stayConstraintId);
                    }
                    else {
                        this.getPlanner().setMaxStrength(stayConstraintId);
                    }
                    // Mark stay constraint as changed
                    this.needEnforcing[stayConstraintId] = true;
                }
            };
            //--------------------------------------------
            // Remove / de-register variable
            ConstraintSystem.prototype.removeVariable = function (vv) {
                if ((vv.id in this.variables) &&
                    this.cgraph.constraintsWhichUse(vv.id).length == 0) {
                    // Remove all references
                    delete this.variables[vv.id];
                    delete this.outputVids[vv.id];
                    delete this.needEnforcing[stayConstraintId];
                    delete this.needEvaluating[stayConstraintId];
                    vv.changes.removeObserver(this);
                    // Remove from graphs
                    var stayConstraintId = g.stayConstraint(vv.id);
                    this.cgraph.removeMethod(g.stayMethod(vv.id));
                    this.planner.removeOptional(stayConstraintId);
                    this.cgraph.removeVariable(vv.id);
                }
            };
            //--------------------------------------------
            // Dispatcher
            ConstraintSystem.prototype.onNextVariableChange = function (event) {
                switch (event.type) {
                    case m.VariableEventType.touched:
                        this.variableTouched(event.vv);
                        break;
                    case m.VariableEventType.changed:
                        this.variableChanged(event.vv);
                        break;
                    case m.VariableEventType.setOutput:
                        this.variableIsOutput(event.vv, event.isOutput);
                    case m.VariableEventType.pending:
                        ++this.pendingCount;
                        break;
                    case m.VariableEventType.settled:
                        if (this.pendingCount > 0) {
                            --this.pendingCount;
                            if (this.pendingCount == 0 && !this.isUpdateNeeded) {
                                this.solved.set(true);
                            }
                        }
                        break;
                }
            };
            //--------------------------------------------
            // Touch variable and all touch dependencies
            ConstraintSystem.prototype.doPromotions = function (originalVid) {
                var planner = this.getPlanner();
                var descending = function (cid1, cid2) {
                    return planner.compare(cid2, cid1);
                };
                var promote = [];
                var i = 0;
                var visited = {};
                promote.push(originalVid);
                visited[originalVid] = true;
                while (i < promote.length) {
                    var vid = promote[i++];
                    var deps = this.touchDeps[vid];
                    if (deps) {
                        deps.sort(descending);
                        deps.forEach(function (dep) {
                            if (!visited[dep]) {
                                promote.push(dep);
                                visited[dep] = true;
                            }
                        });
                    }
                }
                for (--i; i >= 0; --i) {
                    var cid = promote[i];
                    planner.setMaxStrength(cid);
                    if (!this.sgraph ||
                        !this.sgraph.selectedForConstraint(cid)) {
                        this.needEnforcing[cid] = true;
                    }
                }
            };
            //--------------------------------------------
            // Promote variable
            ConstraintSystem.prototype.variableTouched = function (vv) {
                var stayConstraintId = g.stayConstraint(vv.id);
                this.doPromotions(stayConstraintId);
                this.variableUpdate();
            };
            //--------------------------------------------
            // Promote variable and mark as changed
            ConstraintSystem.prototype.variableChanged = function (vv) {
                var stayConstraintId = g.stayConstraint(vv.id);
                this.doPromotions(stayConstraintId);
                this.needEvaluating[stayConstraintId] = true;
                this.variableUpdate();
            };
            //--------------------------------------------
            ConstraintSystem.prototype.variableIsOutput = function (vv, isOutput) {
                if (isOutput) {
                    this.outputVids[vv.id] = true;
                }
                else {
                    delete this.outputVids[vv.id];
                }
            };
            /*----------------------------------------------------------------
             */
            ConstraintSystem.prototype.modelUpdate = function () {
                this.isUpdateNeeded = true;
                this.solved.set(false);
                if (this.updateOnModelChange === Update.Immediate) {
                    this.update();
                }
                else if (this.updateOnModelChange === Update.Scheduled) {
                    this.scheduleUpdate();
                }
            };
            /*----------------------------------------------------------------
             */
            ConstraintSystem.prototype.variableUpdate = function () {
                this.isUpdateNeeded = true;
                this.solved.set(false);
                if (this.updateOnVariableChange === Update.Immediate) {
                    this.update();
                }
                else if (this.updateOnVariableChange === Update.Scheduled) {
                    this.scheduleUpdate();
                }
            };
            /*----------------------------------------------------------------
             */
            ConstraintSystem.prototype.scheduleUpdate = function () {
                if (!this.isUpdateScheduled) {
                    this.isUpdateScheduled = true;
                    u.schedule(system.SystemUpdatePriority, this.performScheduledUpdate, this);
                }
            };
            ConstraintSystem.prototype.performScheduledUpdate = function () {
                this.isUpdateScheduled = false;
                this.update();
            };
            /*----------------------------------------------------------------
             */
            ConstraintSystem.prototype.update = function () {
                if (this.isUpdateNeeded) {
                    this.isUpdateNeeded = false;
                    this.plan();
                    this.evaluate();
                    if (this.pendingCount == 0) {
                        this.solved.set(true);
                    }
                }
            };
            /*----------------------------------------------------------------
             * Update solution graph & dependent info.
             */
            ConstraintSystem.prototype.plan = function () {
                var cids = u.stringSet.members(this.needEnforcing);
                if (cids.length > 0) {
                    // Run planner
                    if (this.planner.plan(this.sgraph, cids)) {
                        this.sgraph = this.planner.getSGraph();
                        // Topological sort of all mids and vids
                        this.topo = system.toposort(this.sgraph, this.planner);
                        // Update stay strengths
                        this.planner.setOptionals(u.reversemap(this.topo.vids, g.stayConstraint));
                        // New constraints need to be evaluated
                        cids.forEach(u.stringSet.add.bind(null, this.needEvaluating));
                        // Reevaluate any emerging source variables
                        if (hd.config.forwardEmergingSources) {
                            this.sgraph.variables().forEach(this.reevaluateIfEmergingSource, this);
                        }
                        // Update source statuses
                        this.sgraph.variables().forEach(this.updateSourceStatus, this);
                    }
                    this.needEnforcing = {};
                }
            };
            // Helper - check for source variables that
            ConstraintSystem.prototype.reevaluateIfEmergingSource = function (vid) {
                var vv = this.variables[vid];
                var stayConstraintId = g.stayConstraint(vid);
                // Evaluate if it's selected AND not previously a source
                //   AND not currently scheduled for evaluation
                if (this.sgraph.selectedForConstraint(stayConstraintId) &&
                    !vv.source.get() && !this.needEvaluating[stayConstraintId]) {
                    vv.makePromise(vv.getForwardedPromise());
                    this.needEvaluating[stayConstraintId] = true;
                }
            };
            // Helper - set source property based on current solution graph
            ConstraintSystem.prototype.updateSourceStatus = function (vid) {
                if (this.sgraph.selectedForConstraint(g.stayConstraint(vid))) {
                    this.variables[vid].source.set(true);
                }
                else {
                    this.variables[vid].source.set(false);
                }
            };
            /*----------------------------------------------------------------
             * Run any methods which need updating.
             */
            ConstraintSystem.prototype.evaluate = function () {
                var mids = u.stringSet.members(this.needEvaluating)
                    .map(function (cid) {
                    return this.sgraph.selectedForConstraint(cid);
                }, this)
                    .filter(function (mid) {
                    return !!mid;
                });
                if (mids.length > 0) {
                    // Collect methods to be run
                    var downstreamMids = new g.DigraphWalker(this.sgraph.graph)
                        .nodesDownstreamSameType(mids)
                        .filter(g.isNotStayMethod)
                        .reduce(u.stringSet.build, {});
                    var scheduledMids = this.topo.mids
                        .filter(function (mid) { return downstreamMids[mid]; });
                    // Evaluate methods
                    scheduledMids.forEach(function (mid) {
                        var ar = this.methods[mid].activate(true);
                        this.enable.methodScheduled(mid, ar.inputs, ar.outputs);
                    }, this);
                    this.needEvaluating = {};
                }
            };
            /*----------------------------------------------------------------
             */
            ConstraintSystem.prototype.onNextEgraph = function (egraph) {
                var outputVids = u.stringSet.members(this.outputVids);
                if (outputVids.length) {
                    var labels = e.globalContributingCheck(this.sgraph, egraph, outputVids);
                    for (var vid in this.variables) {
                        var vv = this.variables[vid];
                        if (labels[vid] === e.Label.Relevant) {
                            vv.contributing.set(u.Fuzzy.Yes);
                            vv.relevant.set(u.Fuzzy.Yes);
                        }
                        else if (labels[vid] === e.Label.AssumedRelevant) {
                            vv.contributing.set(u.Fuzzy.Maybe);
                            vv.relevant.set(u.Fuzzy.Maybe);
                        }
                        else {
                            vv.contributing.set(u.Fuzzy.No);
                            vv.relevant.set(e.relevancyCheck(this.cgraph, this.enable.egraph, this.outputVids, vid));
                        }
                    }
                }
            };
            return ConstraintSystem;
        })();
        system.ConstraintSystem = ConstraintSystem;
    })(system = hd.system || (hd.system = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var system;
    (function (system) {
        var u = hd.utility;
        var g = hd.graph;
        /*==================================================================
         * Perform topological sort of solution graph.
         * Sorts methods and variables separately.
         * Variables are subsorted on strength.
         */
        function toposort(sgraph, planner) {
            // Data structures to store the order calculated
            var mids = [];
            var vids = [];
            // Data structures to keep track of free nodes
            var freeMids = [];
            var freeVids = new u.Heap(function (a, b) {
                return planner.compare(g.stayConstraint(a), g.stayConstraint(b)) > 0;
            });
            // In-degree of all nodes
            var counts = {};
            // Get initial in-degree for methods
            sgraph.methods().forEach(function (mid) {
                var count = sgraph.inputsForMethod(mid).length;
                counts[mid] = count;
                if (count == 0) {
                    freeMids.push(mid);
                }
            });
            // Get initial in-degree for variables
            sgraph.variables().forEach(function (vid) {
                var count = sgraph.methodsWhichOutput(vid).length;
                counts[vid] = count;
                if (count == 0) {
                    freeVids.push(vid);
                }
            });
            // Reduce in-degree for method
            var reduceMid = function reduceMid(mid) {
                if (--counts[mid] == 0) {
                    freeMids.push(mid);
                }
            };
            // Reduce in-degree for variable
            var reduceVid = function reduceVid(vid) {
                if (--counts[vid] == 0) {
                    freeVids.push(vid);
                }
            };
            // Variables that are topologically unrelated should be sorted by strength
            // Repeat until graph is empty
            while (freeVids.length > 0 || freeMids.length > 0) {
                // Pick off any free methods
                while (freeMids.length > 0) {
                    var mid = freeMids.pop();
                    mids.push(mid);
                    sgraph.outputsForMethod(mid).forEach(reduceVid);
                }
                // Pick off just one free variable
                if (freeVids.length > 0) {
                    var vid = freeVids.pop();
                    vids.push(vid);
                    sgraph.methodsWhichInput(vid).forEach(reduceMid);
                }
            }
            return { vids: vids, mids: mids };
        }
        system.toposort = toposort;
    })(system = hd.system || (hd.system = {}));
})(hd || (hd = {}));
//# sourceMappingURL=system.js.mapvar hd;
(function (hd) {
    var bindings;
    (function (bindings_1) {
        var r = hd.reactive;
        /*==================================================================
         */
        (function (Direction) {
            Direction[Direction["bi"] = 0] = "bi";
            Direction[Direction["v2m"] = 1] = "v2m";
            Direction[Direction["m2v"] = 2] = "m2v";
        })(bindings_1.Direction || (bindings_1.Direction = {}));
        var Direction = bindings_1.Direction;
        /*==================================================================
         * Safety functions -- these are basically run-time type checks:
         * checking that objects support the expected interfaces so that
         * we can give more helpful error messages.  (Otherwise the error
         * reported will be that we tried to call an undefined funciton in
         * our code.)
         */
        // Make sure element is required HTML
        function checkHtml(el, type) {
            if (typeof el !== 'object' || !(el instanceof type)) {
                throw type.name + " required";
            }
            return el;
        }
        bindings_1.checkHtml = checkHtml;
        // Make sure object is observer
        function isObserver(t) {
            return (typeof t === 'object' &&
                typeof t.onNext === 'function' &&
                typeof t.onError === 'function' &&
                typeof t.onCompleted === 'function');
        }
        bindings_1.isObserver = isObserver;
        // Make sure object is observable
        function isObservable(t) {
            return (typeof t === 'object' &&
                typeof t.addObserver === 'function' &&
                typeof t.removeObserver === 'function');
        }
        bindings_1.isObservable = isObservable;
        // Make sure object is both observable and observer
        function isExtension(t) {
            return (typeof t === 'object' &&
                typeof t.onNext === 'function' &&
                typeof t.onError === 'function' &&
                typeof t.onCompleted === 'function' &&
                typeof t.addObserver === 'function' &&
                typeof t.removeObserver === 'function');
        }
        bindings_1.isExtension = isExtension;
        // Check each element of binding
        function verifyBinding(b) {
            if (!b.model) {
                throw "no model specified";
            }
            if (!b.view) {
                throw "no view specified";
            }
            if (b.dir === undefined) {
                if (isObservable(b.model) && isObserver(b.view)) {
                    if (isObservable(b.view) && isObserver(b.model)) {
                        b.dir = Direction.bi;
                    }
                    else {
                        b.dir = Direction.m2v;
                    }
                }
                else {
                    if (isObservable(b.view) && isObserver(b.model)) {
                        b.dir = Direction.v2m;
                    }
                    else {
                        throw "unable to deduce binding direction";
                    }
                }
            }
            else {
                if (b.dir != Direction.v2m) {
                    if (!isObservable(b.model)) {
                        throw "model not observable";
                    }
                    if (!isObserver(b.view)) {
                        throw "view not observer";
                    }
                }
                if (b.dir != Direction.m2v) {
                    if (!isObservable(b.view)) {
                        throw "view not observable";
                    }
                    if (!isObserver(b.model)) {
                        throw "model not observer";
                    }
                }
            }
            if (b.dir != Direction.v2m && b.toView) {
                if (Array.isArray(b.toView)) {
                    var exts = b.toView;
                    if (!exts.every(isExtension)) {
                        throw "toView contains invalid extension";
                    }
                    b.toView = new r.Chain(exts);
                }
                else {
                    if (!isExtension(b.toView)) {
                        throw "toView is not extension";
                    }
                }
            }
            if (b.dir != Direction.m2v && b.toModel) {
                if (Array.isArray(b.toModel)) {
                    var exts = b.toModel;
                    if (!exts.every(isExtension)) {
                        throw "toModel contains invalid extension";
                    }
                    b.toModel = new r.Chain(exts);
                }
                else {
                    if (!isExtension(b.toModel)) {
                        throw "toModel is not extension";
                    }
                }
            }
            return b;
        }
        /*==================================================================
         * Bind and unbind
         */
        function bind(b) {
            var vb = verifyBinding(b);
            if (vb.dir != Direction.v2m) {
                if (vb.toView) {
                    vb.toView.addObserver(vb.view);
                    if (typeof vb.model.addObserverInit === 'function') {
                        vb.model.addObserverInit(vb.toView);
                    }
                    else {
                        vb.model.addObserver(vb.toView);
                    }
                }
                else {
                    if (typeof vb.model.addObserverInit === 'function') {
                        vb.model.addObserverInit(vb.view);
                    }
                    else {
                        vb.model.addObserver(vb.view);
                    }
                }
            }
            if (vb.dir != Direction.m2v) {
                if (vb.toModel) {
                    vb.view.addObserver(vb.toModel);
                    vb.toModel.addObserver(vb.model);
                }
                else {
                    vb.view.addObserver(vb.model);
                }
            }
        }
        bindings_1.bind = bind;
        function unbind(b) {
            var vb = verifyBinding(b);
            if (vb.dir != Direction.v2m) {
                if (vb.toView) {
                    vb.model.removeObserver(vb.toView);
                    vb.toView.removeObserver(vb.view);
                }
                else {
                    vb.model.removeObserver(vb.view);
                }
            }
            if (vb.dir != Direction.m2v) {
                if (vb.toModel) {
                    vb.view.removeObserver(vb.toModel);
                    vb.toModel.removeObserver(vb.model);
                }
                else {
                    vb.view.removeObserver(vb.model);
                }
            }
        }
        bindings_1.unbind = unbind;
        function performDeclaredBindings(mod, el) {
            if (el) {
                if (typeof el === 'string') {
                    el = document.getElementById(el);
                }
            }
            else {
                el = document.body;
            }
            var bindings = [];
            if (el.nodeType === Node.ELEMENT_NODE) {
                searchForBindings(el, mod, bindings);
            }
            else {
                console.error("Invalid argument to performDeclaredBindings");
            }
            return bindings;
        }
        bindings_1.performDeclaredBindings = performDeclaredBindings;
        /*------------------------------------------------------------------
         * Recursive search function.
         */
        function searchForBindings(el, modelcule, bindings) {
            // Look for declarative binding specification
            var spec = el.getAttribute('data-bind');
            if (spec) {
                bindElement(spec, el, modelcule, bindings);
            }
            for (var i = 0, l = el.childNodes.length; i < l; ++i) {
                if (el.childNodes[i].nodeType === Node.ELEMENT_NODE) {
                    searchForBindings(el.childNodes[i], modelcule, bindings);
                }
            }
        }
        /*------------------------------------------------------------------
         * Attempt to bind one single element from specification.
         */
        function bindElement(spec, el, modelcule, bindings) {
            // Eval binding string as JS
            var functionBody = compile(spec);
            if (!functionBody) {
                return true;
            }
            try {
                var elBindingsFn = new Function(functionBody);
                var elNestedBindings = elBindingsFn.call(modelcule);
                var elBindings = [];
                flatten(elNestedBindings, elBindings);
            }
            catch (e) {
                console.error("Invalid binding declaration: "
                    + JSON.stringify(spec), e);
                return true;
            }
            // Invoke all specified binders
            elBindings.forEach(function (b) {
                if (!b.view && typeof b.mkview === 'function') {
                    b.view = new b.mkview(el);
                }
                try {
                    bind(b);
                    bindings.push(b);
                }
                catch (e) {
                    console.error('Invalid binding for ' + el, e);
                }
            });
            return true;
        }
        /*------------------------------------------------------------------
         * Compile binding specification string to function which produces
         * the specification object.
         *
         * Very straightforward for now.  Later we might try to support some
         * of the constructs John implemented.
         */
        function compile(spec) {
            return "with (this) {" +
                "  return [" + spec + "]" +
                "}";
        }
        /*------------------------------------------------------------------
         * Flatten nested lists into a single list.
         */
        function flatten(from, to) {
            for (var i = 0, l = from.length; i < l; ++i) {
                if (Array.isArray(from[i])) {
                    flatten(from[i], to);
                }
                else {
                    to.push(from[i]);
                }
            }
        }
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
/*####################################################################
 * Binding which simply inserts value as text in an element.
 */
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        /*==================================================================
         * Observer for binding
         */
        var Text = (function () {
            // initialize
            function Text(el) {
                this.el = bindings.checkHtml(el, HTMLElement);
            }
            /*----------------------------------------------------------------
             * Observe variable
             */
            Text.prototype.onNext = function (value) {
                if (value === undefined || value === null) {
                    value = '';
                }
                var el = this.el;
                while (el.lastChild) {
                    el.removeChild(el.lastChild);
                }
                el.appendChild(document.createTextNode(value));
            };
            Text.prototype.onError = function () { };
            Text.prototype.onCompleted = function () { };
            return Text;
        })();
        bindings.Text = Text;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
/*####################################################################
 * Binding for a text input box.
 */
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        var r = hd.reactive;
        var i = 0;
        var flush = new Object();
        /*================================================================
         * Observer/Observable for binding
         */
        var Edit = (function () {
            /*----------------------------------------------------------------
             * Initialize and subscribe to HTML editing events.
             */
            function Edit(el, time_ms) {
                // value to change from on blur
                this.blurFrom = null;
                // value to change to on blur
                this.blurTo = null;
                // whether we've set at least one value
                this.initialized = false;
                this.el = bindings.checkHtml(el, HTMLInputElement);
                this.stable = new r.Stabilizer(time_ms, flush);
                el.addEventListener('input', this.update.bind(this));
                el.addEventListener('change', this.onBlur.bind(this));
            }
            /*----------------------------------------------------------------
             */
            Edit.prototype.addObserver = function (o) {
                this.stable.addObserver.apply(this.stable, arguments);
            };
            /*----------------------------------------------------------------
             */
            Edit.prototype.removeObserver = function (o) {
                this.stable.removeObserver.apply(this.stable, arguments);
            };
            /*----------------------------------------------------------------
             * When widget is modified.
             */
            Edit.prototype.update = function () {
                this.initialized = true;
                this.stable.onNext(this.el.value);
            };
            /*----------------------------------------------------------------
             * When variable is modified.
             */
            Edit.prototype.onNext = function (value) {
                if (value === undefined || value === null) {
                    value = '';
                }
                else if (typeof value !== 'string') {
                    value = value.toString();
                }
                // the basic idea here is this:  the value should not change as you
                // are editing; it should wait and change when you are through editing
                if (this.initialized && this.el === document.activeElement) {
                    this.blurTo = value;
                }
                else {
                    if (this.el.value != value) {
                        this.el.value = value;
                        if (this.el === document.activeElement) {
                            this.el.select();
                        }
                    }
                    this.blurTo = null;
                }
            };
            /*----------------------------------------------------------------
             * Perform any changes which were quashed during editing
             */
            Edit.prototype.onBlur = function () {
                if (this.blurTo !== null && this.el.value != this.blurTo) {
                    this.el.value = this.blurTo;
                }
                this.blurTo = null;
                this.initialized = false;
                this.stable.onNext(flush);
            };
            /*----------------------------------------------------------------
             */
            Edit.prototype.onError = function (value) { };
            /*----------------------------------------------------------------
             */
            Edit.prototype.onCompleted = function () { };
            return Edit;
        })();
        bindings.Edit = Edit;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
/*####################################################################
 * Binding for CSS class name.  Takes boolean observable and two
 * css class names: one for when the observable is true, and one for
 * when it's false.  If a class name evaluates to false, then no
 * class is used for that value.
 */
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        var CssClass = (function () {
            /*----------------------------------------------------------------
             * Initialize
             */
            function CssClass(trueClass, falseClass, el) {
                this.el = el;
                this.trueClass = trueClass;
                this.falseClass = falseClass;
            }
            /*----------------------------------------------------------------
             * Observe variable
             */
            CssClass.prototype.onNext = function (value) {
                if (value) {
                    if (this.falseClass) {
                        this.el.classList.remove(this.falseClass);
                    }
                    if (this.trueClass) {
                        this.el.classList.add(this.trueClass);
                    }
                }
                else {
                    if (this.trueClass) {
                        this.el.classList.remove(this.trueClass);
                    }
                    if (this.falseClass) {
                        this.el.classList.add(this.falseClass);
                    }
                }
            };
            CssClass.prototype.onError = function () { };
            CssClass.prototype.onCompleted = function () { };
            return CssClass;
        })();
        bindings.CssClass = CssClass;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        var BasicObservable = hd.reactive.BasicObservable;
        var Options = (function () {
            function Options(el) {
                this.el = el;
            }
            Options.prototype.onNext = function (value) {
                var el = this.el;
                while (el.lastChild) {
                    el.removeChild(el.lastChild);
                }
                value.forEach(function (entry) {
                    var option = document.createElement('option');
                    option.value = entry.id;
                    option.text = entry.label ? entry.label : entry.id;
                    el.appendChild(option);
                });
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent("change", false, true);
                this.el.dispatchEvent(evt);
            };
            Options.prototype.onError = function () { };
            Options.prototype.onCompleted = function () { };
            return Options;
        })();
        /*******************************************************************
         */
        var Value = (function (_super) {
            __extends(Value, _super);
            function Value(el) {
                _super.call(this);
                this.el = bindings.checkHtml(el, HTMLElement);
                if (el) {
                    var boundUpdate = this.update.bind(this);
                    el.addEventListener('input', boundUpdate);
                    el.addEventListener('change', boundUpdate);
                }
            }
            Value.prototype.update = function () {
                this.sendNext(this.el.value);
            };
            Value.prototype.onNext = function (value) {
                if (value) {
                    this.el.value = value;
                }
            };
            Value.prototype.onError = function () { };
            Value.prototype.onCompleted = function () { };
            return Value;
        })(BasicObservable);
        bindings.Value = Value;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        var r = hd.reactive;
        var Checked = (function (_super) {
            __extends(Checked, _super);
            function Checked(el) {
                _super.call(this);
                this.el = bindings.checkHtml(el, HTMLInputElement);
                var boundUpdate = this.update.bind(this);
                el.addEventListener('input', boundUpdate);
                el.addEventListener('change', boundUpdate);
            }
            Checked.prototype.update = function () {
                this.sendNext(this.el.checked);
            };
            Checked.prototype.onNext = function (value) {
                this.el.checked = !!value;
            };
            Checked.prototype.onError = function () { };
            Checked.prototype.onCompleted = function () { };
            return Checked;
        })(r.BasicObservable);
        bindings.Checked = Checked;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        var Enabled = (function () {
            function Enabled(el) {
                this.el = bindings.checkHtml(el, HTMLElement);
            }
            Enabled.prototype.onNext = function (value) {
                if (value) {
                    this.el.disabled = false;
                }
                else {
                    this.el.disabled = true;
                }
            };
            Enabled.prototype.onError = function () { };
            Enabled.prototype.onCompleted = function () { };
            return Enabled;
        })();
        bindings.Enabled = Enabled;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        var r = hd.reactive;
        var MousePosition = (function (_super) {
            __extends(MousePosition, _super);
            function MousePosition() {
                _super.call(this);
                var that = this;
                document.addEventListener('mousemove', function (event) {
                    that.sendNext({ x: event.clientX, y: event.clientY });
                });
            }
            return MousePosition;
        })(r.BasicObservable);
        bindings.MousePosition = MousePosition;
        var theMousePosition;
        function getMousePosition() {
            if (!theMousePosition) {
                theMousePosition = new MousePosition();
            }
            return theMousePosition;
        }
        bindings.getMousePosition = getMousePosition;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        var Position = (function () {
            function Position(el) {
                this.el = bindings.checkHtml(el, HTMLElement);
                el.style.position = 'absolute';
            }
            Position.prototype.onNext = function (p) {
                this.el.style.left = p.x + 'px';
                this.el.style.top = p.y + 'px';
            };
            Position.prototype.onError = function () { };
            Position.prototype.onCompleted = function () { };
            return Position;
        })();
        bindings.Position = Position;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        var r = hd.reactive;
        var Clicked = (function (_super) {
            __extends(Clicked, _super);
            function Clicked(value, el) {
                _super.call(this);
                this.el = bindings.checkHtml(el, HTMLElement);
                this.value = value;
                el.addEventListener('click', this.update.bind(this));
            }
            Clicked.prototype.update = function () {
                this.sendNext(this.value);
            };
            return Clicked;
        })(r.BasicObservable);
        bindings.Clicked = Clicked;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        var r = hd.reactive;
        var Time = (function (_super) {
            __extends(Time, _super);
            function Time(time_ms) {
                _super.call(this);
                window.setInterval(this.update.bind(this), time_ms);
            }
            Time.prototype.update = function () {
                this.sendNext(new Date());
            };
            return Time;
        })(r.BasicObservable);
        bindings.Time = Time;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        var r = hd.reactive;
        var m = hd.model;
        function chain() {
            if (arguments.length == 0) {
                return;
            }
            else if (arguments.length == 1) {
                var e = arguments[0];
                if (Array.isArray(e)) {
                    if (!e.every(bindings.isExtension)) {
                        throw "Invalid extension passed to chain";
                    }
                    return new r.Chain(e);
                }
                else {
                    return e;
                }
            }
            else {
                var es = [];
                for (var i = 0, l = arguments.length; i < l; ++i) {
                    var e = arguments[i];
                    if (Array.isArray(e)) {
                        if (!e.every(bindings.isExtension)) {
                            throw "Invalid extension passed to chain";
                        }
                        Array.prototype.push.apply(es, e);
                    }
                    else if (e) {
                        if (!bindings.isExtension(e)) {
                            throw "Invalid extension passed to chain";
                        }
                        es.push(e);
                    }
                }
                if (es.length > 0) {
                    return new r.Chain(es);
                }
                else {
                    return;
                }
            }
        }
        bindings.chain = chain;
        function path(model, name) {
            var names = name.split('.');
            return new r.HotSwap(new m.Path(model, names));
        }
        bindings.path = path;
        function fn(f) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return new r.FunctionExtension(f, args);
        }
        bindings.fn = fn;
        function delay(time_ms) {
            return new r.Delay(time_ms);
        }
        bindings.delay = delay;
        function stabilize(time_ms, flush) {
            return new r.Stabilizer(time_ms, flush);
        }
        bindings.stabilize = stabilize;
        function msg(message) {
            return new r.ReplaceError(message);
        }
        bindings.msg = msg;
        function req() {
            return new r.Required();
        }
        bindings.req = req;
        function def(value) {
            return new r.Default(value);
        }
        bindings.def = def;
        function round(places) {
            return new r.Round(places);
        }
        bindings.round = round;
        function fix(places) {
            return new r.NumberToFixed(places);
        }
        bindings.fix = fix;
        function prec(sigfigs) {
            return new r.NumberToPrecision(sigfigs);
        }
        bindings.prec = prec;
        function exp(places) {
            return new r.NumberToExponential(places);
        }
        bindings.exp = exp;
        function scale(factor) {
            return new r.ScaleNumber(factor);
        }
        bindings.scale = scale;
        function toStr() {
            return new r.ToString();
        }
        bindings.toStr = toStr;
        function toJson() {
            return new r.ToJson();
        }
        bindings.toJson = toJson;
        function toDate() {
            return new r.ToDate();
        }
        bindings.toDate = toDate;
        function dateToString() {
            return new r.DateToString();
        }
        bindings.dateToString = dateToString;
        function dateToDateString() {
            return new r.DateToDateString();
        }
        bindings.dateToDateString = dateToDateString;
        function dateToTimeString() {
            return new r.DateToTimeString();
        }
        bindings.dateToTimeString = dateToTimeString;
        function dateToMilliseconds() {
            return new r.DateToMilliseconds();
        }
        bindings.dateToMilliseconds = dateToMilliseconds;
        function millisecondsToDate() {
            return new r.MillisecondsToDate();
        }
        bindings.millisecondsToDate = millisecondsToDate;
        function toNum() {
            return new r.ToNumber();
        }
        bindings.toNum = toNum;
        function offset(dx, dy) {
            return new r.Offset(dx, dy);
        }
        bindings.offset = offset;
        function pointToString() {
            return new r.PointToString();
        }
        bindings.pointToString = pointToString;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    var bindings;
    (function (bindings) {
        var r = hd.reactive;
        var m = hd.model;
        function concat(as, bs) {
            if (!as) {
                return bs;
            }
            if (!bs) {
                return as;
            }
            if (Array.isArray(as)) {
                if (Array.isArray(bs)) {
                    return as.concat(bs);
                }
                else {
                    return as.concat([bs]);
                }
            }
            else {
                if (Array.isArray(bs)) {
                    return [as].concat(bs);
                }
                else {
                    return [as, bs];
                }
            }
        }
        function edit(target, toView, toModel) {
            return { mkview: bindings.Edit,
                model: target,
                dir: bindings.Direction.bi,
                toView: toView,
                toModel: toModel
            };
        }
        bindings.edit = edit;
        function editVar(v, toView, toModel) {
            return [edit(v, toView, toModel),
                cssClass(v),
                enabled(v.relevant)
            ];
        }
        bindings.editVar = editVar;
        function num(target, places, toView, toModel) {
            if (places === undefined || places === null) {
                return { mkview: bindings.Edit,
                    model: target,
                    dir: bindings.Direction.bi,
                    toView: toView,
                    toModel: concat(new r.ToNumber(), toModel)
                };
            }
            else {
                return { mkview: bindings.Edit,
                    model: target,
                    dir: bindings.Direction.bi,
                    toView: concat(toView, places >= 0 ? new r.NumberToFixed(places)
                        : new r.Round(places)),
                    toModel: concat([new r.ToNumber(), new r.Round(places)], toModel)
                };
            }
        }
        bindings.num = num;
        function numVar(v, places, toView, toModel) {
            return [num(v, places, toView, toModel),
                cssClass(v),
                enabled(v.relevant)
            ];
        }
        bindings.numVar = numVar;
        function date(target, toView, toModel) {
            return { mkview: bindings.Edit,
                model: target,
                dir: bindings.Direction.bi,
                toView: concat(toView, new r.DateToDateString()),
                toModel: concat(new r.ToDate(), toModel)
            };
        }
        bindings.date = date;
        function dateVar(v, toView, toModel) {
            return [date(v, toView, toModel),
                cssClass(v),
                enabled(v.relevant)
            ];
        }
        bindings.dateVar = dateVar;
        function text(target, toView) {
            return { mkview: bindings.Text,
                model: target,
                toView: toView,
                dir: bindings.Direction.m2v
            };
        }
        bindings.text = text;
        function cssClass(o, ontrue, onfalse, toView) {
            if (ontrue || onfalse || !(o instanceof m.Variable)) {
                return [{ mkview: bindings.CssClass.bind(null, ontrue, onfalse),
                        model: o,
                        dir: bindings.Direction.m2v,
                        toView: toView
                    }
                ];
            }
            else {
                var vv = o;
                return [{ mkview: bindings.CssClass.bind(null, 'source', 'derived'),
                        model: vv.source,
                        dir: bindings.Direction.m2v
                    },
                    { mkview: bindings.CssClass.bind(null, 'stale', 'current'),
                        model: vv.stale,
                        dir: bindings.Direction.m2v
                    },
                    { mkview: bindings.CssClass.bind(null, 'pending', 'complete'),
                        model: vv.pending,
                        dir: bindings.Direction.m2v
                    },
                    { mkview: bindings.CssClass.bind(null, 'contributing', 'noncontributing'),
                        model: vv.contributing,
                        dir: bindings.Direction.m2v
                    },
                    { mkview: bindings.CssClass.bind(null, 'error', null),
                        model: vv.error,
                        dir: bindings.Direction.m2v
                    }
                ];
            }
        }
        bindings.cssClass = cssClass;
        function enabled(target, toView) {
            return { mkview: bindings.Enabled,
                model: target,
                dir: bindings.Direction.m2v,
                toView: toView
            };
        }
        bindings.enabled = enabled;
        function value(target, toView, toModel) {
            return { mkview: bindings.Value,
                model: target,
                dir: bindings.Direction.bi,
                toView: toView,
                toModel: toModel
            };
        }
        bindings.value = value;
        function checked(target, toView, toModel) {
            return { mkview: bindings.Checked,
                model: target,
                dir: bindings.Direction.bi,
                toView: toView,
                toModel: toModel
            };
        }
        bindings.checked = checked;
        function clicked(target, toModel) {
            return { mkview: bindings.Clicked.bind(null, true),
                model: target,
                dir: bindings.Direction.v2m,
                toModel: toModel
            };
        }
        bindings.clicked = clicked;
        function position(target, toView) {
            return { mkview: bindings.Position,
                model: target,
                dir: bindings.Direction.m2v,
                toView: toView
            };
        }
        bindings.position = position;
    })(bindings = hd.bindings || (hd.bindings = {}));
})(hd || (hd = {}));
//# sourceMappingURL=bind.js.mapvar hd;
(function (hd) {
    var async;
    (function (async) {
        var r = hd.reactive;
        /*==================================================================
         * Represents a pool of workers.  Tasks are assigned to a worker
         * as they become available.
         */
        var WorkerPool = (function () {
            /*----------------------------------------------------------------
             * Initialize.
             */
            function WorkerPool(sourceUrl, max) {
                if (max === void 0) { max = 20; }
                // List of workers not currently doing anything
                this.availableWorkers = [];
                // List of tasks currently being run by a worker
                this.runningTasks = [];
                // List of tasks waiting to be run by a worker
                this.queuedTasks = [];
                this.sourceUrl = sourceUrl;
                this.max = max;
            }
            /*----------------------------------------------------------------
             * Schedule a function to be run on the next available worker.
             */
            WorkerPool.prototype.schedule = function (fnName, inputs, numOutputs) {
                if (numOutputs === void 0) { numOutputs = 1; }
                // Create output promises
                var outputs = [];
                for (var i = 0; i < numOutputs; ++i) {
                    outputs.push(new r.Promise());
                }
                // Create task
                var task = { fnName: fnName, inputs: inputs, outputs: outputs };
                // Subscribe to dropped outputs
                outputs.forEach(function (p) {
                    p.ondropped.addObserver(this, this.onPromiseDropped, null, null, task);
                }, this);
                // Queue task, then try to run
                this.queuedTasks.push(task);
                this.checkQueue();
                return outputs;
            };
            /*----------------------------------------------------------------
             * Check to see if any queued tasks can be executed.
             */
            WorkerPool.prototype.checkQueue = function () {
                // Try using available workers
                while (this.queuedTasks.length > 0 && this.availableWorkers.length > 0) {
                    this.execute(this.queuedTasks.shift(), this.availableWorkers.shift());
                }
                // Try using new workers
                while (this.queuedTasks.length > 0 && this.runningTasks.length < this.max) {
                    var task = this.queuedTasks.shift();
                    try {
                        this.execute(task, new Worker(this.sourceUrl));
                    }
                    catch (e) {
                        console.error('Unable to create worker', e);
                        task.outputs.forEach(function (p) {
                            p.reject('Script unable to create worker');
                        });
                    }
                }
            };
            /*----------------------------------------------------------------
             * Execute a task on a worker.
             */
            WorkerPool.prototype.execute = function (task, worker) {
                task.worker = worker;
                this.runningTasks.push(task);
                worker.onmessage = this.onMessage.bind(this, task);
                worker.onerror = this.onError.bind(this, task);
                worker.postMessage({
                    fnName: task.fnName,
                    inputs: task.inputs
                });
            };
            /*----------------------------------------------------------------
             * Process normal messages from worker.
             */
            WorkerPool.prototype.onMessage = function (task, event) {
                if (event.data.error) {
                    // Failure - function failed but worker is still OK
                    console.warn('Task failed: ' + JSON.stringify(event.data.error));
                    task.outputs.forEach(function (p) {
                        p.reject(event.data.error);
                    });
                    this.returnWorker(task.worker);
                }
                else if (event.data.complete) {
                    // Completion
                    var result = event.data.result;
                    if (task.outputs.length == 1) {
                        task.outputs[0].resolve(result);
                    }
                    else {
                        for (var i = 0, l = task.outputs.length; i < l; ++i) {
                            task.outputs[i].resolve(result[i]);
                        }
                    }
                    this.returnWorker(task.worker);
                }
                else {
                    // Partial update
                    var result = event.data.result;
                    if (task.outputs.length == 1) {
                        task.outputs[0].notify(result);
                    }
                    else {
                        for (var i = 0, l = task.outputs.length; i < l; ++i) {
                            task.outputs[i].notify(result[i]);
                        }
                    }
                }
            };
            /*----------------------------------------------------------------
             * Process error from worker.  Shouldn't happen -- assume
             * something is wrong with the worker.
             */
            WorkerPool.prototype.onError = function (task, event) {
                console.warn('Worker failed: ' + JSON.stringify(event.data));
                task.outputs.forEach(function (p) {
                    p.reject(event.data);
                });
                this.killWorker(task.worker);
            };
            /*----------------------------------------------------------------
             * Return worker after task is completed.  Checks to see if there
             * are any tasks waiting on a worker; if not, it is returned to
             * the available state.
             */
            WorkerPool.prototype.returnWorker = function (worker) {
                if (this.runningTasks.length >= this.max) {
                    this.killWorker(worker);
                }
                else if (this.queuedTasks.length > 0) {
                    this.execute(this.queuedTasks.shift(), worker);
                }
                else {
                    var i = this.findTaskIndexFor(worker);
                    if (i >= 0) {
                        this.runningTasks.splice(i, 1);
                        worker.onmessage = null;
                        worker.onerror = null;
                        this.availableWorkers.push(worker);
                    }
                }
            };
            /*----------------------------------------------------------------
             * Terminates worker process; discards worker.
             */
            WorkerPool.prototype.killWorker = function (worker) {
                var i = this.findTaskIndexFor(worker);
                if (i >= 0) {
                    this.runningTasks.splice(i, 1);
                }
                worker.terminate();
                this.checkQueue();
            };
            /*----------------------------------------------------------------
             * Called when an output promise is dropped.  If all outputs are
             * dropped then it kills the worker.
             */
            WorkerPool.prototype.onPromiseDropped = function (promise, task) {
                if (task.outputs.every(isDropped)) {
                    if (task.worker) {
                        this.killWorker(task.worker);
                    }
                    else {
                        this.dequeue(task);
                    }
                }
            };
            /*----------------------------------------------------------------
             * Remove task from queue -- it's output is no longer needed.
             */
            WorkerPool.prototype.dequeue = function (task) {
                var i = this.queuedTasks.indexOf(task);
                if (i >= 0) {
                    this.queuedTasks.splice(i, 1);
                }
            };
            /*----------------------------------------------------------------
             * Find the task for given worker.
             */
            WorkerPool.prototype.findTaskIndexFor = function (worker) {
                for (var i = 0, l = this.runningTasks.length; i < l; ++i) {
                    if (this.runningTasks[i].worker === worker) {
                        return i;
                    }
                }
                return -1;
            };
            return WorkerPool;
        })();
        async.WorkerPool = WorkerPool;
        function isDropped(p) {
            return !p.hasDependencies();
        }
        /*==================================================================
         */
        async.workerPools = {};
        function setMaxWorkers(sourceUrl, max) {
            var pool = async.workerPools[sourceUrl];
            if (pool) {
                pool.max = max;
            }
            else {
                async.workerPools[sourceUrl] = new WorkerPool(sourceUrl, max);
            }
        }
        async.setMaxWorkers = setMaxWorkers;
        function worker(sourceUrl, fnName, numOutputs) {
            if (numOutputs === void 0) { numOutputs = 1; }
            if (!async.workerPools[sourceUrl]) {
                async.workerPools[sourceUrl] = new WorkerPool(sourceUrl);
            }
            return function () {
                var pool = async.workerPools[sourceUrl];
                var outputs = pool.schedule(fnName, Array.prototype.slice.call(arguments, 0, arguments.length), numOutputs);
                if (numOutputs == 1) {
                    return outputs[0];
                }
                else {
                    return outputs;
                }
            };
        }
        async.worker = worker;
    })(async = hd.async || (hd.async = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    hd.setMaxWorkers = hd.async.setMaxWorkers;
    hd.worker = hd.async.worker;
})(hd || (hd = {}));
var hd;
(function (hd) {
    var async;
    (function (async) {
        var r = hd.reactive;
        function makeQueryString(data) {
            var params = [];
            for (var key in data) {
                params.push(key + '=' + encodeURIComponent(data[key]));
            }
            return params.join('&');
        }
        function ajax(url, data) {
            if (data) {
                url += '?' + makeQueryString(data);
            }
            var ajax = new XMLHttpRequest();
            var p = new r.Promise();
            ajax.addEventListener('readystatechange', function () {
                if (ajax.readyState == 4) {
                    if (ajax.status == 200) {
                        p.resolve(ajax);
                    }
                    else {
                        p.reject(ajax.statusText);
                    }
                }
            });
            ajax.open('GET', url);
            ajax.send();
            return p;
        }
        async.ajax = ajax;
        function ajaxXML(url, data) {
            return ajax(url, data).then(function (ajax) {
                return ajax.responseXML;
            });
        }
        async.ajaxXML = ajaxXML;
        function ajaxText(url, data) {
            return ajax(url, data).then(function (ajax) {
                return ajax.responseText;
            });
        }
        async.ajaxText = ajaxText;
        function ajaxJSON(url, data) {
            return ajax(url, data).then(function (ajax) {
                return JSON.parse(ajax.responseText);
            });
        }
        async.ajaxJSON = ajaxJSON;
    })(async = hd.async || (hd.async = {}));
})(hd || (hd = {}));
var hd;
(function (hd) {
    hd.ajax = hd.async.ajax;
    hd.ajaxXML = hd.async.ajaxXML;
    hd.ajaxText = hd.async.ajaxText;
    hd.ajaxJSON = hd.async.ajaxJSON;
})(hd || (hd = {}));
//# sourceMappingURL=async.js.mapvar hd;
(function (hd) {
    var u = hd.utility;
    var r = hd.reactive;
    var m = hd.model;
    var s = hd.system;
    var b = hd.bindings;
    /*==================================================================
     * Enablement functions
     */
    function markUsed(p) {
        p.usage.set(r.Usage.Used);
    }
    hd.markUsed = markUsed;
    function markUnused(p) {
        p.usage.set(r.Usage.Unused);
    }
    hd.markUnused = markUnused;
    function markDelayed(p) {
        p.usage.set(r.Usage.Delayed);
    }
    hd.markDelayed = markDelayed;
    /*==================================================================
     * Export
     */
    hd.dateCompare = u.dateCompare;
    hd.ProxyObserver = r.ProxyObserver;
    hd.BasicObservable = r.BasicObservable;
    hd.Promise = r.Promise;
    hd.Extension = r.Extension;
    hd.liftFunction = r.liftFunction;
    hd.dir = b.Direction;
    hd.bind = b.bind;
    hd.unbind = b.unbind;
    hd.performDeclaredBindings = b.performDeclaredBindings;
    hd.isObservable = b.isObservable;
    hd.isObserver = b.isObserver;
    hd.isExtension = b.isExtension;
    // RunTime
    hd.ConstraintSystem = s.ConstraintSystem;
    hd.ModelBuilder = m.ModelBuilder;
    hd.Update = s.Update;
    // Bindings
    hd.Checked = b.Checked;
    hd.Clicked = b.Clicked;
    hd.CssClass = b.CssClass;
    hd.Edit = b.Edit;
    hd.Enabled = b.Enabled;
    hd.MousePosition = b.MousePosition;
    hd.Position = b.Position;
    hd.Text = b.Text;
    hd.Time = b.Time;
    hd.Value = b.Value;
    // Factories
    hd.checked = b.checked;
    hd.clicked = b.clicked;
    hd.cssClass = b.cssClass;
    hd.edit = b.edit;
    hd.editVar = b.editVar;
    hd.date = b.date;
    hd.dateVar = b.dateVar;
    hd.enabled = b.enabled;
    hd.mousePosition = b.getMousePosition;
    hd.num = b.num;
    hd.numVar = b.numVar;
    hd.position = b.position;
    hd.text = b.text;
    hd.value = b.value;
    // Extensions
    hd.chain = b.chain;
    hd.dateToMilliseconds = b.dateToMilliseconds;
    hd.dateToDateString = b.dateToDateString;
    hd.dateToString = b.dateToString;
    hd.dateToTimeString = b.dateToTimeString;
    hd.def = b.def;
    hd.delay = b.delay;
    hd.exp = b.exp;
    hd.fix = b.fix;
    hd.fn = b.fn;
    hd.millisecondsToDate = b.millisecondsToDate;
    hd.msg = b.msg;
    hd.offset = b.offset;
    hd.path = b.path;
    hd.pointToString = b.pointToString;
    hd.prec = b.prec;
    hd.req = b.req;
    hd.round = b.round;
    hd.scale = b.scale;
    hd.stabilize = b.stabilize;
    hd.toDate = b.toDate;
    hd.toJson = b.toJson;
    hd.toNum = b.toNum;
    hd.toStr = b.toStr;
})(hd || (hd = {}));
//# sourceMappingURL=hd.js.map