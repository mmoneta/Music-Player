module.exports = function(mongoose) {
  const Schema = mongoose.Schema;
    
  const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
  });

  const albumSchema = new Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    folder: { type: String, required: true },
  });

  const trackSchema = new Schema({
    username: { type: String, required: true },
    album: { type: String, required: true },
    name: { type: String, required: true },
    file: { type: String, required: true }
  });

  const models = {
    User: mongoose.model("User", userSchema),
    Album: mongoose.model("Album", albumSchema),
    Track: mongoose.model("Track", trackSchema)  
  }

  return models;       
}