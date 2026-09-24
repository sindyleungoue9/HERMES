g# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # HERMES - Portail employe M.B.S.S.

  HERMES est un portail interne de gestion des demandes de cotation (RFQ) pour
  M.B.S.S. Sarl, base a Douala au Cameroun. Il aide l'equipe commerciale a
  importer les demandes clients, retrouver les produits du catalogue et preparer
  les devis destines aux navires.

  ## Fonctionnalites

  - Connexion employe et parcours de recuperation du mot de passe en trois etapes.
  - Tableau de bord avec les RFQ assignees, les indicateurs d'activite et les actions rapides.
  - Import de RFQ depuis un fichier Excel, Word ou PDF.
  - Simulation de l'extraction des lignes et classement des produits : correspondants,
    incertains ou non repertories.
  - Ajout manuel de produits et import d'une source complementaire.
  - Preparation d'une cotation finale avec marge, remise et frais de livraison.
  - Consultation des demandes RFQ, des produits et prix, des devis envoyes et de l'historique.
  - Profil employe avec preferences d'affichage en mode clair ou sombre.
  - Interface francaise et anglaise sur l'ecran de connexion.

  ## Technologies

  - React 19 et TypeScript
  - Vite
  - Tailwind CSS 4
  - ESLint

  ## Installation

  Prerequis : Node.js et npm.

  ```bash
  npm install
  ```

  ## Demarrage en developpement

  ```bash
  npm run dev
  ```

  Vite affiche ensuite l'adresse locale dans le terminal, generalement
  `http://localhost:5173`.

  ## Commandes disponibles

  ```bash
  npm run dev       # Lance le serveur de developpement
  npm run build     # Verifie TypeScript et genere la version de production
  npm run lint      # Execute ESLint
  npm run preview   # Sert la version de production localement
  ```

  ## Organisation du projet

  ```text
  src/
    App.tsx                         # Connexion et recuperation de compte
    components/EmployeeDashboard.tsx # Tableau de bord et parcours RFQ
    assets/                         # Logo et visuels M.B.S.S.
    App.css                         # Styles complementaires
    index.css                       # Configuration Tailwind et theme
  ```

  ## Etat actuel

  Le projet constitue actuellement une maquette fonctionnelle frontend. Les
  actions de connexion, d'import, d'extraction, de telechargement et d'envoi
  d'e-mail sont simulees dans l'interface. La prochaine etape d'integration sera
  de relier ces parcours a une API, une base de donnees, un vrai service
  d'authentification et les services de generation de documents.
