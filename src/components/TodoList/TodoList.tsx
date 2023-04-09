import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TododInfo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodos: Todo | null
  handleRemoveTodo: (id: number) => void;
  loadingTodoIds: number[];
  handleUpdateTodoCompleted: (id: number) => void;
  changeTitleByDoubleClick: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodos,
    handleRemoveTodo,
    loadingTodoIds,
    handleUpdateTodoCompleted,
    changeTitleByDoubleClick,
  }) => {
    return (
      <>
        {todos.map(todo => (
          <TodoInfo
            todo={todo}
            key={todo.id}
            handleRemoveTodo={handleRemoveTodo}
            loadingTodoIds={loadingTodoIds}
            handleUpdateTodoCompleted={handleUpdateTodoCompleted}
            changeTitleByDoubleClick={changeTitleByDoubleClick}
          />
        ))}

        {tempTodos
        && (
          <TodoInfo
            key={tempTodos.id}
            todo={tempTodos}
            loadingTodoIds={[0]}
            handleUpdateTodoCompleted={handleUpdateTodoCompleted}
            changeTitleByDoubleClick={changeTitleByDoubleClick}
          />
        )}
      </>
    );
  },
);
