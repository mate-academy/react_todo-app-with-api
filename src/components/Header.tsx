/* eslint-disable */
import classNames from "classnames";
import { Todo } from "../types/Todo";

type Props = {
  todos: Todo[];
  handlerToggleAll: () => Promise<void>;
  handlerAddTodo: () => Promise<void>;
  inputDisable: boolean;
  todoTitle: string;
  setTodoTitle: (value: string) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  handlerToggleAll,
  handlerAddTodo,
  inputDisable,
  todoTitle,
  setTodoTitle
}) => {
  return (
    <header className="todoapp__header">
    <button
      type="button"
      className={classNames('todoapp__toggle-all',
        { active: todos.every(todo => todo.completed === true) },
        { 'is-invisible': !todos.length })}
      onClick={handlerToggleAll}
    />
  
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handlerAddTodo();
      }}
    >
      <fieldset disabled={inputDisable}>
        <input
          type="text"
          className="todoapp__new-todo disabled"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => {
            setTodoTitle(event.target.value);
          }}
        />
      </fieldset>
    </form>
    </header>
  )
}
