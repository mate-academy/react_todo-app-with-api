import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodo: Todo[],
  isAdding: boolean,
  isClicked: boolean,
  todoTitle: string,
  currentTodo: number,
  selectedTodos: number[],
  setCurrentTodo: (value: number) => void,
  setIsClicked: (value: boolean) => void,
  setTodoTitle: (value: string) => void,
  setSelectedTodos: (value: number[]) => void,
  deleteTodoFromServer: (value: number) => void,
  updateTodoOnServer: (idTodo: number, data: Partial<Todo>) => void,
};

export const TodoList: React.FC<Props> = React.memo(({
  visibleTodo,
  isAdding,
  isClicked,
  todoTitle,
  currentTodo,
  selectedTodos,
  setIsClicked,
  setCurrentTodo,
  setTodoTitle,
  deleteTodoFromServer,
  updateTodoOnServer,
  setSelectedTodos,
}) => {
  const tempTodo = {
    id: 0,
    title: todoTitle,
  };

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {visibleTodo.map(todo => (
        <TodoItem
          currentTodo={currentTodo}
          setCurrentTodo={setCurrentTodo}
          selectedTodos={selectedTodos}
          setSelectedTodos={setSelectedTodos}
          setTodoTitle={setTodoTitle}
          setIsClicked={setIsClicked}
          isClicked={isClicked}
          deleteTodoFromServer={deleteTodoFromServer}
          updateTodoOnServer={updateTodoOnServer}
          todo={todo}
          key={todo.id}
        />
      ))}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
          key={tempTodo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {tempTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
});
