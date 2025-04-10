import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { EditorView } from 'prosemirror-view';

// Regular expressions for finding variables
const variableRegex = /\[([\w\s-]+)\]|{{([\w\s-]+)}}/g;

/**
 * TipTap extension that highlights variables in the format [variable_name] or {{variable_name}}
 * with a purple background and text color
 * When clicked, variables become editable with an inline editor
 */
export const VariableHighlighter = Extension.create({
  name: 'variableHighlighter',

  addProseMirrorPlugins() {
    let activeVariable: { from: number; to: number; format: string; value: string } | null = null;
    let inputElement: HTMLInputElement | null = null;
    const pluginKey = new PluginKey('variableHighlighter');

    // Function to create and position the input element
    const createInputElement = (view: EditorView, from: number, to: number, value: string) => {
      // Remove any existing input element
      if (inputElement) {
        inputElement.remove();
        inputElement = null;
      }

      // Create a new input element
      inputElement = document.createElement('input');
      inputElement.value = value;
      inputElement.className = 'variable-editor';
      inputElement.style.position = 'absolute';
      inputElement.style.backgroundColor = 'white';
      inputElement.style.border = '1px solid #9333ea';
      inputElement.style.borderRadius = '3px';
      inputElement.style.padding = '2px 4px';
      inputElement.style.color = '#9333ea';
      inputElement.style.fontSize = 'inherit';
      inputElement.style.fontFamily = 'inherit';
      inputElement.style.zIndex = '100';
      inputElement.style.minWidth = '100px';

      // Dark mode support
      const isDarkMode = document.documentElement.classList.contains('dark');
      if (isDarkMode) {
        inputElement.style.backgroundColor = '#2d3748';
        inputElement.style.color = '#c084fc';
      }

      // Position the input element
      const coords = view.coordsAtPos(from);
      inputElement.style.left = `${coords.left}px`;
      inputElement.style.top = `${coords.top}px`;

      // Handle input blur - save the changes
      inputElement.addEventListener('blur', () => {
        if (activeVariable && inputElement) {
          const newValue = inputElement.value.trim();
          if (newValue && activeVariable.format) {
            // Format the new value based on the original format ([var] or {{var}})
            const formattedValue = activeVariable.format === 'brackets' 
              ? `[${newValue}]` 
              : `{{${newValue}}}`;
            
            // Replace the variable in the document
            const { state, dispatch } = view;
            const tr = state.tr.replaceWith(
              activeVariable.from,
              activeVariable.to,
              state.schema.text(formattedValue)
            );
            dispatch(tr);
          }
          
          // Clean up
          inputElement.remove();
          inputElement = null;
          activeVariable = null;
        }
      });

      // Handle Enter key - save changes and close
      inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          inputElement?.blur();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          // Discard changes
          inputElement?.remove();
          inputElement = null;
          activeVariable = null;
        }
      });

      // Add to document and focus
      document.body.appendChild(inputElement);
      inputElement.focus();
    };

    return [
      new Plugin({
        key: pluginKey,
        props: {
          decorations(state) {
            const { doc } = state;
            const decorations: Decoration[] = [];

            // Process each node in the document
            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || '';
                let match;
                
                // Reset regex for each text node
                variableRegex.lastIndex = 0;
                
                // Find all variable matches in the text
                while ((match = variableRegex.exec(text)) !== null) {
                  const start = pos + match.index;
                  const end = start + match[0].length;
                  
                  // Create a decoration for the variable
                  decorations.push(
                    Decoration.inline(start, end, {
                      class: 'variable-highlight',
                    })
                  );
                }
              }
              
              return true;
            });

            return DecorationSet.create(doc, decorations);
          },

          // Handle clicks on variables
          handleClick(view: EditorView, pos: number, event: MouseEvent) {
            const { state } = view;
            const { doc } = state;
            
            // Check if the click is on a variable
            const decorations = pluginKey.getState(state);
            if (!decorations) return false;
            
            // Find if we clicked on a variable decoration
            let clickedOnVariable = false;
            let from = 0;
            let to = 0;
            let format = '';
            let value = '';
            
            doc.descendants((node, nodePos) => {
              if (node.isText) {
                const text = node.text || '';
                let match;
                
                // Reset regex for each text node
                variableRegex.lastIndex = 0;
                
                // Find all variable matches in the text
                while ((match = variableRegex.exec(text)) !== null) {
                  const start = nodePos + match.index;
                  const end = start + match[0].length;
                  
                  // Check if the click position is within this variable
                  if (pos >= start && pos <= end) {
                    clickedOnVariable = true;
                    from = start;
                    to = end;
                    
                    // Extract the variable value and format
                    const matchedText = match[0];
                    if (matchedText.startsWith('[')) {
                      format = 'brackets';
                      value = match[1] || '';
                    } else {
                      format = 'curly';
                      value = match[2] || '';
                    }
                    
                    return false; // Stop traversal
                  }
                }
              }
              
              return true;
            });
            
            if (clickedOnVariable) {
              // Store the active variable
              activeVariable = { from, to, format, value };
              
              // Create and position the input element
              createInputElement(view, from, to, value);
              
              return true; // Handled the click
            }
            
            return false; // Not handled
          },
        },
      }),
    ];
  },
});
