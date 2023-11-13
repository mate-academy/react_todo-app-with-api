import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/Todo';

type Props = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  tempTodo: Todo | null,
  setError: (value: string) => void,
  setIsHiddenClass: (value: boolean) => void,
  setIsDisable: (value: boolean) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  setError,
  setIsHiddenClass,
  setIsDisable,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [inputId, setInputId] = useState(0);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          setError={setError}
          setTodos={setTodos}
          setSelectedTodoId={setSelectedTodoId}
          isActive={todo.id === selectedTodoId}
          isDobleClick={todo.id === inputId}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setInputId={setInputId}
          setIsHiddenClass={setIsHiddenClass}
          setIsDisable={setIsDisable}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isActive
        />
      )}
    </section>
  );
};
