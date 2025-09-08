import * as fs from 'fs';
import * as path from 'path';

export function loadJsonData<T>(fileName: string): T[] {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  console.log('Loading JSON from:', filePath);
  if (!fs.existsSync(filePath))
    throw new Error(`JSON file not found: ${filePath}`);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData) as T[];
}
