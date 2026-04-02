release-cli
=================

一个跨平台 CLI，用来创建或初始化发布流程模板。


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/release-cli.svg)](https://npmjs.org/package/release-cli)
[![Downloads/week](https://img.shields.io/npm/dw/release-cli.svg)](https://npmjs.org/package/release-cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g release-cli
$ release-cli COMMAND
running command...
$ release-cli (--version)
release-cli/0.0.0 linux-x64 node-v20.20.1
$ release-cli --help [COMMAND]
USAGE
  $ release-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`release-cli help [COMMAND]`](#release-cli-help-command)
* [`release-cli plugins`](#release-cli-plugins)
* [`release-cli plugins add PLUGIN`](#release-cli-plugins-add-plugin)
* [`release-cli plugins:inspect PLUGIN...`](#release-cli-pluginsinspect-plugin)
* [`release-cli plugins install PLUGIN`](#release-cli-plugins-install-plugin)
* [`release-cli plugins link PATH`](#release-cli-plugins-link-path)
* [`release-cli plugins remove [PLUGIN]`](#release-cli-plugins-remove-plugin)
* [`release-cli plugins reset`](#release-cli-plugins-reset)
* [`release-cli plugins uninstall [PLUGIN]`](#release-cli-plugins-uninstall-plugin)
* [`release-cli plugins unlink [PLUGIN]`](#release-cli-plugins-unlink-plugin)
* [`release-cli plugins update`](#release-cli-plugins-update)

## `release-cli help [COMMAND]`

Display help for release-cli.

```
USAGE
  $ release-cli help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for release-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.41/src/commands/help.ts)_

## `release-cli plugins`

List installed plugins.

```
USAGE
  $ release-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ release-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/index.ts)_

## `release-cli plugins add PLUGIN`

Installs a plugin into release-cli.

```
USAGE
  $ release-cli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into release-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the RELEASE_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the RELEASE_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ release-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ release-cli plugins add myplugin

  Install a plugin from a github url.

    $ release-cli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ release-cli plugins add someuser/someplugin
```

## `release-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ release-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ release-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/inspect.ts)_

## `release-cli plugins install PLUGIN`

Installs a plugin into release-cli.

```
USAGE
  $ release-cli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into release-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the RELEASE_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the RELEASE_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ release-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ release-cli plugins install myplugin

  Install a plugin from a github url.

    $ release-cli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ release-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/install.ts)_

## `release-cli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ release-cli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ release-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/link.ts)_

## `release-cli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ release-cli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ release-cli plugins unlink
  $ release-cli plugins remove

EXAMPLES
  $ release-cli plugins remove myplugin
```

## `release-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ release-cli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/reset.ts)_

## `release-cli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ release-cli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ release-cli plugins unlink
  $ release-cli plugins remove

EXAMPLES
  $ release-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/uninstall.ts)_

## `release-cli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ release-cli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ release-cli plugins unlink
  $ release-cli plugins remove

EXAMPLES
  $ release-cli plugins unlink myplugin
```

## `release-cli plugins update`

Update installed plugins.

```
USAGE
  $ release-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/update.ts)_
<!-- commandsstop -->
