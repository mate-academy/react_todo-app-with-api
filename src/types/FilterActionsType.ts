import { ActionMap } from './ActionMapType';
import { FilterPayload } from './FilterPayloadType';

// eslint-disable-next-line max-len
export type FiltertActions = ActionMap<FilterPayload>[keyof ActionMap<FilterPayload>];
