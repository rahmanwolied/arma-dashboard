# ARMA Data Import Scripts

This directory contains scripts for importing and managing cattle data in the ARMA dashboard system.

## Import Cattle Data Script

### Overview

The `import-cattle-data.ts` script imports cattle and purchase data from a JSON export file into the ARMA database using Drizzle ORM. It creates proper relationships between animals, cattle, purchases, and weight records.

### Features

- ✅ **Batch Processing**: Processes data in configurable batches to handle large datasets efficiently
- ✅ **Transaction Safety**: Uses database transactions for data integrity
- ✅ **Error Handling**: Continues processing even if individual batches fail
- ✅ **Progress Logging**: Detailed progress reporting with success/failure statistics
- ✅ **Data Validation**: Validates JSON structure before processing
- ✅ **Relationship Mapping**: Creates proper 1:1 relationships between animals and cattle
- ✅ **Weight Records**: Automatically creates initial weight records from purchase data

### Database Schema Mapping

The script maps JSON export data to the following Drizzle tables:

| JSON Field | Database Table | Drizzle Schema Field | Notes |
|------------|----------------|---------------------|-------|
| `cattle.id` | `animals` | `id` (auto-generated) | Creates new UUID |
| `cattle.cattleNumber` | `cattle` | `cattleNumber` | Converted to string |
| `cattle.gender` | `cattle` | `gender` | MALE/FEMALE enum |
| `cattle.healthStatus` | `cattle` | `healthStatus` | HEALTHY/MINOR_ISSUE/SICK/CRITICAL |
| `cattle.cattleClass` | `cattle` | `cattleClass` | GOLD/SILVER/PLATINUM |
| `cattle.isQuarantined` | `cattle` | `isQuarantined` | Boolean |
| `cattle.isPregnant` | `cattle` | `isPregnant` | Boolean |
| `cattle.isLactating` | `cattle` | `isLactating` | Boolean |
| `cattlePurchase.purchaseDate` | `animalPurchases` | `purchaseDate` | Timestamp |
| `cattlePurchase.purchasePricePerKg` | `animalPurchases` | `purchasePrice` | Calculated total price |
| `cattlePurchase.liveWeight` | `weightRecords` | `weightKg` | Initial weight record |
| `cattlePurchase.purchaseLocation` | `animalPurchases` | `notes` | Stored in notes field |

### Usage

#### Direct Execution

```bash
tsx scripts/import-cattle-data.ts <database-url> <json-file-path> [farm-id] [batch-size]
```

**Parameters:**
- `database-url`: PostgreSQL connection string (required)
- `json-file-path`: Path to the JSON export file (required)
- `farm-id`: Farm identifier (optional, defaults to 'default-farm-id')
- `batch-size`: Number of records to process per batch (optional, defaults to 10)

**Example:**
```bash
tsx scripts/import-cattle-data.ts "postgresql://user:password@localhost:5432/arma_db" ./exports/cattle-data.json my-farm-uuid 20
```

#### Using Package Scripts

First, add your database URL and update the package.json script:

```json
{
  "scripts": {
    "db:import-cattle": "tsx scripts/import-cattle-data.ts"
  }
}
```

Then run:
```bash
pnpm db:import-cattle "postgresql://user:pass@host/db" ./path/to/data.json farm-id 15
```

### Expected JSON Format

The script expects a JSON file with the following structure:

```json
{
  "exportTimestamp": "2025-09-19T08:13:19.123Z",
  "summary": {
    "totalCattle": 403,
    "totalCattlePurchases": 403
  },
  "data": {
    "cattle": [
      {
        "id": "cmdfwdh72000zysls3ub0dc4w",
        "cattleNumber": 12,
        "name": null,
        "gender": "MALE",
        "cattlePurchaseId": "cmdfwdh4n000xyslsxg76twsj",
        "cattleClass": "SILVER",
        "isQuarantined": false,
        "isPregnant": false,
        "isLactating": false,
        "healthStatus": "HEALTHY",
        "isVaccinated": false,
        "createdAt": "2025-07-23T11:45:49.646Z",
        "updatedAt": "2025-07-23T11:45:49.646Z",
        "cattlePurchase": {
          "id": "cmdfwdh4n000xyslsxg76twsj",
          "purchaseDate": "2025-06-27T00:00:00.000Z",
          "purchasePricePerKg": 400,
          "liveWeight": 139,
          "meatPercentage": 66,
          "fatPercentage": 8,
          "purchaseLocation": "AAL",
          "createdAt": "2025-07-23T11:45:49.559Z"
        }
      }
    ]
  }
}
```

### Error Handling

The script implements robust error handling:

1. **File Validation**: Checks if the JSON file exists and is readable
2. **Data Structure Validation**: Validates the expected JSON structure
3. **Batch-Level Error Handling**: If a batch fails, it logs the error and continues with the next batch
4. **Transaction Rollback**: Database transactions ensure data consistency

### Output Example

```
🚀 Starting cattle data import...
📖 Reading JSON file...
📊 Data summary: { totalCattle: 403, totalCattlePurchases: 403 }
✅ Validation passed: 403 cattle records found
🔄 Processing 403 cattle in 81 batches...
⚡ Processing batch 1/81 (5 cattle)...
✅ Batch 1 completed successfully
⚡ Processing batch 2/81 (5 cattle)...
✅ Batch 2 completed successfully
...

📈 Import Summary:
  ✅ Successfully imported: 403 cattle
  ❌ Failed to import: 0 cattle
  📊 Success rate: 100.0%
🎉 Import completed successfully!
```

### Performance Considerations

- **Batch Size**: Default batch size of 10 balances memory usage and performance. Increase for faster processing of large datasets
- **Database Connections**: Uses connection pooling (max 20 connections)
- **Memory Usage**: Processes data in batches to avoid loading entire dataset into memory
- **Transaction Scope**: Each batch is processed in a separate transaction to limit lock time

### Troubleshooting

#### Common Issues

1. **Database Connection Failed**
   ```
   Solution: Verify database URL format and credentials
   Format: postgresql://username:password@host:port/database
   ```

2. **File Not Found**
   ```
   Solution: Check file path and ensure the JSON file exists
   Use absolute paths if relative paths don't work
   ```

3. **Invalid JSON Structure**
   ```
   Solution: Verify the JSON file matches the expected format
   Check that 'data.cattle' array exists and contains valid records
   ```

4. **Database Schema Mismatch**
   ```
   Solution: Ensure database migrations are up to date
   Run: pnpm db:migrate
   ```

#### Debugging

Enable debug logging by setting the environment variable:
```bash
NODE_ENV=development tsx scripts/import-cattle-data.ts ...
```

### Security Notes

- Database credentials are masked in console output
- Use environment variables for sensitive database URLs
- Ensure database user has appropriate permissions for INSERT operations

### Related Scripts

- `export-data.ts`: Export existing data to JSON format
- `seed-cattle-data.ts`: Seed with sample cattle data
- `seed-from-csv.ts`: Import from CSV format

### Dependencies

- `drizzle-orm`: ORM for database operations
- `postgres`: PostgreSQL client library
- `tsx`: TypeScript execution environment

For more information about the database schema, see `/src/db/schema/README.md`.
