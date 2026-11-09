// Xray (VLESS + WebSocket) behind a small Node wrapper for Pxxl Free.
// TLS is terminated by the Pxxl platform edge; inside the container Xray
// listens in plain WS on the platform-provided $PORT.
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const uuid = process.env.UUID;
const wsPath = process.env.WSPATH || '/ws';
const port = parseInt(process.env.PORT || '8080', 10);

if (!uuid) {
  console.error('UUID env var is required');
  process.exit(1);
}

const bin = path.join(__dirname, 'xray');
if (!fs.existsSync(bin)) {
  try {
    execSync('node setup.js', { stdio: 'inherit', cwd: __dirname });
  } catch (e) {
    process.exit(1);
  }
}

const config = {
  log: { loglevel: 'warning' },
  inbounds: [
    {
      listen: '0.0.0.0',
      port: port,
      protocol: 'vless',
      settings: { clients: [{ id: uuid }], decryption: 'none' },
      streamSettings: { network: 'ws', wsSettings: { path: wsPath } },
      sniffing: { enabled: true, destOverride: ['http', 'tls', 'quic'] },
    },
  ],
  outbounds: [{ protocol: 'freedom', tag: 'direct' }],
};

const cfgPath = path.join(__dirname, 'config.json');
fs.writeFileSync(cfgPath, JSON.stringify(config));

const child = spawn(bin, ['run', '-c', cfgPath], { stdio: 'inherit', cwd: __dirname });
child.on('exit', (code) => process.exit(code || 0));
process.on('SIGTERM', () => child.kill('SIGTERM'));
