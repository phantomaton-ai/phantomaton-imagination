import fs from 'fs';
import path from 'path';

const commands = (adapter, configuration) => {
  return [
    {
      name: 'imagine',
      description: 'Generate an image based on a text prompt and save it to a file.',
      example: { attributes: { project: 'my-project', file: 'image.png' }, body: 'A cat riding a unicorn' },
      validate: (attributes, body) => !!attributes.project && !!attributes.file && !!body,
      execute: async (attributes, body) => {
        const { project, file } = attributes;
        const prompt = body;
        if (!adapter || adapter.length === 0) {
          return 'No image adapter available.';
        }
        const imagePath = await adapter[0].imagine(prompt); // Path to the generated image
        
        // Copy the image to the specified project and file
        const projectDir = 'data/projects'; // Assuming projects are in data/projects
        const destPath = path.join(projectDir, project, file);
        
        fs.copyFileSync(imagePath, destPath); // Copy the file
        
        return `Image generated and saved to ${destPath}`;
      }
    }
  ];
};

export default commands;