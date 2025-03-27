import plugins from 'phantomaton-plugins';
import execution from 'phantomaton-execution';
import commands from './commands.js';

const api = plugins.create({
  adapter: plugins.composite
}, ({configuration, extensions}) => [
  plugins.define(
    execution.command
  ).with(
    extensions.adapter
  ).as(
    adapter => commands(adapter, configuration)
  )
]);

export default api;
