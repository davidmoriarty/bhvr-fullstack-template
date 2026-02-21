// client/src/lib/auth-contract.ts
export type FieldErrors = Record<string, string>;

export type AuthSubmitResult =
	| { ok: true }
	| {
			ok: false;
			fieldErrors?: FieldErrors;
			formError?: string;
	  };

export type AuthSubmit<TValues extends Record<string, unknown>> = (
	values: TValues,
) => Promise<AuthSubmitResult>;
