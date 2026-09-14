import pool from "../db/db_pool.js";
import * as fs from "fs/promises";

export async function clean_up(storage_path) {
  try {
    const { rows } = await pool.query("SELECT image_path FROM games");
    let images = [...rows];
    images = images.map((i) => i.image_path);
    images = images.filter((i) => i !== null);
    images = images.map((i) => i.split("/")[3]);

    let filenames = await fs.readdir(storage_path);

    filenames = filenames.filter(
      (item) => !images.includes(item) && !item.includes("."),
    );

    for (let filename of filenames) {
      console.log("deleting ", filename);
      await fs.unlink(`${storage_path}${filename}`);
      console.log(filename, "is deleted");
    }
  } catch (err) {
    throw err;
  }
}
