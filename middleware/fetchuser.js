const jwt = require('jsonwebtoken');
const jwt_str = 'Anuragisgoodb$oy';


const fetchuser = (req,res,next) =>{

    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error : "Please enter valid details"});
    }
    try{

        const data = jwt.verify(token , jwt_str);
        req.user = data.user;

        next();

    } catch(error){
        res.status(401).send({error : "Please enter valid details"});
    }

}

module.exports = fetchuser;