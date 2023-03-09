
export interface PendingDocument {
    id?: string;
    name?: string;
    amountBilled?: number;
    dateEmit?: string | Date;
    dateDue?: string | Date;
    status?: string;
    period?: string;
    bill_url?: string;
}

export interface PaidDocument {
    id?: string;
    name?: string;
    amountBilled?: number;
    dateEmit?: string | Date;
    dateDue?: string | Date;
    status?: string;
    period?: string;
    bill_url?: string;
}