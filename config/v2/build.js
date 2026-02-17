const fs = require('fs');
const path = require('path');

const CONFIG_DIR = __dirname;
const PUBLISH_DIR1 = path.resolve(__dirname, '../../client/public');
const PUBLISH_DIR2 = path.resolve(__dirname, '../../client-v2/public');

// delete old files
for (const publishPath of [PUBLISH_DIR1, PUBLISH_DIR2]) {
    const existPaths = fs.readdirSync(publishPath).filter(file => fs.statSync(publishPath + "/" + file).isDirectory());

    for (const existPath of existPaths) {
        const d = `${publishPath}/${existPath}`;
        const f = `${publishPath}/${existPath}.json`;

        if (fs.existsSync(d)) {
            console.log("DELETE", d)
            fs.rmSync(d, { recursive: true });
        }

        if (fs.existsSync(f)) {
            console.log("DELETE", f);
            fs.unlinkSync(f);
        }
    }
}

// copy file into client
for (const configPath of [CONFIG_DIR]) {
    const existPaths = fs.readdirSync(configPath).filter(file => fs.statSync(configPath + "/" + file).isDirectory());

    for (const existPath of existPaths) {
        const j = `${configPath}/${existPath}/config.json`;
        const i1 = `${configPath}/${existPath}/map.png`;
        const i2 = `${configPath}/${existPath}/not_uploaded.png`;

        if (!fs.existsSync(j)) {
            throw new Error(`file not exist: ${j} in ${existPath}`);
        }

        if (!fs.existsSync(i1)) {
            throw new Error(`file not exist: ${i1} in ${existPath}`);
        }

        for (const publishPath of [PUBLISH_DIR1, PUBLISH_DIR2]) {
            fs.mkdirSync(`${publishPath}/${existPath}`);

            const copyFiles = [
                { from: j, to: `${publishPath}/${existPath}.json` },
                { from: i1, to: `${publishPath}/${existPath}/map.png` },
                { from: i2, to: `${publishPath}/${existPath}/not_uploaded.png` },
            ];

            for (const c of copyFiles) {
                if (fs.existsSync(c.from)) {
                    fs.copyFileSync(c.from, c.to);
                    const s = fs.statSync(c.from);
                    console.log("COPY", c.from, c.to, s.size);
                }
            }
        }
    }
}