const jwt = require("jsonwebtoken");

/** return signed JWT from user's email. */
function createToken(email){
    return jwt.sign(email, "MOST_SECRET_OF_KEYS");
};

module.exports = { createToken };