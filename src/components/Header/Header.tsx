import React, { Dispatch, FormEvent, MutableRefObject, SetStateAction } from "react";
import { Todo } from "../../types/Todo";
import cn from "classnames";

interface Props {
    todos: Todo[];
    activeTodos: Todo[];
    onToggleStatusAll: () => void;
    onAddTodo: (event: FormEvent) => void;
    inputRef: MutableRefObject<HTMLInputElement | null>;
    title: string;
    setTitle: Dispatch<SetStateAction<string>>;
}

export const Header: React.FC<Props> = ({ 
  todos, 
  activeTodos, 
  onToggleStatusAll,
  onAddTodo,
  inputRef,
  title,
  setTitle,
}) => {
    return (
        <header className="todoapp__header">
        {!!todos.length && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: activeTodos.length === 0,
            })}
            data-cy="ToggleAllButton"
            onClick={onToggleStatusAll}
          />
        )}

        <form onSubmit={onAddTodo}>
          <input
            ref={inputRef}
            value={title}
            onChange={event => setTitle(event.target.value.trimStart())}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
          />
        </form>
      </header>
    );
}