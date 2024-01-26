const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");

// required models
const userModel = require("../../config/db")["user"];

// validate password
const validatePassword = async (passwordInputs) => {
  let result;
  let passwordError = "";

  // password scheme
  const pwdSchema = new passwordValidator()
    .min(14, "Password must contain at least 14 characters")
    .digits(1, "Password must contain at least 1 number")
    .symbols(1, "Password must contain at least 1 of these symbols")
    .uppercase(1, "Password must contain at least 1 uppercase")
    .not()
    .spaces(0, "Password should not contain any spaces");

  const isPasswordValid = pwdSchema.validate(passwordInputs);
  if (!isPasswordValid) {
    const passwordValidator = pwdSchema.validate(passwordInputs, {
      details: true,
    });
    passwordValidator.forEach((error) => {
      passwordError = passwordError + error.message + "\n";
    });
    result = [false, passwordError];
  } else {
    result = [true, null];
  }
  return result;
};

// register account
const userRegister = async (req, res) => {
  const { email, password } = req.body;
  let passwordError = "";
  let emailError = "";

  // check for required fields
  if (!email || !password)
    return res.status(400).json({ error: "Please Fill All Fields" });

  // check for password validity
  const isPasswordValid = await validatePassword(password);
  passwordError = isPasswordValid[1];

  try {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password.toString(), saltRound);
    const newAccountCredentials = await userModel.create({
      email,
      password: hashedPassword,
    });
    if (!isPasswordValid[0]) {
      await newAccountCredentials.destroy();
      return res.status(400).json({ passwordError });
    }
    res.status(200).json({
      msg: "Account is successfully created!",
    });
  } catch (emailErrorValidation) {
    if (
      emailErrorValidation.name == "SequelizeValidationError" &&
      emailErrorValidation.errors[0].path == "email"
    )
      emailError = "Invalid email address";

    if (
      emailErrorValidation.name == "SequelizeUniqueConstraintError" &&
      emailErrorValidation.errors[0].path == "email"
    )
      emailError = "Email registered";

    return res.status(400).json({ emailError, passwordError });
  }
};

module.exports = { userRegister };
