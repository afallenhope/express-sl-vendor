class DateHelper {
    // Convert the date to UTC without changing the actual time representation
    static toUTC(date: Date): Date {
        return new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ));
    }

    // General method to get the difference in milliseconds (both dates are treated as UTC)
    static dateDiffInMilliseconds(dateA: Date, dateB: Date): number {
        const utcDateA = this.toUTC(dateA);  // Ensure dateA is in UTC
        const utcDateB = this.toUTC(dateB);  // Ensure dateB is in UTC
        return Math.abs(utcDateB.getTime() - utcDateA.getTime()); // Use absolute to ensure positive difference
    }

    static dateDiffInSeconds(dateA: Date, dateB: Date): number {
        return Math.floor(this.dateDiffInMilliseconds(dateA, dateB) / 1000);
    }

    static dateDiffInMinutes(dateA: Date, dateB: Date): number {
        return Math.floor(this.dateDiffInMilliseconds(dateA, dateB) / (1000 * 60));
    }

    static dateDiffInHours(dateA: Date, dateB: Date): number {
        return Math.floor(this.dateDiffInMilliseconds(dateA, dateB) / (1000 * 60 * 60));
    }

    static dateDiffInDays(dateA: Date, dateB: Date): number {
        return Math.floor(this.dateDiffInMilliseconds(dateA, dateB) / (1000 * 60 * 60 * 24));
    }

    // Method to check if dates are within a specific unit (seconds, minutes, hours, etc.)
    static areDatesWithin(dateA: Date, dateB: Date, value: number, unit: "seconds" | "minutes" | "hours" | "days"): boolean {
        switch (unit) {
            case "seconds":
                return this.dateDiffInSeconds(dateA, dateB) <= value;
            case "minutes":
                return this.dateDiffInMinutes(dateA, dateB) <= value;
            case "hours":
                return this.dateDiffInHours(dateA, dateB) <= value;
            case "days":
                return this.dateDiffInDays(dateA, dateB) <= value;
            default:
                return false;
        }
    }
}

export default DateHelper;

