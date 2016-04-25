/**
 * Created by francesco on 23/04/16.
 */

var drawtweets = function(tweets) {
  var drawed_tweets = d3.select('ol.tweets')
      .selectAll('li')
      .data(tweets, function(d){return d.id;})
      ;

  var selector = drawed_tweets.enter().append('li');
    
  var picture = selector.append('div')
      .attr('class', 'pic')
      .append('img')
      .attr('class', 'pic')
      .attr('src', function(d){return d.img_src;})
    ;
    
  var header = selector.append('div')
      .attr('class', 'header')
      ;

  var username = header
                    .append('text')
                    .attr('class', 'user')
                    .text(function(d){return d.username})
    ;


  var time = header
      .append('text')
      .attr('class', 'time')
      .text(function(d){return '• '+d.timestamp});

  var content = selector.append('div')
      .attr('class', 'content')
      .append('text')
      .attr('class', 'tweet')
      .html(function(d){return d.text});
    ;

  var footer = selector.append('div')
      .attr('class', 'footer')
      .append('hr')
      .attr('class', 'separator')
    ;

  drawed_tweets.exit().remove();


};
