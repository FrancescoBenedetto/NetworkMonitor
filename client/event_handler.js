/**
 * Created by francesco on 20/04/16.
 */

var socket = io('http://localhost:3000');



var on_errors = function(times2alerts){
    var times = times2alerts.times;
    alerts = times2alerts.pings.map(parsePing);

    if(times==null){
        updateCircles(svg, alerts, y_axis_scale, xx_position + padding, 'event');
    }
    else {
        y_axis_scale.domain([times.min, times.max]);
        y_axis.call(y_axis_scale.axis);
        brush.y(y_axis_scale);
        drawCircles(svg, alerts, y_axis_scale, xx_position + padding, 'event');
    }
};

var parsePing = function(ping){
    var alert = {};
    alert.id = 'ip'+ ping.id.replace(/\:|\./g, '-');
    alert.timestamp = ping.timestamp;
    alert.words = ping.words;

    return alert;
};

var parse_tweet = function(tweet){
    return {
        id : tweet.id_str,
        img_src: tweet.user.profile_image_url,
        username: tweet.user.name,
        timestamp : createTimestamp(tweet.created_at),
        text: tweet.text
    };
};

var createTimestamp = function(created_at) {
    var date = new Date(created_at);
    return date.getHours() + ':' + date.getMinutes();
};

var ontweets = function(tweets) {
    var parsed_tweets = tweets.map(function(tweet){return parse_tweet(tweet);});
    drawtweets(parsed_tweets);
};

socket.on('errors', function(errors){
    on_errors(errors);
});

socket.on('tweets', function(tweets){
   ontweets(tweets);
});


/*
setTimeout(function(){
    ontweets([
        {id:'1', user : {name:'ZioBotto', profile_image_url:'./imgs/tweets.jpeg'}, created_at : Date.now(),
        text : "This is so freakn awesome! <a href=\"https://twitter.com/#!/search?q=%23sogenius\" title=\"#sogenius\" class=\"tweet-url hashtag\" rel=\"nofollow\">#sogenius</a>  <a href=\"https://t.co/tH5sv0sEyK\" rel=\"nofollow\">https://t.co/tH5sv0sEyK</a>"
        }
    ])
}, 500);
*/


/*
setTimeout(function(){
    var times2alerts = {times : null,
    pings:[
        {id : '123:123:2345::a_213:2135:321::', timestamp : now - 20000, providers : ['Prova A', 'Prova B']},
        {id : '123:123:2343::a_213:2135:323::', timestamp : now - 300000, providers : ['Prova C', 'Prova D']}
    ]};
   on_alerts(times2alerts);
}, 1000);


setTimeout(function(){
    var times2alerts = {times : null,
        pings:[
           // {id : '123:123:2345::a_213:2135:321::', timestamp : now - 20000, words : ['Prova A', 'Prova B']},
            {id : '123:123:2343::a_213:2135:323::', timestamp : now - 300000, providers : ['Prova C', 'Prova D']}
        ]};
    on_alerts(times2alerts);
}, 5000);

setTimeout(function(){
    var now = Date.now();
    var times2alerts = {times : {min:now - 10*60*1000, max:now},
        pings:[
            {id : '123:123:2345::a_213:2135:321::', timestamp : now - 200000, providers : ['Prova F', 'Prova D']},
            {id : '123:123:2343::a_213:2135:323::', timestamp : now - 300000, providers : ['Prova G', 'Prova H']}
        ]};
    on_alerts(times2alerts);
}, 10000);
    */