import { useCallback, useState } from "react";

export const useForm = <T extends Record<string, unknown>>(
  options: {
    initialValues: T;
    validations?: {
      [K in keyof T]?: (value: T[K], values: T) => string | null;
    };
  }
): {
  values: T;
  errors: { [K in keyof T]?: string | null };
  isValid: boolean;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  getValue: <K extends keyof T>(key: K) => T[K];
  resetForm: () => void;
} => {
  const { initialValues, validations } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [K in keyof T]?: string | null }>({});

  const setValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setValues((prev) => ({
        ...prev,
        [key]: value,
      }));

      if (validations && validations[key]) {
        const error = validations[key]?.(value, values);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: error,
        }));
      }
    },
    [validations, values]
  );

  const getValue = useCallback(
    <K extends keyof T>(key: K) => {
      return values[key];
    },
    [values]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    isValid: Object.values(errors).every((error) => !error),
    setValue,
    getValue,
    resetForm,
  };
};
