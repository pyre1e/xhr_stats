import { XMLHttpRequestProxy } from './modules/proxy.js'


var log = []

const RequestEntry = function()
{
    this.method = ""
    this.url = ""
    this.body = ""
    this.start = 0
    this.end = 0
    this.response = {
        status: 0,
        body: ""
    }
}

const Proxy = function(...args) 
{
    const proxy = new (XMLHttpRequestProxy.bind(this))(...args)
    const entry = new RequestEntry()

    proxy.addEventListener("loadend", function() 
    {
        entry.response.body = this.response
        entry.response.status = this.status

        console.log(entry)
        log.push(entry)
    })

    proxy.open = function(method, url, async, user, password)
    {
        entry.method = method
        entry.url = url
        entry.end = Date.now()
        
        return this.__xhr__.open(method, url, async, user, password)
    }

    proxy.send = function(body)
    {
        entry.body = body
        entry.start = Date.now()

        return this.__xhr__.send(body)
    }

    return proxy;
}

/**
 * небольшой костыль чтобы избежать рекурсии в конструкторе
 * альтернатива - навешивать отдельные прокси на нужные методы XMLHttpRequest
 * или прописывать логирование прямо в базовом классе прокси, 
 * а это чуть грязнее чем сейчас
 */
window.XMLHttpRequestOriginal = window.XMLHttpRequest;
window.XMLHttpRequest = Proxy;

document.addEventListener("DOMContentLoaded", function() 
{
    alert("console")

    const send = document.querySelector("#send");
    const url = document.querySelector("#url");
    const method = document.querySelector("#method");
    const body = document.querySelector("#body");

    send.addEventListener("click", function() {
        let request = new XMLHttpRequest()
        request.open(method.value, url.value)
        request.send(body.value)
    });

    method.addEventListener("change", function() {
        if (this.value == "POST") {
            body.removeAttribute("disabled")
        } else {
            body.value = "";
            body.setAttribute("disabled", "")
        }
    })

    setInterval(() => {
        let request = new XMLHttpRequest()
        request.open("POST", "/")
        request.send(JSON.stringify(
            log.map(entry => { return {
                url: entry.url,
                dataRequest: entry.body,
                dataResponse: entry.response.body
            }})
        ))
        console.log("log has been sent")
        log = []
    }, 30_000)
})
