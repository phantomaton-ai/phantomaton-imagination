import imagination from './phantomaton-imagination.js';
import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';

describe('phantomaton-imagination', () => {
  it('does register the imagine command and calls the adapter', async () => {
    let command = undefined;
    const mockAdapter = {
      imagine: async (prompt) => `Generated image for prompt: ${prompt}`
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
        plugins.define(extensions.command).using(extensions.adapter).as(adapter => [{
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
    const result = await imagineCommand.execute({ prompt: 'A cat riding a unicorn' }, null, context);
    expect(result).toBe('Generated image for prompt: A cat riding a unicorn');
  });
});