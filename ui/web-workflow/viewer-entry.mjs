import { bootstrap } from './bootstrap.mjs';
import './viewer.mjs';
await bootstrap('viewer');
await import('@taskprogress/app.js');
