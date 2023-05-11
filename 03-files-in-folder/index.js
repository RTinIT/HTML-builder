const path = require('path');
const fs = require('fs');

const folder = path.join(__dirname, 'secret-folder');

fs.readdir(folder, {withFileTypes: true},
  (error, files) => {

    if (error) throw error;

    for (const file of files) {
      if (file.isFile()) {
        const { name } = path.parse(file.name);
        const ext = path.extname(file.name);

        fs.stat(`${folder}/${file.name}`, (error, stats) => {
          if (error) throw error;
          console.table(`${name} - ${ext} - ${stats.size} byte`);
        });
      }
    }
  });

