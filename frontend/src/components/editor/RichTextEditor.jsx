'use client';
import { Bold, Italic, Underline, Strikethrough, Link2, List, ListOrdered, Undo2, Redo2 } from 'lucide-react';
import { useRef, useCallback, useEffect } from 'react';

export default function RichTextEditor({ value, onChange, placeholder, rows = 4, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) {
      ref.current.innerHTML = value || '';
    }
  }, []);

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    ref.current?.focus();
  };

  const handleInput = useCallback(() => {
    onChange?.(ref.current?.innerHTML || '');
  }, [onChange]);

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) exec('createLink', url);
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-white ${className}`}>
      <div className="flex items-center gap-0.5 border-b border-slate-100 px-2 py-1.5">
        <button type="button" onClick={() => exec('bold')} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Bold"><Bold size={14} /></button>
        <button type="button" onClick={() => exec('italic')} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Italic"><Italic size={14} /></button>
        <button type="button" onClick={() => exec('underline')} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Underline"><Underline size={14} /></button>
        <button type="button" onClick={() => exec('strikeThrough')} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Strikethrough"><Strikethrough size={14} /></button>
        <span className="mx-1 h-4 w-px bg-slate-200" />
        <button type="button" onClick={insertLink} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Link"><Link2 size={14} /></button>
        <button type="button" onClick={() => exec('insertUnorderedList')} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Bullet list"><List size={14} /></button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Numbered list"><ListOrdered size={14} /></button>
        <span className="mx-1 h-4 w-px bg-slate-200" />
        <button type="button" onClick={() => exec('undo')} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Undo"><Undo2 size={14} /></button>
        <button type="button" onClick={() => exec('redo')} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Redo"><Redo2 size={14} /></button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[120px] px-4 py-3 text-sm leading-relaxed text-slate-800 outline-none empty:before:pointer-events-none empty:before:text-slate-400 [&:empty]:before:content-[attr(data-placeholder)]"
        style={{ minHeight: rows * 28 }}
      />
    </div>
  );
}
