var express = require('express');
var bodyParser = require('body-parser');
var db = require('./dbhandler');
var app = express();
var api = express();


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

api.use(bodyParser.json( { type: '*/*' })); 
api.get('/epalist', function(req, res){
    var query = db.getDB();
    spillEPAs();

    function spillEPAs() {
        query.all("SELECT * FROM EPAs", function(err, rows){
            res.json(JSON.stringify(rows));
        });
    }
});

api.post('/epalist', function(req, res){
    var stmt = db.prepare("UPDATE medFeedback INSERT INTO students VALUES(?, ?)");
    stmt.run(row.pid + 1, "name");
    stmt.finalize();
}); 




//API root


app.use('/api', api)
app.use(express.static('static'));

