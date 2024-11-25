import React from "react";

export const ListField = <T,>({
  value,
  onChange,
  renderItem,
  addItem,
}: {
  value: T[];
  onChange: (newList: T[]) => void;
  renderItem: (item: T, index: number, onChangeItem: (newItem: T) => void, onRemove: () => void) => React.ReactNode;
  addItem: () => T;
}) => {
  return (
    <div>
      {value.map((item, index) =>
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
      )}
      <button type="button" onClick={() => {
        onChange([...value, addItem()]);
      }}>
        Add Item
      </button>
    </div>
  );
};
