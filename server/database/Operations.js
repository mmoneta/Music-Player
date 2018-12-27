var InsertOne = function (data) {
  return new Promise((resolve, reject) => {
    data.save(function (err, data, callback) {
      if (err)
        reject(err);
    })
  })
}

var SelectAll = function (Model) {
  return new Promise((resolve, reject) => {
    Model.find({},function (err, data) {
      if (err)
        reject(err);
      resolve(data);
    })
  })
}

var SelectAndLimit = function (Model, count) {
  return new Promise((resolve, reject) => {
    Model.find({}, function (err, data) {
      if (err)
        reject(err);
      resolve(data);
    }).limit(count)
  })
}

var SelectLimitWhere = function (Model, key, value, count) {
  return new Promise((resolve, reject) => {
    var condition = {};
    condition[key] = value;

    Model.find(condition, function (err, data) {
      if (err)
        reject(err);
      resolve(data);
    }).limit(count)
  })
}

var SelectWhere = function (Model, key, value) {
  return new Promise((resolve, reject) => {
    var condition = {};
    condition[key] = value;

    Model.find(condition, function (err, data) {
      if (err)
        reject(err);
      resolve(data);
    })
  })
}

var DeleteAll = function (Model) {
  return new Promise((resolve, reject) => {
    Model.remove(function (err, data) {
      if (err) 
        reject(err);
    })
  })
}

module.exports = {
  InsertOne: InsertOne,
  SelectAll: SelectAll,
  SelectAndLimit: SelectAndLimit,
  SelectLimitWhere: SelectLimitWhere,
  SelectWhere: SelectWhere,
  DeleteAll: DeleteAll
}