import { act, renderHook } from "@testing-library/react";
import { useForm } from "./Form";

describe("useForm", () => {
  const initialValues = {
    name: "Test Smoothie",
    ingredients: "Banana, Milk",
  };

  const validations = {
    name: (value: string) => (value.trim() ? null : "Name is required"),
    ingredients: (value: string) =>
      value.trim() ? null : "Ingredients are required",
  };

  it("should reflect initial values", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, validations })
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.isValid).toBe(true);
  });

  it("should update values", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, validations })
    );

    act(() => {
      result.current.setValue("name", "Updated Smoothie");
    });

    expect(result.current.values.name).toBe("Updated Smoothie");
    expect(result.current.isDirty).toBe(true);
    expect(result.current.isValid).toBe(true);
  });

  it("should validate fields", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, validations })
    );

    act(() => {
      result.current.setValue("name", "");
    });

    expect(result.current.errors.name).toBe("Name is required");
    expect(result.current.isValid).toBe(false);
  });

  it("should return field values", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, validations })
    );

    let fieldValue;
    act(() => {
      fieldValue = result.current.getValue("name");
    });

    expect(fieldValue).toBe("Test Smoothie");
  });

  it("should reset the form", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, validations })
    );

    act(() => {
      result.current.setValue("name", "Changed Smoothie");
      result.current.setValue("ingredients", "Strawberries");
    });

    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it("should validate multiple fields", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, validations })
    );

    act(() => {
      result.current.setValue("name", "");
      result.current.setValue("ingredients", "");
    });

    expect(result.current.errors.name).toBe("Name is required");
    expect(result.current.errors.ingredients).toBe("Ingredients are required");
    expect(result.current.isValid).toBe(false);
    
    act(() => {
      result.current.setValue("name", "Updated Name");
      result.current.setValue("ingredients", "");
    });

    expect(result.current.errors.name).toBeNull();
    expect(result.current.errors.ingredients).toBe("Ingredients are required");
    expect(result.current.isValid).toBe(false);
    
    act(() => {
      result.current.setValue("ingredients", "New Ingredients");
    });

    expect(result.current.errors.ingredients).toBeNull();
    expect(result.current.isValid).toBe(true);
  });
});
