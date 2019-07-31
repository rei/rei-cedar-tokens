const { exec } = require('child_process');
const ghpages = require('gh-pages');

exec('cd docs && npm install && npm run build', (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }

  if (process.env.NODE_ENV === 'prerelease') return;

  console.log(`Docs files generated`);

  ghpages.publish('docs/dist', (err) => {
    if (err) {
      console.error(`deploy error: ${err}`);
      return;
    }
  
    console.log(`Docs deployed to gh-pages branch`);
  });

});

