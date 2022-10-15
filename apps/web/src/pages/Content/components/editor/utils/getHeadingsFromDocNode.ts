import { Node as ProseMirrorNode } from 'prosemirror-model';
import { HeadingInfo } from '../../catalog/Catalog';
import schema from '../schema';

const getHeadingsFromDocNode = (doc: ProseMirrorNode | undefined) => {
  const headings: HeadingInfo[] = [];
  if (!doc) return headings;

  doc.descendants((node) => {
    if (node.type !== schema.nodes.heading) return;
    const { headingID, level } = node.attrs;
    headings.push({ level, headingID, content: node.firstChild?.text ?? '' });
  });

  return headings;
};

export default getHeadingsFromDocNode;
