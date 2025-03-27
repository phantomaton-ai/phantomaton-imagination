import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';

import commands from './commands.js';

export default plugins.create({
  adapter: plugins.composite
}, ({ configuration, extensions }) => [
  plugins.define(
    execution.command
  ).with(
    extensions.adapter
  ).as(
    adapter => commands(adapter, configuration)
  )
]);
