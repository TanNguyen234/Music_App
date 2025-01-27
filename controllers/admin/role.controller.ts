import { Request, Response } from "express";
import Roles from "../../model/role.model";
import { CustomRequest } from "../../interface/CustomRequest";
import { roleValidate } from "../../validates/role.validate";
import { systemConfig } from "../../config/config";

//[GET] /admin/roles
export const index = async (req: Request, res: Response): Promise<void> => {
    let find = {
        deleted: false
    }
    const roles = await Roles.find(find);
    res.render("admin/pages/roles/index", {
        titlePage: "Nhóm quyền",
        roles: roles || []
    })
}

//[GET] /admin/roles/create
export const create = (req: Request, res: Response): void => {
    res.render("admin/pages/roles/create", {
        titlePage: "Tạo quyền",
    })
}

//[POST] /admin/roles/create
export const createPost = async (req: CustomRequest, res: Response): Promise<void> => {
    if(roleValidate(req.body)) {
        let role = new Roles(req.body);
        await role.save();
        req.flash("success", "Thêm nhóm quyền thành công");
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    } else {
        res.redirect("back");
    }
}

//[GET] /admin/roles/edit/:id
export const edit = async (req: CustomRequest, res: Response): Promise<void> => {
    if(!req.params.id) {
        res.redirect("/admin/roles");
    } else {
        const role = await Roles.findOne({
            _id: req.params.id,
            deleted: false
        });
        if(!role) {
            req.flash("error", "Không tìm thấy nhóm quyền");
            res.redirect(`/${systemConfig.prefixAdmin}/roles`);
        }
        res.render("admin/pages/roles/edit", {
            titlePage: "Chỉnh sửa quyền",
            role: role
        })
    }
}

//[PATCH] /admin/roles/edit/:id
export const editPatch = async (req: CustomRequest, res: Response): Promise<void> => {
    if(roleValidate(req.body)) {
        await Roles.updateOne({
            _id: req.params.id
        }, req.body);
        req.flash("success", "Chỉnh sửa nhóm quyền thành công");
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    } else {
        res.redirect("back");
    }
}

//[DELETE] /admin/roles/delete/:id
export const deleteRole = async (req: CustomRequest, res: Response): Promise<void> => {
    const id: string = req.params.id;
    if(!id) {
        res.json({
            code: 400,
            message: "Không tìm thấy nhóm quyền"
        })
    }
    await Roles.updateOne({
        _id: id
    }, {
        deleted: true
    });
    res.json({
        code: 200,
        message: "Xóa nhóm quyền thành công"
    })
}