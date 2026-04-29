import Inbox from './routes/Inbox.svelte';
import Notification from './routes/Notification.svelte';
import Configure from './routes/Configure.svelte';
import New from './routes/New.svelte';
import NotFound from './routes/NotFound.svelte';

export default {
    '/': Inbox,
    '/notification/:name': Notification,
    '/configure': Configure,
    '/new': New,
    // The catch-all route must always be last
    '*': NotFound
};
