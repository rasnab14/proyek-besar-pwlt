// components/booking/create/ProductCatalogCard.tsx
"use client";

import React, { useState, useMemo } from "react";
import { CatalogProduct } from "./types";
import { formatRupiah } from "@/lib/format";

interface ProductCatalogCardProps {
  products: CatalogProduct[];
  onAddToCart: (product: CatalogProduct) => void;
}

export function ProductCatalogCard({ products, onAddToCart }: ProductCatalogCardProps) {
  // Tabs: "satuan" | "paket"
  const [activeTab, setActiveTab] = useState<"satuan" | "paket">("satuan");

  // Search & Category
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Filter: "semua" | "tersedia"
  const [availFilter, setAvailFilter] = useState<"semua" | "tersedia">("semua");

  // Sort
  const [sortBy, setSortBy] = useState<"nama-asc" | "nama-desc" | "harga-asc" | "harga-desc">("nama-asc");

  // Filter tab items
  const tabProducts = useMemo(() => {
    return products.filter((p) => p.tipe === activeTab);
  }, [products, activeTab]);

  // Compute Categories with dynamic count
  const categoriesWithCounts = useMemo(() => {
    if (activeTab === "paket") {
      return [{ name: "Semua", count: tabProducts.length }];
    }

    const map: { [key: string]: number } = {};
    products
      .filter((p) => p.tipe === "satuan")
      .forEach((p) => {
        map[p.kategori] = (map[p.kategori] || 0) + 1;
      });

    return [
      { name: "Semua", count: products.filter((p) => p.tipe === "satuan").length },
      { name: "Tenda", count: map["Tenda"] || 0 },
      { name: "Tas", count: map["Tas"] || 0 },
      { name: "Alat Masak", count: map["Alat Masak"] || 0 },
      { name: "Alas Tidur", count: map["Alas Tidur"] || 0 },
      { name: "Aksesoris", count: map["Aksesoris"] || 0 },
    ];
  }, [products, tabProducts, activeTab]);

  // Filter and Sort products
  const displayProducts = useMemo(() => {
    return tabProducts
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.nama.toLowerCase().includes(q);
          const matchSku = p.kode.toLowerCase().includes(q);
          if (!matchName && !matchSku) return false;
        }

        // Category
        if (selectedCategory !== "Semua" && p.kategori !== selectedCategory) {
          return false;
        }

        // Availability filter
        if (availFilter === "tersedia" && p.unitTersedia <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "nama-asc") return a.nama.localeCompare(b.nama);
        if (sortBy === "nama-desc") return b.nama.localeCompare(a.nama);
        if (sortBy === "harga-asc") return a.hargaPerHari - b.hargaPerHari;
        if (sortBy === "harga-desc") return b.hargaPerHari - a.hargaPerHari;
        return 0;
      });
  }, [tabProducts, searchQuery, selectedCategory, availFilter, sortBy]);

  // Total counts for tabs
  const satuanCount = products.filter((p) => p.tipe === "satuan").length;
  const paketCount = products.filter((p) => p.tipe === "paket").length;

  return (
    <div className="bc-card">
      {/* 1. Catalog Tabs */}
      <div className="bc-catalog-tabs">
        <button
          type="button"
          className={`bc-cat-tab-btn ${activeTab === "satuan" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("satuan");
            setSelectedCategory("Semua");
          }}
          suppressHydrationWarning
        >
          Barang satuan {satuanCount}
        </button>
        <button
          type="button"
          className={`bc-cat-tab-btn ${activeTab === "paket" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("paket");
            setSelectedCategory("Semua");
          }}
          suppressHydrationWarning
        >
          Paket {paketCount}
        </button>
      </div>

      {/* 2. Product Search */}
      <div className="bc-prod-search-box">
        <svg
          className="bc-prod-search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="bc-prod-search-input"
          placeholder="Cari nama barang atau SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 3. Category Pills (Single Items) */}
      {activeTab === "satuan" && (
        <div className="bc-category-pills">
          {categoriesWithCounts.map((cat) => (
            <button
              key={cat.name}
              type="button"
              className={`bc-pill-btn ${selectedCategory === cat.name ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name} {cat.count}
            </button>
          ))}
        </div>
      )}

      {/* 4. Subfilter Row: Count, Availability Segment, Sort */}
      <div className="bc-subfilter-row">
        <span suppressHydrationWarning>{displayProducts.length} barang</span>

        <div className="bc-subfilter-controls">
          <div className="bc-avail-seg">
            <button
              type="button"
              className={`bc-avail-seg-btn ${availFilter === "semua" ? "active" : ""}`}
              onClick={() => setAvailFilter("semua")}
            >
              Semua
            </button>
            <button
              type="button"
              className={`bc-avail-seg-btn ${availFilter === "tersedia" ? "active" : ""}`}
              onClick={() => setAvailFilter("tersedia")}
            >
              Tersedia
            </button>
          </div>

          <select
            className="bc-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="nama-asc">Nama A–Z</option>
            <option value="nama-desc">Nama Z–A</option>
            <option value="harga-asc">Harga Terendah</option>
            <option value="harga-desc">Harga Tertinggi</option>
          </select>
        </div>
      </div>

      {/* 5. Product Grid (4 columns) */}
      <div className="bc-product-grid">
        {displayProducts.map((prod) => {
          const isAvail = prod.unitTersedia > 0;

          // Background color and icon based on iconType
          let bgClass = "bg-aksesoris";
          let strokeColor = "#64748B";

          if (prod.iconType === "tenda") {
            bgClass = "bg-tenda";
            strokeColor = "#0284C7";
          } else if (prod.iconType === "tas") {
            bgClass = "bg-tas";
            strokeColor = "#16A34A";
          } else if (prod.iconType === "masak") {
            bgClass = "bg-masak";
            strokeColor = "#D97706";
          } else if (prod.iconType === "tidur") {
            bgClass = "bg-tidur";
            strokeColor = "#9333EA";
          } else if (prod.iconType === "paket") {
            bgClass = "bg-paket";
            strokeColor = "#4F46E5";
          }

          return (
            <div
              key={prod.id}
              className={`bc-product-card ${isAvail ? "available" : "unavailable"}`}
              onClick={() => {
                if (isAvail) onAddToCart(prod);
              }}
              title={isAvail ? `Klik untuk menambahkan ${prod.nama} ke keranjang` : "Barang tidak tersedia"}
            >
              {/* Image Area */}
              <div className={`bc-card-img-area ${bgClass}`}>
                <span className="bc-card-category-badge">{prod.kategori}</span>
                {!isAvail && (
                  <span className="bc-card-soldout-badge">Stok Habis</span>
                )}

                {/* Minimalist vector illustration matching screenshot */}
                <div className="bc-card-icon-center">
                  {prod.iconType === "tenda" && (
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3L2 20h20L12 3z" />
                      <path d="M12 3v17" />
                    </svg>
                  )}
                  {prod.iconType === "tas" && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="6" width="14" height="15" rx="3" />
                      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                      <line x1="5" y1="11" x2="19" y2="11" />
                    </svg>
                  )}
                  {prod.iconType === "masak" && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="14" rx="8" ry="4" />
                      <path d="M4 14v3a8 4 0 0 0 16 0v-3" />
                      <line x1="12" y1="4" x2="12" y2="7" />
                    </svg>
                  )}
                  {prod.iconType === "tidur" && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="7" width="18" height="10" rx="2" />
                      <line x1="8" y1="7" x2="8" y2="17" />
                    </svg>
                  )}
                  {prod.iconType === "aksesoris" && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="7" />
                      <polyline points="12 9 12 12 13.5 13.5" />
                    </svg>
                  )}
                  {prod.iconType === "paket" && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="8" width="18" height="13" rx="2" />
                      <path d="M12 8v13" />
                      <path d="M3 13h18" />
                      <path d="M7.5 8a2.5 2.5 0 0 1 0-5c1.5 0 2.5 2 4.5 5 2-3 3-5 4.5-5a2.5 2.5 0 0 1 0 5" />
                    </svg>
                  )}
                </div>

                <span className="bc-card-foto-label">FOTO</span>
              </div>

              {/* Lower details */}
              <div className="bc-card-body">
                <h3 className="bc-card-title">{prod.nama}</h3>
                <span className="bc-card-sku">{prod.kode}</span>
                <div className="bc-card-price-row">
                  <span className="bc-card-price">{formatRupiah(prod.hargaPerHari)}</span>
                  <span className="bc-card-price-unit">/hari</span>
                </div>

                {/* Stock indicator */}
                <div className="bc-card-stock-row">
                  {isAvail ? (
                    <>
                      <span className="bc-stock-dot green"></span>
                      <span className="bc-stock-text green" suppressHydrationWarning>
                        {prod.unitTersedia} dari {prod.totalUnit} {prod.tipe === "paket" ? "paket" : "unit"} tersedia
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="bc-stock-dot red"></span>
                      <span className="bc-stock-text red" suppressHydrationWarning>
                        0 dari {prod.totalUnit} {prod.tipe === "paket" ? "paket" : "unit"} tersedia · Stok habis
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
