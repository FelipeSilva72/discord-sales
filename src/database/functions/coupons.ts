import { CouponSchema, DatabaseSchema, db } from "#database";

type SetData = DatabaseSchema["coupons"]["AssignArg"];
type UpdateData = DatabaseSchema["coupons"]["UpdateData"];

export async function getCouponData(couponId: string) {
    const couponDocument = await db.coupons.get(db.coupons.id(couponId));
    return { data: couponDocument?.data };
}

export async function setCouponData(couponId: string, data: SetData) {
    return await db.coupons.set(db.coupons.id(couponId), data);
}

export async function updateCouponData(couponId: string, data: UpdateData) {
    return await db.coupons.update(db.coupons.id(couponId), data);
}

export async function removeCouponData(couponId: string) {
    return await db.coupons.remove(db.coupons.id(couponId));
}

export function formatCouponData(data: CouponSchema) {
    return {
        id: data.id,
        name: data.name,
        discount: formatCouponDiscount(data.discount)
    };
}

export function formatCouponDiscount(discount: number) {
    return discount + "%";
}