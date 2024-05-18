"use server"

import {promises as fs} from "fs";
import path from "node:path";

export async function fileToBase64(file: string[]) {
    return await fs.readFile(path.join(path.resolve("."), ...file), {encoding: 'base64'});
}