const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const { sql, poolPromise } = require("./db");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = 3000;
const SECRET = "CLAVE_SUPER_SECRETA";

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------- REGISTER --------
app.post("/api/register", async (req, res) => {
  try {
    console.log("📥 BODY REGISTER:", req.body); // ✅ LOG 1: lo que llega

    const { name, age, sex, email, password } = req.body;

    if (!name || !age || !sex || !email || !password) {
      return res.status(400).json({ msg: "Faltan campos" });
    }

    const hash = await bcrypt.hash(password, 10);
    const pool = await poolPromise;

    await pool.request()
      .input("name", sql.NVarChar, name)
      .input("age", sql.Int, age)
      .input("sex", sql.NVarChar, sex)
      .input("email", sql.NVarChar, email)
      .input("password_hash", sql.NVarChar, hash)
      .query(`
        INSERT INTO dbo.users (name, age, sex, email, password_hash)
        VALUES (@name, @age, @sex, @email, @password_hash)
      `);

    res.json({ msg: "Usuario registrado ✅" });

  } catch (err) {
    console.log("❌ ERROR REGISTER:", err); // ✅ LOG 2: error real

    if (err.number === 2627) {
      return res.status(409).json({ msg: "Email ya registrado" });
    }

    res.status(500).json({ msg: "Error servidor", err });
  }
});


// -------- LOGIN --------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await poolPromise;

    const result = await pool.request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM dbo.users WHERE email=@email");

    if (result.recordset.length === 0) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    const user = result.recordset[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ msg: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        age: user.age,
        sex: user.sex,
        email: user.email,
        photo_url: user.photo_url
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Error servidor", err });
  }
});

// -------- PROFILE --------
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    console.log("📥 PROFILE for user id:", req.user.id);

    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, req.user.id)
      .query(`
        SELECT id, name, age, sex, email, photo_url
        FROM dbo.users
        WHERE id=@id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: "No existe usuario" });
    }

    res.json(result.recordset[0]);

  } catch (err) {
    console.log("❌ ERROR PROFILE:", err);   // ✅ error real
    res.status(500).json({ msg: "Error servidor", err });
  }
});


// -------- UPLOAD PHOTO (base64) --------
app.post("/api/profile/photo", authMiddleware, async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ msg: "No imagen" });

    const base64Data = imageBase64.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `user_${req.user.id}.jpg`;
    const filePath = path.join(__dirname, "uploads", fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `http://localhost:${PORT}/uploads/${fileName}`;

    const pool = await poolPromise;
    await pool.request()
      .input("photo_url", sql.NVarChar, publicUrl)
      .input("id", sql.Int, req.user.id)
      .query("UPDATE dbo.users SET photo_url=@photo_url WHERE id=@id");

    res.json({ photoUrl: publicUrl });
  } catch (err) {
    res.status(500).json({ msg: "Error servidor", err });
  }
});

app.listen(PORT, () => console.log("🚀 Backend listo en puerto", PORT));
