import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const DEBUG_ASSETS_RELATIVE_PATH = '../debug-assets/';
const DEBUG_BIN_RELATIVE_PATH = '../../bin/';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, `${DEBUG_BIN_RELATIVE_PATH}debug.html`);
const dirPath = path.dirname(filePath);

const cssFilePath = path.resolve(__dirname, `${DEBUG_ASSETS_RELATIVE_PATH}debug.css`);
const cssDestinationPath = path.resolve(__dirname, `${DEBUG_BIN_RELATIVE_PATH}debug.css`);
const jsFilePath = path.resolve(__dirname, `${DEBUG_ASSETS_RELATIVE_PATH}debug.js`);
const jsDestinationPath = path.resolve(__dirname, `${DEBUG_BIN_RELATIVE_PATH}debug.js`);

export const printToFile = (html: string) => {
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, html, 'utf8');

    fs.copyFileSync(cssFilePath, cssDestinationPath);
    fs.copyFileSync(jsFilePath, jsDestinationPath);
}