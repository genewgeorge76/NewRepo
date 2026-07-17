/**
 * JWORDENAI Iron Matrix
 * Tracks Machine Health Surcharge funds and predictive maintenance for the 50-state fleet.
 */
export const ironMatrix = {
    fleet: [
        { id: "Mauldin-690-TX", location: "Dallas, TX", status: "ACTIVE", hoursUntilService: 42, accruedSurcharge: 14500.00 },
        { id: "LeeBoy-8520-VA", location: "Chester, VA", status: "MAINTENANCE_REQUIRED", hoursUntilService: -5, accruedSurcharge: 8200.50 }
    ],
    getFleetStatus: function() {
        return this.fleet.map(machine => {
            if (machine.hoursUntilService <= 0) {
                return `[CRITICAL]: ${machine.id} requires immediate service. $${machine.accruedSurcharge} available in Health Fund.`;
            }
            return `${machine.id} (${machine.location}) - Nominal. ${machine.hoursUntilService}h to service.`;
        });
    }
};
