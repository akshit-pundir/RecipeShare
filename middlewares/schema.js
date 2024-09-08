const BaseJoi=require('joi');
const sanitizeHtml = require('sanitize-html');



const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                })
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean
            }
        }
    }
})
 
const Joi = BaseJoi.extend(extension);


// const Joi=require("joi");




const ReciepeSchema=Joi.object({
    title:Joi.string().required().escapeHTML(),
    prepTime:Joi.number().required(),
    cookTime:Joi.number().min(2).required(),
    ingredients:Joi.string().required().escapeHTML(),
    instruction:Joi.string().trim().required().escapeHTML(),
    cusine:Joi.string().required().escapeHTML(),
    category:Joi.string().required().escapeHTML(),
    youtube:Joi.string().pattern(new RegExp('^(https?://)?(www\\.)?(youtube\\.com|youtu\\.?be)/.+$') ).escapeHTML(),
    // image:Joi.string()
});

module.exports=ReciepeSchema;





