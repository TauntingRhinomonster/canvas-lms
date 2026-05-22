---
name: Canvas Docker Setup
description: Run these commands in order to get Canvas LMS running on localhost. No explanation — execute each block, verify the signal, move to the next.
---

# INSTRUCTION

Run every block below in the terminal, in order. Stop only if a signal says FAIL. Canvas is ready when Step 5 returns HTTP 200.

---

## Step 1 — Add user to docker group (run once per machine)

```bash
sudo usermod -aG docker ubuntu
```

Signal: no output = success.

---

## Step 2 — Activate docker group in current shell

```bash
newgrp docker
```

Signal: prompt returns immediately. If `newgrp` exits the shell, open a new terminal and continue from Step 3.

---

## Step 3 — Start the Canvas stack

```bash
cd ~/canvas-lms && docker compose up -d
```

Signal: all six services print `Started` or `Running` — no `Error` lines.

```
canvas-lms-postgres-1   Started
canvas-lms-redis-1      Started
canvas-lms-web-1        Started
canvas-lms-jobs-1       Started
canvas-lms-webpack-1    Started
canvas-lms-githook_installer-1  Started
```

---

## Step 4 — Confirm all containers are Up

```bash
docker compose ps
```

Signal: every row under STATUS reads `Up`. If any row reads `Exit`, run:

```bash
docker compose logs <service-name> --tail 40
```

---

## Step 5 — Confirm Canvas is serving

```bash
curl -sI http://127.0.0.1:3000/login/canvas | head -5
```

Signal: first line reads `HTTP/1.1 200 OK`. Canvas is live.

Open **http://localhost:3000** in a browser to view Canvas.

---

## Stop the stack

```bash
cd ~/canvas-lms && docker compose down
```

---

## If Step 3 fails with "permission denied" on docker.sock

```bash
sudo usermod -aG docker ubuntu
newgrp docker
cd ~/canvas-lms && docker compose up -d
```

---

## If Step 5 returns nothing or connection refused — wait and retry

```bash
sleep 15 && curl -sI http://127.0.0.1:3000/login/canvas | head -5
```

If still failing, check web logs:

```bash
docker compose logs web --tail 50
```
