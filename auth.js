'use struct';


//"jot"
const jwt = require ('jsonwebtoken');

//"ja-wicks"
const jwksClient = require('jwks-rsa');

//Auth0 account page -> advanced settings -> Endpoints -> 0auth -> JSON Web Key Set
const client = jwksClient({
  jwksUril: process.env.JWKS_URI
});

//Go getKey from jsonwebtoken
//from:  https://www.npmjs.com/package/jsonwebtoken - search for "getKey"
function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// function to verify user on route
function verifyUser(req, errFirstOrUserCallbacKFunction){
  try{
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);

    //Verify jwt verify
    jwt.verify(token, getKey, {}, errFirstOrUserCallbacKFunction);

  }catch (error){
    errFirstOrUserCallbacKFunction('verboden not authorized');
  }
}

module.exports = verifyUser;
