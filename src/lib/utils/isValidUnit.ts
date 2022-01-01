import VALID_MOMENT_UNIT from "./date_units.constant";

function isValidUnit(unit: string): boolean {
    return VALID_MOMENT_UNIT.includes(unit);
}

export default isValidUnit;