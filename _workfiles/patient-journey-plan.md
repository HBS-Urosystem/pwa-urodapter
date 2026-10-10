# Páciens journey (Self instillation) – terv

Forrás: `1_UroDapter_self-treatment_FULL_KA.docx` (a teljes páciens-tartalom, 2026-10-10).
Állapot: **megvalósítva 2026-10-10** (a 9. fejezet 1–4. lépése; az eltéréseket a 12. fejezet sorolja fel). A tartalom még az orvosi ellenőrzésre vár (10. fejezet), addig a journey `noindex`.
Felhasznált szempontrendszerek: site-architecture (oldalfa, URL-ek, navigáció, ellenőrzések), intent:organize (szerkezet, címkék, tájékozódás), frontend-design (képernyők, vizuális irány).

---

## 0. Röviden

- A dokumentum maga leírja a használat menetét: **megközelítés kiválasztása → részletes útmutató elolvasása az első alkalom előtt → később az egyoldalas összefoglaló emlékeztetőnek**, és az összefoglalóban minden lépés címe a részletes leírására visz. A terv ezt a menetet építi meg.
- **3 megközelítés × 8 lépés.** A 8 lépés sorrendje és szerepe mindhárom megközelítésben azonos, a szövegük eltér.
- **Oldalak:** 1 nyitóoldal (a meglévő `/self-instillation`), 3 megközelítés-oldal (bevezető + egyoldalas összefoglaló), 24 lépésoldal (részletes útmutató, lépésenként egy oldal). Összesen 27 új oldal.
- **Tartalom:** a meglévő tartalomkezelés mintájára YAML/Markdown fájlokba kerül (`content/patient/`), Zod ellenőrzéssel a `generated.ts`-be. A képek WebP formátumban a `static/assets/patient/` mappába kerülnek.
- **Újrahasznosított klinikusi elemek:** TocCards (kártyák), ContentFlowNav (alsó előző/következő sáv), a Female/Male fülsor mintája, a betűs kör jelvény, a FAQ lenyitható blokkja, `formatBlockMarkdown`, SeoHead, daisyUI alert, a lépés megjegyzése localStorage-ban.

---

## 1. A dokumentum szerkezete

| Rész | Tartalom |
|---|---|
| Bevezető (4 bekezdés) | Mi a UroDapter otthoni használata; gyakorlás kell hozzá; a 3 bevált megközelítés; az első próbákhoz steril sóoldat; nem mindenkinek sikerül otthon |
| Használati útmutató (1 bekezdés) | „Select an image below to choose your approach. Before your first use, read the detailed instructions… Next, use the one-page summary as a reminder. Select any step label in the summary to open its detailed explanation.” |
| 3 választó illusztráció | Lying / Shower / Partner-assisted (a képekbe bele van írva a felirat) |
| Megközelítésenként | Bevezető bekezdés → egyoldalas összefoglaló (8 sor: lépéscím-kép + 1–5 mondat) → „Detailed instructions”: 8 fejezet |

### A 8 lépés a három megközelítésben

| # | slug | Lying or semi-reclined | Standing in the shower | Partner-assisted |
|---|---|---|---|---|
| 1 | `prepare` | Prepare the equipment and environment | Prepare the equipment and shower area | Prepare the equipment and environment |
| 2 | `position` | Choose and set up your position | Choose your standing position | Choose and set up your position |
| 3 | `disinfect` | Clean and disinfect the area | Wash and disinfect the area | Clean and disinfect the area |
| 4 | `locate` | Locate the urethral opening | Locate the urethral opening by touch | Locate the urethral opening |
| 5 | `place` | Place and align the UroDapter | Place and align the UroDapter | Place and align the UroDapter |
| 6 | `seal` | Create and maintain the seal | Create and maintain the seal | Create and maintain the seal |
| 7 | `instill` | Instill the solution | Instill the solution | Instill the solution |
| 8 | `feedback` | Use leakage or resistance as feedback | Use leakage or resistance as feedback | Use leakage or resistance as feedback |

A táblázat a javasolt egységes címeket mutatja. Az összefoglaló sorai a lépéscím-képek szövegét, a lépésoldalak a részletes fejezetek címét kapják. A 6. lépés címe és a Shower 3. összefoglaló-sora 2026-10-10-én egységesítve lett; a többi eltérést (a képek szövegéből hiányzó „the”) a 10. fejezet és az L-04 sor tartja nyilván.

### Közös és egyedi elemek

- **Két anatómiai ábra, mindkettő háromszor szerepel → 2 tárolt kép:**
  1. a külső nemi szervek ábrája, mindhárom megközelítés 4. lépésében (a docx-ben három külön fájl – image13, image18, image19 –, de ugyanaz az ábra, kicsit eltérő méretben);
  2. a metszetrajz a húgycsőnyílásra illesztett UroDapterrel és a tömítőgallérral, mindhárom megközelítés 6. lépésében (image14, mindhárom helyen ugyanaz a fájl).
