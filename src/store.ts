import { writable } from 'svelte/store';
import { type Notification } from './inbox';
export const notificationData = writable<Notification | null>(null);