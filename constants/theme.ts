export const colors = {
  bg: "#0B0B0D",
  surface: "#15161A",
  card: "#1D1F24",
  online: "#3B82F6",
  offline: "#F97316",
  textPrimary: "#FFFFFF",
  textSecondary: "#B0B3BD",
  success: "#22C55E",
  error: "#EF4444",
  border: "rgba(255,255,255,0.08)",
  muted: "rgba(176,179,189,0.14)"
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28
} as const;

export const shadows = {
  glowOnline: {
    shadowColor: colors.online,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.42,
    shadowRadius: 16,
    elevation: 6
  },
  glowOffline: {
    shadowColor: colors.offline,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.42,
    shadowRadius: 16,
    elevation: 6
  }
} as const;
