export interface FormState {
  formValue: string;
  onSetFormValue: (val: string) => void;
  disabledInput: boolean;
  inputRef: null | React.LegacyRef<HTMLInputElement>
}
