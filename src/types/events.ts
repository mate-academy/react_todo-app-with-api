import { FormEvent, FocusEvent, KeyboardEvent } from 'react';

export type EventSubmit = FormEvent<HTMLFormElement>;
export type EventFocus = FocusEvent<HTMLInputElement>;
export type EventKeyboard = KeyboardEvent<HTMLInputElement>;
