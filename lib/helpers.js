objId = function(id) {
  try {
  return typeof id == 'string' ? new Meteor.Collection.ObjectID(id) : id;
  } catch(e) {
    return id;
  }
};
strId = function(id) {
  return typeof id == 'string' ? id : id.toHexString();
};
newObjId = function () {
	var id = new Meteor.Collection.ObjectID();
	console.log(id);
	return id;
};

LocationsList = function (cursor) {
	if(!cursor) {
		return [];
	}

	var raw = cursor.fetch();
	console.log('raw', raw);
	var regions = _.flatten(_.pluck(raw, 'state'));
	console.log(regions);
	var sortedList = _.sortBy(regions, function (region) {return region;});
	return sortedList;

};

RegionsList = function (cursor, state) {
  if(!cursor) {
    return [];
  }

  var raw = cursor.fetch();
  console.log('raw', raw);
  var data = _.where(raw, {'state': state});
  console.log(data);
  var sortedList = _.sortBy(data[0].regions, function (region) {return region;});
  return sortedList;

};
shuffle = function (sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}