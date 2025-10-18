import { useEffect, useState } from "react";
import { getCookies, removeCookiesLogout } from "@/utils/cookie";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Notifications,
  Approval,
} from "@mui/icons-material";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [adminName, setAdminName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const role = getCookies("role");
    if (role !== "Admin") 
    {
      router.push("/login");
    }

    const name = getCookies("admin_name") || getCookies("username");
    if (name) setAdminName(name);
  }, [router]);

  const handleLogout = () => {
    removeCookiesLogout();
    router.push("/login");
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-[#D5C79B] p-5 flex-col fixed inset-y-0">
        <div className="relative text-center mb-6">
          <Image
            src="/images/PreciFoodLogo.png"
            alt="Logo"
            width={200}
            height={100}
            priority
          />
        </div>

        <nav className="flex-1 space-y-2">
          {/* Notification */}
          <button
            onClick={() => router.push("/Admin")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded 
              ${
                isActive("/Admin")
                  ? "bg-white font-semibold text-[#C4B58A]"
                  : "hover:bg-[#C4B58A]"
              }`}
          >
            <Notifications
              fontSize="small"
              sx={{
                color: isActive("/Admin")
                  ? "#C4B58A"
                  : "#3f3f3f",
              }}
            />
            Notification
          </button>

          {/* Approval */}
          <button
            onClick={() => router.push("/Admin/approval-masterbahan")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded 
              ${
                isActive("/Admin/approval-masterbahan")
                  ? "bg-white font-semibold text-[#C4B58A]"
                  : "hover:bg-[#C4B58A]"
              }`}
          >
            <Approval
              fontSize="small"
              sx={{
                color: isActive("/Admin/approval-masterbahan")
                  ? "#C4B58A"
                  : "#3f3f3f",
              }}
            />
            Approval Master Bahan
          </button>

          <button
            onClick={() => router.push("/Admin/approval-masterbumbu")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded 
              ${
                isActive("/Admin/approval-masterbumbu")
                  ? "bg-white font-semibold text-[#C4B58A]"
                  : "hover:bg-[#C4B58A]"
              }`}
          >
            <Approval
              fontSize="small"
              sx={{
                color: isActive("/Admin/approval-masterbumbu")
                  ? "#C4B58A"
                  : "#3f3f3f",
              }}
            />
            Approval Master Bumbu
          </button>

          {/* Logout */}
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="mt-6 font-semibold w-[100%] bg-[#F4E9E8] text-[#9C3238] px-4 py-2 rounded hover:bg-[#9C3238] hover:text-white transition duration-300"
            >
              KELUAR
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 bg-gray-50 overflow-y-auto">
        <header className="flex justify-between items-center bg-[#D5C79B] p-4 shadow">
          <div className="flex justify-end items-center w-full gap-3">
            <Image
              src="/images/admin-avatar.png" // Ganti dengan avatar admin jika ada
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full border"
            />
            <div className="flex flex-col text-right">
              <span className="font-medium">{adminName || "Admin"}</span>
              {/* <span className="text-sm text-gray-600">Administrator</span> */}
            </div>
          </div>
        </header>

        <section className="p-6">{children}</section>
      </main>
    </div>
  );
}