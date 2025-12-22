// fix-urls.js - Place in your project root (same as vite.config.js)
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting to fix localhost:4000 references...');

// Files that have already been updated with the new pattern
const alreadyUpdatedFiles = ['Book.jsx', 'Readbook.jsx'];

function replaceInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const oldContent = content;
        
        // Check if file already uses the new API_URL pattern
        const hasAPI_URL = content.includes('API_URL') || content.includes('isProduction');
        const fileName = path.basename(filePath);
        
        if (hasAPI_URL && alreadyUpdatedFiles.includes(fileName)) {
            console.log(`⏭️  Skipping ${fileName} - already updated`);
            return false;
        }
        
        // Replace patterns
        let changes = 0;
        
        // Pattern 1: Direct localhost:4000 URLs
        const directURLRegex = /http:\/\/localhost:4000/g;
        if (directURLRegex.test(content)) {
            content = content.replace(directURLRegex, '${API_URL}');
            changes++;
            console.log(`✅ Replaced direct URLs in ${fileName}`);
        }
        
        // Pattern 2: fetch('http://localhost:4000/...')
        const fetchRegex = /fetch\(['"`]http:\/\/localhost:4000\/([^'"`]+)['"`]\)/g;
        const fetchMatches = [...content.matchAll(fetchRegex)];
        if (fetchMatches.length > 0) {
            content = content.replace(fetchRegex, 'fetch(`${API_URL}/$1`)');
            changes += fetchMatches.length;
            console.log(`✅ Fixed ${fetchMatches.length} fetch calls in ${fileName}`);
        }
        
        // Pattern 3: 'http://localhost:4000/' as string
        const stringRegex = /['"`]http:\/\/localhost:4000\/([^'"`]*)['"`]/g;
        const stringMatches = [...content.matchAll(stringRegex)];
        if (stringMatches.length > 0) {
            content = content.replace(stringRegex, '`${API_URL}/$1`');
            changes += stringMatches.length;
            console.log(`✅ Fixed ${stringMatches.length} string URLs in ${fileName}`);
        }
        
        // Add API_URL declaration if not present
        if (changes > 0 && !content.includes('const API_URL') && !content.includes('API_URL =')) {
            const isProductionLine = `const isProduction = window.location.hostname.includes('github.io');`;
            const apiUrlLine = `const API_URL = isProduction ? 'https://book-api.onrender.com' : 'http://localhost:10000';`;
            
            // Insert after the last import but before component
            const importEnd = content.lastIndexOf("import");
            const fromIndex = content.indexOf("from", importEnd);
            const importEndLine = content.indexOf("\n", fromIndex) + 1;
            
            content = content.slice(0, importEndLine) + 
                     `\n${isProductionLine}\n${apiUrlLine}\n` + 
                     content.slice(importEndLine);
            
            console.log(`➕ Added API_URL declaration to ${fileName}`);
        }
        
        if (changes > 0) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`🎉 Updated ${fileName} with ${changes} changes`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function processFolder(folder) {
    let fixedCount = 0;
    
    try {
        const files = fs.readdirSync(folder, { withFileTypes: true });
        
        for (const file of files) {
            const fullPath = path.join(folder, file.name);
            
            if (file.isDirectory()) {
                // Skip node_modules and dist
                if (file.name !== 'node_modules' && file.name !== 'dist') {
                    fixedCount += processFolder(fullPath);
                }
            } else if (file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
                if (replaceInFile(fullPath)) {
                    fixedCount++;
                }
            }
        }
    } catch (error) {
        console.error(`❌ Error reading folder ${folder}:`, error.message);
    }
    
    return fixedCount;
}

// Start from src folder
const srcPath = path.join(__dirname, 'src');
if (fs.existsSync(srcPath)) {
    const fixed = processFolder(srcPath);
    console.log(`\n📊 Summary: Fixed ${fixed} files`);
    
    if (fixed === 0) {
        console.log('✅ No localhost:4000 references found!');
    }
} else {
    console.log('❌ src folder not found! Make sure you run this from project root.');
}

console.log('\n📝 Next steps:');
console.log('1. Check your components still work');
console.log('2. Run: npm run build');
console.log('3. Test locally');