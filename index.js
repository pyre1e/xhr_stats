import { XHRStats } from './modules/stats.js'

document.addEventListener("DOMContentLoaded", function() 
{
    const sendbtn = document.querySelector("#send");

    sendbtn.addEventListener("click", function() {
        let request = new XHRStats()
        console.log(request)
        console.log(request.open("GET", "/stub.json", false));
        console.log(request.send())
    });
})
