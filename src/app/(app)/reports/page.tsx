"use client";

import { useState, useEffect } from "react";
import {
  orderReportService,
} from "@/services/order-report.service";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { OrderReportResponse } from "@/model/order-report-response.model";
import { toast } from "sonner";

type ReportPeriod = "today" | "week" | "month" | "year" | "custom";

export default function OrderReportPage() {
  const [reportData, setReportData] = useState<OrderReportResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<ReportPeriod>("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    let isMounted = true;
    if (isMounted && period) loadReport();
    return () => { isMounted = false; };
  }, [period]);


  const loadReport = async () => {
    setLoading(true);
    setError(null);

    try {
      let data: OrderReportResponse;

      switch (period) {
        case "today":
          data = await orderReportService.getTodayReport();
          break;
        case "week":
          data = await orderReportService.getThisWeekReport();
          break;
        case "month":
          data = await orderReportService.getThisMonthReport();
          break;
        case "year":
          data = await orderReportService.getThisYearReport();
          break;
        case "custom":
          if (!fromDate || !toDate) {
            setError("Vui lòng chọn khoảng thời gian");
            setLoading(false);
            return;
          }
          data = await orderReportService.getOrderReport({ fromDate, toDate });
          break;
        default:
          return;
      }

      setReportData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setLoading(true);
      let blob: Blob;
      let filename: string;

      switch (period) {
        case "custom":
          if (!fromDate || !toDate) {
            setError("Vui lòng chọn khoảng thời gian");
            return;
          }
          blob = await orderReportService.exportPdf({ fromDate, toDate });
          filename = `BaoCaoDonHang_${fromDate}_${toDate}.pdf`;
          break;
        case "month":
          blob = await orderReportService.exportMonthlyPdf(
            selectedYear,
            selectedMonth
          );
          filename = `BaoCaoDonHang_Thang${selectedMonth
            .toString()
            .padStart(2, "0")}_${selectedYear}.pdf`;
          break;
        case "year":
          blob = await orderReportService.exportYearlyPdf(selectedYear);
          filename = `BaoCaoDonHang_Nam${selectedYear}.pdf`;
          break;
        default:
          if (!fromDate || !toDate) {
            const today = new Date().toISOString().split("T")[0];
            blob = await orderReportService.exportPdf({
              fromDate: today,
              toDate: today,
            });
            filename = `BaoCaoDonHang_${today}.pdf`;
          } else {
            blob = await orderReportService.exportPdf({ fromDate, toDate });
            filename = `BaoCaoDonHang_${fromDate}_${toDate}.pdf`;
          }
      }

      orderReportService.downloadBlob(blob, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xuất PDF");
      toast.error("Không thể xuất PDF");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="w-full p-6 overflow-y-auto scroll-thin h-full">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <button
            onClick={() => setPeriod("today")}
            className={`p-3 rounded-lg border-2 transition-all ${
              period === "today"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm font-medium">Hôm nay</span>
          </button>

          <button
            onClick={() => setPeriod("week")}
            className={`p-3 rounded-lg border-2 transition-all ${
              period === "week"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm font-medium">Tuần này</span>
          </button>

          <button
            onClick={() => setPeriod("month")}
            className={`p-3 rounded-lg border-2 transition-all ${
              period === "month"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm font-medium">Tháng này</span>
          </button>

          <button
            onClick={() => setPeriod("year")}
            className={`p-3 rounded-lg border-2 transition-all ${
              period === "year"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm font-medium">Năm nay</span>
          </button>
        </div>

        {/* Custom Date Range */}
        <div className="border-t pt-4 mt-4">
          <button
            onClick={() => setPeriod("custom")}
            className={`mb-3 text-sm font-medium ${
              period === "custom" ? "text-blue-600" : "text-gray-700"
            }`}
          >
            Tùy chỉnh khoảng thời gian
          </button>

          {period === "custom" && (
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={loadReport}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                Xem báo cáo
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleExportPdf}
          disabled={loading || !reportData}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          <Download className="w-4 h-4" />
          Xuất PDF
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  Tổng đơn hàng
                </h3>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.summary.totalOrders}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  Tổng doanh thu
                </h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reportData.summary.totalRevenue)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  Tổng giảm giá
                </h3>
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reportData.summary.totalDiscount)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  Doanh thu thuần
                </h3>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reportData.summary.netRevenue)}
              </p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Chi tiết đơn hàng
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bàn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giảm giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thành tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.report.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <p className="text-gray-500">
                          Không có đơn hàng nào trong khoảng thời gian này
                        </p>
                      </td>
                    </tr>
                  ) : (
                    reportData.report.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.tableName || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "Paid"
                                ? "bg-green-100 text-green-800"
                                : order.status === "WaitingForPayment"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.discountAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.finalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}