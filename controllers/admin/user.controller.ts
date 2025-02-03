import { Request, Response } from "express";
import { CustomRequest } from "../../interface/CustomRequest";
import { systemConfig } from "../../config/config";
import argon2 from "argon2";
import User from "../../model/user.model";
import { valideRegiter } from "../../validates/user.validate";
import { Status } from "../../interface/status";

//[GET] /admin/users
export const index = async (req: Request, res: Response): Promise<void> => {
  let find = {
    deleted: false,
  };

  const users = await User.find(find);

  res.render("admin/pages/users/index", {
    titlePage: "Trang danh sách tài khoản",
    users: users || [],
  });
};

//[GET] /admin/users/edit/:id
export const edit = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.params.id) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } else {
    const user = await User.findOne({
      _id: req.params.id,
      deleted: false,
    }).select("-token -password");
    if (!user) {
      req.flash("error", "Không tìm thấy tài khoản người dùng");
      res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }

    res.render("admin/pages/users/edit", {
      titlePage: "Chỉnh sửa quyền",
      user
    });
  }
};

//[PATCH] /admin/users/edit/:id
export const editPatch = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const condition = await valideRegiter(req.body);
  if (condition) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    } else {
      delete req.body.password
    }

    await User.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );
    req.flash("success", "Chỉnh sửa tài khoản thành công");
    req.get("Referrer") || `/${systemConfig.prefixAdmin}/users`
  } else {
    res.redirect(
      req.get("Referrer") || `/${systemConfig.prefixAdmin}/users`
    );
  }
};

//[PATCH] /admin/users/change-status
export const changeStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id: string = req.body.id;
      const status: Status = req.body.status;
      if (!id) {
        throw new Error(`Invalid`);
      }
      await User.updateOne(
        {
          _id: id,
        },
        {
          status: status,
        }
      );
      res.json({
        code: 200,
        message: "Thay đổi trạng người dùng thành công",
      });
    } catch (error) {
      res.json({
        code: 500,
        message: "Thay đổi trạng thái người dùng thất bại",
      });
    }
  };

//[DELETE] /admin/users/delete/:id
export const deleteUser = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const id: string = req.params.id;
  if (!id) {
    res.json({
      code: 400,
      message: "Không tìm thấy nhóm quyền",
    });
  }
  await User.updateOne(
    {
      _id: id,
    },
    {
      deleted: true,
    }
  );
  res.json({
    code: 200,
    message: "Xóa nhóm quyền thành công",
  });
};