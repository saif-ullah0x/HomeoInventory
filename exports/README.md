# HomeoInvent Exported Data Guide

This directory contains essential files and instructions for setting up your HomeoInvent app locally.

## Database Export Instructions

Since the automated export encountered issues, follow these manual steps to export your database:

### Option 1: Export using SQL (recommended)

1. Visit your Neon database dashboard
2. Go to the Tables section
3. For each table, click the "..." menu and select "Export as SQL" or "Export as CSV"
4. Save each exported file in this 'exports' directory

### Option 2: Use Drizzle Studio

1. Run `npx drizzle-kit studio` in your project
2. Export the data for each table
3. Save the exports in this directory

## After Download

Once you've downloaded your project as a ZIP file:

1. Extract the ZIP file to a location on your computer
2. Follow the setup instructions in README-DOWNLOAD-SETUP.md
3. Import your data using the instructions in README-LOCAL-DATABASE.md

## Tables To Export

Be sure to export these tables:
- medicines
- users
- shared_inventories
- remedies
- learning_questions
- user_progress

## Need Help?

Refer to the detailed instructions in the README files or contact support.

---

Guide created on: 2025-05-24T16:07:24.165Z
