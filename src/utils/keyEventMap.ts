import { EventKey } from '../types/EventKey';

export const keyEventMap: { [key: string]: EventKey } = {
  Enter: EventKey.Enter,
  Escape: EventKey.Escape,
  Backspace: EventKey.Backspace,
  Delete: EventKey.Delete,
  Tab: EventKey.Tab,
};
