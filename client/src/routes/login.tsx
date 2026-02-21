// client/src/routes/login.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageTransition } from "@/components/motion/PageTransition";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/layout/LinkButton";
import { submitLogin } from "@/lib/auth";
import { buildHead } from "@/lib/meta";

function LoginPage() {
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState({
		form: null as string | null,
		email: null as string | null,
		password: null as string | null,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setErrors({ email: null, password: null, form: null });

		const result = await submitLogin(form);

		if (result.ok) {
			// Redirect to notes overview
			navigate({ to: "/" });
		} else {
			setErrors((prev) => ({
				...prev,
				...result.fieldErrors,
				form: result.formError ?? result.fieldErrors?.form ?? "Login failed",
			}));
		}
	};

	return (
		<PageTransition>
			<Section
				centered
				className="min-h-[85vh] flex flex-col items-center justify-center"
			>
				<Container className="bg-gray-200 dark:bg-slate-800 rounded max-w-3xl px-6 py-12">
					<div>
						<h1 className="text-4xl mb-4">Sign in</h1>
						<p className="max-w-[40ch] mx-auto">
							Enter your email and password to access your account.
						</p>
					</div>

					<form onSubmit={handleSubmit}>
						<FieldSet className="max-w-xl mx-auto">
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									value={form.email}
									onChange={(e) =>
										setForm((f) => ({ ...f, email: e.target.value }))
									}
									className={errors.email ? "border-destructive" : ""}
								/>
								<FieldError>{errors.email}</FieldError>
							</Field>

							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input
									id="password"
									type="password"
									value={form.password}
									onChange={(e) =>
										setForm((f) => ({ ...f, password: e.target.value }))
									}
									className={errors.password ? "border-destructive" : ""}
								/>
								<FieldError>{errors.password}</FieldError>
							</Field>

							<Field className="mt-4">
								<Button type="submit" size="lg">
									Sign in
								</Button>
							</Field>

							{errors.form && (
								<p className="mt-2 text-destructive text-center">
									{errors.form}
								</p>
							)}
						</FieldSet>
					</form>

					<div className="flex flex-row items-center justify-center text-center gap-x-2 pt-4">
						<p>Don't have an account?</p>
						<LinkButton to="/register" variant="link" size="sm">
							Sign up
						</LinkButton>
					</div>
				</Container>
			</Section>
		</PageTransition>
	);
}

export const Route = createFileRoute("/login")({
	head: () =>
		buildHead({
			title: "Sign in",
			description: "Sign in to access your account securely.",
			path: "/login",
		}),
	component: LoginPage,
});
