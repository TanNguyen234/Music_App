import mongoose from "mongoose";

const settingsGeneralSchema = new mongoose.Schema({//Thiết lập schema
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String
}, {timestamps: true});//Hàm mongoose nếu giá trị là true thì nó sẽ tự động lưu lại [ngày tạo] và khi uppdate nó cg tự động lưu [ngày updata]

const SettingGeneral = mongoose.model("SettingGeneral", settingsGeneralSchema, "settings-general"); //Kết nối tới collection có tên products

export default SettingGeneral;