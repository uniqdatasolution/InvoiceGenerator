export class InvoiceModel {
    InvoiceId?: number;
    InvoiceDate?: Date;
    CustomerId?: number;
    TotalAmount?: number;
    CreatedBy?: number;
    ModifiedBy?: number;
    GRRRNo?: String;
    Transport?: String;
    VehicleNo?: String;
    Station?: String;
}
export class InvoiceDetailModel {
    InvoiceDetailId?: number;
    InvoiceId?: number;
    ProductId?: number;
    Quantity?: number;
    Rate?: number;
    Amount?: number;
}