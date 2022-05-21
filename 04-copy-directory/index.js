const fs = require('fs/promises');
const path = require('path');
const src = path.join(__dirname, './files');
const dest = path.join(__dirname, './files-copy');

const checkFolder = async (folder) => {
  const files = await fs.readdir(folder);
  return files;
}; 

const copyDir = async (src, dest) => {
  fs.mkdir(dest, { recursive: true });
  for (const file of await checkFolder(dest)) {
    fs.unlink(path.join(dest, file));
  }
  for (const file of await checkFolder(src)) {
    fs.copyFile(path.join(src, file),
      path.join(dest, file));
  }
};

copyDir(src, dest);
