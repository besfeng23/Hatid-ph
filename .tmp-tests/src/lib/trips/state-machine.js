"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTripStatusTransitionError = void 0;
exports.getAllowedTripStatusTransitions = getAllowedTripStatusTransitions;
exports.canTransitionTripStatus = canTransitionTripStatus;
exports.assertTripStatusTransition = assertTripStatusTransition;
exports.isTerminalTripStatus = isTerminalTripStatus;
const types_1 = require("./types");
const ALLOWED_TRIP_STATUS_TRANSITIONS = {
    draft: ['quoted', 'expired', 'cancelled_by_rider'],
    quoted: ['searching', 'expired', 'cancelled_by_rider'],
    searching: ['matched', 'expired', 'cancelled_by_rider'],
    matched: ['driver_assigned', 'expired', 'cancelled_by_rider'],
    driver_assigned: [
        'driver_arriving',
        'cancelled_by_rider',
        'cancelled_by_driver',
        'expired',
    ],
    driver_arriving: [
        'arrived',
        'cancelled_by_rider',
        'cancelled_by_driver',
        'disputed',
    ],
    arrived: [
        'in_progress',
        'no_show',
        'cancelled_by_rider',
        'cancelled_by_driver',
        'disputed',
    ],
    in_progress: ['completed', 'disputed'],
    completed: ['disputed', 'refunded'],
    cancelled_by_rider: ['disputed', 'refunded'],
    cancelled_by_driver: ['disputed', 'refunded'],
    no_show: ['disputed', 'refunded'],
    expired: [],
    disputed: ['refunded'],
    refunded: [],
};
class InvalidTripStatusTransitionError extends Error {
    constructor(from, to) {
        super(`Invalid trip status transition: ${from} -> ${to}`);
        this.name = 'InvalidTripStatusTransitionError';
    }
}
exports.InvalidTripStatusTransitionError = InvalidTripStatusTransitionError;
function getAllowedTripStatusTransitions(status) {
    return ALLOWED_TRIP_STATUS_TRANSITIONS[status];
}
function canTransitionTripStatus(from, to) {
    return ALLOWED_TRIP_STATUS_TRANSITIONS[from].includes(to);
}
function assertTripStatusTransition(from, to) {
    if (!canTransitionTripStatus(from, to)) {
        throw new InvalidTripStatusTransitionError(from, to);
    }
}
function isTerminalTripStatus(status) {
    return types_1.TERMINAL_TRIP_STATUSES.includes(status);
}
