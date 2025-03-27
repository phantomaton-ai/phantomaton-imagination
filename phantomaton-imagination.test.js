import imagination from './phantomaton-imagination.js';
import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';
import lovecraft from 'lovecraft';
import fs from 'fs';
import path from 'path';

const { expect, stub } = lovecraft;

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
        plugins.define(execution.executioner)
          .with(execution.command)
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

    const projectDir = 'data/projects'; // Assuming projects are in data/projects
    const destPath = path.join(projectDir, attributes.project, attributes.file);

    const copyFileSyncStub = stub(fs, 'copyFileSync');
    const result = await imagineCommand.execute(attributes, body, context);

    expect(copyFileSyncStub).toHaveBeenCalledWith('test-image.png', destPath);
    expect(result).toBe(`Image generated and saved to ${destPath}`);

    copyFileSyncStub.restore();
    fs.unlinkSync('test-image.png');
  });
});