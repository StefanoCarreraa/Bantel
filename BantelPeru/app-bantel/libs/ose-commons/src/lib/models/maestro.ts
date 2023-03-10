// Generated by https://quicktype.io

export interface DocumentoxCobrarResponse {
  id_Doc_Cobrar: number;
  nroRecibo:     string;
  servicioPlan:  string;
  periodo:       string;
  importe:       string;
  amortizado:    string;
  saldo:         string;
  estado:        string;
}

export class PendingDocument {
  id?: string;
  name?: string;
  amountBilled?: number;
  dateEmit?: string | Date;
  dateDue?: string | Date;
  status?: string;
  period?: string;
  bill_url?: string;
  /**
   *
   */

}
