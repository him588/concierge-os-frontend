export function handleChangeInput<T extends object>(
  setValue: React.Dispatch<React.SetStateAction<T>>,
  input: React.ChangeEvent<HTMLInputElement>,
  fieldName?: string,
) {
  const objKey = input.target.name ? input.target.name : fieldName;
  if (objKey) {
    setValue((prev) => {
      return { ...prev, [objKey]: input.target.value };
    });
  }
}

export function handleChangeSelect<T extends object>(
  setValue: React.Dispatch<React.SetStateAction<T>>,
  input: React.ChangeEvent<HTMLSelectElement>,
  fieldName?: string,
) {
  const objKey = input.target.name ? input.target.name : fieldName;

  if (objKey) {
    setValue((prev) => {
      return { ...prev, [objKey]: input.target.value };
    });
  }
}

export function handleChangeTextarea<T extends object>(
  setValue: React.Dispatch<React.SetStateAction<T>>,
  input: React.ChangeEvent<HTMLTextAreaElement>,
  fieldName?: string,
) {
  const objKey = input.target.name ? input.target.name : fieldName;

  if (objKey) {
    setValue((prev) => {
      return { ...prev, [objKey]: input.target.value };
    });
  }
}

export function clearError<T extends Record<string, string>>(
  setErrors: React.Dispatch<React.SetStateAction<T>>,
  key: string,
) {
  setErrors((prev) => ({ ...prev, [key]: "" }) as T);
}
