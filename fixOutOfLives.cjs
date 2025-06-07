import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = path.join(__dirname, 'past-playground-main', 'src', 'pages', 'Lesson.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to match the entire if (outOfLives) { ... } block (including nested braces)
const outOfLivesRegex = /if\\s*\\(\\s*outOfLives\\s*\\)\\s*\\{[\\s\\S]*?\\n\\s*\\}/g;

// Find all matches
const matches = [...content.matchAll(outOfLivesRegex)];

// If there are any, keep only the first, remove the rest
if (matches.length > 0) {
  let first = matches[0][0];
  // Remove all
  content = content.replace(outOfLivesRegex, '');
  // Insert the first one after the start of the LessonPage function
  content = content.replace(
    /(const LessonPage\\s*=\\s*\\(\\)\\s*=>\\s*\\{)/,
    `$1\\n${first}\\n`
  );
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Duplicate outOfLives blocks removed!');
} else {
  console.log('No outOfLives blocks found!');
}