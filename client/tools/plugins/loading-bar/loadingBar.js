'use strict';

// This is the main module of the plugin where you define
// add, remove, move method to manage elements.

// rekitCore is the one that is dependent by the project using the plugin.
// You may need it to perform common tasks such as use refactor to rename variables in a module.

function handleElement(rekitCore) {
  function add(feature, name) {
    console.log('Adding loading-bar.');

  }

  function remove(feature, name) {
    console.log('Removing loading-bar.');
  }

  function move(source, target) {
    console.log('Moving loading-bar.');
  }

  /* Uncomment below code to enable installation and uninstallation*/
  function install() {
    // Called when using 'rekit install plugin-name' to install the plugin.
    // Should check repeated installation.

    console.log('Installing loading-bar');
    const refactor = rekitCore.refactor;

    // Apply redux-saga middleware
    const configStorePath = utils.mapSrcFile('common/configStore.js');

    // Import saga modulesinit
    refactor.updateFile(configStorePath, ast => [].concat(
      refactor.addImportFrom(ast, 'react-redux-loading-bar', 'loadingBarMiddleware'),
      refactor.addToArray(ast, 'middlewares', 'loadingBarMiddleware')
    ));
    vio.save(configStorePath, lines);
  }
  function uninstall() {
    // Called when using 'rekit uninstall plugin-name' to install the plugin.
    // Should check repeated uninstallation.
    console.log('Uninstalling loading-bar');
  }
  return {
    add,
    remove,
    move,
    // install,
    // uninstall,
  };
}

module.exports = handleElement;
