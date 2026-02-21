// client/src/components/layout/Fooer.tsx
import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
	return (
		<footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
			<div className="max-w-400 mx-auto px-4 py-3">
				<div className="flex items-center justify-between">
					<p>&copy; {new Date().getFullYear()} Brand. All rights reserved.</p>

					<Button size="icon" className="rounded-full" asChild>
						<a href="#top">
							<ArrowUpIcon />
						</a>
					</Button>
				</div>
			</div>
		</footer>
	);
}
