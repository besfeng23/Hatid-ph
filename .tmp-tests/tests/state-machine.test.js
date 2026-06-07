"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const state_machine_1 = require("../src/lib/trips/state-machine");
(0, node_test_1.default)('valid trip status transitions are allowed', () => {
    strict_1.default.equal((0, state_machine_1.canTransitionTripStatus)('draft', 'quoted'), true);
    strict_1.default.equal((0, state_machine_1.canTransitionTripStatus)('quoted', 'searching'), true);
    strict_1.default.equal((0, state_machine_1.canTransitionTripStatus)('searching', 'matched'), true);
    strict_1.default.equal((0, state_machine_1.canTransitionTripStatus)('matched', 'driver_assigned'), true);
    strict_1.default.equal((0, state_machine_1.canTransitionTripStatus)('driver_assigned', 'driver_arriving'), true);
    strict_1.default.equal((0, state_machine_1.canTransitionTripStatus)('arrived', 'in_progress'), true);
    strict_1.default.equal((0, state_machine_1.canTransitionTripStatus)('in_progress', 'completed'), true);
});
(0, node_test_1.default)('invalid trip status transitions are rejected', () => {
    strict_1.default.equal((0, state_machine_1.canTransitionTripStatus)('searching', 'completed'), false);
    strict_1.default.equal((0, state_machine_1.canTransitionTripStatus)('draft', 'completed'), false);
    strict_1.default.throws(() => (0, state_machine_1.assertTripStatusTransition)('searching', 'completed'));
    strict_1.default.throws(() => (0, state_machine_1.assertTripStatusTransition)('draft', 'completed'));
});
(0, node_test_1.default)('terminal trip status helper identifies terminal and non-terminal statuses', () => {
    strict_1.default.equal((0, state_machine_1.isTerminalTripStatus)('expired'), true);
    strict_1.default.equal((0, state_machine_1.isTerminalTripStatus)('refunded'), true);
    strict_1.default.equal((0, state_machine_1.isTerminalTripStatus)('completed'), false);
});
(0, node_test_1.default)('allowed transition helper returns expected values', () => {
    strict_1.default.deepEqual((0, state_machine_1.getAllowedTripStatusTransitions)('quoted'), [
        'searching',
        'expired',
        'cancelled_by_rider',
    ]);
    strict_1.default.deepEqual((0, state_machine_1.getAllowedTripStatusTransitions)('completed'), [
        'disputed',
        'refunded',
    ]);
});
