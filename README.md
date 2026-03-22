# ARG Jam

## Game content

The game content is now driven by [game-content.yaml](/Users/sichnegjacques/_Projects/arg-jam/game-content.yaml).

Edit that file to change:

- page count and page order
- page image file names
- briefing markdown
- input/dropdown questions
- correct answers
- map metadata

Rules:

- Put page images in `src/assets/`
- Reference the image by filename only, for example `3.png`
- Use `briefing: |` for multi-line markdown text
- For dropdown controls, `options` must be a YAML list

Example:

```yaml
pages:
	- id: page-1
		image: 1.png
		meta:
			longitude: 121.4737°E
			latitude: 31.2304°N
			captureTime: 公元2084纪年
			mission: 区域扫描 Alpha-7
		controls:
			- type: input
				label: What is hidden here?
				answer: mango
			- type: dropdown
				label: Pick the color
				options:
					- crimson
					- azure
					- olive
					- ivory
				answer: azure
		briefing: |
			# 任务简报 #01

			这里写 briefing markdown。
```

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