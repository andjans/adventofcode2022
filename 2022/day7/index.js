import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";
import { getString } from "../../helpers/stringUtils.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const allSizes = (dir) => {
  const { size, files, ...folders } = dir;
  const sizes = [];
  sizes.push(
    size,
    ...Object.values(folders)
      .map((folder) => allSizes(folder))
      .flat()
  );
  return sizes;
};

const printFileSystem = (dir, level = 0) => {
  const { files, size, ...folders } = dir;
  Object.keys(folders).forEach((key) => {
    console.log(getString(level, "  ") + "- " + key + " (dir, size=" + folders[key].size + ")");
    printFileSystem(folders[key], level + 1);
  });
  files?.forEach((file) => {
    console.log(getString(level, "  ") + "- " + file[1] + " (file, size=" + file[0] + ")");
  });
};

const createFolder = (linesToParse) => {
  const folder = {};
  let sizeOfFolder = 0;
  while (true) {
    const element = linesToParse.shift();
    if (element.startsWith("$")) {
      // Command
      if (element.indexOf("$ cd ") !== -1) {
        const dirName = element.split(" ")[2];
        if (dirName === "..") {
          // Go back
          folder.size = sizeOfFolder;
          return folder;
        } else {
          // Go into dir
          folder[dirName] = createFolder(linesToParse);
          sizeOfFolder += folder[dirName].size;
        }
      }
    } else if (!element.startsWith("dir ")) {
      // File
      const file = element.split(" ");
      folder.files = [...(folder.files || []), file];
      sizeOfFolder += Number(file[0]);
    }

    if (linesToParse.length === 0) {
      folder.size = sizeOfFolder;
      return folder;
    }
  }
};

const task1 = () => {
  const root = createFolder([...lines]);
  //printFileSystem(root);
  console.log(
    allSizes(root)
      .filter((size) => size <= 100000)
      .sum()
  );
};

const task2 = () => {
  const root = createFolder([...lines]);
  const freeSize = 70000000 - root["/"].size;
  const neededToFree = 30000000 - freeSize;
  const sizes = allSizes(root);
  console.log(sizes.filter((size) => size > neededToFree).min());
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
