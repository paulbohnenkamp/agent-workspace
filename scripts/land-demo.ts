import 'dotenv/config';

import { resetLandDemo, seedLandDemo } from '../lib/land-workspace';

const operation = process.argv[2];

if (operation === 'seed') {
  await seedLandDemo();
} else if (operation === 'reset') {
  await resetLandDemo();
} else {
  throw new Error('Usage: tsx scripts/land-demo.ts <seed|reset>');
}

console.log(`Land demo ${operation} complete.`);
