import { useEffect, useState } from "react";
import { getCookies, removeCookiesLogout } from "@/utils/cookie";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  ExpandMore,
  ExpandLess,
  Dashboard,
  Notifications,
  TableChart,
  ReceiptLong,
} from "@mui/icons-material";

export default function RestoranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = getCookies("role");
    if (role !== "Restoran") {
      router.push("/login");
    }

    const name = getCookies("restaurant_name");
    if (name) setRestaurantName(name);
  }, [router]);

  const handleLogout = () => {
    removeCookiesLogout();
    router.push("/login");
  };

  const isActive = (path: string) => router.pathname === path;
  const activePaths = [
    "/Restoran/transaction",
    "/Restoran/add-menu",
    "/Restoran/UpdateMenu/[id]"
  ];

  const isButtonActive = activePaths.some(path => isActive(path));

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
          {/* Dashboard */}
          <button
            onClick={() => router.push("/Restoran")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded
              ${
                isActive("/Restoran")
                  ? "bg-white font-semibold text-[#C4B58A]"
                  : "hover:bg-[#C4B58A]"
              }`}
          >
            <Dashboard
              fontSize="small"
              sx={{ color: isActive("/Restoran")
                ? "#C4B58A"
                : "#3f3f3f" }}
            />
            Dashboard
          </button>

          {/* Notification */}
          <button
            onClick={() => router.push("/Restoran/notification")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded 
              ${
                isActive("/Restoran/notification")
                  ? "bg-white font-semibold text-[#C4B58A]"
                  : "hover:bg-[#C4B58A]"
              }`}>
            <Notifications
              fontSize="small"
              sx={{
                color: isActive("/Restoran/notification")
                  ? "#C4B58A"
                  : "#3f3f3f",
              }}
            />
            Notification
          </button>

          {/* Dropdown Tabel Master */}
          <div>
            {(() => {
              const isMasterActive =
                router.pathname === "/Restoran/master-bahan" ||
                router.pathname === "/Restoran/master-bumbu";

              return (
                <>
                  <button
                    onClick={() => setIsMasterOpen(!isMasterOpen)}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 rounded transition 
                      ${
                        isMasterActive || isMasterOpen
                          ? "bg-white font-semibold text-[#C4B58A]"
                          : "hover:bg-[#C4B58A]"
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <TableChart
                        fontSize="small"
                        sx={{ color: isMasterActive || isMasterOpen ? "#C4B58A" : "#3f3f3f" }}
                      />
                      Tabel Master
                    </span>
                    {isMasterOpen ? (
                      <ExpandLess sx={{ color: isMasterActive ? "#C4B58A" : "#3f3f3f" }} />
                    ) : (
                      <ExpandMore sx={{ color: isMasterActive ? "#C4B58A" : "#3f3f3f" }} />
                    )}
                  </button>

                  {isMasterOpen && (
                    <div className="ml-6 mt-2 space-y-2">
                      <button
                        onClick={() => router.push("/Restoran/master-bahan")}
                        className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded 
                          ${
                            router.pathname === "/Restoran/master-bahan"
                              ? "bg-[#C4B58A] font-semibold"
                              : "hover:bg-[#C4B58A]"
                          }`}
                      >
                        Master Bahan
                      </button>
                      <button
                        onClick={() => router.push("/Restoran/master-bumbu")}
                        className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded 
                          ${
                            router.pathname === "/Restoran/master-bumbu"
                              ? "bg-[#C4B58A] font-semibold"
                              : "hover:bg-[#C4B58A]"
                          }`}
                      >
                        Master Bumbu
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* Transaction */}
          <button
            onClick={() => router.push("/Restoran/transaction")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded 
              ${isButtonActive ? "bg-white font-semibold text-[#C4B58A]" : "hover:bg-[#C4B58A]"}`}
          >
            <ReceiptLong
              fontSize="small"
              sx={{
                color: isButtonActive ? "#C4B58A" : "#3f3f3f",
              }}
            />
            Transaction Menu
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
      <main className="flex-1 ml-64 bg-gray-50 overflow-y-auto">
        <header className="flex justify-between items-center bg-[#D5C79B] p-4 shadow">
          {/* <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
            <MenuIcon />
          </button> */}

          <div className="flex justify-end items-center w-full gap-3">
            <Image
              src="/images/resto.png"
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full border"
            />
            <div className="flex flex-col text-right">
              <span className="font-medium">{restaurantName}</span>
            </div>
          </div>
        </header>

        <section className="p-6">{children}</section>
      </main>
    </div>
  );
}