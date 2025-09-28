/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import fs from "node:fs";

import LocationsData from "../locations.json" assert { type: "json" };
import { districts, divisions, zones } from "../src/db/schema/tables/customers";
import { db } from "./db";
import { eq } from "drizzle-orm";

const getDistricts = async () => {
	const response = await fetch(
		`https://member.daraz.com.bd/locationtree/api/getSubAddressList?countryCode=BD&addressId=${"R3921322"}&page=addressEdit`,
		{
			"headers": {
				"accept": "application/json, text/plain, */*",
				"accept-language": "en-US,en;q=0.9",
				"bx-v": "2.5.31",
				"priority": "u=1, i",
				"sec-ch-ua":
					'"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"macOS"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"traffic": "drz-replatform",
				"x-csrf-token": "e5de1707ee537",
				"x-requested-with": "XMLHttpRequest",
				"x-ua":
					"140#B5MrapSOzzZ9tQo2XoNFGtsX48afDKVDncOQf+/kWY98GjaM4sDeRup5iW5XzoddOFOSMFpQ6laIwXbtLfEYIl4JAYidMO0iv1f3gtk200hBiH2iDNcBA3eDz7+ASWIzAIPn0xq1uMixtDkeDKfoIRRgNGy4D8DlvXXp4fzSDSEqlbzxVtSHEEXlzzr201IbUtbzzPzbVXlqlbrdYIrnxnG6aQmS07wMU6uxzoObV2Eql9bDf0QHxrvZrI7ZbQ2z15vnYPlA98l2uYfe8ZCDls/6rP5NismUFT4UqDc7dODocI9yAndd+n0jwl2Sgv/CrHdIJlJjSoXYiQctr/7WEGFagwmBXAuR8WsBPCeKpf0SemozMXpwkRT/BCbga347KE/rAS7DtdN3hzui1VIIOXDh+mY2XR+QYYzQ5upynjyqttxrlYhrH1yND7JQrOqxVfaIBAtSXQSP+HbGz7+LwyzonZUyT2g/tS7SdhtQrebr4Cj1e1pq9mfr3IOXGqvpJnYqOb3eDXsB9oLVYTLvD3TJ7fmQCou6R8N04KFhL1ieoqGNT/ucRHpX7bq6XHbl5dMZn6Go1W2SoX1vs7Id6uC3LTsIu0E8uj9zEfG4EO7cdf+wzJVWliuX5EmvSRIO40bDMGbOtLMtGP91J3vKxcUx3cozQNeIAkYbk4iMOj65PbqpfuoT6YuLU1uHalQ/Ojd2H9AwdqBrKRnTaTLmpXO6sPj9mQznAcIaxZ6kzEP8ebaYLxLe6pzjU3BK6mU0kBKgXiYjpIJFUj+EgUHcZ7d+gL2Z4OFDSgR2IpatOwV37UrPyyzVAXbnRV02PiwgIVQgl9CvLo5jUEmbt//l+gy4tMHjn5ZWTQz4bUd3ea0px4vMgoBzEwrTig4i+8KaB4aBsLtb+45VgL3J3jqThqg4G/kDy9MzN5UCr1TdEwQDgWYn2yAkIvm0arC1nb/NgX3vwac/GSYzTm2WKqjngJb8xR74oj9SVIJigz8NXwyWZH6bmJ1w5MviEGo+tU9yZnm3OZLYh/Tj9JWu4p08peae2CnHZw2ZSdlIPMYq4zWBxXWroHCGETIEvOWj5RW6FRAmaz5sGtW8l0jraMq1OdiOnHEuFdJNu15ckTO9yeis4fwpfp1OWEAi6BzhqSBz66u4ixWhbRxWxJ2MtTyjkwiDwpTJtz1hsrww1SNkxvsYbUVO6FtyI9nheyU4MfeI4GqTt14lATeHl6Loul7/u6thS/t+HFw1wP18GKYCHeV/zlK5uP6tzQ2yNH5OoAY7QVL70B3RO3L3UF0EQeBaVHCgQcYEQs7odtywkLzkRumKKRGs8rXc7hC5AkulE9dXKRnL2AYAaKAnW8krMJXWcazuXzFxB/ivHkpgGyzxudV7pFnFWe8w4fcAR3h2se36mWg9epGh4d2rxUEmU6Jc0HBKW7sgGaWL7KYa2CHpG8jVc+z7s9X3nTz6M/O/HiyHQSOMe2vtZr2KQGo4gk1m+glnkmYkEWZ5zuFCbwIFo3O/iayuQSG+uDH1jp8CCa03KeMq+hrzMvjsncuUHWXcBUvEFRL+6N7fwehuNgY30WEEBQqYp4V14YOQQufYEBXE/8eRJ2TlUyvlfhlUtcHXJIqaxKsxAHtjMqmtcOAPS7B/xg+ErQeoYyzL9GY2F1Xfc0R0abCJey8J1zmN91Zwa5XoxeqJrMF2jAmm7MemHH1+bTCXjf6Nz/OftF==",
				"x-umidtoken":
					"T2gAwDcveBiUNOo_MR7QlUr54IgeTSLQYJKPPwtuRmeF91IXk2I8Szezn0pI0zKPW68=",
			},
			"referrer":
				"https://member.daraz.com.bd/address?spm=a2o42.manage_account.1.dprofile_edit.10ec175dXwSBfY",
			"body": null,
			"method": "GET",
			"mode": "cors",
			"credentials": "include",
		},
	);

	return (await response.json()).module;
};

