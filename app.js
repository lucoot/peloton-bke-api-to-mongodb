const request = require ('request');
var {mongoose} = require('./mongoose');

var {Workout} =  require('./workout.js');
const credentials = require('./credentials.json');

var env = process.env.NODE_ENV || 'devlopment';

console.log('env*****', env);
if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI =  'mongodb://localhost:27017/Workouts';
}


function getData (user, callback) {
    request.get({
       url: `https://api.pelotoncycle.com/api/user/${user.userId}/workouts?limit=10&page=0&sort_by=-created`,
       json: true,
        headers: {
            'cookie': `peloton_session_id=${user.token}`
            }   
        }, function(err, res, body) {
        if (res.statusCode === 200) {
            let data = body;
            //console.log(data);
            callback(true, data);
        } else {
            callback(false, data)
        }          
    });
};

function postData (data, callback) {
    var workout = new Workout (
        data
     );
    Workout.findOne({workoutId:data.workoutId}).then((result) => {
        if (result){
            console.log('workout already in database');
        } else {
            console.log('workout not found in database - adding it.')
            workout.save();
        }
        }, (e) => {
        console.log('error posting data to database');
    });    
};

//Updates database every 10 minutes with new workouts
setInterval(() =>
getData(credentials.user1, function(error, response){
    //console.log(response);
    const total = response.total;
    for (var workout = 0; workout < total ; workout++ ) {
        var workoutData = {
        user: credentials.user1.name,    
        work: (response.data[workout].total_work / 1000).toFixed(0),
        workoutId: response.data[workout].id,
        datetime: new Date(response.data[workout].start_time * 1000),
        length: Math.floor((response.data[workout].end_time - response.data[workout].start_time)/60),
        };
        console.log(workoutData.workoutId);
        postData(workoutData, function(result) {
            if(result){
                console.log('success');
            } else {
                console.log('not added');
            }              
        });
        }
})
, 6000000);