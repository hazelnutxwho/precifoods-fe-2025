"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { createMenu } from "@/hooks/Restoran/AddNewMenu";
import { MENU_CATEGORIES } from "@/interfaces/menu";
import { Button } from "@mui/material";
import RestoranLayout from "@/components/Restoran/Restoranlayout";
import Image from "next/image";

interface FormValues {
  name: string;
  category: string;
  price: number;
  portion: number;
  description: string;
  image?: FileList;
}

export default function AddMenuPage() {
  const { register, handleSubmit, setValue } = useForm<FormValues>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValidType = ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        alert("Format gambar harus PNG, JPG, atau JPEG");
        return;
      }

      if (!isValidSize) {
        alert("Ukuran gambar maksimal 5MB");
        return;
      }

      setImagePreview(URL.createObjectURL(file));
      setValue("image", e.target.files as FileList);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await createMenu({
        name: values.name,
        category: values.category,
        price: values.price,
        portion: values.portion,
        description: values.description,
        image: values.image?.[0],
      });

      alert("Menu berhasil ditambahkan!");
      router.push("/Restoran/transaction");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gagal menambahkan menu");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RestoranLayout>
      <div className="max-w-3xl mx-auto space-y-6 p-6">
        <h1 className="text-2xl font-bold">Tambah Menu Baru</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 shadow rounded space-y-4"
        >
          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-medium mb-1">Gambar Menu</label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

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
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-600">Klik untuk upload gambar</span>
                  <span className="text-sm text-gray-400">
                    PNG, JPG, JPEG (max 5MB)
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Nama Menu */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama Menu</label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Masukkan nama menu"
              className="border w-full p-2 rounded"
              required
            />
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
            <input
              type="number"
              {...register("price", { required: true })}
              placeholder="0"
              className="border w-full p-2 rounded"
            />
          </div>

          {/* Porsi */}
          <div>
            <label className="block text-sm font-medium mb-1">Hidangan untuk ... (porsi/orang)</label>
            <input
              type="number"
              {...register("portion", { required: true })}
              placeholder="1"
              className="border w-full p-2 rounded"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              {...register("category", { required: true })}
              className="border w-full p-2 rounded"
            >
              <option value="">-- Pilih Kategori --</option>
              {MENU_CATEGORIES.filter((cat) => cat !== "Semua").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Deskripsi menu..."
              rows={3}
              className="border w-full p-2 rounded"
            />
          </div>

          {/* Tombol Simpan dan Batal */}
          <div className="flex justify-end gap-2">
            <Button onClick={() => router.push("/Restoran/transaction")}>
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </RestoranLayout>
  );
}
