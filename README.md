# Voosh Assignment – Data Pipeline & Dashboard

## Project Overview

This project is a simple end-to-end data pipeline built as part of an assignment.
It fetches product data from a public API, cleans and transforms the data, stores it in a PostgreSQL database, and displays it on a React dashboard.

The focus of this project is **reliability, rerun safety, and visibility**, rather than UI design.

---

## Tech Stack

* **Node.js** – Data pipeline and backend API
* **PostgreSQL** – Data storage
* **React** – Dashboard
* **Express.js** – API layer

---

## Step 1: Create Node.js API

The project starts with setting up a Node.js application.

```bash
npm init
```

This command creates a `package.json` file and initializes the project with default settings.

During setup:

* Project name: `vooshassignment`
* Entry file: `Vooshfoods.js`
* Description: Fetch data from API and store it in the database

After initialization, required dependencies are installed using:

```bash
npm install
```

---

## Data Pipeline Flow

The data pipeline follows these steps:

1. **Fetch Data**
   Product data is fetched from the Fake Store public API.

2. **Transform Data**
   Before saving to the database, the data is cleaned and normalized:

   * Renamed `id` to `product_id`
   * Converted `category` to lowercase
   * Added a calculated field `price_inr`
   * Flattened the nested `rating` object
   * Added a timestamp (`created_at`)
   * Handled missing or null rating values safely

3. **Store Data**
   Transformed data is stored in PostgreSQL using **UPSERT** logic to avoid duplicates.

4. **Monitoring**

   * Tables are created automatically when the pipeline starts using
     `CREATE TABLE IF NOT EXISTS`
   * Pipeline run status (OK / FAILED) is recorded
   * Errors are logged for debugging and visibility

This approach makes the pipeline **self-healing**, safe to rerun, and suitable for fresh deployments.

---

## Database Initialization

When the Node.js pipeline starts, it automatically checks and creates the required database tables if they do not exist.
This ensures:

* No manual database setup is required
* The application works across environments
* The pipeline can run safely multiple times

---

## React Dashboard

The React dashboard displays:

* Product data from the database
* Aggregate metrics such as total products and average price
* Pipeline status (last run time and success/failure)

The dashboard consumes data from a **Node.js API**, which reads from PostgreSQL.
This separation between frontend and database improves **security, scalability, and production readiness**.

---

## Improvements & Scalability (Future Work)

If this system were used in production:

* The pipeline could be scheduled using cron or a cloud scheduler
* Alerts could be added for pipeline failures
* Pagination and caching could be added to the API
* Authentication could be added to the dashboard

---

## Conclusion

This project demonstrates a complete data pipeline with:

* Reliable data ingestion
* Clean transformation logic
* Safe database storage
* Monitoring and visibility
* A simple but functional dashboard