- **Lépéscím-képek** (image5–12, 15–17): ezek csak szöveget tartalmaznak képként (kék kör számmal + cím). A weben valódi szövegként jelennek meg, a képfájlok nem kellenek.
- **Egyedi blokkok:**
  - Lying, 4. lépés: „A. Using a mirror”, „B. Finding it by touch”, „As you become more familiar”
  - Shower, 5. lépés: 4 számozott alpont
  - Partner, 6. lépés: „Practical tips from experienced users”
  - Mindhárom, 8. lépés: két alrész (szivárgás / ellenállás) és a záró figyelmeztetés („If you experience significant pain… stop the procedure and seek advice from your healthcare professional…”)

---

## 2. Szegmensek: hová kerül a tartalom

| # | Szegmens | Darab | Hová kerül |
|---|---|---|---|
| S1 | Bevezető, gyakorlási tanács, „nem mindenkinek”, használati útmutató | 1 készlet | Nyitóoldal |
| S2 | Megközelítés-kártya: illusztráció + név + a megközelítés bevezetőjének első mondata | 3 | Nyitóoldal |
| S3 | Megközelítés bevezető bekezdése | 3 | Megközelítés-oldal teteje |
| S4 | Összefoglaló sor: lépésszám + cím + rövid szöveg | 24 | Megközelítés-oldal, „One-page summary” |
| S5 | Részletes lépés: szöveg + ábrák + egyedi blokkok | 24 | Lépésoldalak |
| S6 | Záró figyelmeztetés („When to stop”) | 3 | 8. lépés + a megközelítés-oldal alja |
| S7 | A két anatómiai ábra (külső nemi szervek, metszetrajz) | 2 kép, 3–3 helyen | 4. és 6. lépés |

A kártyák szövege nem új szöveg: a megközelítés bevezetőjének első mondata (pl. „You remain lying or semi-reclined while your partner performs the instillation.”).

---

## 3. Az út: hogyan vezetjük végig a pácienst

Két használati helyzet van, és a dokumentum mindkettőt megnevezi:

1. **Tanulás (első alkalmak):** a részletes útmutató lépésről lépésre.
2. **Emlékeztető (később, közvetlenül az eljárás előtt vagy közben):** az egyoldalas összefoglaló, ahonnan bármelyik lépés részletei egy koppintással elérhetők.

```
Splash ── „Self instillation” ──▶ Nyitóoldal (/self-instillation)
                                   │  3 kártya: Lying · Shower · Partner-assisted
                                   ▼
                         Megközelítés-oldal (/self-instillation/lying)
                         ├─ [Read the detailed instructions] ──▶ 1. lépés ─▶ 2. ─▶ … ─▶ 8. ─▶ vissza az összefoglalóhoz
                         └─ One-page summary: 8 sor, mindegyik a saját lépésoldalára visz
```

- Visszatérő látogatónál a gomb: „Continue at step 4” (a böngésző megjegyzi megközelítésenként, hol tartott), mellette „Start at step 1”.
- A lépésoldalak alján a meglévő ContentFlowNav sáv viszi előre-hátra; a 8. lépés után vissza az összefoglalóhoz.
- Megközelítést váltani a megközelítés-oldal tetején lévő fülsorral lehet (mint a klinikusi Female/Male fülek).

---

## 4. Site architecture

### 1. Tree

```
/                                         Splash (journey choice)                      KEEP
└─ /self-instillation                     Self instillation (hub)                      KEEP (content rewritten)
   ├─ /self-instillation/lying            Lying or semi-reclined (summary)             NEW
   │  ├─ /self-instillation/lying/prepare      Step 1                                  NEW
   │  ├─ /self-instillation/lying/position     Step 2                                  NEW
   │  ├─ /self-instillation/lying/disinfect    Step 3                                  NEW
   │  ├─ /self-instillation/lying/locate       Step 4                                  NEW
   │  ├─ /self-instillation/lying/place        Step 5                                  NEW
   │  ├─ /self-instillation/lying/seal         Step 6                                  NEW
   │  ├─ /self-instillation/lying/instill      Step 7                                  NEW
   │  └─ /self-instillation/lying/feedback     Step 8                                  NEW
   ├─ /self-instillation/shower           Standing in the shower (summary)             NEW
   │  └─ (8 step pages, same step slugs as above)                                     NEW
   └─ /self-instillation/partner          Partner-assisted (summary)                   NEW
      └─ (8 step pages, same step slugs as above)                                     NEW
Utility layer (shared with the clinician journey): /contact, /install, /privacy-policy, /cookie-policy, Shop (external)
```

### 2. Page table