const getZones = async (districtId: string) => {
	const response = await fetch(
		`https://member.daraz.com.bd/locationtree/api/getSubAddressList?countryCode=BD&addressId=${districtId}&page=addressEdit`,
		{
			"headers": {
				"accept": "application/json, text/plain, */*",
				"accept-language": "en-US,en;q=0.9",
				"bx-v": "2.5.31",
				"priority": "u=1, i",
				"sec-ch-ua":
					'"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"macOS"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"traffic": "drz-replatform",
				"x-csrf-token": "e5de1707ee537",
				"x-requested-with": "XMLHttpRequest",
				"x-ua":
					"140#zcFdoaZTzzW30zo2UFdDC2nBcdO4KH0xrjW7F+YWIC5n4p125RfOHZmwqVSCE0tjOrzbd+NtVY3sQjfzkoH4WV1xqY1RvjgPUjx9Q0+xKN66ioCUa8k/1EDDGpnbSRG7bgGzpI1dLYCHsQOXxv8Ap3GVd+KqOuvU/gaM7+rU4PpLyAYuLAvoDDNlRrmr/C6Z79c3BD5Ob4yKVO7RemWGTZl8v08TT5+lAIG1m5rMlp1zzXlRDsTU3QzxVLUK9pWAzzrb22U3lp1xxNOixQZk/jsDGLaecPfo1Ly62X0olpYazDrbV2ECzSE5FbZLMZ2aMX2FXY4Kme7e4PWuVTdyPPAJlM932FyeqU4OIqkhDwZ/CWXQ9+XhtZi3VE6kXXsA8qJtV8Y0O/tfWF8K0ndOQk385a+0ZkV8DS7xfGzZWM04qXtQpjHSREQSFGQRoxp4W7YRsuOgpCI7dhtWsjmgrZj/2rNGw7/QJB2ePcgx8PpN/6Okf5ZdTCKtkNdyb5RKtW/1ijBhCPJG+0Yxq34n5hGcnem4W7z5xJKR0Q086d/4c2n/wMnHN7i1cVAE7JeADqFpfETHym0PyTvqD9QQjC1h+Yrfm9Sf4SQ9zOatIIwyClmggcylUFVsMKcUe4V3YRZQWYTc/ocD+pJyjkvlnxsdbxctMfIMWfsl2w4Wx4rCQqY4Ewsdps/TSKG7mEj5kUvmJKUxTXlK+PX9lBlVKOAMLmmDhVL9BXLnv4RjcF6Llf1JTsGzbDBC5QrJCYikG5nJUk8qwNcMMKrOsHR2bwQ0/FWD8bpocGn7tzX4B9eIsX9/QVPnAKmgl5gcdo17KB2TWBneakpwQSZm3NVwxqGOIEBzEwrTig4i+8KaB4aBsLtb+45VGl+bhNeyjzG+RgkQMGfiGHhUqnKEJZj6F1j5LiIFZKj0JhQmzEfzyG8f9WKzFLv9Z2Fb1JzegDyMLWaV2Cj5mL25L1zj4Cu21nzEpSAtnzH3K9gETbI+Y/oBAadC0f4svsEPK6FjC6upZX59GLQMcuu1EE9aqlo8NjUdNaUv/ZuJ3B5PK3cEtDu/HANHW6uI4+1ObxxEARSi/s7nHRTaQjyh8Fe1Nu31kaaSqiYbhgV4wxn9wV/73LzHPpfssu47KZtrKvzWwN8BrT/rap86fhWUqno9azPIQOe5P02zqZoF8YdjQ3GSab0sQzCkEwjMGnd6XJhoYuUquXNMi427VA44SeC8mQYafN5mrHhH7TNdV2Kl7L8VrDgTDofGj1XfLR1k8/PdOejnBhuggxIRjsHi8vvq4X8o1GP4A7mCj81iJjmu6U21YEY1ZPECQBmcRHutJN0VoYz1cQZSsPwElnwxlBlhSCcMBLabaiC3TSVHLGqIW8GeDvAYOtTOyg7+UXDF0R5E9HsJ7qLSzcEmUdQAfLnxf2cyf6D9zKHfYm3gf8mBTP975sdlKvRO1WCu/Ld++eQozE4xIv0LOiDzC6YgkqzMB3KwUj6GPjXdNS0b41N/WwrYejSWgKpp65gPn0VN/U6BlHmBwu7Mtgrqs2QZtvo61ccEfFzR0gBFQTt5a2AywW8HZNfSmAT5weYtBl9d5HTQgqWRXX7tpSdnsHqJ9DsAlVMz4oRlOJh2CSl4axKxS2GQvLFCc5+cUn3tvsUzf7zE7fockyX3JuTaFO3Z47QwiIK06Oq9Fdz147bWb9gP+QQFUUeNQaMQnOIrePvHCQWTBwj1GiKSELgU+Q==",
				"x-umidtoken":
					"T2gAwDcveBiUNOo_MR7QlUr54IgeTSLQYJKPPwtuRmeF91IXk2I8Szezn0pI0zKPW68=",
			},
			"referrer":
				"https://member.daraz.com.bd/address?spm=a2o42.manage_account.1.dprofile_edit.10ec175dXwSBfY",
			"body": null,
			"method": "GET",
			"mode": "cors",
			"credentials": "include",
		},
	);

	return (await response.json()).module;
};

