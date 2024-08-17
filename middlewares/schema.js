const Joi=require("joi");

const ReciepeSchema=Joi.object({
    title:Joi.string().required(),
    prepTime:Joi.number().required(),
    cookTime:Joi.number().min(2).required(),
    ingredients:Joi.string().required(),
    instruction:Joi.string().trim().required(),
    cusine:Joi.string().required(),
    category:Joi.string().required(),
    youtube:Joi.string().pattern(new RegExp('^(https?://)?(www\\.)?(youtube\\.com|youtu\\.?be)/.+$') ),
    image:Joi.string()
});

module.exports=ReciepeSchema;





