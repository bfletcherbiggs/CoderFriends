const express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    request = require('request'),
    passport = require('passport'),
    GitHubStrategy = require('passport-github2').Strategy,
    config = require('./config.js'),
    axios = require('axios'),
    port = 3000,
    app = express();

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.json())
app.use(session({
    secret: config.sessionSecret
}));
app.use(passport.initialize())
app.use(passport.session())

const requireAuth = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(403).end();
    }
    next();
}

passport.use(new GitHubStrategy({
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        session.user = profile;
        session.user.token = accessToken;
        return done(null, profile);
    }
));

passport.serializeUser(function(user, done) {
    return done(null, user);
});

passport.deserializeUser(function(user, done) {
    return done(null, user);
});

app.get('/auth/github',
    passport.authenticate('github', {
        scope: ['user:email']
    }));

app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/#!/login'
    }),
    function(req, res) {
        res.redirect('/#!/home');
    });

app.get('/api/github/following', requireAuth, function(req, res, next) {
    var username = session.user.username;
    axios.request({
            url: `https://api.github.com/users/${username}/following`,
            headers: {
                'Authorization': `token ${session.user.token}`
            }
        })
        .then(function(result) {
            res.status(200).json(result.data);
        })
        .catch(function(err) {
            next(err);
        });
});

app.get('/api/github/:username/activity', requireAuth, function(req, res, next) {
    var user = req.params.username;

    var options = {
        url: 'https://api.github.com/users/' + user + '/events',
        headers: {
            "user-agent": "My-Cool-GitHub-App"
        }
    };

    request(options, function(err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(response);
        }
    })

})

app.listen('3000', function() {
    console.log("Successfully listening on : 3000")
})


// var GitHubApi = require('node-github')
// var github = new GitHubApi({
// 	// required
// 	version: "3.0.0",
// 	// optional
// 	debug: true,
// 	protocol: "https",
// 	host: "api.github.com", // should be api.github.com for GitHub
// 	timeout: 5000,
// 	headers: {
// 		"user-agent": "My-Cool-GitHub-App"
// 	}
// })
// app.get('/api/github/following', requireAuth, function(req, res) {
// 	console.log(req.user.username)
// 	github.user.getFollowingFromUser({
// 		user: req.user.username
// 	}, function(err, response) {
// 		if(err) {
// 			console.log(err);
// 			res.status(500).send(err);
// 		} else {
// 			res.status(200).json(response)
// 		}
// 	})
//
// });