type District = {
	code: string;
	divisionId: string; // UUID
	name: string;
	zones: Zone[];
};

type Zone = {
	code: string;
	name: string;
	districtId: string; // UUID
};

type Data = District[];

type Division = {
	code: string;
	name: string;
	districts: District[];
};

// Types for the JSON data structure
type LocationDataDistrict = {
	id: string; // This maps to 'code' in our schema
	name: string;
	zones: LocationDataZone[];
};

type LocationDataZone = {
	id: string; // This maps to 'code' in our schema
	name: string;
};

const insertDivision = async (division: Division) => {
	try {
		const divisionExists = await db.select().from(divisions).where(
			eq(divisions.code, division.code),
		);
		if (divisionExists.length > 0) {
			console.log(`Division already exists: ${division.name}`);
			return divisionExists[0];
		}
		const newDivision = await db.insert(divisions).values({
			code: division.code,
			name: division.name,
		}).returning();
		console.log(`Division inserted: ${division.name}`);
		return newDivision[0];
	} catch (error) {
		console.error(`Error inserting division: ${division.name}`);
		console.error(error instanceof Error ? error.message : String(error));
		throw error;
	}
};

const insertDistrict = async (district: District) => {
	try {
		const districtExists = await db.select().from(districts).where(
			eq(districts.code, district.code),
		);

		if (districtExists.length > 0) {
			console.log(`District already exists: ${district.name}`);
			return districtExists[0];
		}

		const newDistrict = await db.insert(districts).values({
			code: district.code,
			name: district.name,
			divisionId: district.divisionId,
		}).returning();
		console.log(`\t\tDistrict inserted: ${district.name}`);
		return newDistrict[0];
	} catch (error) {
		console.error(`Error inserting district: ${district.name}`);
		console.error(error instanceof Error ? error.message : String(error));
		throw error;
	}
};

