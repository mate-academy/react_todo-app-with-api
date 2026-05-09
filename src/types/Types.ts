import type { Dispatch, SetStateAction } from 'react';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export enum ErrorMessages {
  empty = '',
  notBeEmpty = 'Title should not be empty',
  addError = 'Unable to add a todo',
  deleteError = 'Unable to delete a todo',
  loadError = 'Unable to load todos',
  updateError = `Unable to update a todo`,
}

export enum FilterPatterns {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export type TodoListProps = {
  filteredTodos: Todo[];
  deletingTodoIds: number[];
  checkedTodoId: number[];
  tempTodo: Todo | null;
  editingTodoId: number | null;
  editedTitle: string;
  handleDelete: (TodoId: number) => void;
  handleMakeChecked: (updatedTodo: Todo) => void;
  handleStartEditing: (todo: Todo) => void;
  handleEditedTitleChange: (value: string) => void;
  handleCancelEditing: () => void;
  handleSubmitEditing: (todo: Todo) => void;
};

export type FooterProps = {
  todos: Todo[];
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  checkComplete: boolean;
  handleClearCompleted: () => void;
};

export type ErrorNotificationsProps = {
  errorMessage: ErrorMessages;
  setErrorMessage: Dispatch<SetStateAction<ErrorMessages>>;
};
