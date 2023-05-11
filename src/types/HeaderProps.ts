import { GetValue, Submit } from './functions';

export interface HeaderProps {
  query: string;
  hasTodos: boolean;
  isActiveButton: boolean;
  isDisabledField: boolean;

  onSubmit: Submit;
  onChange: GetValue;
  onToggle: () => void;
}
