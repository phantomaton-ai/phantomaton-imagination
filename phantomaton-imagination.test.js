import imagination from './phantomaton-imagination.js';
import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';
import fs from 'fs';

// Mock the fs.copyFileSync function
jest.mock('fs');

describe('phantomaton-imagination', () => {
  it('does register the imagine command and copies the image to the specified file', async () => {
    let command = undefined;
    const mockAdapter = {
      imagine: async (prompt) => {
        // Create a dummy image file for testing
        const imagePath = 'test-image.png';
        fs.writeFileSync(imagePath, 'fake image data');
        return imagePath;
      }
    };
    const plugin = plugins.create(
      { command: plugins.composite, executioner: plugins.singleton, adapter: plugins.composite },
      ({ configuration, extensions, instance }) => [
        plugins.define(extensions.executioner)
          .with(extensions.command)
          .as(commands => {
            command = commands;
            return { prompt: () => undefined, assistant: () => undefined }
          }),
        plugins.define(execution.command).using(extensions.adapter).as(adapter => [{
          name: 'test',
          validate: () => true,
          execute: () => {}
        }]),
        plugins.define(extensions.adapter).as(mockAdapter)
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
    const result = await imagineCommand.execute(attributes, body, context);

    expect(fs.copyFileSync).toHaveBeenCalledWith('test-image.png', 'data/projects/test-project/image.png');
    expect(result).toBe('Image generated and saved to data/projects/test-project/image.png');

    // Clean up the dummy image file
    fs.unlinkSync('test-image.png');
  });
});