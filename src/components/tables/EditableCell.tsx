import { useState, useRef, useEffect } from 'react';

interface EditableCellProps {
  value: number;
  onChange: (value: number) => void;
  format?: (v: number) => string;
  className?: string;
}

export function EditableCell({
  value,
  onChange,
  format = (v) => v.toFixed(1),
  className = '',
}: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        className="w-full rounded border border-blue-400 bg-white px-1 py-0.5 text-right text-sm dark:border-blue-500 dark:bg-slate-700 dark:text-gray-100"
      />
    );
  }

  return (
    <span
      onClick={() => {
        setText(String(value));
        setEditing(true);
      }}
      className={`cursor-pointer rounded px-1 py-0.5 text-right text-sm hover:bg-blue-50 dark:hover:bg-slate-600 ${className}`}
    >
      {format(value)}
    </span>
  );
}
