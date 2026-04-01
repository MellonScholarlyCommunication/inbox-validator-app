import Inbox from './routes/Inbox.svelte';
import Notification from './routes/Notification.svelte';
import Configure from './routes/Configure.svelte';
import NotFound from './routes/NotFound.svelte';

export default {
    '/': Inbox,
    '/notification/:name': Notification,
    '/configure': Configure,
    // The catch-all route must always be last
    '*': NotFound
};
