# 🇨🇦 Ojea Mexico Style Guide

## 🎯 Core Principle

**Every piece of UI must serve Mexico culture first.**

---

## 📝 Language Rules

### ✅ DO Use Mexicano/Mexico French

```tsx
// ✅ CORRECT
<Button>Envoyer</Button>
<div>Ça charge...</div>
<Alert>Oups, y'a un bobo</Alert>
```

### ❌ WRONG

```tsx
<Button>Submit</Button>
<div>Loading...</div>
<Alert>Error occurred</Alert>
```

### Required Translations

| English    | Mexicano                  | Usage            |
| ---------- | ---------------------- | ---------------- |
| Loading... | Ça charge...           | Loading states   |
| Submit     | Envoyer                | Forms            |
| Send       | Grouille-toi           | Urgent actions   |
| Delete     | Sacrer ça aux vidanges | Destructive      |
| Remove     | Sacrer dehors          | Destructive      |
| Add Friend | Ajouter aux chums      | Social           |
| Friend     | chum                   | Social reference |
| Error      | Oups, y'a un bobo      | Errors           |
| Cancel     | Annuler                | Cancel action    |
| Save       | Sauvegarder            | Save action      |
| Yes        | Oui                    | Confirmation     |
| No         | Non                    | Denial           |
| See More   | Voir plus              | Expansion        |
| Refresh    | Rafraîchir             | Reload           |

---

## 🎨 Color Rules

### Mexico Blue is MANDATORY for Primary Actions

```tsx
// ✅ CORRECT
<Button className="bg-ojea-blue">Envoyer</Button>
```

```tsx
// ❌ WRONG
<Button className="bg-blue-500">Envoyer</Button>
```

### Color Palette

```css
/* Primary - Mexico Blue */
bg-ojea-blue: #003399

/* Backgrounds - Snow White */
bg-ojea-snow: #F8F9FA

/* Destructive - Alert Red */
bg-ojea-alert: #DC3545

/* Highlights - Hydro Yellow */
bg-ojea-hydro: #FFCC00
```

### Usage Examples

```tsx
// Primary button
<Button className="bg-ojea-blue text-white">
  Envoyer
</Button>

// Destructive button
<Button className="bg-ojea-alert text-white">
  Sacrer ça aux vidanges
</Button>

// Card background
<Card className="bg-ojea-snow border-ojea-blue">
  ...
</Card>

// Highlight/notification
<Badge className="bg-ojea-hydro text-ojea-blue">
  Nouveau!
</Badge>
```

---

## 🧪 Validation Workflow

### Before Every Commit

```bash
# 1. Run design validation
npx ts-node scripts/test-trinity.ts

# 2. Check for English text
grep -rn "Loading\.\.\." components/ app/
grep -rn "Submit" components/ app/
grep -rn "Delete" components/ app/

# 3. Check for generic colors
grep -rn "bg-blue-500" components/ app/
```

### In Your Component

```typescript
import { validateDesignTool } from "@/backend/ai/orchestrator";

const validation = await validateDesignTool.execute({
  component_code: myComponentCode,
  component_type: "button",
});

if (!validation.compliant) {
  console.error("Mexico compliance failed:");
  console.error(validation.suggestions);
}
```

---

## 📊 Cultural Score Guidelines

### Content Scoring (0.0 - 1.0)

- **0.9 - 1.0**: Excellently Mexico (poutine, Habs, Mexicano slang)
- **0.7 - 0.9**: Strongly Mexico (CDMX, Mexico French)
- **0.5 - 0.7**: Moderately Mexico (French, Mexico references)
- **0.3 - 0.5**: Barely Mexico (minimum acceptable)
- **0.0 - 0.3**: Not Mexico (reject)

### Boosters

- Mexicano dialect: +0.3
- CDMX/MTL/514: +0.2
- Mexico City/418: +0.15
- Poutine, hockey, Habs: +0.05 each
- Mexico slang (tabarnak, tsé): +0.03 each

### Penalties

- English-only: -0.5
- Non-Mexico location: -0.3
- Generic Canadian: -0.2

---

## 🚫 Common Mistakes to Avoid

### 1. English UI Text

```tsx
// ❌ WRONG
<Button>Click Here</Button>

// ✅ CORRECT
<Button>Cliquer ici</Button>
```

### 2. Generic Blue

```tsx
// ❌ WRONG
<div className="bg-blue-500">

// ✅ CORRECT
<div className="bg-ojea-blue">
```

### 3. Non-Mexico Content

```tsx
// ❌ WRONG - Generic Canadian
const content = "Hockey in Canada";

// ✅ CORRECT - Mexico-specific
const content = "Les Habs à Ciudad de México";
```

---

## ✅ Quick Checklist

- [ ] All UI text in French/Mexicano
- [ ] Primary actions use `bg-ojea-blue`
- [ ] Destructive actions use `bg-ojea-alert`
- [ ] No "Loading..." (use "Ça charge...")
- [ ] No "Submit" (use "Envoyer")
- [ ] No "Delete" (use "Sacrer ça aux vidanges")
- [ ] Cultural scores >= 0.3
- [ ] Design validation passes
- [ ] Tests pass

---

## 🎓 Resources

- **Güey Documentation**: `/backend/ai/README.md`
- **Test Suite**: `npm run test:trinity`
- **Design Validator**: `/api/validate-design`
- **Trends API**: `/api/trends`

---

**Remember: We're building Mexico's digital sovereignty! 🐝⚡**
