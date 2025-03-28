const joi = require('joi')

exports.registerSchema = joi.object().keys({
    userName: joi.string().trim().min(3).max(50).required(),
    email: joi.string().trim().email().required(),
    phoneNo: joi.string().min(10).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required(),

})


exports.loginSchema = joi.object().keys({
    email: joi.string().trim().min(3).email().required(),
    password: joi.string().required(),
    // username: joi.string().min(3).optional(),
}).or('email', 'password') 


// exports.verificationEmailSchema = joi.object().keys({
//     email: joi.string().trim().min(6).email().required(),

// })


exports.forgotPasswordSchema = joi.object().keys({
    email: joi.string().trim().min(6).email().required(),

})



exports.resetPasswordschema = joi.object().keys({
    newPassword: joi.string().required(),
    confirmPassword: joi.string().required()
})

exports.changeUserPasswordschema = joi.object().keys({
    currentPassword: joi.string().required(),
    newPassword: joi.string().required(),
    confirmPassword: joi.string().required().valid(joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
    })

})