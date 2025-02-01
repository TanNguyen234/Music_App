import mongoose from 'mongoose'

const topicSchema = new mongoose.Schema({//Thiết lập schema
  title: String,
  avatar: String,
  description: String,
  status: String,
  slug: {
    type: String,
    slug: "title",
    unique: true //Đảm bảo slug duy nhất
  },
  createdBy: {
    account_id: String,
    create_at: {
      type: Date,
      default: Date.now()
    }
  },
  updatedBy: [//Vì update có thể nhiều người cùng update nên là một array
    {
    account_id: String,
    update_at: Date
    }
  ],
  deletedBy: {
    account_id: String,
    delete_at: Date
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt: Date
}, {timestamps: true});//Hàm mongoose nếu giá trị là true thì nó sẽ tự động lưu lại [ngày tạo] và khi uppdate nó cg tự động lưu [ngày updata]

const Topic = mongoose.model("Topic", topicSchema, "topics"); //Kết nối tới collection có tên products

export default Topic;