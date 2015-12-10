// GROUP BY method
TAFFY.extend("group",function (cols) {
    var db, groups, i, j, result = [];
    this.context({
        results: this.getDBI().query(this.context())
    });

    db = TAFFY(this.context().results);
    groups = db().distinct.apply(db(), arguments);

    if(!(groups[0] instanceof Array)) {
      for(i = 0;i < groups.length;i++){
        groups[i] = [groups[i]];
      }
    }

    for(i=0;i<groups.length;i++){
        var obj = {}, filter = {}, group;
        group = groups[i];
        for(j=0;j<arguments.length;j++){
            filter[arguments[j]] = group[j];
        }
        obj.group = group;
        obj.result = db(filter).get();
        obj.count = obj.result.length;
        result.push(obj);
    }

    return result;
});


// AVG method
TAFFY.extend("avg",function (c) {
    // This runs the query or returns the results if it has already run
    this.context({
           results: this.getDBI().query(this.context())
    });
    // setup the sum
    var total = 0;
    // loop over every record in the results and sum up the column.
    TAFFY.each(this.context().results,function (r) {
        total = total + r[c];
    })

    // divide the total by the number of records and return
    return total/this.context().results.length;
});