| Page | URL | Parent (exactly one) | Page type | Tier A/B/C | Nav zone | Breadcrumb | Status | Evidence level |
|---|---|---|---|---|---|---|---|---|
| Self instillation | `/self-instillation` | `/` (splash) | journey hub | A (assumed) | splash button, header TOC icon, drawer menu | none | KEEP | From user data |
| Lying or semi-reclined | `/self-instillation/lying` | `/self-instillation` | approach summary | A (assumed) | drawer menu, hub card, approach tabs | none | NEW | Proposed |
| Standing in the shower | `/self-instillation/shower` | `/self-instillation` | approach summary | A (assumed) | drawer menu, hub card, approach tabs | none | NEW | Proposed |
| Partner-assisted | `/self-instillation/partner` | `/self-instillation` | approach summary | A (assumed) | drawer menu, hub card, approach tabs | none | NEW | Proposed |
| Step pages (24) | see table below | their approach page | step | B (assumed) | summary list, step strip, prev/next bar | Self instillation › {approach} › Step n | NEW | Proposed |

| Step | Lying | Shower | Partner |
|---|---|---|---|
| 1 | `/self-instillation/lying/prepare` | `/self-instillation/shower/prepare` | `/self-instillation/partner/prepare` |
| 2 | `/self-instillation/lying/position` | `/self-instillation/shower/position` | `/self-instillation/partner/position` |
| 3 | `/self-instillation/lying/disinfect` | `/self-instillation/shower/disinfect` | `/self-instillation/partner/disinfect` |
| 4 | `/self-instillation/lying/locate` | `/self-instillation/shower/locate` | `/self-instillation/partner/locate` |
| 5 | `/self-instillation/lying/place` | `/self-instillation/shower/place` | `/self-instillation/partner/place` |
| 6 | `/self-instillation/lying/seal` | `/self-instillation/shower/seal` | `/self-instillation/partner/seal` |
| 7 | `/self-instillation/lying/instill` | `/self-instillation/shower/instill` | `/self-instillation/partner/instill` |
| 8 | `/self-instillation/lying/feedback` | `/self-instillation/shower/feedback` | `/self-instillation/partner/feedback` |

### 3. URL rules sheet and violations

| # | Rule | Source |
|---|---|---|
| U-01 | Lowercase paths only | G-url |
| U-02 | Hyphens between words | G-url |
| U-03 | Readable words, not internal ids | G-url |
| U-04 | Parameters only for state that does not change what the page is about | G-url, G-facet |
| U-05 | No fragments (`#...`) to load different content | G-url |
| U-06 | Path words written for readers | G-start |
| U-07 | A page's folder is its parent section | convention of this plugin, supported by G-start |
| U-08 | No dates in evergreen paths | convention of this plugin |
| U-09 | One trailing-slash policy, the other form redirects | convention of this plugin |
| U-10 | One URL pattern per page type | convention of this plugin |
| U-11 | No folder levels that add no meaning | convention of this plugin |
| U-12 | No session or tracking parameters in internal links | G-url |

Violations: none in the existing routes or the planned ones. U-09 is "Needs verification": SvelteKit's default (`trailingSlash: 'never'`) redirects `/path/` to `/path`; this has to be confirmed on the Netlify deploy.
Note on U-12: the external links "Sample order" (`https://www.urosystem.com/sample?app`) and "Shop" (`https://www.urosystem.com/shop?app`) both carry `?app`; they point to another site, so U-12 does not apply.

### 4. Navigation spec

| Field | Patient journey |
|---|---|
| Header items | Logo → splash (`/`, shows the journey choice again); Table of Contents icon → `/self-instillation`; menu button. No primary action. |
| Dropdown or mega menu | none (the drawer menu below) |
| Drawer menu | Self instillation → `/self-instillation`; Lying or semi-reclined → `/self-instillation/lying`; Standing in the shower → `/self-instillation/shower`; Partner-assisted → `/self-instillation/partner`; divider; Install App, Privacy Policy, Cookie Policy, Contact, Shop (external, new tab) |
| Section navigation | Approach page: 3 approach tabs (links, sticky under the header, current one marked). Step page: step strip with links 1–8 (current one marked), a "One-page summary" link, and the bottom prev/next bar (ContentFlowNav). |
| Footer groups | unchanged (Privacy Policy, Cookie Policy, Contact, Install App, logo → splash) |
| Breadcrumb format | Step pages only: `Self instillation › Lying or semi-reclined › Step 4` (first two are links, current step plain text). Approach pages have none: they are 2 levels deep and the tabs show the current approach (NN-BC guideline 7). |
| Hub entry points | Splash "Self instillation" button; header Table of Contents icon; first drawer item |
| Link markup | Every tab, step strip item, summary row and prev/next item is a normal `<a href>` (works without JavaScript, the pages are prerendered) |
| Mobile | The breadcrumb must stay on one line (NN-BC guideline 9): approach names are short and the current crumb is "Step n". The 3 tabs share the width; a name may wrap to 2 lines – to be checked on a 360 px wide screen. |

### 5. Label checks

