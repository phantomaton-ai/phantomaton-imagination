import { expect } from 'lovecraft';
import commands from './commands.js';

describe('commands', () => {
  it('does validate the imagine command with correct attributes and body', () => {
    const mockAdapter = { imagine: async (prompt) => 'mock-image-path.png' };
    const commandList = commands([mockAdapter], {});
    const imagineCommand = commandList.find(c => c.name === 'imagine');

    // Test with valid attributes and body
    const validAttributes = { project: 'test-project', file: 'image.png' };
    const validBody = 'A cat riding a unicorn';
    expect(imagineCommand.validate(validAttributes, validBody)).toBe(true);

    // Test with missing project
    const missingProjectAttributes = { file: 'image.png' };
    expect(imagineCommand.validate(missingProjectAttributes, validBody)).toBe(false);

    // Test with missing file
    const missingFileAttributes = { project: 'test-project' };
    expect(imagineCommand.validate(missingFileAttributes, validBody)).toBe(false);

    // Test with missing body
    const missingBody = undefined;
    expect(imagineCommand.validate(validAttributes, missingBody)).toBe(false);
  });
});