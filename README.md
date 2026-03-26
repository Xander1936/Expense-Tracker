# Expense Tracker

🔗 **Live Demo**: [expense-tracker-beta-inky.vercel.app](https://expense-tracker-beta-inky.vercel.app/)

A modern, responsive Expense Tracker built with **React** and **Vite**, featuring persistent storage via **Supabase**.


## Features

- **Dashboard**: High-level metrics for Total spent, Current month, and Entry count.
- **Add Expense**: Easily record new expenses with descriptions, amounts, categories, and dates.
- **Categorization**: Auto-categorized expenses with color-coded badges (Food, Transport, Housing, etc.).
- **Filtering**: Filter your transaction history by category or month.
- **Data Visualization**:
  - Bar charts for spending trends by category.
  - Interactive Pie chart for category breakdown.
- **Persistence**: Fully integrated with Supabase for real-time data storage.
- **Export**: Export your expense history to a CSV file.
- **Theming**: Modern Light and Dark mode support using CSS variables.

## Usage

1. **Dashboard Overview**: Upon launching the app, you'll see your total spending metrics at the top. These refresh automatically as you manage your expenses.
2. **Adding an Expense**: Enter the description, amount ($), category, and date in the "Add expense" section and click **Add expense**. The record will be instantly saved to Supabase.
3. **Viewing Historical Data**: Scroll down to the "All expenses" section to see a list of your transactions.
4. **Filtering**: Use the category dropdown or the month selector to quickly find specific expenses.
5. **Analytics**: Switch to the **Charts** tab to view your spending distribution across different categories through bar and pie charts.
6. **Deleting**: Click the `×` button next to any expense item to remove it from the database.
7. **Data Export**: Click the **Export CSV** button in the header to download a complete record of your expenses.

## Project Structure

- `src/App.jsx`: Main application logic and UI components.
- `src/App.css`: Application-specific styling.
- `src/index.css`: Global styles, typography, and theme variables.
- `src/supabaseClient.js`: Connection setup for Supabase.

## Getting Started

1. **Clone the repository**
2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Ensure you have a `.env` file in the root directory with the following keys:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**:

   ```bash
   npm run dev
   ```

5. **Build for production**:

   ```bash
   npm run build
   ```

## Migration Note

This project was originally designed as a single-file HTML demo (`expense_tracker_app.html`) and has been refactored into a scalable React application to support persistence and modern web best practices.
