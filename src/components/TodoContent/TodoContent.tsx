import { useEffect, useState } from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoFooter } from '../TodoFooter';
import { TodoHeader } from '../TodoHeader';
import { TodoMain } from '../TodoMain';

type Props = {
  filterTodos: (filterBy: Filter) => void;
  todos: Todo[] | null;
  onError: (value: ErrorMessages | null) => void;
  createTodo: (title: string) => void;
  tempTodo: Todo | null;
  isInputDisabled: boolean;
  deleteTodo: (id: number) => void;
  updateTodo: (todo: Todo, update: 'title' | 'complete') => void;
  clearCompleted: () => void;
  toggleAll: () => void;
  setLoadingAll: (value: boolean) => void;
  loadingAll: boolean;
  focusTitleInput: boolean;
};

export const TodoContent: React.FC<Props> = ({
  todos,
  filterTodos,
  onError,
  createTodo,
  tempTodo,
  isInputDisabled,
  deleteTodo,
  clearCompleted,
  updateTodo,
  toggleAll,
  setLoadingAll,
  loadingAll,
  focusTitleInput,
}) => {
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [activateToggleAll, setActivateToggleAll] = useState(false);

  const onSwitchFilter = (f: Filter) => {
    setFilter(f);
    filterTodos(f);
  };

  useEffect(() => {
    setActivateToggleAll(todos?.every((t) => t.completed) || false);
  }, []);

  return (
    <div className="todoapp__content">
      <TodoHeader
        activateToggleAll={activateToggleAll}
        onError={onError}
        createTodo={createTodo}
        isInputDisabled={isInputDisabled}
        setLoadingAll={setLoadingAll}
        toggleAll={toggleAll}
        focusTitleInput={focusTitleInput}
      />

      <TodoMain
        todos={todos}
        tempTodo={tempTodo}
        deleteTodo={deleteTodo}
        updateTodo={updateTodo}
        loadingAll={loadingAll}
      />

      {todos && (
        <TodoFooter
          todos={todos}
          selectFilter={filter}
          switchFilter={(selectedFilter) => onSwitchFilter(selectedFilter)}
          clearCompleted={clearCompleted}
        />
      )}
    </div>
  );
};
