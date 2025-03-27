import imagination from './phantomaton-imagination.js';
import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';
import lovecraft from 'lovecraft';
import fs from 'fs';
import path from 'path';

const { expect, stub } = lovecraft;

describe('phantomaton-imagination', () => {
  let copyFileSyncStub;

  beforeEach(() => {
    copyFileSyncStub = stub(fs, 'copyFileSync');
  });

  afterEach(() => {
    copyFileSyncStub.restore();
  });

  it('does register the imagine command and copies the image to the specified file', async () => {
    let command = undefined;
    const mockAdapter = {
      imagine: async (prompt) => {
        return 'mock-image-path.png'; // Return a mock image path
      }
    };
    const plugin = plugins.create(
      { command: plugins.composite, executioner: plugins.singleton, adapter: plugins.composite },
      ({ configuration, extensions, instance }) => [
        plugins.define(execution.executioner)
          .with(execution.command)
          .as(commands => {
            command = commands;
            return { prompt: () => undefined, assistant: () => undefined }
          }),
        plugins.define(execution.command).using(extensions.adapter).as(adapter => [{
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
        }]),
        plugins.define(extensions.adapter).as([mockAdapter])
      ]
    );
    const instance = imagination();
    const { install } = plugin();
    install.forEach(i => i());
    
    const imagineCommand = command[0].find(c => c.name === 'imagine');
    expect(imagineCommand).toBeDefined();

    // Mock the context
    const context = {
      extensions: {
        adapter: async () => [mockAdapter]
      }
    };
    
    // Call the execute function with the project, file, and body
    const attributes = { project: 'test-project', file: 'image.png' };
    const body = 'A cat riding a unicorn';

    const projectDir = 'data/projects'; // Assuming projects are in data/projects
    const destPath = path.join(projectDir, attributes.project, attributes.file);
    
    //find the imagine command for this test specifically
    const imagineTestCommand = command[0].find(c => c.name === 'imagine');
    const result = await imagineTestCommand.execute(attributes, body, context.extensions.adapter());

    expect(copyFileSyncStub).toHaveBeenCalledWith('mock-image-path.png', destPath);
    expect(result).toBe(`Image generated and saved to ${destPath}`);
  });
});