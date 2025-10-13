import { OrderReportSummary } from "./order-report-summary.model";
import { OrderReport } from "./order-report.model";

export interface OrderReportResponse {
  report: OrderReport[];
  summary: OrderReportSummary;
}
