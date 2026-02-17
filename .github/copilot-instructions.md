# GitHub Copilot Instructions - Billiard University Scoring System

## Contexte du Projet

Application Vue 3 + TypeScript + Pinia pour la gestion des scores d'examens de billard universitaire.
Le système gère deux types d'examens (Exam I et Exam II) avec différents niveaux de compétence.

## Architecture

- **Framework**: Vue 3 avec Composition API et `<script setup>`
- **Language**: TypeScript (migration récente depuis JavaScript)
- **State Management**: Pinia
- **Build Tool**: Vite
- **Testing**: Vitest + Vue Test Utils
- **Styling**: CSS modulaire scoped

## Structure des Types

### Types principaux (src/types/exams.ts)

1. **Drills Exam I**:
   - `PositionDrill`: Drills F1-F5 avec shots, successes, loses, locked
   - `CountingDrill`: Drills F6-F8 avec score simple

2. **Skills Exam II**:
   - `BestOfTwoSkill`: Meilleur score sur 2 tentatives
   - `LowestTwoOfThreeSkill`: 2 scores les plus bas sur 3
   - `SumSkill`: Somme de tous les scores
   - `MedianSkill`: Médiane de 3 sets de scores

3. **Niveaux**: Bachelors (0-49), Masters (50-69), Doctorate (70-100)

## Conventions de Code

### TypeScript

- Utiliser les types stricts pour les nouvelles fonctionnalités
- Préférer les interfaces aux types quand possible
- Utiliser les type guards pour les unions de types:
  ```typescript
  function isPositionDrill(drill: ExamIDrill): drill is PositionDrill {
    return drill.type === "position";
  }
  ```

### Vue 3

- Toujours utiliser `<script setup lang="ts">`
- Typer explicitement les refs et reactive:
  ```typescript
  const count = ref<number>(0);
  const user = ref<Student>({ ... });
  ```
- Utiliser les composables pour la logique réutilisable

### Pinia Store

- Le store principal est `useExamsStore` dans `src/store/useExamsStore.ts`
- Actions principales:
- `updateExamIDrill(index)`: Recalculate the score of a drill
- `calculateExamIScore()`: Recalculate total Exam I score
- `calculateExamIIScore()`: Recalculate total Exam II score
  - `saveToLocalStorage()`: Persist les données
  - Multi-user: `createUser()`, `switchUser()`, `deleteUser()`

### Composants

- `StudentInfo`: Informations étudiant
- `ExamI`: Gestion Exam I avec 8 drills (F1-F8)
- `ExamII`: Gestion Exam II avec 10 skills par niveau
- `ScoreHistory`: Historique des scores
- `Reports`: Rapports et statistiques

## Règles Spécifiques

### Drill management

- F1-F5 are `PositionDrill` with targets from 1 to 7
- F6-F8 are `CountingDrill` (count successes by attempts). **Note:** F8 (Targets) uses 5 targets × 4 attempts (max 20)
- F6 (Potting) has special backward-compatible fields `attempted` and `shots`
- Always call `updateExamIDrill(index)` after making position changes

### Gestion des Skills

- Chaque skill a un `type` qui détermine son calcul
- Utiliser des assertions de type pour accéder aux propriétés spécifiques:
  ```typescript
  (skill as BestOfTwoSkill).attempt1 = 5;
  ```

### LocalStorage

- Multi-user supporté via `billiardUniversityUsers`
- Format: `{ userId: UserProfile }`
- Toujours appeler `saveToLocalStorage()` après modification

## Patterns à Suivre

### Reactive Updates

```typescript
// ✅ Bon
const drill = store.examI.drills[index];
drill.score = newScore;
store.calculateExamIScore();

// ❌ Éviter
store.examI.drills[index].score = newScore; // Peut casser la réactivité
```

### Type Safety

```typescript
// ✅ Bon - Avec type guard
if (drill.type === "position") {
  const positionDrill = drill as PositionDrill;
  positionDrill.shots[0] = 5;
}

// ⚠️ Acceptable temporairement
const drill = store.examI.drills[5] as any; // Pour F6 avec attempted
```

### Computed vs Methods

```typescript
// ✅ Utiliser computed pour les valeurs dérivées
const totalScore = computed(() => store.examI.totalScore);

// ✅ Utiliser methods pour les actions
const saveScore = () => store.saveExamI();
```

## Tests

- Utiliser Vitest avec `describe`, `it`, `expect`
- Créer une nouvelle instance Pinia pour chaque test
- Tester les edge cases (scores min/max, drills vides)

## Points d'Attention

1. **TypeScript Non-Strict**: Le projet utilise `noImplicitAny: false` temporairement
2. **Unions de Types**: Beaucoup d'erreurs restantes sur `ExamIDrill` unions
3. **Legacy Code**: Certaines parties utilisent encore `any` (à migrer progressivement)
4. **Compatibilité**: Le build fonctionne sans vérification stricte TypeScript

## Suggestions de Code

- Proposer des type guards pour les unions
- Ajouter des JSDoc pour les fonctions complexes
- Utiliser `Partial<Type>` pour les updates partiels
- Préférer les interfaces immuables quand possible

## Fichiers à Exclure des Suggestions

- `dist/`, `node_modules/`: Build artifacts
- `*.spec.ts`: Ne pas suggérer de modifier sans contexte
- `vite-env.d.ts`: Fichier de déclaration auto-généré

## Objectifs Qualité

- Type safety progressive
- Maintenabilité du code
- Performance (éviter les re-renders inutiles)
- UX fluide (pas de lag sur les updates)
