/*!
 * Formchat widget loader (embed.js alias)
 */
import("./widget.js").catch(function() {
  var s = document.createElement("script");
  s.src = "/widget.js";
  document.head.appendChild(s);
});
