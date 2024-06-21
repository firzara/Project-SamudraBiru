const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generateToken, verifyToken } = require("../../../helper/jwt");

// Utility function to validate the presence of required fields
function validateFields(fields, res) {
  for (const field of fields) {
    if (!field.value) {
      res.status(400).json({
        message: `${field.name} is required`,
      });
      return false;
    }
  }
  return true;
}

async function register(req, res) {
  const { name, email, password } = req.body;

  // Validate fields
  if (!validateFields([
    { name: 'name', value: name },
    { name: 'email', value: email },
    { name: 'password', value: password }
  ], res)) return;

  const emailLowerCase = email.toLowerCase();
  const isEmailExist = await prisma.user.findUnique({
    where: {
      email: emailLowerCase,
    },
  });

  if (isEmailExist) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email: emailLowerCase,
      password,
    },
  });

  res.status(200).json({
    message: "User created successfully",
    data: user,
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  console.log(email, password);
  if (!validateFields([
    { name: 'email', value: email },
    { name: 'password', value: password }
  ], res)) return;

  const emailLowerCase = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email: emailLowerCase,
    },
  });

  if (!user || user.password !== password) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  res.status(200).json({
    message: "User logged in successfully",
    data: token,
  });
}

async function Verify(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      message: "Token is required",
    });
  }

  const decoded = verifyToken(token);
  res.status(200).json(decoded);
}

async function getUser(req, res) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (user) {
        res.status(200).json({
          message: "User fetched successfully",
          data: user,
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(403).json({
        message: "Invalid token",
      });
    }
  } else {
    res.status(401).json({
      message: "No token provided",
    });
  }
}

async function updateUser(req, res) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    return res.status(403).json({
      message: "Invalid token",
    });
  }

  const userId = decoded.id;
  const { name, email, password, phone, gender } = req.body;

  if (!validateFields([
    { name: 'name', value: name },
    { name: 'email', value: email },
    { name: 'password', value: password },
  ], res)) return;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      email,
      password,
      phone,
      gender,
    },
  });

  res.status(200).json({
    message: "User updated successfully",
    data: user,
  });
}

module.exports = {
  register,
  login,
  Verify,
  getUser,
  updateUser,
};
