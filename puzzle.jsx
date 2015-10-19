var doc = app.activeDocument;

function list_styles() {
    for (var i=0; i < doc.graphicStyles.length; i++) {
        alert('style['+i+']: '+doc.graphicStyles[i].name);
        if ( i > 8 ) {
            alert('(breaking at 8...'); break;
        }
    };
}

function layers_in_doc(doc) {
    for (var i=0; i < doc.layers.length; i++) {
        doc.activeLayer = doc.layers[i];
        alert('layer['+i+']: '+doc.layers[i].name)
    };
}

function find_like_name(name) {
    var num = 0;
    var item = null;
    var found = new Array();

    for (var i=0; i < doc.pathItems.length; i++) {
        item = doc.pathItems[i];
        if (item.name == name) {
            num++;
            found.push(item);
        }
    }
    alert('Found '+num+' named '+name);
    return found;
}

function group_by_name() {
    var groups ={};
    // Find all pathitems
    for (var i=0; i < doc.pathItems.length; i++) {
        item = doc.pathItems[i];

        if (item.name && !groups[item.name]) {
            groups[item.name] = new Array();
        }

        if (item.name) {
            groups[item.name].push(item)
        }
    }
    return groups;
}

function name_and_dupe(list, targetLayer) {
    doc.activeLayer = doc.layers.add();
    var dupe;

    // basename is number of mseconds since midnight jan 1, 1970 UTC
    var basename = (new Date()).valueOf().toString();
    for (var i=0; i < list.length; i++) {
        list[i].name = basename+':'+i;
        dupe = list[i].duplicate();
        dupe.move(doc.activeLayer, ElementPlacement.PLACEATBEGINNING);
    };
    return 1;
}

function rename_twins(list, basename) {
    var groups = group_by_name();
    var lookfor = null;
    var idx = 0;
    for (var i=0; i < list.length; i++) {
        lookfor = list[i].name;
        if (groups[lookfor]) {
            idx++;
            for (var j = 0; j < groups[lookfor].length; j++) {
                groups[lookfor][j].name = basename+' '+idx;
            };
        }
    };
}

var promptmsg = "Please make a copy of your work before you run this.\n";
promptmsg += "1. Autoname and duplicate all the pieces in a selection.\n";
promptmsg += "2. Rename each piece, and its twin, in a selection.\n";
promptmsg += "q. Quit.\n";

ans = prompt(promptmsg, 3);
if (ans==1) {
    name_and_dupe(doc.selection)

} else if (ans==2) {
    var n = 0;
    var selected = doc.selection;
    var groups = null;
    var curPath = null;
    var label = '';
    var grp = null;

    rename_twins(selected, prompt("Enter a basename:", "BinName"));
    groups = group_by_name();

    for (var i=0; i < selected.length; i++) {

        if(selected[i].name && groups[selected[i].name]) {
            for (var j=0; j < groups[selected[i].name].length; j++) {
                curPath = groups[selected[i].name][j];

                label = doc.textFrames.add();
                label.contents = selected[i].name;
                label.top = curPath.top-(curPath.height/2);
                label.left = curPath.left+(curPath.width/2);

                grp = doc.groupItems.add();
                curPath.moveToBeginning(grp);
                label.moveToBeginning(grp);
            }
        }
    };
    redraw();

} else if (ans=='q') {
    alert('quit');

}
