const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secrets = require('./data/secrets');

exports.login = async (req, res) => {
  const {email, password} = req.body;
  const members = await db.getMembers();
  // console.log(members);
  const member = members.find((member) => {
    return member.emailaddress === email &&
    bcrypt.compareSync(password, member.memberpassword);
  });
  if (member) {
    const accessToken = jwt.sign(
      {emailaddress: member.emailaddress, membername: member.membername},
      secrets.accessToken, {
        expiresIn: '30m',
        algorithm: 'HS256',
      });
    res.status(200).json({name: member.membername, accessToken: accessToken});
  } else {
    res.status(401).send('Invalid credentials');
  }
};

exports.check = (req, res, next) => {
  // console.log('gothere2');
  const authHeader = req.headers.authorization;
  // console.log(`req.headers: ${JSON.stringify(req.headers)}`);
  // if (authHeader) {
  const token = authHeader.split(' ')[1];
  // console.log(`authheader: ${authHeader.split(' ')}`);
  jwt.verify(token, secrets.accessToken, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    // console.log(`user: ${JSON.stringify(user)}`);
    req.user = user;
    next();
  });
  // } else {
  //   console.log('gothere1');
  //   res.sendStatus(401);
  // }
};


