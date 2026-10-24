# 1brah1.github.io

Source for my academic homepage: **https://1brah1.github.io/**

Muhammad Ibrahim Khalid, final-year Electronic Engineering at HKUST. I work on efficient ML systems: LLM inference memory, edge AI on NVIDIA Jetson, and generating rare, safety-critical events.

## Structure

```
index.html              homepage: bio, news, research, projects, experience
jetson/index.html       project page for the Jetson VQA work
assets/css/site.css     light and dark themes
assets/js/diagrams.js   the small SVG figures, drawn from code so they follow the theme
assets/js/main.js       theme toggle
assets/                 CV (PDF) and an audio sample
```

Plain HTML and CSS with no build step; GitHub Pages serves the `main` branch directly.

## Run locally

```bash
python -m http.server 8000
```
