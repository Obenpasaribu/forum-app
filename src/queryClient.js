import { QueryClient } from '@tanstack/react-query';

/**
 * Instance QueryClient tunggal yang dipakai di seluruh aplikasi.
 *
 * - staleTime: data dianggap masih segar selama 1 menit, sehingga
 *   berpindah antar halaman tidak langsung memicu fetch ulang.
 * - retry: 1 kali percobaan ulang otomatis saat request gagal
 *   (mis. koneksi terputus sesaat).
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
