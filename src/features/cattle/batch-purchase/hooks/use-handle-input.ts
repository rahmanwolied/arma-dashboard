import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CompleteBatchPurchaseFormValues } from "../validations/batch-purchase-schema";

export function useHandleInput(form: UseFormReturn<CompleteBatchPurchaseFormValues>) {
    const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        inputRefs.current = Array(Number(form.watch().numberOfCattle))
            .fill(0)
            .map(() => []);
        // Focus the first editable input on load
        inputRefs.current[0]?.[0]?.focus();
    }, [form.watch("numberOfCattle")]);

    const handleInputChange = (
        index: number,
        field: keyof CompleteBatchPurchaseFormValues["cattle"][number],
        value: string,
    ) => {
        const updatedList = [...form.getValues("cattle")];
        let processedValue = value;

        if (field === "purchasePrice") {
            processedValue = value.replace(/[^0-9]/g, "");
        }

        updatedList[index] = { ...updatedList[index], [field]: processedValue };
        form.setValue("cattle", updatedList);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        rowIndex: number,
        colIndex: number,
    ) => {
        // Shift + 0 shortcut for purchase price (adds 000)
        if (colIndex === 1 && e.key === ")") {
            e.preventDefault();
            const currentValue = form.getValues("cattle")[rowIndex].purchasePrice || "";
            const newValue = `${currentValue}000`;
            handleInputChange(rowIndex, "purchasePrice", newValue);
            return;
        }

        const totalRows = form.getValues("cattle").length;
        const totalCols = 2; // 0: weight, 1: purchasePrice

        const moveFocus = (nextRow: number, nextCol: number) => {
            if (
                nextRow >= 0 &&
                nextRow < totalRows &&
                nextCol >= 0 &&
                nextCol < totalCols
            ) {
                const targetInput = inputRefs.current[nextRow]?.[nextCol];
                if (targetInput) {
                    targetInput.focus();
                    targetInput.select();
                }
            }
        };

        switch (e.key) {
            case "Enter":
            case "Tab": {
                e.preventDefault();
                let nextCol = colIndex + 1;
                let nextRow = rowIndex;
                if (nextCol >= totalCols) {
                    nextCol = 0;
                    nextRow = rowIndex + 1;
                }
                moveFocus(nextRow, nextCol);
                break;
            }
            case "ArrowUp":
                e.preventDefault();
                moveFocus(rowIndex - 1, colIndex);
                break;
            case "ArrowDown":
                e.preventDefault();
                moveFocus(rowIndex + 1, colIndex);
                break;
            case "ArrowLeft":
                e.preventDefault();
                moveFocus(rowIndex, colIndex - 1);
                break;
            case "ArrowRight":
                e.preventDefault();
                moveFocus(rowIndex, colIndex + 1);
                break;
        }
    };

    return { inputRefs, handleInputChange, handleKeyDown };
}