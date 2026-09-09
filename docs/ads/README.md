# Meta ad creatives

Nine ready-to-upload images — three concepts, each in the three sizes Meta
serves. Palette, wordmark and type are the brand's own: cobalt `#4D7EF7` as the
only accent, ground `#060709`, ice text `#F2F4F8`, TWK Lausanne throughout.
Every one carries the **W1 / WEEK ONE AI** lockup and **info@weekoneai.com**.

| Concept | Angle | Files |
|---|---|---|
| **A — Missed calls** | the cost of an unanswered phone | `a-missed-calls-*.png` |
| **B — Week one** | speed against consultants who talk in quarters | `b-week-one-*.png` |
| **C — Front office** | what the system actually does | `c-front-office-*.png` |

| Size | Where it runs |
|---|---|
| `1080x1350` | Feed, portrait — usually the strongest placement |
| `1080x1080` | Feed, square |
| `1080x1920` | Stories and Reels |

Run three concepts against each other before scaling spend; the copy angles are
different enough that the winner tells you something.

## Copy

Headlines and proof points come from the site's own material, so the ad and the
landing page say the same thing. Concept A's arithmetic — 300 calls a month,
20% unanswered, $350 average ticket — is marked **illustrative** on the creative,
matching how the essay frames it. It is a way of sizing the problem, not a
claimed client result, and it should stay labelled that way.

## Re-rendering or editing

`index.html` is the source. Serve the site, then open a variant:

```
http://localhost:8099/docs/ads/?v=a&f=portrait
```

`v` is `a` \| `b` \| `c`, `f` is `square` \| `portrait` \| `story`. Copy lives in
the `CONCEPTS` object at the bottom of the file — edit there and the layout
reflows. To export, screenshot the page at the exact pixel size:

```bash
chrome --headless=new --hide-scrollbars --window-size=1080,1350 \
  --screenshot=out.png "http://localhost:8099/docs/ads/?v=a&f=portrait"
```

Backgrounds are the company's own photography from `assets/weekoneai.com/media/`.

---

## Facebook posts — 1200×630 (1.91:1)

In `facebook/`. Six **different compositions**, not one template with the words
swapped — a landscape frame needs its own layout, and varied art direction is
what stops a set from burning out after a few days.

| | Idea | The visual |
|---|---|---|
| 01 | `$63,000` a year in calls that rang out | the number at full height, phone photograph beside it |
| 02 | "Ring. Ring. Ring." → **We pick up.** | hard split, cobalt takes the right half |
| 03 | We answer / We qualify / We book / You work | four ruled columns, the last one cobalt |
| 04 | Live in week one. Not next quarter. | a calendar with day 07 lit |
| 05 | Your phone rings. Nobody answers. | a voice waveform in cobalt |
| 06 | The leaks you stopped counting | an itemised ledger, each line struck through |

Source is `fb.html` — `?l=1` … `?l=6` picks the layout, and `?r=square` or
`?r=portrait` re-flows the same layout to 1200×1200 or 1200×1500 if you want
the set in another placement.

```bash
chrome --headless=new --hide-scrollbars --window-size=1200,630 \
  --screenshot=out.png "http://localhost:8099/docs/ads/fb.html?l=2"
```

Layouts 1 and 2 lead with the problem, 3 and 5 with the mechanism, 4 with speed,
6 with the audit. Run one from each group first — they fail differently, which
is what tells you something.
