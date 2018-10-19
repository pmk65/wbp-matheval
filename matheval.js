/**
 * Evaluate math argument on line or selection and returns result to editor
 *
 * @category  WeBuilder Plugin
 * @package   Math Eval
 * @author    Peter Klein <pmk@io.dk>
 * @copyright 2017
 * @license   http://www.freebsd.org/copyright/license.html  BSD License
 * @version   2.0
 */

/**
 * [CLASS/FUNCTION INDEX of SCRIPT]
 *
 *     29   function GetMathExpression()
 *     70   function MathEval(mathExp, orgLine, replaceMode)
 *    145   function OnInstalled()
 *
 * TOTAL FUNCTIONS: 3
 * (This index is automatically created/updated by the WeBuilder plugin "DocBlock Comments")
 *
 */

/**
 * Get math argument from editor
 *
 * @return void
 */
function GetMathExpression() {

	// Alow multiline math expression if selection mode is used
	var orgLine = RegexReplace(Editor.SelText, "\\n|\\r", " ", true);
	var mathExp = "";

	if (Trim(orgLine) != "") {
		// We got a selection
		mathExp = Trim(orgLine);
		MathEval(mathExp, orgLine, true);
	}
	else {
		// We don't have a selection, so we use current line
		orgLine = Editor.LinesAsDisplayed[Editor.Selection.SelStartLine];

		// Does line end with a "=" sign?
		if (RegexMatch(Trim(orgLine), "=$", true) != "") {
			// Remove anything before a semicolon
			mathExp = Trim(RegexReplace(orgLine, ".*;", "", true));
			// Remove the "=" sign
			mathExp = RegexReplace(mathExp, "=$", "", true);
			MathEval(mathExp, orgLine, false);
		}
		// Is there any other "=" signs?
		else if (RegexMatch(orgLine, "=", true) != "") {
			// Remove anything to the left of the "=" sign
			mathExp = Trim(RegexReplace(orgLine, "(.*=)(?:(?!.*=))", "", true));
			MathEval(mathExp, orgLine, true);
		}
	}
}

/**
 * Evaluate selection and insert the evaluated math expression in editor.
 *
 * @param  string   mathExp
 * @param  string   orgLine
 * @param  bool     replaceMode
 *
 * @return void
 */
function MathEval(mathExp, orgLine, replaceMode) {

	var data = RegexReplace(mathExp, "(?:Math\\.)?((?:abs|acos|asin|atan|atan2|ceil|cos|exp|floor|log|max|min|pow|random|round|sin|sqrt|tan)\\()", "Math.$1", false);
	data = RegexReplace(data, "\\b(?:Math\\.)?(E|LN2|LN10|LOG2E|LOG10E|PI|SQRT1_2|SQRT2)\\b", "Math.$1", false);
	try {
		SC = CreateOleObject("MSScriptControl.ScriptControl");
		SC.Language = "JScript";
		data = SC.Eval("new Function('return ("+ data + ")')()");
	}
	except {
		data = "NaN";
	}

	// Test if result is a valid number. This is needed as directly invalid arguments
	// like: "foo" raises exception, where illegal math expressions like "8/0" returns
	// an "INF" value.
	if (!ValidFloat(data)) {
		// Not a valid result
		Alert("Error: \"" + mathExp + "\" is not a valid mathematical expression!");
		return;
	}

	// Since JScript has an anoying quirk of returning floating values with either
	// a "." or a "," as decimal separator (depending on regional settings of system),
	// we need to make sure it uses "." (the standard in most other programming languages).

	// Create a floating point number and remove the digits to get the decimal seperator
	// that is used on this setup/computer.
    var decimalSeparator = RegexReplace(_t(5/2), "\\d*", "", true);
	// Replace the decimal separator with a "."
	data = Replace(data, decimalSeparator, ".");

	var uSel = Editor.Selection;
	var len = Length(orgLine);

	Editor.BeginEditing;

	if (replaceMode) {
		// Replace mode

		if (Trim(Editor.SelText) == "") {

			// No selection, so we make replacement on original line
			data = Replace(orgLine, mathExp, data);

			// Select entire line
			uSel.SelEndLine = uSel.SelStartLine;
			uSel.SelStartColReal = 0;
			uSel.SelEndColReal = len;
			Editor.Selection = uSel;
		}
	}
	else {
		// Insert mode

		// Place cursor at end of line
		uSel.SelEndLine = uSel.SelStartLine;
		uSel.SelStartColReal = len;
		uSel.SelEndColReal = len;
		Editor.Selection = uSel;

	}

	// Insert result
	Editor.SelText = data;

	Editor.EndEditing;

}

/**
 * Show info when plugin is installed
 *
 * @return void
 */
function OnInstalled() {
	alert("Math Eval 2.0 by Peter Klein installed sucessfully!");
}

Script.ConnectSignal("installed", "OnInstalled");

var bmp = new TBitmap;
LoadFileToBitmap(Script.Path + "math_icon.png", bmp);
var act = Script.RegisterDocumentAction("", "Math Eval", "Ctrl+'", "GetMathExpression");
Actions.SetIcon(act, bmp);
delete bmp;