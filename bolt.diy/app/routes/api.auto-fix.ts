import { json } from '@remix-run/node';
import { exec } from 'child_process';
import path from 'path';

export async function action({ request }) {
  const { bug } = await request.json();
  const rootDir = process.cwd();
  const scriptPath = path.join(rootDir, '..', 'fix-bug.ps1');

  // Trigger the background fix script
  exec(`powershell -ExecutionPolicy Bypass -File "${scriptPath}" -BugReport "${bug}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Auto-Fix Error: ${error.message}`);
      return;
    }
    console.log(`Auto-Fix Logs:\n${stdout}`);
    if (stderr) console.error(`Auto-Fix Stderr:\n${stderr}`);
  });

  return json({ success: true, message: 'Auto-fixing agent triggered.' });
}
