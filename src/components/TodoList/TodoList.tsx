import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInput } from '../TodoInput/TodoInput';
import { TempTodo } from '../TempTodo/TempTodo';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodoClick: (id: number) => void;
  isDeletedTodoHasLoader: boolean;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setRenameTodoTitle: (title: string) => void;
  isTodoRenaming: boolean;
  setIsTodoRenaming: (state: boolean) => void;
  renameTodoTitle: string;
  handleError: (error: string) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  handleDeleteTodoClick,
  isDeletedTodoHasLoader,
  setTodos,
  setRenameTodoTitle,
  isTodoRenaming,
  setIsTodoRenaming,
  renameTodoTitle,
  handleError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoInput
          todo={todo}
          key={todo.id}
          handleDeleteTodoClick={handleDeleteTodoClick}
          isDeletedTodoHasLoader={isDeletedTodoHasLoader}
          setTodos={setTodos}
          setRenameTodoTitle={setRenameTodoTitle}
          isTodoRenaming={isTodoRenaming}
          setIsTodoRenaming={setIsTodoRenaming}
          renameTodoTitle={renameTodoTitle}
          handleError={handleError}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
