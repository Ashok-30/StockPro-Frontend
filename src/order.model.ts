// order.model.ts
export interface Order {
    orderId?: number; // Optional if the ID is generated by the backend
    customerName: string;
    customerNumber: string;
    productIds: string;
    totalAmount: number;
}
