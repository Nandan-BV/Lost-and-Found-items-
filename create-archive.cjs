const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    // Skip node_modules, .git, and other unnecessary directories
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.next') {
      return;
    }

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function createProjectStructure() {
  const files = getAllFiles('.');
  const projectStructure = {
    files: {},
    structure: []
  };

  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      projectStructure.files[filePath] = content;
      projectStructure.structure.push(filePath);
    } catch (error) {
      // Skip binary files or files that can't be read as text
      console.log(`Skipping ${filePath}: ${error.message}`);
    }
  });

  return projectStructure;
}

// Create the project structure
const projectData = createProjectStructure();

// Write to a JSON file that can be easily downloaded
fs.writeFileSync('reunite-project-export.json', JSON.stringify(projectData, null, 2));

console.log('Project exported to reunite-project-export.json');
console.log(`Total files: ${projectData.structure.length}`);
console.log('\nProject structure:');
projectData.structure.forEach(file => console.log(`  ${file}`));