import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({//Thiết lập schema
  fullName: String,
  email: String,
  password: String,
  avatar: String,
  otp: String,
  status: String,
  slug: {
    type: String,
    slug: "fullName",
    unique: true //Đảm bảo slug duy nhất
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt: Date
}, {timestamps: true});//Hàm mongoose nếu giá trị là true thì nó sẽ tự động lưu lại [ngày tạo] và khi uppdate nó cg tự động lưu [ngày updata]

const User = mongoose.model("User", userSchema, "users"); //Kết nối tới collection có tên products

export default User;