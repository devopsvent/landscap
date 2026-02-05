export type TabType = "home" | "favorites" | "subscription" | "help";

export interface SidebarProps {
	onLogout: () => void;
	loggingOut?: boolean;
}
