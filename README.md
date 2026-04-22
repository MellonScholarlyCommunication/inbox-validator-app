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

## Settings

- `src/globals.ts` : global settings
