import mongoose from 'mongoose'
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)

const songSchema = new mongoose.Schema({//Thiết lập schema
  title: String,
  avatar: String,
  description: String,
  status: String,
  singerId: String,
  infoSinger: Object,
  topicId: String,
  like: {
    type: Number,
    default: 0
  },
  listen: {
    type: Number,
    default: 0
  },
  lyrics: String,
  audio: String,
  slug: { type: String, slug: "title", unique: true },
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt: Date
}, {timestamps: true});//Hàm mongoose nếu giá trị là true thì nó sẽ tự động lưu lại [ngày tạo] và khi uppdate nó cg tự động lưu [ngày updata]

const Song = mongoose.model("Song", songSchema, "songs"); //Kết nối tới collection có tên products

export default Song;