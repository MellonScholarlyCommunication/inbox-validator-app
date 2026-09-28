# Inbox Viewer App

A single page app to view and validate [LDN](https://www.w3.org/TR/ldn/) inboxes with a [COAR Notify](https://coar-notify.net/specification/) profile of [Event Notifications](https://www.eventnotifications.net).

## Dependencies

- Access to an LDN Inbox endpoint
- Access to an Notification validator endpoint
- Node dependencies:
  - Run `npm install`

## Screenshots

<img src="public/images/inbox.png" width="400" alt="inbox">
<img src="public/images/notification.png" width="400" alt="notification">
<img src="public/images/source.png" width="400" alt="source">

## Run the development server

Start an inbox server:

```
npm run inbox
```

Optionally, start a separate shell and start a validation service (see, https://github.com/MellonScholarlyCommunication/shacl-validator).

Start a separate shell the Vite server for the front-end:

```
npm run dev
```

Visit: http://localhost:5050/

Create a Relay host token

```
npm run token:make
```

## Settings

- `src/globals.ts` : global settings
- `.env` : local overwrites (use `.env-sample` as template)
- `.env.local` : local Svelte settings (see below)

Sample `.env.local`

```
VITE_INBOX_URL=http://localhost:5051/inbox/
VITE_VALIDATOR_URL=http://localhost:3000/validate
```

## Docker

Build all the Docker images (except the validator which is a separate repository):

```
npm run docker:build:all
```

Run all the Docker images

```
npm run docker:run:all
```