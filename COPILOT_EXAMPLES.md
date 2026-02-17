# Exemples Copilot - Billiard University

Ce fichier contient des exemples de prompts et patterns pour tirer le meilleur parti de GitHub Copilot dans ce projet.

## 🎯 Prompts Efficaces dans Copilot Chat

### Créer un nouveau composant Vue

```
@workspace Créer un composant Vue 3 TypeScript pour afficher les statistiques d'un étudiant avec les props: studentName (string), totalScore (number), level (ExamIILevel). Utiliser le style du projet avec des classes CSS scoped.
```

### Ajouter une nouvelle action au store

```
@workspace Ajouter une action au store Pinia pour calculer la moyenne des scores d'un drill spécifique. La fonction doit prendre l'index du drill en paramètre et retourner la moyenne. Ajouter JSDoc et typage TypeScript.
```

### Corriger un problème de type

```
@workspace J'ai une erreur TypeScript sur examI.drills[index]. Comment utiliser un type guard pour vérifier si c'est un PositionDrill avant d'accéder à la propriété 'shots' ?
```

### Générer des tests

```
@workspace Générer des tests Vitest pour la fonction calculateSkillScore() du store. Tester tous les types de skills: BestOfTwo, LowestTwoOfThree, Sum, Median.
```

## 💡 Patterns Copilot

### Pattern 1: Créer un type guard

**Comment**: Tapez un commentaire puis laissez Copilot compléter

```typescript
// Type guard to check if a drill is a PositionDrill
function isPositionDrill(drill: ExamIDrill): drill is PositionDrill {
  // Copilot suggérera: return drill.type === 'position';
}
```

### Pattern 2: Créer une action Pinia typée

**Comment**: Commencez par la JSDoc, Copilot complètera la fonction

```typescript
/**
 * Updates a skill score and recalculates total
 * @param skillIndex - Index of the skill (0-9)
 * @param newScore - New score value
 */
updateSkillScore(skillIndex: number, newScore: number) {
  // Copilot suggérera la logique appropriée
}
```

### Pattern 3: Computed property Vue 3

**Comment**: Tapez le nom et le type, Copilot fait le reste

```typescript
const filteredDrills = computed<PositionDrill[]>(() => {
  // Copilot suggérera: return store.examI.drills.filter(d => d.type === 'position') as PositionDrill[];
});
```

### Pattern 4: Gestion d'événements Vue

**Comment**: Dans le template, Copilot suggère les bons types

```vue
<template>
  <button @click="handleClick">
    <!-- Copilot suggérera le bon handler -->
  </button>
</template>

<script setup lang="ts">
const handleClick = (event: MouseEvent) => {
  // Copilot connaît le type de l'événement
};
</script>
```

## 🚀 Cas d'Usage Avancés

### 1. Ajouter un nouveau type de drill

**Prompt Copilot Chat**:

```
@workspace Je veux ajouter un nouveau type de drill appelé "ComboTest" qui combine position et comptage. Le drill doit avoir:
- Un tableau de positions cibles (comme PositionDrill)
- Un score total (comme CountingDrill)
- Une propriété 'combo' boolean

Aide-moi à:
1. Ajouter l'interface dans src/types/exams.ts
2. Mettre à jour l'union ExamIDrill
3. Ajouter la logique de calcul dans le store
4. Créer un composant pour l'afficher
```

### 2. Implémenter une nouvelle fonctionnalité d'export

**Prompt Copilot Chat**:

```
@workspace Créer une fonction d'export PDF qui génère un rapport complet avec:
- Informations étudiant
- Scores Exam I détaillés par drill
- Scores Exam II par skill
- Graphiques de progression

Utiliser une bibliothèque compatible TypeScript. Ajouter la fonction au store et un bouton dans le composant Reports.
```

### 3. Améliorer la validation des données

**Prompt Copilot Chat**:

