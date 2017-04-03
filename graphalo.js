
// GRAPHALO
// PAUL LIVINGSTONE - 2012



// Global namespace
var GRAPHALO = GRAPHALO || {};

// Drawing tools
GRAPHALO.draw = {
    clear: function(){
        GRAPHALO.ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    rect: function(x, y, w, h, col){
        GRAPHALO.ctx.fillStyle = col;
        GRAPHALO.ctx.fillRect(x, y, w, h);
    },
    circle: function(x, y, radius, col){
        GRAPHALO.ctx.fillStyle = col;
        GRAPHALO.ctx.beginPath();
        GRAPHALO.ctx.arc(x, y, radius, 0, Math.PI*2, true);
        GRAPHALO.ctx.closePath();
        GRAPHALO.ctx.fill();
    },
    text: function(str, x, y, size, col, align){
         GRAPHALO.ctx.font = "bold " + size + "px Arial";
         GRAPHALO.ctx.fillStyle = col;
         GRAPHALO.ctx.textAlign = align;
         GRAPHALO.ctx.fillText(str, x, y);

    },
    sparkline: function(gr_data){
        var graph_data = gr_data;
        var graph_data_max = Math.max.apply(Math, graph_data);
        var graph_data_length = gr_data.length - 1;

        GRAPHALO.ctx.lineWidth = 1;
        GRAPHALO.ctx.strokeStyle = "#333333"
        GRAPHALO.ctx.beginPath();
        
        for(var i = 0; i < graph_data.length; i += 1){
            var perc_of_max = 0;
            var value_of_height;

            perc_of_max = graph_data[i] / graph_data_max * 100;
            value_of_height = perc_of_max / 100 * 20;

            if(i === 0){
                 GRAPHALO.ctx.moveTo(0, 20 - Math.round(value_of_height));
            }
            else{
                GRAPHALO.ctx.lineTo(i * 4, 20 - Math.round(value_of_height)); 
            }

           
            
        }
         GRAPHALO.ctx.lineJoin = "miter";
         GRAPHALO.ctx.stroke();

    },
    percpie: function(gr_data, col, size, label){

        var graph_size = size;
        var perc_of_pie = gr_data / 100;
        var degrees = perc_of_pie * 360;
        var radians = degrees * (Math.PI / 180);
        var line_thickness = Math.round(graph_size * 0.1);
        var x = graph_size / 2;
        var y = graph_size / 2;
        var stroke_colour = col;
        var value_text_size = Math.round(graph_size * 0.25) ;

        var radius = x - line_thickness;
        var start_angle = 1.5 * Math.PI;
        var graph_label = label;

        GRAPHALO.ctx.beginPath();
        GRAPHALO.ctx.lineWidth = line_thickness + Math.round(line_thickness / 2);
        GRAPHALO.ctx.strokeStyle = stroke_colour;
        GRAPHALO.ctx.globalAlpha = 0.2;
        GRAPHALO.ctx.arc(x, y, radius, start_angle, 6.4 + start_angle, false);
        GRAPHALO.ctx.stroke();

        GRAPHALO.ctx.beginPath();
        GRAPHALO.ctx.lineWidth = line_thickness;
        GRAPHALO.ctx.strokeStyle = stroke_colour;
        GRAPHALO.ctx.globalAlpha = 1;
        GRAPHALO.ctx.arc(x, y, radius, start_angle, radians + start_angle, false);
        GRAPHALO.ctx.stroke();

        GRAPHALO.draw.text(perc_of_pie * 100 + "%", x, y + Math.round(value_text_size * 0.4), value_text_size, stroke_colour, "center");
        //draw.text(graph_label, x, y + value_text_size, value_text_size / 2, stroke_colour, "center");
    }
};

 
// Graph Class
GRAPHALO.Graph = function(graph){

    this.init = function(){
        this.graph_data = graph.getAttribute("data-graph-values").split(",");
        this.graph_type = graph.getAttribute("data-graph-type") || "sparkline";
        this.graph_col = graph.getAttribute("data-graph-color") || "#333333";
        this.graph_size = graph.getAttribute("data-graph-size") || 100;
        this.graph_label = graph.getAttribute("data-graph-labels");

        this.newgraph = document.createElement("canvas");
        this.newgraph.setAttribute("class", this.graph_type);
        graph.appendChild(this.newgraph);
        this.canvas = this.newgraph;

        switch(this.graph_type){
            case "sparkline":

                this.canvas.width = this.graph_data.length * 4;

                this.canvas.height = 20;
                break;
            default:
                this.canvas.width = this.graph_size;
                this.canvas.height = this.graph_size;
                break;
        }

        GRAPHALO.ctx = this.canvas.getContext("2d")
        this.draw();
    }

    

    this.draw = function(){
        switch(this.graph_type){
            case "sparkline":
                GRAPHALO.draw.sparkline(this.graph_data);
                break;
            case "percpie":
                GRAPHALO.draw.percpie(this.graph_data, this.graph_col, this.graph_size, this.graph_label);
                break;
            default:
                GRAPHALO.draw.sparkline(this.graph_data);
                break;
        }
        
    }
   
};


// Setup canvas, graph       
 GRAPHALO.init = function(){

    // Is canvas supported?
    if(!!document.createElement('canvas').getContext){

        // Get all the graphme elements
        graphs = document.getElementsByClassName("graphme");

        // Create a Graph object for each graphme element
        for(var i = 0; i < graphs.length; i += 1){
            setgraph = new GRAPHALO.Graph(graphs[i]);
            setgraph.init();
        }
    } 
}



window.onload = GRAPHALO.init;
