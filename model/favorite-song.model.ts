import mongoose from 'mongoose'

const favoriteSongSchema = new mongoose.Schema({//Thiết lập schema
  userId: String,
  songId: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt: Date,
  infoSong: {
    type: Object,
    required: false
  },
  infoSinger: {
    type: Object,
    required: false
  }
}, {timestamps: true});//Hàm mongoose nếu giá trị là true thì nó sẽ tự động lưu lại [ngày tạo] và khi uppdate nó cg tự động lưu [ngày updata]

const FavoriteSong = mongoose.model("FavoriteSong", favoriteSongSchema, "favorite-songs"); //Kết nối tới collection có tên products

export default FavoriteSong;