| Id | Result | Labels and targets | Fix |
|---|---|---|---|
| L-01 | pass | "One-page summary" and "Detailed instructions" name what is inside | – |
| L-02 | pass | – | – |
| L-03 | **fail** | "urethral orifice" in 3 summary rows (Lying 3, Lying 4, Shower 4) and in one Partner tip (step 6); everywhere else the text says "urethral opening" | use "urethral opening" – deferred: the text stays verbatim until medical review (chapter 10) |
| L-04 | **fail** | (a) the patient menu's first item says "Table of Contents", the page heading is "Self instillation"; (b) Shower step 3: summary label "Clean and disinfect the area", heading "Wash and disinfect the area"; (c) step 6: label "…the seal", heading "…the sealing" (all 3); (d) the label images drop "the" ("Prepare equipment and environment") | (a), (b), (c) fixed on 2026-10-10 (menu item "Self instillation"; Shower step 3 label "Wash and disinfect the area"; step 6 title "Create and maintain the seal"); (d) deferred until medical review |
| L-05 | pass | – | – |
| L-06 | pass | Install App, legal, Contact and Shop are below the divider (utility layer) | – |
| L-07 | **fail** | The journey: "Self instillation" (splash, page heading) vs "Self-instillation" (docx headings). The approaches: illustration captions "Instillation in lying position" / "Instillation in the shower" vs docx headings "…lying or semi-reclined position" / "…while standing in the shower". | One name per item everywhere. The captions become live text under the illustration; the text baked into the images has been cropped off (done: `static/assets/patient/approach-*.webp`). |
| L-08 | Not checked | no patient wording (search terms, support e-mails) supplied | – |

Proposed names: **Lying or semi-reclined**, **Standing in the shower**, **Partner-assisted**. The full docx headings stay as the browser tab title (SEO title), e.g. "Self-instillation in a lying or semi-reclined position | Urodapter".

### 6. SA checks

| Id | Result | Count | Note | Evidence level |
|---|---|---|---|---|
| SA-01 | pass | 28 pages, each with one parent | the shared figures are images, not pages | Proposed |
| SA-02 | pass | 24 step pages | breadcrumb parent = URL folder = "One-page summary" link | Proposed |
| SA-03 | pass | 1 pattern for steps | `/self-instillation/{approach}/{step}` | Proposed |
| SA-04 | pass, with a note | 0 merge questions | steps 7 and 8 of Lying and Shower are nearly the same text, but each belongs to a different approach (Shower adds the bent-knee position); kept as separate pages | Proposed |
| SA-05 | pass | 24 | each step: summary row + step strip + prev/next | Proposed |
| SA-06 | pass | 4 tier-A pages | hub and the 3 approach pages are in the drawer menu; hub also from the header icon | Proposed |
| SA-07 | not applicable | – | not a growing section; a 4th approach would be one more entry in `journeys.ts` and one more YAML file | Proposed |
| SA-08 | pass | 0 | – | Proposed |
| SA-09 | pass | – | the troubleshooting step (8) is in every summary and step strip; Contact is in the menu | Proposed |
| SA-10 | pass | 0 | no URL moves | From user data |

### 7. Decisions to test

1. "Tomorrow you will do your first instillation in the shower. Where do you read what to prepare?" → Self instillation › Standing in the shower › Step 1
2. "The solution leaks while you press the plunger. Where do you look?" → your approach › Step 8 (also row 8 of the summary)
3. "Your partner needs to see where the urethral opening is." → Partner-assisted › Step 4 › anatomical illustration
4. "You have done it several times and want a quick reminder." → your approach › One-page summary
5. "Where do you buy more UroDapters?" → menu › Shop

### 8. Hand-off list with its row count

0 rows: no existing URL moves or is removed.

### 9. Tree-test reading

None supplied.

### 10. Thresholds used and sources

- Breadcrumb only from the 3rd level; one-line breadcrumb on mobile: NN-BC guidelines 7 and 9.
- Touch targets for step navigation at least 44 × 44 CSS px: WCAG 2.2 SC 2.5.5 (AAA); the AA minimum is 24 × 24 px (SC 2.5.8). Choosing AAA here is a heuristic of this plugin — change it if you like.
- Text contrast 4.5:1, large text 3:1: WCAG 2.2 SC 1.4.3.
- G-url, G-start, G-facet, NN-BC were read on 2026-10-03 (less than 6 months ago).

### 11. The URL provenance line

9 of 9 URLs checked against your data (repo routes and your message); 27 NEW URLs, all following the URL rules sheet.

### 12. Not checked

