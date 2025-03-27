import { expect, stub } from 'lovecraft';
import hierophant from 'hierophant';
import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';
import fs from 'fs';
import path from 'path';

import imagination from './phantomaton-imagination.js';
import stability from 'phantomaton-stability.js';

describe('phantomaton-imagination', () => {
  let copyFileSyncStub;

  beforeEach(() => {
    copyFileSyncStub = stub(fs, 'copyFileSync');
  });

  afterEach(() => {
    copyFileSyncStub.restore();
  });

  it('does register the imagine command and copies the image to the specified file', async () => {
    const mockAdapter = {
      imagine: async (prompt) => {
        return 'mock-image-path.png'; // Return a mock image path
      }
    };

    // Create a mock plugin that exposes an imagination adapter
    const mockAdapterPlugin = plugins.create([
      plugins.define(imagination.adapter).as(mockAdapter)
    ]);
    
    // Create a hierophant container
    const container = hierophant();

    // Install the phantomaton-imagination plugin
    [
      mockAdapterPlugin,
      imagination,
      execution
    ].forEach(p => p().install.forEach(c => container.install(c)));
    
    // Resolve the execution.command from the container
    const commands = container.resolve(execution.command.resolve);
    
    // Find the imagine command
    const imagineCommand = commands[0].find(c => c.name === 'imagine');
    expect(imagineCommand).not.eq(undefined);

    // Call the execute function with the project, file, and body
    const attributes = { project: 'test-project', file: 'image.png' };
    const body = 'A cat riding a unicorn';

    const projectDir = 'data/projects'; // Assuming projects are in data/projects
    const destPath = path.join(projectDir, attributes.project, attributes.file);
    
    // Execute the imagine command
    const result = await imagineCommand.execute(attributes, body);

    expect(copyFileSyncStub.callCount).eq(1);
    expect(copyFileSyncStub.lastCall.args).deep.eq(['mock-image-path.png', destPath]);
    expect(result).eq(destPath);
  });

  it('does integrate with phantomaton-stability and copies the image to the specified file', async () => {
    // Create a hierophant container
    const container = hierophant();

    // Install the phantomaton-imagination plugin
    [
      stability,
      imagination,
      execution
    ].forEach(p => p().install.forEach(c => container.install(c)));
    
    // Resolve the execution.command from the container
    const commands = container.resolve(execution.command.resolve);
    
    // Find the imagine command
    const imagineCommand = commands[0].find(c => c.name === 'imagine');
    expect(imagineCommand).not.eq(undefined);

    // Call the execute function with the project, file, and body
    const attributes = { project: 'test-project', file: 'image.png' };
    const body = 'A cat riding a unicorn';

    const projectDir = 'data/projects'; // Assuming projects are in data/projects
    const destPath = path.join(projectDir, attributes.project, attributes.file);
    
    // Execute the imagine command
    const result = await imagineCommand.execute(attributes, body);

    expect(copyFileSyncStub.callCount).eq(1);
    expect(copyFileSyncStub.lastCall.args).deep.eq(['path/to/generated/image.png', destPath]);
    expect(result).eq(destPath);
  });
});
