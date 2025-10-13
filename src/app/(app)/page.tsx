"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { productTopSaleService } from '@/services/product-top-sale.service';
import { TopSellingProduct } from '@/model/top-selling-product.model';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function HomePage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [products, setProducts] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopProducts();
  }, [period]);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productTopSaleService.getTopProducts(period);
      
      if (response.statusCode === 200 && response.data) {
        setProducts(response.data.slice(0, 10)); // Top 10 products
      } else {
        setError('Không thể tải dữ liệu');
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalQuantity = products.reduce((sum, p) => sum + p.totalQuantity, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.totalRevenue, 0);
  const avgOrderValue = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'today': return 'Hôm nay';
      case 'week': return 'Tuần này';
      case 'month': return 'Tháng này';
      case 'year': return 'Năm nay';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center overflow-y-auto scroll-thin h-full">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchTopProducts}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto scroll-thin h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sản Phẩm Bán Chạy</h1>
            <p className="text-slate-600 mt-1">Phân tích sản phẩm bán chạy nhất {getPeriodLabel().toLowerCase()}</p>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as 'today' | 'week' | 'month' | 'year')} className="w-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="today">Hôm nay</TabsTrigger>
              <TabsTrigger value="week">Tuần</TabsTrigger>
              <TabsTrigger value="month">Tháng</TabsTrigger>
              <TabsTrigger value="year">Năm</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Tổng Sản Phẩm Bán
              </CardTitle>
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {formatNumber(totalQuantity)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Từ {products.length} sản phẩm
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Tổng Doanh Thu
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {getPeriodLabel()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Giá Trị Trung Bình
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {formatCurrency(avgOrderValue)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Mỗi đơn hàng
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Revenue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Doanh Thu Theo Sản Phẩm
              </CardTitle>
              <CardDescription>
                Top {products.length} sản phẩm có doanh thu cao nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={products} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="productName" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="totalRevenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart - Quantity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Phân Bố Số Lượng Bán
              </CardTitle>
              <CardDescription>
                Tỷ lệ số lượng bán của từng sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={products}
                    dataKey="totalQuantity"
                    nameKey="productName"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={(entry) => `${entry.productName}: ${entry.totalQuantity}`}
                    labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                  >
                    {products.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatNumber(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Bảng Xếp Hạng Sản Phẩm
            </CardTitle>
            <CardDescription>
              Danh sách chi tiết các sản phẩm bán chạy nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Sản Phẩm</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Số Lượng</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Doanh Thu</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Giá TB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.map((product, index) => (
                    <tr key={product.productId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-slate-300 text-slate-900' :
                          index === 2 ? 'bg-orange-400 text-orange-900' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{product.productName}</td>
                      <td className="px-4 py-3 text-sm text-right text-slate-700">{formatNumber(product.totalQuantity)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                        {formatCurrency(product.totalRevenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-slate-700">
                        {formatCurrency(product.totalRevenue / product.totalQuantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}