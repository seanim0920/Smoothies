import { useCallback, useMemo, useState } from "react";

export const useForm = <T extends Record<string, unknown>>(
  {
    initialValues,
    validations
  } :
  {
    initialValues: T;
    validations?: {
      [K in keyof T]?: (value: T[K], values: T) => string | null;
    };
  }
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [K in keyof T]?: string | null }>({});

  const isDirty = useMemo(() => {
    return !Object.keys(initialValues).every(
      (key) => values[key as keyof T] === initialValues[key as keyof T]
    );
  }, [initialValues, values]);

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
    isDirty,
    isValid: Object.values(errors).every((error) => !error),
    setValue,
    getValue,
    resetForm,
  };
};
