import prisma from '@/prisma';

async function seedCows() {
  const { _max } = await prisma.cattle.aggregate({
    _max: {
      cattleNumber: true
    }
  });
  const maxCowNumber = _max?.cattleNumber || 18;

  const cows = await prisma.cattle.createManyAndReturn({
    data: Array.from({ length: 20 }, (_, i) => {
      const gender = Math.random() < 0.5 ? 'MALE' : 'FEMALE';
      const isPregnant = gender === 'FEMALE' && Math.random() < 0.5;
      const isLactating = gender === 'FEMALE' && Math.random() < 0.5;
      const isQuarantined = Math.random() < 0.5;
      const isVaccinated = Math.random() < 0.5;
      const healthStatus = (['HEALTHY', 'SICK', 'DEAD'] as const)[
        Math.floor(Math.random() * 3)
      ];
      const weight = Math.floor(Math.random() * (320 - 100 + 1)) + 100;
      const purchasePricePerKg = Math.floor(Math.random() * 100) + 100;
      const meatPercentage = Math.floor(Math.random() * 100) + 50;
      const fatPercentage = Math.floor(Math.random() * 10) + 1;
      const cattleClass =
        weight >= 250 ? 'PLATINUM' : weight >= 200 ? 'GOLD' : 'SILVER';
      const isSold = false;

      return {
        cattleNumber: maxCowNumber + i + 1,
        name: `#Cow ${maxCowNumber + i + 1}`,
        gender,
        liveWeight: weight,
        meatPercentage,
        fatPercentage,
        purchasePricePerKg,
        cattleClass,
        isSold,
        healthStatus,
        isVaccinated,
        isPregnant,
        isLactating,
        isQuarantined
      };
    })
  });

  console.log(`Created ${cows.length} cows`);
}

if (require.main === module) {
  seedCows().catch(console.error);
}
