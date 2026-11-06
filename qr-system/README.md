# QR Pass

Static QR generator + in-app scanner (HTML/CSS/JS). Works on GitHub Pages.

## Deploy
1. Open `assets/crypto.js` and change `SECRET` to your own long phrase (do this BEFORE making codes).
2. Push this folder to a GitHub repo.
3. Repo Settings > Pages > deploy from branch (root).
4. Open `https://<user>.github.io/<repo>/` to generate, `/scan.html` to scan.

## Notes
- The QR holds an AES-GCM encrypted payload, so normal camera apps see gibberish.
- Camera needs https (GitHub Pages is https) or localhost.
- Screenshots/photos of a code cannot be blocked in a static site.
