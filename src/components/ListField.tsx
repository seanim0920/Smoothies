import React from "react";

export const ListField = <T,>({
  value,
  onChange,
  renderItem,
  addItem,
  labels,
}: {
  value: T[];
  onChange: (newList: T[]) => void;
  renderItem: (item: T, index: number, onChangeItem: (newItem: T) => void, onRemove: () => void) => React.ReactNode;
  addItem: () => T;
  labels?: string[];
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {
        labels &&
        <div style={{ display: "flex", gap: "1rem", fontWeight: "bold" }}>
          {labels.map((label, index) => (
            <div key={index} style={{ flex: 1 }}>
              {label}
            </div>
          ))}
        </div>
      }

      {value.map((item, index) => (
        renderItem(
          item,
          index,
          (newItem) => {
            const newList = [...value];
            newList[index] = newItem;
            onChange(newList);
          },
          () => {
            const newList = value.filter((_, i) => i !== index);
            onChange(newList);
          }
        )
      ))}

      <button
        className="secondary"
        type="button"
        onClick={() => {
          onChange([...value, addItem()]);
        }}
      >
        Add Item
      </button>
    </div>
  );
};
