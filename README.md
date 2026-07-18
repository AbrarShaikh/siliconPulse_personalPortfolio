# silicon-pulse

> Personal portfolio website for **Abrar Shaikh** — Embedded Software Engineer

[![View Live](https://img.shields.io/badge/View_Live-GitHub_Pages-blue?style=for-the-badge&logo=github)](https://abrarshaikh.github.io/siliconPulse_personalPortfolio/)

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/AbrarShaikh/siliconPulse_personalPortfolio)

A semiconductor-themed dark portfolio with animated chip visualizer, terminal aesthetics, and golden amber accents.

---

## What Is This?

This is a **personal website** (portfolio) that showcases:
- Who I am and my education
- My work experience at ARM, BOSCH, and AMI
- Technical skills and tools I use
- Personal projects (RISC-V, FPGA work)
- Published research paper
- Contact information

Think of it like a digital resume, but way cooler with animations and a hardware/semiconductor vibe.

---

## Tech Stack (What It's Built With)

### Core Technologies

| Technology | What It Does | Where It's Used |
|------------|--------------|-----------------|
| **HTML5** | Structure/layout of each page | All `.html` files |
| **CSS3** | Styling, colors, animations | `styles.css` |
| **JavaScript** | Interactivity, animations | `app.js` |

### Fonts

| Font | Purpose |
|------|---------|
| **JetBrains Mono** | Monospace font for code-like elements (nav, labels, tags) |
| **Space Grotesk** | Clean sans-serif for body text and headings |

### Design System

| Element | Color | Hex Code |
|---------|-------|----------|
| Background | Deep navy/black | `#05080d` |
| Primary Accent | Golden amber | `#ffb020` |
| Secondary Accent | Green | `#4ade80` |
| Text Primary | Light gray | `#e6edf3` |
| Text Muted | Dim gray | `#556270` |

---

## Project Structure

```
emergent/
├── index.html          # Landing page with hero section & chip visualizer
├── about.html          # Education and learning journey
├── experience.html     # Work history (tabbed layout)
├── skills.html         # Technical skills grid
├── projects.html       # Personal projects with GitHub links
├── publications.html   # Research paper details
├── contact.html        # Contact form with serial terminal theme
├── dashboard.html      # Dashboard view
├── styles.css          # All styling and animations
├── app.js              # JavaScript for interactivity
├── logo_animation.gif  # Animated logo reference
```

---

## How It Was Developed

### 1. Design Reference
The design was inspired by embedded systems and semiconductor aesthetics:
- Dark backgrounds like terminal screens
- Golden/amber accents like PCB traces
- Green highlights like LED indicators
- Monospace fonts like code editors

### 2. Layout Approach
- **Flexbox** and **CSS Grid** for responsive layouts
- **Sticky navbar** that stays at the top while scrolling
- **Tabbed interface** for experience section
- **Card-based design** for projects and publications

### 3. Animations

#### Logo Animation
- Green dot at chip icon's corner pulses with 3-step intensity
- Underscore in "abrar.sh_" blinks with golden glow

#### Chip Visualizer (Landing Page)
- SVG-based semiconductor chip with animated elements:
  - **Radar sweep** rotates around the chip
  - **Scan lines** move back and forth within chip boundaries
  - **Data packets** orbit around the chip
  - **Signal waves** flow across the bottom

#### Hover Effects
- **Navigation links**: Golden glow on hover
- **Cards**: Border lights up, subtle lift effect
- **Skill tags**: Golden border + glow animation
- **Project titles**: Slide-in link icon on hover
- **Journal link**: Underline slides in from left

### 4. Interactive Elements
- **Mobile navigation drawer** for small screens
- **Tab switching** in experience section
- **Contact form** styled like a serial terminal
- **Live clock** in navbar showing current time

---

## Key Features

### Semiconductor Theme
- PCB-style grid overlay on background
- Chip visualizer with animated scan lines
- Terminal/console aesthetic throughout
- Golden traces and green LED indicators

### Responsive Design
- Works on desktop, tablet, and mobile
- Navigation collapses to hamburger menu on mobile
- Cards stack vertically on small screens

### Accessibility
- Semantic HTML structure
- Keyboard navigable
- Screen reader friendly with proper labels

---

## Customization Guide

### Changing Colors
Edit the CSS variables in `styles.css`:

```css
:root {
    --accent-gold: #ffb020;      /* Change golden accent */
    --accent-green: #4ade80;     /* Change green accent */
    --bg-primary: #05080d;       /* Change background */
    --text-primary: #e6edf3;     /* Change main text color */
}
```

### Adding New Sections
1. Create a new `.html` file
2. Copy the navbar and footer from an existing page
3. Add your content in the `<main>` section
4. Add corresponding CSS in `styles.css`

### Updating Content
- **Experience**: Edit the `experience.html` file, update the timeline items
- **Projects**: Edit `projects.html`, add new entry cards
- **Skills**: Edit `skills.html`, add new skill categories

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Performance

- **No external frameworks** — pure HTML, CSS, JavaScript
- **Lightweight** — fast loading times
- **Optimized images** — SVG for icons and graphics
- **Minimal dependencies** — only Google Fonts

---

## Credits

- **Fonts**: [Google Fonts](https://fonts.google.com/) — JetBrains Mono & Space Grotesk
- **Icons**: Custom SVG icons
- **Design Inspiration**: Embedded systems, PCB layouts, terminal interfaces

---

## License

This is a personal portfolio website. Feel free to use it as inspiration for your own portfolio!

---

**Made with bare-metal love** &#x2699;
