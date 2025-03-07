# Blood Donation Bank App

## Overview
The **Blood Donation Bank App** is a web-based application designed for managing blood donations. It enables users to register as donors, request blood, and manage donation records efficiently.

## Tech Stack
- **Frontend**: React.js (Developed using the Visual Studio 2022 React template)
- **Backend**: .NET C# (ASP.NET Core)
- **Database**: (SQL Server)


## Features
- User registration and authentication (Donors/Users & Admins)
- Blood donation requests and approvals
- Search and filter donors by blood type and location
- Donation history tracking
- Notifications for urgent blood requirements

## Installation

### Prerequisites
- Visual Studio 2022
- .NET SDK
- Node.js and npm


### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone <https://github.com/MelisaBunjaku19/BloodDonationBankApp>
   cd blood-donation-bank
   ```

2. Install frontend dependencies:
   ```sh
   cd ClientApp
   npm install
   ```

3. Start the frontend:
   ```sh
   npm start
   ```

4. Run the backend:
   - Open the solution in Visual Studio 2022.
   - Set the API project as the startup project.
   - Run the project.

5. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## API Endpoints (Example)
| Endpoint            | Method | Description |
|---------------------|--------|-------------|
| `/api/donors`      | GET    | Get all donors |
| `/api/donors`      | POST   | Register a new donor |
| `/api/requests`    | GET    | Get all blood requests |
| `/api/requests`    | POST   | Create a new request |

## Contribution
If you would like to contribute, please fork the repository and submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

