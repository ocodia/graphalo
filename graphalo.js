
// Graphalo
// PAUL LIVINGSTONE - 2012



// Setup canvas & defaults
var graphalo = {
    ctx: null,
    draw: null,
    Graph: null
}
// Drawing tools

graphalo.draw = {
    clear: function(){
        graphalo.ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    rect: function(x, y, w, h, col){
        graphalo.ctx.fillStyle = col;
        graphalo.ctx.fillRect(x, y, w, h);
    },
    circle: function(x, y, radius, col){
        graphalo.ctx.fillStyle = col;
        graphalo.ctx.beginPath();
        graphalo.ctx.arc(x, y, radius, 0, Math.PI*2, true);
        graphalo.ctx.closePath();
        graphalo.ctx.fill();
    },
    text: function(str, x, y, size, col, align){
        graphalo.ctx.font = "bold " + size + "px Arial";
        graphalo.ctx.fillStyle = col;
        graphalo.ctx.textAlign = align;
        graphalo.ctx.fillText(str, x, y);
    },
    sparkline: function(gr_data){
        var graph_data = gr_data;
        var graph_data_max = Math.max.apply(Math, graph_data);
        var graph_data_length = gr_data.length - 1;

        graphalo.ctx.lineWidth = 1;
        graphalo.ctx.strokeStyle = "#333333"
        graphalo.ctx.beginPath();
        
        for(var i = 0; i < graph_data.length; i += 1){
            var perc_of_max = 0;
            var value_of_height;

            perc_of_max = graph_data[i] / graph_data_max * 100;
            value_of_height = perc_of_max / 100 * 20;

            if(i === 0){
                graphalo.ctx.moveTo(0, 20 - Math.round(value_of_height));
            }
            else{
               graphalo.ctx.lineTo(i * 2, 20 - Math.round(value_of_height)); 
            }            
        } 
        graphalo.ctx.lineJoin = "miter";
        graphalo.ctx.stroke();
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

        

        graphalo.ctx.beginPath();
        graphalo.ctx.lineWidth = line_thickness;
        graphalo.ctx.strokeStyle = stroke_colour;
        graphalo.ctx.globalAlpha = 0.2;
        graphalo.ctx.arc(x, y, radius, start_angle, 6.4 + start_angle, false);
        graphalo.ctx.stroke();

        graphalo.ctx.beginPath();
        graphalo.ctx.lineWidth = line_thickness;
        graphalo.ctx.strokeStyle = stroke_colour;
        graphalo.ctx.globalAlpha = 1;
        graphalo.ctx.arc(x, y, radius, start_angle, radians + start_angle, false);
        graphalo.ctx.stroke();

        graphalo.draw.text(perc_of_pie * 100 + "%", x, y + Math.round(value_text_size * 0.4), value_text_size, stroke_colour, "center");
        //draw.text(graph_label, x, y + value_text_size, value_text_size / 2, stroke_colour, "center");
    },
    pie: function(gr_data, col, size, label){

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

        

        graphalo.ctx.beginPath();
        graphalo.ctx.lineWidth = line_thickness;
        graphalo.ctx.strokeStyle = stroke_colour;
        graphalo.ctx.globalAlpha = 0.2;
        graphalo.ctx.arc(x, y, radius, start_angle, 6.4 + start_angle, false);
        graphalo.ctx.stroke();

        graphalo.ctx.beginPath();
        graphalo.ctx.lineWidth = line_thickness;
        graphalo.ctx.strokeStyle = stroke_colour;
        graphalo.ctx.globalAlpha = 1;
        graphalo.ctx.arc(x, y, radius, start_angle, radians + start_angle, false);
        graphalo.ctx.stroke();

        graphalo.draw.text(perc_of_pie * 100 + "%", x, y + Math.round(value_text_size * 0.4), value_text_size, stroke_colour, "center");
        //draw.text(graph_label, x, y + value_text_size, value_text_size / 2, stroke_colour, "center");
    }
};

 
// Graph Class
graphalo.Graph = function(graph){

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
                this.canvas.width = this.graph_data.length * 2;
                this.canvas.height = 20;
                break;
            default:
                this.canvas.width = this.graph_size;
                this.canvas.height = this.graph_size;
                break;
        }

        graphalo.ctx = this.canvas.getContext("2d")
        this.draw();
    }

    this.draw = function(){
        switch(this.graph_type){
            case "sparkline":
                graphalo.draw.sparkline(this.graph_data);
                break;
            case "percpie":
                graphalo.draw.percpie(this.graph_data, this.graph_col, this.graph_size, this.graph_label);
                break;
            case "pie":
                graphalo.draw.pie(this.graph_data, this.graph_col, this.graph_size, this.graph_label);
                break;
            default:
                graphalo.draw.sparkline(this.graph_data);
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
            setgraph = new graphalo.Graph(graphs[i]);
            setgraph.init();
        }
    } 
}



window.onload = init;