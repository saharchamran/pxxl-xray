# Pxxl Xray node (VLESS + WS + TLS)

Deploy target: Pxxl App Free plan, GitHub-repo deploy, language must be Node
(no Dockerfile on Free — paid-locked).

## Files
- `package.json` — start: `node server.js`, build: `node setup.js`
- `setup.js` — downloads official Xray-core v25.10.15 (Xray-linux-64.zip) at build time
- `server.js` — writes config from env and runs Xray: VLESS + WS (plain, inside container) on $PORT; TLS is terminated by the Pxxl edge

## Pxxl project env vars
- `UUID` = `8904ce6d-2ec2-4c9f-a1f2-9d6d210b9143`
- `WSPATH` = `/0c200e1a2505d84d`

## Client link template (fill in the deployed host)
`vless://8904ce6d-2ec2-4c9f-a1f2-9d6d210b9143@<HOST>:443?encryption=none&security=tls&sni=<HOST>&type=ws&host=<HOST>&path=%2F0c200e1a2505d84d#pxxl-xray`

Note: Pxxl Free exit IP is from the platform's free pool (AWS datacenter) and
can change; treat this node as a spare.
