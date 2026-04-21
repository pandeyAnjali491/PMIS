const joi=require("joi");

const studentSchema=joi.object({
    data:joi.object({
        name:joi.string().required(),
        email:joi.string().email().required(),
        age:joi.number().min(0).optional(),
        password:joi.string().min(6).required(),
        college:joi.string().required(),
        yearOfGraduation:joi.number().min(2000).max(2099).optional(), 
        course:joi.string().required(),
        skills:joi.string().optional(), 
        phone:joi.string().pattern(/^[0-9]{10}$/).required(),
        dob:joi.date().required(),
        gender:joi.string().valid("Male", "Female", "Other").required(),
        state:joi.string().required(),
        district:joi.string().required(),
        education:joi.string().required(),
        preferred_domain:joi.string().required(),
        internship_type:joi.string().valid("Remote", "Onsite", "Hybrid").required()
    }).required()
});
// Company validation schema
const companySchema = joi.object({
  data: joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    phone: joi.string().required(),
    address: joi.string().required(),
    state: joi.string().required(),
    district: joi.string().required(),
    industry_type: joi.string().required(),
    job_type: joi.string().required(),
    website: joi.string().uri().allow(""),
    hr_name: joi.string().required(),
    hr_email: joi.string().email().required(),
    hr_phone: joi.string().required(),
    password: joi.string().min(6).required(),
  }).required()
});

module.exports = { studentSchema, companySchema };