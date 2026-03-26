# Expense Tracker

## Project Name

**Expense Tracker** — A lightweight personal finance management web app.

## Problem Statement

Tracking day-to-day spending is essential for financial awareness, yet many individuals rely on mental notes or scattered spreadsheets that are easy to forget and hard to analyze. There is a need for a simple, accessible tool that allows users to quickly log expenses, categorize them, and visualize spending patterns — all without the complexity of full-fledged budgeting software.

## Target Users

- Individuals looking to track and manage their personal spending habits.
- Students and young professionals who want a simple, no-setup expense logger.
- Anyone who needs a quick overview of where their money goes each month.

## Features List

1. **Expense CRUD** — Add, view, and delete expense entries with description, amount, category, and date.
2. **Category System** — Seven predefined categories (Food, Transport, Housing, Health, Entertainment, Shopping, Other) with color-coded badges for quick identification.
3. **Dashboard Metrics** — Real-time summary cards showing Total spent, Current month spending, and Entry count.
4. **Filtering** — Filter the expense list by category and/or month for targeted analysis.
5. **Data Visualization** — Bar charts for category-wise spending comparison and a donut pie chart for proportional category breakdown.
6. **CSV Export** — One-click export of all expense data to a CSV file for external use.
7. **Dark/Light Mode** — Automatic theming based on the user's system preference.

## Tech Stack Used

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| **Frontend** | React 19                                |
| **Build**    | Vite 8                                  |
| **Styling**  | Vanilla CSS with CSS custom properties  |
| **Database** | Supabase (PostgreSQL + PostgREST API)   |
| **Hosting**  | Vercel                                  |

## Hosting Platform

The application is deployed on **Vercel** with continuous deployment from the GitHub repository.

🔗 **Live URL**: [expense-tracker-beta-inky.vercel.app](https://expense-tracker-beta-inky.vercel.app/)
