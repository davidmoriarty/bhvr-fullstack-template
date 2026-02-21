import { Link, type LinkProps } from "@tanstack/react-router";
import { Button, type ButtonProps } from "@/components/ui/button";

type LinkButtonProps = Omit<ButtonProps, "asChild"> & {
	to: LinkProps["to"];
	children: React.ReactNode;
};

export function LinkButton({ to, children, ...buttonProps }: LinkButtonProps) {
	return (
		<Button {...buttonProps} asChild>
			<Link to={to}>{children}</Link>
		</Button>
	);
}
