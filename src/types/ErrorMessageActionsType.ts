import { ActionMap } from './ActionMapType';
import { ErrorPayload } from './ErrorPayloadType';

// eslint-disable-next-line max-len
export type ErrorMessageActions = ActionMap<ErrorPayload>[keyof ActionMap<ErrorPayload>];
