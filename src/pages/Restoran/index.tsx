"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Button,
  CircularProgress,
  Alert,
  Dialog,
  Box,
  Typography,
} from "@mui/material";
import Restoranlayout from "@/components/Restoran/Restoranlayout";
import useRestaurantMenu from "@/hooks/Restoran/useMenus";
import MenuDetail from "@/components/Restoran/MenuDetail";
import { Menu } from "@/interfaces/menu";

interface GroupedMenus {
  [category: string]: Menu[];
}

export default function RestoranIndex() {
  const { menus, loading, error, refetch, fetchMenuById } = useRestaurantMenu();
  const [initialized, setInitialized] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Refetch hanya sekali di awal
  useEffect(() => {
    if (!initialized) {
      refetch();
      setInitialized(true);
    }
  }, [initialized, refetch]);

  // Group menu berdasarkan kategori dan ambil 3 terbaru
  const groupedMenus = menus.reduce((acc: GroupedMenus, menu: Menu) => {
    if (!acc[menu.category]) acc[menu.category] = [];
    acc[menu.category].push(menu);
    return acc;
  }, {} as GroupedMenus);

  Object.keys(groupedMenus).forEach((category) => {
    groupedMenus[category] = groupedMenus[category]
      // .sort(
      //   (a: Menu, b: Menu) =>
      //     new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      // )
      .slice(0, 3);
  });

  //  Tentukan urutan kategori yang diinginkan
  const categoryOrder = [
    "Makanan Pokok",
    "Lauk Pauk",
    "Sayuran",
    "Snack",
    "Minuman",
  ];

  const sortedCategories = categoryOrder.filter(
    (cat) => groupedMenus[cat] && groupedMenus[cat].length > 0
  );

  // Klik detail → ambil detail menu dan buka dialog
  const handleDetail = async (menuId: string) => {
    setDialogOpen(true);
    setDetailLoading(true);
    try {
      const detail = await fetchMenuById(menuId);
      setSelectedMenu(detail);
    } catch (err) {
      console.error("Gagal memuat detail menu:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedMenu(null);
  };

  return (
    <Restoranlayout>
      <div className="p-6">
        <div>
            <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-600">Temukan menu yang baru saja ditambahkan</p>
        </div>

        {/* Error Handling */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
            <Button onClick={refetch} size="small" sx={{ ml: 2 }}>
              Coba Lagi
            </Button>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center mt-10">
            <CircularProgress />
          </div>
        ) : menus.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Belum ada data menu.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {sortedCategories.map((category) => (
              <div key={category}>
                <Typography
                  variant="h6"
                  className="font-semibold text-black mb-4"
                >
                  {category}
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {groupedMenus[category].map((menu: Menu) => (
                    <div
                      key={menu.id}
                      className="border rounded-xl shadow-sm bg-white p-4 flex flex-col items-center hover:shadow-md transition-all"
                    >
                      <p className="font-bold text-center text-lg line-clamp-2">
                        {menu.name}
                      </p>
                      <div className="w-full h-56 relative rounded overflow-hidden">
                        <Image
                          src={menu.image_url || "/no-image.png"}
                          alt={menu.name}
                          fill
                          className="object-cover mt-3"
                        />
                      </div>
                      <Button
                        variant="contained"
                        size="small"
                        className="bg-primary text-black mt-4"
                        onClick={() => handleDetail(menu.id.toString())}
                      >
                        Detail
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dialog Detail Menu */}
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
        >
          {detailLoading ? (
            <Box className="flex justify-center p-6">
              <CircularProgress />
            </Box>
          ) : selectedMenu ? (
            <MenuDetail menu={selectedMenu} />
          ) : (
            <Box className="p-6 text-center text-gray-500">
              Gagal memuat detail menu.
            </Box>
          )}
        </Dialog>
      </div>
    </Restoranlayout>
  );
}