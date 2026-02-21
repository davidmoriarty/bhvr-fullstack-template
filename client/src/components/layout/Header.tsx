// client/src/components/layout/Header.tsx
import { UserMenu } from "@/components/layout/UserMenu";

export function Header() {
	return (
		<header className="sticky top-0 inset-x-0 z-40 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
			<div className="max-w-400 mx-auto px-4 py-3">
				<div className="flex items-center justify-between">
					<a href="/" className="text-lg font-black">
						Brand
					</a>

					<nav className="flex flex-row items-center gap-x-6">
						<a href="/">Home</a>
						<UserMenu />
					</nav>
				</div>
			</div>
		</header>
	);
}
