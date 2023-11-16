# How To run this project in your local environment

This guide will walk you through the steps to run a Laravel project that is hosted on GitHub. Ensure that you have Composer and PHP installed on your system before proceeding.

## Step 1: Clone the Repository

Open a terminal and navigate to the directory where you want to clone the project. Run the following command:

```bash
git clone https://github.com/Zakilhg/PitchKit.git
```

## Step 2: Install Dependencies
Navigate into the project directory:
```bash
cd repository
```

Use Composer to install the project dependencies:
```bash
composer install
```

## Step 3: Configure Environment
Copy the .env.example file to create a new .env file:
```bash
cp .env.example .env
```

Open the .env file and configure your database settings and any other necessary environment variables.
```bash
nano .env
```
Save and close the file.

## Step 4: Generate Application Key
Generate the application key using Artisan:
```bash
php artisan key:generate
```

## Step 5: Run Migrations
Run the database migrations to create tables:
```bash
php artisan migrate
```

## Step 6: Serve the Application
Use the following command to start the development server:
```bash
php artisan serve
```












