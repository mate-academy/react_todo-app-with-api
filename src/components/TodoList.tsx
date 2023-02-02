import { Dispatch, SetStateAction, FC } from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';

export type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  isRenamingTodo: boolean;
  setIsRenamingTodo: Dispatch<SetStateAction<boolean>>;
  selectedTodoById: number;
  dblClickHandler: (id: number) => void;
  updateTitleTodo: (value: string) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  toggleTodo,
  isRenamingTodo,
  setIsRenamingTodo,
  selectedTodoById,
  dblClickHandler,
  updateTitleTodo,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <TodoItem
              todo={todo}
              deleteTodo={deleteTodo}
              toggleTodo={toggleTodo}
              isRenamingTodo={isRenamingTodo}
              setIsRenamingTodo={setIsRenamingTodo}
              selectedTodoById={selectedTodoById}
              dblClickHandler={dblClickHandler}
              updateTitleTodo={updateTitleTodo}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
