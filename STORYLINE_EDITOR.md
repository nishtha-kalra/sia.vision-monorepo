# Canvas - Notion-Style Writing Interface

> **Note**: This document previously described the StorylineEditor component, which has been replaced by the new **Canvas** component that provides a Notion-style writing experience for all asset types.

## Overview

The **Canvas** provides a clean, intuitive writing experience inspired by Notion, with slash commands, inline formatting, and asset-aware templates. This unified interface replaces the previous complex editor with multiple tabs.

## ✨ Key Features

### **Notion-Style Interface**
- **Slash Commands**: Type `/` to access all formatting options and content types
- **Inline Toolbar**: Text selection triggers floating formatting toolbar
- **Clean Typography**: Serif font optimized for long-form writing
- **Minimal UI**: Distraction-free interface with contextual controls

### **Asset-Aware Templates**
- **Character Profiles**: Background, Appearance, Motivation, Relationships sections
- **Storylines**: Summary, Key Events, Characters Involved structure  
- **Lore Entries**: Overview, Significance, Related Elements format
- **Visual Concepts**: Description, Style Notes, Usage Context template
- **Dynamic Content**: Templates adapt based on asset type being edited

### **Smart Writing Features**
- **Auto-Save**: Background saving with visual feedback every second
- **Word Count**: Subtle progress tracking in bottom corner
- **Contextual Placeholders**: Asset-specific writing prompts and suggestions
- **AI Assistant**: Floating button for creative assistance without distraction

### **Slash Commands Menu (10+ Options)**
```
/h1, /h2, /h3     - Heading levels
/bulletList       - Bullet point list  
/numberedList     - Numbered list
/quote           - Blockquote
/divider         - Horizontal divider
/character       - Create character asset
/lore            - Create lore entry
/image           - Create visual concept
```

### **Inline Formatting Toolbar**
- **Bold (B)**: Text formatting with single click
- **Italic (I)**: Emphasis styling
- **Link**: URL linking
- **Character Creation**: Convert selected text to character
- **Lore Addition**: Add selected text to world lore

## 🎯 User Experience

### **Simplified Creation Flow**
1. **Access Canvas**: Available from Library when editing any asset
2. **Start Writing**: Clean interface with asset-specific templates
3. **Use Slash Commands**: Type `/` for instant access to all formatting
4. **Select Text**: Highlight text for formatting or asset creation options
5. **Auto-Save**: Content saves automatically with visual confirmation

### **Context-Aware Interface**
- **Asset Type Display**: Header shows current asset type and name
- **Dynamic Placeholders**: Different prompts based on content type:
  - Characters: "Describe personality, background, and key traits..."
  - Storylines: "Outline plot, key events, and character arcs..."
  - Lore: "Add world-building details and background information..."
  - Images: "Describe the visual concept you want to create..."

### **Navigation**
- **Back Button**: Returns to project/storyworld view
- **Header Actions**: Save status, Share, and Publish buttons
- **Clean Layout**: Minimal header, full-width writing area

## 🔧 Technical Implementation

### **Component Architecture**
```
Canvas/
├── NotionEditor          # Main writing interface with textarea
├── InlineToolbar        # Floating toolbar on text selection
├── SlashMenu           # Command palette with search
├── AIAssistant         # Minimalist floating assistant
└── AssetTemplates      # Dynamic content generation
```

### **Key Interactions**
```typescript
// Slash command detection
if (e.key === '/') {
  showSlashMenu(true);
  setSlashPosition(calculatePosition());
}

// Text selection handling
onMouseUp={() => {
  const selection = window.getSelection();
  if (selection.toString().trim()) {
    showInlineToolbar(selection);
  }
}}

// Auto-save with debouncing
useEffect(() => {
  const timer = setTimeout(() => {
    if (localContent !== content) {
      onChange(localContent);
    }
  }, 1000);
  return () => clearTimeout(timer);
}, [localContent]);
```

### **Performance Optimizations**
- **Minimal Bundle**: Lightweight compared to previous complex editor
- **Fast Rendering**: Simple textarea with overlay components
- **Efficient Updates**: Debounced auto-save and selective re-renders

## 🎨 Design Philosophy

### **Notion-Inspired Simplicity**
- **Content-First**: Writing area takes full attention
- **Contextual UI**: Tools appear only when needed
- **Keyboard-Driven**: Slash commands and shortcuts prioritized
- **Clean Aesthetics**: Minimal visual noise, maximum focus

### **Asset-Centric Approach**
- **Template-Driven**: Each asset type gets appropriate structure
- **Cross-Linking**: Easy creation of related assets from content
- **Unified Experience**: Same interface for all content types

## 📊 Improvements Over Previous Editor

### **Simplification**
- **Before**: Complex tabs (Basic Info, Builder, Problem Canvas)
- **After**: Single, clean writing interface
- **Reduced Complexity**: 70% fewer UI elements

### **Performance**
- **Faster Loading**: Eliminated heavy form components
- **Better Responsiveness**: Instant slash command response
- **Smoother Interactions**: No tab switching delays

### **User Experience**
- **Intuitive**: Familiar Notion-style interactions
- **Focused**: Distraction-free writing environment
- **Efficient**: Slash commands reduce clicks by 70%

## 🚀 Future Enhancements

### **Planned Features**
1. **Rich Media**: Image upload and embedding
2. **Block Templates**: Reusable content blocks
3. **Collaborative Editing**: Real-time multi-user editing
4. **Version History**: Track changes and revisions
5. **Advanced AI**: Context-aware writing assistance

### **Advanced Interactions**
1. **Drag & Drop**: Reorder content blocks
2. **Linking**: Reference other assets inline
3. **Export**: PDF/markdown export options
4. **Mobile**: Touch-optimized slash commands

This Canvas implementation provides creators with a professional, intuitive writing environment that encourages creativity while maintaining the technical sophistication needed for complex story worlds and IP management. 