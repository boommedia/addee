# Notion Update Checklist — Hybrid Rankings Feature

**Update these Notion pages to reflect the new hybrid rankings architecture**

---

## Pages to Update

### 1. Features List / Product Roadmap
**Find:** Any mention of "Rankings Tracker" or "Keyword Rankings"

**Update text to:**
```
Rankings Tracker
- Basic rankings (GSC + DataForSEO): Available to all users
- LocalFalcon grid data: Agency+ tier exclusive ($149-$299/mo)
- Includes: ARP, SoLV, ATRP, competitive analysis
- Status: Live ✅
```

### 2. Pricing Tiers / Features Matrix
**Find:** Table or grid showing tier features

**Add row:**
| Feature | Free | Starter | Growth | Agency | Agency Max |
|---------|------|---------|--------|--------|------------|
| Keyword Rankings (GSC + DataForSEO) | ✅ | ✅ | ✅ | ✅ | ✅ |
| LocalFalcon Grid Rankings | ❌ | ❌ | ❌ | ✅ | ✅ |

### 3. Add-ons / Premium Features
**Find:** Any reference to "Rankings add-on" or "$8/mo rankings"

**Update to:**
```
LocalFalcon Grid Rankings
- Tier: Agency + Agency Max only
- Includes: ARP, SoLV, ATRP, geographic grid data
- Use case: Multi-location SEO, local business rankings
- Integrated into Analytics → Rankings tab
```

### 4. Analytics Dashboard Documentation
**Find:** Analytics feature description

**Add bullet point:**
```
- Basic Rankings: Keyword positions from GSC + DataForSEO (all users)
- LocalFalcon Rankings: Grid-based local search data (Agency+ only)
- Switch between views in the Rankings tab
```

### 5. Tier Comparison Page
**Find:** Feature comparison between tiers

**For Agency tier:**
- ✅ Local Falcon rankings integration
- ✅ Grid-based competitive analysis
- ✅ Location-specific ranking tracking

**For Free/Starter/Growth:**
- ✅ Basic keyword rankings (GSC + DataForSEO)
- ❌ LocalFalcon grid data

---

## Key Messages to Emphasize

- **"All users get keyword rankings"** — Emphasize the GSC + DataForSEO data is included
- **"LocalFalcon is Agency+ exclusive"** — Clear tier gate for local search grid data
- **"Hybrid approach"** — Basic + premium works together
- **"No locked features in basic"** — GSC + DataForSEO are fully functional, LocalFalcon is the premium add-on

---

## Files in Codebase

These files are already updated on production:
- ✅ `src/app/tools/page.tsx` — Tools list badge changed to "Agency+"
- ✅ `src/app/home/page.tsx` — Features list and upgrade features updated
- ✅ `src/app/features/page.tsx` — Metadata updated
- ✅ `src/app/api/local-falcon/scans/route.ts` — Plan gate added (403 for non-agency)
- ✅ `src/app/analytics/RankingsTab.tsx` — Already gated, displays both sections

---

## Links to Share

- Live site: https://www.bloggy.online/analytics?tab=rankings
- Tools page: https://www.bloggy.online/tools
- Features: https://www.bloggy.online/features
