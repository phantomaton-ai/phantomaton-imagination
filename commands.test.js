import { expect, stub } from 'lovecraft';
import commands from './commands.js';
import fs from 'fs';
import path from 'path';

describe('commands', () => {
  it('does validate the imagine command with correct attributes and body', () => {
    const mockAdapter = { imagine: async (prompt) => 'mock-image-path.png' };
    const commandList = commands([mockAdapter], {});
    const imagineCommand = commandList.find(c => c.name === 'imagine');

    // Test with valid attributes and body
    const validAttributes = { project: 'test-project', file: 'image.png' };
    const validBody = 'A cat riding a unicorn';
    expect(imagineCommand.validate(validAttributes, validBody)).to.eq(true);

    // Test with missing project
    const missingProjectAttributes = { file: 'image.png' };
    expect(imagineCommand.validate(missingProjectAttributes, validBody)).to.eq(false);

    // Test with missing file
    const missingFileAttributes = { project: 'test-project' };
    expect(imagineCommand.validate(missingFileAttributes, validBody)).to.eq(false);

    // Test with missing body
    const missingBody = undefined;
    expect(imagineCommand.validate(validAttributes, missingBody)).to.eq(false);
  });

  it('does execute the imagine command and returns the correct path', async () => {
    const mockAdapter = { imagine: async (prompt) => 'mock-image-path.png' };
    const commandList = commands([mockAdapter], {});
    expect(commandList.length).to.eq(1);
    const imagineCommand = commandList.find(c => c.name === 'imagine');

    const validAttributes = { project: 'test-project', file: 'image.png' };
    const validBody = 'A cat riding a unicorn';

    const projectDir = 'data/projects';
    const destPath = path.join(projectDir, validAttributes.project, validAttributes.file);
    
    const copyFileSyncStub = stub(fs, 'copyFileSync');
    
    const result = await imagineCommand.execute(validAttributes, validBody);

    expect(copyFileSyncStub).toHaveBeenCalledWith('mock-image-path.png', destPath);
    expect(result).to.eq(destPath);
    
    copyFileSyncStub.restore();
  });
});