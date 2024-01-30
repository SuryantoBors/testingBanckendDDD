const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");
const jwt = require("jsonwebtoken");

// required models
const userModel = require("../../config/db")["user"];
const userProfileModel = require("../../config/db")["userProfile"];

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
    const newUserProfileData = {
      userId: newAccountCredentials.id,
      firstname: "test",
      lastname: "null",
    };
    const createNewUserProfileData = await createUserProfile(
      newUserProfileData,
    );
    res.status(200).json(createNewUserProfileData);
  } catch (emailErrorValidation) {
    console.log(emailErrorValidation);
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

// to setup user profile once created
const createUserProfile = async ({ userId, firstname, lastname }) => {
  const data = {
    userId,
    firstname,
    lastname,
  };
  try {
    const isUserProfileExist = await userProfileModel.findOne({
      where: { userId },
    });

    if (isUserProfileExist) {
      throw {
        status: 403,
        message: "Profile already exists, cannot create a new profile",
      };
    }
    const userProfileData = await userProfileModel.create(data);
    return userProfileData;
  } catch (error) {
    console.error(error);

    if (error.status) {
      // If it's a known error with a status code, send the appropriate response
      return { msg: error.message };
    } else {
      // If it's an unexpected error, send a generic error response
      return { msg: "Internal server error" };
    }
  }
};

// to generate a new token once user logged in
const generateToken = (user) => {
  return jwt.sign({ userId: user._id, email: user.email }, user.fingerprint);
};

// find and get user's UUID by email
const findUserByEmail = async (email) => {
  // result contains 2 result [is it exist, the value of the existed items]
  let result;
  const isUserExist = await userModel.findOne({ where: { email } });
  if (!isUserExist) {
    result = [false, null];
  } else {
    result = [true, isUserExist.id];
  }
  return result;
};

// user login function
const userLogin = async (req, res) => {
  const isUserExist = await findUserByEmail(req.body.email);
  if (!isUserExist[0]) return res.status(400).json({ msg: "not found" });

  const user = {
    userId: isUserExist[1],
    email: req.body.email,
    fingerprint: req.body.fingerprint,
  };
  return res.status(200).json({ token: generateToken(user) });
};

// verify provided auth token
const verifyToken = ({ token, fingerprint }) => {
  try {
    const verified = jwt.verify(token, fingerprint);
    console.log("Decoded JWT:", verified);
    return true;
  } catch (err) {
    console.error("JWT Verification Failed:", err.message);
    return false;
  }
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const authData = {
    token: req.headers.token,
    fingerprint: req.headers.fingerprint,
  };
  const { firstname, lastname } = req.body;
  if (!firstname || !lastname)
    return res.status(400).json({ msg: "please fill all fields" });
  const data = {
    firstname,
    lastname,
  };
  //auth
  const isTokenValid = verifyToken(authData);
  // if invalid token
  if (!isTokenValid) return res.status(401).json({ msg: "Unauthorized" });

  const prevUserProfile = await userProfileModel.findOne({ where: { userId } });
  prevUserProfile.set(data);
  const updatedUserProfile = await prevUserProfile.save({ data });

  res.status(200).json(updatedUserProfile);
};

// for demo, delete user

module.exports = { userRegister, userLogin, updateUserProfile };
