import { Types } from '../enums/Types';
import { FilterByType } from './FilterByType';

export type FilterPayload = {
  [Types.FilterBy]: {
    filterBy: FilterByType,
  }
};
