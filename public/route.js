app.get('/app.js', function (req,res) {
    res.sendFile(_dirname + '/public/' + 'app.js')
})