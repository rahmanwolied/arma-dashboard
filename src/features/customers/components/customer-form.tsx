"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createCustomer } from "../actions";

export const customerFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	primaryPhone: z.string().min(1, "Phone is required"),
	secondaryPhone: z.string().optional(),
	email: z.string().email().optional().or(z.literal("")),
});

export type CustomerFormSchema = z.infer<typeof customerFormSchema>;

export default function CustomerForm({
	initialData,
	pageTitle,
}: {
	initialData: CustomerFormSchema | null;
	pageTitle: string;
}) {
	const defaultValues = {
		name: initialData?.name || "",
		primaryPhone: initialData?.primaryPhone || "",
		secondaryPhone: initialData?.secondaryPhone || "",
		email: initialData?.email || "",
	};

	const form = useForm<CustomerFormSchema>({
		resolver: zodResolver(customerFormSchema),
		values: defaultValues,
	});

	async function onSubmit(values: CustomerFormSchema) {
		const result = await createCustomer(values);
		if (result.success) {
			// Handle success (redirect, toast, etc.)
			console.log("Customer created successfully");
		} else {
			// Handle error
			console.error(result.message);
		}
	}

	return (
		<Card className="mx-auto w-full">
			<CardHeader>
				<CardTitle className="text-left text-2xl font-bold">
					{pageTitle}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Customer Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter customer name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="primaryPhone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Primary Phone</FormLabel>
										<FormControl>
											<Input placeholder="Enter primary phone" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="secondaryPhone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Secondary Phone (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="Enter secondary phone" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email (Optional)</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="Enter email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Submitting..." : "Add Customer"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
