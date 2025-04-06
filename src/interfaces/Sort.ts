import { OrderByDirection } from "firebase-admin/firestore";

export default interface Sort {
    field: string;
    direction: OrderByDirection;
}