import moment from "moment";
import getRelativeToDate from "./utils/getRelativeToDate";
import isValidUnit from "./utils/isValidUnit";

function getWithinValidator(relativeTo) {
    return {
        method(value, unit) {
            return this.$_addRule({ name: 'within', args: { value, unit } });
        },
        args: [
            {
                name: 'value',
                ref: true,
                assert: (value) => typeof value === 'number' && !isNaN(value),
                message: 'must be a number',
            },
            {
                name: 'unit',
                assert: (unit) => isValidUnit(unit),
                message: 'must be a valid date unit',
            },
        ],
        validate(value, helpers, args, options) {
            const mustBeBeforeThan = getRelativeToDate(relativeTo).add(args.value, args.unit);
            const toValidate = moment(value);
            if (!toValidate.isBefore(mustBeBeforeThan)) {
                return helpers.error('relateiveDate.within', {
                    value: args.value,
                    unit: moment.normalizeUnits(args.unit),
                    from: getRelativeToDate(relativeTo).format('DD-MM-YYYY'),
                });
            }
        }
    }
}

export default getWithinValidator;