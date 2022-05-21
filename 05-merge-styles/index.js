const fs = require('fs/promises');
const { join } = require('path');
const path = require('path');
const src = path.join(__dirname, './styles');
const bundle = path.join(__dirname, './project-dist', 'bundle.css');

const checkFile = async (file) => {
  const content = await fs.readFile(file);
  return content;
}; 

const checkExt = async (folder) => {
  const files = await fs.readdir(folder, {withFileTypes: true});
  return files.filter((e) => path.extname(e.name) === '.css');
};


const createBundle = async (src, dest) => {
  fs.writeFile(dest, '');

  for (const file of await checkExt(src)) {
    const data = await checkFile(join(src, file.name));
    fs.appendFile(dest, data);
  }
};

createBundle(src, bundle);