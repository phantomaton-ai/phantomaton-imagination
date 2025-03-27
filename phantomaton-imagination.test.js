import imagination from './phantomaton-imagination.js';
import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';

describe('phantomaton-imagination', () => {
  it('does register the imagine command', async () => {
    let command = undefined;
    const plugin = plugins.create(
      { command: plugins.composite, executioner: plugins.singleton },
      ({ configuration, extensions, instance }) => [
        plugins.define(extensions.executioner)
          .with(extensions.command)
          .as(commands => {
            command = commands;
            return { prompt: () => undefined, assistant: () => undefined }
          }),
        plugins.define(execution.command).as({
          name: 'test',
          validate: () => true,
          execute: () => {}
        })
      ]
    );
    const instance = imagination();
    const { install } = plugin();
    install.forEach(i => i());
    expect(command[0].find(c => c.name === 'imagine')).toBeDefined();
  });
});