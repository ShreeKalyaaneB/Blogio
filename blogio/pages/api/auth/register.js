import bcrypt from "bcryptjs";
import connectDB from "@/utils/connectDB";
import Users from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userName, password, email } = req.body;

    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required fields" });
    }

    await connectDB();

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(422).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Users({ userName, email, password: hashedPassword });

    await newUser.save();

    return res.status(201).json({ message: "User created" });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
