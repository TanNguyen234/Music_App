import mongoose from 'mongoose'

const forgotSchema = new mongoose.Schema({//Thiết lập schema
  email: String,
  otp: String,
  expireAt: {
    type: Date,
    index: { expires: '3m' }, // Định nghĩa TTL (time-to-live) là 3 phút
  },
}, {timestamps: true});//Hàm mongoose nếu giá trị là true thì nó sẽ tự động lưu lại [ngày tạo] và khi uppdate nó cg tự động lưu [ngày updata]

const Forgot = mongoose.model("Forgot", forgotSchema, "forgot-password"); //Kết nối tới collection có tên products

export default Forgot;