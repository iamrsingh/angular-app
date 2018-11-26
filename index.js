var http = require('http');
var oracledb = require('oracledb');
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var dbconfig = require('./public/dbconfig');
require('router');

app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname + '/public'));

app.get('/policymgmt',function (req,res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/userdata',function(req, res)
                      {
                        oracledb.getConnection(
                            {
                                user : dbconfig.user,
                                password : dbconfig.password,
                                connectString : dbconfig.connectString
                            },
                            function (err,connection) {
                                var i = 0;
                                var dset = [];

                                if (err) {console.error(err); return;}
                                connection.execute(
                                    "select pol_name as name, amt_paid as amt, end_Date as edate, valid "
                                    + "from policy_user where upper(id) = upper(:ua)", {ua : req.body.Usr},
                                    function (err,data) {
                                        if (err) {
                                            console.error(err); res.end();
                                        }
                                        else {
                                                /*console.log(JSON.stringify(data));*/
                                                for (i=0;i<data.rows.length;i++){
                                                    dset.push(data.rows[i])
                                                }
                                                console.log(dset);
                                                res.send(dset);
                                                return dset;
                                            }
                                    }
                                )
                            }
                        );
                    }
        );

app.get('/policydata',function(req, res)
    {
        oracledb.getConnection(
            {
                user : dbconfig.user,
                password : dbconfig.password,
                connectString : dbconfig.connectString
            },
            function (err,connection) {
                var i = 0;
                var dset1 = [];

                if (err) {console.error(err); return;}
                connection.execute(
                    "select pol_name as name, pol_detail as dtl "
                    + "from policy",
                    function (err,data) {
                        if (err) {
                            console.error(err); res.end();
                        }
                        else {
                            /*console.log(JSON.stringify(data));*/
                            for (i=0;i<data.rows.length;i++){
                                dset1.push(data.rows[i])
                            }
                            console.log(dset1);
                            console.log(data);
                            res.send(dset1);
                            return dset1;
                        }
                    }
                )
            }
        );
    }
);

app.post('/regdata', function (req,res) {
        var uid = req.body.fname.substring(0,1) + "X" + req.body.lname.substring(0,1);
        var DOB = req.body.dob.substring(0,10);
        oracledb.getConnection(
            {
                user : dbconfig.user,
                password : dbconfig.password,
                connectString : dbconfig.connectString
            },
            function (err,connection) {
                if (err) {console.error(err); return;}
                connection.execute(
                    "insert into Users(fname, lname, phone, email, dob, paswd, userid) values(:fname, :lname, :phone, :email, to_date(:dob,'YYYY-MM-DD'), :paswd, :userid)",{
                    fname: req.body.fname, lname: req.body.lname, phone: req.body.phno, email: req.body.eml, dob: DOB, paswd: req.body.pwd, userid: uid
                    },
                    { autoCommit: true },
                    function (err,data) {
                        if (err) {
                            console.error(err); res.end();
                        }
                        else {
                            res.send(uid);
                        }
                    }
                )
            }
        );
    }
);

app.post('/uservalid', function (req,res) {
        var rslt = '';
        oracledb.getConnection(
            {
                user : dbconfig.user,
                password : dbconfig.password,
                connectString : dbconfig.connectString
            },
            function (err,connection) {
                if (err) {
                           console.error(err);
                           return;
                         }
                connection.execute(
                    "select count(1) "
                    + "from Users "
                    + "where upper(userid) = upper(:au) and paswd = :ap",
                    { au: req.body.UserId, ap: req.body.Paswd},
                    function (err,data) {
                        if (err) {
                            console.error(err); res.end();
                        } else{
                            rslt = JSON.stringify(data.rows);
                            console.log(rslt);
                            console.log(req.body.Paswd);
                            res.send(rslt);
                        }
                    }
                )
            }
        );
    }
);

app.post('/policyupd', function (req,res) {
        var udata = req.body;
        oracledb.getConnection(
            {
                user : dbconfig.user,
                password : dbconfig.password,
                connectString : dbconfig.connectString
            },
            function (err,connection) {
                if (err) {console.error(err); return;}
                for (i=0;i<udata.length;i++) {
                    connection.execute(
                        "update policy set pol_detail = :a where pol_name = :b", {
                            a: udata[i][1],
                            b: udata[i][0]
                        },
                        {autoCommit: true},
                        function (err, data) {
                            if (err) {
                                console.error(err);
                                res.end();
                            }
                            else {
                                res.end();
                            }
                        }
                    )
                }
            }
        );
    }
);

http.createServer(app).listen(dbconfig.port);

console.log('Listening on port -' + dbconfig.port);
