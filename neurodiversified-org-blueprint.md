# neurodiversified.org — Website Blueprint & Copy (v3)

## 1. Platform Recommendation — Plain HTML/CSS/JS, Enhanced

Good news: since you're already comfortable with plain HTML and scripting, you don't need a framework or build tool at all. GitHub Pages serves raw files directly — no build step required. The "stand out" look comes from a handful of small, CDN-loaded libraries layered on top of your own HTML/CSS/JS, not from switching your whole workflow.

**The stack, in a nutshell:**

| Tool | What it does | Why it's worth it |
|---|---|---|
| **Plain HTML/CSS/JS** | Your actual pages | Zero build step, deploys straight to GitHub Pages, fully in your control |
| **CSS custom properties (variables)** | `--color-primary`, `--font-body`, etc. defined once at the top of your CSS | Powers your dark/light toggle with a few lines of JS that just swap variable values — no framework needed |
| **Google Fonts** | `<link>` tag pulling in a typeface | One line of HTML, instantly elevates typography — try **Atkinson Hyperlegible** (built for accessibility) paired with a characterful display font for headlines |
| **AOS (Animate On Scroll)** | A small JS library — add `data-aos="fade-up"` to any element | Gives that "premium site" feel of content gently animating in as you scroll, with zero animation code of your own |
| **Lucide or Feather Icons** | Icon sets you drop in via a `<script>` tag | Clean, consistent icons for the roadmap/nav without designing your own |
| **Cloudflare Web Analytics** | One `<script>` snippet | Free, privacy-friendly visit tracking, no cookie banner needed |

All of these are "add a `<script>` or `<link>` tag and go" — no npm, no build pipeline, no framework to learn. It's still fundamentally your plain-HTML approach, just dressed up.

**Hosting/DNS (unchanged):** GitHub Pages + Cloudflare DNS, as discussed — push HTML files to the repo, `CNAME` file for the custom domain, Cloudflare handles DNS + SSL + the free analytics above.

**Donations, without a payment backend:** Use a **Stripe Payment Link** (Stripe gives you a plain URL for a fixed or "name your amount" donation — no cart, no server code, just a `<a href="...">Donate</a>` button) or **Zeffy** (built specifically for nonprofits, 0% platform fees, donor-covers-the-tip model — worth checking their eligibility rules given you're pre-501(c)(3), but even a personal Stripe account works fine for now labeled as "support," not a tax-deductible donation, until you're officially filed).

---

## 2. Logo & Product Placeholders — Suggestions

You don't need finished assets to launch a good-looking site. A few low-effort, high-polish placeholder approaches:

- **Logo:** Skip an icon/mark for now and use a clean **wordmark** — just "neurodiversified" set in a strong display font, maybe with subtle letter-spacing or a small accent color on one letter. Purely typographic logos are a legitimate permanent choice for a lot of orgs, not just a placeholder — so this might end up being your real logo, not something you replace later.
- **Keychain product images:** Instead of stock photos or fake mockups, use simple **dashed-border placeholder cards** with a small icon and "Design coming soon" label — it reads as intentional and honest rather than broken, and fits a startup-stage nonprofit being transparent about where things stand.
- **Favicon:** A simple colored circle or square with a single letter ("n") works fine as a temporary favicon and takes five minutes in any free favicon generator.

---

## 3. Step-by-Step Build Checklist

1. **Repo setup**
   - Create a GitHub repo, plain HTML/CSS/JS files (`index.html`, `about.html`, `roadmap.html`, `get-involved.html`, `shop.html`, shared `styles.css`, `script.js`).
   - Add a `CNAME` file at the repo root containing `neurodiversified.org`.
2. **Cloudflare DNS**
   - Move nameservers to Cloudflare.
   - Add DNS records pointing the root and `www` to GitHub Pages, enable the proxy, set SSL/TLS to "Full," force HTTPS.
3. **Enable GitHub Pages**
   - Repo settings → Pages, confirm custom domain matches the `CNAME` file, wait for SSL to provision.
4. **Design foundation**
   - Wordmark logo, Google Fonts, CSS variables for a light/dark color system, confirm AA/AAA contrast both ways.
5. **Build Home**
   - Mission-led hero, launch-fund progress bar, a clear **Donate** button as the primary CTA, and a quiet one-line mention of the keychains linking to the small shop page.
6. **Build About the Dream**
   - Origin story, generous spacing, readable line length.
