# bolt.diy_cloudflare

This repository combines:

- `bolt.diy`
- `openclaw`
- helper scripts for local startup (`start-unified.ps1`, `fix-bug.ps1`)

## Also host on GitHub

To host this repository on GitHub, create a new GitHub repository and push this branch.

```bash
git remote add origin git@github.com:<your-user>/<your-repo>.git
# or: git remote add origin https://github.com/<your-user>/<your-repo>.git

git push -u origin work
```

If `origin` already exists, update it instead:

```bash
git remote set-url origin git@github.com:<your-user>/<your-repo>.git
git push -u origin work
```

After pushing, enable any desired GitHub features (Issues, Actions, branch protection, etc.) in repository settings.
