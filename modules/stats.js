import { XMLHttpRequestProxy } from './proxy.js';

const XHRStats = function(...args) {
    return XMLHttpRequestProxy.bind(this)(...args);
}

XHRStats.prototype.send = function(...args)
{
    console.log(this)
    this.send(...args)
}

export {
    XHRStats
}
