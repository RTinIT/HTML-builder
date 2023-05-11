const fs = require('fs/promises');
const path = require('path');
const { join } = require('path');
const template = path.join(__dirname, './template.html');
const styles = path.join(__dirname, './styles');
const stylesCopy = path.join(__dirname, './project-dist', './style.css');
const components = path.join(__dirname, './components');
const projectDist = path.join(__dirname, './project-dist');
const assetsCopy = path.join(__dirname, './project-dist/assets');

const getContent = async (file) => {
  const content = await fs.readFile(file);
  return content.toString();
};

const getFiles = async (folder) => {
  const files = [];

  const read = async (folder) => {
    const data = await fs.readdir(folder, {withFileTypes: true});
    for (const item of data) {
      if (item.isFile()) {
        files.push(item)
      } else {
        await read(path.join(folder, item.name));
      }
    }
  }

  await read(folder);
  return files;
}; 

const checkExt = async (folder, ext) => {
  const files = await fs.readdir(folder, {withFileTypes: true});
  return files.filter((e) => path.extname(e.name) === ext);
};

const createDir = async (firstPath, secondPath) => {
  fs.mkdir(firstPath, { recursive: true });
  fs.mkdir(secondPath, { recursive: true });
};

createDir(projectDist, assetsCopy);
getFiles(path.join(__dirname, 'assets'));

const copyDir = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true });

  for (const file of await getFiles(dest)) {
    fs.unlink(path.join(dest, file.name));
  }

  for (const file of await getFiles(src)) {
    fs.copyFile(path.join(src, file.name),
      path.join(dest, file.name));
  }
};

copyDir(path.join(__dirname, './assets/fonts/'), path.join(assetsCopy,'./fonts'));
copyDir(path.join(__dirname, './assets/img/'), path.join(assetsCopy, './img'));
copyDir(path.join(__dirname, './assets/svg/'), path.join(assetsCopy, './svg'));

const createStyleFile = async (src, dest) => {
  fs.writeFile(dest, '');
  for (const file of await checkExt(src, '.css')) {
    const data = await getContent(join(src, file.name));
    fs.appendFile(dest, data);
  }
};

createStyleFile(styles, stylesCopy);

const createIndexFile = async (temp, comp) => {
  await fs.copyFile(temp, path.join(projectDist, './index.html'));
  const index = path.join(projectDist, './index.html');
  let indexCont = await getContent(index);
  for (const file of await comp) {
    indexCont = indexCont.replace(`{{${path.parse(file.name).name}}}`,
      await getContent(join(components, file.name)));
  }
  fs.writeFile(path.join(projectDist, './index.html'), indexCont);
};

createIndexFile(template, checkExt(components, '.html'));