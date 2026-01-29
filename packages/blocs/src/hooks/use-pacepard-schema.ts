/**
 * Hook that provides access to a Pacepard schema.
 *
 * Accepts an optional editor instance directly, or falls back to retrieving
 * the editor from the Pacepard context if available. This allows components
 * to work both when given an editor directly and when used within a Pacepard
 * editor context.
 *
 * @param providedEditor - Optional editor instance to use instead of the context editor
 * @returns The provided editor or the editor from context, whichever is available and the schema   
 */
// export function usePacepardSchema(editor?: Editor | null) {
//     return useMemo(() => {
//       if (!editor) return null
  
//       const schema = editor.schema
  
//       return {
//         schema,
//         nodes: schema.spec.nodes,
//         marks: schema.spec.marks,
  
//         hasNode: (name: string) => !!schema.nodes[name],
//         hasMark: (name: string) => !!schema.marks[name],
  
//         isFormNode: (name: string) =>
//           ["shortTextQuestion", "selectQuestion", "checkboxQuestion"].includes(
//             name
//           ),
//       }
//     }, [editor])
//   }
  