const XMLHttpRequestProxy = function(...args) 
{
    const context = this;
    const xhr = new (window.XMLHttpRequestOriginal || window.XMLHttpRequest)(...args);

    context.__xhr__ = xhr;

    return new Proxy(xhr, 
    {
        get(target, name) 
        {
            if (typeof target[name] !== "function") {
                return target[name]
            }
            
            if (!context.hasOwnProperty(name)) {
                return target[name].bind(target)
            }
            
            return context[name].bind(context)
        },
        set(target, property, value, receiver)
        {
            if (typeof value !== "function") {
                return Reflect.set(target, property, value, receiver)
            }

            context[property] = value;

            return true
        }
    })
}

export {
    XMLHttpRequestProxy
}
