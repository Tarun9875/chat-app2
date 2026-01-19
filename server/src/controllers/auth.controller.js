import * as AuthService from "../services/auth.service.js";

export async function register(req, res) {
  try {
   // console.log("REGISTER BODY:", req.body);

    const { token, user } = await AuthService.registerUser(req.body);

    res.status(201).json({
      token,
      user,
    });
  } catch (error) {
   // console.error("REGISTER ERROR FULL:", error); // ✅ FIXED
    res.status(409).json({
      message: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { token, user } = await AuthService.loginUser(req.body);

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error); // ✅ optional log
    res.status(400).json({
      message: error.message,
    });
  }
}
