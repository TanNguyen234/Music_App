import { Request, Response } from "express"
import Topic from "../../model/topic.model"
import { validateTopic } from "../../validates/validate-topic.validate"

//[GET] /admin/topics
export const index = async (req: Request, res: Response): Promise<void> => {
    const topics = await Topic.find({
        deleted: false
    })

    res.render('admin/pages/topics/index', {
        pageTitle: 'Trang chủ đề',
        topics: topics || []
    })
}

//[GET] /admin/topics/create
export const create = async (req: Request, res: Response): Promise<void> => {
    res.render('admin/pages/topics/create', {
        pageTitle: 'Tạo chủ đề mới'
    })
}

export interface CustomRequest extends Request {
    file: any;
    flash: (type: string, message: string) => void;
}

//[POST] /admin/topics/create
export const createPost = async (req: CustomRequest, res: Response): Promise<void> => {
    if(validateTopic(req.body)) {
        
        const newTopic = new Topic(req.body)
        await newTopic.save()
        req.flash('success', 'Tạo chủ đề mới thành công')
        res.redirect('/admin/topics')
    } else {
        req.flash('error', 'Dữ liệu không hợp lệ')
        res.redirect('back')
    }
}

//[GET] /admin/topics/edit/:id
export const edit = async (req: CustomRequest, res: Response): Promise<void> => {
    if(req.params.id) {
        const topic = await Topic.findById(req.params.id);
        res.render('admin/pages/topics/edit', {
            pageTitle: 'Chỉnh sửa chủ đề',
            topic: topic || {}
        })
    } else {
        req.flash('error', 'Không tìm thấy chủ đề')
        res.redirect('back')
    }
}

//[PATCH] /admin/topics/edit/:id
export const editPatch = async (req: CustomRequest, res: Response): Promise<void> => {
    const id = req.params.id
    console.log(id, req.body)
    if(validateTopic(req.body) && id) {
        try {
            await Topic.updateOne({
                _id: id
            }, req.body)
            req.flash('success', 'Chỉnh sửa chủ đề thành công')
            res.redirect('back')
        } catch (error) {
            req.flash('error', 'Không tìm thấy chủ đề')
            res.redirect('back')
        }
    } else {
        req.flash('error', 'Dữ liệu không hợp lệ')
        res.redirect('back')
    }
}

//[DELETE] /admin/topics/delete/:id
export const deleteTopic = async (req: CustomRequest, res: Response): Promise<void> => {
    const id = req.params.id
    if(id) {
        try {
            await Topic.updateOne({
                _id: id
            }, {
                deleted: true
            })
            req.flash('success', 'Xóa chủ đề thành công')
            res.redirect('back')
        } catch (error) {
            req.flash('error', 'Xóa chủ đề thất bại')
            res.redirect('back')
        }
    } else {
        req.flash('error', 'id không hợp lệ')
        res.redirect('back')
    }
}