class Arayi {
    constructor(opts) {
        this.opts = opts
        this.rootValue = [true, false]
        this.tree= {}
        this.svgPath =  new Array(opts.maxLayers)
        this.init()
    }

    flip (qubit) {
        return (qubit[0] ? [false, true] : [true, false])
    }

    //This is why you shouldn't give a fuck about the outcome of your decisions...
    //and also why you should ;)
    resolve(qubit) {
        //randomly flip a qubit as if collapsing the wave function
        if (Math.random() < 0.5) 
            return qubit
        else
            return this.flip(qubit)
    }
    getPathSegment(cmd, x, y) {
        return cmd+x.toString()+","+y.toString()+" "
    }

    init() {
        this.tree.root= {
            value: this.resolve(this.rootValue), 
            coords: {x: this.opts.x, y: this.opts.y, distance:this.opts.baseLength}
        }
        this.svgPath = new Array(this.opts.maxLayers)
        this.svgPath[0]= this.getPathSegment("M", this.tree.root.coords.x, this.tree.root.coords.y)
        this.iterations = 0
    }

    //Gets the co-ordinates for a child node, based on its attributes and those of its parents 
     getCoords(parentCoords, direction, outcome, layer) {
        //The length of the line to draw
        var newDistance = parentCoords.distance * (Math.sin((outcome[0] ? this.opts.cTrue: this.opts.cFalse) * (layer+1) / this.opts.maxLayers) + 1)
    
        //dX and dY from current position
        var radians = (this.opts.angles[direction] + (layer * this.opts.increment[direction])) * (Math.PI/180)

        var dY = newDistance * Math.sin(radians)
        var dX = Math.sqrt(Math.pow(newDistance, 2) - Math.pow(dY, 2))
        
        if (direction == "left") 
            dX = dX * -1
        if (opts.direction == "up")
            dY = dY * -1
            
        return {x: parentCoords.x + dX, 
                y: parentCoords.y + dY,
                distance: newDistance }
    }


    /*
    * The main recursion loop - generates an Arayi tree based on 
    * the coefficients and rendering options specified in opts. 
    * 
    * To start the generator: generateFractal(tree.root, 0, myRenderingCallback) 
    * The final output is an SVG path definition that can be rendered in 
    * a browser or whatever else you want to do with it 
    * 
    * Call this asynchronously!! TODO: refactor to return a Promise
    * */
    generateFractal(node, currentLayer) {
        if (currentLayer >= this.opts.maxLayers) {
            return
        }
        this.iterations++

        //Resolve the node's value and create the child nodes
        var outcome = this.resolve(node.value)
        
        node.left = {value: outcome, 
                    coords: this.getCoords(node.coords, "left", outcome, currentLayer) }
        
        node.right = {value: this.flip(outcome), 
                    coords: this.getCoords(node.coords, "right", this.flip(outcome), currentLayer)}
        
        //Draw the lines
        
        if (!this.svgPath[currentLayer]) 
            this.svgPath[currentLayer] = ""

        this.svgPath[currentLayer] += this.getPathSegment("M", node.coords.x, node.coords.y)
        this.svgPath[currentLayer] += this.getPathSegment("L", node.left.coords.x, node.left.coords.y)
        this.svgPath[currentLayer] += this.getPathSegment("M", node.coords.x, node.coords.y)
        this.svgPath[currentLayer] += this.getPathSegment("L", node.right.coords.x, node.right.coords.y)

        //Generate the next layer of the tree
        this.generateFractal(node.left, currentLayer+1)
        this.generateFractal(node.right, currentLayer+1)
    }

    /*  Convenience method - generates the fractal, and renders to the 
     *  desired element (must be an SVG path) - with optional postprocessing 
     */ 
    render (targetElementId, postProcessingCallback) {
            var startTime = Date.now()
            console.log("Begin fractal generation - "+this.opts.maxLayers+" iterations.")

            this.init()
            this.generateFractal(this.tree.root, 0) 
            console.log("Generation complete. Total iterations: "+this.iterations+". Elapsed time: "+ (Date.now() - startTime).toString())
            
            //Generate the DOM element for each layer
         
            var template = '<path class="instance" id="INDEX" d="PATH" style="STYLE" />'

            for (var i =0; i< this.svgPath.length; i++) 
            {
                var st = template.replace('INDEX', 'U'+i)
                .replace('PATH', this.svgPath[i])
                .replace('STYLE', 'stroke:yellow; stroke-width:'+(1.6 -(0.1*i)).toString())

                document.querySelector(targetElementId).innerHTML += st
            }

            postProcessingCallback(targetElementId)
    }
}
