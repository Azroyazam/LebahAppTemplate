
/***********************************************************************************************
    
    This function will initialize the Bootstrap's popover even if it is loaded by AJAX.
    Example usage:
    
    -->> using <a>
    <a id="IDPREFIX_ITEMID" href="javascript:showPopover('ITEMID', 'IDPREFIX')"
     data-toggle="popover" data-trigger="focus"></a>

    -->> retContent function
    function retContent(itemId)
    {
        var viewRoomContent =
            "<ul style='margin-bottom: 0px; padding-left: 15px;'>" + 
                "<li><a href='javascript:viewRoom(\"" + itemId + "\")'>View Room</a></li>" + 
                "<li><a href='javascript:editRoom(\"" + itemId + "\")'>Edit Room</a></li>" + 
            "</ul>";

        return viewRoomContent;
    }

***********************************************************************************************/
function showPopover(ITEMID, IDPREFIX)
{
    _jqb('#' + IDPREFIX + '_' + ITEMID).popover({
        content: retContent(ITEMID),
        html: true
    });

    _jqb('#' + IDPREFIX + '_' + ITEMID).popover('show');
}

