/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is iGFW.
 *
 * The Initial Developer of the Original Code is
 * Honnix.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */

var igfw = {
  prefs: null,
  background: "#eee",
  filterList: null,

  loadPrefs: function() {
    this.background = this.prefs.getCharPref("background");
    var filterString = this.prefs.getCharPref("filterlist");
    this.filterList = filterString.replace("\r", "").split("\n");
  },

  highlight: function() {
    $("a", window.content.document).each(function(i) {
        if (this.href != null) {
          for (var j = 0; j < igfw.filterList.length; ++j) {
            if (igfw.filterList[j] != "" && this.href.match(igfw.filterList[j])) {
              $(this).css("background", igfw.background);
            }
          }
        }
      });
  },

  onLoad: function() {
    this.prefs = Components.classes["@mozilla.org/preferences;1"].
                            getService(Components.interfaces.nsIPrefService).
                            getBranch("extensions.igfw.");
    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefs.addObserver("", this, false);

    this.loadPrefs();
  },

  onStatusClick: function(e) {
    if (e.button == 0) {
      this.highlight();
    }
    else if (e.button == 2) {
      window.openDialog("chrome://igfw/content/options.xul", "iGFW Preferences", 
                        "chrome,centerscreen,titlebar,toolbar,dialog=no,resizable");
    }
  },
  
  onMenuItemCommand: function(e) {
    this.highlight();
  },

  observe: function(subject, topic, data) {
    if (topic == "nsPref:changed") {
      switch (data) {
        case "background":
        case "filterlist":
          this.loadPrefs();

          break;

        default:
          break;
      }
    }
  },

};

window.addEventListener("load", function(e) { igfw.onLoad(e); }, false);
