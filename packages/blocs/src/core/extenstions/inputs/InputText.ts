// /**
//  * Input Text Block Extension
//  */

// import { Node, mergeAttributes } from '@tiptap/core';
// import { ReactNodeViewRenderer } from '@tiptap/react';
// import { BlockType } from '../../../types/block.types';
// import { InputTextView } from '../../../components/blocks/inputs/InputTextView';

// export interface InputTextOptions {
//   HTMLAttributes: Record<string, any>;
// }

// declare module '@tiptap/core' {
//   interface Commands<ReturnType> {
//     inputText: {
//       insertInputText: (attributes?: Partial<any>) => ReturnType;
//     };
//   }
// }

// export const InputText = Node.create<InputTextOptions>({
//   name: 'inputText',
//   group: 'block',
//   atom: true,
//   draggable: true,
  
//   addOptions() {
//     return { HTMLAttributes: {} };
//   },
  
//   addAttributes() {
//     return {
//       blockCode: {
//         default: null,
//         parseHTML: (element) => element.getAttribute('data-block-code'),
//         renderHTML: (attributes) => {
//           if (!attributes.blockCode) return {};
//           return { 'data-block-code': attributes.blockCode };
//         },
//       },
//       blockType: {
//         default: BlockType.INPUT_TEXT,
//         renderHTML: () => ({ 'data-block-type': BlockType.INPUT_TEXT }),
//       },
//       blockName: {
//         default: 'Short answer',
//         renderHTML: (attributes) => ({
//           'data-block-name': attributes.blockName || 'Short answer',
//         }),
//       },
//       placeholder: {
//         default: 'Type placeholder text',
//         parseHTML: (element) => element.getAttribute('data-placeholder'),
//         renderHTML: (attributes) => ({
//           'data-placeholder': attributes.placeholder || 'Type placeholder text',
//         }),
//       },
//       isRequired: {
//         default: false,
//         parseHTML: (element) => element.getAttribute('data-required') === 'true',
//         renderHTML: (attributes) => ({
//           'data-required': attributes.isRequired ? 'true' : 'false',
//         }),
//       },
//       value: {
//         default: '',
//         parseHTML: (element) => element.getAttribute('data-value') || '',
//         renderHTML: (attributes) => {
//           if (!attributes.value) return {};
//           return { 'data-value': attributes.value };
//         },
//       },
//       minLength: {
//         default: null,
//         parseHTML: (element) => {
//           const min = element.getAttribute('data-min-length');
//           return min ? parseInt(min, 10) : null;
//         },
//         renderHTML: (attributes) => {
//           if (!attributes.minLength) return {};
//           return { 'data-min-length': attributes.minLength.toString() };
//         },
//       },
//       maxLength: {
//         default: null,
//         parseHTML: (element) => {
//           const max = element.getAttribute('data-max-length');
//           return max ? parseInt(max, 10) : null;
//         },
//         renderHTML: (attributes) => {
//           if (!attributes.maxLength) return {};
//           return { 'data-max-length': attributes.maxLength.toString() };
//         },
//       },
//       isAnswerable: { default: true },
//     };
//   },
  
//   parseHTML() {
//     return [{ tag: 'div[data-type="input-text"]' }];
//   },
  
//   renderHTML({ HTMLAttributes, node }) {
//     return [
//       'div',
//       mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
//         'data-type': 'input-text',
//         'data-block-code': node.attrs.blockCode,
//         class: 'input-text-block',
//       }),
//     ];
//   },
  
//   addNodeView() {
//     return ReactNodeViewRenderer(InputTextView, {
//       as: 'div',
//       className: 'form-block input-text-block',
//     });
//   },
  
//   addCommands() {
//     return {
//       insertInputText:
//         (attributes = {}) =>
//         ({ chain }) => {
//           return chain()
//             .insertContent({
//               type: this.name,
//               attrs: {
//                 blockCode: `input-text-${Date.now()}`,
//                 blockType: BlockType.INPUT_TEXT,
//                 blockName: 'Short answer',
//                 placeholder: 'Type placeholder text',
//                 isRequired: false,
//                 value: '',
//                 isAnswerable: true,
//                 ...attributes,
//               },
//             })
//             .run();
//         },
//     };
//   },
// });
