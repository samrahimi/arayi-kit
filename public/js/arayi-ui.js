   var opts = {
        maxLayers: 15,          
        baseLength: 20,
        cTrue: 1.33,          
        cFalse:0.67,
        angles: {left: 150, right: 30},
        increment: {left:0, right:0},
        direction: "up",
        x: 600, 
        y: 700,
        series: "power",
        mirror: true
    }

var arayi = new Arayi(opts)


arayi.render("#yin", function() {
    if (opts.mirror)
        document.querySelector("#yang").innerHTML = document.querySelector("#yin").innerHTML;
})
