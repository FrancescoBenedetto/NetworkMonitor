/**
 * Created by francesco on 20/04/16.
 */

var updateCircles = function(selector, array, scale, x, classs){
    var circles = selector.selectAll('circle.' + classs)
        .data(array, function(d){return d.id});

    circles.enter()
        .append('circle')
        .attr('class', classs)
        //.attr('id', function(d){return d.id})
        .attr('r', y_size * 0.01)
        .attr('cx', x)
        .attr('cy', function(d){return scale(d.timestamp)})
        .style('fill', 'red')
        .style('stroke', 'black')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
    ;

    //draw new objects
    //return drawCircle(circles.enter(), scale, x, classs);

    //delete old
    circles.exit().remove();
};

var drawCircles = function(selector, array, scale, x, classs){
    d3.selectAll('circle.event').remove();
    
    updateCircles(selector, array, scale, x, classs);
};

var drawText = function(selector, words, x, y, id) {
    var text = '('+words[0]+', '+words[1]+')';
       selector
           .append('g')
           .attr('id', id)
           .attr('class', 'selected_event')
           .append('text')
           .attr('x', x + 5)
           .attr('y', y)
           //  .attr("dy", ".5em")
           .style('font-size', '10px')
           .text(text)
       ;
};

var updateStatus = function(id, words, x, y){
  var index = _.findIndex(modified_id, function(el){return el.id==id});
  var displayed = modified_id[index].status;
  var selector = d3.select('svg');
  if(!displayed){
    drawText(selector, words, x, y, id);
      modified_id[index].status = true;
  }
    else{
      d3.select('#'+id).remove();
      modified_id[index].status = false;
  }

};

var brushed = function(){
    var min = brush.extent()[0].getTime();
    var max = brush.extent()[1].getTime();
    d3.select('#brushAxis').remove();
    d3.selectAll('circle.selected_event').remove();
    d3.selectAll('.selected_event').remove();
  if(min!=max){
        var y_axis_scale2 = d3.time.scale()
            .domain([min, max])
            .range([0 + yy_position, y_size + yy_position])
            .nice();

        var y_axis2 = svg.append('g')
            .attr('id', 'brushAxis')
            .attr('transform', 'translate(' + (xy2_position) + ',' + (0) + ')') //yy_position
            .attr('class', 'y_axis')
            .call(y_axis_scale2.axis = d3.svg.axis()
                .scale(y_axis_scale2)
                .orient('left')
                // .ticks(3)
                //.tickSize([3])
            );

        //select circles falling in the selected interval
        var selected_alerts = _.filter(alerts, function(el){return el.timestamp<= max && el.timestamp >= min});
        var temp = Object.create(modified_id);
        modified_id = selected_alerts.map(function(el){
            var ret = Object.create(el);
            ret.id = el.id + 'filtered';
            var old_el = _.find(temp, function(old) {return old.id== el.id+'filtered'});
            if(old_el!=null){
                ret.status = old_el.status;
            }
            else {
                ret.status = false;
            }
            return ret;});

      modified_id.forEach(function(el) {
          if (el.status) {
              el.status = false;
              updateStatus(el.id, el.words, xy2_position, y_axis_scale2(el.timestamp));
          }
      });

        //change their id
       d3.select('svg').selectAll('circle.selected_event')
           .data(modified_id, function(d){return d.id})
           .enter()
           .append('circle')
           .attr('class', 'selected_event')
           //.attr('id', function(d){return d.id})
           .attr('r', y_size * 0.01)
           .attr('cx', xy2_position)
           .attr('cy', function(d){return y_axis_scale2(d.timestamp)})
           .style('fill', 'red')
           .style('stroke', 'black')
           .on('click', function(d) {updateStatus(d.id, d.words, xy2_position, y_axis_scale2(d.timestamp))})
       ;
    }
};