7. **Build The Roadmap**
   - Visual 4-phase timeline (AOS fade-ins as each phase scrolls into view work nicely here), Phase 2 marked "You are here."
8. **Build Get Involved**
   - Donate button (Stripe Payment Link/Zeffy), newsletter signup (Formspree/ConvertKit embed, no backend needed), a brief mention of the keychains as one small extra way to help.
9. **Build the Shop (kept minimal — one simple page)**
   - Placeholder product cards for now; swap in real photos once the keychains are designed. One or two Stripe Payment Link buttons, no cart needed.
10. **Footer**
    - Contact info, newsletter signup, legal disclaimer.
11. **Accessibility pass**
    - Keyboard nav, alt text (including on placeholder cards), dark/light toggle persistence via `localStorage`, one screen-reader pass.
12. **Legal/compliance check-in**
    - Confirm disclaimer and "donate" vs. "support" language with a lawyer or your state's nonprofit solicitation guidance before launch.
13. **QA + launch**
    - Test the donate link, test the newsletter form, test mobile Safari/Chrome, push to `main`, confirm DNS + HTTPS.
14. **Post-launch**
    - Cloudflare Web Analytics is already wired in; update the roadmap/progress bar via a quick commit as things move.

---

## 4. Page Copy (donate-led, shop minimal, placeholders noted)

### Home Page

**Hero headline:**
> We're Building the Support System That Should Have Existed All Along.

**Hero sub-headline:**
> neurodiversified is a nonprofit-in-motion, built for late-diagnosed autistic adults — because getting the answer later in life shouldn't mean facing everything after it alone.

**Hero primary CTA button:** `Donate to Our Launch →`
**Hero secondary link (text link, not a button):** `See our roadmap →`

**Mission block headline:** Our Mission
**Mission copy:**
> We empower late-diagnosed autistic adults by providing vital resources, community advocacy, and practical guidance to navigate life after a late realization.

**Progress section headline:** We're Actively Working Toward Launch
**Progress sub-copy:**
> Every dollar right now goes toward officially filing as a nonprofit and opening our full resource hub. Here's where things stand.

**Progress bar label:** `Launch Fund Progress: $[X] of $[goal] raised`

**Quiet secondary mention (small, not a hero element):**
> Another small way to help: we're designing our own 3D-printed keychains, with every sale going straight to our launch costs. [Take a look →]

---

### The Roadmap Page
*(unchanged from v2 — Vision → Building Our Foundation (you are here) → 501(c)(3) Filing → Resource Hub Launch)*

---

### Get Involved / Support Us Page

**Page headline:** Help Us Take Flight
**Page sub-headline:**
> We're a startup nonprofit, still in the founding stretch. Here's what actually moves the needle right now.

**Option 1 — Donate**
> Every contribution goes directly toward our official filing and launch costs.
> `Donate →`

**Option 2 — Stay Connected**
> Join the waitlist for our Resource Vault, and get updates as we move through each phase toward launch.
> `Join the Waitlist →`

**Option 3 — Spread the Word**
> Know someone who found out later in life? Share this with them — sometimes just knowing this exists is the first piece of support.

**Option 4 — Small Purchase, Real Impact** *(kept brief)*
> We're designing our own 3D-printed keychains from durable PLA and PETG. 100% of proceeds go straight to our launch costs.
> `See the Keychains →`

---

### Shop Page (minimal, placeholder-friendly)

**Page headline:** A Small Way to Help
**Page sub-headline:**
> We're still designing our first pieces — check back soon, or reach out if you'd like a sneak peek.

**Placeholder product card copy:**
> `[Design coming soon]` — 100% of proceeds will fund our launch.

---

### Footer Copy

**Legal disclaimer:**
> neurodiversified is currently in its founding, pre-501(c)(3) phase and has not yet been granted official nonprofit tax-exempt status. Contributions and purchases support our organizational launch costs but are not currently tax-deductible. This notice will be updated immediately upon receiving official nonprofit status.

**Newsletter CTA:** `Get updates as we launch →`

---

*Note: the disclaimer wording is a starting draft, not legal advice — get it reviewed against your state's nonprofit solicitation rules before launch, especially the "donate" language, since soliciting tax-deductible-sounding donations before you actually have 501(c)(3) status can create legal exposure. "Support" or "contribute" is safer framing than "donate" until your status is official — worth confirming with a lawyer either way.*
