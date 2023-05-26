/*
* log;
*/
function system_log(value:any):void
{
    // if (GameConfig.language && GameConfig.language.showLog=="true")
    if (value instanceof Object)
    {
        try {
             value=JSON.stringify(value);
        } catch (error) {
            console.error(error)
        }
    }       
    console.log(value);
}

