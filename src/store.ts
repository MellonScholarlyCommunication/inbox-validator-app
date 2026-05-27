import { writable } from 'svelte/store';
import { type Notification, type Agent } from './inbox';
import { THIS_ACTOR, THIS_ORIGIN } from './globals';

function createPersistentStore<T>(key: string, startValue: T) {
    const saved = localStorage.getItem(key);
    const initial = saved ? JSON.parse(saved) : startValue;

    const store = writable<T>(initial);

    store.subscribe(value => {
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}

export const notificationData = writable<Notification | null>(null);
export const newNotificationTrigger = writable(0);
export const defaultActor = createPersistentStore<Agent>('actor_config',THIS_ACTOR);
export const defaultOrigin = createPersistentStore<Agent>('origin_config',THIS_ORIGIN);