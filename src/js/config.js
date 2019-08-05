/*
MIT License
Copyright (c) 2018 Cybozu
https://github.com/kintone/SAMPLE-1-user-limit-plug-in/blob/master/LICENSE
*/

jQuery.noConflict();
(function($, PLUGIN_ID) {
  'use strict';
  // Get configuration settings
  var CONF = kintone.plugin.app.getConfig(PLUGIN_ID);
  var $form = $('.js-submit-settings');
  var $cancelButton = $('#js-cancel-button');
  var $user = $('select[name="js-select-user-field"]');
  var $error = $('input[name="js-error-text"]');

  function escapeHtml(htmlstr) {
    return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function setDropDown() {
    // Retrieve field information, then set dropdown
    return KintoneConfigHelper.getFields('USER_SELECT').then(function(resp) {
      resp.forEach(function(field) {
        var $option = $('<option>');

        $option.attr('value', field.code);
        $option.text(escapeHtml(field.label));
        $user.append($option.clone());
      });
      $user.val(CONF.user_selection);
      $error.val(CONF.error_message);
    }).catch(function(err) {
      return alert('Failed to retrieve field(s) information');
    });
  }

  // Set dropdown list
  setDropDown();
  // Set input values when 'Save' button is clicked
  $form.on('submit', function(e) {
    e.preventDefault();
    var config = {};
    config.user_selection = $user.val();
    config.error_message = $error.val();
    kintone.plugin.app.setConfig(config, function() {
      alert('The plug-in settings have been saved. Please update the app!');
      window.location.href = '/k/admin/app/flow?app=' + kintone.app.getId();
    });
  });
  // Process when 'Cancel' is clicked
  $cancelButton.click(function() {
    window.location.href = '/k/admin/app/' + kintone.app.getId() + '/plugin/';
  });
})(jQuery, kintone.$PLUGIN_ID);
