# Import ZyeuteV5 code

GitHub Actions workflow: `.github/workflows/import-zyeute.yml`

Run it from the Actions tab (Import ZyeuteV5 frontend and backend → Run workflow).

Or locally:

```bash
git clone https://github.com/brandonlacoste9-tech/MexicanV5.git
cd MexicanV5
git remote add zyeute https://github.com/brandonlacoste9-tech/ZyeuteV5.git
git fetch zyeute --depth 1
git checkout zyeute/main -- frontend backend
git commit -m "Copy frontend/ and backend/ from ZyeuteV5"
git push
```