- L-08 (patients' own words): would need search terms or support e-mails from patients.
- Whether step pages should be indexed: would need Search Console query data for the patient topics.
- Tree test: would need participants; the 5 tasks in section 7 are ready for it.

### 13. Assumptions and at most three questions

See chapter 11.

---

## 5. Képernyők (mobil első)

### Nyitóoldal – `/self-instillation`

```
┌─────────────────────────────────────┐
│ UroDapter®                  ⌂   ☰  │
├─────────────────────────────────────┤
│ Self instillation                   │  H1
│ UroDapter allows bladder …          │  bevezető (S1), rövid bekezdések
│                                     │
│ Choose your approach                │  H2
│ ┌─────────────────────────────────┐ │
│ │      [illusztráció, felirat    ]│ │  kártya (TocCards + kép)
│ │      [nélkül                   ]│ │
│ │ Lying or semi-reclined          │ │  név (élő szöveg)
│ │ In this approach, you carry out │ │  a bevezető első mondata
│ └─────────────────────────────────┘ │
│ ┌ Standing in the shower ┐          │  ≥640 px szélességen 3 oszlop
│ ┌ Partner-assisted ┐                │
│                                     │
│ ┌ info ───────────────────────────┐ │  alert-info: első alkalom előtt
│ │ For the first attempts, it may  │ │  sóoldattal gyakorolni; előbb a
│ │ be useful to practice with …    │ │  részletes útmutató, aztán az
│ └─────────────────────────────────┘ │  összefoglaló (a docx szövege)
│ Not every woman will be able …      │  sima bekezdés
│ How the UroDapter works (video)     │  vendéglink a klinikusi videóoldalra
└─────────────────────────────────────┘
```

### Megközelítés-oldal – `/self-instillation/lying`

```
│ [ Lying or      | Standing in | Partner-  ]   fülsor (linkek, sticky)
│ [ semi-reclined | the shower  | assisted  ]
│ Lying or semi-reclined                        H1
│ In this approach, you carry out …             bevezető (S3)
│ ┌───────────────────────────────────────┐
│ │ Read the detailed instructions        │     elsődleges gomb → 1. lépés
│ └───────────────────────────────────────┘     (visszatérőnek: „Continue at step 4”
│                                                + „Start at step 1”)
│ One-page summary                              H2
│ (1) Prepare the equipment and environment  ›  sor = link a lépésoldalra
│  │  Empty your bladder and wash your hands …
│ (2) Choose and set up your position        ›
│  │  …                                         függőleges vonal köti össze a számokat
│ (8) Use leakage or resistance as feedback  ›
│ ┌ warning ─────────────────────────────────┐
│ │ If you experience significant pain, …    │  S6 záró figyelmeztetés
│ └──────────────────────────────────────────┘
├──────────────────────────────────────────────┤
│ ← Self instillation          Step 1: Prepare →│  ContentFlowNav
```

### Lépésoldal – `/self-instillation/lying/locate`

```
│ Self instillation › Lying or semi-reclined › Step 4    breadcrumb (kis betű)
│ (1)(2)(3)[4](5)(6)(7)(8)        One-page summary      lépéssáv: linkek, az aktuális kitöltve
│ (4) Locate the urethral opening                        H1 nagy számjelvénnyel
│ The urethral opening can be difficult to find …       törzsszöveg, 17–18 px, max. 65 karakter/sor
│ ▸ Show the anatomical illustration                     lenyitható blokk, alapból zárva
│ There are two main ways to locate …
│ (A) Using a mirror                                     betűs alfejezetek a meglévő betűs körrel
│     …
│ (B) Finding it by touch
│     …
├──────────────────────────────────────────────┤
│ ← 3 Clean and disinfect     5 Place and align →│  ContentFlowNav
```

---

## 6. Vizuális irány

A páciens journey ugyanannak az alkalmazásnak a része, ezért **nem kap új arculatot**: világos módban a Urodapter brandbook (teal), sötét módban a Urosystem brandbook (navy) marad. Új betűtípus sincs: címek Josefin Sans, szöveg a rendszer sans-serif betűje.

**Színek** (a meglévő témából):

| Név | Hex | Szerep |
|---|---|---|
| Deep teal | `#005c5b` | világos mód: szöveg, címek |
| Teal | `#02979d` | világos mód: lépésjelvény háttere, aktuális lépés, linkek |
| Pale teal | `#b6e1e2` | világos mód: az összefoglaló összekötő vonala, a lépéssáv inaktív elemei |
| Navy | `#0b3b54` | sötét mód: háttér; a jelvény számjegye |
| Sky | `#52b2d6` | sötét mód: lépésjelvény háttere, aktuális lépés |
| Sand | `#f6d389` / `#e1b75c` | „When to stop” figyelmeztetés (világos / sötét) |

**Kontraszt** (kiszámolva): fehér a `#02979d`-n 3.55:1 – csak nagy, félkövér számjegyre elég (≥ 18.66 px bold); navy a `#52b2d6`-on 4.92:1; deep teal a `#b6e1e2`-n 5.54:1. Mellékes észrevétel a klinikusi oldalról: a világos témában a fehér szöveg a `#78c7c9` primary gombokon 1.94:1, ez normál szövegnél a WCAG 1.4.3 alatt van. Ez nem része ennek a munkának.

**Betűméretek:** lépésoldalon a törzsszöveg 17–18 px, sorköz 1.6, legfeljebb 65 karakter soronként; lépéscímek Josefin Sans 600.

**Egy jellegzetes elem:** a lépésszám-jelvény, mint végigfutó szál. Ugyanaz a kör alakú számjelvény jelenik meg az összefoglaló sorainál (függőleges vonallal összekötve), a lépéssávban, a lépésoldal címénél és az előző/következő feliratokban. Ez a docx saját lépéscím-képeiből jön (kék kör számmal), és a klinikusi oldal betűs körének a párja. Minden más visszafogott.

**Elvek:**
- Nyugodt és diszkrét: a 4. lépés anatómiai ábrája (külső nemi szervek) csak kérésre nyílik ki (nem jelenik meg váratlanul a telefon képernyőjén).
- Fél kézzel is használható: előre-hátra az alsó sávval, hüvelykujj-közelben; legalább 44 px-es érintési célok.
- Szöveg szövegként, nem képként (felolvasható, sötét módban is olvasható, fordítható).
- Nincs automatikus animáció; a sima görgetés kikapcsol, ha a rendszer csökkentett mozgást kér.

**Ellenőrzés az általános sablonok ellen:** az összefoglaló nem 8 egyforma kártya, hanem összekötött számozott lista; kártya csak a 3 képes választásnál van (a docx maga kéri: „select an image”). A számozás valódi sorrendet jelöl. Nincs csupa nagybetűs címke, nincs új kiemelőszín.

---

## 7. Komponensek: újrahasznosítás és új elemek

| Igény | Meglévő elem | Teendő |
|---|---|---|
| Megközelítés-kártyák a nyitóoldalon | `TocCards.svelte` | opcionális kép + egymondatos leírás támogatása (`JourneySection.image`, `.description`) |
| Menü | `journeys.ts` + `+layout.svelte` | `patient.sections` = a 3 megközelítés; új `tocLabel` mező (klinikus: „Table of Contents”, páciens: „Self instillation”) |
| Fülsor a megközelítések között | a Female/Male fülsor (`InstructionsPatientPage`) és a Doctor/Patient fülsor mintája | új `RouteTabs.svelte` (linkek fülként); a klinikusi oldal később átállhat rá, de most nem nyúlunk hozzá |
| Számjelvény | a betűs kör (`DoctorPriorToInstillationPanel`, `what-to-do-prior-to-instillation`) | új `NumberBadge.svelte` (szám vagy betű, méretek) |
| Összefoglaló lista | – | új `StepSummaryList.svelte` (jelvény + cím + szöveg, sorok linkként, összekötő vonal) |
| Lépéssáv | – | új `StepStrip.svelte` (1–8 link, aktuális jelölve) |
| Lépés törzsszövege | `formatBlockMarkdown` | bővítés: számozott lista (`1. `); ábra-jelölők a fordításkor szegmensekre bontva |
| 4. lépés anatómiai ábrája (külső nemi szervek) | a FAQ lenyitható blokkja (`details.collapse`) | új `FigureDisclosure.svelte` |
| 6. lépés anatómiai ábrája (metszetrajz) | – | sima `<figure>` képaláírással |
| Előző/következő | `ContentFlowNav.svelte` | változatlan, a címkék az adatból jönnek |
| „When to stop”, „Practical tips” | daisyUI `alert` (az `/install` oldalon már használt) | – |
| Hol tartok megjegyzése | `instructions-tab-storage.ts` mintája | új `patient-progress-storage.ts` (localStorage, megközelítésenként az utolsó lépés) |
| SEO | `SeoHead.svelte` | – |
| Videó | `VideoPlayer.svelte` | nem kell; a nyitóoldalról csak link az oktatóvideóra |

A klinikusi lépés-karusszelt nem használjuk: rövid, videós lépésekhez készült; a hosszú páciens-lépésekhez a lépésenkénti oldal jobb (az oldal tetején indul, a vissza gomb működik, közvetlenül linkelhető).

---

## 8. Tartalomfájlok és adatmodell

```
content/patient/
  overview.md        nyitóoldal: ## intro, ## practise, ## not-for-everyone, ## how-to-use
  lying.yaml         megközelítés: id, label, seoTitle, intro, safety, steps[8]
  shower.yaml
  partner.yaml
static/assets/patient/
  approach-lying.webp, approach-shower.webp, approach-partner.webp   KÉSZ: felirat és keret levágva, 384×308 px
  vulva-anatomy.webp       1. anatómiai ábra: külső nemi szervek (image19 alapján, ~1200 px széles)
  sealing-collar.webp      2. anatómiai ábra: metszetrajz (image14)
```

Példa (`lying.yaml`, rövidítve):

```yaml
id: lying
label: Lying or semi-reclined
seoTitle: Self-instillation in a lying or semi-reclined position
intro: |
  In this approach, you carry out the instillation by yourself lying down, or in a semi-reclined position. …
safety: |
  If you experience significant pain, persistent resistance, or are unable to establish …
steps:
  - id: locate
    title: Locate the urethral opening
    summary: |
      Locate the urethral opening between the clitoris and the vaginal opening using a mirror or by touching it. …
    body: |
      The urethral opening can be difficult to find at first. …
      [[figure:anatomy]]
      There are two main ways to locate the urethral opening:
      ### A. Using a mirror
      This is usually the easiest method while you are learning.
      …
  - id: seal
    title: Create and maintain the seal
    summary: |
      …
    body: |
      …
      [[figure:sealing]]
      …
    tips:            # csak a Partner-assisted 6. lépésnél
      - Slow, even breathing can make it easier to relax the pelvic floor.
```

`scripts/compile-content.mjs` bővítése (Zod):
- pontosan 8 lépés, a sorrend kötött: `prepare, position, disinfect, locate, place, seal, instill, feedback`;
- ábra-jelölő csak `anatomy` vagy `sealing` lehet;
- a `body` szegmensekre bomlik: `{ kind: 'md', text }` vagy `{ kind: 'figure', id }`;
- kimenet: `siteContent.patient = { overview, approaches: { lying, shower, partner } }`.

Útvonalak:

```
src/routes/self-instillation/+page.svelte                     nyitóoldal (átírás)
src/routes/self-instillation/[approach]/+page.ts              load + entries() + prerender
src/routes/self-instillation/[approach]/+page.svelte          megközelítés-oldal
src/routes/self-instillation/[approach]/[step]/+page.ts       load + entries() + prerender
src/routes/self-instillation/[approach]/[step]/+page.svelte   lépésoldal
```

Offline: a tartalom a JavaScript csomagba kerül (`generated.ts`), így az alkalmazáson belüli navigáció hálózat nélkül is működik; a képek a `static` mappából a service worker előtöltésével kerülnek a gyorsítótárba.

---

## 9. Megvalósítás lépései

1. **Tartalom:** docx → `content/patient/` (a szöveg szó szerint, a fejezetcímek végi Word-jelek nélkül; lásd 10. fejezet). Képek: a 2 anatómiai ábra WebP-ként (az illusztrációk már elkészültek). Séma és fordítás. Ellenőrző szkript: a docx minden mondata megvan-e a tartalomfájlokban (0 hiányzó mondat a cél).
2. **Oldalak és komponensek:** nyitóoldal, megközelítés-oldal, lépésoldal; `journeys.ts` (sections, `tocLabel`); TocCards kép-támogatás; új komponensek (7. fejezet); `formatBlockMarkdown` számozott lista.
3. **Útvezetés:** „Continue at step n” megjegyzés. Opcionális: „Keep screen on” kapcsoló a lépésoldalakon (Wake Lock API), hogy a képernyő ne sötétedjen el, amíg a páciens keze foglalt.
4. **Ellenőrzés:** svelte-check, Svelte autofixer; böngészős próba mind a 28 oldalon (telefon és asztali méret, világos és sötét mód); billentyűzet és képernyőolvasó alapok; offline próba (repülőgép mód az első látogatás után); `WHATS-CHANGED.md` és `content/README.md` frissítése; döntés a `noindex`-ről és a sitemapről élesítés előtt.

---

## 10. Nyelvi javítások és tartalmi kiegészítés – az orvosi ellenőrzéshez

**A docx állapota:** a dokumentumban 112 beszúrás és 93 törlés van követett változásként, még elfogadatlanul. Az alkalmazás szövege az **összes változás elfogadásával** készült. Ezen felül Kéri András 4 nyitott megjegyzése van benne:

| Hol | A megjegyzés helye | Megjegyzés |
|---|---|---|
| Lying, összefoglaló 3 | „Gently separate the labia and disinfect the urethral orifice and the surrounding area…” | „Ezt csak a többi hasonló leírásból tippeltem, hogy mi akart lenni.” |
| Lying, összefoglaló 6 | „Relax your pelvic area and gently advance the UroDapter until the collar seals…” | „Ezt sem teljesen értem.” |
| Lying, 3. lépés | „If the fingers of the hand holding the labia apart remain close to the cleaned area…” | „Remélem, ezt akartad írni” |
| Lying, 5. lépés utolsó bekezdése | „Once the UroDapter is correctly aligned, keep it firm for ensuring the sealing, and starting the instillation.” | „Ezt sem teljesen értettem, mi akart lenni.” |

Ha az ellenőrzés után új docx érkezik, a `_workfiles/patient-source/` szkriptjeivel a tartalomfájlok újra előállíthatók, és ellenőrizhető, hogy minden bekezdés átkerült.

Döntés (2026-10-10): a szöveg szó szerint kerül be. Az alábbi lista az orvosi ellenőrzéshez készült; a javítások csak az ellenőrzés után kerülnek be. Az utolsó sor nem javítás, hanem a docx-ből hiányzó tartalom a klinikusi oldalról.

**Bekerült (2026-10-10):** 12 nyelvi javítás (elírások, a „seal” cím és a Shower 3. összefoglaló-sorának címe). A lista a `_workfiles/patient-source/corrections.yaml` fájlban van; az átalakító minden új docx-importnál újra alkalmazza őket.

Kivétel: a fejezetcímek végén álló „.”, „..”, „ .” jelek nem kerülnek be. Ezek a Word belső hivatkozásaihoz kellettek (a három megközelítés azonos című fejezeteit különböztetik meg), a weben nincs szerepük.

| Hol | docx | Javaslat |
|---|---|---|
| Fejezetcímek | záró „.”, „..”, „ .” | eltávolítva |
| Összefoglaló (Lying 3, Lying 4, Shower 4), Partner 6. lépés tipp | urethral orifice | urethral opening |
| Új tartalom: a nyitóoldal tájékoztató doboza (vagy mindhárom megközelítés 1. lépése – az ellenőrzés dönti el) | nem szerepel | Avoid sexual intercourse within 24 hours before the instillation to decrease the risk of urinary tract infection. (A klinikusi „What to do prior to instillation” oldal A pontja alapján: „Patients should be advised to avoid sexual intercourse within 24 hours prior to instillation to decrease the risk of urinary tract infection.”) |

---

## 11. Feltételezések és nyitott kérdések

**Alapértelmezésként így tervezem (szólj, ha másképp legyen):**
- URL-ek: `/self-instillation/lying|shower|partner` és a 8 lépés-slug (1. fejezet).
- Nevek: Lying or semi-reclined, Standing in the shower, Partner-assisted.
- A journey `noindex` marad, amíg a tartalom nincs jóváhagyva. Élesítéskor a nyitóoldal és a 3 megközelítés-oldal indexelhető lesz; a lépésoldalakról Search Console adatok alapján döntünk.
- A klinikusi videók nem kerülnek a páciens journey-be; a nyitóoldalról csak az általános oktatóvideóra mutat link.

**Elintézve (2026-10-10):**
- A 24 órás szexuális absztinencia a 10. fejezet táblázatába került, az orvosi ellenőrzéshez.
- Az illusztrációkról a felirat le van vágva (`static/assets/patient/approach-*.webp`).
- A Shop link `?app` végződést kapott: `https://www.urosystem.com/shop?app`.

**Döntések (2026-10-10):**
1. A részletes útmutató lépésenként külön oldal (24 lépésoldal).
2. A szöveg szó szerint marad az orvosi ellenőrzésig; a 10. fejezet listája az ellenőrzéshez készült.
3. A 4. lépés anatómiai ábrája (külső nemi szervek) lenyitható blokkban jelenik meg, alapból zárva. A 6. lépés metszetrajza a szövegben, nyitva jelenik meg.

---

## 12. Megvalósítás – mi készült el és miben tér el a tervtől

**Elkészült:** a nyitóoldal, a 3 megközelítés-oldal és a 24 lépésoldal (mind előre generált HTML); a menü és a fejléc a páciens journey-t követi; „Continue at step n”; a 4. lépés ábrája lenyitható blokkban; a docx mind a 275 bekezdése és táblázatcellája megvan a tartalomfájlokban (a 3 „Detailed instructions: …” sort a felület adja). Ellenőrizve: svelte-check, ESLint, Svelte autofixer, éles build, böngészős próba mind a 27 aloldalon telefon- és asztali méretben, világos és sötét módban, offline navigáció a service workerrel; a klinikusi tartalomjegyzék és menü változatlan.

**Eltérések a tervtől:**
- **Számjelvény és elsődleges gomb színe:** a `#02979d` helyett a szövegszín inverze (világos módban mélyteal alapon fehér, sötét módban halványkék alapon navy). Így minden méretben legalább 7:1 a kontraszt; a `#02979d` fehér számmal csak nagy betűnél lett volna elég.
- **Tájékoztató dobozok** (gyakorlási tanács, Partner-tippek): halvány kék háttér a téma szövegszínével, mert a daisyUI `alert-info` színeivel a kontraszt 4.5:1 alatt volt. A figyelmeztetés (`alert-warning`) marad, csak a szövegszíne lett beállítva.
- **Megközelítés-fülek:** az aktív fül fehér (sötét módban navy) kiemelt háttérrel és félkövér betűvel jelölve, nem a klinikusi oldal teal kitöltésével (ott a fehér szöveg kontrasztja 1.94:1).
- **Oktatóvideó-link a nyitóoldalon:** kimaradt. A videóoldal a klinikusi journey része, ezért a link a menüt is klinikusira váltaná.
- **„Keep screen on” kapcsoló:** nem készült el (opcionális volt).
- **Billentyűzet és képernyőolvasó:** minden vezérlő natív link, gomb vagy `<details>`, de képernyőolvasóval külön nem próbáltam ki.
