import React, { useMemo, useState, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoHeader } from '../TodoHeader/TodoHeader';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { TodoMain } from '../TodoMain/TodoMain';
import { Filter } from '../../enums/Filter';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null
  createNewTodo: (title: string) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  deleteAllTodos:() => Promise<void>
  updateTodo: (id: number, checkStatus: Partial<Todo>)
  => Promise<void>
  updateAllTodoCheck: (areAllCompleted: boolean) => Promise<void>
};

const Content: React.FC<Props> = memo(({
  todos,
  createNewTodo,
  deleteTodo,
  deleteAllTodos,
  updateTodo,
  updateAllTodoCheck,
  tempTodo,
}) => {
  const [filter, setFilter] = useState(Filter.All);
  const [spinnerForAll, setSpinnerForAll] = useState(false);

  const filteredList = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [filter, todos]);

  const areAllTasksCompleted = useMemo(
    () => todos.every(todo => todo.completed), [todos],
  );
  const isSomeTaskCompleted = useMemo(
    () => todos.some(todo => todo.completed), [todos],
  );
  const countOfActiveTodos = useMemo(
    () => todos.reduce((count, todo) => {
      if (!todo.completed) {
        return count + 1;
      }

      return count;
    }, 0), [todos],
  );

  return (
    <div className="todoapp__content">
      <TodoHeader
        createNewTodo={createNewTodo}
        activeButton={areAllTasksCompleted}
        updateAllTodoCheck={updateAllTodoCheck}
        setSpinnerForAll={setSpinnerForAll}
      />

      {!!todos.length && (
        <>
          <TodoMain
            tempTodo={tempTodo}
            todos={filteredList}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            spinnerForAll={spinnerForAll}
          />
          <TodoFooter
            showClearButton={isSomeTaskCompleted}
            filter={filter}
            itemsCount={countOfActiveTodos}
            deleteAllTodos={deleteAllTodos}
            setFilter={setFilter}
          />
        </>
      )}
    </div>
  );
});

export { Content };
