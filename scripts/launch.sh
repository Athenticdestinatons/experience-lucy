#!/data/data/com.termux/files/usr/bin/bash
cd ~/experience_lucy/backend
source ~/experience_lucy/.env
nohup node server.js > ../lucy.log 2>&1 &
echo $! > ../lucy.pid
echo "✅ Lucy Omega started (PID $(cat ../lucy.pid))"
