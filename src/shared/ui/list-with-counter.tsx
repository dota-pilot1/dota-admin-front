"use client";

import React from "react";

type RowProps<T> = {
  item: T;
  index: number;
};

// Generic list that renders a counter column using CSS counters to avoid recalculating numbers in JS after deletions.
export function ListWithCounter<T>({
  items,
  renderRow,
  counterClassName,
  start = 1,
  getKey,
}: {
  items: T[];
  renderRow: (props: RowProps<T>) => React.ReactNode;
  counterClassName?: string;
  start?: number;
  getKey?: (item: T, index: number) => React.Key;
}) {
  return (
    <ol
      className={"list-none m-0 p-0"}
      style={{ counterReset: `row ${start - 1}` }}
    >
      {items.map((item, i) => (
        <li
          key={getKey ? getKey(item, i) : i}
          className="flex items-center gap-3 py-2"
          style={{ counterIncrement: "row" }}
        >
          <div
            aria-label={`index`}
            className={counterClassName ?? "w-10 text-right pr-2 text-xs text-muted-foreground"}
          >
            <span className="before:content-[counter(row)]" />
          </div>
          <div className="min-w-0 flex-1">
            {renderRow({ item, index: i })}
          </div>
        </li>
      ))}
    </ol>
  );
}
