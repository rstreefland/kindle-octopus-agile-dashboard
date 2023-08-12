const puppeteer = require("puppeteer");
const functions = require('@google-cloud/functions-framework');
const Jimp = require("jimp");

functions.http('renderDashboard', async(req, res) => {
    const token = process.env.TOKEN;

    if (!token) {
        return res.status(500).send("Missing required TOKEN environment variable")
    }

    if (req.query.token !== token) {
        res.sendStatus(401);
        return;
    }

    const batteryPercentage = req.query.batteryPercentage;

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"],
        });

        const page = await browser.newPage();
        await page.emulateTimezone('Europe/London');
        const url = `file://${__dirname}/index.html?octopusApiKey=${octopusApiKey}&batteryPercentage=${batteryPercentage}`;

        await page.setViewport({ width: 800, height: 600, isLandscape: true });
        await page.goto(url, { waitUntil: "networkidle0" });
        const image = await page.screenshot({ type: "png" });

        const j = await Jimp.read(image);
        await j.colorType(0);
        await j.rotate(-90);
        const png = await j.getBufferAsync(Jimp.MIME_PNG);

        await browser.close();

        res.set('Content-Type', 'image/png');
        res.send(png);
    } catch (err) {
        res.status(500).send(err.message);
    }
});