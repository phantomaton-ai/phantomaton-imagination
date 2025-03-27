import { expect, stub } from 'lovecraft';

import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';
import fs from 'fs';
import path from 'path';

import imagination from './phantomaton-imagination.js';

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