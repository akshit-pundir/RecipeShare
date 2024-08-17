const ExpressError = require("../utilities/ExpressError");
const ReciepeSchema = require("./schema")


const validateReciepe=(req,res,next)=>{

        const {error}=ReciepeSchema.validate(req.body);
        if(error){
            const msg=error.details.map(data=>data.message).join(',');
            throw new ExpressError(msg,400);

        }else{
            next();
        }


}

module.exports=validateReciepe;


