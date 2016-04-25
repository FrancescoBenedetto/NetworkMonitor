var width = 700,
    height = 400;

var xx_position = width * 0.05,
    xy_position = height * 0.90,
    yy_position = height - xy_position,
    y_size = height * 0.85,
    interval = 10 * 60 * 1000,
    padding = 20,
    brushWidth = 20,
    xy2_position = xx_position + padding + brushWidth + padding * 4;

var now = Date.now();

var svg = d3.select('div.measurement_alerts')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'alerts')
    .append('g')
    .attr('class', 'timeline-chart');


var y_axis_scale = d3.time.scale()
    .domain([now - interval, now])
    .range([0 + yy_position, y_size + yy_position])
    .nice();

var y_axis = svg.append('g')
    .attr('transform', 'translate(' + (xx_position + padding) + ',' + (0) + ')') //yy_position
    .attr('class', 'y_axis')
    .call(y_axis_scale.axis = d3.svg.axis()
        .scale(y_axis_scale)
        .orient('left')
        // .ticks(3)
        //.tickSize([3])
    );

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d){return "<text>"+d.words[0]+"</text><br><text>"+d.words[1]+"</text>";})
    .direction('e')
    .offset([-2, 10])
;

svg.call(tip);

var brush = d3.svg.brush()
    .y(y_axis_scale)
    //.extent([now - interval, now])
    .on('brushend', brushed)
   // .on('mouseup', brushed)
    ;

var gBrush = svg.append("g")
    .attr("class", "brush")
    .call(brush);

gBrush.selectAll("rect")
    .attr('x', xx_position + padding)
    .attr('width', brushWidth)
;


var alerts = [{id:'prova1', timestamp : now - 20000, words : ['Prova A', 'Prova B']},
    {id:'prova2', timestamp : now - 50000, words:['Prova C', 'Prova D']}];

var modified_id = [];

