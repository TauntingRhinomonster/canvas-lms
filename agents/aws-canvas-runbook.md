# AWS + Canvas runbook

Short record of bringing up an **AWS-backed Linux dev host** (Learner Lab style EC2) with the **Canvas LMS** source tree present, SSH reachable, and host-level tooling installed. This host shows an **AWS-tuned kernel** and a **GitHub fork** of Canvas with an **`upstream` remote** to the public Instructure repository.

**Security:** This document intentionally omits AWS access keys, `.pem` private key material, session tokens, instance hostnames, and public IP addresses. Use your lab’s console and key-handling rules only outside this file.

# AI prompts used (summary)

- Asked the coding agent to **author agent memory practice** documentation using the **“explicit re-grounding triggers after merges or upstream pulls”** technique, saved under `agents/memory-practice.md`, including placeholders for evidence and anti-staleness rules.
- Asked the coding agent to **produce this runbook** at `agents/aws-canvas-runbook.md`, using a fixed section template, **no secrets**, and explicit **out-of-scope** language for product feature work (next lab).

# Learner Lab + EC2 checklist

- Start the **AWS Learner Lab** session and open the **AWS console** only through the lab’s approved flow (do not paste account credentials into chats or this repo).
- Launch or use the lab **EC2 instance** sized for Canvas-style workloads (plan for **RAM pressure**; see swap step below).
- Attach or select a **key pair** for SSH; keep the **`.pem` on your machine only**—never commit it or paste it into prompts, tickets, or this runbook.
- In the instance **security group**, allow **SSH (TCP 22)** from your current source (lab VPN / bastion / instructor-prescribed CIDR only). Do not document specific CIDRs or IPs here.
- **SSH in** using your lab’s method, e.g. `ssh -i /path/to/your-key.pem <user>@<instance>` (use the hostname or address the lab gives you; do not store that address in git).
- **Harden / stabilize SSH** as required by the lab (example actions reflected on this host: editing `/etc/ssh/sshd_config`, switching from `ssh.socket` to `ssh.service`, `sudo systemctl restart ssh`, confirming with `sudo systemctl status ssh`).
- **Add swap** if the instance is memory-tight (example sequence used on this host: `fallocate` / `chmod` / `mkswap` / `swapon` for a 2G swapfile—adjust size per lab policy).
- **Install baseline packages** used for editor/tooling workflows (example used on this host: `sudo apt update && sudo apt install nodejs npm -y`).
- **Install Docker Engine** and ensure the login user can talk to the daemon (e.g. `docker` group membership or documented `sudo` workflow). On this workspace, `docker --version` succeeds, but **`docker compose` without elevated permissions failed with Docker socket permission errors** until group membership or `sudo` is aligned—treat that as a normal follow-up checklist item.

# Canvas LMS: clone + doc path followed

**Clone (exact command from this environment’s shell history):**

```bash
git clone https://github.com/TauntingRhinomonster/canvas-lms
cd canvas-lms
```

**Remotes (verified on disk; no credentials in output):**

```bash
git remote -v
```

Expected pattern: **`origin`** points at your **fork**; **`upstream`** points at **`https://github.com/instructure/canvas-lms.git`** for pulling upstream changes later.

**Documentation paths consulted for “how Canvas expects dev to work”:**

- Repository root **`AGENTS.md`** (quick start: `docker compose up`, containerized `yarn` / Rails workflows).
- **`doc/docker/README.md`** and **`doc/docker/developing_with_docker.md`** (recommended **`./script/docker_dev_setup.sh`**, `docker compose` usage, config copy steps, database/asset tasks as applicable).
- Optional agent hygiene doc created in parallel: **`agents/memory-practice.md`** (re-grounding after merges/pulls).

# Verification commands and signals

**Commands that actually appear in this host’s captured shell history (safe to repeat; no secrets):**

```bash
git clone https://github.com/TauntingRhinomonster/canvas-lms
cd canvas-lms
sudo systemctl status ssh
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo apt update && sudo apt install nodejs npm -y
```

**Signals observed for those steps:**

- **`git clone` / `cd`:** New `canvas-lms/` directory exists; `git rev-parse --is-inside-work-tree` prints `true`.
- **`systemctl status ssh`:** `active (running)` (or equivalent) indicates the SSH daemon is up after configuration changes.
- **Swap:** `swapon --show` lists the new swap device after `swapon`.
- **`apt install nodejs npm`:** Packages install without fatal errors; `node --version` / `npm --version` return versions.

**Additional commands run while authoring this runbook (evidence gathering, not secrets):**

```bash
docker --version
git remote -v
cd /home/ubuntu/canvas-lms && docker compose ps
```

**Signals:**

- **`docker --version`:** Prints a Docker Engine version string (confirms the CLI is installed).
- **`git remote -v`:** Shows `origin` and `upstream` URLs without embedded tokens.
- **`docker compose ps`:** On this host it emitted a **Docker daemon socket permission denied** message unless the user is in the `docker` group or invokes Compose via `sudo` per lab policy—use that as a **gating signal** before claiming containers are healthy.

**Standard Canvas application checks (from Canvas Docker docs; run after Compose access works):**

```bash
cd /home/ubuntu/canvas-lms
docker compose ps
docker compose logs web --tail 50
```

**Signals that Canvas is serving (once networking matches your lab’s Docker setup):**

- `docker compose ps` shows **web** (and related) services in a **running / healthy** state.
- Application logs show Rails boot without fatal startup errors.
- An HTTP check to the URL your Compose stack exposes (often documented as **`http://canvas.docker/`** in Docker-oriented docs, or your lab’s port-forwarded URL) returns **2xx** for the root path or login page—**do not record raw IPs or internal DNS here.**

# Out of scope: feature implementation (next lab)

We **did not** implement Canvas product features, UI changes, or new coursework flows in the application code. This session was limited to **infrastructure and documentation**: EC2/SSH/swap/tooling alignment, **cloning and remotes** for Canvas LMS, and **agent/runbook documentation** (`agents/memory-practice.md`, this file). **Feature coding and lab-specific application work are explicitly deferred to the next lab.**
