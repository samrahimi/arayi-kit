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
            coords: {x: this.opts.x, y: this.opts.y, distance:this.opts.baseLength, heading: 0}
        }
        this.svgPath = new Array(this.opts.maxLayers)
        this.svgPath[0]= this.getPathSegment("M", this.tree.root.coords.x, this.tree.root.coords.y)
        this.iterations = 0
    }

    //Gets the co-ordinates for a child node, based on its attributes and those of its parents 
     getCoords(parentCoords, direction, outcome, layer) {
        var newDistance = parentCoords.distance * (outcome[0] ? this.opts.cTrue: this.opts.cFalse)

        //dX and dY from current position

        var angle = this.opts.angles[direction] + (layer * this.opts.increment[direction])
        
        var radians = angle * (Math.PI/180)

        var dY = newDistance * Math.sin(radians)
        var dX = Math.sqrt(Math.pow(newDistance, 2) - Math.pow(dY, 2))
        
        if (direction == "left") 
            dX = dX * -1

        if (opts.direction == "up")
            dY = dY * -1 
            
        return {
                x: parentCoords.x + dX, 
                y: parentCoords.y + dY,
                distance: newDistance,
             }


        /*

        TODO: adjust the heading and make branch angle relative to its parent instead of to the 
        trunk.
        //angle is is relative to the angle of its parent branch. 
        //heading is a direction vector and is relative to the trunk of the tree (or the y axis of your monitor)

        if (layer == 0)
            heading = angle 
        
        if (direction == "left")
            heading = parentCoords.heading + (angle / 2)
        else
            heading = parentCoords.heading - (angle / 2) */
        /*
        if (parentCoords.direction == "left")
             heading = parentCoords.heading + this.opts.angles[direction] + (layer * this.opts.increment[direction])
        else
             heading = parentCoords.heading - this.opts.angles[direction] + (layer * this.opts.increment[direction])*/
        

    }


    /*
    * The main recursion loop - generates an Arayi tree based on 
    * the coefficients and rendering options specified in opts. 
    * 
    * To start the generator: generateFractal(tree.root)
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
                /*
                var st = template.replace('INDEX', 'U'+i)
                .replace('PATH', this.svgPath[i])
                .replace('STYLE', 'stroke:green; stroke-width:'+(1.6 -(0.1*i)).toString()) */

                var st = template.replace('INDEX', 'U'+i)
                .replace('PATH', this.svgPath[i])
                .replace('STYLE', 'stroke:red; stroke-width:0.2')
                document.querySelector(targetElementId).innerHTML += st
            }

            postProcessingCallback(targetElementId)
    }
}
