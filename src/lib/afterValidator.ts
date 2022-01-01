import moment from "moment";
import getRelativeToDate from "./utils/getRelativeToDate";
import isValidUnit from "./utils/isValidUnit";

function getAfterValidator(relativeTo){
    return {
        alias: 'greaterThan',
        method(value, unit) {
            return this.$_addRule({ name: 'after', args: { value, unit } });
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
            const mustBeAfterThan = getRelativeToDate(relativeTo).add(args.value, args.unit);
            const toValidate = moment(value);

            if (!toValidate.isAfter(mustBeAfterThan)) {
                return helpers.error('relateiveDate.after', {
                    days: args.days,
                    from: getRelativeToDate(relativeTo).format('DD-MM-YYYY'),
                });
            }
        },
    }
}

export default getAfterValidator;