import Help from './routes/Help.svelte';
import Inbox from './routes/Inbox.svelte';
import Notification from './routes/Notification.svelte';
import Configure from './routes/Configure.svelte';
import New from './routes/New.svelte';
import NotFound from './routes/NotFound.svelte';

export default {
    '/': Help,
    '/inbox': Inbox,
    '/notification/:name': Notification,
    '/configure': Configure,
    '/new': New,
    // The catch-all route must always be last
    '*': NotFound
};
