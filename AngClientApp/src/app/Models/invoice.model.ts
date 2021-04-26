export class InvoiceModel {
    InvoiceId?: number;
    InvoiceDate?: Date;
    CustomerId?: number;
    TotalAmount?: number;
    CreatedBy?: number;
    ModifiedBy?: number;
}
export class InvoiceDetailModel {
    InvoiceDetailId?: number;
    InvoiceId?: number;
    ProductId?: number;
    Quantity?: number;
    Rate?: number;
    Amount?: number;
}