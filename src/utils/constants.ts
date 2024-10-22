// eslint-disable-next-line max-len, prettier/prettier
import { TodoCompletedCategory as CompletedCategory } from '../types/TodoCompletedCategory';

export const USER_ID = 1617;

export const activityFilters = {
  [CompletedCategory.active]: 'Active',
  [CompletedCategory.completed]: 'Completed',
  [CompletedCategory.all]: 'All',
};
