var doc = app.activeDocument;

function group_by_name() {
    // Find all pathItems with the same name and group them.
    var groups ={};
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

function name_and_dupe(list) {
    // Copy the selected items to a new layer.
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



function rename_twins(list, basename, sortf) {
    var groups = group_by_name();
    var lookfor = null;
    var idx = 0;

    list = sortf(list)

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

function add_labels(selected) {
    var groups = group_by_name();
    var curPath = null;
    var label = '';
    var grp = null;

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
}

var promptmsg = "Please make a copy of your work before you run this.\n";
promptmsg += "1. Autoname and duplicate all the pieces in a selection.\n";
promptmsg += "2. Rename each piece, and its twin, in a selection.\n";
promptmsg += "q. Quit.\n";

function sort_left_right(list) {
    list.sort(function(a,b) {
        return a.left - b.left;
    });
    return list;
}

function sort_right_left(list) {
    list.sort(function(a,b) {
        aright = a.left+a.width;
        bright = b.left+b.width;
        return bright - aright;
    });
    return list;
}

function sort_up_down(list) {
    list.sort(function(a,b) {
        return b.top - a.top;
    });
    return list;
}

function sort_down_up(list) {
    list.sort(function(a,b) {
        abottom = a.top-a.height;
        bbottom = b.top-b.height;
        return abottom - bbottom;
    });
    return list;
}

function sort_distance(list) {
    X = 800;
    Y = 800;

    list.sort(function(a, b) {
        function distance(item, X, Y) {
            return Math.sqrt(Math.pow(Y-item.top, 2) + Math.pow(X-item.left, 2));
        }
        return distance(a, X, Y) - distance(b, X, Y);
    });
    return list;
}

function mapit(list, fun) {
    L = new Array();
    for (var i=0; i < list.length; i++) {
        L.push(fun(list[i]));
    };
    return L;
}

ans = prompt(promptmsg, 1);
if (ans==1) {
    name_and_dupe(doc.selection)

} else if (ans==2) {
    var selected = doc.selection;
    var ans = null;
    var sorts = {
        'a': sort_left_right,
        'd': sort_right_left,
        'w': sort_up_down,
        's': sort_down_up,
    };

    while (true) {
        ans = prompt("Sort, (w) up->down, (a) left->right, (s) down->up, ((d) right->left:", "a");
        if(sorts[ans]) {
            sortfun = sorts[ans];
            break;
        }
    }

    rename_twins(selected, prompt("Enter a basename:", "Temp"), sortfun);

    add_labels(selected);
    redraw();

} else if (ans=='t') {
    var selected = doc.selection;
    var top = left = bottom = right = null;

    for (var i = 0; i < selected.length; i++) {
        item = selected[i];
        if (!top  || item.top  > top)  { top = item.top; }
        if (!left || item.left > left) { left = item.left; }
        if (!bottom || (item.top-item.height) < bottom) {
            bottom = (item.top-item.height);
        }
        if (!right || (item.left+item.width) > right) {
            right = (item.left+item.width);
        }

    };

    alert("(top, left): ("+top+', '+left+')');

    // alert(bottom);
    // alert(right);


} else if (ans=='q') {
    alert('quit');

}
