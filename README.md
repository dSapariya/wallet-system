# Wallet System

A simple web application for managing personal wallet transactions, built with Vue 3 and Pinia.

## Live Demo

You can access the live application here: [https://wallet-system-theta.vercel.app/](https://wallet-system-theta.vercel.app/)

Note: Backend service is hosted on a free hosting service, so it may take 1–2 minutes to load the first time.

## Technologies Used

*   **Vue 3**: A progressive JavaScript framework for building user interfaces.
*   **Pinia**: A lightweight and powerful state management library for Vue.
*   **VeeValidate**: Form validation library for Vue.js.
*   **SweetAlert2**: A beautiful, responsive, customizable, and accessible (ARIA friendly) replacement for JavaScript's popup boxes. Used for toast notifications.
*   **Axios**: Promise-based HTTP client for the browser and Node.js.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
*   **Vitest**: A blazing fast unit test framework powered by Vite.
*   **Day.js**: A minimalist JavaScript library that parses, validates, manipulates, and displays dates and times for modern browsers with a largely Moment.js-compatible API.
*   **SweetAlert2**: Implemented auto-dismissing toast notifications using SweetAlert2 to provide users with quick feedback messages

## Features

*   **Wallet Setup**: Users can set up their initial wallet with a name and an optional initial balance.
*   **Transaction Management**:
    *   Add credit and debit transactions with descriptions.
    *   View a history of all transactions.
*   **Balance Tracking**: Real-time display of the current wallet balance.
*   **Transaction Filtering & Sorting**:
    *   Filter transactions by items per page.
    *   Sort transactions by date or amount in ascending or descending order.
*   **CSV Export**: Export all transactions to a CSV file.
*   **Responsive Design**: The application interface is designed to be responsive across various screen sizes (mobile, tablet, desktop).
*   **Robust Error Handling**:
    *   Validation for transaction amounts (positive numbers, decimal places, min/max values).
    *   Automatic redirection to wallet setup if stored wallet ID is invalid or backend data fetch fails.

## Project Setup

To set up and run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd wallet-system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or using yarn
    # yarn install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory based on `env.example`. You'll need to configure your backend API URL.
    ```
    VITE_APP_API_BASE_URL=http://localhost:3000/api
    ```
    *Note: Replace `http://localhost:3000/api` with your actual backend API URL.*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or using yarn
    # yarn dev
    ```
    The application will typically be available at `http://localhost:5173`.

5.  **Build for production:**
    ```bash
    npm run build
    # or using yarn
    # yarn build
    ```

## Running Tests

Unit tests are written using Vitest. To run the tests:

```bash
npx vitest run
```

## Project Structure

The project follows a standard Vue.js and Vite structure, with logical separation of concerns:

```
wallet-system/
├── public/                 # Static assets
├── src/
│   ├── App.vue             # Main Vue component
│   ├── components/         # Reusable Vue components
│   │   ├── TransactionForm.vue
│   │   ├── WalletSetup.vue
│   │   └── WalletSummary.vue
│   ├── config/             # Configuration files (e.g., storage keys)
│   │   └── index.ts
│   ├── main.ts             # Main entry point for Vue application
│   ├── plugins/            # Vue plugins (e.g., validation rules, notifications)
│   │   ├── notification.ts
│   │   ├── validation.ts
│   │   └── __tests__/      # Test files for plugins
│   │       └── validation.spec.ts
│   ├── router/             # Vue Router configuration
│   │   └── index.ts
│   ├── services/           # API service and related types
│   │   ├── api.ts
│   │   └── __tests__/      # Test files for services
│   │       └── api.spec.ts
│   ├── stores/             # Pinia stores for state management
│   │   ├── useWalletStore.ts
│   │   └── __tests__/      # Test files for stores
│   │       └── useWalletStore.spec.ts
│   ├── style.css           # Global CSS styles
│   ├── views/              # Main view components (pages)
│   │   ├── TransactionsTable.vue
│   │   └── WalletSetup.vue
│   └── vite-env.d.ts       # Vite environment type definitions

```
