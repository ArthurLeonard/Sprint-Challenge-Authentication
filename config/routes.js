const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'add a .env file to root of project with the JWT_SECRET variable';

const { authenticate } = require('../auth/authenticate');
const users = require('./user-functions.js');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  let user = req.body     // grab whole package as user

        // change stored password to hashed version
    user.password = bcrypt.hashSync(user.password, 10); // hash 2^10 times

        // now ready to add user to database
    users.addUser(user).then( savedUser => { res.status(201).json(savedUser) } )
                        .catch( err =>     { res.status(500).json(err)  });
}

function login(req, res) {
  // implement user login

  let { username, password } = req.body;      // destructure from body of the request
  console.log(username, password)
  // search database for user 
users.findUserBy( { username }).first().then( user => {     // compare hashed password with stored password
                                          if ( bcrypt.compareSync(password, user.password) ){
                                              console.log('passwords match')
  /*************** */                         const token  = generateToken(user);
                                              console.log(token)
  /*****************/                         res.status(200).json( { message: `welcome ${user.username}`, token } )

                                          } else
                                              res.status(401).json( { message: 'Invalid Credentials' })


                                      }).catch( err => { res.status(500).json(err) })
}

    // need payload, secret, and options
function generateToken ( user ) {
      // generate payload (1)
      console.log('in generate token')
  const payload = {
                      subject: user.id,
                      username: user.username,
                      
                  }
      // secret was imported from .env file above (2)
  const options = {
                      expiresIn: '9h'
                  }

  return jwt.sign( payload, secret, options);

}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
