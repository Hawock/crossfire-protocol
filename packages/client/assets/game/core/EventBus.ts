import { EventTarget } from 'cc';

// один общий EventTarget на игру
export const EventBus = new EventTarget();

// компактный набор имён событий
export const EVT = {
  BUILD_SELECT: 'build.select',        // { id }
  BUILD_ATTEMPT: 'build.attempt',      // { id, gx, gy }
  BUILD_DENIED: 'build.denied',        // { reason: 'money' | 'grid' }
  BUILD_START: 'build.start',          // { id, gx, gy, time }
  RES_UPDATED: 'resources.updated',    // { money, power }
} as const;
