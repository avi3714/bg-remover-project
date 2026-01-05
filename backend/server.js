const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { removeBackground } = require("@imgly/background-removal-node");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    const inputPath = req.file.path;

    const blob = await removeBackground(inputPath);

    // Blob → ArrayBuffer → Buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);

    fs.unlinkSync(inputPath); // cleanup
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Background removal failed" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
