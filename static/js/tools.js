
function minMaxFactory ( prefix, col ) {
    /*
     * Returns a function that will specify whether column `col` is within the
     * bounds of the values of the currently-entered values for the text inputs
     * labeled `prefix` + "_min" and `prefix` + "_max".
     */

    return function( oSettings, aData, iDataIndex ) {
        var iMin = $("#" + prefix + "_min").val();
        var iMax = $("#" + prefix + "_max").val();
        var iVersion = Number(aData[col]);
        if ( iMin == "" && iMax == "" )
        {
            return true;
        }
        else if ( iMin == "" && iVersion <= iMax )
        {
            return true;
        }
        else if ( iMin <= iVersion && "" == iMax )
        {
            return true;
        }
        else if ( iMin <= iVersion && iVersion <= iMax )
        {
            return true;
        }
        return false;
    }
}

/* 
 * Returns a function that will return whether a row is up or downregulated
 * depending on the p-value entered in the text input labeled `id`.
 *
 * Needs to know the id of the text input, which columns correspond to log fold
 * change and padj, and a direction of "up" or "down".
 */
function regulatedFactory ( id, lfcCol, padjCol, direction ) {
    return function( oSettings, aData, iDataIndex ) {
        var thresh = $("#" + id).val();
        var padj = aData[padjCol];
        var lfc = aData[lfcCol];
        if (direction == "up"){
            if ((lfc >= 0) & (padj <= thresh)){
                return true;
            }
        }
        else if (direction == "down"){
            if ((lfc <= 0) & (padj <= thresh)){
                return true;
            }
        }
        return true;
    }
}


(function($) {
/*
 * Function: fnGetColumnData
 * Purpose:  Return an array of table values from a particular column.
 * Returns:  array string: 1d data array
 * Inputs:   object:oSettings - dataTable settings object. This is always the last argument past to the function
 *           int:iColumn - the id of the column to extract the data from
 *           bool:bUnique - optional - if set to false duplicated values are not filtered out
 *           bool:bFiltered - optional - if set to false all the table data is used (not only the filtered)
 *           bool:bIgnoreEmpty - optional - if set to false empty values are not filtered from the result array
 * Author:   Benedikt Forchhammer <b.forchhammer /AT\ mind2.de>
 */
$.fn.dataTableExt.oApi.fnGetColumnData = function ( oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty ) {
    // check that we have a column id
    if ( typeof iColumn == "undefined" ) return new Array();

    // by default we only want unique data
    if ( typeof bUnique == "undefined" ) bUnique = true;

    // by default we do want to only look at filtered data
    if ( typeof bFiltered == "undefined" ) bFiltered = true;

    // by default we do not want to include empty values
    if ( typeof bIgnoreEmpty == "undefined" ) bIgnoreEmpty = true;

    // list of rows which we're going to loop through
    var aiRows;

    // use only filtered rows
    if (bFiltered == true) aiRows = oSettings.aiDisplay;
    // use all rows
    else aiRows = oSettings.aiDisplayMaster; // all row numbers

    // set up data array
    var asResultData = new Array();

    for (var i=0,c=aiRows.length; i<c; i++) {
        iRow = aiRows[i];
        var aData = this.fnGetData(iRow);
        var sValue = aData[iColumn];

        // ignore empty values?
        if (bIgnoreEmpty == true && sValue.length == 0) continue;

        // ignore unique values?
        else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1) continue;

        // else push the value onto the result data array
        else asResultData.push(sValue);
    }

    return asResultData;
}}(jQuery));

