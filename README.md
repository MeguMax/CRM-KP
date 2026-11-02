# CRM-KP

A CRM application for managing clients, deals and follow-up work. The repository combines a React/TypeScript interface with an Express API and MongoDB models.

The main engineering work is in the sales pipeline, form-driven workflows, application state and the connection between the interface and external communication services.

## What is included

- A dashboard, client forms and a sales pipeline with lead, qualification, proposal, negotiation and closed stages.
- Registration and login handlers with password hashing and JWT issuance.
- Client and deal controllers that associate records with their creator.
- Email and Slack service modules for welcome messages, client updates and deal notifications.
- Integration demonstration screens, protected UI routes and frontend tests.

## Stack

| Interface | API and persistence |
| --- | --- |
| React, TypeScript, Material UI | Node.js, Express, MongoDB, Mongoose |
| Redux Toolkit, React Router, Axios | bcrypt, JSON Web Tokens, Joi |
| React Hook Form and Yup | Nodemailer and the Slack Web API |

## Repository layout

```text
backend/
  src/routes/          HTTP endpoints
  src/controllers/     Client and deal operations
  src/models/          User, client and deal schemas
  src/services/        Email and Slack integration
crm-system/
  src/pages/           Dashboard, clients, pipeline and integration screens
  src/components/      Forms, layout and route guards
  src/store/           Redux state
  src/services/        API clients and demonstration adapters
```

## Local development

You need Node.js, npm and MongoDB. The locked Mongoose version requires Node.js 20.19 or later.

Install each application separately:

```bash
git clone https://github.com/MeguMax/CRM-KP.git
cd CRM-KP/backend
npm install
```

Create `backend/.env` with your local configuration:

```dotenv
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/crm_db
FRONTEND_URL=http://localhost:3000
JWT_SECRET=replace-with-a-local-secret
API_KEY=replace-with-a-local-api-key
```

Start the API:

```bash
npm run dev
```

From the repository root in another terminal, start the interface:

```bash
cd crm-system
npm install
npm start
```

The interface normally runs on `http://localhost:3000`; the API uses `http://localhost:3001/api`. The configurable frontend API client reads `REACT_APP_API_BASE_URL`.

Email and Slack use optional server-side settings: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `SLACK_BOT_TOKEN` and `SLACK_CHANNEL`. Configure these on the API side when working with the corresponding services.

## Development commands

| Location | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | API with nodemon |
| `backend` | `npm start` | API with Node.js |
| `backend` | `npm test` | Configured Jest command |
| `crm-system` | `npm start` | React development server |
| `crm-system` | `npm run build` | Frontend production build |
| `crm-system` | `npm test` | Frontend test runner |

## Current scope

This is a development snapshot. The frontend sends bearer tokens, while the current API middleware checks an API key and does not establish the user context expected by the client and deal controllers. That authentication path needs to be aligned before the full application can be used end to end.

Some integration screens use local demonstration adapters. The presence of a UI action or service module does not establish a live email or Slack delivery. Server credentials belong in the backend configuration; legacy browser-side integration helpers need review before deployment.

## License

No standalone license file is included in this snapshot.
