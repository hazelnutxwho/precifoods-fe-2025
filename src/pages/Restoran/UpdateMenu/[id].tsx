"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import RestoranLayout from "@/components/Restoran/Restoranlayout";
import useRestaurantMenu, { MenuFormData } from "@/hooks/Restoran/useMenus";
import useMasterBahan from "@/hooks/Restoran/useMasterBahan";
import useMasterBumbu from "@/hooks/Restoran/useMasterBumbu";
import useResep, { RecipeItem } from "@/hooks/Restoran/useResep";
import { MENU_CATEGORIES } from "@/interfaces/menu";
import { Button } from "@mui/material";
import { getCookies } from "@/utils/cookie";

export default function UpdateMenuPage() {
  const { updateMenu, fetchMenuById, loading: menuLoading } = useRestaurantMenu();
  const router = useRouter();
  const params = useParams();
  const menuId = Number(params?.id);

  // restaurant_id milik akun login (cookie); tanpa cookie → redirect login
  const RESTO_ID = getCookies("restaurant_id") as string;

  useEffect(() => {
    if (!RESTO_ID) router.replace("/login");
  }, [router, RESTO_ID]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<MenuFormData>();
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Master data
  const { bahanList } = useMasterBahan();
  const { bumbuList } = useMasterBumbu();

  //  Tambahan state untuk search
  const [searchBahan, setSearchBahan] = useState("");
  const [searchBumbu, setSearchBumbu] = useState("");


  // Filter hanya bahan dan bumbu dengan status "Approved"
  const approvedBahanList = bahanList.filter((bahan) => bahan.status === "Approved");
  const approvedBumbuList = bumbuList.filter((bumbu) => bumbu.status === "Approved");

  // Filter hasil pencarian
  const filteredBahan = approvedBahanList.filter((b) =>
    b.name.toLowerCase().includes(searchBahan.toLowerCase())
  );
  const filteredBumbu = approvedBumbuList.filter((b) =>
    b.name.toLowerCase().includes(searchBumbu.toLowerCase())
  );

  // Resep hook
  const {
    dataResep,
    setDataResep,
    getMenuRecipe,
    updateMenuRecipe,
    loading: loadingRecipe,
  } = useResep();

  /** Fungsi untuk memuat data menu dan resep */
  const loadMenuData = useCallback(async () => {
    if (!menuId || initialDataLoaded) return;
    try {
      const data = await fetchMenuById(String(menuId));
      if (data) {
        setValue("name", data.name);
        setValue("price", data.price);
        setValue("portion", data.portion);
        setValue("category", data.category);
        setValue("description", data.description);
        if (data.image_url) setImagePreview(data.image_url);

        // Load resep dari API
        const resepData = await getMenuRecipe(RESTO_ID, menuId);

        // Gabungkan dengan master bahan & bumbu supaya ada name
        const mappedResep = resepData.map((item: RecipeItem) => {
          const found =
            item.item_type === "bahan"
              ? bahanList.find((b) => b.id === item.item_id)
              : bumbuList.find((b) => b.id === item.item_id);

          return {
            ...item,
            name: found ? found.name : `(${item.item_type})`,
            quantity_grams: item.quantity_grams?.toString() ?? "",
          };
        });

        setDataResep(mappedResep);
        setInitialDataLoaded(true);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memuat data menu");
    }
  }, [menuId, RESTO_ID, initialDataLoaded, fetchMenuById, getMenuRecipe, setDataResep, setValue, bahanList, bumbuList]);

  useEffect(() => {
    loadMenuData();
  }, [loadMenuData]);

  /** Image handler */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** Resep handler */
  const handleAddItem = (item_id: number, item_type: "bahan" | "bumbu", name: string) => {
    setDataResep((prev) => {
      if (prev.find((i) => i.item_id === item_id && i.item_type === item_type)) return prev;
      return [...prev, { item_id, item_type, quantity_grams: "", name }];
    });
  };

  const handleQuantityChange = (index: number, value: string) => {
    setDataResep((prev) => {
      const updated = [...prev];
      updated[index].quantity_grams = value;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setDataResep((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveRecipe = async () => {
    if (dataResep.length === 0) return alert("Tambahkan bahan atau bumbu terlebih dahulu");

    try {
      await updateMenuRecipe(
        RESTO_ID,
        menuId,
        dataResep.map(({ quantity_grams, ...rest }) => ({
          ...rest,
          quantity_grams: parseFloat(quantity_grams.toString().replace(",", ".")) || 0,
        }))
      );
      alert("Resep berhasil disimpan!");
      router.push("/Restoran/transaction");
    } catch (err: unknown) {
      console.error(err);
      alert("Gagal menyimpan resep");
    }
  };

  /** Form menu submit */
  const onSubmit = async (values: MenuFormData) => {
    try {
      setLoadingMenu(true);
      await updateMenu(String(menuId), values);
      alert("Menu berhasil diperbarui!");
    } catch (err: unknown) {
      console.error(err);
      alert("Gagal update menu");
    } finally {
      setLoadingMenu(false);
    }
  };

  if (menuLoading && !initialDataLoaded) {
    return (
      <RestoranLayout>
        <div className="max-w-3xl mx-auto p-6">
          <p>Memuat data menu...</p>
        </div>
      </RestoranLayout>
    );
  }

  return (
    <RestoranLayout>
      <div className="max-w-3xl mx-auto space-y-6 p-6">
        <h1 className="text-2xl font-bold">Edit Menu & Resep</h1>

        {/* FORM MENU */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 shadow rounded space-y-4">
          {/* Gambar */}
          <div>
            <label className="block text-sm font-medium mb-1">Gambar Menu</label>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            {imagePreview ? (
              <div className="relative">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full text-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600">Klik untuk upload gambar</span>
              </button>
            )}
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama Menu</label>
            <input
              type="text"
              {...register("name", { required: "Nama menu wajib diisi" })}
              className="border w-full p-2 rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
            <input
              type="number"
              {...register("price", {
                required: "Harga wajib diisi",
                min: { value: 1, message: "Harga harus lebih dari 0" },
              })}
              className="border w-full p-2 rounded"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>

          {/* Porsi */}
          <div>
            <label className="block text-sm font-medium mb-1">Hidangan untuk ... (porsi/orang)</label>
            <input
              type="number"
              {...register("portion", {
                required: "Porsi wajib diisi",
                min: { value: 1, message: "Porsi harus lebih dari 0" },
              })}
              className="border w-full p-2 rounded"
            />
            {errors.portion && <p className="text-red-500 text-sm">{errors.portion.message}</p>}
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              {...register("category", { required: "Kategori wajib diisi" })}
              className="border w-full p-2 rounded"
            >
              <option value="">-- Pilih Kategori --</option>
              {MENU_CATEGORIES.filter((cat) => cat !== "Semua").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea {...register("description")} rows={3} className="border w-full p-2 rounded" />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" variant="contained" color="primary">
              {loadingMenu ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>

        {/* FORM RESEP */}
        <div className="bg-white p-6 shadow rounded space-y-4">
          <h2 className="text-xl font-bold">Resep</h2>

          {/* Bahan */}
          <h3 className="bg-secondary p-3 rounded font-semibold">Bahan</h3>
          <input
            type="text"
            placeholder="Cari bahan..."
            value={searchBahan}
            onChange={(e) => setSearchBahan(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          />
          <div className="grid grid-cols-2 gap-2">
            {filteredBahan.map((bahan) => (
              <button
                key={bahan.id}
                onClick={() => handleAddItem(bahan.id, "bahan", bahan.name)}
                className="border border-primary px-2 py-1 rounded hover:bg-gray-100"
              >
                {bahan.name}
              </button>
            ))}
            {filteredBahan.length === 0 && (
              <p className="col-span-2 text-sm text-gray-500 italic">Bahan tidak ditemukan</p>
            )}
          </div>

          {/* Bumbu */}
          <h3 className="bg-secondary p-3 rounded font-semibold mt-4">Bumbu</h3>
          <input
            type="text"
            placeholder="Cari bumbu..."
            value={searchBumbu}
            onChange={(e) => setSearchBumbu(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {filteredBumbu.map((bumbu) => (
              <button
                key={bumbu.id}
                onClick={() => handleAddItem(bumbu.id, "bumbu", bumbu.name)}
                className="border border-primary px-2 py-1 rounded hover:bg-gray-100"
              >
                {bumbu.name}
              </button>
            ))}
            {filteredBumbu.length === 0 && (
              <p className="col-span-2 text-sm text-gray-500 italic">Bumbu tidak ditemukan</p>
            )}
          </div>

          {/* List Resep */}
          {dataResep.length === 0 ? (
            <p className="text-gray-500 italic mt-2">Belum ada bahan atau bumbu ditambahkan</p>
          ) : (
            dataResep.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b py-2">
                <span>
                  {item.name} ({item.item_type})
                </span>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.quantity_grams}
                    onChange={(e) => handleQuantityChange(idx, e.target.value)}
                    className="border px-2 py-1 w-24 rounded"
                  />
                  <span>gram</span>
                  <button onClick={() => handleRemoveItem(idx)} className="text-red-500">
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" onClick={() => router.push("/Restoran/transaction")}>
              Kembali
            </Button>
            <Button type="button" variant="contained" onClick={handleSaveRecipe} disabled={loadingRecipe}>
              {loadingRecipe ? "Menyimpan..." : "Simpan Resep"}
            </Button>
          </div>
        </div>
      </div>
    </RestoranLayout>
  );
}