const insertZone = async (zone: Zone) => {
	try {
		const zoneExists = await db.select().from(zones).where(
			eq(zones.code, zone.code),
		);
		if (zoneExists.length > 0) {
			console.log(`Zone already exists: ${zone.name}`);
			return zoneExists[0];
		}
		const newZone = await db.insert(zones).values({
			code: zone.code,
			name: zone.name,
			districtId: zone.districtId,
		}).returning();
		console.log(`\t\t\tZone inserted: ${zone.name}`);
		return newZone[0];
	} catch (error) {
		console.error(`Error inserting zone: ${zone.name}`);
		console.error(error instanceof Error ? error.message : String(error));
		throw error;
	}
};

const dhakaDivision: Division = {
	code: "R3921322",
	name: "Dhaka",
	districts: [],
};

const main = async () => {
	console.log("Resetting division, districts, and zones...");
	await db.delete(divisions);
	await db.delete(districts);
	await db.delete(zones);

	console.log("Starting data seeding...");

	// Insert division first
	const newDivision = await insertDivision(dhakaDivision);

	if (!newDivision) {
		console.error("Failed to insert or retrieve division");
		return;
	}

	console.log(`Division ready: ${newDivision.name} (${newDivision.id})`);

	const locationData = LocationsData as LocationDataDistrict[];

	// Prepare all districts for batch insert
	const districtsToInsert = locationData.map((district) => ({
		code: district.id,
		name: district.name,
		divisionId: newDivision.id,
	}));

	console.log(`Preparing to insert ${districtsToInsert.length} districts...`);

	// Check which districts already exist
	const existingDistricts = await db.select().from(districts);
	const existingDistrictCodes = new Set(existingDistricts.map((d) => d.code));

	console.log(`Existing districts: ${existingDistrictCodes.size}`);
	console.log(`Districts to insert: ${districtsToInsert.length}`);

	// Filter out existing districts
	const newDistricts = districtsToInsert.filter((d) =>
		!existingDistrictCodes.has(d.code)
	);

	let insertedDistricts: typeof existingDistricts = [];

	if (newDistricts.length > 0) {
		console.log(`Inserting ${newDistricts.length} new districts...`);
		insertedDistricts = await db.insert(districts).values(newDistricts)
			.returning();
		console.log(`✅ Inserted ${insertedDistricts.length} districts`);
	} else {
		console.log("All districts already exist");
	}

	// Get all districts (existing + newly inserted)
	const allDistricts = await db.select().from(districts).where(
		eq(districts.divisionId, newDivision.id),
	);

	// Create a map of district code to district ID for quick lookup
	const districtCodeToId = new Map(allDistricts.map((d) => [d.code, d.id]));

	// Prepare all zones for batch insert
	const allZones: Array<{ code: string; name: string; districtId: string }> =
		[];

	for (const district of locationData) {
		const districtId = districtCodeToId.get(district.id);
		if (!districtId) {
			console.error(`District ID not found for code: ${district.id}`);
			continue;
		}

		for (const zone of district.zones) {
			allZones.push({
				code: zone.id,
				name: zone.name,
				districtId: districtId,
			});
		}
	}

	console.log(`Preparing to insert ${allZones.length} zones...`);

	// Check which zones already exist
	const existingZones = await db.select().from(zones);
	const existingZoneCodes = new Set(existingZones.map((z) => z.code));

	// Filter out existing zones
	const newZones = allZones.filter((z) => !existingZoneCodes.has(z.code));

	if (newZones.length > 0) {
		console.log(`Inserting ${newZones.length} new zones...`);

		// Insert zones in batches to avoid memory issues
		const batchSize = 1000;
		let insertedCount = 0;

		for (let i = 0; i < newZones.length; i += batchSize) {
			const batch = newZones.slice(i, i + batchSize);
			await db.insert(zones).values(batch);
			insertedCount += batch.length;
			console.log(
				`✅ Inserted ${insertedCount}/${newZones.length} zones`,
			);
		}

		console.log(`✅ All ${newZones.length} zones inserted successfully`);
	} else {
		console.log("All zones already exist");
	}

	console.log("🎉 Data seeding completed!");
};

const writeDataToFile = (data: Data) => {
	fs.writeFileSync("./scripts/locations.json", JSON.stringify(data, null, 2));
};

main();
