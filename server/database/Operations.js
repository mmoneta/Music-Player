const InsertOne = function (data) {
  return new Promise((resolve, reject) => {
    data.save(function (err, data, callback) {
      if (err) reject(err);
    })
  })
}

const SelectAll = function (Model) {
  return new Promise((resolve, reject) => {
    Model.find({},function (err, data) {
      if (err) reject(err);
      resolve(data);
    })
  })
}

const SelectAndLimit = function (Model, count) {
  return new Promise((resolve, reject) => {
    Model.find({}, function (err, data) {
      if (err) reject(err);
      resolve(data);
    }).limit(count)
  })
}

const SelectLimitWhere = function (Model, condition, count) {
  return new Promise((resolve, reject) => {
    Model.find(condition, function (err, data) {
      if (err) reject(err);
      resolve(data);
    }).limit(count)
  })
}

const SelectWhere = function (Model, condition) {
  return new Promise((resolve, reject) => {
    Model.find(condition, function (err, data) {
      if (err) reject(err);
      resolve(data);
    })
  })
}

const DeleteAll = function (Model) {
  return new Promise((resolve, reject) => {
    Model.remove(function (err, data) {
      if (err) reject(err);
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