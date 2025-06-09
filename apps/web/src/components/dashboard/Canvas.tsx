"use client";

import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';
import React from 'react';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const buttonClass = (active: boolean) =>
    `px-2 py-1 border rounded text-sm ${active ? 'bg-[#6366F1] text-white' : 'bg-[#F3F4F6] text-[#374151]'}`;

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive('strike'))}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive('underline'))}
      >
        Underline
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={buttonClass(editor.isActive('highlight'))}
      >
        Highlight
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
      >
        Bullets
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
      >
        Numbers
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive('blockquote'))}
      >
        Quote
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={buttonClass(editor.isActive('taskList'))}
      >
        Tasks
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass(editor.isActive('codeBlock'))}
      >
        Code
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={buttonClass(false)}
      >
        HR
      </button>
      <button
        onClick={() => editor.chain().focus().setColor('#dc2626').run()}
        className={buttonClass(editor.isActive('textStyle') && editor.getAttributes('textStyle').color === '#dc2626')}
      >
        Red
      </button>
      <button
        onClick={() => editor.chain().focus().setColor(null).run()}
        className={buttonClass(!editor.getAttributes('textStyle').color)}
      >
        Reset Color
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={buttonClass(editor.isActive({ textAlign: 'left' }))}
      >
        Left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={buttonClass(editor.isActive({ textAlign: 'center' }))}
      >
        Center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={buttonClass(editor.isActive({ textAlign: 'right' }))}
      >
        Right
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={buttonClass(editor.isActive('subscript'))}
      >
        Sub
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={buttonClass(editor.isActive('superscript'))}
      >
        Super
      </button>
      <button onClick={setLink} className={buttonClass(editor.isActive('link'))}>
        Link
      </button>
      <button onClick={addImage} className={buttonClass(false)}>
        Image
      </button>
      <button onClick={addTable} className={buttonClass(false)}>
        Table
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className={buttonClass(false)}
      >
        Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className={buttonClass(false)}
      >
        Redo
      </button>
    </div>
  );
};

export const Canvas = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        autolink: true,
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Start creating on the canvas...',
      }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem,
      Subscript,
      Superscript,
      CodeBlockLowlight.configure({ lowlight }),
      CharacterCount,
    ],
    content: '<p></p>',
    autofocus: true,
  });

  return (
    <div className="p-6 h-full overflow-y-auto">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose max-w-none min-h-[400px] bg-white border border-[#E5E7EB] rounded-lg p-4 focus:outline-none"
      />
      {editor && (
        <p className="text-sm text-[#6B7280] mt-2">
          Characters: {editor.storage.characterCount.characters()}
        </p>
      )}
    </div>
  );
};

export default Canvas;
