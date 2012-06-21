
// Graphalo
// PAUL LIVINGSTONE - 2012



// Setup canvas & defaults
var ctx

// Drawing tools
var draw = {
    clear: function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    rect: function(x, y, w, h, col){
        ctx.fillStyle = col;
        ctx.fillRect(x, y, w, h);
    },
    circle: function(x, y, radius, col){
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    },
    text: function(str, x, y, size, col, align){
        ctx.font = "bold " + size + "px Arial";
        ctx.fillStyle = col;
        ctx.textAlign = align;
        ctx.fillText(str, x, y);
    },
    sparkline: function(gr_data){
        var graph_data = gr_data;
        var graph_data_max = Math.max.apply(Math, graph_data);
  
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#333333"
        ctx.beginPath();
        
        for(var i = 0; i < graph_data.length; i += 1){
            var perc_of_max = 0;
            var value_of_height;

            perc_of_max = graph_data[i] / graph_data_max * 100;
            value_of_height = perc_of_max / 100 * 30;

            if(i === 0){
                ctx.moveTo(0, 30 - Math.round(value_of_height));
            }
            else{
               ctx.lineTo(i * 4, 30 - Math.round(value_of_height)); 
            }

           
            
        }
        ctx.lineJoin = "miter";
        ctx.stroke();
    },
    percpie: function(gr_data, col, size){

        var graph_size = size;
        var perc_of_pie = gr_data / 100;
        var degrees = perc_of_pie * 360;
        var radians = degrees * (Math.PI / 180);
        var line_thickness = Math.round(graph_size * 0.1);
        var x = graph_size / 2;
        var y = graph_size / 2;
        var radius = x - line_thickness;
        var start_angle = 1.5 * Math.PI;
        
        var stroke_colour = col;
        var value_text_size = Math.round(graph_size * 0.25) ;

        ctx.beginPath();
        ctx.lineWidth = line_thickness;
        ctx.strokeStyle = stroke_colour;
        ctx.globalAlpha = 0.2;
        ctx.arc(x, y, radius, start_angle, 6.4 + start_angle, false);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = line_thickness;
        ctx.strokeStyle = stroke_colour;
        ctx.globalAlpha = 1;
        ctx.arc(x, y, radius, start_angle, radians + start_angle, false);
        ctx.stroke();

        draw.text(perc_of_pie * 100 + "%", x, y + Math.round(value_text_size * 0.4), value_text_size, stroke_colour, "center");
    }
};

 
// Graph Class
var Graph = function(graph){

    this.init = function(){
        this.graph_data = graph.getAttribute("data-graph-values").split(",");
        this.graph_type = graph.getAttribute("data-graph-type");
        this.graph_col = graph.getAttribute("data-graph-color") || "#333333";
        this.graph_size = graph.getAttribute("data-graph-size") || 100;
        this.newgraph = document.createElement("canvas");
        
        graph.appendChild(this.newgraph);
        this.canvas = this.newgraph;

        switch(this.graph_type){
            case "sparkline":
                this.canvas.width = this.graph_data.length * 4;
                this.canvas.height = 30;
                break;
            default:
                this.canvas.width = this.graph_size;
                this.canvas.height = this.graph_size;
                break;
        }

        ctx = this.canvas.getContext("2d")
        this.draw();
    }

    this.draw = function(){
        switch(this.graph_type){
            case "sparkline":
                draw.sparkline(this.graph_data);
                break;
            case "percpie":
                draw.percpie(this.graph_data, this.graph_col, this.graph_size);
                break;
            default:
                draw.sparkline(this.graph_data);
                break;
        }
        
    }
   
};


// Setup canvas, graph       
function init(){

    // Is canvas supported?
    if(!!document.createElement('canvas').getContext){

        // Get all the graphme elements
        graphs = document.getElementsByClassName("graphme");

        // Instantiate a graph object for each graphme element
        for(var i = 0; i < graphs.length; i += 1){
            setgraph = new Graph(graphs[i]);
            setgraph.init();
        }
    } 
}



window.onload = init;