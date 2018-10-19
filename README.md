# wbp-matheval
Plugin for Blumentals WeBuilder/RapidPHP/RapidCSS/HTMLPad editors

This is a plugin for the following editors:

Webuilder: http://www.webuilderapp.com/<br/>
RapidPHP: http://www.rapidphpeditor.com/<br/>
RapidCSS: https://www.rapidcsseditor.com/<br/>
HTMLPad: https://www.htmlpad.net/


#### Function:
Allows you to evaluate mathematical expression in selection or on current line. Result will then be inserted in the editor.
Plugin can be activated either by menu or by pressing the HotKey Ctrl+'

You can use all JavaScript Math Object Methods in your mathematical expression with or without preceding it with "Math."
*abs(x), acos(x), asin(x), atan(x), atan2(y,x), ceil(x), cos(x), exp(x), floor(x), log(x), max(x,y,z,...,n), min(x,y,z,...,n), pow(x,y), random(), round(x), sin(x), sqrt(x) and tan(x)*

Example: pow(6,8) or Math.pow(6,8)

The following Math Constants are also valid: *E, LN2, LN10, LOG2E, LOG10E, PI, SQRT1_2, SQRT2*

###How it works:
 * If you make a SELECTION and activate the plugin, the SELECTION will be evaluated and the REPLACED by the mathematical result.
 * If the line ENDS with a "=" sign, anything on the LEFT of the "=" will be evaluated and the result will be INSERTED after the "=" sign.
 * Otherwise, if the line CONTAINS a "=" sign, anything on the RIGHT of the "=" will be evaluated and the REPLACED by the mathematical result.

#### Installation:
1) Download plugin .ZIP file.
2) Open editor and select "Plugins -> Manage Plugins" from the menu.
3) Click "Install" and select the .ZIP file you downloaded in step 1.
