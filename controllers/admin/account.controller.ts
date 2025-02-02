import { Request, Response } from "express";
import Roles from "../../model/role.model";
import { CustomRequest } from "../../interface/CustomRequest";
import { roleValidate } from "../../validates/role.validate";
import { systemConfig } from "../../config/config";
import Account from "../../model/account.model";
import {
  accountEditValidate,
  accountValidate,
} from "../../validates/account.validate";
import argon2 from "argon2";

//[GET] /admin/accounts
export const index = async (req: Request, res: Response): Promise<void> => {
  let find = {
    deleted: false,
  };
  const accounts = await Account.find(find).select("-password -token");

  for (let account of accounts) {
    const role = await Roles.findOne({
      _id: account.role_id,
    });
    (account as any).role = role?.title;
  }

  res.render("admin/pages/accounts/index", {
    titlePage: "Trang danh sách tài khoản",
    accounts: accounts || [],
  });
};

//[GET] /admin/accounts/create
export const create = async (req: Request, res: Response): Promise<void> => {
  const roles = await Roles.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create", {
    titlePage: "Tạo tài khoản mới",
    roles: roles || [],
  });
};

//[POST] /admin/accounts/create
export const createPost = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const condition = await accountValidate(req.body);
  if (condition) {
    req.body.password = await argon2.hash(req.body.password);

    let account = new Account(req.body);
    await account.save();

    req.flash("success", "Thêm tài khoản thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } else {
    req.flash("error", "Tạo tài khoản thất bại");
    res.redirect(
      req.get("Referrer") || `/${systemConfig.prefixAdmin}/dashboard`
    );
  }
};

//[GET] /admin/accounts/edit/:id
export const edit = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.params.id) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } else {
    const account = await Account.findOne({
      _id: req.params.id,
      deleted: false,
    }).select("-token -password");
    if (!account) {
      req.flash("error", "Không tìm thấy nhóm quyền");
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
    const roles = await Roles.find({
      deleted: false,
    });
    res.render("admin/pages/accounts/edit", {
      titlePage: "Chỉnh sửa quyền",
      account: account,
      roles: roles || [],
    });
  }
};

//[PATCH] /admin/roles/edit/:id
export const editPatch = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const condition = await accountEditValidate(req.body);
  if (condition) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    } else {
      delete req.body.password
    }

    await Account.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );
    req.flash("success", "Chỉnh sửa tài khoản thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } else {
    res.redirect(
      req.get("Referrer") || `/${systemConfig.prefixAdmin}/dashboard`
    );
  }
};

//[DELETE] /admin/roles/delete/:id
export const deleteRole = async (
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
  await Account.updateOne(
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