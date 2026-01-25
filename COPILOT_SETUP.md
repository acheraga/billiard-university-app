# Configuration GitHub Copilot

Ce projet est optimisé pour une utilisation optimale avec GitHub Copilot.

## 📁 Fichiers de configuration créés

### 1. `.github/copilot-instructions.md`
Instructions complètes pour Copilot avec :
- Architecture du projet
- Conventions de code TypeScript/Vue
- Patterns à suivre
- Exemples de bonnes pratiques
- Points d'attention spécifiques au projet

### 2. `.copilotignore`
Exclusion des fichiers inutiles pour le contexte :
- Build outputs (dist/, node_modules/)
- Assets binaires (images, PDFs)
- Lock files
- Fichiers générés

### 3. `.vscode/settings.json`
Configuration VS Code optimisée :
- Autocomplétion Copilot activée
- Format automatique à la sauvegarde
- Type checking TypeScript
- Instructions personnalisées pour Copilot Chat
- Import suggestions automatiques

### 4. `.vscode/extensions.json`
Extensions recommandées :
- GitHub Copilot
- GitHub Copilot Chat
- Vue - Official (Volar)
- ESLint, Prettier
- Error Lens (visualisation des erreurs)

## 🚀 Utilisation optimale

### Copilot Chat - Instructions personnalisées

Les instructions suivantes sont automatiquement appliquées dans Copilot Chat :

1. **TypeScript strict** : Toujours typer explicitement
2. **Vue 3 Composition API** : `<script setup lang="ts">`
3. **Type guards** : Pour les unions de types (PositionDrill vs CountingDrill)
4. **JSDoc** : Documenter les fonctions complexes
5. **Pinia Store** : Utiliser `useExamsStore` pour l'état global

### Commandes Copilot utiles

```
# Dans Copilot Chat
/explain - Expliquer le code sélectionné
/fix - Corriger les erreurs
/tests - Générer des tests
/doc - Générer la documentation

# Avec le contexte du projet
@workspace Comment implémenter un nouveau drill ?
@workspace Comment ajouter un nouveau skill ?
```

### Raccourcis clavier

- `Ctrl+I` (ou `Cmd+I`) : Ouvrir Copilot Chat inline
- `Tab` : Accepter la suggestion Copilot
- `Alt+]` : Suggestion suivante
- `Alt+[` : Suggestion précédente
- `Ctrl+Enter` : Voir toutes les suggestions

## 📝 Documentation améliorée

### JSDoc ajoutée au store

Toutes les actions principales du store Pinia sont maintenant documentées avec JSDoc :

```typescript
/**
 * Recalcule le score d'un drill de position basé sur les succès et échecs
 * @param index - Index du drill dans examI.drills (0-7)
 */
updateExamIDrill(index: number)

/**
 * Détermine le niveau Exam II en fonction du score Exam I
 * @param score - Score total de l'Exam I (0-100)
 * @returns Niveau recommandé: Bachelors, Masters, ou Doctorate
 */
getExamIILevel(score: number): ExamIILevel
```

### Avantages

✅ **IntelliSense amélioré** : Documentation visible au survol  
✅ **Suggestions Copilot plus précises** : Comprend mieux le contexte  
✅ **Autocomplétion intelligente** : Types et paramètres suggérés  
✅ **Moins d'erreurs** : Validation en temps réel  

## 🎯 Bonnes pratiques

### Type Guards pour les unions

```typescript
// ✅ Bon - Copilot comprendra le contexte
if (drill.type === 'position') {
  const positionDrill = drill as PositionDrill;
  positionDrill.shots[0] = 5;
}
```

### Computed vs Methods

```typescript
// ✅ Copilot suggérera le bon pattern
const totalScore = computed(() => store.examI.totalScore);
const saveScore = () => store.saveExamI();
```

### Gestion des Skills

```typescript
// ✅ Copilot suggérera l'assertion de type appropriée
(skill as BestOfTwoSkill).attempt1 = 5;
```

## 🔧 Personnalisation

Pour adapter les instructions Copilot à vos besoins :

1. Modifiez `.github/copilot-instructions.md`
2. Ajoutez vos propres patterns dans `github.copilot.chat.codeGeneration.instructions`
3. Mettez à jour `.copilotignore` selon vos besoins

## 📚 Ressources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Copilot Chat Commands](https://docs.github.com/en/copilot/using-github-copilot/getting-started-with-github-copilot-chat)
- [Vue 3 + TypeScript](https://vuejs.org/guide/typescript/overview.html)
- [Pinia TypeScript](https://pinia.vuejs.org/core-concepts/#typescript)

---

Configuration créée le 25 janvier 2026
