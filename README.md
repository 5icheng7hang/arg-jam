# ARG Jam

## Map configuration

The `LOCATE_MAP` panel uses AMap (Gaode) in the browser and requires Vite client environment variables.

Create a local `.env` file with:

```bash
VITE_AMAP_API_KEY=your_amap_web_key
VITE_AMAP_SECURITY_CODE=your_amap_security_code
```

For Vercel, add the same two variables in the project environment settings and redeploy.

Notes:

- Keep the real key and security code out of source control.
- The current implementation only places precise markers for mainland China puzzle coordinates.
- Puzzles with unknown or out-of-scope coordinates show a fallback state instead of a broken map.

## Validation

Run:

```bash
npm run check
```

Then open `LOCATE_MAP` on page 1 and page 2 to verify the square map and marker rendering.