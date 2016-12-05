var EXP = {
    transforms: 
        {
            sine:"parentCoords.distance * (Math.sin((outcome[0] ? this.opts.cTrue: this.opts.cFalse) * (layer+1) / this.opts.maxLayers) + 1)",
            power: "parentCoords.distance * (outcome[0] ? this.opts.cTrue: this.opts.cFalse)",
            classical: "parentCoords.distance * (direction == 'right' ? this.opts.cTrue: this.opts.cFalse)"
        },
    trig:
       {
           default:"((this.opts.angles[direction]/2)+ (layer * this.opts.increment[direction])) * (Math.PI/180)",
           x2: "((this.opts.angles[direction])+ (layer * this.opts.increment[direction])) * (Math.PI/180)",
           symmetrical: "((this.opts.angles[direction])+ (layer * this.opts.angles[direction])) * (Math.PI/180)"                                                                  
    }
} 


var UTIL = {
    getRandomColor: function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 15)];
        }
        return color;
    },
    getFormalDefinition: function() {
        
    }
}
