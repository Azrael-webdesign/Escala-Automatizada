
import { ScheduleData, ShiftCode, Employee, EmployeeSchedule, Notification } from '../types/schedule';

// Pre-defined shift codes
export const shiftCodes: ShiftCode[] = [
  { code: 'A', name: 'Jornada A', startTime: '08:15', breakTime: '12:45', endTime: '18:00', color: 'bg-schedule-shift-a' },
  { code: 'B', name: 'Jornada B', startTime: '07:45', breakTime: '11:00', endTime: '17:30', color: 'bg-schedule-shift-b' },
  { code: 'C', name: 'Jornada C', startTime: '07:45', endTime: '14:05', color: 'bg-schedule-shift-c' },
  { code: 'DSR', name: 'Descanso', color: 'bg-schedule-shift-dsr' },
  { code: 'Fo', name: 'Folga', color: 'bg-schedule-shift-fo' },
  { code: 'U', name: 'Jornada U', startTime: '17:10', endTime: '23:30', color: 'bg-schedule-shift-u' },
  { code: 'V', name: 'Jornada V', startTime: '13:45', endTime: '20:05', color: 'bg-schedule-shift-v' },
  { code: 'Fe', name: 'Férias', color: 'bg-schedule-shift-v' },
  { code: 'Af', name: 'Afastada', color: 'bg-schedule-shift-v' },
];

// List of employees
export const employees: Employee[] = [
  { id: 1, name: 'User1', defaultShiftCode: 'B', isActive: true },
  { id: 2, name: 'User2', defaultShiftCode: 'A', isActive: true },
  { id: 3, name: 'User3', defaultShiftCode: 'A', isActive: true },
  { id: 4, name: 'User4', defaultShiftCode: 'A', isActive: true },
  { id: 5, name: 'User5', defaultShiftCode: 'A', isActive: true },
  { id: 6, name: 'User6', defaultShiftCode: 'A', isActive: true },
  { id: 7, name: 'User7', defaultShiftCode: 'A', isActive: true },
];

// Helper function to create dates for a month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

// Generate mock schedule data for December 2024
export const generateMockSchedule = (year: number = 2024, month: number = 12): EmployeeSchedule[] => {
  const daysInMonth = getDaysInMonth(year, month);
  const schedules: EmployeeSchedule[] = [];

  employees.forEach((employee) => {
    const days: { [key: string]: string } = {};
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
      const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      // Assign shifts based on patterns
      if (dayOfWeek === 0) { // Sunday
        days[dateString] = 'DSR'; // Rest day on Sundays
      } else if (dayOfWeek === 6) { // Saturday
        days[dateString] = Math.random() > 0.7 ? 'F' : employee.defaultShiftCode; // 70% chance of being off
      } else if (day >= 24 && day <= 26) { // Christmas period
        days[dateString] = Math.random() > 0.5 ? 'F' : employee.defaultShiftCode; // 50% chance of being off
      } else {
        // Normal workdays
        if (Math.random() > 0.9) { // 10% chance of something different
          const options = ['F', 'U', 'Fo'];
          days[dateString] = options[Math.floor(Math.random() * options.length)];
        } else {
          days[dateString] = employee.defaultShiftCode;
        }
      }

      // Some employees on vacation in December
      if ((employee.id % 10 === 0) && day >= 15 && day <= 31) {
        days[dateString] = 'V';
      }
    }

    schedules.push({
      employeeId: employee.id,
      employeeName: employee.name,
      days
    });
  });

  return schedules;
};

// Generate mock notifications
export const generateMockNotifications = (): Notification[] => {
  return [
    {
      id: 1,
      type: 'consecutive_sundays',
      message: 'User1 está escalado para dois domingos consecutivos',
      details: 'Domingos 08/12 e 15/12',
      createdAt: '2024-12-01T10:30:00',
      resolved: false
    },
    {
      id: 2,
      type: 'single_employee_shift',
      message: 'Apenas uma pessoa escalada no turno A no dia 24/12',
      details: 'Verificar se é suficiente para a demanda',
      createdAt: '2024-12-10T15:45:00',
      resolved: false
    },
    {
      id: 3,
      type: 'consecutive_absences',
      message: 'User3 com 3 faltas consecutivas',
      details: 'Dias 05/12, 06/12 e 07/12',
      createdAt: '2024-12-07T09:15:00',
      resolved: true
    },
  ];
};

// Export all mock data in one object
export const getMockData = (): ScheduleData => {
  return {
    employees,
    schedules: generateMockSchedule(),
    shiftCodes,
  };
};

export const getMockNotifications = (): Notification[] => {
  return generateMockNotifications();
};
