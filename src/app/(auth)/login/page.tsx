import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C] p-6 sm:p-12 md:p-16">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-xl shadow-xl p-6 sm:p-12 md:p-16 space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <Coffee className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-[#8B4513] mb-2" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B4513]">NOPITA COFFEE</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-500">SINCE 1993</p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
              Tên đăng nhập
            </Label>
            <Input
              id="username"
              placeholder="Nhập tên đăng nhập"
              className="border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B4513] focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              className="border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B4513] focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <Button className="w-full bg-[#8B4513] hover:bg-[#6F3610] text-white rounded-md transition-colors duration-200 text-sm sm:text-base md:text-lg py-2 sm:py-3">
            ĐĂNG NHẬP
          </Button>
        </form>

        {/* Additional links */}
        <div className="text-center text-xs sm:text-sm md:text-base text-gray-600">
          <a href="#" className="hover:text-[#8B4513] transition-colors">Quên mật khẩu?</a>
        </div>
      </div>
    </div>
  );
}