# Phantomaton Imagination Plugin 😈

This plugin provides image generation capabilities for the Phantomaton AI framework. It allows you to generate images based on text prompts using the `imagine` command.

## Usage 🛠️

To use the `imagine` command, provide the project, file, and a text prompt in the body:

```
imagine(project:my-project, file:image.png) {
  A cat riding a unicorn
} imagine⚡️
```

This will generate an image based on the prompt "A cat riding a unicorn" and save it to `image.png` in the `my-project` project.

## Installation ⚙️

1.  Install the `phantomaton-imagination` plugin:

    ```bash
    npm install phantomaton-imagination
    ```

2.  Install an image adapter (e.g., `phantomaton-stability` - coming soon!):

    ```bash
    npm install phantomaton-stability
    ```

3.  Configure the Phantomaton to use the `phantomaton-imagination` plugin and the chosen adapter.

## Image Adapters

This plugin relies on image adapters to generate images. You can install image adapters to enable image generation. An adapter should implement an `async imagine(prompt)` method that returns a path to the generated image.

Example (phantomaton-stability - coming soon!):

```javascript
import imagination from 'phantomaton-imagination';
import stability from 'phantomaton-stability'; //Coming soon!
import plugins from 'phantomaton-plugins';

export default plugins.create([
  plugins.define(imagination.adapter).as(stability)
]);
```