import { FC, ReactNode, useState } from 'react';
import cx from 'classnames';
import { ReactEditor, useFocused, useSelected, useSlate } from 'slate-react';
import { Editor, Transforms, Element as SlateElement } from 'slate';
import { v4 } from 'uuid';
import { EmbedElement } from '../Editor/types';
import { MediaEditorOptions } from '../MediaEditorOptions';
import { ELEMENT_TYPES_MAP } from '../Editor/constants';
import { EmbedRender } from '../EmbedRender/EmbedRender';
import { LinkInput } from '../LinkInput';
import s from './EmbedEditor.module.scss';
import { Fade } from '../Fade';

type Props = { element: EmbedElement; className: string; attributes: any; children: ReactNode };

const EmbedEditor: FC<Props> = ({ element, attributes, className, children }) => {
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const [isOpen, setIsOpen] = useState(false);

  const handleChangeEmbedUrl = (url: string) => {
    const embed: EmbedElement = {
      id: v4(),
      type: 'embed',
      children: [{ text: '' }],
      src: url,
      title: '',
      isVoid: true,
    };

    Transforms.setNodes<EmbedElement>(editor, embed, { at: editor.selection?.anchor, voids: true });

    if (editor.selection) {
      Transforms.select(editor, editor.selection);
    }
  };

  const onDelete = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === ELEMENT_TYPES_MAP.embed,
      at: path,
    });
  };

  if (element.src) {
    return (
      <div
        draggable={false}
        {...attributes}
        contentEditable={false}
        className={cx(className, { [s.selected]: selected && focused })}
      >
        <div className={s.options}>
          <MediaEditorOptions onDelete={onDelete} isImage />
        </div>
        <EmbedRender src={element.src} title={element.title} />
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      draggable={false}
      {...attributes}
      contentEditable={false}
      className={cx(className, s.editorLayout)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <Fade show={isOpen} animationDelay={150}>
        <LinkInput
          linkUrl={element.src || ''}
          onClose={() => setIsOpen(false)}
          onRemove={() => {}}
          onAdd={handleChangeEmbedUrl}
          placeholder="Paste embed url"
        />
      </Fade>
      <span className={s.text}>Click to embed</span>
      <div className={s.options}>
        <MediaEditorOptions isImage onDelete={onDelete} />
      </div>
      {children}
    </button>
  );
};

export { EmbedEditor };
