var doc = app.activeDocument;

function list_styles() {
    for (var i = 0; i < doc.graphicStyles.length; i++) {
        alert('style['+i+']: '+doc.graphicStyles[i].name);
        if ( i > 8 ) {
            alert('(breaking at 8...'); break;
        }
    };
}

function layers_in_doc(doc) {
    for (var i = 0; i < doc.layers.length; i++) {
        doc.activeLayer = doc.layers[i];
        alert('layer['+i+']: '+doc.layers[i].name)
    };
}

function find_like_name(name) {
    var num = 0;
    var item = null;
    var found = new Array();

    for (var i = 0; i < doc.pathItems.length; i++) {
        item = doc.pathItems[i];
        if (item.name == name) {
            num++;
            found.push(item);
        }
    }
    alert('Found '+num+' named '+name);
    return found;
}

function assign_and_dupe(list, targetLayer) {
    doc.activeLayer = doc.layers.add();
    var newOnes = new Array();
    var dupe;
    basename = prompt("Enter basename:", "autoname");
    for (var i =0; i < list.length; i++) {
        list[i].name = basename+':'+i;
        dupe = list[i].duplicate();
        dupe.move(doc.activeLayer, ElementPlacement.PLACEATBEGINNING);

        newOnes.push(dupe);
    };
    return newOnes;
}

// Create a layer and activate it.
these = assign_and_dupe(doc.selection)

alert(these)
