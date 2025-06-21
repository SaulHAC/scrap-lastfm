const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/scrape", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Falta el parámetro 'url'" });
  }

  try {
    const { data } = await axios.get(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);

    const youtubeUrl = $("a.js-playlink").attr("href") || null;

    const coverArtSrc = $("span.cover-art img").attr("src") || null;

    if (!youtubeUrl && !coverArtSrc) {
      return res
        .status(404)
        .json({ error: "No se encontró YouTube ni cover art" });
    }

    res.json({ youtubeUrl, coverArtSrc });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al scrapear", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
