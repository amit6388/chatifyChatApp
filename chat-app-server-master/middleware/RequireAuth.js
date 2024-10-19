const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const secretKey = process.env.JWT_SECRET;
const RequireAuth = {
  userAuth: async (req, res, next) => {
    try {
      // get headers
      const auth = req.headers["authorization"];
      if (!auth) {
          return res
          .status(401)
          .json({ code: "401", status: false, message: "Invalid User!" });
        }
        
        // split the data and get token
        const token = auth.split(" ")[1];
        
        // verfiy or decode the token
        const decode = jwt.verify(token, secretKey);

      // find the user decoded token
      const user = await UserModel.findOne({ _id: decode.id });

      if (!user) {
        return res
          .status(401)
          .json({ code: "401", status: false, message: "Invalid User!" });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({
        code: "500",
        message: "Internal Server Error",
        status: false,
        data: [],
        error: error,
      });
    }
  },
};

module.exports = RequireAuth;
