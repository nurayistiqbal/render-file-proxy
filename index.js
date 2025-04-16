const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/", async (req, res) => {
  const fileUrl = req.query.url;
  const fileName = req.query.name || "downloaded_file";

  if (!fileUrl) {
    return res.status(400).send("Missing 'url' parameter");
  }

  try {
    const fileResponse = await fetch(fileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": fileUrl
      },
      redirect: "follow"
    });

    if (!fileResponse.ok) {
      return res.status(fileResponse.status).send(`Failed to fetch file. Status: ${fileResponse.status}`);
    }

    res.setHeader("Content-Type", fileResponse.headers.get("content-type") || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Cache-Control", "no-cache");

    fileResponse.body.pipe(res);
  } catch (err) {
    res.status(500).send("Error streaming file: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
