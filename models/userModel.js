

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us your name!'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        photo: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'guide', 'lead-guide', 'admin'],
            default: 'user',
            // required:
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minLength: 8,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                // This only works when save and create new object
                validator: function (el) {
                    return el === this.password;
                },
                message: 'Password are not the same!',
            },
        },
        passwordChangedAt: { type: Date },
        passwordResetToken: String,
        passwordResetExpires: Date,

        active: {
            type: Boolean,
            default: true,
            select: false,
        },
    })