// components/booking/create/BookingCartCard.tsx
"use client";

import React from "react";
import { CartItem } from "./types";
import { formatRupiah } from "@/lib/format";

interface BookingCartCardProps {
  cart: CartItem[];
  durasiHari: number;
  remainingStockMap?: Record<string, number>;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export function BookingCartCard({
  cart,
  durasiHari,
  remainingStockMap,
  onUpdateQty,
  onRemoveItem,
}: BookingCartCardProps) {
  const totalItemCount = cart.reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalBiaya = cart.reduce((acc, curr) => acc + curr.subtotal, 0);

  return (
    <div className="bc-card">
      <div className="bc-card-header">
        <h2 className="bc-card-title">Keranjang booking</h2>
        <span className="bc-cart-badge">● {totalItemCount} item</span>
      </div>

      {cart.length === 0 ? (
        <div className="bc-cart-empty">
          <div className="bc-cart-empty-title">Keranjang kosong.</div>
          <p className="bc-cart-empty-sub">Klik kartu barang atau paket untuk menambahkan.</p>
        </div>
      ) : (
        <>
          <div className="bc-cart-list">
            {cart.map((item) => {
              const remaining = remainingStockMap ? (remainingStockMap[item.id] ?? 0) : 0;
              const isMaxStock = remaining <= 0;
              return (
                <div key={item.id} className="bc-cart-item">
                  <div className="bc-ci-info">
                    <div className="bc-ci-name" title={item.nama}>
                      {item.tipe === "paket" ? "📦 " : ""}
                      {item.nama}
                    </div>
                    <div className="bc-ci-rate">
                      {formatRupiah(item.hargaPerHari)}/hari · {durasiHari} hr
                    </div>
                  </div>

                  <div className="bc-ci-stepper">
                    <button
                      type="button"
                      className="bc-ci-btn"
                      onClick={() => onUpdateQty(item.id, -1)}
                      title="Kurangi jumlah"
                    >
                      −
                    </button>
                    <span className="bc-ci-qty">{item.jumlah}</span>
                    <button
                      type="button"
                      className="bc-ci-btn"
                      disabled={isMaxStock}
                      onClick={() => onUpdateQty(item.id, 1)}
                      title={isMaxStock ? "Stok unit maksimal tercapai" : "Tambah jumlah"}
                    >
                      +
                    </button>
                  </div>

                  <span className="bc-ci-subtotal">{formatRupiah(item.subtotal)}</span>

                  <button
                    type="button"
                    className="bc-ci-del-btn"
                    onClick={() => onRemoveItem(item.id)}
                    title="Hapus barang"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bc-cart-summary-row">
            <span>Subtotal</span>
            <span>{formatRupiah(totalBiaya)}</span>
          </div>

          <div className="bc-cart-summary-row total">
            <span>Total</span>
            <span>{formatRupiah(totalBiaya)}</span>
          </div>
        </>
      )}
    </div>
  );
}
