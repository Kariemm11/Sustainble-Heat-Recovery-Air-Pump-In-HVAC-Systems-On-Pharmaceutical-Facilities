# Sustainable Heat Recovery Air Pump in HVAC Systems on Pharmaceutical Facilities

**Done by Eng. Kariem Moussa, under the supervision of Dr. Eng. Ahmed Maher**
Department of Pharmaceutical Engineering, German International University (GIU)

### 🌐 Live website
**https://kariemm11.github.io/Sustainble-Heat-Recovery-Air-Pump-In-HVAC-Systems-On-Pharmaceutical-Facilities/**

| Simulator | Direct link |
|---|---|
| Heat recovery air-pump unit | [`simulators/heat-recovery.html`](https://kariemm11.github.io/Sustainble-Heat-Recovery-Air-Pump-In-HVAC-Systems-On-Pharmaceutical-Facilities/simulators/heat-recovery.html) |
| Air handling unit (AHU) | [`simulators/ahu.html`](https://kariemm11.github.io/Sustainble-Heat-Recovery-Air-Pump-In-HVAC-Systems-On-Pharmaceutical-Facilities/simulators/ahu.html) |
| AHU + heat recovery air pump | [`simulators/heat-pump-ahu.html`](https://kariemm11.github.io/Sustainble-Heat-Recovery-Air-Pump-In-HVAC-Systems-On-Pharmaceutical-Facilities/simulators/heat-pump-ahu.html) |

## What's inside
- **Project website** (`index.html`): 3D animated hero, an interactive system diagram (winter and summer), the three simulators in one viewer, a quick heat-recovery calculator, QR codes, and credits.
- **Three 3D simulators** (`simulators/`): orbit, zoom, explode view, and edit the design values (airflow, efficiencies, outdoor %, temperatures). Air states are recalculated live.
- **QR codes and share links**: every simulator has a **Share / QR** button. The link stores the current settings, so a phone opens the same setup, and the variables can still be adjusted there.

### Link parameters
You can preset any simulator from the URL, for example:
```
simulators/heat-pump-ahu.html?season=summer&flow=4200&oat=38&e1=55
simulators/heat-recovery.html?season=winter&flow=3500&eff=70&oat=-5&room=22
```
`season`, `hrv`, `case`, `labels` and `view` choose the toggles. `flow`, `eff`, `e1`, `e2`, `oa`, `oat`, `room`, `sup` and `dt` set the design values. `exp` and `spd` set the sliders. `hide=ribbon,arrows` turns off display options.

## Publishing on GitHub Pages
1. Open the repository **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, then select the branch that holds these files and the `/ (root)` folder. Click **Save**.
3. After about a minute the site is live at the link above, and the QR codes on the site point to it.

Everything is static: no build step and no server. Three.js and the QR library are in `assets/vendor/`.
