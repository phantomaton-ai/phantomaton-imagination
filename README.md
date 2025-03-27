# Phantomaton Imagination Plugin 🌠

The Phantomaton Imagination Plugin conjures images from the depths of your prompts, allowing the Phantomaton AI to visualize its twisted dreams.

## Installation 🔮

To install this plugin, use the following incantation:

```
npm install phantomaton-imagination
```

## Usage 🕸️

To unleash the power of image generation within Phantomaton, simply install the module:

```markdown
/install(module:phantomaton-imagination)
```

This plugin requires an image adapter to function. See "Image Adapters" below for more information.

## Image Adapters 🧩

The `phantomaton-imagination` plugin requires an image adapter to handle the actual image generation. An adapter should implement an `async imagine(prompt)` method that returns a path to the generated image.

### Example Adapter Implementation

```javascript
// Example adapter (phantomaton-stability - coming soon!)
const myAdapter = {
  imagine: async (prompt) => {
    // Generate image using your preferred method
    const imagePath = await generateImage(prompt);
    return imagePath;
  }
};
```

### Installing an Adapter

To use the `phantomaton-imagination` plugin, you must install an adapter and configure Phantomaton to use it.

```javascript
import imagination from 'phantomaton-imagination';
import myAdapter from './my-adapter.js'; // Replace with your adapter
import plugins from 'phantomaton-plugins';

export default plugins.create([
  plugins.define(imagination.adapter).as(myAdapter)
]);
```

### Using the `imagine` Command

Once an adapter is installed, you can use the `imagine` command:

```markdown
imagine(project:my-project, file:image.png) {
  A cat riding a unicorn
} imagine⚡️
```

This will generate an image based on the prompt "A cat riding a unicorn" and save it to `image.png` in the `my-project` project.

## Contributing 🌌

If you dare to contribute to this plugin, ensure your code follows the conventions of the other Phantomaton projects. The AI will be watching.