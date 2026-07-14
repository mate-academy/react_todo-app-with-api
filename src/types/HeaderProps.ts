import { Todo } from "./Todo";

export interface HeaderProps {
  todos: Todo[];
  active: number;
  onChange: (value: string) => Promise<boolean>;
  inputRef: React.RefObject<HTMLInputElement>;
  changeAll: () => void;
}
