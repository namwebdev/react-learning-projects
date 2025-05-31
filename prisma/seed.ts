import { PrismaClient, DayOfWeek } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Define multiple dealerships
  const dealershipsData = [
    {
      id: 'vehiql-downtown',
      name: 'Vehiql Motors Downtown',
      address: '123 Main Street, Downtown, CA 90210',
      phone: '+1 (555) 123-4567',
      email: 'downtown@vehiql.com',
      workingHours: [
        { dayOfWeek: DayOfWeek.MONDAY, openTime: '08:00', closeTime: '19:00', isOpen: true },
        { dayOfWeek: DayOfWeek.TUESDAY, openTime: '08:00', closeTime: '19:00', isOpen: true },
        { dayOfWeek: DayOfWeek.WEDNESDAY, openTime: '08:00', closeTime: '19:00', isOpen: true },
        { dayOfWeek: DayOfWeek.THURSDAY, openTime: '08:00', closeTime: '19:00', isOpen: true },
        { dayOfWeek: DayOfWeek.FRIDAY, openTime: '08:00', closeTime: '19:00', isOpen: true },
        { dayOfWeek: DayOfWeek.SATURDAY, openTime: '09:00', closeTime: '17:00', isOpen: true },
        { dayOfWeek: DayOfWeek.SUNDAY, openTime: '11:00', closeTime: '16:00', isOpen: true },
      ]
    },
    {
      id: 'vehiql-westside',
      name: 'Vehiql Motors Westside',
      address: '456 Sunset Boulevard, West Hollywood, CA 90069',
      phone: '+1 (555) 987-6543',
      email: 'westside@vehiql.com',
      workingHours: [
        { dayOfWeek: DayOfWeek.MONDAY, openTime: '09:00', closeTime: '18:00', isOpen: true },
        { dayOfWeek: DayOfWeek.TUESDAY, openTime: '09:00', closeTime: '18:00', isOpen: true },
        { dayOfWeek: DayOfWeek.WEDNESDAY, openTime: '09:00', closeTime: '18:00', isOpen: true },
        { dayOfWeek: DayOfWeek.THURSDAY, openTime: '09:00', closeTime: '18:00', isOpen: true },
        { dayOfWeek: DayOfWeek.FRIDAY, openTime: '09:00', closeTime: '18:00', isOpen: true },
        { dayOfWeek: DayOfWeek.SATURDAY, openTime: '10:00', closeTime: '16:00', isOpen: true },
        { dayOfWeek: DayOfWeek.SUNDAY, openTime: '12:00', closeTime: '16:00', isOpen: false },
      ]
    },
    {
      id: 'vehiql-luxury',
      name: 'Vehiql Luxury Motors',
      address: '789 Rodeo Drive, Beverly Hills, CA 90210',
      phone: '+1 (555) 555-0123',
      email: 'luxury@vehiql.com',
      workingHours: [
        { dayOfWeek: DayOfWeek.MONDAY, openTime: '10:00', closeTime: '20:00', isOpen: true },
        { dayOfWeek: DayOfWeek.TUESDAY, openTime: '10:00', closeTime: '20:00', isOpen: true },
        { dayOfWeek: DayOfWeek.WEDNESDAY, openTime: '10:00', closeTime: '20:00', isOpen: true },
        { dayOfWeek: DayOfWeek.THURSDAY, openTime: '10:00', closeTime: '20:00', isOpen: true },
        { dayOfWeek: DayOfWeek.FRIDAY, openTime: '10:00', closeTime: '20:00', isOpen: true },
        { dayOfWeek: DayOfWeek.SATURDAY, openTime: '10:00', closeTime: '18:00', isOpen: true },
        { dayOfWeek: DayOfWeek.SUNDAY, openTime: '12:00', closeTime: '17:00', isOpen: true },
      ]
    },
    {
      id: 'vehiql-budget',
      name: 'Vehiql Budget Cars',
      address: '321 Industrial Way, Commerce, CA 90040',
      phone: '+1 (555) 246-8135',
      email: 'budget@vehiql.com',
      workingHours: [
        { dayOfWeek: DayOfWeek.MONDAY, openTime: '08:30', closeTime: '17:30', isOpen: true },
        { dayOfWeek: DayOfWeek.TUESDAY, openTime: '08:30', closeTime: '17:30', isOpen: true },
        { dayOfWeek: DayOfWeek.WEDNESDAY, openTime: '08:30', closeTime: '17:30', isOpen: true },
        { dayOfWeek: DayOfWeek.THURSDAY, openTime: '08:30', closeTime: '17:30', isOpen: true },
        { dayOfWeek: DayOfWeek.FRIDAY, openTime: '08:30', closeTime: '17:30', isOpen: true },
        { dayOfWeek: DayOfWeek.SATURDAY, openTime: '09:00', closeTime: '15:00', isOpen: true },
        { dayOfWeek: DayOfWeek.SUNDAY, openTime: '10:00', closeTime: '14:00', isOpen: false },
      ]
    },
    {
      id: 'vehiql-electric',
      name: 'Vehiql Electric Vehicles',
      address: '555 Green Valley Road, Pasadena, CA 91101',
      phone: '+1 (555) 369-2580',
      email: 'electric@vehiql.com',
      workingHours: [
        { dayOfWeek: DayOfWeek.MONDAY, openTime: '09:00', closeTime: '19:00', isOpen: true },
        { dayOfWeek: DayOfWeek.TUESDAY, openTime: '09:00', closeTime: '19:00', isOpen: true },
        { dayOfWeek: DayOfWeek.WEDNESDAY, openTime: '09:00', closeTime: '19:00', isOpen: true },
        { dayOfWeek: DayOfWeek.THURSDAY, openTime: '09:00', closeTime: '19:00', isOpen: true },
        { dayOfWeek: DayOfWeek.FRIDAY, openTime: '09:00', closeTime: '19:00', isOpen: true },
        { dayOfWeek: DayOfWeek.SATURDAY, openTime: '10:00', closeTime: '17:00', isOpen: true },
        { dayOfWeek: DayOfWeek.SUNDAY, openTime: '11:00', closeTime: '16:00', isOpen: true },
      ]
    }
  ]

  // Create each dealership with its working hours
  for (const dealershipData of dealershipsData) {
    console.log(`\n🏢 Creating dealership: ${dealershipData.name}`)
    
    // Create dealership
    const dealership = await prisma.dealershipInfo.upsert({
      where: { id: dealershipData.id },
      update: {
        name: dealershipData.name,
        address: dealershipData.address,
        phone: dealershipData.phone,
        email: dealershipData.email,
      },
      create: {
        id: dealershipData.id,
        name: dealershipData.name,
        address: dealershipData.address,
        phone: dealershipData.phone,
        email: dealershipData.email,
      },
    })

    console.log(`✅ Created dealership: ${dealership.name}`)

    // Create working hours for this dealership
    for (const workingHour of dealershipData.workingHours) {
      await prisma.workingHour.upsert({
        where: {
          dealershipId_dayOfWeek: {
            dealershipId: dealership.id,
            dayOfWeek: workingHour.dayOfWeek,
          },
        },
        update: {
          openTime: workingHour.openTime,
          closeTime: workingHour.closeTime,
          isOpen: workingHour.isOpen,
        },
        create: {
          dealershipId: dealership.id,
          dayOfWeek: workingHour.dayOfWeek,
          openTime: workingHour.openTime,
          closeTime: workingHour.closeTime,
          isOpen: workingHour.isOpen,
        },
      })

      console.log(`   ⏰ ${workingHour.dayOfWeek}: ${workingHour.isOpen ? `${workingHour.openTime} - ${workingHour.closeTime}` : 'CLOSED'}`)
    }
  }

  console.log('\n🎉 Seed completed successfully!')
  console.log(`📊 Created ${dealershipsData.length} dealerships with their working hours`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 