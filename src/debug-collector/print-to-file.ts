import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../../../bin/debug.html');
const dirPath = path.dirname(filePath);

const cssFilePath = path.resolve(__dirname, '../../assets/debug.css');
const cssDestinationPath = path.resolve(__dirname, '../../../bin/debug.css');
const jsFilePath = path.resolve(__dirname, '../../assets/debug.js');
const jsDestinationPath = path.resolve(__dirname, '../../../bin/debug.js');

export const printToFile = (html: string) => {
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, html, 'utf8');
    
    fs.copyFileSync(cssFilePath, cssDestinationPath);
    fs.copyFileSync(jsFilePath, jsDestinationPath);
}