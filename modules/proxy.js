const XMLHttpRequestProxy = function(...args) 
{
    const context = this;

    return new Proxy(new window.XMLHttpRequest(...args), 
    {
        get(target, name) 
        {
            if (typeof target[name] !== "function") {
                return target[name]
            }

            if (!context.__proto__.hasOwnProperty(name)) {
                return target[name].bind(target)
            }

            return context.__proto__[name].bind(target)
        }
    })
}

export {
    XMLHttpRequestProxy
}
