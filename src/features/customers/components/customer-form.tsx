"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createCustomer, updateCustomer } from "../actions";
import { User, Phone, Mail, Smartphone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import {toast} from 'sonner'

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
	id
}: {
	initialData: CustomerFormSchema | null;
	pageTitle: string;
	id:string
}) {
	const [existing, setExisting] = useState(false)

	useEffect(() => {
		if (initialData || id !== 'new') setExisting(true)
	},[])

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
		const result = !existing ? await createCustomer(values) : await updateCustomer(values, id)

		if (result.success) {
			// Handle success (redirect, toast, etc.)
			toast.success(`${existing ? 'Updated' : 'Added'} Customer Successfully`)
			console.log("Customer created successfully");
		} else {
			// Handle error
			toast.error("An error occured")
			console.error(result.message);
		}
	}

	return (
		<Card className="mx-auto w-full max-w-2xl">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-left text-2xl font-bold">
					<User className="h-6 w-6" />
					{pageTitle}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Required Fields Section */}
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
								<div className="h-px flex-1 bg-border" />
								<span>Required Information</span>
								<div className="h-px flex-1 bg-border" />
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<User className="h-4 w-4" />
												Customer Name
											</FormLabel>
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
											<FormLabel className="flex items-center gap-2">
												<Phone className="h-4 w-4" />
												Primary Phone
											</FormLabel>
											<FormControl>
												<Input
													type="tel"
													placeholder="e.g., 01712-345678"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<Separator />

						{/* Optional Fields Section */}
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
								<div className="h-px flex-1 bg-border" />
								<span>Optional Information</span>
								<div className="h-px flex-1 bg-border" />
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="secondaryPhone"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<Smartphone className="h-4 w-4" />
												Secondary Phone
											</FormLabel>
											<FormControl>
												<Input
													type="tel"
													placeholder="Alternative contact number"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Alternative contact number (optional)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<Mail className="h-4 w-4" />
												Email
											</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="customer@example.com"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Email address for communication (optional)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<Separator />

						<div className="flex items-center justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => form.reset()}
							>
								Reset
							</Button>
							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
								className="min-w-[150px]"
							>
								{form.formState.isSubmitting ? (
									<>
										<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										Submitting...
									</>
								) : (
									<>
										<User className="mr-2 h-4 w-4" />
										{existing ? 'Update' : "Add"} Customer
									</>
								)}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