```
@workspace Ajouter une validation stricte pour tous les inputs de scores. Les règles sont:
- F1-F5: positions 1-7 uniquement
- F6-F7: counting drills (10 targets). **F8:** uses 5 targets × 4 attempts (max 20). Ensure scores <= maxScore
- Skills: respecter les limites par type

Créer un composable useValidation.ts avec des fonctions de validation typées.
```

## 📝 Snippets Intelligents

### Snippet pour action de store avec sauvegarde

Tapez: `// action that saves to localStorage`

Copilot suggérera:

```typescript
actionName(param: Type) {
  // Logic here
  this.calculateExamIScore();
  this.saveToLocalStorage();
}
```

### Snippet pour computed avec store

Tapez: `// computed from store`

Copilot suggérera:

```typescript
const computed = computed(() => store.examI.totalScore);
```

### Snippet pour watcher avec deep

Tapez: `// watch store changes deeply`

Copilot suggérera:

```typescript
watch(
  () => store.examI.drills,
  (newDrills) => {
    // Handle changes
  },
  { deep: true }
);
```

## 🔍 Debugging avec Copilot

### Analyser une erreur TypeScript

```
@workspace J'ai cette erreur TypeScript: "Property 'shots' does not exist on type 'ExamIDrill'".
Contexte: Je veux accéder aux shots d'un drill à l'index 5.
Comment résoudre ça proprement avec un type guard ?
```

### Optimiser les performances

```
@workspace Mon composant ExamI re-render trop souvent. Analyse le code et suggère des optimisations avec computed, memo, ou shallowRef pour améliorer les performances.
```

### Refactoring

```
@workspace La fonction calculateExamIScore() est trop longue (200+ lignes). Propose un refactoring en sous-fonctions plus petites et testables, tout en gardant le typage TypeScript strict.
```

## 🎨 Styling avec Copilot

### Créer un thème cohérent

```
@workspace Créer un fichier theme.css avec des variables CSS pour les couleurs utilisées dans l'app:
- Bachelors: bleu (#1976d2)
- Masters: orange (#f57c00)
- Doctorate: rose (#c2185b)
- Success, warning, error states

Utiliser des variables CSS modernes.
```

### Component styling

Tapez dans `<style scoped>`:

```css
/* Responsive grid layout for drill cards */
```

Copilot suggérera un grid CSS adapté au projet.

## 🧪 Tests avec Copilot

### Générer suite de tests complète

```
@workspace Générer une suite de tests Vitest complète pour le composant StudentInfo.vue:
- Test du rendu initial
- Test de l'update des données
- Test de la sauvegarde
- Test des validations
- Mocking du store Pinia
```

### Tests edge cases

```
@workspace Générer des tests pour les cas limites de calculateSkillScore():
- Scores négatifs
- Scores > maxScore
- Arrays vides
- undefined/null values
- Tous les types de skills
```

## 📚 Documentation

### Générer README pour un composant

```
@workspace Créer un README.md détaillé pour le composant ExamII.vue expliquant:
- Les props et leur types
- Les événements émis
- La logique des différents types de skills
- Des exemples d'utilisation
- Les dépendances du store
```

### Générer JSDoc complet

```
@workspace Ajouter des commentaires JSDoc détaillés pour toutes les fonctions publiques du fichier src/types/exams.ts. Inclure @example pour les types complexes.
```

## 🎓 Tips & Tricks

### 1. Contexte @workspace

Toujours utiliser `@workspace` pour que Copilot comprenne le contexte du projet entier.

### 2. Soyez spécifique

Au lieu de "créer un composant", dire "créer un composant Vue 3 TypeScript avec Composition API et props typées".

### 3. Références aux fichiers

Mentionnez les fichiers existants: "Dans src/store/useExamsStore.ts, ajouter..."

### 4. Exemples de code

Donnez des exemples de ce que vous voulez: "Comme dans StudentInfo.vue mais pour..."

### 5. Itération

N'hésitez pas à affiner: "Modifie le code précédent pour aussi gérer le cas où..."

---

Avec ces patterns et exemples, vous pouvez utiliser GitHub Copilot de manière optimale dans ce projet !
